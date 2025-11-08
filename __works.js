addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  // 配置路由映射：键为访问路径（无后缀，如/yl），值为对应的JSON数据源URL
  const ROUTE_CONFIG = {
    '/ylkjhbty': 'https://githup.822125.xyz/https://raw.githubusercontent.com/yilongym/tvboxapi01/refs/heads/main/ylkjhbty.json',
    '/R18jia': 'https://githup.822125.xyz/https://raw.githubusercontent.com/yilongym/TVBox/refs/heads/main/R18.json', // 示例第二个数据源
    '/qiaoji': 'https://githup.822125.xyz/https://raw.githubusercontent.com/yilongym/tvboxapi01/refs/heads/main/%E5%B7%A7%E8%AE%B0.js' // 可继续添加更多
  }
  
  async function handleRequest(request) {
    const url = new URL(request.url)
    const path = url.pathname // 获取访问路径（如/yl、/tv）
    
    // 检查路径是否在配置中
    const targetJsonUrl = ROUTE_CONFIG[path]
    if (!targetJsonUrl) {
      // 路径未匹配时返回404
      return new Response(JSON.stringify({ error: '路径不存在' }, null, 2), {
        status: 404,
        headers: {
          'Content-Type': 'application/json; charset=utf-8', // 强制标识为JSON类型
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
    
    try {
      // 请求对应的数据源
      const response = await fetch(targetJsonUrl)
      if (!response.ok) {
        throw new Error(`数据源请求失败: ${response.status}`)
      }
      const jsonData = await response.json()
      
      // 配置响应头（强制JSON类型，支持跨域）
      const headers = new Headers({
        'Content-Type': 'application/json; charset=utf-8', // 即使路径无后缀，也明确告知客户端是JSON
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      })
      
      // 返回对应JSON数据
      return new Response(JSON.stringify(jsonData, null, 2), {
        status: 200,
        headers: headers
      })
      
    } catch (error) {
      // 错误处理
      return new Response(JSON.stringify({
        error: '数据加载失败',
        details: error.message
      }, null, 2), {
        status: 500,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      })
    }
  }
