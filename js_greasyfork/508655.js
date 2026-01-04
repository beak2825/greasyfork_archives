// ==UserScript==
// @name         Hide Specific Divs on WSJ after Load
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Hide divs with specific class patterns on WSJ after page load
// @author       Your Name
// @match        https://www.wsj.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508655/Hide%20Specific%20Divs%20on%20WSJ%20after%20Load.user.js
// @updateURL https://update.greasyfork.org/scripts/508655/Hide%20Specific%20Divs%20on%20WSJ%20after%20Load.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to check if a class name has exactly 6 groups of 3-character strings
    function isClassMatchingPattern(className) {
        const pattern = /^[A-Za-z0-9]{3}(\s[A-Za-z0-9]{3}){5}$/;
        return pattern.test(className);
    }

    // Function to hide matching divs
    function hideMatchingDivs() {
        // Get all div elements on the page
        const divs = document.querySelectorAll('div');

        // Loop through each div and hide the ones with matching class pattern
        divs.forEach(div => {
            const className = div.className.trim();
            if (isClassMatchingPattern(className)) {
                div.style.display = 'none';  // Hide the div
            }
        });
    }

    // Wait until the page is fully loaded
    window.addEventListener('load', function() {
        hideMatchingDivs();  // Hide divs after the page has loaded
    });

})();
