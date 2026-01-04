// ==UserScript==
// @name         Torn - Level Progress Shower
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  Show your level progress on sidebar.
// @author       e7cf09 [3441977]
// @icon         https://editor.torn.com/33b77f1c-dcd9-4d96-867f-5b578631d137-3441977.png
// @match        https://www.torn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542396/Torn%20-%20Level%20Progress%20Shower.user.js
// @updateURL https://update.greasyfork.org/scripts/542396/Torn%20-%20Level%20Progress%20Shower.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let apiKey = GM_getValue('torn_api_key', '');
    let cachedData = GM_getValue('cached_level_data', null);
    let cacheTime = GM_getValue('cache_timestamp', 0);
    let lastCall = GM_getValue('last_api_call_time', 0);
    let callCount = GM_getValue('api_call_count', 0);
    let callTime = GM_getValue('api_call_timestamp', 0);
    let lastLevel = GM_getValue('last_seen_level', 0);

    const CACHE_DURATION = 24 * 60 * 60 * 1000;
    const INACTIVE_THRESHOLD = 365 * 24 * 60 * 60;
    const RATE_LIMIT = 60;
    const RATE_WINDOW = 60 * 1000;
    const MIN_INTERVAL = 1000; 

    let processing = false;
    let displayLevel = null;
    let status = '';

    function canCall() {
        const now = Date.now();

        if (now - callTime > RATE_WINDOW) {
            callCount = 0;
            callTime = now;
            GM_setValue('api_call_count', callCount);
            GM_setValue('api_call_timestamp', callTime);
        }

        if (callCount >= RATE_LIMIT) {
            return false;
        }

        if (now - lastCall < MIN_INTERVAL) {
            return false;
        }

        return true;
    }

    function recordCall() {
        const now = Date.now();
        callCount++;
        lastCall = now;

        GM_setValue('api_call_count', callCount);
        GM_setValue('last_api_call_time', lastCall);

        if (now - callTime > RATE_WINDOW) {
            callTime = now;
            GM_setValue('api_call_timestamp', callTime);
        }
    }

    function makeRequest(url) {
        return new Promise((resolve, reject) => {
            if (!canCall()) {
                reject(new Error('API rate limit exceeded. Please wait.'));
                return;
            }

            recordCall();

            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.error) {
                                reject(new Error(data.error.error || 'API Error'));
                            } else {
                                resolve(data);
                            }
                        } catch (e) {
                            reject(new Error('Invalid JSON response'));
                        }
                    } else {
                        reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('Network error'));
                }
            });
        });
    }

    async function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function getUserLevel() {
        const url = `https://api.torn.com/v2/user/hof?key=${apiKey}`;
        const data = await makeRequest(url);
        return {
            level: data.hof.level.value,
            rank: data.hof.level.rank
        };
    }

    async function getHOF(limit = 100, offset = 0) {
        const url = `https://api.torn.com/v2/torn/hof?limit=${limit}&offset=${offset}&cat=level&key=${apiKey}`;
        const data = await makeRequest(url);
        return data.hof;
    }

    async function getUserHOF(userId) {
        const url = `https://api.torn.com/v2/user/${userId}/hof?key=${apiKey}`;
        const data = await makeRequest(url);
        return data.hof.level.rank;
    }

    async function findInactivePos(targetLevel) {
        const currentTime = Math.floor(Date.now() / 1000);
        
        const level1Pos = await getUserHOF(1364774);
        await sleep(MIN_INTERVAL);
        
        let left = 1;
        let right = level1Pos;
        let position = -1;
        
        while (left + 100 <= right) {
            const mid = Math.floor((left + right) / 2 - 50);
            
            try {
                const players = await getHOF(100, mid);
                await sleep(MIN_INTERVAL);
                
                let found = false;
                let higher = false;
                let lower = false;

                for (let i = 0; i < 100; i++) {
                    if (players[i].level === targetLevel) {
                        found = true;
                    }
                    if (players[i].level > targetLevel) {
                        higher = true;
                    } else if (players[i].level < targetLevel) {
                        lower = true;
                    }
                }
                
                if (higher && !found && !lower) {
                    left = mid + 100;
                } else if (higher && found && !lower) {
                    position = mid;
                    break;
                } else {
                    right = mid - 1;
                }
            } catch (error) {
                console.error('Error in binary search:', error);
                throw error;
            }
        }
        
        if (position === -1) {
            position = left;
        }
        
        let bestPos = -1;
        let bestId = null;
        let bestAction = null;
        let found = false;
        
        let currentOffset = position;
        while (1) {
            
            try {
                const players = await getHOF(100, currentOffset);
                await sleep(MIN_INTERVAL);
                
                for (let i = 0; i < players.length; i++) {
                    const player = players[i];
                        if (player.level === targetLevel) {
                        const daysSince = (currentTime - player.last_action) / (24 * 60 * 60);
                        if (daysSince > 365) {
                            bestPos = player.position;
                            bestId = player.id;
                            bestAction = player.last_action;
                            found = true;
                            break;
                        }
                    }
                }
                if (found) {
                    break;
                }
                currentOffset += 100;

            } catch (error) {
                console.error(`Error fetching data at offset ${currentOffset}:`, error);
                currentOffset += 100;
            }
        }
        
        if (!found) {
            return null;
        }
        
        return {
            position: bestPos,
            playerId: bestId,
            lastAction: bestAction,
            fetchTime: currentTime
        };
    }

    function validateInactive(playerData) {
        const currentTime = Math.floor(Date.now() / 1000);
        return playerData.lastAction < playerData.fetchTime;
    }

    async function calculateRelativePos() {
        try {
            const userLevel = await getUserLevel();
            await sleep(MIN_INTERVAL);

            GM_setValue('last_seen_level', userLevel.level);

            GM_setValue('process_step', 'user_level_fetched');
            GM_setValue('process_user_level', userLevel.level);
            GM_setValue('process_user_rank', userLevel.rank);
            GM_setValue('process_timestamp', Date.now());

            if (userLevel.level >= 100) {
                const result = {
                    level: userLevel.level,
                    rank: userLevel.rank,
                    relativePosition: 0,
                    finalLevel: 100.00,
                    lowerLevelInactiveData: null,
                    currentLevelInactiveData: null
                };

                GM_setValue('cached_level_data', result);
                GM_setValue('cache_timestamp', Date.now());
                GM_setValue('process_step', 'completed');

                return 100.00;
            }

            const lowerInactive = await findInactivePos(userLevel.level - 1);

            GM_setValue('process_step', 'lower_level_fetched');
            GM_setValue('process_lower_level_inactive_data', JSON.stringify(lowerInactive));

            const currentInactive = await findInactivePos(userLevel.level);

            GM_setValue('process_step', 'current_level_fetched');
            GM_setValue('process_current_level_inactive_data', JSON.stringify(currentInactive));

            if (!validateInactive(lowerInactive) || !validateInactive(currentInactive)) {
                throw new Error('Inactive player validation failed - need to refetch data');
            }

            if (lowerInactive.position === -1 || currentInactive.position === -1) {
                return userLevel.level;
            }

            const userRank = userLevel.rank;
            const lastCurrentPos = lowerInactive.position;
            const currentPos = currentInactive.position;

            const relativePos = (lastCurrentPos - userRank) / (lastCurrentPos - currentPos);
            let roundedRelative = Math.round(relativePos * 100) / 100;

            if (userLevel.level < 100) {
                roundedRelative = Math.min(roundedRelative, 0.99);
            }

            const finalLevel = userLevel.level + roundedRelative;

            const result = {
                level: userLevel.level,
                rank: userLevel.rank,
                relativePosition: roundedRelative,
                finalLevel: finalLevel,
                lowerLevelInactiveData: lowerInactive,
                currentLevelInactiveData: currentInactive
            };

            GM_setValue('cached_level_data', result);
            GM_setValue('cache_timestamp', Date.now());

            GM_setValue('process_step', 'completed');
            GM_setValue('process_final_level', finalLevel);

            return finalLevel;
        } catch (error) {

            GM_setValue('process_step', 'error');
            GM_setValue('process_error', error.message);

            if (error.message.includes('API') || error.message.includes('key')) {
                return null;
            }

            return 0;
        }
    }

    async function validateKey(key) {
        try {
            const url = `https://api.torn.com/v2/key/info?key=${key}`;
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data);
                            } catch (e) {
                                reject(new Error('Invalid JSON response'));
                            }
                        } else {
                            reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('Network error'));
                    }
                });
            });

            if (response.info && response.info.access && response.info.access.level >= 1) {
                return { valid: true, level: response.info.access.level };
            } else {
                return { valid: false, error: 'incorrect key' };
            }
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }

    function showConfig() {
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999;';

        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border:2px solid #333;z-index:10000;border-radius:8px;box-shadow:0 4px 6px rgba(0,0,0,0.1);';
        modal.innerHTML = `
            <h3>Torn API Configuration</h3>
            <p>Enter your public Torn API key:</p>
            <input type="text" id="keyInput" value="${apiKey}" placeholder="e.g., HhmiKs9LjgBN2UV7" style="width:300px;padding:8px;margin:10px 0;border:1px solid #ccc;border-radius:4px;">
            <br>
            <div id="validMsg" style="margin:10px 0;color:red;font-size:12px;"></div>
            <button id="saveKey" style="background:#007bff;color:white;border:none;padding:8px 16px;margin:5px;border-radius:4px;cursor:pointer;">Validate & Save</button>
            <button id="cancelKey" style="background:#007bff;color:white;border:none;padding:8px 16px;margin:5px;border-radius:4px;cursor:pointer;">Cancel</button>
            <button id="clearCache" style="background:#007bff;color:white;border:none;padding:8px 16px;margin:5px;border-radius:4px;cursor:pointer;">Clear Cache</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        document.getElementById('saveKey').onclick = async function() {
            const newKey = document.getElementById('keyInput').value.trim();
            const validDiv = document.getElementById('validMsg');
            const saveBtn = document.getElementById('saveKey');

            if (!newKey) {
                validDiv.textContent = 'Please enter an API key';
                validDiv.style.color = 'red';
                return;
            }

            validDiv.textContent = 'Validating API key...';
            validDiv.style.color = 'blue';
            saveBtn.disabled = true;
            saveBtn.textContent = 'Validating...';

            const validation = await validateKey(newKey);

            if (validation.valid) {
                validDiv.textContent = 'API key saved successfully!';
                validDiv.style.color = 'green';

                apiKey = newKey;
                GM_setValue('torn_api_key', apiKey);
                GM_setValue('needs_full_recalc', true);

                GM_setValue('cached_level_data', null);
                GM_setValue('cache_timestamp', 0);
                displayLevel = null;
                processing = false;

                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 1500);
            } else {
                validDiv.textContent = 'Invalid API key';
                validDiv.style.color = 'red';
                saveBtn.disabled = false;
                saveBtn.textContent = 'Validate & Save';
            }
        };

        document.getElementById('cancelKey').onclick = function() {
            document.body.removeChild(overlay);
        };

        document.getElementById('clearCache').onclick = function() {
            GM_setValue('cached_level_data', null);
            GM_setValue('cache_timestamp', 0);
            clearProcess();
            displayLevel = null;
            processing = false;
        };

        overlay.onclick = function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        };
    }

    async function checkNeedsRecalc(cached) {
        try {
            const userLevel = await getUserLevel();
            await sleep(MIN_INTERVAL);
            
            if (userLevel.level !== cached.level) {
                return true;
            }
            
            if (cached.lowerLevelInactiveData && cached.currentLevelInactiveData) {
                const currentTime = Math.floor(Date.now() / 1000);
                
                if (cached.lowerLevelInactiveData.lastAction > cached.lowerLevelInactiveData.fetchTime ||
                    cached.currentLevelInactiveData.lastAction > cached.currentLevelInactiveData.fetchTime) {
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.error('Error checking if full recalculation needed:', error);
            return true;
        }
    }

    async function updateRank(cached) {
        try {
            
            const userLevel = await getUserLevel();
            await sleep(MIN_INTERVAL);
            
            const userRank = userLevel.rank;
            const lastCurrentPos = cached.lowerLevelInactiveData.position;
            const currentPos = cached.currentLevelInactiveData.position;
            
            const relativePos = (lastCurrentPos - userRank) / (lastCurrentPos - currentPos);
            let roundedRelative = Math.round(relativePos * 100) / 100;
            
            if (cached.level < 100) {
                roundedRelative = Math.min(roundedRelative, 0.99);
            }
            
            const finalLevel = cached.level + roundedRelative;
            
            cached.rank = userRank;
            cached.relativePosition = roundedRelative;
            cached.finalLevel = finalLevel;
            
            GM_setValue('cached_level_data', cached);
            GM_setValue('cache_timestamp', Date.now());
            
            return finalLevel;
        } catch (error) {
            console.error('Error updating with current rank:', error);
            return cached.finalLevel;
        }
    }

    async function getDisplayLevel() {
        if (!apiKey) {
            return null;
        }

        if (processing) {
            return null;
        }

        const needsRecalc = GM_getValue('needs_full_recalc', false);
        if (needsRecalc) {
            GM_setValue('needs_full_recalc', false);
            GM_setValue('cached_level_data', null);
            GM_setValue('cache_timestamp', 0);
        }

        const now = Date.now();
        if (now - lastCall < RATE_WINDOW && cachedData) {
            return cachedData.finalLevel;
        }

        if (cachedData && (now - cacheTime < CACHE_DURATION)) {
            const needsRecalc = await checkNeedsRecalc(cachedData);
            
            if (!needsRecalc) {
                return await updateRank(cachedData);
            }
        }

        const processStep = GM_getValue('process_step', '');
        const processTime = GM_getValue('process_timestamp', 0);

        if (processStep && (now - processTime < 5 * 60 * 1000)) {
            try {
                if (processStep === 'completed') {
                    const finalLevel = GM_getValue('process_final_level', 0);
                    if (finalLevel > 0) {
                        clearProcess();
                        return finalLevel;
                    }
                } else if (processStep === 'current_level_fetched') {
                    const userLevel = GM_getValue('process_user_level', 0);
                    const userRank = GM_getValue('process_user_rank', 0);
                    const lowerInactive = JSON.parse(GM_getValue('process_lower_level_inactive_data', '{}'));
                    const currentInactive = JSON.parse(GM_getValue('process_current_level_inactive_data', '{}'));

                    if (userLevel > 0 && lowerInactive.position && currentInactive.position) {

                        if (!validateInactive(lowerInactive) || !validateInactive(currentInactive)) {
                            throw new Error('Inactive player validation failed - need to refetch data');
                        }

                        const relativePos = (userRank - currentInactive.position) / (lowerInactive.position - currentInactive.position);
                        let roundedRelative = Math.round(relativePos * 100) / 100;

                        if (userLevel < 100) {
                            roundedRelative = Math.min(roundedRelative, 0.99);
                        }

                        const finalLevel = userLevel + roundedRelative;

                        const result = {
                            level: userLevel,
                            rank: userRank,
                            relativePosition: roundedRelative,
                            finalLevel: finalLevel,
                            lowerLevelInactiveData: lowerInactive,
                            currentLevelInactiveData: currentInactive
                        };

                        GM_setValue('cached_level_data', result);
                        GM_setValue('cache_timestamp', Date.now());

                        clearProcess();

                        return finalLevel;
                    }
                }
            } catch (error) {
                console.error('Error resuming from saved progress:', error);
                clearProcess();
            }
        }

        if (processStep && (now - processTime >= 5 * 60 * 1000)) {
            clearProcess();
        }

        processing = true;

        try {
            const result = await calculateRelativePos();
            if (result === null) {
                processing = false;
                return null;
            }
            displayLevel = result;
            processing = false;
            return result;
        } catch (error) {
            processing = false;
            return null;
        }
    }

    function clearProcess() {
        GM_setValue('process_step', '');
        GM_setValue('process_user_level', 0);
        GM_setValue('process_user_rank', 0);
        GM_setValue('process_lower_level_inactive_data', '');
        GM_setValue('process_current_level_inactive_data', '');
        GM_setValue('process_timestamp', 0);
        GM_setValue('process_final_level', 0);
        GM_setValue('process_error', '');
    }

    let hasUpdatedThisSession = false;

    async function optimizedChange() {
        const needsRecalc = GM_getValue('needs_full_recalc', false);
        if (hasUpdatedThisSession && !needsRecalc) {
            return;
        }

        const blocks = document.querySelectorAll('.point-block___rQyUK');

        for (let block of blocks) {
            const nameSpan = block.querySelector('.name___ChDL3');
            const valueSpan = block.querySelector('.value___mHNGb');

            if (nameSpan && nameSpan.textContent.trim() === 'Level:' && valueSpan) {
                const originalLevel = parseInt(valueSpan.textContent);

                if (originalLevel !== lastLevel && lastLevel !== 0) {
                    GM_setValue('cached_level_data', null);
                    GM_setValue('cache_timestamp', 0);
                    displayLevel = null;
                    processing = false;
                    GM_setValue('last_seen_level', originalLevel);
                    GM_setValue('needs_full_recalc', true);
                    hasUpdatedThisSession = false;
                }

                if (!hasUpdatedThisSession || needsRecalc) {
                    const level = await getDisplayLevel();

                    if (level !== null) {
                        valueSpan.textContent = level.toFixed(2);
                    }
                    hasUpdatedThisSession = true;
                    GM_setValue('needs_full_recalc', false);
                }

                break;
            }
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            showConfig();
        }
    });

    if (typeof GM_registerMenuCommand !== 'undefined') {
        GM_registerMenuCommand('Configure API Key', showConfig);
    }

    if (apiKey) {
        const firstRun = GM_getValue('first_run_completed', false);
        if (!firstRun) {
            GM_setValue('needs_full_recalc', true);
            GM_setValue('first_run_completed', true);
        }

        const processStep = GM_getValue('process_step', '');
        const processTime = GM_getValue('process_timestamp', 0);
        const now = Date.now();

        if (processStep && processStep !== 'completed' && processStep !== 'error' &&
            (now - processTime < 5 * 60 * 1000)) {
        }
    }

    optimizedChange();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', optimizedChange);
    } else {
        optimizedChange();
    }

    const observer = new MutationObserver(function(mutations) {
        let shouldCheck = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === 1 && (node.classList.contains('point-block___rQyUK') || node.querySelector('.point-block___rQyUK'))) {
                        shouldCheck = true;
                        break;
                    }
                }
            }
        });

        if (shouldCheck) {
            optimizedChange();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();