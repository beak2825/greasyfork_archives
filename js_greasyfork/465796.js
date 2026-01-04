// ==UserScript==
// @name         去除稿定设计水印
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去水印
// @author       旧人；感谢@zaqw0001提供的思路
// @match        https://www.gaoding.com/editor/design*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465796/%E5%8E%BB%E9%99%A4%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/465796/%E5%8E%BB%E9%99%A4%E7%A8%BF%E5%AE%9A%E8%AE%BE%E8%AE%A1%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    window.addEventListener('load', function() {
        const watermarkCss = document.createElement('style');
        watermarkCss.innerHTML = '.editor-watermark { z-index: -99; }';
        document.head.appendChild(watermarkCss);
    });
})();