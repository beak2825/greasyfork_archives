// ==UserScript==
// @name         Torn Direct Revive Request
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Displays a revive request button when hospitalized and sends your details to a reviver.
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537205/Torn%20Direct%20Revive%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/537205/Torn%20Direct%20Revive%20Request.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REVIVER_ID = "1234567"; // 🔹 Replace with the reviver's Torn ID
    const API_INTERVAL = 60000; // 🔹 API check interval in milliseconds (60 sec)

    // Inject a button to manage API key
    injectApiKeyManagementButton();

    // Periodically check hospitalization status
    checkHospitalStatus();
    setInterval(checkHospitalStatus, API_INTERVAL);

    function injectApiKeyManagementButton() {
        const btn = document.createElement("button");
        btn.textContent = "🔑 Manage API Key";
        btn.style.position = "fixed";
        btn.style.bottom = "10px";
        btn.style.right = "10px";
        btn.style.zIndex = "9999";
        btn.style.backgroundColor = "#007bff";
        btn.style.color = "white";
        btn.style.padding = "8px";
        btn.style.borderRadius = "5px";
        btn.onclick = () => {
            const choice = prompt("Enter your Torn API Key, or type 'delete' to remove it:");
            if (choice === null) return;
            if (choice.toLowerCase() === 'delete') {
                localStorage.removeItem("torn_api_key");
                alert("API Key removed.");
            } else {
                localStorage.setItem("torn_api_key", choice);
                alert("API Key updated.");
            }
        };
        document.body.appendChild(btn);
    }

    function checkHospitalStatus() {
        const apiKey = localStorage.getItem("torn_api_key");
        if (!apiKey) {
            console.log("API key not set. Please set your Torn API Key.");
            return;
        }

        fetch(`https://api.torn.com/user/?selections=profile,basic,personal,properties,travel&key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error("API error:", data.error);
                    return;
                }

                if (data.status?.state === "Hospital") {
                    injectReviveButton(data);
                } else {
                    removeReviveButton();
                }
            })
            .catch(err => {
                console.error("Failed to fetch Torn API data:", err);
            });
    }

    function injectReviveButton(userData) {
        if (document.getElementById("reviveRequestButton")) return;

        const btn = document.createElement("button");
        btn.id = "reviveRequestButton";
        btn.textContent = "💉 Request Revive";
        btn.style.position = "fixed";
        btn.style.bottom = "50px";
        btn.style.right = "10px";
        btn.style.zIndex = "9999";
        btn.style.backgroundColor = "#28a745";
        btn.style.color = "white";
        btn.style.padding = "10px";
        btn.style.borderRadius = "5px";

        btn.onclick = () => {
            sendReviveRequest(userData);
        };

        document.body.appendChild(btn);
    }

    function removeReviveButton() {
        const btn = document.getElementById("reviveRequestButton");
        if (btn) btn.remove();
    }

    function sendReviveRequest(userData) {
        const reviverId = REVIVER_ID;
        const userId = userData.player_id;
        const userName = userData.name;
        const faction = userData.faction?.faction_name || "No Faction";
        const health = userData.life?.current || "Unknown";
        const location = userData.travel?.destination || "Torn";
        const status = userData.status?.description || "Unknown";

        const message = `Hello! I am requesting a revive.\n\n` +
                        `👤 Name: ${userName}\n` +
                        `🆔 ID: ${userId}\n` +
                        `🏢 Faction: ${faction}\n` +
                        `❤️ Health: ${health}\n` +
                        `📍 Location: ${location}\n` +
                        `📜 Status: ${status}\n` +
                        `🔗 Profile: https://www.torn.com/profiles.php?XID=${userId}`;

        // Send message via Torn mail
        fetch(`https://www.torn.com/message.php?p=compose&XID=${reviverId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                step: "2",
                to: reviverId,
                subject: "Revive Request",
                message: message
            })
        })
        .then(() => {
            alert("Revive request sent!");
        })
        .catch(err => {
            console.error("Failed to send revive request:", err);
            alert("Failed to send revive request. Please try again.");
        });
    }

})();
