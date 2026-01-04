// ==UserScript==
// @name         Enhanced Safari Input Zoom Prevention
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Prevents iOS Safari zoom on inputs while maintaining accessibility
// @author       sharmanhall
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523520/Enhanced%20Safari%20Input%20Zoom%20Prevention.user.js
// @updateURL https://update.greasyfork.org/scripts/523520/Enhanced%20Safari%20Input%20Zoom%20Prevention.meta.js
// ==/UserScript==

(function() { 
    'use strict';
    
    // Create and append meta viewport tag if it doesn't exist
    function setupViewport() {
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1';
    }

    // Apply styles that prevent zoom while maintaining readability
    function applyNoZoomStyles() {
        const style = document.createElement('style');
        style.innerHTML = `
            /* Target all form elements */
            input:not([type="button"]):not([type="submit"]):not([type="reset"]),
            textarea,
            select {
                font-size: 16px !important; /* iOS minimum font size to prevent zoom */
                max-height: none !important;
                -webkit-text-size-adjust: 100%;
                transform-origin: top left;
                transform: scale(1);
            }

            /* Ensure proper sizing for smaller screens */
            @media screen and (max-width: 768px) {
                input:not([type="button"]):not([type="submit"]):not([type="reset"]),
                textarea,
                select {
                    font-size: 16px !important;
                    line-height: normal !important;
                    padding: 0.5em !important;
                }
            }

            /* Maintain proper height for select elements */
            select {
                height: auto !important;
                padding: 0.5em !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Handle dynamically added elements
    function observeNewElements() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && // Element node
                        (node.tagName === 'INPUT' || 
                         node.tagName === 'TEXTAREA' || 
                         node.tagName === 'SELECT')) {
                        node.style.fontSize = '16px';
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize all functions
    function init() {
        setupViewport();
        applyNoZoomStyles();
        observeNewElements();
    }

    // Run on DOMContentLoaded or immediately if already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();