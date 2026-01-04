// ==UserScript==
// @name         Lazy Load Image
// @namespace    lazy-load-image
// @version      2025-01-06
// @description  Apply lazy loading to all images.
// @author       Ace
// @run-at       document-end
// @match        *://*/*
// @icon         https://cdn-icons-png.flaticon.com/512/13159/13159509.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523040/Lazy%20Load%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/523040/Lazy%20Load%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug mode: Set to true to enable logs
    const DEBUG = false;

    // Debug logging function
    const log = (...args) => {
        if (DEBUG) {
            console.log('[LazyLoadImage]', ...args);
        }
    };

    log('Script started');

    // Process existing images
    document.querySelectorAll('img').forEach(img => {
        if (!img.loading || img.loading !== 'lazy') {
            img.loading = 'lazy';
            log('Processed existing img:', img.src);
        }
    });

    // Debouncing logic with requestAnimationFrame
    let imgQueue = [];
    let isScheduled = false;

    const processQueue = () => {
        log('Processing queued images:', imgQueue.length);
        imgQueue.forEach(img => {
            if (!img.loading || img.loading !== 'lazy') {
                img.loading = 'lazy'; // Apply lazy loading
                log('Applied lazy loading to new img:', img.src);
            }
        });
        imgQueue = []; // Clear the queue
        isScheduled = false; // Allow new frame scheduling
    };

    // Observe dynamically added images
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.tagName === 'IMG') {
                    imgQueue.push(node); // Add image to the queue
                    log('New img detected:', node.src || 'No src');
                }
            });
        });

        // Schedule processing for the next frame if not already scheduled
        if (!isScheduled && imgQueue.length > 0) {
            isScheduled = true;
            requestAnimationFrame(processQueue);
            log('Scheduled processing for next frame');
        }
    });

    // Start observing the DOM
    observer.observe(document.body, { childList: true, subtree: true });
    log('MutationObserver started');

})();
