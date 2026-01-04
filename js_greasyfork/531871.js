// ==UserScript==
// @name         Needles to top!
// @namespace    http://tampermonkey.net/
// @version      Needles to top! V1.8
// @description  Sorts items on Torn.com items page with priority.
// @author       Elaine [2047176] and Gemini 2.5 Pro (experimental)
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-idle // Startet, wenn das initiale DOM bereit ist
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531871/Needles%20to%20top%21.user.js
// @updateURL https://update.greasyfork.org/scripts/531871/Needles%20to%20top%21.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- Configuration ---
    // Add the exact names of ALL items here that should generally be sorted to the TOP,
    // as they appear in the 'data-sort' attribute of the LI element.
    // Tyrosine, Melatonin, Epinephrine MUST be included here if they should be prioritized.
    // ===> ADJUST THIS LIST IF NECESSARY! <===
    const itemsToSortToTop = [
        "Epinephrine",
        "Serotonin",
        "Tyrosine",
        "Melatonin"
        // Add more or remove items as needed.
    ];
    // Define the exact 'data-sort' names for the priority items
    const prio1_Name = "Tyrosine";
    const prio2_Name = "Melatonin";
    const prio3_Name = "Epinephrine";
 
    // --- CSS Selectors ---
    const itemContainerSelector = '#temporary-items';
    const itemSelector = 'li';
 
    // --- Global Variables ---
    let debounceTimer; // Timer for debounce
    const debounceWait = 500; // Wait time in milliseconds after the last change
 
    // --- Debounce Function ---
    // Executes a function only after 'wait' ms have passed since the last call.
    function debounce(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(debounceTimer);
                func(...args);
            };
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(later, wait);
        };
    }
 
    // --- Helper function: Checks if two arrays contain the same elements in the same order ---
    function arraysContainSameElementsInOrder(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (let i = 0; i < arr1.length; i++) {
            // Compares the references to the actual DOM elements
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    }
 
    // --- Main sorting function (WITH PRE-CHECK) ---
    function sortItemsWithPriority() {
        const container = document.querySelector(itemContainerSelector);
        if (!container || !container.querySelectorAll) {
            // console.warn('Torn Item Sorter: Sort function called, but container not (yet) valid.');
            // Normally the observer shouldn't fire if the container is gone, but just in case.
            return;
        }
 
        // Get the current list of items in their DOM order
        const currentItems = Array.from(container.querySelectorAll(itemSelector + '[data-sort]'));
        if (currentItems.length === 0) {
            // console.log('Torn Item Sorter: No items with [data-sort] found for sorting.');
            return; // Nothing to do
        }
 
        // --- Determine the IDEAL order based on priorities ---
        const priority1 = []; // Tyrosine
        const priority2 = []; // Melatonin
        const priority3 = []; // Epinephrine
        const priorityRestTop = []; // Other items from itemsToSortToTop
        const otherItems = []; // All remaining items
        const topItemSet = new Set(itemsToSortToTop); // Create a Set for quick checking
 
        // Categorize all currently present items
        currentItems.forEach(item => {
            const sortName = item.getAttribute('data-sort');
            if (!sortName) {
                otherItems.push(item); // Without data-sort -> send to the very bottom
                return;
            }
            const trimmedSortName = sortName.trim();
 
            if (trimmedSortName === prio1_Name) { priority1.push(item); }
            else if (trimmedSortName === prio2_Name) { priority2.push(item); }
            else if (trimmedSortName === prio3_Name) { priority3.push(item); }
            else if (topItemSet.has(trimmedSortName)) { priorityRestTop.push(item); } // Is it in the list of "to top" items?
            else { otherItems.push(item); } // Not in the top list -> send down
        });
 
        // Sort the 'priorityRestTop' group alphabetically by data-sort for consistency
        priorityRestTop.sort((a, b) => (a.getAttribute('data-sort') || '').localeCompare(b.getAttribute('data-sort') || ''));
 
        // Create the array representing the IDEAL order
        const idealOrder = [
            ...priority1,
            ...priority2,
            ...priority3,
            ...priorityRestTop,
            ...otherItems
        ];
        // --- End: Determining the ideal order ---
 
 
        // --- CHECK: Does the current order already match the ideal one? ---
        if (arraysContainSameElementsInOrder(currentItems, idealOrder)) {
            // console.log('Torn Item Sorter: Order is already correct. No DOM changes needed.');
            // The observer remains active to react to NEW external changes,
            // but this function will not make DOM changes and thus will not
            // re-trigger the observer itself (via debounce).
            return; // EXIT early
        }
 
        // --- Order is INCORRECT -> Perform sorting via DOM manipulation ---
        console.log('Torn Item Sorter: Order incorrect, performing sort...');
 
        // Re-append all items to the container in the new priority order.
        // appendChild moves the elements.
        const groupsToAppend = [priority1, priority2, priority3, priorityRestTop, otherItems];
        groupsToAppend.forEach(group => {
            group.forEach(item => container.appendChild(item));
        });
 
        console.log(`Torn Item Sorter: Sorting with priorities finished.`);
        // Note: The appendChild operations CAN trigger the observer again.
        // However, the debounce mechanism handles this. The next call to
        // sortItemsWithPriority should then find the order correct and exit early
        // thanks to the check above.
    }
 
    // --- Create the debounced version of the new sort function ---
    const debouncedSortItemsWithPriority = debounce(sortItemsWithPriority, debounceWait);
 
    // --- MutationObserver Setup ---
    function startObserver() {
        const targetNode = document.querySelector(itemContainerSelector);
        if (!targetNode) {
            console.warn('Torn Item Sorter: Container for observer not found. Retrying in 1 second.');
            setTimeout(startObserver, 1000); // Try again if container is not there yet
            return;
        }
        // Configuration: Observe child changes and subtree changes
        const config = {
            childList: true, // Observe direct children (item LIs)
            subtree: true    // Also observe all descendants (e.g., buttons loaded)
        };
        // Callback function that is called on changes
        const callback = function(mutationsList, observer) {
            let relevantChange = false;
             // Check if *any* child list changes occurred (nodes added/removed).
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' ) {
                    relevantChange = true;
                    break; // One relevant change is enough
                }
            }
            if (relevantChange) {
                // console.log('Torn Item Sorter (Observer): Change detected, starting debounce timer...');
                debouncedSortItemsWithPriority(); // Calls the (new) debounced sort function
            }
        };
        // Create and start the observer
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        console.log('Torn Item Sorter: MutationObserver is active and watching', itemContainerSelector);
        // Optional initial call to check/correct the state on load
        setTimeout(debouncedSortItemsWithPriority, 250); // Slightly increased delay
    }
 
    // --- Start the process ---
    // Make sure the DOM is at least fundamentally loaded before starting the observer.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startObserver);
    } else {
        startObserver(); // DOM is already loaded or interactive
    }
 
})();