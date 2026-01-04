// ==UserScript==
// @name         Autofarm V2
// @version      3
// @include      https://*/game.php*screen=am_farm*
// @namespace https://greasyfork.org/users/1388863
// @description Farmgod and send attack automatically at Loot Assistant at random intervals
// @downloadURL https://update.greasyfork.org/scripts/514955/Autofarm%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/514955/Autofarm%20V2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Get the domain name to uniquely identify the state
    const domain = window.location.hostname.split('.')[0]; // e.g., "en145" from "en145.tribalwars.net"

    // Retrieve the state from localStorage, defaulting to false (not running)
    let isRunning = JSON.parse(localStorage.getItem(domain + '_isRunning')) || false;
    let intervalId;
    let countdownInterval;

    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function pressEnterRandomly() {
        const delay = randomDelay(200, 250);
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            which: 13,
            keyCode: 13,
            bubbles: true
        }));
        intervalId = setTimeout(pressEnterRandomly, delay);
    }

    function loadFarmGodScript() {
        $.getScript('https://higamy.github.io/TW/Scripts/Approved/FarmGodCopy.js')
            .done(function (script, textStatus) {
                console.log('Script loaded successfully:', textStatus);
            })
            .fail(function (jqxhr, settings, exception) {
                console.error('Error loading script:', exception);
            });
    }

    function clickOptionButton(retries = 3) {
        let button = document.querySelector('input.btn.optionButton[value="Plan farms"]');
        if (button) {
            button.click();
            console.log("Button 'Plan farms' clicked");
        } else {
            console.log("Button 'Plan farms' not found");
            if (retries > 0) {
                console.log("Retrying...");
                setTimeout(function () {
                    clickOptionButton(retries - 1);
                }, randomDelay(2000, 4000));
            }
        }
    }

    function startProcess() {
        console.log('Starting process...');
        setTimeout(() => {
            loadFarmGodScript();
            setTimeout(() => {
                clickOptionButton();
                setTimeout(() => {
                    pressEnterRandomly();
                    startCountdown();
                }, randomDelay(3000, 5000));
            }, randomDelay(3000, 5000));
        }, randomDelay(4000, 7000));
    }

    function stopProcess() {
        clearTimeout(intervalId);
        clearInterval(countdownInterval);
        isRunning = false;
        localStorage.setItem(domain + '_isRunning', false);  // Save the state with domain as key
        updateButtonState();
        console.log("Process stopped.");
    }

    function toggleProcess() {
        if (isRunning) {
            stopProcess();
        } else {
            startProcess();
            isRunning = true;
            localStorage.setItem(domain + '_isRunning', true);  // Save the state with domain as key
            updateButtonState();
        }
    }

    function startCountdown() {
        let countdownElement = document.getElementById('countdown-timer');
        let timeLeft = randomDelay(600, 900);
        countdownElement.style.display = "block";

        countdownInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownElement.style.display = "none";
                location.reload();
            } else {
                countdownElement.innerText = `Next loop in: ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`;
                timeLeft--;
            }
        }, 1000);
    }

    function initializeUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.left = '20px';
        container.style.backgroundColor = '#333';
        container.style.color = '#fff';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';
        container.style.zIndex = 10000;

        const countdownElement = document.createElement('div');
        countdownElement.id = 'countdown-timer';
        countdownElement.style.marginBottom = '10px';
        container.appendChild(countdownElement);

        const controlButton = document.createElement('button');
        controlButton.textContent = isRunning ? 'Stop Looting' : 'Start Looting';
        controlButton.style.padding = '5px 10px';
        controlButton.style.marginRight = '5px';
        controlButton.style.border = 'none';
        controlButton.style.borderRadius = '3px';
        controlButton.style.cursor = 'pointer';
        controlButton.style.backgroundColor = isRunning ? 'red' : 'green';
        controlButton.style.color = '#fff';

        controlButton.addEventListener('click', () => {
            toggleProcess();
            controlButton.textContent = isRunning ? 'Stop Looting' : 'Start Looting';
            controlButton.style.backgroundColor = isRunning ? 'red' : 'green';
        });

        container.appendChild(controlButton);
        document.body.appendChild(container);
    }

    // Initialize UI
    initializeUI();

    // Set button state according to the last saved state
    function updateButtonState() {
        const controlButton = document.querySelector('button');
        controlButton.textContent = isRunning ? 'Stop Looting' : 'Start Looting';
        controlButton.style.backgroundColor = isRunning ? 'red' : 'green';
        console.log(`Button state updated: ${isRunning ? 'Stop Looting' : 'Start Looting'}`);
    }

    // Check if the process is running and handle starting/stopping correctly
    if (isRunning) {
        console.log("Process is running...");
        startProcess();
    } else {
        console.log("Process is not running.");
    }

    updateButtonState();
})();
