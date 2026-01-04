// ==UserScript==
// @name         草榴社区 m3u8 链接获取test
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  获取草榴社区 m3u8 链接
// @author       FFFFFFeng
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @include      /^https://cl.+\..*$/
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/440862/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%20m3u8%20%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96test.user.js
// @updateURL https://update.greasyfork.org/scripts/440862/%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%20m3u8%20%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96test.meta.js
// ==/UserScript==

(function() {
    'use strict';
class XMLHttp {
        request = function (param) {};
        response = function (param) {};
      }
      let http = new XMLHttp();
	// 初始化 拦截XMLHttpRequest
	function initXMLHttpRequest() {
        let open = XMLHttpRequest.prototype.open;
          XMLHttpRequest.prototype.open = function(...args){
            let send = this.send;
            let _this = this
            let post_data = []
            this.send = function (...data) {
              post_data = data;
              return send.apply(_this, data)
            }
            // 请求前拦截
            http.request(args)

            this.addEventListener('readystatechange', function () {
              if (this.readyState === 4) {
                let config = {
                  url: args[1],
                  status: this.status,
                  method: args[0],
                  data: post_data
                }
                // 请求后拦截
                
                http.response({config, response: this.response})
              }
            }, false)
            return open.apply(this, args);
          }
      }

 	// 初始化页面
	// XMLHttpRequest 拦截
        http.request = function (param) {
           if (/.*\.m3u8/g.test(param[1])) {
               console.log(param, "---request");
               let button = document.createElement("div")
               button.setAttribute("style","margin-left:30px;font-size:12px;line-height:32px;text-align:center;cursor:pointer;padding:0 10px;height:32px;color:white;border-radius:32px;background-color:#990033")
               button.innerHTML = "点击提取"
               if (document.querySelectorAll(".vp-bottom")[0]) {
                   document.querySelectorAll(".vp-bottom")[0].appendChild(button)
                   button.addEventListener("click", function() {
                       let input = document.createElement("input")
                       input.setAttribute("type","text")
                       input.setAttribute("value",param[1])
                       input.setAttribute("style","position:absolute;left:0;top:0;z-Index:-1;")
                       document.querySelectorAll(".vp-bottom")[0].appendChild(input)
                       input.select();
                       document.execCommand("copy");
                       button.innerHTML = "复制成功"
                       setTimeout(function(){
                           button.innerHTML = "点击提取"
                       },2000)
                   })
               }
               //document.querySelectorAll("#vediobox")[0].appendChild(button)
               //console.log(document.querySelectorAll(".video-playbox")[0])
               
           }
        };
        http.response = function (res) {
            //console.log(res, "---response");
        }
        // 初始化 XMLHttpRequest
        initXMLHttpRequest();
        // 模拟数据请求 （此处写自己要使用的请求）
        // request();

//————————————————

})();