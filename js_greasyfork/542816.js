// ==UserScript==
// @name         GeoGuessr Duels Finder 1.2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Find all duels played against specific users (single or CSV batch)
// @author       Flykii (@flykii), Att (attx_) and Tweek (@member0001)
// @match        https://www.geoguessr.com/*
// @grant        none
// @license      Proprietary Source Available
// @downloadURL https://update.greasyfork.org/scripts/542816/GeoGuessr%20Duels%20Finder%2012.user.js
// @updateURL https://update.greasyfork.org/scripts/542816/GeoGuessr%20Duels%20Finder%2012.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class GeoGuessrDuelFinder {
        constructor() {
            this.baseUrl = 'https://www.geoguessr.com/api';
            this.gameServerUrl = 'https://game-server.geoguessr.com/api';
            this.myUserId = null;
            this.duelsFound = [];
            this.processedGameIds = new Set();
        }

        async apiRequest(url, options = {}) {
            const requestOptions = {
                ...options,
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };

            const response = await fetch(url, requestOptions);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        }

        async getMyProfile() {
            if (!this.myUserId) {
                const profile = await this.apiRequest(`${this.baseUrl}/v3/profiles`);
                this.myUserId = profile.id;
            }
            return this.myUserId;
        }

        async getActivities(count = 50, paginationToken = null) {
            let url = `${this.baseUrl}/v4/feed/private?count=${count}`;
            if (paginationToken) {
                url += `&paginationToken=${paginationToken}`;
            }

            const response = await this.apiRequest(url);

            let entries = [];
            if (Array.isArray(response)) {
                entries = response;
            } else if (response.entries && Array.isArray(response.entries)) {
                entries = response.entries;
            } else if (response.data && Array.isArray(response.data)) {
                entries = response.data;
            }

            return {
                entries: entries,
                paginationToken: response.paginationToken || null
            };
        }

        async getDuelDetails(gameId) {
            return await this.apiRequest(`${this.gameServerUrl}/duels/${gameId}`);
        }

        extractGameIds(activity) {
            const gameIds = [];

            if (!activity.payload) return gameIds;

            try {
                const payload = JSON.parse(activity.payload);

                if (Array.isArray(payload)) {
                    payload.forEach(event => {
                        if (event.payload && event.payload.gameId) {
                            const gameMode = event.payload.gameMode;
                            if (gameMode === 'Duels' || gameMode === 'TeamDuels') {
                                gameIds.push({
                                    gameId: event.payload.gameId,
                                    gameMode: gameMode,
                                    time: event.time || activity.time
                                });
                            }
                        }
                    });
                } else if (payload.gameId) {
                    const gameMode = payload.gameMode;
                    if (gameMode === 'Duels' || gameMode === 'TeamDuels') {
                        gameIds.push({
                            gameId: payload.gameId,
                            gameMode: gameMode,
                            time: payload.time || activity.time
                        });
                    }
                }
            } catch (error) {
                console.error('Error parsing payload:', error);
            }

            return gameIds;
        }

        async checkUserInDuel(gameId, targetUserIds, includeParty = false, includeTeamDuels = false, includeNormalDuels = true) {
            if (this.processedGameIds.has(gameId)) {
                return false;
            }

            this.processedGameIds.add(gameId);

            try {
                const duelData = await this.getDuelDetails(gameId);

                if (!duelData.teams || !Array.isArray(duelData.teams)) {
                    return false;
                }

                console.log(`Checking game ${gameId}:`, {
                    teams: duelData.teams?.map(team => ({
                        name: team.name,
                        playerCount: team.players?.length
                    })),
                    options: duelData.options,
                    includeTeamDuels,
                    includeParty,
                    includeNormalDuels
                });

                const isTeamDuel = duelData.teams?.some(team => team.players && team.players.length > 1);
                
                if (isTeamDuel && !includeTeamDuels) {
                    console.log(`❌ Skipping Team Duel: ${gameId} (detected ${duelData.teams.map(t => t.players?.length).join(' vs ')} players)`);
                    return false;
                }

                const isPartyGame = this.detectPartyGame(duelData);
                
                if (isPartyGame && !includeParty) {
                    console.log(`❌ Skipping Party game: ${gameId} (party detection: ${isPartyGame})`);
                    return false;
                }

                const isNormalDuel = !isTeamDuel && !isPartyGame;
                
                if (isNormalDuel && !includeNormalDuels) {
                    console.log(`❌ Skipping Normal Duel: ${gameId} (normal duels excluded)`);
                    return false;
                }

                let foundUsers = [];

                for (const team of duelData.teams) {
                    if (team.players && Array.isArray(team.players)) {
                        for (const player of team.players) {
                            if (targetUserIds.includes(player.playerId)) {
                                foundUsers.push(player.playerId);
                            }
                        }
                    }
                }

                if (foundUsers.length > 0) {
                    const gameType = this.determineGameType(duelData);
                    
                    console.log(`✅ Found valid duel: ${gameId} (Type: ${gameType})`);
                    
                    return {
                        found: true,
                        duelData: duelData,
                        gameId: gameId,
                        gameLink: `https://www.geoguessr.com/duels/${gameId}/summary`,
                        foundUsers: foundUsers,
                        gameType: gameType
                    };
                }

                console.log(`⚪ No target users found in duel: ${gameId}`);
                return false;

            } catch (error) {
                console.error(`Error checking duel ${gameId}:`, error);
                return false;
            }
        }

        detectPartyGame(duelData) {
            
            if (duelData.options) {
                const partyIndicators = [
                    'partyMode',
                    'isParty',
                    'gameMode',
                    'lobbyId'
                ];
                
                for (let indicator of partyIndicators) {
                    if (duelData.options[indicator]) {
                        return `options.${indicator}: ${duelData.options[indicator]}`;
                    }
                }
            }
            
            if (duelData.lobbyId || duelData.partyId) {
                return `lobbyId/partyId detected`;
            }
            
            return false;
        }

        determineGameType(duelData) {
            const isTeamDuel = duelData.teams?.some(team => team.players && team.players.length > 1);
            if (isTeamDuel) {
                const teamSizes = duelData.teams.map(t => t.players?.length || 0);
                return `Team Duel (${teamSizes.join('v')})`;
            }
            
            const partyDetection = this.detectPartyGame(duelData);
            if (partyDetection) {
                return `Party (${partyDetection})`;
            }
            
            return 'Normal Duel';
        }

        async findDuelsAgainstUsers(targetUserIds, maxPages = 20, progressCallback = null, includeParty = false, includeTeamDuels = false, includeNormalDuels = true) {
            await this.getMyProfile();

            this.duelsFound = [];
            this.processedGameIds.clear();
            let currentPage = 0;
            let consecutiveEmptyPages = 0;
            let totalActivities = 0;
            let totalDuelsChecked = 0;
            let paginationToken = null;

            console.log(`Starting search with filters: includeParty=${includeParty}, includeTeamDuels=${includeTeamDuels}, includeNormalDuels=${includeNormalDuels}`);

            while (currentPage < maxPages && consecutiveEmptyPages < 3) {
                if (progressCallback) {
                    progressCallback(`Processing page ${currentPage + 1}/${maxPages}...`);
                }

                try {
                    const result = await this.getActivities(50, paginationToken);
                    const activities = result.entries;
                    paginationToken = result.paginationToken;

                    totalActivities += activities.length;

                    if (!activities || activities.length === 0) {
                        consecutiveEmptyPages++;
                        if (consecutiveEmptyPages >= 3) break;
                        currentPage++;
                        continue;
                    }

                    if (!paginationToken) {
                        if (progressCallback) {
                            progressCallback(`Reached end of activities (no more pages)`);
                        }
                    }

                    consecutiveEmptyPages = 0;

                    const allGameIds = [];
                    for (const activity of activities) {
                        const gameIds = this.extractGameIds(activity);
                        allGameIds.push(...gameIds.map(g => ({...g, activity})));
                    }

                    const batchSize = 5;
                    for (let i = 0; i < allGameIds.length; i += batchSize) {
                        const batch = allGameIds.slice(i, i + batchSize);
                        const promises = batch.map(gameInfo =>
                            this.checkUserInDuel(gameInfo.gameId, targetUserIds, includeParty, includeTeamDuels, includeNormalDuels)
                        );

                        const results = await Promise.allSettled(promises);

                        for (let j = 0; j < results.length; j++) {
                            const result = results[j];
                            const gameInfo = batch[j];

                            if (result.status === 'fulfilled' && result.value && result.value.found) {
                                totalDuelsChecked++;

                                const duelData = {
                                    gameId: gameInfo.gameId,
                                    gameMode: gameInfo.gameMode,
                                    time: gameInfo.time,
                                    activity: gameInfo.activity,
                                    duelDetails: result.value.duelData,
                                    foundUsers: result.value.foundUsers,
                                    gameLink: result.value.gameLink,
                                    gameType: result.value.gameType
                                };

                                this.duelsFound.push(duelData);

                                if (progressCallback) {
                                    progressCallback(`Found ${this.duelsFound.length} duel(s) so far...`);
                                }
                            }
                        }

                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                    currentPage++;

                    if (!paginationToken) {
                        break;
                    }

                    await new Promise(resolve => setTimeout(resolve, 200));

                } catch (error) {
                    console.error(`Error on page ${currentPage}:`, error);
                    break;
                }
            }

            return this.duelsFound;
        }

        parseCsv(csvText, filterType = 'all') {
            const lines = csvText.split('\n');
            const allUserIds = [];
            const allUserInfo = {};
            const filteredUserIds = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;

                const columns = this.parseCsvLine(line);
                if (columns.length >= 3) {
                    const username = columns[1];
                    const userId = columns[2];
                    const actionType = columns[7] || '';

                    if (userId && userId.length > 10) {
                        allUserIds.push(userId);
                        allUserInfo[userId] = {
                            username: username,
                            date: columns[0],
                            profileUrl: columns[3] || '',
                            countryCode: columns[4] || '',
                            elo: columns[5] || '',
                            position: columns[6] || '',
                            actionType: actionType,
                            suspendedUntil: columns[8] || ''
                        };

                        if (filterType === 'all') {
                            filteredUserIds.push(userId);
                        } else if (filterType === 'banned') {
                            if (actionType.toUpperCase().includes('BANNED')) {
                                filteredUserIds.push(userId);
                            }
                        }
                    }
                }
            }

            return {
                userIds: filteredUserIds,
                userInfo: allUserInfo,
                totalUsers: allUserIds.length,
                filteredCount: filteredUserIds.length
            };
        }

        parseCsvLine(line) {
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }

            result.push(current.trim());
            return result;
        }

        formatResults(duels, userInfo = {}) {
            if (duels.length === 0) {
                return 'No duels found against these users.';
            }

            let result = `Found ${duels.length} duel(s):\n\n`;

            duels.forEach((duel, index) => {
                const date = new Date(duel.time).toLocaleString('en-US');
                const duelDetails = duel.duelDetails;
                const state = duelDetails.state || 'N/A';
                const rounds = duelDetails.rounds ? duelDetails.rounds.length : 'N/A';

                result += `${index + 1}. ${date}\n`;
                result += `   Mode: ${duel.gameMode}\n`;
                result += `   Type: ${duel.gameType || 'Unknown'}\n`;
                result += `   Rounds: ${rounds}\n`;

                if (duel.foundUsers && duel.foundUsers.length > 0) {
                    result += `   Opponents: `;
                    const opponentNames = duel.foundUsers.map(userId => {
                        if (userInfo[userId]) {
                            return `${userInfo[userId].username} (${userId})`;
                        }
                        return userId;
                    }).join(', ');
                    result += `${opponentNames}\n`;
                }

                result += `   ${duel.gameLink}\n\n`;
            });

            return result;
        }

        formatLinksOnly(duels) {
            if (duels.length === 0) {
                return 'No duels found against these users.';
            }

            return duels.map(duel => duel.gameLink).join('\n');
        }

        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                console.error('Clipboard error:', err);
                return false;
            }
        }

        downloadJSON(data, filename) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
    }

    function createUI() {
        if (document.getElementById('duel-finder-ui')) return;

        const ui = document.createElement('div');
        ui.id = 'duel-finder-ui';
        ui.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50vw;
            min-width: 500px;
            max-width: 800px;
            max-height: 90vh;
            background: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        `;

        ui.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #3498db;">Duel Finder</h3>
                <button id="close-duel-finder" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">×</button>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Search Mode:</label>
                <select id="search-mode" style="width: 100%; padding: 8px; border: none; border-radius: 5px; background: #34495e; color: white; box-sizing: border-box;">
                    <option value="single">Single User</option>
                    <option value="csv">CSV File Upload</option>
                </select>
            </div>

            <div id="single-user-section" style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">User UUID:</label>
                <input type="text" id="target-user-id" placeholder="Enter UUID or profile URL" style="width: 100%; padding: 8px; border: none; border-radius: 5px; background: #34495e; color: white; box-sizing: border-box;">
            </div>

            <div id="csv-upload-section" style="margin-bottom: 15px; display: none;">
                <label style="display: block; margin-bottom: 5px;">CSV File:</label>
                <input type="file" id="csv-file" accept=".csv" style="width: 100%; padding: 8px; border: none; border-radius: 5px; background: #34495e; color: white; box-sizing: border-box;">
                <div id="csv-info" style="margin-top: 5px; font-size: 12px; color: #bdc3c7;"></div>

                <label style="display: block; margin-bottom: 5px; margin-top: 10px;">Filter users by status:</label>
                <select id="user-filter" style="width: 100%; padding: 8px; border: none; border-radius: 5px; background: #34495e; color: white; box-sizing: border-box;">
                    <option value="all">All users</option>
                    <option value="banned">Only banned users</option>
                </select>
                <div id="filter-info" style="margin-top: 5px; font-size: 12px; color: #bdc3c7;"></div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Game Type Filters:</label>
                <div style="margin-bottom: 10px;">
                    <label style="display: flex; align-items: center; margin-bottom: 5px;">
                        <input type="checkbox" id="include-normal-duels" checked style="margin-right: 8px;">
                        Include Normal Duels (1v1)
                    </label>
                    <label style="display: flex; align-items: center; margin-bottom: 5px;">
                        <input type="checkbox" id="include-party" style="margin-right: 8px;">
                        Include Party games
                    </label>
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="include-team-duels" style="margin-right: 8px;">
                        Include Team Duels
                    </label>
                </div>
                <div style="font-size: 11px; color: #95a5a6; font-style: italic;">
                    Uncheck options to exclude those game types from results
                </div>
            </div>

            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px;">Max pages to analyze:</label>
                <input type="number" id="max-pages" value="5" min="1" max="50" style="width: 100%; padding: 8px; border: none; border-radius: 5px; background: #34495e; color: white; box-sizing: border-box;">
            </div>

            <button id="search-duels" style="width: 100%; padding: 10px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;">
                Search Duels
            </button>

            <div id="progress" style="display: none; margin-bottom: 10px; padding: 10px; background: #34495e; border-radius: 5px; font-size: 12px;"></div>

            <div id="results" style="flex: 1; overflow-y: auto; background: #34495e; padding: 10px; border-radius: 5px; font-size: 12px; white-space: pre-wrap; display: none; min-height: 100px;"></div>

            <div id="actions" style="display: none; margin-top: 10px; flex-shrink: 0;">
                <div style="display: flex; gap: 2%; margin-bottom: 5px;">
                    <button id="copy-full" style="flex: 1; padding: 8px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Copy Full
                    </button>
                    <button id="copy-links" style="flex: 1; padding: 8px; background: #f39c12; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Copy Links
                    </button>
                </div>
                <button id="download-json" style="width: 100%; padding: 8px; background: #9b59b6; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Download JSON
                </button>
            </div>
        `;

        document.body.appendChild(ui);

        const finder = new GeoGuessrDuelFinder();
        let currentResults = [];
        let currentUserInfo = {};

        document.getElementById('search-mode').onchange = (e) => {
            const mode = e.target.value;
            const singleSection = document.getElementById('single-user-section');
            const csvSection = document.getElementById('csv-upload-section');

            if (mode === 'single') {
                singleSection.style.display = 'block';
                csvSection.style.display = 'none';
            } else {
                singleSection.style.display = 'none';
                csvSection.style.display = 'block';
            }
        };

        document.getElementById('csv-file').onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const csvText = event.target.result;
                    updateCsvInfo(csvText);
                };
                reader.readAsText(file);
            }
        };

        document.getElementById('user-filter').onchange = (e) => {
            const csvFile = document.getElementById('csv-file').files[0];
            if (csvFile) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const csvText = event.target.result;
                    updateCsvInfo(csvText);
                };
                reader.readAsText(csvFile);
            }
        };

        function updateCsvInfo(csvText) {
            const filterType = document.getElementById('user-filter').value;
            const { userIds, userInfo, totalUsers, filteredCount } = finder.parseCsv(csvText, filterType);
            currentUserInfo = userInfo;

            const infoDiv = document.getElementById('csv-info');
            const filterInfoDiv = document.getElementById('filter-info');

            infoDiv.textContent = `Total users in CSV: ${totalUsers}`;

            if (filterType === 'all') {
                filterInfoDiv.textContent = `Will search duels against all ${filteredCount} users`;
            } else {
                filterInfoDiv.textContent = `Will search duels against ${filteredCount} banned users`;
            }
        }

        document.getElementById('close-duel-finder').onclick = () => {
            document.body.removeChild(ui);
        };

        document.getElementById('search-duels').onclick = async () => {
            const searchMode = document.getElementById('search-mode').value;
            const maxPages = parseInt(document.getElementById('max-pages').value);

            let targetUserIds = [];

            if (searchMode === 'single') {
                const targetUserInput = document.getElementById('target-user-id').value.trim();

                if (!targetUserInput) {
                    alert('Please enter a user UUID or profile URL!');
                    return;
                }

                let targetUserId = targetUserInput;
                if (targetUserInput.includes('/user/')) {
                    targetUserId = targetUserInput.split('/user/')[1].split('?')[0].split('#')[0];
                }

                targetUserIds = [targetUserId];
                currentUserInfo = {};
            } else {
                const csvFile = document.getElementById('csv-file').files[0];

                if (!csvFile) {
                    alert('Please select a CSV file!');
                    return;
                }

                const reader = new FileReader();
                reader.onload = async (event) => {
                    const csvText = event.target.result;
                    const filterType = document.getElementById('user-filter').value;
                    const { userIds, userInfo } = finder.parseCsv(csvText, filterType);
                    targetUserIds = userIds;
                    currentUserInfo = userInfo;

                    if (targetUserIds.length === 0) {
                        if (filterType === 'banned') {
                            alert('No banned users found in CSV file!');
                        } else {
                            alert('No valid user IDs found in CSV file!');
                        }
                        return;
                    }

                    await performSearch(targetUserIds, maxPages);
                };
                reader.readAsText(csvFile);
                return;
            }

            await performSearch(targetUserIds, maxPages);
        };

        async function performSearch(targetUserIds, maxPages) {
            const progressDiv = document.getElementById('progress');
            const resultsDiv = document.getElementById('results');
            const actionsDiv = document.getElementById('actions');
            const searchBtn = document.getElementById('search-duels');
            
            const includeNormalDuels = document.getElementById('include-normal-duels').checked;
            const includeParty = document.getElementById('include-party').checked;
            const includeTeamDuels = document.getElementById('include-team-duels').checked;

            progressDiv.style.display = 'block';
            resultsDiv.style.display = 'none';
            actionsDiv.style.display = 'none';
            searchBtn.disabled = true;
            searchBtn.textContent = 'Searching...';

            try {
                const duels = await finder.findDuelsAgainstUsers(targetUserIds, maxPages, (message) => {
                    progressDiv.textContent = `${message} (Searching ${targetUserIds.length} users)`;
                }, includeParty, includeTeamDuels, includeNormalDuels);

                currentResults = duels;

                const formattedResults = finder.formatResults(duels, currentUserInfo);
                resultsDiv.textContent = formattedResults;
                resultsDiv.style.display = 'block';
                actionsDiv.style.display = 'block';

                progressDiv.textContent = `Complete! ${duels.length} duel(s) found against ${targetUserIds.length} users`;

            } catch (error) {
                console.error('Search error:', error);
                progressDiv.textContent = `Error: ${error.message}`;
                resultsDiv.style.display = 'none';
                actionsDiv.style.display = 'none';
            }

            searchBtn.disabled = false;
            searchBtn.textContent = 'Search Duels';
        }

        document.getElementById('copy-full').onclick = async () => {
            const results = document.getElementById('results').textContent;
            const success = await finder.copyToClipboard(results);

            const btn = document.getElementById('copy-full');
            const originalText = btn.textContent;
            btn.textContent = success ? 'Copied!' : 'Error';
            setTimeout(() => btn.textContent = originalText, 2000);
        };

        document.getElementById('copy-links').onclick = async () => {
            const linksOnly = finder.formatLinksOnly(currentResults);
            const success = await finder.copyToClipboard(linksOnly);

            const btn = document.getElementById('copy-links');
            const originalText = btn.textContent;
            btn.textContent = success ? 'Copied!' : 'Error';
            setTimeout(() => btn.textContent = originalText, 2000);
        };

        document.getElementById('download-json').onclick = () => {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `duels_${timestamp}.json`;
            const exportData = {
                searchResults: currentResults,
                userInfo: currentUserInfo,
                searchTimestamp: new Date().toISOString(),
                totalUsers: Object.keys(currentUserInfo).length,
                totalDuels: currentResults.length
            };
            finder.downloadJSON(exportData, filename);
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('duel-finder-ui')) {
                document.body.removeChild(ui);
            }
        });
    }

    function addTriggerButton() {
        const button = document.createElement('button');
        button.textContent = 'Duel Finder';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #3498db;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 25px;
            cursor: pointer;
            z-index: 9999;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;

        button.onclick = () => {
            createUI();
        };

        document.body.appendChild(button);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addTriggerButton);
    } else {
        addTriggerButton();
    }

})();