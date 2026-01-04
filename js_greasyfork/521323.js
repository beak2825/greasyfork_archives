// ==UserScript==
// @name         Style Changes for Capacities.io
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Remove specific elements and change styles on Capacities.io
// @author       You
// @match        *://*.capacities.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521323/Style%20Changes%20for%20Capacitiesio.user.js
// @updateURL https://update.greasyfork.org/scripts/521323/Style%20Changes%20for%20Capacitiesio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to remove elements matching specific classes
    function removeElements() {
        const elements = document.querySelectorAll(
            'span.inline.min-h-\\[1em\\].min-w-\\[1em\\].mr-\\[0\\.325em\\].flex-shrink-0.flex-grow-0'
        );
        elements.forEach((el) => el.remove());
    }

    // Function to inject custom styles
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --bg-button-primary: #d8d5d5 !important;
                --text-primary: #d8d5d5 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // Run on page load
    window.addEventListener('load', () => {
        removeElements();
        injectStyles();
    });

    // Observe for dynamically added elements
    const observer = new MutationObserver(() => {
        removeElements(); // Remove elements on DOM mutations
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();