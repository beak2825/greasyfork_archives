// ==UserScript==
// @name         Director Last Action with Delayed Updates
// @namespace    https://www.torn.com/
// @version      2.5
// @description  Highlight company directors and display their last action online, with delayed updates.
// @author       SuperGogu [3580072]
// @match        https://www.torn.com/joblist.php*
// @run-at       document-end
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/533618/Director%20Last%20Action%20with%20Delayed%20Updates.user.js
// @updateURL https://update.greasyfork.org/scripts/533618/Director%20Last%20Action%20with%20Delayed%20Updates.meta.js
// ==/UserScript==

const API_KEY = "yourapikey"; // Replace with your API-key --- ###PDA-APIKEY### for TORN-PDA

(function () {
    'use strict';

    async function processDirectors() {
        const companiesList = document.querySelectorAll('.company-list .item');

        companiesList.forEach(async company => {
            const directorElement = company.querySelector('.director');
            if (!directorElement) return;

            // Extract ID of the director
            const directorLink = directorElement.querySelector('a');
            if (directorLink) {
                const directorID = directorLink.href.split('XID=')[1];

                // Check if timestamp is already added
                const hasTimestamp = directorLink.textContent.includes(":");
                if (hasTimestamp) return;

                // Call api to get `last_action.relative`
                if (directorID) {
                    try {
                        const response = await fetch(`https://api.torn.com/user/${directorID}?key=${API_KEY}&selections=profile`);
                        if (!response.ok) throw new Error('API call failed');

                        const data = await response.json();
                        const lastAction = data.last_action?.relative || 'Unknown';

                        // Add last action time after director name
                        directorLink.textContent += `: ${lastAction}`;
                    } catch (error) {
                        console.error(`Failed to fetch data for director ID ${directorID}:`, error);
                    }
                }
            }
        });
    }

    // Initial start after 5 seconds
    setTimeout(() => {
        processDirectors();

        // Keep updating once every 60 seconds
        setInterval(() => {
            processDirectors();
        }, 60000); // 60.000 ms = 1 minut
    }, 5000); // 5.000 ms = 5 secunde
})();