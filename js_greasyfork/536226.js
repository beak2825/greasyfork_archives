// ==UserScript==
// @name         Economic Calendar Custom Filter Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to filter economic calendar for Japan and USA with 2-3 star importance
// @author       Grok
// @match        https://vn.investing.com/economic-calendar/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536226/Economic%20Calendar%20Custom%20Filter%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/536226/Economic%20Calendar%20Custom%20Filter%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to wait for an element to appear
    function waitForElement(selector, callback, maxAttempts = 20, interval = 500) {
        let attempts = 0;
        const intervalId = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(intervalId);
                callback(element);
            } else if (attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.error('Element not found:', selector);
            }
            attempts++;
        }, interval);
    }

    // Function to apply the custom filter
    function applyCustomFilter() {
        // Open the filter wrapper if not already open
        const filtersWrapper = document.getElementById('filtersWrapper');
        if (filtersWrapper && filtersWrapper.style.display !== 'block') {
            window.changeFiltersVisibility();
        }

        // Wait for the country and importance filter boxes
        waitForElement('#calendarFilterBox_country', () => {
            // Uncheck all countries
            const countryCheckboxes = document.querySelectorAll('input[name="country[]"]');
            countryCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            // Check USA (country5) and Japan (country35)
            const usaCheckbox = document.getElementById('country5');
            const japanCheckbox = document.getElementById('country35');
            if (usaCheckbox) usaCheckbox.checked = true;
            if (japanCheckbox) japanCheckbox.checked = true;

            // Uncheck all importance levels
            const importanceCheckboxes = document.querySelectorAll('input[name="importance[]"]');
            importanceCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            // Check 2-star (importance2) and 3-star (importance3)
            const importance2Checkbox = document.getElementById('importance2');
            const importance3Checkbox = document.getElementById('importance3');
            if (importance2Checkbox) importance2Checkbox.checked = true;
            if (importance3Checkbox) importance3Checkbox.checked = true;

            // Click the Apply button
            const applyButton = document.getElementById('ecSubmitButton');
            if (applyButton) {
                applyButton.click();
            } else {
                console.error('Apply button not found');
            }
        });
    }

    // Function to create and insert the custom button
    function createCustomButton() {
        waitForElement('#filterStateAnchor', (filterButton) => {
            // Check if button already exists to avoid duplicates
            if (document.getElementById('customFilterButton')) return;

            // Create the new button
            const customButton = document.createElement('a');
            customButton.id = 'customFilterButton';
            customButton.href = 'javascript:void(0);';
            customButton.className = 'newBtn filter LightGray float_lang_base_2';
            customButton.innerHTML = 'Lọc Nhật Bản & Hoa Kỳ (2-3*)';
            customButton.style.marginLeft = '10px';

            // Add click event to apply the filter
            customButton.addEventListener('click', applyCustomFilter);

            // Insert the button after the existing filter button
            filterButton.parentNode.insertBefore(customButton, filterButton.nextSibling);
        });
    }

    // Run when the page loads
    window.addEventListener('load', () => {
        createCustomButton();
    });

    // Re-create button on AJAX updates
    const observer = new MutationObserver(() => {
        createCustomButton();
    });

    waitForElement('#economicCalendarFilters', (filterSection) => {
        observer.observe(filterSection, { childList: true, subtree: true });
    });
})();