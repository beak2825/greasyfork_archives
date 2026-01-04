// ==UserScript==
// @name         Reddit Advanced Content Filter v2.0 (Stable+Features+ReplaceText+UI Colors Fixed)
// @namespace    reddit-filter
// @version      2.0.7
// @description  Filters Reddit content by keywords, regex, user, subreddit with target & normalization options. Includes text replacement for comments. Enhanced UI colors with select fix.
// @author       YourName (Modified by Assistant)
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_log
// @require      https://cdn.jsdelivr.net/npm/dompurify@2.4.4/dist/purify.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531076/Reddit%20Advanced%20Content%20Filter%20v20%20%28Stable%2BFeatures%2BReplaceText%2BUI%20Colors%20Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/531076/Reddit%20Advanced%20Content%20Filter%20v20%20%28Stable%2BFeatures%2BReplaceText%2BUI%20Colors%20Fixed%29.meta.js
// ==/UserScript==

/* global DOMPurify, GM_setValue, GM_getValue, GM_registerMenuCommand, GM_log, GM_info */

(function() {
    'use strict';

    // --- Constants ---
    const SCRIPT_PREFIX = 'RACF';
    const DEBOUNCE_DELAY_MS = 250;
    const STATS_SAVE_DEBOUNCE_MS = 2000;
    const CONFIG_STORAGE_KEY = 'config_v1.7'; // Mantener si la estructura principal no cambia drásticamente
    const STATS_STORAGE_KEY = 'stats_v1';
    const RULE_TYPES = ['keyword', 'user', 'subreddit'];
    const FILTER_ACTIONS = ['hide', 'blur', 'border', 'collapse', 'replace_text'];
    const DEBUG_LOGGING = false;

    // --- Default Structures ---
    const DEFAULT_CONFIG = {
        rules: [],
        filterTypes: ['posts', 'comments'], filterAction: 'hide',
        whitelist: { subreddits: [], users: [] },
        blacklist: { subreddits: [], users: [] },
        uiVisible: true, activeTab: 'settings',
        uiPosition: { top: '100px', left: null, right: '20px' }
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
            this.log(`Initializing v${GM_info?.script?.version || '2.0.6'}...`);
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
                const sC = await GM_getValue(CONFIG_STORAGE_KEY, null);
                if (sC) {
                    const pC = JSON.parse(sC);
                    this.config = {
                        ...DEFAULT_CONFIG, ...pC,
                        whitelist: { ...DEFAULT_CONFIG.whitelist, ...(pC.whitelist || {}) },
                        blacklist: { ...DEFAULT_CONFIG.blacklist, ...(pC.blacklist || {}) },
                        uiPosition: { ...DEFAULT_CONFIG.uiPosition, ...(pC.uiPosition || {}) },
                        rules: Array.isArray(pC.rules) ? pC.rules : []
                    };
                    if (!FILTER_ACTIONS.includes(this.config.filterAction)) {
                        this.log(`Invalid filterAction '${this.config.filterAction}' found in config, defaulting to '${DEFAULT_CONFIG.filterAction}'.`);
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
                if (!this.config.uiPosition) this.config.uiPosition = JSON.parse(JSON.stringify(DEFAULT_CONFIG.uiPosition));
                if (!FILTER_ACTIONS.includes(this.config.filterAction)) this.config.filterAction = DEFAULT_CONFIG.filterAction;

                await GM_setValue(CONFIG_STORAGE_KEY, JSON.stringify(this.config));
            } catch (e) {
                this.log(`Failed to save config: ${e.message}`);
                console.error(`[${SCRIPT_PREFIX}] Failed save config:`, e);
            }
        }

        async loadStats() {
            try {
                const sS = await GM_getValue(STATS_STORAGE_KEY, null);
                if (sS) {
                    const pS = JSON.parse(sS);
                    const defaultActions = DEFAULT_STATS.filteredByAction;
                    const loadedActions = pS.filteredByAction || {};
                    const mergedActions = { ...defaultActions };

                    for (const action in loadedActions) {
                        if (FILTER_ACTIONS.includes(action)) {
                            mergedActions[action] = loadedActions[action];
                        }
                    }

                    this.stats = {
                        ...DEFAULT_STATS, ...pS,
                        filteredByType: { ...DEFAULT_STATS.filteredByType, ...(pS.filteredByType || {}) },
                        filteredByRule: { ...DEFAULT_STATS.filteredByRule, ...(pS.filteredByRule || {}) },
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
            const isOldDomain = window.location.hostname === 'old.reddit.com';
            const hasOldBodyClass = document.body.classList.contains('listing-page') || document.body.classList.contains('comments-page');

            if (isOldDomain || hasOldBodyClass) {
                this.isOldReddit = true;
                this.selectors = {
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
                this.selectors = {
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
            this.uiContainer.style.cssText = `position: fixed; z-index: 9999; top: ${this.config.uiPosition.top || '100px'}; ${this.config.uiPosition.left ? `left: ${this.config.uiPosition.left}; right: auto;` : `left: auto; right: ${this.config.uiPosition.right || '20px'};`}`;
            this.uiContainer.style.display = this.config.uiVisible ? 'block' : 'none';

            this.shadowRoot = this.uiContainer.attachShadow({ mode: 'open' });

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
                            <div>Total Processed:</div>
                            <div id="racf-stats-processed">0</div>
                            <div>Total Filtered:</div>
                            <div id="racf-stats-filtered">0</div>
                            <div>Filtering Rate:</div>
                            <div id="racf-stats-rate">0%</div>
                            <div>Total Whitelisted:</div>
                            <div id="racf-stats-whitelisted">0</div>
                            <div>Filtered Posts:</div>
                            <div id="racf-stats-type-posts">0</div>
                            <div>Filtered Comments:</div>
                            <div id="racf-stats-type-comments">0</div>
                            <div>Action - Hide:</div>
                            <div id="racf-stats-action-hide">0</div>
                            <div>Action - Blur:</div>
                            <div id="racf-stats-action-blur">0</div>
                            <div>Action - Border:</div>
                            <div id="racf-stats-action-border">0</div>
                            <div>Action - Collapse:</div>
                            <div id="racf-stats-action-collapse">0</div>
                            <div>Action - Replace Text:</div>
                            <div id="racf-stats-action-replace_text">0</div>
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

            const styles = document.createElement('style');
            // --- CSS con el ARREGLO para el contraste de <select> ---
            styles.textContent = `
                :host { font-family: sans-serif; font-size: 14px; }
                .racf-card { background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 5px; padding: 0; box-shadow: 0 2px 5px rgba(0,0,0,.2); min-width: 380px; position: relative; color: #333; }
                .racf-tabs { display: flex; border-bottom: 1px solid #ccc; cursor: move; user-select: none; }

                /* Tab Button Styles */
                .racf-tab-btn {
                    flex: 1; padding: 10px 15px; background: #e9ecef; /* Lighter gray */
                    border: none; border-right: 1px solid #dee2e6; /* Slightly darker border */
                    cursor: pointer; font-size: 14px; color: #495057; /* Darker gray text */
                    transition: background-color 0.2s, color 0.2s, border-color 0.2s;
                }
                .racf-tab-btn:last-child { border-right: none; }
                .racf-tab-btn:hover { background: #d3d9df; color: #212529; } /* Darker hover */
                .racf-tab-btn.active {
                    background: #f9f9f9; /* Match card background */
                    color: #0056b3; /* Active color (dark blue) */
                    border-bottom: 1px solid #f9f9f9; /* Hide bottom edge */
                    border-top: 3px solid #007bff; /* Highlight with blue top border */
                    margin-bottom: -1px; /* Pull content up */
                    font-weight: 700;
                }

                .racf-tab-content { display: none; padding: 15px; }
                .racf-tab-content.active { display: block; }
                .racf-card h4 { margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; color: #0056b3; } /* Title color */
                .racf-section { margin-bottom: 15px; }
                .racf-section small { font-weight: normal; font-style: italic; color: #555; font-size: 0.9em; }
                .racf-add-rule-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; align-items: flex-end; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #eee; }
                .racf-input-group { display: flex; flex-direction: column; gap: 3px; }
                .racf-input-group label { font-size: .9em; font-weight: 700; color: #495057; } /* Label color */
                .racf-checkbox-group { flex-direction: row; align-items: center; gap: 5px; margin-top: auto; }
                .racf-checkbox-group label { margin-bottom: 0; }
                .racf-checkbox-group small { margin-left: 0; }

                /* === ARREGLO AQUÍ === */
                input[type=text], select {
                    width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 3px;
                    box-sizing: border-box; font-size: 14px; background-color: #fff; /* Fondo blanco */
                    color: #212529; /* <<-- Añadido: Color de texto oscuro explícito para inputs y selects */
                }
                 input[type=text]:focus, select:focus { border-color: #80bdff; outline: 0; box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25); } /* Focus style */

                .racf-section input[type=checkbox] { margin-right: 3px; vertical-align: middle; }
                .racf-section label+label { margin-left: 10px; font-weight: 400; }

                /* General Button Style (fallback/less important buttons) */
                button {
                    padding: 8px 12px; border: 1px solid #adb5bd; /* Gray border */
                    background-color: #f8f9fa; /* Very light gray */
                    color: #212529; /* Dark text */
                    border-radius: 3px; cursor: pointer; font-size: 14px;
                    transition: background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out, color 0.15s ease-in-out;
                }
                button:hover {
                    background-color: #e9ecef; /* Slightly darker gray */
                    border-color: #a1a8af;
                    color: #212529;
                }
                button:active {
                    background-color: #dee2e6;
                    border-color: #939ba1;
                }

                /* Primary Action Button (Add Rule) */
                #racf-add-rule-btn {
                    padding: 8px 15px; margin-top: 15px; grid-column: 1 / -1;
                    background-color: #007bff; /* Blue */
                    color: #fff; /* White text */
                    border-color: #007bff;
                    font-weight: bold;
                }
                #racf-add-rule-btn:hover { background-color: #0056b3; border-color: #0056b3; }

                 /* Secondary Action Buttons (Import/Export) */
                 #racf-import-btn, #racf-export-btn {
                    background-color: #28a745; /* Green */
                    color: #fff; /* White text */
                    border-color: #28a745;
                 }
                 #racf-import-btn:hover, #racf-export-btn:hover { background-color: #218838; border-color: #1e7e34; }

                 /* Neutral Action Button (Clear Cache) */
                 #racf-clear-processed-btn {
                     background-color: #6c757d; /* Gray */
                     color: #fff; /* White text */
                     border-color: #6c757d;
                 }
                 #racf-clear-processed-btn:hover { background-color: #5a6268; border-color: #545b62; }

                 /* Danger Action Buttons (Remove Rule, Reset Stats) */
                 #racf-reset-stats-btn {
                    background-color: #dc3545; /* Red */
                    color: #fff; /* White text */
                    border-color: #dc3545;
                 }
                 #racf-reset-stats-btn:hover { background-color: #c82333; border-color: #bd2130; }

                /* Remove Rule Button (Specific styling + Danger color) */
                #racf-rule-list button.racf-remove-btn {
                    background: #dc3545; /* Red */
                    border: 1px solid #dc3545;
                    color: #fff; /* White text */
                    padding: 3px 7px; /* Keep smaller padding */
                    font-size: 11px; /* Keep smaller font */
                    margin-left: 5px; flex-shrink: 0; line-height: 1;
                }
                 #racf-rule-list button.racf-remove-btn:hover { background-color: #c82333; border-color: #bd2130; }


                #racf-rule-list, #racf-stats-rule-list { list-style: none; padding: 0; max-height: 180px; overflow-y: auto; border: 1px solid #eee; margin-top: 5px; background: #fff; }
                #racf-rule-list li, #racf-stats-rule-list li { padding: 6px 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
                #racf-rule-list li:last-child, #racf-stats-rule-list li:last-child { border-bottom: none; }
                #racf-rule-list .racf-rule-details { flex-grow: 1; margin-right: 10px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
                #racf-rule-list .racf-rule-type-badge { font-size: .8em; padding: 1px 4px; border-radius: 3px; background-color: #6c757d; color: #fff; flex-shrink: 0; text-transform: uppercase; } /* Badge color */
                #racf-rule-list .racf-rule-text { word-break: break-all; font-family: monospace; background: #e9ecef; padding: 1px 3px; border-radius: 2px; color: #212529;} /* Rule text bg/color */
                #racf-stats-rule-list .racf-rule-text { flex-grow: 1; margin-right: 10px; word-break: break-all; font-family: monospace; background: #e9ecef; padding: 1px 3px; border-radius: 2px; color: #212529;}
                #racf-stats-rule-list .racf-rule-count { font-weight: 700; margin-left: 10px; flex-shrink: 0; background-color: #007bff; color: #fff; padding: 2px 5px; border-radius: 10px; font-size: 0.9em;} /* Count badge */

                .racf-buttons { margin-top: 15px; border-top: 1px solid #eee; padding-top: 10px; display: flex; gap: 10px; flex-wrap: wrap; }
                .racf-buttons button { flex-grow: 1; margin: 0; }

                /* Close Button Style */
                .racf-close-btn {
                    position: absolute; top: 5px; right: 10px; background: 0 0; border: none;
                    font-size: 24px; /* Slightly larger */
                    font-weight: 700; color: #6c757d; /* Darker gray */
                    cursor: pointer; z-index: 10; margin: 0 !important; padding: 0 5px; line-height: 1;
                }
                .racf-close-btn:hover { color: #343a40; /* Even darker */ }

                .racf-stats-grid { display: grid; grid-template-columns: auto 1fr; gap: 5px 10px; margin-bottom: 15px; font-size: 13px; }
                .racf-stats-grid div:nth-child(odd) { font-weight: 700; text-align: right; color: #495057; } /* Stats label color */
                .racf-stats-grid div:nth-child(even) { font-family: monospace; color: #0056b3; } /* Stats value color */
            `;

            this.shadowRoot.appendChild(styles);
            this.shadowRoot.appendChild(uiContent);
            this.injectGlobalStyles();
            document.body.insertAdjacentElement('beforeend', this.uiContainer);
            this.addUIEventListeners();
            this.log(`UI injected with select contrast fix.`);
        }

        injectGlobalStyles() {
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
            `;
        }


        addUIEventListeners() {
            const q = (s) => this.shadowRoot.querySelector(s);
            const qa = (s) => this.shadowRoot.querySelectorAll(s);

            q('#racf-drag-handle')?.addEventListener('mousedown', this.dragMouseDown.bind(this));

            qa('.racf-tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const tabId = e.target.dataset.tab;
                    if (!tabId) return;

                    qa('.racf-tab-btn').forEach(b => b.classList.remove('active'));
                    qa('.racf-tab-content').forEach(c => c.classList.remove('active'));

                    e.target.classList.add('active');
                    q(`#racf-${tabId}-content`)?.classList.add('active');

                    this.config.activeTab = tabId;
                    if (tabId === 'stats') {
                         this.updateUI();
                    }
                });
            });

            q('#racf-add-rule-btn').addEventListener('click', () => this.handleAddRule());
            q('#racf-rule-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') this.handleAddRule(); });

            q('#racf-rule-list').addEventListener('click', (e) => {
                const removeButton = e.target.closest('button.racf-remove-btn');
                if (removeButton) {
                    const ruleIndex = parseInt(removeButton.dataset.ruleIndex, 10);
                    if (!isNaN(ruleIndex)) {
                        this.removeRuleByIndex(ruleIndex);
                    } else {
                        const ruleType = removeButton.dataset.ruleType;
                        const ruleText = removeButton.dataset.ruleText;
                        const indexToRemove = (this.config.rules || []).findIndex(r => r.type === ruleType && r.text === ruleText);
                        if (indexToRemove > -1) {
                            this.removeRuleByIndex(indexToRemove);
                        } else {
                             this.log(`Could not find rule to remove: ${ruleType} - ${ruleText}`);
                        }
                    }
                }
            });

            qa('.racf-filter-type').forEach(cb => {
                cb.addEventListener('change', (e) => this.handleFilterTypeChange(e));
            });

            q('#racf-filter-action').addEventListener('change', (e) => {
                const newAction = e.target.value;
                if (FILTER_ACTIONS.includes(newAction)) {
                    this.config.filterAction = newAction;
                    this.saveConfigAndApplyFilters();
                } else {
                     this.log(`Invalid filter action selected: ${newAction}`);
                     e.target.value = this.config.filterAction;
                }
            });

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
            q('#racf-close-btn').addEventListener('click', () => this.toggleUIVisibility(false));
        }

        // --- Funciones de Dragging (sin cambios) ---
        dragMouseDown(e) {
            if(e.button !== 0 || e.target.closest('button')) return;
            e.preventDefault();
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartY = e.clientY;
            const r = this.uiContainer.getBoundingClientRect();
            this.dragInitialLeft = r.left;
            this.dragInitialTop = r.top;
            this.elementDragBound = this.elementDrag.bind(this);
            this.closeDragElementBound = this.closeDragElement.bind(this);
            document.addEventListener('mousemove', this.elementDragBound);
            document.addEventListener('mouseup', this.closeDragElementBound);
        }

        elementDrag(e) {
            if (!this.isDragging) return;
            e.preventDefault();
            const dX = e.clientX - this.dragStartX;
            const dY = e.clientY - this.dragStartY;
            let nT = this.dragInitialTop + dY;
            let nL = this.dragInitialLeft + dX;
            nT = Math.max(0, Math.min(nT, window.innerHeight - this.uiContainer.offsetHeight));
            nL = Math.max(0, Math.min(nL, window.innerWidth - this.uiContainer.offsetWidth));
            this.uiContainer.style.top = `${nT}px`;
            this.uiContainer.style.left = `${nL}px`;
            this.uiContainer.style.right = 'auto';
        }

        closeDragElement() {
            if (!this.isDragging) return;
            this.isDragging = false;
            document.removeEventListener('mousemove', this.elementDragBound);
            document.removeEventListener('mouseup', this.closeDragElementBound);
            this.config.uiPosition.top = this.uiContainer.style.top;
            this.config.uiPosition.left = this.uiContainer.style.left;
            this.config.uiPosition.right = null;
            this.saveConfig();
        }
        // --- Fin Funciones de Dragging ---

        updateUI() {
            if (!this.shadowRoot) return;

            const q = (s) => this.shadowRoot.querySelector(s);
            const qa = (s) => this.shadowRoot.querySelectorAll(s);

            const ruleListEl = q('#racf-rule-list');
            if (ruleListEl) {
                ruleListEl.innerHTML = '';
                (this.config.rules || []).forEach((rule, index) => {
                    const li = document.createElement('li');
                    const safeText = this.domPurify.sanitize(rule.text || '', { USE_PROFILES: { html: false } });
                    const typeTitle = `Type: ${rule.type}`;
                    const regexTitle = rule.isRegex ? ' (Regular Expression)' : '';
                    const caseTitle = (rule.type === 'keyword' && !rule.isRegex) ? (rule.caseSensitive ? ' (Case Sensitive)' : ' (Case Insensitive)') : '';
                    const targetTitle = `Applies to: ${rule.target || 'both'}`;
                    const normTitle = rule.normalize ? ' (Normalized: Ignores accents/case)' : '';

                    li.innerHTML = `
                        <div class="racf-rule-details">
                            <span class="racf-rule-type-badge" title="${typeTitle}">${rule.type}</span>
                            <span class="racf-rule-text">${safeText}</span>
                            ${rule.isRegex ? `<small title="Regular Expression${caseTitle}">(R${rule.caseSensitive ? '' : 'i'})</small>` : ''}
                            ${rule.type === 'keyword' && !rule.isRegex && !rule.caseSensitive && !rule.normalize ? '<small title="Case Insensitive">(i)</small>' : ''}
                            <small title="${targetTitle}">[${rule.target || 'both'}]</small>
                            ${rule.normalize ? `<small title="${normTitle}">(Norm)</small>` : ''}
                        </div>
                        <button class="racf-remove-btn" data-rule-index="${index}" title="Remove Rule">X</button>
                    `;
                    ruleListEl.appendChild(li);
                });
                q('#racf-rule-count').textContent = (this.config.rules || []).length;
            }

            qa('.racf-filter-type').forEach(cb => {
                cb.checked = (this.config.filterTypes || []).includes(cb.value);
            });

            const actionSelect = q('#racf-filter-action');
            if (actionSelect) {
                if (actionSelect.options.length === 0) {
                    FILTER_ACTIONS.forEach(action => {
                        const option = document.createElement('option');
                        option.value = action;
                        switch(action) {
                            case 'hide': option.textContent = 'Hide Completely'; break;
                            case 'blur': option.textContent = 'Blur (Hover to Reveal)'; break;
                            case 'border': option.textContent = 'Red Border'; break;
                            case 'collapse': option.textContent = 'Collapse (Comments Only)'; break;
                            case 'replace_text': option.textContent = 'Replace Text (Comments Only)'; break;
                            default: option.textContent = action.charAt(0).toUpperCase() + action.slice(1);
                        }
                        actionSelect.appendChild(option);
                    });
                }
                actionSelect.value = this.config.filterAction;
            }

             q('#racf-stats-processed').textContent = this.stats.totalProcessed;
             q('#racf-stats-filtered').textContent = this.stats.totalFiltered;
             const rate = this.stats.totalProcessed > 0 ? ((this.stats.totalFiltered / this.stats.totalProcessed) * 100).toFixed(1) : 0;
             q('#racf-stats-rate').textContent = `${rate}%`;
             q('#racf-stats-whitelisted').textContent = this.stats.totalWhitelisted;
             q('#racf-stats-type-posts').textContent = this.stats.filteredByType?.posts || 0;
             q('#racf-stats-type-comments').textContent = this.stats.filteredByType?.comments || 0;
             q('#racf-stats-action-hide').textContent = this.stats.filteredByAction?.hide || 0;
             q('#racf-stats-action-blur').textContent = this.stats.filteredByAction?.blur || 0;
             q('#racf-stats-action-border').textContent = this.stats.filteredByAction?.border || 0;
             q('#racf-stats-action-collapse').textContent = this.stats.filteredByAction?.collapse || 0;
             q('#racf-stats-action-replace_text').textContent = this.stats.filteredByAction?.replace_text || 0;

            if (this.config.activeTab === 'stats') {
                const statsRuleListEl = q('#racf-stats-rule-list');
                if (statsRuleListEl) {
                    statsRuleListEl.innerHTML = '';
                    const sortedRules = Object.entries(this.stats.filteredByRule || {})
                                            .filter(([, count]) => count > 0)
                                            .sort(([, a], [, b]) => b - a);

                    if (sortedRules.length === 0) {
                        statsRuleListEl.innerHTML = '<li>No rules have triggered yet.</li>';
                    } else {
                        sortedRules.slice(0, 20).forEach(([ruleText, count]) => {
                            const li = document.createElement('li');
                            const safeRuleText = this.domPurify.sanitize(ruleText, { USE_PROFILES: { html: false } });
                            li.innerHTML = `<span class="racf-rule-text">${safeRuleText}</span><span class="racf-rule-count" title="Times triggered">${count}</span>`;
                            statsRuleListEl.appendChild(li);
                        });
                    }
                }
            }

            if (this.uiContainer) {
                this.uiContainer.style.display = this.config.uiVisible ? 'block' : 'none';
                const activeTabId = this.config.activeTab || 'settings';
                qa('.racf-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === activeTabId));
                qa('.racf-tab-content').forEach(c => c.classList.toggle('active', c.id === `racf-${activeTabId}-content`));
            }
        }


        normalizeText(text) {
            if (typeof text !== 'string') return '';
            try {
                return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            } catch (e) {
                this.log(`Error normalizing text: ${e.message}. Falling back to simple toLowerCase.`);
                return text.toLowerCase();
            }
        }

        handleAddRule() {
            const inputElem = this.shadowRoot.querySelector('#racf-rule-input');
            const typeElem = this.shadowRoot.querySelector('#racf-rule-type');
            const targetElem = this.shadowRoot.querySelector('#racf-rule-target');
            const normalizeElem = this.shadowRoot.querySelector('#racf-rule-normalize');

            if (!inputElem || !typeElem || !targetElem || !normalizeElem) {
                this.log("Error: UI elements for rule creation not found.");
                alert("Error: UI elements missing. Cannot add rule.");
                return;
            }

            const ruleInputText = inputElem.value.trim();
            const ruleType = typeElem.value;
            const ruleTarget = targetElem.value;
            const ruleNormalize = normalizeElem.checked;

            if (!ruleInputText) {
                alert("Rule text cannot be empty.");
                inputElem.focus();
                return;
            }
            if (!RULE_TYPES.includes(ruleType)) {
                 alert("Invalid rule type selected.");
                 return;
            }

            let text = ruleInputText;
            let isRegex = false;
            let caseSensitive = true;

            if (ruleType === 'keyword') {
                if (text.startsWith('/') && text.length > 2) {
                    const lastSlashIndex = text.lastIndexOf('/');
                    if (lastSlashIndex > 0) {
                        const pattern = text.substring(1, lastSlashIndex);
                        const flags = text.substring(lastSlashIndex + 1);
                        try {
                            new RegExp(pattern, flags);
                            isRegex = true;
                            caseSensitive = !flags.includes('i');
                            text = text;
                        } catch (e) {
                            alert(`Invalid Regular Expression: ${e.message}\nPattern: ${text}`);
                            return;
                        }
                    } else {
                         isRegex = false;
                         caseSensitive = false;
                    }
                } else {
                    isRegex = false;
                    caseSensitive = false;
                }
            } else if (ruleType === 'user' || ruleType === 'subreddit') {
                text = text.replace(/^(u\/|r\/)/i, '');
                isRegex = false;
                caseSensitive = false;
                text = text.toLowerCase();
            }

             if (ruleNormalize && ruleType === 'keyword' && !isRegex) {
                 caseSensitive = false;
             }


            const newRule = {
                type: ruleType,
                text: text,
                isRegex: isRegex,
                caseSensitive: caseSensitive,
                target: ruleTarget,
                normalize: (ruleType === 'keyword' && !isRegex && ruleNormalize)
            };

            if (!this.config.rules) this.config.rules = [];
            const ruleExists = this.config.rules.some(r =>
                r.type === newRule.type && r.text === newRule.text &&
                r.isRegex === newRule.isRegex && r.caseSensitive === newRule.caseSensitive &&
                r.target === newRule.target && r.normalize === newRule.normalize
            );

            if (ruleExists) {
                alert("An identical rule already exists.");
                inputElem.value = '';
                return;
            }

            this.config.rules.push(newRule);
            this.log(`Rule added: ${JSON.stringify(newRule)}`);
            inputElem.value = '';
            normalizeElem.checked = false;
            targetElem.value = 'both';
            typeElem.value = 'keyword';
            inputElem.focus();

            this.saveConfigAndApplyFilters();
            this.updateUI();
        }

        removeRuleByIndex(index) {
            if (!this.config.rules || index < 0 || index >= this.config.rules.length) {
                this.log(`Invalid index for rule removal: ${index}`);
                return;
            }
            const removed = this.config.rules.splice(index, 1);
            this.log(`Rule removed: ${JSON.stringify(removed[0])}`);
            this.saveConfigAndApplyFilters();
            this.updateUI();
        }


        handleFilterTypeChange(event) {
            const { value, checked } = event.target;
            if (!this.config.filterTypes) this.config.filterTypes = [];

            const index = this.config.filterTypes.indexOf(value);

            if (checked && index === -1) {
                this.config.filterTypes.push(value);
            } else if (!checked && index > -1) {
                this.config.filterTypes.splice(index, 1);
            }
            this.saveConfigAndApplyFilters();
        }


        initializeObserver() {
            if (!window.MutationObserver) {
                this.log("MutationObserver not supported, filtering might be incomplete on dynamic content.");
                return;
            }
            if (this.observer) {
                 this.observer.disconnect();
            }

            this.observer = new MutationObserver(this.mutationCallback.bind(this));
            this.observer.observe(document.body, { childList: true, subtree: true });
            this.log("MutationObserver initialized.");
        }

        mutationCallback(mutationsList) {
            const nodesToCheck = new Set();
            let hasRelevantChanges = false;

            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.id === `${SCRIPT_PREFIX}-ui-container` || node.closest(`#${SCRIPT_PREFIX}-ui-container`)) {
                                return;
                            }
                            if (node.matches && (node.matches(this.selectors.post) || node.matches(this.selectors.comment))) {
                                nodesToCheck.add(node);
                                hasRelevantChanges = true;
                            }
                            if (node.querySelectorAll) {
                                try {
                                    node.querySelectorAll(`${this.selectors.post}, ${this.selectors.comment}`).forEach(el => {
                                        nodesToCheck.add(el);
                                        hasRelevantChanges = true;
                                    });
                                } catch (e) {
                                     this.debugLog(`Error querying inside added node: ${e.message}`, node);
                                 }
                            }
                        }
                    });
                }
            }

            if (hasRelevantChanges && nodesToCheck.size > 0) {
                this.debugLog(`MutationObserver detected ${nodesToCheck.size} new potential nodes.`);
                this.applyFilters(Array.from(nodesToCheck));
            }
        }


        applyFilters(nodesOrRoot) {
            let itemsToProcess = [];
            const startTime = performance.now();

            const elementSet = new Set();
            const collectElements = (root) => {
                if (!root || root.nodeType !== Node.ELEMENT_NODE) return;
                try {
                    if (root.matches && (root.matches(this.selectors.post) || root.matches(this.selectors.comment))) {
                        if (!this.processedNodes.has(root)) {
                             elementSet.add(root);
                        }
                    }
                    root.querySelectorAll(`${this.selectors.post}, ${this.selectors.comment}`).forEach(el => {
                         if (!this.processedNodes.has(el)) {
                            elementSet.add(el);
                         }
                    });
                } catch(e) {
                    this.log(`Error collecting nodes: ${e.message}`);
                    console.error("Collection Error Node:", root, e);
                }
            };

            if (Array.isArray(nodesOrRoot)) {
                nodesOrRoot.forEach(n => collectElements(n));
            } else if (nodesOrRoot?.nodeType === Node.ELEMENT_NODE) {
                collectElements(nodesOrRoot);
            } else {
                this.debugLog("applyFilters called with invalid input:", nodesOrRoot);
                return;
            }

            itemsToProcess = Array.from(elementSet);
            if (itemsToProcess.length === 0) {
                return;
            }

            this.debugLog(`Applying filters to ${itemsToProcess.length} new nodes...`);

            let statsChanged = false;
            let processedCount = 0;
            let filteredCount = 0;
            let whitelistedCount = 0;

            itemsToProcess.forEach(node => {
                this.processedNodes.add(node);
                processedCount++;
                statsChanged = true;

                try {
                    const filterResult = this.shouldFilterNode(node);

                    if (filterResult.whitelisted) {
                        whitelistedCount++;
                        this.unfilterNode(node);
                         this.debugLog(`Node whitelisted: ${filterResult.reason}`, node);
                    } else if (filterResult.filter) {
                        filteredCount++;
                        const nodeType = filterResult.nodeType;
                        const effectiveAction = this.getEffectiveAction(this.config.filterAction, nodeType);

                        if (nodeType && this.stats.filteredByType) {
                            this.stats.filteredByType[nodeType] = (this.stats.filteredByType[nodeType] || 0) + 1;
                        }
                        if (effectiveAction && this.stats.filteredByAction) {
                             this.stats.filteredByAction[effectiveAction] = (this.stats.filteredByAction[effectiveAction] || 0) + 1;
                        }
                        const ruleStatText = filterResult.ruleText || `type:${filterResult.reason}`;
                        if (ruleStatText && this.stats.filteredByRule) {
                            this.stats.filteredByRule[ruleStatText] = (this.stats.filteredByRule[ruleStatText] || 0) + 1;
                        }

                        this.filterNode(node, filterResult.reason, nodeType, effectiveAction);
                        this.debugLog(`Node filtered (${effectiveAction}): ${filterResult.reason}`, node);

                    } else {
                        this.unfilterNode(node);
                        this.debugLog(`Node not filtered: ${filterResult.reason}`, node);
                    }
                } catch (error) {
                    this.log(`Error filtering node: ${error.message}`);
                    console.error(`[${SCRIPT_PREFIX}] Filter error details:`, error, node);
                    try { this.unfilterNode(node); } catch {}
                }
            });

            if (statsChanged) {
                this.stats.totalProcessed += processedCount;
                this.stats.totalFiltered += filteredCount;
                this.stats.totalWhitelisted += whitelistedCount;

                this.debouncedSaveStats();

                 if (this.uiUpdateDebounceTimer) clearTimeout(this.uiUpdateDebounceTimer);
                 this.uiUpdateDebounceTimer = setTimeout(() => {
                     this.updateUI();
                     this.uiUpdateDebounceTimer = null;
                 }, 300);
            }

            this.lastFilterTime = performance.now();
            const duration = this.lastFilterTime - startTime;
            if (itemsToProcess.length > 0) {
                this.debugLog(`Filtering ${itemsToProcess.length} nodes took ${duration.toFixed(2)} ms.`);
            }
        }

        getEffectiveAction(configuredAction, nodeType) {
            if (nodeType !== 'comments') {
                if (configuredAction === 'collapse' || configuredAction === 'replace_text') {
                    return 'hide';
                }
            }
            return configuredAction;
        }


        shouldFilterNode(node) {
            let nodeType = null;
            if (node.matches(this.selectors.post)) nodeType = 'posts';
            else if (node.matches(this.selectors.comment)) nodeType = 'comments';
            else return { filter: false, reason: "Not a target post/comment element", nodeType: null };

            let result = { filter: false, reason: "No match", whitelisted: false, ruleText: null, nodeType: nodeType };

            if (!(this.config.filterTypes || []).includes(nodeType)) {
                result.reason = `Filtering disabled for type '${nodeType}'`;
                return result;
            }

            const subreddit = this.extractSubreddit(node, nodeType)?.toLowerCase();
            const author = this.extractAuthor(node, nodeType)?.toLowerCase();

            if (subreddit && (this.config.blacklist?.subreddits || []).includes(subreddit)) {
                return { ...result, filter: true, reason: `Globally Blacklisted Subreddit: r/${subreddit}`, ruleText: `bl-sub:${subreddit}` };
            }
            if (author && (this.config.blacklist?.users || []).includes(author)) {
                 return { ...result, filter: true, reason: `Globally Blacklisted User: u/${author}`, ruleText: `bl-user:${author}` };
            }
            if (subreddit && (this.config.whitelist?.subreddits || []).includes(subreddit)) {
                 return { ...result, whitelisted: true, reason: `Globally Whitelisted Subreddit: r/${subreddit}` };
            }
            if (author && (this.config.whitelist?.users || []).includes(author)) {
                return { ...result, whitelisted: true, reason: `Globally Whitelisted User: u/${author}` };
            }

            let contentCache = { title: null, body: null, checked: false };

            for (const rule of (this.config.rules || [])) {
                let match = false;
                const ruleStatText = `[${rule.type}${rule.isRegex?'(R)':''}${rule.normalize?'(N)':''}${rule.target?`-${rule.target}`:''}] ${rule.text}`;
                let reasonSuffix = "";

                try {
                    switch (rule.type) {
                        case 'keyword':
                            const target = rule.target || 'both';

                            if (!contentCache.checked) {
                                const extracted = this.extractContent(node, nodeType);
                                contentCache.title = extracted.title;
                                contentCache.body = extracted.body;
                                contentCache.checked = true;
                                this.debugLog(`Extracted content for node: Title: ${!!contentCache.title}, Body: ${!!contentCache.body}`, node);
                            }

                            let contentToTest = [];
                            let testedAreas = [];
                            if ((target === 'title' || target === 'both') && contentCache.title) {
                                contentToTest.push(contentCache.title);
                                testedAreas.push('title');
                            }
                            if ((target === 'body' || target === 'both') && contentCache.body) {
                                contentToTest.push(contentCache.body);
                                testedAreas.push('body');
                            }

                            if (contentToTest.length === 0) {
                                 this.debugLog(`Skipping rule ${ruleStatText}: no content found for target '${target}'`, node);
                                continue;
                            }
                            reasonSuffix = ` in ${testedAreas.join('&')}`;

                            let pattern = rule.text;
                            let testFunc;

                            if (rule.isRegex) {
                                const regexMatch = pattern.match(/^\/(.+)\/([gimyus]*)$/);
                                if (regexMatch) {
                                    try {
                                        const regex = new RegExp(regexMatch[1], regexMatch[2]);
                                        testFunc = (text) => regex.test(text);
                                        reasonSuffix += ` (Regex${regex.flags.includes('i') ? ', Insensitive' : ''})`;
                                    } catch (reError) {
                                        this.log(`Rule error (invalid regex) ${ruleStatText}: ${reError.message}`);
                                        continue;
                                    }
                                } else {
                                     this.log(`Rule error (malformed regex literal) ${ruleStatText}`);
                                     continue;
                                }
                            } else {
                                const useNormalization = rule.normalize;
                                const isCaseSensitive = rule.caseSensitive;

                                const comparePattern = useNormalization
                                                     ? this.normalizeText(pattern)
                                                     : (isCaseSensitive ? pattern : pattern.toLowerCase());

                                testFunc = (text) => {
                                    if (!text) return false;
                                    const compareContent = useNormalization
                                                         ? this.normalizeText(text)
                                                         : (isCaseSensitive ? text : text.toLowerCase());
                                    return compareContent.includes(comparePattern);
                                };
                                reasonSuffix += `${useNormalization ? ' (Normalized)' : (isCaseSensitive ? ' (Case Sensitive)' : ' (Case Insensitive)')}`;
                            }
                            match = contentToTest.some(text => testFunc(text));
                            break;

                        case 'user':
                            if (!author) continue;
                            match = author === rule.text;
                            reasonSuffix = ` (author: u/${author})`;
                            break;

                        case 'subreddit':
                            if (!subreddit || nodeType !== 'posts') continue;
                            match = subreddit === rule.text;
                            reasonSuffix = ` (subreddit: r/${subreddit})`;
                            break;
                    } // End switch

                    if (match) {
                        const safeRuleDisplay = this.domPurify.sanitize(rule.text, { USE_PROFILES: { html: false } });
                        return { ...result, filter: true, reason: `Rule Match: [${rule.type}] '${safeRuleDisplay}'${reasonSuffix}`, ruleText: ruleStatText };
                    }

                } catch (e) {
                    this.log(`Rule processing error for ${ruleStatText}: ${e.message}`);
                    console.error(`[${SCRIPT_PREFIX}] Rule processing error details:`, e, rule, node);
                }
            } // End for loop

            result.reason = "No matching rules or blacklists";
            return result;
        }

        extractContent(node, nodeType) {
            const result = { title: null, body: null };
            try {
                if (nodeType === 'posts' && this.selectors.postTitleSelector) {
                    const titleElement = node.querySelector(this.selectors.postTitleSelector);
                    if (titleElement) {
                        result.title = titleElement.textContent?.trim() || null;
                        if (result.title) result.title = result.title.replace(/\s+/g, ' ');
                    }
                }

                let bodySelector = null;
                if (nodeType === 'posts' && this.selectors.postBodySelector) {
                    bodySelector = this.selectors.postBodySelector;
                } else if (nodeType === 'comments' && this.selectors.commentBodySelector) {
                    bodySelector = this.selectors.commentBodySelector;
                }

                if (bodySelector) {
                    const bodyElement = node.querySelector(bodySelector);
                    if (bodyElement) {
                         result.body = bodyElement.textContent?.trim() || null;
                         if (result.body) result.body = result.body.replace(/\s+/g, ' ');
                    } else if (this.isOldReddit && nodeType === 'posts') {
                        const oldPostBody = node.querySelector('.expando .usertext-body .md');
                        if (oldPostBody) {
                             result.body = oldPostBody.textContent?.trim() || null;
                             if (result.body) result.body = result.body.replace(/\s+/g, ' ');
                        }
                    }
                }

            } catch (e) {
                this.log(`Error extracting content (type: ${nodeType}): ${e.message}`);
                console.error("Extraction Error Node:", node, e);
            }
            return result;
        }


        extractSubreddit(node, nodeType) {
            if (nodeType !== 'posts' || !this.selectors.postSubredditSelector) return null;
            try {
                const subElement = node.querySelector(this.selectors.postSubredditSelector);
                if (subElement) {
                    return subElement.textContent?.trim().replace(/^r\//i, '') || null;
                }
                 if (!this.isOldReddit) {
                     const linkSub = node.querySelector('a[data-testid="subreddit-name"]');
                     if (linkSub) return linkSub.textContent?.trim().replace(/^r\//i, '') || null;
                 }
                return null;
            } catch (e) {
                 this.log(`Error extracting subreddit: ${e.message}`);
                 return null;
            }
        }

        extractAuthor(node, nodeType) {
            const selector = nodeType === 'posts' ? this.selectors.postAuthorSelector : this.selectors.commentAuthorSelector;
            if (!selector) return null;
            try {
                const authorElement = node.querySelector(selector);
                if (authorElement) {
                    const authorText = authorElement.textContent?.trim();
                    if (!authorText || ['[deleted]', '[removed]', ''].includes(authorText.toLowerCase())) {
                        return null;
                    }
                    return authorText.replace(/^u\//i, '') || null;
                }
                 if (!this.isOldReddit) {
                     const linkAuthor = node.querySelector('a[data-testid="post-author-link"], a[data-testid="comment-author-link"]');
                     if (linkAuthor) {
                         const authorText = linkAuthor.textContent?.trim();
                         if (authorText && !['[deleted]', '[removed]', ''].includes(authorText.toLowerCase())) {
                             return authorText.replace(/^u\//i, '') || null;
                         }
                     }
                 }
                return null;
            } catch (e) {
                 this.log(`Error extracting author (type ${nodeType}): ${e.message}`);
                 return null;
            }
        }

        filterNode(node, reason, nodeType, action) {
            this.unfilterNode(node);
            const effectiveAction = this.getEffectiveAction(action, nodeType);
            const shortReason = reason.substring(0, 200) + (reason.length > 200 ? '...' : '');
            const filterAttrValue = `${SCRIPT_PREFIX}: Filtered [${effectiveAction}] (${shortReason})`;

            if (effectiveAction === 'replace_text' && nodeType === 'comments') {
                 this.replaceCommentText(node, shortReason);
                 node.setAttribute('data-racf-filter-reason', filterAttrValue);
                 node.title = filterAttrValue;
            } else if (FILTER_ACTIONS.includes(effectiveAction) && effectiveAction !== 'replace_text') {
                 const actionClass = `${SCRIPT_PREFIX}-${effectiveAction}`;
                 node.classList.add(actionClass);
                 node.setAttribute('data-racf-filter-reason', filterAttrValue);
                 node.title = filterAttrValue;
                 this.debugLog(`Applied class '${actionClass}' to node:`, node);
            } else {
                 this.log(`Invalid or non-applicable action '${action}' for type '${nodeType}'. Defaulting to hide.`);
                 node.classList.add(`${SCRIPT_PREFIX}-hide`);
                 const fallbackAttrValue = `${SCRIPT_PREFIX}: Filtered [hide - fallback] (${shortReason})`;
                 node.setAttribute('data-racf-filter-reason', fallbackAttrValue);
                 node.title = fallbackAttrValue;
            }
        }

        replaceCommentText(commentNode, reason) {
            const bodySelector = this.selectors.commentBodySelector;
            if (!bodySelector) {
                this.log("Error: commentBodySelector not defined. Cannot replace text.");
                return;
            }

            const commentBody = commentNode.querySelector(bodySelector);
            if (!commentBody) {
                this.debugLog("Comment body element not found using selector:", bodySelector, "on node:", commentNode);
                return;
            }

            if (!this.originalContentCache.has(commentBody)) {
                 const currentHTML = commentBody.innerHTML;
                 if (!currentHTML.includes(`[${SCRIPT_PREFIX}: Text Filtered`)) {
                    this.originalContentCache.set(commentBody, currentHTML);
                    this.debugLog("Stored original content for:", commentBody);
                 } else {
                     this.debugLog("Attempted to store placeholder, skipping cache.", commentBody);
                 }
            }

            const placeholderHTML = `<p style="color: grey; font-style: italic; margin: 0; padding: 5px 0;">[${SCRIPT_PREFIX}: Text Filtered (${reason})]</p>`;

            if (commentBody.innerHTML !== placeholderHTML) {
                 commentBody.innerHTML = placeholderHTML;
                 commentNode.classList.add(`${SCRIPT_PREFIX}-text-replaced`);
                 this.debugLog("Replaced text content for node:", commentNode);
            } else {
                 this.debugLog("Text content already replaced, skipping.", commentNode);
            }
        }


        unfilterNode(node) {
            let wasModified = false;

            FILTER_ACTIONS.forEach(action => {
                 if (action !== 'replace_text') {
                    const className = `${SCRIPT_PREFIX}-${action}`;
                    if (node.classList.contains(className)) {
                        node.classList.remove(className);
                        wasModified = true;
                    }
                 }
            });

            const textReplacedMarker = `${SCRIPT_PREFIX}-text-replaced`;
            if (node.classList.contains(textReplacedMarker)) {
                node.classList.remove(textReplacedMarker);
                wasModified = true;

                const bodySelector = this.selectors.commentBodySelector;
                const commentBody = bodySelector ? node.querySelector(bodySelector) : null;

                if (commentBody && this.originalContentCache.has(commentBody)) {
                    const originalHTML = this.originalContentCache.get(commentBody);
                    if (commentBody.innerHTML.includes(`[${SCRIPT_PREFIX}: Text Filtered`)) {
                        commentBody.innerHTML = originalHTML;
                        this.debugLog("Restored original text content for node:", node);
                    } else {
                        this.debugLog("Skipped text restore, content wasn't placeholder.", commentBody);
                    }
                     this.originalContentCache.delete(commentBody);
                } else if (commentBody) {
                    this.debugLog("Could not restore original text (not in cache?), node:", node);
                     if (commentBody.innerHTML.includes(`[${SCRIPT_PREFIX}: Text Filtered`)) {
                        commentBody.innerHTML = '<!-- [RACF] Content restoration failed -->';
                     }
                }
            }

             if (node.hasAttribute('data-racf-filter-reason')) {
                 node.removeAttribute('data-racf-filter-reason');
                 wasModified = true;
             }
             if (node.title?.startsWith(SCRIPT_PREFIX)) {
                node.removeAttribute('title');
                wasModified = true;
            }

             if (wasModified) {
                 this.debugLog("Unfiltered node:", node);
             }
        }


        addScrollListener() {
            let scrollTimeout = null;
            const handleScroll = () => {
                if (scrollTimeout !== null) {
                    window.clearTimeout(scrollTimeout);
                }
                 if (performance.now() - this.lastFilterTime < DEBOUNCE_DELAY_MS / 2) {
                    return;
                 }

                scrollTimeout = setTimeout(() => {
                    window.requestAnimationFrame(() => {
                        this.debugLog("Scroll ended, applying filters...");
                        this.applyFilters(document.body);
                    });
                    scrollTimeout = null;
                }, DEBOUNCE_DELAY_MS);
            };

            window.addEventListener('scroll', handleScroll, { passive: true });
            this.log("Scroll listener added.");
        }

        exportConfig() {
            try {
                const configToExport = {
                    ...this.config,
                     rules: this.config.rules || [],
                     filterTypes: this.config.filterTypes || [],
                     filterAction: FILTER_ACTIONS.includes(this.config.filterAction) ? this.config.filterAction : DEFAULT_CONFIG.filterAction,
                     whitelist: this.config.whitelist || { subreddits: [], users: [] },
                     blacklist: this.config.blacklist || { subreddits: [], users: [] },
                     uiVisible: this.config.uiVisible,
                     activeTab: this.config.activeTab || 'settings',
                     uiPosition: this.config.uiPosition || DEFAULT_CONFIG.uiPosition
                };

                const configString = JSON.stringify(configToExport, null, 2);
                const blob = new Blob([configString], { type: 'application/json;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.setAttribute('href', url);
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                link.setAttribute('download', `reddit-filter-config-${timestamp}.json`);
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                this.log("Config exported successfully.");
            } catch (e) {
                this.log(`Export error: ${e.message}`);
                alert(`Config export failed: ${e.message}`);
                console.error("Export Error:", e);
            }
        }

        async importConfig(event) {
            const fileInput = event.target;
            const file = fileInput?.files?.[0];

            if (!file) {
                this.log("Import cancelled or no file selected.");
                return;
            }

            if (!file.type || !file.type.match('application/json')) {
                alert('Import failed: Please select a valid .json file.');
                if (fileInput) fileInput.value = null;
                return;
            }

            const reader = new FileReader();

            reader.onload = async (e) => {
                const content = e.target.result;
                try {
                    const importedConfig = JSON.parse(content);

                    if (typeof importedConfig !== 'object' || importedConfig === null) {
                        throw new Error("Invalid JSON format. Root should be an object.");
                    }

                    const newConfig = {
                        ...DEFAULT_CONFIG,
                        ...importedConfig,
                        rules: Array.isArray(importedConfig.rules) ? importedConfig.rules : [],
                        filterTypes: Array.isArray(importedConfig.filterTypes) ? importedConfig.filterTypes.filter(t => ['posts', 'comments', 'messages'].includes(t)) : DEFAULT_CONFIG.filterTypes,
                        filterAction: FILTER_ACTIONS.includes(importedConfig.filterAction) ? importedConfig.filterAction : DEFAULT_CONFIG.filterAction,
                        whitelist: {
                            subreddits: Array.isArray(importedConfig.whitelist?.subreddits) ? importedConfig.whitelist.subreddits.map(s => String(s).toLowerCase()) : [],
                            users: Array.isArray(importedConfig.whitelist?.users) ? importedConfig.whitelist.users.map(u => String(u).toLowerCase()) : []
                        },
                        blacklist: {
                             subreddits: Array.isArray(importedConfig.blacklist?.subreddits) ? importedConfig.blacklist.subreddits.map(s => String(s).toLowerCase()) : [],
                             users: Array.isArray(importedConfig.blacklist?.users) ? importedConfig.blacklist.users.map(u => String(u).toLowerCase()) : []
                        },
                        uiPosition: { ...DEFAULT_CONFIG.uiPosition, ...(typeof importedConfig.uiPosition === 'object' ? importedConfig.uiPosition : {}) },
                        uiVisible: typeof importedConfig.uiVisible === 'boolean' ? importedConfig.uiVisible : DEFAULT_CONFIG.uiVisible,
                        activeTab: typeof importedConfig.activeTab === 'string' ? importedConfig.activeTab : DEFAULT_CONFIG.activeTab
                    };

                     newConfig.rules = newConfig.rules.filter(rule =>
                         rule && typeof rule === 'object' &&
                         RULE_TYPES.includes(rule.type) &&
                         typeof rule.text === 'string' && rule.text.trim() !== '' &&
                         typeof rule.isRegex === 'boolean' &&
                         typeof rule.caseSensitive === 'boolean' &&
                         typeof rule.normalize === 'boolean' &&
                         ['title', 'body', 'both'].includes(rule.target)
                     ).map(rule => {
                         if (rule.type === 'user' || rule.type === 'subreddit') {
                             rule.text = rule.text.toLowerCase();
                             rule.caseSensitive = false;
                             rule.normalize = false;
                             rule.isRegex = false;
                         }
                         if (rule.normalize) rule.caseSensitive = false;
                         return rule;
                     });

                    this.config = newConfig;

                    if (this.uiContainer && this.config.uiPosition) {
                        this.uiContainer.style.top = this.config.uiPosition.top || DEFAULT_CONFIG.uiPosition.top;
                        if (this.config.uiPosition.left !== null && this.config.uiPosition.left !== undefined) {
                            this.uiContainer.style.left = this.config.uiPosition.left;
                            this.uiContainer.style.right = 'auto';
                        } else {
                            this.uiContainer.style.left = 'auto';
                            this.uiContainer.style.right = this.config.uiPosition.right || DEFAULT_CONFIG.uiPosition.right;
                        }
                        this.uiContainer.style.display = this.config.uiVisible ? 'block' : 'none';
                    }

                    this.log(`Config imported successfully. ${newConfig.rules.length} rules loaded.`);
                    await this.saveConfig();
                    this.updateUI();
                    this.processedNodes = new WeakSet();
                    this.originalContentCache = new WeakMap();
                    this.applyFilters(document.body);
                    alert('Configuration imported successfully!');

                } catch (err) {
                    alert(`Import error: ${err.message}\nPlease ensure the file is a valid configuration JSON.`);
                    this.log(`Import error: ${err.message}`);
                    console.error("Import Error:", err);
                } finally {
                    if (fileInput) fileInput.value = null;
                }
            };

            reader.onerror = (e) => {
                alert(`File read error: ${e.target.error}`);
                this.log(`File read error: ${e.target.error}`);
                if (fileInput) fileInput.value = null;
            };

            reader.readAsText(file);
        }


        registerMenuCommands() {
            GM_registerMenuCommand('Toggle Filter Panel', () => this.toggleUIVisibility());
            GM_registerMenuCommand('Re-apply All Filters', () => {
                this.log(`Manual re-filter requested.`);
                this.processedNodes = new WeakSet();
                this.originalContentCache = new WeakMap();
                this.applyFilters(document.body);
            });
            GM_registerMenuCommand('Reset Filter Statistics', () => this.resetStats());
        }

        toggleUIVisibility(forceState = null) {
            const shouldBeVisible = forceState !== null ? forceState : !this.config.uiVisible;

            if (shouldBeVisible !== this.config.uiVisible) {
                this.config.uiVisible = shouldBeVisible;
                if (this.uiContainer) {
                    this.uiContainer.style.display = this.config.uiVisible ? 'block' : 'none';
                }
                this.saveConfig();

                if (this.config.uiVisible) {
                    this.updateUI();
                }
                 const optionsBtn = document.getElementById(`${SCRIPT_PREFIX}-options-btn`);
                 if (optionsBtn) {
                     optionsBtn.textContent = this.config.uiVisible ? 'Ocultar RedditCurator' : 'Mostrar RedditCurator';
                     optionsBtn.title = this.config.uiVisible ? 'Ocultar RedditCurator' : 'Mostrar RedditCurator';
                 }
            }
        }

        async saveConfigAndApplyFilters() {
            await this.saveConfig();

            if (this.filterApplyDebounceTimer) clearTimeout(this.filterApplyDebounceTimer);

            this.filterApplyDebounceTimer = setTimeout(() => {
                this.log(`Config changed, re-applying all filters...`);
                this.processedNodes = new WeakSet();
                this.originalContentCache = new WeakMap();
                this.applyFilters(document.body);
                this.filterApplyDebounceTimer = null;
            }, 150);
        }

    } // --- Fin de la clase RedditFilter ---

    // -------------------------------
    // Botón Flotante de Opciones
    // -------------------------------
    function addOptionsButton() {
        const buttonId = `${SCRIPT_PREFIX}-options-btn`;
        if (document.getElementById(buttonId)) return;

        const btn = document.createElement('button');
        btn.id = buttonId;

        btn.style.position = 'fixed';
        btn.style.bottom = '15px';
        btn.style.right = '15px';
        btn.style.zIndex = '10000';
        btn.style.padding = '8px 16px';
        btn.style.backgroundColor = '#0079D3';
        btn.style.color = 'white';
        btn.style.border = '1px solid #006abd';
        btn.style.borderRadius = '20px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '13px';
        btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        btn.style.transition = 'background-color 0.2s ease, box-shadow 0.2s ease, transform 0.1s ease';
        btn.style.fontFamily = 'inherit';
        btn.style.lineHeight = '1.5';

        btn.onmouseover = () => {
            btn.style.backgroundColor = '#005fa3';
            btn.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
        };
        btn.onmouseout = () => {
            btn.style.backgroundColor = '#0079D3';
            btn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
            btn.style.transform = 'scale(1)';
        };
         btn.onmousedown = () => { btn.style.transform = 'scale(0.97)'; };
         btn.onmouseup = () => { btn.style.transform = 'scale(1)'; };

        const instance = window.redditAdvancedFilterInstance_1_7;
        btn.textContent = (instance && instance.config.uiVisible) ? 'Ocultar RedditCurator' : 'Mostrar RedditCurator';
        btn.title = (instance && instance.config.uiVisible) ? 'Mostrar RedditCurator' : 'Mostrar RedditCurator';

        btn.addEventListener('click', () => {
            const currentInstance = window.redditAdvancedFilterInstance_1_7;
            if (currentInstance) {
                currentInstance.toggleUIVisibility();
            } else {
                 console.warn(`[${SCRIPT_PREFIX}] Filter instance not found when clicking options button.`);
            }
        });

        document.body.appendChild(btn);
    }

    // -------------------------------
    // Inicialización del Script
    // -------------------------------
    function runScript() {
        const instanceName = 'redditAdvancedFilterInstance_1_7';
        if (window[instanceName]) {
            const runningVersion = window[instanceName].constructor.version || GM_info?.script?.version || 'unknown';
            GM_log(`[${SCRIPT_PREFIX}] Instance already running (v${runningVersion}). Skipping init.`);
             if (!document.getElementById(`${SCRIPT_PREFIX}-options-btn`)) {
                 addOptionsButton();
                 const btn = document.getElementById(`${SCRIPT_PREFIX}-options-btn`);
                 if(btn) {
                     const instance = window[instanceName];
                     btn.textContent = (instance && instance.config.uiVisible) ? 'Ocultar RedditCurator' : 'Mostrar RedditCurator';
                     btn.title = (instance && instance.config.uiVisible) ? 'Ocultar RedditCurator' : 'Mostrar RedditCurator';
                 }
             }
            return;
        }

        window[instanceName] = new RedditFilter();
        window[instanceName].init().then(() => {
             addOptionsButton();
        }).catch(error => {
             GM_log(`[${SCRIPT_PREFIX}] Critical error during initialization: ${error.message}`);
             console.error(`[${SCRIPT_PREFIX}] Initialization failed:`, error);
             delete window[instanceName];
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runScript);
    } else {
        runScript();
    }

})(); // --- Fin del IIFE ---