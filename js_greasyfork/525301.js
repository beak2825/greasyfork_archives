// ==UserScript==
// @name         Fix Youtube thumbnail padding for real
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Force YouTube to show 6 videos per row and fix padding
// @author       Kalakaua
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525301/Fix%20Youtube%20thumbnail%20padding%20for%20real.user.js
// @updateURL https://update.greasyfork.org/scripts/525301/Fix%20Youtube%20thumbnail%20padding%20for%20real.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject custom CSS to force 6 videos per row
    const injectCSS = () => {
        const css = `
            /* Target the correct parent container for the grid */
            ytd-rich-grid-renderer #contents.ytd-rich-grid-renderer {
                display: grid !important;
                grid-template-columns: repeat(6, minmax(0, 1fr)) !important; /* 6 columns */
                gap: 8px !important; /* Adjust the gap between thumbnails */
                padding-right: 0 !important; /* Remove any default padding */
            }

            /* Ensure each video item takes up equal space */
            ytd-rich-item-renderer {
                width: 100% !important;
                max-width: 100% !important; /* Prevent overflow */
                margin-left: 0 !important; /* Reset default margin */
            }

            /* Adjust the thumbnail image size */
            ytd-rich-grid-media #thumbnail {
                width: 100% !important;
                height: auto !important;
            }

            /* Ensure the title and metadata don't overflow */
            ytd-rich-grid-media #meta {
                max-width: 100% !important;
            }
        `;

        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    // Function to check if an element is visible
    function isVisible(el) {
        return el.offsetWidth > 0 && el.offsetHeight > 0 && window.getComputedStyle(el).visibility !== 'hidden';
    }

    // Function to update margin-left in the specified pattern
    function updateMarginLeft() {
        const elements = document.querySelectorAll('ytd-rich-item-renderer');
        let activeCount = 0;

        // Adjust the modulus value based on the number of thumbnails per row
        const thumbnailsPerRow = 6; // 6 thumbnails per row

        elements.forEach(el => {
            if (isVisible(el)) {
                el.style.marginLeft = (activeCount % thumbnailsPerRow === 0) ? '24px' : '8px';
                activeCount++;
            }
        });
    }

    // Run the CSS injection and update margins initially
    injectCSS();
    updateMarginLeft();

    // Observe changes in the DOM to reapply the CSS and margins
    const observer = new MutationObserver(() => {
        injectCSS();
        updateMarginLeft();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Also listen for page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            injectCSS();
            updateMarginLeft();
        }
    });
})();