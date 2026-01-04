// ==UserScript==
// @name         js拦截全局网络请求
// @namespace    http://tampermonkey.net/
// @description  使用 ajaxhook , 拦截全局网络请求.
// @version      0.1
// @author       Plzbefat
// @match        *
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432519/js%E6%8B%A6%E6%88%AA%E5%85%A8%E5%B1%80%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/432519/js%E6%8B%A6%E6%88%AA%E5%85%A8%E5%B1%80%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82.meta.js
// ==/UserScript==

(function() {
    'use strict';
    ah.proxy({
        //请求发起前进入
        onRequest: (config, handler) => {
            console.log("发生请求,请求地址:"+config.url)
            handler.next(config);
        },
        //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
        onError: (err, handler) => {
            console.log("发生错误,错误信息:"+err.type)
            handler.next(err)
        },
        //请求成功后进入
        onResponse: (response, handler) => {
            console.log("请求成功,反馈信息:"+response.response)
            handler.next(response)
        }
    })
})();