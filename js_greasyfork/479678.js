// ==UserScript==
// @name         移除禁用右键菜单的代码
// @namespace    http://your-namespace.com
// @version      0.1
// @description  Enable right-click on the page
// @author       You
// @match        http://*/*
// @match        file:///*
// @match        https://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479678/%E7%A7%BB%E9%99%A4%E7%A6%81%E7%94%A8%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E7%9A%84%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/479678/%E7%A7%BB%E9%99%A4%E7%A6%81%E7%94%A8%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95%E7%9A%84%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除禁用右键菜单的代码
    document.oncontextmenu = null;
})();
