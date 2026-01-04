// ==UserScript==
// @name         Torn War Page: Faction Members life
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Fast top-right modal using Torn v2 faction members endpoint for life info during war rank view (sorted by lowest HP). No per-user calls needed.
// @author       Systoned
// @match        https://www.torn.com/factions.php?step=your&type=1*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/532644/Torn%20War%20Page%3A%20Faction%20Members%20life.user.js
// @updateURL https://update.greasyfork.org/scripts/532644/Torn%20War%20Page%3A%20Faction%20Members%20life.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY = ''; // Replace with your real Torn API key

    const getEnemyFactionId = () => {
        const el = document.querySelector('.enemy-faction a[href*="factions.php?step=profile&ID="]');
        if (!el) return null;
        const match = el.href.match(/ID=(\d+)/);
        return match ? match[1] : null;
    };

    const fetchFactionMembersV2 = (factionId) => {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/v2/faction/${factionId}/members?striptags=true`,
                headers: {
                    'Authorization': `ApiKey ${API_KEY}`,
                    'Accept': 'application/json'
                },
                onload: (response) => {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        const members = data.members || [];
                        const sorted = members.sort((a, b) => {
                            const aLife = a.life?.current || 0;
                            const bLife = b.life?.current || 0;
                            return aLife - bLife;
                        });
                        resolve(sorted);
                    } else {
                        resolve([]);
                    }
                },
                onerror: () => resolve([])
            });
        });
    };

    const createModal = () => {
        const modal = document.createElement("div");
        modal.id = "enemyLifeModal";
        modal.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 320px;
            max-height: 600px;
            overflow-y: auto;
            background: #111;
            color: #eee;
            border: 2px solid #555;
            border-radius: 8px;
            padding: 10px 15px;
            z-index: 10000;
            display: none;
        `;

        const closeButton = document.createElement("button");
        closeButton.textContent = "✖";
        closeButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: transparent;
            color: white;
            border: none;
            font-size: 16px;
            cursor: pointer;
        `;
        closeButton.addEventListener("click", () => {
            modal.style.display = "none";
        });

        const refreshButton = document.createElement("button");
        refreshButton.textContent = "⟳ Refresh";
        refreshButton.style.cssText = `
            position: absolute;
            top: 5px;
            left: 10px;
            background: #333;
            color: white;
            border: 1px solid #666;
            padding: 2px 8px;
            font-size: 12px;
            border-radius: 4px;
            cursor: pointer;
        `;
        refreshButton.addEventListener("click", () => {
            refreshEnemyData();
        });

        const content = document.createElement("div");
        content.id = "enemyLifeContent";
        content.style.marginTop = "30px";

        modal.appendChild(closeButton);
        modal.appendChild(refreshButton);
        modal.appendChild(content);
        document.body.appendChild(modal);

        return modal;
    };

    const createButton = () => {
        const btn = document.createElement("button");
        btn.textContent = "Enemy Life Info";
        btn.style.cssText = `
            position: fixed;
            top: 60px;
            right: 20px;
            z-index: 10001;
            background: #222;
            color: white;
            border: 1px solid #555;
            padding: 6px 10px;
            border-radius: 5px;
            cursor: pointer;
        `;
        document.body.appendChild(btn);
        return btn;
    };

    const refreshEnemyData = async () => {
        const content = document.getElementById("enemyLifeContent");
        content.innerHTML = `<strong>Loading enemy health data...</strong><br><br>`;

        const factionId = getEnemyFactionId();
        if (!factionId) {
            content.innerHTML = "❌ Could not detect enemy faction.";
            return;
        }

        const members = await fetchFactionMembersV2(factionId);
        if (!members.length) {
            content.innerHTML = "⚠️ No member data returned.";
            return;
        }

        content.innerHTML = `<strong>Enemy Members (lowest HP first):</strong><br><br>`;

        for (const member of members) {
            const current = member.life?.current || 0;
            const maximum = member.life?.maximum || 0;
            const name = member.name || "Unknown";
            const colour = current < 500 ? 'red' : current < 1000 ? 'orange' : 'lightgreen';

            const entry = document.createElement("div");
            entry.style.marginBottom = "10px";
            entry.innerHTML = `
                <strong>${name}</strong><br>
                <span style="color: ${colour}">Life: ${current}/${maximum}</span><br>
            `;
            content.appendChild(entry);
        }
    };

    const modal = createModal();
    const button = createButton();
    button.addEventListener("click", () => {
        modal.style.display = "block";
        refreshEnemyData(); // auto-refresh on open
    });
})();
