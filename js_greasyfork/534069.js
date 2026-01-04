// ==UserScript==
// @name         Google Drive Auto Download Countdown
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Countdown + auto-click for Google Drive, cancels on user manual click
// @author       MoodyMonkey
// @match        *://drive.usercontent.google.com/download?id=*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534069/Google%20Drive%20Auto%20Download%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/534069/Google%20Drive%20Auto%20Download%20Countdown.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function startCountdown() {
        const downloadButton = document.getElementById('uc-download-link');
        if (!downloadButton) {
            console.log('Waiting for download button... 🕛');
            setTimeout(startCountdown, 500);
            return;
        }

        const countdownText = document.createElement('div');
        countdownText.style.marginBottom = '10px';
        countdownText.style.fontSize = '16px';
        countdownText.style.fontWeight = 'bold';
        countdownText.style.color = '#d9534f';

        downloadButton.parentNode.insertBefore(countdownText, downloadButton);

        let count = 5;
        let timer = null;
        let manuallyClicked = false;

        countdownText.textContent = `Download will start automatically in ${count}...`;

        function updateCountdown() {
            if (manuallyClicked) {
                console.log('Countdown canceled due to manual click.');
                clearInterval(timer);
                countdownText.textContent = 'Download started manually.';
                return;
            }

            count--;
            if (count >= 0) {
                countdownText.textContent = `Download will start automatically in ${count}...`;
            }
            if (count === 0) {
                clearInterval(timer);
                console.log('Countdown reached zero. Triggering download!');
                if (!manuallyClicked) {
                    downloadButton.click();
                }
            }
        }

        timer = setInterval(updateCountdown, 1000);

        //  Listen for mousedown (fires BEFORE click+submit)
        downloadButton.addEventListener('mousedown', () => {
            manuallyClicked = true;
            console.log('Manual mousedown detected! Countdown canceled immediately');
            clearInterval(timer);
            countdownText.textContent = 'Download started manually.';
        }, { once: true }); // Fires only once
    }

    startCountdown();
})();
