// ==UserScript==
// @name         解决草榴社区(1024) 去广告后隐藏内容的问题
// @namespace    http://zhouyang.cool/
// @version      0.1
// @description  解除草榴广告拦截后的十秒限制 
// @match       *://*.t66y.com/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/483087/%E8%A7%A3%E5%86%B3%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%281024%29%20%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%90%8E%E9%9A%90%E8%97%8F%E5%86%85%E5%AE%B9%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/483087/%E8%A7%A3%E5%86%B3%E8%8D%89%E6%A6%B4%E7%A4%BE%E5%8C%BA%281024%29%20%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%90%8E%E9%9A%90%E8%97%8F%E5%86%85%E5%AE%B9%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store the original setTimeout function
    const nativeSetTimeout = window.setTimeout;

    // Override the setTimeout function
    window.setTimeout = function(callback, delay, ...args) {
        // Modify the delay to be 100 times faster
        let modifiedDelay = delay / 100;

        // Call the original setTimeout with modified delay
        return nativeSetTimeout(callback, modifiedDelay, ...args);
    };
})();