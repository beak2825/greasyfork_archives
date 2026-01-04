// ==UserScript==
// @name         摸鱼奎恩直播间关闭橱窗
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  关闭摸鱼奎恩直播间橱窗黑条
// @author       acpass
// @match        https://live.douyin.com/200525029536/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495049/%E6%91%B8%E9%B1%BC%E5%A5%8E%E6%81%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E5%85%B3%E9%97%AD%E6%A9%B1%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/495049/%E6%91%B8%E9%B1%BC%E5%A5%8E%E6%81%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E5%85%B3%E9%97%AD%E6%A9%B1%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyElementsByStyleAndHideById() {
        // Remove style attribute from div elements with a specific style but different class names
        const divElements = document.querySelectorAll('div[style="margin-right: 120px;"]');
        if (divElements.length > 0) {
            divElements.forEach((div) => {
                if (div.hasAttribute('style')) {
                    div.removeAttribute('style');
                    console.log('Style attribute removed from a div element.');
                }
            });
        } else {
            console.log('No div elements with the specified style found.');
        }

        // Hide the specified div by ID
        const targetDiv = document.getElementById('__living_frame_right_panel_id');
        if (targetDiv) {
            targetDiv.style.display = 'none';
            console.log('Target div is hidden by ID.');
        } else {
            console.log('Target div not found by ID.');
        }
    }

    // Run the function after the page loads
    window.addEventListener('load', modifyElementsByStyleAndHideById);

    // Optional: if the target divs are dynamically loaded, you might need to use a MutationObserver to watch for changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                modifyElementsByStyleAndHideById();
            }
        });
    });

    // Observe changes in the document
    observer.observe(document.body, { childList: true, subtree: true });
})();
