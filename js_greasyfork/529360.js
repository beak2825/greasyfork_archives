// ==UserScript==
// @name         Nitro Type Flag Check StarTrack+NTL:Legacy
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  Checks Nitro Type racers for flags/bans using NT StarTrack and NTL, showing color-coded icons with custom tooltips.
// @match        https://www.nitrotype.com/team/*
// @match        https://www.nitrotype.com/racer/*
// @match        https://www.nitrotype.com/leagues
// @match        https://www.nitrotype.com/friends
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      ntleaderboards.com
// @connect      ntstartrack.org
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529360/Nitro%20Type%20Flag%20Check%20StarTrack%2BNTL%3ALegacy.user.js
// @updateURL https://update.greasyfork.org/scripts/529360/Nitro%20Type%20Flag%20Check%20StarTrack%2BNTL%3ALegacy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== SHARED OPTIMIZATION LAYER =====
    window.NTShared = window.NTShared || {
        cache: {
            individual: { data: null, timestamp: 0, expiresAt: 0 },
            team: { data: null, timestamp: 0, expiresAt: 0 },
            isbot: new Map()
        },

        setCache(type, data, expiresAt) {
            this.cache[type].data = data;
            this.cache[type].timestamp = Date.now();
            this.cache[type].expiresAt = expiresAt || (Date.now() + 3600000);
            window.dispatchEvent(new CustomEvent('nt-cache-updated', {
                detail: { type, data, expiresAt }
            }));
        },

        getCache(type, maxAge = 3600000) {
            const cached = this.cache[type];
            if (!cached.data) return null;

            const age = Date.now() - cached.timestamp;
            if (age < maxAge && Date.now() < cached.expiresAt) {
                return cached.data;
            }
            return null;
        },

        getBotStatus(username) {
            return this.cache.isbot.get(username.toLowerCase());
        },

        setBotStatus(username, status) {
            this.cache.isbot.set(username.toLowerCase(), status);
        }
    };

    // Consolidated MutationObserver Manager
    window.NTObserverManager = window.NTObserverManager || {
        callbacks: {},
        observer: null,
        debounceTimer: null,

        register(scriptName, callback) {
            this.callbacks[scriptName] = callback;

            if (!this.observer) {
                this.observer = new MutationObserver(() => {
                    clearTimeout(this.debounceTimer);
                    this.debounceTimer = setTimeout(() => {
                        Object.values(this.callbacks).forEach(cb => {
                            try { cb(); } catch(e) { console.error('[Observer Error]', e); }
                        });
                    }, 250);
                });
                this.observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }
    };

    // =============================
    // 🎨 Constants & Configuration
    // =============================
    const STARTRACK_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

    const colorMap = {
        green: "#00FF00",
        red: "#FF0000",
        yellow: "#FFFF00",
        orange: "#FFA500",
        gray: "#696969"
    };

    let customTooltipElement = null;

    // =============================
    // 🔑 Token Management
    // =============================
    function getToken() {
        let token = GM_getValue('nt_token');
        if (!token) {
            token = localStorage.getItem("player_token");
            if (token) {
                GM_setValue('nt_token', token);
            }
        }
        return token;
    }

    function getTokenAndRetry(callback) {
        const token = localStorage.getItem("player_token");
        if (token) {
            GM_setValue('nt_token', token);
            callback();
        }
    }

    // =============================
    // 🛠️ Helper: Set Icon on Element
    // =============================
    function setIcon(element, color, tooltip, source) {
        let statusField;
        if (element.classList.contains('table-row')) {
            statusField = element.querySelector('.tsi.tc-lemon.tsxs');
        } else if (element.classList.contains('profile-title')) {
            statusField = element;
        } else {
            const allRows = document.querySelectorAll('.table-row');
            for (const row of allRows) {
                const racerContainer = row.querySelector('.player-name--container');
                if (racerContainer && racerContainer.getAttribute('title') === element.getAttribute('title')) {
                    statusField = row.querySelector('.tsi.tc-lemon.tsxs');
                    break;
                }
            }
        }

        if (!statusField) {
            return;
        }

        const existingIcons = statusField.querySelectorAll(`.status-icon-${color}`);
        existingIcons.forEach(icon => icon.remove());

        const iconSpan = document.createElement('span');
        iconSpan.classList.add('status-icon', `status-icon-${color}`);
        iconSpan.style.marginLeft = "5px";
        iconSpan.style.display = "inline-block";
        iconSpan.style.fontSize = "12px";
        iconSpan.style.fontWeight = "600";
        iconSpan.style.whiteSpace = "nowrap";
        iconSpan.style.cursor = "help";

        const emojiMap = {
            green: "🟢",
            red: "🔴",
            yellow: "🟡",
            orange: "🟠",
            gray: "⚫"
        };

        const label = source === "NTL" ? "NTL" : "ST";
        const emoji = emojiMap[color] || "⚪";
        const labelColor = colorMap[color] || color;

        iconSpan.innerHTML = `${emoji}<span style="color: ${labelColor}; margin-left: 2px;">${label}</span>`;

        iconSpan.addEventListener('mouseenter', function(event) {
            customTooltipElement = document.createElement('div');
            customTooltipElement.textContent = tooltip;
            customTooltipElement.style.position = 'absolute';
            customTooltipElement.style.backgroundColor = '#333';
            customTooltipElement.style.color = 'white';
            customTooltipElement.style.padding = '4px 8px';
            customTooltipElement.style.borderRadius = '4px';
            customTooltipElement.style.zIndex = '10001';
            customTooltipElement.style.fontSize = '12px';
            customTooltipElement.style.fontFamily = 'Arial, sans-serif';
            customTooltipElement.style.pointerEvents = 'none';
            customTooltipElement.style.left = (event.pageX + 10) + 'px';
            customTooltipElement.style.top = (event.pageY + 10) + 'px';
            document.body.appendChild(customTooltipElement);
        });

        iconSpan.addEventListener('mousemove', function(event) {
            if (customTooltipElement) {
                customTooltipElement.style.left = (event.pageX + 10) + 'px';
                customTooltipElement.style.top = (event.pageY + 10) + 'px';
            }
        });

        iconSpan.addEventListener('mouseleave', function() {
            if (customTooltipElement) {
                customTooltipElement.remove();
                customTooltipElement = null;
            }
        });

        // Use icon queue for coordinated loading if available
        if (window.NTIconQueue && window.NTIconQueue.add) {
            window.NTIconQueue.add(() => statusField.appendChild(iconSpan));
        } else {
            statusField.appendChild(iconSpan);
        }
    }

    // =============================
    // 🟢 Fetch NT StarTrack Status
    // =============================
    function fetchStarTrackStatus(username, element) {
        // Check shared cache first
        const sharedStatus = window.NTShared.getBotStatus(username);
        if (sharedStatus) {
            setIcon(element, sharedStatus.color, sharedStatus.tooltip, "ST");
            return Promise.resolve();
        }

        const cacheKey = `startrack_${username}`;
        const cached = GM_getValue(cacheKey);

        if (cached && (Date.now() - cached.timestamp) < STARTRACK_CACHE_DURATION) {
            setIcon(element, cached.color, cached.tooltip, "ST");
            return Promise.resolve();
        }

        const url = `http://ntstartrack.org:5001/api/isbot/${username}`;
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    let color, tooltip;
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.is_bot === true) {
                            color = "red";
                            tooltip = "StarTrack: Flagged";
                        } else if (data.is_bot === false) {
                            color = "green";
                            tooltip = "StarTrack: Not Flagged";
                        } else if (data.error) {
                            color = "yellow";
                            tooltip = "StarTrack: Untracked";
                        } else {
                            color = "gray";
                            tooltip = "StarTrack: Unexpected Response";
                        }
                        GM_setValue(cacheKey, { color, tooltip, timestamp: Date.now() });
                        window.NTShared.setBotStatus(username, { color, tooltip });
                        setIcon(element, color, tooltip, "ST");
                    } catch (err) {
                        if (response.status === 404) {
                            color = "yellow";
                            tooltip = "StarTrack: Untracked";
                            GM_setValue(cacheKey, { color, tooltip, timestamp: Date.now() });
                            window.NTShared.setBotStatus(username, { color, tooltip });
                            setIcon(element, color, tooltip, "ST");
                        } else {
                            setIcon(element, "gray", "StarTrack: Error", "ST");
                        }
                    }
                    resolve();
                },
                onerror: function() {
                    setIcon(element, "gray", "StarTrack: Network Error", "ST");
                    resolve();
                }
            });
        });
    }

    // =============================
    // 🟠 Fetch NTL Legacy Status
    // =============================
    function fetchNTLStatus(username, element) {
        const cacheKey = `ntl_${username}`;
        const cached = GM_getValue(cacheKey);

        if (cached) {
            setIcon(element, cached.color, cached.tooltip, "NTL");
            return Promise.resolve();
        }

        const url = `https://ntleaderboards.com/is_user_banned/${username}`;
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = response.responseText.trim();
                        let color, tooltip;

                        if (data === "Y (ban)") {
                            color = "orange";
                            tooltip = "Legacy NTL (Banned)";
                        } else if (data === "Y (ban+flag)") {
                            color = "orange";
                            tooltip = "Legacy NTL (Flagged)";
                        } else {
                            resolve();
                            return;
                        }

                        GM_setValue(cacheKey, { color, tooltip });
                        setIcon(element, color, tooltip, "NTL");
                    }
                    resolve();
                }
            });
        });
    }

    // =============================
    // 🎯 Update Status (Dual Check)
    // =============================
    async function updateStatus(element, username) {
        element.setAttribute('data-status-processing', 'true');
        await Promise.all([
            fetchStarTrackStatus(username, element),
            fetchNTLStatus(username, element)
        ]);
        element.removeAttribute('data-status-processing');
    }

    // =============================
    // 🔍 Observe Main Content
    // =============================
    function observeMainContent() {
        window.NTObserverManager.register('botflag', () => {
            const path = window.location.pathname;
            if (path.startsWith("/team") && document.querySelector('.table-row')) {
                handleTeamPage();
            } else if (path.startsWith("/racer") && document.querySelector('.profile-title')) {
                handleRacerPage();
            } else if (path === "/leagues" && document.querySelector('.table-row')) {
                handleLeaguesPage();
            } else if (path === "/friends" && document.querySelector('.tab')) {
                handleFriendsPage();
            }
        });
    }

    // =============================
    // 👥 /team Page Handling
    // =============================
    function handleTeamPage() {
        checkUserBansTeam();
    }

    async function checkUserBansTeam() {
        const applicationsMap = await fetchTeamApplications();
        const userMap = await fetchTeamActivity();

        if (applicationsMap) {
            updateUsersTeamApplications(applicationsMap);
        }
        if (userMap) {
            updateUsersTeam(userMap);
        }
    }

    async function fetchTeamActivity() {
        try {
            const TEAM = window.location.pathname.split('/').pop();

            // Check cache first (5 minute cache like friends list)
            const cacheKey = `team_activity_${TEAM}`;
            const cached = GM_getValue(cacheKey);
            const TEAM_CACHE_DURATION = 300000; // 5 minutes

            if (cached && (Date.now() - cached.timestamp) < TEAM_CACHE_DURATION) {
                return cached.data;
            }

            const token = getToken();

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: `https://www.nitrotype.com/api/v2/teams/${TEAM}`,
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "accept": "application/json, text/plain, */*"
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            if (data.status === "OK") {
                                const memberMap = {};
                                data.results.members.forEach(member => {
                                    memberMap[member.displayName || member.username] = member.username;
                                });

                                // Cache the result
                                GM_setValue(cacheKey, {
                                    data: memberMap,
                                    timestamp: Date.now()
                                });

                                resolve(memberMap);
                            } else {
                                resolve(null);
                            }
                        } else if (response.status === 401) {
                            getTokenAndRetry(() => fetchTeamActivity().then(resolve));
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        } catch (error) {
            return null;
        }
    }

    async function fetchTeamApplications() {
        try {
            // Check cache first (5 minute cache)
            const cacheKey = 'team_applications';
            const cached = GM_getValue(cacheKey);
            const APPLICATIONS_CACHE_DURATION = 300000; // 5 minutes

            if (cached && (Date.now() - cached.timestamp) < APPLICATIONS_CACHE_DURATION) {
                return cached.data;
            }

            const token = getToken();

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://www.nitrotype.com/api/v2/teams/applications",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "accept": "application/json, text/plain, */*"
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            if (data.results && data.results.length > 0) {
                                const memberMap = {};
                                data.results.forEach(member => {
                                    memberMap[member.displayName || member.username] = member.username;
                                });

                                // Cache the result
                                GM_setValue(cacheKey, {
                                    data: memberMap,
                                    timestamp: Date.now()
                                });

                                resolve(memberMap);
                            } else {
                                resolve(null);
                            }
                        } else if (response.status === 401) {
                            getTokenAndRetry(() => fetchTeamApplications().then(resolve));
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        } catch (error) {
            return null;
        }
    }

    async function updateUsersTeam(userMap) {
        // Collect all promises to wait for batch completion
        const promises = [];

        for (const [displayName, username] of Object.entries(userMap)) {
            const promise = updateUserStatusTeam(username, displayName);
            if (promise) promises.push(promise);
        }

        // Wait for all icon additions to complete before flushing queue
        await Promise.all(promises);
    }

    async function updateUsersTeamApplications(userMap) {
        const promises = [];

        for (const [displayName, username] of Object.entries(userMap)) {
            const promise = updateUserStatusTeamApplications(username, displayName);
            if (promise) promises.push(promise);
        }

        await Promise.all(promises);
    }

    function updateUserStatusTeam(username, displayName) {
        const teamTable = document.querySelector('.table.table--striped.table--selectable.table--team.table--teamOverview');
        if (!teamTable) return null;

        const playerNameContainers = teamTable.querySelectorAll('.player-name--container[title]');
        const playerNameContainer = Array.from(playerNameContainers).find(container => {
            const nameSpan = container.querySelector('.type-ellip');
            return nameSpan && nameSpan.textContent.trim() === displayName.trim();
        });

        if (playerNameContainer) {
            const row = playerNameContainer.closest('.table-row');
            if (row && !row.classList.contains('status-processed')) {
                row.classList.add('status-processed');
                return updateStatus(row, username);
            }
        }
        return null;
    }

    function updateUserStatusTeamApplications(username, displayName) {
        const allRows = document.querySelectorAll('.row.row--o.well.well--b.well--l');
        let appSection = null;

        for (const row of allRows) {
            const h3 = row.querySelector('h3.mbf');
            if (h3 && h3.textContent.includes('Pending Applications')) {
                appSection = row;
                break;
            }
        }

        if (!appSection) return null;

        const playerNameContainers = appSection.querySelectorAll('.player-name--container[title]');
        const playerNameContainer = Array.from(playerNameContainers).find(container => {
            const nameSpan = container.querySelector('.type-ellip');
            return nameSpan && nameSpan.textContent.trim() === displayName.trim();
        });

        if (playerNameContainer) {
            const row = playerNameContainer.closest('.table-row');
            if (row && !row.classList.contains('status-processed')) {
                row.classList.add('status-processed');
                return updateStatus(row, username);
            }
        }
        return null;
    }

    // =============================
    // 🏁 /racer Page Handling
    // =============================
    function handleRacerPage() {
        const username = window.location.pathname.split('/').pop();
        const el = document.querySelector('.profile-title');
        if (username && el) updateStatus(el, username);
    }

    // =============================
    // 🏆 /leagues Page Handling
    // =============================
    async function handleLeaguesPage() {
        // Check cache first (5 minute cache)
        const cacheKey = 'leagues_user_activity';
        const cached = GM_getValue(cacheKey);
        const LEAGUES_CACHE_DURATION = 300000; // 5 minutes

        let userMap;

        if (cached && (Date.now() - cached.timestamp) < LEAGUES_CACHE_DURATION) {
            userMap = cached.data;
        } else {
            const token = getToken();
            if (!token) return;

            userMap = await new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "https://www.nitrotype.com/api/v2/leagues/user/activity",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    onload: function(response) {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            if (data.status === "OK") {
                                const map = {};
                                data.results.standings.forEach(u => {
                                    map[u.displayName || u.username] = u.username;
                                });

                                // Cache the result
                                GM_setValue(cacheKey, {
                                    data: map,
                                    timestamp: Date.now()
                                });

                                resolve(map);
                            } else {
                                resolve(null);
                            }
                        } else if (response.status === 401) {
                            getTokenAndRetry(() => handleLeaguesPage());
                            resolve(null);
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        }

        if (userMap) {
            await processLeagues(userMap);
        }
    }

    async function processLeagues(userMap) {
        const leaderboardRows = document.querySelectorAll('.table-row');
        const promises = [];

        leaderboardRows.forEach(row => {
            const playerElement = row.querySelector('.player-name--container[title]');
            if (!playerElement) return;

            const displayName = playerElement.getAttribute('title');
            const username = userMap[displayName];

            if (username && !row.classList.contains('status-processed')) {
                row.classList.add('status-processed');
                promises.push(updateStatus(row, username));
            }
        });

        // Wait for all icon additions to complete
        await Promise.all(promises);
    }

    // =============================
    // 👫 /friends Page Handling (v3.1 LOGIC)
    // =============================
    function handleFriendsPage() {
        function observeDOMChanges(callback) {
            const observer = new MutationObserver(() => callback());
            observer.observe(document.body, { childList: true, subtree: true });
        }

        observeDOMChanges(function() {
            const activeTab = getActiveTab();
            if (activeTab) {
                if (activeTab === "Friends") {
                    handleFriendsTab();
                } else if (activeTab === "Requests") {
                    handleRequestsTab();
                } else if (activeTab === "Search") {
                    handleSearchTab();
                } else if (activeTab === "Recent") {
                    handleRecentTab();
                }
            }
        });
    }

    function getActiveTab() {
        const activeTabElement = document.querySelector('.tab.is-active');
        if (!activeTabElement) return null;
        const bucketContent = activeTabElement.querySelector('.bucket-content');
        return bucketContent ? bucketContent.textContent.trim() : null;
    }

    function handleFriendsTab() {
        const rows = getRowsForTab();
        processFriends(rows, "Friends");
    }

    function handleRequestsTab() {
        const token = getToken();
        if (!token) return;

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.nitrotype.com/api/v2/friend-requests",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const requests = data.results.requests || [];

                    const rows = getRowsForTab();
                    rows.forEach(row => {
                        const playerElement = row.querySelector('.player-name--container');
                        if (!playerElement) return;

                        const displayName = playerElement.getAttribute('title') || playerElement.textContent.trim();
                        const match = requests.find(req => req.displayName === displayName || req.username === displayName);

                        if (match && !row.classList.contains('status-processed')) {
                            updateStatus(row, match.username);
                            row.classList.add('status-processed');
                        }
                    });
                } else if (response.status === 401) {
                    getTokenAndRetry(handleRequestsTab);
                }
            }
        });
    }

    function handleSearchTab() {
        const searchInput = document.querySelector('#friendsearch');
        if (!searchInput || !searchInput.value) return;

        const searchTerm = searchInput.value.trim();
        if (!searchTerm) return;

        const token = getToken();
        if (!token) return;

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://www.nitrotype.com/api/v2/players/search",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: `term=${encodeURIComponent(searchTerm)}`,
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const results = data.results || [];

                    const rows = getRowsForTab();
                    rows.forEach(row => {
                        const playerElement = row.querySelector('.player-name--container');
                        if (!playerElement) return;

                        const displayName = playerElement.getAttribute('title') || playerElement.textContent.trim();
                        const match = results.find(r => r.displayName === displayName || r.username === displayName);

                        if (match && !row.classList.contains('status-processed')) {
                            updateStatus(row, match.username);
                            row.classList.add('status-processed');
                        }
                    });
                } else if (response.status === 401) {
                    getTokenAndRetry(handleSearchTab);
                }
            }
        });
    }

    function handleRecentTab() {
        const rows = getRowsForTab();
        rows.forEach(row => {
            if (row.classList.contains('status-processed')) return;
            const playerElement = row.querySelector('.player-name--container');
            if (!playerElement) return;

            const displayName = playerElement.getAttribute('title') || playerElement.textContent.trim();
            if (displayName) {
                updateStatus(row, displayName);
                row.classList.add('status-processed');
            }
        });
    }

    // Cache for friends list - fetch once, use for all lookups
    let friendsListCache = null;
    let friendsListTimestamp = 0;
    const FRIENDS_CACHE_DURATION = 300000; // 5 minutes

    async function getFriendsList() {
        // Check cache first
        if (friendsListCache && (Date.now() - friendsListTimestamp) < FRIENDS_CACHE_DURATION) {
            return friendsListCache;
        }

        const token = getToken();
        if (!token) return null;

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.nitrotype.com/api/v2/friends",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        const fields = data.results.fields;
                        const values = data.results.values;

                        const displayNameIndex = fields.indexOf("displayName");
                        const usernameIndex = fields.indexOf("username");

                        // Create lookup map
                        const friendsMap = {};
                        values.forEach(friendData => {
                            const displayName = friendData[displayNameIndex];
                            const username = friendData[usernameIndex];
                            friendsMap[displayName] = username;
                            friendsMap[username] = username; // Also map username to itself
                        });

                        friendsListCache = friendsMap;
                        friendsListTimestamp = Date.now();
                        resolve(friendsMap);
                    } else if (response.status === 401) {
                        getTokenAndRetry(() => getFriendsList().then(resolve));
                    } else {
                        resolve(null);
                    }
                }
            });
        });
    }

    async function processFriends(rows, context) {
        // Fetch friends list once for all friends
        const friendsMap = await getFriendsList();
        if (!friendsMap) return;

        // Collect all promises to wait for batch completion
        const promises = [];

        // Process all friends using the cached list
        rows.forEach(row => {
            const playerElement = row.querySelector('.player-name--container');
            if (playerElement) {
                let playerName = playerElement.getAttribute('title');
                if (!playerName) {
                    playerName = playerElement.textContent.trim();
                }

                if (playerName && !row.classList.contains('status-processed')) {
                    const username = friendsMap[playerName];
                    if (username) {
                        row.classList.add('status-processed');
                        promises.push(updateStatus(row, username));
                    }
                }
            }
        });

        // Wait for all icon additions to complete
        await Promise.all(promises);
    }

    function getRowsForTab() {
        const rows = document.querySelectorAll('.table-row');
        return Array.from(rows).filter(row => !row.querySelector('th'));
    }

    // =============================
    // 🚀 Initialize Script
    // =============================
    observeMainContent();

})();
