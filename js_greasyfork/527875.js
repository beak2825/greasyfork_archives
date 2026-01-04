// ==UserScript==
// @name         Klavia Autoreload (
// @namespace    https://playklavia.com/
// @version      3.8
// @description  Reloads after the race
// @author       augman
// @match        https://playklavia.com/race
// @match        https://ntcomps.com/race
// @match        https://playklavia.com/lobbies/*
// @match        https://ntcomps.com/lobbies/*
// @match        https://klavia.io/lobbies/*
// @match        https://klavia.io/race
// @match        *://*.klavia.io/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527875/Klavia%20Autoreload%20%28.user.js
// @updateURL https://update.greasyfork.org/scripts/527875/Klavia%20Autoreload%20%28.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("🔄 Klavia Autoreload Script Initialized");

    let alreadyClicked = false; // Prevent duplicate clicks

    // Function to verify button readiness
    function isButtonReady(button) {
        return (
            button &&
            window.getComputedStyle(button).display !== "none" && // Button is visible
            !button.disabled && // Button is enabled
            button.innerText.includes("Race Again") // Button has the correct text
        );
    }

    // Function to click the button when ready
    function clickRaceAgain() {
        console.log("🔍 Checking 'Race Again!' button...");

        const raceButton = document.querySelector("#race-again");
        if (isButtonReady(raceButton)) {
            console.log("📍 Button is ready to be clicked!");

            if (!alreadyClicked) {
                alreadyClicked = true; // Prevent multiple clicks
                setTimeout(() => {
  raceButton.click();
}, 100);
                console.log("🎯 Successfully clicked the 'Race Again!' button!");

                setTimeout(() => {
                    alreadyClicked = false; // Reset for the next round
                    console.log("♻️ Ready for the next race...");
                }, 1000);
            } else {
                console.log("⚠️ Button already clicked. Waiting for reset...");
            }
        } else {
            console.log("🚫 Button not ready. Retrying...");
        }
    }

    // Periodically check for the button every 500ms
    const buttonCheckInterval = setInterval(clickRaceAgain, 500);
})();
