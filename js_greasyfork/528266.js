// ==UserScript==
// @name        Google Maps Extra Stops
// @namespace   Violentmonkey Scripts
// @match       https://www.google.de/maps/*
// @grant       none
// @version     1.0
// @author      -
// @description 15/02/2025, 11:25:18
// @downloadURL https://update.greasyfork.org/scripts/528266/Google%20Maps%20Extra%20Stops.user.js
// @updateURL https://update.greasyfork.org/scripts/528266/Google%20Maps%20Extra%20Stops.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add the functionality to the button
    function addButtonFunctionality() {
        const button = document.querySelector('.wZfvfe');

        if (button) {
            // Check if the click event has already been added
            if (button.hasAttribute('data-clicked')) {
                return;
            }

            // Add the click event to modify the URL
            button.addEventListener('click', () => {
                const currentUrl = window.location.href;

                // Pattern to match "@latitude,longitude,zoomz"
                const pattern = /(@-?\d+\.\d+,-?\d+\.\d+,\d+z)/;

                // Modify the URL by adding '/' before the matched pattern
                const newUrl = currentUrl.replace(pattern, '/$1');

                // If the URL was modified, navigate to the new URL
                if (newUrl !== currentUrl) {
                    window.location.href = newUrl;
                } else {
                    console.warn('No matching pattern found in URL');
                }
            });

            // Mark the button as "clicked" to prevent adding the event multiple times
            button.setAttribute('data-clicked', 'true');
            console.log('Click event added to button with class "wZfvfe".');
        }
    }

    // Check for the button initially
    addButtonFunctionality();

    // Use a MutationObserver to monitor changes in the DOM
    const observer = new MutationObserver(() => {
        addButtonFunctionality();
    });

    // Observe changes in the DOM for the button's presence
    observer.observe(document.body, { childList: true, subtree: true });

})();

