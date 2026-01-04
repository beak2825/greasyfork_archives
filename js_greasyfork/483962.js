// ==UserScript==
// @name         sourse of watermark
// @namespace    http://tampermonkey.net/
// @version      2024-1-6
// @description  get off the  watermark
// @author       keir
// @match        https://shuiyuan.sjtu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sjtu.edu.cn
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483962/sourse%20of%20watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/483962/sourse%20of%20watermark.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 找到元素
var watermarkElement = document.querySelector('div[style*="position: fixed;"][style*="opacity: 0.005;"]');

// 移除元素
if (watermarkElement) {
    watermarkElement.parentNode.removeChild(watermarkElement);
}

    // Your code here...
})();