// ==UserScript==
// @name         Customer name
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Highlight only the word "Customer" in red, but not phrases like "Customer info"
// @match        https://expert-portal.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539746/Customer%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/539746/Customer%20name.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Inject CSS style once
    const style = document.createElement('style');
    style.textContent = `
        .highlight-customer {
            color: red !important;
            font-weight: bold !important;
        }
    `;
    document.head.appendChild(style);

    function updateHighlights() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            const parent = node.parentElement;
            if (!parent) continue;

            const trimmed = node.textContent.trim();
            if (trimmed === 'Customer') {
                parent.classList.add('highlight-customer');
            } else {
                parent.classList.remove('highlight-customer');
            }
        }
    }

    // Run initially
    updateHighlights();

    // Watch for DOM changes
    const observer = new MutationObserver(updateHighlights);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

    // Fallback: check every 5 seconds
    setInterval(updateHighlights, 5000);
})();