// ==UserScript==
// @name         Horse Event
// @description  Plays alert if reward values exceed 1500 for specified elements, with chicken sound, Telegram alert, and settings
// @version      1.05
// @include      https://*/game.php*screen=event_horse_race*
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/524737/Horse%20Event.user.js
// @updateURL https://update.greasyfork.org/scripts/524737/Horse%20Event.meta.js
// ==/UserScript==

let lastAlertTime = 0;
let chatId = localStorage.getItem('telegramChatId') || "0";
let soundAlertEnabled = localStorage.getItem('soundAlertEnabled') === 'true';
let telegramAlertEnabled = localStorage.getItem('telegramAlertEnabled') === 'true';
let rewardThreshold = localStorage.getItem('rewardThreshold') ? parseInt(localStorage.getItem('rewardThreshold'), 10) : 1500;

const botToken = "8151644407:AAEzt2C10IC8xGIc_Iaoeno02aPHg-cQFVU";

// Function to send message to Telegram bot
function sendToTelegram(message) {
    if (!telegramAlertEnabled) return;
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

// Function to check and alert if reward values exceed the threshold
function checkRewards() {
    const rewardElement = document.querySelector('.reward#event-option-jackpot-2');
    const rewardElement2 = document.querySelector('.reward#event-option-jackpot-3');
    const rewardElement3 = document.querySelector('.reward#event-option-jackpot-4');

    const rewardValues = [
        rewardElement ? parseInt(rewardElement.textContent.trim(), 10) : 0,
        rewardElement2 ? parseInt(rewardElement2.textContent.trim(), 10) : 0,
        rewardElement3 ? parseInt(rewardElement3.textContent.trim(), 10) : 0
    ];

    const currentTime = Date.now();

    rewardValues.forEach((value, index) => {
        if (value > rewardThreshold && (currentTime - lastAlertTime >= 30000)) { // 30 seconds cooldown
            const message = `Reward #${index + 2} exceeds ${rewardThreshold}: ${value}`;
            console.log(message);
            if (soundAlertEnabled) TribalWars.playSound("chicken");
            sendToTelegram(message);
            lastAlertTime = currentTime;
        }
    });
}

// Create settings button
const settingsBtn = document.createElement('button');
settingsBtn.innerText = 'Horse Alert Settings';
settingsBtn.style.position = 'fixed';
settingsBtn.style.top = '40px';
settingsBtn.style.left = '10px';
settingsBtn.style.zIndex = '1000';
document.body.appendChild(settingsBtn);

// Create settings popup
const settingsPopup = document.createElement('div');
settingsPopup.style.display = 'none';
settingsPopup.style.position = 'fixed';
settingsPopup.style.top = '65px';
settingsPopup.style.left = '10px';
settingsPopup.style.backgroundColor = '#f9f9f9';
settingsPopup.style.padding = '20px';
settingsPopup.style.border = '1px solid #ddd';
settingsPopup.innerHTML = `
    <label>Chat ID: <input type="text" id="chatIdInput" value="${chatId}"></label><br><br>
    <label>Reward Threshold: <input type="number" id="rewardThresholdInput" value="${rewardThreshold}"></label><br><br>
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
    rewardThreshold = parseInt(document.getElementById('rewardThresholdInput').value, 10);
    soundAlertEnabled = document.getElementById('soundAlertCheckbox').checked;
    telegramAlertEnabled = document.getElementById('telegramAlertCheckbox').checked;

    // Save to local storage
    localStorage.setItem('telegramChatId', chatId);
    localStorage.setItem('rewardThreshold', rewardThreshold);
    localStorage.setItem('soundAlertEnabled', soundAlertEnabled);
    localStorage.setItem('telegramAlertEnabled', telegramAlertEnabled);

    settingsPopup.style.display = 'none';
    alert("Settings saved successfully!");
});

// Check rewards every second
setInterval(checkRewards, 1000);