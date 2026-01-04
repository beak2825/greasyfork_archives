// ==UserScript==
// @name         「Ele-Cat」免登录复制CSDN代码块
// @namespace    https://ele-cat.gitee.io/
// @version      0.0.2
// @description  略有小成-免登录复制CSDN代码块
// @author       Ele-Cat
// @match        *://*.csdn.net/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/493135/%E3%80%8CEle-Cat%E3%80%8D%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6CSDN%E4%BB%A3%E7%A0%81%E5%9D%97.user.js
// @updateURL https://update.greasyfork.org/scripts/493135/%E3%80%8CEle-Cat%E3%80%8D%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6CSDN%E4%BB%A3%E7%A0%81%E5%9D%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('main div.blog-content-box pre .hljs-button {width: auto !important;margin: 2px 2px 2px 0;}main div.blog-content-box pre .hljs-button.active {width: auto !important;margin: 2px 12px 2px 0;}')

    // 免登录复制
    $(".hljs-button").removeClass("signin");
    $(".hljs-button").attr("data-title", "免登录复制");
    $(".hljs-button").css({padding: '4px 8px'});
    $("#content_views").unbind("copy");
    // 去除剪贴板劫持
    $("code").attr("onclick", "mdcp.copyCode(event);setTimeout(function(){$('.hljs-button').attr('data-title', '免登录复制');},3000);");
    try {
        // 移除CSDN copyright信息(保留格式)
        Object.defineProperty(window, "articleType", {
            value: 0,
            writable: false,
            configurable: false
        });
    } catch (err) {
    }
    csdn.copyright.init("", "", "");
})();