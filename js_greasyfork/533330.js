// ==UserScript==
// @name         Naxter | Stretch Image to full page width ( Naxter.net )
// @namespace    http://naxter.net/
// @version      1.2
// @description  Stretch an image to the browser's width, ensure vertical scroll works, and reset scroll position to top on navigation. Applicable to Naxter.net
// @author       CrackerNut
// @match        *://naxter.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533330/Naxter%20%7C%20Stretch%20Image%20to%20full%20page%20width%20%28%20Naxternet%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533330/Naxter%20%7C%20Stretch%20Image%20to%20full%20page%20width%20%28%20Naxternet%20%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to apply the desired styles
    const applyStyles = () => {
        const img = document.querySelector('div[class*="chakra-stack"] img');
        if (img) {
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.maxWidth = 'none';
            img.style.maxHeight = 'none';
        }

        const container = document.querySelector('div[class*="chakra-stack"]');
        if (container) {
            container.style.overflow = 'visible';
            container.style.height = 'auto';
            container.style.maxHeight = 'none';
        }

        document.body.style.overflowY = 'scroll';
        document.body.style.height = 'auto';
        document.documentElement.style.overflowY = 'scroll';
        document.documentElement.style.height = 'auto';
    };

    // Function to reset scroll position
    const resetScrollPosition = () => {
        window.scrollTo(0, 0); // Scroll to the top of the page
    };

    // Initial application of styles
    applyStyles();

    // Set up MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                applyStyles(); // Apply styles whenever new elements are added
                resetScrollPosition(); // Reset scroll position
            }
        });
    });

    // Start observing the DOM
    observer.observe(document.body, { childList: true, subtree: true });
})();
