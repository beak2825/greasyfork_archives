// ==UserScript==
// @name         View pet pages @ the pound!
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Quickly view pet pages in Neopets Pound
// @author       Moxsee
// @match        https://www.neopets.com/pound/adopt.phtml
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511803/View%20pet%20pages%20%40%20the%20pound%21.user.js
// @updateURL https://update.greasyfork.org/scripts/511803/View%20pet%20pages%20%40%20the%20pound%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add "View Pet" links
    function addViewPetLinks() {
        // Find all pet names and their corresponding IDs
        for (let i = 0; i < 3; i++) { // Assuming there are always 3 pets displayed
            const petDiv = document.getElementById(`pet${i}`);
            if (petDiv) {
                // Get the pet's name
                const petNameElement = document.getElementById(`pet${i}_name`);
                const petName = petNameElement ? petNameElement.textContent : '';

                // Create a new link element
                const viewLink = document.createElement('a');
                viewLink.href = `https://www.neopets.com/~${petName}`; // Update the URL to point to the pet page
                viewLink.textContent = 'View Pet';
                viewLink.target = '_blank'; // Open in new tab
                viewLink.style.marginLeft = '10px'; // Add some space

                // Append the link to the pet's name
                petNameElement.parentNode.appendChild(viewLink);
            }
        }
    }

    // Run the function to add the links
    addViewPetLinks();
})();