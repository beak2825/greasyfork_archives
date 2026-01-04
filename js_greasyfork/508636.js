// ==UserScript==
// @name         rank horses by odds on hkjcfootball
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Rank horses according to odds
// @author       L_G_M
// @match        *://bet.hkjc.com/*
// @match        *://betslip.hkjcfootball.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508636/rank%20horses%20by%20odds%20on%20hkjcfootball.user.js
// @updateURL https://update.greasyfork.org/scripts/508636/rank%20horses%20by%20odds%20on%20hkjcfootball.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sortOrderPLA = 'ascending'; // Default sort order for PLA odds
    let sortOrderWIN = 'ascending'; // Default sort order for WIN odds
    let observerPLA = null; // Store the MutationObserver for PLA odds
    let observerWIN = null; // Store the MutationObserver for WIN odds
    let isSorting = false // Prevent simultaneous sorts

    // Helper function to extract the odds value from the element
    function extractOdds(rowElement, prefix) {
        // Find the div inside the row with the odds
        const oddsElement = rowElement.querySelector(`.rc-checkbox.rc-odds [id^="${prefix}"]`);
        const oddsText = oddsElement ? oddsElement.textContent || oddsElement.innerText : "0";
        const oddsValue = parseFloat(oddsText.replace(/[^\d.-]/g, '')); // Extract numeric value
        return isNaN(oddsValue) ? 0 : oddsValue;
    }

    // Function to sort rows based on odds
    function sortRows(prefix, sortOrder, containerSelector, arrowId) {
        if (isSorting) return; // Prevent simultaneous sorts
        isSorting = true;
        // Select all rows with the specified prefix, excluding those with 'full' class
        const rowsToSort = document.querySelectorAll('.rc-odds-row:not(.full)');
        const fullRows = document.querySelectorAll('.rc-odds-row.full');
        // Convert NodeList to arrays
        let sortableRowsArray = Array.from(rowsToSort);
        let fullRowsArray = Array.from(fullRows);

        // Sort rows based on the odds value inside .rc-checkbox.rc-odds
        sortableRowsArray.sort(function(a, b) {
            const oddsA = extractOdds(a, prefix);
            const oddsB = extractOdds(b, prefix);
            return sortOrder === 'ascending' ? oddsA - oddsB : oddsB - oddsA;
        });

        // Get the parent container (adjust as necessary)
        const parentContainer = document.querySelector(containerSelector);

        if (parentContainer) {
            // Temporarily disconnect the observer to avoid infinite loop
            if (prefix === 'odds_PLA' && observerPLA) {
                observerPLA.disconnect();
                observerWIN.disconnect();
            }
            if (prefix === 'odds_WIN' && observerWIN) {
                observerWIN.disconnect();
                observerPLA.disconnect();
            }

            // Remove all rows from the DOM
            sortableRowsArray.forEach(rowElement => parentContainer.removeChild(rowElement));
            fullRowsArray.forEach(rowElement => parentContainer.removeChild(rowElement));

            // Reinsert sorted rows
            sortableRowsArray.forEach(rowElement => parentContainer.appendChild(rowElement));
            // Reinsert full rows at the bottom
            fullRowsArray.forEach(rowElement => parentContainer.appendChild(rowElement));

            // Re-enable the observer after sorting is done
            if (prefix === 'odds_PLA' && observerPLA) observerPLA.observe(parentContainer, { childList: true, subtree: true, characterData: true});
            if (prefix === 'odds_WIN' && observerWIN) observerWIN.observe(parentContainer, { childList: true, subtree: true, characterData: true});
            // Update the arrow direction
            updateArrow(arrowId, sortOrder);
        }
        isSorting = false;

    }

    // Function to toggle sort order for PLA or WIN odds
    function toggleSortOrder(prefix, containerSelector, arrowId) {
        if (prefix === 'odds_PLA') {
            sortOrderPLA = sortOrderPLA === 'ascending' ? 'descending' : 'ascending';
            sortRows(prefix, sortOrderPLA, containerSelector, arrowId);
        } else if (prefix === 'odds_WIN') {
            sortOrderWIN = sortOrderWIN === 'ascending' ? 'descending' : 'ascending';
            sortRows(prefix, sortOrderWIN, containerSelector, arrowId);
        }
    }

    // Function to create and display the arrow for user interaction
    function createArrow(className, prefix) {
        const oddsContainer = document.querySelector(className);

        if (oddsContainer) {
            const arrow = document.createElement('span');
            arrow.id = `sort-arrow-${prefix}`;
            arrow.style.cursor = 'pointer';
            arrow.style.padding = '10px';
            arrow.style.fontSize = '10px';
            arrow.textContent = '▲'; // Start with ascending arrow

            // Add click event to toggle sort order
            arrow.addEventListener('click', () => toggleSortOrder(prefix, '.rc-odds-table.pr', arrow.id));

            // Append arrow to the container
            oddsContainer.appendChild(arrow);
        } else {
            console.error(`${className} element not found.`);
        }
    }

    // Function to update the arrow direction based on sort order
    function updateArrow(arrowId, sortOrder) {
        const arrow = document.getElementById(arrowId);
        if (arrow) {
            arrow.textContent = sortOrder === 'ascending' ? '▲' : '▼'; // Ascending is ▲, Descending is ▼
        }
    }

    // Set up MutationObservers to watch for changes in the odds
    function observeOddsChanges(prefix) {
        const observerCallback = () => {
            const oddsContainer = document.querySelector('.rc-odds-table.pr'); // Adjust to the correct parent container
            // Re-sort rows when changes are detected
            if (oddsContainer) {
                sortRows(prefix, prefix === 'odds_PLA' ? sortOrderPLA : sortOrderWIN, '.rc-odds-table.pr', `sort-arrow-${prefix}`);
            }
            const arrowWIN = document.getElementById('sort-arrow-odds_WIN')
            const arrowPLA = document.getElementById('sort-arrow-odds_PLA')
            if (!arrowWIN){
                createArrow('.pwinCol.win', 'odds_WIN'); // Create the interactive arrow for WIN odds
            }
            if(!arrowPLA){
                createArrow('.place', 'odds_PLA'); // Create the interactive arrow for PLA odds
            }
        };

        if (prefix === 'odds_PLA') {
            observerPLA = new MutationObserver(observerCallback);
            observerPLA.observe(document.body, { childList: true, subtree: true, characterData: true });
        } else if (prefix === 'odds_WIN') {
            observerWIN = new MutationObserver(observerCallback);
            observerWIN.observe(document.body, { childList: true, subtree: true, characterData: true });
        }
    }

    // Initialize the script
    function init() {
        observeOddsChanges('odds_PLA'); // Start observing changes for PLA odds
        observeOddsChanges('odds_WIN'); // Start observing changes for WIN odds
    }

    // Run the initialization after a small delay to ensure the DOM is ready
    setTimeout(init, 1000);

})();
