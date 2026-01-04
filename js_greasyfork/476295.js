// ==UserScript==
// @name         Keep Focus and Display Regex Match
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Keep focus on a specific text field, clear its content, and display regex matches
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476295/Keep%20Focus%20and%20Display%20Regex%20Match.user.js
// @updateURL https://update.greasyfork.org/scripts/476295/Keep%20Focus%20and%20Display%20Regex%20Match.meta.js
// ==/UserScript==

 

 

(function() {
    'use strict';

 

 

    if (!document.title.includes("Item Inventory by Locn")) {
        return;
    }

 

 

    // Create a container to display the matching text
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = 'translate(-50%, -50%)';
    container.style.background = 'red';  // Set background to red
    container.style.color = 'white';  // Set text color to white
    container.style.zIndex = '9999';
    container.style.padding = '10px';
    container.style.whiteSpace = 'pre';  // Preserve whitespace and newlines
    //container.style.fontWeight = 'bold'; // Make text bold
    container.style.textAlign = 'center'; // Center-align text
    container.id = 'regexMatchContainer';
    document.body.appendChild(container);

 

 

    // Regular expressions to match the patterns
    const regex1 = /AS[A-Z0-9]-[A-Z0-9]{2}-[A-Z0-9]{2}-[A-Z0-9]{3}/g;
    const regex2 = /TI/g;  // New regex for "TI"

 

 

    // Function to keep focus on the text field and clear its content
    function keepFocus() {
        const element = document.querySelector('input[type="text"]');
        if (element && document.activeElement !== element) {
            element.focus();
            element.value = '';  // Clear the content
        }
    }

 

 

// Function to find and display matching text
function displayMatch() {
    // Clear previous matches
    document.getElementById('regexMatchContainer').innerText = '';

 

 

    const bodyText = document.body.innerText;
    const matches1 = bodyText.match(regex1) || [];
    const matches2 = bodyText.match(regex2) || [];

 

 

    let combinedMatches = matches1;

 

 

    // Include "TI" matches only if their count is more than 1
    if (matches2.length > 2) {
        combinedMatches = combinedMatches.concat(matches2);
    }

 

 

    // Remove duplicates from the combined matches
    const allMatches = Array.from(new Set(combinedMatches));

 

 

    // If matches are found, display them
    if (allMatches.length) {
        document.getElementById('regexMatchContainer').innerText = allMatches.join('\n');
    }
}

 

 

    // Run the keepFocus and displayMatch functions every 500 milliseconds
    setInterval(() => {
        keepFocus();
        displayMatch();
    }, 500);

 

 

})();