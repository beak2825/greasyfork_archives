// ==UserScript==
// @name         (PDA) Armory Button On Travel Page
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a faction armory button beside the travel button for quick access to use empty blood bags before travelling
// @match        https://www.torn.com/travelagency.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516302/%28PDA%29%20Armory%20Button%20On%20Travel%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/516302/%28PDA%29%20Armory%20Button%20On%20Travel%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the Faction Armory button next to each travel button
    function checkAndModify() {
        // Locate all "CONTINUE" buttons inside the .travel-buttons container
        const travelButtons = document.querySelectorAll('.travel-buttons .torn-btn.btn-dark-bg');

        // Loop through each travel button
        travelButtons.forEach(travelButton => {
            // Check if a new button has already been added next to this one
            if (!travelButton.nextElementSibling || !travelButton.nextElementSibling.classList.contains('new-button')) {
                // Create a new anchor element (link) for the button
                const newButton = document.createElement('a');
                newButton.className = 'torn-btn btn-dark-bg new-button'; // Add class to identify it
                newButton.innerText = 'Faction Armory'; // Set text for new button
                newButton.href = 'https://www.torn.com/factions.php?step=your#/tab=armoury&start=0&sub=medical'; // Set the URL for the link
                newButton.target = '_blank'; // Open in new tab
                newButton.style.marginLeft = '10px';

                const newButtonLocation = travelButton.closest('.travel-info-btn.btn-wrap.silver.c-pointer');
                // Insert the new button directly after the existing travel button
                newButtonLocation.parentNode.insertBefore(newButton, newButtonLocation.nextSibling);
            }
        });
    }

    // Use MutationObserver to monitor changes in the DOM for dynamically loaded content
    const observer = new MutationObserver((mutationsList, observer) => {
        // Trigger the function when the travel buttons appear
        const travelButtons = document.querySelectorAll('.travel-buttons .torn-btn.btn-dark-bg');
        if (travelButtons.length > 0) {
            checkAndModify(); // Modify all the travel buttons
            observer.disconnect(); // Stop observing after modification is done
        }
    });

    // Start observing the document for changes (e.g., loading additional buttons)
    observer.observe(document.body, { childList: true, subtree: true });

})();
