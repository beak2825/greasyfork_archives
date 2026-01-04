// ==UserScript==
// @name         自定义站点默认字体(Windows: Microsoft YaHei)
// @version      1.1.0
// @description  个人向
// @author       iSwfe

// 百度系
// @match        *://*.baidu.com/*

// 淘宝/天猫系
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*

// 新浪系
// @match        *://*.sina.com.cn/*

// MIUI论坛
// @match        *://*.miui.com/*

// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @namespace    https://greasyfork.org/zh-CN/users/208142-iswfe
// @downloadURL https://update.greasyfork.org/scripts/371599/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%AB%99%E7%82%B9%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%28Windows%3A%20Microsoft%20YaHei%29.user.js
// @updateURL https://update.greasyfork.org/scripts/371599/%E8%87%AA%E5%AE%9A%E4%B9%89%E7%AB%99%E7%82%B9%E9%BB%98%E8%AE%A4%E5%AD%97%E4%BD%93%28Windows%3A%20Microsoft%20YaHei%29.meta.js
// ==/UserScript==

(function() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML='*:not([class*="icon"]):not([class*="stonefont"]):not(i){font-family:PingFang SC,Consolas,Microsoft YaHei !important;}';
    //document.getElementsByTagName('HEAD').item(0).appendChild(style);
    document.documentElement.appendChild(style);
})();