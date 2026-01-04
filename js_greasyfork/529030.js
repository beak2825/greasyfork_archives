// ==UserScript==
// @name         Kagi Assistant Auto-Scroll
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically scroll down when new content is added to Kagi Assistant
// @author       You
// @match        *://kagi.com/assistant*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529030/Kagi%20Assistant%20Auto-Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/529030/Kagi%20Assistant%20Auto-Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // The main container that holds the chat messages
    const targetSelector = '.main-center-box';

    // Function to scroll to bottom
    function scrollToBottom() {
        const container = document.querySelector(targetSelector);
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }

    // Set up a mutation observer to watch for changes
    const observer = new MutationObserver((mutations) => {
        let shouldScroll = false;

        // Check if content was added
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldScroll = true;
            } else if (mutation.type === 'characterData') {
                shouldScroll = true;
            }
        });

        if (shouldScroll) {
            scrollToBottom();
        }
    });

    // Function to initialize the observer when the target element exists
    function initObserver() {
        const target = document.querySelector(targetSelector);
        if (target) {
            observer.observe(target, {
                childList: true,
                subtree: true,
                characterData: true
            });
            console.log('Kagi Assistant Auto-Scroll: Observer initialized');

            // Initial scroll to bottom
            scrollToBottom();
        } else {
            // If target doesn't exist yet, try again shortly
            setTimeout(initObserver, 1000);
        }
    }

    // Start the initialization process
    initObserver();

    // Also scroll on window resize
    window.addEventListener('resize', scrollToBottom);
})();
