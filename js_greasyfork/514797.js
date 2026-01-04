// ==UserScript==
// @name         Remove Specific TD Elements with Number=
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Remove only <td> elements containing any number followed by "="
// @match        https://www.sunshinetour.info/tic/tmscores.cgi?tourn=FRTS~*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514797/Remove%20Specific%20TD%20Elements%20with%20Number%3D.user.js
// @updateURL https://update.greasyfork.org/scripts/514797/Remove%20Specific%20TD%20Elements%20with%20Number%3D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Regular expression to match any number followed by "="
    const regex = /\b\d+=/;

    // Select all <td> elements on the page with any class
    document.querySelectorAll('td[class]').forEach(element => {
        // Check if the <td> element's innerText contains a match for the regex
        if (regex.test(element.innerText)) {
            console.log("Removing element:", element); // Log the element for debugging
            element.remove(); // Remove the specific <td> element if it matches
        }
    });
})();
