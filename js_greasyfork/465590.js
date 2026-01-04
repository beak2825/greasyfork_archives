// ==UserScript==
// @name         Wanikani ExtraStudy Unburn Script v2
// @namespace    wanikani
// @version      0.1
// @description  Adds an "Unburn Item" button to burned item review sessions on Wanikani, allowing you to unburn the item if desired
// @author       ChatGPT / SoulLessPuppet
// @match        https://www.wanikani.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465590/Wanikani%20ExtraStudy%20Unburn%20Script%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/465590/Wanikani%20ExtraStudy%20Unburn%20Script%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to create the "Unburn Item" button and attach it to the appropriate place in the DOM
    function addUnburnButton() {
        // Find the element that contains the item information and the "Item Info" button
        const itemInfoEl = document.querySelector('#item-info');

        // Make sure the element exists before continuing
        if (!itemInfoEl) return;

        // Find the "Item Info" button
        const itemInfoButton = itemInfoEl.querySelector('button');

        // Make sure the button exists before continuing
        if (!itemInfoButton) return;

        // Create the "Unburn Item" button and add it to the DOM
        const unburnButton = document.createElement('button');
        unburnButton.classList.add('btn', 'btn-primary');
        unburnButton.textContent = 'Unburn Item';
        unburnButton.style.marginLeft = '10px';
        unburnButton.addEventListener('click', handleUnburnButtonClick);
        itemInfoButton.parentElement.appendChild(unburnButton);
    }

    // Define a function to handle clicks on the "Unburn Item" button
    function handleUnburnButtonClick() {
        // Display a confirmation popup
        const confirmed = confirm('Do you want to unburn this item?');

        // If the user confirmed, unburn the item
        if (confirmed) {
            // Find the "Burned" badge and remove it
            const burnedBadge = document.querySelector('.item-status-badge.burned');
            if (burnedBadge) burnedBadge.remove();

            // Find the "Apprentice" badge and add it
            const apprenticeBadge = document.querySelector('.item-status-badge.apprentice');
            if (apprenticeBadge) apprenticeBadge.classList.remove('hidden');

            // Find the "SRS Level" element and change it to "Apprentice I"
            const srsLevelEl = document.querySelector('.srs span');
            if (srsLevelEl) srsLevelEl.textContent = 'Apprentice I';

            // Find the "Add to Review" button and click it
            const addToReviewButton = document.querySelector('#option-item:not(.hidden) .label:contains("Add to Review")').parentElement;
            if (addToReviewButton) addToReviewButton.click();
        }
    }

    // Wait for the page to load, then add the "Unburn Item" button
    window.addEventListener('load', addUnburnButton);
})();
