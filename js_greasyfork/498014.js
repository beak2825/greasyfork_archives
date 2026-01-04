// ==UserScript==
// @name         [KPX] Auto-join expeditions in CartelEmpire
// @namespace    https://cartelempire.online/
// @version      0.2
// @description  Automate expedition actions on Cartel Empire
// @author       KPCX
// @match        https://cartelempire.online/*xpedition
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498014/%5BKPX%5D%20Auto-join%20expeditions%20in%20CartelEmpire.user.js
// @updateURL https://update.greasyfork.org/scripts/498014/%5BKPX%5D%20Auto-join%20expeditions%20in%20CartelEmpire.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to select "Team 1" in all dropdowns
    function selectTeam1() {
        let dropdowns = document.querySelectorAll('.expeditionTeamSelector');
        dropdowns.forEach((dropdown) => {
            dropdown.value = "1";
            let event = new Event('change', { bubbles: true });
            dropdown.dispatchEvent(event);
        });
    }

    // Function to check success percentages and click the "Start" button
    function checkSuccessPercentagesAndStart() {
        let successPercentages = document.querySelectorAll('.successChance');
        let maxPercentage = 0;
        let maxIndex = 0;
        successPercentages.forEach((percentage, index) => {
            let currentPercentage = parseInt(percentage.innerText.replace('%', ''));
            if (currentPercentage > maxPercentage) {
                maxPercentage = currentPercentage;
                maxIndex = index;
            }
        });
        console.log('Index of selection with highest success percentage:', maxIndex);
        let startButtons = document.querySelectorAll('.expeditionForm .btn');
        startButtons[maxIndex].click();
    }

    // Function to wait for a random delay and repeat the process
    function waitForDelayAndRepeat() {
        let delay = Math.random() * 60000 + 1200000; // Random delay between 20 and 21 minutes
        setTimeout(() => {
            let startButtons = document.querySelectorAll('.expeditionForm .btn');
            let isJobFinished = Array.from(startButtons).every((button) => button.disabled);
            if (isJobFinished) {
                selectTeam1();
                checkSuccessPercentagesAndStart();
                waitForDelayAndRepeat();
            }
        }, delay);
    }

    // Run the functions
    selectTeam1();
    checkSuccessPercentagesAndStart();
    waitForDelayAndRepeat();
})();