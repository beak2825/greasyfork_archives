// ==UserScript==
// @name         Gugusar Solo & Duels Analyzer !!
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Analyze multiplayer duels and singleplayer games from your activitie
// @author       Flykii (@flykii), Att (attx_) and Tweek (@member0001)
// @match        https://www.geoguessr.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      www.geoguessr.com
// @license      Proprietary Source Available (idk what that means but sure)
// @downloadURL https://update.greasyfork.org/scripts/545725/Gugusar%20Solo%20%20Duels%20Analyzer%20%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/545725/Gugusar%20Solo%20%20Duels%20Analyzer%20%21%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class GeoGuessrAnalyzer {
        constructor() {
            this.baseUrl = 'https://www.geoguessr.com/api';
            this.gameServerUrl = 'https://game-server.geoguessr.com/api';
            this.myUserId = null;
            this.duelsFound = [];
            this.gameStats = this.initGameStats();
            this.processedGameIds = new Set();
        }

        initGameStats() {
            return {
                totalGames: 0,
                byMap: {},
                byGameMode: {},
                byCountry: {},
                totalScore: 0,
                totalDistance: 0,
                averageScore: 0,
                bestScore: 0,
                worstScore: 25000,
                perfectGames: 0,
                games: [],
                filters: {}
            };
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

        async fetchFeedData(paginationToken) {
            let url = '/api/v4/feed/private?count=50';
            if (paginationToken) {
                url += `&paginationToken=${encodeURIComponent(paginationToken)}`;
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data);
                            } catch (error) {
                                reject(new Error('JSON parsing error: ' + error.message));
                            }
                        } else {
                            reject(new Error(`HTTP error: ${response.status}`));
                        }
                    },
                    onerror: function(error) {
                        reject(new Error('Request error: ' + error.message));
                    }
                });
            });
        }

        async getDuelDetails(gameId) {
            return await this.apiRequest(`${this.gameServerUrl}/duels/${gameId}`);
        }

        async fetchGameData(token) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `/api/v3/games/${token}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 300) {
                            try {
                                const data = JSON.parse(response.responseText);
                                resolve(data);
                            } catch (error) {
                                resolve(null);
                            }
                        } else if (response.status === 401 || response.status === 404) {
                            resolve(null);
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: function(error) {
                        resolve(null);
                    }
                });
            });
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

        extractGameTokens(entry) {
            let gameTokens = [];

            if (entry.payload && entry.payload.token) {
                gameTokens.push(entry.payload.token);
            }
            else if (entry.payload && typeof entry.payload === 'string') {
                try {
                    if (entry.payload.startsWith('[')) {
                        const payloadArray = JSON.parse(entry.payload);
                        for (const item of payloadArray) {
                            if (item.payload && item.payload.gameToken) {
                                gameTokens.push(item.payload.gameToken);
                            }
                        }
                    } else {
                        const payloadData = JSON.parse(entry.payload);
                        if (payloadData.gameToken) {
                            gameTokens.push(payloadData.gameToken);
                        }
                    }
                } catch (parseError) {
                    const gameMatches = entry.payload.match(/"gameToken":"([a-zA-Z0-9_-]+)"/g);
                    if (gameMatches) {
                        gameMatches.forEach(match => {
                            const token = match.match(/"gameToken":"([a-zA-Z0-9_-]+)"/)[1];
                            gameTokens.push(token);
                        });
                    }
                }
            }
            else if (entry.payload && entry.payload.gameToken) {
                gameTokens.push(entry.payload.gameToken);
            }

            if (gameTokens.length === 0) {
                const fullEntryStr = JSON.stringify(entry);
                const gameMatches = fullEntryStr.match(/"gameToken":"([a-zA-Z0-9_-]+)"/g);
                if (gameMatches) {
                    gameMatches.forEach(match => {
                        const token = match.match(/"gameToken":"([a-zA-Z0-9_-]+)"/)[1];
                        if (!gameTokens.includes(token)) {
                            gameTokens.push(token);
                        }
                    });
                }
            }

            if (gameTokens.length === 0) {
                const fullEntryStr = JSON.stringify(entry);
                const gameMatch = fullEntryStr.match(/https:\/\/geoguessr\.com\/games\/([a-zA-Z0-9_-]+)/);
                if (gameMatch) {
                    gameTokens.push(gameMatch[1]);
                }
            }

            return gameTokens;
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

                const isTeamDuel = duelData.teams?.some(team => team.players && team.players.length > 1);
                
                if (isTeamDuel && !includeTeamDuels) {
                    return false;
                }

                const isPartyGame = this.detectPartyGame(duelData);
                
                if (isPartyGame && !includeParty) {
                    return false;
                }

                const isNormalDuel = !isTeamDuel && !isPartyGame;
                
                if (isNormalDuel && !includeNormalDuels) {
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
                    
                    return {
                        found: true,
                        duelData: duelData,
                        gameId: gameId,
                        gameLink: `https://www.geoguessr.com/duels/${gameId}/summary`,
                        foundUsers: foundUsers,
                        gameType: gameType
                    };
                }

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

        getGameModeFromRestrictions(gameData) {
            const { forbidMoving, forbidZooming, forbidRotating } = gameData;

            if (forbidMoving && forbidZooming && forbidRotating) {
                return 'NMPZ';
            } else if (forbidMoving && !forbidZooming && !forbidRotating) {
                return 'No Move';
            } else if (!forbidMoving && !forbidZooming && !forbidRotating) {
                return 'Moving';
            } else {
                const restrictions = [];
                if (forbidMoving) restrictions.push('NM');
                if (!forbidZooming) restrictions.push('Z');
                if (!forbidRotating) restrictions.push('R');
                return restrictions.length > 0 ? restrictions.join('') : 'Custom';
            }
        }

        extractMapId(input) {
            if (!input) return null;

            if (/^[a-f0-9]{24}$/i.test(input.trim())) {
                return input.trim();
            }

            const match = input.match(/\/maps\/([a-f0-9]{24})/i);
            return match ? match[1] : null;
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

        async collectSoloGames(maxPages = 10, mapFilter = null, modeFilter = null, progressCallback = null) {
            let paginationToken = null;
            let page = 0;
            let totalGamesCollected = 0;
            let filteredGamesCount = 0;

            this.gameStats = this.initGameStats();
            this.gameStats.filters = {
                mapId: mapFilter,
                mode: modeFilter
            };

            while (page < maxPages) {
                try {
                    const feedData = await this.fetchFeedData(paginationToken);

                    if (!feedData || !feedData.entries || feedData.entries.length === 0) {
                        if (progressCallback) {
                            progressCallback(`End of data at page ${page + 1}`);
                        }
                        break;
                    }

                    for (const entry of feedData.entries) {
                        let hasGameData = false;

                        if (entry.type === 'game' || entry.payload) {
                            if (typeof entry.payload === 'string' && entry.payload.includes('gameToken')) {
                                hasGameData = true;
                            }
                            else if (entry.payload && entry.payload.gameToken) {
                                hasGameData = true;
                            }
                            else if (entry.payload && entry.payload.token) {
                                hasGameData = true;
                            }
                            else if (entry.payload && (
                                (entry.payload.url && entry.payload.url.includes('https://geoguessr.com/games/')) ||
                                JSON.stringify(entry.payload).includes('https://geoguessr.com/games/')
                            )) {
                                hasGameData = true;
                            }
                            else if (JSON.stringify(entry).includes('gameToken')) {
                                hasGameData = true;
                            }
                        }

                        if (hasGameData) {
                            const processed = await this.processGameEntry(entry, mapFilter, modeFilter);
                            totalGamesCollected++;
                            if (processed) {
                                filteredGamesCount++;
                            }

                            if (totalGamesCollected % 3 === 0) {
                                await new Promise(resolve => setTimeout(resolve, 100));
                            }
                        }
                    }

                    if (!feedData.paginationToken) {
                        if (progressCallback) {
                            progressCallback(`End of data at page ${page + 1}`);
                        }
                        break;
                    }

                    paginationToken = feedData.paginationToken;
                    page++;

                    if (progressCallback) {
                        progressCallback(`Processing page ${page}/${maxPages} - ${this.gameStats.totalGames} games found...`);
                    }

                    await new Promise(resolve => setTimeout(resolve, 100));

                } catch (error) {
                    console.error('Error fetching page', page, error);
                    if (progressCallback) {
                        progressCallback(`Error at page ${page + 1}: ${error.message}`);
                    }
                    break;
                }
            }

            this.calculateFinalStats();
            return this.gameStats;
        }

        async processGameEntry(entry, mapFilter, modeFilter) {
            try {
                const gameTokens = this.extractGameTokens(entry);

                if (gameTokens.length > 0) {
                    let hasValidGame = false;
                    for (const gameToken of gameTokens) {
                        const gameData = await this.fetchGameData(gameToken);
                        if (gameData) {
                            const passesFilters = this.applyFilters(gameData, mapFilter, modeFilter);
                            if (passesFilters) {
                                this.analyzeGame(gameData, entry);
                                hasValidGame = true;
                            }
                        }
                        await new Promise(resolve => setTimeout(resolve, 50));
                    }
                    return hasValidGame;
                } else {
                    return false;
                }

            } catch (error) {
                console.error('Error processing game:', error, entry);
                return false;
            }
        }

        applyFilters(gameData, mapFilter, modeFilter) {
            if (mapFilter && gameData.map !== mapFilter) {
                return false;
            }

            if (modeFilter) {
                const gameMode = this.getGameModeFromRestrictions(gameData);
                if (gameMode !== modeFilter) {
                    return false;
                }
            }

            return true;
        }

        analyzeGame(gameData, entry) {
            if (!gameData.player || !gameData.player.totalScore) return;

            const score = parseInt(gameData.player.totalScore.amount) || 0;
            const distance = gameData.player.totalDistanceInMeters || 0;
            const mapName = gameData.mapName || 'Unknown';
            const gameMode = this.getGameModeFromRestrictions(gameData);

            this.gameStats.totalGames++;
            this.gameStats.totalScore += score;
            this.gameStats.totalDistance += distance;

            if (score > this.gameStats.bestScore) this.gameStats.bestScore = score;
            if (score < this.gameStats.worstScore) this.gameStats.worstScore = score;
            if (score === 25000) this.gameStats.perfectGames++;

            if (!this.gameStats.byMap[mapName]) {
                this.gameStats.byMap[mapName] = {
                    games: 0,
                    totalScore: 0,
                    totalDistance: 0,
                    bestScore: 0,
                    averageScore: 0
                };
            }
            this.gameStats.byMap[mapName].games++;
            this.gameStats.byMap[mapName].totalScore += score;
            this.gameStats.byMap[mapName].totalDistance += distance;
            if (score > this.gameStats.byMap[mapName].bestScore) {
                this.gameStats.byMap[mapName].bestScore = score;
            }
            this.gameStats.byMap[mapName].averageScore = Math.round(this.gameStats.byMap[mapName].totalScore / this.gameStats.byMap[mapName].games);

            if (!this.gameStats.byGameMode[gameMode]) {
                this.gameStats.byGameMode[gameMode] = {
                    games: 0,
                    totalScore: 0,
                    averageScore: 0
                };
            }
            this.gameStats.byGameMode[gameMode].games++;
            this.gameStats.byGameMode[gameMode].totalScore += score;
            this.gameStats.byGameMode[gameMode].averageScore = Math.round(this.gameStats.byGameMode[gameMode].totalScore / this.gameStats.byGameMode[gameMode].games);

            if (gameData.rounds) {
                gameData.rounds.forEach(round => {
                    const country = round.streakLocationCode || 'unknown';
                    if (!this.gameStats.byCountry[country]) {
                        this.gameStats.byCountry[country] = 0;
                    }
                    this.gameStats.byCountry[country]++;
                });
            }

            this.gameStats.games.push({
                token: gameData.token,
                date: entry.created || entry.time,
                score: score,
                distance: distance,
                mapName: mapName,
                mapId: gameData.map,
                gameMode: gameMode,
                rounds: gameData.rounds ? gameData.rounds.length : 0,
                restrictions: {
                    forbidMoving: gameData.forbidMoving,
                    forbidZooming: gameData.forbidZooming,
                    forbidRotating: gameData.forbidRotating
                }
            });
        }

        calculateFinalStats() {
            if (this.gameStats.totalGames > 0) {
                this.gameStats.averageScore = Math.round(this.gameStats.totalScore / this.gameStats.totalGames);
            }
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

        formatDuelResults(duels, userInfo = {}) {
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
        if (document.getElementById('geoguessr-analyzer-ui')) return;

        const ui = document.createElement('div');
        ui.id = 'geoguessr-analyzer-ui';
        ui.style.cssText = `
            position: fixed;
            top: 60px;
            right: 60px;
            width: 50vw;
            min-width: 500px;
            max-width: 800px;
            max-height: 90vh;
            background: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.41);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
        `;

        ui.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #3498db;">GeoGuessr Analyzer</h3>
                <button id="close-analyzer" style="background: #e74c3c; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">×</button>
            </div>

            <div style="margin-bottom: 15px;">
                <div style="display: flex; gap: 10px;">
                    <button id="multiplayer-tab" class="tab-button" style="flex: 1; padding: 10px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Multiplayer
                    </button>
                    <button id="singleplayer-tab" class="tab-button" style="flex: 1; padding: 10px; background: #34495e; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Singleplayer
                    </button>
                </div>
            </div>

            <div id="multiplayer-panel" class="panel">
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
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Max pages to analyze:</label>
                    <input type="number" id="max-pages-duels" value="5" min="1" max="50" style="width: 100%; padding: 8px; border: none; border-radius: 5px; background: #34495e; color: white; box-sizing: border-box;">
                </div>

                <button id="search-duels" style="width: 100%; padding: 10px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;">
                    Search Duels
                </button>
            </div>

            <div id="singleplayer-panel" class="panel" style="display: none;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Number of pages to analyze:</label>
                    <input type="number" id="max-pages-solo" value="10" min="1" max="200" style="width: 100%; padding: 8px; border: none; border-radius: 5px; background: #34495e; color: white; box-sizing: border-box;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Filter by map (URL or ID):</label>
                    <input type="text" id="map-filter-input" placeholder="https://www.geoguessr.com/maps/... or ID" style="width: 100%; padding: 8px; border: none; border-radius: 5px; background: #34495e; color: white; box-sizing: border-box;">
                </div>

                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Filter by mode:</label>
                    <select id="mode-filter-select" style="width: 100%; padding: 8px; border: none; border-radius: 5px; background: #34495e; color: white; box-sizing: border-box;">
                        <option value="">All modes</option>
                        <option value="Moving">Moving</option>
                        <option value="No Move">No Move</option>
                        <option value="NMPZ">NMPZ</option>
                    </select>
                </div>

                <button id="collect-solo" style="width: 100%; padding: 10px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 10px;">
                    Search Solo Games
                </button>

                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button id="show-stats-btn" style="flex: 1; padding: 8px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Show Stats
                    </button>
                    <button id="export-solo-btn" style="flex: 1; padding: 8px; background: #f39c12; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Export JSON
                    </button>
                </div>
            </div>

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

        const analyzer = new GeoGuessrAnalyzer();
        let currentResults = [];
        let currentUserInfo = {};
        let currentActiveTab = 'multiplayer';

        function switchTab(tabName) {
            currentActiveTab = tabName;
            
            document.getElementById('multiplayer-tab').style.background = tabName === 'multiplayer' ? '#27ae60' : '#34495e';
            document.getElementById('singleplayer-tab').style.background = tabName === 'singleplayer' ? '#27ae60' : '#34495e';
            
            document.getElementById('multiplayer-panel').style.display = tabName === 'multiplayer' ? 'block' : 'none';
            document.getElementById('singleplayer-panel').style.display = tabName === 'singleplayer' ? 'block' : 'none';
            
            document.getElementById('results').style.display = 'none';
            document.getElementById('actions').style.display = 'none';
        }

        document.getElementById('multiplayer-tab').onclick = () => switchTab('multiplayer');
        document.getElementById('singleplayer-tab').onclick = () => switchTab('singleplayer');

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
            const { userIds, userInfo, totalUsers, filteredCount } = analyzer.parseCsv(csvText, filterType);
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

        document.getElementById('close-analyzer').onclick = () => {
            document.body.removeChild(ui);
        };

        document.getElementById('search-duels').onclick = async () => {
            const searchMode = document.getElementById('search-mode').value;
            const maxPages = parseInt(document.getElementById('max-pages-duels').value);

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
                    const { userIds, userInfo } = analyzer.parseCsv(csvText, filterType);
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

                    await performDuelSearch(targetUserIds, maxPages);
                };
                reader.readAsText(csvFile);
                return;
            }

            await performDuelSearch(targetUserIds, maxPages);
        };

        document.getElementById('collect-solo').onclick = async () => {
            const maxPages = parseInt(document.getElementById('max-pages-solo').value) || 10;
            const mapFilter = analyzer.extractMapId(document.getElementById('map-filter-input').value);
            const modeFilter = document.getElementById('mode-filter-select').value;

            const progressDiv = document.getElementById('progress');
            const resultsDiv = document.getElementById('results');
            const actionsDiv = document.getElementById('actions');
            const collectBtn = document.getElementById('collect-solo');

            progressDiv.style.display = 'block';
            resultsDiv.style.display = 'none';
            actionsDiv.style.display = 'none';
            collectBtn.disabled = true;
            collectBtn.textContent = 'Collecting...';

            try {
                const gameStats = await analyzer.collectSoloGames(maxPages, mapFilter, modeFilter, (message) => {
                    progressDiv.textContent = message;
                });

                displaySoloStats(gameStats);
                progressDiv.textContent = `Complete! ${gameStats.totalGames} solo games collected`;

            } catch (error) {
                console.error('Collection error:', error);
                progressDiv.textContent = `Error: ${error.message}`;
                resultsDiv.style.display = 'none';
                actionsDiv.style.display = 'none';
            }

            collectBtn.disabled = false;
            collectBtn.textContent = 'Search Solo Games';
        };

        async function performDuelSearch(targetUserIds, maxPages) {
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
                const duels = await analyzer.findDuelsAgainstUsers(targetUserIds, maxPages, (message) => {
                    progressDiv.textContent = `${message} (Searching ${targetUserIds.length} users)`;
                }, includeParty, includeTeamDuels, includeNormalDuels);

                currentResults = duels;

                const formattedResults = analyzer.formatDuelResults(duels, currentUserInfo);
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

        function displaySoloStats(gameStats) {
            const display = document.getElementById('results');

            if (gameStats.totalGames === 0) {
                display.textContent = 'No data collected. Click "Search Solo Games" first.';
                display.style.display = 'block';
                return;
            }

            const topMaps = Object.entries(gameStats.byMap)
                .sort((a, b) => b[1].games - a[1].games)
                .slice(0, 5);

            const topCountries = Object.entries(gameStats.byCountry)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            let filtersHtml = '';
            if (gameStats.filters) {
                const filters = [];
                if (gameStats.filters.mapId) filters.push(`Map: ${gameStats.filters.mapId}`);
                if (gameStats.filters.mode) filters.push(`Mode: ${gameStats.filters.mode}`);
                if (filters.length > 0) {
                    filtersHtml = `Filters: ${filters.join(', ')}\n\n`;
                }
            }

            const statsText = `${filtersHtml}SOLO GAMES STATISTICS

Total games: ${gameStats.totalGames}
Average score: ${gameStats.averageScore}
Best score: ${gameStats.bestScore}
Worst score: ${gameStats.worstScore}
Perfect games: ${gameStats.perfectGames}
Total distance: ${Math.round(gameStats.totalDistance / 1000).toLocaleString()} km

TOP 5 MAPS:
${topMaps.map(([map, stats]) => `${map}: ${stats.games} games (avg: ${stats.averageScore})`).join('\n')}

GAME MODES:
${Object.entries(gameStats.byGameMode).map(([mode, stats]) => `${mode}: ${stats.games} games (avg: ${stats.averageScore})`).join('\n')}

TOP 5 COUNTRIES:
${topCountries.map(([country, count]) => `${country.toUpperCase()}: ${count} rounds`).join('\n')}`;

            display.textContent = statsText;
            display.style.display = 'block';
            document.getElementById('actions').style.display = 'none';

            currentResults = gameStats;
        }

        document.getElementById('show-stats-btn').onclick = () => {
            if (analyzer.gameStats && analyzer.gameStats.totalGames > 0) {
                displaySoloStats(analyzer.gameStats);
            } else {
                alert('No solo game data available. Collect data first.');
            }
        };

        document.getElementById('export-solo-btn').onclick = () => {
            if (analyzer.gameStats && analyzer.gameStats.totalGames > 0) {
                const exportData = {
                    exportDate: new Date().toISOString(),
                    filters: analyzer.gameStats.filters || {},
                    summary: {
                        totalGames: analyzer.gameStats.totalGames,
                        averageScore: analyzer.gameStats.averageScore,
                        bestScore: analyzer.gameStats.bestScore,
                        worstScore: analyzer.gameStats.worstScore,
                        perfectGames: analyzer.gameStats.perfectGames,
                        totalDistance: analyzer.gameStats.totalDistance
                    },
                    byMap: analyzer.gameStats.byMap,
                    byGameMode: analyzer.gameStats.byGameMode,
                    byCountry: analyzer.gameStats.byCountry,
                    games: analyzer.gameStats.games
                };

                const filterSuffix = analyzer.gameStats.filters && (analyzer.gameStats.filters.mapId || analyzer.gameStats.filters.mode)
                    ? '_filtered'
                    : '';

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `geoguessr_solo_stats${filterSuffix}_${timestamp}.json`;
                analyzer.downloadJSON(exportData, filename);
            } else {
                alert('No solo game data to export. Collect data first.');
            }
        };

        document.getElementById('copy-full').onclick = async () => {
            const results = document.getElementById('results').textContent;
            const success = await analyzer.copyToClipboard(results);

            const btn = document.getElementById('copy-full');
            const originalText = btn.textContent;
            btn.textContent = success ? 'Copied!' : 'Error';
            setTimeout(() => btn.textContent = originalText, 2000);
        };

        document.getElementById('copy-links').onclick = async () => {
            if (currentActiveTab === 'multiplayer' && Array.isArray(currentResults)) {
                const linksOnly = analyzer.formatLinksOnly(currentResults);
                const success = await analyzer.copyToClipboard(linksOnly);

                const btn = document.getElementById('copy-links');
                const originalText = btn.textContent;
                btn.textContent = success ? 'Copied!' : 'Error';
                setTimeout(() => btn.textContent = originalText, 2000);
            } else {
                alert('Copy links is only available for multiplayer results.');
            }
        };

        document.getElementById('download-json').onclick = () => {
            if (currentActiveTab === 'multiplayer' && Array.isArray(currentResults)) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `duels_${timestamp}.json`;
                const exportData = {
                    searchResults: currentResults,
                    userInfo: currentUserInfo,
                    searchTimestamp: new Date().toISOString(),
                    totalUsers: Object.keys(currentUserInfo).length,
                    totalDuels: currentResults.length
                };
                analyzer.downloadJSON(exportData, filename);
            } else {
                alert('JSON download is only available for multiplayer results.');
            }
        };

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.getElementById('geoguessr-analyzer-ui')) {
                document.body.removeChild(ui);
            }
        });
    }

    function addTriggerButton() {
        const button = document.createElement('button');
        button.textContent = 'GG Analyzer';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2d97dfff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 25px;
            cursor: pointer;
            z-index: 9999;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.23);
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