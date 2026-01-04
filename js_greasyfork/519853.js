// ==UserScript==
// @name         移除 B 站直播透明水印
// @namespace    com.bilibili.live.script
// @version      1.0
// @description  B 站直播有时会在右上角出现透明水印遮挡屏蔽，这个脚本用来去除它。由 ChatGPT 生成。
// @match        *://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=live.bilibili.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/519853/%E7%A7%BB%E9%99%A4%20B%20%E7%AB%99%E7%9B%B4%E6%92%AD%E9%80%8F%E6%98%8E%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/519853/%E7%A7%BB%E9%99%A4%20B%20%E7%AB%99%E7%9B%B4%E6%92%AD%E9%80%8F%E6%98%8E%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements with class "web-player-module-area-mask"
    function removeMaskElements() {
        // Select all elements with the specific class
        const maskElements = document.querySelectorAll('.web-player-module-area-mask');
        maskElements.forEach(element => {
            console.log('Removing element:', element);
            element.remove();
        });
    }

    // Run the function when the page is loaded
    window.addEventListener('load', removeMaskElements);

    // Observe changes in the DOM to handle dynamically loaded content
    const observer = new MutationObserver(() => {
        removeMaskElements();
    });

    // Start observing the document body
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
