// ==UserScript==
// @name         Auto Scav
// @version      1.4
// @include      https://*tribalwars.net/game.php?*screen=place&mode=scavenge_mass*
// @namespace https://greasyfork.org/users/1388863
// @description Auto Send Scav
// @downloadURL https://update.greasyfork.org/scripts/519849/Auto%20Scav.user.js
// @updateURL https://update.greasyfork.org/scripts/519849/Auto%20Scav.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const botToken = "8151644407:AAHl5d3W8wZnQeCaFJHLNouYQCzqgS7zi-s"; // Ganti dengan bot token Anda

    // Extract domain or unique part of the URL
    const urlKey = window.location.hostname.split('.')[0]; // e.g., "en145"
    let isRunning = localStorage.getItem(`scavengeRunning_${urlKey}`) === 'true';

    // Function to load external script
    function loadScript(url) {
        const script = document.createElement('script');
        script.src = url;
        script.type = 'text/javascript';
        document.body.appendChild(script);
        console.log(`Loaded script: ${url}`);
    }

    // Function to handle random delay
    function randomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to send message to Telegram
    function sendToTelegram(message) {
        const chatId = localStorage.getItem('telegramChatId') || '0'; // Default chatId or from localStorage
        const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    console.error("Failed to send message to Telegram:", response.statusText);
                } else {
                    console.log("Message sent to Telegram:", message);
                }
            })
            .catch(error => console.error("Telegram API error:", error));
    }

    // Function to start mass scavenge process
    function startMassScavenge() {
        setTimeout(() => {
            loadScript('https://shinko-to-kuma.com/scripts/massScavenge.js');

            setTimeout(() => {
                const sendMassButton = document.getElementById('sendMass');
                if (sendMassButton) {
                    sendMassButton.click();
                    console.log("Clicked sendMass for the first time");
                } else {
                    console.log("sendMass button not found");
                }

                startCountdown();
                // Repeating the process with interval
                setInterval(() => {
                    const sendMassButton2 = document.querySelector('input#sendMass.btn.btnSophie');
                    if (sendMassButton2) {
                        sendMassButton2.click();
                        console.log("Clicked sendMass for the second time");
                        sendToTelegram("Scav Sudah dikirim");
                    } else {
                        console.log("sendMass button not found for second click");
                    }
                }, randomDelay(2000, 4000)); // Repeat every 2 to 4 seconds


            }, randomDelay(1000, 5000));
        }, randomDelay(2000, 5000));
    }

    // Function to start countdown
    function startCountdown() {
        const countdownTime = randomDelay(30, 180);
        let timeLeft = countdownTime;
        const countdownPopup = document.getElementById('countdown-timer');

        const countdownInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownPopup.innerText = `Countdown finished!`;
                if (isRunning) {
                    window.location.href = "/game.php?village=2668&screen=place&mode=scavenge";
                }
            } else {
                countdownPopup.innerText = `Time left: ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`;
                timeLeft--;
            }
        }, 1000);
    }

    // Function to initialize UI
    function initializeUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
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
        controlButton.textContent = isRunning ? 'Stop Scav' : 'Start Scav';
        controlButton.style.padding = '5px 10px';
        controlButton.style.marginRight = '5px';
        controlButton.style.border = 'none';
        controlButton.style.borderRadius = '3px';
        controlButton.style.cursor = 'pointer';
        controlButton.style.backgroundColor = isRunning ? 'red' : 'green';
        controlButton.style.color = '#fff';

        controlButton.addEventListener('click', () => {
            isRunning = !isRunning;
            localStorage.setItem(`scavengeRunning_${urlKey}`, isRunning);
            controlButton.textContent = isRunning ? 'Stop Scav' : 'Start Scav';
            controlButton.style.backgroundColor = isRunning ? 'red' : 'green';
            if (isRunning) {
                startMassScavenge();
            } else {
                console.log("Scavenge process stopped");
            }
        });


        container.appendChild(controlButton);
        document.body.appendChild(container);
    }

    // Initialize script
    initializeUI();
    if (isRunning) {
        startMassScavenge();
    }
})();
