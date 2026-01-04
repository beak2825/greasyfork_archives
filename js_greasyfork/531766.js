// ==UserScript==
// @name         Stellar Odyssey - Galaxy Traveling Cooldown Ready Check
// @namespace    http://tampermonkey.net/
// @version      3.0.1
// @description  Checks every 15 seconds if the timer is 'Ready' and plays a sound. Redirects to Galaxy Map every 3 minutes if not on the correct page to perform the checks. only enable if you're constantly traveling.
// @author       Lighty
// @match        https://game.stellarodyssey.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stellarodyssey.app
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531766/Stellar%20Odyssey%20-%20Galaxy%20Traveling%20Cooldown%20Ready%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/531766/Stellar%20Odyssey%20-%20Galaxy%20Traveling%20Cooldown%20Ready%20Check.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let soundPlayed = false;

    function playSound() {
        const audio = new Audio("https://od.lk/s/MjRfNjg3NDE4OTdf/2currency.mp3");
        audio.volume = 0.5;
        audio.play().then(() => {
            console.log("Sound played successfully!");
        }).catch(error => {
            console.error("Error playing sound:", error);
            alert(`There was an error trying to play the sound: ${error.message}`);
        });
    }

    function checkReadyStatus() {
        try {
            const timerElement = document.querySelector("div.flex.items-center.row.q-px-xs span.text-green");

            if (timerElement) {
                const timerText = timerElement.innerText.trim();

                if (timerText.includes("Ready")) {
                    console.log(`[${new Date().toLocaleTimeString()}] Status: Ready.`);
                    playSound();
                }
            } else {
                console.log(`[${new Date().toLocaleTimeString()}] Timer element not found.`);
            }
        } catch (error) {
            console.error(`[${new Date().toLocaleTimeString()}] Error:`, error);
        }

        setTimeout(checkReadyStatus, 15000);
    }

    function enforceGalaxyMap() {
        if (window.location.href !== "https://game.stellarodyssey.app/#/galaxy") {
            console.log(`[${new Date().toLocaleTimeString()}] Redirecting to Galaxy Map...`);
            window.location.href = "https://game.stellarodyssey.app/#/galaxy";
        }
        setTimeout(enforceGalaxyMap, 120000);
    }

    const soundPrompt = document.createElement('div');
    soundPrompt.style.position = 'fixed';
    soundPrompt.style.bottom = '10px';
    soundPrompt.style.left = '10px';
    soundPrompt.style.padding = '10px';
    soundPrompt.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    soundPrompt.style.color = 'white';
    soundPrompt.style.borderRadius = '5px';
    soundPrompt.style.zIndex = '9999';
    soundPrompt.innerText = 'Click here to enable sound alerts for "Ready" status.';
    soundPrompt.style.cursor = 'pointer';

    soundPrompt.addEventListener('click', function() {
        soundPlayed = true;
        soundPrompt.style.display = 'none';
        console.log('User clicked to enable sound alerts.');
    });

    document.body.appendChild(soundPrompt);

    enforceGalaxyMap();
    checkReadyStatus();
})();
