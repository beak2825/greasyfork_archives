// ==UserScript==
// @name         LobeChat Preview Ads Remove
// @namespace    http://tampermonkey.net/
// @version      2025-02-21
// @description  LobeChat网页预览版顶部广告屏蔽，同时自动拉伸网页。
// @author       You
// @match        https://chat-preview.lobehub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @run-at       document-start
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/527573/LobeChat%20Preview%20Ads%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/527573/LobeChat%20Preview%20Ads%20Remove.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Inject CSS to hide the banner initially
    const style = document.createElement('style');
    style.textContent = `
        .layoutkit-center.css-1jnq4cl {
            display: none !important;
        }
        .layoutkit-flexbox.css-zawl66 {
            height: 100% !important;
            min-height: 100vh !important;
        }
    `;
    document.head.appendChild(style);

    // Function to adjust layout
    function adjustLayout() {
        const flexbox = document.querySelector('.layoutkit-flexbox.css-zawl66');
        if (flexbox) {
            flexbox.style.setProperty('height', '100%', 'important');
            flexbox.style.setProperty('min-height', '100vh', 'important');
        }
    }

    // Initial setup
    let attempts = 0;
    const maxAttempts = 10;
    const interval = 1000; // 1 second

    // Function to repeatedly check and adjust
    function checkAndAdjust() {
        adjustLayout();
        attempts++;

        if (attempts < maxAttempts) {
            setTimeout(checkAndAdjust, interval);
        }
    }

    // Start immediate check
    checkAndAdjust();

    // Also watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        adjustLayout();
    });

    // Start observing once DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    });

    // Handle window resize events
    window.addEventListener('resize', () => {
        adjustLayout();
    });

    // Handle dynamic content loading
    window.addEventListener('load', () => {
        adjustLayout();
    });
})();