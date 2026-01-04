// ==UserScript==
// @name         Bilibili解除文章复制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Bilibili解除文章复制限制
// @author       DLHTX
// @match        https://www.bilibili.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415612/Bilibili%E8%A7%A3%E9%99%A4%E6%96%87%E7%AB%A0%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/415612/Bilibili%E8%A7%A3%E9%99%A4%E6%96%87%E7%AB%A0%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("article-holder")[0].style.userSelect = "text"
    // Your code here...
})();