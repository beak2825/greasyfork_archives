// ==UserScript==
// @name         Reddit Advanced Content Filter v2.1.1
// @namespace    reddit-filter
// @version      2.1.1
// @description  Filters Reddit content by keywords, regex, user, subreddit with target & normalization options. Includes text replacement for comments. Enhanced UI colors with select fix. UI panel is movable (wider drag area), resizable, and remembers its state.
// @author       dani71153 (Modified by Assistant)
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_log
// @require      https://cdn.jsdelivr.net/npm/dompurify@2.4.4/dist/purify.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531282/Reddit%20Advanced%20Content%20Filter%20v211.user.js
// @updateURL https://update.greasyfork.org/scripts/531282/Reddit%20Advanced%20Content%20Filter%20v211.meta.js
// ==/UserScript==

/* global DOMPurify, GM_setValue, GM_getValue, GM_registerMenuCommand, GM_log, GM_info */

(function() {
    'use strict';

    // --- Constants ---
    const SCRIPT_PREFIX = 'RACF';
    const DEBOUNCE_DELAY_MS = 250;
    const STATS_SAVE_DEBOUNCE_MS = 2000;
    const CONFIG_STORAGE_KEY = 'config_v1.7';
    const STATS_STORAGE_KEY = 'stats_v1';
    const RULE_TYPES = ['keyword', 'user', 'subreddit'];
    const FILTER_ACTIONS = ['hide', 'blur', 'border', 'collapse', 'replace_text'];
    const DEBUG_LOGGING = false; // Set to true for detailed console logs

    // --- Default Structures ---
    const DEFAULT_CONFIG = {
        rules: [],
        filterTypes: ['posts', 'comments'], filterAction: 'hide',
        whitelist: { subreddits: [], users: [] },
        blacklist: { subreddits: [], users: [] },
        uiVisible: true, activeTab: 'settings',
        uiPosition: {
            top: '100px',
            left: null,
            right: '20px',
            width: null,
            height: null
        }
    };
    const DEFAULT_STATS = {
        totalProcessed: 0, totalFiltered: 0, totalWhitelisted: 0,
        filteredByType: { posts: 0, comments: 0, messages: 0 },
        filteredByRule: {},
        filteredByAction: { hide: 0, blur: 0, border: 0, collapse: 0, replace_text: 0 }
    };

    if (!window.MutationObserver) { GM_log(`[${SCRIPT_PREFIX}] MutationObserver not supported.`); }

    class RedditFilter {
        constructor() {
            this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            this.stats = JSON.parse(JSON.stringify(DEFAULT_STATS));
            this.processedNodes = new WeakSet();
            this.selectors = {};
            this.isOldReddit = false;
            this.observer = null;
            this.uiContainer = null;
            this.shadowRoot = null;
            this.scrollTimer = null;
            this.lastFilterTime = 0;
            this.filterApplyDebounceTimer = null;
            this.statsSaveDebounceTimer = null;
            this.uiUpdateDebounceTimer = null;
            this.isDragging = false;
            this.dragStartX = 0;
            this.dragStartY = 0;
            this.dragInitialLeft = 0;
            this.dragInitialTop = 0;
            this.domPurify = (typeof DOMPurify === 'undefined') ? { sanitize: (t) => t } : DOMPurify;
            this.originalContentCache = new WeakMap();
        }

        log(message) {
            GM_log(`[${SCRIPT_PREFIX}] ${message}`);
        }

        debugLog(message, ...args) {
            if (DEBUG_LOGGING) {
                console.log(`[${SCRIPT_PREFIX} DEBUG] ${message}`, ...args);
            }
        }

        async init() {
            this.log(`Initializing v${GM_info?.script?.version || '2.1.1'}...`);
            try {
                await this.loadConfig();
                await this.loadStats();
                this.detectRedditVersion();
                this.injectUI();
                this.updateUI();
                this.registerMenuCommands();
                this.initializeObserver();
                this.addScrollListener();
                setTimeout(() => this.applyFilters(document.body), 500);
                this.log(`Initialization complete.`);
            } catch (error) {
                this.log(`Init failed: ${error.message}`);
                console.error(`[${SCRIPT_PREFIX}] Init failed:`, error);
            }
        }

        async loadConfig() {
            try {
                const savedConfigString = await GM_getValue(CONFIG_STORAGE_KEY, null);
                if (savedConfigString) {
                    const parsedConfig = JSON.parse(savedConfigString);
                    this.config = {
                        ...DEFAULT_CONFIG,
                        ...parsedConfig,
                        whitelist: { ...DEFAULT_CONFIG.whitelist, ...(parsedConfig.whitelist || {}) },
                        blacklist: { ...DEFAULT_CONFIG.blacklist, ...(parsedConfig.blacklist || {}) },
                        uiPosition: { ...DEFAULT_CONFIG.uiPosition, ...(parsedConfig.uiPosition || {}) },
                        rules: Array.isArray(parsedConfig.rules) ? parsedConfig.rules : []
                    };
                    if (!FILTER_ACTIONS.includes(this.config.filterAction)) {
                        this.log(`Invalid filterAction '${this.config.filterAction}', defaulting to '${DEFAULT_CONFIG.filterAction}'.`);
                        this.config.filterAction = DEFAULT_CONFIG.filterAction;
                    }
                    this.log(`Config loaded.`);
                } else {
                    this.log(`No saved config found. Using defaults.`);
                    this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                }
            } catch (e) {
                this.log(`Failed to load config: ${e.message}. Using defaults.`);
                this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                await this.saveConfig();
            }
        }

        async saveConfig() {
            try {
                if (!this.config) this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
                if (!Array.isArray(this.config.rules)) this.config.rules = [];
                if (!this.config.whitelist) this.config.whitelist = { subreddits: [], users: [] };
                if (!this.config.blacklist) this.config.blacklist = { subreddits: [], users: [] };
                this.config.uiPosition = {
                    ...DEFAULT_CONFIG.uiPosition,
                    ...(this.config.uiPosition || {})
                };
                 if (!FILTER_ACTIONS.includes(this.config.filterAction)) this.config.filterAction = DEFAULT_CONFIG.filterAction;

                await GM_setValue(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
                 this.debugLog("Config saved:", this.config);
            } catch (e) {
                this.log(`Failed to save config: ${e.message}`);
                console.error(`[${SCRIPT_PREFIX}] Failed save config:`, e);
            }
        }

        async loadStats() {
            try {
                const savedStatsString = await GM_getValue(STATS_STORAGE_KEY, null);
                if (savedStatsString) {
                    const parsedStats = JSON.parse(savedStatsString);
                    const defaultActions = DEFAULT_STATS.filteredByAction;
                    const loadedActions = parsedStats.filteredByAction || {};
                    const mergedActions = { ...defaultActions };
                    for (const action in loadedActions) {
                        if (FILTER_ACTIONS.includes(action)) {
                            mergedActions[action] = loadedActions[action];
                        }
                    }
                    this.stats = {
                        ...DEFAULT_STATS,
                        ...parsedStats,
                        filteredByType: { ...DEFAULT_STATS.filteredByType, ...(parsedStats.filteredByType || {}) },
                        filteredByRule: { ...DEFAULT_STATS.filteredByRule, ...(parsedStats.filteredByRule || {}) },
                        filteredByAction: mergedActions
                    };
                } else {
                    this.log(`No saved stats found. Using defaults.`);
                    this.stats = JSON.parse(JSON.stringify(DEFAULT_STATS));
                }
            } catch (e) {
                this.log(`Failed to load stats: ${e.message}. Resetting.`);
                this.stats = JSON.parse(JSON.stringify(DEFAULT_STATS));
                await this.saveStats();
            }
        }

        async saveStats() {
            try {
                await GM_setValue(STATS_STORAGE_KEY, JSON.stringify(this.stats));
            } catch (e) {
                this.log(`Failed to save stats: ${e.message}`);
            }
        }

        debouncedSaveStats() {
            if (this.statsSaveDebounceTimer) clearTimeout(this.statsSaveDebounceTimer);
            this.statsSaveDebounceTimer = setTimeout(async () => {
                await this.saveStats();
                this.statsSaveDebounceTimer = null;
            }, STATS_SAVE_DEBOUNCE_MS);
        }

        async resetStats() {
            if (confirm("Reset all filter statistics? This cannot be undone.")) {
                this.stats = JSON.parse(JSON.stringify(DEFAULT_STATS));
                await this.saveStats();
                this.updateUI();
                this.log(`Stats reset.`);
            }
        }

        detectRedditVersion() {
            // (No changes needed)
             const isOldDomain = window.location.hostname === 'old.reddit.com';
             const hasOldBodyClass = document.body.classList.contains('listing-page') || document.body.classList.contains('comments-page');
             if (isOldDomain || hasOldBodyClass) {
                 this.isOldReddit = true;
                 this.selectors = { /* ... old reddit selectors ... */
                    post: '.thing.link:not(.promoted)',
                    comment: '.thing.comment',
                    postSubredditSelector: '.tagline .subreddit',
                    postAuthorSelector: '.tagline .author',
                    commentAuthorSelector: '.tagline .author',
                    postTitleSelector: 'a.title',
                    postBodySelector: '.usertext-body .md, .expando .usertext-body .md',
                    commentBodySelector: '.usertext-body .md',
                    commentEntry: '.entry',
                    commentContentContainer: '.child'
                 };
                 this.log(`Old Reddit detected.`);
             } else {
                 this.isOldReddit = false;
                 this.selectors = { /* ... new reddit selectors ... */
                     post: 'shreddit-post',
                     comment: 'shreddit-comment',
                     postSubredditSelector: '[slot="subreddit-name"]',
                     postAuthorSelector: '[slot="author-name"]',
                     commentAuthorSelector: '[slot="author-name"]',
                     postTitleSelector: '[slot="title"]',
                     postBodySelector: '#post-rtjson-content, [data-post-click-location="text-body"], [slot="text-body"]',
                     commentBodySelector: 'div[slot="comment"]',
                     commentEntry: ':host',
                     commentContentContainer: '[slot="comment"]'
                 };
                 this.log(`New Reddit detected.`);
             }
             this.selectors.message = '.message';
        }

        injectUI() {
            if (this.uiContainer) return;

            this.uiContainer = document.createElement('div');
            this.uiContainer.id = `${SCRIPT_PREFIX}-ui-container`;

            const pos = this.config.uiPosition;
            let initialPositionStyle = `position: fixed; z-index: 9999; `;
            initialPositionStyle += `top: ${pos.top || DEFAULT_CONFIG.uiPosition.top}; `;
            if (pos.left !== null && pos.left !== undefined) {
                initialPositionStyle += `left: ${pos.left}; right: auto; `;
            } else {
                initialPositionStyle += `left: auto; right: ${pos.right || DEFAULT_CONFIG.uiPosition.right}; `;
            }
            initialPositionStyle += `resize: both; overflow: auto; min-width: 380px; min-height: 200px; `;

            this.uiContainer.style.cssText = initialPositionStyle;
            if (pos.width && pos.width !== 'auto') this.uiContainer.style.width = pos.width;
            if (pos.height && pos.height !== 'auto') this.uiContainer.style.height = pos.height;
            this.uiContainer.style.display = this.config.uiVisible ? 'block' : 'none';

            this.shadowRoot = this.uiContainer.attachShadow({ mode: 'open' });

            // --- UI HTML (unchanged) ---
             const uiContent = document.createElement('div');
             uiContent.innerHTML = `
                 <div class="racf-card">
                      <div class="racf-tabs" id="racf-drag-handle">
                          <button class="racf-tab-btn active" data-tab="settings">Settings</button>
                          <button class="racf-tab-btn" data-tab="stats">Statistics</button>
                      </div>
                     <button id="racf-close-btn" class="racf-close-btn" title="Close Panel">×</button>
                     <div id="racf-settings-content" class="racf-tab-content active">
                         <h4>Filter Settings</h4>
                         <div class="racf-add-rule-section">
                             <div class="racf-input-group">
                                 <label for="racf-rule-input">Rule Text:</label>
                                 <input type="text" id="racf-rule-input" placeholder="Keyword, /regex/, user, subreddit">
                             </div>
                             <div class="racf-input-group">
                                 <label for="racf-rule-type">Rule Type:</label>
                                 <select id="racf-rule-type">
                                     <option value="keyword" selected>Keyword/Regex</option>
                                     <option value="user">User</option>
                                     <option value="subreddit">Subreddit</option>
                                 </select>
                             </div>
                             <div class="racf-input-group">
                                 <label for="racf-rule-target">Apply In:</label>
                                 <select id="racf-rule-target">
                                     <option value="both" selected>Title & Body</option>
                                     <option value="title">Title Only</option>
                                     <option value="body">Body Only</option>
                                 </select>
                             </div>
                             <div class="racf-input-group racf-checkbox-group">
                                 <label for="racf-rule-normalize">Normalize:</label>
                                 <input type="checkbox" id="racf-rule-normalize" title="Ignore accents/case (Keywords only, not Regex)">
                                 <small>(Keywords only)</small>
                             </div>
                             <button id="racf-add-rule-btn">Add Rule</button>
                         </div>
                         <div class="racf-section">
                             <label>Filter Types:</label>
                             <label><input type="checkbox" class="racf-filter-type" value="posts"> Posts</label>
                             <label><input type="checkbox" class="racf-filter-type" value="comments"> Comments</label>
                         </div>
                         <div class="racf-section">
                             <label for="racf-filter-action">Filter Action:</label>
                             <select id="racf-filter-action"></select>
                         </div>
                         <div class="racf-section">
                             <label>Active Rules (<span id="racf-rule-count">0</span>):</label>
                             <ul id="racf-rule-list"></ul>
                         </div>
                         <div class="racf-section">
                             <small>Global Whitelists/Blacklists are managed via JSON Import/Export.</small>
                         </div>
                         <div class="racf-section racf-buttons">
                             <button id="racf-import-btn">Import (.json)</button>
                             <button id="racf-export-btn">Export (.json)</button>
                             <input type="file" id="racf-import-file-input" accept=".json" style="display: none;">
                         </div>
                         <div class="racf-section racf-buttons">
                             <button id="racf-clear-processed-btn">Clear Processed Cache</button>
                         </div>
                     </div>
                     <div id="racf-stats-content" class="racf-tab-content">
                         <h4>Filter Statistics</h4>
                         <div class="racf-stats-grid">
                             <div>Total Processed:</div><div id="racf-stats-processed">0</div>
                             <div>Total Filtered:</div><div id="racf-stats-filtered">0</div>
                             <div>Filtering Rate:</div><div id="racf-stats-rate">0%</div>
                             <div>Total Whitelisted:</div><div id="racf-stats-whitelisted">0</div>
                             <div>Filtered Posts:</div><div id="racf-stats-type-posts">0</div>
                             <div>Filtered Comments:</div><div id="racf-stats-type-comments">0</div>
                             <div>Action - Hide:</div><div id="racf-stats-action-hide">0</div>
                             <div>Action - Blur:</div><div id="racf-stats-action-blur">0</div>
                             <div>Action - Border:</div><div id="racf-stats-action-border">0</div>
                             <div>Action - Collapse:</div><div id="racf-stats-action-collapse">0</div>
                             <div>Action - Replace Text:</div><div id="racf-stats-action-replace_text">0</div>
                         </div>
                         <div class="racf-section">
                             <label>Most Active Rules:</label>
                             <ul id="racf-stats-rule-list"><li>No rules active yet.</li></ul>
                         </div>
                         <div class="racf-section racf-buttons">
                             <button id="racf-reset-stats-btn">Reset Statistics</button>
                         </div>
                     </div>
                 </div>`;

            // --- CSS Styles (Keep cursor: move only on tabs for visual cue) ---
            const styles = document.createElement('style');
            styles.textContent = `
                :host { font-family: sans-serif; font-size: 14px; }
                .racf-card {
                    background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 5px; padding: 0;
                    box-shadow: 0 2px 5px rgba(0,0,0,.2); position: relative; color: #333;
                    height: 100%; display: flex; flex-direction: column;
                }
                /* Keep cursor: move only on the explicit tabs bar for clarity */
                .racf-tabs { display: flex; border-bottom: 1px solid #ccc; cursor: move; user-select: none; flex-shrink: 0; }
                .racf-tab-btn {
                    flex: 1; padding: 10px 15px; background: #e9ecef; border: none;
                    border-right: 1px solid #dee2e6; cursor: pointer; font-size: 14px; color: #495057;
                    transition: background-color 0.2s, color 0.2s, border-color 0.2s;
                }
                .racf-tab-btn:last-child { border-right: none; }
                .racf-tab-btn:hover { background: #d3d9df; color: #212529; }
                .racf-tab-btn.active {
                    background: #f9f9f9; color: #0056b3; border-bottom: 1px solid #f9f9f9;
                    border-top: 3px solid #007bff; margin-bottom: -1px; font-weight: 700;
                }
                .racf-tab-content { display: none; padding: 15px; flex-grow: 1; overflow-y: auto; }
                .racf-tab-content.active { display: block; }
                .racf-card h4 { margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; color: #0056b3; }
                .racf-section { margin-bottom: 15px; }
                .racf-section small { font-weight: normal; font-style: italic; color: #555; font-size: 0.9em; }
                .racf-add-rule-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; align-items: flex-end; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
                .racf-input-group { display: flex; flex-direction: column; gap: 3px; }
                .racf-input-group label { font-size: .9em; font-weight: 700; color: #495057; }
                .racf-checkbox-group { flex-direction: row; align-items: center; gap: 5px; margin-top: auto; }
                .racf-checkbox-group label { margin-bottom: 0; }
                .racf-checkbox-group small { margin-left: 0; }
                input[type=text], select { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px; box-sizing: border-box; font-size: 14px; background-color: #fff; color: #212529; }
                input[type=text]:focus, select:focus { border-color: #80bdff; outline: 0; box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); }
                .racf-section input[type=checkbox] { margin-right: 3px; vertical-align: middle; }
                .racf-section label+label { margin-left: 10px; font-weight: 400; }
                button { padding: 8px 12px; border: 1px solid #adb5bd; background-color: #f8f9fa; color: #212529; border-radius: 3px; cursor: pointer; font-size: 14px; transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, color 0.15s ease-in-out; }
                button:hover { background-color: #e9ecef; border-color: #a1a8af; color: #212529; }
                button:active { background-color: #dee2e6; border-color: #939ba1; }
                #racf-add-rule-btn { background-color: #007bff; color: #fff; border-color: #007bff; font-weight: bold; padding: 8px 15px; margin-top: 15px; grid-column: 1 / -1; }
                #racf-add-rule-btn:hover { background-color: #0056b3; border-color: #0056b3; }
                #racf-import-btn, #racf-export-btn { background-color: #28a745; color: #fff; border-color: #28a745; }
                #racf-import-btn:hover, #racf-export-btn:hover { background-color: #218838; border-color: #1e7e34; }
                #racf-clear-processed-btn { background-color: #6c757d; color: #fff; border-color: #6c757d; }
                #racf-clear-processed-btn:hover { background-color: #5a6268; border-color: #545b62; }
                #racf-reset-stats-btn { background-color: #dc3545; color: #fff; border-color: #dc3545; }
                #racf-reset-stats-btn:hover { background-color: #c82333; border-color: #bd2130; }
                #racf-rule-list button.racf-remove-btn { background: #dc3545; border: 1px solid #dc3545; color: #fff; padding: 3px 7px; font-size: 11px; margin-left: 5px; flex-shrink: 0; line-height: 1; }
                #racf-rule-list button.racf-remove-btn:hover { background-color: #c82333; border-color: #bd2130; }
                #racf-rule-list, #racf-stats-rule-list { list-style: none; padding: 0; max-height: 180px; overflow-y: auto; border: 1px solid #eee; margin-top: 5px; background: #fff; }
                #racf-rule-list li, #racf-stats-rule-list li { padding: 6px 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
                #racf-rule-list li:last-child, #racf-stats-rule-list li:last-child { border-bottom: none; }
                #racf-rule-list .racf-rule-details { flex-grow: 1; margin-right: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
                #racf-rule-list .racf-rule-type-badge { font-size: .8em; padding: 1px 4px; border-radius: 3px; background-color: #6c757d; color: #fff; flex-shrink: 0; text-transform: uppercase; }
                #racf-rule-list .racf-rule-text { word-break: break-all; font-family: monospace; background: #e9ecef; padding: 1px 3px; border-radius: 2px; color: #212529;}
                #racf-stats-rule-list .racf-rule-text { flex-grow: 1; margin-right: 10px; word-break: break-all; font-family: monospace; background: #e9ecef; padding: 1px 3px; border-radius: 2px; color: #212529;}
                #racf-stats-rule-list .racf-rule-count { font-weight: 700; margin-left: 10px; flex-shrink: 0; background-color: #007bff; color: #fff; padding: 2px 5px; border-radius: 10px; font-size: 0.9em;}
                .racf-buttons { margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; display: flex; gap: 10px; flex-wrap: wrap; flex-shrink: 0; }
                .racf-buttons button { flex-grow: 1; margin: 0; }
                .racf-close-btn { position: absolute; top: 5px; right: 10px; background: 0 0; border: none; font-size: 24px; font-weight: 700; color: #6c757d; cursor: pointer; z-index: 10; margin: 0 !important; padding: 0 5px; line-height: 1; }
                .racf-close-btn:hover { color: #343a40; }
                .racf-stats-grid { display: grid; grid-template-columns: auto 1fr; gap: 5px 10px; margin-bottom: 15px; font-size: 13px; }
                .racf-stats-grid div:nth-child(odd) { font-weight: 700; text-align: right; color: #495057; }
                .racf-stats-grid div:nth-child(even) { font-family: monospace; color: #0056b3; }
            `;


            this.shadowRoot.appendChild(styles);
            this.shadowRoot.appendChild(uiContent);
            this.injectGlobalStyles();
            document.body.insertAdjacentElement('beforeend', this.uiContainer);
            this.addUIEventListeners();
            this.log(`UI injected with resize and wide drag area enabled.`);
        }

        injectGlobalStyles() {
             // (No changes needed)
             const styleId = `${SCRIPT_PREFIX}-global-styles`;
             let globalStyleSheet = document.getElementById(styleId);
             if (!globalStyleSheet) {
                 globalStyleSheet = document.createElement("style");
                 globalStyleSheet.id = styleId;
                 document.head.appendChild(globalStyleSheet);
             }
             const commentEntrySelector = this.selectors.commentEntry || '.comment';
             const commentContentContainerSelector = this.selectors.commentContentContainer || '.child';
             const commentTaglineSelector = this.isOldReddit ? '.entry > .tagline' : 'header';
             const commentFormSelector = this.isOldReddit ? '.entry > form' : 'shreddit-composer';
             globalStyleSheet.textContent = `
                 .${SCRIPT_PREFIX}-hide { display: none !important; height: 0 !important; overflow: hidden !important; margin: 0 !important; padding: 0 !important; border: none !important; visibility: hidden !important; }
                 .${SCRIPT_PREFIX}-blur { filter: blur(5px) !important; transition: filter 0.2s ease; cursor: pointer; }
                 .${SCRIPT_PREFIX}-blur:hover { filter: none !important; }
                 .${SCRIPT_PREFIX}-border { outline: 3px solid red !important; outline-offset: -1px; }
                 .${SCRIPT_PREFIX}-collapse > ${commentContentContainerSelector},
                 .${SCRIPT_PREFIX}-collapse ${commentFormSelector} { display: none !important; }
                 .${SCRIPT_PREFIX}-collapse.thing.comment > .entry > .child,
                 .${SCRIPT_PREFIX}-collapse.thing.comment > .entry > .usertext { display: none !important; }
                 .${SCRIPT_PREFIX}-collapse > ${commentTaglineSelector} { opacity: 0.6 !important; }
                 .${SCRIPT_PREFIX}-collapse > ${commentTaglineSelector}::after,
                 .${SCRIPT_PREFIX}-collapse.thing.comment > .entry > .tagline::after {
                     content: " [Filtered]"; font-style: italic; font-size: 0.9em; color: grey;
                     margin-left: 5px; display: inline; vertical-align: baseline;
                 }
                 .${SCRIPT_PREFIX}-hide.thing.comment,
                 .${SCRIPT_PREFIX}-hide.shreddit-comment { }
                 .${SCRIPT_PREFIX}-text-replaced .usertext-body .md p,
                 .${SCRIPT_PREFIX}-text-replaced div[slot="comment"] p {
                     color: grey; font-style: italic; margin: 0; padding: 5px 0;
                 }
             `;
        }

        addUIEventListeners() {
            if (!this.shadowRoot) return;
            const q = (s) => this.shadowRoot.querySelector(s);
            const qa = (s) => this.shadowRoot.querySelectorAll(s);

            // *** CHANGE HERE: Attach drag listener to the main card ***
            const cardElement = q('.racf-card');
            if (cardElement) {
                cardElement.addEventListener('mousedown', this.dragMouseDown.bind(this));
                this.debugLog("Drag listener attached to .racf-card");
            } else {
                this.log("Error: Card element (.racf-card) not found for attaching drag listener.");
            }

            // --- Other listeners remain the same ---

            // Tab switching (ensure stopPropagation to prevent drag)
            qa('.racf-tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent drag start when clicking tabs
                    const tabId = e.target.dataset.tab;
                    if (!tabId) return;
                    qa('.racf-tab-btn').forEach(b => b.classList.remove('active'));
                    qa('.racf-tab-content').forEach(c => c.classList.remove('active'));
                    e.target.classList.add('active');
                    const contentEl = q(`#racf-${tabId}-content`);
                    if (contentEl) contentEl.classList.add('active');
                    this.config.activeTab = tabId;
                    if (tabId === 'stats') { this.updateUI(); }
                    // Don't save config on tab switch
                });
            });

            // Rule management
            q('#racf-add-rule-btn').addEventListener('click', () => this.handleAddRule());
            q('#racf-rule-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') this.handleAddRule(); });
            q('#racf-rule-list').addEventListener('click', (e) => {
                 // Prevent drag start when clicking inside the rule list (buttons handled below)
                 e.stopPropagation();
                const removeButton = e.target.closest('button.racf-remove-btn');
                if (removeButton) {
                     // stopPropagation() already prevents drag, button click proceeds
                    const ruleIndex = parseInt(removeButton.dataset.ruleIndex, 10);
                    if (!isNaN(ruleIndex)) { this.removeRuleByIndex(ruleIndex); }
                    else { this.log(`Could not remove rule: Invalid index.`); }
                }
            });

            // Filter type checkboxes
            qa('.racf-filter-type').forEach(cb => {
                cb.addEventListener('change', (e) => this.handleFilterTypeChange(e));
            });

            // Filter action dropdown
            const filterActionSelect = q('#racf-filter-action');
            if (filterActionSelect) {
                filterActionSelect.addEventListener('change', (e) => {
                    const newAction = e.target.value;
                    if (FILTER_ACTIONS.includes(newAction)) {
                        this.config.filterAction = newAction;
                        this.saveConfigAndApplyFilters();
                    } else {
                        this.log(`Invalid filter action selected: ${newAction}`);
                        e.target.value = this.config.filterAction;
                    }
                });
            }

            // Import/Export/Clear/Reset buttons
            q('#racf-export-btn').addEventListener('click', () => this.exportConfig());
            q('#racf-import-btn').addEventListener('click', () => { q('#racf-import-file-input')?.click(); });
            q('#racf-import-file-input')?.addEventListener('change', (e) => this.importConfig(e));
            q('#racf-clear-processed-btn').addEventListener('click', () => {
                this.processedNodes = new WeakSet();
                this.originalContentCache = new WeakMap();
                this.log(`Processed node cache and original content cache cleared.`);
                this.applyFilters(document.body);
            });
            q('#racf-reset-stats-btn').addEventListener('click', () => this.resetStats());
            q('#racf-close-btn').addEventListener('click', (e) => {
                 e.stopPropagation(); // Prevent drag start when clicking close button
                 this.toggleUIVisibility(false)
            });

             // Resize end listener (mouseup on the container)
             if (this.uiContainer) {
                 this.uiContainer.addEventListener('mouseup', () => {
                    if (!this.isDragging) { // Only save dimensions if not dragging
                         this.saveCurrentDimensions();
                    }
                 });
             }
        }

        // --- Dragging Functions ---
        dragMouseDown(e) {
            // 1. Only react to left mouse button
            if (e.button !== 0) return;

            // *** CHANGE HERE: Prevent drag if clicking on interactive elements ***
            const noDragElementsSelector = 'button, input, select, textarea, a, ul#racf-rule-list, ul#racf-stats-rule-list';
            const clickedElement = e.target;

            if (clickedElement.closest(noDragElementsSelector)) {
                this.debugLog("Drag prevented: Clicked on an interactive element.", clickedElement);
                // Don't prevent default or stop propagation here, allow the click to proceed on the element
                return;
            }
            // Also prevent drag if clicking directly on scrollbars within the shadow DOM (experimental)
             if (e.offsetX > clickedElement.clientWidth || e.offsetY > clickedElement.clientHeight) {
                 this.debugLog("Drag prevented: Click likely on scrollbar.");
                 return;
             }

            // 2. If click is not on an excluded element, proceed with drag initiation
            e.preventDefault(); // Prevent text selection during drag
            e.stopPropagation(); // Prevent triggering other listeners if needed

            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            const rect = this.uiContainer.getBoundingClientRect();
            this.dragInitialTop = rect.top;
            this.dragInitialLeft = rect.left;

            this.elementDragBound = this.elementDrag.bind(this);
            this.closeDragElementBound = this.closeDragElement.bind(this);
            document.addEventListener('mousemove', this.elementDragBound);
            document.addEventListener('mouseup', this.closeDragElementBound);

            // Optional visual feedback
            // this.uiContainer.style.cursor = 'grabbing'; // Might override internal cursors
            this.uiContainer.style.opacity = '0.9';
            this.uiContainer.style.userSelect = 'none'; // Prevent text selection
        }

        elementDrag(e) {
            // (No changes needed)
            if (!this.isDragging) return;
            e.preventDefault();
            const deltaX = e.clientX - this.dragStartX;
            const deltaY = e.clientY - this.dragStartY;
            let newTop = this.dragInitialTop + deltaY;
            let newLeft = this.dragInitialLeft + deltaX;
            const containerRect = this.uiContainer.getBoundingClientRect();
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - containerRect.height));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - containerRect.width));
            this.uiContainer.style.top = `${newTop}px`;
            this.uiContainer.style.left = `${newLeft}px`;
            this.uiContainer.style.right = 'auto';
        }

        closeDragElement() {
            // (No changes needed)
            if (!this.isDragging) return;
            this.isDragging = false;
            document.removeEventListener('mousemove', this.elementDragBound);
            document.removeEventListener('mouseup', this.closeDragElementBound);
            // this.uiContainer.style.cursor = '';
            this.uiContainer.style.opacity = '1';
            this.uiContainer.style.userSelect = '';
            this.saveCurrentPositionAndDimensions(); // Save final state
        }
        // --- End Dragging Functions ---

        saveCurrentPositionAndDimensions() {
            // (No changes needed)
             if (!this.uiContainer) return;
             const rect = this.uiContainer.getBoundingClientRect();
             this.config.uiPosition.top = `${rect.top}px`;
             this.config.uiPosition.left = `${rect.left}px`;
             this.config.uiPosition.right = null; // Always use left after interaction
             this.config.uiPosition.width = `${rect.width}px`;
             this.config.uiPosition.height = `${rect.height}px`;
             this.saveConfig();
        }

         saveCurrentDimensions() {
            // (No changes needed)
             if (!this.uiContainer) return;
             const rect = this.uiContainer.getBoundingClientRect();
             let changed = false;
             const newWidth = `${rect.width}px`;
             const newHeight = `${rect.height}px`;
             if (this.config.uiPosition.width !== newWidth) {
                 this.config.uiPosition.width = newWidth;
                 changed = true;
             }
              if (this.config.uiPosition.height !== newHeight) {
                 this.config.uiPosition.height = newHeight;
                 changed = true;
             }
             if (changed) {
                 this.debugLog(`Saving dimensions after resize: W=${newWidth}, H=${newHeight}`);
                 this.saveConfig();
             }
         }

        updateUI() {
             // (No changes needed)
            if (!this.shadowRoot || !this.uiContainer) return;
            this.uiContainer.style.display = this.config.uiVisible ? 'block' : 'none';
            const pos = this.config.uiPosition;
            this.uiContainer.style.top = pos.top || DEFAULT_CONFIG.uiPosition.top;
            if (pos.left !== null) {
                this.uiContainer.style.left = pos.left;
                this.uiContainer.style.right = 'auto';
            } else {
                this.uiContainer.style.left = 'auto';
                this.uiContainer.style.right = pos.right || DEFAULT_CONFIG.uiPosition.right;
            }
             if (pos.width && pos.width !== 'auto') this.uiContainer.style.width = pos.width;
             if (pos.height && pos.height !== 'auto') this.uiContainer.style.height = pos.height;

            const q = (s) => this.shadowRoot.querySelector(s);
            const qa = (s) => this.shadowRoot.querySelectorAll(s);
            const ruleListEl = q('#racf-rule-list');
            if (ruleListEl) {
                ruleListEl.innerHTML = '';
                (this.config.rules || []).forEach((rule, index) => {
                    const li = document.createElement('li');
                    const safeText = this.domPurify.sanitize(rule.text || '', { USE_PROFILES: { html: false } });
                    const typeTitle = `Type: ${rule.type}`; const regexTitle = rule.isRegex ? ' (Regex)' : '';
                    const caseTitle = (rule.type === 'keyword' && !rule.isRegex) ? (rule.caseSensitive ? ' (Case Sensitive)' : ' (Case Insensitive)') : '';
                    const targetTitle = `Applies to: ${rule.target || 'both'}`; const normTitle = rule.normalize ? ' (Normalized)' : '';
                    li.innerHTML = `<div class="racf-rule-details"><span class="racf-rule-type-badge" title="${typeTitle}">${rule.type}</span><span class="racf-rule-text">${safeText}</span>${rule.isRegex ? `<small title="Regular Expression${caseTitle}">(R${rule.caseSensitive ? '' : 'i'})</small>` : ''}${rule.type === 'keyword' && !rule.isRegex && !rule.caseSensitive && !rule.normalize ? '<small title="Case Insensitive">(i)</small>' : ''}<small title="${targetTitle}">[${rule.target || 'both'}]</small>${rule.normalize ? `<small title="${normTitle}">(Norm)</small>` : ''}</div><button class="racf-remove-btn" data-rule-index="${index}" title="Remove Rule">X</button>`;
                    ruleListEl.appendChild(li);
                });
                const ruleCountEl = q('#racf-rule-count'); if (ruleCountEl) ruleCountEl.textContent = (this.config.rules || []).length;
            }
            qa('.racf-filter-type').forEach(cb => { cb.checked = (this.config.filterTypes || []).includes(cb.value); });
            const actionSelect = q('#racf-filter-action');
            if (actionSelect) {
                if (actionSelect.options.length === 0) {
                    FILTER_ACTIONS.forEach(action => { const option = document.createElement('option'); option.value = action; switch(action){ case 'hide':option.textContent='Hide Completely';break; case 'blur':option.textContent='Blur (Hover)';break; case 'border':option.textContent='Red Border';break; case 'collapse':option.textContent='Collapse (Comments)';break; case 'replace_text':option.textContent='Replace Text (Comments)';break; default:option.textContent=action.charAt(0).toUpperCase()+action.slice(1); } actionSelect.appendChild(option); });
                } actionSelect.value = this.config.filterAction;
            }
             const statsP = q('#racf-stats-processed'); if(statsP) statsP.textContent=this.stats.totalProcessed;
             const statsF = q('#racf-stats-filtered'); if(statsF) statsF.textContent=this.stats.totalFiltered;
             const statsR = q('#racf-stats-rate'); if(statsR) {const r = this.stats.totalProcessed>0?((this.stats.totalFiltered/this.stats.totalProcessed)*100).toFixed(1):0; statsR.textContent=`${r}%`;}
             const statsW = q('#racf-stats-whitelisted'); if(statsW) statsW.textContent=this.stats.totalWhitelisted;
             const statsTP = q('#racf-stats-type-posts'); if(statsTP) statsTP.textContent=this.stats.filteredByType?.posts||0;
             const statsTC = q('#racf-stats-type-comments'); if(statsTC) statsTC.textContent=this.stats.filteredByType?.comments||0;
             const statsAH = q('#racf-stats-action-hide'); if(statsAH) statsAH.textContent=this.stats.filteredByAction?.hide||0;
             const statsAB = q('#racf-stats-action-blur'); if(statsAB) statsAB.textContent=this.stats.filteredByAction?.blur||0;
             const statsAbo = q('#racf-stats-action-border'); if(statsAbo) statsAbo.textContent=this.stats.filteredByAction?.border||0;
             const statsAC = q('#racf-stats-action-collapse'); if(statsAC) statsAC.textContent=this.stats.filteredByAction?.collapse||0;
             const statsAR = q('#racf-stats-action-replace_text'); if(statsAR) statsAR.textContent=this.stats.filteredByAction?.replace_text||0;
            if (this.config.activeTab === 'stats') {
                const statsRuleListEl = q('#racf-stats-rule-list');
                if (statsRuleListEl) {
                    statsRuleListEl.innerHTML = ''; const sortedRules = Object.entries(this.stats.filteredByRule || {}).filter(([, c]) => c > 0).sort(([, a], [, b]) => b - a);
                    if (sortedRules.length === 0) { statsRuleListEl.innerHTML = '<li>No rules triggered yet.</li>'; }
                    else { sortedRules.slice(0, 20).forEach(([rt, c]) => { const li = document.createElement('li'); const srt = this.domPurify.sanitize(rt, { USE_PROFILES: { html: false } }); li.innerHTML = `<span class="racf-rule-text">${srt}</span><span class="racf-rule-count" title="Times triggered">${c}</span>`; statsRuleListEl.appendChild(li); }); }
                }
            }
            const activeTabId = this.config.activeTab || 'settings';
            qa('.racf-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === activeTabId));
            qa('.racf-tab-content').forEach(c => c.classList.toggle('active', c.id === `racf-${activeTabId}-content`));
        }

        // --- Filtering Logic (shouldFilterNode, extract*, filterNode, etc.) ---
        // (No changes needed in these core filtering functions)
        normalizeText(text) { if(typeof text !== 'string') return ''; try { return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); } catch (e) { this.log(`Error normalizing: ${e.message}`); return text.toLowerCase(); } }
        handleAddRule() { const iE=this.shadowRoot.querySelector('#racf-rule-input'); const tE=this.shadowRoot.querySelector('#racf-rule-type'); const tgE=this.shadowRoot.querySelector('#racf-rule-target'); const nE=this.shadowRoot.querySelector('#racf-rule-normalize'); if(!iE||!tE||!tgE||!nE){alert("UI error");return;} const rIT=iE.value.trim(); const rT=tE.value; const rTg=tgE.value; const rN=nE.checked; if(!rIT){alert("Empty rule");iE.focus();return;} if(!RULE_TYPES.includes(rT)){alert("Bad type");return;} let txt=rIT; let isR=false; let cS=true; if(rT==='keyword'){if(txt.startsWith('/')&&txt.length>2){const lSI=txt.lastIndexOf('/');if(lSI>0){const p=txt.substring(1,lSI); const f=txt.substring(lSI+1);try{new RegExp(p,f);isR=true;cS=!f.includes('i');txt=txt;}catch(e){alert(`Bad Regex:${e.message}`);return;}}else{isR=false;cS=false;}}else{isR=false;cS=false;}}else if(rT==='user'||rT==='subreddit'){txt=txt.replace(/^(u\/|r\/)/i,'');isR=false;cS=false;txt=txt.toLowerCase();} if(rN&&rT==='keyword'&&!isR){cS=false;} const nR={type:rT,text:txt,isRegex:isR,caseSensitive:cS,target:rTg,normalize:(rT==='keyword'&&!isR&&rN)}; if(!this.config.rules)this.config.rules=[]; const rE=this.config.rules.some(r=>r.type===nR.type&&r.text===nR.text&&r.isRegex===nR.isRegex&&r.caseSensitive===nR.caseSensitive&&r.target===nR.target&&r.normalize===nR.normalize); if(rE){alert("Rule exists");iE.value='';return;} this.config.rules.push(nR); this.log(`Rule added: ${JSON.stringify(nR)}`); iE.value=''; nE.checked=false; tgE.value='both'; tE.value='keyword'; iE.focus(); this.saveConfigAndApplyFilters(); this.updateUI(); }
        removeRuleByIndex(index) { if(!this.config.rules||index<0||index>=this.config.rules.length){this.log(`Bad index ${index}`);return;} const rm=this.config.rules.splice(index,1); this.log(`Rule removed: ${JSON.stringify(rm[0])}`); this.saveConfigAndApplyFilters(); this.updateUI(); }
        handleFilterTypeChange(event) { const{value,checked}=event.target; if(!this.config.filterTypes)this.config.filterTypes=[]; const index=this.config.filterTypes.indexOf(value); if(checked&&index===-1){this.config.filterTypes.push(value);}else if(!checked&&index>-1){this.config.filterTypes.splice(index,1);} this.saveConfigAndApplyFilters(); }
        initializeObserver() { if(!window.MutationObserver){this.log("No MutationObserver");return;} if(this.observer){this.observer.disconnect();} this.observer=new MutationObserver(this.mutationCallback.bind(this)); this.observer.observe(document.body,{childList:true,subtree:true}); this.log("Observer init."); }
        mutationCallback(mutationsList) { const nTC=new Set(); let hRC=false; for(const m of mutationsList){if(m.type==='childList'&&m.addedNodes.length>0){m.addedNodes.forEach(n=>{if(n.nodeType===Node.ELEMENT_NODE&&!n.id?.startsWith(SCRIPT_PREFIX)&&!n.closest(`#${SCRIPT_PREFIX}-ui-container`)){if(n.matches&&(n.matches(this.selectors.post)||n.matches(this.selectors.comment))){nTC.add(n);hRC=true;} if(n.querySelectorAll){try{n.querySelectorAll(`${this.selectors.post},${this.selectors.comment}`).forEach(el=>{nTC.add(el);hRC=true;});}catch(e){this.debugLog(`Query error: ${e.message}`,n);}}}});}} if(hRC&&nTC.size>0){this.debugLog(`Mutation: ${nTC.size} new nodes.`); this.applyFilters(Array.from(nTC));} }
        applyFilters(nodesOrRoot) { let iTP=[]; const sT=performance.now(); const eS=new Set(); const cE=(r)=>{if(!r||r.nodeType!==Node.ELEMENT_NODE)return; try{if(r.matches&&(r.matches(this.selectors.post)||r.matches(this.selectors.comment))){if(!this.processedNodes.has(r)){eS.add(r);}} r.querySelectorAll(`${this.selectors.post},${this.selectors.comment}`).forEach(el=>{if(!this.processedNodes.has(el)){eS.add(el);}});}catch(e){this.log(`Collect error: ${e.message}`);console.error("Collect Node:",r,e);}}; if(Array.isArray(nodesOrRoot)){nodesOrRoot.forEach(n=>cE(n));}else if(nodesOrRoot?.nodeType===Node.ELEMENT_NODE){cE(nodesOrRoot);}else{this.debugLog("Bad applyFilters input:",nodesOrRoot);return;} iTP=Array.from(eS); if(iTP.length===0){return;} this.debugLog(`Filtering ${iTP.length} new nodes...`); let sC=false; let pC=0; let fC=0; let wC=0; iTP.forEach(n=>{this.processedNodes.add(n);pC++;sC=true; try{const fR=this.shouldFilterNode(n); if(fR.whitelisted){wC++;this.unfilterNode(n);this.debugLog(`Whitelisted: ${fR.reason}`,n);}else if(fR.filter){fC++; const nT=fR.nodeType; const eA=this.getEffectiveAction(this.config.filterAction,nT); if(nT&&this.stats.filteredByType){this.stats.filteredByType[nT]=(this.stats.filteredByType[nT]||0)+1;} if(eA&&this.stats.filteredByAction){this.stats.filteredByAction[eA]=(this.stats.filteredByAction[eA]||0)+1;} const rST=fR.ruleText||`type:${fR.reason}`; if(rST&&this.stats.filteredByRule){this.stats.filteredByRule[rST]=(this.stats.filteredByRule[rST]||0)+1;} this.filterNode(n,fR.reason,nT,eA);this.debugLog(`Filtered (${eA}): ${fR.reason}`,n);}else{this.unfilterNode(n);this.debugLog(`Not filtered: ${fR.reason}`,n);}}catch(err){this.log(`Filter node error: ${err.message}`);console.error(`Filter error:`,err,n); try{this.unfilterNode(n);}catch{}}}); if(sC){this.stats.totalProcessed+=pC;this.stats.totalFiltered+=fC;this.stats.totalWhitelisted+=wC; this.debouncedSaveStats(); if(this.uiUpdateDebounceTimer)clearTimeout(this.uiUpdateDebounceTimer); this.uiUpdateDebounceTimer=setTimeout(()=>{if(this.config.uiVisible){this.updateUI();} this.uiUpdateDebounceTimer=null;},300);} this.lastFilterTime=performance.now(); const dur=this.lastFilterTime-sT; if(iTP.length>0){this.debugLog(`Filtering ${iTP.length} nodes took ${dur.toFixed(2)} ms.`);} }
        getEffectiveAction(cA,nT){if(nT!=='comments'){if(cA==='collapse'||cA==='replace_text'){return'hide';}} return cA;}
        shouldFilterNode(node){ let nT=null; if(node.matches(this.selectors.post))nT='posts'; else if(node.matches(this.selectors.comment))nT='comments'; else return{filter:false,reason:"Not target",whitelisted:false,ruleText:null,nodeType:null}; let res={filter:false,reason:"No match",whitelisted:false,ruleText:null,nodeType:nT}; if(!(this.config.filterTypes||[]).includes(nT)){res.reason=`Type ${nT} disabled`;return res;} const sub=this.extractSubreddit(node,nT)?.toLowerCase()??null; const aut=this.extractAuthor(node,nT)?.toLowerCase()??null; if(sub&&(this.config.blacklist?.subreddits||[]).includes(sub)){return{...res,filter:true,reason:`BL Sub: r/${sub}`,ruleText:`bl-sub:${sub}`};} if(aut&&(this.config.blacklist?.users||[]).includes(aut)){return{...res,filter:true,reason:`BL User: u/${aut}`,ruleText:`bl-user:${aut}`};} if(sub&&(this.config.whitelist?.subreddits||[]).includes(sub)){return{...res,whitelisted:true,reason:`WL Sub: r/${sub}`};} if(aut&&(this.config.whitelist?.users||[]).includes(aut)){return{...res,whitelisted:true,reason:`WL User: u/${aut}`};} let cC={title:null,body:null,checked:false}; for(const rule of(this.config.rules||[])){let match=false; const rST=`[${rule.type}${rule.isRegex?'(R)':''}${rule.normalize?'(N)':''}${rule.target?`-${rule.target}`:''}] ${rule.text}`; let rS=""; try{switch(rule.type){case'keyword':const targ=rule.target||'both'; if(!cC.checked){const ex=this.extractContent(node,nT);cC.title=ex.title;cC.body=ex.body;cC.checked=true;this.debugLog(`Extracted: T:${!!cC.title}, B:${!!cC.body}`,node);} let cTT=[]; let tA=[]; if((targ==='title'||targ==='both')&&cC.title){cTT.push(cC.title);tA.push('title');} if((targ==='body'||targ==='both')&&cC.body){cTT.push(cC.body);tA.push('body');} if(cTT.length===0){this.debugLog(`Skip rule ${rST}: no content for target '${targ}'`,node);continue;} rS=` in ${tA.join('&')}`; let patt=rule.text; let tF; if(rule.isRegex){const rM=patt.match(/^\/(.+)\/([gimyus]*)$/); if(rM){try{const rgx=new RegExp(rM[1],rM[2]);tF=(t)=>rgx.test(t);rS+=` (Regex${rgx.flags.includes('i')?', Insens.':''})`;}catch(rE){this.log(`Rule err (bad regex) ${rST}: ${rE.message}`);continue;}}else{this.log(`Rule err (malformed regex) ${rST}`);continue;}}else{const uN=rule.normalize; const iCS=rule.caseSensitive; const cP=uN?this.normalizeText(patt):(iCS?patt:patt.toLowerCase()); tF=(t)=>{if(!t)return false; const cCo=uN?this.normalizeText(t):(iCS?t:t.toLowerCase()); return cCo.includes(cP);}; rS+=`${uN?' (Norm.)':(iCS?' (Case Sens.)':' (Case Insens.)')}`;} match=cTT.some(t=>tF(t)); break; case'user':if(!aut)continue; match=aut===rule.text; rS=` (author: u/${aut})`; break; case'subreddit':if(!sub||nT!=='posts')continue; match=sub===rule.text; rS=` (sub: r/${sub})`; break;} if(match){const sRD=this.domPurify.sanitize(rule.text,{USE_PROFILES:{html:false}}); return{...res,filter:true,reason:`Rule: [${rule.type}] '${sRD}'${rS}`,ruleText:rST};}}catch(e){this.log(`Rule proc error ${rST}: ${e.message}`);console.error(`Rule error:`,e,rule,node);}} res.reason="No matches"; return res;}
        extractContent(n,nT){const r={title:null,body:null};try{if(nT==='posts'&&this.selectors.postTitleSelector){const tE=n.querySelector(this.selectors.postTitleSelector);if(tE){r.title=tE.textContent?.trim()||null;if(r.title)r.title=r.title.replace(/\s+/g,' ');}} let bS=null; if(nT==='posts'&&this.selectors.postBodySelector){bS=this.selectors.postBodySelector;}else if(nT==='comments'&&this.selectors.commentBodySelector){bS=this.selectors.commentBodySelector;} if(bS){const bE=n.querySelector(bS);if(bE){r.body=bE.textContent?.trim()||null;if(r.body)r.body=r.body.replace(/\s+/g,' ');}else if(this.isOldReddit&&nT==='posts'){const oPB=n.querySelector('.expando .usertext-body .md');if(oPB){r.body=oPB.textContent?.trim()||null;if(r.body)r.body=r.body.replace(/\s+/g,' ');}}}}catch(e){this.log(`Extract content err (t:${nT}): ${e.message}`);console.error("Extract Err:",n,e);} return r;}
        extractSubreddit(n,nT){if(nT!=='posts'||!this.selectors.postSubredditSelector)return null; try{const sE=n.querySelector(this.selectors.postSubredditSelector);if(sE){return sE.textContent?.trim().replace(/^r\//i,'')||null;} if(!this.isOldReddit){const lS=n.querySelector('a[data-testid="subreddit-name"]');if(lS)return lS.textContent?.trim().replace(/^r\//i,'')||null;} return null;}catch(e){this.log(`Extract sub err: ${e.message}`);return null;}}
        extractAuthor(n,nT){const sel=nT==='posts'?this.selectors.postAuthorSelector:this.selectors.commentAuthorSelector; if(!sel)return null; try{const aE=n.querySelector(sel); if(aE){const aT=aE.textContent?.trim();if(aT&&!['[deleted]','[removed]',''].includes(aT.toLowerCase())){return aT.replace(/^u\//i,'')||null;}} if(!this.isOldReddit){const lA=n.querySelector('a[data-testid="post-author-link"], a[data-testid="comment-author-link"]');if(lA){const aT=lA.textContent?.trim();if(aT&&!['[deleted]','[removed]',''].includes(aT.toLowerCase())){return aT.replace(/^u\//i,'')||null;}}} return null;}catch(e){this.log(`Extract author err (t ${nT}): ${e.message}`);return null;}}
        filterNode(n,rs,nT,ac){this.unfilterNode(n); const eA=this.getEffectiveAction(ac,nT); const sR=rs.substring(0,200)+(rs.length>200?'...':''); const fAV=`${SCRIPT_PREFIX}: Filtered [${eA}] (${sR})`; if(eA==='replace_text'&&nT==='comments'){this.replaceCommentText(n,sR);n.setAttribute('data-racf-filter-reason',fAV);n.title=fAV;}else if(FILTER_ACTIONS.includes(eA)&&eA!=='replace_text'){const aCl=`${SCRIPT_PREFIX}-${eA}`;n.classList.add(aCl);n.setAttribute('data-racf-filter-reason',fAV);n.title=fAV;this.debugLog(`Applied class '${aCl}' to:`,n);}else{this.log(`Invalid action '${ac}' in filterNode. Hiding.`);n.classList.add(`${SCRIPT_PREFIX}-hide`); const fbAV=`${SCRIPT_PREFIX}: Filtered [hide - fallback] (${sR})`;n.setAttribute('data-racf-filter-reason',fbAV);n.title=fbAV;}}
        replaceCommentText(cN,rs){const bS=this.selectors.commentBodySelector; if(!bS){this.log("No commentBodySelector");return;} const cB=cN.querySelector(bS); if(!cB){this.debugLog("Comment body not found:",bS,"on:",cN);return;} if(!this.originalContentCache.has(cB)){const cH=cB.innerHTML; if(!cH.includes(`[${SCRIPT_PREFIX}: Text Filtered`)){this.originalContentCache.set(cB,cH);this.debugLog("Stored original:",cB);}else{this.debugLog("Skip cache store (placeholder found).",cB);}} const pH=`<p>[${SCRIPT_PREFIX}: Text Filtered (${rs})]</p>`; if(cB.innerHTML!==pH){cB.innerHTML=pH;cN.classList.add(`${SCRIPT_PREFIX}-text-replaced`);this.debugLog("Replaced text:",cN);}else{this.debugLog("Text already replaced.",cN);}}
        unfilterNode(n){let wM=false; FILTER_ACTIONS.forEach(ac=>{if(ac!=='replace_text'){const clN=`${SCRIPT_PREFIX}-${ac}`;if(n.classList.contains(clN)){n.classList.remove(clN);wM=true;}}}); const tRM=`${SCRIPT_PREFIX}-text-replaced`; if(n.classList.contains(tRM)){n.classList.remove(tRM);wM=true; const bS=this.selectors.commentBodySelector; const cB=bS?n.querySelector(bS):null; if(cB&&this.originalContentCache.has(cB)){const oH=this.originalContentCache.get(cB); if(cB.innerHTML.includes(`[${SCRIPT_PREFIX}: Text Filtered`)){cB.innerHTML=oH;this.debugLog("Restored text:",n);}else{this.debugLog("Skip restore (not placeholder).",cB);} this.originalContentCache.delete(cB);}else if(cB){this.debugLog("Cannot restore text (no cache?).",n); if(cB.innerHTML.includes(`[${SCRIPT_PREFIX}: Text Filtered`)){cB.innerHTML=`<!-- [${SCRIPT_PREFIX}] Restore failed -->`;}}} if(n.hasAttribute('data-racf-filter-reason')){n.removeAttribute('data-racf-filter-reason');wM=true;} if(n.title?.startsWith(SCRIPT_PREFIX+':')){n.removeAttribute('title');wM=true;} if(wM){this.debugLog("Unfiltered node:",n);}}

        // --- Other Methods (Scroll, Export, Import, Menu, Toggle, Save&Apply) ---
        // (No changes needed in these)
        addScrollListener() { let sT=null; const hS=()=>{if(sT!==null){window.clearTimeout(sT);} if(performance.now()-this.lastFilterTime<DEBOUNCE_DELAY_MS/2){return;} sT=setTimeout(()=>{window.requestAnimationFrame(()=>{this.debugLog("Scroll end, filtering..."); this.applyFilters(document.body);}); sT=null;},DEBOUNCE_DELAY_MS);}; window.addEventListener('scroll',hS,{passive:true}); this.log("Scroll listener added."); }
        exportConfig() { try{const cTE={...DEFAULT_CONFIG,...this.config,rules:this.config.rules||[],filterTypes:this.config.filterTypes||[],filterAction:FILTER_ACTIONS.includes(this.config.filterAction)?this.config.filterAction:DEFAULT_CONFIG.filterAction,whitelist:{...DEFAULT_CONFIG.whitelist,...(this.config.whitelist||{})},blacklist:{...DEFAULT_CONFIG.blacklist,...(this.config.blacklist||{})},uiPosition:{...DEFAULT_CONFIG.uiPosition,...(this.config.uiPosition||{})},uiVisible:typeof this.config.uiVisible==='boolean'?this.config.uiVisible:DEFAULT_CONFIG.uiVisible,activeTab:typeof this.config.activeTab==='string'?this.config.activeTab:DEFAULT_CONFIG.activeTab,}; const cS=JSON.stringify(cTE,null,2); const blob=new Blob([cS],{type:'application/json;charset=utf-8'}); const url=URL.createObjectURL(blob); const link=document.createElement('a'); link.setAttribute('href',url); const ts=new Date().toISOString().replace(/[:.]/g,'-'); link.setAttribute('download',`reddit-filter-config-${ts}.json`); link.style.display='none'; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); this.log("Config exported.");}catch(e){this.log(`Export error: ${e.message}`);alert(`Export failed: ${e.message}`);console.error("Export Err:",e);} }
        async importConfig(event) { const fI=event.target; const f=fI?.files?.[0]; if(!f){this.log("Import cancelled");return;} if(!f.type||!f.type.match('application/json')){alert('Bad file type');if(fI)fI.value=null;return;} const r=new FileReader(); r.onload=async(e)=>{const c=e.target?.result; if(!c){alert("Empty file");return;} try{const iC=JSON.parse(c); if(typeof iC!=='object'||iC===null){throw new Error("Bad JSON format");} const nC={...DEFAULT_CONFIG,...iC,rules:Array.isArray(iC.rules)?iC.rules:[],filterTypes:Array.isArray(iC.filterTypes)?iC.filterTypes.filter(t=>['posts','comments','messages'].includes(t)):DEFAULT_CONFIG.filterTypes,filterAction:FILTER_ACTIONS.includes(iC.filterAction)?iC.filterAction:DEFAULT_CONFIG.filterAction,whitelist:{subreddits:Array.isArray(iC.whitelist?.subreddits)?iC.whitelist.subreddits.map(s=>String(s).toLowerCase()):[],users:Array.isArray(iC.whitelist?.users)?iC.whitelist.users.map(u=>String(u).toLowerCase()):[]},blacklist:{subreddits:Array.isArray(iC.blacklist?.subreddits)?iC.blacklist.subreddits.map(s=>String(s).toLowerCase()):[],users:Array.isArray(iC.blacklist?.users)?iC.blacklist.users.map(u=>String(u).toLowerCase()):[]},uiPosition:{...DEFAULT_CONFIG.uiPosition,...(typeof iC.uiPosition==='object'?iC.uiPosition:{})},uiVisible:typeof iC.uiVisible==='boolean'?iC.uiVisible:DEFAULT_CONFIG.uiVisible,activeTab:typeof iC.activeTab==='string'?iC.activeTab:DEFAULT_CONFIG.activeTab}; nC.rules=nC.rules.filter(rl=>rl&&typeof rl==='object'&&RULE_TYPES.includes(rl.type)&&typeof rl.text==='string'&&rl.text.trim()!==''&&typeof rl.isRegex==='boolean'&&typeof rl.caseSensitive==='boolean'&&typeof rl.normalize==='boolean'&&(typeof rl.target==='string'&&['title','body','both'].includes(rl.target))).map(rl=>{if(rl.type==='user'||rl.type==='subreddit'){rl.text=rl.text.toLowerCase().replace(/^(u\/|r\/)/i,'');rl.caseSensitive=false;rl.normalize=false;rl.isRegex=false;} if(rl.normalize&&rl.type==='keyword'&&!rl.isRegex){rl.caseSensitive=false;} return rl;}); this.config=nC; if(this.uiContainer&&this.config.uiPosition){const p=this.config.uiPosition;this.uiContainer.style.top=p.top||DEFAULT_CONFIG.uiPosition.top; if(p.left!==null&&p.left!==undefined){this.uiContainer.style.left=p.left;this.uiContainer.style.right='auto';}else{this.uiContainer.style.left='auto';this.uiContainer.style.right=p.right||DEFAULT_CONFIG.uiPosition.right;} if(p.width&&p.width!=='auto')this.uiContainer.style.width=p.width; if(p.height&&p.height!=='auto')this.uiContainer.style.height=p.height; this.uiContainer.style.display=this.config.uiVisible?'block':'none';} this.log(`Config imported. ${nC.rules.length} rules.`); await this.saveConfig(); this.updateUI(); this.processedNodes=new WeakSet(); this.originalContentCache=new WeakMap(); this.applyFilters(document.body); alert('Config imported!');}catch(err){alert(`Import error: ${err.message}`);this.log(`Import error: ${err.message}`);console.error("Import Err:",err);}finally{if(fI)fI.value=null;}}; r.onerror=(e)=>{alert(`File read error: ${e.target?.error||'?'}`);this.log(`File read error: ${e.target?.error}`);if(fI)fI.value=null;}; r.readAsText(f); }
        registerMenuCommands() { GM_registerMenuCommand('Toggle Filter Panel',()=>this.toggleUIVisibility()); GM_registerMenuCommand('Re-apply All Filters',()=>{this.log(`Manual re-filter.`);this.processedNodes=new WeakSet();this.originalContentCache=new WeakMap();this.applyFilters(document.body);}); GM_registerMenuCommand('Reset Filter Statistics',()=>this.resetStats()); }
        toggleUIVisibility(forceState=null) { const sBV=forceState!==null?forceState:!this.config.uiVisible; if(sBV!==this.config.uiVisible){this.config.uiVisible=sBV; if(this.uiContainer){this.uiContainer.style.display=this.config.uiVisible?'block':'none';} this.saveConfig(); if(this.config.uiVisible){this.updateUI();} const oB=document.getElementById(`${SCRIPT_PREFIX}-options-btn`); if(oB){oB.textContent=this.config.uiVisible?'Ocultar RCF':'Mostrar RCF';oB.title=this.config.uiVisible?'Ocultar Panel':'Mostrar Panel';}}}
        async saveConfigAndApplyFilters() { await this.saveConfig(); if(this.filterApplyDebounceTimer)clearTimeout(this.filterApplyDebounceTimer); this.filterApplyDebounceTimer=setTimeout(()=>{this.log(`Config change, re-filtering...`);this.processedNodes=new WeakSet();this.originalContentCache=new WeakMap();this.applyFilters(document.body);this.filterApplyDebounceTimer=null;},150); }

    } // --- End RedditFilter Class ---

    // --- Options Button ---
    function addOptionsButton() {
        // (No changes needed)
         const buttonId=`${SCRIPT_PREFIX}-options-btn`; if(document.getElementById(buttonId))return; const btn=document.createElement('button'); btn.id=buttonId; btn.style.cssText=`position:fixed;bottom:15px;right:15px;z-index:10000;padding:8px 16px;background-color:#0079D3;color:white;border:1px solid #006abd;border-radius:20px;cursor:pointer;font-weight:bold;font-size:13px;box-shadow:0 4px 8px rgba(0,0,0,0.2);transition:background-color .2s ease,box-shadow .2s ease,transform .1s ease;font-family:inherit;line-height:1.5;`; btn.onmouseover=()=>{btn.style.backgroundColor='#005fa3';btn.style.boxShadow='0 6px 12px rgba(0,0,0,0.3)';}; btn.onmouseout=()=>{btn.style.backgroundColor='#0079D3';btn.style.boxShadow='0 4px 8px rgba(0,0,0,0.2)';btn.style.transform='scale(1)';}; btn.onmousedown=()=>{btn.style.transform='scale(0.97)';}; btn.onmouseup=()=>{btn.style.transform='scale(1)';}; const instance=window.redditAdvancedFilterInstance_1_7; btn.textContent=(instance&&instance.config.uiVisible)?'Ocultar RCF':'Mostrar RCF'; btn.title=(instance&&instance.config.uiVisible)?'Ocultar Panel':'Mostrar Panel'; btn.addEventListener('click',()=>{const currentInstance=window.redditAdvancedFilterInstance_1_7; if(currentInstance){currentInstance.toggleUIVisibility();}else{console.warn(`[${SCRIPT_PREFIX}] Instance not found.`);}}); document.body.appendChild(btn);
    }

    // --- Script Init ---
    function runScript() {
        // (No changes needed)
         const instanceName='redditAdvancedFilterInstance_1_7'; if(window[instanceName]){const v=window[instanceName].constructor?.version||GM_info?.script?.version||'?'; GM_log(`[${SCRIPT_PREFIX}] Instance running (v${v}). Skipping init.`); if(!document.getElementById(`${SCRIPT_PREFIX}-options-btn`)){addOptionsButton(); const btn=document.getElementById(`${SCRIPT_PREFIX}-options-btn`); if(btn){const i=window[instanceName]; if(i){btn.textContent=i.config.uiVisible?'Ocultar RCF':'Mostrar RCF'; btn.title=i.config.uiVisible?'Ocultar Panel':'Mostrar Panel';}}} return;} window[instanceName]=new RedditFilter(); window[instanceName].init().then(()=>{addOptionsButton();}).catch(error=>{GM_log(`[${SCRIPT_PREFIX}] Init Error: ${error.message}`); console.error(`[${SCRIPT_PREFIX}] Init failed:`,error); delete window[instanceName];});
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runScript);
    } else {
        runScript();
    }

})();