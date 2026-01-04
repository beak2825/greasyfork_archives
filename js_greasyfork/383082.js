// ==UserScript==
// @name         BH Stealers Tracker with XP Monitoring
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Track player locations and XP changes with alerts
// @author       N.Tsvetkov
// @include      /^https:\/\/www\.erepublik\.com\/[a-z]{2}$/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383082/BH%20Stealers%20Tracker%20with%20XP%20Monitoring.user.js
// @updateURL https://update.greasyfork.org/scripts/383082/BH%20Stealers%20Tracker%20with%20XP%20Monitoring.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration constants
    const CONFIG = {
        defaultPlayerIds: [6183414, 9683071, 3527077],
        checkInterval: 40000, // 40 seconds
        beepSound: "data:audio/wav;base64,//uQRAAAAWMSLwUIYAAsYkXgoQwAEaYLWfkWgAI0wWs/ItAAAGDgYtAgAyN+QWaAAihwMWm4G8QQRDiMcCBcH3Cc+CDv/7xA4Tvh9Rz/y8QADBwMWgQAZG/ILNAARQ4GLTcDeIIIhxGOBAuD7hOfBB3/94gcJ3w+o5/5eIAIAAAVwWgQAVQ2ORaIQwEMAJiDg95G4nQL7mQVWI6GwRcfsZAcsKkJvxgxEjzFUgfHoSQ9Qq7KNwqHwuB13MA4a1q/DmBrHgPcmjiGoh//EwC5nGPEmS4RcfkVKOhJf+WOgoxJclFz3kgn//dBA+ya1GhurNn8zb//9NNutNuhz31f////9vt///z+IdAEAAAK4LQIAKobHItEIYCGAExBwe8jcToF9zIKrEdDYIuP2MgOWFSE34wYiR5iqQPj0JIeoVdlG4VD4XA67mAcNa1fhzA1jwHuTRxDUQ//iYBczjHiTJcIuPyKlHQkv/LHQUYkuSi57yQT//uggfZNajQ3Vmz+Zt//+mm3Wm3Q576v////+32///5/EOgAAADVghQAAAAA//uQZAUAB1WI0PZugAAAAAoQwAAAEk3nRd2qAAAAACiDgAAAAAAABCqEEQRLCgwpBGMlJkIz8jKhGvj4k6jzRnqasNKIeoh5gI7BJaC1A1AoNBjJgbyApVS4IDlZgDU5WUAxEKDNmmALHzZp0Fkz1FMTmGFl1FMEyodIavcCAUHDWrKAIA4aa2oCgILEBupZgHvAhEBcZ6joQBxS76AgccrFlczBvKLC0QI2cBoCFvfTDAo7eoOQInqDPBtvrDEZBNYN5xwNwxQRfw8ZQ5wQVLvO8OYU+mHvFLlDh05Mdg7BT6YrRPpCBznMB2r//xKJjyyOh+cImr2/4doscwD6neZjuZR4AgAABYAAAABy1xcdQtxYBYYZdifkUDgzzXaXn98Z0oi9ILU5mBjFANmRwlVJ3/6jYDAmxaiDG3/6xjQQCCKkRb/6kg/wW+kSJ5//rLobkLSiKmqP/0ikJuDaSaSf/6JiLYLEYnW/+kXg1WRVJL/9EmQ1YZIsv/6Qzwy5qk7/+tEU0nkls3/zIUMPKNX/6yZLf+kFgAfgGyLFAUwY//uQZAUABcd5UiNPVXAAAApAAAAAE0VZQKw9ISAAACgAAAAAVQIygIElVrFkBS+Jhi+EAuu+lKAkYUEIsmEAEoMeDmCETMvfSHTGkF5RWH7kz/ESHWPAq/kcCRhqBtMdokPdM7vil7RG98A2sc7zO6ZvTdM7pmOUAZTnJW+NXxqmd41dqJ6mLTXxrPpnV8avaIf5SvL7pndPvPpndJR9Kuu8fePvuiuhorgWjp7Mf/PRjxcFCPDkW31srioCExivv9lcwKEaHsf/7ow2Fl1T/9RkXgEhYElAoCLFtMArxwivDJJ+bR1HTKJdlEoTELCIqgEwVGSQ+hIm0NbK8WXcTEI0UPoa2NbG4y2K00JEWbZavJXkYaqo9CRHS55FcZTjKEk3NKoCYUnSQ0rWxrZbFKbKIhOKPZe1cJKzZSaQrIyULHDZmV5K4xySsDRKWOruanGtjLJXFEmwaIbDLX0hIPBUQPVFVkQkDoUNfSoDgQGKPekoxeGzA4DUvnn4bxzcZrtJyipKfPNy5w+9lnXwgqsiyHNeSVpemw4bWb9psYeq"
    };

    // Country flag mapping
    const COUNTRY_FLAGS = {
        1: "Romania", 9: "Brazil", 10: "Italy", 11: "France", 12: "Germany",
        13: "Hungary", 14: "China", 15: "Spain", 23: "Canada", 24: "USA",
        26: "Mexico", 27: "Argentina", 28: "Venezuela", 29: "United-Kingdom",
        30: "Switzerland", 31: "Netherlands", 32: "Belgium", 33: "Austria",
        34: "Czech-Republic", 35: "Poland", 36: "Slovakia", 37: "Norway",
        38: "Sweden", 39: "Finland", 40: "Ukraine", 41: "Russia", 42: "Bulgaria",
        43: "Turkey", 44: "Greece", 45: "Japan", 47: "South-Korea", 48: "India",
        49: "Indonesia", 50: "Australia", 51: "South-Africa", 52: "Republic-of-Moldova",
        53: "Portugal", 54: "Ireland", 55: "Denmark", 56: "Iran", 57: "Pakistan",
        58: "Israel", 59: "Thailand", 61: "Slovenia", 63: "Croatia", 64: "Chile",
        65: "Serbia", 66: "Malaysia", 67: "Philippines", 68: "Singapore",
        69: "Bosnia-Herzegovina", 70: "Estonia", 71: "Latvia", 72: "Lithuania",
        73: "North-Korea", 74: "Uruguay", 75: "Paraguay", 76: "Bolivia", 77: "Peru",
        78: "Colombia", 79: "Republic-of-Macedonia-FYROM", 80: "Montenegro",
        81: "Republic-of-China-Taiwan", 82: "Cyprus", 83: "Belarus", 84: "New-Zealand",
        164: "Saudi-Arabia", 165: "Egypt", 166: "United-Arab-Emirates", 167: "Albania",
        168: "Georgia", 169: "Armenia", 170: "Nigeria", 171: "Cuba"
    };

    // State management
    const state = {
        playerLocations: {},
        playerXpValues: {}, // Added for XP tracking
        currentPlayers: [],
        currentTerrain: 'both'
    };

    // Initialize the script
    function init() {
        loadSettings();
        setupUI();
        setupEventListeners();
        startMonitoring();
    }

    // Load settings from storage
    function loadSettings() {
        const savedPlayers = GM_getValue('players', CONFIG.defaultPlayerIds.join(','));
        state.currentPlayers = savedPlayers.split(',').map(id => parseInt(id.trim())).filter(id => id);
        state.currentTerrain = GM_getValue('terrain', 'both');
    }

    // Setup UI elements
    function setupUI() {
        addStyles();
        createMainContainer();
        createModal();
    }

    // Add CSS styles with improved class names
    function addStyles() {
        GM_addStyle(`
            .bh-tracker-container {
                z-index: 99999;
                position: absolute;
                top: 0;
                right: 0;
                margin: 7px;
                padding: 5px;
                border-radius: 3px;
                font-size: 11px;
                background-color: rgba(255,255,255,0.8);
                border: 1px solid #999;
                box-shadow: 10px 10px 5px #888888;
                width: 250px;
            }
            .player-online, .player-online a { color: green; }
            .player-offline, .player-offline a { color: black; }
            .bh-tracker-container a { text-decoration: underline; }
            .player-moved, .player-moved a { color: red; }
            .bh-tracker-modal {
                z-index: 99999;
                display: none;
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.4);
            }
            .bh-tracker-modal-content {
                background-color: #fefefe;
                margin: 15% auto;
                padding: 20px;
                border: 1px solid #888;
                width: 600px;
            }
            .bh-tracker-modal-title {
                display: block;
                font-family: Verdana;
                font-size: 12px;
                font-weight: 700;
            }
            .bh-tracker-modal p { margin: 5px 0; }
            .bh-tracker-close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
                line-height: 16px;
                cursor: pointer;
            }
            .bh-tracker-close:hover, .bh-tracker-close:focus {
                color: black;
                text-decoration: none;
            }
            .player-row td { padding: 2px; }
            .bh-tracker-input { width: 400px; }
            .bh-tracker-button { cursor: pointer; }
            .highlight-bh { background: #ffc9c9; }
            .highlight-top { background: #fff4b7; }
            .player-xp-changed, .player-xp-changed a, .player-xp-changed .xp-cell {
                color: #ff0000;
                font-weight: bold;
                animation: xp-pulse 1s infinite alternate;
            }
            @keyframes xp-pulse {
                from { background-color: #ffcccc; }
                to { background-color: #ff9999; }
            }
        `);
    }

    // Create main container
    function createMainContainer() {
        const container = document.createElement('div');
        container.className = 'bh-tracker-container';
        container.innerHTML = `
            <table class="bh-tracker-table"></table>
            <div>
                <button class="bh-tracker-button" id="bhTrackerSettingsButton">Settings</button>
            </div>
        `;
        document.body.appendChild(container);
    }

    // Create settings modal
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'bh-tracker-modal';
        modal.id = 'bhTrackerModal';
        modal.innerHTML = `
            <div class="bh-tracker-modal-content">
                <span class="bh-tracker-close">&times;</span>
                <p>
                    <label class="bh-tracker-modal-title">Enter comma separated IDs:</label>
                    <input type="text" class="bh-tracker-input" id="bhTrackerPlayerIds">
                    <button class="bh-tracker-button" id="bhTrackerSaveButton">Save</button>
                </p>
                <p>
                    <label><input id="bhTrackerTerrainBoth" type="radio" name="terrain" value="both" ${state.currentTerrain === 'both' ? 'checked' : ''}> Both </label>
                    <label><input id="bhTrackerTerrainTanks" type="radio" name="terrain" value="tanks" ${state.currentTerrain === 'tanks' ? 'checked' : ''}> Tanks </label>
                    <label><input id="bhTrackerTerrainAircraft" type="radio" name="terrain" value="aircraft" ${state.currentTerrain === 'aircraft' ? 'checked' : ''}> Aircraft</label>
                </p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Setup event listeners
    function setupEventListeners() {
        document.getElementById('bhTrackerSettingsButton').addEventListener('click', openSettingsModal);
        document.querySelector('.bh-tracker-close').addEventListener('click', closeSettingsModal);
        document.getElementById('bhTrackerSaveButton').addEventListener('click', saveSettings);

        window.addEventListener('click', (event) => {
            if (event.target === document.getElementById('bhTrackerModal')) {
                closeSettingsModal();
            }
        });
    }

    // Start monitoring players
    function startMonitoring() {
        checkPlayers();
        setInterval(checkPlayers, CONFIG.checkInterval);
    }

    // Open settings modal
    function openSettingsModal() {
        document.getElementById('bhTrackerPlayerIds').value = state.currentPlayers.join(',');
        document.getElementById('bhTrackerModal').style.display = 'block';
    }

    // Close settings modal
    function closeSettingsModal() {
        document.getElementById('bhTrackerModal').style.display = 'none';
    }

    // Save settings
    function saveSettings() {
        const playerIds = document.getElementById('bhTrackerPlayerIds').value;
        const terrain = document.querySelector('input[name="terrain"]:checked').value;

        state.currentPlayers = playerIds.split(',').map(id => parseInt(id.trim())).filter(id => id);
        state.currentTerrain = terrain;

        GM_setValue('players', state.currentPlayers.join(','));
        GM_setValue('terrain', state.currentTerrain);

        closeSettingsModal();
        checkPlayers();
    }

    // Check all players with cache control
    async function checkPlayers() {
        try {
            const playersTable = document.querySelector('.bh-tracker-table');
            playersTable.innerHTML = '';

            const playerData = await Promise.all(
                state.currentPlayers.map(id => fetchPlayerData(id))
            );

            playerData.sort((a, b) => a.name.localeCompare(b.name));

            playerData.forEach(data => {
                updatePlayerDisplay(data);
                trackPlayerChanges(data);
            });
        } catch (error) {
            console.error("Error checking players:", error);
        }
    }

    // Fetch player data with cache control
    function fetchPlayerData(id) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `/en/main/citizen-profile-json-personal/${id}`,
                headers: {
                    "Cache-Control": "no-cache",
                    "Pragma": "no-cache"
                },
                onload: function(response) {
                    try {
                        if (response.status >= 200 && response.status < 300) {
                            const data = JSON.parse(response.responseText);
                            const { citizen, citizenAttributes, location } = data;

                            resolve({
                                id,
                                name: citizen.name,
                                onlineStatus: citizen.onlineStatus,
                                expPoints: citizenAttributes.experience_points,
                                location: location.residenceRegion.name,
                                country: location.residenceRegion.current_owner_country_id
                            });
                        } else {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Update player display with change indicators
    function updatePlayerDisplay(player) {
        const { id, name, onlineStatus, expPoints, location, country } = player;
        const statusClass = onlineStatus ? 'player-online' : 'player-offline';

        // Determine change classes
        let changeClasses = [];
        if (state.playerLocations[id] && state.playerLocations[id] !== location) {
            changeClasses.push('player-moved');
        }
        if (state.playerXpValues[id] !== undefined && state.playerXpValues[id] !== expPoints) {
            changeClasses.push('player-xp-changed');
        }

        const row = document.createElement('tr');
        row.className = `player-row ${statusClass} ${changeClasses.join(' ')}`.trim();
        row.innerHTML = `
            <td><a href='/en/citizen/profile/${id}' target='_blank'>${name}</a></td>
            <td>${getCountryFlag(country)}</td>
            <td>${location}</td>
            <td class="xp-cell">${expPoints}</td>
        `;

        document.querySelector('.bh-tracker-table').appendChild(row);
    }

    // Track player changes (location and XP)
    function trackPlayerChanges(player) {
        const { id, onlineStatus, location, expPoints } = player;
        let hasChanges = false;

        // Check location change
        if (state.playerLocations[id] !== location && onlineStatus) {
            hasChanges = true;
            triggerAlert('location');
        }

        // Check XP change
        if (state.playerXpValues[id] !== undefined &&
            state.playerXpValues[id] !== expPoints &&
            onlineStatus) {
            hasChanges = true;
            triggerAlert('xp');
        }

        // Update stored values
        state.playerLocations[id] = location;
        state.playerXpValues[id] = expPoints;

        return hasChanges;
    }

    // Trigger alert with sound
    function triggerAlert(type) {
        playBeep();
    }

    // Get country flag HTML
    function getCountryFlag(countryId) {
        const countryName = COUNTRY_FLAGS[countryId] || 'Unknown';
        return `<img src='https://www.erepublik.net/images/flags_png/S/${countryName}.png' alt='${countryName}'>`;
    }

    // Play beep sound
    function playBeep() {
        const sound = new Audio(CONFIG.beepSound);
        sound.play().catch(e => console.error("Error playing sound:", e));
    }

    // Initialize the script
    init();
})();