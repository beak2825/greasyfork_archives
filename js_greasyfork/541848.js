// ==UserScript==
// @name         Steam Badge Info & Enhancement Suite
// @namespace    github.com/encumber
// @version      1.0
// @description  Combined suite of Steam badge enhancement tools including inventory badge info, game card badge enhancer, badge info for booster creator, and badge enhancer
// @author       Nitoned
// @match        https://steamcommunity.com/*/inventory*
// @match        https://steamcommunity.com/*/gamecards/*
// @match        https://steamcommunity.com/tradingcards/boostercreator/*
// @match        https://steamcommunity.com//tradingcards/boostercreator/*
// @match        https://steamcommunity.com/*/badges*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        indexedDB
// @connect      api.steamsets.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541848/Steam%20Badge%20Info%20%20Enhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/541848/Steam%20Badge%20Info%20%20Enhancement%20Suite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global Configuration ---
    const STEAMSETS_API_KEY = '';                                            // get api key from https://steamsets.com/settings/developer-apps they are free so use your own
    const STEAMSETS_API_URL = 'https://api.steamsets.com/v1/app.listBadges'; // this is here in case there is ever a change to the API
    const CACHE_DURATION_MS = 365 * 24 * 60 * 60 * 1000;                     // 1y in milliseconds, can manually refresh appids if you want more accurate scarcities or change the 365 to the amount of days you want between it fetching all the data again.
    const ENABLE_CONSOLE_LOGS = false;                                       // in case you want to see the logs
    const DEBUG_MODE = false;                                                // in case you want more in depth logs
    const REQUEST_DELAY_MS = 3000;                                           // 3 second delay between requests to not hit steam's or steamsets api's too hard so you dont get limited, you can change this as you see fit to find the best ratio between requests and ratelimits but I don't have the time to find the perfect number

    // Request Queue System
    const requestQueue = {
        queue: [],
        inProgress: false,
        lastRequestTime: 0,

        add: function(appId, callback) {
            return new Promise((resolve, reject) => {
                this.queue.push({
                    appId,
                    callback,
                    resolve,
                    reject
                });
                this.processQueue();
            });
        },

        processQueue: async function() {
            if (this.inProgress || this.queue.length === 0) return;

            this.inProgress = true;

            while (this.queue.length > 0) {
                const timeSinceLastRequest = Date.now() - this.lastRequestTime;
                if (timeSinceLastRequest < REQUEST_DELAY_MS) {
                    await delay(REQUEST_DELAY_MS - timeSinceLastRequest);
                }

                const request = this.queue.shift();
                try {
                    this.lastRequestTime = Date.now();
                    const result = await request.callback(request.appId);
                    request.resolve(result);
                } catch (error) {
                    request.reject(error);
                }
            }

            this.inProgress = false;
        }
    };

    // User configuration for booster creator
    const USER_STEAM_ID = "client";
    const STEAM_ID_IS_STEAMID64 = false;

    // IndexedDB Configuration
    const DB_NAME = 'SteamBadgeSuite';
    const DB_VERSION = 1;
    const STORES = {
        BADGE_DATA: 'badgeData',    // For all badge data from SteamSets
        FAVORITES: 'favorites'      // For favorite badges
    };

    // --- Shared CSS Styles ---
    const style = document.createElement('style');
    style.textContent = `
        /* Common badge container styles */
        .badge-list-container {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            padding: 20px;
            margin: 20px 0 0 0;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
            width: 95.8%;
            justify-content: flex-start;
            z-index: 1000;
        }

        /* Common badge item styles */
        .steam-badge-item, .badge-list-box {
            flex: 0 0 auto;
            text-align: center;
            width: 140px;
            padding: 10px;
            background: #1a1a1a;
            border-radius: 5px;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            box-sizing: border-box;
            border: 1px solid transparent; /* Add transparent border by default */
        }

        /* Booster page specific width override */
        .booster_creator_right .steam-badge-item,
        .booster_creator_right .badge-list-box,
        .booster_creator_left + .badge-list-container .steam-badge-item,
        .booster_creator_left + .badge-list-container .badge-list-box {
            width: 105.6px !important;
            box-sizing: border-box;
        }

        .steam-badge-item:hover, .badge-list-box:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }

        /* Badge title styles */
        .badge_name, .badge-list-title {
            font-weight: bold;
            margin: 5px 0;
            font-size: 0.9em;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #ccc;
            position: relative;
            z-index: 2;
            padding: 0 5px;
        }

        /* Badge level styles */
        .badge_level, .badge-list-level {
            font-weight: bold;
            color: #67c1f5;
            margin: 5px 0;
            text-shadow: 0 0 2px rgba(103, 193, 245, 0.3);
            position: relative;
            z-index: 2;
        }

        .badge_level.foil, .badge-list-level.foil {
            color: #ffd700;
            text-shadow: 0 0 4px rgba(255, 215, 0, 0.4);
        }

        /* Badge scarcity styles */
        .badge_scarcity, .badge-list-scarcity {
            font-size: 0.8em;
            color: #888;
            margin: 5px 0;
            position: relative;
            z-index: 2;
        }

        /* Badge image styles */
        .badge_image, .badge-list-image {
            width: 64px;
            height: 64px;
            margin: 10px auto;
            display: block;
            position: relative;
            z-index: 2;
        }

        .badge_title_stats {
            z-index: 1000;
        }

        .refresh-button {
            z-index: 1000;
        }

        .badge_title_stats_content {
            display: none !important;
        }

        /* Enhanced foil badge styles */
        .steam-badge-item.foil, .badge-list-box.foil {
            background: linear-gradient(135deg, #1f1f1f 0%, #2a2a2a 50%, #1f1f1f 100%);
            border: 1px solid rgba(255, 215, 0, 0.2);
            box-shadow:
                0 0 15px rgba(255, 215, 0, 0.1),
                inset 0 0 10px rgba(255, 215, 0, 0.05);
            /* No need to adjust padding since we're using border-box */
        }

        .steam-badge-item.foil::before, .badge-list-box.foil::before {
            content: '';
            position: absolute;
            top: -150%;
            left: -50%;
            width: 200%;
            height: 400%;
            background: linear-gradient(
                45deg,
                transparent 0%,
                rgba(255, 215, 0, 0.1) 30%,
                rgba(255, 215, 0, 0.2) 50%,
                rgba(255, 215, 0, 0.1) 70%,
                transparent 100%
            );
            transform: rotate(45deg);
            animation: shine 4s ease-in-out infinite;
            pointer-events: none;
            z-index: 1;
        }

        /* Current badge styles */
        .badge-list-box.current {
            background: linear-gradient(135deg, #2a2f33 0%, #1a1a1a 100%);
            border: 2px solid #ffd700;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
            order: -1; /* Ensure it appears first */
        }

        .current-badge-indicator {
            background: linear-gradient(45deg, #ffd700, #ffec8b);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 3px rgba(255, 215, 0, 0.3);
            padding: 5px;
            text-align: center;
            font-size: 0.9em;
        }

        /* Section separators */
        .badge-section-separator {
            width: 100%;
            text-align: left;
            color: #67c1f5;
            font-size: 14px;
            margin: 10px 0;
            padding: 5px 10px;
            background: rgba(103, 193, 245, 0.1);
            border-radius: 3px;
            font-weight: bold;
        }

        /* Favorite styles */
        .badge-list-box.favorite {
            background: linear-gradient(135deg, rgba(103, 193, 245, 0.05), rgba(0, 0, 0, 0.2));
            border: 1px solid rgba(103, 193, 245, 0.2);
        }

        .badge-list-box.favorite.foil {
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(0, 0, 0, 0.2));
            border: 1px solid rgba(255, 215, 0, 0.2);
        }

        .favorite-remove {
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 10;
        }

        .badge-list-box:hover .favorite-remove {
            opacity: 1;
        }

        /* Loading and error styles */
        .enhancer_loading_overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            z-index: 100;
        }

        .error-message {
            color: #e74c3c;
            text-align: center;
            padding: 10px;
            margin: 10px 0;
            background: rgba(231, 76, 60, 0.1);
            border: 1px solid #e74c3c;
            border-radius: 3px;
        }

        /* Badge type container to ensure consistent spacing */
        .badge-type-container {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            width: 100%;
            align-items: stretch; /* Ensure all items stretch to match the tallest */
        }

        .badge-list-box {
            position: relative;
        }

        .badge-list-box::before {
            content: '';
            position: absolute;
            top: 5px;
            right: 5px;
            color: #67c1f5;
            font-size: 16px;
            opacity: 0.3;
            transition: all 0.2s ease;
            z-index: 3;
        }

        .badge-list-box:hover::before {
            opacity: 0.8;
            transform: scale(1.2);
        }

        .badge-list-box.favorite::before {
            opacity: 1;
            color: #ffd700;
        }

        .badge-list-box.favorite:hover::before {
            transform: scale(1.2) rotate(72deg);
        }

        .badge-list-box.favorite.foil::before {
            text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
        }

        .favorite-remove {
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 10;
            position: absolute;
            top: 5px;
            right: 25px;
            background: none;
            border: none;
            color: #e74c3c;
            cursor: pointer;
            font-size: 16px;
        }

        .badge-list-box:hover .favorite-remove {
            opacity: 1;
        }

        /* Additional styles */
        .badge-list-info {
            font-size: 11px;
            color: #67c1f5;
            margin: 5px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0 5px;
        }

        .badge-list-box.favorite .badge-list-info {
            color: #8f98a0;
        }

        .badge-list-box.favorite.foil .badge-list-info {
            color: #CFE6F5;
        }

        /* New styles for badge type indicator */
        .badge-list-type {
            font-size: 11px;
            color: #67c1f5;
            margin: 2px 0;
            padding: 2px 5px;
            background: rgba(103, 193, 245, 0.1);
            border-radius: 3px;
            text-align: center;
        }

        .badge-list-box.foil .badge-list-type {
            color: #ffd700;
            background: rgba(255, 215, 0, 0.1);
        }

        .badge-list-info {
            font-size: 12px;
            color: #8f98a0;
            margin: 5px 0;
            padding: 0 5px;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .badge-list-box.favorite .badge-list-info {
            color: #67c1f5;
            font-weight: bold;
        }

        .badge-list-box.favorite.foil .badge-list-info {
            color: #ffd700;
        }

        .badge-list-container.favorites {
            margin-top: 10px;
        }

        .badge-list-box.favorite {
            position: relative;
            margin-bottom: 5px;
        }

        .favorite-remove {
            opacity: 0;
            transition: opacity 0.2s ease;
        }

        .badge-list-box:hover .favorite-remove {
            opacity: 1;
        }

        /* Badge progress info styles */
        .badge-progress-info {
            background: rgba(0, 0, 0, 0.2);
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 3px;
            color: #67c1f5;
        }

        .crafted-info {
            margin-bottom: 5px;
        }

        .complete-sets {
            color: #a4d007;
        }

        .badge-refresh-button {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: #67c1f5;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
            z-index: 10;
            transition: transform 0.2s ease;
        }

        .badge-refresh-button:hover {
            transform: rotate(180deg);
        }

        .badge-refresh-button.refreshing {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .badge-refresh-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .favorite-star {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: #67c1f5;
            cursor: pointer;
            font-size: 16px;
            opacity: 0.3;
            transition: all 0.2s ease;
            z-index: 3;
        }

        .badge-list-box:hover .favorite-star {
            opacity: 0.8;
        }

        .badge-list-box.favorite .favorite-star {
            opacity: 1;
            color: #ffd700;
        }

        .favorite-remove {
            position: absolute;
            top: 5px;
            right: 5px;
            background: none;
            border: none;
            color: #e74c3c;
            cursor: pointer;
            font-size: 16px;
            opacity: 0;
            transition: opacity 0.2s ease;
            z-index: 3;
        }

        .badge-list-box:hover .favorite-remove {
            opacity: 1;
        }

        .badge-list-box.foil .favorite-star {
            text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
        }

        .badge-list-box.favorite.foil .favorite-star {
            text-shadow: 0 0 5px rgba(255, 215, 0, 0.8);
        }

        .badge-list-box.crafted {
            border: 2px solid #67c1f5;
            box-shadow: 0 0 10px rgba(103, 193, 245, 0.3);
        }

        .badge-list-box.crafted.foil {
            border: 2px solid #ffd700;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        .crafted-level-indicator {
            position: absolute;
            top: 5px;
            left: 5px;
            background: rgba(103, 193, 245, 0.9);
            color: white;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            z-index: 3;
        }

        .badge-list-box.foil .crafted-level-indicator {
            background: rgba(255, 215, 0, 0.9);
            color: black;
        }

        .crafted-badges-section {
            margin-bottom: 20px;
            padding: 15px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
            display: block !important; /* Always show the section */
        }

        .crafted-badges-title {
            color: #67c1f5;
            font-size: 16px;
            margin-bottom: 10px;
            font-weight: bold;
        }

        .crafted-badges-container {
            display: flex;
            gap: 12px;
        }

        .uncrafted-badge {
            opacity: 0.5;
            position: relative;
        }

        .uncrafted-badge::after {
            content: 'Not Crafted';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: #67c1f5;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            white-space: nowrap;
        }

        .uncrafted-badge.foil::after {
            color: #ffd700;
        }

        /* Add these CSS styles after the existing badge styles */
        .badge-list-box.crafted-level {
            border: 2px solid #67c1f5;
            box-shadow: 0 0 10px rgba(103, 193, 245, 0.3);
        }

        .badge-list-box.crafted-level.foil {
            border: 2px solid #ffd700;
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
        }

        /* Add refresh button styles */
        .badge_title_stats .refresh-button {
            background: none;
            border: none;
            color: #67c1f5;
            cursor: pointer;
            font-size: 16px;
            padding: 5px;
            margin-left: 10px;
            vertical-align: middle;
            position: relative;
            z-index: 9999;
        }

        .badge_title_stats .refresh-button:hover {
            color: #ffffff;
        }

        /* Ensure badge_title_stats is also above other elements */
        .badge_title_stats {
            position: relative;
            z-index: 9998;
        }

        /* Ensure the stats content doesn't overlap the button */
        .badge_title_stats_content {
            display: none !important;
            position: relative;
            z-index: 1;
        }

        /* Make sure the refresh button container is properly positioned */
        .badge_title_stats_label {
            position: relative;
            z-index: 9997;
        }
    `;
    document.head.appendChild(style);

    // --- Logging Helper ---
    function log(...args) {
        if (ENABLE_CONSOLE_LOGS) {
            console.log('[Steam Badge Suite]', ...args);
        }
    }

    function logError(...args) {
        if (ENABLE_CONSOLE_LOGS) {
            console.error('[Steam Badge Suite ERROR]', ...args);
        }
    }

    function logWarn(...args) {
        if (ENABLE_CONSOLE_LOGS) {
            console.warn('[Steam Badge Suite WARNING]', ...args);
        }
    }

    function logDebug(...args) {
        if (ENABLE_CONSOLE_LOGS && DEBUG_MODE) {
            console.debug('[Steam Badge Suite DEBUG]', new Date().toISOString(), ...args);
        }
    }

    // --- Database Setup ---
    let db = null;

    function openDatabase() {
        return new Promise((resolve, reject) => {
            if (db) {
                resolve(db);
                return;
            }

            const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
            if (!indexedDB) {
                const error = new Error('IndexedDB is not supported in this browser');
                logError(error);
                reject(error);
                return;
            }

            try {
                const request = indexedDB.open(DB_NAME, DB_VERSION);

                request.onerror = (event) => {
                    const error = event.target.error;
                    logError('Error opening database:', error);
                    db = null;
                    reject(error);
                };

                request.onblocked = (event) => {
                    const error = new Error('Database blocked. Please close other tabs with this site open');
                    logError(error);
                    db = null;
                    reject(error);
                };

                request.onupgradeneeded = (event) => {
                    logDebug('Database upgrade needed');
                    const database = event.target.result;

                    // Create stores if they don't exist
                    if (!database.objectStoreNames.contains(STORES.BADGE_DATA)) {
                        database.createObjectStore(STORES.BADGE_DATA, { keyPath: 'appId' });
                    }
                    if (!database.objectStoreNames.contains(STORES.FAVORITES)) {
                        database.createObjectStore(STORES.FAVORITES, { keyPath: 'id' });
                    }
                };

                request.onsuccess = (event) => {
                    db = event.target.result;
                    logDebug('Database opened successfully');
                    resolve(db);
                };
            } catch (error) {
                logError('Error in openDatabase:', error);
                db = null;
                reject(error);
            }
        });
    }

    // Generic database operations
    async function getFromStore(storeName, key) {
        try {
            const database = await openDatabase();
            if (!database) {
                throw new Error('Database not available');
            }

            return new Promise((resolve, reject) => {
                try {
                    const transaction = database.transaction(storeName, 'readonly');
                    const store = transaction.objectStore(storeName);
                    const request = store.get(key);

                    request.onsuccess = () => {
                        const data = request.result;
                        if (data && Date.now() - data.timestamp < CACHE_DURATION_MS) {
                            resolve(data);
                        } else {
                            resolve(null);
                        }
                    };

                    request.onerror = () => {
                        reject(request.error);
                    };
                } catch (error) {
                    reject(error);
                }
            });
        } catch (error) {
            logError(`Error getting data from ${storeName}:`, error);
            return null;
        }
    }

    async function setInStore(storeName, data) {
        try {
            const database = await openDatabase();
            if (!database) {
                throw new Error('Database not available');
            }

            return new Promise((resolve, reject) => {
                try {
                    const transaction = database.transaction(storeName, 'readwrite');
                    const store = transaction.objectStore(storeName);
                    const request = store.put({
                        ...data,
                        timestamp: Date.now()
                    });

                    request.onsuccess = () => resolve(true);
                    request.onerror = () => reject(request.error);
                } catch (error) {
                    reject(error);
                }
            });
        } catch (error) {
            logError(`Error setting data in ${storeName}:`, error);
            return false;
        }
    }

    async function clearStaleData() {
        try {
            await openDatabase();
            const now = Date.now();

            for (const storeName of Object.values(STORES)) {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.openCursor();

                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const data = cursor.value;
                        if (now - data.timestamp > CACHE_DURATION_MS) {
                            cursor.delete();
                        }
                        cursor.continue();
                    }
                };
            }
        } catch (error) {
            logError('Error clearing stale data:', error);
        }
    }

    // --- API Functions ---
    async function fetchBadgeData(appId) {
        try {
            // Check cache first
            const cachedData = await getFromStore(STORES.BADGE_DATA, parseInt(appId));
            if (cachedData) {
                return cachedData.data;
            }

            // Add to request queue if not cached
            return await requestQueue.add(appId, async (appId) => {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: STEAMSETS_API_URL,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${STEAMSETS_API_KEY}`
                        },
                        data: JSON.stringify({ appId: parseInt(appId) }),
                        onload: (response) => {
                            try {
                                const data = JSON.parse(response.responseText);
                                console.log('[Steam Badge Suite] Raw SteamSets API Response:', {
                                    url: STEAMSETS_API_URL,
                                    appId: appId,
                                    fullResponse: data,
                                    badges: data.badges || data.response?.badges,
                                    appName: data.appName || data.game_name || data.badges?.[0]?.appName || data.response?.badges?.[0]?.game_name
                                });
                                resolve(data);
                            } catch (error) {
                                reject(new Error('Failed to parse API response: ' + error.message));
                            }
                        },
                        onerror: (error) => reject(new Error('API request failed: ' + error.message))
                    });
                });

                // Process the response data
                if (response && response.badges) {
                    const appName = response.appName || response.game_name || response.badges[0]?.appName || response.badges[0]?.game_name;
                    const processedBadges = response.badges.map(badge => {
                        const processed = {
                            ...badge,
                            appId: parseInt(appId),
                            name: badge.name || badge.title || 'Unknown Badge',
                            communityitemid: badge.communityitemid || badge.border_color || '',
                            appName: appName || 'Unknown Game',
                            badgeImage: badge.image_hash || badge.badgeImage || badge.image || ''
                        };
                        console.log('[Steam Badge Suite] Processed badge data:', processed);
                        return processed;
                    });

                    // Cache the processed data
                    await setInStore(STORES.BADGE_DATA, {
                        appId: parseInt(appId),
                        data: processedBadges,
                        appName: appName || 'Unknown Game',
                        timestamp: Date.now()
                    });

                    return processedBadges;
                } else if (response && response.response && response.response.badges) {
                    // Alternative response structure
                    const appName = response.response.appName || response.response.game_name || response.response.badges[0]?.appName || response.response.badges[0]?.game_name;
                    const processedBadges = response.response.badges.map(badge => {
                        const processed = {
                            ...badge,
                            appId: parseInt(appId),
                            name: badge.name || badge.title || 'Unknown Badge',
                            communityitemid: badge.communityitemid || badge.border_color || '',
                            appName: appName || 'Unknown Game',
                            badgeImage: badge.image_hash || badge.badgeImage || badge.image || ''
                        };
                        console.log('[Steam Badge Suite] Processed badge data (alternative format):', processed);
                        return processed;
                    });

                    // Cache the processed data
                    await setInStore(STORES.BADGE_DATA, {
                        appId: parseInt(appId),
                        data: processedBadges,
                        appName: appName || 'Unknown Game',
                        timestamp: Date.now()
                    });

                    return processedBadges;
                }

                throw new Error('Invalid API response format: ' + JSON.stringify(response));
            });
        } catch (error) {
            logError('Error fetching badge data:', error);
            return null;
        }
    }

    // --- Utility Functions ---
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getAppIdFromUrl() {
        const path = window.location.pathname;
        const matches = path.match(/\/gamecards\/(\d+)/);
        return matches ? parseInt(matches[1]) : null;
    }

    function getAppIdFromElement(element) {
        // Try to get app ID from various sources
        const appIdSources = [
            // From game card link
            () => {
                const link = element.querySelector('a[href*="/gamecards/"]');
                if (link) {
                    const matches = link.href.match(/\/gamecards\/(\d+)/);
                    return matches ? parseInt(matches[1]) : null;
                }
                return null;
            },
            // From badge link
            () => {
                const link = element.querySelector('a[href*="/badges/"]');
                if (link) {
                    const matches = link.href.match(/\/badges\/(\d+)/);
                    return matches ? parseInt(matches[1]) : null;
                }
                return null;
            },
            // From data attribute
            () => {
                const appId = element.dataset.appid || element.parentElement?.dataset.appid;
                return appId ? parseInt(appId) : null;
            },
            // From economy item class
            () => {
                const item = element.querySelector('.economy_item_hoverable');
                if (item) {
                    const matches = item.className.match(/app_(\d+)/);
                    return matches ? parseInt(matches[1]) : null;
                }
                return null;
            }
        ];

        // Try each method until we find an app ID
        for (const getAppId of appIdSources) {
            const appId = getAppId();
            if (appId) {
                return appId;
            }
        }

        return null;
    }

    // Helper function to format date for display
    function formatDateForDisplay(dateString) {
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Date unavailable';
            }

            const options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            };

            return date.toLocaleString(undefined, options);
        } catch (e) {
            logError('Error formatting date:', e);
            return 'Date unavailable';
        }
    }

    function createBadgeElement(badge, isFoil = false) {
        const container = document.createElement('div');
        container.className = `steam-badge-item${isFoil ? ' foil' : ''}`;

        // Level display (at the top)
        const level = document.createElement('div');
        level.className = `badge_level${isFoil ? ' foil' : ''}`;
        level.textContent = isFoil ? 'Foil' : `Level ${badge.baseLevel}`;
        container.appendChild(level);

        // Badge name
        const name = document.createElement('div');
        name.className = 'badge_name';
        name.textContent = badge.name || badge.title || 'Unknown Badge';
        name.title = badge.name || badge.title || 'Unknown Badge';
        container.appendChild(name);

        // Badge image
        const img = document.createElement('img');
        img.className = 'badge_image';
        img.src = `https://cdn.fastly.steamstatic.com/steamcommunity/public/images/items/${badge.appid}/${badge.badgeImage || badge.image_hash}`;
        img.alt = badge.name || 'Badge Image';
        container.appendChild(img);

        // Scarcity
        const scarcity = document.createElement('div');
        scarcity.className = 'badge_scarcity';
        scarcity.textContent = `Scarcity: ${badge.scarcity}`;
        container.appendChild(scarcity);

        // Completion date if available
        if (badge.firstCompletion) {
            const completionDate = document.createElement('div');
            completionDate.className = 'badge_completion_date';
            completionDate.textContent = formatDateForDisplay(badge.firstCompletion);
            container.appendChild(completionDate);
        }

        return container;
    }

    function createLoadingOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'enhancer_loading_overlay';
        overlay.textContent = 'Loading...';
        return overlay;
    }

    function showError(message, container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        container.appendChild(errorDiv);
    }

    // --- Page-specific handlers ---
    function handleInventoryPage() {
        // Wait for inventory items to load
        const observer = new MutationObserver(async (mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const items = node.querySelectorAll('.inventory_item_link');
                        for (const item of items) {
                            if (!item.dataset.processed) {
                                item.dataset.processed = 'true';
                                const appId = getAppIdFromElement(item);
                                if (appId) {
                                    const container = document.createElement('div');
                                    container.className = 'badge-list-container';
                                    container.style.position = 'relative';
                                    item.appendChild(container);

                                    addRefreshButton(container, appId);

                                    const overlay = createLoadingOverlay();
                                    container.appendChild(overlay);

                                    try {
                                        const badges = await fetchBadgeData(appId);
                                        container.innerHTML = '';
                                        if (badges && badges.length > 0) {
                                            const sortedBadges = sortBadges(badges);
                                            for (const badge of sortedBadges) {
                                                const badgeElement = await createBadgeListItem(badge);
                                                container.appendChild(badgeElement);
                                            }
                                        } else {
                                            showError('No badges found', container);
                                        }
                                    } catch (error) {
                                        logError('Error fetching badge data:', error);
                                        showError('Error loading badges', container);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Start observing inventory content
        const inventoryContent = document.getElementById('inventories');
        if (inventoryContent) {
            observer.observe(inventoryContent, { childList: true, subtree: true });
        }
    }

    async function handleGamecardsPage() {
        const appId = getAppIdFromUrl();
        if (!appId) {
            logWarn('No App ID found in current URL');
            return;
        }

        const targetElement = document.querySelector('.badge_detail_tasks');
        if (!targetElement) {
            logWarn('Target element not found for badge container');
            return;
        }

        const container = document.createElement('div');
        container.className = 'badge-list-container';
        container.style.position = 'relative';
        container.style.marginBottom = '20px';
        targetElement.parentNode.insertBefore(container, targetElement);

        // Add refresh button to badge_title_stats
        const statsContainer = document.querySelector('.badge_title_stats');
        if (statsContainer) {
            addRefreshButtonToStats(statsContainer, appId, container);
        }

        try {
            // First try to get cached data
            const cachedData = await getFromStore(STORES.BADGE_DATA, appId);
            if (cachedData) {
                displayBadges(container, cachedData.data);
            } else {
                // Initial data fetch if no cached data
                await refreshBadgeData(appId, container);
            }
        } catch (error) {
            logError('Error in handleGamecardsPage:', error);
            showError('Error loading badges', container);
        }
    }

    function handleBoosterCreatorPage() {
        // Add favorites container and controls
        const targetElement = document.querySelector('.booster_creator_left');
        if (!targetElement) {
            logWarn('Target element not found for booster creator');
            return;
        }

        // Create badge list container for current game if it doesn't exist
        let badgeListContainer = document.querySelector('.badge-list-container');
        if (!badgeListContainer) {
            badgeListContainer = document.createElement('div');
            badgeListContainer.className = 'badge-list-container';
            targetElement.insertAdjacentElement('afterend', badgeListContainer);
        }

        // Create favorites container if it doesn't exist
        let favoritesContainer = document.querySelector('.favorites-container');
        if (!favoritesContainer) {
            favoritesContainer = document.createElement('div');
            favoritesContainer.className = 'favorites-container';
            badgeListContainer.insertAdjacentElement('afterend', favoritesContainer);

            // Create controls
            const controls = document.createElement('div');
            controls.className = 'favorites-controls';

            // Sort select
            const sortSelect = document.createElement('select');
            sortSelect.innerHTML = `
                <option value="default">Default (Normal then Foil)</option>
                <option value="appid_asc">App ID ↑</option>
                <option value="appid_desc">App ID ↓</option>
                <option value="foil_first">Foil First</option>
                <option value="foil_last">Foil Last</option>
            `;
            sortSelect.value = GM_getValue('favoritesSortOrder', 'default');
            sortSelect.addEventListener('change', () => {
                GM_setValue('favoritesSortOrder', sortSelect.value);
                displayFavorites();
            });
            controls.appendChild(sortSelect);

            // Import/Export buttons
            const importBtn = document.createElement('button');
            importBtn.textContent = 'Import Favorites';
            importBtn.addEventListener('click', importFavorites);
            controls.appendChild(importBtn);

            const exportBtn = document.createElement('button');
            exportBtn.textContent = 'Export Favorites';
            exportBtn.addEventListener('click', exportFavorites);
            controls.appendChild(exportBtn);

            favoritesContainer.appendChild(controls);

            // Create favorites badge list container
            const favoritesBadgeListContainer = document.createElement('div');
            favoritesBadgeListContainer.className = 'badge-list-container favorites';
            favoritesContainer.appendChild(favoritesBadgeListContainer);
        }

        // Watch for game selection changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                    const appId = getSelectedAppId();
                    if (appId) {
                        updateBadgeInfo();
                    }
                }
            });
        });

        const gameSelect = document.querySelector('#booster_game_selector');
        if (gameSelect) {
            observer.observe(gameSelect, { attributes: true });
            // Initial load
            const appId = getSelectedAppId();
            if (appId) {
                updateBadgeInfo();
            }
        }

        // Display initial favorites
        displayFavorites();

        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const appId = window.location.hash.slice(1);
            if (appId) {
                const gameSelector = document.querySelector('#booster_game_selector');
                if (gameSelector) {
                    gameSelector.value = appId;
                    gameSelector.dispatchEvent(new Event('change'));
                }
            }
        });

        // Check for initial hash
        if (window.location.hash) {
            const appId = window.location.hash.slice(1);
            const gameSelector = document.querySelector('#booster_game_selector');
            if (gameSelector) {
                gameSelector.value = appId;
                gameSelector.dispatchEvent(new Event('change'));
            }
        }
    }

    // Booster creator helper functions
    function getSelectedAppId() {
        const gameSelect = document.querySelector('#booster_game_selector');
        return gameSelect ? parseInt(gameSelect.value) : null;
    }

    function parseBadgeData() {
        const badgeProgress = document.querySelector('.badge_progress_info');
        if (!badgeProgress) return null;

        const progressText = badgeProgress.textContent;
        const data = {
            craftedNormal: false,
            craftedFoil: false,
            normalLevel: 0,
            completeSets: 0
        };

        // Check for crafted badges
        if (progressText.includes('Level')) {
            data.craftedNormal = true;
            const levelMatch = progressText.match(/Level (\d+)/);
            if (levelMatch) {
                data.normalLevel = parseInt(levelMatch[1]);
            }
        }
        if (progressText.includes('Foil Badge')) {
            data.craftedFoil = true;
        }

        // Count complete sets
        const readyToCraft = document.querySelectorAll('.badge_craft_button:not(.disabled)');
        data.completeSets = readyToCraft.length;

        return data;
    }

    async function displayFavorites() {
        const container = document.querySelector('.favorites-container .badge-list-container');
        if (!container) return;

        container.innerHTML = '';
        const overlay = createLoadingOverlay();
        container.appendChild(overlay);

        try {
            const favorites = await getAllFromStore(STORES.FAVORITES);
            container.innerHTML = '';

            if (favorites && favorites.length > 0) {
                const favoritesHeader = document.createElement('div');
                favoritesHeader.className = 'badge-section-separator';
                favoritesHeader.textContent = 'Favorites';
                container.appendChild(favoritesHeader);

                const sortOrder = GM_getValue('favoritesSortOrder', 'appid_asc');
                const sortedFavorites = handleFavoritesSortOrder(sortOrder, favorites);

                for (const favorite of sortedFavorites) {
                    const badgeElement = await createBadgeListItem({
                        ...favorite,
                        isFavorite: true
                    });
                    container.appendChild(badgeElement);
                }
            } else {
                showError('No favorites added yet', container);
            }
        } catch (error) {
            logError('Error loading favorites:', error);
            showError('Error loading favorites', container);
        }
    }

    async function updateBadgeInfo() {
        const appId = getSelectedAppId();
        if (!appId) {
            console.warn('[Steam Badge Suite] Could not get App ID from URL');
            displayFavorites();
            return;
        }

        try {
            console.log(`[Steam Badge Suite] Starting badge info update for App ID ${appId}`);

            // Fetch both Steam badge info and SteamSets data
            const [steamBadgeInfo, badges] = await Promise.all([
                fetchSteamBadgeInfo(appId),
                fetchBadgeData(appId)
            ]);

            console.log('[Steam Badge Suite] Received Steam badge info:', steamBadgeInfo);
            console.log('[Steam Badge Suite] Received SteamSets badges:', badges);

            let badgeListContainer = document.querySelector('.badge-list-container:not(.favorites)');
            if (!badgeListContainer) {
                badgeListContainer = document.createElement('div');
                badgeListContainer.className = 'badge-list-container';
                const target = document.querySelector('.booster_creator_left');
                if (target) {
                    target.insertAdjacentElement('afterend', badgeListContainer);
                }
            }

            badgeListContainer.innerHTML = '';

            // Always create and display crafted badges section
            const craftedSection = document.createElement('div');
            craftedSection.className = 'crafted-badges-section';

            const craftedTitle = document.createElement('div');
            craftedTitle.className = 'crafted-badges-title';
            craftedTitle.textContent = 'Your Crafted Badges';
            craftedSection.appendChild(craftedTitle);

            const craftedContainer = document.createElement('div');
            craftedContainer.className = 'crafted-badges-container';

            if (badges && badges.length > 0) {
                const normalBadges = badges.filter(b => !b.foil);
                const foilBadges = badges.filter(b => b.foil);

                // --- Normal Badge ---
                const hasCraftedNormal = steamBadgeInfo?.normal?.level > 0;
                if (hasCraftedNormal) {
                    const craftedLevel = steamBadgeInfo.normal.level;
                    const badgeTemplate = normalBadges.find(b => parseInt(b.baseLevel) === craftedLevel) || normalBadges[0];
                    const normalBadge = {
                        ...(badgeTemplate || {}),
                        appId: appId,
                        isCrafted: true,
                        craftedLevel: craftedLevel,
                        name: steamBadgeInfo.normal.name,
                        badgeImage: steamBadgeInfo.normal.iconurl ? steamBadgeInfo.normal.iconurl.split('/').pop() : (badgeTemplate?.badgeImage || ''),
                        isFoil: false
                    };
                    const normalElement = await createBadgeListItem(normalBadge);
                    craftedContainer.appendChild(normalElement);
                } else {
                    // Show placeholder (highest level uncrafted)
                    const maxNormalLevel = Math.max(0, ...normalBadges.map(b => parseInt(b.baseLevel) || 0));
                    const placeholderTemplate = normalBadges.find(b => parseInt(b.baseLevel) === maxNormalLevel);
                    if (placeholderTemplate) {
                        const normalBadge = {
                            ...placeholderTemplate,
                            appId: appId,
                            isCrafted: false,
                            craftedLevel: 0,
                            isFoil: false
                        };
                        const normalElement = await createBadgeListItem(normalBadge);
                        normalElement.classList.add('uncrafted-badge');
                        craftedContainer.appendChild(normalElement);
                    }
                }

                // --- Foil Badge ---
                const hasCraftedFoil = steamBadgeInfo?.foil?.level > 0;
                const foilBadgeTemplate = foilBadges[0]; // Usually only one foil badge
                if (hasCraftedFoil) {
                    const foilBadge = {
                        ...(foilBadgeTemplate || {}),
                        appId: appId,
                        isCrafted: true,
                        craftedLevel: 1,
                        name: steamBadgeInfo.foil.name,
                        badgeImage: steamBadgeInfo.foil.iconurl ? steamBadgeInfo.foil.iconurl.split('/').pop() : (foilBadgeTemplate?.badgeImage || ''),
                        isFoil: true
                    };
                    const foilElement = await createBadgeListItem(foilBadge);
                    craftedContainer.appendChild(foilElement);
                } else {
                    // Show placeholder
                    if (foilBadgeTemplate) {
                        const foilBadge = {
                            ...foilBadgeTemplate,
                            appId: appId,
                            isCrafted: false,
                            craftedLevel: 0,
                            isFoil: true
                        };
                        const foilElement = await createBadgeListItem(foilBadge);
                        foilElement.classList.add('uncrafted-badge', 'foil');
                        craftedContainer.appendChild(foilElement);
                    }
                }
            }

            craftedSection.appendChild(craftedContainer);
            badgeListContainer.appendChild(craftedSection);

            // Continue with existing badge display logic...
            if (badges && badges.length > 0) {
                const sortedBadges = sortBadges(badges);

                // Add refresh button
                addRefreshButton(badgeListContainer, appId);

                // Display current badge if it exists
                if (sortedBadges[0]?.isCurrent) {
                    const currentHeader = document.createElement('div');
                    currentHeader.className = 'badge-section-separator';
                    currentHeader.textContent = 'Current Badge';
                    badgeListContainer.appendChild(currentHeader);

                    const currentElement = await createBadgeListItem({
                        ...sortedBadges[0],
                        appId: appId,
                        isCurrent: true,
                        isCrafted: steamBadgeInfo?.normal?.level === parseInt(sortedBadges[0].baseLevel)
                    });
                    badgeListContainer.appendChild(currentElement);
                }

                // Display normal badges
                const normalBadges = sortedBadges.filter(b => !b.foil && !b.isCurrent);
                if (normalBadges.length > 0) {
                    const normalHeader = document.createElement('div');
                    normalHeader.className = 'badge-section-separator';
                    normalHeader.textContent = 'Normal Badges';
                    badgeListContainer.appendChild(normalHeader);

                    const normalBadgesContainer = document.createElement('div');
                    normalBadgesContainer.className = 'badge-type-container normal';
                    badgeListContainer.appendChild(normalBadgesContainer);

                    for (const badge of normalBadges) {
                        const badgeElement = await createBadgeListItem({
                            ...badge,
                            appId: appId,
                            isCrafted: steamBadgeInfo?.normal?.level === parseInt(badge.baseLevel)
                        });
                        normalBadgesContainer.appendChild(badgeElement);
                    }
                }

                // Display foil badges
                const foilBadges = sortedBadges.filter(b => b.foil);
                if (foilBadges.length > 0) {
                    const foilHeader = document.createElement('div');
                    foilHeader.className = 'badge-section-separator';
                    foilHeader.textContent = 'Foil Badges';
                    badgeListContainer.appendChild(foilHeader);

                    const foilBadgesContainer = document.createElement('div');
                    foilBadgesContainer.className = 'badge-type-container foil';
                    badgeListContainer.appendChild(foilBadgesContainer);

                    for (const badge of foilBadges) {
                        const badgeElement = await createBadgeListItem({
                            ...badge,
                            appId: appId,
                            isCrafted: steamBadgeInfo?.foil?.level === 1 && parseInt(badge.baseLevel) === 5
                        });
                        foilBadgesContainer.appendChild(badgeElement);
                    }
                }
            } else {
                showError('No badges found for this game', badgeListContainer);
            }
        } catch (error) {
            logError('Error fetching badge data:', error);
            const badgeListContainer = document.querySelector('.badge-list-container:not(.favorites)');
            if (badgeListContainer) {
                showError('Error loading badges', badgeListContainer);
            }
        }

        displayFavorites();
    }

    async function getAllFromStore(storeName) {
        try {
            await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readonly');
                const store = transaction.objectStore(storeName);
                const request = store.getAll();

                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            logError(`Error getting all data from ${storeName}:`, error);
            return [];
        }
    }

    async function deleteFromStore(storeName, key) {
        try {
            await openDatabase();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(storeName, 'readwrite');
                const store = transaction.objectStore(storeName);
                const request = store.delete(key);

                request.onsuccess = () => resolve(true);
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            logError(`Error deleting data from ${storeName}:`, error);
            return false;
        }
    }

    function exportFavorites() {
        getAllFromStore(STORES.FAVORITES).then(favorites => {
            const data = JSON.stringify(favorites, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'steam_badge_favorites.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    function importFavorites() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const favorites = JSON.parse(e.target.result);
                    if (Array.isArray(favorites)) {
                        for (const favorite of favorites) {
                            await setInStore(STORES.FAVORITES, favorite);
                        }
                        displayFavorites();
                    }
                } catch (error) {
                    logError('Error importing favorites:', error);
                    showError('Error importing favorites', document.querySelector('.favorites-container'));
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    async function handleBadgesPage() {
        const badgeRows = document.querySelectorAll('.badge_row');
        for (const row of badgeRows) {
            const appId = getAppIdFromElement(row);
            if (!appId) {
                logWarn('No App ID found in badge row');
                continue;
            }

            const container = document.createElement('div');
            container.className = 'badge-list-container';
            container.style.position = 'relative';

            const detailsContainer = row.querySelector('.badge_row_inner');
            if (!detailsContainer) {
                logWarn('Badge details container not found');
                continue;
            }
            detailsContainer.appendChild(container);

            // Add refresh button to badge_title_stats
            const statsContainer = row.querySelector('.badge_title_stats');
            if (statsContainer) {
                addRefreshButtonToStats(statsContainer, appId, container);
            }

            try {
                // First try to get cached data
                const cachedData = await getFromStore(STORES.BADGE_DATA, appId);
                if (cachedData) {
                    displayBadges(container, cachedData.data);
                } else {
                    // Initial data fetch if no cached data
                    await refreshBadgeData(appId, container);
                }
            } catch (error) {
                logError('Error in handleBadgesPage for appId ' + appId + ':', error);
                showError('Error loading badges', container);
            }
        }
    }

    // --- Main initialization ---
    function updateBadgeDisplay() {
        const path = window.location.pathname;
        if (path.includes('/inventory')) {
            handleInventoryPage();
        } else if (path.includes('/gamecards/')) {
            handleGamecardsPage();
        } else if (path.includes('/tradingcards/boostercreator')) {
            handleBoosterCreatorPage();
        } else if (path.includes('/badges')) {
            handleBadgesPage();
        }
    }

    // Initialize when the page loads
    window.addEventListener('load', () => {
        clearStaleData(); // Clean up old data
        updateBadgeDisplay();
    });

    // Watch for URL changes (Steam uses HTML5 history)
    let lastUrl = window.location.href;
    new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            updateBadgeDisplay();
        }
    }).observe(document.body, { childList: true, subtree: true });

    function displayBadges(container, badges) {
        container.innerHTML = '';
        if (badges && badges.length > 0) {
            const sortedBadges = sortBadges(badges);
            for (const badge of sortedBadges) {
                const badgeElement = createBadgeListItem(badge);
                container.appendChild(badgeElement);
            }
        } else {
            showError('No badges found for this game', container);
        }
    }

    function createBadgeListItem(badgeData) {
        logDebug('Creating badge list item with data:', badgeData);
        const badgeListBox = document.createElement('div');
        const classes = ['badge-list-box'];
        const isFoil = badgeData.isFoil || badgeData.foil;
        if (isFoil) classes.push('foil');
        if (badgeData.isCurrent) classes.push('current');
        if (badgeData.isCrafted) {
            classes.push('crafted');
            classes.push('crafted-level');
        }
        if (badgeData.isFavorite) classes.push('favorite');
        badgeListBox.className = classes.join(' ');

        // Store data attributes
        badgeListBox.dataset.appid = badgeData.appId;
        badgeListBox.dataset.badgeImage = badgeData.badgeImage || '';
        badgeListBox.dataset.isFoil = isFoil ? 'true' : 'false';
        badgeListBox.dataset.name = badgeData.name || 'Unknown Badge';

        // Add current badge indicator if applicable
        if (badgeData.isCurrent) {
            const currentIndicator = document.createElement('div');
            currentIndicator.className = 'current-badge-indicator';
            currentIndicator.textContent = '★ Current Badge ★';
            badgeListBox.appendChild(currentIndicator);
        }

        // Add crafted level indicator if this is the crafted level
        if (badgeData.isCrafted) {
            const craftedIndicator = document.createElement('div');
            craftedIndicator.className = 'crafted-level-indicator';

            // Extract level from name
            let level = badgeData.craftedLevel;
            if (isFoil && badgeData.name && badgeData.name.includes('Foil')) {
                const levelMatch = badgeData.name.match(/Foil (\d+)\+/);
                if (levelMatch) {
                    level = parseInt(levelMatch[1]);
                }
            } else if (!isFoil && badgeData.name) {
                const levelMatch = badgeData.name.match(/Level (\d+)[\+]?/);
                if (levelMatch) {
                    level = parseInt(levelMatch[1]);
                }
            }

            craftedIndicator.textContent = `Level ${level}`;
            badgeListBox.insertBefore(craftedIndicator, badgeListBox.firstChild);
        }

        const title = document.createElement('div');
        title.className = 'badge-list-title';
        title.textContent = badgeData.name || 'Unknown Badge';
        title.title = badgeData.name || 'Unknown Badge';
        badgeListBox.appendChild(title);

        // Create link wrapper for favorites
        const link = document.createElement('a');
        link.className = 'badge-list-link';
        link.style.cursor = 'pointer';

        // Add badge image
        if (badgeData.badgeImage) {
            let imageUrl = badgeData.badgeImage;
            // Check if the image URL is already a full URL
            if (!imageUrl.startsWith('http')) {
                imageUrl = `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/items/${badgeData.appId}/${imageUrl}`;
            }
            const image = document.createElement('img');
            image.className = 'badge-list-image';
            image.src = imageUrl;
            image.alt = badgeData.name || 'Badge Image';
            image.onerror = () => {
                logError(`Failed to load image: ${imageUrl}`);
                link.innerHTML = '';
                const emptyCircle = document.createElement('div');
                emptyCircle.className = 'badge_list_empty_circle';
                link.appendChild(emptyCircle);
            };
            link.appendChild(image);
        } else {
            logDebug('No badge image data:', { appId: badgeData.appId, badgeImage: badgeData.badgeImage });
            const emptyCircle = document.createElement('div');
            emptyCircle.className = 'badge_list_empty_circle';
            link.appendChild(emptyCircle);
        }

        badgeListBox.appendChild(link);

        // Display app name for favorites, scarcity for regular badges
        const infoText = document.createElement('div');
        infoText.className = 'badge-list-info';
        if (badgeData.isFavorite) {
            infoText.textContent = badgeData.appName || 'Unknown Game';
            infoText.title = badgeData.appName || 'Unknown Game';
            // Add badge type indicator for favorites
            const badgeType = document.createElement('div');
            badgeType.className = 'badge-list-type';
            badgeType.textContent = isFoil ? 'Foil Badge' : 'Regular Badge';
            badgeListBox.appendChild(badgeType);
        } else {
            infoText.textContent = `Scarcity: ${badgeData.scarcity !== undefined ? Math.round(badgeData.scarcity) : 'N/A'}`;
        }
        badgeListBox.appendChild(infoText);

        // Add favorite star or remove button based on context
        if (badgeData.isFavorite) {
            const removeBtn = document.createElement('button');
            removeBtn.className = 'favorite-remove';
            removeBtn.textContent = '✕';
            removeBtn.title = 'Remove from favorites';
            removeBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await deleteFromStore(STORES.FAVORITES, `${badgeData.appId}_${isFoil ? 'foil' : 'regular'}`);
                displayFavorites();
            });
            badgeListBox.appendChild(removeBtn);
        } else {
            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'favorite-star';
            favoriteBtn.textContent = '★';
            favoriteBtn.title = 'Add to favorites';

            // Check if this badge is in favorites and color the star accordingly
            const favoriteId = `${badgeData.appId}_${isFoil ? 'foil' : 'regular'}`;
            getFromStore(STORES.FAVORITES, favoriteId).then(favorite => {
                if (favorite) {
                    favoriteBtn.style.color = '#ffd700';
                }
            });

            favoriteBtn.addEventListener('click', () => {
                toggleFavorite(badgeData);
            });
            badgeListBox.appendChild(favoriteBtn);
        }

        return badgeListBox;
    }

    async function toggleFavorite(badgeData) {
        logDebug('Attempting to toggle favorite:', badgeData);
        const favoriteId = `${badgeData.appId}_${badgeData.isFoil ? 'foil' : 'regular'}`;
        logDebug(`Generated favorite ID: ${favoriteId}`);

        try {
            const database = await openDatabase();
            const transaction = database.transaction([STORES.FAVORITES, STORES.BADGE_DATA], 'readwrite');
            const store = transaction.objectStore(STORES.FAVORITES);
            const badgeStore = transaction.objectStore(STORES.BADGE_DATA);

            const getRequest = store.get(favoriteId);

            getRequest.onsuccess = async (event) => {
                const existingFavorite = event.target.result;
                const badgeDataRequest = badgeStore.get(parseInt(badgeData.appId));

                badgeDataRequest.onsuccess = async () => {
                    const fullBadgeData = badgeDataRequest.result;
                    logDebug('Full badge data for favorite:', fullBadgeData);

                    if (existingFavorite) {
                        // Remove from favorites
                        const deleteRequest = store.delete(favoriteId);
                        deleteRequest.onsuccess = () => {
                            log(`Removed favorite: App ID ${badgeData.appId}, Foil: ${badgeData.isFoil}`);
                            displayFavorites();
                        };
                    } else {
                        // Find the matching badge from the full data
                        const matchingBadge = fullBadgeData?.data?.find(b =>
                            b.isFoil === badgeData.isFoil &&
                            b.name === badgeData.name
                        );

                        logDebug('Matching badge for favorite:', matchingBadge);

                        // Add to favorites
                        const newFavorite = {
                            id: favoriteId,
                            appId: parseInt(badgeData.appId),
                            name: badgeData.name || matchingBadge?.name || 'Unknown Badge',
                            badgeImage: matchingBadge?.badgeImage || badgeData.badgeImage,
                            isFoil: badgeData.isFoil,
                            appName: fullBadgeData?.appName || matchingBadge?.appName || 'Unknown Game'
                        };

                        logDebug('New favorite data:', newFavorite);
                        const putRequest = store.put(newFavorite);
                        putRequest.onsuccess = () => {
                            log(`Added favorite: App ID ${badgeData.appId}, Foil: ${badgeData.isFoil}`);
                            displayFavorites();
                        };
                    }
                };
            };
        } catch (error) {
            logError('Error toggling favorite:', error);
            displayFavorites();
        }
    }

    function clearBadgeContainers(removeFavorites = false) {
        // Only remove the main badge container if it exists
        const existingMainContainer = document.querySelector('.badge-container');
        if (existingMainContainer) {
            existingMainContainer.remove();
        }

        // Only remove favorites container if explicitly requested
        if (removeFavorites) {
            const existingFavoritesContainer = document.querySelector('.favorites-container');
            if (existingFavoritesContainer) {
                existingFavoritesContainer.remove();
            }
        }

        // Remove any error messages
        const existingError = document.querySelector('div[style*="color: red"], div[style*="color: orange"]');
        if(existingError) {
            existingError.remove();
        }
    }

    // Helper function to get crafted badge levels from the page
    function getCraftedBadgeLevels() {
        const levels = {
            normal: 0,
            foil: 0
        };

        // Get the badge progress element
        const badgeProgress = document.querySelector('.badge_progress_info');
        if (badgeProgress) {
            const text = badgeProgress.textContent;

            // Check for normal badge level
            const normalMatch = text.match(/Level (\d+) /);
            if (normalMatch) {
                levels.normal = parseInt(normalMatch[1]);
            }

            // Check for foil badge
            if (text.includes('Foil Badge')) {
                levels.foil = 1; // Foil badges are always level 1
            }
        }

        return levels;
    }

    // Unified badge sorting function to use everywhere
    function sortBadges(badges) {
        // First separate current badge if it exists
        const currentBadge = badges.find(b => b.isCurrent);
        const nonCurrentBadges = badges.filter(b => !b.isCurrent);

        // Separate normal and foil badges
        const normalBadges = nonCurrentBadges.filter(b => !(b.isFoil || b.foil));
        const foilBadges = nonCurrentBadges.filter(b => b.isFoil || b.foil);

        // Sort normal badges by level (1 to 5)
        const sortedNormalBadges = normalBadges.sort((a, b) => {
            // Sort by base level (lowest to highest)
            const levelA = parseInt(a.baseLevel) || 0;
            const levelB = parseInt(b.baseLevel) || 0;
            if (levelA !== levelB) return levelA - levelB;

            // If levels are equal, crafted badges come first
            if (a.isCrafted && !b.isCrafted) return -1;
            if (!a.isCrafted && b.isCrafted) return 1;

            return 0;
        });

        // Sort foil badges by level and crafted status
        const sortedFoilBadges = foilBadges.sort((a, b) => {
            // Sort by base level (lowest to highest)
            const levelA = parseInt(a.baseLevel) || 0;
            const levelB = parseInt(b.baseLevel) || 0;
            if (levelA !== levelB) return levelA - levelB;

            // If levels are equal, crafted badges come first
            if (a.isCrafted && !b.isCrafted) return -1;
            if (!a.isCrafted && b.isCrafted) return 1;

            return 0;
        });

        // Return in order: current (if exists), normal (lowest to highest), then foil
        return currentBadge ? [currentBadge, ...sortedNormalBadges, ...sortedFoilBadges] : [...sortedNormalBadges, ...sortedFoilBadges];
    }

    // Cache update function
    async function updateBadgeCache(appId) {
        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: STEAMSETS_API_URL,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${STEAMSETS_API_KEY}`
                    },
                    data: JSON.stringify({ appId: parseInt(appId) }),
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve(data);
                        } catch (error) {
                            reject(new Error('Failed to parse API response: ' + error.message));
                        }
                    },
                    onerror: (error) => reject(new Error('API request failed: ' + error.message))
                });
            });

            if (response && response.badges) {
                const appName = response.appName || response.game_name || response.badges[0]?.appName || response.badges[0]?.game_name;
                const processedBadges = response.badges.map(badge => ({
                    ...badge,
                    appId: parseInt(appId),
                    name: badge.name || badge.title || 'Unknown Badge',
                    communityitemid: badge.communityitemid || badge.border_color || '',
                    appName: appName || 'Unknown Game',
                    badgeImage: badge.image_hash || badge.badgeImage || badge.image || ''
                }));

                await setInStore(STORES.BADGE_DATA, {
                    appId: parseInt(appId),
                    data: processedBadges,
                    appName: appName || 'Unknown Game',
                    timestamp: Date.now()
                });

                return processedBadges;
            }
            return null;
        } catch (error) {
            logError('Error updating badge cache:', error);
            return null;
        }
    }

    // Add refresh button to badge containers
    function addRefreshButton(container, appId) {
        const refreshButton = document.createElement('button');
        refreshButton.className = 'badge-refresh-button';
        refreshButton.innerHTML = '↻';
        refreshButton.title = 'Refresh badge data';

        refreshButton.addEventListener('click', async () => {
            refreshButton.disabled = true;
            refreshButton.classList.add('refreshing');

            const updatedBadges = await updateBadgeCache(appId);
            if (updatedBadges) {
                // Re-render the current view
                if (window.location.pathname.includes('/gamecards/')) {
                    handleGamecardsPage();
                } else if (window.location.pathname.includes('/badges')) {
                    handleBadgesPage();
                } else if (window.location.pathname.includes('/tradingcards/boostercreator')) {
                    updateBadgeInfo();
                } else if (window.location.pathname.includes('/inventory')) {
                    // For inventory, just update the specific container
                    const badgeContainer = container.querySelector('.badge-list-container');
                    if (badgeContainer) {
                        badgeContainer.innerHTML = '';
                        const sortedBadges = sortBadges(updatedBadges);
                        sortedBadges.forEach(badge => {
                            const badgeElement = createBadgeListItem(badge);
                            badgeContainer.appendChild(badgeElement);
                        });
                    }
                }
            }

            refreshButton.disabled = false;
            refreshButton.classList.remove('refreshing');
        });

        container.insertBefore(refreshButton, container.firstChild);
    }

    // Update the favorites sort order handling
    function handleFavoritesSortOrder(sortOrder, favorites) {
        const normalizedFavorites = favorites.map(f => ({
            ...f,
            foil: f.isFoil || f.foil, // Ensure foil property is consistent
            isFavorite: true
        }));

        switch (sortOrder) {
            case 'appid_asc':
                return normalizedFavorites.sort((a, b) => parseInt(a.appId) - parseInt(b.appId));
            case 'appid_desc':
                return normalizedFavorites.sort((a, b) => parseInt(b.appId) - parseInt(a.appId));
            case 'foil_first':
            case 'foil_last':
                // Use our unified sorting function but respect the foil order preference
                const sorted = sortBadges(normalizedFavorites);
                return sortOrder === 'foil_first' ? sorted.reverse() : sorted;
            default:
                return sortBadges(normalizedFavorites);
        }
    }

    // Update the sort select options to match our new sorting capabilities
    function createSortSelect() {
        const select = document.createElement('select');
        select.innerHTML = `
            <option value="default">Default (Normal then Foil)</option>
            <option value="appid_asc">App ID ↑</option>
            <option value="appid_desc">App ID ↓</option>
            <option value="foil_first">Foil First</option>
            <option value="foil_last">Foil Last</option>
        `;
        select.value = GM_getValue('favoritesSortOrder', 'default');
        select.addEventListener('change', () => {
            GM_setValue('favoritesSortOrder', select.value);
            displayFavorites();
        });
        return select;
    }

    // --- Database Functions ---
    async function fetchSteamBadgeInfo(appId) {
        console.log(`[Steam Badge Suite] Starting badge info fetch for App ID ${appId}`);

        // Run both normal and foil badge requests in parallel
        const [normalData, foilData] = await Promise.all([
            // Normal badge request
            new Promise((resolve) => {
                const normalUrl = `https://steamcommunity.com/my/ajaxgetbadgeinfo/${appId}`;
                console.log(`[Steam Badge Suite] Making normal badge request to: ${normalUrl}`);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: normalUrl,
                    onload: (response) => {
                        console.log('[Steam Badge Suite] Normal badge response:', {
                            url: normalUrl,
                            status: response.status,
                            statusText: response.statusText,
                            responseHeaders: response.responseHeaders,
                            responseText: response.responseText
                        });
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log('[Steam Badge Suite] Full normal badge data:', data);
                            resolve(data.eresult === 1 ? data : null);
                        } catch (error) {
                            console.error('[Steam Badge Suite] Error parsing normal badge data:', error);
                            resolve(null);
                        }
                    },
                    onerror: (error) => {
                        console.error('[Steam Badge Suite] Error fetching normal badge:', error);
                        resolve(null);
                    }
                });
            }),

            // Foil badge request
            new Promise((resolve) => {
                const foilUrl = `https://steamcommunity.com/my/ajaxgetbadgeinfo/${appId}?border=1`;
                console.log(`[Steam Badge Suite] Making foil badge request to: ${foilUrl}`);

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: foilUrl,
                    onload: (response) => {
                        console.log('[Steam Badge Suite] Foil badge response:', {
                            url: foilUrl,
                            status: response.status,
                            statusText: response.statusText,
                            responseHeaders: response.responseHeaders,
                            responseText: response.responseText
                        });
                        try {
                            const data = JSON.parse(response.responseText);
                            console.log('[Steam Badge Suite] Full foil badge data:', data);
                            resolve(data.eresult === 1 ? data : null);
                        } catch (error) {
                            console.error('[Steam Badge Suite] Error parsing foil badge data:', error);
                            resolve(null);
                        }
                    },
                    onerror: (error) => {
                        console.error('[Steam Badge Suite] Error fetching foil badge:', error);
                        resolve(null);
                    }
                });
            })
        ]);

        // Parse the badge levels from the response data
        const parseBadgeLevel = (data) => {
            if (!data?.badgedata) return 0;
            return data.badgedata.level || 0;
        };

        const result = {
            normal: {
                ...normalData?.badgedata,
                level: parseBadgeLevel(normalData)
            },
            foil: {
                ...foilData?.badgedata,
                level: parseBadgeLevel(foilData)
            }
        };

        console.log('[Steam Badge Suite] Final parsed badge data:', result);
        return result;
    }

    // Update the badge processing logic
    async function refreshBadgeData(appId, container, button = null) {
        if (button) {
            button.disabled = true;
            button.style.opacity = '0.5';
        }

        try {
            await deleteFromStore(STORES.BADGE_DATA, parseInt(appId));

            // First, get the badges from SteamSets
            const badges = await fetchBadgeData(appId);

            if (!badges) {
                throw new Error('Failed to fetch badge data from SteamSets');
            }

            // Then fetch Steam badge info
            const steamBadgeInfo = await fetchSteamBadgeInfo(appId);

            // Log the Steam badge info for debugging
            console.log('[Steam Badge Suite] Steam badge info for crafted detection:', {
                normalLevel: steamBadgeInfo?.normal?.level,
                foilLevel: steamBadgeInfo?.foil?.level
            });

            // Process badges once and store the results
            const processedBadges = badges.map(badge => {
                // First, determine if this is a badge set with more than 7 levels
                const hasHighLevels = badges.some(b => parseInt(b.baseLevel) > 7);

                // Check if badge is foil by looking at the name and border
                const isFoil = badge.foil || badge.isFoil || (
                    // For badges with "Foil" in the name
                    badge.name.toLowerCase().includes(' - foil ') || // Must have " - Foil " format
                    badge.name.toLowerCase().startsWith('foil ') || // Or start with "Foil "
                    // For event badges, must start with the event name and have " - Foil" format
                    (hasHighLevels && badge.name.match(/^.*? - Foil \d+/))
                );

                // Set base level from the badge data
                const baseLevel = parseInt(badge.baseLevel) || 1;
                const craftedLevel = isFoil ? steamBadgeInfo?.foil?.level || 0 : steamBadgeInfo?.normal?.level || 0;

                // For event badges (hasHighLevels), check if this badge level is the one that's crafted
                // For regular badges, only mark as crafted if base level matches crafted level exactly
                const isCrafted = hasHighLevels ?
                    (craftedLevel > 0 && baseLevel === craftedLevel) : // For event badges
                    (baseLevel === craftedLevel); // For regular badges

                // Log badge processing for debugging
                console.log('[Steam Badge Suite] Badge crafted status:', {
                    name: badge.name,
                    isFoil,
                    baseLevel,
                    craftedLevel,
                    isCrafted,
                    hasHighLevels
                });

                return {
                    ...badge,
                    baseLevel,
                    isFoil,
                    craftedLevel,
                    isCrafted
                };
            });

            // Store the processed data
            const storeData = {
                appId: parseInt(appId),
                data: processedBadges,
                timestamp: Date.now()
            };

            await setInStore(STORES.BADGE_DATA, storeData);

            // Clear and update the display
            container.innerHTML = '';
            displayBadges(container, processedBadges);

            if (button) {
                button.disabled = false;
                button.style.opacity = '1';
            }
        } catch (error) {
            logError('Error refreshing badge data:', error);
            if (button) {
                button.disabled = false;
                button.style.opacity = '1';
            }
            showError('Error refreshing badge data', container);
        }
    }

    function addRefreshButtonToStats(statsContainer, appId, container) {
        const refreshButton = document.createElement('button');
        refreshButton.className = 'refresh-button';
        refreshButton.innerHTML = '↻';
        refreshButton.title = 'Refresh badge data';
        refreshButton.onclick = () => {
            refreshButton.disabled = true;
            refreshButton.style.opacity = '0.5';
            refreshBadgeData(appId, container, refreshButton).catch(error => {
                logError('Error in refresh button click handler:', error);
            });
        };
        statsContainer.appendChild(refreshButton);
        return refreshButton;
    }
})();



