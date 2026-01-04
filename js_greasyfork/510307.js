// ==UserScript==
// @name         ChatGPT Anti-Degeneracy
// @namespace    https://1stream.icu/
// @version      2024-09-27
// @description  修改ChatGPT相关网页UA为移动端以解决模型降级问题
// @author       Yuant
// @match        *://*.openai.com/*
// @match        *://*.chatgpt.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510307/ChatGPT%20Anti-Degeneracy.user.js
// @updateURL https://update.greasyfork.org/scripts/510307/ChatGPT%20Anti-Degeneracy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Object.defineProperty(navigator,'platform',{get:function(){return 'Android';}});
    Object.defineProperty(navigator,'userAgent',{get:function(){return 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36 Edg/129.0.0.0';}});
    // Your code here...
})();