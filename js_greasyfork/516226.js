// ==UserScript==
// @name         (PC) Armory Button on Travel Page 
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a faction armory button beside the travel button for quick access to use empty blood bags before travelling
// @match        https://www.torn.com/travelagency.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516226/%28PC%29%20Armory%20Button%20on%20Travel%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/516226/%28PC%29%20Armory%20Button%20on%20Travel%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check the progress line and modify the travel buttons
    function checkAndModify() {
        // Find the parent container with class .bar___Bv5Ho.life___PlnzK.bar-desktop___p5Cas
        const parentContainer = document.querySelector('.bar___Bv5Ho.life___PlnzK.bar-desktop___p5Cas');

        if (parentContainer) {
            // Find the progress line element within the parent container
            const progressLine = parentContainer.querySelector('.progress-line___FhcBg');

            if (progressLine) {
                // Get the width as a percentage
                const width = parseFloat(progressLine.style.width);

                // Check if the width is more than 30%, meaning you can use an empty blood bag
                if (width > 30) {
                    // Locate all "TRAVEL" buttons inside .travel-info
                    const travelButtons = document.querySelectorAll('.travel-info .torn-btn.btn-dark-bg');

                    // Loop through each travel button and add a new button next to it
                    travelButtons.forEach(travelButton => {
                        // Add margin-left of 50px to the travel button
                        travelButton.style.marginLeft = '50px';

                        // Check if a new button has already been added next to this one
                        const nextSibling = travelButton.nextElementSibling;
                        if (!nextSibling || !nextSibling.classList.contains('new-button')) {
                            // Create a new anchor element (link) for the button
                            const newButton = document.createElement('a');
                            newButton.className = 'torn-btn btn-dark-bg new-button'; // Adding 'new-button' class to identify it
                            newButton.innerText = 'Faction Armory'; // Set text for new button
                            newButton.href = 'https://www.torn.com/factions.php?step=your#/tab=armoury&start=0&sub=medical'; // Set the URL for the link
                            newButton.target = '_blank'; // Open in a new tab
                            newButton.style.marginLeft = '25px';

                            const newButtonLocation = travelButton.closest('.travel-info-btn.btn-wrap.silver.c-pointer');
                            // Insert the new button directly after the existing travel button
                            newButtonLocation.parentNode.insertBefore(newButton, newButtonLocation.nextSibling);

                            // Find the closest .travel-info container and hide its .flight-price element
                            const travelInfoContainer = travelButton.closest('.travel-info');
                            if (travelInfoContainer) {
                                const flightPrice = travelInfoContainer.querySelector('.flight-price');
                                if (flightPrice) {
                                    flightPrice.style.display = 'none'; // Hide the flight price element
                                }
                            }
                        }
                    });

                    // Disconnect observer after modification is complete
                    observer.disconnect();
                }
            }
        }
    }

    // Set up a MutationObserver to watch for changes in the document
    const observer = new MutationObserver((mutationsList, observer) => {
        // Look for the progress line appearing in the mutations
        const progressLine = document.querySelector('.bar___Bv5Ho.life___PlnzK.bar-desktop___p5Cas .progress-line___FhcBg');
        if (progressLine) {
            checkAndModify();
        }
    });

    // Start observing for added nodes and subtree changes in the body
    observer.observe(document.body, { childList: true, subtree: true });

})();
