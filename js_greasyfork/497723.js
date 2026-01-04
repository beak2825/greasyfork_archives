// ==UserScript==
// @name         ChipPass
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bypasses Chip.gg GeoBlock
// @author       @officiallymelon
// @match        *://*.chips.gg/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497723/ChipPass.user.js
// @updateURL https://update.greasyfork.org/scripts/497723/ChipPass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove elements based on the provided selectors
    function removeElements() {
        // Selector for the "Restricted Country" message
        // Get the element and remove it if it exists
        const restrictedCountryElement = document.querySelector('.sc-aXZVg.sc-gEvEer.sc-eqUAAy.sc-iGgWBj.fRzEiv.jOxjSs.dVSjCO');
        if (restrictedCountryElement) {
            restrictedCountryElement.remove();
            console.log('Removed "Restricted Country" element.');
        }

        // Additional selectors and elements can be added in a similar fashion
        // ...
    }

    // Run the function to remove elements
    removeElements();

    // If the page content is loaded dynamically, observe changes and apply the removal function
    const observer = new MutationObserver(removeElements);
    observer.observe(document.body, { childList: true, subtree: true });

})();
