// ==UserScript==
// @name         Bing Copilot Chat Width Wizard (style)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Designed to optimize the width of the chat window, you can enjoy the best chat experience at any screen size. This plugin provides a more intuitive and comfortable chat interface by automatically adjusting and customizing element widths.|界面优化
// @author       Bela Proinsias
// @match        https://copilot.microsoft.com/chats/*
// @match        https://copilot.microsoft.com/*
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://microsoft.co&size=64
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526967/Bing%20Copilot%20Chat%20Width%20Wizard%20%28style%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526967/Bing%20Copilot%20Chat%20Width%20Wizard%20%28style%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to adjust the width of elements with specific classes
    function adjustWidth() {
        const windowWidth = window.innerWidth;
        const adjustedWidth = windowWidth * 0.85; // if you wanna change the width, eg. 0.8, 0.9, 0.95, etc.
        const elements = document.querySelectorAll('[data-content="conversation"]');
        elements.forEach(element => {
            element.style.maxWidth = adjustedWidth + 'px';
            element.style.width = adjustedWidth + 'px';
        });
    }

    // Function to observe DOM changes
    function observeDOMChanges() {
        const observer = new MutationObserver(adjustWidth);
        const config = { childList: true, subtree: true };

        // Start observing the document body for changes
        observer.observe(document.body, config);
    }

    // Adjust width on window load and start observing DOM changes
    window.addEventListener('load', () => {
        adjustWidth();
        observeDOMChanges();
    });

    // Adjust width on window resize
    window.addEventListener('resize', adjustWidth);
})();
