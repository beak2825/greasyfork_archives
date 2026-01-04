// ==UserScript==
// @name         Tlačítko-live.nvplay
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Adds a button that dynamically generates a URL based on the current page URL and allows middle-click opening in a new tab without leaving the current page
// @author       YourName
// @match        https://live.nvplay.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511327/Tla%C4%8D%C3%ADtko-livenvplay.user.js
// @updateURL https://update.greasyfork.org/scripts/511327/Tla%C4%8D%C3%ADtko-livenvplay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add buttons
    function addButtons() {
        const matches = document.querySelectorAll('div[data-id].nvp-match');

        matches.forEach(match => {
            const dataId = match.getAttribute('data-id');

            // Find the corresponding div with class "nvp-match__matchup" within this match
            const matchupDiv = match.querySelector('div.nvp-match__matchup');
            const firstTeamDiv = matchupDiv.querySelector('div.nvp-match__team'); // Find the first team div

            if (firstTeamDiv && !firstTeamDiv.querySelector('button')) {  // Make sure the button is not already there
                // Get the current URL path
                const currentPath = window.location.pathname;
                const currentDomain = window.location.origin;

                // Generate the new URL based on the current path and domain
                const newUrl = `${currentDomain}${currentPath}?tab=m_summary#m${dataId}`;

                // Create the button as a span
                const span = document.createElement('span');
                const button = document.createElement('button');
                button.innerText = 'OPEN SUMMARY';

                // Apply styles to the button
                button.style.padding = '10px 15px';
                button.style.fontWeight = 'bold';
                button.style.color = 'white';
                button.style.backgroundColor = '#0000CD';
                button.style.border = 'none';
                button.style.borderRadius = '5px';
                button.style.cursor = 'pointer';
                button.style.fontSize = '16px';

                // Set the firstTeamDiv to flex display to align items
                firstTeamDiv.style.display = 'flex';
                firstTeamDiv.style.alignItems = 'center'; // Center align vertically

                // Create a wrapper for the button to position it correctly
                const buttonWrapper = document.createElement('div');
                buttonWrapper.style.marginLeft = 'auto'; // Push the button to the right
                buttonWrapper.appendChild(button);

                // Append the button wrapper to the firstTeamDiv
                firstTeamDiv.appendChild(buttonWrapper);

                // Set button click event for normal left click
                button.onclick = (e) => {
                    e.preventDefault();
                    window.open(newUrl, '_blank');
                };

                // Set button click event for middle mouse click (wheel click)
                button.addEventListener('auxclick', (e) => {
                    if (e.button === 1) { // Middle mouse click (wheel click)
                        e.preventDefault(); // Prevent default action
                        window.open(newUrl, '_blank'); // Open in new tab
                    }
                });
            }
        });
    }

    window.addEventListener('load', () => {
        // MutationObserver in case of dynamically loaded content
        const observer = new MutationObserver(addButtons);
        observer.observe(document.body, { childList: true, subtree: true });

        // Initial call to add buttons
        addButtons();
    });

})();
