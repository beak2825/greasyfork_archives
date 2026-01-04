// ==UserScript==
// @name         Oslo police station appointment script
// @namespace    http://tampermonkey.net/
// @version      2025-05-27
// @description  Auto-click with countdown timer, availability alert, and sound
// @author       alespool
// @match        https://politietbooking.nemo-q.se/Booking/Booking/Index/avtale
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537448/Oslo%20police%20station%20appointment%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/537448/Oslo%20police%20station%20appointment%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const timerDisplay = document.createElement('div');
    timerDisplay.style.position = 'fixed';
    timerDisplay.style.top = '10px';
    timerDisplay.style.right = '10px';
    timerDisplay.style.padding = '10px';
    timerDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    timerDisplay.style.color = 'white';
    timerDisplay.style.fontSize = '20px';
    document.body.appendChild(timerDisplay);

    let timeLeft = 10;

    function playAlertSound() {
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-1.mp3');
        let playCount = 0;

        function playSound() {
            if (playCount < 3) {
                audio.play();
                playCount++;
                audio.onended = playSound;
            }
        }
        playSound();
    }

    function checkAvailability() {
        const noAppointmentText = "Unfortunately, there are no available appointments at the moment. Please try again later or contact the police.";
        const pageContent = document.body.innerText || document.body.textContent;

        if (!pageContent.includes(noAppointmentText)) {
            playAlertSound();
        }
    }

    const countdown = setInterval(() => {
        if (timeLeft > 0) {
            timerDisplay.innerText = `Click within ${timeLeft} seconds...`;
            timeLeft--;
        } else {
            timeLeft = 10;

            const bouton = document.querySelector('input[name="TimeSearchFirstAvailableButton"]');
            if (bouton) {
                bouton.click();
            }

            checkAvailability();
        }
    }, 1000);
})();