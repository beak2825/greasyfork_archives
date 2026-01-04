// ==UserScript==
// @name         video watch
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  watch something
// @author       You
// @match        https://qqww079.com/*
// @match        https://qqww080.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://unpkg.com/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448058/video%20watch.user.js
// @updateURL https://update.greasyfork.org/scripts/448058/video%20watch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    ah.proxy({
    //请求发起前进入
    onRequest: (config, handler) => {
        //console.log(config.url)
        handler.next(config);
    },
    //请求发生错误时进入，比如超时；注意，不包括http状态码错误，如404仍然会认为请求成功
    onError: (err, handler) => {
        console.log(err.type)
        handler.next(err)
    },
    //请求成功后进入
    onResponse: (response, handler) => {
        var url = response.config.url;
        if(url.indexOf("queryVideoById")>0){
           var a = JSON.parse(response.response);
           a.data.video.isPlay=1
           response.response = JSON.stringify(a)      
        }
        handler.next(response)
    }
})
})();