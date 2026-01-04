// ==UserScript==
// @name         Oslo police station appointment script with Pushover
// @namespace    http://tampermonkey.net/
// @version      2025-03-19.8
// @description  Auto-click with countdown timer, availability alert, sound, and Pushover notification
// @author       stalex9
// @match        https://politietbooking.nemo-q.se/Booking/Booking/Index/avtale
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530265/Oslo%20police%20station%20appointment%20script%20with%20Pushover.user.js
// @updateURL https://update.greasyfork.org/scripts/530265/Oslo%20police%20station%20appointment%20script%20with%20Pushover.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Timer display
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
 
    // Sound alert
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
 
    // Pushover notification
    function sendPushoverNotification(title, message) {
        const userKey = 'u2n2k95h67g3w1nufkcxk2ox6bxjzf';
        const apiToken = 'ahfbs7ws5mh1osdwagg9xokziux1e2';
 
        fetch('https://api.pushover.net/1/messages.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                token: apiToken,
                user: userKey,
                title: title,
                message: message,
                priority: '2',
                retry: '60',
                expire: '1800'
            })
        })
        .then(response => {
            if (!response.ok) {
                console.error('Errore invio notifica:', response.statusText);
            } else {
                console.log('✅ Notifica Pushover inviata!');
            }
        })
        .catch(error => console.error('Errore fetch:', error));
    }
 
    // Check appointment availability
    function checkAvailability() {
        const noAppointmentText = "Unfortunately, there are no available appointments at the moment at the selected location. Please try again later or contact the police.";
        const pageContent = document.body.innerText || document.body.textContent;
 
        if (!pageContent.includes(noAppointmentText)) {
            playAlertSound();
            sendPushoverNotification('🚨 Appointment Available!', 'Check the Oslo Police Booking page now!');
        }
    }
 
    // Countdown and auto-click
    const countdown = setInterval(() => {
        if (timeLeft > 0) {
            timerDisplay.innerText = `Clic dans ${timeLeft} secondes...`;
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
