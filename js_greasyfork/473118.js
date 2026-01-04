// ==UserScript==
// @name         测试js
// @namespace
// @include      *
// @version      0.0.1
// @description  测试专用js
// @author       ymzhao
// ==/UserScript==
(function () {
    // this
    this.addEventListener('install', function (event) {
      console.log('Service Worker install');
    });
    self.addEventListener('install', event => {
      // 安装中
      
      event.waitUntil(
        // 可以预缓存重要的和长期的资源
      );
    });
    
    self.addEventListener('activate', event => {
      // 已激活，成功控制客户端
      
      // 如果activate足够快，clients.claim的调用在请求之前，就能保证第一次请求页面也能拦截请求
      clients.claim();
      
      event.waitUntil(
        // 可以在这里清除旧的缓存
      );
    });
    
    self.addEventListener('fetch', event => {
      const url = new URL(event.request.url);
      // 拦截/api/user接口的请求，返回自定义的response
      if (url.pathname == '/api/user') {
        event.respondWith(
          // response body只能接受String, FormData, Blob等类型，所以这里序列化
          new Response(JSON.stringify({ name: 'Javen' }), {
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      }
    });
})
