// ==UserScript==
// @name         Torn Spy Data Viewer - Enhanced
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Access and display formatted spy data on Torn profiles, with support for both light and dark themes.
// @author       Fu11y
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/factions.php*
// @grant        GM.xmlHttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502910/Torn%20Spy%20Data%20Viewer%20-%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/502910/Torn%20Spy%20Data%20Viewer%20-%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const encodedApiEndpoint = 'aHR0cDovL3Rvcm5pbnRlbGxpZ2VuY2UudGVjaC9hcGkvc3B5'; // Base64 encoded endpoint

    function decodeBase64(encodedString) {
        return decodeURIComponent(atob(encodedString).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    const API_ENDPOINT = decodeBase64(encodedApiEndpoint);

    const resetApiKey = () => {
        localStorage.removeItem('torn_api_key');
        alert('API key has been reset. Please reload the page to enter a new API key.');
        location.reload(); // Reload the page to prompt for API key again
    };

    const getTornStatsApiKey = () => {
        let tsApiKey = localStorage.getItem('tornstats_api_key');
        while (!tsApiKey) {
            tsApiKey = prompt('Please enter your TornStats API key:');
            if (tsApiKey) {
                localStorage.setItem('tornstats_api_key', tsApiKey);
            }
        }
        return tsApiKey;
    };

    const resetTornStatsApiKey = () => {
        localStorage.removeItem('tornstats_api_key');
        alert('TornStats API key has been reset. Please reload the page to enter a new API key.');
        location.reload(); // Reload the page to prompt for API key again
    };

    const addStyles = () => {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
            .spy-data-container {
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                border: 1px solid #555;
                border-radius: 4px;
                padding: 5px 10px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                margin-top: 5px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }
            .stats-row {
                display: flex;
                justify-content: space-between;
                width: 100%;
            }
            .stat-item {
                flex-basis: 50%;
            }
            .total-stats {
                font-weight: bold;
                margin-top: 5px;
            }
            .last-updated {
                font-weight: bold;
                margin-bottom: 10px;
            }
            .reset-api-button {
                background-color: #f44336;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                margin-top: 10px;
            }
            .tia-button {
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 5px 10px;
                cursor: pointer;
                margin-top: 10px;
                margin-left: 0px; /* Adjusted spacing */
                text-align: center;
            }
            .reset-api-button:hover {
                background-color: #d32f2f;
            }
            .tia-button:hover {
                background-color: #388E3C;
            }
        `;
        document.head.appendChild(style);
        console.log('Styles added.');
    };

    const formatNumber = (num) => num.toLocaleString();

    function fetchSpyData(playerId) {
        let apiKey = getTornStatsApiKey();
        console.log('Using API key:', apiKey);
        console.log('Fetching spy data for player ID:', playerId);
        GM.xmlHttpRequest({
            method: "GET",
            url: `${API_ENDPOINT}?player_id=${playerId}&key=${apiKey}`,
            onload: function(response) {
                console.log('API response status:', response.status);
                console.log('API response:', response.responseText);

                if (response.responseText.includes('<title>Login</title>')) {
                    console.error('Redirected to login page. Check if the API key is correct.');
                    alert('API key is not recognized. Please check and enter the correct API key.');
                    localStorage.removeItem('torn_api_key');
                    fetchSpyData(playerId); // Prompt for API key again
                    return;
                }

                if (response.status === 200) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.status === 'success') {
                            console.log('Spy data fetched successfully:', result.data);
                            displaySpyData(result.data);
                        } else {
                            console.error('Error:', result.message);
                        }
                    } catch (e) {
                        console.error('Error parsing JSON:', e);
                    }
                } else {
                    console.error('Failed to fetch data:', response.status);
                }
            },
            onerror: function(error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    function displaySpyData(data) {
        const target = document.querySelector('.profile-right-wrapper');
        console.log('Target element found:', target);
        if (target) {
            const container = document.createElement('div');
            container.className = 'spy-data-container';
            container.innerHTML = `
                <strong>TIA Spy Data - Last Updated: ${data[10] ? new Date(data[10]).toLocaleString() : 'N/A'}</strong><br>
                <div class="stats-row">
                    <div class="stat-item">Strength: ${formatNumber(data[4])}</div>
                    <div class="stat-item">Speed: ${formatNumber(data[5])}</div>
                </div>
                <div class="stats-row">
                    <div class="stat-item">Dexterity: ${formatNumber(data[6])}</div>
                    <div class="stat-item">Defense: ${formatNumber(data[7])}</div>
                </div>
                <div class="total-stats">Total Stats: ${formatNumber(data[8])}</div>
            `;
            const resetButton = document.createElement('button');
            resetButton.className = 'reset-api-button';
            resetButton.textContent = 'Reset API Key';
            resetButton.onclick = resetApiKey;
            container.appendChild(resetButton);
            target.insertBefore(container, target.firstChild);
            console.log('Spy data container inserted.');
        } else {
            console.log('Profile right wrapper not found.');
        }
    }

    function fetchAndStoreSpiesData(factionId) {
        const tsApiKey = getTornStatsApiKey();
        console.log('Using TornStats API key:', tsApiKey);
        console.log('Fetching spies data from TornStats for faction ID:', factionId);
        GM.xmlHttpRequest({
            method: "GET",
            url: `https://www.tornstats.com/api/v2/${tsApiKey}/spy/faction/${factionId}`,
            timeout: 30000,  // Set timeout to 30 seconds
            onload: function(response) {
                console.log('TornStats API response status:', response.status);
                console.log('TornStats API response:', response.responseText);

                if (response.status === 200) {
                    try {
                        const result = JSON.parse(response.responseText);
                        if (result.status && result.spy) {
                            console.log('Spies data fetched successfully from TornStats:', result.spy);
                            const spiesData = {
                                spies: Object.values(result.spy).map(spy => ({
                                    name: spy.player_name,
                                    player_id: spy.player_id,
                                    level: spy.player_level,
                                    strength: spy.strength,
                                    speed: spy.speed,
                                    dexterity: spy.dexterity,
                                    defense: spy.defense,
                                    total: spy.total,
                                    faction_id: factionId,
                                    date_reported: new Date(spy.timestamp * 1000).toISOString().slice(0, 19).replace('T', ' '),
                                    faction_name: spy.player_faction
                                }))
                            };

                            console.log('Data being sent to server:', spiesData);
                            GM.xmlHttpRequest({
                                method: "POST",
                                url: IMPORT_API_ENDPOINT,
                                data: JSON.stringify(spiesData),
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                timeout: 30000,  // Set timeout to 30 seconds
                                onload: function(serverResponse) {
                                    console.log('Server response status:', serverResponse.status);
                                    console.log('Server response text:', serverResponse.responseText);
                                    if (serverResponse.status === 200) {
                                        alert('Spies data imported successfully!');
                                    } else {
                                        alert('Failed to import spies data.');
                                    }
                                },
                                onerror: function(error) {
                                    console.error('Error storing data on server:', error);
                                }
                            });
                        } else {
                            console.error('Error fetching spies data from TornStats:', result.message || 'No spy data found');
                        }
                    } catch (e) {
                        console.error('Error parsing JSON from TornStats:', e);
                    }
                } else {
                    console.error('Failed to fetch spies data from TornStats:', response.status);
                }
            },
            onerror: function(error) {
                console.error('Error fetching spies data from TornStats:', error);
            }
        });
    }

    function addImportButton() {
        const factionSection = document.querySelector('.content-title .links-top-wrap');
        if (factionSection) {
            const factionId = new URLSearchParams(window.location.search).get('ID');
            if (factionId) {
                const importButton = document.createElement('button');
                importButton.className = 'tia-button';
                importButton.textContent = 'TIA Import Spies';
                importButton.onclick = () => fetchAndStoreSpiesData(factionId);
                factionSection.appendChild(importButton);
                console.log('Import button added.');
            } else {
                console.error('Faction ID not found.');
            }
        } else {
            console.error('Faction section not found.');
        }
    }

    addStyles();

    if (window.location.pathname.includes('profiles.php')) {
        const urlParams = new URLSearchParams(window.location.search);
        const playerId = urlParams.get('XID');
        console.log('Player ID found:', playerId);

        if (playerId) {
            fetchSpyData(playerId);
        } else {
            console.log('No player ID found on the page.');
        }
    } else if (window.location.pathname.includes('factions.php')) {
        addImportButton();
    }
})();
