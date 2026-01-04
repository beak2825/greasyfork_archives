// ==UserScript==
// @name         bilibili 去除灰色色调
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除页面灰色色调
// @author       
// @match        https://www.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455892/bilibili%20%E5%8E%BB%E9%99%A4%E7%81%B0%E8%89%B2%E8%89%B2%E8%B0%83.user.js
// @updateURL https://update.greasyfork.org/scripts/455892/bilibili%20%E5%8E%BB%E9%99%A4%E7%81%B0%E8%89%B2%E8%89%B2%E8%B0%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('html').classList.remove('gray')
})();