// ==UserScript==
// @name         b站去除视频分享按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  b站去除视频分享按钮。
// @author       Liu-jc123
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512791/b%E7%AB%99%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/512791/b%E7%AB%99%E5%8E%BB%E9%99%A4%E8%A7%86%E9%A2%91%E5%88%86%E4%BA%AB%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

('load',function() {
    'use strict';
    var elementToRemove = document.querySelector('.video-share-wrap'); 
    if (elementToRemove) {
        elementToRemove.setAttribute('style', 'display: none;');
    } else {
        console.log("Element not found.");
    }
})();