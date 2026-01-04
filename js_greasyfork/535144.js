// ==UserScript==
// @name         IdlePixel Auto Shiny Breeder
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically kill's non-shinies and retry until a shiny is found
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535144/IdlePixel%20Auto%20Shiny%20Breeder.user.js
// @updateURL https://update.greasyfork.org/scripts/535144/IdlePixel%20Auto%20Shiny%20Breeder.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let shinyHuntActive = false;
    let missingDialogCounter = 0;

    // Adds the "Shiny Finder" button to the breeding dialog
    function addShinyHuntButton() {
        const dialog = document.querySelector("#breeding-overhaul-new-animal-dialog");
        if (!dialog || document.getElementById("shiny-hunt-button")) return;

        // Check if the current item is shiny before adding the button
        const isShiny = dialog.innerText.includes("Shiny!") && !dialog.innerText.includes("Mega Shiny!");
        if (isShiny) return;  // Skip adding the button if the item is shiny

        const button = document.createElement("button");
        button.id = "shiny-hunt-button";
        button.textContent = "Shiny Finder";
        button.style.backgroundColor = "#FFD700";
        button.onclick = () => {
            shinyHuntActive = true;
            missingDialogCounter = 0; // Reset counter on start
            attemptKillLoop();
        };

        const container = dialog.querySelector(".v-flex.half-gap:last-of-type");
        if (container) container.appendChild(button);
    }

    // Handles the shiny checking and kill loop
    function attemptKillLoop() {
        const dialog = document.querySelector("#breeding-overhaul-new-animal-dialog");

        if (!dialog || !dialog.open) {
            if (shinyHuntActive) {
                missingDialogCounter++;
                if (missingDialogCounter >= 5) { // ~5 seconds
                    shinyHuntActive = false;
                    missingDialogCounter = 0;
                    alert("Shiny Finder stopped");
                }
            }
            return;
        }

        // Reset missing counter since dialog is found
        missingDialogCounter = 0;

        const isShiny = dialog.innerText.includes("Shiny!") && !dialog.innerText.includes("Mega Shiny!");

        if (isShiny) {
            shinyHuntActive = false;
            alert("🎉 Shiny found!");
            return;
        }

        const killRetryBtn = [...dialog.querySelectorAll("button")]
            .find(btn => btn.textContent.includes("Kill & Try Again"));

        if (killRetryBtn) killRetryBtn.click();
    }

    // Interval loop
    setInterval(() => {
        addShinyHuntButton();
        if (shinyHuntActive) attemptKillLoop();
    }, 1000);
})();
