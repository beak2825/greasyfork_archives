// ==UserScript==
// @name            Torn Quick Race
// @namespace       https://swc-bsd.com/
// @description     Add quick custom race buttons to Torn Racing
// @version         1.2
// @author          castiron
// @match           https://www.torn.com/loader.php?sid=racing*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/525470/Torn%20Quick%20Race.user.js
// @updateURL https://update.greasyfork.org/scripts/525470/Torn%20Quick%20Race.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function isJQueryAvailable() {
        return typeof $ !== "undefined";
    }

    function createRaceButton(id, label, carID, minDrivers, maxDrivers, trackID, laps) {
        if (!isJQueryAvailable()) {
            console.warn("jQuery is not available. Exiting script.");
            return;
        }

        const raceName = `${label} @ ${maxDrivers} driver ${laps} lap`;
        const buttonId = id.replace(/\s+/g, '');

        const $title = $('div.content-title > h4');
        if ($title.length > 0 && $(`#${buttonId}`).length === 0) {
            const buttonHTML = `
                <button id="${buttonId}" class="custom-race-button">${label}</button>
                <span id="${buttonId}Result" class="result-text"></span>
            `;
            $title.append(buttonHTML);

            $(`#${buttonId}`).on('click', () => {
                $(`#${buttonId}Result`).text('');

                const url = `https://torn.com/loader.php?sid=racing&tab=customrace&action=getInRace&step=getInRace&id=&carID=${carID}&createRace=true&title=${encodeURIComponent(raceName)}&minDrivers=${minDrivers}&maxDrivers=${maxDrivers}&trackID=${trackID}&laps=${laps}&minClass=5&carsTypeAllowed=1&carsAllowed=5&betAmount=0&waitTime=${Math.floor(Date.now()/1000)}&rfcv=${getRFC()}`;

                window.location.href = url;
                console.log(`${label} button clicked, redirecting...`);
            });
        }
    }

    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .custom-race-button {
                color: var(--default-blue-color);
                cursor: pointer;
                margin-right: 0;
                padding: 5px 10px;
                border: 1px solid var(--default-blue-color);
                background: transparent;
                border-radius: 5px;
                transition: background 0.2s ease-in-out;
            }
            .custom-race-button:hover {
                background: var(--default-blue-color);
                color: white;
            }
            .result-text {
                font-size: 12px;
                font-weight: 100;
                margin-left: 5px;
            }
        `;
        document.head.appendChild(style);
    }

    function createRaceButtons() {
        createRaceButton("Docks", "Docks", 956529, 2, 2, 10, 100);
        createRaceButton("Speedway", "Speedway", 390680, 2, 2, 21, 1);
        createRaceButton("Docks", "Docks", 956529, 2, 2, 10, 1);
    }

    function init() {
        addStyles();
        createRaceButtons();
    }

    init();
})();