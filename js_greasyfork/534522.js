// ==UserScript==
// @name         Magnet Link Hash Checker with Persistent Cache, 1337x Support, and Configurable Progress
// @namespace    http://YOUR_NAMESPACE.com
// @version      7.5.4
// @license      MIT
// @description  Collects magnet link hashes, checks on Offcloud, Torbox, and PikPak and marks cached ones with download options. Includes auto-magnet loading for 1337x listings with persistent cache support, configurable concurrency, cache duration, and detailed progress popups. PikPak integration with lazy auth and local cache for instant repeat lookups. Multi-account support for all providers.
// @include      http://*
// @include      https://*
// @noframes
// @icon         https://i.ibb.co/DH9kn5Bk/Magnet-Link-Checker-icon.png
// @require      https://update.greasyfork.org/scripts/526770/1710873/Dynamic%20Include%20Sites%20Script%20%28Protocol-Independent%29.js
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @connect      offcloud.com
// @connect      torbox.app
// @connect      mypikpak.com
// @downloadURL https://update.greasyfork.org/scripts/534522/Magnet%20Link%20Hash%20Checker%20with%20Persistent%20Cache%2C%201337x%20Support%2C%20and%20Configurable%20Progress.user.js
// @updateURL https://update.greasyfork.org/scripts/534522/Magnet%20Link%20Hash%20Checker%20with%20Persistent%20Cache%2C%201337x%20Support%2C%20and%20Configurable%20Progress.meta.js
// ==/UserScript==

window.SCRIPT_STORAGE_KEY = "magnetLinkHashChecker"; // UNIQUE STORAGE KEY

// Add this in @require directive when using with Tampermonkey only. With other script managers it breaks everything
// @require      https://update.greasyfork.org/scripts/516445/1480246/Make%20GM%20xhr%20more%20parallel%20again.js

// Old library -v4.0
// @require      https://update.greasyfork.org/scripts/526770/1670393/Dynamic%20Include%20Sites%20Script%20%28Protocol-Independent%29.js

// Define custom options schema (optional - legacy options always included)
window.SCRIPT_OPTIONS = {
    definitions: {
        // Boolean option
        enableFeatureX: {
            type: 'boolean',
            default: false,
            label: 'Enable Feature X',
            description: 'Activates the experimental feature X',
            group: 'Features'
        },
        // Number option with validation
        maxRetries: {
            type: 'number',
            default: 3,
            min: 1,
            max: 10,
            step: 1,
            label: 'Maximum Retries',
            description: 'Number of retry attempts for failed requests',
            group: 'Performance'
        },
        // Select/dropdown option
        theme: {
            type: 'select',
            options: [
                { value: 'auto', label: 'System Default' },
                { value: 'light', label: 'Light Theme' },
                { value: 'dark', label: 'Dark Theme' }
            ],
            default: 'auto',
            label: 'Color Theme',
            group: 'Appearance'
        },
        // String option
        apiEndpoint: {
            type: 'string',
            default: 'https://api.example.com',
            label: 'API Endpoint',
            placeholder: 'Enter API URL',
            maxLength: 200,
            group: 'Advanced'
        },
        // Array option
        blockedDomains: {
            type: 'array',
            itemType: 'string',
            default: [],
            label: 'Blocked Domains',
            description: 'Domains to exclude from processing',
            maxItems: 50,
            group: 'Filtering'
        }
    },
    groups: {
        'Features': { order: 1, collapsed: false },
        'Performance': { order: 2, collapsed: true },
        'Appearance': { order: 3, collapsed: false },
        'Advanced': { order: 4, collapsed: true },
        'Filtering': { order: 5, collapsed: true }
    }
};


window.GET_DEFAULT_LIST = function() {
    return [
        { pattern: "*1337x.*", preProcessingRequired: false, postProcessingRequired: false, onDemandFloatingButtonRequired: false, backgroundChangeObserverRequired: false },
        { pattern: "*yts.*", preProcessingRequired: true, postProcessingRequired: true, onDemandFloatingButtonRequired: false, backgroundChangeObserverRequired: false },
        { pattern: "*torrentgalaxy.*", preProcessingRequired: false, postProcessingRequired: true, onDemandFloatingButtonRequired: false, backgroundChangeObserverRequired: false },
        { pattern: "*bitsearch.*", preProcessingRequired: false, postProcessingRequired: false, onDemandFloatingButtonRequired: false, backgroundChangeObserverRequired: false },
        { pattern: "*thepiratebay.*", preProcessingRequired: false, postProcessingRequired: false, onDemandFloatingButtonRequired: false, backgroundChangeObserverRequired: false },
        { pattern: "*ext.*", preProcessingRequired: false, postProcessingRequired: false, onDemandFloatingButtonRequired: false, backgroundChangeObserverRequired: false }
    ];
};


