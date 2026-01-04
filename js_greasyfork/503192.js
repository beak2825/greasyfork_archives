// ==UserScript==
// @name         Aternos All In One
// @namespace    heyxferdi Scripts
// @version      1.0
// @description  Adblock, Auto Start, Auto Confirm, and automatically extends the server time. | basically just "Aternos Ultimate Script 2024" by MITEBOSS with some improvement on Auto Confirm the queue, credits to MITEBOSS.
// @author       heyxferdi
// @license      MIT
// @match        https://aternos.org/*
// @icon         https://static.wikia.nocookie.net/minecraft_gamepedia/images/c/c7/Grass_Block.png/revision/latest?cb=20230226144250
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/503192/Aternos%20All%20In%20One.user.js
// @updateURL https://update.greasyfork.org/scripts/503192/Aternos%20All%20In%20One.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Overriding Date.now to prevent adblock detection
    let oldDateNow = Date.now;
    unsafeWindow.Date.now = function () {
        try {
            throw new Error();
        } catch (e) {
            if (e.stack.includes('data:text/javascript')) {
                throw new Error();
            } else {
                return oldDateNow();
            }
        }
    };

    // Intersection Observer to handle extend button
    const extendButtonObserver = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const extendButton = entry.target;
                if (extendButton.textContent.trim().toLowerCase() !== "stop") {
                    extendButton.click();
                }
                observer.unobserve(extendButton);
            }
        });
    }

    // Function to observe extend button visibility
    function checkButtonVisibility() {
        const extendButton = document.querySelector('.btn.btn-tiny.btn-success.server-extend-end');
        if (extendButton) {
            extendButtonObserver.observe(extendButton);
        } else {
            console.error('[Aternos Extend Server Time] Button not found.');
        }
    }

    // Function to check the timer and extend server time at 1:00
    function checkTimerAndExtend() {
        const timerElement = document.querySelector('.server-end-countdown');
        if (timerElement) {
            const timerValue = timerElement.textContent.trim();
            if (timerValue === '1:00') {
                const extendButton = document.querySelector('.btn.btn-tiny.btn-success.server-extend-end');
                if (extendButton && extendButton.textContent.trim().toLowerCase() !== "stop") {
                    extendButton.click();
                }
            }
        }
    }

    // Function to check for white screen and refresh the page if detected
    function checkForWhiteScreen() {
        const whiteScreenElement = document.querySelector('.white-screen-element');
        if (whiteScreenElement) {
            console.error('[Aternos White Screen] White screen detected. Refreshing page...');
            window.location.reload();
        }
    }

    // Function to check if the server is offline and click the "Start" button if it is
    function checkAndStartServerIfOffline() {
        const serverStatus = document.querySelector('.server-actions');
        if (serverStatus && serverStatus.classList.contains('offline')) {
            const startButton = document.querySelector('#start');
            if (startButton && startButton.offsetParent !== null) {
                startButton.click();
            }
        }
    }

    // Function to check if the server is Ready and click the "Confirm" button if it is
    function checkAndClickConfirmButton() {
        const serverStatus = document.querySelector('.server-actions');
        if (serverStatus && serverStatus.classList.contains('queueing')) {
            const confirmButton = document.querySelector('#confirm');
            if (confirmButton && confirmButton.offsetParent !== null) {
                confirmButton.click();
            }
        }
    }

    // Function to click the "No" button if the alert dialog is present
    function clickNoButtonIfAlertPresent() {
        const alertDialog = document.querySelector('dialog.alert.alert-danger');
        if (alertDialog && alertDialog.open) {
            const noButton = alertDialog.querySelector('.btn-danger');
            if (noButton) {
                noButton.click();
            }
        }
    }

    // Set up intervals to check continuously
    const checkInterval = 3000; // 3 second
    setInterval(checkButtonVisibility, checkInterval);
    setInterval(checkTimerAndExtend, checkInterval);
    setInterval(checkForWhiteScreen, checkInterval);
    setInterval(checkAndStartServerIfOffline, checkInterval);
    setInterval(clickNoButtonIfAlertPresent, checkInterval);
    setInterval(checkAndClickConfirmButton, checkInterval);
})();
