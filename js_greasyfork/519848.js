// ==UserScript==
// @name         Scav Monitoring with Alerts
// @version      1.85
// @include      https://*/game.php*screen=place&mode=scavenge
// @include      https://*/game.php*screen=place&mode=scavenge&
// @namespace https://greasyfork.org/users/1388863
// @description Scav Allert
// @downloadURL https://update.greasyfork.org/scripts/519848/Scav%20Monitoring%20with%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/519848/Scav%20Monitoring%20with%20Alerts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const botToken = "8151644407:AAHl5d3W8wZnQeCaFJHLNouYQCzqgS7zi-s"; // Ganti dengan token bot Anda
    let lastTelegramMessageTime = 0; // Track last message sent time
    let captchaDetected = false; // Track CAPTCHA detection
    let intervalId = null; // Ensure only one interval runs

    // Function to send a message to Telegram (rate-limited to 1x per 5 minutes)
    function sendToTelegram(message) {
        const currentTime = Date.now();
        if (currentTime - lastTelegramMessageTime >= 300000) { // 5-minute limit
            const chatId = localStorage.getItem('telegramChatId') || '0';
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
            lastTelegramMessageTime = currentTime; // Update last message time
        } else {
            console.log("Telegram message rate limit hit. Skipping message:", message);
        }
    }

    // Function to parse time from countdown text
    function parseTime(timeText) {
        const parts = timeText.split(":").map(Number);
        return parts[0] * 3600 + parts[1] * 60 + parts[2]; // Convert hours, minutes, seconds to total seconds
    }

    // Function to monitor countdown
    let lastNotification = null; // Track the last notification time
    function monitorCountdown() {

        const countdownElement = document.querySelector('.scavenge-option .return-countdown');
        if (countdownElement) {
            const timeText = countdownElement.innerText.trim();
            const remainingTime = parseTime(timeText);

            console.log(`Remaining time: ${remainingTime} seconds`);

            // if (remainingTime % 1800 === 0 && remainingTime !== lastNotification) {
            //     // Notify on every 30-minute mark
            //     sendToTelegram(`Countdown reached ${remainingTime / 60} minutes.`);
            //     lastNotification = remainingTime; }
            if (remainingTime === 300 && remainingTime !== lastNotification) {
                // Notify when 5 minutes are left
                sendToTelegram("Countdown has 5 minutes remaining!");
                lastNotification = remainingTime;
            }

            if (remainingTime <= 0) {
                console.log("Scav completed!");
                sendToTelegram("Scav Selesai");

                // Start the new countdown (1-10 minutes)
                startPostScavCountdown();
                clearInterval(intervalId); // Stop monitoring after scav is complete
                intervalId = null; // Reset intervalId
            }
        } else {
            if (!captchaDetected) {
                sendToTelegram("Tidak Ada Scav");
                startPostScavCountdown();
                clearInterval(intervalId); // Stop monitoring
                intervalId = null; // Reset intervalId
            }
        }
    }

    // Function to start the countdown after scavenging is done (1-10 minutes)
    function startPostScavCountdown() {
        const countdownTime = Math.floor(Math.random() * 2 * 60) + 60; // Random countdown between 1-10 minutes (60-600 seconds)
        let timeLeft = countdownTime;
        const countdownPopup = document.createElement("div");
        countdownPopup.style.position = "fixed";
        countdownPopup.style.bottom = "30px";
        countdownPopup.style.right = "30px";
        countdownPopup.style.padding = "10px 20px";
        countdownPopup.style.fontSize = "16px";
        countdownPopup.style.backgroundColor = "#333";
        countdownPopup.style.color = "white";
        countdownPopup.style.borderRadius = "5px";
        countdownPopup.style.zIndex = "1000";
        document.body.appendChild(countdownPopup);

        const countdownInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                countdownPopup.innerText = `Post Scav countdown finished!`;
                window.location.href = "/game.php?screen=place&mode=scavenge_mass";
                console.log("Redirecting to mass scavenge page...");
                if (localStorage.getItem('redirectToMassScavenge') === 'true') {
                    window.location.href = "/game.php?screen=place&mode=scavenge_mass";
                }
            } else {
                countdownPopup.innerText = `Post Scav Time left: ${Math.floor(timeLeft / 60)}m ${timeLeft % 60}s`;
                timeLeft--;
            }
        }, 1000); // Update countdown every second
    }

    // Ensure only one interval runs
    if (!intervalId) {
        intervalId = setInterval(monitorCountdown, 1000); // Start monitoring countdown for Scavenge
    }
})();
