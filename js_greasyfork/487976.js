// ==UserScript==
// @name         请求拦截并显示返回数据
// @namespace    
// @version      202402221135
// @description  请求显示方法、地址、数据web开发模式下调试使用
// @author       ghost
// @match        http://*/*
// @icon         
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487976/%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%E5%B9%B6%E6%98%BE%E7%A4%BA%E8%BF%94%E5%9B%9E%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/487976/%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%E5%B9%B6%E6%98%BE%E7%A4%BA%E8%BF%94%E5%9B%9E%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;

    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    XHR.send = function (postData) {
        this.addEventListener('load', function () {
            var obj = {
               method: this._method,
               requestUrl: this._url,
               status: this.status,
               timeout: this.timeout
            }
            if(this._method === 'POST'){
                obj.postData = postData
            }else{
                obj.getData = this._url.substr(this._url.indexOf('?')+1, this._url.length).replaceAll("&", " ")
            }
            console.table(obj);
            console.log(`%c${this._url}`, 'color:red');
            console.log('%creturn value', 'color:blue', JSON.parse(this.response))
        });
        return send.apply(this, arguments);
    };
})();
