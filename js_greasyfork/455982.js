// ==UserScript==
// @name         颜色回来-让黑白灰的颜色恢复正常
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  由于众所周知的情况，一些网页变成灰白色影响视觉体验，现决定恢复其原有颜色，没有任何立场，仅为技术测试，目前只支持百度和b站，如有需要，会继续增加更多网站
// @author       Lspwang
// @match        *://*.bilibili.com/*
// @match        *://*.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/455982/%E9%A2%9C%E8%89%B2%E5%9B%9E%E6%9D%A5-%E8%AE%A9%E9%BB%91%E7%99%BD%E7%81%B0%E7%9A%84%E9%A2%9C%E8%89%B2%E6%81%A2%E5%A4%8D%E6%AD%A3%E5%B8%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/455982/%E9%A2%9C%E8%89%B2%E5%9B%9E%E6%9D%A5-%E8%AE%A9%E9%BB%91%E7%99%BD%E7%81%B0%E7%9A%84%E9%A2%9C%E8%89%B2%E6%81%A2%E5%A4%8D%E6%AD%A3%E5%B8%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByTagName("HTML")[0].className=document.getElementsByTagName("HTML")[0].className.replace("gray","");//b站
    document.body.className=document.body.className.replace("big-event-gray","");//baidu

})();