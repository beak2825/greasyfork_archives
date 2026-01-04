// ==UserScript==
// @name         NitroType Total Races Script
// @namespace    https://www.nitrotype.com/racer/nothingbutskill
// @version      1.0
// @description  Finds out the total number of races of a Nitro Type player
// @match        https://nitrotype.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462236/NitroType%20Total%20Races%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/462236/NitroType%20Total%20Races%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the racer link to visit
    var racerLink = "https://nitrotype.com/racer/nothingbutskill";

    // Check if the current page is the racer link
    if (window.location.href === racerLink) {
        // Get the total races element
        var totalRacesElement = document.querySelector('.stat-races-completed .stat-value');
        if (totalRacesElement) {
            // Get the total races value
            var totalRaces = parseInt(totalRacesElement.textContent.trim().replace(/,/g, ''));
            
            // Display the total races value
            alert("The total number of races of " + racerLink + " is " + totalRaces);
        }
    }
})();
