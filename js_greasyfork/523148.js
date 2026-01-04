// ==UserScript==
// @name        Mangadex - Colorize Reading Status
// @namespace   Violentmonkey Scripts
// @match       https://mangadex.org/title/*
// @grant       none
// @version     1.1
// @author      fa3l 5er
// @description Change the color of the reading status button depending on the status in title page.
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/523148/Mangadex%20-%20Colorize%20Reading%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/523148/Mangadex%20-%20Colorize%20Reading%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to intercept fetch requests and check for 'status'
    const originalFetch = window.fetch;

    window.fetch = async function(input, init) {
        const response = await originalFetch(input, init);

        if (input.includes('status')) {
            // Clone the response to allow multiple reads
            const clonedResponse = response.clone();
            const data = await clonedResponse.json();

            if (data.status) {
                const element = document.querySelector('[data-v-fa81b2e8][data-v-c2249ac3].glow'); // Unreliable query, might need to be changed

                // Change color based on the status
                if (element) {
                    switch (data.status) {
                        case 'reading':
                            element.style.setProperty('--main-color', 'rgb(4 208 0)');
                            break;
                        case 'completed':
                            element.style.setProperty('--main-color', 'rgb(0 201 245)');
                            break;
                        case 'dropped':
                            element.style.setProperty('--main-color', 'rgb(255 64 64)');
                            break;
                        case 'plan_to_read':
                            element.style.setProperty('--main-color', 'GoldenRod');
                            break;
                        case 'on_hold':
                            element.style.setProperty('--main-color', 'rgb(218 117 0)');
                            break;
                        case 're_reading':
                            element.style.setProperty('--main-color', 'rgb(125 64 255)');
                            break;
                    }
                }
            }
        }

        return response; // Return the original response
    };
})();
