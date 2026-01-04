// ==UserScript==
// @name        Deku Deals - Additional Filter
// @namespace   MKScripts
// @match       https://www.dekudeals.com/*
// @grant       none
// @version     2.8
// @author      MKScripts
// @description Add sale type filters to all pages
// @downloadURL https://update.greasyfork.org/scripts/486609/Deku%20Deals%20-%20Additional%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/486609/Deku%20Deals%20-%20Additional%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Common badge selector
    const spanBadgeWarningSelector = '.badge-warning';

    // Find the new injection element
    const injectionElement = document.querySelector('body > main > div.d-flex.flex-md-nowrap.flex-wrap > div.search-left');

    if (injectionElement) {
        // Create a container div for the radio buttons
        const radioContainer = document.createElement('div');
        radioContainer.style.display = 'block'; // Set to block for vertical layout
        radioContainer.style.marginBottom = '20px'; // Make room below the div

        // Create radio buttons
        const radioButtons = [
            createRadioButton('Show All', 'showAll', showAll),
            createRadioButton('Regular Sale', 'regularSale', regularSale),
            createRadioButton('Matches Previous Low', 'matchesPreviousLow', matchesPreviousLow),
            createRadioButton('Lowest Price Ever', 'lowestPriceEver', lowestPriceEver)
        ];

        // Set "Show All" as checked by default
        radioButtons[0].input.checked = true;

        // Append radio buttons to the container
        radioButtons.forEach(({ container }) => radioContainer.appendChild(container));

        // Insert the container into the new injection point
        injectionElement.insertAdjacentElement('afterbegin', radioContainer);

        // See if we are on a subsequent page where we need to filter:
        const urlParams = new URLSearchParams(window.location.search);
        const filterValue = urlParams.get('MKScriptsFilter') || 'showAll'; // Default to 'showAll'
        if (filterValue !== 'showAll') setURLfilter ( filterValue );
    }

    function setURLfilter ( filterValue ) {
        // Get all radio buttons with the name "dealType"
        const radioButtons = document.querySelectorAll('input[name="dealType"]');

        //Find the radio button with the matching value, set it, and call the sub
        //set up values and functions to call
        const filterFunctions = {
          regularSale: regularSale,
          matchesPreviousLow: matchesPreviousLow,
          lowestPriceEver: lowestPriceEver,
          showAll: showAll
        };
        radioButtons.forEach(radioButton => {
            if (radioButton.value === filterValue) {
              // Click the button
              radioButton.checked = true;
              if (filterFunctions[filterValue]) {
                filterFunctions[filterValue]();
              }
            }
        });
    }


    // Function to create a radio button
    function createRadioButton(label, value, handler) {
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'dealType';
        radioButton.value = value;
        radioButton.style.cursor = 'pointer';

        const labelElement = document.createElement('label');
        labelElement.textContent = label;
        labelElement.style.marginLeft = '7px'; // Add margin-left to the labels
        labelElement.style.cursor = 'pointer';

        // Append the radio button and label to a div
        const container = document.createElement('div');
        container.style.marginBottom = '0px'; // Spacing between radio buttons
        container.style.cursor = 'pointer';
        container.appendChild(radioButton);
        container.appendChild(labelElement);

        // Attach event listener to the container
        container.addEventListener('click', function () {
            radioButton.checked = true;
            handler(value); // Pass the filter value to the handler
        });

        return { input: radioButton, container };
    }

    // Function to get the appropriate item selector and default display style
    function getViewModeConfig() {
        const listViewItems = document.querySelectorAll('.list-view');
        if (listViewItems.length > 0) {
            return { selector: '.list-view', display: 'flex' };
        }
        return { selector: '.d-block', display: 'block' };
    }

    // Function to update pagination URLs
    function updatePaginationUrls(filterValue) {
        const paginationLinks = document.querySelectorAll('.pagination .page-link');
        paginationLinks.forEach(link => {
            const url = new URL(link.href, window.location.origin); // Parse the current URL
            url.searchParams.set('MKScriptsFilter', filterValue); // Add or update the parameter
            link.href = url.toString(); // Update the link
        });
    }

    // Event listener for "Show All"
    function showAll() {
        const { selector, display } = getViewModeConfig();
        const divs = document.querySelectorAll(selector);
        divs.forEach(div => (div.style.display = display));
        updatePaginationUrls('showAll');
    }

    // Event listener for "Regular Sale"
    function regularSale() {
        const { selector, display } = getViewModeConfig();
        const divs = document.querySelectorAll(selector);
        divs.forEach(div => {
            const badge = div.querySelector(spanBadgeWarningSelector);
            if (badge && (badge.textContent.includes('Lowest price ever') || badge.textContent.includes('Matches previous low'))) {
                div.style.setProperty('display', 'none', 'important');
            } else {
                div.style.display = display;
            }
        });
        updatePaginationUrls('regularSale');
    }

    // Event listener for "Matches Previous Low"
    function matchesPreviousLow() {
        const { selector, display } = getViewModeConfig();
        const divs = document.querySelectorAll(selector);
        divs.forEach(div => {
            const badge = div.querySelector(spanBadgeWarningSelector);
            if (badge && badge.textContent.includes('Matches previous low')) {
                div.style.display = display;
            } else {
                div.style.setProperty('display', 'none', 'important');
            }
        });
        updatePaginationUrls('matchesPreviousLow');
    }

    // Event listener for "Lowest Price Ever"
    function lowestPriceEver() {
        const { selector, display } = getViewModeConfig();
        const divs = document.querySelectorAll(selector);
        divs.forEach(div => {
            const badge = div.querySelector(spanBadgeWarningSelector);
            if (badge && badge.textContent.includes('Lowest price ever')) {
                div.style.display = display;
            } else {
                div.style.setProperty('display', 'none', 'important');
            }
        });
        updatePaginationUrls('lowestPriceEver');
    }

})();