// ==UserScript==
// @name         Twitter / X.com Max-Width Modifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Image max width on timeline is changed to be larger, so you don't have the stupid gap on the right of 90% of pictures on Twitter/X 
// @author       @okitafan
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532412/Twitter%20%20Xcom%20Max-Width%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/532412/Twitter%20%20Xcom%20Max-Width%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace max-width values
    function updateMaxWidths() {
        // Select all elements with style attribute containing max-width: 300px
        const elements = document.querySelectorAll('[style*="max-width: 300px"]');

        // Loop through elements and update their style
        elements.forEach(element => {
            const currentStyle = element.getAttribute('style');
            if (currentStyle && currentStyle.includes('max-width: 300px')) {
                const newStyle = currentStyle.replace('max-width: 300px', 'max-width: 450px');
                element.setAttribute('style', newStyle);
            }
        });
    }

    // Create an observer to watch for DOM changes (for infinite scrolling)
    const observer = new MutationObserver(function(mutations) {
        updateMaxWidths();
    });

    // Start observing when the DOM is ready
    function startObserving() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(targetNode, config);

        // Run initial update
        updateMaxWidths();
    }

    // Run when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserving);
    } else {
        startObserving();
    }
})();