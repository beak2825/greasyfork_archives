// ==UserScript==
// @name         MilkyWayIdle 24hr Timestamps
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Converts chat timestamps on milkywayidle.com from 12-hour AM/PM to 24-hour format, preserving the date if present.
// @author       Opzon - Prompted on Gemini Pro
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537367/MilkyWayIdle%2024hr%20Timestamps.user.js
// @updateURL https://update.greasyfork.org/scripts/537367/MilkyWayIdle%2024hr%20Timestamps.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Converts a 12-hour time string (e.g., "9:31:23 PM") to 24-hour format.
     * @param {string} time12hr - The 12-hour time string (e.g., "HH:MM:SS AM/PM").
     * @returns {string} The 24-hour time string (e.g., "HH:MM:SS").
     */
    function convertTo24Hour(time12hr) {
        // We'll create a dummy date object to leverage Date's parsing and formatting capabilities.
        // The date part doesn't matter for the conversion of the time itself.
        const dummyDate = new Date(`2000/01/01 ${time12hr}`);

        if (isNaN(dummyDate.getTime())) {
            // If parsing failed, return original or an error indicator
            console.warn('Failed to parse time string for 24-hour conversion:', time12hr);
            return time12hr;
        }

        // Use toLocaleTimeString with appropriate options for 24-hour format
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // This is the key for 24-hour format
        };

        // 'en-US' locale usually provides straightforward results
        return dummyDate.toLocaleTimeString('en-US', options);
    }

    /**
     * Processes a single timestamp span element, converting its content.
     * Handles both "[HH:MM:SS AM/PM]" and "[M/D HH:MM:SS AM/PM]" formats.
     * @param {HTMLElement} spanElement - The span element containing the timestamp.
     */
    function processTimestampSpan(spanElement) {
        const originalText = spanElement.textContent;
        // Regex to capture the timestamp content inside brackets.
        // Group 1: Optional date part (e.g., "5/22"). The `?:` makes this a non-capturing group.
        // The inner `()` around `(\d{1,2}\/\d{1,2})` makes the date itself capturable as match[1].
        // Group 2: The time part (e.g., "9:31:23 PM").
        const match = originalText.match(/^\[(?:(\d{1,2}\/\d{1,2})\s+)?(\d{1,2}:\d{2}:\d{2} [AP]M)\]/);

        if (match) {
            const datePart = match[1]; // Will be undefined if no date was found
            const time12hr = match[2]; // This is the mandatory time part

            if (time12hr) {
                const time24hr = convertTo24Hour(time12hr);
                let newTimestampText = '';

                if (datePart) {
                    // If a date was present, reconstruct as "[M/D HH:MM:SS]"
                    newTimestampText = `[${datePart} ${time24hr}]`;
                } else {
                    // Otherwise, reconstruct as "[HH:MM:SS]"
                    newTimestampText = `[${time24hr}]`;
                }
                spanElement.textContent = newTimestampText;
            }
        }
    }

    /**
     * Finds and processes all existing timestamp elements on the page.
     */
    function processAllExistingTimestamps() {
        document.querySelectorAll('.ChatMessage_timestamp__1iRZO').forEach(processTimestampSpan);
    }

    // --- MutationObserver Setup ---
    // This will watch for new chat messages and whispers being added to the DOM.
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(addedNode => {
                    // Check if the added node is an element and if it contains timestamps
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        // If the added node itself is a timestamp span
                        if (addedNode.classList.contains('ChatMessage_timestamp__1iRZO')) {
                            processTimestampSpan(addedNode);
                        }
                        // If the added node contains timestamp spans (e.g., a whole chat message div)
                        addedNode.querySelectorAll('.ChatMessage_timestamp__1iRZO').forEach(processTimestampSpan);
                    }
                });
            }
        }
    });

    // Start observing the document body for changes.
    // 'childList': true means observe direct children additions/removals.
    // 'subtree': true means observe changes in any descendant of the target node.
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run: Process all timestamps that are already on the page when the script loads.
    processAllExistingTimestamps();

})();