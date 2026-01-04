// ==UserScript==
// @name         Add Chalkboard SE to Google Docs/Slides
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds Chalkboard SE as an option to Google Docs and Slides font list
// @author       YourName
// @match        https://docs.google.com/document/d/*
// @match        https://docs.google.com/presentation/d/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508178/Add%20Chalkboard%20SE%20to%20Google%20DocsSlides.user.js
// @updateURL https://update.greasyfork.org/scripts/508178/Add%20Chalkboard%20SE%20to%20Google%20DocsSlides.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to inject Chalkboard SE into the font dropdown
    function addChalkboardFont() {
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if the font dropdown exists
                let fontDropdown = document.querySelector('[aria-label="Font"]');
                
                if (fontDropdown && !document.querySelector('.chalkboard-font-option')) {
                    // Create a new font option for Chalkboard SE
                    let newFontOption = document.createElement('div');
                    newFontOption.classList.add('goog-menuitem', 'goog-menuitem-content', 'chalkboard-font-option');
                    newFontOption.setAttribute('role', 'menuitem');
                    newFontOption.setAttribute('data-font', 'Chalkboard SE');
                    newFontOption.style.fontFamily = '"Chalkboard SE", cursive, sans-serif';
                    newFontOption.textContent = 'Chalkboard SE';
                    
                    // Add the new font option to the font dropdown
                    let fontMenu = document.querySelector('.docs-fontmenu ul');
                    if (fontMenu) {
                        fontMenu.appendChild(newFontOption);
                    }

                    // Event listener to apply the font when selected
                    newFontOption.addEventListener('click', function() {
                        document.execCommand('fontName', false, '"Chalkboard SE"');
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run the function to add Chalkboard SE after a delay to ensure the page has loaded
    window.setTimeout(addChalkboardFont, 2000);
})();
