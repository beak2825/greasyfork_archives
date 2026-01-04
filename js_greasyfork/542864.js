// ==UserScript==
// @name         Torn Stats Faction CPR Tracker
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Tracks CPR data for organized crimes by intercepting Fetch requests, compatible with TornPDA and PC
// @author       Allenone[2033011], IceBlueFire[776]
// @license      MIT
// @match        https://www.torn.com/factions.php?step=your*
// @run-at       document-idle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      tornstats.com
// @downloadURL https://update.greasyfork.org/scripts/542864/Torn%20Stats%20Faction%20CPR%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/542864/Torn%20Stats%20Faction%20CPR%20Tracker.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    const TARGET_URL_BASE = 'page.php?sid=organizedCrimesData&step=crimeList';
    const STORAGE_PREFIX = 'TSFactionCPRTracker_';
    const isTornPDA = typeof window.flutter_inappwebview !== 'undefined';
 
    // Storage functions
    const getValue = isTornPDA
    ? (key, def) => JSON.parse(localStorage.getItem(key) || JSON.stringify(def))
    : GM_getValue;
    const setValue = isTornPDA
    ? (key, value) => localStorage.setItem(key, JSON.stringify(value))
    : GM_setValue;
    const deleteValue = isTornPDA
    ? (key, value) => localStorage.removeItem(key)
    : GM_deleteValue;
 
    // HTTP request function
    const xmlhttpRequest = isTornPDA
    ? (details) => {
        window.flutter_inappwebview.callHandler('PDA_httpPost', details.url, details.headers, details.data)
            .then(response => {
            details.onload({
                status: response.status,
                responseText: response.data
            });
        })
            .catch(err => details.onerror(err));
    }
    : GM_xmlhttpRequest;
 
    // API key handling
    let API_KEY;
    if (isTornPDA) {
        API_KEY = "#############"; // Hardcoded for TornPDA. Set this to your Torn Stats API key.
        setValue(`${STORAGE_PREFIX}api_key`, API_KEY);
    } else {
        API_KEY = getValue(`${STORAGE_PREFIX}api_key`, null);
        if (!API_KEY) {
            API_KEY = prompt('Please enter your Torn API key that you use with Torn Stats:');
            if (!API_KEY) {
                alert('Faction CPR Tracker: API key is required for functionality.');
                return;
            }
            setValue(`${STORAGE_PREFIX}api_key`, API_KEY);
            if (API_KEY) {
                submitCPRData(API_KEY, getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {}));
            }
        }
    }
 
    async function submitCPRData(apiKey, checkpointPassRates) {
        return new Promise((resolve, reject) => {
            xmlhttpRequest({
                method: 'POST',
                url: 'https://www.tornstats.com/api/v2/'+API_KEY+'/crime_pass_rates/store',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify(checkpointPassRates ),
                onload: (response) => {
                    try {
                        const jsonResponse = JSON.parse(response.responseText);
                        console.log('Response JSON:', jsonResponse);
 
                        // Check for user-not-found error
                        if (jsonResponse.status === false && jsonResponse.message === 'ERROR: User not found.') {
                            console.warn('Invalid API key detected. Clearing stored key...');
 
                            // Clear the stored key
                            deleteValue(`${STORAGE_PREFIX}api_key`);
 
                            // Prompt for a new key
                            const newKey = prompt("Your API key appears to be invalid or expired. Please enter a new Torn Stats API key:");
 
                            if (newKey) {
                                setValue(`${STORAGE_PREFIX}api_key`, newKey);
                                console.log('New API key saved. Please retry the action.');
                            } else {
                                console.warn('User cancelled entering a new API key.');
                            }
 
                            reject(new Error('Invalid API key. Prompted user for new one.'));
                            return;
                        }
                    } catch (e) {
                        console.error('Could not parse JSON:', e);
                    }
                    if (response.status >= 200 && response.status < 300) {
                        console.log('CPR data submitted successfully');
                        resolve();
                    } else {
                        console.error('API error:', response.status, response.responseText);
                        reject(new Error('API error'));
                    }
                },
                onerror: (err) => {
                    console.error('Submission error:', err);
                    reject(err);
                }
            });
        });
    }
 
    function processCPRs(data) {
        const scenarioName = String(data.scenario.name);
        let CheckpointPassRates = getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {});
 
        if (!CheckpointPassRates[scenarioName]) {
            CheckpointPassRates[scenarioName] = {};
            data.playerSlots.forEach(slot => {
                const slotName = String(slot.name);
                CheckpointPassRates[scenarioName][slotName] = slot.player === null ? slot.successChance : 0;
            });
        } else {
            data.playerSlots.forEach(slot => {
                const slotName = String(slot.name);
                if (slot.player === null) {
                    CheckpointPassRates[scenarioName][slotName] = slot.successChance;
                }
            });
        }
 
        setValue(`${STORAGE_PREFIX}CheckpointPassRates`, CheckpointPassRates);
    }
 
    // Fetch Interception
    const win = isTornPDA ? window : (typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
    const originalFetch = win.fetch;
    win.fetch = async function(resource, config) {
        const url = typeof resource === 'string' ? resource : resource.url;
        if (config?.method?.toUpperCase() !== 'POST' || !url.includes(TARGET_URL_BASE)) {
            return originalFetch.apply(this, arguments);
        }
 
        let isRecruitingGroup = false;
        if (config?.body instanceof FormData) {
            isRecruitingGroup = config.body.get('group') === 'Recruiting';
        } else if (config?.body) {
            isRecruitingGroup = config.body.toString().includes('group=Recruiting');
        }
 
        if (!isRecruitingGroup) {
            return originalFetch.apply(this, arguments);
        }
 
        const response = await originalFetch.apply(this, arguments);
        try {
            const json = JSON.parse(await response.clone().text());
            if (json.success && json.data && json.data.length > 1) {
                json.data.forEach(processCPRs);
                const API_KEY = getValue(`${STORAGE_PREFIX}api_key`, null);
                if (API_KEY) {
                    submitCPRData(API_KEY, getValue(`${STORAGE_PREFIX}CheckpointPassRates`, {}));
                }
            }
        } catch (err) {
            console.error('Error processing response:', err);
        }
        return response;
    };
})();