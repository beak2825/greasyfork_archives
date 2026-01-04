// ==UserScript==
// @name         Add Back Comic Sans to Google Docs/Slides
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  You want do bring back comic sans? Now You Can! With this userstyle BRINGS BACK COMIC SANS!
// @author       YourName
// @match        https://docs.google.com/document/d/*
// @match        https://docs.google.com/presentation/d/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508177/Add%20Back%20Comic%20Sans%20to%20Google%20DocsSlides.user.js
// @updateURL https://update.greasyfork.org/scripts/508177/Add%20Back%20Comic%20Sans%20to%20Google%20DocsSlides.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to inject Comic Sans into the font dropdown
    function addComicSansFont() {
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if the font dropdown exists
                let fontDropdown = document.querySelector('[aria-label="Font"]');
                
                if (fontDropdown && !document.querySelector('.comic-sans-option')) {
                    // Create a new font option for Comic Sans
                    let newFontOption = document.createElement('div');
                    newFontOption.classList.add('goog-menuitem', 'goog-menuitem-content', 'comic-sans-option');
                    newFontOption.setAttribute('role', 'menuitem');
                    newFontOption.setAttribute('data-font', 'Comic Sans MS');
                    newFontOption.style.fontFamily = '"Comic Sans MS", cursive, sans-serif';
                    newFontOption.textContent = 'Comic Sans';
                    
                    // Add the new font option to the font dropdown
                    let fontMenu = document.querySelector('.docs-fontmenu ul');
                    if (fontMenu) {
                        fontMenu.appendChild(newFontOption);
                    }

                    // Event listener to apply the font when selected
                    newFontOption.addEventListener('click', function() {
                        document.execCommand('fontName', false, '"Comic Sans MS"');
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run the function to add Comic Sans after a delay to ensure the page has loaded
    window.setTimeout(addComicSansFont, 2000);
})();
