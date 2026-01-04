// ==UserScript==
// @name         Boycot 2K/Gearbox Games On Steam
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight 2K/Gearbox games on Steam
// @author       SwanKnight
// @match        https://store.steampowered.com/*
// @icon         https://www.google.com/s2/favicons?domain=store.steampowered.com
// @grant        none
// @license     GPLv3
// @downloadURL https://update.greasyfork.org/scripts/541064/Boycot%202KGearbox%20Games%20On%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/541064/Boycot%202KGearbox%20Games%20On%20Steam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of publishers/developers to check for
    const publishers = [
        '2K',
        'Gearbox'
    ];

    // Function to check and highlight games by specific publishers/developers
    function highlightGamesByPublishers() {
        // Find all DIVs with class "dev_row"
        let devRows = document.getElementsByClassName('dev_row');

        // Loop through each dev_row DIV
        for (let i = 0; i < devRows.length; i++) {
            let devRow = devRows[i];

            // Find all anchor tags within the dev_row
            let anchors = devRow.getElementsByTagName('a');

            // Loop through each anchor tag
            for (let j = 0; j < anchors.length; j++) {
                let anchor = anchors[j];
                let anchorText = anchor.textContent.toLowerCase();

                // Check if the anchor's text content includes any of the publishers (case-insensitive)
                for (let k = 0; k < publishers.length; k++) {
                    if (anchorText.includes(publishers[k].toLowerCase())) {
                        // Find the DIV with ID "appHubAppName" and set its background color to bright red
                        let appHubAppName = document.getElementById('appHubAppName');
                        if (appHubAppName) {
                            // Check if the text has already been modified
                            if (!appHubAppName.innerText.startsWith("(Boycot 2K/Gearbox)")) {
                                appHubAppName.style.backgroundColor = 'red';
                                appHubAppName.style.color = 'grey';
                                appHubAppName.style.textDecoration = "line-through";
                                appHubAppName.innerText = "(Boycot 2K/Gearbox) " + appHubAppName.innerText;
                            }
                        }
                        break; // Exit the loop once the first match is found
                    }
                }
            }
        }
    }

    // Run the function when the page loads
    window.addEventListener('load', highlightGamesByPublishers);
})();
