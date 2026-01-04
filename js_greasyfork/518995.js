// ==UserScript==
// @name         WaifuGame Swiper Automation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automates the processing of swiper encounters in WaifuGame based on card rarity
// @author       You
// @match        https://waifugame.com/swiper
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518995/WaifuGame%20Swiper%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/518995/WaifuGame%20Swiper%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let encounterCounter = 1;

    // Function to send a POST request to the server
    function momsPostServer(id, action, successCallback, errorCallback) {
        $.ajax({
            type: 'POST',
            url: `/swiper/${id}`,
            data: JSON.stringify({ '_token': token, 'action': action }),
            contentType: 'application/json',
            dataType: 'json',
            success: successCallback,
            error: errorCallback
        });
    }

    // Function to fetch swiper encounters and start processing them
    function yourmom() {
        $.getJSON('/json/swiper_encounters', (data) => {
            console.log(`Loaded new encounters: ${data.encounters.length}`);
            if (data.encounters.length === 0) {
                console.log('No encounters found, retrying in 60 seconds...');
                setTimeout(yourmom, 60000); // Retry after 60 seconds if no encounters are found
            } else {
                processEncounters(data.encounters); // Start processing encounters if any are found
            }
        });
    }

    // Function to process each encounter based on its rarity
    function processEncounters(encounters, index = 0) {
        if (index >= encounters.length) {
            setTimeout(yourmom, 1000); // Restart the process after 1 second if all encounters are processed
            return;
        }

        const { id, card: { rarity } } = encounters[index];
        const action = rarity < 3 ? '🗑️' : '😘'; // Decide action based on rarity

        momsPostServer(id, action,
            (data) => {
                console.log(`Encounter ${encounterCounter} result: ${data.result}, (id: ${id})`);
                encounterCounter++;
                setTimeout(() => processEncounters(encounters, index + 1), 1000); // Process next encounter after 1 second
            },
            () => {
                setTimeout(yourmom, 1000); // Retry the entire process after 1 second if an error occurs
            }
        );
    }

    // Start the process when the script is run
    yourmom();

})();
