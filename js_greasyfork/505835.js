// ==UserScript==
// @name         Torn Faction War Status Banner
// @namespace    http://tampermonkey.net/
// @version      2.13
// @description  Display faction war status on Torn pages with flashing chain counts and bonus warnings
// @match        https://*.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/505835/Torn%20Faction%20War%20Status%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/505835/Torn%20Faction%20War%20Status%20Banner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let FRIENDLY_FACTION_ID = null;
    const UPDATE_INTERVAL = 2000; // 2 seconds

    // Debug configuration
    const DEBUG_CONFIG = {
        enabled: false,
        friendlyFactionName: "Our Faction"
    };

    // Configuration for button and prompt visibility
    const CONFIG = {
        clearButtonPages: [
            'https://www.torn.com/preferences.php'
        ],
        promptPages: [
            'https://www.torn.com/factions.php',
        ]
    };

    GM_addStyle(`
        #faction-war-status {
            background-color: #333;
            color: #fff;
            padding: 5px;
            font-size: 12px;
            text-align: center;
            box-sizing: border-box;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            z-index: 1000;
            line-height: 1.2;
            width: 100%;
            margin-top: 5px;
            transition: opacity 3.0s ease-in-out;
        }
        .flash-chain {
            animation: flash 1s infinite;
            font-weight: bold;
        }
        @keyframes flash {
            0% { color: #00ff00; }
            50% { color: #ff0000; }
            100% { color: #00ff00; }
        }
        #clear-api-key-button {
            position: fixed;
            bottom: 75px;
            right: 10px;
            z-index: 10000;
            background-color: #f44336;
            color: white;
            border: none;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
        }
    `);

    function debug(message, data) {
        if (DEBUG_CONFIG.enabled) {
            console.log(`[Faction War Status] ${message}`, data || '');
        }
    }

    function createStatusBar() {
        debug('Creating status bar');
        const statusBar = document.createElement('div');
        statusBar.id = 'faction-war-status';
        statusBar.textContent = 'Loading faction war status...';
        return statusBar;
    }

    function insertStatusBar() {
        debug('Inserting status bar');
        let statusBar = document.getElementById('faction-war-status');
        if (!statusBar) {
            statusBar = createStatusBar();
            const mainContainer = document.querySelector('.content-wrapper');
            if (mainContainer) {
                mainContainer.insertAdjacentElement('afterbegin', statusBar);
                debug('Status bar inserted at the top of main content');
            } else {
                debug('Main content container not found, inserting at body');
                document.body.insertAdjacentElement('afterbegin', statusBar);
            }
        }
        statusBar.style.display = 'block';
        statusBar.classList.remove('fade-out');
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp * 1000);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        return `${day} ${month} ${hours}:${minutes}${ampm}`;
    }

    function shouldFlashChain(chain) {
        const ranges = [[45, 49], [90, 99], [240, 249], [480, 499], [980, 999], [2480, 2499], [4980, 4999], [9980, 9999], [24980, 24999], [49980, 49999], [99980, 99999]];
        return ranges.some(([min, max]) => chain >= min && chain <= max);
    }

    function fetchUserFactionId(apiKey) {
        debug('Fetching user faction ID');
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://api.torn.com/user/?selections=profile&key=${apiKey}`,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.faction && data.faction.faction_id) {
                                debug('User faction ID fetched successfully', data.faction.faction_id);
                                resolve(data.faction.faction_id.toString());
                            } else {
                                debug('Faction ID not found in API response', data);
                                reject('Faction ID not found in API response');
                            }
                        } catch (error) {
                            debug('Error parsing API response', error);
                            reject('Error parsing API response: ' + error);
                        }
                    } else {
                        debug('Failed to fetch user data', response);
                        reject('Failed to fetch user data, status: ' + response.status);
                    }
                },
                onerror: function(error) {
                    debug('Error making API request', error);
                    reject('Error making API request: ' + error);
                }
            });
        });
    }

    function isOnPage(pageList) {
        return pageList.some(url => window.location.href.startsWith(url));
    }

    function promptForApiKey() {
        if (!isOnPage(CONFIG.promptPages)) {
            debug('Not on a prompt page, skipping API key prompt');
            return;
        }

        debug('Prompting for API key');
        const apiKey = prompt('Torn War Banner: Please enter your PUBLIC API key:');
        if (apiKey) {
            GM_setValue('apiKey', apiKey);
            fetchUserFactionId(apiKey)
                .then(factionId => {
                    FRIENDLY_FACTION_ID = factionId;
                    debug(`Friendly faction ID set to: ${FRIENDLY_FACTION_ID}`);
                    insertStatusBar();
                    updateStatus();
                    setInterval(updateStatus, UPDATE_INTERVAL);
                })
                .catch(error => {
                    debug('Error fetching user faction ID:', error);
                    const statusBar = document.getElementById('faction-war-status') || createStatusBar();
                    statusBar.textContent = 'Error: Unable to fetch user faction data';
                });
        } else {
            debug('No API key provided');
        }
    }

    function updateStatusDisplay(data) {
        debug('Updating status display', data);
        const statusBar = document.getElementById('faction-war-status');
        if (!statusBar) {
            debug('Status bar element not found');
            return;
        }

        if (data.peace) {
            debug('Faction is in peace mode', data.peace);
            if (DEBUG_CONFIG.enabled) {
                statusBar.textContent = `Faction is not at war (Debug)`;
                statusBar.style.opacity = '1';
                debug('Debug mode is enabled, showing banner');
            } else {
                statusBar.textContent = 'Faction is not at war';
                statusBar.style.opacity = '0';
                debug('Debug mode is disabled, fading out text');
            }
            return;
        }

        // If not in peace mode, show the banner and update with war status
        statusBar.style.opacity = '1';
        debug('Faction is not in peace mode, updating war status');

        if (!data.ranked_wars || Object.keys(data.ranked_wars).length === 0) {
            statusBar.textContent = 'No upcoming faction war';
            statusBar.style.opacity = '0';
            return;
        }

        let statusText = '';
        const now = Math.floor(Date.now() / 1000);
        const war = data.ranked_wars[Object.keys(data.ranked_wars)[0]];
        const warStarted = Object.values(war.factions).some(faction => faction.score > 0);

        debug('War data:', war);
        debug('Current time:', now);
        debug('War start time:', war.war.start);
        debug('War started:', warStarted);

        if (warStarted) {
            statusText = `Target: ${war.war.target} | `;
            for (const factionId in war.factions) {
                const faction = war.factions[factionId];
                const isFriendly = faction.name === DEBUG_CONFIG.friendlyFactionName || factionId === FRIENDLY_FACTION_ID;
                const factionColor = isFriendly ? '#00ff00' : '#ff0000';
                const factionName = faction.name;
                let chainText = `Chain ${faction.chain}`;
                if (isFriendly && shouldFlashChain(faction.chain)) {
                    chainText = `<span class="flash-chain">${chainText}</span>`;
                }
                statusText += `<span style="color: ${factionColor};">${factionName}: Score ${faction.score}, ${chainText}</span> | `;
            }
            statusText = statusText.trim().slice(0, -2);
        } else {
            statusText = `Start: ${formatDate(war.war.start)} LT | `;
            const factions = Object.values(war.factions);
            const friendlyFaction = factions.find(f => f.id === FRIENDLY_FACTION_ID);
            const enemyFaction = factions.find(f => f !== friendlyFaction);

            // Use faction tag for friendly faction if available
            const friendlyName = data.tag || friendlyFaction.name;

            // Ensure enemy faction is first (red), then friendly faction (green)
            statusText += `<span style="color: #ff0000;">${enemyFaction.name}</span> vs <span style="color: #00ff00;">${friendlyName}</span>`;
        }
        statusBar.innerHTML = statusText;
        debug('Status display updated', statusText);
    }

    function updateStatus() {
        debug('Updating status');
        if (!FRIENDLY_FACTION_ID) {
            debug('Friendly faction ID not set');
            return;
        }

        insertStatusBar();
        const apiKey = GM_getValue('apiKey', null);
        if (!apiKey) {
            debug('API key is not available.');
            promptForApiKey();
            return;
        }

        const API_URL = `https://api.torn.com/faction/${FRIENDLY_FACTION_ID}?selections=basic&key=${apiKey}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: API_URL,
            onload: function(response) {
                debug('API response received', response);
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        debug('Parsed API data:', data);

                        // Determine peace mode
                        let isPeaceMode = true;
                        if (data.ranked_wars && Object.keys(data.ranked_wars).length > 0) {
                            const war = data.ranked_wars[Object.keys(data.ranked_wars)[0]];
                            isPeaceMode = war.war.end !== 0;

                            if (!isPeaceMode) {
                                // Check if any faction has a score > 0
                                for (const factionId in war.factions) {
                                    if (war.factions[factionId].score > 0) {
                                        isPeaceMode = false;
                                        break;
                                    }
                                }
                            }
                        }

                        data.peace = isPeaceMode;
                        debug('Calculated peace status:', data.peace);

                        updateStatusDisplay(data);
                    } catch (error) {
                        debug('Error parsing API response:', error);
                        const statusBar = document.getElementById('faction-war-status');
                        if (statusBar) {
                            statusBar.textContent = 'Error parsing faction war data';
                        }
                    }
                } else {
                    debug('Failed to fetch faction data, status:', response.status);
                    const statusBar = document.getElementById('faction-war-status');
                    if (statusBar) {
                        statusBar.textContent = 'Failed to fetch faction war data';
                    }
                }
            },
            onerror: function(error) {
                debug('Error making API request:', error);
                const statusBar = document.getElementById('faction-war-status');
                if (statusBar) {
                    statusBar.textContent = 'Error fetching faction war data';
                }
            }
        });
    }

    function clearApiKey() {
        GM_deleteValue('apiKey');
        alert('API key cleared successfully. You can set a new API key by visiting a faction page.');
        location.reload();
    }

    function addClearApiKeyButton() {
        if (isOnPage(CONFIG.clearButtonPages)) {
            const button = document.createElement('button');
            button.id = 'clear-api-key-button';
            button.textContent = 'Clear War Banner API Key';
            button.style.position = 'fixed';
            button.style.bottom = '75px';
            button.style.right = '10px';
            button.style.zIndex = '10000';
            button.style.backgroundColor = '#f44336';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = '10px 20px';
            button.style.cursor = 'pointer';
            button.addEventListener('click', clearApiKey);
            document.body.appendChild(button);
            debug('Clear API Key button added to page');
        }
    }


    // Run the initialization when the document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Immediate debug output
    debug('Script loaded and executed');

    function init() {
        debug('Initializing script');
        const apiKey = GM_getValue('apiKey', null);

        if (apiKey) {
            debug('API key found, fetching user faction ID');
            fetchUserFactionId(apiKey)
                .then(factionId => {
                FRIENDLY_FACTION_ID = factionId;
                debug(`Friendly faction ID set to: ${FRIENDLY_FACTION_ID}`);
                insertStatusBar();
                updateStatus();
                setInterval(updateStatus, UPDATE_INTERVAL);
            })
                .catch(error => {
                debug('Error fetching user faction ID:', error);
                if (isOnPage(CONFIG.promptPages)) {
                    const statusBar = document.getElementById('faction-war-status') || createStatusBar();
                    statusBar.textContent = 'Error: Unable to fetch user faction data';
                    promptForApiKey();
                }
            });
        } else if (isOnPage(CONFIG.promptPages)) {
            debug('No API key found and on a prompt page, prompting user');
            promptForApiKey();
        }

        // Add the Clear API Key button
        addClearApiKeyButton();
    }

})();