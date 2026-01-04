// ==UserScript==
// @name         阿里法拍详情页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  info collect
// @author       You
// @match        https://sf.taobao.com/notice_detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=taobao.com
// @require      http://cdn.bootcss.com/jquery/1.11.2/jquery.js
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476674/%E9%98%BF%E9%87%8C%E6%B3%95%E6%8B%8D%E8%AF%A6%E6%83%85%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/476674/%E9%98%BF%E9%87%8C%E6%B3%95%E6%8B%8D%E8%AF%A6%E6%83%85%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var start = new Date().getTime();
    var monkey_url = 'http://127.0.0.1:8883/ajaxHook';


    elmGetter.selector($);
    elmGetter.get(['html']).then(([content]) => {
        const dataList = {
            // '网页内容': content.text()
            '网页内容': document.documentElement.outerHTML
        };
        console.log(dataList);
        var end = new Date().getTime();
        var spend_time = (end - start) / 1000;
        GM_xmlhttpRequest({
            method: "POST",
            url: monkey_url,
            data: JSON.stringify(dataList),
            onload: function (response) {
                //这里写处理函数
                console.log(response);
                console.log(dataList);
                const t3 = Date.now();
                console.log(t3 - start);
                //window.close();
            }
        });
    });


})();
