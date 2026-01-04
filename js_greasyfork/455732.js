// ==UserScript==
// @name         移除b站灰色滤镜
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove bilibili gray filter
// @author       mmi
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455732/%E7%A7%BB%E9%99%A4b%E7%AB%99%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/455732/%E7%A7%BB%E9%99%A4b%E7%AB%99%E7%81%B0%E8%89%B2%E6%BB%A4%E9%95%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("html").classList.remove("gray")
    // Your code here...
})();