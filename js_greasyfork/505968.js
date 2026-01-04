// ==UserScript==
// @name         Torn Enemy Faction Hospital Time (Filtered & Enhanced)
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Shows lowest hospital times and faction members, with filtering by level and travel status, preserving original functionality and styling.
// @author       FunkyCrunchy
// @match        https://www.torn.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505968/Torn%20Enemy%20Faction%20Hospital%20Time%20%28Filtered%20%20Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505968/Torn%20Enemy%20Faction%20Hospital%20Time%20%28Filtered%20%20Enhanced%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const currentPage = window.location.href;

    function saveSettings(apiKey, factionId, scriptEnabled, refreshInterval, hideTravelers, minLevel, maxLevel) {
        localStorage.setItem('tornApiKey', apiKey);
        localStorage.setItem('tornFactionId', factionId);
        localStorage.setItem('warMonitorEnabled', scriptEnabled);
        localStorage.setItem('refreshInterval', refreshInterval);
        localStorage.setItem('hideTravelers', hideTravelers);
        localStorage.setItem('minLevel', minLevel);
        localStorage.setItem('maxLevel', maxLevel);
    }

    function getSettings() {
        return {
            apiKey: localStorage.getItem('tornApiKey') || '',
            factionId: localStorage.getItem('tornFactionId') || '',
            scriptEnabled: localStorage.getItem('warMonitorEnabled') === 'true',
            refreshInterval: parseInt(localStorage.getItem('refreshInterval'), 10) || 60,
            hideTravelers: localStorage.getItem('hideTravelers') === 'true',
            minLevel: parseInt(localStorage.getItem('minLevel'), 10) || 1,
            maxLevel: parseInt(localStorage.getItem('maxLevel'), 10) || 100,
        };
    }

    function displaySettingsInput() {
        const settings = getSettings();
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.width = '280px';
        container.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        container.style.color = 'white';
        container.style.padding = '15px';
        container.style.borderRadius = '10px';
        container.style.zIndex = '10000';
        container.style.fontSize = '13px';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(container);

        container.innerHTML = `
            <h3 style="text-align:center;">Torn API Settings</h3>
            <label>API Key:</label><input type="text" id="apiKey" value="${settings.apiKey}" style="width:100%;margin-bottom:10px;"/>
            <label>Faction ID:</label><input type="text" id="factionId" value="${settings.factionId}" style="width:100%;margin-bottom:10px;"/>
            <label>Enable War Monitor:</label><input type="checkbox" id="scriptEnabled" ${settings.scriptEnabled ? 'checked' : ''}/><br/><br/>
            <label>Refresh Interval (seconds):</label><input type="number" id="refreshInterval" value="${settings.refreshInterval}" style="width:100%;margin-bottom:10px;"/>
            <label>Hide Traveling Members:</label><input type="checkbox" id="hideTravelers" ${settings.hideTravelers ? 'checked' : ''}/><br/><br/>
            <label>Min Level:</label><input type="number" id="minLevel" value="${settings.minLevel}" style="width:100%;margin-bottom:10px;"/>
            <label>Max Level:</label><input type="number" id="maxLevel" value="${settings.maxLevel}" style="width:100%;margin-bottom:10px;"/>
            <button id="saveSettings" style="width:100%;padding:8px;background:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;">Save Settings</button>
        `;

        document.getElementById('saveSettings').onclick = () => {
            const apiKey = document.getElementById('apiKey').value;
            const factionId = document.getElementById('factionId').value;
            const scriptEnabled = document.getElementById('scriptEnabled').checked;
            const refreshInterval = parseInt(document.getElementById('refreshInterval').value, 10);
            const hideTravelers = document.getElementById('hideTravelers').checked;
            const minLevel = parseInt(document.getElementById('minLevel').value, 10);
            const maxLevel = parseInt(document.getElementById('maxLevel').value, 10);

            saveSettings(apiKey, factionId, scriptEnabled, refreshInterval, hideTravelers, minLevel, maxLevel);
            alert('Settings saved!');
        };
    }

    function createContainer() {
        const container = document.createElement('div');
        container.id = 'hospital-time-container';
        container.style.cssText = 'position:fixed;top:150px;left:5px;width:260px;max-height:700px;overflow:auto;background:rgba(0,0,0,0.85);color:white;padding:10px;border-radius:10px;z-index:10000;font-size:12px;font-family:Arial,sans-serif;box-shadow:0 0 10px rgba(0,0,0,0.5)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'flex-start';
        container.style.lineHeight = '1.2';
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.innerHTML = `
            #hospital-time-container::-webkit-scrollbar {
                width: 10px;
            }
            #hospital-time-container::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
            }
            #hospital-time-container::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
            }
            #hospital-time-container::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        `;
        document.head.appendChild(style);
    }

    function displayHospitalTime(container, name, level, mins, secs) {
        const div = document.createElement('div');
        div.textContent = `[Lvl: ${level}] ${name}: ${mins} min ${secs} sec left.`;
        div.style.padding = '6px 10px';
        div.style.marginBottom = '6px';
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        div.style.borderRadius = '5px';
        div.style.width = '100%';
        div.style.boxSizing = 'border-box';
        container.appendChild(div);
    }

    function displayNonHospitalizedMember(container, name, level, id, status) {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
        div.style.padding = '6px 10px';
        div.style.marginBottom = '6px';
        div.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        div.style.borderRadius = '5px';
        div.style.width = '100%';
        div.style.boxSizing = 'border-box';

        const nameLink = document.createElement('a');
        nameLink.href = `https://www.torn.com/profiles.php?XID=${id}`;
        nameLink.textContent = `[Lvl: ${level}] ${name}`;
        nameLink.style.color = '#add8e6';
        nameLink.style.textDecoration = 'none';
        nameLink.target = '_blank';

        const isTraveling = status?.state === 'Traveling';
        const location = status?.description || '';

        if (isTraveling || location.toLowerCase().includes('traveling')) {
            const tag = document.createElement('span');
            tag.textContent = `Traveling${location ? ` (${location})` : ''}`;
            tag.style.backgroundColor = '#1e90ff';
            tag.style.color = 'white';
            tag.style.padding = '3px 6px';
            tag.style.borderRadius = '3px';
            tag.style.marginLeft = '10px';
            tag.style.cursor = 'default';
            div.appendChild(nameLink);
            div.appendChild(tag);
        } else {
            const attack = document.createElement('a');
            attack.href = `https://www.torn.com/loader2.php?sid=getInAttack&user2ID=${id}`;
            attack.textContent = 'Attack';
            attack.style.backgroundColor = '#ff4d4d';
            attack.style.color = 'white';
            attack.style.padding = '3px 6px';
            attack.style.borderRadius = '3px';
            attack.style.textDecoration = 'none';
            attack.style.marginLeft = '10px';
            div.appendChild(nameLink);
            div.appendChild(attack);
        }

        container.appendChild(div);
    }

    function fetchHospitalData(apiKey, factionId, hideTravelers, minLevel, maxLevel) {
        fetch(`https://api.torn.com/faction/${factionId}?selections=basic&key=${apiKey}`)
            .then(res => res.json())
            .then(data => {
                const container = document.getElementById('hospital-time-container');
                container.innerHTML = '';
                if (data.error || !data.members) {
                    container.innerText = 'API Error or no data.';
                    return;
                }

                let membersInHospital = [], membersNotInHospital = [];
                for (let id in data.members) {
                    const m = data.members[id];
                    const status = m.status || {};
                    const isTraveling = status.state === 'Traveling' || (status.description || '').toLowerCase().includes('travel');
                    if (m.level < minLevel || m.level > maxLevel || (hideTravelers && isTraveling)) continue;

                    if (status.state === 'Hospital' && status.until) {
                        const timeLeft = status.until - Math.floor(Date.now() / 1000);
                        if (timeLeft > 0) membersInHospital.push({ ...m, timeLeft });
                    } else {
                        membersNotInHospital.push({ ...m, id, status });
                    }
                }

                membersInHospital.sort((a, b) => a.timeLeft - b.timeLeft);
                membersNotInHospital.sort((a, b) => b.level - a.level);

                if (membersInHospital.length) {
                    const header = document.createElement('h4');
                    header.textContent = 'Top 10 Lowest Hospital Times';
                    container.appendChild(header);
                    membersInHospital.slice(0, 10).forEach(m => {
                        const mins = Math.floor(m.timeLeft / 60);
                        const secs = m.timeLeft % 60;
                        displayHospitalTime(container, m.name, m.level, mins, secs);
                    });
                }

                if (membersNotInHospital.length) {
                    const header = document.createElement('h4');
                    header.textContent = 'Members Not in Hospital';
                    container.appendChild(header);
                    membersNotInHospital.forEach(m => {
                        displayNonHospitalizedMember(container, m.name, m.level, m.id, m.status);
                    });
                }

                if (!membersInHospital.length && !membersNotInHospital.length) {
                    container.innerHTML = '<div style="padding:10px;">No members match the filter.</div>';
                }
            })
            .catch(err => {
                const container = document.getElementById('hospital-time-container');
                container.innerText = 'Failed to fetch data.';
                console.error(err);
            });
    }

    const { apiKey, factionId, scriptEnabled, refreshInterval, hideTravelers, minLevel, maxLevel } = getSettings();
    if (currentPage.includes('preferences.php')) {
        displaySettingsInput();
    } else if (scriptEnabled && apiKey && factionId) {
        createContainer();
        fetchHospitalData(apiKey, factionId, hideTravelers, minLevel, maxLevel);
        setInterval(() => fetchHospitalData(apiKey, factionId, hideTravelers, minLevel, maxLevel), refreshInterval * 1000);
    }
})();
