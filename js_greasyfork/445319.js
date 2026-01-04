// ==UserScript==
// @name        钻石库存Hook
// @namespace   ppk script 
// @match       http://www.btgia.com/Clients/Page/Diamond
// @grant       none
// @require     https://unpkg.com/ajax-hook@2.0.9/dist/ajaxhook.min.js
// @version     1.0.1
// @author      PythonK
// @description 2022/5/21下午3:44:04
// @downloadURL https://update.greasyfork.org/scripts/445319/%E9%92%BB%E7%9F%B3%E5%BA%93%E5%AD%98Hook.user.js
// @updateURL https://update.greasyfork.org/scripts/445319/%E9%92%BB%E7%9F%B3%E5%BA%93%E5%AD%98Hook.meta.js
// ==/UserScript==

// Intercepting browser's http requests which made by XMLHttpRequest.
// https://github.com/wendux/Ajax-hook 

ah.proxy(
  {
    onRequest: (config, handler) => {
        // console.log(config.url)
        handler.next(config);
    },
    //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError: (err, handler) => {
        // console.log(err.type)
        handler.next(err)
    },
    //请求成功后进入
    onResponse: (response, handler) => {
      // console.log(response.config.url === location.href , response.config.url .indexOf('DiamondBusiness/Diamond/Index') , response.config.url .includes('DiamondBusiness/Diamond/Index')   )  
      // http://www.btgia.com/DiamondBusiness/Diamond/Index?_Terminal=1&token= 
      if ( response.config.url === location.href ) {
          handler.reject({
              config: response.config,
              type: 'error'
          })
      }
      else if ( response.config.url.includes('DiamondBusiness/Diamond/Index') ) {
        let res = JSON.parse(response.response) ;
        let pusharr =  JSON.stringify ([
            {field: "ReportNo1", title: "证书号", width: "70"},
            {field: "Location", title: "地点", width: "40"}, 
            {field: "AllDiscount", title: "退点", sort: true, style: "color: red;", width: "70"}
          ]);
        if ( res.cols !== null ){
          res.cols.splice(17,0, ...JSON.parse(pusharr)   )
          /* res.cols .push(   ...JSON.parse(pusharr)  );*/
          delete res.cols  ["2"] ; 
          res.cols.sort();
          console.log( response.config.url  )
          console.log( res.cols  )
          response.response= JSON.stringify(res) ;
        }
         handler.next( response )
      } else {
          handler.next(response)
      }
       
    }
  }
)



/*
https://segmentfault.com/a/1190000038328999


// ==UserScript==
// @name         BoSSCookie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       挖掘机小王子 微信:EnjoyByte
// @match        https://www.zhipin.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
    console.log(document.cookie)
    GM_xmlhttpRequest({
        method: "POST",
        url: 'http://127.0.0.1:7890/cookie',
        data: JSON.stringify(document.cookie),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        onload: function(res){
            if(res.status === 200){
                console.log('Cookie发送成功')
            }else{
                console.log('Cookie发送失败')
                console.log(res)
            }
        },
        onerror : function(err){
            console.log('发生error')
            console.log(err)
        }
})
})();



// ==UserScript==
// @name         药监局列表页数据采集 
// @namespace    http://tampermonkey.net/
// @version      0.3.7.4
// @description  通过油猴触发网站的点击等事件
// @author       挖掘机小王子
// @match        http://app1.sfda.gov.cn/datasearchcnda/face3/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // 触发请求
    function triggerRequest() {

        // 点击
        var interval = null
        var response = null
        interval = setInterval(function () {
            parseResponse() // 获取响应并且发出到Redis
            // 检测是否需要翻页
            if (startPage <= endPage){
                devPage(startPage++) // 翻页
            }
            else {
                clearInterval(interval) // 结束
            }
        }, 500);

    }
    // 响应解析
    function parseResponse(){
        var res = null
        res = document.querySelectorAll('tbody tr p a').forEach((item)=>{httpPost('http://127.0.0.1:8883/ajaxHook', item.href)});
    }
    // 发出响应
    function httpPost(url, data) {
        fetch(url, {
            method: 'POST',
            mode: "cors",
            body: data
        });
    };
    var scope = '';
    scope = prompt('请输入采集的页数范围，示例格式：100-200')
    var startPage = parseInt(scope.split('-')[0]) // 开始页数
    var endPage = parseInt(scope.split('-')[1]) // 结束页数
    // 执行触发
    triggerRequest()
})();




// ==UserScript==
// @name         药监局Hook6SQk6G2z
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       对浏览器发送来的数据的转发，将该数据转发到Redis数据库 挖掘机小王子 微信：EnjoyByte
// @match        http://app1.nmpa.gov.cn/data_nmpa/face3/*
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    // WebSockets
    var ws = new WebSocket("ws://127.0.0.1:8765");
    // 客户端连接服务成功时触发
    ws.onopen = function() {
        console.log('客户端已连接！');
        ws.send("客户端已连接！")
    }
    // 服务端发送消息过来触发
    ws.onmessage = function(evt){
        console.log('服务端信息:', evt.data)
    }
    // 客户端关闭触发
    ws.onclose = function(){
        console.log('客户端关闭！')
        clearInterval(intervalid)
    }
    // 客户端出错触发
    ws.onerror = function(evt){
        console.log("触发失败:", evt)
    }
    // Hook Url
    var open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function open(method, url) {
        // Hook URL
        console.log(url)
        ws.send(JSON.stringify({"url": url}))
    };
    // 不断触发下一页事件的请求
    var intervalid = setInterval('devPage(2);', 500)
})();

#外部 WebSocket
import asyncio
import websockets
from redis import StrictRedis


class WsServer:

    def __init__(self, redis_host='127.0.0.1', redis_port=6379):
        self.redis_cli = StrictRedis(
            host=redis_host,
            port=redis_port,
            decode_responses=True
        )

    #  WebSocket 服务
    async def server(self, websocket, path):
        while True:
            url_cookie_form_data = await websocket.recv()  # 不断获取浏览器数据
            print(url_cookie_form_data)
            if 'http:' in url_cookie_form_data:
                self.redis_cli.lpush("nmpa:urls", url_cookie_form_data)

if __name__ == '__main__':
    wsserver = WsServer()
    start_server = websockets.serve(wsserver.server, "127.0.0.1", 8765)
    asyncio.get_event_loop().run_until_complete(start_server)
    asyncio.get_event_loop().run_forever()

*/