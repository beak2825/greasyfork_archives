// ==UserScript==
// @name         Torn - Request Revive Button (via Apps Script Relay)
// @namespace    https://torn.com/
// @version      1.24
// @description  Adds a "Request Revive" button to player profiles and sends the request through a Google Apps Script relay to Discord.
// @author       Justyn + ChatGPT
// @match        https://www.torn.com/profiles.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543213/Torn%20-%20Request%20Revive%20Button%20%28via%20Apps%20Script%20Relay%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543213/Torn%20-%20Request%20Revive%20Button%20%28via%20Apps%20Script%20Relay%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ✅ Replace this with your actual Google Apps Script Web App URL:
    const relayURL = "https://script.google.com/macros/s/AKfycbykVvoeQ-FPZBGlW9GlXM2QZ_DhTLjERHX9mbxUsD4Y23GAsIHZgkkaY9mK5hjbRSo5/exec";

    function sendRelayRequest(playerName, playerId) {
        fetch(relayURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ playerName, playerId })
        }).then(res => {
            if (res.ok) {
                alert("✅ Revive request sent!");
            } else {
                alert("❌ Relay error. Check Apps Script log.");
            }
        }).catch((error) => {
            console.error("Relay failed:", error);
            alert("❌ Failed to send request via relay.");
        });
    }

    function insertButtonOnProfile() {
        const interval = setInterval(() => {
            const nameHeader = document.getElementById("skip-to-content");
            const profileIdMatch = window.location.href.match(/XID=(\d+)/);

            if (nameHeader && profileIdMatch && !document.getElementById("revive-profile-button")) {
                const rawText = nameHeader.textContent.trim();
                const playerName = rawText.replace(/'s Profile$/, '').trim();
                const playerId = profileIdMatch[1];

                const btn = document.createElement("button");
                btn.id = "revive-profile-button";
                btn.textContent = "🩺 Request Revive";
                btn.style.marginLeft = "10px";
                btn.style.padding = "6px 12px";
                btn.style.backgroundColor = "#4CAF50";
                btn.style.color = "white";
                btn.style.border = "none";
                btn.style.cursor = "pointer";
                btn.style.fontSize = "14px";
                btn.style.borderRadius = "4px";

                btn.addEventListener("click", () => {
                    sendRelayRequest(playerName, playerId);
                });

                nameHeader.parentElement.appendChild(btn);
                clearInterval(interval);
            }
        }, 1000);
    }

    insertButtonOnProfile();
})();