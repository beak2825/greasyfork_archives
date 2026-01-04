// ==UserScript==
// @name         Amtrak Lowest Fare Default with Dropdown
// @namespace    namespace_amtrak_lowest_fare_dropdown
// @version      1.0
// @description  Automatically opens the 'Sort/Filter' dropdown and selects the 'Lowest Fare' option on Amtrak's ticket search results.
// @author       Andrew Lakkis
// @license      MIT
// @match        https://www.amtrak.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491915/Amtrak%20Lowest%20Fare%20Default%20with%20Dropdown.user.js
// @updateURL https://update.greasyfork.org/scripts/491915/Amtrak%20Lowest%20Fare%20Default%20with%20Dropdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dropdown;
    var currentButton;

    // Function to click the 'Sort/Filter' dropdown
    const openSortFilterDropdown = () => {
        const sortOptionsInterval = setInterval(() => {
            dropdown = document.querySelector('.ng-star-inserted.p-3.align-items-center.d-flex.sort-and-filter-btn');
            currentButton = document.querySelector('[amt-auto-test-id="search-results-current-sortby-filter"]');

            if (dropdown && !(currentButton.innerText === 'Lowest Fare')) {
                dropdown.click(); // Simulate a click to open the dropdown
                setTimeout(selectLowestFare, 500); // Adjust time as needed based on site behavior
                clearInterval(sortOptionsInterval); // Stop the interval
            }
        }, 100);

    };


    // Function to select the 'Lowest Fare' option
    const selectLowestFare = () => {
        // Wait for the sort options to be available in the DOM after opening the dropdown
        const sortOptionsInterval = setInterval(() => {
            const sortOptions = document.querySelector('mat-radio-group[formcontrolname="sortBy"]');
            if (sortOptions) {
                clearInterval(sortOptionsInterval);
                const lowestFareOption = sortOptions.querySelector('[for="mat-radio-5-input"]');
                if (lowestFareOption) {
                    // Simulate a click on the 'Lowest Fare' radio button
                    lowestFareOption.click();
                    dropdown.click();
                }
            }
        }, 100);
    };



    // Run the function when the DOM is fully loaded
    const dropdownOpened = openSortFilterDropdown();
    if (dropdownOpened) {
        // Wait a brief moment for dropdown animations and options to become visible
        setTimeout(selectLowestFare, 500); // Adjust time as needed based on site behavior
    } 
})();
