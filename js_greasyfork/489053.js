// ==UserScript==
// @name         [KPX] Copy Personal Stats
// @namespace    https://cartelempire.online/
// @version      0.3
// @description  Add a copy stats button to the personal stats section
// @author       KPCX
// @match        https://cartelempire.online/user
// @match        https://cartelempire.online/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489053/%5BKPX%5D%20Copy%20Personal%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/489053/%5BKPX%5D%20Copy%20Personal%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the waitForElements function
    function waitForElements(selector, duration, maxTries, identifier) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearInterval(interval);
                    resolve(elements);
                } else if (tries >= maxTries) {
                    clearInterval(interval);
                    reject(new Error(`Elements ${identifier} not found`));
                }
                tries++;
            }, duration);
        });
    }

    // Create the button
    let btn = document.createElement("button");
    btn.textContent = 'Copy stats';
    btn.className = "btn-outline-dark";
    btn.className = 'btn btn-outline-dark mt-2';
    btn.style.backgroundColor = 'rgba(33, 37, 41, 1)';
    btn.style.color = '#fff';

    // Function to copy stats
    btn.onclick = async function() {
        let stats = [];
        let rows = await waitForElements(".card-body.dark-tertiary-bg .table-responsive table", 200, 50, 'second table'); // Wait for the second table
        if (!rows) return;
        rows = rows[1].rows; // Select the second table
        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            let statName = row.cells[0].innerText;
            let statValue = row.cells[1].innerText;
            stats.push(statName + " " + statValue);
        }
        let statsText = stats.join("\n");

        // Copy to clipboard
        navigator.clipboard.writeText(statsText).then(function() {
            console.log('Copying to clipboard was successful!');
        }, function(err) {
            console.error('Could not copy text: ', err);
        });
    };

    // Add the button to the page
    waitForElements(".card-body.dark-tertiary-bg", 200, 50, 'second element with class "card-body dark-tertiary-bg"').then(personalStatsSection => { // Wait for the second element with class "card-body dark-tertiary-bg"
        if (!personalStatsSection) return;
        personalStatsSection[1].querySelector(".table-responsive").appendChild(btn); // Add the button to the second element with class "card-body dark-tertiary-bg"
    });
})();