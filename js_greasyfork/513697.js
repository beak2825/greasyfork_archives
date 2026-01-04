// ==UserScript==
// @name         Auto Toggle Perplexity Pro on New Searches (Obsolete)
// @namespace    https://greasyfork.org/en/scripts/513697-auto-toggle-perplexity-pro-on-new-searches
// @version      1.2
// @icon         https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png
// @description  Automatically toggles Perplexity Copilot Pro Search on page load, when "New Thread" is clicked, or the Perplexity logo is clicked. Allows you to disable Pro search temporarily, but re-enables Pro Search after starting a new thread.
// @author       Stuart Saddler
// @match        https://www.perplexity.ai/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513697/Auto%20Toggle%20Perplexity%20Pro%20on%20New%20Searches%20%28Obsolete%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513697/Auto%20Toggle%20Perplexity%20Pro%20on%20New%20Searches%20%28Obsolete%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to trigger the toggle
    function toggleCopilotProSearch() {
        let toggleButton = document.getElementById('copilot-toggle');

        if (toggleButton) {
            console.log("Toggle button found. Checking state...");

            // Check if the button is unchecked (aria-checked="false")
            if (toggleButton.getAttribute('aria-checked') === 'false') {
                console.log("Toggling the button...");
                toggleButton.click(); // Simulate the toggle click
            } else {
                console.log("Button is already toggled on.");
            }
        }
    }

    // Function to listen for the "New Thread" div click
    function listenForNewThreadClick() {
        const newThreadDiv = document.querySelector('div.line-clamp-1.text-textOff');

        if (newThreadDiv && newThreadDiv.textContent.includes('New Thread')) {
            console.log('"New Thread" div detected. Adding click event listener...');

            // Add a click event listener to re-enable Pro search when "New Thread" is clicked
            newThreadDiv.addEventListener('click', function() {
                console.log('"New Thread" clicked. Re-enabling Pro search...');
                toggleCopilotProSearch();
            });
        } else {
            console.log('"New Thread" div not found.');
        }
    }

    // Function to listen for the Perplexity logo click
    function listenForLogoClick() {
        const logoDiv = document.querySelector('div.ml-xs.pl-md.pr-sm.pt-xs');

        if (logoDiv) {
            console.log('"Perplexity logo" detected. Adding click event listener...');

            // Add a click event listener to re-enable Pro search when the logo is clicked
            logoDiv.addEventListener('click', function() {
                console.log('"Perplexity logo" clicked. Re-enabling Pro search...');
                toggleCopilotProSearch();
            });
        } else {
            console.log('"Perplexity logo" not found.');
        }
    }

    // Function to observe DOM changes and detect when the "New Thread" or logo divs are added
    function observeDOMChanges() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.querySelector('div.line-clamp-1.text-textOff')) {
                        console.log('"New Thread" div added to the DOM. Setting up listener...');
                        listenForNewThreadClick();
                    }

                    if (node.nodeType === 1 && node.querySelector('div.ml-xs.pl-md.pr-sm.pt-xs')) {
                        console.log('"Perplexity logo" div added to the DOM. Setting up listener...');
                        listenForLogoClick();
                    }
                });
            });
        });

        // Observe changes to the entire document body
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Run the toggle function once the page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(toggleCopilotProSearch, 1000); // Delay initial check by 1 second

        // Start observing for dynamic changes (like when "New Thread" or the logo is pressed)
        observeDOMChanges();
        listenForNewThreadClick(); // Manually call to set up listener on page load
        listenForLogoClick();      // Manually call to set up listener on page load
    });

})();
