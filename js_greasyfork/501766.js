// ==UserScript==
// @name         恢复网盘小站的右键菜单
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除网站自带的右键菜单
// @author       Your Name
// @match        *://a.sousou.pro/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501766/%E6%81%A2%E5%A4%8D%E7%BD%91%E7%9B%98%E5%B0%8F%E7%AB%99%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/501766/%E6%81%A2%E5%A4%8D%E7%BD%91%E7%9B%98%E5%B0%8F%E7%AB%99%E7%9A%84%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 恢复浏览器默认的右键菜单行为
    document.addEventListener('contextmenu', function(event) {
        event.stopPropagation();  // 阻止事件冒泡
    }, true); // 使用捕获模式
})();