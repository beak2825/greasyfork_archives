// ==UserScript==
// @name         Torn War Sidebar Assistant with Fair-Fight (Auto-refresh)
// @namespace    http://tampermonkey.net/
// @version      1.8.1
// @description  Displays war stats and fair-fight targets in Torn's sidebar. Auto-refreshes every 15s and includes manual refresh button for new war detection.
// @author       Ambidextrous
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535070/Torn%20War%20Sidebar%20Assistant%20with%20Fair-Fight%20%28Auto-refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535070/Torn%20War%20Sidebar%20Assistant%20with%20Fair-Fight%20%28Auto-refresh%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_KEY_STORAGE_KEY = "torn_war_api_key";
    const FACTION_CACHE_KEY = "cached_enemy_faction_id";
    const MY_FACTION_NAME = "Monarch Optimus";
    const REFRESH_INTERVAL = 15000; // 15 seconds

    let currentEnemyFactionId = null;
    let userLevel = null;
    let userStats = null;
    let sidebar = null;

    async function getAPIKey() {
        let key = localStorage.getItem(API_KEY_STORAGE_KEY);
        if (!key) {
            key = prompt("Enter your Torn API key:");
            if (key) localStorage.setItem(API_KEY_STORAGE_KEY, key);
            else alert("API key is required.");
        }
        return key;
    }

    async function fetchUserStats(apiKey) {
        const res = await fetch(`https://api.torn.com/user/?selections=personalstats,basic&key=${apiKey}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error.error);
        return {
            stats: data.personalstats,
            level: data.level
        };
    }

    async function fetchLatestEnemyFactionID(apiKey, forceRefresh = false) {
        if (!forceRefresh && currentEnemyFactionId) return currentEnemyFactionId;

        try {
            const res = await fetch(`https://api.torn.com/faction/?selections=rankedwars&key=${apiKey}`);
            const data = await res.json();
            const wars = Object.values(data.rankedwars || {}).reverse();

            const latestEnemy = wars.find(war => !war.faction_name.includes(MY_FACTION_NAME));
            if (latestEnemy?.faction) {
                localStorage.setItem(FACTION_CACHE_KEY, latestEnemy.faction);
                currentEnemyFactionId = latestEnemy.faction;
                return latestEnemy.faction;
            } else {
                throw new Error("Enemy faction not found.");
            }
        } catch (err) {
            const cached = localStorage.getItem(FACTION_CACHE_KEY);
            if (cached) {
                currentEnemyFactionId = cached;
                return cached;
            }
            const manual = prompt("Enter enemy faction ID manually:");
            if (manual) {
                localStorage.setItem(FACTION_CACHE_KEY, manual);
                currentEnemyFactionId = manual;
                return manual;
            }
            throw new Error("No faction ID available.");
        }
    }

    async function fetchEnemyFactionMembers(factionId, apiKey) {
        const res = await fetch(`https://api.torn.com/faction/${factionId}?selections=basic&key=${apiKey}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error.error);
        return Object.values(data.members || {});
    }

    function isFairFight(myLevel, enemyLevel) {
        return enemyLevel >= myLevel * 0.85 && enemyLevel <= myLevel * 1.15;
    }

    function createOrUpdateSidebarPanel(fairTargets) {
        if (!sidebar) sidebar = document.querySelector('#sidebarroot');
        let panel = document.getElementById('war-tracker');
        if (panel) panel.remove();

        panel = document.createElement('div');
        panel.id = 'war-tracker';
        panel.style.padding = '10px';
        panel.style.margin = '10px';
        panel.style.backgroundColor = '#111';
        panel.style.color = 'white';
        panel.style.border = '1px solid #444';
        panel.style.borderRadius = '6px';
        panel.style.fontSize = '12px';

        const targetsHTML = fairTargets.length > 0
            ? fairTargets.map(t => `<a>${t.name} Lvl ${t.level}</a><li><a href="https://www.torn.com/profiles.php?XID=${t.ID}" target="_blank">Attack!</li></a>`).join("")
            : "<li>No fair-fight targets found.</li>";

        panel.innerHTML = `
            <h3 style="margin-top: 0;">War Stats</h3>
            <p><b># of Hits:</b> ${userStats?.attackhits ?? 'N/A'}</p><br>
            <p style="color:DodgerBlue;"><b>Respect:</b> ${userStats?.respectforfaction ?? 'N/A'}</p><br>
            <p style="color:Tomato;"><b># of Losses:</b> ${userStats?.criticalhits ?? 'N/A'}</p><br>
            <hr>
            <br><br>
            <h3>Fair-Fight Targets</h3>
            <ul>${targetsHTML}</ul>
            <button id="manual-refresh" style="margin-top:10px;padding:5px;background:#444;color:white;border:none;border-radius:4px;cursor:pointer;">🔄 Refresh Targets</button>
        `;

        panel.querySelector('#manual-refresh').addEventListener('click', async () => {
            localStorage.removeItem(FACTION_CACHE_KEY);
            currentEnemyFactionId = null;
            await refresh();
        });

        sidebar.prepend(panel);
    }

    async function refresh() {
        try {
            const apiKey = await getAPIKey();
            if (!apiKey) return;

            if (!userStats || !userLevel) {
                const { stats, level } = await fetchUserStats(apiKey);
                userStats = stats;
                userLevel = level;
            }

            const factionId = await fetchLatestEnemyFactionID(apiKey);
            const enemies = await fetchEnemyFactionMembers(factionId, apiKey);
            const fairTargets = enemies.filter(m => isFairFight(userLevel, m.level));
            fairTargets.sort((a, b) => Math.abs(userLevel - a.level) - Math.abs(userLevel - b.level));

            createOrUpdateSidebarPanel(fairTargets);
        } catch (err) {
            console.error("Failed to refresh data:", err.message);
        }
    }

    function startAutoRefresh() {
        refresh();
        setInterval(refresh, REFRESH_INTERVAL);
    }

    setTimeout(startAutoRefresh, 1);
})();
