// ==UserScript==
// @name         Enhanced Osprey's Eye
// @namespace    https://github.com/HomieWrecker/Osprey-s-Eye
// @version      2.0.2
// @description  Custom Estimation Enguine
// @author       Homiewrecker
// @match        https://www.torn.com/profiles.php?XID=*
// @match        https://www.torn.com/profiles.php*
// @match        https://www.torn.com/factions.php*
// @match        https://www.torn.com/joblist.php*
// @match        https://www.torn.com/index.php?page=people*
// @match        https://www.torn.com/pmarket.php
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @match        https://www.torn.com/hospitalview.php*
// @match        https://www.torn.com/companies.php*
// @match        https://www.torn.com/bounties.php*
// @match        https://www.torn.com/forums.php*
// @match        https://www.torn.com/page.php?sid=hof*
// @match        https://www.torn.com/messages.php*
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.torn.com
// @connect      tsc.diicot.cc
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536254/Enhanced%20Osprey%27s%20Eye.user.js
// @updateURL https://update.greasyfork.org/scripts/536254/Enhanced%20Osprey%27s%20Eye.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========== Constants & Configuration ==========
    const VERSION = '2.0';
    const STORAGE_KEY_API = 'osprey_api_key';
    const STORAGE_KEY_CONFIG = 'osprey_config';
    const STORAGE_KEY_ESTIMATES = 'osprey_player_estimates';
    const CACHE_EXPIRY = 12 * 60 * 60 * 1000; // 12 hours
    
    // Default configuration options
    const DEFAULT_CONFIG = {
        showStatBreakdown: true,
        colorScheme: 'dark',
        estimationMethod: 'advanced',
        uiPosition: 'top',
        compactMode: false,
        debugMode: false,
        // Feature configuration
        showInlineStats: true,       // Show inline stat estimations for players
        enableFairFightIndicator: true, // Show fair fight color indicators
        showFFGauge: true,           // Show FF gauge/arrow on profiles
        storeSavedEstimates: true,   // Store estimations for future reference
        maxStoredEstimates: 500,     // Limit stored estimates to prevent excessive storage usage
        showEstimationBox: true,     // Show the main estimation box
    };
    
    // Default styles - combined from both scripts
    const STYLES = `
    body {
        --osprey-bg-color: #f0f0f0;
        --osprey-alt-bg-color: #fff;
        --osprey-border-color: #ccc;
        --osprey-input-color: #ccc;
        --osprey-text-color: #000;
        --osprey-hover-color: #ddd;
        --osprey-glow-color: #ffb6c1;
        --osprey-excellent-color: #00cc00;
        --osprey-good-color: #66cc00;
        --osprey-fair-color: #cccc00;
        --osprey-poor-color: #ff9900;
        --osprey-very-poor-color: #ff0000;
    }
    
    body.dark-mode {
        --osprey-bg-color: #333;
        --osprey-alt-bg-color: #383838;
        --osprey-border-color: #444;
        --osprey-input-color: #504f4f;
        --osprey-text-color: #ccc;
        --osprey-hover-color: #555;
        --osprey-glow-color: #ffb6c1;
    }
    
    .osprey-loader {
        content: url(https://www.torn.com/images/v2/main/ajax-loader.gif);
    }
    
    body.dark-mode .osprey-loader {
        content: url(https://www.torn.com/images/v2/main/ajax-loader-white.gif);
    }
    
    table.osprey-stat-table {
        border-collapse: collapse;
        width: 100%;
        background-color: var(--osprey-bg-color);
        color: var(--osprey-text-color);
    }
    
    table.osprey-stat-table th,
    table.osprey-stat-table td {
        padding: 4px;
        border: 1px solid var(--osprey-border-color);
        color: var(--osprey-text-color);
        text-align: center;
    }
    
    table.osprey-stat-table th {
        background-color: var(--osprey-bg-color);
        color: var(--osprey-text-color);
        border: 1px solid var(--osprey-border-color);
    }
    
    .osprey-stat-table>tbody>tr>td {
        padding: 5px;
        border: 1px solid var(--osprey-border-color);
    }
    
    .osprey-faction-spy {
        margin-right: 2px;
        margin-left: auto;
        padding: 3px 5px;
        background-color: var(--osprey-bg-color);
        cursor: pointer;
        border: 1px solid var(--osprey-border-color);
        border-radius: 5px;
        color: var(--osprey-text-color);
        text-wrap: nowrap;
    }
    
    .osprey-chain-spy {
        display: flex;
        align-items: center;
        height: 0.7rem;
        margin-left: 2px;
        padding: 3px;
        background-color: var(--osprey-bg-color);
        cursor: pointer;
        border: 1px solid var(--osprey-border-color);
        border-radius: 5px;
        font-size: 0.6rem;
        color: var(--osprey-text-color);
        text-wrap: nowrap;
    }
    
    .osprey-company-spy {
        display: inline;
        margin-left: 5px;
        padding: 3px 5px;
        background-color: var(--osprey-bg-color);
        cursor: pointer;
        border: 1px solid var(--osprey-border-color);
        border-radius: 5px;
        color: var(--osprey-text-color);
        text-wrap: nowrap;
    }
    
    .osprey-faction-war {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 15px;
        padding: 3px;
        background-color: var(--osprey-alt-bg-color);
        cursor: pointer;
        border: 1px solid var(--osprey-border-color);
        color: var(--osprey-text-color);
        text-wrap: nowrap;
        vertical-align: middle;
    }
    
    .osprey-abroad-spy {
        display: inline;
        margin-left: 2px;
        padding: 3px 4px;
        background-color: var(--osprey-bg-color);
        cursor: pointer;
        border: 1px solid var(--osprey-border-color);
        border-radius: 5px;
        color: var(--osprey-text-color);
        text-wrap: nowrap;
    }
    
    .osprey-points-market-spy {
        display: inline;
        margin-left: 5px;
        padding: 3px 5px;
        background-color: var(--osprey-bg-color);
        cursor: pointer;
        border: 1px solid var(--osprey-border-color);
        border-radius: 5px;
        font-size: 0.6rem;
        color: var(--osprey-text-color);
        text-wrap: nowrap;
        vertical-align: middle;
    }
    
    .osprey-attack-spy {
        display: flex;
        align-items: center;
        height: 0.44rem;
        margin-left: 2px;
        padding: 3px;
        background-color: var(--osprey-bg-color);
        cursor: pointer;
        border: 1px solid var(--osprey-border-color);
        border-radius: 5px;
        font-size: 0.6rem;
        color: var(--osprey-text-color);
        text-wrap: nowrap;
    }
    
    .osprey-attack-mobile {
        flex: none !important;
        margin-right: 3px !important;
    }
    
    .osprey-accordion {
        margin: 10px 0;
        padding: 10px;
        background-color: var(--osprey-bg-color);
        border: 1px solid var(--osprey-border-color);
        border-radius: 5px;
    }
    
    .osprey-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 10px;
        margin-bottom: 10px;
        font-size: 1.2em;
        font-weight: 700;
    }
    
    .osprey-header-username {
        display: inline;
        font-style: italic;
    }
    
    .osprey-setting-entry {
        display: flex;
        align-items: center;
        gap: 5px;
        margin-top: 10px;
        margin-bottom: 5px;
    }
    
    .osprey-key-input {
        width: 120px;
        padding-left: 5px;
        background-color: var(--osprey-input-color);
        color: var(--osprey-text-color);
    }
    
    .osprey-button {
        padding: 5px 10px;
        transition: background-color 0.5s;
        background-color: var(--osprey-bg-color);
        cursor: pointer;
        border: 1px solid var(--osprey-border-color);
        border-radius: 5px;
        color: var(--osprey-text-color);
    }
    
    .osprey-button:hover {
        transition: background-color 0.5s;
        background-color: var(--osprey-hover-color);
    }
    
    .osprey-blur {
        filter: blur(3px);
        transition: filter 2s;
    }
    
    .osprey-blur:focus,
    .osprey-blur:active {
        filter: blur(0);
        transition-duration: 0.5s;
    }
    
    .osprey-glow {
        animation: glow 1s infinite alternate;
        border-width: 3px;
    }
    
    /* FF Gauge Styles */
    .osprey-ff-gauge {
        position: relative;
        display: block;
        padding: 0;
    }
    
    .osprey-vertical-line-low,
    .osprey-vertical-line-high {
        content: '';
        position: absolute;
        width: 2px;
        height: 60%;
        background-color: var(--osprey-border-color);
        margin-left: -1px;
        top: 20%;
    }
    
    .osprey-vertical-line-low {
        left: calc(var(--arrow-width) / 2 + 33 * (100% - var(--arrow-width)) / 100);
    }
    
    .osprey-vertical-line-high {
        left: calc(var(--arrow-width) / 2 + 66 * (100% - var(--arrow-width)) / 100);
    }
    
    .osprey-ff-arrow {
        position: absolute;
        transform: translate(-50%, -50%);
        padding: 0;
        top: 50%;
        left: calc(var(--arrow-width) / 2 + var(--band-percent) * (100% - var(--arrow-width)) / 100);
        width: var(--arrow-width);
        object-fit: cover;
        pointer-events: none;
    }
    
    @keyframes glow {
        0% {
            border-color: var(--osprey-border-color);
        }
        to {
            border-color: var(--osprey-glow-color);
        }
    }
    `;
    
    // Add styles to page
    GM_addStyle(STYLES);
    
    // ========== Helper Classes & Utils ==========
    
    // Storage utilities
    class Storage {
        constructor(prefix) {
            this.prefix = prefix;
        }
        
        // Get value with key
        get(key) {
            return localStorage.getItem(`${this.prefix}-${key}`);
        }
        
        // Set value with key
        set(key, value) {
            localStorage.setItem(`${this.prefix}-${key}`, value);
        }
        
        // Get value as boolean
        getBoolean(key) {
            return this.get(key) === 'true';
        }
        
        // Get value as JSON
        getJSON(key) {
            const value = this.get(key);
            return value === null ? null : JSON.parse(value);
        }
        
        // Set value as JSON
        setJSON(key, value) {
            this.set(key, JSON.stringify(value));
        }
        
        // Clear all storage with prefix
        clear() {
            let count = 0;
            const keys = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(this.prefix)) {
                    keys.push(key);
                }
            }
            
            for (const key of keys) {
                localStorage.removeItem(key);
                count++;
            }
            
            return count;
        }
        
        // Clear spy cache
        clearCache() {
            let count = 0;
            const keys = [];
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`${this.prefix}-spy`)) {
                    keys.push(key);
                }
            }
            
            for (const key of keys) {
                localStorage.removeItem(key);
                count++;
            }
            
            return count;
        }
    }
    
    // Logging utilities
    class Logger {
        constructor() {
            this.colors = {
                info: '#05668D',
                warn: '#EDDEA4',
                error: '#ff0000',
                debug: '#5C415D'
            };
            
            // Check if we're in TornPDA
            const apikey = '###PDA-APIKEY###';
            this.inPDA = apikey.includes('PDA-APIKEY') === false;
        }
        
        info(message, ...args) {
            let prefix = '%c';
            let style = `color: ${this.colors.info}`;
            
            if (this.inPDA) {
                args = args.map(a => JSON.stringify(a));
                prefix = '';
                style = '';
            }
            
            console.info(`${prefix}[Osprey's Eye] ${message}`, style, ...args);
        }
        
        warn(message, ...args) {
            let prefix = '%c';
            let style = `color: ${this.colors.warn}`;
            
            if (this.inPDA) {
                args = args.map(a => JSON.stringify(a));
                prefix = '';
                style = '';
            }
            
            console.warn(`${prefix}[Osprey's Eye] ${message}`, style, ...args);
        }
        
        error(message, ...args) {
            let prefix = '%c';
            let style = `color: ${this.colors.error}`;
            
            if (this.inPDA) {
                args = args.map(a => JSON.stringify(a));
                prefix = '';
                style = '';
            }
            
            console.error(`${prefix}[Osprey's Eye] ${message}`, style, ...args);
        }
        
        debug(message, ...args) {
            // Only log debug messages if debug mode is enabled
            if (!storage.getBoolean('debug-logs')) return;
            
            let prefix = '%c';
            let style = `color: ${this.colors.debug}`;
            
            if (this.inPDA) {
                args = args.map(a => JSON.stringify(a));
                prefix = '';
                style = '';
            }
            
            console.log(`${prefix}[Osprey's Eye] ${message}`, style, ...args);
        }
    }
    
    // DOM utilities
    class DOMHelpers {
        // Wait for element to appear in DOM
        static waitForElement(selector, timeout = 15000) {
            return new Promise((resolve) => {
                if (document.querySelectorAll(selector).length) {
                    return resolve(document.querySelector(selector));
                }
                
                const observer = new MutationObserver(() => {
                    if (document.querySelectorAll(selector).length) {
                        observer.disconnect();
                        resolve(document.querySelector(selector));
                    }
                });
                
                observer.observe(document.body, { childList: true, subtree: true });
                
                if (timeout) {
                    setTimeout(() => {
                        observer.disconnect();
                        resolve(null);
                    }, timeout);
                }
            });
        }
        
        // Get current user ID from page
        static async getCurrentUserID() {
            const settingsLink = await this.waitForElement(".settings-menu > .link > a:first-child", 15000);
            if (!settingsLink) return "";
            
            const match = settingsLink.href.match(/XID=(\d+)/);
            return match?.[1] ?? "";
        }
        
        // Format number for display
        static formatNumber(number, decimals = 2) {
            return Intl.NumberFormat("en-US", {
                notation: "compact", 
                maximumFractionDigits: decimals,
                minimumFractionDigits: decimals
            }).format(number);
        }
        
        // Format time difference
        static formatTimeDiff(timestamp) {
            const now = new Date().getTime();
            const then = new Date(timestamp).getTime();
            const diff = now - then;
            
            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            const months = Math.floor(days / 30);
            const years = Math.floor(months / 12);
            
            if (years > 0) {
                const remainingMonths = months % 12;
                return `${years} year${years > 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
            } else if (months > 0) {
                const remainingDays = days % 30;
                return `${months} month${months > 1 ? 's' : ''}, ${remainingDays} day${remainingDays > 1 ? 's' : ''}`;
            } else if (days > 0) {
                const remainingHours = hours % 24;
                return `${days} day${days > 1 ? 's' : ''}, ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
            } else if (hours > 0) {
                const remainingMinutes = minutes % 60;
                return `${hours} hour${hours > 1 ? 's' : ''}, ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
            } else {
                return `${minutes} minute${minutes > 1 ? 's' : ''}`;
            }
        }
    }
    
    // ========== API and Data Fetching ==========
    class APIService {
        constructor(storage, logger) {
            this.storage = storage;
            this.logger = logger;
            
            // Check if we're in TornPDA
            const apikey = '###PDA-APIKEY###';
            this.inPDA = apikey.includes('PDA-APIKEY') === false;
            
            // Setup XHR wrapper based on environment
            this.httpRequest = this.inPDA ? this.pdaRequest : this.gmRequest;
        }
        
        // Make request for TornPDA
        pdaRequest(details) {
            this.logger.debug("Using PDA HTTP request");
            if (details.method.toLowerCase() === "get") {
                return PDA_httpGet(details.url)
                    .then(details.onload)
                    .catch(details.onerror || ((e) => console.error(e)));
            } else if (details.method.toLowerCase() === "post") {
                return PDA_httpPost(details.url, details.headers || {}, details.body || details.data || "")
                    .then(details.onload)
                    .catch(details.onerror || ((e) => console.error(e)));
            }
        }
        
        // Make request for standard userscript managers
        gmRequest(details) {
            return (GM.xmlHttpRequest || GM_xmlhttpRequest)(details);
        }
        
        // Get API error message
        getErrorMessage(code) {
            switch (code) {
                case 1: return "Invalid request";
                case 2: return "Maintenance";
                case 3: return "Invalid API Key";
                case 4: return "Internal Error";
                case 5: return "User Disabled";
                case 6: return "Cached Only";
                case 999: return "Service Down";
                default: return "Unknown error";
            }
        }
        
        // Fetch spy data for a user
        async fetchSpy(userId) {
            const cachedData = this.storage.getJSON(`spy-${userId}`);
            const now = Date.now();
            
            if (cachedData) {
                const cachedTime = new Date(cachedData.insertedAt).getTime();
                if (cachedData.insertedAt && now - cachedTime < CACHE_EXPIRY) {
                    this.logger.debug("Using cached spy data");
                    return Promise.resolve(cachedData);
                }
                
                this.logger.debug("Spy cache expired, fetching new data");
                this.storage.setJSON(`spy-${userId}`, null);
            }
            
            const apiKey = this.storage.get("tsc-key") || "";
            const requestData = {
                apiKey: apiKey,
                userId: userId
            };
            
            return new Promise((resolve, reject) => {
                this.httpRequest({
                    method: "POST",
                    url: "https://tsc.diicot.cc/next",
                    timeout: 30000,
                    headers: {
                        "Authorization": "10000000-6000-0000-0009-000000000001",
                        "x-requested-with": "XMLHttpRequest",
                        "Content-Type": "application/json"
                    },
                    data: JSON.stringify(requestData),
                    onload: (response) => {
                        const data = JSON.parse(response.responseText);
                        
                        // Save valid responses to cache
                        if (!("error" in data) && data.success) {
                            this.storage.setJSON(`spy-${userId}`, {
                                ...data,
                                insertedAt: new Date().getTime()
                            });
                        }
                        
                        resolve(data);
                    },
                    onerror: (error) => {
                        this.logger.debug("Error fetching spy data", requestData);
                        resolve({
                            error: true,
                            message: `Failed to fetch spy: ${error.statusText}`
                        });
                    },
                    onabort: () => {
                        resolve({
                            error: true,
                            message: "Request aborted"
                        });
                    },
                    ontimeout: () => {
                        resolve({
                            error: true,
                            message: "Request timed out"
                        });
                    }
                });
            });
        }
        
        // Fetch user data from Torn API
        async fetchUserData() {
            if (!this.storage.get("tsc-key")) {
                return {
                    error: true,
                    message: "API Key not set"
                };
            }
            
            const cachedData = this.storage.getJSON("user-data");
            const now = Date.now();
            
            if (cachedData) {
                const cachedTime = new Date(cachedData.insertedAt).getTime();
                if (cachedData.insertedAt && now - cachedTime < CACHE_EXPIRY) {
                    this.logger.debug("Using cached user data");
                    return cachedData;
                }
                
                this.logger.debug("User data cache expired, fetching new data");
                this.storage.setJSON("user-data", null);
            }
            
            try {
                const response = await fetch(
                    `https://api.torn.com/user/?selections=basic&key=${this.storage.get("tsc-key")}&comment=Osprey-Eye`
                );
                
                if (!response.ok) {
                    return {
                        error: true,
                        message: response.statusText
                    };
                }
                
                const data = await response.json();
                
                if (data.error) {
                    return {
                        error: true,
                        message: data.error.error
                    };
                }
                
                // Save to cache
                this.storage.setJSON("user-data", {
                    ...data,
                    insertedAt: new Date().getTime()
                });
                
                return data;
            } catch (error) {
                return {
                    error: true,
                    message: error.message
                };
            }
        }
        
        // Calculate FF value from stats ratio
        calculateFairFight(playerStats, enemyStats) {
            // Get average values for calculations
            const myAvgStats = typeof playerStats === 'object' ? 
                Math.floor((playerStats.low + playerStats.high) / 2) : playerStats;
            
            const enemyAvgStats = typeof enemyStats === 'object' ? 
                Math.floor((enemyStats.low + enemyStats.high) / 2) : enemyStats;
            
            if (!myAvgStats || !enemyAvgStats) {
                return {
                    percentage: 100,
                    color: '#888888',
                    description: 'Unknown',
                    ratio: 1
                };
            }
            
            // Calculate ratio
            const ratio = myAvgStats / enemyAvgStats;
            
            // Calculate fair fight percentage using Torn's formula (approximated)
            let fairFightPercentage;
            if (ratio >= 4) {
                fairFightPercentage = 25; // Minimum fair fight (25%)
            } else if (ratio <= 0.25) {
                fairFightPercentage = 100; // Maximum fair fight (100%)
            } else {
                // Calculate fair fight percentage based on ratio
                // Approximation of Torn's formula, may need tweaking
                if (ratio > 1) {
                    fairFightPercentage = 100 - (75 * (ratio - 1) / 3);
                } else {
                    fairFightPercentage = 100;
                }
            }
            
            // Round to integer
            fairFightPercentage = Math.round(fairFightPercentage);
            
            // Determine color and description based on fair fight percentage
            let color;
            let description;
            
            if (fairFightPercentage >= 95) {
                color = '#00cc00'; // Bright green - excellent
                description = 'Excellent';
            } else if (fairFightPercentage >= 75) {
                color = '#66cc00'; // Green - very good
                description = 'Very Good';
            } else if (fairFightPercentage >= 60) {
                color = '#cccc00'; // Yellow - good
                description = 'Good';
            } else if (fairFightPercentage >= 45) {
                color = '#ff9900'; // Orange - fair
                description = 'Fair';
            } else if (fairFightPercentage >= 35) {
                color = '#ff6600'; // Dark orange - poor
                description = 'Poor';
            } else {
                color = '#ff0000'; // Red - very poor
                description = 'Very Poor';
            }
            
            return {
                percentage: fairFightPercentage,
                color,
                description,
                ratio
            };
        }
        
        // Convert FF value to gauge position
        ffToGaugePercent(ff) {
            // FF gauge has 3 key areas: low (1-2), medium (2-4), high (4+)
            // This maps to gauge ranges: 0-33%, 33-66%, 66-100%
            const lowFF = 2;
            const highFF = 4;
            const lowMidPercent = 33;
            const midHighPercent = 66;
            const maxFF = 8; // Clip high values for display
            
            ff = Math.min(ff, maxFF);
            
            let percent;
            if (ff < lowFF) {
                percent = (ff - 1) / (lowFF - 1) * lowMidPercent;
            } else if (ff < highFF) {
                percent = (((ff - lowFF) / (highFF - lowFF)) * (midHighPercent - lowMidPercent)) + lowMidPercent;
            } else {
                percent = (((ff - highFF) / (maxFF - highFF)) * (100 - midHighPercent)) + midHighPercent;
            }
            
            return percent;
        }
        
        // Get FF arrow image based on position
        getFFArrowImage(percent) {
            const blueArrow = "https://raw.githubusercontent.com/rDacted2/fair_fight_scouter/main/images/blue-arrow.svg";
            const greenArrow = "https://raw.githubusercontent.com/rDacted2/fair_fight_scouter/main/images/green-arrow.svg";
            const redArrow = "https://raw.githubusercontent.com/rDacted2/fair_fight_scouter/main/images/red-arrow.svg";
            
            if (percent < 33) {
                return blueArrow; // Low FF (75-100%)
            } else if (percent < 66) {
                return greenArrow; // Medium FF (50-75%)
            } else {
                return redArrow; // High FF (25-50%)
            }
        }
    }
    
    // ========== Stats Estimation ==========
    class StatsEstimator {
        constructor(storage, logger) {
            this.storage = storage;
            this.logger = logger;
        }
        
        // Basic estimate based on account age
        basicEstimate(ageDays) {
            if (!ageDays || ageDays < 1) return { low: 0, high: 0 };
            
            // Adjusted algorithm with diminishing returns for older accounts
            // and more realistic progression rates
            let baseMultiplierLow = 150000;
            let baseMultiplierHigh = 400000;
            
            // Apply scaling factors based on account age
            if (ageDays > 2000) {
                baseMultiplierLow = 120000;
                baseMultiplierHigh = 350000;
            } else if (ageDays > 1000) {
                baseMultiplierLow = 135000;
                baseMultiplierHigh = 380000;
            }
            
            // Calculate ranges
            const low = Math.floor(ageDays * baseMultiplierLow);
            const high = Math.floor(ageDays * baseMultiplierHigh);
            
            return { low, high };
        }
        
        // Advanced estimate using account age and other factors
        advancedEstimate(ageDays, level = null, networth = null) {
            const base = this.basicEstimate(ageDays);
            
            // Apply adjustments if we have level information
            if (level) {
                const levelMultiplier = 1 + (Math.log10(level) / 10);
                base.low = Math.floor(base.low * levelMultiplier);
                base.high = Math.floor(base.high * levelMultiplier);
            }
            
            // Apply networth adjustments if available
            if (networth) {
                // Wealthy players might have higher stats due to gym upgrades
                const networthAdjustment = Math.min(1.2, Math.max(1, Math.log10(networth/1000000) / 10));
                base.high = Math.floor(base.high * networthAdjustment);
            }
            
            return base;
        }
        
        // Format the estimate range as a string
        formatEstimate(estimate) {
            return `${DOMHelpers.formatNumber(estimate.low)} - ${DOMHelpers.formatNumber(estimate.high)}`;
        }
        
        // Format the estimate as single number (average) - useful for inline display
        formatEstimateCompact(estimate) {
            const avg = Math.floor((estimate.low + estimate.high) / 2);
            return DOMHelpers.formatNumber(avg);
        }
        
        // Generate a stat breakdown (estimates of individual stats)
        generateStatBreakdown(totalStats) {
            // Calculate average total stat
            const avgTotal = Math.floor((totalStats.low + totalStats.high) / 2);
            
            // Generate breakdown distribution (approximately equal for now)
            // In a more advanced implementation, this could analyze activity patterns
            const statBreakdown = {
                strength: { 
                    low: Math.floor(totalStats.low * 0.24), 
                    high: Math.floor(totalStats.high * 0.28)
                },
                speed: {
                    low: Math.floor(totalStats.low * 0.23), 
                    high: Math.floor(totalStats.high * 0.26)
                },
                defense: {
                    low: Math.floor(totalStats.low * 0.24), 
                    high: Math.floor(totalStats.high * 0.27)
                },
                dexterity: {
                    low: Math.floor(totalStats.low * 0.22), 
                    high: Math.floor(totalStats.high * 0.26)
                }
            };
            
            return statBreakdown;
        }
        
        // Format spy data for display
        formatSpyForDisplay(spyData) {
            const { estimate, statInterval } = spyData.spy;
            let spyText = DOMHelpers.formatNumber(estimate.stats, 1);
            let tooltipText = `Estimate: ${DOMHelpers.formatNumber(estimate.stats, 2)} (${DOMHelpers.formatTimeDiff(new Date(estimate.lastUpdated))})`;
            
            // Add interval data if available
            if (statInterval && statInterval.battleScore) {
                spyText = `${DOMHelpers.formatNumber(BigInt(statInterval.min), 1)} - ${DOMHelpers.formatNumber(BigInt(statInterval.max), 1)}`;
                tooltipText += `<br>Interval: ${DOMHelpers.formatNumber(BigInt(statInterval.min), 2)} - ${DOMHelpers.formatNumber(BigInt(statInterval.max), 2)} (${DOMHelpers.formatTimeDiff(new Date(statInterval.lastUpdated))})<br>Battle Score: ${DOMHelpers.formatNumber(statInterval.battleScore, 2)}`;
            }
            
            return { spyText, tooltipText };
        }
        
        // Format spy data for faction page
        formatSpyForFaction(spyData) {
            const { estimate, statInterval } = spyData.spy;
            let longTextInterval = "";
            const longTextEstimate = `Estimate: ${DOMHelpers.formatNumber(estimate.stats)}`;
            let toolTipText = `Estimate: ${new Date(estimate.lastUpdated).toLocaleDateString()}`;
            
            // Add interval and fair fight if available
            if (statInterval && statInterval.battleScore) {
                longTextInterval = `${DOMHelpers.formatNumber(BigInt(statInterval.min))} - ${DOMHelpers.formatNumber(BigInt(statInterval.max))} / FF: ${statInterval.fairFight}`;
                toolTipText += `<br>Interval: ${new Date(statInterval.lastUpdated).toLocaleDateString()}`;
            }
            
            return { longTextInterval, longTextEstimate, toolTipText };
        }
        
        // Get FF HTML for display
        getFFHTML(fairFight) {
            return `<span style="color:${fairFight.color}; font-weight:bold;">${fairFight.percentage}%</span>`;
        }
        
        // Save player estimate to storage
        savePlayerEstimate(playerId, estimate, playerName = null) {
            if (!this.storage.getBoolean("storeSavedEstimates")) return false;
            
            const estimateData = {
                totalStats: estimate,
                playerName: playerName,
                lastUpdated: Date.now()
            };
            
            try {
                this.storage.setJSON(`player-${playerId}`, estimateData);
                return true;
            } catch (e) {
                this.logger.error("Failed to save player estimate", e);
                return false;
            }
        }
    }
    
    // ========== Module Implementation ==========
    class PageModule {
        constructor(name, description, handler, enabledByDefault = true) {
            this.name = name;
            this.description = description;
            this.handler = handler;
            this.enabledByDefault = enabledByDefault;
            
            this.logger = new Logger();
            this.storage = new Storage('osprey');
            this.api = new APIService(this.storage, this.logger);
            this.estimator = new StatsEstimator(this.storage, this.logger);
        }
        
        // Check if module should run
        async shouldRun() {
            // Check if module is enabled in settings
            const enabled = this.storage.get(`module-${this.name}`) ?? 
                            (this.enabledByDefault ? 'true' : 'false');
            
            if (enabled !== 'true') {
                this.logger.debug(`Module ${this.name} is disabled, skipping`);
                return false;
            }
            
            return true;
        }
        
        // Start the module
        async start() {
            try {
                if (await this.shouldRun()) {
                    this.logger.info(`Starting module: ${this.name}`);
                    await this.handler(this);
                    this.logger.debug(`Module ${this.name} started successfully`);
                }
            } catch (error) {
                this.logger.error(`Error running module ${this.name}:`, error);
            }
        }
    }
    
    // ========== Initialize ==========
    const storage = new Storage('osprey');
    const logger = new Logger();
    
    // Ensure default settings are set
    if (!storage.get(STORAGE_KEY_CONFIG)) {
        storage.setJSON(STORAGE_KEY_CONFIG, DEFAULT_CONFIG);
    }
    
    // ========== UI Components ==========
    class UIComponents {
        constructor(storage, logger, api, estimator) {
            this.storage = storage;
            this.logger = logger;
            this.api = api;
            this.estimator = estimator;
        }
        
        // Create tooltip with stat breakdown
        createStatBreakdownTooltip(element, statEstimate, playerId, playerName) {
            // Remove any existing tooltips
            const existingTooltip = document.getElementById('osprey-tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }
            
            // Generate breakdown
            const breakdown = this.estimator.generateStatBreakdown(statEstimate);
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.id = 'osprey-tooltip';
            tooltip.style.position = 'absolute';
            tooltip.style.zIndex = '9999';
            tooltip.style.backgroundColor = '#1e2129';
            tooltip.style.border = '2px solid #00bfff';
            tooltip.style.borderRadius = '8px';
            tooltip.style.padding = '12px';
            tooltip.style.color = '#fff';
            tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            tooltip.style.width = '220px';
            tooltip.style.fontSize = '12px';
            
            tooltip.innerHTML = `
                <div style="font-weight:bold; font-size:14px; margin-bottom:8px; color:#00bfff;">
                    ${playerName} - Stat Estimate
                </div>
                <div style="margin-bottom:6px;">
                    <span style="font-weight:bold;">Total:</span> 
                    <span style="color:#66a3ff; float:right;">${this.estimator.formatEstimate(statEstimate)}</span>
                </div>
                <div style="margin-bottom:6px;">
                    <span style="font-weight:bold;">Strength:</span> 
                    <span style="color:#ff6666; float:right;">${this.estimator.formatEstimate(breakdown.strength)}</span>
                </div>
                <div style="margin-bottom:6px;">
                    <span style="font-weight:bold;">Defense:</span> 
                    <span style="color:#66cc66; float:right;">${this.estimator.formatEstimate(breakdown.defense)}</span>
                </div>
                <div style="margin-bottom:6px;">
                    <span style="font-weight:bold;">Speed:</span> 
                    <span style="color:#ffcc00; float:right;">${this.estimator.formatEstimate(breakdown.speed)}</span>
                </div>
                <div style="margin-bottom:6px;">
                    <span style="font-weight:bold;">Dexterity:</span> 
                    <span style="color:#cc66ff; float:right;">${this.estimator.formatEstimate(breakdown.dexterity)}</span>
                </div>
                <div style="color:#999; font-size:10px; margin-top:10px; text-align:center;">
                    Osprey's Eye Estimation
                </div>
            `;
            
            // Position tooltip near the element
            const rect = element.getBoundingClientRect();
            tooltip.style.left = `${rect.left}px`;
            tooltip.style.top = `${rect.bottom + 5}px`;
            
            // Add to document
            document.body.appendChild(tooltip);
            
            // Close tooltip when clicking outside
            const closeTooltip = (e) => {
                if (e.target !== element && !tooltip.contains(e.target)) {
                    tooltip.remove();
                    document.removeEventListener('click', closeTooltip);
                }
            };
            
            // Use timeout to prevent immediate closing
            setTimeout(() => {
                document.addEventListener('click', closeTooltip);
            }, 100);
        }
        
        // Add estimation box to profile
        addEstimationBox(container, stats, verified, breakdown) {
            if (!this.storage.getBoolean("showEstimationBox")) {
                this.logger.debug("Estimation box disabled in config");
                return;
            }
            
            // Look for the best place to insert the estimation box
            const targetSelectors = [
                '.profile-buttons', 
                '.user-profile-buttons',
                '.profile-status',
                '.basic-info',
                '.user-profile-info'
            ];
            
            let targetElement = null;
            for (const selector of targetSelectors) {
                const element = container.querySelector(selector);
                if (element) {
                    targetElement = element;
                    break;
                }
            }
            
            if (!targetElement) {
                // Fallback - use the container itself
                targetElement = container;
            }
            
            // Check if we already added an estimation box
            if (container.querySelector('#osprey-estimate-box')) {
                this.logger.debug("Estimation box already exists, not adding again");
                return;
            }
            
            // Create the estimation box
            const estimateBox = document.createElement('div');
            estimateBox.id = 'osprey-estimate-box';
            estimateBox.className = 'osprey-estimate-box';
            estimateBox.style.marginTop = '15px';
            estimateBox.style.marginBottom = '15px';
            estimateBox.style.padding = '12px';
            estimateBox.style.backgroundColor = '#1e2129';
            estimateBox.style.border = '1px solid #3c5875';
            estimateBox.style.borderRadius = '5px';
            estimateBox.style.color = '#fff';
            estimateBox.style.fontSize = '13px';
            
            let content = `
                <div style="font-weight:bold; color:#66a3ff; margin-bottom:8px; display:flex; align-items:center;">
                    <span style="flex:1;">Osprey's Eye - Stats Estimate</span>
                    ${verified ? '<span style="color:#00cc00; font-size:11px; margin-left:5px;">✓ Verified</span>' : ''}
                </div>
                <div style="margin-bottom:8px;">
                    <span style="font-weight:bold;">Total Battle Stats: </span>
                    <span style="color:#66a3ff;">${this.estimator.formatEstimate(stats)}</span>
                </div>
            `;
            
            // Add breakdown if available
            if (breakdown) {
                content += `
                    <div style="display:flex; margin-top:10px;">
                        <div style="flex:1;">
                            <div style="color:#ff6666; margin-bottom:4px;">
                                <span style="font-weight:bold;">STR: </span>
                                <span>${this.estimator.formatEstimate(breakdown.strength)}</span>
                            </div>
                            <div style="color:#66cc66; margin-bottom:4px;">
                                <span style="font-weight:bold;">DEF: </span>
                                <span>${this.estimator.formatEstimate(breakdown.defense)}</span>
                            </div>
                        </div>
                        <div style="flex:1;">
                            <div style="color:#ffcc00; margin-bottom:4px;">
                                <span style="font-weight:bold;">SPD: </span>
                                <span>${this.estimator.formatEstimate(breakdown.speed)}</span>
                            </div>
                            <div style="color:#cc66ff; margin-bottom:4px;">
                                <span style="font-weight:bold;">DEX: </span>
                                <span>${this.estimator.formatEstimate(breakdown.dexterity)}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
            
            // Add fair fight details if user has personal data available
            const userData = this.storage.getJSON('user-data');
            if (userData && userData.stats) {
                const userTotalStats = userData.strength + userData.speed + userData.defense + userData.dexterity;
                const userStats = { low: userTotalStats, high: userTotalStats };
                const fairFight = this.api.calculateFairFight(userStats, stats);
                
                content += `
                    <div style="margin-top:10px; padding-top:10px; border-top:1px solid #3c5875;">
                        <span style="font-weight:bold;">Fair Fight: </span>
                        <span style="color:${fairFight.color};">${fairFight.percentage}% (${fairFight.description})</span>
                    </div>
                `;
            }
            
            estimateBox.innerHTML = content;
            
            // Add to container
            try {
                targetElement.appendChild(estimateBox);
            } catch (error) {
                this.logger.error("Failed to add estimation box", error);
            }
        }
        
        // Add inline stats and estimate button
        addInlineStatsAndButton(profileContainer, statEstimate, xid) {
            try {
                if (!this.storage.getBoolean("showInlineStats")) {
                    this.logger.debug("Inline stats disabled in config");
                    return;
                }
                
                // Find the profile picture area - several possible selectors
                const pfpSelectors = [
                    '.user-profile-pic', 
                    '.profile-pic',
                    '.user-info img',
                    '.player-info img',
                    '.avatar',
                    '.profile-container img',
                    // Add more if needed
                ];
                
                // Also check for parent containers
                const containerSelectors = [
                    '.basic-information',
                    '.user-info',
                    '.user-profile-info',
                    '.profile-container',
                    '.avatar-container',
                    '.user-data'
                ];
                
                // First try direct picture selectors
                let targetElement = null;
                for (const selector of pfpSelectors) {
                    const element = profileContainer.querySelector(selector);
                    if (element) {
                        targetElement = element.parentElement;
                        break;
                    }
                }
                
                // If not found, try container selectors
                if (!targetElement) {
                    for (const selector of containerSelectors) {
                        const element = profileContainer.querySelector(selector);
                        if (element) {
                            targetElement = element;
                            break;
                        }
                    }
                }
                
                // Fallback to any valid container
                if (!targetElement) {
                    targetElement = profileContainer.querySelector('.profile-status, .status, .info');
                }
                
                if (!targetElement) {
                    this.logger.error("Could not find profile picture area");
                    return;
                }
                
                // Check if we already added the inline stats
                if (targetElement.querySelector('.osprey-inline-profile-stats')) {
                    return;
                }
                
                // Create container for inline stats + button
                const inlineContainer = document.createElement('div');
                inlineContainer.className = 'osprey-inline-profile-stats';
                inlineContainer.style.marginTop = '10px';
                inlineContainer.style.padding = '5px 0';
                inlineContainer.style.borderTop = '1px solid rgba(255, 255, 255, 0.1)';
                inlineContainer.style.color = '#fff';
                inlineContainer.style.fontSize = '13px';
                inlineContainer.style.textAlign = 'center';
                
                // Add stat estimation
                const statsText = document.createElement('div');
                statsText.style.fontWeight = 'bold';
                statsText.style.color = '#66a3ff';
                statsText.style.marginBottom = '5px';
                statsText.innerHTML = `Stats: ${this.estimator.formatEstimateCompact(statEstimate)}`;
                inlineContainer.appendChild(statsText);
                
                // Add the estimate button
                const estimateBtn = document.createElement('button');
                estimateBtn.className = 'osprey-profile-estimate-btn';
                estimateBtn.textContent = 'Detailed Estimate';
                estimateBtn.style.backgroundColor = '#1e2129';
                estimateBtn.style.border = '1px solid #00bfff';
                estimateBtn.style.color = '#00bfff';
                estimateBtn.style.padding = '4px 8px';
                estimateBtn.style.fontSize = '11px';
                estimateBtn.style.borderRadius = '3px';
                estimateBtn.style.cursor = 'pointer';
                estimateBtn.style.transition = 'background-color 0.2s';
                
                // Add hover effect
                estimateBtn.onmouseover = () => {
                    estimateBtn.style.backgroundColor = '#2a3241';
                };
                estimateBtn.onmouseout = () => {
                    estimateBtn.style.backgroundColor = '#1e2129';
                };
                
                // Add click handler to show breakdown tooltip
                estimateBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Get player name if available
                    const playerInfo = this.storage.getJSON(`player-${xid}`);
                    let playerName = playerInfo?.playerName;
                    
                    // If no stored name, try to get from page
                    if (!playerName) {
                        const nameElement = profileContainer.querySelector('.user-name, .name, .player-name, .title');
                        if (nameElement) {
                            playerName = nameElement.textContent.trim();
                        } else {
                            playerName = `Player ${xid}`;
                        }
                    }
                    
                    this.createStatBreakdownTooltip(estimateBtn, statEstimate, xid, playerName);
                };
                
                inlineContainer.appendChild(estimateBtn);
                
                // Add to page
                targetElement.appendChild(inlineContainer);
                
            } catch (e) {
                this.logger.error(`Error adding inline stats: ${e.message}`);
            }
        }
        
        // Add FF gauge to a UI element
        addFFGauge(element, playerId, fairFightValue) {
            if (!this.storage.getBoolean("showFFGauge")) {
                return;
            }
            
            try {
                // Set up the gauge container
                element.classList.add('osprey-ff-gauge');
                element.style.setProperty("--arrow-width", "20px");
                
                // Calculate the position percentage
                const percent = this.api.ffToGaugePercent(fairFightValue);
                element.style.setProperty("--band-percent", percent);
                
                // Remove any existing components
                $(element).find('.osprey-ff-arrow, .osprey-vertical-line-low, .osprey-vertical-line-high').remove();
                
                // Add vertical lines
                $(element).append($("<div>", { class: "osprey-vertical-line-low" }));
                $(element).append($("<div>", { class: "osprey-vertical-line-high" }));
                
                // Add arrow with appropriate color
                const arrowSrc = this.api.getFFArrowImage(percent);
                const img = $('<img>', {
                    src: arrowSrc,
                    class: "osprey-ff-arrow",
                });
                
                $(element).append(img);
                
                // Add tooltip with more detail
                const ffValue = fairFightValue.toFixed(2);
                const ffDetail = `Fair Fight Value: ${ffValue}
                                 (${percent < 33 ? 'High' : percent < 66 ? 'Medium' : 'Low'} reward)`;
                
                element.title = ffDetail;
                
            } catch (error) {
                this.logger.error(`Error adding FF gauge: ${error.message}`);
            }
        }
        
        // Show settings modal
        showSettingsModal() {
            // Remove any existing modal
            const existingModal = document.getElementById('osprey-settings-modal');
            if (existingModal) {
                existingModal.remove();
            }
            
            // Create modal container
            const modal = document.createElement('div');
            modal.id = 'osprey-settings-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100%';
            modal.style.height = '100%';
            modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            modal.style.zIndex = '10000';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            
            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = '#1e2129';
            modalContent.style.padding = '20px';
            modalContent.style.borderRadius = '5px';
            modalContent.style.maxWidth = '600px';
            modalContent.style.width = '80%';
            modalContent.style.maxHeight = '80vh';
            modalContent.style.overflowY = 'auto';
            modalContent.style.color = '#fff';
            
            // Create header
            const header = document.createElement('div');
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.marginBottom = '20px';
            header.style.borderBottom = '1px solid #3c5875';
            header.style.paddingBottom = '10px';
            
            const title = document.createElement('h2');
            title.textContent = "Osprey's Eye Settings";
            title.style.margin = '0';
            title.style.color = '#66a3ff';
            
            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.style.backgroundColor = 'transparent';
            closeButton.style.border = 'none';
            closeButton.style.color = '#fff';
            closeButton.style.fontSize = '24px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = () => {
                modal.remove();
            };
            
            header.appendChild(title);
            header.appendChild(closeButton);
            modalContent.appendChild(header);
            
            // Create API key section
            const apiKeySection = document.createElement('div');
            apiKeySection.style.marginBottom = '20px';
            
            const apiKeyLabel = document.createElement('label');
            apiKeyLabel.textContent = 'API Key:';
            apiKeyLabel.style.display = 'block';
            apiKeyLabel.style.marginBottom = '5px';
            apiKeyLabel.style.fontWeight = 'bold';
            
            const apiKeyInput = document.createElement('input');
            apiKeyInput.type = 'text';
            apiKeyInput.value = this.storage.get('tsc-key') || '';
            apiKeyInput.className = 'osprey-blur';
            apiKeyInput.style.width = '100%';
            apiKeyInput.style.padding = '8px';
            apiKeyInput.style.marginBottom = '10px';
            apiKeyInput.style.backgroundColor = '#333';
            apiKeyInput.style.color = '#fff';
            apiKeyInput.style.border = '1px solid #3c5875';
            apiKeyInput.style.borderRadius = '3px';
            
            const saveApiKeyButton = document.createElement('button');
            saveApiKeyButton.textContent = 'Save API Key';
            saveApiKeyButton.className = 'osprey-button';
            saveApiKeyButton.onclick = () => {
                this.storage.set('tsc-key', apiKeyInput.value);
                this.showMessage(modalContent, 'API Key saved!', 'success');
            };
            
            apiKeySection.appendChild(apiKeyLabel);
            apiKeySection.appendChild(apiKeyInput);
            apiKeySection.appendChild(saveApiKeyButton);
            modalContent.appendChild(apiKeySection);
            
            // Create feature toggles section
            const featureSection = document.createElement('div');
            featureSection.style.marginBottom = '20px';
            
            const featureTitle = document.createElement('h3');
            featureTitle.textContent = 'Features';
            featureTitle.style.borderBottom = '1px solid #3c5875';
            featureTitle.style.paddingBottom = '5px';
            featureSection.appendChild(featureTitle);
            
            // Get current config
            const config = this.storage.getJSON(STORAGE_KEY_CONFIG) || DEFAULT_CONFIG;
            
            // Add toggle for each feature
            const features = [
                { id: 'showInlineStats', name: 'Show Inline Stats' },
                { id: 'enableFairFightIndicator', name: 'Enable Fair Fight Indicator' },
                { id: 'showFFGauge', name: 'Show FF Gauge on Profiles' },
                { id: 'showEstimationBox', name: 'Show Estimation Box' },
                { id: 'storeSavedEstimates', name: 'Store Saved Estimates' },
                { id: 'debugMode', name: 'Debug Mode' }
            ];
            
            features.forEach(feature => {
                const toggleContainer = document.createElement('div');
                toggleContainer.style.display = 'flex';
                toggleContainer.style.alignItems = 'center';
                toggleContainer.style.marginBottom = '10px';
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `toggle-${feature.id}`;
                checkbox.checked = config[feature.id] || false;
                checkbox.style.marginRight = '10px';
                
                const label = document.createElement('label');
                label.htmlFor = `toggle-${feature.id}`;
                label.textContent = feature.name;
                
                checkbox.onchange = () => {
                    config[feature.id] = checkbox.checked;
                    this.storage.setJSON(STORAGE_KEY_CONFIG, config);
                };
                
                toggleContainer.appendChild(checkbox);
                toggleContainer.appendChild(label);
                featureSection.appendChild(toggleContainer);
            });
            
            modalContent.appendChild(featureSection);
            
            // Add cache management section
            const cacheSection = document.createElement('div');
            cacheSection.style.marginBottom = '20px';
            
            const cacheTitle = document.createElement('h3');
            cacheTitle.textContent = 'Cache Management';
            cacheTitle.style.borderBottom = '1px solid #3c5875';
            cacheTitle.style.paddingBottom = '5px';
            cacheSection.appendChild(cacheTitle);
            
            const clearCacheButton = document.createElement('button');
            clearCacheButton.textContent = 'Clear Spy Cache';
            clearCacheButton.className = 'osprey-button';
            clearCacheButton.style.marginRight = '10px';
            clearCacheButton.onclick = () => {
                const count = this.storage.clearCache();
                this.showMessage(modalContent, `Cleared ${count} cached items!`, 'success');
            };
            
            const clearAllButton = document.createElement('button');
            clearAllButton.textContent = 'Reset All Settings';
            clearAllButton.className = 'osprey-button';
            clearAllButton.style.backgroundColor = '#c62828';
            clearAllButton.onclick = () => {
                if (confirm('Are you sure you want to reset all settings? This will clear your API key and all cached data.')) {
                    const count = this.storage.clear();
                    this.storage.setJSON(STORAGE_KEY_CONFIG, DEFAULT_CONFIG);
                    this.showMessage(modalContent, `Reset all settings! Cleared ${count} items.`, 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            };
            
            cacheSection.appendChild(clearCacheButton);
            cacheSection.appendChild(clearAllButton);
            modalContent.appendChild(cacheSection);
            
            // Add about section
            const aboutSection = document.createElement('div');
            
            const aboutTitle = document.createElement('h3');
            aboutTitle.textContent = 'About';
            aboutTitle.style.borderBottom = '1px solid #3c5875';
            aboutTitle.style.paddingBottom = '5px';
            aboutSection.appendChild(aboutTitle);
            
            const aboutText = document.createElement('p');
            aboutText.innerHTML = `Osprey's Eye v${VERSION}<br>
                                  Created by Homiewrecker [2687547]<br>
                                  An enhanced version combining features from multiple stat estimators and fair fight calculators.`;
            aboutSection.appendChild(aboutText);
            
            modalContent.appendChild(aboutSection);
            
            // Add modal to body
            modal.appendChild(modalContent);
            document.body.appendChild(modal);
            
            // Close modal when clicking outside
            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.remove();
                }
            };
        }
        
        // Show message in settings modal
        showMessage(container, message, type = 'info') {
            // Remove any existing message
            const existingMessage = container.querySelector('.osprey-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Create message
            const messageEl = document.createElement('div');
            messageEl.className = 'osprey-message';
            messageEl.textContent = message;
            messageEl.style.padding = '10px';
            messageEl.style.marginTop = '10px';
            messageEl.style.borderRadius = '3px';
            messageEl.style.textAlign = 'center';
            
            // Set colors based on type
            if (type === 'success') {
                messageEl.style.backgroundColor = '#2e7d32';
                messageEl.style.color = '#fff';
            } else if (type === 'error') {
                messageEl.style.backgroundColor = '#c62828';
                messageEl.style.color = '#fff';
            } else {
                messageEl.style.backgroundColor = '#1565c0';
                messageEl.style.color = '#fff';
            }
            
            // Add to container
            container.appendChild(messageEl);
            
            // Remove after a delay
            setTimeout(() => {
                messageEl.remove();
            }, 3000);
        }
    }
    
    // ========== Page Modules ==========
    
    // Helper function to extract player ID from element
    function getPlayerIdFromElement(element) {
        // Try to find player ID in href
        const profileLinks = element.querySelectorAll('a[href*="profiles.php"]');
        for (const link of profileLinks) {
            const match = link.href.match(/XID=(\d+)/);
            if (match) {
                return match[1];
            }
        }
        
        // Try parent elements if link is found but without ID
        if (element.parentElement) {
            const parentLinks = element.parentElement.querySelectorAll('a[href*="profiles.php"]');
            for (const link of parentLinks) {
                const match = link.href.match(/XID=(\d+)/);
                if (match) {
                    return match[1];
                }
            }
        }
        
        return null;
    }
    
    // Module: Profile Page
    const profileModule = new PageModule(
        'ProfilePage',
        'Shows stat estimates on profile pages',
        async function(module) {
            const profileContainer = await DOMHelpers.waitForElement('.profile-container', 15000);
            if (!profileContainer) {
                module.logger.warn('Could not find profile container');
                return;
            }
            
            const urlParams = new URLSearchParams(window.location.search);
            const targetId = urlParams.get('XID');
            if (!targetId) {
                module.logger.error('Could not find target ID in URL');
                return;
            }
            
            // Fetch spy data
            const spyData = await module.api.fetchSpy(targetId);
            if ('error' in spyData || spyData.success !== true) {
                module.logger.error('Failed to fetch spy data', spyData);
                return;
            }
            
            // Create UI components
            const ui = new UIComponents(module.storage, module.logger, module.api, module.estimator);
            
            // Process the stats
            const { estimate } = spyData.spy;
            const statEstimate = { low: estimate.stats, high: estimate.stats * 1.1 }; // Add a small range
            const breakdown = module.estimator.generateStatBreakdown(statEstimate);
            
            // Add the estimation box
            ui.addEstimationBox(profileContainer, statEstimate, false, breakdown);
            
            // Add inline stats and estimate button
            ui.addInlineStatsAndButton(profileContainer, statEstimate, targetId);
            
            // Save to storage for future use
            const playerName = document.querySelector('.user-name, .name')?.textContent.trim();
            module.estimator.savePlayerEstimate(targetId, statEstimate, playerName);
        }
    );
    
    // Module: Attack Page
    const attackModule = new PageModule(
        'AttackPage',
        'Shows fair fight estimations on attack pages',
        async function(module) {
            // Extract the target ID from the URL
            const urlMatch = window.location.href.match(/user2ID=(\d+)/);
            if (!urlMatch) {
                module.logger.warn('Could not find target ID in attack URL');
                return;
            }
            
            const targetId = urlMatch[1];
            
            // Create or find a place to show FF info
            const h4List = document.querySelectorAll('h4');
            let infoContainer = null;
            
            for (const h4 of h4List) {
                if (h4.textContent === 'Attacking') {
                    infoContainer = document.createElement('div');
                    infoContainer.className = 'osprey-ff-info';
                    infoContainer.style.margin = '10px 0';
                    infoContainer.style.padding = '10px';
                    infoContainer.style.backgroundColor = '#1e2129';
                    infoContainer.style.border = '1px solid #3c5875';
                    infoContainer.style.borderRadius = '5px';
                    infoContainer.style.color = '#fff';
                    infoContainer.style.textAlign = 'center';
                    infoContainer.innerHTML = '<img class="osprey-loader">';
                    
                    h4.parentNode.parentNode.after(infoContainer);
                    break;
                }
            }
            
            if (!infoContainer) {
                module.logger.warn('Could not find place to add FF info');
                return;
            }
            
            // Fetch spy data
            const spyData = await module.api.fetchSpy(targetId);
            if ('error' in spyData || spyData.success !== true) {
                module.logger.error('Failed to fetch spy data', spyData);
                infoContainer.textContent = 'Error: Could not fetch target stats';
                return;
            }
            
            // Get user's own stats
            const userData = await module.api.fetchUserData();
            if ('error' in userData) {
                module.logger.error('Failed to fetch user data', userData);
                infoContainer.innerHTML = `
                    <strong>Target Estimate:</strong> ${module.estimator.formatEstimateCompact(spyData.spy.estimate.stats)}<br>
                    <em>Set your API key to see Fair Fight calculations</em>
                `;
                return;
            }
            
            // Calculate FF
            const userTotalStats = userData.strength + userData.speed + userData.defense + userData.dexterity;
            const userStats = { low: userTotalStats, high: userTotalStats };
            const targetStats = { low: spyData.spy.estimate.stats, high: spyData.spy.estimate.stats * 1.1 };
            
            const fairFight = module.api.calculateFairFight(userStats, targetStats);
            
            // Update the info container
            infoContainer.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <div style="text-align:left;">
                        <strong>Your Stats:</strong> ${DOMHelpers.formatNumber(userTotalStats)}
                    </div>
                    <div style="text-align:right;">
                        <strong>Target Est:</strong> ${module.estimator.formatEstimateCompact(targetStats)}
                    </div>
                </div>
                <div style="margin:10px 0; height:20px; background-color:#333; border-radius:10px; overflow:hidden; position:relative;">
                    <div style="width:${fairFight.percentage}%; height:100%; background-color:${fairFight.color};"></div>
                </div>
                <div style="font-weight:bold; color:${fairFight.color};">
                    Fair Fight: ${fairFight.percentage}% (${fairFight.description})
                </div>
            `;
        }
    );
    
    // Module: Faction Page
    const factionModule = new PageModule(
        'FactionPage',
        'Shows stat estimates on faction pages',
        async function(module) {
            // Check if we're on a faction page
            if (!window.location.href.includes('factions.php?step=profile')) {
                return;
            }
            
            // Find faction member list
            const memberList = await DOMHelpers.waitForElement('.faction-info-wrap .table-body > li:nth-child(1)', 15000);
            if (!memberList) {
                module.logger.warn('Could not find faction member list');
                return;
            }
            
            // Process all members
            const tableRows = document.querySelectorAll('.faction-info-wrap .table-body > li');
            for (const row of tableRows) {
                // Find member box
                const memberBox = row.querySelector('[class*="userInfoBox"]');
                if (!memberBox) continue;
                
                // Adjust style for space
                memberBox.style.width = '169px';
                memberBox.style.overflow = 'hidden';
                memberBox.style.textOverflow = 'ellipsis';
                
                // Find profile link
                const profileLink = memberBox.querySelector('a[href*="profiles.php"]');
                if (!profileLink) continue;
                
                // Extract ID
                const playerId = profileLink.href.split('XID=')[1];
                if (!playerId) continue;
                
                // Fetch spy data
                module.api.fetchSpy(playerId).then(spyData => {
                    if ('error' in spyData || spyData.success !== true) {
                        module.logger.warn(`Failed to fetch spy for ${playerId}`, spyData);
                        return;
                    }
                    
                    // Format for display
                    const { spyText, tooltipText } = module.estimator.formatSpyForDisplay(spyData);
                    
                    // Create and add the spy element
                    const spyElement = document.createElement('div');
                    spyElement.className = 'osprey-faction-spy';
                    spyElement.textContent = spyText;
                    spyElement.title = tooltipText;
                    
                    memberBox.after(spyElement);
                });
            }
        }
    );
    
    // Module: Faction War Page
    const factionWarModule = new PageModule(
        'FactionWarPage',
        'Shows stat estimates on faction war pages',
        async function(module) {
            // Check if we're on a faction war page
            if (!window.location.href.includes('factions.php?step=') || 
                (!window.location.href.includes('/war/rank') && !window.location.href.includes('/war/raid'))) {
                return;
            }
            
            // Function to process members
            const processMembers = async () => {
                const memberElements = document.querySelectorAll('div.member.icons.left');
                if (!memberElements.length) {
                    module.logger.warn('Could not find faction war members');
                    return;
                }
                
                for (const memberElement of memberElements) {
                    // Find profile link
                    const profileLink = memberElement.querySelector('a[href*="profiles.php"]');
                    if (!profileLink) continue;
                    
                    // Extract ID
                    const playerId = profileLink.href.split('XID=')[1];
                    if (!playerId) continue;
                    
                    // Skip if already processed
                    if (memberElement.parentElement.querySelector('.osprey-faction-war')) continue;
                    
                    // Create placeholder
                    const spyElement = document.createElement('div');
                    spyElement.className = 'osprey-faction-war';
                    spyElement.innerHTML = '<img class="osprey-loader">';
                    memberElement.parentElement.appendChild(spyElement);
                    
                    // Fetch spy data
                    module.api.fetchSpy(playerId).then(spyData => {
                        // Clear loader
                        spyElement.innerHTML = '';
                        
                        if ('error' in spyData || spyData.success !== true) {
                            module.logger.warn(`Failed to fetch spy for ${playerId}`, spyData);
                            spyElement.textContent = 'Error: ' + (spyData.message || module.api.getErrorMessage(spyData.code));
                            return;
                        }
                        
                        // Format for display
                        const { longTextInterval, longTextEstimate, toolTipText } = module.estimator.formatSpyForFaction(spyData);
                        
                        // Set content
                        spyElement.title = toolTipText;
                        spyElement.appendChild(document.createElement('span')).textContent = longTextEstimate;
                        
                        if (longTextInterval) {
                            spyElement.appendChild(document.createElement('span')).textContent = longTextInterval;
                        }
                    });
                }
            };
            
            // Process immediately
            await processMembers();
            
            // Set up observer for dynamic content
            const observer = new MutationObserver(() => {
                processMembers();
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
        }
    );
    
    // Module: FF Gauge
    const ffGaugeModule = new PageModule(
        'FFGauge',
        'Shows fair fight gauge/arrow on various pages',
        async function(module) {
            // Skip if FF gauge is disabled
            if (!module.storage.getBoolean('showFFGauge')) {
                return;
            }
            
            // Create UI components
            const ui = new UIComponents(module.storage, module.logger, module.api, module.estimator);
            
            // Function to find elements with user profiles on the page
            const findProfileElements = () => {
                const elements = [];
                
                const possibleSelectors = [
                    '.honor-text-wrap',
                    '.member',
                    '.employee',
                    '.name',
                    '.listed',
                    '.target',
                    '.last-poster',
                    '.starter',
                    '.last-post',
                    '.poster',
                    '[class^="userInfoBox__"]'
                ];
                
                for (const selector of possibleSelectors) {
                    const found = document.querySelectorAll(selector);
                    if (found.length) {
                        elements.push(...found);
                    }
                }
                
                return elements;
            };
            
            // Function to process elements and add FF gauges
            const processElements = async (elements) => {
                // Filter out elements that already have a gauge
                elements = elements.filter(e => !e.classList.contains('osprey-ff-gauge'));
                
                // Extract player IDs
                const elementMap = [];
                for (const element of elements) {
                    const playerId = getPlayerIdFromElement(element);
                    if (playerId) {
                        elementMap.push({ element, playerId });
                    }
                }
                
                // Batch fetch spy data
                for (const { element, playerId } of elementMap) {
                    // First try to get from cache
                    const cachedSpyData = module.storage.getJSON(`spy-${playerId}`);
                    if (cachedSpyData && cachedSpyData.spy) {
                        const fairFightValue = cachedSpyData.spy.estimate.fairFight || 
                                              (cachedSpyData.spy.statInterval ? cachedSpyData.spy.statInterval.fairFight : null);
                        
                        if (fairFightValue) {
                            ui.addFFGauge(element, playerId, fairFightValue);
                        }
                    }
                    
                    // Fetch fresh data if needed
                    module.api.fetchSpy(playerId).then(spyData => {
                        if ('error' in spyData || !spyData.success) return;
                        
                        const fairFightValue = spyData.spy.estimate.fairFight || 
                                             (spyData.spy.statInterval ? spyData.spy.statInterval.fairFight : null);
                        
                        if (fairFightValue) {
                            ui.addFFGauge(element, playerId, fairFightValue);
                        }
                    });
                }
            };
            
            // Initial processing
            const initialElements = findProfileElements();
            await processElements(initialElements);
            
            // Observer for dynamic content
            const observer = new MutationObserver(() => {
                const newElements = findProfileElements();
                processElements(newElements);
            });
            
            observer.observe(document.body, { childList: true, subtree: true });
        }
    );
    
    // Module: Settings Button
    const settingsModule = new PageModule(
        'SettingsButton',
        'Adds a settings button to the page',
        async function(module) {
            // Find a good place to add the settings button
            const areas = [
                '.header-wrapper .delimiter',
                '.overview .delimiter',
                '#top-page-links-list'
            ];
            
            let targetElement = null;
            for (const selector of areas) {
                const element = document.querySelector(selector);
                if (element) {
                    targetElement = element;
                    break;
                }
            }
            
            if (!targetElement) {
                // Try to add to the bottom of the page
                targetElement = document.querySelector('.content-wrapper');
            }
            
            if (!targetElement) {
                module.logger.warn('Could not find a place to add settings button');
                return;
            }
            
            // Create the button
            const settingsButton = document.createElement('div');
            settingsButton.innerHTML = `
                <span style="cursor:pointer; margin: 0 5px; color:#66a3ff;">
                    <i class="fas fa-eye"></i> Osprey
                </span>
            `;
            settingsButton.style.display = 'inline-block';
            settingsButton.style.marginLeft = '5px';
            
            // Add click handler
            settingsButton.onclick = () => {
                const ui = new UIComponents(module.storage, module.logger, module.api, module.estimator);
                ui.showSettingsModal();
            };
            
            // Add to page
            targetElement.appendChild(settingsButton);
        }
    );
    
    // Start all modules
    const modules = [
        profileModule,
        attackModule,
        factionModule,
        factionWarModule,
        ffGaugeModule,
        settingsModule
    ];
    
    modules.forEach(module => module.start());
    
    // Log initialization
    logger.info(`Enhanced Osprey's Eye v${VERSION} initialized`);
})();