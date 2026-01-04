// ==UserScript==
// @name         Add Extra Fonts to Google Docs/Slides
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add extra fonts to the Google Docs and Google Slides font dropdown menus
// @match        https://docs.google.com/document/d/*
// @match        https://docs.google.com/presentation/d/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/508195/Add%20Extra%20Fonts%20to%20Google%20DocsSlides.user.js
// @updateURL https://update.greasyfork.org/scripts/508195/Add%20Extra%20Fonts%20to%20Google%20DocsSlides.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addFontsToDropdown() {
        // Wait for the Google Docs/Slides page to fully load
        const interval = setInterval(() => {
            // Select the font dropdown element
            const fontDropdown = document.querySelector('.quantumWizMenuPaperselectPopup');
            
            if (fontDropdown) {
                // Clear the interval once the dropdown is found
                clearInterval(interval);
                
                // Define the extra fonts to add
                const extraFonts = ['Comic Sans MS', 'Arial Black', 'Courier New'];
                
                // Add the extra fonts to the dropdown
                extraFonts.forEach(font => {
                    const fontOption = document.createElement('div');
                    fontOption.className = 'quantumWizMenuPaperselectOption';
                    fontOption.textContent = font;
                    fontDropdown.appendChild(fontOption);
                });

                // Optionally, you can also add event listeners to handle font selection
                // Example:
                // fontDropdown.addEventListener('click', function(event) {
                //     if (event.target && event.target.className.includes('quantumWizMenuPaperselectOption')) {
                //         const selectedFont = event.target.textContent;
                //         // Apply the selected font to the document
                //     }
                // });
            }
        }, 1000); // Check every second
    }

    // Add extra fonts to the dropdown when the page loads
    window.addEventListener('load', addFontsToDropdown);
})();
