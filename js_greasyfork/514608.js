// ==UserScript==
// @name         Torn: Custom Race Setup
// @namespace    TornCustomRace
// @description  Customizable race setup for Torn City
// @version      0.3.2
// @license      MIT
// @author       Robodashy
// @match        https://www.torn.com/loader.php?sid=racing*
// @grant        none
// @update       https://update.greasyfork.org/scripts/514608/Torn%3A%20Custom%20Race%20Setup.user.js
// @downloadURL https://update.greasyfork.org/scripts/514608/Torn%3A%20Custom%20Race%20Setup.user.js
// @updateURL https://update.greasyfork.org/scripts/514608/Torn%3A%20Custom%20Race%20Setup.meta.js
// ==/UserScript==

/* 
   ---- User Configuration Section ----
   Adjust the following variables to customize the race setup
*/

const carID = 'your_car_id_here';  // Car ID (e.g., found by hovering over "remove from enlisted" in My Cars, looks like '&carID=649295')
const raceTitle = 'Custom Race';   // Title of the custom race, also displayed on the button
const startHourUTC = 14;           // Race start time in UTC (24-hour format). E.g., 14 for 14:00 UTC
const laps = 100;                  // Number of laps for the race
const trackID = 10;                // Track ID (e.g., 10 for Docks)
const minDrivers = 2;              // Minimum and maximum drivers allowed for the race
const maxDrivers = 100;
const minClass = 5;                // Class and car restrictions for the race
const carsTypeAllowed = 1;         // More details will be available in future updates
const carsAllowed = 5;
const betAmount = 0;               // Amount to bet on the race (0 for no bet)

/* ---- End of User Configuration Section ---- */

function addButton() {
    function checkAndAddButton() {
        const targetContainer = document.querySelector('#racingAdditionalContainer .btn-wrap.silver.c-pointer');
        const buttonExists = document.querySelector('#customRaceButton');

        if (targetContainer && !buttonExists) {
            // Create the button element
            const button = document.createElement('button');
            button.id = 'customRaceButton';
            button.className = 'btn btn-action-tab torn-btn btn-dark-bg';
            button.textContent = raceTitle;

            // Add a result display span for feedback
            const resultSpan = document.createElement('span');
            resultSpan.id = 'customRaceResult';
            resultSpan.style.fontSize = '12px';
            resultSpan.style.fontWeight = '100';

            // Append the button and span to the target container
            targetContainer.appendChild(button);
            targetContainer.appendChild(resultSpan);

            // Attach click event listener to the button
            button.addEventListener('click', () => {
                resultSpan.textContent = '';

                // Set the race time to the user-defined hour in UTC
                const now = new Date();
                const raceTimeUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), startHourUTC, 0, 0));
                const unixTimecode = Math.floor(raceTimeUTC.getTime() / 1000);

                // Construct the URL for the custom race
                const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace` +
                            `&id=&carID=${carID}&createRace=true&title=${encodeURIComponent(raceTitle)}` +
                            `&minDrivers=${minDrivers}&maxDrivers=${maxDrivers}&trackID=${trackID}&laps=${laps}` +
                            `&minClass=${minClass}&carsTypeAllowed=${carsTypeAllowed}&carsAllowed=${carsAllowed}` +
                            `&betAmount=${betAmount}&waitTime=${unixTimecode}&rfcv=${getRFC()}`;

                // Redirect to the constructed URL
                window.location = url;
                console.log(`${raceTitle} button clicked`);
            });
        }
    }

    // Use MutationObserver to check when the target container is added to the DOM
    const observer = new MutationObserver(checkAndAddButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run an initial check in case the element is already loaded
    checkAndAddButton();
}

// Ensure the function runs after the page is fully loaded
window.addEventListener('load', addButton);