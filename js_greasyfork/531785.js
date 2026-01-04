// ==UserScript==
// @name         missav 移除弹窗&移除切换页面暂停
// @namespace    http://tampermonkey.net/
// @version      2025-01-14
// @description  移除missav弹窗&移除切换页面暂停 增强体验
// @author       wxm
// @match        https://missav.ws/*
// @match        https://missav.ai/*
// @icon         http://missav.ws/favicon.ico
// @grant        none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/531785/missav%20%E7%A7%BB%E9%99%A4%E5%BC%B9%E7%AA%97%E7%A7%BB%E9%99%A4%E5%88%87%E6%8D%A2%E9%A1%B5%E9%9D%A2%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/531785/missav%20%E7%A7%BB%E9%99%A4%E5%BC%B9%E7%AA%97%E7%A7%BB%E9%99%A4%E5%88%87%E6%8D%A2%E9%A1%B5%E9%9D%A2%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace the target element
    function replaceTargetDiv() {
        // Select all divs and filter those with specific attributes
        const elements = document.querySelectorAll('div');
        elements.forEach((el) => {
            if (el.hasAttribute('@click') && el.hasAttribute('@keyup.space.window')) {
                // Remove attributes
                el.removeAttribute('@click');
                el.removeAttribute('@keyup.space.window');

                // Ensure the class remains unchanged
                el.className = 'aspect-w-16 aspect-h-9';
            }
        });
    }

    function removeBlurEvent(){
        document.onblur = null;
        document.addEventListener('blur', function(e) {
            e.stopImmediatePropagation();
        }, true);

        // 移除document上的visibilitychange事件
        document.addEventListener('visibilitychange', function(e) {
            e.stopImmediatePropagation();
        }, true);

        // 移除window上的blur事件
        window.onblur = null;
        window.addEventListener('blur', function(e) {
            e.stopImmediatePropagation();
        }, true);
    }

    // Set up MutationObserver to monitor the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                replaceTargetDiv();
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial replacement (in case the element is already in the DOM)
    replaceTargetDiv();
    removeBlurEvent();
})();