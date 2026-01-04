// ==UserScript==
// @name         BSV (Battle Stats Viewer) with TornStats and YATA Integration
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Fetch and display combined battle stats for users in Torn factions, profiles, and other pages, with TornStats and YATA integration.
// @author       Homiewrecker
// @license      MIT
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/joblist.php*
// @match        https://www.torn.com/index.php?page=people*
// @match        https://www.torn.com/pmarket.php
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @connect      api.torn.com
// @connect      www.tornstats.com
// @connect      yata.yt
// @grant        GM_xmlHttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/509315/BSV%20%28Battle%20Stats%20Viewer%29%20with%20TornStats%20and%20YATA%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/509315/BSV%20%28Battle%20Stats%20Viewer%29%20with%20TornStats%20and%20YATA%20Integration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const apiKey = "NVbPeZYdgzRHiqjw"; // Torn API key

    // Add custom styling for battle stats table
    GM_addStyle(`
        .stats-table {
            border-collapse: collapse;
            width: 100%;
            background-color: #f0f0f0;
            color: #000;
        }
        .stats-table th, .stats-table td {
            padding: 4px;
            border: 1px solid #ccc;
            text-align: center;
        }
        .stats-header {
            background-color: #333;
            color: #fff;
            padding: 5px;
            text-align: center;
        }
    `);

    // Fetch TornStats spy data using TornStats API
    async function fetchTornStatsSpy(userId) {
        try {
            return new Promise((resolve, reject) => {
                GM_xmlHttpRequest({
                    method: "GET",
                    url: `https://www.tornstats.com/api/v1/${apiKey}/spy/${userId}`,
                    onload: function(response) {
                        const spyData = JSON.parse(response.responseText);
                        if (spyData.spy && spyData.spy.status === true) {
                            resolve({
                                strength: spyData.spy.strength,
                                defense: spyData.spy.defense,
                                speed: spyData.spy.speed,
                                dexterity: spyData.spy.dexterity,
                                total: spyData.spy.total,
                                fairFight: spyData.spy.fair_fight_bonus
                            });
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: function(response) {
                        console.error("Failed to fetch from TornStats:", response.statusText);
                        reject(response);
                    }
                });
            });
        } catch (error) {
            console.error("TornStats API error:", error);
            return null;
        }
    }

    // Fallback: Fetch YATA spy data using YATA API
    async function fetchYATAStats(userId) {
        try {
            return new Promise((resolve, reject) => {
                GM_xmlHttpRequest({
                    method: "GET",
                    url: `https://yata.yt/api/v1/${apiKey}/spy/${userId}`,
                    onload: function(response) {
                        const yataData = JSON.parse(response.responseText);
                        if (yataData && yataData.status === "success") {
                            resolve({
                                strength: yataData.data.strength,
                                defense: yataData.data.defense,
                                speed: yataData.data.speed,
                                dexterity: yataData.data.dexterity,
                                total: yataData.data.total,
                                fairFight: yataData.data.fair_fight
                            });
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: function(response) {
                        console.error("Failed to fetch from YATA:", response.statusText);
                        reject(response);
                    }
                });
            });
        } catch (error) {
            console.error("YATA API error:", error);
            return null;
        }
    }

    // Fetch battle stats from Torn API as fallback
    async function fetchBattleStats(userId) {
        try {
            return new Promise((resolve, reject) => {
                GM_xmlHttpRequest({
                    method: "GET",
                    url: `https://api.torn.com/user/${userId}?selections=battlestats&key=${apiKey}`,
                    onload: function(response) {
                        const data = JSON.parse(response.responseText);
                        if (data.strength && data.defense && data.speed && data.dexterity) {
                            const totalStats = {
                                strength: data.strength,
                                defense: data.defense,
                                speed: data.speed,
                                dexterity: data.dexterity,
                                total: data.strength + data.defense + data.speed + data.dexterity
                            };
                            resolve(totalStats);
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: function(response) {
                        console.error("Failed to fetch from Torn API:", response.statusText);
                        reject(response);
                    }
                });
            });
        } catch (error) {
            console.error("Torn API error:", error);
            return null;
        }
    }

    // Combine TornStats, YATA, and Torn API to get the battle stats
    async function fetchCombinedStats(userId) {
        let stats = await fetchTornStatsSpy(userId);
        if (!stats) {
            stats = await fetchYATAStats(userId);
        }
        if (!stats) {
            stats = await fetchBattleStats(userId);
        }
        return stats;
    }

    // Insert battle stats into the profile page
    async function insertProfileBattleStats() {
        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get('XID');

        if (userId) {
            const stats = await fetchCombinedStats(userId);
            const actionsBox = document.querySelector('.profile-wrap .profile-actions');
            if (actionsBox && stats) {
                const statsDiv = document.createElement('div');
                statsDiv.style.padding = '10px';
                statsDiv.style.background = '#f0f0f0';
                statsDiv.style.border = '1px solid #ccc';
                statsDiv.style.margin = '10px 0';
                statsDiv.innerHTML = `
                    <h3>Battle Stats</h3>
                    <table class="stats-table">
                        <tr><th>Stat</th><th>Value</th></tr>
                        <tr><td>Strength</td><td>${stats.strength.toLocaleString()}</td></tr>
                        <tr><td>Defense</td><td>${stats.defense.toLocaleString()}</td></tr>
                        <tr><td>Speed</td><td>${stats.speed.toLocaleString()}</td></tr>
                        <tr><td>Dexterity</td><td>${stats.dexterity.toLocaleString()}</td></tr>
                        <tr><th>Total</th><th>${stats.total.toLocaleString()}</th></tr>
                        ${stats.fairFight ? `<tr><td>Fair Fight</td><td>${stats.fairFight}</td></tr>` : ''}
                    </table>
                `;
                actionsBox.parentNode.insertBefore(statsDiv, actionsBox.nextSibling); // Insert below "actions" box
            }
        }
    }

    // Insert battle stats into faction member list
    async function insertFactionMemberStats() {
        const members = document.querySelectorAll('.members-list .member');

        for (const member of members) {
            const profileLink = member.querySelector('.user.name > a');
            if (profileLink) {
                const userId = profileLink.href.split('=')[1];
                const stats = await fetchCombinedStats(userId);
                const statsDiv = member.querySelector('.total-stats');
                if (statsDiv && stats) {
                    statsDiv.innerHTML = `
                        <table class="stats-table">
                            <tr><th>Total Stats</th></tr>
                            <tr><td>${stats.total.toLocaleString()}</td></tr>
                            ${stats.fairFight ? `<tr><td>Fair Fight</td><td>${stats.fairFight}</td></tr>` : ''}
                        </table>
                    `;
                }
            }
        }
    }

    // Insert battle stats column into faction page
    function insertBattleStatsColumn() {
        const tableHeaders = document.querySelectorAll('.members-list .member-info-title');
        const statsHeader = document.createElement('div');
        statsHeader.classList.add('member-info-title', 'stats-header');
        statsHeader.innerText = 'Total Stats';
        statsHeader.style.width = '120px';

        // Insert the new column header after the level column
        tableHeaders[2].insertAdjacentElement('afterend', statsHeader);

        // For each member row, insert a placeholder for battle stats
        const members = document.querySelectorAll('.members-list .member');
        members.forEach(member => {
            const statsDiv = document.createElement('div');
            statsDiv.classList.add('member-info', 'total-stats');
            statsDiv.style.width = '120px';
            statsDiv.innerText = 'Loading...';
            member.querySelector('.member-info.level').insertAdjacentElement('afterend', statsDiv);

            // Fetch and insert the battle stats for each member
            fetchCombinedStats(member.querySelector('.user.name > a').href.split('=')[1]).then(stats => {
                if (stats) {
                    statsDiv.innerHTML = `
                        <table class="stats-table">
                            <tr><th>Total Stats</th></tr>
                            <tr><td>${stats.total.toLocaleString()}</td></tr>
                            ${stats.fairFight ? `<tr><td>Fair Fight</td><td>${stats.fairFight}</td></tr>` : ''}
                        </table>
                    `;
                } else {
                    statsDiv.innerText = 'No stats available';
                }
            }).catch(err => {
                console.error("Error fetching stats:", err);
                statsDiv.innerText = 'Error fetching stats';
            });
        });
    }

    // Start observing the page to insert stats after elements are loaded
    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.members-list') || document.querySelector('.profile-wrap')) {
            insertProfileBattleStats();
            insertFactionMemberStats();
            insertBattleStatsColumn();
            obs.disconnect(); // Stop observing after elements are loaded
        }
    });

    observer.observe(document, { childList: true, subtree: true });

})();