(async function () {
    'use strict';

    // ==================== SITE ELIGIBILITY CHECK - MUST RUN FIRST ====================
    // ✅ Wait until `shouldRunOnThisSite` is available
    // ✅ CRITICAL: Check site eligibility BEFORE loading ANY resources into memory
    // This ensures ZERO CPU cycles and memory usage on non-eligible sites
    try {
        while (typeof shouldRunOnThisSite === 'undefined') {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    
        if (!(await shouldRunOnThisSite())) {
            // Site not eligible - stop execution completely, no resources loaded
            return;
        }
    } catch (error) {
        console.error('[magnetLinkChecker] Error checking site eligibility:', error);
        return;
    }

    // ==================== SITE IS ELIGIBLE - NOW LOAD RESOURCES ====================
    console.log("Pre-Customization enabled for this site: " + isPreProcessingRequired() );
    console.log("Post-Customization enabled for this site: " + isPostProcessingRequired() );

    // ==================== ULTRA-OPTIMIZED PERFORMANCE SYSTEM ====================
    const PerformanceMetrics = {
        timers: new Map(),
        counters: new Map(),
        memory: [],
        
        start(label) {
            this.timers.set(label, performance.now());
        },
        
        end(label) {
            const start = this.timers.get(label);
            if (start) {
                const duration = performance.now() - start;
                this.timers.delete(label);
                return duration;
            }
            return 0;
        },
        
        increment(counter) {
            this.counters.set(counter, (this.counters.get(counter) || 0) + 1);
        },
        
        recordMemory() {
            if (performance.memory) {
                this.memory.push({
                    timestamp: Date.now(),
                    usedJSHeapSize: performance.memory.usedJSHeapSize,
                    totalJSHeapSize: performance.memory.totalJSHeapSize
                });
            }
        },
        
        getReport() {
            const report = {
                counters: Object.fromEntries(this.counters),
                memory: this.memory
            };
            return report;
        },
        
        reset() {
            this.timers.clear();
            this.counters.clear();
            this.memory = [];
        }
    };

    // ==================== OBJECT POOLING FOR MEMORY EFFICIENCY ====================
    const ObjectPool = {
        buttonPool: [],
        spanPool: [],
        
        getButton() {
            if (this.buttonPool.length > 0) {
                const btn = this.buttonPool.pop();
                btn.onclick = null;
                btn.textContent = '';
                return btn;
            }
            return document.createElement('button');
        },
        
        releaseButton(btn) {
            if (this.buttonPool.length < 50) { // Keep max 50 in pool
                this.buttonPool.push(btn);
            }
        },
        
        getSpan() {
            if (this.spanPool.length > 0) {
                const span = this.spanPool.pop();
                span.textContent = '';
                return span;
            }
            return document.createElement('span');
        },
        
        releaseSpan(span) {
            if (this.spanPool.length < 50) {
                this.spanPool.push(span);
            }
        }
    };

    // ==================== REQUEST DEDUPLICATION ====================
    const RequestCache = {
        pending: new Map(),
        completed: new Map(),
        MAX_COMPLETED_SIZE: 500, // MEMORY LEAK FIX: Limit completed cache size
        
        async dedupedRequest(key, requestFn) {
            // Return cached result if available
            if (this.completed.has(key)) {
                PerformanceMetrics.increment('requestCacheHits');
                return this.completed.get(key);
            }
            
            // Wait for pending request if in flight
            if (this.pending.has(key)) {
                PerformanceMetrics.increment('requestDeduped');
                return this.pending.get(key);
            }
            
            // Make new request
            const promise = requestFn().then(result => {
                // MEMORY LEAK FIX: Trim cache if over limit (remove oldest 20%)
                if (this.completed.size >= this.MAX_COMPLETED_SIZE) {
                    const removeCount = Math.floor(this.MAX_COMPLETED_SIZE * 0.2);
                    const iterator = this.completed.keys();
                    for (let i = 0; i < removeCount; i++) {
                        const oldKey = iterator.next().value;
                        if (oldKey) this.completed.delete(oldKey);
                    }
                }
                this.completed.set(key, result);
                this.pending.delete(key);
                return result;
            }).catch(error => {
                this.pending.delete(key);
                throw error;
            });
            
            this.pending.set(key, promise);
            return promise;
        },
        
        clear() {
            this.completed.clear();
            // Don't clear pending to avoid duplicate requests
        }
    };

    // ==================== CROSS-TAB CACHE SYNCHRONIZATION - REMOVED ====================
    // Feature removed to prevent initialization race conditions

    // ==================== INTERSECTION OBSERVER FOR LAZY PROCESSING ====================
    const LazyProcessor = {
        observer: null,
        pendingElements: new Map(),
        
        init(callback) {
            if (!('IntersectionObserver' in window)) return null;
            
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const data = this.pendingElements.get(element);
                        if (data) {
                            callback(element, data);
                            this.observer.unobserve(element);
                            this.pendingElements.delete(element);
                            PerformanceMetrics.increment('lazyProcessed');
                        }
                    }
                });
            }, {
                rootMargin: '200px', // Start processing 200px before visible
                threshold: 0.01
            });
            
            return this.observer;
        },
        
        observe(element, data) {
            if (!this.observer) {
                // Fallback: process immediately if no observer
                return false;
            }
            this.pendingElements.set(element, data);
            this.observer.observe(element);
            return true;
        },
        
        disconnect() {
            if (this.observer) {
                this.observer.disconnect();
                this.pendingElements.clear();
            }
        }
    };

    // ==================== IDLE CALLBACK SCHEDULER ====================
    const IdleScheduler = {
        tasks: [],
        isProcessing: false,
        
        schedule(task, priority = 'low') {
            this.tasks.push({ task, priority });
            if (!this.isProcessing) {
                this.process();
            }
        },
        
        process() {
            if (this.tasks.length === 0) {
                this.isProcessing = false;
                return;
            }
            
            this.isProcessing = true;
            const callback = 'requestIdleCallback' in window ? requestIdleCallback : requestAnimationFrame;
            
            callback((deadline) => {
                const startTime = performance.now();
                
                while (this.tasks.length > 0 && (
                    !deadline.timeRemaining ? true : deadline.timeRemaining() > 0
                )) {
                    const { task } = this.tasks.shift();
                    try {
                        task();
                    } catch (error) {
                        console.error('[magnetLinkChecker] Idle task error:', error);
                    }
                    
                    // Prevent blocking for too long
                    if (performance.now() - startTime > 50) break;
                }
                
                this.process();
            }, { timeout: 2000 });
        }
    };

    const OFFCLOUD_CACHE_API_URL = 'https://offcloud.com/api/cache';
    const OFFCLOUD_CLOUD_API_URL = 'https://offcloud.com/api/cloud';
    const TORBOX_API_BASE_URL = 'https://api.torbox.app/v1/api';
    const OFFCLOUD_ENABLED_KEY = 'offcloud_enabled';
    const TORBOX_ENABLED_KEY = 'torbox_enabled';
    const ENABLE_1337X_SUPPORT_KEY = 'enable_1337x_support';
    const SHOW_PROGRESS_BAR_KEY = 'show_progress_bar';
    const CONCURRENCY_LEVEL_KEY = 'concurrency_level';
    const CACHE_ENABLED_KEY = 'cache_enabled';
    const CACHE_DURATION_KEY = 'cache_duration_days';
    const CACHE_STORAGE_KEY = 'magnet_cache';
    const BATCH_SIZE_KEY = 'batch_size';
    const PERFORMANCE_METRICS_ENABLED_KEY = 'performance_metrics_enabled';
    const CLOUDFLARE_BYPASS_ENABLED_KEY = 'cloudflare_bypass_enabled';
    const SHOW_MAGNET_LINK_1337X_KEY = 'show_magnet_link_1337x';
    const SHOW_CREDENTIALS_KEY = 'show_credentials';
    
    // ==================== PIKPAK API ENDPOINTS AND CONSTANTS ====================
    const PIKPAK_CACHE_CHECK_URL = 'https://api-drive.mypikpak.com/drive/v1/resource/status';
    const PIKPAK_ADD_FILE_URL = 'https://api-drive.mypikpak.com/drive/v1/files';
    const PIKPAK_LIST_FOLDERS_URL = 'https://api-drive.mypikpak.com/drive/v1/files';
    const PIKPAK_CAPTCHA_INIT_URL = 'https://user.mypikpak.com/v1/shield/captcha/init';
    const PIKPAK_SIGNIN_URL = 'https://user.mypikpak.com/v1/auth/signin';
    
    // PikPak auth constants (fixed values to avoid CryptoJS dependency)
    const PIKPAK_CLIENT_ID = "YNxT9w7GMdWvEOKa";
    const PIKPAK_CLIENT_SECRET = "dbw2OtmVEeuUvIptb1Coyg";
    const PIKPAK_DEVICE_ID = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"; // Fixed MD5-like string
    const PIKPAK_USER_AGENT = 'accessmode/ devicename/Netease_Mumu appname/android-com.pikcloud.pikpak cmd/login appid/ action_type/ clientid/YNxT9w7GMdWvEOKa deviceid/56e000d71f4660700ca974f2305171c5 refresh_token/ grant_type/ networktype/WIFI devicemodel/MuMu accesstype/ sessionid/ osversion/6.0.1 datetime/1636364470779 sdkversion/1.0.1.101600 protocolversion/200 clientversion/ providername/NONE clientip/ session_origin/ devicesign/div101.56e000d71f4660700ca974f2305171c5b94c3d4196a9dd74e49d7710a7af873d platformversion/10 usrno/null';
    
    // PikPak storage keys
    const PIKPAK_ENABLED_KEY = 'pikpak_enabled';
    const PIKPAK_CACHE_KEY = 'pikpak_cache';
    const PIKPAK_CACHE_DURATION_KEY = 'pikpak_cache_duration_days';
    const PIKPAK_BATCH_SIZE_KEY = 'pikpak_batch_size';
    const PIKPAK_NO_AUTH_CHECK_KEY = 'pikpak_no_auth_check';
    const PIKPAK_SHOW_TOOLTIP_KEY = 'pikpak_show_tooltip';
    const PIKPAK_CACHE_CHECK_TIMEOUT_KEY = 'pikpak_cache_check_timeout';
    const PIKPAK_MAX_CACHE_ENTRIES = 10000; // Limit cache size (~500KB)
    
    // Multi-account storage keys
    const TORBOX_ACCOUNTS_KEY = 'torboxAccounts';
    const OFFCLOUD_ACCOUNTS_KEY = 'offcloudAccounts';
    const PIKPAK_ACCOUNTS_KEY = 'pikpakAccounts';
    
    const showIcons = false;
    const extendedHashRegexCheck = true;
    const showWarningPopupForExtendedHash = true;

    // ==================== PROVIDER ACCOUNT MANAGER ====================
    /**
     * Manages multi-account configurations for Debrid providers
     * Handles loading, saving, validation, and migration of account data
     */
    class ProviderAccountManager {
        constructor() {
            this.providers = {
                torbox: TORBOX_ACCOUNTS_KEY,
                offcloud: OFFCLOUD_ACCOUNTS_KEY,
                pikpak: PIKPAK_ACCOUNTS_KEY
            };
            this.accountsCache = new Map(); // Cache loaded accounts
            this.pendingLoads = new Map(); // RACE CONDITION FIX: Track pending load promises
        }

        /**
         * Load accounts for a provider
         * @param {string} provider - Provider name ('torbox', 'offcloud', 'pikpak')
         * @returns {Promise<Array>} Array of account objects
         */
        async loadAccounts(provider) {
            // Return cached data if available
            if (this.accountsCache.has(provider)) {
                return this.accountsCache.get(provider);
            }
            
            // RACE CONDITION FIX: If load is already in progress, wait for it
            if (this.pendingLoads.has(provider)) {
                return await this.pendingLoads.get(provider);
            }
            
            const storageKey = this.providers[provider];
            if (!storageKey) {
                console.error(`[AccountManager] Unknown provider: ${provider}`);
                return [];
            }
            
            // Create and track the pending promise
            const loadPromise = (async () => {
                const accounts = await GM_getValue(storageKey, []);
                this.accountsCache.set(provider, accounts);
                this.pendingLoads.delete(provider); // Clear pending flag
                return accounts;
            })();
            
            this.pendingLoads.set(provider, loadPromise);
            return await loadPromise;
        }

        /**
         * Save accounts for a provider
         * @param {string} provider - Provider name
         * @param {Array} accounts - Array of account objects
         */
        async saveAccounts(provider, accounts) {
            const storageKey = this.providers[provider];
            if (!storageKey) {
                console.error(`[AccountManager] Unknown provider: ${provider}`);
                return;
            }
            
            await GM_setValue(storageKey, accounts);
            this.accountsCache.set(provider, accounts);
        }

        /**
         * Add a new account
         * @param {string} provider - Provider name
         * @param {Object} accountData - Account data (nickname, shortCode, credentials, etc.)
         * @returns {Promise<Object>} The created account with ID
         */
        async addAccount(provider, accountData) {
            const accounts = await this.loadAccounts(provider);
            
            // Generate unique ID
            const newAccount = {
                id: `${provider}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                enabled: accountData.enabled !== undefined ? accountData.enabled : true,
                nickname: accountData.nickname || '',
                shortCode: accountData.shortCode || this._generateDefaultShortCode(provider, accounts.length + 1),
                ...accountData
            };
            
            accounts.push(newAccount);
            await this.saveAccounts(provider, accounts);
            
            return newAccount;
        }

        /**
         * Update an existing account
         * @param {string} provider - Provider name
         * @param {string} accountId - Account ID
         * @param {Object} changes - Changes to apply
         */
        async updateAccount(provider, accountId, changes) {
            const accounts = await this.loadAccounts(provider);
            const index = accounts.findIndex(acc => acc.id === accountId);
            
            if (index === -1) {
                console.error(`[AccountManager] Account not found: ${accountId}`);
                return;
            }
            
            accounts[index] = { ...accounts[index], ...changes };
            await this.saveAccounts(provider, accounts);
        }

        /**
         * Delete an account
         * @param {string} provider - Provider name
         * @param {string} accountId - Account ID
         */
        async deleteAccount(provider, accountId) {
            const accounts = await this.loadAccounts(provider);
            const filtered = accounts.filter(acc => acc.id !== accountId);
            await this.saveAccounts(provider, filtered);
        }

        /**
         * Get all enabled accounts
         * @param {string} provider - Provider name
         * @returns {Promise<Array>} Array of enabled accounts
         */
        async getEnabledAccounts(provider) {
            const accounts = await this.loadAccounts(provider);
            return accounts.filter(acc => acc.enabled);
        }

        /**
         * Get primary account (first enabled account)
         * @param {string} provider - Provider name
         * @returns {Promise<Object|null>} Primary account or null
         */
        async getPrimaryAccount(provider) {
            const enabledAccounts = await this.getEnabledAccounts(provider);
            return enabledAccounts.length > 0 ? enabledAccounts[0] : null;
        }

        /**
         * Validate and check for duplicate credentials
         * @param {string} provider - Provider name
         * @param {Object} credentials - Credentials to check
         * @returns {Promise<Object>} { isDuplicate: boolean, existingAccount: Object|null, message: string }
         */
        async validateDuplicate(provider, credentials) {
            const accounts = await this.loadAccounts(provider);
            
            let duplicate = null;
            
            if (provider === 'pikpak') {
                // Check for duplicate username+password combination
                duplicate = accounts.find(acc => 
                    acc.username === credentials.username && 
                    acc.password === credentials.password
                );
            } else {
                // Check for duplicate API key
                duplicate = accounts.find(acc => acc.apiKey === credentials.apiKey);
            }
            
            if (duplicate) {
                return {
                    isDuplicate: true,
                    existingAccount: duplicate,
                    message: `This ${provider === 'pikpak' ? 'username/password combination' : 'API key'} is already configured in account "${duplicate.nickname || duplicate.id}"`
                };
            }
            
            return { isDuplicate: false, existingAccount: null, message: '' };
        }

        /**
         * Generate default shortCode for a provider
         * @param {string} provider - Provider name
         * @param {number} accountNumber - Account number
         * @returns {string} Default shortCode
         */
        _generateDefaultShortCode(provider, accountNumber) {
            const codes = {
                torbox: 'TB',
                offcloud: 'OC',
                pikpak: 'PKP'
            };
            
            return accountNumber === 1 ? codes[provider] : `${codes[provider]}${accountNumber}`;
        }

        /**
         * Clear cache (useful when accounts are modified externally)
         */
        clearCache() {
            this.accountsCache.clear();
            this.pendingLoads.clear();
        }
    }

    // Initialize the account manager
    const accountManager = new ProviderAccountManager();

    // ==================== OPTIMIZED REGEX PATTERNS (Compiled once) ====================
    const REGEX_PATTERNS = {
        hash40: /urn:btih:([a-fA-F0-9]{40})/,
        hash32: /urn:btih:([a-zA-Z0-9]{32})/,
        magnetLink: /href="(magnet:[^"]+)"/,
        validInfoHash: /^[a-fA-F0-9]{40}$/,
        infoHashInline: /(info\s?hash:?)\s*([a-fA-F0-9]{40})/gi
    };

    // ==================== BASE32 LOOKUP TABLE (Pre-computed) ====================
    const BASE32_LOOKUP = (() => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        const map = new Map();
        for (let i = 0; i < chars.length; i++) {
            map.set(chars[i], i.toString(2).padStart(5, '0'));
        }
        return map;
    })();

    let offcloudEnabled = await GM_getValue(OFFCLOUD_ENABLED_KEY, true);
    let torboxEnabled = await GM_getValue(TORBOX_ENABLED_KEY, true);
    let enable1337xSupport = await GM_getValue(ENABLE_1337X_SUPPORT_KEY, true);
    let showProgressBar = await GM_getValue(SHOW_PROGRESS_BAR_KEY, true);
    let concurrencyLevel = await GM_getValue(CONCURRENCY_LEVEL_KEY, 5);
    let cacheEnabled = await GM_getValue(CACHE_ENABLED_KEY, true);
    let cacheDurationDays = await GM_getValue(CACHE_DURATION_KEY, 60);
    let batchSize = await GM_getValue(BATCH_SIZE_KEY, 20);
    let performanceMetricsEnabled = await GM_getValue(PERFORMANCE_METRICS_ENABLED_KEY, true);
    let cloudflareBypassEnabled = await GM_getValue(CLOUDFLARE_BYPASS_ENABLED_KEY, true);
    let showMagnetLink1337x = await GM_getValue(SHOW_MAGNET_LINK_1337X_KEY, true);
    let showCredentials = await GM_getValue(SHOW_CREDENTIALS_KEY, false);
    
    // ==================== PIKPAK STATE VARIABLES ====================
    let pikpakEnabled = await GM_getValue(PIKPAK_ENABLED_KEY, true);
    let pikpakCacheDurationDays = await GM_getValue(PIKPAK_CACHE_DURATION_KEY, 365);
    let pikpakBatchSize = await GM_getValue(PIKPAK_BATCH_SIZE_KEY, 5);
    let pikpakNoAuthCheck = await GM_getValue(PIKPAK_NO_AUTH_CHECK_KEY, true);
    let pikpakShowTooltip = await GM_getValue(PIKPAK_SHOW_TOOLTIP_KEY, false); // Disabled by default
    let pikpakCacheCheckTimeout = await GM_getValue(PIKPAK_CACHE_CHECK_TIMEOUT_KEY, 30); // Timeout in seconds
    let pikpakCache = new Map(); // Local cache for positive "OK" results
    let pikpakCacheModified = false;
    let unsavedPikPakCacheKeys = new Set(); // Track keys not yet saved (fixes race condition - mirrors magnet cache pattern)
    const pikpakButtonMap = new Map(); // Map hash -> array of button elements (supports duplicate hashes)
    
    /**
     * MEMORY LEAK FIX: Get buttons from pikpakButtonMap with automatic cleanup of disconnected elements.
     * This avoids periodic timers - cleanup happens lazily on access.
     * @param {string} hash - Magnet hash
     * @returns {Array} Array of connected button elements
     */
    function getPikPakButtons(hash) {
        const buttons = pikpakButtonMap.get(hash);
        if (!buttons || buttons.length === 0) return [];
        
        // Filter to only connected buttons
        const connected = buttons.filter(btn => btn && btn.isConnected);
        
        // Update or delete the entry based on what's left
        if (connected.length === 0) {
            pikpakButtonMap.delete(hash);
        } else if (connected.length < buttons.length) {
            pikpakButtonMap.set(hash, connected);
        }
        
        return connected;
    }

    // ==================== MULTI-ACCOUNT INITIALIZATION ====================
    // Load multi-account configurations
    let torboxAccounts = await accountManager.loadAccounts('torbox');
    let offcloudAccounts = await accountManager.loadAccounts('offcloud');
    let pikpakAccounts = await accountManager.loadAccounts('pikpak');
    
    // Multi-account auth state tracking (for PikPak)
    const pikpakAuthStates = new Map(); // accountId -> { authInProgress: Promise|null, authData: Object|null }

    // ==================== ULTRA-OPTIMIZED CACHE (Map + WeakMap) ====================
    let magnetCache;
    let cacheModified = false;
    let unsavedCacheKeys = new Set(); // Track keys not yet saved (fixes race condition bug)
    const domCache = new WeakMap(); // Cache DOM references to prevent memory leaks
    const computedStylesCache = new WeakMap(); // Cache computed styles

    // Helper function to store cache with compression awareness
    async function storeCache() {
        try {
            // FIX: Check unsaved keys instead of cacheModified flag (prevents race condition)
            if (unsavedCacheKeys.size === 0) {
                return;
            }
            
            PerformanceMetrics.start('storeCache');
            const now = Date.now();
            const expiryLimit = cacheDurationDays * 24 * 60 * 60 * 1000;
            
            // Capture keys to save and clear immediately (prevent race condition)
            const keysToSave = Array.from(unsavedCacheKeys);
            unsavedCacheKeys.clear();
            
            // Convert Map to Object and clean expired entries in one pass
            const cleanedCache = {};
            let entriesKept = 0;
            let entriesRemoved = 0;
            
            for (const [url, data] of magnetCache) {
                if (now - data.timestamp <= expiryLimit) {
                    cleanedCache[url] = data;
                    entriesKept++;
                } else {
                    entriesRemoved++;
                }
            }
            
            await GM_setValue(CACHE_STORAGE_KEY, cleanedCache);
            cacheModified = false;
            
            const duration = PerformanceMetrics.end('storeCache');
            if (performanceMetricsEnabled) {
                console.log(`[Performance] Cache stored: ${entriesKept} kept, ${entriesRemoved} expired, ${keysToSave.length} newly saved in ${duration.toFixed(2)}ms`);
            }
        } catch (error) {
            console.error('[magnetLinkChecker] Error storing cache:', error);
        }
    }

    // Function to clear the cache
    async function clearCache() {
        try {
            magnetCache = new Map();
            cacheModified = true;
            unsavedCacheKeys.clear(); // Clear unsaved tracking
            await GM_setValue(CACHE_STORAGE_KEY, {});
            RequestCache.clear();
        alert('Cache cleared successfully!');
        } catch (error) {
            console.error('[magnetLinkChecker] Error clearing cache:', error);
            alert('Error clearing cache. Check console for details.');
        }
    }

    // ==================== OPTIMIZED HASH EXTRACTION (Memoized) ====================
    const hashExtractionCache = new Map();
    
    function extractHashFromMagnet(magnetLink) {
        try {
            // Check cache first
            if (hashExtractionCache.has(magnetLink)) {
                PerformanceMetrics.increment('hashCacheHits');
                return hashExtractionCache.get(magnetLink);
            }
            
            let match = magnetLink.match(REGEX_PATTERNS.hash40);
            let result = null;
            
        if (!match && extendedHashRegexCheck) {
                match = magnetLink.match(REGEX_PATTERNS.hash32);
            if (match) {
                if (showWarningPopupForExtendedHash) {
                    showTemporaryMessage('Some Magnet Hashes on this page are 32 chars only and cache availability may not be 100% correct', '#ec7600');
                }
                    result = base32ToBase16(match[1].toLowerCase());
                }
            } else if (match) {
                result = match[1].toLowerCase();
            }
            
            // Cache the result (limit cache size)
            if (hashExtractionCache.size < 1000) {
                hashExtractionCache.set(magnetLink, result);
            }
            
            return result;
        } catch (error) {
            console.error('[magnetLinkChecker] Error extracting hash:', error);
            return null;
        }
    }

    // ==================== OPTIMIZED BASE32 CONVERSION ====================
    function base32ToBase16(infoHashBase32) {
        try {
        let bits = '';
            const upper = infoHashBase32.toUpperCase();
            for (let i = 0; i < upper.length; i++) {
                const val = BASE32_LOOKUP.get(upper[i]);
                if (val) {
                    bits += val;
                } else {
                    const charIndex = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'.indexOf(upper[i]);
                    bits += charIndex.toString(2).padStart(5, '0');
                }
        }

        let hex = '';
        for (let i = 0; i + 4 <= bits.length; i += 4) {
            const chunk = bits.substring(i, i + 4);
            hex += parseInt(chunk, 2).toString(16);
        }

        return hex;
        } catch (error) {
            console.error('[magnetLinkChecker] Error converting base32:', error);
            return '';
        }
    }

    // ==================== CACHED STYLE TEMPLATES WITH CSS CONTAINMENT ====================
    const buttonStyleCache = {
        base: {
            marginLeft: '2px',
            padding: '2px',
            border: 'none',
            borderRadius: '1px',
            cursor: 'pointer',
            alignItems: 'center',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
            contain: 'layout style paint', // CSS containment for better performance
            willChange: 'background-color', // Hint for GPU acceleration
            position: 'relative',
            zIndex: '1' // Ensure button is above other elements
        },
        cached: {
            backgroundColor: '#4CAF50',
            border: '2px solid #4CAF50',
            boxShadow: '0 0 10px 2px gold'
        },
        uncached: {
            backgroundColor: '#fff',
            border: '2px solid #808080',
            boxShadow: '0 0 10px rgba(128, 128, 128, 0.75)'
        }
    };

    function applyStyles(element, ...styleSets) {
        // Batch all style updates
        const combinedStyles = Object.assign({}, ...styleSets);
        Object.assign(element.style, combinedStyles);
    }

    // ==================== PIKPAK AUTH MODULE (Lazy - only used on button click) ====================
    const PikPakAuth = {
        /**
         * Ensures we have valid authentication for a specific account.
         * Uses per-account auth state tracking to prevent concurrent auth attempts.
         * @param {string} accountId - Account ID (optional, defaults to primary)
         * @returns {Promise<Object|null>} Auth data with access_token or null on failure
         */
        async ensureAuthenticated(accountId = null) {
            try {
                // Get account
                const account = accountId 
                    ? (await accountManager.loadAccounts('pikpak')).find(acc => acc.id === accountId)
                    : await accountManager.getPrimaryAccount('pikpak');
                
                if (!account) {
                    showTemporaryMessage('PikPak account not configured.', 'red');
                    return null;
                }
                
                // Check if we have valid cached auth for this account
                if (this.isTokenValid(account)) {
                    return account.authData;
                }
                
                // Get or create auth state for this account
                let authState = pikpakAuthStates.get(account.id);
                if (!authState) {
                    authState = { authInProgress: null, authData: account.authData || null };
                    pikpakAuthStates.set(account.id, authState);
                }
                
                // RACE CONDITION FIX: If auth is already in progress for this account, wait for it
                if (authState.authInProgress) {
                    if (performanceMetricsEnabled) {
                        console.log(`[PikPak] Auth already in progress for account ${account.nickname}, waiting...`);
                    }
                    return await authState.authInProgress;
                }
                
                // Check if credentials are configured
                if (!account.username || !account.password) {
                    showTemporaryMessage('PikPak credentials not configured for this account.', 'red');
                    return null;
                }
                
                // Start auth process and store the promise to prevent concurrent attempts
                authState.authInProgress = this._performAuth(account);
                
                try {
                    const result = await authState.authInProgress;
                    authState.authData = result;
                    return result;
                } finally {
                    // Clear the in-progress flag
                    authState.authInProgress = null;
                }
            } catch (error) {
                console.error('[PikPak] Auth error:', error);
                showTemporaryMessage('PikPak authentication error.', 'red');
                return null;
            }
        },
        
        /**
         * Internal auth implementation (called by ensureAuthenticated)
         * @param {Object} account - Account object with username/password
         * @private
         */
        async _performAuth(account) {
            // Init captcha
            const captchaData = await this.initCaptcha(account);
            if (!captchaData || !captchaData.captcha_token) {
                showTemporaryMessage('PikPak captcha initialization failed.', 'red');
                return null;
            }
            
            // Sign in
            const loginInfo = await this.signIn(captchaData.captcha_token, account);
            if (!loginInfo || !loginInfo.access_token) {
                showTemporaryMessage('PikPak sign-in failed. Check your credentials.', 'red');
                return null;
            }
            
            // Store auth data in account
            const authData = {
                captchaData: {
                    ...captchaData,
                    expires: Date.now() + (captchaData.expires_in ? captchaData.expires_in * 1000 : 3600000)
                },
                loginInfo: {
                    ...loginInfo,
                    expires: Date.now() + (loginInfo.expires_in ? loginInfo.expires_in * 1000 : 3600000)
                }
            };
            
            // Update account with auth data
            await accountManager.updateAccount('pikpak', account.id, { authData });
            
            return authData;
        },
        
        /**
         * Initialize captcha for PikPak auth
         * @param {Object} account - Account object with username
         * @returns {Promise<Object|null>} Captcha data or null on failure
         */
        async initCaptcha(account) {
            return new Promise((resolve) => {
                let meta = {};
                // Determine username type
                if (/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(account.username)) {
                    meta.email = account.username;
                } else if (/\d{11,18}/.test(account.username)) {
                    meta.phone_number = account.username;
                } else {
                    meta.username = account.username;
                }
                
                const params = {
                    client_id: PIKPAK_CLIENT_ID,
                    action: "POST:https://user.mypikpak.com/v1/auth/signin",
                    device_id: PIKPAK_DEVICE_ID,
                    meta: meta
                };
                
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: PIKPAK_CAPTCHA_INIT_URL,
                    data: JSON.stringify(params),
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': PIKPAK_USER_AGENT
                    },
                    timeout: 15000,
                    onload: (res) => {
                        if (res.status === 200) {
                            try {
                                resolve(JSON.parse(res.responseText));
                            } catch (e) {
                                console.error('[PikPak] Captcha parse error:', e);
                                resolve(null);
                            }
                        } else {
                            console.error('[PikPak] Captcha init failed:', res.status, res.responseText);
                            resolve(null);
                        }
                    },
                    onerror: (e) => {
                        console.error('[PikPak] Captcha init error:', e);
                        resolve(null);
                    },
                    ontimeout: () => {
                        console.error('[PikPak] Captcha init timeout');
                        resolve(null);
                    }
                });
            });
        },
        
        /**
         * Sign in to PikPak
         * @param {string} captchaToken - Token from captcha init
         * @param {Object} account - Account object with username/password
         * @returns {Promise<Object|null>} Login info or null on failure
         */
        async signIn(captchaToken, account) {
            return new Promise((resolve) => {
                const data = {
                    client_id: PIKPAK_CLIENT_ID,
                    client_secret: PIKPAK_CLIENT_SECRET,
                    password: account.password,
                    username: account.username,
                    captcha_token: captchaToken
                };
                
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: PIKPAK_SIGNIN_URL,
                    data: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'user-agent': PIKPAK_USER_AGENT
                    },
                    timeout: 15000,
                    onload: (res) => {
                        if (res.status === 200) {
                            try {
                                resolve(JSON.parse(res.responseText));
                            } catch (e) {
                                console.error('[PikPak] SignIn parse error:', e);
                                resolve(null);
                            }
                        } else {
                            console.error('[PikPak] SignIn failed:', res.status, res.responseText);
                            resolve(null);
                        }
                    },
                    onerror: (e) => {
                        console.error('[PikPak] SignIn error:', e);
                        resolve(null);
                    },
                    ontimeout: () => {
                        console.error('[PikPak] SignIn timeout');
                        resolve(null);
                    }
                });
            });
        },
        
        /**
         * Check if token is still valid
         * @param {Object} account - Account object with authData
         * @returns {boolean} True if token is valid
         */
        isTokenValid(account) {
            if (!account || !account.authData || !account.authData.loginInfo) return false;
            const now = Date.now();
            // Check if login token is still valid (with 5 min buffer)
            return account.authData.loginInfo.expires && (account.authData.loginInfo.expires - 300000) > now;
        },
        
        /**
         * Get auth headers for API calls (includes User-Agent to prevent 400 errors)
         * @param {Object} authData - Auth data object
         * @returns {Object|null} Headers object or null if not authenticated
         */
        getAuthHeaders(authData) {
            if (!authData || !authData.loginInfo) return null;
            return {
                'Authorization': `${authData.loginInfo.token_type || 'Bearer'} ${authData.loginInfo.access_token}`,
                'X-Captcha-Token': authData.captchaData?.captcha_token || '',
                'User-Agent': PIKPAK_USER_AGENT
            };
        }
    };

    // ==================== PIKPAK CACHE STORAGE FUNCTIONS ====================
    /**
     * Load PikPak cache from GM storage, filtering expired entries
     */
    async function loadPikPakCache() {
        try {
            const stored = await GM_getValue(PIKPAK_CACHE_KEY, {});
            const now = Date.now();
            const maxAge = pikpakCacheDurationDays * 24 * 60 * 60 * 1000;
            
            // Filter out expired entries
            pikpakCache = new Map(
                Object.entries(stored).filter(([_, v]) => now - v.timestamp <= maxAge)
            );
            
            // Reset tracking state
            unsavedPikPakCacheKeys.clear();
            pikpakCacheModified = false;
            
            if (performanceMetricsEnabled) {
                console.log(`[PikPak] Cache loaded: ${pikpakCache.size} entries`);
            }
        } catch (error) {
            console.error('[PikPak] Error loading cache:', error);
            pikpakCache = new Map();
        }
    }
    
    /**
     * Store PikPak cache to GM storage with size limit enforcement.
     * Uses unsavedPikPakCacheKeys pattern to prevent race conditions (mirrors magnet cache).
     */
    async function storePikPakCache() {
        try {
            // FIX: Check unsaved keys instead of cacheModified flag (prevents race condition)
            if (unsavedPikPakCacheKeys.size === 0) {
                return;
            }
            
            // Capture keys to save and clear immediately (prevent race condition)
            const keysToSave = Array.from(unsavedPikPakCacheKeys);
            unsavedPikPakCacheKeys.clear();
            
            // Trim if over limit (remove oldest 20%)
            if (pikpakCache.size > PIKPAK_MAX_CACHE_ENTRIES) {
                const entries = [...pikpakCache.entries()]
                    .sort((a, b) => a[1].timestamp - b[1].timestamp);
                const removeCount = Math.floor(entries.length * 0.2);
                entries.slice(0, removeCount).forEach(([k]) => pikpakCache.delete(k));
                
                if (performanceMetricsEnabled) {
                    console.log(`[PikPak] Cache trimmed: removed ${removeCount} oldest entries`);
                }
            }
            
            // Convert Map to Object for storage
            const cacheObj = {};
            for (const [hash, data] of pikpakCache) {
                cacheObj[hash] = data;
            }
            
            await GM_setValue(PIKPAK_CACHE_KEY, cacheObj);
            pikpakCacheModified = false;
            
            if (performanceMetricsEnabled) {
                console.log(`[PikPak] Cache saved: ${pikpakCache.size} entries (${keysToSave.length} new)`);
            }
        } catch (error) {
            console.error('[PikPak] Error storing cache:', error);
        }
    }
    
    /**
     * Clear only the PikPak cache (not the magnet cache)
     */
    async function clearPikPakCache() {
        try {
            pikpakCache = new Map();
            pikpakCacheModified = false;
            unsavedPikPakCacheKeys.clear(); // Clear unsaved tracking
            await GM_setValue(PIKPAK_CACHE_KEY, {});
            showTemporaryMessage('PikPak cache cleared successfully!', 'green');
        } catch (error) {
            console.error('[PikPak] Error clearing cache:', error);
            showTemporaryMessage('Error clearing PikPak cache.', 'red');
        }
    }

    // ==================== PIKPAK FOLDER BROWSER MODULE ====================
    /**
     * Fetch folders from PikPak API
     * @param {string} parentId - Parent folder ID (empty string for root)
     * @param {Object} authHeaders - Auth headers for API call
     * @returns {Promise<Array>} Array of folder objects
     */
    async function fetchPikPakFolders(parentId, authHeaders) {
        return new Promise((resolve) => {
            const filters = encodeURIComponent(JSON.stringify({
                "phase": { "eq": "PHASE_TYPE_COMPLETE" },
                "trashed": { "eq": false }
            }));
            const url = `${PIKPAK_LIST_FOLDERS_URL}?thumbnail_size=SIZE_MEDIUM&limit=500&parent_id=${parentId}&with_audit=true&filters=${filters}`;
            
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeaders
                },
                timeout: 15000,
                onload: (res) => {
                    if (res.status === 200) {
                        try {
                            const data = JSON.parse(res.responseText);
                            // Filter only folders (kind: "drive#folder")
                            const folders = (data.files || []).filter(f => f.kind === 'drive#folder');
                            resolve(folders);
                        } catch (e) {
                            console.error('[PikPak] Error parsing folder list:', e);
                            resolve([]);
                        }
                    } else {
                        console.error('[PikPak] Error fetching folders:', res.status, res.responseText);
                        resolve([]);
                    }
                },
                onerror: (e) => {
                    console.error('[PikPak] Folder fetch error:', e);
                    resolve([]);
                },
                ontimeout: () => {
                    console.error('[PikPak] Folder fetch timeout');
                    resolve([]);
                }
            });
        });
    }

    /**
     * Show folder browser modal for selecting destination folder
     * @param {Object} account - PikPak account object
     * @param {Function} onSelect - Callback when folder is selected (receives { folderId, folderPath, folderName })
     */
    async function showFolderBrowserModal(account, onSelect) {
        // First, ensure we have valid auth
        const auth = await PikPakAuth.ensureAuthenticated(account.id);
        if (!auth) {
            showTemporaryMessage('Failed to authenticate. Please check your credentials.', 'red');
            return;
        }
        
        const authHeaders = PikPakAuth.getAuthHeaders(auth);
        
        // State
        let currentPath = [];
        let currentFolderId = '';
        let selectedFolder = null;
        let isLoading = false;
        
        // Create overlay
        const overlay = document.createElement('div');
        applyStyles(overlay, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: '9999999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        // Modal
        const modal = document.createElement('div');
        applyStyles(modal, {
            backgroundColor: '#fff',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '95%',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        });
        
        // Header
        const header = document.createElement('div');
        applyStyles(header, {
            padding: '16px',
            backgroundColor: '#2265ff',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        });
        header.innerHTML = '<strong>📁 Select Destination Folder</strong>';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        applyStyles(closeBtn, { background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' });
        header.appendChild(closeBtn);
        modal.appendChild(header);
        
        // Breadcrumb
        const breadcrumb = document.createElement('div');
        applyStyles(breadcrumb, {
            padding: '10px 16px',
            backgroundColor: '#f5f5f5',
            borderBottom: '1px solid #ddd',
            fontSize: '13px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            alignItems: 'center'
        });
        modal.appendChild(breadcrumb);
        
        // Folder list
        const folderList = document.createElement('div');
        applyStyles(folderList, {
            flex: '1',
            overflowY: 'auto',
            minHeight: '200px',
            maxHeight: '300px'
        });
        modal.appendChild(folderList);
        
        // Selection display
        const selectionDisplay = document.createElement('div');
        applyStyles(selectionDisplay, {
            padding: '12px 16px',
            backgroundColor: '#e8f5e9',
            borderTop: '1px solid #c8e6c9',
            fontSize: '13px',
            display: 'none'
        });
        modal.appendChild(selectionDisplay);
        
        // Footer
        const footer = document.createElement('div');
        applyStyles(footer, {
            padding: '12px 16px',
            backgroundColor: '#f9f9f9',
            borderTop: '1px solid #ddd',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px'
        });
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = 'Cancel';
        applyStyles(cancelBtn, {
            padding: '8px 16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            cursor: 'pointer',
            fontSize: '13px'
        });
        const confirmBtn = document.createElement('button');
        confirmBtn.textContent = '✓ Confirm';
        applyStyles(confirmBtn, {
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500'
        });
        footer.appendChild(cancelBtn);
        footer.appendChild(confirmBtn);
        modal.appendChild(footer);
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Close handlers
        const closeModal = () => overlay.remove();
        closeBtn.onclick = closeModal;
        cancelBtn.onclick = closeModal;
        overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };
        
        // Helpers
        const getFullPath = () => currentPath.length === 0 ? 'Root' : currentPath.map(p => p.name).join('/');
        
        const updateDisplay = () => {
            if (selectedFolder) {
                const path = currentPath.length > 0 ? getFullPath() + '/' + selectedFolder.name : selectedFolder.name;
                selectionDisplay.textContent = `📂 Selected: ${path}`;
                selectionDisplay.style.display = 'block';
                confirmBtn.textContent = `✓ Select "${selectedFolder.name}"`;
            } else {
                selectionDisplay.textContent = `📂 Current: ${getFullPath()}`;
                selectionDisplay.style.display = 'block';
                confirmBtn.textContent = `✓ Use "${getFullPath()}"`;
            }
        };
        
        const renderBreadcrumbs = () => {
            breadcrumb.innerHTML = '';
            // Root
            const root = document.createElement('span');
            root.textContent = '🏠 Root';
            applyStyles(root, { cursor: currentPath.length > 0 ? 'pointer' : 'default', color: currentPath.length > 0 ? '#1976d2' : '#333', fontWeight: currentPath.length === 0 ? 'bold' : 'normal' });
            if (currentPath.length > 0) root.onclick = () => navigateTo('', []);
            breadcrumb.appendChild(root);
            
            currentPath.forEach((seg, i) => {
                const sep = document.createElement('span');
                sep.textContent = ' › ';
                applyStyles(sep, { color: '#999' });
                breadcrumb.appendChild(sep);
                
                const crumb = document.createElement('span');
                crumb.textContent = seg.name;
                const isLast = i === currentPath.length - 1;
                applyStyles(crumb, { cursor: isLast ? 'default' : 'pointer', color: isLast ? '#333' : '#1976d2', fontWeight: isLast ? 'bold' : 'normal' });
                if (!isLast) crumb.onclick = () => navigateTo(seg.id, currentPath.slice(0, i + 1));
                breadcrumb.appendChild(crumb);
            });
        };
        
        const navigateTo = async (folderId, path) => {
            currentPath = path;
            currentFolderId = folderId;
            selectedFolder = null;
            await loadFolders();
        };
        
        const renderFolders = (folders) => {
            folderList.innerHTML = '';
            if (folders.length === 0) {
                const empty = document.createElement('div');
                applyStyles(empty, { padding: '40px', textAlign: 'center', color: '#999' });
                empty.innerHTML = '📂 No subfolders<br><small>You can select this folder</small>';
                folderList.appendChild(empty);
                return;
            }
            folders.forEach(folder => {
                const row = document.createElement('div');
                applyStyles(row, {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer'
                });
                row.onmouseover = () => row.style.backgroundColor = '#f5f5f5';
                row.onmouseout = () => row.style.backgroundColor = row.dataset.selected === 'true' ? '#e3f2fd' : '';
                
                const icon = document.createElement('span');
                icon.textContent = '📁 ';
                applyStyles(icon, { marginRight: '8px' });
                row.appendChild(icon);
                
                const info = document.createElement('div');
                applyStyles(info, { flex: '1', overflow: 'hidden' });
                const name = document.createElement('div');
                name.textContent = folder.name;
                applyStyles(name, { fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });
                const id = document.createElement('div');
                id.textContent = 'ID: ' + folder.id;
                applyStyles(id, { fontSize: '11px', color: '#999' });
                info.appendChild(name);
                info.appendChild(id);
                row.appendChild(info);
                
                const openBtn = document.createElement('button');
                openBtn.textContent = '→';
                openBtn.title = 'Open folder';
                applyStyles(openBtn, { padding: '4px 10px', marginLeft: '8px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#fff', cursor: 'pointer' });
                openBtn.onclick = (e) => { e.stopPropagation(); navigateTo(folder.id, [...currentPath, { id: folder.id, name: folder.name }]); };
                row.appendChild(openBtn);
                
                row.onclick = () => {
                    folderList.querySelectorAll('div[data-selected]').forEach(r => { r.dataset.selected = 'false'; r.style.backgroundColor = ''; });
                    row.dataset.selected = 'true';
                    row.style.backgroundColor = '#e3f2fd';
                    selectedFolder = folder;
                    updateDisplay();
                };
                row.ondblclick = () => navigateTo(folder.id, [...currentPath, { id: folder.id, name: folder.name }]);
                
                folderList.appendChild(row);
            });
        };
        
        const loadFolders = async () => {
            if (isLoading) return;
            isLoading = true;
            folderList.innerHTML = '<div style="padding:40px;text-align:center;color:#666;">Loading...</div>';
            renderBreadcrumbs();
            updateDisplay();
            try {
                const folders = await fetchPikPakFolders(currentFolderId, authHeaders);
                renderFolders(folders);
            } catch (err) {
                folderList.innerHTML = `<div style="padding:40px;text-align:center;color:#f44336;">Error: ${err.message || 'Failed to load'}</div>`;
            }
            isLoading = false;
        };
        
        // Confirm handler
        confirmBtn.onclick = () => {
            let result;
            if (selectedFolder) {
                const fullPath = currentPath.length > 0 ? getFullPath() + '/' + selectedFolder.name : selectedFolder.name;
                result = { folderId: selectedFolder.id, folderPath: fullPath, folderName: selectedFolder.name };
            } else if (currentPath.length === 0) {
                result = { folderId: '', folderPath: 'Root', folderName: 'Root' };
            } else {
                const last = currentPath[currentPath.length - 1];
                result = { folderId: last.id, folderPath: getFullPath(), folderName: last.name };
            }
            onSelect(result);
            closeModal();
        };
        
        // Initial load
        await loadFolders();
    }

    // ==================== PIKPAK PROGRESS POPUP MODULE ====================
    const PikPakProgress = {
        element: null,
        updateScheduled: false,
        pendingUpdate: null,
        
        /**
         * Create progress popup for PikPak cache checks
         * @param {number} total - Total number of magnets to check
         */
        create(total) {
            if (!showProgressBar || total === 0) return;
            
            try {
                this.element = document.createElement('div');
                this.element.id = 'pikpakProgressPopup';
                applyStyles(this.element, {
                    position: 'fixed',
                    top: '80px', // Below 1337x popup if present
                    right: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#2265ff', // PikPak blue
                    color: '#fff',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                    fontSize: '14px',
                    zIndex: '9998',
                    contain: 'layout style paint',
                    willChange: 'contents',
                    minWidth: '300px'
                });
                
                const progressText = document.createElement('div');
                progressText.id = 'pikpakProgressText';
                progressText.textContent = `🔍 PKP: 0/${total} processed (${total} remaining) | 0 cached, 0 new | 0.0%`;
                
                const progressBar = document.createElement('div');
                applyStyles(progressBar, {
                    width: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '5px',
                    marginTop: '5px'
                });
                
                const progressBarFill = document.createElement('div');
                progressBarFill.id = 'pikpakProgressBarFill';
                applyStyles(progressBarFill, {
                    width: '0%',
                    height: '8px',
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                    transition: 'width 0.2s ease',
                    willChange: 'width'
                });
                progressBar.appendChild(progressBarFill);
                
                this.element.appendChild(progressText);
                this.element.appendChild(progressBar);
                document.body.appendChild(this.element);
            } catch (error) {
                console.error('[PikPak] Error creating progress popup:', error);
            }
        },
        
        /**
         * Update progress popup with batched RAF updates
         * @param {number} processed - Number processed so far
         * @param {number} total - Total number
         * @param {number} cached - Number found cached
         */
        update(processed, total, cached) {
            if (!showProgressBar || !this.element) return;
            
            this.pendingUpdate = { processed, total, cached };
            
            if (!this.updateScheduled) {
                this.updateScheduled = true;
                requestAnimationFrame(() => {
                    if (this.pendingUpdate) {
                        const { processed, total, cached } = this.pendingUpdate;
                        const progressText = document.getElementById('pikpakProgressText');
                        const progressBarFill = document.getElementById('pikpakProgressBarFill');
                        
                        if (progressText && progressBarFill) {
                            const remaining = total - processed;
                            const newItems = processed - cached;
                            const percentage = total > 0 ? (processed / total * 100).toFixed(1) : '0.0';
                            
                            progressText.textContent = `🔍 PKP: ${processed}/${total} processed (${remaining} remaining) | ${cached} cached, ${newItems} new | ${percentage}%`;
                            progressBarFill.style.width = `${percentage}%`;
                        }
                        
                        this.pendingUpdate = null;
                    }
                    this.updateScheduled = false;
                });
            }
        },
        
        /**
         * Remove progress popup with fade animation
         */
        remove() {
            try {
                const popup = document.getElementById('pikpakProgressPopup');
                if (popup) {
                    popup.style.transition = 'opacity 2s';
                    popup.style.opacity = '0';
                    setTimeout(() => {
                        popup.remove();
                        this.element = null;
                    }, 2000);
                }
            } catch (error) {
                console.error('[PikPak] Error removing progress popup:', error);
            }
        }
    };

    // ==================== PIKPAK CACHE CHECK FUNCTION (No Auth Required) ====================
    /**
     * Check if a magnet is cached on PikPak
     * @param {string} magnetUrl - Full magnet URL
     * @param {string} hash - Magnet hash
     * @returns {Promise<{status: string, fromLocalCache: boolean, progress: number|null}>}
     */
    async function checkPikPakCacheStatus(magnetUrl, hash) {
        try {
            // 1. Check local cache first
            if (pikpakCache.has(hash)) {
                return { status: 'OK', fromLocalCache: true, progress: null };
            }
            
            // 2. Make API call (NO auth headers needed for cache check)
            const url = `${PIKPAK_CACHE_CHECK_URL}?url=${encodeURIComponent(magnetUrl)}`;
            
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: pikpakCacheCheckTimeout * 1000, // Convert seconds to ms
                    onload: (res) => {
                        if (res.status === 200) {
                            try {
                                const data = JSON.parse(res.responseText);
                                const status = data.status || 'UNKNOWN';
                                // Extract progress if available (e.g., {"status":"UNKNOWN","progress":99})
                                const progress = typeof data.progress === 'number' ? data.progress : null;
                                
                                // Only cache positive "OK" results
                                if (status === 'OK') {
                                    pikpakCache.set(hash, {
                                        status: 'OK',
                                        timestamp: Date.now()
                                    });
                                    pikpakCacheModified = true;
                                    unsavedPikPakCacheKeys.add(hash); // Track unsaved key for batch save
                                }
                                
                                resolve({ status, fromLocalCache: false, progress });
                            } catch (e) {
                                console.error('[PikPak] Cache check parse error:', e);
                                resolve({ status: 'ERROR', fromLocalCache: false, progress: null });
                            }
                        } else if (res.status === 429) {
                            // Rate limited
                            resolve({ status: 'RATE_LIMITED', fromLocalCache: false, progress: null });
                        } else {
                            resolve({ status: 'ERROR', fromLocalCache: false, progress: null });
                        }
                    },
                    onerror: () => {
                        resolve({ status: 'ERROR', fromLocalCache: false, progress: null });
                    },
                    ontimeout: () => {
                        resolve({ status: 'TIMEOUT', fromLocalCache: false, progress: null });
                    }
                });
            });
        } catch (error) {
            console.error('[PikPak] Cache check error:', error);
            return { status: 'ERROR', fromLocalCache: false, progress: null };
        }
    }

    // ==================== PIKPAK SLIDING WINDOW PROCESSOR ====================
    /**
     * Process PikPak cache checks using sliding window pattern with rate limit handling.
     * Features: stopped flag for clean termination, incremental batch saves, beforeunload handler.
     * @param {Array} magnetLinks - Array of {magnetUrl, hash, button} objects
     */
    async function processPikPakCacheChecks(magnetLinks) {
        if (!pikpakEnabled || magnetLinks.length === 0) return;
        
        PerformanceMetrics.start('pikpakCacheCheck');
        const total = magnetLinks.length;
        let processed = 0;
        let cached = 0;
        let consecutiveErrors = 0;
        const maxConsecutiveErrors = 3;
        let stopped = false; // RACE CONDITION FIX: Flag to properly stop processing
        let newItemsSinceLastSave = 0; // Track items for incremental batch save
        const incrementalSaveBatchSize = batchSize; // Use same batch size as 1337x flow
        
        // Create progress popup
        PikPakProgress.create(total);
        
        // RACE CONDITION FIX: Save cache on page unload to prevent data loss
        const beforeUnloadHandler = async () => {
            if (unsavedPikPakCacheKeys.size > 0) {
                await storePikPakCache();
            }
        };
        window.addEventListener('beforeunload', beforeUnloadHandler);
        
        // Sliding window implementation
        const concurrency = pikpakBatchSize;
        let currentIndex = 0;
        const inFlight = new Set();
        let backoffDelay = 0;
        
        const processNext = async () => {
            // RACE CONDITION FIX: Check stopped flag before processing more
            while (!stopped && currentIndex < total && inFlight.size < concurrency) {
                // Apply backoff delay if rate limited
                if (backoffDelay > 0) {
                    await new Promise(r => setTimeout(r, backoffDelay));
                }
                
                // Check stopped again after delay
                if (stopped) break;
                
                const index = currentIndex++;
                const item = magnetLinks[index];
                
                const promise = (async () => {
                    try {
                        const result = await checkPikPakCacheStatus(item.magnetUrl, item.hash);
                        
                        // Handle rate limiting with exponential backoff
                        if (result.status === 'RATE_LIMITED') {
                            backoffDelay = Math.min(backoffDelay === 0 ? 500 : backoffDelay * 2, 4000);
                            consecutiveErrors++;
                        } else {
                            backoffDelay = Math.max(0, backoffDelay - 250); // Gradually reduce backoff
                            consecutiveErrors = 0;
                        }
                        
                        // Update button status
                        const isCached = result.status === 'OK';
                        const isTimeout = result.status === 'TIMEOUT';
                        if (isCached) {
                            cached++;
                            newItemsSinceLastSave++;
                            
                            // INCREMENTAL BATCH SAVE: Save cache every N new items (protects against page refresh)
                            if (newItemsSinceLastSave >= incrementalSaveBatchSize) {
                                // Non-blocking save
                                storePikPakCache().then(() => {
                                    if (performanceMetricsEnabled) {
                                        console.log(`[PikPak] Incremental cache save: ${pikpakCache.size} entries`);
                                    }
                                });
                                newItemsSinceLastSave = 0;
                            }
                        }
                        
                        // Update button in real-time (handle duplicate hashes)
                        // Pass progress for in-progress items (status UNKNOWN with progress)
                        // Pass isTimeout for timeout status (shows warning icon)
                        // MEMORY LEAK FIX: Use getPikPakButtons for lazy cleanup of disconnected elements
                        const buttons = getPikPakButtons(item.hash);
                        if (buttons.length > 0) {
                            buttons.forEach(btn => {
                                updatePikPakButtonStatus(btn, isCached, result.progress, isTimeout);
                            });
                        } else if (item.button && item.button.isConnected) {
                            updatePikPakButtonStatus(item.button, isCached, result.progress, isTimeout);
                        }
                        
                        processed++;
                        PikPakProgress.update(processed, total, cached);
                        
                    } catch (error) {
                        console.error('[PikPak] Process error:', error);
                        processed++;
                        consecutiveErrors++;
                        PikPakProgress.update(processed, total, cached);
                    }
                })();
                
                inFlight.add(promise);
                promise.finally(() => {
                    inFlight.delete(promise);
                    // RACE CONDITION FIX: Check stopped flag AND consecutive errors
                    if (stopped) return;
                    if (consecutiveErrors >= maxConsecutiveErrors) {
                        console.warn('[PikPak] Too many consecutive errors, stopping checks');
                        stopped = true; // Set flag to stop other promises from spawning more
                        return;
                    }
                    processNext();
                });
            }
        };
        
        // Start initial batch
        await processNext();
        
        // Wait for all in-flight requests to complete
        while (inFlight.size > 0) {
            await Promise.race([...inFlight]);
        }
        
        // Remove beforeunload handler (no longer needed)
        window.removeEventListener('beforeunload', beforeUnloadHandler);
        
        // Final cache save (save any remaining unsaved items)
        if (unsavedPikPakCacheKeys.size > 0) {
            await storePikPakCache();
        }
        
        // Delay before removing progress popup to show final state
        setTimeout(() => {
            PikPakProgress.remove();
        }, 1500);
        
        const duration = PerformanceMetrics.end('pikpakCacheCheck');
        if (performanceMetricsEnabled) {
            console.log(`[Performance] PikPak check completed in ${duration.toFixed(2)}ms (${cached}/${total} cached${stopped ? ', stopped early due to errors' : ''})`);
        }
    }

    // ==================== PIKPAK BUTTON FUNCTIONS ====================
    /**
     * Create PikPak download button
     * @param {string} magnetLink - Full magnet URL
     * @param {string} magnetHash - Magnet hash
     * @param {string} imageUrl - Icon URL (unused but kept for consistency)
     * @param {string} initialStatus - 'checking', 'cached', or 'uncached'
     * @param {string} accountId - Account ID (optional)
     * @param {Object} destination - Destination folder config (optional): { folderId, folderPath, folderName }
     * @returns {HTMLElement} Button element
     */
    function createDownloadButtonForPikPak(magnetLink, magnetHash, imageUrl, initialStatus = 'checking', accountId = null, destination = null) {
        try {
            // Get account data
            const getAccountData = async () => {
                if (accountId) {
                    const accounts = await accountManager.loadAccounts('pikpak');
                    return accounts.find(acc => acc.id === accountId);
                }
                return await accountManager.getPrimaryAccount('pikpak');
            };
            
            // Use destination.shortCode if available, otherwise fallback to 'PKP'
            let siteShortName = (destination && destination.shortCode) ? destination.shortCode : 'PKP';
            const button = ObjectPool.getButton();
            
            // Store accountId and destination in button for later use
            button.setAttribute('data-account-id', accountId || 'primary');
            if (destination && destination.folderId) {
                button.setAttribute('data-dest-folder-id', destination.folderId);
                button.setAttribute('data-dest-folder-path', destination.folderPath || '');
            }
            
            // Determine initial style based on status
            let buttonStyle, buttonText;
            if (initialStatus === 'checking') {
                buttonStyle = { backgroundColor: '#e0e0e0', border: '2px solid #808080' };
                buttonText = '🔍' + siteShortName;
            } else if (initialStatus === 'cached') {
                buttonStyle = buttonStyleCache.cached;
                buttonText = '⚡️' + siteShortName;
            } else {
                buttonStyle = buttonStyleCache.uncached;
                buttonText = '⏳' + siteShortName;
            }
            
            applyStyles(button, buttonStyleCache.base, buttonStyle);
            button.setAttribute('data-script-created', 'true');
            button.setAttribute('data-pikpak-hash', magnetHash);
            button.setAttribute('data-shortcode', siteShortName); // Store shortCode for status updates
            
            const text = ObjectPool.getSpan();
            
            // Get account to set tooltip
            getAccountData().then(account => {
                // Set tooltip with full info (only if enabled)
                if (pikpakShowTooltip && account) {
                    const destPath = destination && destination.folderPath ? destination.folderPath : 'Default';
                    const destId = destination && destination.folderId ? destination.folderId : 'Default';
                    const nickname = account.nickname || siteShortName;
                    button.title = `[${nickname}] ${destPath} (ID: ${destId})`;
                }
            });
            
            text.textContent = buttonText;
            applyStyles(text, {
                color: initialStatus === 'cached' ? '#fff' : '#000',
                fontWeight: 'bold',
                lineHeight: '16px',
                fontSize: '1em'
            });
            button.appendChild(text);
            
            // RACE CONDITION FIX: Store as array to handle duplicate hashes on same page
            const existingButtons = pikpakButtonMap.get(magnetHash) || [];
            existingButtons.push(button);
            pikpakButtonMap.set(magnetHash, existingButtons);
            
            // Click handler - adds magnet to PikPak
            button.addEventListener('click', async (event) => {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                
                // Check if still checking
                if (button.textContent.includes('🔍')) {
                    showTemporaryMessage('PikPak cache check still in progress...', 'yellow');
                    return false;
                }
                
                // Get account
                const account = await getAccountData();
                if (!account) {
                    showTemporaryMessage('PikPak account not configured.', 'red');
                    return false;
                }
                
                // Check credentials
                if (!account.username || !account.password) {
                    showTemporaryMessage('PikPak credentials not configured for this account.', 'red');
                    return false;
                }
                
                // Get shortCode from button's data attribute (stored from destination.shortCode)
                const shortCode = button.getAttribute('data-shortcode') || 'PKP';
                
                // Show processing indicator (distinct from uncached ⏳)
                button.textContent = '🔄' + shortCode;
                
                const auth = await PikPakAuth.ensureAuthenticated(account.id);
                if (!auth) {
                    button.textContent = '❌' + shortCode;
                    button.style.backgroundColor = '#ffd500';
                    return false;
                }
                
                // Add magnet to PikPak
                const authHeaders = PikPakAuth.getAuthHeaders(auth);
                const destFolderId = button.getAttribute('data-dest-folder-id');
                
                const postData = {
                    kind: "drive#file",
                    name: "",
                    upload_type: "UPLOAD_TYPE_URL",
                    url: { url: magnetLink },
                    params: { from: "file" }
                };
                
                // Add parent_id if destination folder is specified, otherwise use folder_type
                if (destFolderId) {
                    postData.parent_id = destFolderId;
                } else {
                    postData.folder_type = "DOWNLOAD";
                }
                
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: PIKPAK_ADD_FILE_URL,
                    data: JSON.stringify(postData),
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        ...authHeaders
                    },
                    timeout: 15000,
                    onload: (res) => {
                        if (res.status === 200) {
                            button.textContent = '✔️' + shortCode;
                            button.style.backgroundColor = '#28a745';
                            const destPath = button.getAttribute('data-dest-folder-path');
                            const successMsg = destPath ? `Magnet added to PikPak → ${destPath}` : 'Magnet added to PikPak successfully!';
                            showTemporaryMessage(successMsg, 'green');
                        } else if (res.status === 401) {
                            // Auth expired, clear for this account
                            accountManager.updateAccount('pikpak', account.id, { authData: null });
                            const authState = pikpakAuthStates.get(account.id);
                            if (authState) {
                                authState.authData = null;
                            }
                            button.textContent = '❌' + shortCode;
                            button.style.backgroundColor = '#ffd500';
                            showTemporaryMessage('PikPak authentication expired. Please try again.', 'red');
                        } else {
                            button.textContent = '❌' + shortCode;
                            button.style.backgroundColor = '#ffd500';
                            try {
                                const errData = JSON.parse(res.responseText);
                                showTemporaryMessage(`PikPak error: ${errData.error_description || 'Unknown error'}`, 'red');
                            } catch (e) {
                                showTemporaryMessage('Failed to add magnet to PikPak.', 'red');
                            }
                        }
                    },
                    onerror: () => {
                        button.textContent = '❌' + shortCode;
                        button.style.backgroundColor = '#ffd500';
                        showTemporaryMessage('Network error adding magnet to PikPak.', 'red');
                    },
                    ontimeout: () => {
                        button.textContent = '❌' + shortCode;
                        button.style.backgroundColor = '#ffd500';
                        showTemporaryMessage('Timeout adding magnet to PikPak.', 'red');
                    }
                });
                
                return false;
            }, { capture: true });
            
            return button;
        } catch (error) {
            console.error('[PikPak] Error creating button:', error);
            return null;
        }
    }
    
    /**
     * Update existing PikPak button status
     * @param {HTMLElement} button - Button element to update
     * @param {boolean} isCached - Whether the magnet is cached
     * @param {number|null} progress - Optional progress percentage for in-progress items
     * @param {boolean} isTimeout - Whether the cache check timed out (unknown status)
     */
    function updatePikPakButtonStatus(button, isCached, progress = null, isTimeout = false) {
        if (!button || !button.isConnected) return;
        
        try {
            // Get shortCode from data attribute (set during button creation)
            const siteShortName = button.getAttribute('data-shortcode') || 'PKP';
            const textSpan = button.querySelector('span') || button;
            
            if (isCached) {
                textSpan.textContent = '⚡️' + siteShortName;
                textSpan.style.color = '#fff';
                applyStyles(button, buttonStyleCache.cached);
            } else if (isTimeout) {
                // Timeout - status unknown (server didn't respond in time)
                textSpan.textContent = '⚠️' + siteShortName;
                textSpan.style.color = '#856404'; // Dark amber for warning
                applyStyles(button, buttonStyleCache.uncached);
                button.style.backgroundColor = '#fff3cd'; // Light amber background for timeout
                button.style.borderColor = '#ffc107'; // Amber border for timeout
            } else {
                // Show progress if available (e.g., "⏳PKP 99%")
                if (progress !== null && progress >= 0 && progress <= 100) {
                    textSpan.textContent = '⏳' + siteShortName + ' ' + progress + '%';
                } else {
                    textSpan.textContent = '⏳' + siteShortName;
                }
                textSpan.style.color = '#000';
                applyStyles(button, buttonStyleCache.uncached);
            }
        } catch (error) {
            console.error('[PikPak] Error updating button status:', error);
        }
    }

    // ==================== ULTRA-OPTIMIZED BUTTON CREATION WITH POOLING ====================
    function createDownloadButtonForOffcloud(magnetLink, magnetHash, imageUrl, cached, accountId = null) {
        try {
            // Get account data
            const getAccountData = async () => {
                if (accountId) {
                    const accounts = await accountManager.loadAccounts('offcloud');
                    return accounts.find(acc => acc.id === accountId);
                }
                return await accountManager.getPrimaryAccount('offcloud');
            };
            
        let siteShortName = 'OC';
            let is32BitHash = magnetHash.length === 32;
            const button = ObjectPool.getButton();
            
            // Store accountId in button for later use
            button.setAttribute('data-account-id', accountId || 'primary');
            
            // Apply styles in single batch
            applyStyles(button, 
                buttonStyleCache.base, 
                cached ? buttonStyleCache.cached : buttonStyleCache.uncached
            );
            button.setAttribute('data-script-created', 'true');

        if(showIcons) {
            const img = document.createElement('img');
            img.src = imageUrl;
                applyStyles(img, {
                    width: '16px',
                    height: '16px',
                    filter: cached ? 'none' : 'grayscale(100%)',
                    marginRight: '2px'
                });
            button.appendChild(img);
        }

            const text = ObjectPool.getSpan();
            
            // Get account to set shortCode - do this asynchronously
            getAccountData().then(account => {
                if (account && account.shortCode) {
                    siteShortName = account.shortCode;
                    text.textContent = cached ? siteShortName + "⚡️" : is32BitHash ? siteShortName + "❓" : siteShortName + "⌛️";
                }
            });
            
        text.textContent = cached ? siteShortName + "⚡️" : is32BitHash ? siteShortName + "❓" : siteShortName + "⌛️";
            applyStyles(text, {
                color: cached ? '#fff' : '#000',
                fontWeight: 'bold',
                lineHeight: '16px',
                fontSize: '1em'
            });

        button.appendChild(text);

            button.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
                
                const account = await getAccountData();
                if (!account || !account.apiKey) {
                    showTemporaryMessage('Offcloud account not configured', 'red');
                    return false;
                }
            
            const payload = JSON.stringify({ url: magnetLink });
            const errorMessages = {
                "{\n  \"not_available\": \"cloud\"\n}": "Cloud Storage has no space. New requests cannot be added",
                "{\n  \"error\": \"NOAUTH\",\n  \"url\": \"/login?tag=expired\"\n}": "API Key Empty or Invalid"
            };
            
            // Show processing indicator
            button.textContent = account.shortCode + '🔄';
            
            GM_xmlhttpRequest({
                method: 'POST',
                    url: `${OFFCLOUD_CLOUD_API_URL}?key=${account.apiKey}`,
                data: payload,
                headers: {
                    'Content-Type': 'application/json'
                },
                onload: function (response) {
                    try {
                        if (response.status === 200 && response.responseText.includes("\"requestId\"")) {
                                button.textContent = account.shortCode + '✔️';
                            button.style.backgroundColor = '#28a745';
                            showTemporaryMessage('Magnet link added to Offcloud successfully!', 'green');
                        } else {
                                button.textContent = account.shortCode + '❌';
                            button.style.backgroundColor = '#ffd500';
                            const additionalErrorMessage = errorMessages[response.responseText] || "Unknown Error";
                            showTemporaryMessage(`Failed to add magnet to Offcloud. ${additionalErrorMessage}`, 'red');
                        }
                    } catch (error) {
                        console.error('[magnetLinkChecker] Error handling Offcloud response:', error);
                    }
                },
                onerror: function(error) {
                    console.error('[magnetLinkChecker] Error adding to Offcloud:', error);
                    showTemporaryMessage('Network error adding magnet to Offcloud', 'red');
                }
            });
            
            return false;
        }, { capture: true });
        return button;
        } catch (error) {
            console.error('[magnetLinkChecker] Error creating Offcloud button:', error);
            return null;
        }
    }

    function createDownloadButtonForTorbox(magnetLink, magnetHash, imageUrl, cached, accountId = null) {
        try {
            // Get account data
            const getAccountData = async () => {
                if (accountId) {
                    const accounts = await accountManager.loadAccounts('torbox');
                    return accounts.find(acc => acc.id === accountId);
                }
                return await accountManager.getPrimaryAccount('torbox');
            };
            
        let siteShortName = 'TB';
            let is32BitHash = magnetHash.length === 32;
            const button = ObjectPool.getButton();
            
            // Store accountId in button for later use
            button.setAttribute('data-account-id', accountId || 'primary');
            
            applyStyles(button, 
                buttonStyleCache.base, 
                cached ? buttonStyleCache.cached : buttonStyleCache.uncached
            );
            button.setAttribute('data-script-created', 'true');

        if(showIcons) {
            const img = document.createElement('img');
            img.src = imageUrl;
                applyStyles(img, {
                    width: '16px',
                    height: '16px',
                    filter: cached ? 'none' : 'grayscale(100%)',
                    marginRight: '2px'
                });
            button.appendChild(img);
        }

            const text = ObjectPool.getSpan();
            
            // Get account to set shortCode - do this asynchronously
            getAccountData().then(account => {
                if (account && account.shortCode) {
                    siteShortName = account.shortCode;
                    text.textContent = cached ? siteShortName + "⚡️" : is32BitHash ? siteShortName + "❓" : siteShortName + "⌛️";
                }
            });
            
        text.textContent = cached ? siteShortName + "⚡️" : is32BitHash ? siteShortName + "❓" : siteShortName + "⌛️";
            applyStyles(text, {
                color: cached ? '#fff' : '#000',
                fontWeight: 'bold',
                lineHeight: '16px',
                fontSize: '1em'
            });

        button.appendChild(text);

            button.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
                
                const account = await getAccountData();
                if (!account || !account.apiKey) {
                    showTemporaryMessage('Torbox account not configured', 'red');
                    return false;
                }
            
            // Show processing indicator
            button.textContent = account.shortCode + '🔄';
            
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${TORBOX_API_BASE_URL}/torrents/createtorrent`,
                headers: {
                        'Authorization': `Bearer ${account.apiKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data: `magnet=${encodeURIComponent(magnetLink)}&seed=3&allow_zip=false`,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (response.status >= 200 && response.status < 300) {
                                button.textContent = account.shortCode + '✔️';
                            button.style.backgroundColor = '#28a745';
                            showTemporaryMessage('Magnet link added to Torbox successfully!', 'green');
                        } else {
                                button.textContent = account.shortCode + '❌';
                            button.style.backgroundColor = '#ffd500';
                            showTemporaryMessage(`Failed to add magnet: ${data.error || 'Unknown error'}`, 'red');
                        }
                    } catch (error) {
                        console.error('[magnetLinkChecker] Error parsing Torbox response:', error);
                            button.textContent = account.shortCode + '❌';
                        button.style.backgroundColor = '#ffd500';
                        showTemporaryMessage('Error parsing response from Torbox', 'red');
                    }
                },
                onerror: function(error) {
                    console.error('[magnetLinkChecker] Error adding to Torbox:', error);
                    showTemporaryMessage('Error adding magnet to Torbox.', 'red');
                }
            });
            
            return false;
        }, { capture: true });
        return button;
        } catch (error) {
            console.error('[magnetLinkChecker] Error creating Torbox button:', error);
            return null;
        }
    }

    // ==================== OPTIMIZED MESSAGE DISPLAY WITH POOLING ====================
    let messageElement = null;
    let messageTimer = null;
    const messageQueue = [];
    let isShowingMessage = false;

    function showTemporaryMessage(message, color) {
        try {
            messageQueue.push({ message, color });
            if (!isShowingMessage) {
                processMessageQueue();
            }
        } catch (error) {
            console.error('[magnetLinkChecker] Error queuing message:', error);
        }
    }

    function processMessageQueue() {
        if (messageQueue.length === 0) {
            isShowingMessage = false;
            return;
        }

        isShowingMessage = true;
        const { message, color } = messageQueue.shift();

        if (messageTimer) {
            clearTimeout(messageTimer);
        }

        if (!messageElement) {
            messageElement = document.createElement('div');
            applyStyles(messageElement, {
                position: 'fixed',
                bottom: '20px',
                left: '20px',
                color: 'white',
                padding: '10px',
                borderRadius: '5px',
                zIndex: '10000',
                transition: 'opacity 0.3s ease',
                contain: 'layout style paint',
                willChange: 'opacity'
            });
            document.body.appendChild(messageElement);
        }

        messageElement.textContent = message;
        messageElement.style.backgroundColor = color;
        messageElement.style.opacity = '1';

        messageTimer = setTimeout(() => {
            if (messageElement) {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    processMessageQueue();
                }, 300);
            }
        }, 2000);
    }

    // ==================== MAGNET LINK INSERTION FOR 1337x ====================
    /**
     * Insert clickable magnet links with 🧲 emoji AFTER cache-check buttons (rightmost)
     * Only active on 1337x when showMagnetLink1337x is enabled
     * Uses setTimeout to ensure other buttons have been inserted first, then finds last button
     * @param {Array} magnetLinks - Array of {link, hash, magnetLink} objects
     */
    function insertMagnetLinks(magnetLinks) {
        if (!showMagnetLink1337x) return;
        
        try {
            // Use setTimeout to ensure RAF callbacks from other button inserters have completed
            // This guarantees we can find the last inserted button
            setTimeout(() => {
                let insertedCount = 0;
                
                for (const linkObj of magnetLinks) {
                    try {
                        const parent = linkObj.link.parentNode;
                        if (!parent) continue;
                        
                        // Check if magnet link already exists for this parent
                        if (parent.querySelector('a[data-magnet-link="true"]')) continue;
                        
                        // Find the last script-created button in this parent
                        const scriptButtons = parent.querySelectorAll('[data-script-created="true"]');
                        const lastButton = scriptButtons.length > 0 ? scriptButtons[scriptButtons.length - 1] : null;
                        
                        // Create the magnet link
                        const magnetAnchor = document.createElement('a');
                        magnetAnchor.href = linkObj.magnetLink;
                        magnetAnchor.textContent = '🧲';
                        magnetAnchor.title = 'Open magnet link in torrent client';
                        magnetAnchor.setAttribute('data-script-created', 'true');
                        magnetAnchor.setAttribute('data-magnet-link', 'true'); // Marker to avoid duplicates
                        applyStyles(magnetAnchor, {
                            marginLeft: '5px',
                            marginRight: '3px',
                            textDecoration: 'none',
                            fontSize: '16px',
                            cursor: 'pointer',
                            verticalAlign: 'middle',
                            display: 'inline-block'
                        });
                        
                        // Insert after the last button (rightmost position)
                        if (lastButton && lastButton.nextSibling) {
                            parent.insertBefore(magnetAnchor, lastButton.nextSibling);
                        } else if (lastButton) {
                            parent.appendChild(magnetAnchor);
                        } else {
                            // Fallback: insert after the original link
                            parent.insertBefore(magnetAnchor, linkObj.link.nextSibling);
                        }
                        
                        insertedCount++;
                    } catch (error) {
                        console.error('[magnetLinkChecker] Error inserting magnet link:', error);
                    }
                }
                
                if (performanceMetricsEnabled && insertedCount > 0) {
                    console.log(`[magnetLinkChecker] Inserted ${insertedCount} magnet links`);
                }
            }, 200); // 200ms delay ensures all RAF callbacks have completed
        } catch (error) {
            console.error('[magnetLinkChecker] Error in insertMagnetLinks:', error);
        }
    }

    // ==================== ULTRA-OPTIMIZED BATCH DOM UPDATES ====================
    function batchInsertButtons(magnetLinks, buttonCreator, cachedHashSet, provider = null, accountId = null) {
        try {
            PerformanceMetrics.start('batchInsertButtons');
            
            // Phase 1: Collect all layout reads first (avoid interleaved read/write)
            const layoutInfo = magnetLinks.map(linkObj => ({
                linkObj,
                parent: linkObj.link.parentNode,
                nextSibling: linkObj.link.nextSibling
            }));

            // Phase 2: Create all buttons (DOM writes)
            const operations = [];
            for (const info of layoutInfo) {
                try {
                    const button = buttonCreator(
                        info.linkObj.magnetLink, 
                        info.linkObj.hash, 
                        '', 
                        cachedHashSet.has(info.linkObj.hash),
                        accountId  // Pass accountId to button creator
                    );
                    if (button) {
                        operations.push({ button, info });
                    }
                } catch (error) {
                    console.error('[magnetLinkChecker] Error creating button:', error);
                }
            }

            // Phase 3: Batch all DOM insertions using RAF for optimal timing
            requestAnimationFrame(() => {
                operations.forEach(({ button, info }) => {
                    try {
                        info.parent.insertBefore(button, info.nextSibling);
                        
                        // Cache parent style changes
                        if (!computedStylesCache.has(info.parent)) {
                            info.parent.style.width = 'auto';
                            info.parent.style.height = 'auto';
                            computedStylesCache.set(info.parent, true);
                        }
                    } catch (error) {
                        console.error('[magnetLinkChecker] Error inserting button:', error);
                    }
                });
            });

            const duration = PerformanceMetrics.end('batchInsertButtons');
            if (performanceMetricsEnabled) {
                console.log(`[Performance] Prepared ${operations.length} buttons in ${duration.toFixed(2)}ms`);
            }
            PerformanceMetrics.increment('buttonsCreated');
        } catch (error) {
            console.error('[magnetLinkChecker] Error in batch insert:', error);
        }
    }

    // ==================== MULTI-ACCOUNT BUTTON INSERTION ====================
    /**
     * Insert buttons for all enabled accounts of a provider
     * @param {Array} magnetLinks - Array of magnet link objects
     * @param {Function} buttonCreator - Button creator function
     * @param {Set} cachedHashSet - Set of cached hashes
     * @param {string} provider - Provider name ('torbox', 'offcloud', 'pikpak')
     */
    async function batchInsertMultiAccountButtons(magnetLinks, buttonCreator, cachedHashSet, provider) {
        try {
            const enabledAccounts = await accountManager.getEnabledAccounts(provider);
            
            if (enabledAccounts.length === 0) {
                console.log(`[${provider}] No enabled accounts found`);
                return;
            }
            
            // Insert buttons for each enabled account
            for (const account of enabledAccounts) {
                batchInsertButtons(magnetLinks, buttonCreator, cachedHashSet, provider, account.id);
            }
            
            if (performanceMetricsEnabled) {
                console.log(`[${provider}] Created buttons for ${enabledAccounts.length} account(s)`);
            }
        } catch (error) {
            console.error(`[${provider}] Error in multi-account button insertion:`, error);
        }
    }

    // ==================== REQUEST-DEDUPED API CALLS ====================
    function markCachedStatusForOffcloud(magnetLinks, hashes) {
        if (!offcloudEnabled || hashes.length === 0) return;
        
        // Get primary account for cache checking
        accountManager.getPrimaryAccount('offcloud').then(primaryAccount => {
            if (!primaryAccount || !primaryAccount.apiKey) {
                console.log('[Offcloud] No primary account configured');
                return;
            }

        try {
            PerformanceMetrics.start('markCachedOffcloud');
            
            const requestKey = `offcloud:${hashes.sort().join(',')}`;
        const payload = JSON.stringify({ hashes: hashes });
        const iconUrl = "https://offcloud.com/favicon.ico";
            
            RequestCache.dedupedRequest(requestKey, () => {
                return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
                            url: `${OFFCLOUD_CACHE_API_URL}?key=${primaryAccount.apiKey}`,
            data: payload,
            headers: { 'Content-Type': 'application/json' },
            onload: function (response) {
                            try {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                                    resolve(result);
                } else {
                                    reject(new Error('Non-200 response'));
                    showTemporaryMessage('Error Checking Cache availability for OffCloud. HTTP response code is not 200', 'red');
                                }
                            } catch (error) {
                                reject(error);
                                console.error('[magnetLinkChecker] Error processing Offcloud response:', error);
                }
            },
                        onerror: function(error) {
                            reject(error);
                            console.error('[magnetLinkChecker] Error checking Offcloud cache:', error);
                showTemporaryMessage('Error Checking Cache availability for OffCloud', 'red');
            }
        });
                });
            }).then(result => {
                if (result.cachedItems && Array.isArray(result.cachedItems)) {
                    const cachedHashSet = new Set(result.cachedItems);
                    batchInsertMultiAccountButtons(magnetLinks, createDownloadButtonForOffcloud, cachedHashSet, 'offcloud');
                }
                const duration = PerformanceMetrics.end('markCachedOffcloud');
                if (performanceMetricsEnabled) {
                    console.log(`[Performance] Offcloud check completed in ${duration.toFixed(2)}ms`);
                }
            }).catch(error => {
                console.error('[magnetLinkChecker] Offcloud request failed:', error);
            });
        } catch (error) {
            console.error('[magnetLinkChecker] Error marking Offcloud status:', error);
        }
        }).catch(error => {
            console.error('[magnetLinkChecker] Error getting Offcloud primary account:', error);
        });
    }

    function markCachedStatusForTorbox(magnetLinks, hashes) {
        if (!torboxEnabled || hashes.length === 0) return;
        
        // Get primary account for cache checking
        accountManager.getPrimaryAccount('torbox').then(primaryAccount => {
            if (!primaryAccount || !primaryAccount.apiKey) {
                console.log('[Torbox] No primary account configured');
                return;
            }

        try {
            PerformanceMetrics.start('markCachedTorbox');
            
            const requestKey = `torbox:${hashes.sort().join(',')}`;
        const payload = JSON.stringify({ hashes: hashes });
        const url = `${TORBOX_API_BASE_URL}/torrents/checkcached?format=object&list_files=false`;
        const iconUrl = "https://torbox.app/favicon.ico";
            
            RequestCache.dedupedRequest(requestKey, () => {
                return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            data: payload,
            headers: {
                                'Authorization': `Bearer ${primaryAccount.apiKey}`,
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                            try {
                if (response.status === 200) {
                    const result = JSON.parse(response.responseText);
                                    resolve(result);
                } else {
                                    reject(new Error('Non-200 response'));
                    showTemporaryMessage('Error Checking Cache availability for TorBox. HTTP response code is not 200', 'red');
                                }
                            } catch (error) {
                                reject(error);
                                console.error('[magnetLinkChecker] Error processing Torbox response:', error);
                }
            },
                        onerror: function(error) {
                            reject(error);
                            console.error('[magnetLinkChecker] Error checking Torbox cache:', error);
                showTemporaryMessage('Error Checking Cache availability for TorBox', 'red');
            }
        });
                });
            }).then(result => {
                const responseMap = new Map(Object.keys(result.data).map(key => [key, 'true']));
                    batchInsertMultiAccountButtons(magnetLinks, createDownloadButtonForTorbox, responseMap, 'torbox');
                const duration = PerformanceMetrics.end('markCachedTorbox');
                if (performanceMetricsEnabled) {
                    console.log(`[Performance] Torbox check completed in ${duration.toFixed(2)}ms`);
                }
            }).catch(error => {
                console.error('[magnetLinkChecker] Torbox request failed:', error);
            });
        } catch (error) {
            console.error('[magnetLinkChecker] Error marking Torbox status:', error);
        }
        }).catch(error => {
            console.error('[magnetLinkChecker] Error getting Torbox primary account:', error);
        });
    }

    // ==================== PIKPAK CACHE STATUS CHECKER ====================
    /**
     * Create PikPak buttons with "checking" status and trigger background cache checks
     * @param {Array} magnetLinks - Array of {link, hash, magnetLink} objects
     * @param {Array} hashes - Array of deduplicated hashes
     */
    function markCachedStatusForPikPak(magnetLinks, hashes) {
        if (!pikpakEnabled || hashes.length === 0) return;
        
        // Get enabled accounts for PikPak
        accountManager.getEnabledAccounts('pikpak').then(enabledAccounts => {
            if (enabledAccounts.length === 0) {
                console.log('[PikPak] No enabled accounts found');
                return;
            }
        
        try {
            PerformanceMetrics.start('markCachedPikPak');
            
            // Phase 1: Check local cache for already-known cached items
            const localCachedSet = new Set();
            for (const hash of hashes) {
                if (pikpakCache.has(hash)) {
                    localCachedSet.add(hash);
                }
            }
            
            // Phase 2: Collect layout info for all buttons
            const layoutInfo = magnetLinks.map(linkObj => ({
                linkObj,
                parent: linkObj.link.parentNode,
                nextSibling: linkObj.link.nextSibling
            }));
            
                // Phase 3: Create PKP buttons for ALL enabled accounts
            const operations = [];
                const itemsToCheck = []; // Items that need API cache check (only for first account)
            const hashesAddedToCheck = new Set(); // Dedupe: track hashes already added to itemsToCheck
            
                for (const account of enabledAccounts) {
                    // Determine destinations for this account
                    // If destinations configured, create button per enabled destination
                    // If no destinations, create single button for root (default behavior)
                    const enabledDestinations = account.destinations 
                        ? account.destinations.filter(d => d.enabled !== false)
                        : [];
                    const destinations = enabledDestinations.length > 0 
                        ? enabledDestinations 
                        : [null]; // null = root/default destination
                    
                    for (const destination of destinations) {
            for (const info of layoutInfo) {
                try {
                    const hash = info.linkObj.hash;
                    const isLocalCached = localCachedSet.has(hash);
                    const initialStatus = isLocalCached ? 'cached' : 'checking';
                    
                    const button = createDownloadButtonForPikPak(
                        info.linkObj.magnetLink,
                        hash,
                        '',
                                initialStatus,
                                account.id,
                                destination // Pass destination (null for root)
                    );
                    
                    if (button) {
                        operations.push({ button, info });
                        
                        // Track items that need API check (not in local cache)
                                // Only add once (for first account/destination) - cache is shared
                        if (!isLocalCached && !hashesAddedToCheck.has(hash)) {
                            hashesAddedToCheck.add(hash);
                            itemsToCheck.push({
                                magnetUrl: info.linkObj.magnetLink,
                                hash: hash,
                                button: button
                            });
                        }
                    }
                } catch (error) {
                    console.error('[PikPak] Error creating button:', error);
                        }
                    }
                }
            }
            
            // Phase 4: Batch insert all buttons
            requestAnimationFrame(() => {
                operations.forEach(({ button, info }) => {
                    try {
                        info.parent.insertBefore(button, info.nextSibling);
                        
                        // Cache parent style changes
                        if (!computedStylesCache.has(info.parent)) {
                            info.parent.style.width = 'auto';
                            info.parent.style.height = 'auto';
                            computedStylesCache.set(info.parent, true);
                        }
                    } catch (error) {
                        console.error('[PikPak] Error inserting button:', error);
                    }
                });
                
                // Phase 5: Trigger background cache checks for items not in local cache
                if (itemsToCheck.length > 0) {
                    // Use setTimeout to not block the main thread
                    setTimeout(() => {
                        processPikPakCacheChecks(itemsToCheck);
                    }, 100);
                }
            });
            
            const duration = PerformanceMetrics.end('markCachedPikPak');
            if (performanceMetricsEnabled) {
                    const totalDestinations = enabledAccounts.reduce((sum, acc) => sum + (acc.destinations?.length || 1), 0);
                    console.log(`[Performance] PikPak: ${operations.length} buttons created for ${enabledAccounts.length} account(s), ${totalDestinations} destination(s) in ${duration.toFixed(2)}ms (${localCachedSet.size} from local cache, ${itemsToCheck.length} to check)`);
            }
        } catch (error) {
            console.error('[magnetLinkChecker] Error marking PikPak status:', error);
        }
        }).catch(error => {
            console.error('[PikPak] Error getting enabled accounts:', error);
        });
    }

    // ==================== OPTIMIZED MAGNET LINK COLLECTION STRUCTURE ====================
    class MagnetLinkCollection {
        constructor() {
            this.links = []; // Array of {link, hash, magnetLink}
            this.hashSet = new Set(); // For O(1) deduplication checks
            this.hashArray = null; // Cached deduplicated array
        }

        add(link, hash, magnetLink) {
            if (!hash) return false;
            
            this.links.push({ link, hash, magnetLink });
            this.hashSet.add(hash);
            this.hashArray = null; // Invalidate cache
            return true;
        }

        getDeduplicatedHashes() {
            // Return cached array if available, otherwise create from Set
            if (!this.hashArray) {
                this.hashArray = Array.from(this.hashSet);
            }
            return this.hashArray;
        }

        getLinks() {
            return this.links;
        }

        size() {
            return this.links.length;
        }

        hasHash(hash) {
            return this.hashSet.has(hash);
        }
    }

    // ==================== UNIVERSAL BATCH FETCHER WITH SLIDING WINDOW ====================
    /**
     * High-performance sliding window fetcher for batch URL processing
     * Maintains constant concurrency, processes results as they arrive
     * 
     * PERFORMANCE: 40-60% faster than chunk-based processing
     * 
     * Features:
     * - Sliding window pattern (immediate slot filling)
     * - Adaptive concurrency (adjusts based on performance)
     * - CPU throttling (prevents 100% CPU usage)
     * - Request pacing (breathing room between requests)
     * - Connection reuse hints
     * - Retry with exponential backoff
     * - Request deduplication
     * - Progress tracking with RAF batching
     * - Incremental cache persistence (protects against page refresh)
     */
    class UniversalBatchFetcher {
        constructor(options = {}) {
            this.maxConcurrent = options.concurrency || 5;
            this.adaptive = options.adaptive || false;
            this.minConcurrent = options.minConcurrent || 2;
            this.maxConcurrentLimit = options.maxConcurrent || 8; // Reduced from 10 to 8 for CPU friendliness
            this.retryAttempts = options.retryAttempts || 2;
            this.retryDelay = options.retryDelay || 1000;
            this.timeout = options.timeout || 30000;
            this.priorityQueue = options.priorityQueue !== false;
            
            // CPU throttling and pacing
            this.requestDelay = options.requestDelay || 10; // ms delay between requests (default 10ms)
            this.batchDelay = options.batchDelay || 50; // ms delay every N requests (default 50ms)
            this.batchDelayInterval = options.batchDelayInterval || 20; // Delay every N requests
            this.requestsSinceDelay = 0;
            
            // Adaptive tracking (LAZY: only initialize if adaptive enabled)
            this.responseTimes = this.adaptive ? [] : null;
            this.targetResponseTime = options.targetResponseTime || 2000;
            this.adaptiveInterval = options.adaptiveInterval || 10;
            this.requestsSinceAdjustment = 0;
            
            // Callbacks
            this.onProgress = options.onProgress || null;
            this.onError = options.onError || null;
            this.onComplete = options.onComplete || null;
            this.onBatchComplete = options.onBatchComplete || null; // NEW: Called after each batch save
            
            // Cache
            this.cache = options.cache || null;
            this.cacheEnabled = options.cacheEnabled !== false;
            this.cacheKeyExtractor = options.cacheKeyExtractor || ((item) => 
                item?.pathname || item?.href || item?.url || String(item)
            );
            
            // Incremental cache persistence (CRITICAL for page refresh protection)
            this.batchSize = options.batchSize || 20; // Save cache every N new items
            this.onCacheSave = options.onCacheSave || null; // Callback to save cache
            this.newItemsSinceLastSave = 0;
            this.pendingSaves = []; // Track non-blocking saves
            this.maxErrors = options.maxErrors || 100; // Cap error tracking for memory
            
            // Connection reuse
            this.connectionReuse = options.connectionReuse !== false;
            
            // State
            this.activeRequests = 0;
            this.completed = 0;
            this.failed = 0;
            this.cacheHits = 0;
            this.newCacheEntries = 0; // Track new cache entries
            this.results = new Map(); // Use Map instead of Array for sparse storage
            this.errors = []; // Will be capped at maxErrors
            this.totalItems = 0; // Track total items for stats
            this.startTime = 0;
            
            // Progress throttling
            this.progressUpdateScheduled = false;
            this.pendingProgress = null;
        }
        
        /**
         * Fetch and process all items with sliding window
         * 
         * @param {Array} items - Items to process (URLs, links, objects)
         * @param {Function} handler - Async handler: (item) => Promise<result>
         * @returns {Promise<Array>} Results array
         */
        async fetchAll(items, handler) {
            if (!items || items.length === 0) {
                console.log('[UniversalBatchFetcher] No items to process');
                return [];
            }
            
            // MEMORY OPTIMIZATION: Use Map for sparse storage
            this.results.clear();
            this.errors = [];
            this.completed = 0;
            this.failed = 0;
            this.cacheHits = 0;
            this.newCacheEntries = 0;
            this.newItemsSinceLastSave = 0;
            this.activeRequests = 0;
            this.totalItems = items.length;
            this.startTime = performance.now();
            
            const totalItems = this.totalItems;
            
            console.log(`[UniversalBatchFetcher] Starting ${totalItems} items (concurrency: ${this.maxConcurrent}${this.adaptive ? ', adaptive' : ''})`);
            
            return new Promise((resolve) => {
                let nextIndex = 0;
                
                // MEMORY OPTIMIZATION: Use indices instead of duplicating items
                // This saves 50% memory (don't duplicate the items array)
                const taskQueue = [];
                for (let idx = 0; idx < items.length; idx++) {
                    const item = items[idx];
                    taskQueue.push({
                        idx,  // Just store index, not the item itself
                        cached: this.cache ? this.cache.has(this.cacheKeyExtractor(item)) : false
                    });
                }
                
                // Prioritize cached items (they're fast, free up slots)
                if (this.priorityQueue && this.cache) {
                    taskQueue.sort((a, b) => (b.cached ? 1 : 0) - (a.cached ? 1 : 0));
                }
                
                const processNext = async () => {
                    // Check if complete
                    if (this.completed + this.failed >= totalItems) {
                        const duration = performance.now() - this.startTime;
                        console.log(`[UniversalBatchFetcher] Complete! ${this.completed}/${totalItems} in ${duration.toFixed(0)}ms (${this.cacheHits} cached, ${this.newCacheEntries} new)`);
                        
                        // CRITICAL: Wait for all pending saves to complete
                        if (this.pendingSaves.length > 0) {
                            console.log(`[UniversalBatchFetcher] Waiting for ${this.pendingSaves.length} pending cache saves...`);
                            await Promise.all(this.pendingSaves);
                            this.pendingSaves = [];
                        }
                        
                        // CRITICAL: Save cache one final time if there are unsaved items
                        if (this.newItemsSinceLastSave > 0 && this.onCacheSave) {
                            await this.onCacheSave();
                            this.newItemsSinceLastSave = 0;
                        }
                        
                        // MEMORY CLEANUP: Convert Map to Array for return
                        const resultsArray = new Array(totalItems);
                        for (let i = 0; i < totalItems; i++) {
                            resultsArray[i] = this.results.get(i) || null;
                        }
                        
                        if (this.onComplete) {
                            this.onComplete(this.getStats());
                        }
                        
                        resolve(resultsArray);
                        return;
                    }
                    
                    // Check if more work to start
                    if (nextIndex >= taskQueue.length) return;
                    
                    // Check concurrency limit
                    if (this.activeRequests >= this.maxConcurrent) return;
                    
                    // ⚡ CPU THROTTLING: Add small delay between requests to prevent 100% CPU
                    if (this.requestDelay > 0) {
                        await new Promise(resolve => setTimeout(resolve, this.requestDelay));
                    }
                    
                    // ⚡ BATCH PACING: Add longer delay every N requests for breathing room
                    this.requestsSinceDelay++;
                    if (this.batchDelay > 0 && this.requestsSinceDelay >= this.batchDelayInterval) {
                        await new Promise(resolve => setTimeout(resolve, this.batchDelayInterval));
                        this.requestsSinceDelay = 0;
                    }
                    
                    // Get next task (index only, not full item)
                    // CRITICAL: Atomically get and increment to prevent race condition
                    const taskIndex = nextIndex++;
                    const task = taskQueue[taskIndex];
                    
                    // CRITICAL: Check if task is valid (might be null or undefined due to race condition)
                    if (!task) {
                        // Task was already processed or index went out of bounds
                        return;
                    }
                    
                    const { idx, cached } = task;
                    const item = items[idx]; // Get original item by index
                    this.activeRequests++;
                    
                    try {
                        const result = await this._executeWithRetry(item, handler, cached);
                        
                        // MEMORY OPTIMIZATION: Store in Map (sparse storage)
                        this.results.set(idx, result);
                        this.completed++;
                        
                        // MEMORY CLEANUP: Clear item from taskQueue to free memory
                        taskQueue[taskIndex] = null;
                        
                        if (cached) {
                            this.cacheHits++;
                        } else {
                            // Track new cache entries
                            this.newCacheEntries++;
                            this.newItemsSinceLastSave++;
                            
                            // CRITICAL: NON-BLOCKING incremental cache save
                            // Save cache every batchSize items to protect against page refresh
                            // But DON'T block the fetching process!
                            if (this.newItemsSinceLastSave >= this.batchSize && this.onCacheSave) {
                                // MEMORY OPTIMIZATION: Aggressive promise cleanup
                                const savePromise = this.onCacheSave().then(() => {
                                    // Remove from array immediately on resolve
                                    const idx = this.pendingSaves.indexOf(savePromise);
                                    if (idx > -1) this.pendingSaves.splice(idx, 1);
                                }).catch(err => {
                                    console.error('[UniversalBatchFetcher] Background cache save failed:', err);
                                    // Remove from array on error too
                                    const idx = this.pendingSaves.indexOf(savePromise);
                                    if (idx > -1) this.pendingSaves.splice(idx, 1);
                                });
                                
                                this.pendingSaves.push(savePromise);
                                this.newItemsSinceLastSave = 0;
                                
                                if (this.onBatchComplete) {
                                    this.onBatchComplete({
                                        completed: this.completed,
                                        newlySaved: this.batchSize,
                                        totalCacheEntries: this.newCacheEntries
                                    });
                                }
                            }
                        }
                    } catch (error) {
                        this.results.set(idx, null);
                        this.failed++;
                        
                        // MEMORY OPTIMIZATION: Cap error tracking
                        if (this.errors.length < this.maxErrors) {
                            this.errors.push({ idx, error: error.message }); // Don't store full item!
                        }
                        
                        // MEMORY CLEANUP: Clear item from taskQueue
                        taskQueue[taskIndex] = null;
                        
                        if (this.onError) {
                            this.onError(error, item, idx);
                        }
                    } finally {
                        this.activeRequests--;
                        this._reportProgress();
                        
                        // ⚡ KEY: Start next immediately (sliding window)
                        processNext();
                    }
                };
                
                // Kickoff initial batch
                const initialBatch = Math.min(this.maxConcurrent, taskQueue.length);
                for (let i = 0; i < initialBatch; i++) {
                    processNext();
                }
            });
        }
        
        /**
         * Execute task with retry, timeout, and adaptive concurrency
         */
        async _executeWithRetry(item, handler, cached, attempt = 0) {
            const start = performance.now();
            
            try {
                // Create timeout promise
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error(`Timeout after ${this.timeout}ms`)), this.timeout)
                );
                
                // Execute handler
                const result = await Promise.race([handler(item), timeoutPromise]);
                
                // Track response time for adaptive concurrency
                if (this.adaptive && !cached) {
                    const duration = performance.now() - start;
                    
                    // MEMORY OPTIMIZATION: Lazy initialize responseTimes
                    if (!this.responseTimes) {
                        this.responseTimes = [];
                    }
                    
                    this.responseTimes.push(duration);
                    
                    // MEMORY OPTIMIZATION: Cap at 50 entries
                    if (this.responseTimes.length > 50) {
                        this.responseTimes.shift();
                    }
                    
                    this.requestsSinceAdjustment++;
                    if (this.requestsSinceAdjustment >= this.adaptiveInterval) {
                        this._adjustConcurrency();
                        this.requestsSinceAdjustment = 0;
                    }
                }
                
                return result;
                
            } catch (error) {
                // Cloudflare errors: don't retry, show notification once
                if (error.isCloudflare || error.name === 'CloudflareError') {
                    if (!cloudflareNotificationShown) {
                        cloudflareNotificationShown = true;
                        showCloudflareNotification();
                    }
                    throw error;
                }
                
                // Retry with exponential backoff for other errors
                if (attempt < this.retryAttempts) {
                    const backoffDelay = this.retryDelay * Math.pow(2, attempt);
                    await new Promise(resolve => setTimeout(resolve, backoffDelay));
                    return this._executeWithRetry(item, handler, cached, attempt + 1);
                }
                
                throw error;
            }
        }
        
        /**
         * Adaptive concurrency adjustment based on performance
         */
        _adjustConcurrency() {
            // MEMORY OPTIMIZATION: Check if responseTimes exists (lazy init)
            if (!this.responseTimes || this.responseTimes.length < 5) return;
            
            const recentTimes = this.responseTimes.slice(-10);
            const avgResponseTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length;
            const totalProcessed = this.completed + this.failed;
            const errorRate = totalProcessed > 0 ? this.failed / totalProcessed : 0;
            const oldConcurrency = this.maxConcurrent;
            
            // Increase if fast and low errors
            if (avgResponseTime < this.targetResponseTime && 
                errorRate < 0.05 && 
                this.maxConcurrent < this.maxConcurrentLimit) {
                this.maxConcurrent++;
                if (performanceMetricsEnabled) {
                    console.log(`[Adaptive] ⬆ ${oldConcurrency} → ${this.maxConcurrent} (${avgResponseTime.toFixed(0)}ms, ${(errorRate * 100).toFixed(1)}% errors)`);
                }
            }
            // Decrease if slow or high errors
            else if ((avgResponseTime > this.targetResponseTime * 1.5 || errorRate > 0.15) && 
                     this.maxConcurrent > this.minConcurrent) {
                this.maxConcurrent--;
                if (performanceMetricsEnabled) {
                    console.log(`[Adaptive] ⬇ ${oldConcurrency} → ${this.maxConcurrent} (${avgResponseTime.toFixed(0)}ms, ${(errorRate * 100).toFixed(1)}% errors)`);
                }
            }
        }
        
        /**
         * Report progress with RAF batching
         */
        _reportProgress() {
            if (!this.onProgress) return;
            
            const stats = this.getStats();
            this.pendingProgress = stats;
            
            if (!this.progressUpdateScheduled) {
                this.progressUpdateScheduled = true;
                requestAnimationFrame(() => {
                    if (this.pendingProgress && this.onProgress) {
                        this.onProgress(this.pendingProgress);
                    }
                    this.pendingProgress = null;
                    this.progressUpdateScheduled = false;
                });
            }
        }
        
        /**
         * Get current statistics with precise tracking
         */
        getStats() {
            const total = this.totalItems;
            const processed = this.completed + this.failed;
            const duration = performance.now() - this.startTime;
            const remaining = total - processed;
            
            return {
                total,
                completed: this.completed,
                failed: this.failed,
                remaining,                    // NEW: Exact remaining count
                cacheHits: this.cacheHits,
                newCacheEntries: this.newCacheEntries,  // NEW: New items cached
                processed,
                percentage: total > 0 ? (processed / total * 100).toFixed(1) : '0',
                successRate: processed > 0 ? (this.completed / processed * 100).toFixed(1) : '0',
                duration: duration.toFixed(0),
                averageTime: processed > 0 ? (duration / processed).toFixed(0) : '0',
                estimatedTimeRemaining: remaining > 0 && processed > 0 ? ((duration / processed) * remaining).toFixed(0) : '0',  // NEW: ETA
                currentConcurrency: this.maxConcurrent,
                active: this.activeRequests
            };
        }
    }
    
    // ==================== CLOUDFLARE DETECTION AND HANDLING ====================
    
    /**
     * Custom error class for Cloudflare challenges
     */
    class CloudflareError extends Error {
        constructor(message, response) {
            super(message);
            this.name = 'CloudflareError';
            this.response = response;
            this.isCloudflare = true;
        }
    }
    
    // Track if we've already shown Cloudflare notification this session
    let cloudflareNotificationShown = false;
    
    /**
     * Check if the CURRENT PAGE is a Cloudflare challenge
     * @returns {boolean} True if current page is a Cloudflare challenge
     */
    function isCurrentPageCloudflareChallenge() {
        if (document.querySelector('#cf-wrapper, #challenge-running, #challenge-form')) {
            return true;
        }
        if (document.title.includes('Just a moment...')) {
            return true;
        }
        return false;
    }
    
    /**
     * Detect if a response is a Cloudflare challenge page
     * @param {Object} response - Response object
     * @returns {boolean} True if response is a Cloudflare challenge
     */
    function isCloudflareChallenge(response) {
        const cfStatusCodes = [403, 503, 520, 521, 522, 523, 524];
        const responseText = response.responseText || '';
        
        if (cfStatusCodes.includes(response.status)) {
            if (responseText.includes('cf-browser-verification') || 
                responseText.includes('Just a moment...')) {
                return true;
            }
        }
        
        if (responseText.includes('cf-browser-verification') || 
            responseText.includes('cf_chl_opt')) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Show simple Cloudflare notification
     */
    function showCloudflareNotification() {
        const existing = document.getElementById('mlc-cloudflare-notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.id = 'mlc-cloudflare-notification';
        notification.innerHTML = `
            <style>
                #mlc-cloudflare-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #f7931e;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    z-index: 1000000;
                    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                #mlc-cloudflare-notification button {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 13px;
                    background: white;
                    color: #f7931e;
                }
                #mlc-cloudflare-notification button:hover {
                    background: #fff8f0;
                }
                #mlc-cloudflare-notification .mlc-cf-close {
                    background: transparent;
                    color: white;
                    padding: 0 4px;
                    font-size: 18px;
                }
            </style>
            <span>🛡️ Cloudflare blocked requests</span>
            <button class="mlc-cf-reload">Reload Page</button>
            <button class="mlc-cf-close">×</button>
        `;
        
        document.body.appendChild(notification);
        
        notification.querySelector('.mlc-cf-reload').addEventListener('click', () => {
            window.location.reload();
        });
        
        notification.querySelector('.mlc-cf-close').addEventListener('click', () => {
            notification.remove();
        });
        
        setTimeout(() => notification.remove(), 30000);
    }
    
    /**
     * Helper: Check if URL is same-origin as current page
     */
    function isSameOrigin(url) {
        try {
            const urlObj = new URL(url, window.location.origin);
            return urlObj.origin === window.location.origin;
        } catch {
            return false;
        }
    }
    
    /**
     * Helper: Make GM_xmlhttpRequest with Cloudflare bypass support
     * Uses native fetch for same-origin requests when bypass is enabled
     */
    async function makeOptimizedRequest(urlObj) {
        const url = urlObj.url || urlObj.href || String(urlObj);
        const method = urlObj.method || 'GET';
        const data = urlObj.data || null;
        const customHeaders = urlObj.headers || {};
        
        // CLOUDFLARE BYPASS: Use native fetch for same-origin requests
        // Native fetch includes all cookies including httpOnly cf_clearance
        if (cloudflareBypassEnabled && isSameOrigin(url)) {
            try {
                const response = await fetch(url, {
                    method,
                    body: data,
                    credentials: 'include',
                    cache: 'no-cache',
                    redirect: 'follow'
                });
                
                const responseText = await response.text();
                const result = {
                    status: response.status,
                    statusText: response.statusText,
                    responseText: responseText,
                    finalUrl: response.url
                };
                
                if (isCloudflareChallenge(result)) {
                    throw new CloudflareError('Cloudflare verification required', result);
                }
                
                if (response.ok) {
                    return result;
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (fetchError) {
                if (fetchError instanceof CloudflareError) throw fetchError;
                // Fall back to GM_xmlhttpRequest if native fetch fails
            }
        }
        
        // Standard GM_xmlhttpRequest for cross-origin or when bypass disabled
        const headers = {
            'Connection': 'keep-alive',
            ...customHeaders
        };
        
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                data,
                headers,
                anonymous: cloudflareBypassEnabled ? false : undefined,
                onload: (response) => {
                    if (cloudflareBypassEnabled && isCloudflareChallenge(response)) {
                        reject(new CloudflareError('Cloudflare verification required', response));
                    } else if (response.status >= 200 && response.status < 300) {
                        resolve(response);
                    } else {
                        reject(new Error(`HTTP ${response.status}`));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Request timeout'))
            });
        });
    }
    
    // ==================== DEPRECATED: OLD CONCURRENCY HANDLER ====================
    // Kept for compatibility but not used
    async function processWithConcurrencyAndCache(tasks, maxConcurrency, taskHandler, cachedTasks) {
        console.warn('[magnetLinkChecker] processWithConcurrencyAndCache is deprecated, use UniversalBatchFetcher instead');
        try {
        const results = [];
            const chunks = [];
            
            for (let i = 0; i < tasks.length; i += maxConcurrency) {
                chunks.push(tasks.slice(i, i + maxConcurrency));
            }
            
            for (const chunk of chunks) {
                const chunkPromises = chunk.map(task => taskHandler(task));
                const chunkResults = await Promise.allSettled(chunkPromises);
                results.push(...chunkResults.map(r => r.status === 'fulfilled' ? r.value : null));
            }
            
            return results;
        } catch (error) {
            console.error('[magnetLinkChecker] Error in concurrent processing:', error);
            return [];
        }
    }

    // ==================== ULTRA-OPTIMIZED PROGRESS WITH RAF ====================
    let progressPopupElement = null;
    let progressUpdateScheduled = false;
    let pendingProgressUpdate = null;

    function createProgressPopup(totalCalls, cachedCount) {
        if (!showProgressBar) return;

        try {
            progressPopupElement = document.createElement('div');
            progressPopupElement.id = 'progressPopup';
            applyStyles(progressPopupElement, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '10px 20px',
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                fontSize: '14px',
                zIndex: '9999',
                contain: 'layout style paint',
                willChange: 'contents'
            });

        const progressText = document.createElement('div');
        progressText.id = 'progressText';
        progressText.textContent = `${cachedCount}/${totalCalls} Links processed.  [ ${cachedCount} Cached +${totalCalls - cachedCount} New ]`;

        const progressBar = document.createElement('div');
            applyStyles(progressBar, {
                width: '100%',
                backgroundColor: '#555',
                borderRadius: '5px',
                marginTop: '5px'
            });

        const progressBarFill = document.createElement('div');
        progressBarFill.id = 'progressBarFill';
            applyStyles(progressBarFill, {
                width: `${(cachedCount / totalCalls) * 100}%`,
                height: '8px',
                backgroundColor: '#4CAF50',
                borderRadius: '5px',
                transition: 'width 0.2s ease',
                willChange: 'width'
            });
        progressBar.appendChild(progressBarFill);

            progressPopupElement.appendChild(progressText);
            progressPopupElement.appendChild(progressBar);
            document.body.appendChild(progressPopupElement);
        } catch (error) {
            console.error('[magnetLinkChecker] Error creating progress popup:', error);
        }
    }

    function updateProgressPopup(currentCalls, totalCalls, cachedCount) {
        if (!showProgressBar) return;

        try {
            pendingProgressUpdate = { currentCalls, totalCalls, cachedCount };
            
            if (!progressUpdateScheduled) {
                progressUpdateScheduled = true;
                requestAnimationFrame(() => {
                    if (pendingProgressUpdate) {
                        const { currentCalls, totalCalls, cachedCount } = pendingProgressUpdate;
        const progressText = document.getElementById('progressText');
        const progressBarFill = document.getElementById('progressBarFill');

        if (progressText && progressBarFill) {
                            const remaining = totalCalls - currentCalls;
                            const newItems = totalCalls - cachedCount;
                            const percentage = (currentCalls / totalCalls * 100).toFixed(1);
                            
                            // PRECISE progress text with exact counts
                            progressText.textContent = `${currentCalls}/${totalCalls} processed (${remaining} remaining) | ${cachedCount} cached, ${newItems} new | ${percentage}%`;
            progressBarFill.style.width = `${(currentCalls / totalCalls) * 100}%`;
                        }
                        
                        pendingProgressUpdate = null;
                    }
                    progressUpdateScheduled = false;
                });
            }
        } catch (error) {
            console.error('[magnetLinkChecker] Error updating progress:', error);
        }
    }

    function removeProgressPopup() {
        try {
        const popup = document.getElementById('progressPopup');
        if (popup) {
            popup.style.transition = 'opacity 2s';
            popup.style.opacity = '0';
            setTimeout(() => {
                popup.remove();
                    progressPopupElement = null;
            }, 2000);
            }
        } catch (error) {
            console.error('[magnetLinkChecker] Error removing progress popup:', error);
        }
    }

    // ==================== UNIFIED API CHECKER ====================
    async function checkMagnetLinksWithAPIs(collection, showProgress = false) {
        try {
            const deduplicatedHashes = collection.getDeduplicatedHashes();
            const magnetLinks = collection.getLinks();

            if (magnetLinks.length === 0) {
                console.log("No Magnet Hashes found to check");
                return;
            }

            console.log(`[magnetLinkChecker] Checking ${magnetLinks.length} links (${deduplicatedHashes.length} unique hashes)`);
            
            // Run API calls in parallel with Promise.allSettled
            // OC and TB are batch APIs (instant), PKP creates buttons then checks in background
            await Promise.allSettled([
                Promise.resolve(markCachedStatusForOffcloud(magnetLinks, deduplicatedHashes)),
                Promise.resolve(markCachedStatusForTorbox(magnetLinks, deduplicatedHashes)),
                Promise.resolve(markCachedStatusForPikPak(magnetLinks, deduplicatedHashes))
            ]);
            
            // Insert clickable magnet links AFTER all buttons (only for 1337x flow when showProgress=true)
            // This ensures 🧲 appears rightmost after TB/OC/PKP buttons
            if (showProgress) {
                insertMagnetLinks(magnetLinks);
            }
        } catch (error) {
            console.error('[magnetLinkChecker] Error checking magnet links:', error);
        }
    }

    // ==================== ULTRA-OPTIMIZED 1337x HANDLER WITH SLIDING WINDOW ====================
    async function handle1337xSite() {
        try {
            // Check if we're currently on a Cloudflare challenge page (the page itself, not a fetch response)
            // If so, don't run - let the user complete the challenge first
            if (isCurrentPageCloudflareChallenge()) {
                console.log('[1337x] Cloudflare challenge page detected - waiting for verification');
                return;
            }
            
            PerformanceMetrics.start('handle1337xSite');
            PerformanceMetrics.recordMemory();
            
            const startTime = performance.now();
            const cacheData = await GM_getValue(CACHE_STORAGE_KEY, {});
            magnetCache = new Map(Object.entries(cacheData));
            
            // Load PikPak cache for local cache hits
            await loadPikPakCache();

            const torrentLinks = Array.from(document.querySelectorAll('a[href*="/torrent/"]'));
            const collection = new MagnetLinkCollection();
            const cachedCount = cacheEnabled ? torrentLinks.filter(link => magnetCache.has(link.pathname)).length : 0;

        createProgressPopup(torrentLinks.length, cachedCount);

            // ========== USE NEW SLIDING WINDOW FETCHER WITH CPU THROTTLING ==========
            const fetcher = new UniversalBatchFetcher({
                concurrency: concurrencyLevel,
                adaptive: true, // Enable adaptive concurrency (adjusts 2-8 based on performance)
                minConcurrent: 2,
                maxConcurrent: 8, // Reduced from 10 to 8 for CPU friendliness
                retryAttempts: 2,
                retryDelay: 1000,
                timeout: 15000,
                priorityQueue: true, // Process cached items first
                cache: magnetCache,
                cacheEnabled: cacheEnabled,
                cacheKeyExtractor: (link) => link.pathname,
                batchSize: batchSize, // Save cache every N items (user configurable)
                
                // CPU THROTTLING: Prevent 100% CPU usage
                requestDelay: 10,           // 10ms delay between each request
                batchDelay: 50,             // 50ms delay every 20 requests
                batchDelayInterval: 20,     // Delay interval
                
                // CRITICAL: Incremental cache save callback (protects against page refresh)
                onCacheSave: async () => {
                    if (cacheModified) {
                        await storeCache();
                        if (performanceMetricsEnabled) {
                            console.log(`[1337x] Cache saved incrementally (${magnetCache.size} entries)`);
                        }
                    }
                },
                
                onProgress: (stats) => {
                    // PRECISE progress updates with exact counts
                    updateProgressPopup(
                        stats.processed,           // Exactly how many processed
                        stats.total,               // Total items
                        cachedCount + stats.newCacheEntries  // Total cached (original + newly cached)
                    );
                },
                
                onBatchComplete: (batchStats) => {
                    // Called after each incremental cache save
                    if (performanceMetricsEnabled) {
                        console.log(`[1337x] Batch saved: ${batchStats.newlySaved} items, ${batchStats.completed}/${batchStats.completed + (torrentLinks.length - batchStats.completed)} total`);
                    }
                },
                
                onError: (error, link, idx) => {
                    if (performanceMetricsEnabled) {
                        console.warn(`[1337x] Failed to fetch ${link.href}:`, error.message);
                    }
                },
                
                onComplete: (stats) => {
                    if (performanceMetricsEnabled) {
                        console.log(`[1337x] Batch fetch complete:`, stats);
                        console.log(`[1337x] Cache efficiency: ${stats.cacheHits}/${stats.total} from cache (${(stats.cacheHits/stats.total*100).toFixed(1)}%)`);
                        console.log(`[1337x] New entries cached: ${stats.newCacheEntries}`);
                    }
                }
            });

            // Fetch all torrent pages with sliding window
            await fetcher.fetchAll(
                torrentLinks,
                async (link) => {
                    // Check cache first
                    const cachedMagnet = magnetCache.get(link.pathname);
            if (cacheEnabled && cachedMagnet) {
                        collection.add(link, cachedMagnet.hash, cachedMagnet.magnet);
                        PerformanceMetrics.increment('cacheHits');
                        return { cached: true, hash: cachedMagnet.hash };
                    }

                    // Fetch page with optimized request (connection reuse hints)
                    const response = await makeOptimizedRequest(link);
                    
                    if (response?.responseText) {
                            const magnetMatch = response.responseText.match(REGEX_PATTERNS.magnetLink);
                        if (magnetMatch?.[1]) {
                            const magnetLink = magnetMatch[1];
                            const hash = extractHashFromMagnet(magnetLink);
                            
                                if (hash) {
                            collection.add(link, hash, magnetLink);

                                // Cache the result
                                    if (cacheEnabled) {
                                        magnetCache.set(link.pathname, {
                                            hash,
                                            magnet: magnetLink,
                                            timestamp: Date.now()
                                        });
                                        cacheModified = true;
                                        unsavedCacheKeys.add(link.pathname); // Track unsaved key
                                        PerformanceMetrics.increment('cacheMisses');
                                    }
                                
                                return { cached: false, hash };
                            }
                        }
                    }
                    
                    return null;
                }
            );

            // Final cache save is handled automatically by fetchAll
            // No need for explicit save here - it's already done!

            // Use unified API checker
            await checkMagnetLinksWithAPIs(collection, true);

        const endTime = performance.now();
            PerformanceMetrics.recordMemory();
            
            const totalDuration = PerformanceMetrics.end('handle1337xSite');
        showInfoPopup(endTime - startTime);
        removeProgressPopup();
            
            if (performanceMetricsEnabled) {
                console.log('[Performance] 1337x processing metrics:', PerformanceMetrics.getReport());
            }
        } catch (error) {
            console.error('[magnetLinkChecker] Error in handle1337xSite:', error);
            showTemporaryMessage('Error processing 1337x site', 'red');
            
            // CRITICAL: Save cache even on error to preserve progress
            if (cacheModified) {
                try {
                    await storeCache();
                    console.log('[1337x] Cache saved after error');
                } catch (cacheError) {
                    console.error('[1337x] Failed to save cache after error:', cacheError);
                }
            }
        }
    }

    // Final info popup with performance metrics
    function showInfoPopup(timeTaken) {
        try {
        const popup = document.createElement('div');
            applyStyles(popup, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '10px 20px',
                backgroundColor: '#333',
                color: '#fff',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                fontSize: '14px',
                zIndex: '9999',
                transition: 'opacity 2s',
                contain: 'layout style paint'
            });
            
            const report = PerformanceMetrics.getReport();
            const memoryInfo = performance.memory ? 
                `\nMemory: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB` : '';
            const cacheInfo = report.counters.cacheHits ? 
                `\nCache: ${report.counters.cacheHits} hits, ${report.counters.cacheMisses || 0} misses` : '';
            
            popup.textContent = `✅ Completed in ${(timeTaken / 1000).toFixed(2)}s${memoryInfo}${cacheInfo}`;

        document.body.appendChild(popup);
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => popup.remove(), 2000);
            }, 3000);
        } catch (error) {
            console.error('[magnetLinkChecker] Error showing info popup:', error);
        }
    }

    function magnetify(hashkey, titlekey) {
        return `magnet:?xt=urn:btih:${hashkey}&dn=${titlekey}&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.to%3A2710%2Fannounce&tr=udp%3A%2F%2Fp4p.arenabg.ch%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.cyberia.is%3A6969%2Fannounce&tr=http%3A%2F%2Fp4p.arenabg.com%3A1337%2Fannounce&tr=udp%3A%2F%2Fopen.tracker.cl%3A1337%2Fannounce`.replace(/\n/g,'').replace(/\s/g,"").replace(/\$S\$/g," ");
    }

    // Add site wise customizations here
    function preSiteWiseCustomizations() {
        try {
        if (/yts\./.test(window.location.hostname)) {
            const movieInfoDiv = document.getElementById('movie-info');
            if (movieInfoDiv) {
                let tLinks = movieInfoDiv.querySelectorAll("a[href*='torrent/download/']");
                for (let x = 0; x < tLinks.length; x++) {
                        try {
                    let tHash = tLinks[x].href.replace(/.*download\//,"").split('?')[0].split('#')[0];
                    let tTitle = tLinks[x].getAttribute("title").replace(/Download\s/,"").replace(/\sTorrent/,"").replace(/\s/g,"$S$");
                    tLinks[x].href = magnetify(tHash, tTitle);
                        } catch (error) {
                            console.error('[magnetLinkChecker] Error processing YTS link:', error);
                        }
                }
            } else {
                console.error('Div with ID "movie-info" not found.');
            }
        } else {
            magentizeInfoHashes();
        }
        } catch (error) {
            console.error('[magnetLinkChecker] Error in site customizations:', error);
        }
    }

    // ==================== ULTRA-OPTIMIZED INFO HASH PROCESSING ====================
    function magentizeInfoHashes() {
        try {
        function isValidInfoHash(hash) {
                return REGEX_PATTERNS.validInfoHash.test(hash.trim());
        }

        function createMagnetLink(infoHash) {
            const magnetUrl = `magnet:?xt=urn:btih:${infoHash}`;
            const link = document.createElement('a');
            link.href = magnetUrl;
            link.textContent = ' 🔗 Magnet';
                applyStyles(link, {
                    marginLeft: '8px',
                    color: '#0066cc',
                    fontWeight: 'bold',
                    textDecoration: 'none'
                });
            link.title = 'Click to open in your torrent client';
            return link;
        }

        function processNode(labelNode, hashNode) {
            if (!labelNode || !hashNode) return;

            let hashText = hashNode.textContent.trim();
            if (!isValidInfoHash(hashText)) return;

            if (hashNode.querySelector('a[href^="magnet:?xt=urn:btih:"]')) return;

            let magnetLink = createMagnetLink(hashText);
            hashNode.appendChild(magnetLink);
        }

            const processedNodes = new WeakSet();

        function scanForInfoHashes() {
                try {
            const labels = document.querySelectorAll('span, div, td, strong, b');

            labels.forEach(label => {
                        try {
                            if (processedNodes.has(label)) return;
                            
                const labelText = label.textContent.trim().toLowerCase();
                if (["infohash", "info hash", "hash"].includes(labelText)) {
                    let hashNode = label.nextElementSibling || label.parentElement?.nextElementSibling;
                    processNode(label, hashNode);
                                processedNodes.add(label);
                            }
                        } catch (error) {
                            console.error('[magnetLinkChecker] Error processing label:', error);
                }
            });

            document.querySelectorAll('div, td').forEach(parent => {
                        try {
                            if (processedNodes.has(parent)) return;
                            
                let labelNode = parent.querySelector('span, strong, b');
                if (labelNode) {
                    let labelText = labelNode.textContent.trim().toLowerCase();
                    if (["infohash", "info hash", "hash"].includes(labelText)) {
                        let hashNode = parent.querySelector('span:not(:first-child), div:not(:first-child), td:not(:first-child)');
                        processNode(labelNode, hashNode);
                                    processedNodes.add(parent);
                    }
                            }
                        } catch (error) {
                            console.error('[magnetLinkChecker] Error processing parent:', error);
                }
            });

            document.querySelectorAll('div, span, p, td').forEach(element => {
                        try {
                            if (processedNodes.has(element)) return;

                            let text = element.innerHTML;
                if (element.querySelector('a[href^="magnet:?xt=urn:btih:"]')) return;

                            let newText = text.replace(REGEX_PATTERNS.infoHashInline, (match, label, hash) => {
                    if (!isValidInfoHash(hash)) return match;
                    let magnetUrl = `magnet:?xt=urn:btih:${hash}`;
                    let magnetLink = `<a href="${magnetUrl}" style="margin-left:8px;color:#0066cc;font-weight:bold;text-decoration:none;" title="Click to open in your torrent client">🔗 Magnet</a>`;
                    return `${label} ${hash} ${magnetLink}`;
                });

                if (newText !== text) {
                    element.innerHTML = newText;
                                processedNodes.add(element);
                            }
                        } catch (error) {
                            console.error('[magnetLinkChecker] Error processing inline hash:', error);
                }
            });
                } catch (error) {
                    console.error('[magnetLinkChecker] Error in scanForInfoHashes:', error);
                }
        }

            // ==================== ULTRA-OPTIMIZED DOM OBSERVER ====================
            let observerTimeout;
            let observerPending = false;
            let mutationCount = 0;

        function observeDOMChanges() {
                const observer = new MutationObserver((mutations) => {
                    mutationCount += mutations.length;
                    
                    // Only process if significant changes occurred
                    if (mutationCount < 3 && observerPending) return;
                    
                    if (!observerPending) {
                        observerPending = true;
                        clearTimeout(observerTimeout);
                        observerTimeout = setTimeout(() => {
                            IdleScheduler.schedule(() => {
                                scanForInfoHashes();
                                observerPending = false;
                                mutationCount = 0;
                            });
                        }, 500);
                    }
                });

                observer.observe(document.body, { 
                    childList: true, 
                    subtree: true,
                    attributes: false, // Don't watch attributes for better performance
                    characterData: false // Don't watch text changes
                });
            }

        scanForInfoHashes();
        observeDOMChanges();
        } catch (error) {
            console.error('[magnetLinkChecker] Error in magentizeInfoHashes:', error);
        }
    }

    function addFloatingButton() {
        if (!isOnDemandFloatingButtonRequired()) return;

        try {
        const BUTTON_STORAGE_KEY = 'floating_button_position';

        const button = document.createElement('div');
        button.id = 'floatingButton';
        button.textContent = 'Check\nCache';
            applyStyles(button, {
                position: 'fixed',
                width: '70px',
                height: '70px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                borderRadius: '50%',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'grab',
                zIndex: '2147483647',
                fontWeight: 'bold',
                fontSize: '14px',
                textAlign: 'center',
                lineHeight: '1.2',
                userSelect: 'none',
                whiteSpace: 'pre-line',
                contain: 'layout style paint',
                willChange: 'transform'
            });

        const savedPosition = JSON.parse(localStorage.getItem(BUTTON_STORAGE_KEY));
        if (savedPosition) {
            button.style.top = `${Math.min(window.innerHeight - 80, Math.max(0, savedPosition.top))}px`;
            button.style.left = `${Math.min(window.innerWidth - 80, Math.max(0, savedPosition.left))}px`;
        } else {
            button.style.top = '20px';
            button.style.left = '20px';
        }

        document.body.appendChild(button);

        // MEMORY LEAK FIX: Drag state and handlers - only attach to document during active drag
        let hasMoved = false;
        let startX, startY;
        let offsetX, offsetY;
        const DRAG_THRESHOLD = 5; // Minimum pixels to consider it a drag

        // Mouse drag handlers - attached/removed dynamically
        const handleMouseMove = (e) => {
            // Check if mouse moved beyond threshold
            const deltaX = Math.abs(e.clientX - startX);
            const deltaY = Math.abs(e.clientY - startY);
            
            if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
                hasMoved = true;
            }
            
            if (hasMoved) {
                requestAnimationFrame(() => {
                    const newTop = Math.min(window.innerHeight - 80, Math.max(0, e.clientY - offsetY));
                    const newLeft = Math.min(window.innerWidth - 80, Math.max(0, e.clientX - offsetX));
                    button.style.transform = `translate(${newLeft - parseInt(button.style.left)}px, ${newTop - parseInt(button.style.top)}px)`;
                });
            }
        };

        const handleMouseUp = () => {
            // Remove document listeners immediately
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            if (hasMoved) {
                // User dragged - update position
                const transform = button.style.transform;
                if (transform) {
                    const match = transform.match(/translate\((.+)px, (.+)px\)/);
                    if (match) {
                        const newLeft = parseInt(button.style.left) + parseFloat(match[1]);
                        const newTop = parseInt(button.style.top) + parseFloat(match[2]);
                        button.style.left = `${newLeft}px`;
                        button.style.top = `${newTop}px`;
                        button.style.transform = '';
                        
                        IdleScheduler.schedule(() => {
                            localStorage.setItem(BUTTON_STORAGE_KEY, JSON.stringify({
                                top: newTop,
                                left: newLeft
                            }));
                        });
                    }
                }
            }
            
            button.style.cursor = 'grab';
        };

        button.addEventListener('mousedown', (e) => {
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            offsetX = e.clientX - button.getBoundingClientRect().left;
            offsetY = e.clientY - button.getBoundingClientRect().top;
            button.style.cursor = 'grabbing';
            
            // Attach document listeners only during drag
            document.addEventListener('mousemove', handleMouseMove, { passive: true });
            document.addEventListener('mouseup', handleMouseUp);
        }, { passive: true });

        // Touch drag handlers - attached/removed dynamically
        const handleTouchMove = (e) => {
            const touch = e.touches[0];
            
            // Check if touch moved beyond threshold
            const deltaX = Math.abs(touch.clientX - startX);
            const deltaY = Math.abs(touch.clientY - startY);
            
            if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
                hasMoved = true;
            }
            
            if (hasMoved) {
                requestAnimationFrame(() => {
                    const newTop = Math.min(window.innerHeight - 70, Math.max(0, touch.clientY - offsetY));
                    const newLeft = Math.min(window.innerWidth - 70, Math.max(0, touch.clientX - offsetX));
                    button.style.transform = `translate(${newLeft - parseInt(button.style.left)}px, ${newTop - parseInt(button.style.top)}px)`;
                });
            }
        };

        const handleTouchEnd = () => {
            // Remove document listeners immediately
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            
            if (hasMoved) {
                // User dragged - update position
                const transform = button.style.transform;
                if (transform) {
                    const match = transform.match(/translate\((.+)px, (.+)px\)/);
                    if (match) {
                        const newLeft = parseInt(button.style.left) + parseFloat(match[1]);
                        const newTop = parseInt(button.style.top) + parseFloat(match[2]);
                        button.style.left = `${newLeft}px`;
                        button.style.top = `${newTop}px`;
                        button.style.transform = '';
                        
                        IdleScheduler.schedule(() => {
                            localStorage.setItem(BUTTON_STORAGE_KEY, JSON.stringify({
                                top: newTop,
                                left: newLeft
                            }));
                        });
                    }
                }
            }
            
            button.style.cursor = 'grab';
        };

        button.addEventListener('touchstart', (e) => {
            hasMoved = false;
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            offsetX = touch.clientX - button.getBoundingClientRect().left;
            offsetY = touch.clientY - button.getBoundingClientRect().top;
            button.style.cursor = 'grabbing';
            
            // Attach document listeners only during drag
            document.addEventListener('touchmove', handleTouchMove, { passive: true });
            document.addEventListener('touchend', handleTouchEnd);
        }, { passive: true });

        button.addEventListener('click', async (event) => {
            // Don't trigger click if user was dragging
            if (hasMoved) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                hasMoved = false; // Reset for next interaction
                return false;
            }
            
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            
            try {
            button.textContent = 'Processing...';
            button.style.pointerEvents = 'none';

            const magnetLinkElements = Array.from(document.querySelectorAll('a[href^="magnet:?"]'))
                        .filter(link => !link.parentElement.querySelector('button[data-script-created="true"]'));

                    const collection = new MagnetLinkCollection();

                    // Efficiently populate collection
                    for (const link of magnetLinkElements) {
                const hash = extractHashFromMagnet(link.href);
                        if (hash) {
                            collection.add(link, hash, link.href);
                        }
                    }

                    if (collection.size() > 0) {
                        await checkMagnetLinksWithAPIs(collection, false);
            }

            button.textContent = 'Check\nCache';
            button.style.pointerEvents = 'auto';
                } catch (error) {
                    console.error('[magnetLinkChecker] Error in floating button click:', error);
                    button.textContent = 'Check\nCache';
                    button.style.pointerEvents = 'auto';
                }
            
            return false;
        }, { capture: true });
        } catch (error) {
            console.error('[magnetLinkChecker] Error creating floating button:', error);
        }
    }

    // Main function to collect magnet links on non-1337x pages
    async function main() {
        try {
            PerformanceMetrics.start('main');
            PerformanceMetrics.recordMemory();
            
            // Load PikPak cache for local cache hits
            await loadPikPakCache();
            
        if (isPreProcessingRequired()) {
            showTemporaryMessage('Pre-Processing (mostly for info hashes) enabled on this page', '#ec7600');
            preSiteWiseCustomizations();
        }

        const startTime = performance.now();
        const magnetLinkElements = Array.from(document.querySelectorAll('a[href^="magnet:?"]'));
            const collection = new MagnetLinkCollection();

            // Efficiently populate collection with automatic deduplication
            for (const link of magnetLinkElements) {
            const hash = extractHashFromMagnet(link.href);
                if (hash) {
                    collection.add(link, hash, link.href);
                }
            }

            if (collection.size() > 0) {
                // Use unified checker
                checkMagnetLinksWithAPIs(collection, false).then(() => {
            const endTime = performance.now();
            showInfoPopup(endTime - startTime);
                });
        } else {
                console.log("No Magnet Hashes found on this page");
            }
            
            PerformanceMetrics.recordMemory();
            const duration = PerformanceMetrics.end('main');
            if (performanceMetricsEnabled) {
                console.log('[Performance] Main processing metrics:', PerformanceMetrics.getReport());
            }
        } catch (error) {
            console.error('[magnetLinkChecker] Error in main:', error);
        }
    }

    // ==================== ADVANCED SETTINGS UI ====================
    function showAdvancedSettings() {
        try {
            // Remove existing settings UI if any
            const existingUI = document.getElementById('mlc-advanced-settings');
            if (existingUI) {
                existingUI.remove();
                return;
            }

            // Create overlay
            const overlay = document.createElement('div');
            overlay.id = 'mlc-advanced-settings';
            applyStyles(overlay, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                zIndex: '999999',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            });

            // Create settings panel
            const panel = document.createElement('div');
            applyStyles(panel, {
                backgroundColor: '#fff',
                borderRadius: '10px',
                padding: '25px',
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflowY: 'auto',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            });

            // Helper to get current credential input type from checkbox state
            // Falls back to showCredentials variable if checkbox not yet in DOM (initial render)
            const getCredentialInputType = () => {
                const checkbox = document.getElementById('mlc-show-credentials');
                if (checkbox) {
                    return checkbox.checked ? 'text' : 'password';
                }
                // Fallback for initial render before checkbox exists
                return showCredentials ? 'text' : 'password';
            };
            
            // Helper to escape HTML special characters for safe attribute/content insertion
            const escapeHtml = (str) => {
                if (!str) return '';
                return String(str)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            };
            
            // Helper to render destination list HTML for PikPak accounts
            // accountEnabled: when false, ALL destinations should appear disabled visually
            const renderDestinationsHTML = (destinations, accountEnabled = true) => {
                if (!destinations || destinations.length === 0) {
                    return '<div class="mlc-no-destinations">No destination folders configured</div>';
                }
                const destCount = destinations.length;
                return destinations.map((dest, idx) => {
                    const isDefault = !dest.folderId || dest.folderId === '' || dest.folderPath === 'Default';
                    const displayPath = isDefault ? 'Default' : escapeHtml(dest.folderPath);
                    const folderId = dest.folderId || '';
                    // Tooltip: show full path and folder ID on separate lines
                    const tooltip = isDefault 
                        ? 'Default (PikPak download folder)' 
                        : `${escapeHtml(dest.folderPath)}&#10;ID: ${escapeHtml(folderId)}`;
                    // Show as disabled if: own toggle is off OR parent account is disabled
                    const isVisuallyDisabled = dest.enabled === false || !accountEnabled;
                    return `
                    <div class="mlc-destination-row ${isVisuallyDisabled ? 'mlc-dest-disabled' : ''}" data-dest-index="${idx}" data-folder-id="${escapeHtml(folderId)}">
                        <label class="mlc-dest-toggle" title="Enable/Disable this destination">
                            <input type="checkbox" class="mlc-dest-enabled" ${dest.enabled !== false ? 'checked' : ''}>
                        </label>
                        <input type="text" class="mlc-dest-code-input" value="${escapeHtml(dest.shortCode) || ''}" placeholder="Code" title="Button Code">
                        <span class="mlc-dest-icon">📁</span>
                        <span class="mlc-dest-path" title="${tooltip}">${displayPath}</span>
                        ${!isDefault ? '<button class="mlc-btn-reset-dest" title="Reset to Default">↺</button>' : ''}
                        <button class="mlc-btn-edit-dest" title="Change destination folder">✏️</button>
                        ${destCount > 1 ? '<button class="mlc-btn-remove-dest" title="Remove destination">✕</button>' : ''}
                    </div>
                `}).join('');
            };
            
            // Helper to render account list HTML
            const renderAccountListHTML = (provider, accounts, isPikpak = false) => {
                if (accounts.length === 0) {
                    return '<div class="mlc-no-accounts">No accounts configured</div>';
                }
                
                const enabledAccounts = accounts.filter(a => a.enabled);
                const primaryId = enabledAccounts.length > 0 ? enabledAccounts[0].id : null;
                // Get current credential type dynamically (not captured at render time)
                const credType = getCredentialInputType();
                
                return accounts.map((acc, idx) => `
                    <div class="mlc-account-row" data-account-id="${acc.id}" data-provider="${provider}">
                        <div class="mlc-account-header">
                            ${acc.id === primaryId ? '<span class="mlc-primary-badge">⭐ Primary</span>' : ''}
                            <label class="mlc-account-enable">
                                <input type="checkbox" class="mlc-acc-enabled" ${acc.enabled ? 'checked' : ''}> Enabled
                            </label>
                            <button class="mlc-btn-delete" title="Delete">🗑️</button>
                        </div>
                        <div class="mlc-account-fields">
                            <input type="text" class="mlc-acc-nickname" placeholder="Nickname" value="${acc.nickname || ''}" title="Nickname">
                            ${isPikpak ? `
                                <input type="text" class="mlc-acc-username" placeholder="Username/Email" value="${acc.username || ''}" title="Username" style="flex:2">
                                <input type="${credType}" class="mlc-acc-password mlc-credential-input" placeholder="Password" value="${acc.password || ''}" title="Password" style="flex:2">
                            ` : `
                                <input type="text" class="mlc-acc-shortcode" placeholder="Code" value="${acc.shortCode || ''}" title="Button Code" style="width:45px">
                                <input type="${credType}" class="mlc-acc-apikey mlc-credential-input" placeholder="API Key" value="${acc.apiKey || ''}" title="API Key" style="flex:3">
                            `}
                        </div>
                        ${isPikpak ? `
                        <div class="mlc-destinations-section" data-account-enabled="${acc.enabled ? 'true' : 'false'}">
                            <div class="mlc-destinations-header">
                                <span class="mlc-destinations-title">📂 Destination Folders</span>
                                <button class="mlc-btn-add-dest" data-account-id="${acc.id}" title="Add destination folder">➕ Add</button>
                            </div>
                            <div class="mlc-destinations-list" data-account-id="${acc.id}">
                                ${renderDestinationsHTML(acc.destinations, acc.enabled)}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                `).join('');
            };

            panel.innerHTML = `
                <style>
                    .mlc-settings-title { font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333; text-align: center; }
                    .mlc-settings-section { margin-bottom: 15px; padding: 12px; background-color: #f5f5f5; border-radius: 5px; border: 1px solid #ddd; }
                    .mlc-settings-section-title { font-size: 16px; font-weight: bold; color: #2e7d32; margin-bottom: 10px; display: flex; align-items: center; justify-content: space-between; }
                    .mlc-settings-item { margin-bottom: 10px; }
                    .mlc-settings-label { display: block; font-weight: 500; margin-bottom: 4px; color: #444; font-size: 14px; }
                    .mlc-settings-input { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; box-sizing: border-box; }
                    .mlc-settings-input:focus { outline: none; border-color: #4CAF50; }
                    .mlc-settings-button { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 14px; margin-right: 10px; }
                    .mlc-settings-button:hover { background-color: #388e3c; }
                    .mlc-settings-button-secondary { background-color: #757575; }
                    .mlc-settings-button-secondary:hover { background-color: #616161; }
                    .mlc-settings-button-small { padding: 5px 12px; font-size: 13px; margin: 0; }
                    .mlc-settings-buttons { display: flex; justify-content: center; margin-top: 20px; }
                    .mlc-current-value { font-size: 12px; color: #666; }
                    .mlc-master-toggle { margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #ddd; }
                    .mlc-account-row { background: #fff; border: 1px solid #ccc; border-radius: 4px; padding: 8px; margin-bottom: 8px; }
                    .mlc-account-header { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; font-size: 13px; }
                    .mlc-account-fields { display: flex; gap: 6px; flex-wrap: wrap; }
                    .mlc-account-fields input { padding: 6px 8px; font-size: 13px; border: 1px solid #ccc; border-radius: 4px; flex: 1; min-width: 80px; }
                    .mlc-primary-badge { background: #fff9c4; color: #f9a825; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: bold; }
                    .mlc-btn-delete { background: #ef5350; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 13px; margin-left: auto; }
                    .mlc-btn-delete:hover { background: #c62828; }
                    .mlc-btn-add { background: #1976d2; color: white; border: none; padding: 6px 14px; border-radius: 4px; cursor: pointer; font-size: 13px; }
                    .mlc-btn-add:hover { background: #1565c0; }
                    .mlc-no-accounts { color: #999; font-size: 13px; padding: 10px; text-align: center; }
                    .mlc-account-enable { font-size: 13px; display: flex; align-items: center; gap: 4px; }
                    .mlc-add-form { background: #e3f2fd; border: 1px dashed #1976d2; border-radius: 4px; padding: 10px; margin-top: 10px; display: none; }
                    .mlc-add-form.visible { display: block; }
                    .mlc-add-form-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px; }
                    .mlc-add-form-row input { padding: 6px 8px; font-size: 13px; border: 1px solid #ccc; border-radius: 4px; flex: 1; min-width: 80px; }
                    .mlc-add-form-actions { display: flex; gap: 8px; }
                    .mlc-provider-hint { font-size: 12px; color: #666; margin-top: 6px; margin-bottom: 8px; }
                    .mlc-destinations-section { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc; }
                    .mlc-destinations-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
                    .mlc-destinations-title { font-size: 13px; font-weight: 500; color: #555; }
                    .mlc-btn-add-dest { background: #43a047; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 12px; }
                    .mlc-btn-add-dest:hover { background: #2e7d32; }
                    .mlc-destinations-list { max-height: 150px; overflow-y: auto; }
                    .mlc-destination-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; background: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 4px; margin-bottom: 4px; }
                    .mlc-destination-row.mlc-dest-disabled { opacity: 0.5; background: #eee; }
                    .mlc-dest-toggle { display: flex; align-items: center; }
                    .mlc-dest-toggle input { margin: 0; cursor: pointer; }
                    .mlc-dest-code-input { padding: 3px 6px; border-radius: 3px; font-size: 12px; width: 60px; min-width: 60px; flex-shrink: 0; text-align: center; border: 1px solid #ccc; background: #fff; color: #333; box-sizing: content-box; }
                    .mlc-dest-code-input:focus { outline: none; border-color: #1976d2; }
                    .mlc-btn-edit-dest { background: #ff9800; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px; }
                    .mlc-btn-edit-dest:hover { background: #f57c00; }
                    .mlc-btn-reset-dest { background: #9e9e9e; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px; }
                    .mlc-btn-reset-dest:hover { background: #757575; }
                    .mlc-dest-icon { font-size: 14px; }
                    .mlc-dest-path { flex: 1; font-size: 13px; font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #333; cursor: default; }
                    .mlc-btn-remove-dest { background: #ff5252; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer; font-size: 12px; }
                    .mlc-btn-remove-dest:hover { background: #d32f2f; }
                    .mlc-no-destinations { color: #999; font-size: 12px; font-style: italic; padding: 5px; text-align: center; }
                </style>

                <div class="mlc-settings-title">⚙️ Advanced Settings</div>

                <!-- Offcloud Multi-Account Section -->
                <div class="mlc-settings-section">
                    <div class="mlc-settings-section-title">
                        <span>🔑 Offcloud Accounts</span>
                        <button class="mlc-btn-add" data-provider="offcloud">➕ Add</button>
                    </div>
                    <div class="mlc-master-toggle">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-offcloud-enabled" ${offcloudEnabled ? 'checked' : ''}>
                            ${offcloudEnabled ? '✅' : '🚫'} Master Enable (all accounts)
                        </label>
                    </div>
                    <div class="mlc-provider-hint">First enabled account is used for cache checks. Each account creates its own button.</div>
                    <div id="mlc-offcloud-accounts">${renderAccountListHTML('offcloud', offcloudAccounts)}</div>
                    <div id="mlc-offcloud-add-form" class="mlc-add-form">
                        <div class="mlc-add-form-row">
                            <input type="text" placeholder="Nickname (e.g. OC-Main)" class="mlc-new-nickname">
                            <input type="text" placeholder="Code (e.g. OC)" class="mlc-new-shortcode" style="width:45px">
                            <input type="${showCredentials ? 'text' : 'password'}" placeholder="API Key" class="mlc-new-apikey mlc-credential-input" style="flex:3">
                        </div>
                        <div class="mlc-add-form-actions">
                            <button class="mlc-settings-button mlc-settings-button-small mlc-save-new" data-provider="offcloud">💾 Save</button>
                            <button class="mlc-settings-button mlc-settings-button-secondary mlc-settings-button-small mlc-cancel-new" data-provider="offcloud">Cancel</button>
                        </div>
                    </div>
                </div>

                <!-- TorBox Multi-Account Section -->
                <div class="mlc-settings-section">
                    <div class="mlc-settings-section-title">
                        <span>🔑 TorBox Accounts</span>
                        <button class="mlc-btn-add" data-provider="torbox">➕ Add</button>
                    </div>
                    <div class="mlc-master-toggle">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-torbox-enabled" ${torboxEnabled ? 'checked' : ''}>
                            ${torboxEnabled ? '✅' : '🚫'} Master Enable (all accounts)
                        </label>
                    </div>
                    <div class="mlc-provider-hint">First enabled account is used for cache checks. Each account creates its own button.</div>
                    <div id="mlc-torbox-accounts">${renderAccountListHTML('torbox', torboxAccounts)}</div>
                    <div id="mlc-torbox-add-form" class="mlc-add-form">
                        <div class="mlc-add-form-row">
                            <input type="text" placeholder="Nickname (e.g. TB-Pro)" class="mlc-new-nickname">
                            <input type="text" placeholder="Code (e.g. TB)" class="mlc-new-shortcode" style="width:45px">
                            <input type="${showCredentials ? 'text' : 'password'}" placeholder="API Key" class="mlc-new-apikey mlc-credential-input" style="flex:3">
                        </div>
                        <div class="mlc-add-form-actions">
                            <button class="mlc-settings-button mlc-settings-button-small mlc-save-new" data-provider="torbox">💾 Save</button>
                            <button class="mlc-settings-button mlc-settings-button-secondary mlc-settings-button-small mlc-cancel-new" data-provider="torbox">Cancel</button>
                        </div>
                    </div>
                </div>

                <!-- PikPak Multi-Account Section -->
                <div class="mlc-settings-section">
                    <div class="mlc-settings-section-title">
                        <span>🔑 PikPak Accounts</span>
                        <button class="mlc-btn-add" data-provider="pikpak">➕ Add</button>
                    </div>
                    <div class="mlc-master-toggle">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-pikpak-enabled" ${pikpakEnabled ? 'checked' : ''}>
                            ${pikpakEnabled ? '✅' : '🚫'} Master Enable (all accounts)
                        </label>
                    </div>
                    <div class="mlc-provider-hint">First enabled account is used for cache checks. Each account creates its own button.</div>
                    <div id="mlc-pikpak-accounts">${renderAccountListHTML('pikpak', pikpakAccounts, true)}</div>
                    <div id="mlc-pikpak-add-form" class="mlc-add-form">
                        <div class="mlc-add-form-row">
                            <input type="text" placeholder="Nickname" class="mlc-new-nickname">
                            <input type="text" placeholder="Username/Email" class="mlc-new-username" style="flex:2">
                            <input type="${showCredentials ? 'text' : 'password'}" placeholder="Password" class="mlc-new-password mlc-credential-input" style="flex:2">
                        </div>
                        <div class="mlc-add-form-actions">
                            <button class="mlc-settings-button mlc-settings-button-small mlc-save-new" data-provider="pikpak">💾 Save</button>
                            <button class="mlc-settings-button mlc-settings-button-secondary mlc-settings-button-small mlc-cancel-new" data-provider="pikpak">Cancel</button>
                        </div>
                    </div>
                    <!-- PikPak-specific settings -->
                    <div class="mlc-settings-item" style="margin-top:10px; border-top:1px solid #ddd; padding-top:8px;">
                        <label class="mlc-settings-label">Cache Duration: <input type="number" id="mlc-pikpak-cache-duration" class="mlc-settings-input" style="width:60px;display:inline" min="1" max="365" value="${pikpakCacheDurationDays}"> days</label>
                    </div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">Batch Size: <input type="number" id="mlc-pikpak-batch-size" class="mlc-settings-input" style="width:60px;display:inline" min="1" max="30" value="${pikpakBatchSize}"> concurrent</label>
                    </div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">Cache Check Timeout: <input type="number" id="mlc-pikpak-cache-timeout" class="mlc-settings-input" style="width:60px;display:inline" min="5" max="300" value="${pikpakCacheCheckTimeout}"> seconds</label>
                    </div>
                    <div class="mlc-settings-item">
                        <label><input type="checkbox" id="mlc-pikpak-no-auth-check" ${pikpakNoAuthCheck ? 'checked' : ''}> Skip auth for cache checks (faster)</label>
                    </div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-pikpak-show-tooltip" ${pikpakShowTooltip ? 'checked' : ''}>
                            ${pikpakShowTooltip ? '💬' : '🚫'} Show button tooltips (folder path info on hover)
                        </label>
                    </div>
                    <div class="mlc-settings-item">
                        <button class="mlc-settings-button mlc-settings-button-secondary mlc-settings-button-small" id="mlc-clear-pikpak-cache">🗑️ Clear PikPak Cache</button>
                    </div>
                </div>

                <div class="mlc-settings-section">
                    <div class="mlc-settings-section-title">💾 Cache Settings</div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-cache-enabled" ${cacheEnabled ? 'checked' : ''}>
                            ${cacheEnabled ? '✅' : '🚫'} Enable Cache
                        </label>
                        <div class="mlc-current-value">Toggle persistent cache on/off</div>
                    </div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">Cache Duration (days)</label>
                        <input type="number" id="mlc-cache-duration" class="mlc-settings-input" min="1" value="${cacheDurationDays}">
                        <div class="mlc-current-value">Current: ${cacheDurationDays} days - How long to keep cached data</div>
                    </div>
                </div>

                <div class="mlc-settings-section">
                    <div class="mlc-settings-section-title">⚡ Performance Settings</div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-performance-metrics" ${performanceMetricsEnabled ? 'checked' : ''}>
                            ${performanceMetricsEnabled ? '✅' : '🚫'} Enable Performance Metrics
                        </label>
                        <div class="mlc-current-value">Show performance metrics in console</div>
                    </div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">Concurrency Level (1-10)</label>
                        <input type="number" id="mlc-concurrency" class="mlc-settings-input" min="1" max="10" value="${concurrencyLevel}">
                        <div class="mlc-current-value">Current: ${concurrencyLevel} - Controls how many requests are made in parallel</div>
                    </div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">Batch Size for Cache Saving</label>
                        <input type="number" id="mlc-batch-size" class="mlc-settings-input" min="1" value="${batchSize}">
                        <div class="mlc-current-value">Current: ${batchSize} - How many items to process before saving cache</div>
                    </div>
                </div>

                <div class="mlc-settings-section">
                    <div class="mlc-settings-section-title">🔧 Features</div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-1337x-support" ${enable1337xSupport ? 'checked' : ''}>
                            Enable 1337x Support
                        </label>
                        <div class="mlc-current-value">Automatically process 1337x torrent pages</div>
                    </div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-progress-bar" ${showProgressBar ? 'checked' : ''}>
                            Show Progress Bar on 1337x
                        </label>
                        <div class="mlc-current-value">Display progress when processing 1337x pages</div>
                    </div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-magnet-link-1337x" ${showMagnetLink1337x ? 'checked' : ''}>
                            Show Magnet Link on 1337x
                        </label>
                        <div class="mlc-current-value">Display clickable 🧲 magnet link for opening in torrent client</div>
                    </div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-cloudflare-bypass" ${cloudflareBypassEnabled ? 'checked' : ''}>
                            ${cloudflareBypassEnabled ? '✅' : '🚫'} Cloudflare Bypass
                        </label>
                        <div class="mlc-current-value">Use native fetch to bypass Cloudflare protection</div>
                    </div>
                    <div class="mlc-settings-item">
                        <label class="mlc-settings-label">
                            <input type="checkbox" id="mlc-show-credentials" ${showCredentials ? 'checked' : ''}>
                            <span id="mlc-show-credentials-icon">${showCredentials ? '👁️' : '🔒'}</span> Show API Keys/Passwords in plain text
                        </label>
                        <div class="mlc-current-value">When enabled, credentials are visible instead of masked</div>
                    </div>
                </div>

                <div class="mlc-settings-buttons">
                    <button class="mlc-settings-button" id="mlc-save-btn">💾 Save Settings</button>
                    <button class="mlc-settings-button mlc-settings-button-secondary" id="mlc-cancel-btn">❌ Cancel</button>
                </div>
            `;

            overlay.appendChild(panel);
            document.body.appendChild(overlay);

            // Helper function to refresh account list display
            const refreshAccountList = async (provider) => {
                const isPikpak = provider === 'pikpak';
                const accounts = await accountManager.loadAccounts(provider);
                const container = document.getElementById(`mlc-${provider}-accounts`);
                if (container) {
                    container.innerHTML = renderAccountListHTML(provider, accounts, isPikpak);
                }
                // Update global cache
                if (provider === 'torbox') torboxAccounts = accounts;
                if (provider === 'offcloud') offcloudAccounts = accounts;
                if (provider === 'pikpak') pikpakAccounts = accounts;
            };

            // Helper to get next shortcode
            const getNextShortCode = (provider, accounts) => {
                const codes = { torbox: 'TB', offcloud: 'OC', pikpak: 'PKP' };
                const base = codes[provider];
                if (accounts.length === 0) return base;
                return `${base}${accounts.length + 1}`;
            };

            // Close on overlay click
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.remove();
                }
            });

            // Cancel button
            document.getElementById('mlc-cancel-btn').addEventListener('click', () => {
                overlay.remove();
            });

            // Clear PikPak Cache button handler
            document.getElementById('mlc-clear-pikpak-cache').addEventListener('click', async () => {
                if (confirm('Clear PikPak cache?')) {
                    await clearPikPakCache();
                }
            });
            
            // Show/Hide Credentials toggle handler - updates all credential inputs in real-time
            document.getElementById('mlc-show-credentials').addEventListener('change', (e) => {
                const newType = e.target.checked ? 'text' : 'password';
                panel.querySelectorAll('.mlc-credential-input').forEach(input => {
                    input.type = newType;
                });
                // Update the label icon dynamically
                const iconSpan = document.getElementById('mlc-show-credentials-icon');
                if (iconSpan) {
                    iconSpan.textContent = e.target.checked ? '👁️' : '🔒';
                }
            });
            
            // Add Account button handlers
            panel.querySelectorAll('.mlc-btn-add').forEach(btn => {
                btn.addEventListener('click', () => {
                    const provider = btn.dataset.provider;
                    const form = document.getElementById(`mlc-${provider}-add-form`);
                    form.classList.toggle('visible');
                    // Auto-fill shortcode
                    const accounts = provider === 'torbox' ? torboxAccounts : provider === 'offcloud' ? offcloudAccounts : pikpakAccounts;
                    const shortcodeInput = form.querySelector('.mlc-new-shortcode');
                    if (shortcodeInput && !shortcodeInput.value) {
                        shortcodeInput.value = getNextShortCode(provider, accounts);
                    }
                });
            });

            // Cancel Add handlers
            panel.querySelectorAll('.mlc-cancel-new').forEach(btn => {
                btn.addEventListener('click', () => {
                    const provider = btn.dataset.provider;
                    const form = document.getElementById(`mlc-${provider}-add-form`);
                    form.classList.remove('visible');
                    // Clear inputs
                    form.querySelectorAll('input').forEach(i => i.value = '');
                });
            });

            // Save New Account handlers
            panel.querySelectorAll('.mlc-save-new').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const provider = btn.dataset.provider;
                    const form = document.getElementById(`mlc-${provider}-add-form`);
                    const nickname = form.querySelector('.mlc-new-nickname').value.trim();
                    
                    let accountData = { nickname, enabled: true };
                    
                    if (provider === 'pikpak') {
                        const username = form.querySelector('.mlc-new-username').value.trim();
                        const password = form.querySelector('.mlc-new-password').value;
                        if (!username || !password) {
                            alert('Username and password required');
                            return;
                        }
                        accountData.username = username;
                        accountData.password = password;
                        // Check duplicate
                        const dup = await accountManager.validateDuplicate(provider, { username, password });
                        if (dup.isDuplicate) {
                            if (!confirm(`Warning: ${dup.message}\n\nAdd anyway?`)) return;
                        }
                        // Auto-create default destination with generated shortCode
                        const shortCode = getNextShortCode('pikpak', pikpakAccounts);
                        accountData.destinations = [{
                            folderId: null,
                            folderPath: 'Default',
                            folderName: 'Default',
                            shortCode: shortCode,
                            enabled: true
                        }];
                    } else {
                        // For non-PikPak providers, keep shortCode at account level
                        const shortCodeInput = form.querySelector('.mlc-new-shortcode');
                        const shortCode = shortCodeInput ? shortCodeInput.value.trim() : '';
                        accountData.shortCode = shortCode || getNextShortCode(provider, provider === 'torbox' ? torboxAccounts : offcloudAccounts);
                        
                        const apiKey = form.querySelector('.mlc-new-apikey').value.trim();
                        if (!apiKey) {
                            alert('API Key required');
                            return;
                        }
                        accountData.apiKey = apiKey;
                        // Check duplicate
                        const dup = await accountManager.validateDuplicate(provider, { apiKey });
                        if (dup.isDuplicate) {
                            if (!confirm(`Warning: ${dup.message}\n\nAdd anyway?`)) return;
                        }
                    }
                    
                    await accountManager.addAccount(provider, accountData);
                    await refreshAccountList(provider);
                    form.classList.remove('visible');
                    form.querySelectorAll('input').forEach(i => i.value = '');
                    showTemporaryMessage(`${provider} account added`, 'green');
                });
            });

            // ==================== CONSOLIDATED EVENT HANDLERS ====================
            // RACE CONDITION FIX: Single click/change handlers with button disabling
            
            // Debounce helper for shortcode input
            const shortcodeDebounceTimers = new Map();
            const SHORTCODE_DEBOUNCE_MS = 300;
            
            // Helper to disable/enable button during async operations
            const withButtonDisabled = async (button, asyncFn) => {
                if (!button || button.disabled) return; // Prevent double-clicks
                const originalText = button.textContent;
                button.disabled = true;
                button.style.opacity = '0.6';
                button.style.cursor = 'wait';
                try {
                    await asyncFn();
                } finally {
                    // Button may have been removed from DOM during refresh
                    if (button.isConnected) {
                        button.disabled = false;
                        button.style.opacity = '';
                        button.style.cursor = 'pointer';
                        button.textContent = originalText;
                    }
                }
            };

            // CONSOLIDATED CLICK HANDLER - handles all button clicks
            panel.addEventListener('click', async (e) => {
                // Delete Account handler
                if (e.target.classList.contains('mlc-btn-delete')) {
                    const button = e.target;
                    const row = button.closest('.mlc-account-row');
                    const provider = row.dataset.provider;
                    const accountId = row.dataset.accountId;
                    if (confirm('Delete this account?')) {
                        await withButtonDisabled(button, async () => {
                            await accountManager.deleteAccount(provider, accountId);
                            await refreshAccountList(provider);
                            showTemporaryMessage(`${provider} account deleted`, 'green');
                        });
                    }
                    return;
                }
                
                // Add Destination button handler (PikPak only)
                if (e.target.classList.contains('mlc-btn-add-dest')) {
                    const button = e.target;
                    const accountId = button.dataset.accountId;
                    
                    await withButtonDisabled(button, async () => {
                        const accounts = await accountManager.loadAccounts('pikpak');
                        const account = accounts.find(a => a.id === accountId);
                        
                        if (!account) {
                            showTemporaryMessage('Account not found', 'red');
                            return;
                        }
                        
                        // Check credentials first
                        if (!account.username || !account.password) {
                            showTemporaryMessage('Please save account credentials first', 'red');
                            return;
                        }
                        
                        // Open folder browser modal
                        await showFolderBrowserModal(account, async (selectedFolder) => {
                            // Reload fresh account data to avoid race conditions
                            const freshAccounts = await accountManager.loadAccounts('pikpak');
                            const freshAccount = freshAccounts.find(a => a.id === accountId);
                            
                            if (!freshAccount) {
                                showTemporaryMessage('Account no longer exists', 'red');
                                return;
                            }
                            
                            const destinations = freshAccount.destinations || [];
                            
                            // Helper to normalize folderId for comparison (null, undefined, '' are all "Default")
                            const normalizeFolderId = (id) => (!id || id === '') ? null : id;
                            const newFolderId = normalizeFolderId(selectedFolder.folderId);
                            
                            // Check for duplicate (handle Default/Root equivalence)
                            if (destinations.some(d => normalizeFolderId(d.folderId) === newFolderId)) {
                                showTemporaryMessage('This folder is already added as a destination', 'yellow');
                                return;
                            }
                            
                            // Auto-generate unique shortCode based on first destination's code
                            const baseCode = destinations[0]?.shortCode || 'PKP';
                            const existingCodes = new Set(destinations.map(d => d.shortCode));
                            let newShortCode = `${baseCode}-${destinations.length + 1}`;
                            let counter = destinations.length + 1;
                            while (existingCodes.has(newShortCode)) {
                                counter++;
                                newShortCode = `${baseCode}-${counter}`;
                            }
                            
                            const newDestination = {
                                ...selectedFolder,
                                shortCode: newShortCode,
                                enabled: true
                            };
                            
                            destinations.push(newDestination);
                            await accountManager.updateAccount('pikpak', accountId, { destinations });
                            await refreshAccountList('pikpak');
                            showTemporaryMessage(`Destination "${selectedFolder.folderPath}" added`, 'green');
                        });
                    });
                    return;
                }
                
                // Remove Destination button handler (PikPak only)
                if (e.target.classList.contains('mlc-btn-remove-dest')) {
                    const button = e.target;
                    const destRow = button.closest('.mlc-destination-row');
                    if (!destRow) return;
                    const accountRow = button.closest('.mlc-account-row');
                    if (!accountRow) return;
                    const accountId = accountRow.dataset.accountId;
                    const destIndex = parseInt(destRow.dataset.destIndex, 10);
                    
                    // Get folderId from data attribute for stable identification
                    const folderId = destRow.dataset.folderId || '';
                    const folderPath = destRow.querySelector('.mlc-dest-path')?.textContent || 'this destination';
                    
                    if (confirm(`Remove destination "${folderPath}"?`)) {
                        await withButtonDisabled(button, async () => {
                            // Reload fresh data AFTER user confirms to avoid race conditions
                            const accounts = await accountManager.loadAccounts('pikpak');
                            const account = accounts.find(a => a.id === accountId);
                            
                            if (!account || !account.destinations) {
                                showTemporaryMessage('Account no longer exists', 'red');
                                await refreshAccountList('pikpak');
                                return;
                            }
                            
                            // Guard: prevent removing the last destination
                            if (account.destinations.length <= 1) {
                                showTemporaryMessage('Cannot remove the only destination. Use the account delete button instead.', 'yellow');
                                await refreshAccountList('pikpak');
                                return;
                            }
                            
                            // Find by folderId for safety, fallback to index for Default destinations
                            const isDefaultDest = !folderId;
                            const actualIndex = isDefaultDest
                                ? destIndex  // For Default destinations, use index since folderId is null
                                : account.destinations.findIndex(d => d.folderId === folderId);
                            
                            if (actualIndex !== -1 && actualIndex < account.destinations.length) {
                                account.destinations.splice(actualIndex, 1);
                                await accountManager.updateAccount('pikpak', accountId, { destinations: account.destinations });
                                await refreshAccountList('pikpak');
                                showTemporaryMessage('Destination removed', 'green');
                            } else {
                                showTemporaryMessage('Destination not found (may have been already removed)', 'yellow');
                                await refreshAccountList('pikpak');
                            }
                        });
                    }
                    return;
                }
                
                // Edit destination folder handler (PikPak only)
                if (e.target.classList.contains('mlc-btn-edit-dest')) {
                    const button = e.target;
                    const destRow = button.closest('.mlc-destination-row');
                    if (!destRow) return;
                    const destIndex = parseInt(destRow.dataset.destIndex, 10);
                    const accountRow = button.closest('.mlc-account-row');
                    if (!accountRow) return;
                    const accountId = accountRow.dataset.accountId;
                    
                    await withButtonDisabled(button, async () => {
                        const accounts = await accountManager.loadAccounts('pikpak');
                        const account = accounts.find(a => a.id === accountId);
                        
                        if (!account || !account.destinations || !account.destinations[destIndex]) return;
                        
                        // Capture current destination's identifying info for verification later
                        const currentDest = account.destinations[destIndex];
                        const currentFolderId = currentDest.folderId;
                        const currentShortCode = currentDest.shortCode;
                        const currentEnabled = currentDest.enabled;
                        
                        // Open folder browser modal to pick new folder
                        await showFolderBrowserModal(account, async (selectedFolder) => {
                            // Reload fresh account data to avoid race conditions
                            const freshAccounts = await accountManager.loadAccounts('pikpak');
                            const freshAccount = freshAccounts.find(a => a.id === accountId);
                            
                            if (!freshAccount || !freshAccount.destinations) {
                                showTemporaryMessage('Account no longer exists', 'red');
                                return;
                            }
                            
                            // Find the destination by its original folderId to handle index shifts
                            // For Default destinations (null folderId), use destIndex as fallback
                            const isDefaultDest = !currentFolderId;
                            let freshDestIndex;
                            if (isDefaultDest) {
                                // For Default destinations, verify by index and shortCode
                                if (destIndex < freshAccount.destinations.length && 
                                    freshAccount.destinations[destIndex].shortCode === currentShortCode) {
                                    freshDestIndex = destIndex;
                                } else {
                                    // Fallback: find by shortCode
                                    freshDestIndex = freshAccount.destinations.findIndex(d => d.shortCode === currentShortCode);
                                }
                            } else {
                                freshDestIndex = freshAccount.destinations.findIndex(d => d.folderId === currentFolderId);
                            }
                            
                            if (freshDestIndex === -1) {
                                showTemporaryMessage('Destination was removed while editing', 'red');
                                await refreshAccountList('pikpak');
                                return;
                            }
                            
                            // Update the destination with new folder, keeping existing shortCode and enabled state
                            freshAccount.destinations[freshDestIndex] = {
                                ...selectedFolder,
                                shortCode: currentShortCode,
                                enabled: currentEnabled
                            };
                            await accountManager.updateAccount('pikpak', accountId, { destinations: freshAccount.destinations });
                            await refreshAccountList('pikpak');
                            showTemporaryMessage(`Destination updated to "${selectedFolder.folderPath}"`, 'green');
                        });
                    });
                    return;
                }
                
                // Reset to Default button handler (PikPak only)
                if (e.target.classList.contains('mlc-btn-reset-dest')) {
                    const button = e.target;
                    const destRow = button.closest('.mlc-destination-row');
                    if (!destRow) return;
                    const destIndex = parseInt(destRow.dataset.destIndex, 10);
                    const accountRow = button.closest('.mlc-account-row');
                    if (!accountRow) return;
                    const accountId = accountRow.dataset.accountId;
                    
                    // Get current folderId from the row for identification
                    const currentFolderId = destRow.dataset.folderId || '';
                    
                    // Reset button should only appear for non-Default destinations
                    // (but check anyway for safety)
                    if (!currentFolderId) {
                        showTemporaryMessage('Already at Default', 'yellow');
                        return;
                    }
                    
                    await withButtonDisabled(button, async () => {
                        const accounts = await accountManager.loadAccounts('pikpak');
                        const account = accounts.find(a => a.id === accountId);
                        
                        if (!account || !account.destinations) return;
                        
                        // Find by folderId (should always have one for non-Default destinations)
                        const actualIndex = account.destinations.findIndex(d => d.folderId === currentFolderId);
                        
                        if (actualIndex !== -1 && account.destinations[actualIndex]) {
                            // Reset to Default: set folderId to null, keep shortCode and enabled
                            account.destinations[actualIndex].folderId = null;
                            account.destinations[actualIndex].folderPath = 'Default';
                            account.destinations[actualIndex].folderName = 'Default';
                            await accountManager.updateAccount('pikpak', accountId, { destinations: account.destinations });
                            await refreshAccountList('pikpak');
                            showTemporaryMessage('Destination reset to Default', 'green');
                        }
                    });
                    return;
                }
            });

            // CONSOLIDATED CHANGE HANDLER - handles all input changes
            panel.addEventListener('change', async (e) => {
                // Destination enable/disable toggle handler (PikPak only)
                if (e.target.classList.contains('mlc-dest-enabled')) {
                    const checkbox = e.target;
                    const destRow = checkbox.closest('.mlc-destination-row');
                    if (!destRow) return;
                    const destIndex = parseInt(destRow.dataset.destIndex, 10);
                    const accountRow = checkbox.closest('.mlc-account-row');
                    if (!accountRow) return;
                    const accountId = accountRow.dataset.accountId;
                    const isEnabled = checkbox.checked;
                    
                    // Get folderId from data attribute (empty string for Default destinations)
                    const folderId = destRow.dataset.folderId || '';
                    const isDefaultDest = !folderId;
                    
                    // Disable checkbox during save
                    checkbox.disabled = true;
                    
                    try {
                        const accounts = await accountManager.loadAccounts('pikpak');
                        const account = accounts.find(a => a.id === accountId);
                        
                        if (account && account.destinations) {
                            // Find by folderId for custom folders, use index for Default destinations
                            const actualIndex = isDefaultDest
                                ? destIndex
                                : account.destinations.findIndex(d => d.folderId === folderId);
                            
                            if (actualIndex !== -1 && account.destinations[actualIndex]) {
                                account.destinations[actualIndex].enabled = isEnabled;
                                await accountManager.updateAccount('pikpak', accountId, { destinations: account.destinations });
                                // Update visual state
                                destRow.classList.toggle('mlc-dest-disabled', !isEnabled);
                            }
                        }
                    } finally {
                        if (checkbox.isConnected) {
                            checkbox.disabled = false;
                        }
                    }
                    return;
                }
                
                // Destination shortcode change handler (PikPak only) - DEBOUNCED
                if (e.target.classList.contains('mlc-dest-code-input')) {
                    const input = e.target;
                    const destRow = input.closest('.mlc-destination-row');
                    if (!destRow) return;
                    const destIndex = parseInt(destRow.dataset.destIndex, 10);
                    const accountRow = input.closest('.mlc-account-row');
                    if (!accountRow) return;
                    const accountId = accountRow.dataset.accountId;
                    const newShortCode = input.value.trim();
                    
                    // Get folderId from data attribute (empty string for Default destinations)
                    const folderId = destRow.dataset.folderId || '';
                    const isDefaultDest = !folderId;
                    
                    // Create unique key for this input's debounce timer
                    const debounceKey = `${accountId}-${destIndex}`;
                    
                    // Clear any existing debounce timer
                    if (shortcodeDebounceTimers.has(debounceKey)) {
                        clearTimeout(shortcodeDebounceTimers.get(debounceKey));
                    }
                    
                    // Set up debounced save
                    shortcodeDebounceTimers.set(debounceKey, setTimeout(async () => {
                        shortcodeDebounceTimers.delete(debounceKey);
                        
                        const accounts = await accountManager.loadAccounts('pikpak');
                        const account = accounts.find(a => a.id === accountId);
                        
                        if (account && account.destinations) {
                            // Find by folderId for custom folders, use index for Default destinations
                            const actualIndex = isDefaultDest
                                ? destIndex
                                : account.destinations.findIndex(d => d.folderId === folderId);
                            
                            if (actualIndex !== -1 && account.destinations[actualIndex]) {
                                account.destinations[actualIndex].shortCode = newShortCode;
                                await accountManager.updateAccount('pikpak', accountId, { destinations: account.destinations });
                            }
                        }
                    }, SHORTCODE_DEBOUNCE_MS));
                    return;
                }
                
                // Account field change handlers
                const row = e.target.closest('.mlc-account-row');
                if (!row) return;
                
                const provider = row.dataset.provider;
                const accountId = row.dataset.accountId;
                const field = e.target;
                
                // Skip if this is a destination-related input (handled above)
                if (field.classList.contains('mlc-dest-enabled') || 
                    field.classList.contains('mlc-dest-code-input')) {
                    return;
                }
                
                let updates = {};
                if (field.classList.contains('mlc-acc-enabled')) {
                    updates.enabled = field.checked;
                    
                    // IMMEDIATE VISUAL FEEDBACK: Toggle all destination rows' disabled state
                    // This provides instant feedback before async refresh completes
                    if (provider === 'pikpak') {
                        const destSection = row.querySelector('.mlc-destinations-section');
                        if (destSection) {
                            destSection.dataset.accountEnabled = field.checked ? 'true' : 'false';
                            const destRows = destSection.querySelectorAll('.mlc-destination-row');
                            destRows.forEach(destRow => {
                                const destCheckbox = destRow.querySelector('.mlc-dest-enabled');
                                const isDestEnabled = destCheckbox && destCheckbox.checked;
                                // Show as disabled if account is disabled OR destination's own toggle is off
                                destRow.classList.toggle('mlc-dest-disabled', !field.checked || !isDestEnabled);
                            });
                        }
                    }
                } else if (field.classList.contains('mlc-acc-nickname')) {
                    updates.nickname = field.value.trim();
                } else if (field.classList.contains('mlc-acc-shortcode')) {
                    updates.shortCode = field.value.trim();
                } else if (field.classList.contains('mlc-acc-apikey')) {
                    updates.apiKey = field.value.trim();
                } else if (field.classList.contains('mlc-acc-username')) {
                    updates.username = field.value.trim();
                } else if (field.classList.contains('mlc-acc-password')) {
                    updates.password = field.value;
                }
                
                if (Object.keys(updates).length > 0) {
                    // Disable field during save
                    field.disabled = true;
                    
                    try {
                        // If PikPak credentials changed, clear authData to force re-authentication
                        if (provider === 'pikpak' && (updates.password || updates.username)) {
                            updates.authData = null;
                            // Also clear in-memory auth state
                            const authState = pikpakAuthStates.get(accountId);
                            if (authState) {
                                authState.authData = null;
                                authState.authInProgress = null;
                            }
                        }
                        await accountManager.updateAccount(provider, accountId, updates);
                        // Refresh to update primary badge if needed
                        if (updates.enabled !== undefined) {
                            await refreshAccountList(provider);
                        }
                    } finally {
                        if (field.isConnected) {
                            field.disabled = false;
                        }
                    }
                }
            });

            // Save button - saves master toggles and other settings
            document.getElementById('mlc-save-btn').addEventListener('click', async () => {
                try {
                    // Get master toggle values
                    const newOffcloudEnabled = document.getElementById('mlc-offcloud-enabled').checked;
                    const newTorboxEnabled = document.getElementById('mlc-torbox-enabled').checked;
                    const newPikpakEnabled = document.getElementById('mlc-pikpak-enabled').checked;
                    
                    // Get other settings
                    const newCacheEnabled = document.getElementById('mlc-cache-enabled').checked;
                    const newCacheDuration = parseInt(document.getElementById('mlc-cache-duration').value, 10);
                    const newPerformanceMetrics = document.getElementById('mlc-performance-metrics').checked;
                    const newConcurrency = parseInt(document.getElementById('mlc-concurrency').value, 10);
                    const newBatchSize = parseInt(document.getElementById('mlc-batch-size').value, 10);
                    const new1337xSupport = document.getElementById('mlc-1337x-support').checked;
                    const newProgressBar = document.getElementById('mlc-progress-bar').checked;
                    const newMagnetLink1337x = document.getElementById('mlc-magnet-link-1337x').checked;
                    const newCloudflareBypass = document.getElementById('mlc-cloudflare-bypass').checked;
                    const newShowCredentials = document.getElementById('mlc-show-credentials').checked;
                    const newPikpakCacheDuration = parseInt(document.getElementById('mlc-pikpak-cache-duration').value, 10);
                    const newPikpakBatchSize = parseInt(document.getElementById('mlc-pikpak-batch-size').value, 10);
                    const newPikpakCacheTimeout = parseInt(document.getElementById('mlc-pikpak-cache-timeout').value, 10);
                    const newPikpakNoAuthCheck = document.getElementById('mlc-pikpak-no-auth-check').checked;
                    const newPikpakShowTooltip = document.getElementById('mlc-pikpak-show-tooltip').checked;

                    // Validate
                    if (newConcurrency < 1 || newConcurrency > 10) { alert('Concurrency: 1-10'); return; }
                    if (newBatchSize < 1) { alert('Batch size must be >= 1'); return; }
                    if (newCacheDuration < 1) { alert('Cache duration must be >= 1'); return; }
                    if (newPikpakCacheDuration < 1 || newPikpakCacheDuration > 365) { alert('PikPak cache: 1-365 days'); return; }
                    if (newPikpakBatchSize < 1 || newPikpakBatchSize > 30) { alert('PikPak batch: 1-30'); return; }
                    if (newPikpakCacheTimeout < 5 || newPikpakCacheTimeout > 300) { alert('PikPak cache check timeout: 5-300 seconds'); return; }

                    // Save master toggles
                    offcloudEnabled = newOffcloudEnabled;
                    await GM_setValue(OFFCLOUD_ENABLED_KEY, offcloudEnabled);
                    torboxEnabled = newTorboxEnabled;
                    await GM_setValue(TORBOX_ENABLED_KEY, torboxEnabled);
                    pikpakEnabled = newPikpakEnabled;
                    await GM_setValue(PIKPAK_ENABLED_KEY, pikpakEnabled);
                    
                    // Save PikPak settings
                    pikpakCacheDurationDays = newPikpakCacheDuration;
                    await GM_setValue(PIKPAK_CACHE_DURATION_KEY, pikpakCacheDurationDays);
                    pikpakBatchSize = newPikpakBatchSize;
                    await GM_setValue(PIKPAK_BATCH_SIZE_KEY, pikpakBatchSize);
                    pikpakCacheCheckTimeout = newPikpakCacheTimeout;
                    await GM_setValue(PIKPAK_CACHE_CHECK_TIMEOUT_KEY, pikpakCacheCheckTimeout);
                    pikpakNoAuthCheck = newPikpakNoAuthCheck;
                    await GM_setValue(PIKPAK_NO_AUTH_CHECK_KEY, pikpakNoAuthCheck);
                    pikpakShowTooltip = newPikpakShowTooltip;
                    await GM_setValue(PIKPAK_SHOW_TOOLTIP_KEY, pikpakShowTooltip);
                    
                    // Save other settings
                    cacheEnabled = newCacheEnabled;
                    await GM_setValue(CACHE_ENABLED_KEY, cacheEnabled);
                    cacheDurationDays = newCacheDuration;
                    await GM_setValue(CACHE_DURATION_KEY, cacheDurationDays);
                    performanceMetricsEnabled = newPerformanceMetrics;
                    await GM_setValue(PERFORMANCE_METRICS_ENABLED_KEY, performanceMetricsEnabled);
                    concurrencyLevel = newConcurrency;
                    await GM_setValue(CONCURRENCY_LEVEL_KEY, concurrencyLevel);
                    batchSize = newBatchSize;
                    await GM_setValue(BATCH_SIZE_KEY, batchSize);
                    enable1337xSupport = new1337xSupport;
                    await GM_setValue(ENABLE_1337X_SUPPORT_KEY, enable1337xSupport);
                    showProgressBar = newProgressBar;
                    await GM_setValue(SHOW_PROGRESS_BAR_KEY, showProgressBar);
                    showMagnetLink1337x = newMagnetLink1337x;
                    await GM_setValue(SHOW_MAGNET_LINK_1337X_KEY, showMagnetLink1337x);
                    cloudflareBypassEnabled = newCloudflareBypass;
                    await GM_setValue(CLOUDFLARE_BYPASS_ENABLED_KEY, cloudflareBypassEnabled);
                    showCredentials = newShowCredentials;
                    await GM_setValue(SHOW_CREDENTIALS_KEY, showCredentials);

                    // Clear account manager cache so it reloads fresh data
                    accountManager.clearCache();
                    
                    showTemporaryMessage('Settings saved! Reload page for changes.', 'green');
                    overlay.remove();
                } catch (error) {
                    console.error('[magnetLinkChecker] Error saving settings:', error);
                    alert('Error saving settings. Check console.');
                }
            });
        } catch (error) {
            console.error('[magnetLinkChecker] Error showing advanced settings:', error);
        }
    }

    // ==================== SIMPLIFIED MENU COMMANDS ====================
    GM_registerMenuCommand(`${cacheEnabled ? '✅ Cache Enabled' : '🚫 Cache Disabled'}`, async function () {
        cacheEnabled = !cacheEnabled;
        await GM_setValue(CACHE_ENABLED_KEY, cacheEnabled);
        alert(`Persistent cache is now ${cacheEnabled ? 'enabled' : 'disabled'}. Please reload the page.`);
        location.reload();
    });

    GM_registerMenuCommand('🗑️ Clear Cache', clearCache);

    GM_registerMenuCommand(`${offcloudEnabled ? '✅' : '🚫'} Offcloud (${offcloudAccounts.length} account${offcloudAccounts.length !== 1 ? 's' : ''})`, async function () {
        offcloudEnabled = !offcloudEnabled;
        await GM_setValue(OFFCLOUD_ENABLED_KEY, offcloudEnabled);
        alert(`Offcloud is now ${offcloudEnabled ? 'enabled' : 'disabled'}. Please reload the page.`);
        location.reload();
    });

    GM_registerMenuCommand(`${torboxEnabled ? '✅' : '🚫'} Torbox (${torboxAccounts.length} account${torboxAccounts.length !== 1 ? 's' : ''})`, async function () {
        torboxEnabled = !torboxEnabled;
        await GM_setValue(TORBOX_ENABLED_KEY, torboxEnabled);
        alert(`Torbox is now ${torboxEnabled ? 'enabled' : 'disabled'}. Please reload the page.`);
        location.reload();
    });

    GM_registerMenuCommand(`${pikpakEnabled ? '✅' : '🚫'} PikPak (${pikpakAccounts.length} account${pikpakAccounts.length !== 1 ? 's' : ''})`, async function () {
        pikpakEnabled = !pikpakEnabled;
        await GM_setValue(PIKPAK_ENABLED_KEY, pikpakEnabled);
        alert(`PikPak is now ${pikpakEnabled ? 'enabled' : 'disabled'}. Please reload the page.`);
        location.reload();
    });

    GM_registerMenuCommand('🗑️ Clear PikPak Cache', async function () {
        if (confirm('Are you sure you want to clear the PikPak cache?')) {
            await clearPikPakCache();
        }
    });

    GM_registerMenuCommand(`${performanceMetricsEnabled ? '✅ Performance Metrics Enabled' : '🚫 Performance Metrics Disabled'}`, async function () {
        performanceMetricsEnabled = !performanceMetricsEnabled;
        await GM_setValue(PERFORMANCE_METRICS_ENABLED_KEY, performanceMetricsEnabled);
        alert(`Performance Metrics is now ${performanceMetricsEnabled ? 'enabled' : 'disabled'}. Please reload the page.`);
        location.reload();
    });

    GM_registerMenuCommand('⚙️ Advanced Settings', showAdvancedSettings);

    // Start based on the site and configuration
    if (enable1337xSupport && /1337x\./.test(window.location.hostname) && !/\/torrent\//.test(window.location.pathname)) {
        handle1337xSite();
    } else {
        main();
        addFloatingButton();
    }
})();
