// ==UserScript==
// @name         Show Number of Days instead of dots in Jira tickets
// @namespace    http://anthonywong.net/
// @version      1.0
// @description  Replace Jira "Days in Column" dots with exact numbers
// @author       You
// @match        https://*.atlassian.net/*
// @grant        none
// @author       Anthony Wong <yp@anthonywong.net>
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/530552/Show%20Number%20of%20Days%20instead%20of%20dots%20in%20Jira%20tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/530552/Show%20Number%20of%20Days%20instead%20of%20dots%20in%20Jira%20tickets.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debounce function to limit how often updateDaysInColumn runs
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Function to replace dots with numbers followed by 'd'
    function updateDaysInColumn() {
        // Target tooltips with "days in this column" in aria-label
        const tooltipElements = document.querySelectorAll('div[role="tooltip"][aria-label*="days in this column"]:not(.processed)');

        if (tooltipElements.length === 0) {
            console.log('No new "Days in Column" tooltips found.');
            return;
        }

        tooltipElements.forEach(tooltip => {
            // Extract the number from aria-label
            const ariaLabel = tooltip.getAttribute('aria-label');
            const daysMatch = ariaLabel.match(/(\d+)/);
            if (daysMatch) {
                const days = daysMatch[0];
                console.log(`Found tooltip with ${days} days:`, tooltip);

                // Replace dots with number followed by 'd' and mark as processed
                tooltip.innerHTML = `<span style="font-size: 12px; color: #172B4D; font-weight: bold;">${days}d</span>`;
                tooltip.classList.add('processed'); // Prevent re-processing
            } else {
                console.log('No number found in aria-label:', ariaLabel);
            }
        });

        console.log(`Processed ${tooltipElements.length} new "Days in Column" tooltips.`);
    }

    // Debounced version of the update function
    const debouncedUpdate = debounce(updateDaysInColumn, 500);

    // Initial run after delay to allow React to render
    setTimeout(() => {
        updateDaysInColumn(); // Run once immediately
    }, 2000);

    // Observe DOM changes with debouncing
    const observer = new MutationObserver(debouncedUpdate);

    const targetNode = document.body;
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    // Cleanup on page unload
    window.addEventListener('unload', () => {
        observer.disconnect();
    });
})();