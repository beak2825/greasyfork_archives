// ==UserScript==
// @name         Torn Faction Inactivity Checker
// @namespace    https://www.torn.com/
// @version      5.5
// @description  Adds a faction inactivity check button with sorted color-coded results.
// @author       Dempc[2957274]
// @match        https://www.torn.com/factions.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527111/Torn%20Faction%20Inactivity%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/527111/Torn%20Faction%20Inactivity%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getStoredAPIKey() {
        return localStorage.getItem("torn_api_key");
    }

    function promptForAPIKey() {
        let apiKey = prompt("Enter your Torn API key (Public Key is fine):", getStoredAPIKey() || "");
        if (apiKey) {
            localStorage.setItem("torn_api_key", apiKey);
            return apiKey;
        } else {
            alert("API key is required to use this script.");
            return null;
        }
    }

    function addButton() {
        const checkExist = setInterval(() => {
            const factionHeader = document.querySelector(".faction-tabs") || document.querySelector(".faction-info-wrap");
            if (factionHeader && !document.getElementById("check-inactive-btn")) {
                clearInterval(checkExist);

                const button = document.createElement("button");
                button.id = "check-inactive-btn";
                button.innerText = "🔍 Check Inactivity";
                button.style.cssText = `margin: 5px; padding: 8px 12px; cursor: pointer; background: #444; color: white; border: none; border-radius: 5px; font-size: 14px; display: inline-block;`;

                button.addEventListener("click", checkInactivity);
                factionHeader.appendChild(button);
            }
        }, 500);
    }

    async function checkInactivity() {
        let apiKey = getStoredAPIKey() || promptForAPIKey();
        if (!apiKey) return;

        const inactivityThreshold = 24;
        const FACTION_API_URL = `https://api.torn.com/faction/?selections=basic&key=${apiKey}`;

        try {
            const response = await fetch(FACTION_API_URL);
            const data = await response.json();

            if (data.error) {
                alert(`⚠️ API Error: ${data.error.error}`);
                return;
            }

            const members = data.members;
            const now = Math.floor(Date.now() / 1000);
            const inactiveThresholdInSeconds = inactivityThreshold * 3600;
            let results = [];

            for (const id in members) {
                const member = members[id];
                const timeSinceLastAction = now - member.last_action.timestamp;

                if (timeSinceLastAction >= inactiveThresholdInSeconds) {
                    results.push({
                        id: id,
                        name: member.name,
                        lastActive: member.last_action.relative,
                        inactiveSeconds: timeSinceLastAction
                    });
                }
            }

            results.sort((a, b) => b.inactiveSeconds - a.inactiveSeconds);
            showResultsPopup(results);
        } catch (error) {
            alert("⚠️ Failed to fetch faction data. Check your API key or try again later.");
            console.error("Error fetching Torn API data:", error);
        }
    }

    function showResultsPopup(inactiveMembers) {
        let popup = document.createElement("div");
        popup.style.cssText = `position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%); background: #222; color: white; padding: 15px; border-radius: 10px; z-index: 1000; overflow-y: auto; max-height: 70vh; width: 300px;`;

        let title = document.createElement("h3");
        title.innerText = `🚨 Inactive Members (24h+)`;
        popup.appendChild(title);

        let closeButton = document.createElement("button");
        closeButton.innerText = "Close";
        closeButton.style.cssText = "margin-bottom: 10px; padding: 5px 10px; background: #ff4444; color: white; border: none; cursor: pointer; border-radius: 5px; display: block;";
        closeButton.addEventListener("click", () => document.body.removeChild(popup));
        popup.appendChild(closeButton);

        let table = document.createElement("table");
        table.style.cssText = "width: 100%; border-collapse: collapse;";

        inactiveMembers.forEach(m => {
            let row = document.createElement("tr");
            let nameCell = document.createElement("td");
            let lastActiveCell = document.createElement("td");

            let nameLink = document.createElement("a");
            nameLink.href = `https://www.torn.com/profiles.php?XID=${m.id}`;
            nameLink.target = "_blank";
            nameLink.innerText = m.name;
            nameLink.style.cssText = "color: white; text-decoration: none; padding: 2px 5px; display: inline-block; border-radius: 3px;";

            nameCell.appendChild(nameLink);
            lastActiveCell.innerText = m.lastActive;

            if (m.inactiveSeconds >= 172800) {
                row.style.background = "#ff4d4d";
            } else if (m.inactiveSeconds >= 86400) {
                row.style.background = "#ffcc00";
            }

            row.appendChild(nameCell);
            row.appendChild(lastActiveCell);
            table.appendChild(row);
        });

        popup.appendChild(table);
        document.body.appendChild(popup);
    }

    addButton();
})();
