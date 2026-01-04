// ==UserScript==
// @name         Hide Elements
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide specific elements on a webpage
// @author       Mike
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488028/Hide%20Elements.user.js
// @updateURL https://update.greasyfork.org/scripts/488028/Hide%20Elements.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements
    function hideElements() {
        // Define the CSS selectors for the elements you want to hide
        var selectors = [
        // add DOM elements here.
        ''
	];

        // Loop through the selectors
        selectors.forEach(function(selector) {
            // Find the element
            var element = document.querySelector(selector);

            // If the element exists, hide it
            if (element) {
                element.style.display = 'none';
            }
        });
    }
    // Call hideElements function when the DOM content is loaded or modified
    document.addEventListener('DOMContentLoaded', hideElements);
    document.addEventListener('DOMNodeInserted', hideElements);
})();