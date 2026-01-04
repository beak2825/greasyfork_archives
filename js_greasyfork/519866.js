// ==UserScript==
// @name         PGA - nechání pouze jmen a odkazů
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Vymaže specifikované "td" elementy
// @match        https://www.sunshinetour.info/tic/tmscores.cgi?tourn=FRTS~*
// @match        https://pga-live.pga-tic.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519866/PGA%20-%20nech%C3%A1n%C3%AD%20pouze%20jmen%20a%20odkaz%C5%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/519866/PGA%20-%20nech%C3%A1n%C3%AD%20pouze%20jmen%20a%20odkaz%C5%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Regular expressions for patterns to match
    const regexPatterns = [
        /\b\d+=/,        // Match any number followed by "="
        /\+/,            // Match "+"
        /-/,             // Match "-"
        /N\/A/,          // Match "N/A"
        /\bPar\b/        // Match the word "Par" (case-sensitive)
    ];

    // Helper function to check if text matches any pattern
    function matchesPattern(text) {
        return regexPatterns.some(regex => regex.test(text));
    }

    // Iterate over all <fieldset> elements
    document.querySelectorAll('fieldset').forEach(fieldset => {
        // Inside each <fieldset>, find all <tr> elements
        const trs = fieldset.querySelectorAll('tr');

        // Iterate over each <tr> element within <fieldset>
        trs.forEach(tr => {
            // Get all <td> elements inside this <tr>
            const tdElements = Array.from(tr.querySelectorAll('td'));

            // Limit to the first three <td> elements
            const firstThreeTdElements = tdElements.slice(0, 3);

            // Iterate over the first three <td> elements and remove if they match any pattern
            firstThreeTdElements.forEach(td => {
                const text = td.innerText.trim(); // Trim text to avoid whitespace issues
                if (matchesPattern(text)) {
                    console.log("Removing <td> element:", td); // Log the element for debugging
                    td.remove(); // Remove the specific <td> element
                }
            });
        });
    });

})();