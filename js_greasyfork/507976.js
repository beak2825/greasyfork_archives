// ==UserScript==
// @name         Torn Cooldowns Status
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Displays cooldown statuses (drug, medical, booster) from the Torn API, colored for easier viewing.
// @author       QueenLunara [3408686]
// @match        https://www.torn.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @license      GNU GLPv3
// @downloadURL https://update.greasyfork.org/scripts/507976/Torn%20Cooldowns%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/507976/Torn%20Cooldowns%20Status.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let resetAPIEnabled = false; // Added a Reset Button that can be toggled on/off in the code to reset your API key!

    const API_KEY = GM_getValue('API_KEY') || prompt("Please enter your API key:");
    if (API_KEY) GM_setValue('API_KEY', API_KEY);
    const CHECK_INTERVAL = 30000;
    const isMinimized = GM_getValue('isMinimized', false);
    const savedData = GM_getValue('cooldownData', 'No data yet.');
    let cooldowns = GM_getValue('cooldowns', {});
    function createPanel() {
        let panel = document.createElement('div');
        panel.id = 'cooldownPanel';
        panel.style.position = 'fixed';
        panel.style.top = '5%';
        panel.style.left = '5px';
        panel.style.padding = '10px';
        panel.style.border = '2px solid #444';
        panel.style.backgroundColor = '#1f1f1f';
        panel.style.color = 'white';
        panel.style.width = '200px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0px 0px 15px rgba(0, 0, 0, 0.5)';
        panel.style.zIndex = '999999';
        panel.innerHTML = `
            <button id="minimizeButton" style="padding: 6px 12px; background-color: #4CAF50; color: white; font-weight: bold; border: none; cursor: pointer; width: 100%; border-radius: 5px;">${isMinimized ? '+' : '-'}</button>
            <div id="content" style="display: ${isMinimized ? 'none' : 'block'};">
                <div style="padding: 15px; font-weight: bold; background: #2e2e2e; text-align: center; border-radius: 5px; margin-bottom: 10px;">Cooldown Status</div>
                <div style="max-height: 300px; overflow-y: auto; margin-top: 15px; border-top: 1px solid #555; padding-top: 10px; font-family: 'Arial', sans-serif;">
                    <p id="lastChecked" style="color: #a0a0a0; font-size: 14px; margin-bottom: 15px;">Last checked: ${GM_getValue('lastCheckedTime') ? new Date(GM_getValue('lastCheckedTime')).toLocaleString() : 'Never'}</p>
                    <div class="cooldown_List" style="padding: 10px; background-color: #292929; border-radius: 5px;">${savedData}</div>
                </div>
                ${resetAPIEnabled ? '<button id="resetAPIButton" style="padding: 6px 12px; background-color: #f44336; color: white; font-weight: bold; border: none; cursor: pointer; width: 100%; border-radius: 5px; margin-top: 10px;">Reset API Key</button>' : ''}
            </div>
        `;
        document.body.appendChild(panel);
        document.getElementById('minimizeButton').addEventListener('click', toggleMinimize);
        if (resetAPIEnabled) {
            document.getElementById('resetAPIButton').addEventListener('click', resetAPIKey);
        }
    }
    function toggleMinimize() {
        const content = document.getElementById('content');
        if (content.style.display === 'none') {
            content.style.display = 'block';
            this.textContent = '-';
            GM_setValue('isMinimized', false);
        } else {
            content.style.display = 'none';
            this.textContent = '+';
            GM_setValue('isMinimized', true);
        }
    }
    function resetAPIKey() {
        GM_setValue('API_KEY', null);
        const newAPIKey = prompt("Please enter your new API key:");
        if (newAPIKey) {
            GM_setValue('API_KEY', newAPIKey);
            alert('API key has been reset successfully.');
            location.reload();
        } else {
            alert('API key reset canceled.');
        }
    }
    function fetchCooldownData() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://api.torn.com/user/?selections=cooldowns&key=${API_KEY}`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.error) {
                    alert(`Error code - ${data.error.code} | ${data.error.error}`);
                    return;
                }
                GM_setValue('lastCheckedTime', Date.now());
                cooldowns = extractCooldownData(data.cooldowns);
                GM_setValue('cooldowns', cooldowns);
                displayCooldowns(cooldowns);
            },
            onerror: function() {
                console.error('Error fetching cooldown data.');
            }
        });
    }
    function extractCooldownData(cooldowns) {
        const now = Math.floor(Date.now() / 1000);
        return {
            Drug: cooldowns.drug + now,
            Medical: cooldowns.medical + now,
            Booster: cooldowns.booster + now
        };
    }
    function formatTime(seconds) {
        const remainingSeconds = Math.max(seconds - Math.floor(Date.now() / 1000), 0);
        if (remainingSeconds === 0) {
            return 'Ready';
        }
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const secs = remainingSeconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    function displayCooldowns(cooldowns) {
        let cooldownDisplay = '';
        Object.keys(cooldowns).forEach(cooldownType => {
            const time = formatTime(cooldowns[cooldownType]);
            const statusColor = (cooldowns[cooldownType] - Math.floor(Date.now() / 1000)) <= 0 ? '#4CAF50' : '#FF5733';
            cooldownDisplay += `
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; color: #f5f5f5; margin-bottom: 5px;">${cooldownType}</div>
                    <div style="padding: 10px; background: ${statusColor}; border-radius: 5px; color: white; text-align: center;">
                        ${time}
                    </div>
                </div>
            `;
        });
        GM_setValue('cooldownData', cooldownDisplay);
        document.querySelector('.cooldown_List').innerHTML = cooldownDisplay;
        document.getElementById('lastChecked').innerText = `Last checked: ${new Date(GM_getValue('lastCheckedTime')).toLocaleString()}`;
    }
    setInterval(() => {
        fetchCooldownData();
    }, CHECK_INTERVAL);
    GM_addStyle(`
    .added_Container {
        z-index: 1000;
        position: absolute;
        margin: 10px;
        left: 20%;
    }
    .section_Header {
        background: repeating-linear-gradient(90deg, #2e2e2e, #2e2e2e 2px, #282828 0, #282828 4px);
        color: #fff;
        padding: 5px;
    }
    `);
    createPanel();
    fetchCooldownData();
})();
