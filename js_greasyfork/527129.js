// ==UserScript==
// @name         ZedCity Stat Notifier
// @namespace    http://tampermonkey.net/
// @version      1.0.0.2
// @description  Notifications for desktop users
// @author       You
// @match        https://www.zed.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        none
// @license      Mozilla Public License 2.0  
// @downloadURL https://update.greasyfork.org/scripts/527129/ZedCity%20Stat%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/527129/ZedCity%20Stat%20Notifier.meta.js
// ==/UserScript==
(function() {
    'use strict';

    console.log("Tampermonkey script is running");

    let notificationCooldown = localStorage.getItem("notificationCooldown") || 300; // Default 5 min
    let lastEnergyNotification = 0;
    let lastRadNotification = 0;

    function interceptAPI() {
        const open = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function(method, url) {
            if (url.includes("/getStats")) {
                this.addEventListener("load", function() {
                    try {
                        const response = JSON.parse(this.responseText);
                        processStats(response);
                    } catch (e) {
                        console.error("Error parsing API response:", e);
                    }
                });
            }
            open.apply(this, arguments);
        };
    }

    function createSettingsPanel() {
        if (!window.location.href.includes('https://www.zed.city/settings')) return;

        setTimeout(() => {
            console.log("Trying to insert script settings...");
            let settingsContainer = document.querySelector('.zed-grid.has-title.has-content');
            if (!settingsContainer) return;

            let settingsBox = document.createElement('div');
            settingsBox.className = 'zed-grid has-title has-content';
            settingsBox.innerHTML = `
                <div class="title"><div>Script Settings</div></div>
                <div class="grid-cont">
                    <div class="q-pa-md">
                    <div style="font-weight: color: white; margin-bottom: 5px;">
                adjust how often the script notifies you(Minutes):
            </div>
                        <label class="q-field row no-wrap items-start q-field--outlined q-input q-field--float q-field--labeled q-field--dense q-field--dark q-field--with-bottom">
                            <div class="q-field__inner relative-position col self-stretch">
                                <div class="q-field__control relative-position row no-wrap">
                                    <div class="q-field__control-container col relative-position row no-wrap q-anchor--skip">
                                        <input class="q-field__native q-placeholder" type="number" id="notificationCooldown" placeholder="Notification Cooldown (minutes)" value="${notificationCooldown / 60}">
                                    </div>
                                </div>
                            </div>
                        </label>
                    </div>
                    <div align="center">
                        <button id="saveSettings" class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-primary text-white q-btn--actionable">Save</button>
                    </div>
                </div>
            `;
            settingsContainer.parentNode.insertBefore(settingsBox, settingsContainer.nextSibling);

            document.getElementById("saveSettings").addEventListener("click", () => {
                let cooldownValue = parseInt(document.getElementById("notificationCooldown").value, 10);
                if (!isNaN(cooldownValue) && cooldownValue > 0) {
                    notificationCooldown = cooldownValue * 60;
                    localStorage.setItem("notificationCooldown", notificationCooldown);
                    showTemporaryMessage("Settings saved!");
                }
            });

            document.getElementById("testNotification").addEventListener("click", testNotifications);
        }, 3000);
    }
    function showTemporaryMessage(message) {
        let msgDiv = document.createElement("div");
        msgDiv.textContent = message;
        msgDiv.style.position = "fixed";
        msgDiv.style.top = "10px";
        msgDiv.style.left = "50%";
        msgDiv.style.transform = "translateX(-50%)";
        msgDiv.style.background = "rgba(0, 0, 0, 0.8)";
        msgDiv.style.color = "white";
        msgDiv.style.padding = "10px 20px";
        msgDiv.style.borderRadius = "5px";
        msgDiv.style.zIndex = "9999";
        document.body.appendChild(msgDiv);
        setTimeout(() => {
            msgDiv.style.transition = "opacity 5s";
            msgDiv.style.opacity = "0";
            setTimeout(() => msgDiv.remove(), 5000);
        }, 3000);
    }

    function sendNotification(title, message) {
        if (Notification.permission === "granted") {
            new Notification(title, { body: message });
        } else {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: message });
                }
            });
        }
    }

   function processStats(data) {
        console.log("Raw API Response:", data); // Debugging log

        if (!data || typeof data !== "object" || !data.skills) {
            console.warn("Invalid API response format:", data);
            return;
        }

        const { energy, rad, membership } = data;
        let { max_energy, max_rad } = data.skills; // Extract from `skills` object

        // If membership is true, override max_energy to 150
        if (membership === true) {
            max_energy = 150;
        }

        if (energy === undefined || max_energy === undefined || rad === undefined || max_rad === undefined) {
            console.warn("API response does not contain required fields:", data);
            return;
        }

        console.log(`Energy: ${energy}/${max_energy}, Rad: ${rad}/${max_rad}, Membership: ${membership}`);

        const currentTime = Date.now();

        if (energy === max_energy && currentTime - lastEnergyNotification > notificationCooldown * 1000) {
            sendNotification("Energy Full", `Your energy is full: ${energy}/${max_energy}`);
            lastEnergyNotification = currentTime;
        }

        if (rad === max_rad && currentTime - lastRadNotification > notificationCooldown * 1000) {
            sendNotification("Radiation Full", `Your radiation is full: ${rad}/${max_rad}`);
            lastRadNotification = currentTime;
        }
    }
    interceptAPI();
    createSettingsPanel();
})();