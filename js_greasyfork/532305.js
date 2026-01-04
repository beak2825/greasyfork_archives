// ==UserScript==
// @name         War Status for Torn
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Show player status in faction ranked war with hospital timers. Auto-refresh every 30s. 
// @author       GeoLv
// @match        https://www.torn.com/factions.php*
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @downloadURL https://update.greasyfork.org/scripts/532305/War%20Status%20for%20Torn.user.js
// @updateURL https://update.greasyfork.org/scripts/532305/War%20Status%20for%20Torn.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'tm_api_key';
    const REFRESH_INTERVAL_MS = 30000;

    function getStoredApiKey() {
        return localStorage.getItem(STORAGE_KEY);
    }

    function setStoredApiKey(key) {
        localStorage.setItem(STORAGE_KEY, key);
    }

    function showSetApiKeyButton() {
        const toolbar = document.querySelector('.f-war .title-black') || document.querySelector('.content-title');
        if (!toolbar) return;

        const btn = document.createElement('button');
        btn.textContent = '🔑 Set API Key';
        btn.style.marginLeft = '10px';
        btn.style.padding = '2px 6px';
        btn.style.fontSize = '12px';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '4px';
        btn.style.border = '1px solid #888';
        btn.style.backgroundColor = '#f0f0f0';

        btn.onclick = () => {
            const newKey = prompt('Enter your Torn Public API Key:');
            if (newKey && newKey.length >= 16) {
                setStoredApiKey(newKey.trim());
                alert('API key saved! Reloading data...');
                updatePlayerRows(); // refresh immediately
            } else {
                alert('Invalid API key.');
            }
        };

        toolbar.appendChild(btn);
    }

    function getPlayerIds() {
        const rows = document.querySelectorAll('.member-wrap');
        const playerData = [];

        rows.forEach(row => {
            const link = row.querySelector('a[href*="profiles.php"]');
            if (link) {
                const href = link.getAttribute('href');
                const match = href.match(/XID=(\d+)/);
                if (match) {
                    const userId = match[1];
                    playerData.push({ row, userId });
                }
            }
        });

        return playerData;
    }

    function fetchPlayerStatus(userId, apiKey) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/user/${userId}?selections=basic&key=${apiKey}`,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject
            });
        });
    }

    async function updatePlayerRows() {
        const apiKey = getStoredApiKey();
        if (!apiKey) {
            console.warn('No API key set. Use the "Set API Key" button.');
            return;
        }

        const players = getPlayerIds();
        for (const { row, userId } of players) {
            try {
                const data = await fetchPlayerStatus(userId, apiKey);
                const status = data.status?.description || 'Unknown';

                let extra = '';
                if (data.status?.state === 'Hospital') {
                    const secondsLeft = data.status.until - Math.floor(Date.now() / 1000);
                    const mins = Math.floor(secondsLeft / 60);
                    const secs = secondsLeft % 60;
                    extra = ` (${mins}m ${secs}s)`;
                }

                // Remove old status
                const existingStatus = row.querySelector('.tm-status-indicator');
                if (existingStatus) existingStatus.remove();

                const statusElement = document.createElement('div');
                statusElement.className = 'tm-status-indicator';
                statusElement.textContent = `[${status}${extra}]`;
                statusElement.style.fontWeight = 'bold';
                statusElement.style.marginTop = '4px';
                statusElement.style.color = status === 'Hospital' ? 'red' : status === 'Traveling' ? 'orange' : 'green';

                row.querySelector('.user-info')?.appendChild(statusElement);
            } catch (err) {
                console.error(`Error getting status for user ${userId}`, err);
            }
        }
    }

    // Initial setup
    window.addEventListener('load', () => {
        setTimeout(() => {
            showSetApiKeyButton();
            updatePlayerRows();
            setInterval(updatePlayerRows, REFRESH_INTERVAL_MS);
        }, 2000);
    });

})();
