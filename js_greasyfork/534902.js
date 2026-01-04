// ==UserScript==
// @name         YMS Priority Trailer Highlighter + Pin to Top
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Pin trailers marked as "PRIORITY" or "URGENT" to the top in YMS
// @match        https://trans-logistics.amazon.com/yms/shipclerk/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534902/YMS%20Priority%20Trailer%20Highlighter%20%2B%20Pin%20to%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/534902/YMS%20Priority%20Trailer%20Highlighter%20%2B%20Pin%20to%20Top.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // This function checks if the trailer is marked as urgent or priority.
    function isPriorityOrUrgent(trailer) {
        const text = trailer.innerText.toLowerCase();
        const title = trailer.getAttribute('title')?.toLowerCase() || '';
        
        // Check for "priority" or "urgent" keywords in text or title
        return text.includes('urgent') || text.includes('priority') || title.includes('urgent') || title.includes('priority');
    }

    setInterval(() => {
        const trailerContainer = document.querySelector('#mainContainer') || document.body; // The container where trailers are listed.
        const allTrailers = Array.from(document.querySelectorAll('.yard-asset-icon')); // Select all trailer icons.

        const priorityTrailers = [];
        const normalTrailers = [];

        // Separate trailers into priority and normal groups
        allTrailers.forEach(card => {
            if (isPriorityOrUrgent(card)) {
                // Highlight visually for urgency
                card.style.backgroundColor = '#ffd6d6'; // Light red background
                card.style.border = '3px solid red'; // Red border
                card.style.boxShadow = '0 0 10px red'; // Red glow
                card.style.fontWeight = 'bold'; // Bold font for emphasis

                priorityTrailers.push(card);
            } else {
                // Optional: reset style for non-priority trailers
                card.style.backgroundColor = '';
                card.style.border = '';
                card.style.boxShadow = '';
                card.style.fontWeight = '';

                normalTrailers.push(card);
            }
        });

        // Reorder the trailers with priority ones first
        if (priorityTrailers.length > 0 && trailerContainer) {
            // Clear existing order and append priority trailers first, then normal trailers
            [...priorityTrailers, ...normalTrailers].forEach(card => {
                trailerContainer.appendChild(card); // This moves the trailer to the top of the container
            });
        }

    }, 2000);
})();

