// ==UserScript==
// @name         Modify More Fonts in Google Docs/Slides
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds Select All button and makes the More Fonts tab modern and rounded in Google Docs/Slides
// @author       YourName
// @match        https://docs.google.com/document/d/*
// @match        https://docs.google.com/presentation/d/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508183/Modify%20More%20Fonts%20in%20Google%20DocsSlides.user.js
// @updateURL https://update.greasyfork.org/scripts/508183/Modify%20More%20Fonts%20in%20Google%20DocsSlides.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add a "Select All" button in the More Fonts tab
    function addSelectAllButton() {
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if the More Fonts dialog exists
                let moreFontsDialog = document.querySelector('.docs-fontmenu ul');

                // Check if the Select All button is already added
                if (moreFontsDialog && !document.querySelector('.select-all-button')) {
                    // Create the "Select All" button
                    let selectAllButton = document.createElement('button');
                    selectAllButton.classList.add('select-all-button');
                    selectAllButton.textContent = 'Select All';
                    selectAllButton.style.cssText = `
                        display: block;
                        margin: 10px auto;
                        padding: 10px 20px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    `;

                    // Event listener to select all fonts (or whatever action you want)
                    selectAllButton.addEventListener('click', function() {
                        let fontOptions = moreFontsDialog.querySelectorAll('.goog-menuitem');
                        fontOptions.forEach(font => {
                            // Trigger selection of each font (or simulate action here)
                            console.log('Selected font:', font.textContent);
                            // You can add more functionality to actually apply the font here
                        });
                    });

                    // Insert the Select All button at the top of the More Fonts dialog
                    moreFontsDialog.parentElement.insertBefore(selectAllButton, moreFontsDialog);
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to make the More Fonts dialog modern and rounded
    function modernizeMoreFonts() {
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if the More Fonts dialog exists
                let moreFontsDialog = document.querySelector('.docs-fontmenu');

                if (moreFontsDialog && !document.querySelector('.modernized-font-menu')) {
                    // Apply modern rounded styles to the More Fonts dialog
                    moreFontsDialog.classList.add('modernized-font-menu');
                    moreFontsDialog.style.cssText = `
                        border-radius: 15px;
                        padding: 15px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        background-color: white;
                    `;

                    // Style individual font options
                    let fontOptions = moreFontsDialog.querySelectorAll('.goog-menuitem');
                    fontOptions.forEach(fontOption => {
                        fontOption.style.cssText = `
                            padding: 10px 20px;
                            border-radius: 10px;
                            transition: background-color 0.2s ease;
                        `;
                        // Add hover effect
                        fontOption.addEventListener('mouseenter', function() {
                            fontOption.style.backgroundColor = '#f0f0f0';
                        });
                        fontOption.addEventListener('mouseleave', function() {
                            fontOption.style.backgroundColor = 'transparent';
                        });
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Run the functions after a delay to ensure the page has loaded
    window.setTimeout(addSelectAllButton, 2000);
    window.setTimeout(modernizeMoreFonts, 2000);

})();
