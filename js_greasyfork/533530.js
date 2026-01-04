// ==UserScript==
// @name         Aliexpress Coins history Sum Up
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a count to "Store daily check-in" entries per day, displays coin sums per day (+<store sum> store | +<total sum> total) next to the date, and adjusts the history panel width for better readability.
// @author       syncNtune
// @match        https://www.aliexpress.com/p/coin-pc-index/mycoin.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliexpress.com
// @license      MIT // Added license
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533530/Aliexpress%20Coins%20history%20Sum%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/533530/Aliexpress%20Coins%20history%20Sum%20Up.meta.js
// ==/UserScript==


(function() {
    'use strict';

    console.log('Script started: ALI NEW 3 Counting Store daily check-in & Sums');

    // --- Configuration and Variables ---
    let processTimeout = null; // Variable to hold the timeout ID for delayed processing
    const storeCheckinTitleMarker = 'Store daily check-in';
    const dailySummaryClass = 'daily-summary-text-userscript'; // Unique class for our sum span

    // CSS Selectors for elements we interact with
    const historyContainerSelector = '.coin-history-content-data-list-content';
    const dateDivSelector = '.data-history-item-date';
    const contentItemSelector = '.data-history-item-content';
    const titleSpanSelector = '.data-history-item-content-title';
    const numSpanSelector = '.data-history-item-content-num';
    const mainHistoryDivSelector = '.coin-history'; // Selector for the div to change width

    // Desired width for the main history panel
    const targetWidth = '350px'; // Adjust this value if needed


    // --- Function to modify the main history div width ---
    function setHistoryDivWidth() {
        const historyDiv = document.querySelector(mainHistoryDivSelector);
        if (historyDiv) {
            console.log(`ACTION: Found "${mainHistoryDivSelector}" div. Setting width to ${targetWidth}.`);
            historyDiv.style.width = targetWidth;
             // Use setProperty with !important if needed to override AliExpress's CSS
             // historyDiv.style.setProperty('width', targetWidth, 'important');
        } else {
            console.log(`INFO: "${mainHistoryDivSelector}" div not found yet for width adjustment.`);
        }
    }


    // --- Function to process the check-in items and calculate sums ---
    // This function iterates through date groups, collects items per day,
    // calculates sums, numbers 'Store daily check-in' items, and adds sum text to the date header.
    // It's designed to be safe to call multiple times (idempotent for already processed items/sums).
    function processCheckInItems() {
        console.log('--- Processing history items started ---');
        const container = document.querySelector(historyContainerSelector);

        if (!container) {
            console.log(`INFO: History container "${historyContainerSelector}" not found.`);
            return false; // Indicate container wasn't found
        }

        const dateDivs = container.querySelectorAll(dateDivSelector);
        if (dateDivs.length === 0) {
            console.log(`INFO: No date entries "${dateDivSelector}" found within the container.`);
             return true; // Indicate processing finished (even if nothing found)
        }

        console.log(`INFO: Found ${dateDivs.length} date entries. Starting group processing...`);

        let totalCheckinsNumberedInRun = 0; // Track items numbered *in this specific call*

        // Iterate through each date div to group items by day
        // Iterating forwards to easily collect subsequent items for the day.
        const dateDivsArray = Array.from(dateDivs);
        for (let i = 0; i < dateDivsArray.length; i++) {
            const dateDiv = dateDivsArray[i];
            const dateText = dateDiv.textContent.trim();

            // --- Cleanup previous sum span on date header ---
            // Find and remove our previously added sum span if it exists
            const existingSummarySpan = dateDiv.querySelector('.' + dailySummaryClass);
            if (existingSummarySpan) {
                 // console.log(`DEBUG: Removing existing sum span from date "${dateText}".`); // Too verbose
                 existingSummarySpan.remove();
            }

            // console.log(`DEBUG: Processing date group for: ${dateText}`); // Too verbose

            let dailyStoreCheckinSum = 0;
            let dailyTotalSum = 0;
            let dailyCheckinCounter = 1; // Counter specific to check-ins for *this* day
            const itemsForThisDate = [];

            // Collect all content items that belong to this date (until the next date div or end)
            let currentElement = dateDiv.nextElementSibling;
            while (currentElement && !currentElement.classList.contains(dateDivSelector.substring(1))) { // Check class without the '.'
                if (currentElement.classList.contains(contentItemSelector.substring(1))) { // Check class without the '.'
                     itemsForThisDate.push(currentElement); // Add to array
                }
                currentElement = currentElement.nextElementSibling;
            }
             // console.log(`DEBUG: Finished collecting items for date "${dateText}". Found ${itemsForThisDate.length} items.`); // Too verbose

            // --- Process collected items for sums and numbering ---
            // Iterate through the collected items to calculate sums and identify/number check-ins
            itemsForThisDate.forEach(itemElement => {
                const titleDiv = itemElement.querySelector(titleSpanSelector);
                const numSpan = itemElement.querySelector(numSpanSelector);

                if (titleDiv && numSpan) {
                    let currentTitle = titleDiv.textContent.trim();
                    const coinText = numSpan.textContent.trim();

                    // Robustly parse the coin amount (handles + or - signs and potential non-numeric chars)
                    const coins = parseInt(coinText.replace(/[^0-9+-]/g, ''), 10); // Base 10

                    if (!isNaN(coins)) {
                        dailyTotalSum += coins; // Sum total coins for the day

                        // Check if it's a "Store daily check-in" item
                        if (currentTitle.includes(storeCheckinTitleMarker)) {
                            dailyStoreCheckinSum += coins; // Sum store check-in coins

                            // --- Handle Numbering ---
                            // Find the exact position of the marker phrase
                            const markerIndex = currentTitle.indexOf(storeCheckinTitleMarker);

                            if (markerIndex !== -1) {
                                // Check the text *immediately after* the marker for our #N format
                                const textAfterMarker = currentTitle.substring(markerIndex + storeCheckinTitleMarker.length).trim();

                                // If it doesn't already start with '#' followed by digits, number it
                                if (!textAfterMarker.match(/^#\d+/)) {
                                    console.log(`ACTION: Numbering "${currentTitle}" for ${dateText}. Assigning count #${dailyCheckinCounter}`);
                                    // Construct the new title by inserting ' #N' after the marker phrase
                                    const newTitle = currentTitle.substring(0, markerIndex + storeCheckinTitleMarker.length)
                                                     + ' #' + dailyCheckinCounter
                                                     + currentTitle.substring(markerIndex + storeCheckinTitleMarker.length); // Add back any text that was after the marker

                                    titleDiv.textContent = newTitle;
                                    totalCheckinsNumberedInRun++; // Increment total count across all days in this run
                                    // console.log(`ACTION: Title changed to "${titleDiv.textContent}".`); // Too verbose
                                } else {
                                     // Item is already numbered from a previous run, just log it (optional)
                                     // console.log(`DEBUG: "${storeCheckinTitleMarker}" item "${currentTitle}" is already numbered. Skipping numbering action for this item.`); // Too verbose
                                }
                            } else {
                                // This case is unexpected if includes() was true, but good for debugging potential issues
                                console.warn(`WARNING: Found item including "${storeCheckinTitleMarker}" but couldn't find marker index? Title: "${currentTitle}"`);
                            }

                            // Increment the daily check-in counter regardless of whether we modified the text
                            // This keeps the sequence correct for all check-in items on this day.
                            dailyCheckinCounter++;
                        }
                    } else {
                         console.log(`INFO: Could not parse coins from "${coinText}" for item "${currentTitle}". Skipping coin sum for this item.`);
                    }
                } else {
                     console.log('INFO: Content item found, but title or num span missing. Skipping processing for this item.');
                }
            }); // End itemsForThisDate loop

            // --- Add sums to the date header ---
            // Create the summary text format: +<store sum> store | +<total sum> total
            const dateSummaryText = ` +${dailyStoreCheckinSum} store | +${dailyTotalSum} total`;

            // Append the summary text inside a new span element to the date div
            // We already removed any existing span at the start of the date loop.
             console.log(`ACTION: Adding summary "${dateSummaryText}" to date "${dateText}".`);
             const summarySpan = document.createElement('span');
             summarySpan.classList.add(dailySummaryClass); // Add our unique class
             summarySpan.style.marginLeft = '10px'; // Add some space
             summarySpan.style.fontWeight = 'normal'; // Reduce emphasis
             summarySpan.style.fontSize = '0.9em'; // Make it slightly smaller
             summarySpan.style.color = '#555'; // Slightly muted color (optional)
             summarySpan.textContent = dateSummaryText;
             dateDiv.appendChild(summarySpan); // Append the new span element


        } // End dateDivs loop

        console.log(`--- Processing finished. Check-ins numbered/updated in this run: ${totalCheckinsNumberedInRun}. ---`);
        return true; // Indicate processing completed
    }

    // --- Function to set up the MutationObserver ---
    // Observes the history container for additions of new history items (like on scroll).
    function setupObserver(targetNode) {
         console.log('INFO: Setting up MutationObserver on the container...');
        const observer = new MutationObserver((mutations) => {
            let needsProcessing = false;
            for (const mutation of mutations) {
                // Check if nodes were added directly to the container
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                   // Check if any of the added nodes are likely history items (date or content)
                   for (const node of mutation.addedNodes) {
                        // node.nodeType === Node.ELEMENT_NODE ensures it's an element
                        // Check for the class names to ensure it's relevant content
                        if (node.nodeType === Node.ELEMENT_NODE &&
                           (node.classList.contains(dateDivSelector.substring(1)) ||
                            node.classList.contains(contentItemSelector.substring(1))))
                        {
                            console.log('INFO: MutationObserver detected addition of a history item. Scheduling reprocessing.');
                            needsProcessing = true;
                            break; // Found a relevant addition, no need to check other added nodes
                        }
                   }
                   if(needsProcessing) break; // Found a relevant mutation, stop checking this record
                }
            }
            if (needsProcessing) {
                console.log('INFO: Reprocessing scheduled by MutationObserver...');
                // Clear previous timeout if it exists to avoid multiple rapid calls
                if (processTimeout) {
                    clearTimeout(processTimeout);
                }
                // Set a new timeout to process after a short delay
                // This gives the browser/page scripts a moment to finish rendering
                processTimeout = setTimeout(() => {
                    console.log('INFO: Running reprocessing after delay...');
                    processCheckInItems();
                }, 300); // Delay in milliseconds (adjust if needed)
            }
        });

        // Start observing the container for direct child additions
        observer.observe(targetNode, { childList: true });
        console.log('INFO: Observer started on container.');
    }


    // --- Initial Load Handling ---
    // Uses requestAnimationFrame to wait until the browser is ready to paint,
    // which often means the basic DOM structure is in place.
    function waitForContainerAndProcess() {
        const container = document.querySelector(historyContainerSelector);
        if (container) {
            console.log('INFO: History container found. Processing initial content...');
            // Use a small timeout after finding the container to let its children fully render
            setTimeout(() => {
                 processCheckInItems();
                 // Set up observer for future dynamic content loading (like scrolling)
                 setupObserver(container);
            }, 100); // Small delay
        } else {
            console.log('INFO: History container not found yet. Requesting next frame...');
            // If container not found, try again on the next animation frame
            requestAnimationFrame(waitForContainerAndProcess);
        }
    }

    // --- Main Execution Flow ---

    // 1. Adjust the width of the history panel early.
    // Using requestAnimationFrame ensures the basic layout div exists.
    requestAnimationFrame(setHistoryDivWidth);

    // 2. Start the process to find the history list container and process its items.
    // This uses requestAnimationFrame to wait for the container, and then sets up the observer.
    waitForContainerAndProcess(); // Call the initial waiting function

    console.log('Script setup complete. Look for ACTION and INFO messages in the console.');

})();