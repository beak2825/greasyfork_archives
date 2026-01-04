// ==UserScript==
// @name         Jump to Recipe - Serious Eats
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a "Jump to Recipe" button on Serious Eats pages
// @author       /u/boogeeb
// @match        https://www.seriouseats.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469321/Jump%20to%20Recipe%20-%20Serious%20Eats.user.js
// @updateURL https://update.greasyfork.org/scripts/469321/Jump%20to%20Recipe%20-%20Serious%20Eats.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let recipe = document.querySelector('#structured-project-content_1-0');
    // Create the "Jump to Recipe" button
    let button = document.createElement('button');
    button.innerText = 'Jump to Recipe';
    button.style.display = 'flex';
    button.style.margin = '1rem 1rem 0 0'; // Increase vertical margin
    button.style.border = '1px solid #333';
    button.style.borderRadius = '3px';
    button.style.padding = '.625rem .75rem .375rem'; // Increase padding
    button.style.height = '3rem'; // Increase height
    button.style.alignItems = 'center';
    button.style.fontFamily = '"Space Grotesk", Helvetica, sans-serif';
    button.style.fontSize = '1.5rem'; // Increase font size
    button.style.fontWeight = '600';
    button.style.color = '#333';
    button.style.lineHeight = '1.21';
    button.style.letterSpacing = '-.01em';
    button.style.textAlign = 'center';
    button.style.textTransform = 'none';
    button.style.background = '#fbf9ee';
    button.style.boxShadow = '2px 2px 0 #26b7c5';
    button.onclick = function() {
        // Find the recipe element
        if (recipe) {
            // Calculate the position to scroll to
            let rect = recipe.getBoundingClientRect();
            let scrollPos = window.pageYOffset + rect.top - 100; // Adjust this value as needed

            // Smoothly scroll to the calculated position
            window.scrollTo({ top: scrollPos, behavior: 'smooth' });
        }
    };

    // Find the heading element
    let heading = document.querySelector('#heading_1-0');
    if (recipe) {
        if (heading) {
            // Add the button to the page after the heading
            heading.insertAdjacentElement('afterend', button);
        } else {
            // If the heading isn't found, add the button at the top of the body
            document.body.insertBefore(button, document.body.firstChild);
        }
    }

})();
