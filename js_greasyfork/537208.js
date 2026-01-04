// ==UserScript==
// @name         Torn Direct Revive Request with ID Input
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license MIT
// @description  Displays a revive request button on home page and lets you input any Torn ID to request a revive for that user.
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/537208/Torn%20Direct%20Revive%20Request%20with%20ID%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/537208/Torn%20Direct%20Revive%20Request%20with%20ID%20Input.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REVIVER_ID = "1234567"; // 🔹 Replace with the reviver's Torn ID
    const API_INTERVAL = 60000; // 🔹 API check interval in milliseconds (60 sec)

    injectApiKeyManagementButton();
    injectReviveUI();

    // Periodically refresh your own data (optional, to validate your API key)
    setInterval(() => {
        // Could add user data refresh here if needed
    }, API_INTERVAL);

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

    function injectReviveUI() {
        // Container div
        const container = document.createElement("div");
        container.id = "reviveRequestContainer";
        container.style.position = "fixed";
        container.style.bottom = "50px";
        container.style.right = "10px";
        container.style.zIndex = "9999";
        container.style.backgroundColor = "#222";
        container.style.padding = "10px";
        container.style.borderRadius = "8px";
        container.style.color = "white";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.width = "280px";
        container.style.boxShadow = "0 0 10px rgba(0,0,0,0.7)";

        // Title
        const title = document.createElement("div");
        title.textContent = "Revive Request";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "8px";
        container.appendChild(title);

        // Input for Torn ID
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Enter Torn ID (numbers only)";
        input.style.width = "100%";
        input.style.padding = "6px";
        input.style.borderRadius = "4px";
        input.style.border = "none";
        input.style.marginBottom = "8px";
        input.id = "reviveTornIdInput";
        container.appendChild(input);

        // Button to send revive request
        const btn = document.createElement("button");
        btn.textContent = "💉 Send Revive Request";
        btn.style.width = "100%";
        btn.style.padding = "10px";
        btn.style.backgroundColor = "#28a745";
        btn.style.border = "none";
        btn.style.borderRadius = "5px";
        btn.style.color = "white";
        btn.style.fontWeight = "bold";
        btn.style.cursor = "pointer";
        btn.onclick = () => {
            const tornId = input.value.trim();
            if (!tornId.match(/^\d+$/)) {
                alert("Please enter a valid Torn ID (numbers only).");
                return;
            }
            sendReviveRequestForId(tornId);
        };
        container.appendChild(btn);

        document.body.appendChild(container);
    }

    function sendReviveRequestForId(tornId) {
        const apiKey = localStorage.getItem("torn_api_key");
        if (!apiKey) {
            alert("Please set your Torn API key first using the 🔑 Manage API Key button.");
            return;
        }

        // Fetch user info for the entered Torn ID
        fetch(`https://api.torn.com/user/${tornId}?selections=profile,faction,life,status,travel&key=${apiKey}`)
            .then(res => res.json())
            .then(userData => {
                if (userData.error) {
                    alert(`API Error: ${userData.error.error}`);
                    return;
                }

                // Only allow sending if user is hospitalized
                if (userData.status?.state !== "Hospital") {
                    alert("User is not hospitalized and cannot be revived.");
                    return;
                }

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
                    alert("✅ Revive request sent!");
                })
                .catch(err => {
                    console.error("Failed to send revive request:", err);
                    alert("❌ Failed to send revive request. Please try again.");
                });

            })
            .catch(err => {
                console.error("Failed to fetch user data:", err);
                alert("Failed to fetch user data. Please check the Torn ID and try again.");
            });
    }

})();
