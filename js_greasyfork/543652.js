// ==UserScript==
// @name        Gelbooru Suite
// @namespace   GelbooruEnhancer
// @version     2.2.91
// @description Enhances Gelbooru with a categorized pop-up search, an immersive viewer, pool markers, and more.
// @author      Testador (Refactored by Gemini)
// @match       *://gelbooru.com/*
// @icon        https://gelbooru.com/favicon.ico
// @grant       GM_download
// @grant       GM.xmlHttpRequest
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM_registerMenuCommand
// @grant       GM_addStyle
// @grant       GM_openInTab
// @license     MIT
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/543652/Gelbooru%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/543652/Gelbooru%20Suite.meta.js
// ==/UserScript==

/* global navigatePrev, navigateNext */

(function() {
    'use strict';

    // =================================================================================
    // CONFIGURATION AND CONSTANTS MODULE
    // =================================================================================
    const Config = {
        API_URLS: {
            BASE: 'https://gelbooru.com/index.php?page=dapi&s=post&q=index&json=1',
            AUTOCOMPLETE: 'https://gelbooru.com/index.php?page=autocomplete2&type=tag_query&limit=10',
        },
        DEFAULT_SETTINGS: {
            DEBUG: false,
            // --- Global Toggles ---
            ENABLE_ADVANCED_SEARCH: true,
            ENABLE_ADD_TO_POOL: true,
            ENABLE_DOWNLOADER: true,
            ENABLE_POST_MARKERS: true,
            HIDE_PAGE_SCROLLBARS: true,
            BLACKLIST_TAGS: '',

            // --- Downloader ---
            DOWNLOAD_FOLDER: 'gelbooru',

            // --- Hotkeys ---
            KEY_GALLERY_NEXT_PAGE: 'ArrowRight',
            KEY_GALLERY_PREV_PAGE: 'ArrowLeft',
            KEY_VIEWER_PREV_IMAGE: 'ArrowUp',
            KEY_VIEWER_NEXT_IMAGE: 'ArrowDown',
            KEY_VIEWER_TOGGLE_INFO: 'i',
            KEY_VIEWER_CLOSE: 'Escape',
            KEY_VIEWER_PIN_UI: 'p',
            KEY_VIEWER_OPEN_POST: 'o',
            KEY_VIDEO_FULLSCREEN: 'f',

            // --- API ---
            API_KEY: '',
            USER_ID: '',
        },
        SELECTORS: {
            SEARCH_INPUT: '#tags-search',
            THUMBNAIL_GRID_SELECTOR: '.thumbnail-container, #post-list > div, .mainBodyPadding',
            THUMBNAIL_ANCHOR_SELECTOR: '.thumbnail-container > span > a, .thumbnail-container > .thumbnail-preview > a',
            VIDEO_PLAYER_SELECTOR: 'main video#gelcomVideoPlayer',
            IMAGE_SELECTOR: 'main #image',
            PAGINATION_CURRENT_SELECTOR: '.pagination b',
            SETTINGS_MODAL_ID: 'enhancer-settings-modal',
            ADVANCED_SEARCH_MODAL_ID: 'gbs-advanced-search-modal',
            galleryNavSubmenu: '.navSubmenu',
            postTagListItem: '#tag-list li[class*="tag-type-"]',
            postTagLink: 'a[href*="&tags="]',
            MEDIA_VIEWER_THUMBNAIL_ANCHOR: '.thumbnail-container > span > a, .thumbnail-container > .thumbnail-preview > a',

        },
        STORAGE_KEYS: {
            SUITE_SETTINGS: 'gelbooruSuite_settings',
            FAVORITE_POOLS: 'gbs_favorite_pools',
            POST_MARKER_CACHE: 'gbs_post_marker_cache',
        },
        COLORS_CONSTANTS: {
            'artist': '#AA0000',
            'character': '#00AA00',
            'copyright': '#AA00AA',
            'metadata': '#FF8800',
            'general': '#337ab7',
            'excluded': '#d55e5e',
        },
    };

    // =================================================================================
    // GLOBAL STATE MODULE
    // =================================================================================
    const GlobalState = {
        searchDebounceTimeout: null,
        pageType: null,
    };

    // =================================================================================
    // UTILITY, API, ZOOM & LOGGER MODULES (CORE)
    // =================================================================================
    const Utils = {
        makeRequest: function(options) {
            let xhr;
            const promise = new Promise((resolve, reject) => {
                xhr = GM.xmlHttpRequest({
                    ...options,
                    onload: (response) => (response.status >= 200 && response.status < 300) ? resolve(response) : reject(new Error(`Request failed: Status ${response.status}`)),
                    onerror: (response) => reject(new Error(`Network error: ${response.statusText}`)),
                    ontimeout: () => reject(new Error('Request timed out.'))
                });
            });
            return { promise, xhr };
        },
        getPostId: (postUrl) => {
            try {
                return new URL(postUrl).searchParams.get('id');
            } catch (e) {
                Logger.warn(`Could not parse post ID from URL: ${postUrl}`, e);
                return null;
            }
        },
        formatHotkeyForStorage: function(key) {
            return key === 'Space' ? ' ' : key.trim();
        },
        formatHotkeyForDisplay: function(key) {
            return key === ' ' ? 'Space' : key;
        },
    };

    const Logger = {
        _log: function(level, ...args) {
            if (!Settings.State.DEBUG) return;
            const prefix = '[Gelbooru Suite]';
            switch (level) {
                case 'log': console.log(prefix, ...args); break;
                case 'warn': console.warn(prefix, ...args); break;
                case 'error': console.error(prefix, ...args); break;
                default: console.log(prefix, ...args); break;
            }
        },
        log: function(...args) { this._log('log', ...args); },
        warn: function(...args) { this._log('warn', ...args); },
        error: function(...args) { this._log('error', ...args); }
    };

    const API = {
        fetchTagCategory: async function(tagName) {
            const encodedTerm = encodeURIComponent(tagName.replace(/ /g, '_'));
            const url = `${Config.API_URLS.AUTOCOMPLETE}&term=${encodedTerm}`;
            try {
                const { promise } = Utils.makeRequest({ method: "GET", url });
                const response = await promise;
                const data = JSON.parse(response.responseText);

                if (data && data.length > 0) {
                    const exactMatch = data.find(tag => tag.value === tagName);
                    if (exactMatch) {
                        return exactMatch.category === 'tag' ? 'general' : exactMatch.category;
                    }
                }

                return 'general';
            } catch (error) {
                Logger.error(`Failed to fetch category for tag "${tagName}":`, error);
                return 'general';
            }
        },
        fetchTagSuggestions: async function(term) {
            if (!term || term.length < 2) return [];
            const encodedTerm = encodeURIComponent(term.replace(/ /g, '_'));
            const url = `${Config.API_URLS.AUTOCOMPLETE}&term=${encodedTerm}`;
            try {
                const { promise } = Utils.makeRequest({ method: "GET", url });
                const response = await promise;
                const data = JSON.parse(response.responseText);
                return data || [];
            } catch (error) {
                Logger.error("Failed to fetch tag suggestions:", error);
                return [];
            }
        },
        fetchMediaDetails: async function(postId) {
            if (!postId) throw new Error("No Post ID provided.");
            let request;
            if (Settings.State.API_KEY && Settings.State.USER_ID) {
                const apiUrl = `${Config.API_URLS.BASE}&id=${postId}&user_id=${Settings.State.USER_ID}&api_key=${Settings.State.API_KEY}`;
                try {
                    request = Utils.makeRequest({ method: "GET", url: apiUrl });

                    const response = await request.promise;
                    if (response.status === 401 || response.status === 403) {
                        Settings.UI.openModal("Authentication failed. Your API Key or User ID is incorrect. Please enter valid credentials.");
                        throw new Error("Authentication failed. Please check your credentials.");
                    }
                    let data;
                    try { data = JSON.parse(response.responseText); }
                    catch (e) {
                        Logger.error("Failed to parse API response. It might not be valid JSON.", e);
                        Logger.error("Raw response text:", response.responseText);
                        throw new Error("Failed to parse API response. It might not be valid JSON.");
                    }
                    if (!data?.post?.length) throw new Error("API returned no post data or post not found.");
                    const post = data.post[0];
                    const fileUrl = post.file_url;
                    const isVideo = ['.mp4', '.webm'].some(ext => fileUrl.endsWith(ext));
                    return { url: fileUrl, type: isVideo ? 'video' : 'image' };
                } catch (error) {
                    if (error.message.includes('abort')) {
                        Logger.log(`Request for post ${postId} was aborted.`);
                        throw error;
                    }
                    Logger.warn(`[Gelbooru Suite] API request failed: ${error.message}. Attempting HTML fallback.`);
                }
            }

            try {
                Logger.log(`[Gelbooru Suite] Using HTML fallback for post ID: ${postId}`);
                const postUrl = `https://gelbooru.com/index.php?page=post&s=view&id=${postId}`;

                request = Utils.makeRequest({ method: "GET", url: postUrl });

                const mediaData = await this.getPostData(request.promise);
                return { url: mediaData.contentUrl, type: mediaData.type };
            } catch (fallbackError) {
                Logger.error('[Gelbooru Suite] HTML fallback also failed:', fallbackError);
                throw fallbackError;
            }
        },
        fetchMediaDetailsFromHTML: async function(postUrl) {
            if (!postUrl) throw new Error("No Post URL provided.");
            try {
                Logger.log(`[Gelbooru Suite] Using HTML-only fetch for: ${postUrl}`);
                const { promise } = Utils.makeRequest({ method: "GET", url: postUrl });
                const mediaData = await this.getPostData(promise);
                return mediaData;
            } catch (error) {
                Logger.error('[Gelbooru Suite] HTML fetch failed:', error);
                throw error;
            }
        },
        fetchSavedSearches: async function(forceRefresh = false) {
            const cacheKey = 'gbs_saved_searches_cache';
            const cacheDuration = 8 * 60 * 60 * 1000; // 8 hour

            if (!forceRefresh) {
                const cachedData = await GM.getValue(cacheKey, null);
                if (cachedData && (Date.now() - cachedData.timestamp < cacheDuration)) {
                    Logger.log("Using searches saved from the local cache.");
                    return cachedData.searches;
                }
            }

            Logger.log(forceRefresh ? "Forcing cache refresh." : "Cache expired. Fetching from the network...");
            let allSearches = [];
            let nextPageUrl = '/index.php?page=tags&s=saved_search';

            try {
                while (nextPageUrl) {
                    const { promise } = Utils.makeRequest({ method: "GET", url: nextPageUrl });
                    const response = await promise;
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    const searchNodes = doc.querySelectorAll('span[style*="font-size: 1.5em"] > a:nth-of-type(2)');
                    const searchesOnPage = Array.from(searchNodes).map(node => node.textContent.trim());
                    allSearches.push(...searchesOnPage);
                    const nextPageLink = doc.querySelector('.pagination b + a');
                    nextPageUrl = nextPageLink ? nextPageLink.getAttribute('href') : null;
                }

                await GM.setValue(cacheKey, { searches: allSearches, timestamp: Date.now() });
                Logger.log(`Cache updated with ${allSearches.length} searches.`);
                return allSearches;

            } catch (error) {
                Logger.error("Failed to fetch saved searches:", error);
                const cachedData = await GM.getValue(cacheKey, null);
                if (cachedData) {
                    Logger.warn("Using old cache data as fallback.");
                    return cachedData.searches;
                }
                return [];
            }
        },
        getPostData: async function(requestPromise) {
            const response = await requestPromise;
            const doc = new DOMParser().parseFromString(response.responseText, "text/html");
            return this.parsePostDataFromDoc(doc);
        },
        parsePostDataFromDoc: function(doc) {
            const metaTag = doc.querySelector("meta[property='og:image']");
            const videoTag = doc.querySelector("video#gelcomVideoPlayer source");
            let contentUrl, type;
            if (videoTag && videoTag.src) {
                contentUrl = videoTag.src;
                type = 'video';
            } else if (metaTag) {
                contentUrl = metaTag.getAttribute('content');
                type = ['.mp4', '.webm'].some(ext => contentUrl.endsWith(ext)) ? 'video' : 'image';
            }
            if (contentUrl) {
                return { contentUrl, type, tags: this.parseTags(doc) };
            } else {
                throw new Error(`Media not found for post.`);
            }
        },
        parseTags: function(doc) {
            const tags = {};
            doc.querySelectorAll(Config.SELECTORS.postTagListItem).forEach(li => {
                const categoryMatch = li.className.match(/tag-type-([a-z_]+)/);
                const category = categoryMatch ? categoryMatch[1] : 'general';
                const tagLink = li.querySelector(Config.SELECTORS.postTagLink);
                if (tagLink) {
                    if (!tags[category]) { tags[category] = []; }
                    tags[category].push({ name: tagLink.textContent.trim(), url: tagLink.href });
                }
            });
            return tags;
        }
    };

    // =================================================================================
    // SETTINGS MODULE
    // =================================================================================
    const Settings = {
        State: {},
        settingsMap: [
            { id: 'setting-advanced-search', key: 'ENABLE_ADVANCED_SEARCH', type: 'checkbox' },
            { id: 'setting-add-to-pool', key: 'ENABLE_ADD_TO_POOL', type: 'checkbox' },
            { id: 'setting-downloader', key: 'ENABLE_DOWNLOADER', type: 'checkbox' },
            { id: 'setting-post-markers', key: 'ENABLE_POST_MARKERS', type: 'checkbox' },
            { id: 'setting-hide-scrollbars', key: 'HIDE_PAGE_SCROLLBARS', type: 'checkbox' },
            { id: 'setting-blacklist-tags', key: 'BLACKLIST_TAGS', type: 'textarea' },
        ],
        load: async function() {
            const savedSettings = await GM.getValue(Config.STORAGE_KEYS.SUITE_SETTINGS, {});
            this.State = { ...Config.DEFAULT_SETTINGS, ...savedSettings };
            this.State.favoritePools = await GM.getValue(Config.STORAGE_KEYS.FAVORITE_POOLS, []);
            Logger.State = this.State; // Pass settings to logger
        },
        save: async function() {
            const getHotkey = (id) => Utils.formatHotkeyForStorage(document.getElementById(id).value);
            const newSettings = {};

            this.settingsMap.forEach(setting => {
                const element = document.getElementById(setting.id);
                if (!element) return;

                switch (setting.type) {
                    case 'checkbox':
                        newSettings[setting.key] = element.checked;
                        break;
                    case 'textarea':
                    case 'text':
                    case 'select':
                        newSettings[setting.key] = element.value.trim();
                        break;
                    case 'float':
                        newSettings[setting.key] = Math.max(1, parseFloat(element.value) || Config.DEFAULT_SETTINGS[setting.key]);
                        break;
                }
            });

            Object.assign(newSettings, {
                KEY_GALLERY_NEXT_PAGE: getHotkey('setting-key-gallery-next') || Config.DEFAULT_SETTINGS.KEY_GALLERY_NEXT_PAGE,
                KEY_GALLERY_PREV_PAGE: getHotkey('setting-key-gallery-prev') || Config.DEFAULT_SETTINGS.KEY_GALLERY_PREV_PAGE,
                KEY_VIEWER_PREV_IMAGE: getHotkey('setting-key-viewer-prev') || Config.DEFAULT_SETTINGS.KEY_VIEWER_PREV_IMAGE,
                KEY_VIEWER_NEXT_IMAGE: getHotkey('setting-key-viewer-next') || Config.DEFAULT_SETTINGS.KEY_VIEWER_NEXT_IMAGE,
                KEY_VIEWER_TOGGLE_INFO: getHotkey('setting-key-viewer-info') || Config.DEFAULT_SETTINGS.KEY_VIEWER_TOGGLE_INFO,
                KEY_VIEWER_CLOSE: getHotkey('setting-key-viewer-close') || Config.DEFAULT_SETTINGS.KEY_VIEWER_CLOSE,
                KEY_VIEWER_PIN_UI: getHotkey('setting-key-viewer-pin') || Config.DEFAULT_SETTINGS.KEY_VIEWER_PIN_UI,
                KEY_VIEWER_OPEN_POST: getHotkey('setting-key-viewer-open-post') || Config.DEFAULT_SETTINGS.KEY_VIEWER_OPEN_POST,
                KEY_VIDEO_FULLSCREEN: getHotkey('setting-key-viewer-video-fullscreen') || Config.DEFAULT_SETTINGS.KEY_VIDEO_FULLSCREEN,
            });

            Object.assign(newSettings, {
                API_KEY: document.getElementById('setting-api-key').value.trim(),
                USER_ID: document.getElementById('setting-user-id').value.trim(),
                DOWNLOAD_FOLDER: document.getElementById('setting-download-folder').value.trim() || Config.DEFAULT_SETTINGS.DOWNLOAD_FOLDER,
            });

            await GM.setValue(Config.STORAGE_KEYS.SUITE_SETTINGS, newSettings);

            const favoritePools = [];
            for (let i = 1; i <= 5; i++) {
                const poolName = document.getElementById(`setting-pool-name-${i}`).value.trim();
                const poolId = document.getElementById(`setting-pool-id-${i}`).value.trim();
                const poolColor = document.getElementById(`setting-pool-color-${i}`).value;
                if (poolName && poolId && poolId.match(/^\d+$/)) {
                    favoritePools.push({ name: poolName, id: poolId, color: poolColor });
                }
            }
            await GM.setValue(Config.STORAGE_KEYS.FAVORITE_POOLS, favoritePools);

            this.State = { ...newSettings, favoritePools };
            this.UI.closeModal();
            window.location.reload();
        },
        clearCredentials: async function() {
            if (confirm("Are you sure you want to clear your API Key and User ID? The page will reload.")) {
                const newSettings = { ...this.State, API_KEY: '', USER_ID: '' };
                await GM.setValue(Config.STORAGE_KEYS.SUITE_SETTINGS, newSettings);
                this.State = newSettings;
                window.location.reload();
            }
        },
        export: function() {
            const jsonString = JSON.stringify(this.State, null, 2);
            const textarea = document.getElementById('enhancer-import-area');
            const originalPlaceholder = textarea.placeholder;

            const resetTextarea = () => {
                textarea.placeholder = originalPlaceholder;
            };

            navigator.clipboard.writeText(jsonString).then(() => {
                textarea.placeholder = 'Settings copied to clipboard!';
                setTimeout(resetTextarea, 3000);
            });
        },
        import: async function() {
            const textarea = document.getElementById('enhancer-import-area');
            const jsonString = textarea.value;
            const originalPlaceholder = textarea.placeholder;

            const showMessage = (message, duration = 3000) => {
                textarea.placeholder = message;
                setTimeout(() => {
                    textarea.placeholder = originalPlaceholder;
                }, duration);
            };

            if (!jsonString.trim()) {
                showMessage('Import field is empty.');
                return;
            }
            try {
                const importData = JSON.parse(jsonString);

                if (importData && typeof importData === 'object' && importData.hasOwnProperty('DEBUG')) {

                    const favoritePools = importData.favoritePools || [];

                    const { favoritePools: extractedPools, ...mainSettings } = importData;

                    await GM.setValue(Config.STORAGE_KEYS.SUITE_SETTINGS, mainSettings);
                    await GM.setValue(Config.STORAGE_KEYS.FAVORITE_POOLS, favoritePools);

                    showMessage('Settings imported! Page will reload...', 2000);
                    textarea.value = '';
                    setTimeout(() => window.location.reload(), 1500);
                } else {
                    throw new Error("Invalid or incomplete settings format.");
                }
            } catch (error) {
                showMessage(`Import failed: ${error.message}`, 4000);
                Logger.error('Import error:', error);
            }
        },
        testCredentials: async function() {
            const testButton = document.getElementById('enhancer-test-creds');
            const apiKey = document.getElementById('setting-api-key').value.trim();
            const userId = document.getElementById('setting-user-id').value.trim();
            const originalText = 'Test Connection';

            const originalBgColor = testButton.style.backgroundColor;

            const resetButton = (delay) => {
                setTimeout(() => {
                    testButton.textContent = originalText;
                    testButton.style.backgroundColor = originalBgColor;
                    testButton.disabled = false;
                }, delay);
            };

            testButton.disabled = true;

            if (!apiKey || !userId) {
                testButton.textContent = 'Missing Keys';
                testButton.style.backgroundColor = '#EFB700';
                resetButton(3000);
                return;
            }

            testButton.textContent = 'Testing...';
            testButton.style.backgroundColor = '#61afef';

            const testUrl = `${Config.API_URLS.BASE}&limit=1&user_id=${userId}&api_key=${apiKey}`;
            try {
                const { promise } = Utils.makeRequest({ method: "GET", url: testUrl });
                const response = await promise;
                if (response.status === 200) {
                    testButton.textContent = 'Success!';
                    testButton.style.backgroundColor = '#008450';
                } else {
                    throw new Error(`Authentication failed (Status: ${response.status})`);
                }
            } catch (error) {
                Logger.error('API connection test failed:', error);
                testButton.textContent = 'Error';
                testButton.style.backgroundColor = '#B81D13';
            } finally {
                resetButton(3000);
            }
        },
        UI: {
            _getGeneralSettingsHTML: function() {
                return `
                <div class="settings-tab-pane active" data-tab="general">
                    <div class="setting-item"><label for="setting-advanced-search">Enable Tag Editor</label><label class="toggle-switch"><input type="checkbox" id="setting-advanced-search"><span class="toggle-slider"></span></label></div>
                    <div class="setting-item"><label for="setting-add-to-pool">Enable Add to Pool/Favorites</label><label class="toggle-switch"><input type="checkbox" id="setting-add-to-pool"><span class="toggle-slider"></span></label></div>
                    <div class="setting-item"><label for="setting-downloader">Enable Downloader</label><label class="toggle-switch"><input type="checkbox" id="setting-downloader"><span class="toggle-slider"></span></label></div>
                    <div class="setting-item"><label for="setting-post-markers">Enable Post Markers</label><label class="toggle-switch"><input type="checkbox" id="setting-post-markers"><span class="toggle-slider"></span></label></div>
                    <div class="setting-item"><label for="setting-hide-scrollbars">Hide Page Scrollbars (Global)</label><label class="toggle-switch"><input type="checkbox" id="setting-hide-scrollbars"><span class="toggle-slider"></span></label></div>
                    <hr class="setting-divider">
                    <div class="setting-item-vertical">
                        <label for="setting-blacklist-tags">Blacklisted Tags (space-separated)</label>
                        <p class="setting-note" style="text-align: left; margin: 5px 0 10px 0;">Tags for the 'Toggle Blacklist' button in the Tag Editor modal.</p>
                        <textarea id="setting-blacklist-tags" rows="3" placeholder="Example: muscular red_eyes pov ..."></textarea>
                    </div>
                </div>`;
            },
            _getPoolsSettingsHTML: function() {
                let poolSettingsHTML = '';
                for (let i = 1; i <= 5; i++) {
                    poolSettingsHTML += `
                    <div class="setting-item gbs-pool-setting-item">
                        <input type="color" id="setting-pool-color-${i}" class="gbs-pool-color-picker" title="Select a color for this pool's marker">
                        <input type="text" id="setting-pool-name-${i}" placeholder="Pool ${i} Name" maxlength="20">
                        <input type="text" id="setting-pool-id-${i}" placeholder="Pool ${i} ID">
                    </div>`;
                }
                return `
                <div class="settings-tab-pane" data-tab="pools">
                    <p class="setting-note">Configure up to 5 favorite pools for the "Add to Pool" feature.</p>
                    <p class="setting-note">Only pools with both a name and a valid numeric ID will be saved.</p>
                    ${poolSettingsHTML}
                </div>`;
            },
            _getHotkeysSettingsHTML: function() {
                return `
                <div class="settings-tab-pane" data-tab="hotkeys">
                    <p class="setting-note">Click on a field and press the desired key to set a hotkey.</p>
                    <h4 class="setting-subheader">Gallery Hotkeys</h4>
                    <div class="setting-item"><label for="setting-key-gallery-prev">Prev Page</label><input type="text" id="setting-key-gallery-prev" class="hotkey-input" readonly></div>
                    <div class="setting-item"><label for="setting-key-gallery-next">Next Page</label><input type="text" id="setting-key-gallery-next" class="hotkey-input" readonly></div>
                    <h4 class="setting-subheader">Media Viewer Hotkeys</h4>
                    <div class="setting-item"><label for="setting-key-viewer-prev">Prev Image</label><input type="text" id="setting-key-viewer-prev" class="hotkey-input" readonly></div>
                    <div class="setting-item"><label for="setting-key-viewer-next">Next Image</label><input type="text" id="setting-key-viewer-next" class="hotkey-input" readonly></div>
                    <div class="setting-item"><label for="setting-key-viewer-info">Toggle Info</label><input type="text" id="setting-key-viewer-info" class="hotkey-input" readonly></div>

                    <div class="setting-item"><label for="setting-key-viewer-close">Close Viewer</label><input type="text" id="setting-key-viewer-close" class="hotkey-input" readonly></div>
                    <div class="setting-item"><label for="setting-key-viewer-pin">Pin UI</label><input type="text" id="setting-key-viewer-pin" class="hotkey-input" readonly></div>
                    <div class="setting-item"><label for="setting-key-viewer-open-post">Open Post Tab</label><input type="text" id="setting-key-viewer-open-post" class="hotkey-input" readonly></div>
                    <div class="setting-item"><label for="setting-key-viewer-video-fullscreen">Video Fullscreen</label><input type="text" id="setting-key-viewer-video-fullscreen" class="hotkey-input" readonly></div>
                    </div>`;
            },
            _getAdvancedSettingsHTML: function() {
                return `
                <div class="settings-tab-pane" data-tab="advanced">
                    <p class="setting-note">API keys can improve script reliability. Find them in Settings > Options.</p>
                    <p class="setting-note"><strong>Security Note: Keys are stored locally and are not encrypted.</strong></p>
                    <div class="setting-item"><label for="setting-api-key">API Key</label><input type="text" id="setting-api-key" placeholder="Your API key"></div>
                    <div class="setting-item"><label for="setting-user-id">User ID</label><input type="text" id="setting-user-id" placeholder="Your user ID"></div>
                    <div class="api-test-container">
                        <button id="enhancer-test-creds">Test Connection</button>
                    </div>
                    <p class="enhancer-error-message" id="enhancer-auth-error" style="display:none; text-align: center;"></p>
                    <hr class="setting-divider">
                    <div class="setting-item">
                        <label for="setting-download-folder">Download Folder</label>
                        <input type="text" id="setting-download-folder" placeholder="e.g., gelbooru_downloads">
                    </div>
                    <hr class="setting-divider">
                    <div class="manage-settings-section">
                        <p class="setting-note">Export your settings for backup, or import them on another browser.</p>
                        <div class="manage-buttons">
                            <button id="enhancer-export-settings">Export</button>
                            <button id="enhancer-import-settings">Import</button>
                        </div>
                        <textarea id="enhancer-import-area" rows="3" placeholder="Paste your exported settings string here and click Import..."></textarea>
                    </div>
                </div>`;
            },
            createModal: function() {
                if (document.getElementById(Config.SELECTORS.SETTINGS_MODAL_ID)) return;
                GM_addStyle(`
                    #${Config.SELECTORS.SETTINGS_MODAL_ID}-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 100000; justify-content: center; align-items: center; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} { box-sizing: border-box !important; background-color: #252525; color: #eee !important; border: 1px solid #666; border-radius: 10px; z-index: 101; padding: 20px 7px 7px 7px; width: 90%; max-width: 450px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} * { color: #eee !important; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} h2 { text-align: center; margin-bottom: 10px; padding-bottom: 10px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .settings-tabs { display: flex; margin-bottom: 15px; border-bottom: 1px solid #555; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .settings-tab-btn { background: none; border: none; color: #aaa !important; padding: 8px 12px; cursor: pointer; font-size: 1em; border-bottom: 2px solid transparent; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .settings-tab-btn.active { color: #fff !important; border-bottom-color: #006FFA; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .settings-tab-content { display: grid; align-items: start; padding-top: 10px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .settings-tab-pane { grid-row: 1; grid-column: 1; opacity: 0; pointer-events: none; transition: opacity 0.15s ease-in-out; max-height: 65vh; overflow-y: auto; padding: 3px 15px; box-sizing: border-box !important; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .settings-tab-pane.active { opacity: 1; pointer-events: auto; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-item-vertical { display: flex; flex-direction: column; margin-bottom: 12px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-item-vertical label { margin-bottom: 8px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-item-vertical textarea, #${Config.SELECTORS.SETTINGS_MODAL_ID} #enhancer-import-area { width: 100%; box-sizing: border-box !important; padding: 5px; background: #333; border: 1px solid #555; color: #fff !important; border-radius: 10px; resize: vertical; height: 70px; margin-top: 10px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-item label { color: #eee !important; flex-shrink: 0; font-weight: 300 }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-item input[type=number], #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-item input[type=text], #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-item select { width: 120px; box-sizing: border-box !important; padding: 6px; background: #333; border: 1px solid #555; color: #fff !important; border-radius: 10px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-item input[type=range] { flex-grow: 1; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-note { font-size: 11px; color: #999 !important; text-align: center; margin-top: 5px; margin-bottom: 15px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-note strong { color: #daa520 !important; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-divider { border: 0; height: 1px; background: #444; margin: 20px 0; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .setting-subheader { color: #006FFA !important; border-bottom: 1px solid #444; padding-bottom: 5px; margin-top: 20px; margin-bottom: 15px; font-size: 0.9em; text-transform: uppercase; letter-spacing: 0.5px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .settings-buttons { text-align: right; margin-top: 20px; border-top: 1px solid #555; padding-top: 15px; display: flex; align-items: center; justify-content: flex-end; gap: 10px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .settings-buttons button { padding: 8px 12px; border: none; background-color: #444; color: #fff !important; border-radius: 10px; cursor: pointer; font-weight: bold }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .manage-buttons button { background-color: #444; color: #fff !important; border: 1px solid #666; padding: 8px 12px; border-radius: 10px; cursor: pointer; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .manage-buttons button:hover { background-color: #555; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} #enhancer-save-settings { background-color: #006FFA; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} #enhancer-clear-creds { background-color: #A43535; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} #zoom-sens-value { color: #fff !important; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .api-test-container { display: flex; justify-content: center; gap: 10px; margin-top: 10px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .gbs-pool-setting-item { gap: 25px; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .gbs-pool-setting-item input[type=text] { flex-grow: 1; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .gbs-pool-color-picker { width: 40px; height: 30px; cursor: pointer; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} #enhancer-test-creds { padding: 5px 10px; font-size: 0.9em; background-color: #006FFA; border-radius: 3px; font-weight: bold; min-width: 110px; text-align: center; box-sizing: border-box !important; transition: background-color 0.2s ease-in-out; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .hotkey-input { cursor: pointer; text-align: center; }
                    #${Config.SELECTORS.SETTINGS_MODAL_ID} .hotkey-input:focus { background-color: #006FFA; color: #000 !important; font-weight: bold; }
                    .toggle-switch { position: relative; display: inline-block; width: 40px; height: 22px; }
                    .toggle-switch input { opacity: 0; width: 0; height: 0; }
                    .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555; transition: .4s; border-radius: 25px; }
                    .toggle-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
                    input:checked + .toggle-slider { background-color: #006FFA; }
                    input:checked + .toggle-slider:before { transform: translateX(18px); }
                `);
                const modalHTML = `
                <div id="${Config.SELECTORS.SETTINGS_MODAL_ID}-overlay">
                    <div id="${Config.SELECTORS.SETTINGS_MODAL_ID}">
                        <h2>Gelbooru Suite Settings</h2>
                        <div class="settings-tabs">
                            <button class="settings-tab-btn active" data-tab="general">General</button>
                            <button class="settings-tab-btn" data-tab="pools">Pools</button>
                            <button class="settings-tab-btn" data-tab="hotkeys">Hotkeys</button>
                            <button class="settings-tab-btn" data-tab="advanced">Advanced</button>
                        </div>
                        <div class="settings-tab-content">
                            ${this._getGeneralSettingsHTML()}
                            ${this._getPoolsSettingsHTML()}
                            ${this._getHotkeysSettingsHTML()}
                            ${this._getAdvancedSettingsHTML()}
                        </div>
                        <div class="footer-container" style="text-align: right; border-top: 1px solid #555; padding-top: 15px; margin-top: 20px;">
                            <div class="settings-buttons" style="margin-top: 0; border-top: none; padding-top: 0;">
                                <button id="enhancer-clear-creds">Clear Credentials</button>
                                <button id="enhancer-save-settings">Save</button>
                                <button id="enhancer-close-settings">Close</button>
                            </div>
                        </div>
                    </div>
                </div>`;
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                document.getElementById('enhancer-save-settings').addEventListener('click', Settings.save.bind(Settings));
                document.getElementById('enhancer-clear-creds').addEventListener('click', Settings.clearCredentials.bind(Settings));
                document.getElementById('enhancer-close-settings').addEventListener('click', this.closeModal);
                document.getElementById('enhancer-export-settings').addEventListener('click', Settings.export.bind(Settings));
                document.getElementById('enhancer-import-settings').addEventListener('click', Settings.import.bind(Settings));
                document.getElementById('enhancer-test-creds').addEventListener('click', Settings.testCredentials.bind(Settings));
                document.getElementById(`${Config.SELECTORS.SETTINGS_MODAL_ID}-overlay`).addEventListener('click', (e) => {
                    if (e.target.id === `${Config.SELECTORS.SETTINGS_MODAL_ID}-overlay`) this.closeModal();
                });
                const tabsContainer = document.querySelector(`#${Config.SELECTORS.SETTINGS_MODAL_ID} .settings-tabs`);
                const panesContainer = document.querySelector(`#${Config.SELECTORS.SETTINGS_MODAL_ID} .settings-tab-content`);
                tabsContainer.addEventListener('click', (e) => {
                    if (e.target.matches('.settings-tab-btn')) {
                        const targetTab = e.target.dataset.tab;
                        if (tabsContainer.querySelector('.active')) { tabsContainer.querySelector('.active').classList.remove('active'); }
                        e.target.classList.add('active');
                        if (panesContainer.querySelector('.active')) { panesContainer.querySelector('.active').classList.remove('active'); }
                        panesContainer.querySelector(`.settings-tab-pane[data-tab="${targetTab}"]`).classList.add('active');
                    }
                });
                document.querySelectorAll('.hotkey-input').forEach(input => {
                    const handleKeyDown = (e) => {
                        e.preventDefault();
                        let key = e.key;
                        if (key === ' ') { key = 'Space'; }
                        input.value = key;
                        input.blur();
                    };
                    const handleFocus = () => {
                        input.value = 'Press a key...';
                        input.addEventListener('keydown', handleKeyDown, { once: true });
                    };
                    const handleBlur = () => {
                        if (input.value === 'Press a key...') {
                            const settingKey = input.id.replace('setting-key-', 'KEY_').toUpperCase().replace(/-/g, '_');
                            let defaultValue = Settings.State[settingKey] || Config.DEFAULT_SETTINGS[settingKey];
                            input.value = Utils.formatHotkeyForDisplay(defaultValue);
                        }
                        input.removeEventListener('keydown', handleKeyDown);
                    };
                    input.addEventListener('focus', handleFocus);
                    input.addEventListener('blur', handleBlur);
                });
            },
            openModal: function(authError = '') {
                if (!document.getElementById(Config.SELECTORS.SETTINGS_MODAL_ID)) { this.createModal(); }

                Settings.settingsMap.forEach(setting => {
                    const element = document.getElementById(setting.id);
                    if (!element) return;

                    if (setting.type === 'checkbox') {
                        element.checked = Settings.State[setting.key];
                    } else {
                        element.value = Settings.State[setting.key];
                    }
                });

                document.getElementById('setting-key-gallery-next').value = Utils.formatHotkeyForDisplay(Settings.State.KEY_GALLERY_NEXT_PAGE);
                document.getElementById('setting-key-gallery-prev').value = Utils.formatHotkeyForDisplay(Settings.State.KEY_GALLERY_PREV_PAGE);
                document.getElementById('setting-key-viewer-prev').value = Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_PREV_IMAGE);
                document.getElementById('setting-key-viewer-next').value = Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_NEXT_IMAGE);
                document.getElementById('setting-key-viewer-info').value = Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_TOGGLE_INFO);
                document.getElementById('setting-key-viewer-close').value = Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_CLOSE);
                document.getElementById('setting-key-viewer-pin').value = Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_PIN_UI);
                document.getElementById('setting-key-viewer-open-post').value = Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_OPEN_POST);
                document.getElementById('setting-key-viewer-video-fullscreen').value = Utils.formatHotkeyForDisplay(Settings.State.KEY_VIDEO_FULLSCREEN);

                document.getElementById('setting-api-key').value = Settings.State.API_KEY;
                document.getElementById('setting-user-id').value = Settings.State.USER_ID;
                document.getElementById('setting-download-folder').value = Settings.State.DOWNLOAD_FOLDER;

                const favoritePools = Settings.State.favoritePools || [];
                for (let i = 0; i < 5; i++) {
                    const poolNameInput = document.getElementById(`setting-pool-name-${i + 1}`);
                    const poolIdInput = document.getElementById(`setting-pool-id-${i + 1}`);
                    const poolColorInput = document.getElementById(`setting-pool-color-${i + 1}`);
                    if (favoritePools[i]) {
                        poolNameInput.value = favoritePools[i].name;
                        poolIdInput.value = favoritePools[i].id;
                        poolColorInput.value = favoritePools[i].color || '#FFFFFF';
                    } else {
                        poolNameInput.value = '';
                        poolIdInput.value = '';
                        poolColorInput.value = '#FFFFFF';
                    }
                }

                const errorMessageElement = document.getElementById('enhancer-auth-error');
                if (authError) {
                    errorMessageElement.textContent = authError;
                    errorMessageElement.style.display = 'block';
                    document.querySelector('.settings-tabs .settings-tab-btn[data-tab="advanced"]').click();
                } else {
                    errorMessageElement.style.display = 'none';
                }
                document.getElementById(`${Config.SELECTORS.SETTINGS_MODAL_ID}-overlay`).style.display = 'flex';
            },
            closeModal: function() {
                const overlay = document.getElementById(`${Config.SELECTORS.SETTINGS_MODAL_ID}-overlay`);
                if (overlay) overlay.style.display = 'none';
            },
        }
    };

    // =================================================================================
    // ADVANCED SEARCH MODULE
    // =================================================================================
    const AdvancedSearch = {
        init: function() {
            const originalInput = document.querySelector(Config.SELECTORS.SEARCH_INPUT);
            if (!originalInput) return;
            this.injectStyles();
            if (originalInput.form) {
                originalInput.form.classList.add('gbs-search-form');
            }
            const { openModal } = this.UI.createModal(originalInput);
            const advButton = document.createElement('button');
            advButton.type = 'button';
            advButton.textContent = 'Tag Editor';
            advButton.id = 'gbs-advanced-search-btn';
            advButton.title = 'Open Advanced Tag Editor';
            const originalSubmitButton = originalInput.form.querySelector('input[name="commit"]');
            if (originalSubmitButton) {
                originalSubmitButton.insertAdjacentElement('afterend', advButton);
            } else {
                originalInput.insertAdjacentElement('afterend', advButton);
            }
            advButton.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        },
        injectStyles: function() {
            GM_addStyle(`
                .gbs-search-form { display: flex; align-items: center; gap: 5px; }
                .gbs-search-form > p { display: contents; }
                .gbs-search-form #tags-search { flex-grow: 1; width: auto !important; }
                .gbs-search-form input[type="submit"] { flex-shrink: 0; }
                #${Config.SELECTORS.ADVANCED_SEARCH_MODAL_ID}-overlay { display: flex; opacity: 0; pointer-events: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 100001; justify-content: center; align-items: flex-start; padding-top: 5vh; font-family: sans-serif; }
                #${Config.SELECTORS.ADVANCED_SEARCH_MODAL_ID} { background-color: #252525; border-radius: 10px; box-shadow: 0 5px 25px rgba(0,0,0,0.5); width: 90%; max-width: 550px; padding: 20px 7px 7px 7px; border: 1px solid #666; height: 80vh; display: flex; flex-direction: column; }
                .gbs-search-title { margin-bottom: 10px; padding-bottom: 10px; color: #eee; text-align: center; flex-shrink: 0; font-family: verdana, helvetica; }
                .gbs-input-wrapper { position: relative; flex-shrink: 0; }
                #gbs-tag-input { width: 100%; box-sizing: border-box; background: #333; border: 1px solid #555; padding-left: 40px !important; padding: 10px; border-radius: 10px; font-size: 1em; color: #eee; }
                .gbs-suggestion-container { position: absolute; top: 100%; left: 0; right: 0; background-color: #1F1F1F; border: 1px solid #555; border-top: none; z-index: 100002; max-height: 200px; overflow-y: auto; display: none; box-shadow: 0 4px 6px rgba(0,0,0,0.2); }
                .gbs-suggestion-item { font-size: 1.08em; padding: 3px 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: #ddd; }
                .gbs-suggestion-item:hover { background-color: #E6E6FA; }
                .gbs-suggestion-label { display: flex; align-items: center; gap: 8px; }
                .gbs-suggestion-category { font-size: 0.8em; color: #999; text-transform: capitalize; }
                .gbs-suggestion-count { font-size: 0.9em; }
                #gbs-category-sections-wrapper { overflow-y: auto; margin-top: 15px; padding-right: 15px; flex-grow: 1; min-height: 80px;  }
                .gbs-category-section { margin-bottom: 10px; }
                .gbs-category-title { color: #eee; margin: 0 0 8px 0; padding-bottom: 4px; border-bottom: 2px solid; font-size: 1em; text-transform: capitalize; }
                .gbs-pill-container { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0; min-height: 20px; }
                .gbs-tag-pill { display: inline-flex; align-items: center; color: white; padding: 5px 10px; border-radius: 10px; font-size: 0.9em; font-weight: bold; text-shadow: 1px 1px 3px rgba(0,0,0,0.9); }
                .gbs-remove-tag-btn { margin-left: 8px; cursor: pointer; font-style: normal; font-weight: bold; line-height: 1; padding: 2px; font-size: 1.2em; opacity: 0.7; }
                .gbs-remove-tag-btn:hover { opacity: 1; }
                .gbs-modal-actions { display: inline-flex; justify-content: flex-end; gap: 10px; margin-top: 15px; border-top: 1px solid #555; padding-top: 15px; flex-shrink: 0; }
                .gbs-modal-button, .gbs-modal-button-primary { padding: 8px 12px; border:none; border-radius: 10px; cursor: pointer; font-weight: bold; }
                #gbs-blacklist-toggle { min-width: 145px; text-align: center; }
                .gbs-modal-button { background-color: #444; color: #fff;  }
                .gbs-modal-button-primary { background-color: #006FFA; color: white; }
                #gbs-advanced-search-btn { margin-left: 0px; padding: 7px 15px; vertical-align: top; cursor: pointer; background: #333333; color: #EEEEEE; border: 1px solid #555555; font-weight: bold; }
                #gbs-advanced-search-btn:hover { background: #555; }
                .gbs-modifiers-section { margin-top: 15px; padding: 10px; background-color: rgba(0,0,0,0.2); border-radius: 10px; border: 1px solid #555; }
                .gbs-modifiers-title { margin: 0 0 12px 0; font-size: 1em; color: #ccc; border-bottom: 1px solid #555; padding-bottom: 5px; }
                .gbs-modifier-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
                .gbs-modifier-row label { font-weight: bold; color: #ddd; flex-basis: 30%; }
                .gbs-modifier-row select, .gbs-modifier-row input { flex-grow: 1; background: #333; border: 1px solid #555; padding: 5px; border-radius: 10px; color: #eee; width: 110px; }
                .gbs-score-group { display: flex; gap: 5px; flex-grow: 1; }
                .gbs-score-group select { width: 60px; flex-grow: 0; }
                #gbs-saved-searches-toggle-btn { position: absolute; left: 5px; top: 50%; transform: translateY(-50%); cursor: pointer; transition: color 0.2s; font-size: 1.8em }
                #gbs-saved-searches-toggle-btn:hover,
                #gbs-saved-searches-toggle-btn.active { color: #daa520 !important; }
                #gbs-modifiers-toggle-btn { position: absolute; right: 5px; top: 50%; transform: translateY(-50%); cursor: pointer; transition: color 0.2s; font-size: 1.8em; }
                #gbs-modifiers-toggle-btn:hover,
                #gbs-modifiers-toggle-btn.active { color: #006FFA !important; }
                #gbs-modifiers-panel.hidden { display: none; }
                #gbs-saved-searches-panel { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; max-height: 20vh; overflow-y: auto; }
                #gbs-saved-searches-panel.hidden { display: none; }
                .gbs-modal-saved-search { background-color: #4a4a4a; color: #ddd; padding: 4px 8px; border-radius: 10px; font-size: 1em; cursor: pointer; transition: background-color .2s, border-color .2s; user-select: none; text-shadow: 1px 1px 3px rgba(0,0,0,0.9); }
                .gbs-modal-saved-search:hover { background-color: #daa520; border-color: #daa520; color: white; }
            `);
        },
        UI: {
            createModal: function(originalInput) {
                if (document.getElementById(Config.SELECTORS.ADVANCED_SEARCH_MODAL_ID)) return;
                const modalOverlay = document.createElement('div');
                modalOverlay.id = `${Config.SELECTORS.ADVANCED_SEARCH_MODAL_ID}-overlay`;

                const modalPanel = document.createElement('div');
                modalPanel.id = Config.SELECTORS.ADVANCED_SEARCH_MODAL_ID;
                let categorySectionsHTML = `
                    <div class="gbs-category-section" id="gbs-section-main">
                        <h4 class="gbs-category-title" style="border-color: #006FFA">Tags</h4>
                        <div class="gbs-pill-container" id="gbs-pill-container-main"></div>
                    </div>
                    <div class="gbs-category-section" id="gbs-section-excluded">
                        <h4 class="gbs-category-title" style="border-color: ${Config.COLORS_CONSTANTS.excluded}">Excluded</h4>
                        <div class="gbs-pill-container" id="gbs-pill-container-excluded"></div>
                    </div>
                `;
                modalPanel.innerHTML = `
                    <h2 class="gbs-search-title">Advanced Tag Editor</h2>
                    <div class="gbs-input-wrapper">
                        <input type="text" id="gbs-tag-input" placeholder="Use '-' to exclude. Press space for '_'.">
                        <i class="fas fa-star" id="gbs-saved-searches-toggle-btn" title="Show Saved Searches"></i>
                        <i class="fas fa-cog" id="gbs-modifiers-toggle-btn" title="Show Search Modifiers"></i>
                        <div class="gbs-suggestion-container" id="gbs-main-suggestion-container"></div>
                    </div>
                    <div id="gbs-saved-searches-panel" class="hidden"></div>

                    <div id="gbs-modifiers-panel" class="gbs-modifiers-section hidden">
                        <h4 class="gbs-modifiers-title">Search Modifiers</h4>
                        <div class="gbs-modifier-row">
                            <label for="gbs-sort-select">Sort By</label>
                            <select id="gbs-sort-select">
                                <option value="">Default (ID)</option>
                                <option value="random">Random</option>
                                <option value="score">Score (High to Low)</option>
                                <option value="score:asc">Score (Low to High)</option>
                                <option value="updated:desc">Updated Date</option>
                                <option value="id:asc">ID (Ascending)</option>
                            </select>
                        </div>
                        <div class="gbs-modifier-row">
                            <label for="gbs-rating-select">Rating</label>
                            <select id="gbs-rating-select">
                                <option value="">Any</option>
                                <option value="explicit">Explicit</option>
                                <option value="questionable">Questionable</option>
                                <option value="sensitive">Sensitive</option>
                                <option value="general">General</option>
                            </select>
                        </div>
                        <div class="gbs-modifier-row">
                             <label for="gbs-score-value">Score</label>
                             <div class="gbs-score-group">
                                <select id="gbs-score-operator">
                                    <option value=">=">≥</option>
                                    <option value="<=">≤</option>
                                    <option value=">">&gt;</option>
                                    <option value="<">&lt;</option>
                                    <option value="">=</option>
                                </select>
                                <input type="number" id="gbs-score-value" placeholder="e.g., 50">
                             </div>
                        </div>
                    </div>

                    <div id="gbs-category-sections-wrapper">${categorySectionsHTML}</div>
                    <div class="gbs-modal-actions">
                        <button id="gbs-blacklist-toggle" class="gbs-modal-button" style="margin-right: auto;">Toggle Blacklist</button>
                        <button id="gbs-search-apply" class="gbs-modal-button-primary">Search</button>
                        <button id="gbs-search-close" class="gbs-modal-button">Close</button>
                    </div>
                `;
                modalOverlay.appendChild(modalPanel);
                document.body.appendChild(modalOverlay);

                const tagInput = modalPanel.querySelector('#gbs-tag-input');
                const suggestionBox = modalPanel.querySelector('#gbs-main-suggestion-container');
                const applyBtn = modalPanel.querySelector('#gbs-search-apply');
                const closeBtn = modalPanel.querySelector('#gbs-search-close');
                const blacklistToggleBtn = modalPanel.querySelector('#gbs-blacklist-toggle');

                const sortSelect = modalPanel.querySelector('#gbs-sort-select');
                const ratingSelect = modalPanel.querySelector('#gbs-rating-select');
                const scoreOp = modalPanel.querySelector('#gbs-score-operator');
                const scoreVal = modalPanel.querySelector('#gbs-score-value');

                let syncToOriginalInput = () => {
                    const regularPills = modalPanel.querySelectorAll('.gbs-pill-container .gbs-tag-pill');
                    const regularTags = Array.from(regularPills).map(pill => pill.dataset.value);

                    const modifiers = [];
                    if (sortSelect.value) {
                        modifiers.push(`sort:${sortSelect.value}`);
                    }
                    if (ratingSelect.value) {
                        modifiers.push(`rating:${ratingSelect.value}`);
                    }
                    if (scoreVal.value) {
                        modifiers.push(`score:${scoreOp.value}${scoreVal.value}`);
                    }

                    const allTags = [...modifiers, ...regularTags];
                    originalInput.value = allTags.join(' ');
                };

                sortSelect.addEventListener('change', syncToOriginalInput);
                ratingSelect.addEventListener('change', syncToOriginalInput);
                scoreOp.addEventListener('change', syncToOriginalInput);
                scoreVal.addEventListener('input', syncToOriginalInput);

                const parseAndSetModifiers = (tagsArray) => {
                    const remainingTags = [];
                    tagsArray.forEach(tag => {
                        if (tag.startsWith('sort:')) {
                            sortSelect.value = tag.substring(5);
                        } else if (tag.startsWith('rating:')) {
                            ratingSelect.value = tag.substring(7);
                        } else if (tag.startsWith('score:')) {
                            const match = tag.match(/score:([><=]*)(\d+)/);
                            if (match) {
                                const [, op, val] = match;
                                scoreOp.value = op || '';
                                scoreVal.value = val;
                            }
                        } else {
                            remainingTags.push(tag);
                        }
                    });
                    return remainingTags;
                };

                const updateBlacklistButton = () => {
                    const blacklistTags = (Settings.State.BLACKLIST_TAGS || '').trim().split(/\s+/).filter(Boolean);
                    if (blacklistTags.length === 0) {
                        blacklistToggleBtn.style.display = 'none';
                        return;
                    }
                    blacklistToggleBtn.style.display = '';
                    const tagsAsPills = Array.from(modalPanel.querySelectorAll('.gbs-tag-pill')).map(pill => pill.dataset.value);
                    const negativeBlacklistTags = blacklistTags.map(t => `-${t}`);
                    const areTagsActive = negativeBlacklistTags.every(negTag => tagsAsPills.includes(negTag));
                    if (areTagsActive) {
                        blacklistToggleBtn.textContent = 'Remove Blacklist';
                    } else {
                        blacklistToggleBtn.textContent = 'Add Blacklist';
                    }
                };
                const _determineTagInfo = async (rawTag) => {
                    const isNegative = rawTag.startsWith('-');
                    let processedTag = (isNegative ? rawTag.substring(1) : rawTag).trim();
                    let category = 'general';
                    let finalTagName = processedTag;

                    const knownMetadataTags = new Set([
                        'commentary'
                    ]);

                    const parts = processedTag.split(':');
                    if (parts.length > 1 && Object.keys(Config.COLORS_CONSTANTS).includes(parts[0])) {
                        category = parts[0];
                        finalTagName = parts.slice(1).join(':');
                    } else {
                        category = await API.fetchTagCategory(processedTag);
                    }

                    if (isNegative) category = 'excluded';
                    return {
                        fullValue: (isNegative ? '-' : '') + finalTagName,
                        tagName: finalTagName,
                        category: category
                    };
                };

                const _createPillElement = (tagInfo) => {
                    const pill = document.createElement('span');
                    pill.className = 'gbs-tag-pill';
                    pill.textContent = tagInfo.tagName.replace(/_/g, ' ');
                    pill.dataset.value = tagInfo.fullValue;
                    pill.dataset.category = tagInfo.category;
                    pill.style.backgroundColor = Config.COLORS_CONSTANTS[tagInfo.category] || '#777';

                    const removeBtn = document.createElement('i');
                    removeBtn.className = 'gbs-remove-tag-btn';
                    removeBtn.textContent = '×';
                    removeBtn.onclick = () => {
                        pill.remove();
                        syncToOriginalInput();
                        updateBlacklistButton();
                    };

                    pill.appendChild(removeBtn);
                    return pill;
                };

                const _sortPills = (container) => {
                    const order = ['artist', 'character', 'copyright', 'metadata', 'general'];
                    const pills = Array.from(container.querySelectorAll('.gbs-tag-pill'));

                    pills.sort((a, b) => {
                        const catA = a.dataset.category;
                        const catB = b.dataset.category;
                        const indexA = order.indexOf(catA);
                        const indexB = order.indexOf(catB);
                        return indexA - indexB;
                    });

                    container.innerHTML = '';
                    pills.forEach(pill => container.appendChild(pill));
                };

                const addPill = async (rawTag) => {
                    if (!rawTag || rawTag.trim() === '') return;
                    const tagInfo = await _determineTagInfo(rawTag.trim());
                    if (modalPanel.querySelector(`.gbs-tag-pill[data-value="${tagInfo.fullValue}"]`)) {
                        return;
                    }

                    const mainPillContainer = modalPanel.querySelector('#gbs-pill-container-main');
                    const excludedPillContainer = modalPanel.querySelector('#gbs-pill-container-excluded');

                    const pillElement = _createPillElement(tagInfo);

                    if (tagInfo.category === 'excluded') {
                        excludedPillContainer.appendChild(pillElement);
                    } else {
                        mainPillContainer.appendChild(pillElement);
                        _sortPills(mainPillContainer);
                    }

                    syncToOriginalInput();
                    updateBlacklistButton();
                };

                const toggleBlacklistTags = () => {
                    const blacklistTags = (Settings.State.BLACKLIST_TAGS || '').trim().split(/\s+/).filter(Boolean);
                    if (blacklistTags.length === 0) {
                        alert('Your blacklist is empty. Please add tags in the Suite Settings.');
                        return;
                    }
                    const tagsAsPills = Array.from(modalPanel.querySelectorAll('.gbs-tag-pill'));
                    const pillValues = tagsAsPills.map(pill => pill.dataset.value);
                    const negativeBlacklistTags = blacklistTags.map(t => `-${t}`);
                    const areTagsActive = negativeBlacklistTags.every(negTag => pillValues.includes(negTag));
                    if (areTagsActive) {
                        tagsAsPills.forEach(pill => {
                            if (negativeBlacklistTags.includes(pill.dataset.value)) {
                                pill.remove();
                            }
                        });
                    } else {
                        negativeBlacklistTags.forEach(negTag => {
                            if (!pillValues.includes(negTag)) {
                                addPill(negTag);
                            }
                        });
                    }
                    syncToOriginalInput();
                    updateBlacklistButton();
                };
                blacklistToggleBtn.addEventListener('click', toggleBlacklistTags);

                const quickTagsBtn = modalPanel.querySelector('#gbs-saved-searches-toggle-btn');
                const quickTagsPanel = modalPanel.querySelector('#gbs-saved-searches-panel');

                const _populateQuickTagsPanel = async (forceRefresh = false) => {
                    quickTagsPanel.innerHTML = '<span style="color: #ccc; font-style: italic;">Loading saved searches...</span>';

                    const renderTags = (searches) => {
                        quickTagsPanel.innerHTML = '';
                        if (searches && searches.length > 0) {
                            const fragment = document.createDocumentFragment();
                            searches.forEach(tag => {
                                const tagEl = document.createElement('span');
                                tagEl.className = 'gbs-modal-saved-search';
                                tagEl.textContent = tag.replace(/_/g, ' ');
                                tagEl.dataset.tag = tag;
                                tagEl.addEventListener('click', () => {
                                    tag.split(/\s+/).filter(Boolean).forEach(singleTag => addPill(singleTag));
                                });
                                fragment.appendChild(tagEl);
                            });
                            quickTagsPanel.appendChild(fragment);
                        } else {
                            quickTagsPanel.innerHTML = '<span style="color: #A43535;">No saved searches found.</span>';
                        }
                        const footer = document.createElement('div');
                        footer.style.cssText = 'margin-top: 5px; text-align: right;';
                        const refreshBtn = document.createElement('button');
                        refreshBtn.innerHTML = 'Update <i class=" fas fa-sync-alt" style="font-size: 0.8em;"></i>';
                        refreshBtn.style.cssText = 'background: none; border: none; color: #ccc; padding: 0px 10px; cursor: pointer;';
                        refreshBtn.title = 'Force the list to update. Avoid repeated clicks to prevent overloading the site and triggering temporary blocks.';
                        refreshBtn.onclick = () => _populateQuickTagsPanel(true);
                        footer.appendChild(refreshBtn);
                        quickTagsPanel.appendChild(footer);
                    };

                    if (!forceRefresh) {
                        const cachedSearches = await API.fetchSavedSearches();
                        renderTags(cachedSearches);
                    } else {
                        const freshSearches = await API.fetchSavedSearches(true);
                        renderTags(freshSearches);
                    }
                };

                quickTagsBtn.addEventListener('click', () => {
                    const isOpen = !quickTagsPanel.classList.contains('hidden');
                    if (isOpen) {
                        quickTagsPanel.classList.add('hidden');
                        quickTagsBtn.classList.remove('active');
                    } else {
                        quickTagsPanel.classList.remove('hidden');
                        quickTagsBtn.classList.add('active');
                        if (!quickTagsPanel.dataset.loaded) {
                            _populateQuickTagsPanel(false);
                            quickTagsPanel.dataset.loaded = 'true';
                        }
                    }
                });

                const modifiersToggleBtn = modalPanel.querySelector('#gbs-modifiers-toggle-btn');
                const modifiersPanel = modalPanel.querySelector('#gbs-modifiers-panel');

                modifiersToggleBtn.addEventListener('click', () => {
                    modifiersPanel.classList.toggle('hidden');
                    modifiersToggleBtn.classList.toggle('active', !modifiersPanel.classList.contains('hidden'));
                });


                const openModal = () => {
                    modalPanel.querySelector('#gbs-pill-container-main').innerHTML = '';
                    modalPanel.querySelector('#gbs-pill-container-excluded').innerHTML = '';

                    sortSelect.value = '';
                    ratingSelect.value = '';
                    scoreOp.value = '>=';
                    scoreVal.value = '';

                    const allTags = originalInput.value.trim().split(/\s+/).filter(Boolean);
                    const regularTags = parseAndSetModifiers(allTags);
                    regularTags.forEach(tag => addPill(tag));

                    _sortPills(modalPanel.querySelector('#gbs-pill-container-main'));

                    modalOverlay.style.opacity = '1';
                    modalOverlay.style.pointerEvents = 'auto';
                    tagInput.focus();
                    updateBlacklistButton();
                };
                const closeModal = () => { modalOverlay.style.opacity = '0'; modalOverlay.style.pointerEvents = 'none'; };
                tagInput.addEventListener('keydown', e => {
                    if (e.key === ' ') {
                        e.preventDefault();
                        tagInput.value += '_';
                    }
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const finalTag = tagInput.value.trim().replace(/ /g, '_');
                        addPill(finalTag);
                        tagInput.value = '';
                        suggestionBox.style.display = 'none';
                    }
                });
                tagInput.addEventListener('input', () => {
                    clearTimeout(GlobalState.searchDebounceTimeout);
                    const term = tagInput.value.trim();
                    if (term.length < 2) {
                        suggestionBox.style.display = 'none';
                        return;
                    }
                    GlobalState.searchDebounceTimeout = setTimeout(async () => {
                        const suggestions = await API.fetchTagSuggestions(term);
                        suggestionBox.innerHTML = '';
                        if (suggestions.length > 0) {
                            suggestionBox.style.display = 'block';

                            const fragment = document.createDocumentFragment();
                            suggestions.forEach(sugg => {
                                const item = document.createElement('div');
                                item.className = 'gbs-suggestion-item';

                                const labelSpan = document.createElement('span');
                                labelSpan.className = 'gbs-suggestion-label';

                                const nameSpan = document.createElement('span');
                                let category = sugg.category === 'tag' ? 'general' : sugg.category;
                                const color = Config.COLORS_CONSTANTS[category] || Config.COLORS_CONSTANTS.general;
                                nameSpan.style.color = color;
                                nameSpan.textContent = sugg.label.replace(/_/g, ' ');
                                const categorySpan = document.createElement('span');
                                categorySpan.className = 'gbs-suggestion-category';
                                categorySpan.textContent = `[${sugg.category}]`;

                                labelSpan.append(nameSpan, categorySpan);

                                const countSpan = document.createElement('span');
                                countSpan.className = 'gbs-suggestion-count';
                                countSpan.style.color = color;
                                countSpan.textContent = parseInt(sugg.post_count).toLocaleString();

                                item.append(labelSpan, countSpan);

                                item.onmousedown = (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    let tagToAdd = sugg.value;
                                    if (tagInput.value.trim().startsWith('-')) {
                                        tagToAdd = '-' + tagToAdd;
                                    }
                                    addPill(tagToAdd);
                                    tagInput.value = '';
                                    suggestionBox.style.display = 'none';
                                    tagInput.focus();
                                };
                                fragment.appendChild(item);
                            });
                            suggestionBox.appendChild(fragment);
                        } else {
                            suggestionBox.style.display = 'none';
                        }
                    }, 250);
                });

                closeBtn.addEventListener('click', closeModal);
                modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
                applyBtn.addEventListener('click', () => {
                    syncToOriginalInput();
                    closeModal();
                    originalInput.form.submit();
                });
                return { openModal };
            }
        }
    };

    // =================================================================================
    // POST MARKERS MODULE
    // =================================================================================
    const PostMarkers = {
        State: {
            requestQueue: [],
            activeRequests: 0,
            maxConcurrentRequests: 7,
            cache: {},
        },
        async init() {
            this.injectStyles();
            await this.loadCache();

            const gridContainers = document.querySelectorAll(Config.SELECTORS.THUMBNAIL_GRID_SELECTOR);

            if (gridContainers.length > 0) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                if (node.matches(Config.SELECTORS.THUMBNAIL_ANCHOR_SELECTOR)) {
                                    this.processThumbnail(node);
                                }
                                node.querySelectorAll(Config.SELECTORS.THUMBNAIL_ANCHOR_SELECTOR).forEach(this.processThumbnail.bind(this));
                            }
                        });
                    });
                });

                gridContainers.forEach(container => {
                    observer.observe(container, { childList: true, subtree: true });
                });
            } else {
                Logger.warn("[PostMarkers] No thumbnail grid container found to observe.");
            }

            document.querySelectorAll(Config.SELECTORS.THUMBNAIL_ANCHOR_SELECTOR).forEach(this.processThumbnail.bind(this));
            Logger.log("[PostMarkers] Initialized.");
        },
        injectStyles() {
            GM_addStyle(`
                .thumbnail-preview > a { position: relative !important; }
                .gbs-pool-marker-container { position: absolute; display: flex; gap: 4px; pointer-events: auto; margin-top: 3px; left: 50%; transform: translateX(-50%); body.gbs-viewer-mode-active & { display: none !important; } }
                .gbs-pool-marker { width: 18px; height: 5px; border-radius: 10px; box-shadow: 2px 2px 6px rgb(0,0,0); }
                .gbs-favorite-marker { position: absolute; top: 3px; right: 3px; font-size: 14px; color: #daa520; pointer-events: none; padding: 4px 5px; box-shadow: 0 0 4px rgba(0,0,0,0.8); border-radius: 10px; background-color: rgba(37, 37, 37, 0.9); border: 2px solid rgba(37, 37, 37, 0.2); body.gbs-viewer-mode-active & { display: none !important; } }
                body.gbs-page-pool-show .gbs-pool-marker-container { margin-top: -6px; }
                body.gbs-page-pool-show .gbs-favorite-marker { right: 13px; top: 13px; }
            `);
        },
        async loadCache() {
            const cachedData = await GM.getValue(Config.STORAGE_KEYS.POST_MARKER_CACHE, {});
            const now = Date.now();
            const cacheDuration = 15 * 60 * 1000; // 15 minutes
            const prunedCache = {};
            for (const postId in cachedData) {
                if (now - cachedData[postId].timestamp < cacheDuration) {
                    prunedCache[postId] = cachedData[postId];
                }
            }
            this.State.cache = prunedCache;
            await GM.setValue(Config.STORAGE_KEYS.POST_MARKER_CACHE, this.State.cache);
            Logger.log("[PostMarkers] Cache loaded and pruned.");
        },
        async saveCache() {
            await GM.setValue(Config.STORAGE_KEYS.POST_MARKER_CACHE, this.State.cache);
        },
        async clearCache() {
            this.State.cache = {};
            await GM.setValue(Config.STORAGE_KEYS.POST_MARKER_CACHE, {});
            Logger.log("[PostMarkers] Cache cleared manually.");
        },
        processThumbnail(thumbAnchor) {
            if (!thumbAnchor.dataset.gifProcessed) {
                const img = thumbAnchor.querySelector('img');
                if (img) {
                    const title = img.getAttribute('title') || '';
                    const isAnimated = title.includes('animated_gif') || title.includes('animated_png');
                    const isVideo = img.classList.contains('webm');
                    if (isAnimated && !isVideo) {
                        img.classList.add('gbs-animated-img');
                    }
                }
                thumbAnchor.dataset.gifProcessed = 'true';
            }
            if (thumbAnchor.dataset.postMarkersProcessed) return;
            thumbAnchor.dataset.postMarkersProcessed = 'true';

            const postId = Utils.getPostId(thumbAnchor.href);
            if (!postId) return;

            if (this.State.cache[postId]) {
                this.applyMarkers(thumbAnchor, this.State.cache[postId].data);
                return;
            }

            this.State.requestQueue.push({ postId, thumbAnchor });
            this.processQueue();
        },
        processQueue() {
            while (this.State.activeRequests < this.State.maxConcurrentRequests && this.State.requestQueue.length > 0) {
                this.State.activeRequests++;
                const { postId, thumbAnchor } = this.State.requestQueue.shift();
                this.fetchPostData(postId, thumbAnchor).finally(() => {
                    this.State.activeRequests--;
                    this.processQueue();
                });
            }
        },
        async fetchPostData(postId, thumbAnchor) {
            const postPageUrl = `https://gelbooru.com/index.php?page=post&s=view&id=${postId}`;
            const poolPageUrl = `https://gelbooru.com/index.php?page=pool&s=post-pool-list&id=${postId}`;

            try {
                const [postPageResponse, poolPageResponse] = await Promise.all([
                    Utils.makeRequest({ method: "GET", url: postPageUrl }).promise,
                    Utils.makeRequest({ method: "GET", url: poolPageUrl }).promise,
                ]);

                const postDoc = new DOMParser().parseFromString(postPageResponse.responseText, "text/html");
                const isFavorited = !!postDoc.querySelector('a[href*="s=delete"][href*="page=favorites"]');

                const poolDoc = new DOMParser().parseFromString(poolPageResponse.responseText, "text/html");
                const poolLinks = poolDoc.querySelectorAll('tbody tr a[href*="page=pool&s=show"]');
                const poolIds = Array.from(poolLinks).map(link => new URL(link.href, poolPageUrl).searchParams.get('id'));

                const data = { isFavorited, poolIds };
                this.State.cache[postId] = { data: data, timestamp: Date.now() };
                await this.saveCache();

                this.applyMarkers(thumbAnchor, data);
            } catch (error) {
                Logger.error(`[PostMarkers] Failed to fetch data for post ${postId}:`, error);
            }
        },
        applyMarkers(thumbAnchor, data) {
            // Apply Favorite Marker
            if (data.isFavorited) {
                if (!thumbAnchor.querySelector('.gbs-favorite-marker')) {
                    const favMarker = document.createElement('i');
                    favMarker.className = 'fas fa-star gbs-favorite-marker';
                    favMarker.title = 'Favorited';
                    thumbAnchor.appendChild(favMarker);
                }
            } else {
                const favMarker = thumbAnchor.querySelector('.gbs-favorite-marker');
                if (favMarker) {
                    favMarker.remove();
                }
            }

            // Apply Pool Markers
            const favoritePools = Settings.State.favoritePools || [];
            let container = thumbAnchor.querySelector('.gbs-pool-marker-container');

            if (data.poolIds && data.poolIds.length > 0 && favoritePools.length > 0) {
                const favoritePoolMap = new Map(favoritePools.map(p => [p.id, { color: p.color, name: p.name }]));
                const matchingPools = data.poolIds.filter(id => favoritePoolMap.has(id));

                if (matchingPools.length > 0) {
                    if (!container) {
                        container = document.createElement('div');
                        container.className = 'gbs-pool-marker-container';
                        thumbAnchor.appendChild(container);
                    }
                    container.innerHTML = '';

                    matchingPools.forEach(poolId => {
                        const poolInfo = favoritePoolMap.get(poolId);
                        const marker = document.createElement('div');
                        marker.className = 'gbs-pool-marker';
                        marker.style.backgroundColor = poolInfo.color;
                        container.appendChild(marker);
                    });
                } else {
                    if (container) {
                        container.remove();
                    }
                }
            } else {
                if (container) {
                    container.remove();
                }
            }
        },
    };

    // =================================================================================
    // DOWNLOADER MODULE
    // =================================================================================
    const Downloader = {
        _boundHandleThumbnailClick: null,
        State: {
            isSelectionModeActive: false,
            isDownloading: false,
            isCancelled: false,
            downloadQueue: new Set(),
            processingQueue: [],
            failedDownloads: new Set(),
            downloadStatus: new Map()
        },

        // --- Session Management ---
        resetState: function() {
            this.State.isDownloading = false;
            this.State.isCancelled = false;
            this.State.processingQueue = [];
            this.State.failedDownloads.clear();
            this.State.downloadStatus.clear();
        },

        // --- Core Download Logic ---
        downloadSinglePost: async function(thumbAnchor) {
            const pId = Utils.getPostId(thumbAnchor.href);
            if (this.State.downloadQueue.has(pId)) return;
            this.State.downloadQueue.add(pId);
            this.State.downloadStatus.set(pId, 'downloading');

            const { progressOverlay, circleFG, circumference } = this.UI.createProgressCircle();
            thumbAnchor.appendChild(progressOverlay);

            try {
                this.UI.updateThumbnailFeedback(thumbAnchor, 'downloading');
                await new Promise(r => setTimeout(r, 150));
                if (this.State.isCancelled) throw new Error('Cancelled before start');

                const media = await API.fetchMediaDetails(pId);
                const ext = new URL(media.url).pathname.split('.').pop() || 'jpg';
                const filename = `${Settings.State.DOWNLOAD_FOLDER}/post_${pId}.${ext}`;

                const { promise } = Utils.makeRequest({
                    method: "HEAD",
                    timeout: 15000,
                    url: media.url,
                });
                const headResponse = await promise;
                const headers = headResponse.responseHeaders;

                const totalSizeMatch = headers.match(/content-length:\s*(\d+)/i);
                const totalSize = totalSizeMatch ? parseInt(totalSizeMatch[1], 10) : 0;
                if (totalSize === 0) throw new Error('Could not determine file size.');

                await new Promise((resolve, reject) => {
                    GM_download({
                        url: media.url,
                        name: filename,
                        onprogress: (progress) => {
                            if (this.State.isCancelled) {
                                return reject(new Error('Cancelled during download'));
                            }
                            const percentComplete = progress.loaded / totalSize;
                            const offset = circumference * (1 - percentComplete);
                            circleFG.style.strokeDashoffset = offset;
                        },
                        onload: () => {
                            if (this.State.isCancelled) return reject(new Error('Cancelled on complete'));
                            this.UI.updateThumbnailFeedback(thumbAnchor, 'success');
                            this.State.downloadStatus.set(pId, 'success');
                            resolve();
                        },
                        onerror: (err) => reject(err),
                        ontimeout: () => reject(new Error('Timeout'))
                    });
                });
            } catch (er) {
                if (er.message && er.message.toLowerCase().includes('cancelled')) {
                    this.UI.updateThumbnailFeedback(thumbAnchor, null);
                    this.State.downloadStatus.set(pId, 'cancelled');
                    Logger.log(`Download for post ${pId} cancelled.`);
                } else {
                    this.UI.updateThumbnailFeedback(thumbAnchor, 'error');
                    this.State.downloadStatus.set(pId, 'error');
                    Logger.error(`Download failed for post ID ${pId}:`, er);
                    this.State.failedDownloads.add(pId);
                }
                throw er;
            } finally {
                progressOverlay.remove();
                this.State.downloadQueue.delete(pId);
            }
        },
        downloadWithRetries: async function(thumb, maxAttempts = 3) {
            let lastError = null;
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    await this.downloadSinglePost(thumb);
                    return;
                } catch (err) {
                    lastError = err;
                    if (err.message && err.message.toLowerCase().includes('cancelled')) {
                        throw err;
                    }
                    Logger.warn(`Download attempt ${attempt}/${maxAttempts} failed for post ${Utils.getPostId(thumb.href)}.`);
                    if (attempt < maxAttempts) {
                        await new Promise(r => setTimeout(r, 2000 * attempt));
                    }
                }
            }
            throw lastError;
        },
        startDownloadAllProcess: async function() {
            if (this.State.isDownloading) {
                this.State.isCancelled = true;
                const btn = document.getElementById('gbs-fab-download-all');
                if (btn) {
                    btn.querySelector('.gbs-fab-text').textContent = 'Cancelling...';
                    btn.disabled = true;
                }
                return;
            }

            const allThumbs = Array.from(document.querySelectorAll(Config.SELECTORS.MEDIA_VIEWER_THUMBNAIL_ANCHOR));
            if (allThumbs.length === 0) {
                Logger.warn('No items on the page to download.');
                return;
            }

            const blocker = document.createElement('div');
            blocker.id = 'gbs-page-blocker';
            document.body.appendChild(blocker);
            setTimeout(() => { blocker.style.opacity = '1'; }, 10);

            this.resetState();

            this.State.isDownloading = true;
            this.State.isCancelled = false;
            document.getElementById('gbs-fab-select').disabled = true;
            this.UI.updateDownloadAllButton(true);
            this.UI.toggleMenuTriggerCursor(true);
            this.UI.showProgressBar(true);
            this.UI.updateProgressBar(0, 0, allThumbs.length);
            this.UI.resetThumbnailsFeedback();

            this.State.processingQueue = [...allThumbs];
            Logger.log(`Starting download for ${allThumbs.length} posts.`);

            let s = 0, e = 0;
            const t = allThumbs.length;
            const MAX_CONCURRENCY = 6;
            this.UI.updateProgressBar(s, e, t);

            const processQueue = async () => {
                while (this.State.processingQueue.length > 0 && !this.State.isCancelled) {
                    const thumb = this.State.processingQueue.shift();
                    try {
                        await this.downloadWithRetries(thumb);
                        s++;
                    } catch(err) {
                        if (!err.message?.toLowerCase().includes('cancelled')) {
                            e++;
                        }
                    } finally {
                        this.UI.updateProgressBar(s, e, t);
                        await new Promise(r => setTimeout(r, 300 + Math.random() * 500));
                    }
                }
            };

            const workers = Array.from({ length: Math.min(MAX_CONCURRENCY, this.State.processingQueue.length) }, processQueue);
            await Promise.allSettled(workers);
            this.finishDownloadProcess(s, e, t);
        },
        finishDownloadProcess: function(s, e, t) {
            const blocker = document.getElementById('gbs-page-blocker');
            if (blocker) blocker.remove();

            if (this.State.isCancelled) {
                Logger.log('Download process cancelled by user.');
            } else {
                Logger.log(`Download process completed. Success: ${s}, Errors: ${e}, Total: ${t}`);
            }

            this.UI.showCompletionModal(Array.from(this.State.failedDownloads));
            this.UI.toggleActionButtons(true);
            document.getElementById('gbs-fab-download-all').disabled = false;
            this.UI.updateDownloadAllButton(false);
            this.UI.toggleMenuTriggerCursor(false);
            this.UI.showProgressBar(false);
            this.resetState();
        },
        UI: {
            toggleActionButtons: (enable) => {
                document.getElementById('gbs-fab-select').disabled = !enable;
                document.getElementById('gbs-fab-download-all').disabled = !enable;
            },
            showProgressBar: (show) => {
                const el = document.getElementById('gbs-progress-bar-container');
                if (el) {
                    el.style.display = show ? 'flex' : 'none';
                    if (show) Downloader.UI.updateProgressBar(0, 0, 1);
                }
            },
            updateProgressBar: (s, e, t) => {
                const p = t > 0 ? ((s + e) / t) * 100 : 0;
                const fill = document.querySelector('#gbs-progress-bar-container .gbs-progress-bar-fill');
                const text = document.querySelector('#gbs-progress-bar-container .gbs-progress-bar-text');
                if (!fill || !text) return;
                fill.style.width = `${p}%`;
                if (e > 0) {
                    fill.style.backgroundColor = '#A43535';
                    text.textContent = `Downloading... (${s}/${t-e}) (Errors: ${e})`;
                } else {
                    fill.style.backgroundColor = '#008450';
                    text.textContent = `Downloading... (${s}/${t})`;
                }
            },
            updateDownloadAllButton: (isDownloading) => {
                const btn = document.getElementById('gbs-fab-download-all');
                if (!btn) return;
                const btnText = btn.querySelector('.gbs-fab-text');
                if (isDownloading) {
                    btnText.textContent = 'Cancel';
                    btn.classList.add('gbs-btn-cancel');
                } else {
                    btnText.textContent = 'All';
                    btn.classList.remove('gbs-btn-cancel');
                }
            },
            updateThumbnailFeedback: (thumb, status) => {
                if (thumb) {
                    thumb.classList.remove('gbs-thumb-selected', 'gbs-thumb-success', 'gbs-thumb-error', 'gbs-thumb-downloading');
                    if (status) thumb.classList.add(`gbs-thumb-${status}`);
                }
            },
            resetThumbnailsFeedback: () => {
                document.querySelectorAll('.gbs-thumb-success, .gbs-thumb-error, .gbs-thumb-selected, .gbs-thumb-downloading').forEach(el => {
                    el.classList.remove('gbs-thumb-success', 'gbs-thumb-error', 'gbs-thumb-selected', 'gbs-thumb-downloading');
                });
            },
            toggleMenuTriggerCursor: (isBlocked) => {
                document.getElementById('gbs-downloader-trigger')?.classList.toggle('is-blocked', isBlocked);
            },
            createProgressCircle: function() {
                const svgNS = "http://www.w3.org/2000/svg";
                const progressOverlay = document.createElement('div');
                progressOverlay.className = 'gbs-progress-overlay';
                const svg = document.createElementNS(svgNS, 'svg');
                svg.setAttribute('viewBox', '0 0 50 50');
                svg.style.width = '60%'; svg.style.height = '60%';
                const circleBG = document.createElementNS(svgNS, 'circle');
                circleBG.setAttribute('cx', '25'); circleBG.setAttribute('cy', '25'); circleBG.setAttribute('r', '20'); circleBG.setAttribute('fill', 'transparent'); circleBG.setAttribute('stroke-width', '5');
                circleBG.setAttribute('class', 'gbs-progress-circle-bg');
                const circleFG = circleBG.cloneNode();
                circleFG.setAttribute('class', 'gbs-progress-circle-fg');
                const circumference = 2 * Math.PI * 20;
                Object.assign(circleFG.style, { strokeDasharray: circumference, strokeDashoffset: circumference });
                svg.append(circleBG, circleFG);
                progressOverlay.appendChild(svg);
                return { progressOverlay, circleFG, circumference };
            },
            showCompletionModal: function(failedIds) {
                if (failedIds.length === 0) {
                    alert('All downloads on this page completed successfully!');
                    return;
                }
                if (document.getElementById('gbs-completion-modal')) return;
                const modalHTML = `
                <div id="gbs-completion-modal-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 100000; display: flex; align-items: center; justify-content: center; font-family: sans-serif;">
                    <div id="gbs-completion-modal" style="background-color: #252525; color: #eee; padding: 20px; border-radius: 10px; width: 90%; max-width: 500px; text-align: center;">
                        <h3 style="margin-top: 0; border-bottom: 1px solid #555; padding-bottom: 10px;">Download Process Finished</h3>
                        <p>The following posts could not be downloaded. You can copy the IDs for a manual check:</p>
                        <textarea readonly style="width: 95%; height: 150px; background: #333; color: #fff; border: 1px solid #555; resize: none; margin-top: 10px;">${failedIds.join(' ')}</textarea>
                        <button id="gbs-completion-close" style="margin-top: 15px; padding: 8px 16px; background-color: #007BFF; color: white; border: none; border-radius: 10px; cursor: pointer;">Close</button>
                    </div>
                </div>`;
                document.body.insertAdjacentHTML('beforeend', modalHTML);
                document.getElementById('gbs-completion-close').addEventListener('click', () => {
                    document.getElementById('gbs-completion-modal-overlay').remove();
                });
            },
        },
        toggleSelectionMode: function() {
            if (this.State.isDownloading) return;
            this.State.isSelectionModeActive = !this.State.isSelectionModeActive;
            document.body.classList.toggle('gbs-selection-active', this.State.isSelectionModeActive);
            this.UI.toggleMenuTriggerCursor(this.State.isSelectionModeActive);

            const selectButton = document.getElementById('gbs-fab-select');
            selectButton.querySelector('.gbs-fab-text').textContent = this.State.isSelectionModeActive ? 'Cancel' : 'Select';
            selectButton.classList.toggle('active', this.State.isSelectionModeActive);

            if (this.State.isSelectionModeActive) {
                document.body.addEventListener('click', this._boundHandleThumbnailClick, true);
            } else {
                document.body.removeEventListener('click', this._boundHandleThumbnailClick, true);
                this.UI.resetThumbnailsFeedback();
            }
        },
        handleThumbnailClick: function(event) {
            const deleteModeCheckbox = document.getElementById('del-mode');
            if (deleteModeCheckbox && deleteModeCheckbox.checked) {
                return;
            }

            if (MediaViewer.State.isLargeViewActive) return;
            if (!this.State.isSelectionModeActive) return;

            const thumbAnchor = event.target.closest(Config.SELECTORS.MEDIA_VIEWER_THUMBNAIL_ANCHOR);
            if (!thumbAnchor) return;
            event.preventDefault();
            event.stopPropagation();
            this.downloadSinglePost(thumbAnchor);
        },
        injectUI: function() {
            GM_addStyle(`
            #gbs-downloader-wrapper { position: fixed; bottom: 4%; right: 4px; z-index: 9998; }
            #gbs-downloader-trigger { color: #fff !important; position: static; transform: none; width: 40px; height: 40px; padding: 5px; background-color: rgba(37, 37, 37, 0.8); border: 2px solid rgba(51, 51, 51, 0.5); border-radius: 10px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease, border-color 0.2s ease; box-sizing: border-box !important; }
            #gbs-downloader-wrapper:hover #gbs-downloader-trigger, #gbs-downloader-trigger:hover { background-color: #006FFA; border-color: #006FFA; }
            #gbs-downloader-wrapper.menu-open #gbs-downloader-trigger { background-color: rgba(37, 37, 37, 0.8); border-color: rgba(51, 51, 51, 0.5); }
            #gbs-downloader-wrapper.menu-open #gbs-downloader-trigger:hover { background-color: #A43535; border-color: #A43535; }
            #gbs-downloader-trigger.is-blocked { cursor: not-allowed !important; background-color: rgba(37, 37, 37, 0.8) !important; border-color: rgba(51, 51, 51, 0.5) !important; opacity: 0.6; }
            #gbs-action-list { position: absolute; top: 50%; right: 100%; transform: translateY(-50%) scale(0.95); margin-right: 15px; display: flex; align-items: flex-end; gap: 5px; opacity: 0; transition: opacity 0.2s ease, transform 0.2s ease; pointer-events: none; }
            #gbs-downloader-wrapper.menu-open #gbs-action-list { opacity: 1; transform: translateY(-50%) scale(1); pointer-events: auto; }
            .gbs-selection-active body, .gbs-selection-active .thumbnail-preview a, .gbs-selection-active .thumbnail-container > span > a { cursor: crosshair !important; }
            .thumbnail-preview > a, .thumbnail-container > span > a { display:inline-block; line-height:0; position:relative; transition:transform 0.2s, box-shadow 0.2s; }
            .gbs-thumb-downloading { transform:scale(0.95); border-radius: 10px !important; overflow:hidden; outline: 4px solid #EFB700 !important; }
            .gbs-thumb-success { border-radius: 10px !important; overflow:hidden; outline: 4px solid #008450 !important; }
            .gbs-thumb-error { border-radius: 10px !important; overflow:hidden; outline: 4px solid #B81D13 !important; }
            .gbs-thumb-success::after, .gbs-thumb-error::after { content:''; position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; font-size:50px; color:white; text-shadow:0 0 5px black; }
            .gbs-thumb-success::after { background-color:rgba(40, 167, 69, 0.7); content:'✔'; }
            .gbs-thumb-error::after { background-color:rgba(220, 53, 69, 0.7); content:'✖'; }
            #gbs-progress-bar-container { position:fixed; bottom:0; left:0; width:100%; height:25px; background-color:#333; z-index:99999; display:none; align-items:center; border-top:1px solid #555; }
            .gbs-progress-bar-fill { background-color:#008450; height:100%; width:0%; transition:width 0.3s ease-in-out; }
            .gbs-progress-bar-text { position:absolute; width:100%; text-align:center; color:white; font-weight:bold; text-shadow:1px 1px 1px #000; z-index:10; }
            .gbs-progress-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; pointer-events: none; background-color: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.2s ease-in-out; }
            .gbs-thumb-downloading .gbs-progress-overlay { opacity: 1; }
            .gbs-progress-circle-bg { stroke: rgba(255,255,255,0.2); }
            .gbs-progress-circle-fg { stroke: #EFB700; transform: rotate(-90deg); transform-origin: 50% 50%; transition: stroke-dashoffset 0.1s linear; }
            #gbs-page-blocker { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); cursor: progress; z-index: 9997; opacity: 0; transition: opacity 0.3s ease-in-out; }
        `);

            document.body.insertAdjacentHTML('beforeend', `
            <div id="gbs-downloader-wrapper">
                <button id="gbs-downloader-trigger" title="Downloader Menu"><i class="fas fa-download"></i></button>
                <div id="gbs-action-list">
                    <button id="gbs-fab-download-all" class="gbs-fab-action-btn"><span class="gbs-fab-text">All</span></button>
                    <button id="gbs-fab-select" class="gbs-fab-action-btn"><span class="gbs-fab-text">Select</span></button>
                </div>
            </div>
            <div id="gbs-progress-bar-container" style="display: none;"><div class="gbs-progress-bar-text"></div><div class="gbs-progress-bar-fill"></div></div>
        `);
        },
        setupEventListeners: function() {
            this._boundHandleThumbnailClick = this.handleThumbnailClick.bind(this);

            const wrapper = document.getElementById('gbs-downloader-wrapper');
            const menuTrigger = document.getElementById('gbs-downloader-trigger');

            menuTrigger.addEventListener('click', (event) => {
                if (this.State.isDownloading || this.State.isSelectionModeActive) return;
                event.stopPropagation();
                wrapper.classList.toggle('menu-open');
                if (!wrapper.classList.contains('menu-open')) {
                    this.UI.showProgressBar(false);
                    this.UI.resetThumbnailsFeedback();
                }
            });

            document.getElementById('gbs-fab-download-all').addEventListener('click', () => this.startDownloadAllProcess());
            document.getElementById('gbs-fab-select').addEventListener('click', () => this.toggleSelectionMode());
        },
        toggleVisibility: function(visible) {
            const wrapper = document.getElementById('gbs-downloader-wrapper');
            if (wrapper) {
                wrapper.style.display = visible ? 'block' : 'none';
                Logger.log(`Downloader UI visibility set to: ${visible}`);
            }
        },
        init: function() {
            const isPoolPage = window.location.search.includes('page=pool');
            const isGalleryPage = window.location.search.includes('page=post&s=list');
            if (!isPoolPage && !isGalleryPage) return;

            this.injectUI();
            this.setupEventListeners();
            Logger.log('Downloader: Side-drawer UI initialized.');
        }
    };

    // =================================================================================
    // ADD TO POOL/FAVORITES MODULE
    // =================================================================================
    const AddToPool = {
        _boundHandleThumbnailClick: null,
        State: {
            selectionMode: null,
            favoritePools: [],
            activePoolId: null,
        },
        elements: {},
        async init() {
            const isGalleryPage = window.location.search.includes('page=post&s=list') || window.location.search.includes('page=pool');
            if (!isGalleryPage) return;

            await this.loadFavoritePools();

            this.injectUI();
            this.renderPoolSelectionUI();
            this.setupEventListeners();
        },
        async loadFavoritePools() {
            this.State.favoritePools = await GM.getValue(Config.STORAGE_KEYS.FAVORITE_POOLS, []);
            if (this.State.favoritePools.length > 0) {
                this.State.activePoolId = this.State.favoritePools[0].id;
                Logger.log(`[AddToPool] Loaded ${this.State.favoritePools.length} favorite pools.`);
            }
        },
        renderPoolSelectionUI() {
            const selector = this.elements.poolSelector;
            if (!selector) return;
            selector.innerHTML = '';

            const defaultBgColor = '#343a40';
            selector.style.backgroundColor = defaultBgColor;

            this.State.favoritePools.forEach(pool => {
                const option = document.createElement('option');
                option.value = pool.id;
                option.textContent = pool.name;

                const poolColor = pool.color || defaultBgColor;
                option.style.backgroundColor = poolColor;
                option.style.color = this._getContrastingTextColor(poolColor);

                if (pool.id === this.State.activePoolId) {
                    option.selected = true;
                }
                selector.appendChild(option);
            });

            this._updatePoolSelectorColor();
        },
        _getContrastingTextColor(hex) {
            if (!hex) return '#FFFFFF';
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5 ? '#111111' : '#FFFFFF';
        },
        _updatePoolSelectorColor() {
            if (!this.elements.poolSelector || !this.State.activePoolId) return;
            const selectedPool = this.State.favoritePools.find(p => p.id === this.State.activePoolId);
            const color = selectedPool ? (selectedPool.color || '#FFFFFF') : '#FFFFFF';
            this.elements.poolSelector.style.borderLeftColor = color;
        },
        injectUI() {
            GM_addStyle(`
            #gbs-pool-wrapper { position: fixed; bottom: 15%; right: 4px; z-index: 9998; }
            #gbs-pool-trigger { color: #fff !important; position: static; transform: none; width: 40px; height: 40px; padding: 5px; background-color: rgba(37, 37, 37, 0.8); border: 2px solid rgba(51, 51, 51, 0.5); border-radius: 10px; cursor: pointer; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background-color 0.2s ease, border-color 0.2s ease; box-sizing: border-box !important; }
            #gbs-pool-wrapper:hover #gbs-pool-trigger, #gbs-pool-trigger:hover { background-color: #006FFA; border-color: #006FFA; }
            #gbs-pool-wrapper.menu-open #gbs-pool-trigger { background-color: rgba(37, 37, 37, 0.8); border-color: rgba(51, 51, 51, 0.5); }
            #gbs-pool-wrapper.menu-open #gbs-pool-trigger:hover { background-color: #A43535; border-color: #A43535; }
            #gbs-pool-trigger.is-blocked { cursor: not-allowed !important; background-color: rgba(37, 37, 37, 0.8) !important; border-color: rgba(51, 51, 51, 0.5) !important; opacity: 0.6; }
            #gbs-pool-action-list { position: absolute; top: 50%; right: 100%; transform: translateY(-50%) scale(0.95); margin-right: 15px; gap: 5px; display: flex; flex-direction: column; align-items: flex-end; opacity: 0; transition: opacity 0.2s ease, transform 0.2s ease; pointer-events: none; width: 155px; }
            #gbs-pool-wrapper.menu-open #gbs-pool-action-list { opacity: 1; transform: translateY(-50%) scale(1); pointer-events: auto; }
            #gbs-pool-selector:focus { outline: none; border-color: #007BFF; }
            #gbs-pool-selector { background-color: #343a40; color: #fff; border: none; border-radius: 10px; font-weight: bold; cursor: pointer; width: 100%; box-sizing: border-box; padding: 11px 12px 11px 4px; border-left: 8px solid transparent; transition: border-left-color 0.2s ease-in-out; }
            body.gbs-pool-select-mode-active .thumbnail-preview img,
            body.gbs-pool-select-mode-active .thumbnail-container > span > a { cursor: crosshair !important; }
            .thumbnail-container > span > a { display: inline-block; line-height: 0; }
            .gbs-pool-add-notification { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 132, 80, 0.8); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; z-index: 10; border-radius: 10px; pointer-events: none; opacity: 0; transition: opacity 0.3s; }
            .gbs-pool-remove-notification { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(164, 53, 53, 0.8); color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; z-index: 10; border-radius: 10px; pointer-events: none; opacity: 0; transition: opacity 0.3s; }
            #gbs-pool-button-container { display: flex; gap: 5px; width: 100%; }
            #gbs-pool-remove-mode-btn { background-color: #A43535; }
            #gbs-pool-remove-mode-btn:hover { background-color: #e74c3c; }
            #gbs-pool-favorite-mode-btn { background-color: #daa520; }
            #gbs-pool-favorite-mode-btn:hover { background-color: #f0c040; }
            #gbs-pool-cancel-btn { width: 100%; box-sizing: border-box; }
        `);

            const wrapper = document.createElement('div');
            wrapper.id = 'gbs-pool-wrapper';
            wrapper.innerHTML = `
            <button id="gbs-pool-trigger" title="Add to Pool/Favorites Menu"><i class="fas fa-folder-plus"></i></button>
            <div id="gbs-pool-action-list">
                <select id="gbs-pool-selector" style="${this.State.favoritePools.length === 0 ? 'display: none;' : ''}"></select>

                <div id="gbs-pool-button-container">
                    <button id="gbs-pool-favorite-mode-btn" class="gbs-fab-action-btn" style="flex: 1; min-width: 0; padding: 10px 5px;">
                        <span i class="fas fa-star"></span>
                    </button>
                    <button id="gbs-pool-add-mode-btn" class="gbs-fab-action-btn" style="flex: 1; min-width: 0; padding: 10px 5px; ${this.State.favoritePools.length === 0 ? 'display: none;' : ''}">
                        <span i class="fas fa-plus"></span>
                    </button>
                    <button id="gbs-pool-remove-mode-btn" class="gbs-fab-action-btn" style="flex: 1; min-width: 0; padding: 10px 5px; ${this.State.favoritePools.length === 0 ? 'display: none;' : ''}">
                        <span i class="fas fa-times"></span>
                    </button>
                </div>

                <button id="gbs-pool-cancel-btn" class="gbs-fab-action-btn active" style="display: none;">
                    <span class="gbs-fab-text">Cancel</span>
                </button>
            </div>
        `;
            document.body.appendChild(wrapper);

            this.elements = {
                wrapper,
                trigger: wrapper.querySelector('#gbs-pool-trigger'),
                favoriteModeButton: wrapper.querySelector('#gbs-pool-favorite-mode-btn'),
                addModeButton: wrapper.querySelector('#gbs-pool-add-mode-btn'),
                removeModeButton: wrapper.querySelector('#gbs-pool-remove-mode-btn'),
                cancelButton: wrapper.querySelector('#gbs-pool-cancel-btn'),
                buttonContainer: wrapper.querySelector('#gbs-pool-button-container'),
                poolSelector: wrapper.querySelector('#gbs-pool-selector'),
            };
        },
        setupEventListeners() {
            this._boundHandleThumbnailClick = this.handleThumbnailClick.bind(this);

            this.elements.trigger.addEventListener('click', (event) => {
                if (this.State.selectionMode) return;
                event.stopPropagation();
                this.elements.wrapper.classList.toggle('menu-open');
            });

            this.elements.favoriteModeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSelectionMode('favorite');
            });

            this.elements.poolSelector.addEventListener('change', (e) => {
                this.State.activePoolId = e.target.value;
                Logger.log(`[AddToPool] Active pool set to ID: ${this.State.activePoolId}`);
                this._updatePoolSelectorColor();
            });

            this.elements.addModeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSelectionMode('add');
            });

            this.elements.removeModeButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSelectionMode('remove');
            });

            this.elements.cancelButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSelectionMode(null);
            });
        },
        toggleSelectionMode(mode) {
            this.State.selectionMode = mode;

            const isModeActive = (mode === 'add' || mode === 'remove' || mode === 'favorite');
            const buttonText = this.elements.cancelButton.querySelector('.gbs-fab-text');

            this.elements.buttonContainer.style.display = isModeActive ? 'none' : 'flex';
            this.elements.cancelButton.style.display = isModeActive ? 'block' : 'none';
            this.elements.trigger.classList.toggle('is-blocked', isModeActive);
            document.body.classList.toggle('gbs-pool-select-mode-active', isModeActive);

            if (isModeActive) {
                if (mode === 'add') {
                    buttonText.textContent = 'Cancel (Adding)';
                } else if (mode === 'remove') {
                    buttonText.textContent = 'Cancel (Removing)';
                } else if (mode === 'favorite') {
                    buttonText.textContent = 'Cancel (Favoriting)';
                }

                document.body.addEventListener('click', this._boundHandleThumbnailClick, true);

            } else {
                document.body.removeEventListener('click', this._boundHandleThumbnailClick, true);
            }
        },
        async handleThumbnailClick(event) {
            const deleteModeCheckbox = document.getElementById('del-mode');
            if (deleteModeCheckbox && deleteModeCheckbox.checked) {
                return;
            }

            if (MediaViewer.State.isLargeViewActive) return;

            const self = AddToPool;
            if (!self.State.selectionMode) return;

            const thumbAnchor = event.target.closest(Config.SELECTORS.MEDIA_VIEWER_THUMBNAIL_ANCHOR);
            if (!thumbAnchor) return;

            event.preventDefault();
            event.stopPropagation();

            if (self.State.selectionMode !== 'favorite' && !self.State.activePoolId) {
                alert('Please select a target pool from the list first.');
                self.elements.wrapper.classList.add('menu-open');
                return;
            }

            const postId = Utils.getPostId(thumbAnchor.href);
            if (!postId) return;

            let notificationClass = '';
            let notificationText = '';

            try {
                if (self.State.selectionMode === 'add') {
                    const script = document.createElement('script');
                    script.textContent = `(() => {
                        const originalPrompt = window.prompt;
                        window.prompt = () => '${self.State.activePoolId}';
                        if (typeof addToPoolID === 'function') {
                            addToPoolID(${postId});
                        }
                        window.prompt = originalPrompt;
                    })();`;
                    document.body.appendChild(script).remove();

                    notificationClass = 'gbs-pool-add-notification';
                    notificationText = 'Added!';

                    if (Settings.State.ENABLE_POST_MARKERS && typeof PostMarkers !== 'undefined') {
                        const addedPoolId = self.State.activePoolId;
                        if (PostMarkers.State.cache[postId]) {
                            const data = PostMarkers.State.cache[postId].data;
                            if (!data.poolIds.includes(addedPoolId)) {
                                data.poolIds.push(addedPoolId);
                                PostMarkers.applyMarkers(thumbAnchor, data);
                                PostMarkers.saveCache();
                            }
                        }
                    }

                } else if (self.State.selectionMode === 'remove') {
                    const removalUrl = `https://gelbooru.com/public/remove.php?removepool_post=1&pool_id=${self.State.activePoolId}&id=${postId}`;
                    await Utils.makeRequest({
                        method: "GET",
                        url: removalUrl,
                        headers: { "X-Requested-With": "XMLHttpRequest" }
                    }).promise;

                    notificationClass = 'gbs-pool-remove-notification';
                    notificationText = 'Removed!';

                    if (Settings.State.ENABLE_POST_MARKERS && typeof PostMarkers !== 'undefined') {
                        const removedPoolId = self.State.activePoolId;
                        if (PostMarkers.State.cache[postId]) {
                            const data = PostMarkers.State.cache[postId].data;
                            const initialLength = data.poolIds.length;
                            data.poolIds = data.poolIds.filter(id => id !== removedPoolId);

                            if (data.poolIds.length !== initialLength) {
                                PostMarkers.applyMarkers(thumbAnchor, data);
                                PostMarkers.saveCache();
                            }
                        }
                    }

                } else if (self.State.selectionMode === 'favorite') {
                    const postUrl = `https://gelbooru.com/index.php?page=post&s=view&id=${postId}`;
                    const { promise } = Utils.makeRequest({ method: "GET", url: postUrl });
                    const response = await promise;
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");

                    const unfavLink = doc.querySelector('a[href*="s=delete"][href*="page=favorites"]');

                    if (unfavLink) {
                        const removalUrl = new URL(unfavLink.href, window.location.origin).href;
                        await Utils.makeRequest({
                            method: "GET",
                            url: removalUrl,
                            headers: { "X-Requested-With": "XMLHttpRequest" }
                        }).promise;

                        notificationClass = 'gbs-pool-remove-notification';
                        notificationText = 'Unfavorited!';

                        if (Settings.State.ENABLE_POST_MARKERS && typeof PostMarkers !== 'undefined' && PostMarkers.State.cache[postId]) {
                            PostMarkers.State.cache[postId].data.isFavorited = false;
                            PostMarkers.saveCache();
                            const marker = thumbAnchor.querySelector('.gbs-favorite-marker');
                            if (marker) marker.remove();
                        }

                    } else {
                        const addFavLink = Array.from(doc.querySelectorAll('#tag-list a')).find(a => a.textContent.includes('Add to favorites'));

                        if (addFavLink) {
                            const script = document.createElement('script');
                            script.textContent = `if (typeof addFav === 'function') { addFav(${postId}); }`;
                            document.body.appendChild(script).remove();

                            notificationClass = 'gbs-pool-add-notification';
                            notificationText = 'Favorited!';

                            if (Settings.State.ENABLE_POST_MARKERS && typeof PostMarkers !== 'undefined' && PostMarkers.State.cache[postId]) {
                                PostMarkers.State.cache[postId].data.isFavorited = true;
                                PostMarkers.saveCache();
                                if (!thumbAnchor.querySelector('.gbs-favorite-marker')) {
                                    const favMarker = document.createElement('i');
                                    favMarker.className = 'fas fa-star gbs-favorite-marker';
                                    favMarker.title = 'Favorited';
                                    thumbAnchor.appendChild(favMarker);
                                }
                            }
                        } else {
                            Logger.warn(`[AddToPool] Could not find the 'Add to favorites' link to the post ${postId}.`);
                            notificationClass = 'gbs-pool-remove-notification';
                            notificationText = 'Error?';
                        }
                    }
                }


                if (notificationClass) {
                    const notif = document.createElement('div');
                    notif.className = notificationClass;
                    notif.textContent = notificationText;
                    thumbAnchor.style.position = 'relative';
                    thumbAnchor.appendChild(notif);
                    setTimeout(() => { notif.style.opacity = '1'; }, 10);
                    setTimeout(() => {
                        notif.style.opacity = '0';
                        setTimeout(() => notif.remove(), 300);
                    }, 1500);
                }

            } catch (error) {
                let errorAction = self.State.selectionMode;
                if (errorAction !== 'favorite') {
                    errorAction += ` from pool ${self.State.activePoolId}`;
                }
                Logger.error(`Failed to ${errorAction} post ${postId}:`, error);
            }
        },
        toggleVisibility: function(visible) {
            const wrapper = document.getElementById('gbs-pool-wrapper');
            if (wrapper) {
                wrapper.style.display = visible ? 'block' : 'none';
                Logger.log(`AddToPool UI visibility set to: ${visible}`);
            }
        },
    };

    // =================================================================================
    // MEDIA VIEWER MODULE
    // =================================================================================
    const MediaViewer = {
        _boundKeyDownHandler: null,
        _isNavigating: false,
        elements: {},
        State: {
            isLargeViewActive: false,
            currentImageIndex: -1,
            largeMediaElements: [],
            thumbnailAnchors: [],
            inactivityTimer: null,
            _boundResetMouseInactivityTimer: null,
            _boundHandleViewerMouseMove: null,
            _lazyLoadObserver: null,
            currentPoolPopup: null,
            originalScrollY: 0,
            postDataCache: new Map(),
            isUiPinned: false,
            lastMousePos: { x: 0, y: 0 },
            resizeTimer: null,
            _boundResizeHandler: null,
        },
        init() {
            const isPoolPage = window.location.search.includes('page=pool');
            const isGalleryPage = window.location.search.includes('page=post&s=list');
            if (!isPoolPage && !isGalleryPage) return;
            this.State.thumbnailAnchors = Array.from(document.querySelectorAll(Config.SELECTORS.MEDIA_VIEWER_THUMBNAIL_ANCHOR));
            this.injectUI();
            this.setupEventListeners();
            document.body.addEventListener('click', this.handleThumbnailClick.bind(this), true);
        },
        injectUI() {
            GM_addStyle(`
            body.gbs-viewer-mode-active #container { display: block !important; }
            body.gbs-viewer-mode-active section.aside { display: none !important; }
            body.gbs-hide-viewer-cursor, body.gbs-hide-viewer-cursor * { cursor: none !important; }
            .gbs-large-view-active.thumbnail-container > div[style*="text-align: center"] { display: none !important; }

            .gbs-large-view-active.thumbnail-container { display: block !important; }
            .gbs-large-view-active.thumbnail-container > .thumbnail-preview { width: 100vw !important; max-width: none !important; height: 100vh !important; display: flex !important; justify-content: center !important; align-items: center !important; padding: 0 !important; margin: 0 !important; }
            .gbs-large-view-active.thumbnail-container > span { height: 100vh; display: flex; justify-content: center; align-items: center; }
            .gbs-large-view-active.thumbnail-container a { pointer-events: none !important; }
            .gbs-large-view-media { max-width: 100vw !important; max-height: 100vh !important; object-fit: contain; pointer-events: auto !important; border-radius: 0px !important; }
            video.gbs-large-view-media { max-height: 85vh !important; }

            .gbs-viewer-nav-item { color: #fff; background-color: rgba(37, 37, 37, 0.8); padding: 5px; border-radius: 10px; border: 2px solid rgba(51, 51, 51, 0.5); width: 45px; height: 40px; display: flex; align-items: center; justify-content: center; box-sizing: border-box !important; transition: background-color 0.2s, border-color 0.2s ease; }
            .gbs-viewer-nav-btn { font-size: 24px; cursor: pointer; }
            .gbs-viewer-nav-btn:hover { background-color: #333; border-color: #333; }
            #gbs-viewer-nav-counter { font-size: 11px; font-weight: bold; user-select: none; height: 30px;}
            #gbs-viewer-nav-container { position: fixed; top: 80%; right: 4px; z-index: 99999; display: none; flex-direction: column; gap: 5px; }
            #gbs-viewer-nav-container.visible { display: flex; }

            #gbs-viewer-top-controls { position: fixed; top: 50%; right: 4px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; }
            #gbs-viewer-btn, #gbs-viewer-show-info-btn, #gbs-viewer-open-post-btn { color: #fff !important; position: static; transform: none; width: 45px; height: 45px; padding: 5px; background-color: rgba(37, 37, 37, 0.8); border: 2px solid rgba(51, 51, 51, 0.5); border-radius: 10px; cursor: pointer; font-size: 18px; display: none; align-items: center; justify-content: center; transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease; }
            #gbs-viewer-show-info-btn, #gbs-viewer-open-post-btn { display: none; }
            #gbs-viewer-btn:hover, #gbs-viewer-show-info-btn:hover, #gbs-viewer-open-post-btn:hover { background-color: #006FFA; border-color: #006FFA; }
            #gbs-viewer-btn.active { background-color: rgba(37, 37, 37, 0.8); border-color: rgba(51, 51, 51, 0.5); }
            #gbs-viewer-btn.active:hover { background-color: #A43535; border-color: #A43535; }
            #gbs-viewer-show-info-btn.active { color: #006FFA !important; border-color: #006FFA; }
            #gbs-viewer-show-info-btn.active:hover { color: white !important; }
            #gbs-viewer-top-controls, #gbs-viewer-nav-container { transition: opacity 0.3s ease-in-out; }
            #gbs-viewer-pin-btn {background: none !important; border: none !important; color: #fff !important; opacity: 0.6; font-size: 12px; cursor: pointer; width: 45px; height: 25px; margin-top: -205px; align-items: center; justify-content: center; display: none; transition: opacity 0.2s ease, transform 0.2s ease; }
            #gbs-viewer-pin-btn:hover { opacity: 1; }
            #gbs-viewer-pin-btn.active { opacity: 1; transform:  rotate(45deg);}

            #gbs-viewer-info-sidebar { position: fixed !important; top: 0; left: -280px; width: 250px; height: 100vh; background-color: #1f1f1f; border-right: 1px solid #333; z-index: 99999; box-sizing: border-box; transition: left 0.3s ease-in-out; display: flex; flex-direction: column; }
            .gbs-viewer-tags-scroll-wrapper { flex-grow: 1; overflow-y: auto; padding: 10px 5px 5px 5px; min-height: 0; }
            #gbs-viewer-info-sidebar.visible { left: 0; }
            #gbs-viewer-info-sidebar .tag-list { position: static !important; width: 95% !important; box-sizing: border-box; word-wrap: break-word; padding: 0px; border: 0 !important; margin: 0; }
            #gbs-viewer-info-sidebar .tag-type-artist a { color: #AA0000 !important; }
            #gbs-viewer-info-sidebar .tag-type-character a { color: #00AA00 !important; }
            #gbs-viewer-info-sidebar .tag-type-copyright a { color: #AA00AA !important; }
            #gbs-viewer-info-sidebar .tag-type-metadata a { color: #FF8800 !important; }
            #gbs-viewer-info-sidebar .tag-type-general a { color: white !important; }
            #gbs-viewer-info-sidebar #tag-list li { margin: 0px 4px 0px 0px; line-height: 17px !important; }
            .gbs-viewer-comments-container { overflow-y: auto; padding: 0 5px; }
            .gbs-viewer-comments-container .commentAvatar { display: none; }
            .gbs-viewer-comments-container .commentBody {width: 100% !important; padding: 8px; border-radius: 10px; word-wrap: break-word; }
            .gbs-viewer-comments-container .commentBody span[style*="font-size: .9em;"] { font-size: 0.8em !important; opacity: 0.7; }
            .gbs-ui-hidden { opacity: 0; pointer-events: none; }
            .gbs-custom-action-btn { display: block; background-color: rgba(0, 111, 250, 0.5); color: white !important; padding: 8px; margin: 0; border-radius: 10px; text-align: center; font-weight: bold; font-size: 14px; transition: background-color 0.2s ease; cursor: pointer; line-height: 1; }
            .gbs-custom-action-btn:hover { background-color: #006FFA; color: white !important; }
            .gbs-action-buttons-container { display: grid !important; grid-auto-flow: column; grid-auto-columns: auto; gap: 5px; padding: 8px 10px; background-color: #2a2a2a; border-top: 1px solid #444; }
            .gbs-pool-popup { background-color: #343a40; border-radius: 10px; padding: 5px; z-index: 100000; display: flex; flex-direction: column; gap: 3px; width: 150px; }
            .gbs-pool-popup-item { padding: 5px 8px; color: #eee !important; cursor: pointer; text-align: center; }
            .gbs-pool-popup-item:hover { background-color: #666; border-radius: 10px; }

            .gbs-thumb-placeholder { display: inline-flex; align-items: center; justify-content: center; }
            .gbs-thumb-placeholder .gbs-thumb-loader { color: white; font-size: 2em; animation: gbs-spin 1.2s linear infinite; }
            @keyframes gbs-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            #gbs-loading-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.9); z-index: 100000; opacity: 1; transition: opacity 0.2s ease-out; pointer-events: none; }
            `);

            const topControlsContainer = document.createElement('div');
            topControlsContainer.id = 'gbs-viewer-top-controls';
            const viewerButton = document.createElement('button');
            viewerButton.id = 'gbs-viewer-btn';
            viewerButton.title = 'Close Media Viewer';
            viewerButton.innerHTML = '<i class="fas fa-times"></i>';
            const showInfoBtn = document.createElement('button');
            showInfoBtn.id = 'gbs-viewer-show-info-btn';
            showInfoBtn.title = 'Show Post Info';
            showInfoBtn.innerHTML = '<i class="fas fa-info"></i>';
            const openPostBtn = document.createElement('button');
            openPostBtn.id = 'gbs-viewer-open-post-btn';
            openPostBtn.title = 'Open Post in New Tab';
            openPostBtn.innerHTML = '<i class="fas fa-external-link-alt"></i>';
            const pinBtn = document.createElement('button');
            pinBtn.id = 'gbs-viewer-pin-btn';
            pinBtn.title = 'Pin UI Controls';
            pinBtn.innerHTML = '<i class="fas fa-thumbtack"></i>';
            topControlsContainer.append(viewerButton, showInfoBtn, openPostBtn, pinBtn);
            document.body.appendChild(topControlsContainer);

            const navContainer = document.createElement('div');
            navContainer.id = 'gbs-viewer-nav-container';
            navContainer.innerHTML = `
            <button class="gbs-viewer-nav-item gbs-viewer-nav-btn" id="gbs-viewer-nav-up" title="Previous Image"><i class="fas fa-angle-up"></i></button>
                <div class="gbs-viewer-nav-item" id="gbs-viewer-nav-counter">0</div>
                <button class="gbs-viewer-nav-item gbs-viewer-nav-btn" id="gbs-viewer-nav-down" title="Next Image"><i class="fas fa-angle-down"></i></button>
                `;
            document.body.appendChild(navContainer);

            const infoSidebar = document.createElement('div');
            infoSidebar.id = 'gbs-viewer-info-sidebar';
            document.body.appendChild(infoSidebar);

            this.elements = {
                viewerButton,
                topControlsContainer,
                navContainer,
                navUpButton: navContainer.querySelector('#gbs-viewer-nav-up'),
                navCounter: navContainer.querySelector('#gbs-viewer-nav-counter'),
                navDownButton: navContainer.querySelector('#gbs-viewer-nav-down'),
                showInfoButton: showInfoBtn,
                openPostButton: openPostBtn,
                pinButton: pinBtn,
                infoSidebar,
            };
        },
        getPostPageData(postUrl, postId) {
            if (this.State.postDataCache.has(postId)) {
                return this.State.postDataCache.get(postId);
            }

            const requestPromise = (async () => {
                try {
                    const { promise } = Utils.makeRequest({ method: "GET", url: postUrl });
                    const response = await promise;
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");

                    const mediaData = API.parsePostDataFromDoc(doc);
                    const tagListElement = doc.querySelector('#tag-list');

                    const commentsContainer = document.createElement('div');
                    commentsContainer.className = 'gbs-viewer-comments-container';
                    const commentsHeader = Array.from(doc.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'User Comments:');
                    if (commentsHeader) {
                        let currentNode = commentsHeader.nextSibling;
                        while (currentNode) {
                            if (currentNode.nodeName === 'DIV' && (currentNode.querySelector('.commentAvatar') || currentNode.querySelector('.commentBody'))) {
                                commentsContainer.appendChild(currentNode.cloneNode(true));
                            }
                            if (currentNode.id === 'paginator' || (currentNode.nodeName === 'BR' && currentNode.nextSibling?.id === 'paginator')) {
                                break;
                            }
                            currentNode = currentNode.nextSibling;
                        }
                    }
                    const paginationElement = doc.querySelector('#paginator');

                    return { mediaData, tagListElement, commentsContainer, paginationElement };
                } catch (error) {
                    this.State.postDataCache.delete(postId);
                    Logger.error(`[MediaViewer] Failed to get post page data for ${postId}:`, error);
                    throw error;
                }
            })();

            this.State.postDataCache.set(postId, requestPromise);
            return requestPromise;
        },
        jumpToIndex(index) {
            if (this._isNavigating || index < 0 || index >= this.State.thumbnailAnchors.length) return;
            this._isNavigating = true;
            this.closePoolPopup();

            if (this.State.currentImageIndex >= 0) {
                const prevAnchor = this.State.thumbnailAnchors[this.State.currentImageIndex];
                const prevMedia = prevAnchor?.querySelector('video.gbs-large-view-media');
                if (prevMedia) prevMedia.pause();
            }

            this.State.currentImageIndex = index;
            const targetAnchor = this.State.thumbnailAnchors[this.State.currentImageIndex];

            if (targetAnchor) {
                targetAnchor.scrollIntoView({ behavior: 'auto', block: 'center' });
            }

            if (this.elements.infoSidebar.classList.contains('visible')) {
                this.fetchAndDisplayInfo();
            } else {
                this.elements.infoSidebar.dataset.currentPostId = '';
            }

            this.updateNavCounter();

            setTimeout(() => { this._isNavigating = false; }, 50);
        },
        async handleThumbnailClick(event) {
            const deleteModeCheckbox = document.getElementById('del-mode');
            if (deleteModeCheckbox && deleteModeCheckbox.checked) {
                return;
            }

            if (Downloader.State.isSelectionModeActive || (typeof AddToPool !== 'undefined' && AddToPool.State.selectionMode)) {
                return;
            }

            const clickedAnchor = event.target.closest(Config.SELECTORS.MEDIA_VIEWER_THUMBNAIL_ANCHOR);
            if (!clickedAnchor) return;

            event.preventDefault();
            event.stopPropagation();

            const clickedIndex = this.State.thumbnailAnchors.indexOf(clickedAnchor);
            if (clickedIndex === -1) {
                Logger.warn("[MediaViewer] Miniature clicked not found in the anchor array.");
                return;
            }

            if (!this.State.isLargeViewActive) {
                const container = document.querySelector('.thumbnail-container');
                if (container) container.classList.add('gbs-large-view-active');

                await this.activateLargeView(clickedIndex);
            } else {
                this.jumpToIndex(clickedIndex);
            }
        },
        setupEventListeners() {
            this.elements.viewerButton.title = `[${Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_CLOSE)}] Close Media Viewer`;
            this.elements.viewerButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.deactivateLargeView();
            });

            this.elements.navUpButton.title = `[${Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_PREV_IMAGE)}] or (Scroll Up) Previous Image`;
            this.elements.navUpButton.addEventListener('click', () => this.navigateToImage(-1));

            this.elements.navDownButton.title = `[${Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_NEXT_IMAGE)}] or (Scroll Down) Next Image`;
            this.elements.navDownButton.addEventListener('click', () => this.navigateToImage(1));

            this.elements.showInfoButton.title = `[${Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_TOGGLE_INFO)}] Show Post Info`;
            this.elements.showInfoButton.addEventListener('click', () => this.toggleInfoSidebar());

            this.elements.openPostButton.title = `[${Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_OPEN_POST)}] Open Post in New Tab`;
            this.elements.openPostButton.addEventListener('click', () => {
                if (this.State.currentImageIndex >= 0 && this.State.currentImageIndex < this.State.thumbnailAnchors.length) {
                    const anchor = this.State.thumbnailAnchors[this.State.currentImageIndex];
                    if (anchor && anchor.href) {
                        GM_openInTab(anchor.href, { active: false });
                    }
                }
            });

            this.elements.pinButton.title = `[${Utils.formatHotkeyForDisplay(Settings.State.KEY_VIEWER_PIN_UI)}] Pin UI Controls`;
            this.elements.pinButton.addEventListener('click', () => this.toggleUiPin());
        },
        async activateLargeView(startIndex = 0) {
            this.State.originalScrollY = window.scrollY;

            this.State.isLargeViewActive = true;
            this.elements.viewerButton.style.display = 'flex';
            this.elements.viewerButton.classList.add('active');

            this._boundWheelHandler = this.handleNavWheel.bind(this);
            document.addEventListener('wheel', this._boundWheelHandler, { passive: false });

            const loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'gbs-loading-overlay';
            document.body.appendChild(loadingOverlay);

            const firstThumbImg = this.State.thumbnailAnchors.length > 0 ? this.State.thumbnailAnchors[0].querySelector('img') : null;
            const placeholderDims = firstThumbImg ? { w: firstThumbImg.getBoundingClientRect().width, h: firstThumbImg.getBoundingClientRect().height } : { w: 150, h: 150 };

            try {
                if (typeof Downloader !== 'undefined') Downloader.toggleVisibility(false);
                if (typeof AddToPool !== 'undefined') AddToPool.toggleVisibility(false);

                document.body.classList.add('gbs-viewer-mode-active');
                document.body.style.overflow = 'hidden';

                const observerOptions = {
                    root: null,
                    rootMargin: '450% 0px' // 4.5x viewport height buffer top/bottom
                };

                this.State._lazyLoadObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const placeholder = entry.target;
                            if (placeholder.dataset.loaded === 'false') {
                                placeholder.dataset.loaded = 'loading';
                                const anchor = placeholder.closest('a');
                                if (anchor) {
                                    const dims = { w: placeholder.offsetWidth, h: placeholder.offsetHeight };
                                    this.loadAndReplaceMedia(anchor, dims);
                                }
                                this.State._lazyLoadObserver.unobserve(placeholder);
                            }
                        }
                    });
                }, observerOptions);


                this.State.thumbnailAnchors.forEach(anchor => {
                    const originalThumb = anchor.querySelector('img');
                    if (originalThumb) originalThumb.style.display = 'none';

                    const placeholder = document.createElement('div');
                    placeholder.className = 'gbs-thumb-placeholder';
                    placeholder.style.width = `${placeholderDims.w}px`;
                    placeholder.style.height = `${placeholderDims.h}px`;
                    placeholder.innerHTML = `<i class="fas fa-spinner gbs-thumb-loader"></i>`;
                    placeholder.dataset.loaded = 'false';
                    anchor.appendChild(placeholder);

                    this.State._lazyLoadObserver.observe(placeholder);
                });

                if (this.State.thumbnailAnchors.length > 0 && startIndex < this.State.thumbnailAnchors.length) {
                    const targetAnchor = this.State.thumbnailAnchors[startIndex];
                    const placeholder = targetAnchor.querySelector('.gbs-thumb-placeholder');

                    if (placeholder && placeholder.dataset.loaded === 'false') {
                        placeholder.dataset.loaded = 'loading';
                        this.State._lazyLoadObserver.unobserve(placeholder);
                        await this.loadAndReplaceMedia(targetAnchor, placeholderDims);
                    }
                }

                if (!this._boundKeyDownHandler) {
                    this._boundKeyDownHandler = this.handleNavKeyDown.bind(this);
                }
                document.addEventListener('keydown', this._boundKeyDownHandler);
                this.State.currentImageIndex = -1;
                this.elements.navContainer.classList.add('visible');
                this.elements.topControlsContainer?.classList.add('gbs-ui-hidden');
                this.elements.navContainer?.classList.add('gbs-ui-hidden');
                this.setupInactivityListeners();
                if (!this.State._boundResizeHandler) {
                    this.State._boundResizeHandler = this.handleResize.bind(this);
                }
                window.addEventListener('resize', this.State._boundResizeHandler);

                this.jumpToIndex(startIndex);

            } finally {
                loadingOverlay.style.opacity = '0';
                loadingOverlay.addEventListener('transitionend', () => {
                    loadingOverlay.remove();
                }, { once: true });
            }
        },
        deactivateLargeView() {
            this.State.isLargeViewActive = false;
            this.State.isUiPinned = false;
            this.elements.pinButton.classList.remove('active');
            this.elements.viewerButton.style.display = 'none';
            this.elements.viewerButton.classList.remove('active');

            document.getElementById('gbs-loading-overlay')?.remove();
            document.removeEventListener('wheel', this._boundWheelHandler);

            document.body.classList.remove('gbs-viewer-mode-active');
            this.cleanupInactivityListeners();
            if (this.State._boundResizeHandler) {
                window.removeEventListener('resize', this.State._boundResizeHandler);
            }
            clearTimeout(this.State.resizeTimer);
            if (typeof Downloader !== 'undefined') Downloader.toggleVisibility(true);
            if (typeof AddToPool !== 'undefined') AddToPool.toggleVisibility(true);

            if (this.State._lazyLoadObserver) {
                this.State._lazyLoadObserver.disconnect();
                this.State._lazyLoadObserver = null;
            }

            this.State.postDataCache.clear();

            this.elements.showInfoButton.style.display = 'none';
            this.elements.openPostButton.style.display = 'none';
            this.elements.pinButton.style.display = 'none';
            this.elements.infoSidebar.classList.remove('visible');
            this.elements.showInfoButton.classList.remove('active');
            document.body.style.overflow = '';

            window.scroll({ top: this.State.originalScrollY, behavior: 'auto' });

            const thumbnailContainer = document.querySelector('.thumbnail-container');
            if (thumbnailContainer) thumbnailContainer.classList.remove('gbs-large-view-active');
            if (this._boundKeyDownHandler) document.removeEventListener('keydown', this._boundKeyDownHandler);
            this.elements.navContainer.classList.remove('visible');

            this.State.thumbnailAnchors.forEach(anchor => {
                anchor.querySelector('.gbs-large-view-media, .gbs-thumb-placeholder')?.remove();
                const originalThumb = anchor.querySelector('img');
                if (originalThumb) originalThumb.style.display = '';
            });
            this.State.largeMediaElements = [];
            this.closePoolPopup();
        },
        handleResize: function() {
            if (!this.State.isLargeViewActive || this.State.currentImageIndex === -1) {
                return;
            }

            clearTimeout(this.State.resizeTimer);

            this.State.resizeTimer = setTimeout(() => {
                const targetAnchor = this.State.thumbnailAnchors[this.State.currentImageIndex];

                if (targetAnchor) {
                    targetAnchor.scrollIntoView({ behavior: 'auto', block: 'center' });
                    Logger.log('Resize complete. Re-centering image.');
                }
            }, 100);
        },
        resetMouseInactivityTimer: function() {
            if (!this.State.isLargeViewActive) return;

            document.body.classList.remove('gbs-hide-viewer-cursor');

            clearTimeout(this.State.inactivityTimer);

            this.State.inactivityTimer = setTimeout(() => {
                document.body.classList.add('gbs-hide-viewer-cursor');
            }, 3000);
        },
        handleViewerMouseMove: function(event) {
            if (!this.State.isLargeViewActive) return;

            this.State.lastMousePos = { x: event.clientX, y: event.clientY };

            const isHoveringControls = event.target.closest('#gbs-viewer-top-controls, #gbs-viewer-nav-container');
            if (isHoveringControls) {
                this.elements.topControlsContainer?.classList.remove('gbs-ui-hidden');
                this.elements.navContainer?.classList.remove('gbs-ui-hidden');
                return;
            }

            this.updateUiVisibility();
        },
        toggleUiPin: function() {
            this.State.isUiPinned = !this.State.isUiPinned;

            this.elements.pinButton.classList.toggle('active', this.State.isUiPinned);

            this.updateUiVisibility();
        },
        updateUiVisibility: function() {
            if (this.State.isUiPinned) {
                this.elements.topControlsContainer?.classList.remove('gbs-ui-hidden');
                this.elements.navContainer?.classList.remove('gbs-ui-hidden');
                return;
            }

            const { x, y } = this.State.lastMousePos;

            const rightHotzonePx = 100;
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;

            const inRightHotzone = (x > (windowWidth - rightHotzonePx)) && (y > (windowHeight / 3));

            if (inRightHotzone) {
                this.elements.topControlsContainer?.classList.remove('gbs-ui-hidden');
                this.elements.navContainer?.classList.remove('gbs-ui-hidden');
            } else {
                this.elements.topControlsContainer?.classList.add('gbs-ui-hidden');
                this.elements.navContainer?.classList.add('gbs-ui-hidden');
            }
        },
        setupInactivityListeners() {
            this.State._boundResetMouseInactivityTimer = this.resetMouseInactivityTimer.bind(this);
            this.State._boundHandleViewerMouseMove = this.handleViewerMouseMove.bind(this);

            document.addEventListener('mousemove', this.State._boundResetMouseInactivityTimer);
            document.addEventListener('mousemove', this.State._boundHandleViewerMouseMove);

            this.resetMouseInactivityTimer();
        },
        cleanupInactivityListeners() {
            if (this.State._boundResetMouseInactivityTimer) {
                document.removeEventListener('mousemove', this.State._boundResetMouseInactivityTimer);
                this.State._boundResetMouseInactivityTimer = null;
            }
            if (this.State._boundHandleViewerMouseMove) {
                document.removeEventListener('mousemove', this.State._boundHandleViewerMouseMove);
                this.State._boundHandleViewerMouseMove = null;
            }

            clearTimeout(this.State.inactivityTimer);
            this.State.inactivityTimer = null;

            this.elements.topControlsContainer?.classList.remove('gbs-ui-hidden');
            this.elements.navContainer?.classList.remove('gbs-ui-hidden');
            document.body.classList.remove('gbs-hide-viewer-cursor');
        },
        loadAndReplaceMedia(anchor, dims) {
            return new Promise(async (resolve) => {
                const placeholder = anchor.querySelector('.gbs-thumb-placeholder');
                if (!placeholder) return resolve();

                const postId = Utils.getPostId(anchor.href);
                if (!postId) {
                    placeholder.remove();
                    return resolve();
                }

                try {
                    const { mediaData } = await this.getPostPageData(anchor.href, postId);

                    const mediaElement = mediaData.type === 'video' ? document.createElement('video') : document.createElement('img');
                    mediaElement.addEventListener('click', (e) => e.preventDefault());
                    mediaElement.src = mediaData.contentUrl;
                    mediaElement.className = 'gbs-large-view-media';
                    if (mediaData.type === 'video') {
                        mediaElement.controls = true;
                        mediaElement.loop = true;
                        mediaElement.muted = false;
                    }
                    const loadEvent = mediaData.type === 'video' ? 'loadeddata' : 'load';
                    mediaElement.addEventListener(loadEvent, async () => {
                        if (!this.State.isLargeViewActive) {
                            resolve();
                            return;
                        }

                        if (mediaData.type === 'image') {
                            try {
                                await mediaElement.decode();
                            } catch (e) {
                                Logger.warn('Image decode failed, but proceeding:', e);
                            }
                        }

                        const loadedIndex = this.State.thumbnailAnchors.indexOf(anchor);

                        placeholder.replaceWith(mediaElement);
                        this.State.largeMediaElements = Array.from(document.querySelectorAll('.gbs-large-view-media'));

                        if (loadedIndex === this.State.currentImageIndex) {
                            anchor.scrollIntoView({ behavior: 'auto', block: 'center' });
                        }

                        resolve();
                    }, { once: true });
                    mediaElement.addEventListener('error', () => {
                        placeholder.remove();
                        resolve();
                    }, { once: true });
                } catch (error) {
                    Logger.error(`Failed to load media for post ${postId}:`, error);
                    placeholder.remove();
                    resolve();
                }
            });
        },
        navigateToImage(direction) {
            if (this._isNavigating) return;
            this._isNavigating = true;
            this.closePoolPopup();

            if (this.State.currentImageIndex === this.State.thumbnailAnchors.length - 1 && direction > 0) {
                window.scrollBy({ top: 400, behavior: 'smooth' });
                this._isNavigating = false;
                return;
            }

            if (this.State.currentImageIndex >= 0) {
                const prevAnchor = this.State.thumbnailAnchors[this.State.currentImageIndex];
                const prevMedia = prevAnchor?.querySelector('video.gbs-large-view-media');
                if (prevMedia) prevMedia.pause();
            }

            if (this.State.thumbnailAnchors.length === 0) {
                this._isNavigating = false;
                return;
            }

            const newIndex = Math.max(0, Math.min(this.State.thumbnailAnchors.length - 1, this.State.currentImageIndex + direction));

            if (newIndex !== this.State.currentImageIndex) {
                this.State.currentImageIndex = newIndex;
                const targetAnchor = this.State.thumbnailAnchors[this.State.currentImageIndex];
                if (targetAnchor) {
                    targetAnchor.scrollIntoView({ behavior: 'auto', block: 'center' });
                }
                if (this.elements.infoSidebar.classList.contains('visible')) {
                    this.fetchAndDisplayInfo();
                } else {
                    this.elements.infoSidebar.dataset.currentPostId = '';
                }
            }
            this.updateNavCounter();
            setTimeout(() => { this._isNavigating = false; }, 50);
        },
        handleNavWheel(event) {
            if (this._isNavigating) return;

            if (this.elements.infoSidebar && this.elements.infoSidebar.contains(event.target)) {
                return;
            }

            const currentVideo = this.State.thumbnailAnchors[this.State.currentImageIndex]?.querySelector('video.gbs-large-view-media');

            if (currentVideo && event.target === currentVideo) {
                event.preventDefault();

                const direction = event.deltaY > 0 ? -1 : 1;

                let newVolume = currentVideo.volume + (direction * 0.05);

                newVolume = Math.max(0, Math.min(1, newVolume));
                currentVideo.volume = newVolume;

                return;
            }
            event.preventDefault();

            if (this.State.wheelTimeout) return;
            this.State.wheelTimeout = setTimeout(() => { this.State.wheelTimeout = null; }, 100);

            if (event.deltaY > 0) {
                this.navigateToImage(1);
            } else if (event.deltaY < 0) {
                this.navigateToImage(-1);
            }
        },
        handleNavKeyDown(event) {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;

            const viewerHotkeys = [
                Settings.State.KEY_VIEWER_PREV_IMAGE,
                Settings.State.KEY_VIEWER_NEXT_IMAGE,
                Settings.State.KEY_VIEWER_TOGGLE_INFO,
                Settings.State.KEY_VIEWER_CLOSE,
                Settings.State.KEY_VIEWER_PIN_UI,
                Settings.State.KEY_VIEWER_OPEN_POST,
                Settings.State.KEY_VIDEO_FULLSCREEN
            ];

            if (!viewerHotkeys.includes(event.key)) return;

            event.preventDefault();
            event.stopPropagation();
            this.closePoolPopup();

            if (event.key === Settings.State.KEY_VIEWER_PREV_IMAGE) {
                this.navigateToImage(-1);
            } else if (event.key === Settings.State.KEY_VIEWER_NEXT_IMAGE) {
                this.navigateToImage(1);
            } else if (event.key === Settings.State.KEY_VIEWER_TOGGLE_INFO) {
                this.toggleInfoSidebar();

            } else if (event.key === Settings.State.KEY_VIEWER_CLOSE) {
                this.deactivateLargeView();

            } else if (event.key === Settings.State.KEY_VIEWER_PIN_UI) {
                this.toggleUiPin();

            } else if (event.key === Settings.State.KEY_VIEWER_OPEN_POST) {
                this.elements.openPostButton.click();

            } else if (event.key === Settings.State.KEY_VIDEO_FULLSCREEN) {
                const currentMedia = this.State.thumbnailAnchors[this.State.currentImageIndex]?.querySelector('video.gbs-large-view-media');

                if (!currentMedia) return;

                const isFullscreenActive = document.fullscreenElement;

                if (isFullscreenActive) {
                    if (typeof document.exitFullscreen === 'function') {
                        document.exitFullscreen();
                    }
                } else {
                    if (typeof currentMedia.requestFullscreen === 'function') {
                        currentMedia.requestFullscreen();
                    }
                }
            }
        },
        updateNavCounter() {
            if (!this.elements.navCounter) return;
            const currentImageNum = Math.max(0, this.State.currentImageIndex + 1);
            const totalImages = this.State.thumbnailAnchors.length;
            this.elements.navCounter.textContent = `${currentImageNum}/${totalImages}`;
            const shouldShow = this.State.isLargeViewActive && currentImageNum > 0;
            this.elements.showInfoButton.style.display = shouldShow ? 'flex' : 'none';
            this.elements.openPostButton.style.display = shouldShow ? 'flex' : 'none';
            this.elements.pinButton.style.display = shouldShow ? 'flex' : 'none';
        },
        toggleInfoSidebar() {
            this.closePoolPopup();
            const isVisible = this.elements.infoSidebar.classList.toggle('visible');
            this.elements.showInfoButton.classList.toggle('active', isVisible);
            if (isVisible) this.fetchAndDisplayInfo();
        },
        closePoolPopup() {
            if (this.State.currentPoolPopup) {
                this.State.currentPoolPopup.remove();
                this.State.currentPoolPopup = null;
                document.removeEventListener('click', this.handleOutsidePopupClick, true);
            }
        },
        _displayCommentsAndPagination(commentsContainer, paginationElement) {
            const sidebar = this.elements.infoSidebar;

            sidebar.querySelector('.gbs-viewer-comments-container')?.remove();
            sidebar.querySelector('.gbs-viewer-comments-pagination')?.remove();

            if (commentsContainer && commentsContainer.hasChildNodes()) {
                sidebar.appendChild(commentsContainer);
            } else {
                const emptyContainer = document.createElement('div');
                emptyContainer.className = 'gbs-viewer-comments-container';
                emptyContainer.innerHTML = '<p style="padding: 0 10px;">No comments found on this page.</p>';
                sidebar.appendChild(emptyContainer);
            }

            if (paginationElement) {
                const paginationContainer = document.createElement('div');
                paginationContainer.className = 'gbs-viewer-comments-pagination';
                paginationContainer.style.flexShrink = '0';

                paginationElement.querySelectorAll('a').forEach(link => {
                    link.href = new URL(link.href, window.location.origin).href;
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.fetchAndDisplayCommentsPage(link.href);
                    });
                });

                paginationContainer.appendChild(paginationElement);
                sidebar.appendChild(paginationContainer);
            }
        },
        async fetchAndDisplayCommentsPage(url) {
            const sidebar = this.elements.infoSidebar;
            this.closePoolPopup();

            sidebar.querySelector('.gbs-viewer-comments-container')?.remove();
            sidebar.querySelector('.gbs-viewer-comments-pagination')?.remove();
            const loadingContainer = document.createElement('div');
            loadingContainer.className = 'gbs-viewer-comments-container';
            loadingContainer.innerHTML = '<p>&nbsp;&nbsp;&nbsp;Loading comments...</p>';
            sidebar.appendChild(loadingContainer);

            try {
                const { promise } = Utils.makeRequest({ method: "GET", url });
                const response = await promise;
                const doc = new DOMParser().parseFromString(response.responseText, "text/html");

                const newCommentsContainer = document.createElement('div');
                newCommentsContainer.className = 'gbs-viewer-comments-container';
                const commentsHeader = Array.from(doc.querySelectorAll('h2')).find(h2 => h2.textContent.trim() === 'User Comments:');
                let commentsNode = commentsHeader?.nextSibling;
                while (commentsNode) {
                    if (commentsNode.nodeName === 'DIV' && (commentsNode.querySelector('.commentAvatar') || commentsNode.querySelector('.commentBody'))) {
                        newCommentsContainer.appendChild(commentsNode.cloneNode(true));
                    }
                    if (commentsNode.id === 'paginator' || (commentsNode.nodeName === 'BR' && commentsNode.nextSibling?.id === 'paginator')) {
                        break;
                    }
                    commentsNode = commentsNode.nextSibling;
                }
                const newPaginationElement = doc.querySelector('#paginator');

                loadingContainer.remove();

                this._displayCommentsAndPagination(newCommentsContainer, newPaginationElement);

            } catch (error) {
                Logger.error("Failed to fetch comments page:", error);
                loadingContainer.innerHTML = '<p style="color: #A43535; padding: 0 10px;">Error loading comments page.</p>';
            }
        },
        handleOutsidePopupClick: (event) => {
            if (MediaViewer.State.currentPoolPopup && !MediaViewer.State.currentPoolPopup.contains(event.target) && !event.target.closest('.gbs-custom-action-btn[data-action="add-pool"]')) {
                MediaViewer.closePoolPopup();
            }
        },
        async fetchAndDisplayInfo() {
            const sidebar = this.elements.infoSidebar;
            if (this.State.currentImageIndex < 0 || this.State.currentImageIndex >= this.State.thumbnailAnchors.length) return;

            const anchor = this.State.thumbnailAnchors[this.State.currentImageIndex];

            if (!anchor || !anchor.href) return;
            const postId = Utils.getPostId(anchor.href);
            if (sidebar.dataset.currentPostId === postId && !sidebar.innerHTML.includes('Loading info...')) return;

            sidebar.innerHTML = '<p>&nbsp;&nbsp;&nbsp;Loading info...</p>';
            sidebar.dataset.currentPostId = postId;
            this.closePoolPopup();

            try {
                const { tagListElement, commentsContainer, paginationElement } = await this.getPostPageData(anchor.href, postId);

                if (Utils.getPostId(this.State.thumbnailAnchors[this.State.currentImageIndex]?.href) !== postId) return;

                const localTagList = tagListElement ? tagListElement.cloneNode(true) : null;
                const localComments = commentsContainer ? commentsContainer.cloneNode(true) : null;
                const localPaginator = paginationElement ? paginationElement.cloneNode(true) : null;


                if (localTagList) {
                    App.processTagList(localTagList, true);
                    const actionButtonsContainer = document.createElement('div');
                    actionButtonsContainer.className = 'gbs-action-buttons-container';

                    const allLinks = localTagList.querySelectorAll('li a');

                    // comments
                    const commentsButton = document.createElement('div');
                    commentsButton.innerHTML = '<i class="fas fa-comments"></i>';
                    commentsButton.className = 'gbs-custom-action-btn';
                    commentsButton.title = 'Show Comments';

                    commentsButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.closePoolPopup();
                        sidebar.innerHTML = '';

                        // back to Tags
                        const backButton = document.createElement('button');
                        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to Tags';
                        backButton.className = 'gbs-custom-action-btn';
                        backButton.style.margin = '8px 10px';
                        backButton.style.flexShrink = '0';

                        backButton.addEventListener('click', () => {
                            sidebar.dataset.currentPostId = '';
                            this.fetchAndDisplayInfo();
                        });

                        sidebar.appendChild(backButton);

                        this._displayCommentsAndPagination(localComments, localPaginator);
                    });

                    allLinks.forEach(link => {
                        const linkText = link.textContent.trim();

                        // Fav
                        if (linkText.includes('Add to favorites') || linkText.includes('Unfavorite')) {
                            const favoritesLi = link.closest('li');
                            if (favoritesLi) {
                                link.innerHTML = '<i class="fas fa-star"></i>';
                                link.className = 'gbs-custom-action-btn';
                                link.title = 'Add to favorites';

                                link.addEventListener('click', function(e) {
                                    this.style.backgroundColor = '#daa520';
                                    setTimeout(() => { this.style.backgroundColor = ''; }, 2000);
                                });

                                actionButtonsContainer.appendChild(link);
                                favoritesLi.remove();
                            }
                        }

                        // Pool
                        else if (linkText.includes('Add to Pool')) {
                            const poolLi = link.closest('li');
                            if (poolLi && Settings.State.favoritePools && Settings.State.favoritePools.length > 0) {
                                const poolButton = document.createElement('div');
                                poolButton.innerHTML = 'Add to Pool';
                                poolButton.className = 'gbs-custom-action-btn';
                                poolButton.dataset.action = 'add-pool';

                                poolButton.addEventListener('click', (e) => {
                                    e.stopPropagation();
                                    if (this.State.currentPoolPopup) {
                                        this.closePoolPopup();
                                        return;
                                    }

                                    const popup = document.createElement('div');
                                    popup.className = 'gbs-pool-popup';

                                    Settings.State.favoritePools.forEach(pool => {
                                        const poolItem = document.createElement('div');
                                        poolItem.className = 'gbs-pool-popup-item';
                                        poolItem.textContent = pool.name;
                                        poolItem.dataset.poolId = pool.id;

                                        poolItem.addEventListener('click', () => {
                                            const selectedPoolId = pool.id;
                                            const script = document.createElement('script');
                                            script.textContent = `(() => {
                                                const originalPrompt = window.prompt;
                                                window.prompt = () => '${selectedPoolId}';
                                                if (typeof addToPoolID === 'function') {
                                                    addToPoolID(${postId});
                                                }
                                                window.prompt = originalPrompt;
                                            })();`;
                                            document.body.appendChild(script).remove();

                                            poolButton.textContent = `Added!`;
                                            poolButton.style.backgroundColor = '#daa520';
                                            setTimeout(() => {
                                                poolButton.textContent = 'Add to Pool';
                                                poolButton.style.backgroundColor = '';
                                            }, 2000);
                                            this.closePoolPopup();
                                        });
                                        popup.appendChild(poolItem);
                                    });

                                    const btnRect = poolButton.getBoundingClientRect();
                                    const sidebarRect = sidebar.getBoundingClientRect();

                                    popup.style.position = 'absolute';
                                    popup.style.left = `${(btnRect.left - sidebarRect.left) + (btnRect.width / 2)}px`;

                                    popup.style.top = `${(btnRect.top - sidebarRect.top) + sidebar.scrollTop - 4}px`;
                                    popup.style.transform = 'translate(-50%, -100%)';

                                    sidebar.appendChild(popup);
                                    this.State.currentPoolPopup = popup;

                                    setTimeout(() => {
                                        document.addEventListener('click', this.handleOutsidePopupClick, true);
                                    }, 0);
                                });

                                actionButtonsContainer.appendChild(poolButton);
                                poolLi.remove();
                            }
                        }
                    });

                    sidebar.innerHTML = '';
                    sidebar.dataset.currentPostId = postId;

                    const tagsScrollWrapper = document.createElement('div');
                    tagsScrollWrapper.className = 'gbs-viewer-tags-scroll-wrapper';

                    localTagList.querySelectorAll('a').forEach(a => {
                        if (!a.classList.contains('gbs-custom-action-btn')) {
                            const href = a.getAttribute('href');
                            if (href) {
                                a.href = new URL(href, 'https://gelbooru.com/').href;
                                a.target = '_blank';
                                a.rel = 'noopener noreferrer';
                            }
                        }
                    });

                    tagsScrollWrapper.appendChild(localTagList);

                    sidebar.appendChild(tagsScrollWrapper);

                    if (localComments.hasChildNodes()) {
                        actionButtonsContainer.appendChild(commentsButton);
                    }

                    if (actionButtonsContainer.hasChildNodes()) {
                        sidebar.appendChild(actionButtonsContainer);
                    }

                } else {
                    throw new Error("Could not find '#tag-list' in the post page.");
                }
            } catch (error) {
                Logger.error("Failed to fetch or parse post info:", error);
                if (Utils.getPostId(this.State.thumbnailAnchors[this.State.currentImageIndex]?.href) === postId) {
                    sidebar.innerHTML = `<p style="color: #A43535;">&nbsp;&nbsp;&nbsp;Error loading info.</p>`;
                    sidebar.dataset.currentPostId = postId;
                }
            }
        },
    };

    // =================================================================================
    // MAIN APPLICATION ORCHESTRATOR
    // =================================================================================
    const App = {
        State: {
            currentPoolPopup: null
        },
        addGlobalStyles: function() {
            let customCss = '';
            if (window.location.href.includes('page=favorites')) {
                customCss += `html, body { background-color: #1F1F1F !important; }  div#paginator {color: white !important; }`;
            }
            if (Settings.State.HIDE_PAGE_SCROLLBARS) {
                customCss += `html, body, .aside, .gbs-viewer-tags-scroll-wrapper, .gbs-viewer-comments-container { scrollbar-width: none !important;} html::-webkit-scrollbar, body::-webkit-scrollbar, .aside::-webkit-scrollbar, .gbs-viewer-tags-scroll-wrapper::-webkit-scrollbar, .gbs-viewer-comments-container::-webkit-scrollbar { display: none !important; }`;
            }

            if (GlobalState.pageType === 'post') {
                GM_addStyle(`
                    ul.tag-list li { margin: 0px 4px 0px 0px;  position: relative; }
                    .aside { max-height: 100vh; margin-top: 10px; overflow-y: auto; overscroll-behavior: contain; position: relative; margin-left: 0px; padding-left: 10px; z-index: 9992; background-color: #1f1f1f; }
                    footer { padding-bottom: 40px; }

                    main #image, main video#gelcomVideoPlayer { width: auto !important; margin: auto !important; object-fit: contain !important; }
                    #scrollebox { position: fixed !important; bottom: 0 !important; right: 0 !important; width: 100% !important; box-sizing: border-box !important; background-color: #252525; border-top: 1px solid #444; z-index: 9990; padding: 5px 30px 5px 260px !important; font-size: 12px !important; display: flex !important; justify-content: space-between !important; align-items: center !important; }
                    .gbs-pool-action-container { display: inline-flex; gap: 5px; align-items: center;}
                    .gbs-pool-action-button { border: none; color: #fff; cursor: pointer; font-weight: bold; font-size: 12px; background-color: transparent; text-decoration: none; }
                    #gbs-post-pool-remove-btn { color: #A43535; }
                    #gbs-pool-count-badge { padding: 0 4px; color: #fff; font-size: 10px; font-weight: bold; background-color: #A43535; border-radius: 50%; }
                    .gbs-pool-popup { background-color: #343a40; border-radius: 10px; padding: 5px; z-index: 100000; display: flex; flex-direction: column; gap: 3px; min-width: 130px; }
                    .gbs-pool-popup-item { padding: 5px 8px; color: #eee !important; cursor: pointer; text-align: center; }
                    .gbs-pool-popup-item:hover { background-color: #666; border-radius: 10px; }
                `);

                document.querySelector('.aside')?.scrollTo(0, 0);
            }

            customCss += `
                .thumbnail-preview img { border-radius: 10px; }
                .thumbnail-preview img.gbs-animated-img { box-shadow: 0 0 0 2.5px #C2185B !important; }
                .thumbnail-preview { border-radius: 15px; }
            `;

            if (!document.querySelector('link[href*="font-awesome"]')) {
                const faLink = document.createElement('link');
                faLink.rel = 'stylesheet';
                faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
                document.head.appendChild(faLink);
            }
            if (customCss.trim() !== '') {
                GM_addStyle(customCss);
            }
            GM_addStyle(`
                .thumbnail-container > span > a, .thumbnail-container > .thumbnail-preview > a { transition: transform 0.2s ease-out; }
                .thumbnail-container > span > a:hover, .thumbnail-container > .thumbnail-preview > a:hover {transform: scale(1.1); z-index: 10; cursor: zoom-in; }

                body.gbs-selection-active .thumbnail-container > span > a:hover, body.gbs-pool-select-mode-active .thumbnail-container > span > a:hover, body.gbs-selection-active .thumbnail-container > .thumbnail-preview > a:hover, body.gbs-pool-select-mode-active .thumbnail-container > .thumbnail-preview > a:hover { transform: none; cursor: crosshair !important; }
                body.gbs-viewer-mode-active .thumbnail-container > span > a:hover, body.gbs-viewer-mode-active .thumbnail-container > .thumbnail-preview > a:hover { transform: none; cursor: inherit; }

                .gbs-fab-action-btn {min-width: 75px; justify-content: center; background-color: #343a40; color: white; font-weight: bold; border: none; border-radius: 10px; padding: 10px 15px; cursor: pointer; display: flex; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.2); white-space: nowrap; transition: background-color 0.2s; }
                .gbs-fab-action-btn:hover { background-color: #007BFF; }
                .gbs-fab-action-btn:disabled { opacity: 0.6; cursor: not-allowed; background-color: #343a40; }
                .gbs-fab-action-btn.active { background-color: #A43535; color: white !important; }
                .gbs-fab-action-btn.active:hover { background-color: #e74c3c; }
            `);
        },
        closePoolPopup: function() {
            if (this.State.currentPoolPopup) {
                this.State.currentPoolPopup.remove();
                this.State.currentPoolPopup = null;
                document.removeEventListener('click', this.handleOutsidePopupClick, true);
            }
        },
        handleOutsidePopupClick: (event) => {
            if (App.State.currentPoolPopup && !App.State.currentPoolPopup.contains(event.target) && !event.target.closest('.gbs-pool-action-button')) {
                App.closePoolPopup();
            }
        },
        collapseStatsByDefault: function() {
            const toggleButton = document.querySelector('.profileToggleStats a');

            if (toggleButton) {
                toggleButton.click();
            }
        },
        addClearMarkersCacheButton: function() {
            const submenu = document.querySelector(Config.SELECTORS.galleryNavSubmenu);
            if (!submenu) return;

            const clearCacheLink = document.createElement('a');
            clearCacheLink.href = '#';
            clearCacheLink.textContent = 'Clear Post Markers Cache';
            clearCacheLink.style.fontWeight = 'bold';

            clearCacheLink.addEventListener('click', async (e) => {
                e.preventDefault();
                await PostMarkers.clearCache();
                window.location.reload();
            });

            submenu.appendChild(clearCacheLink);
        },
        movePostActions: function() {
            const mediaElementForBreak = document.querySelector('#gelcomVideoPlayer, #image');
            if (mediaElementForBreak) {
                const precedingElement = mediaElementForBreak.previousElementSibling;
                if (precedingElement && precedingElement.tagName === 'BR') {
                    precedingElement.remove();
                }
            }
            const scrollbox = document.querySelector('#scrollebox');
            const mediaElement = document.querySelector('#image, #gelcomVideoPlayer');

            if (scrollbox && mediaElement) {
                mediaElement.after(scrollbox);
            }
            const allH2s = document.querySelectorAll('h2');
            const commentsHeader = Array.from(allH2s).find(h2 => h2.textContent.trim() === 'User Comments:');

            const adLinkAnchor = document.querySelector('div > a[rel="nofollow"][target="_blank"]');
            const adContainer = adLinkAnchor ? adLinkAnchor.parentElement : null;

            if (adContainer && commentsHeader) {
                commentsHeader.parentElement.insertBefore(adContainer, commentsHeader);
            }

            const mobileAdInnerDiv = document.querySelector('div[data-cl-spot]');
            const mobileAdContainer = mobileAdInnerDiv ? mobileAdInnerDiv.closest('center') : null;

            if (mobileAdContainer && commentsHeader) {
                commentsHeader.parentElement.insertBefore(mobileAdContainer, commentsHeader);
            }

            const originalContentNodes = Array.from(scrollbox.childNodes);
            scrollbox.innerHTML = '';
            const leftContainer = document.createElement('span');
            const rightContainer = document.createElement('span');

            rightContainer.style.display = 'flex';
            rightContainer.style.alignItems = 'center';
            rightContainer.style.gap = '5px';

            scrollbox.appendChild(leftContainer);
            scrollbox.appendChild(rightContainer);
            const prevLink = document.querySelector('a[onclick="navigatePrev();"]');
            const nextLink = document.querySelector('a[onclick="navigateNext();"]');
            if (prevLink && nextLink) {
                const navContainer = prevLink.closest('div.alert');
                nextLink.removeAttribute('style');
                leftContainer.append('(', prevLink, ' / ', nextLink, ')');
                if (navContainer) navContainer.remove();
            }
            let foundEditLink = false;
            originalContentNodes.forEach(node => {
                if (foundEditLink) {
                    if (node.nodeType === 3 && node.textContent.includes('|')) {
                        foundEditLink = false;
                        return;
                    }
                    foundEditLink = false;
                }

                if (node.tagName === 'A' && node.textContent.trim() === 'Edit') {
                    foundEditLink = true;
                    return;
                }

                rightContainer.appendChild(node);
            });

            const resizeLinkContainer = document.querySelector('#resize-link');
            if (resizeLinkContainer) {
                resizeLinkContainer.remove();
            }
        },
        initPostPoolUI: function() {
            const favoritePools = Settings.State.favoritePools || [];
            if (favoritePools.length === 0) return;

            const rightContainer = document.querySelector('#scrollebox > span:last-child');
            if (!rightContainer) return;

            const container = document.createElement('span');
            container.id = 'gbs-post-pool-container';
            container.className = 'gbs-pool-action-container';

            const badge = document.createElement('span');
            badge.id = 'gbs-pool-count-badge';
            badge.textContent = '...';
            badge.style.display = 'none';

            const addButton = document.createElement('button');
            addButton.className = 'gbs-pool-action-button';
            addButton.id = 'gbs-post-pool-add-btn';
            addButton.textContent = 'Add to Pool';
            addButton.disabled = true;

            const removeButton = document.createElement('button');
            removeButton.id = 'gbs-post-pool-remove-btn';
            removeButton.className = 'gbs-pool-action-button';
            removeButton.textContent = 'Remove from Pool';
            removeButton.disabled = true;

            container.append(addButton, ' | ',removeButton, badge);
            rightContainer.append(' | ', container);

            this.refreshPostPoolUI();
        },
        refreshPostPoolUI: async function() {
            const favoritePools = Settings.State.favoritePools || [];
            const postId = new URL(window.location.href).searchParams.get('id');
            const relationshipsLink = document.querySelector('a[href*="post-pool-list"]');

            const badge = document.getElementById('gbs-pool-count-badge');
            const addButton = document.getElementById('gbs-post-pool-add-btn');
            const removeButton = document.getElementById('gbs-post-pool-remove-btn');

            if (!postId || !addButton || !badge || !removeButton) {
                Logger.warn('[App.refreshPostPoolUI] Essential components of the IU not found.');
                return;
            }

            addButton.disabled = true;
            removeButton.disabled = true;
            badge.style.display = 'none';
            removeButton.style.display = 'inline-block';

            let currentPools = [];
            let matchingPools = [];
            let poolsToAdd = [];
            const favoritePoolMap = new Map(favoritePools.map(p => [p.id, p]));

            if (relationshipsLink) {
                try {
                    const { promise } = Utils.makeRequest({ method: "GET", url: relationshipsLink.href });
                    const response = await promise;
                    const doc = new DOMParser().parseFromString(response.responseText, "text/html");
                    currentPools = Array.from(doc.querySelectorAll('tbody tr a[href*="page=pool&s=show"]'))
                        .map(link => ({
                        id: new URL(link.href, window.location.origin).searchParams.get('id'),
                        name: link.textContent.trim()
                    }))
                        .filter(p => p.id);

                } catch (error) {
                    Logger.error('Could not fetch pool relationships:', error);
                    badge.textContent = 'E';
                    badge.style.display = 'inline-flex';
                    return;
                }
            }

            const currentPoolIds = new Set(currentPools.map(p => p.id));
            matchingPools = currentPools.filter(p => favoritePoolMap.has(p.id));
            poolsToAdd = favoritePools.filter(p => !currentPoolIds.has(p.id));

            if (matchingPools.length > 0) {
                badge.textContent = matchingPools.length;
                badge.style.display = 'inline-flex';
            }

            addButton.disabled = poolsToAdd.length === 0;
            addButton.textContent = 'Add to Pool';
            const newAddButton = addButton.cloneNode(true);
            addButton.parentNode.replaceChild(newAddButton, addButton);
            if (poolsToAdd.length > 0) {
                newAddButton.addEventListener('click', (e) => this.showPoolPopup(e, 'add', poolsToAdd));
            }

            removeButton.textContent = 'Remove from Pool';
            const newRemoveButton = removeButton.cloneNode(true);
            newRemoveButton.disabled = matchingPools.length === 0;
            newRemoveButton.style.display = matchingPools.length === 0 ? 'none' : 'inline-block';
            removeButton.parentNode.replaceChild(newRemoveButton, removeButton);

            if (matchingPools.length > 0) {
                newRemoveButton.addEventListener('click', (e) => this.showPoolPopup(e, 'remove', matchingPools));
            }
        },
        showPoolPopup: function(event, type, poolList) {
            event.stopPropagation();
            if (this.State.currentPoolPopup) {
                this.closePoolPopup();
                return;
            }

            const button = event.currentTarget;
            const postId = new URL(window.location.href).searchParams.get('id');
            if (!postId || !poolList || poolList.length === 0) return;

            const popup = document.createElement('div');
            popup.className = 'gbs-pool-popup';

            poolList.forEach(pool => {
                const poolItem = document.createElement('div');
                poolItem.className = 'gbs-pool-popup-item';
                poolItem.textContent = pool.name;
                poolItem.dataset.poolId = pool.id;

                poolItem.addEventListener('click', async () => {
                    const selectedPoolId = pool.id;
                    button.textContent = '...';
                    button.disabled = true;
                    this.closePoolPopup();

                    try {
                        if (type === 'add') {
                            const script = document.createElement('script');
                            script.textContent = `(() => {
                                const originalPrompt = window.prompt;
                                window.prompt = () => '${selectedPoolId}';
                                if (typeof addToPoolID === 'function') {
                                    addToPoolID(${postId});
                                }
                                window.prompt = originalPrompt;
                            })();`;
                            document.body.appendChild(script).remove();
                            await new Promise(r => setTimeout(r, 2000));
                        } else {
                            const removalUrl = `https://gelbooru.com/public/remove.php?removepool_post=1&pool_id=${selectedPoolId}&id=${postId}`;
                            await Utils.makeRequest({
                                method: "GET",
                                url: removalUrl,
                                headers: { "X-Requested-With": "XMLHttpRequest" }
                            }).promise;
                        }
                    } catch (error) {
                        Logger.error(`Failed to ${type} post from pool:`, error);
                        alert(`Failed to ${type} post. Check console.`);
                    } finally {
                        this.refreshPostPoolUI();
                    }
                });
                popup.appendChild(poolItem);
            });

            const btnRect = button.getBoundingClientRect();

            popup.style.position = 'fixed';
            popup.style.left = `${btnRect.left + (btnRect.width / 2)}px`;
            popup.style.top = `${btnRect.top - 4}px`;
            popup.style.transform = 'translate(-50%, -100%)';

            document.body.appendChild(popup);
            this.State.currentPoolPopup = popup;

            setTimeout(() => {
                document.addEventListener('click', this.handleOutsidePopupClick, true);
            }, 0);
        },
        scrollToMedia: function() {
            const mediaElement = document.querySelector('main #image, main video#gelcomVideoPlayer');
            if (mediaElement) {
                requestAnimationFrame(() => {
                    mediaElement.style.scrollMarginTop = '4px';
                    mediaElement.scrollIntoView({
                        behavior: 'auto',
                        block: 'start'
                    });
                });
            }
        },
        setupMediaScroll: function() {
            const mediaElement = document.querySelector('main #image, main video#gelcomVideoPlayer');
            if (!mediaElement) return;

            const action = () => {
                if (document.visibilityState === 'visible') {
                    this.scrollToMedia();
                } else {
                    document.addEventListener('visibilitychange', () => {
                        if (document.visibilityState === 'visible') {
                            this.scrollToMedia();
                        }
                    }, { once: true });
                }
            };

            if (mediaElement.tagName === 'VIDEO') {
                if (mediaElement.readyState >= 1) {
                    action();
                } else {
                    mediaElement.addEventListener('loadedmetadata', action, { once: true });
                }
            } else {
                if (mediaElement.complete) {
                    action();
                } else {
                    mediaElement.addEventListener('load', action, { once: true });
                    mediaElement.addEventListener('error', action, { once: true });
                }
            }
        },
        adjustMediaHeight: function() {
            const mediaElement = document.querySelector('#image, #gelcomVideoPlayer');
            const scrollbox = document.querySelector('#scrollebox');

            if (mediaElement && scrollbox) {
                const scrollboxHeight = scrollbox.offsetHeight;
                const reservedSpace = scrollboxHeight;

                mediaElement.style.maxHeight = `calc(99vh - ${reservedSpace}px)`;
            }
        },
        setupDeleteModeCompatibility: function() {
            const deleteModeCheckbox = document.getElementById('del-mode');

            if (deleteModeCheckbox) {
                Logger.log("Delete Mode checkbox found. Attaching compatibility listener.");

                deleteModeCheckbox.addEventListener('change', (event) => {
                    if (event.currentTarget.checked) {
                        Logger.log("Delete Mode activated. Deactivating conflicting Suite features.");

                        if (MediaViewer.State.isLargeViewActive) {
                            MediaViewer.deactivateLargeView();
                        }

                        if (Settings.State.ENABLE_ADD_TO_POOL && AddToPool.State.selectionMode) {
                            AddToPool.toggleSelectionMode(null);
                        }

                        if (Settings.State.ENABLE_DOWNLOADER && Downloader.State.isSelectionModeActive) {
                            Downloader.toggleSelectionMode();
                        }
                    }
                });
            }
        },
        processTagList: function(tagListElement, preserveFavoritesLink = false) {
            if (!tagListElement) {
                Logger.warn("[App.processTagList] No tag list element provided.");
                return;
            }

            const textsToRemove = new Set([
                'Fit Image to Window',
                'Original image',
                'Lock Image',
                'Tag Merge',
            ]);

            if (!preserveFavoritesLink) {
                textsToRemove.add('Add to favorites');
            }

            const allLinks = tagListElement.querySelectorAll('a');

            allLinks.forEach(link => {
                const linkText = link.textContent.trim();
                if (textsToRemove.has(linkText)) {
                    link.closest('li')?.remove();
                }
            });

            const extractSection = (headerText) => {
                const header = Array.from(tagListElement.querySelectorAll('h3')).find(h3 => h3.textContent.trim() === headerText);
                if (!header) return [];

                const sectionNodes = [];
                let currentNode = header.parentElement;

                while (currentNode) {
                    sectionNodes.push(currentNode);
                    const nextNode = currentNode.nextSibling;

                    if (nextNode && nextNode.nodeName === 'LI' && nextNode.querySelector('h3')) {
                        break;
                    }
                    currentNode = nextNode;
                }
                return sectionNodes;
            };

            const statsSection = extractSection('Statistics');
            const optionsSection = extractSection('Options');

            if (statsSection.length > 0 && optionsSection.length > 0) {
                [...statsSection, ...optionsSection].forEach(node => node.remove());
                tagListElement.prepend(...statsSection, ...optionsSection);
            }
        },
        reorderPostSections: function() {
            const tagList = document.querySelector('#tag-list');
            if (!tagList) {
                Logger.warn("[App.reorderPostSections] Could not find the native #tag-list.");
                return;
            }
            this.processTagList(tagList, false);
        },
        setupGalleryHotkeys: function() {
            document.addEventListener('keydown', e => {
                const activeEl = document.activeElement;
                if (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl === document.getElementById(Config.SELECTORS.PREVIEW_CONTAINER_ID) || activeEl.closest(`#${Config.SELECTORS.ADVANCED_SEARCH_MODAL_ID}`)) return;

                const currentPageElement = document.querySelector(Config.SELECTORS.PAGINATION_CURRENT_SELECTOR);
                if (!currentPageElement) return;
                let targetLink = null;
                if (e.key === Settings.State.KEY_GALLERY_NEXT_PAGE) {
                    targetLink = currentPageElement.nextElementSibling;
                } else if (e.key === Settings.State.KEY_GALLERY_PREV_PAGE) {
                    targetLink = currentPageElement.previousElementSibling;
                }
                if (targetLink?.tagName === 'A') {
                    window.location.href = targetLink.href;
                }
            });
        },
        async init() {
            await Settings.load();

            const isGalleryPage = !!document.querySelector(Config.SELECTORS.THUMBNAIL_GRID_SELECTOR);
            const contentElement = document.querySelector(Config.SELECTORS.IMAGE_SELECTOR) || document.querySelector(Config.SELECTORS.VIDEO_PLAYER_SELECTOR);
            const isPostPage = contentElement && !contentElement.closest('.thumbnail-preview');
            const isAccountPage = window.location.search.includes('page=account');

            const isPoolShowPage = window.location.search.includes('page=pool&s=show');
            const isFavoritesPage = window.location.search.includes('page=favorites&s=view');

            if (isPostPage) {
                GlobalState.pageType = 'post';
                document.body.classList.add('gbs-page-post');
            } else if (isPoolShowPage) {
                GlobalState.pageType = 'gallery';
                document.body.classList.add('gbs-page-pool-show');
            } else if (isFavoritesPage) {
                GlobalState.pageType = 'gallery';
                document.body.classList.add('gbs-page-favorites');
            } else if (isGalleryPage) {
                GlobalState.pageType = 'gallery';
                document.body.classList.add('gbs-page-gallery');
            } else if (isAccountPage) {
                GlobalState.pageType = 'account';
                document.body.classList.add('gbs-page-account');
            }

            this.addGlobalStyles();
            GM_registerMenuCommand('Suite Settings', () => Settings.UI.openModal());

            if (GlobalState.pageType === 'account') {
                this.collapseStatsByDefault();
            }

            if (GlobalState.pageType === 'gallery') {
                this.setupGalleryHotkeys();

                if (Settings.State.ENABLE_ADVANCED_SEARCH) {
                    AdvancedSearch.init();
                }
                if (Settings.State.ENABLE_ADD_TO_POOL) {
                    await AddToPool.init();
                }
                if (Settings.State.ENABLE_DOWNLOADER) {
                    Downloader.init();
                }
                if (Settings.State.ENABLE_POST_MARKERS) {
                    PostMarkers.init();
                    this.addClearMarkersCacheButton();
                }
            }

            if (GlobalState.pageType === 'post') {
                this.movePostActions();
                this.reorderPostSections();
                this.initPostPoolUI();
                this.adjustMediaHeight();
                this.setupMediaScroll();
            }

            this.setupDeleteModeCompatibility();

            MediaViewer.init();
            Logger.log("Gelbooru Suite initialized.");
        }
    };

    // =================================================================================
    // SCRIPT ENTRY POINT
    // =================================================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', App.init.bind(App));
    } else {
        App.init();
    }
})();

//in beta...