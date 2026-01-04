// ==UserScript==
// @name         PP Alert Price TELE 
// @description  Plays chicken sound and/or sends Telegram alert based on price thresholds, logs the difference every second
// @version      1.95
// @include      https://*/game.php*screen=market&mode=exchange*
// @namespace    https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/517153/PP%20Alert%20Price%20TELE.user.js
// @updateURL https://update.greasyfork.org/scripts/517153/PP%20Alert%20Price%20TELE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("PP Alert script dimulai...");

    let lastSoundTime = 0;
    let lastTelegramTime = 0;
    let lastCaptchaAlertTime = 0;

    // Load saved settings
    let lowerLimit = localStorage.getItem('ppAlertLowerLimit144') ? parseInt(localStorage.getItem('ppAlertLowerLimit144')) : 1000;
    let upperLimit = localStorage.getItem('ppAlertUpperLimit144') ? parseInt(localStorage.getItem('ppAlertUpperLimit144')) : 3000;
    let chatId = localStorage.getItem('telegramChatId') || "0"; // Default chat ID
    let soundAlertEnabled = localStorage.getItem('soundAlertEnabled') === 'true'; // Sound alert toggle
    let telegramAlertEnabled = localStorage.getItem('telegramAlertEnabled') === 'true'; // Telegram alert toggle

    // Telegram bot API credentials (ensure this is secure in production code)
    const botToken = "8151644407:AAEzt2C10IC8xGIc_Iaoeno02aPHg-cQFVU";

    // Function to send message to Telegram bot
    function sendToTelegram(angka,location, woodPrice, stonePrice, ironPrice) {
        if (!telegramAlertEnabled) return; // Check if Telegram alerts are enabled
        const message = `World: ${angka}, Location: ${location}; Wood: ${woodPrice}; Clay: ${stonePrice}; Iron: ${ironPrice}`;
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

    // Function to send CAPTCHA alert
    function sendCaptchaAlert() {
        // const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent("Ada CAPTCHA")}`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    console.error("Failed to send CAPTCHA alert to Telegram:", response.statusText);
                } else {
                    console.log("CAPTCHA alert sent to Telegram");
                }
            })
            .catch(error => console.error("Telegram API error:", error));
    }

    // Create settings button
    const settingsBtn = document.createElement('button');
    settingsBtn.innerText = 'PP Alert Settings';
    settingsBtn.style.position = 'fixed';
    settingsBtn.style.bottom = '40px';
    settingsBtn.style.right = '20px';
    settingsBtn.style.zIndex = '1000';
    document.body.appendChild(settingsBtn);
    console.log("Tombol PP Alert Settings berhasil ditambahkan.");

    // Create settings popup
    const settingsPopup = document.createElement('div');
    settingsPopup.style.display = 'none';
    settingsPopup.style.position = 'fixed';
    settingsPopup.style.bottom = '80px';
    settingsPopup.style.right = '20px';
    settingsPopup.style.backgroundColor = '#f9f9f9';
    settingsPopup.style.padding = '20px';
    settingsPopup.style.border = '1px solid #ddd';
    settingsPopup.style.zIndex = '1000';
    settingsPopup.innerHTML = `
        <label>Chat ID: <input type="text" id="chatIdInput" value="${chatId}"></label><br><br>
        <label>Lower Limit: <input type="number" id="lowerLimitInput" value="${lowerLimit}"></label><br>
        <label>Upper Limit: <input type="number" id="upperLimitInput" value="${upperLimit}"></label><br><br>
        <label><input type="checkbox" id="soundAlertCheckbox" ${soundAlertEnabled ? 'checked' : ''}> Enable Chicken Sound Alert</label><br>
        <label><input type="checkbox" id="telegramAlertCheckbox" ${telegramAlertEnabled ? 'checked' : ''}> Enable Telegram Alert</label><br><br>
        <button id="saveSettingsBtn">Save Settings</button><br><br>
    `;
    document.body.appendChild(settingsPopup);

    // Toggle settings popup
    settingsBtn.addEventListener('click', () => {
        settingsPopup.style.display = settingsPopup.style.display === 'none' ? 'block' : 'none';
    });

    // Save settings
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
        chatId = document.getElementById('chatIdInput').value;
        lowerLimit = parseInt(document.getElementById('lowerLimitInput').value);
        upperLimit = parseInt(document.getElementById('upperLimitInput').value);
        soundAlertEnabled = document.getElementById('soundAlertCheckbox').checked;
        telegramAlertEnabled = document.getElementById('telegramAlertCheckbox').checked;

        // Save to local storage
        localStorage.setItem('telegramChatId', chatId);
        localStorage.setItem('ppAlertLowerLimit144', lowerLimit);
        localStorage.setItem('ppAlertUpperLimit144', upperLimit);
        localStorage.setItem('soundAlertEnabled', soundAlertEnabled);
        localStorage.setItem('telegramAlertEnabled', telegramAlertEnabled);

        settingsPopup.style.display = 'none';
        alert("Settings saved successfully!");
    });

    // Check prices and send alerts
    setInterval(() => {
    // Ambil harga resource
        const woodPrice = parseInt(document.getElementById("premium_exchange_rate_wood")?.textContent || "0", 10);
        const stonePrice = parseInt(document.getElementById("premium_exchange_rate_stone")?.textContent || "0", 10);
        const ironPrice = parseInt(document.getElementById("premium_exchange_rate_iron")?.textContent || "0", 10);

    // Ambil lokasi dari elemen
        const location = document.querySelector('td.box-item b.nowrap')?.textContent || "Unknown";

    // Ambil nomor dunia dari URL
        const url = window.location.href;
        const match = url.match(/en(.*?)\./);
        const angka = match ? match[1] : "Unknown";

    // Periksa kondisi untuk alert
        const currentTime = Date.now();
        if (
            (woodPrice < lowerLimit || stonePrice < lowerLimit || ironPrice < lowerLimit ||
            woodPrice > upperLimit || stonePrice > upperLimit || ironPrice > upperLimit) &&
            (currentTime - lastSoundTime >= 30000)
        ) {
            if (soundAlertEnabled) TribalWars.playSound("chicken");
            sendToTelegram(angka, location, woodPrice, stonePrice, ironPrice);
           lastSoundTime = currentTime;
        }

        // Periksa CAPTCHA iframe
        const captchaIframe = document.querySelector('iframe[src*="hcaptcha"]');
        if (captchaIframe && (currentTime - lastCaptchaAlertTime >= 600000)) {  // 10 minutes
           console.log("Ada CAPTCHA");
           sendCaptchaAlert();
          lastCaptchaAlertTime = currentTime;
        }
    }, 200);
})();
