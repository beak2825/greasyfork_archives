// ==UserScript==
// @name         Add Comic Sans MS to Google Docs/Slides (More Fonts + Search)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds Comic Sans MS to Google Docs/Slides, visible in "More Fonts" and when searched
// @author       YourName
// @match        https://docs.google.com/document/d/*
// @match        https://docs.google.com/presentation/d/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508181/Add%20Comic%20Sans%20MS%20to%20Google%20DocsSlides%20%28More%20Fonts%20%2B%20Search%29.user.js
// @updateURL https://update.greasyfork.org/scripts/508181/Add%20Comic%20Sans%20MS%20to%20Google%20DocsSlides%20%28More%20Fonts%20%2B%20Search%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to inject Comic Sans MS into "More Fonts" menu
    function injectComicSansInMoreFonts() {
        let observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if "More Fonts" menu exists
                let moreFontsDialog = document.querySelector('.docs-fontmenu ul');

                if (moreFontsDialog && !document.querySelector('.comic-sans-more-font-option')) {
                    // Create a new font option for Comic Sans MS
                    let newFontOption = document.createElement('div');
                    newFontOption.classList.add('goog-menuitem', 'goog-menuitem-content', 'comic-sans-more-font-option');
                    newFontOption.setAttribute('role', 'menuitem');
                    newFontOption.setAttribute('data-font', 'Comic Sans MS');
                    newFontOption.style.fontFamily = '"Comic Sans MS", cursive, sans-serif';
                    newFontOption.textContent = 'Comic Sans MS';

                    // Append the Comic Sans MS font to the "More Fonts" menu
                    moreFontsDialog.appendChild(newFontOption);

                    // Event listener to apply the font when selected from "More Fonts"
                    newFontOption.addEventListener('click', function() {
                        document.execCommand('fontName', false, '"Comic Sans MS"');
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Function to detect typing in the font search box and load Comic Sans MS
    function addComicSansOnSearch() {
        let searchObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                let fontSearchBox = document.querySelector('[aria-label="Font"]');

                if (fontSearchBox && !document.querySelector('.comic-sans-searched-option')) {
                    // Add event listener to detect when the user types into the font search box
                    fontSearchBox.addEventListener('input', function(e) {
                        if (e.target.value.toLowerCase() === 'comic sans ms') {
                            document.execCommand('fontName', false, '"Comic Sans MS"');
                        }
                    });
                }
            });
        });

        searchObserver.observe(document.body, { childList: true, subtree: true });
    }

    // Run the function to add Comic Sans MS after a delay to ensure the page has loaded
    window.setTimeout(injectComicSansInMoreFonts, 2000);
    window.setTimeout(addComicSansOnSearch, 2000);

})();
