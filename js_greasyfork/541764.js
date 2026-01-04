// ==UserScript==
// @name         Torn Bounty Filter UI (Live Refresh)
// @namespace    https://www.torn.com/
// @version      1.3
// @description  Filter visible bounties by level and days played with UI sliders
// @author       TervorLahey420
// @match        https://www.torn.com/bounties.php*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541764/Torn%20Bounty%20Filter%20UI%20%28Live%20Refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541764/Torn%20Bounty%20Filter%20UI%20%28Live%20Refresh%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_KEY = "C7uLhoMyRt4P2QNI";

    // === Create Floating Filter Panel ===
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "80px";
    panel.style.right = "20px";
    panel.style.padding = "12px";
    panel.style.backgroundColor = "#222";
    panel.style.color = "#fff";
    panel.style.border = "1px solid #444";
    panel.style.zIndex = "9999";
    panel.style.fontSize = "14px";
    panel.style.borderRadius = "6px";
    panel.innerHTML = `
        <h3 style="margin-top:0;">🎯 Bounty Filter</h3>
        <p style="margin: 4px 0 12px; font-size: 12px; color: #aaa;">Created by <strong>TervorLahey420</strong></p>
        <label>Min Level: <span id="minLevelLabel">10</span></label><br>
        <input type="range" id="minLevel" min="1" max="100" value="10"><br>
        <label>Max Level: <span id="maxLevelLabel">50</span></label><br>
        <input type="range" id="maxLevel" min="1" max="100" value="50"><br>
        <label>Min Days: <span id="minDaysLabel">100</span></label><br>
        <input type="range" id="minDays" min="1" max="3000" value="100"><br>
        <label>Max Days: <span id="maxDaysLabel">3000</span></label><br>
        <input type="range" id="maxDays" min="1" max="3000" value="3000"><br>
        <button id="applyFilter">Apply Filter</button>
    `;
    document.body.appendChild(panel);

    const updateLabels = () => {
        document.getElementById("minLevelLabel").textContent = document.getElementById("minLevel").value;
        document.getElementById("maxLevelLabel").textContent = document.getElementById("maxLevel").value;
        document.getElementById("minDaysLabel").textContent = document.getElementById("minDays").value;
        document.getElementById("maxDaysLabel").textContent = document.getElementById("maxDays").value;
    };
    ["minLevel", "maxLevel", "minDays", "maxDays"].forEach(id => {
        document.getElementById(id).addEventListener("input", updateLabels);
    });

    updateLabels();

    document.getElementById("applyFilter").addEventListener("click", () => {
        const minLevel = parseInt(document.getElementById("minLevel").value);
        const maxLevel = parseInt(document.getElementById("maxLevel").value);
        const minDays = parseInt(document.getElementById("minDays").value);
        const maxDays = parseInt(document.getElementById("maxDays").value);

        const bountyElements = document.querySelectorAll('[class*="bounty-list-item"]');
        bountyElements.forEach(el => el.style.display = "none");

        GM_xmlhttpRequest({
            method: "GET",
            url: `https://api.torn.com/torn/?selections=bounties&key=${API_KEY}`,
            onload: function(response) {
                const bountyData = JSON.parse(response.responseText).bounties;
                for (const userId in bountyData) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://api.torn.com/user/${userId}?selections=profile&key=${API_KEY}`,
                        onload: function(userResponse) {
                            const user = JSON.parse(userResponse.responseText);
                            const lvl = user.level;
                            const days = user.profile.days_played;

                            if (lvl >= minLevel && lvl <= maxLevel &&
                                days >= minDays && days <= maxDays) {
                                bountyElements.forEach(el => {
                                    if (el.innerText.includes(user.name)) {
                                        el.style.display = "";
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    });
})();
