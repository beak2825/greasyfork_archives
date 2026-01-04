// ==UserScript==
// @name         Fishtank.live | Unclaimed Item Highlighter + Profile Item Search
// @namespace    https://greasyfork.org/en/scripts/537655-fishtank-live-unclaimed-item-highlighter-profile-item-search
// @version      0.1.1
// @description  Items not claimed by your profile will be highlighted in inventory, marketplace, and chat-linked items (when hovering them). Search functionality in Profile Items section. Privacy friendly! None of your data is logged.
// @author       @c
// @match        https://fishtank.live/*
// @match        https://www.fishtank.live/*
// @connect      api.fishtank.live
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537655/Fishtanklive%20%7C%20Unclaimed%20Item%20Highlighter%20%2B%20Profile%20Item%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/537655/Fishtanklive%20%7C%20Unclaimed%20Item%20Highlighter%20%2B%20Profile%20Item%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURATION & GLOBAL STATE ---
    const ALL_ITEMS_API_URL = 'https://api.fishtank.live/v1/items/';
    const CONSUMED_ITEMS_API_URL_BASE = 'https://api.fishtank.live/v1/items/used/';
    const HIGHLIGHT_CLASS = 'unconsumed-highlight-userscript';
    const PROFILE_ITEM_SEARCH_WRAPPER_ID = 'highlighter-profile-search-wrapper';
    const PROFILE_ITEM_SEARCH_ID = 'highlighter-profile-item-search';

    // Centralized DOM selectors for maintainability
    const SELECTORS = {
        PROFILE_ITEMS_CONTAINER: 'div[class*="user-profile-items_user-profile-items"]',
        PROFILE_ITEMS_GRID: 'div[class*="user-profile-items_items"]',
        PROFILE_ITEM: 'div[class*="user-profile-items_item"]',
        PROFILE_ITEM_ICON_IN_GRID: 'img[class*="user-profile-items_icon"]',
        CHAT_ITEM_POPUP: '[class*="item-card_item-card"]',
        CHAT_ITEM_POPUP_ICON_DIV: 'div[class*="item-card_icon"]',
        CHAT_ITEM_POPUP_GRID: '[class*="item-card_grid"]',
        INVENTORY_SLOTS_CONTAINER: 'div[class*="inventory_slots"]',
        INVENTORY_ITEM: 'button[class*="inventory-item_inventory-item"]',
        INVENTORY_ITEM_ICON_CONTAINER: 'div[class*="inventory-item_icon"]',
        MARKETPLACE_MODAL: 'div[class*="item-market-modal_item-market-modal"]',
        MARKETPLACE_ITEMS_LIST_CONTAINER: 'div[class*="item-market-modal_items"]',
        MARKETPLACE_LIST_ITEM: 'div[class*="item-market-modal_market-list-item"]',
        MARKETPLACE_ITEM_ICON_CONTAINER: 'div[class*="item-market-modal_icon"]',
        USER_INFO_TOP_BAR: '[class*="top-bar-user_"][data-user-id]',
    };

    // Cache configuration
    const CACHE_KEYS = {
        ALL_ITEMS: 'fishtank_allItemsData_v1.6.0',
        ALL_ITEMS_TIMESTAMP: 'fishtank_allItemsTimestamp_v1.6.0',
        ALL_ITEMS_DURATION: 6 * 60 * 60 * 1000, // 6 hours
        CONSUMED_ITEMS_DURATION: 1 * 60 * 1000, // 1 minute
    };

    // Global script state
    let SCRIPT_STATE = {
        profileId: null,
        allItemsMapByIcon: null,
        allItemsMapById: null,
        consumedItemIds: null,
        isCoreDataLoading: false,
        isCoreDataLoaded: false,
        lastConsumedFetchTime: 0,
        isMarketplaceVisible: false,
        lastFetchedMarketItems: null,
    };

    let observers = {}; // Stores MutationObserver instances
    let debouncedFunctions = {}; // Stores debounced versions of functions

    // --- STYLES ---
    // Applies custom CSS for highlighting and the search bar UI.
    function applyStyles() {
        if (!document.body && !['complete', 'interactive'].includes(document.readyState)) {
            return document.addEventListener('DOMContentLoaded', applyStyles);
        }
        try {
            GM_addStyle(`
                ${SELECTORS.PROFILE_ITEMS_CONTAINER} { position: relative !important; min-height: 60px; }
                ${SELECTORS.PROFILE_ITEMS_CONTAINER} > ${SELECTORS.PROFILE_ITEMS_GRID} { padding-top: 55px !important; }
                #${PROFILE_ITEM_SEARCH_WRAPPER_ID} { position: absolute !important; top: 10px; left: 50%; transform: translateX(-50%); width: 40px; height: 40px; border-radius: 20px; background-color: rgba(40, 40, 45, 0.55); display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 105; box-shadow: 0 1px 4px rgba(0,0,0,0.15); opacity: 0; pointer-events: none; transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s ease-out, box-shadow 0.3s ease-out, opacity 0.3s ease-out; }
                #${PROFILE_ITEM_SEARCH_WRAPPER_ID}::before { content: ''; display: block; width: 20px; height: 20px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='rgba(220,220,220,0.85)'%3E%3Cpath d='M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: center; background-size: contain; opacity: 1; transition: opacity 0.2s 0.05s ease-out; }
                #${PROFILE_ITEM_SEARCH_ID} { position: absolute; opacity: 0; pointer-events: none; width: 100%; height: 100%; padding: 0 15px; box-sizing: border-box; border: none; border-radius: inherit; background-color: transparent; color: #e0e0e0; font-size: 14px; text-align: left; outline: none; transition: opacity 0.2s 0.1s ease-out, position 0s 0.2s; }
                #${PROFILE_ITEM_SEARCH_WRAPPER_ID}:hover, #${PROFILE_ITEM_SEARCH_WRAPPER_ID}:focus-within { width: clamp(240px, 70%, 380px); background-color: rgba(55, 55, 60, 0.92); box-shadow: 0 3px 8px rgba(0,0,0,0.2); cursor: default; }
                #${PROFILE_ITEM_SEARCH_WRAPPER_ID}:hover::before, #${PROFILE_ITEM_SEARCH_WRAPPER_ID}:focus-within::before { opacity: 0; transition-delay: 0s; }
                #${PROFILE_ITEM_SEARCH_WRAPPER_ID}:hover #${PROFILE_ITEM_SEARCH_ID}, #${PROFILE_ITEM_SEARCH_WRAPPER_ID}:focus-within #${PROFILE_ITEM_SEARCH_ID} { position: static; opacity: 1; pointer-events: auto; cursor: text; transition: opacity 0.2s 0.1s ease-out, position 0s 0.1s; }
                #${PROFILE_ITEM_SEARCH_ID}::placeholder { color: rgba(180, 180, 180, 0.7); }
                #${PROFILE_ITEM_SEARCH_ID}::-webkit-search-cancel-button { -webkit-appearance: none; position: absolute; right: 12px; top: 50%; transform: translateY(-50%); height: 16px; width: 16px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10' fill='rgba(200, 200, 200, 0.7)'%3E%3Cpath d='M1 1 L9 9 M9 1 L1 9' stroke='currentColor' stroke-width='2'/%3E%3C/svg%3E"); background-size: 0.7em 0.7em; background-repeat: no-repeat; background-position: center; cursor: pointer; opacity: 0; }
                #${PROFILE_ITEM_SEARCH_WRAPPER_ID}:hover #${PROFILE_ITEM_SEARCH_ID}:not(:placeholder-shown)::-webkit-search-cancel-button, #${PROFILE_ITEM_SEARCH_WRAPPER_ID}:focus-within #${PROFILE_ITEM_SEARCH_ID}:not(:placeholder-shown)::-webkit-search-cancel-button { opacity: 0.7; transition: opacity 0.2s 0.15s ease-out; }
                #${PROFILE_ITEM_SEARCH_ID}::-webkit-search-cancel-button:hover { opacity: 1; }

                ${SELECTORS.INVENTORY_SLOTS_CONTAINER} ${SELECTORS.INVENTORY_ITEM}.${HIGHLIGHT_CLASS} ${SELECTORS.INVENTORY_ITEM_ICON_CONTAINER} img,
                ${SELECTORS.MARKETPLACE_LIST_ITEM}.${HIGHLIGHT_CLASS} ${SELECTORS.MARKETPLACE_ITEM_ICON_CONTAINER} img { border: 3px solid gold !important; box-shadow: 0 0 8px 3px gold, inset 0 0 5px 1px rgba(0,0,0,0.4), inset 0 0 10px gold !important; border-radius: 8px !important; }

                ${SELECTORS.CHAT_ITEM_POPUP_ICON_DIV}.${HIGHLIGHT_CLASS} { position: relative !important; z-index: 0 !important; }
                ${SELECTORS.CHAT_ITEM_POPUP_ICON_DIV}.${HIGHLIGHT_CLASS}::after { content: ''; position: absolute; top: -3px; left: -3px; bottom: -3px; right: -3px; border: 3px solid gold !important; border-radius: 6px !important; box-shadow: 0 0 8px 3px gold !important; z-index: -1; pointer-events: none !important; }

                ${SELECTORS.INVENTORY_ITEM_ICON_CONTAINER}, ${SELECTORS.MARKETPLACE_ITEM_ICON_CONTAINER},
                ${SELECTORS.CHAT_ITEM_POPUP_ICON_DIV}, ${SELECTORS.CHAT_ITEM_POPUP_GRID} { overflow: visible !important; }
            `);
        } catch (e) { console.error('[HIGHLIGHTER] Error applying styles:', e); }
    }
    applyStyles();

    // --- UTILITY FUNCTIONS ---
    // Gets data from GM cache if valid and not expired.
    const getCached = async (key, tsKey, duration) => {
        const ts = await GM.getValue(tsKey);
        if (ts && (Date.now() - ts < duration)) {
            const dataStr = await GM.getValue(key);
            if (dataStr) return JSON.parse(dataStr);
        }
        return null;
    };
    // Sets data to GM cache with a timestamp.
    const setCached = (key, tsKey, data) => Promise.all([GM.setValue(key, JSON.stringify(data)), GM.setValue(tsKey, Date.now())]);
    // Extracts an image filename from a full URL.
    const extractIconFilename = (url) => url ? url.substring(url.lastIndexOf('/') + 1).split('?')[0] : null;
    // Debounces a function call.
    const debounce = (func, delay) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => func.apply(this, a), delay); }; };

    // Retrieves the current user's profile ID from DOM or cookies.
    const getProfileId = () => {
        const userEl = document.querySelector(SELECTORS.USER_INFO_TOP_BAR);
        if (userEl?.dataset.userId) return userEl.dataset.userId;
        for (const cookie of document.cookie.split(';')) {
            const [name, ...rest] = cookie.split('=');
            if (name.trim().startsWith('ph_phc_') && name.trim().endsWith('_posthog')) {
                try { return JSON.parse(decodeURIComponent(rest.join('=')))?.distinct_id; } catch (e) {/*ignore*/}
            }
        }
        return null;
    };

    // Makes an API request using GM.xmlHttpRequest, with caching support.
    const apiRequest = async (url, { useCache = false, cacheKeys = {}, headers = {} } = {}) => {
        if (useCache && cacheKeys.data && cacheKeys.timestamp && cacheKeys.duration) {
            const cached = await getCached(cacheKeys.data, cacheKeys.timestamp, cacheKeys.duration);
            if (cached) return cached;
        }
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET', url, headers,
                onload: async resp => {
                    if (resp.status >= 200 && resp.status < 300) {
                        try {
                            const jsonData = JSON.parse(resp.responseText);
                            if (useCache && cacheKeys.data && cacheKeys.timestamp) await setCached(cacheKeys.data, cacheKeys.timestamp, jsonData);
                            resolve(jsonData);
                        } catch (e) { reject(new Error(`JSON parse error from ${url}: ${e.message}`)); }
                    } else { reject(new Error(`API request to ${url} failed: ${resp.status} ${resp.statusText}`)); }
                },
                onerror: err => reject(new Error(`API network error for ${url}: ${err.error || 'Unknown'}`))
            });
        });
    };

    // --- CORE DATA HANDLING ---
    // Loads all item definitions and current user's consumed items.
    async function loadCoreData(forceConsumedRefresh = false) {
        // Prevent concurrent loading or use fresh cached data if available.
        if (SCRIPT_STATE.isCoreDataLoading && !forceConsumedRefresh) {
            return new Promise(resolve => setTimeout(() => resolve(loadCoreData(forceConsumedRefresh)), 200));
        }
        const now = Date.now();
        if (SCRIPT_STATE.isCoreDataLoaded && SCRIPT_STATE.allItemsMapByIcon &&
            (!SCRIPT_STATE.profileId || SCRIPT_STATE.consumedItemIds) &&
            !forceConsumedRefresh &&
            (!SCRIPT_STATE.profileId || (now - SCRIPT_STATE.lastConsumedFetchTime <= CACHE_KEYS.CONSUMED_ITEMS_DURATION))) {
            return true; // Data is loaded and fresh.
        }
        SCRIPT_STATE.isCoreDataLoading = true;
        SCRIPT_STATE.profileId = SCRIPT_STATE.profileId || getProfileId(); // Ensure profile ID is fetched.

        try {
            // Load all item definitions (cached for a long duration).
            if (!SCRIPT_STATE.allItemsMapByIcon) {
                const allItemsData = await apiRequest(ALL_ITEMS_API_URL, {
                    useCache: true,
                    cacheKeys: { data: CACHE_KEYS.ALL_ITEMS, timestamp: CACHE_KEYS.ALL_ITEMS_TIMESTAMP, duration: CACHE_KEYS.ALL_ITEMS_DURATION }
                });
                if (!allItemsData || typeof allItemsData !== 'object') throw new Error("Invalid allItems API response.");
                SCRIPT_STATE.allItemsMapByIcon = {};
                SCRIPT_STATE.allItemsMapById = {};
                Object.values(allItemsData).forEach(item => {
                    if (item?.icon) SCRIPT_STATE.allItemsMapByIcon[item.icon] = item;
                    if (item?.id !== undefined) SCRIPT_STATE.allItemsMapById[item.id.toString()] = item;
                });
            }
            // Load consumed items (cached for a short duration or if forced).
            if (SCRIPT_STATE.profileId && (forceConsumedRefresh || !SCRIPT_STATE.consumedItemIds || (now - SCRIPT_STATE.lastConsumedFetchTime > CACHE_KEYS.CONSUMED_ITEMS_DURATION))) {
                const consumedData = await apiRequest(`${CONSUMED_ITEMS_API_URL_BASE}${SCRIPT_STATE.profileId}`); // No GM cache for consumed, handled by time check.
                if (!consumedData?.usedItems || typeof consumedData.usedItems !== 'object') throw new Error("Invalid consumedItems API response.");
                SCRIPT_STATE.consumedItemIds = new Set(Object.keys(consumedData.usedItems).map(id => parseInt(id, 10)));
                SCRIPT_STATE.lastConsumedFetchTime = now;
            }
            SCRIPT_STATE.isCoreDataLoaded = true;
        } catch (error) {
            console.error('[HIGHLIGHTER] Core data load failed:', error.message || error);
            SCRIPT_STATE.isCoreDataLoaded = false;
        } finally {
            SCRIPT_STATE.isCoreDataLoading = false;
        }
        return SCRIPT_STATE.isCoreDataLoaded && SCRIPT_STATE.allItemsMapByIcon !== null;
    }

    // --- HIGHLIGHTING LOGIC HELPERS ---
    // Retrieves item data from SCRIPT_STATE using an image element.
    const getItemFromImg = (imgEl) => {
        if (!imgEl?.src || !SCRIPT_STATE.allItemsMapByIcon) return null;
        const iconFile = extractIconFilename(imgEl.src);
        return iconFile ? SCRIPT_STATE.allItemsMapByIcon[iconFile] : null;
    };
    // Determines if a given item should be highlighted (unconsumed).
    const shouldItemBeHighlighted = (item) => item?.id !== undefined && SCRIPT_STATE.profileId && SCRIPT_STATE.consumedItemIds && !SCRIPT_STATE.consumedItemIds.has(item.id);

    // --- UI UPDATE FUNCTIONS ---
    // Highlights items in the user's inventory.
    async function highlightInventory() {
        if (!(await loadCoreData(true)) || !SCRIPT_STATE.profileId || !SCRIPT_STATE.consumedItemIds) return; // Force refresh consumed.
        document.querySelectorAll(`${SELECTORS.INVENTORY_SLOTS_CONTAINER} ${SELECTORS.INVENTORY_ITEM}`).forEach(slot => {
            const img = slot.querySelector(`${SELECTORS.INVENTORY_ITEM_ICON_CONTAINER} img`);
            slot.classList.toggle(HIGHLIGHT_CLASS, !slot.disabled && shouldItemBeHighlighted(getItemFromImg(img)));
        });
    }

    // Highlights items in the marketplace using a two-pass approach for perceived speed.
    // Pass 1: Highlight with current data. Pass 2 (triggered internally): Refresh consumed data & re-highlight.
    async function highlightMarketplace(isCalledAfterConsumedRefresh = false) {
        const marketItemsListContainer = document.querySelector(SELECTORS.MARKETPLACE_ITEMS_LIST_CONTAINER);
        if (!marketItemsListContainer) return;

        // On the first pass, clear existing highlights for immediate visual feedback.
        if (!isCalledAfterConsumedRefresh) {
            marketItemsListContainer.querySelectorAll(`.${HIGHLIGHT_CLASS}`).forEach(el => el.classList.remove(HIGHLIGHT_CLASS));
        }

        if (!SCRIPT_STATE.lastFetchedMarketItems?.length) return; // No market items fetched from API to process.
        // Ensure all-item definitions are available. Attempt to load if missing on the first pass.
        if (!SCRIPT_STATE.allItemsMapById) {
             if (!isCalledAfterConsumedRefresh) { // First pass
                 await loadCoreData(false); // Attempt to load all items (don't force consumed yet).
                 if (!SCRIPT_STATE.allItemsMapById) return; // Still not ready, abort.
            } else { // Second pass, but allItemsMapById still missing - critical error.
                return;
            }
        }

        // Map DOM elements by icon for efficient updates.
        const domItemsByIcon = new Map();
        marketItemsListContainer.querySelectorAll(SELECTORS.MARKETPLACE_LIST_ITEM).forEach(el => {
            const img = el.querySelector(`${SELECTORS.MARKETPLACE_ITEM_ICON_CONTAINER} img`);
            const iconFile = extractIconFilename(img?.src);
            if (iconFile) {
                if (!domItemsByIcon.has(iconFile)) domItemsByIcon.set(iconFile, []);
                domItemsByIcon.get(iconFile).push(el);
            }
        });

        // Apply highlights based on currently available (potentially stale on first pass) consumed data.
        SCRIPT_STATE.lastFetchedMarketItems.forEach(apiItem => {
            const itemDetails = SCRIPT_STATE.allItemsMapById[apiItem.itemId.toString()];
            if (!itemDetails?.icon) return;
            const matchingDomItems = domItemsByIcon.get(itemDetails.icon);
            const canHighlight = SCRIPT_STATE.profileId && SCRIPT_STATE.consumedItemIds; // Check if consumed data is available at all.
            matchingDomItems?.forEach(domEl => {
                domEl.classList.toggle(HIGHLIGHT_CLASS, canHighlight && shouldItemBeHighlighted(itemDetails));
            });
        });

        // If this was the first pass, trigger a refresh of consumed items and then re-run highlighting.
        if (!isCalledAfterConsumedRefresh) {
            const consumedRefreshed = await loadCoreData(true); // Force refresh consumed items.
            if (consumedRefreshed) {
                await highlightMarketplace(true); // Call again, marking as second pass.
            }
        }
    }

    // Filters items in the profile items grid based on search term.
    function filterProfileItems(searchTerm, gridEl) {
        if (!SCRIPT_STATE.allItemsMapByIcon || !gridEl) return;
        const term = searchTerm.toLowerCase().trim();
        gridEl.querySelectorAll(SELECTORS.PROFILE_ITEM).forEach(itemEl => {
            const itemData = getItemFromImg(itemEl.querySelector(SELECTORS.PROFILE_ITEM_ICON_IN_GRID));
            itemEl.style.display = (term === '' || itemData?.name?.toLowerCase().includes(term)) ? '' : 'none';
        });
    }

    // Adds the search bar to the profile items page.
    function addProfileItemSearch(containerEl, gridEl) {
        let wrapper = containerEl.querySelector(`#${PROFILE_ITEM_SEARCH_WRAPPER_ID}`);
        if (!wrapper) { // Create search bar if it doesn't exist.
            wrapper = document.createElement('div');
            wrapper.id = PROFILE_ITEM_SEARCH_WRAPPER_ID;
            const input = Object.assign(document.createElement('input'), {
                type: 'search', id: PROFILE_ITEM_SEARCH_ID, placeholder: 'Search items...',
                oninput: e => debouncedFunctions.filterProfileItems(e.target.value, gridEl),
                onsearch: e => { if (!e.target.value) debouncedFunctions.filterProfileItems('', gridEl); }
            });
            input.setAttribute('aria-label', 'Search profile items');
            wrapper.appendChild(input);
            containerEl.insertBefore(wrapper, containerEl.firstChild);
        }
        const finalWrapper = wrapper; // Closure for observer.
        // Observe grid for items to fade in search bar.
        if (observers.profileGrid) observers.profileGrid.disconnect();
        observers.profileGrid = new MutationObserver((_, obs) => {
            if (gridEl.querySelector(SELECTORS.PROFILE_ITEM)) { // Items loaded.
                requestAnimationFrame(() => { finalWrapper.style.opacity = '1'; finalWrapper.style.pointerEvents = 'auto'; });
                obs.disconnect(); observers.profileGrid = null;
            }
        });
        observers.profileGrid.observe(gridEl, { childList: true });
        // Immediate check if items are already present.
        if (gridEl.querySelector(SELECTORS.PROFILE_ITEM)) {
            requestAnimationFrame(() => { finalWrapper.style.opacity = '1'; finalWrapper.style.pointerEvents = 'auto'; });
            if (observers.profileGrid) { observers.profileGrid.disconnect(); observers.profileGrid = null; }
        }
    }

    // --- NETWORK INTERCEPTION ---
    // Intercepts fetch/XHR to capture marketplace data and trigger highlights.
    const origFetch = window.fetch;
    window.fetch = async function(resource, init) {
        const url = (typeof resource === 'string' ? resource : resource?.url) ?? '';
        const response = await origFetch.apply(this, arguments);
        const marketListRegex = /api\.fishtank\.live\/v1\/market(\?[\w=&-]+)?$/;
        const marketActionRegex = /api\.fishtank\.live\/v1\/market\/[\w-]+\/(bid|buyout|cancel)/i;

        if (marketListRegex.test(url) && response.ok) { // Market list fetched.
            response.clone().json().then(data => {
                SCRIPT_STATE.lastFetchedMarketItems = data?.marketItems ?? [];
                if (SCRIPT_STATE.isMarketplaceVisible) { ensureMarketItemsObserverIsActive(); debouncedFunctions.highlightMarketplace(); }
            }).catch(err => console.error('[HIGHLIGHTER] Fetch market JSON error:', err, url));
        } else if (marketActionRegex.test(url) && SCRIPT_STATE.isMarketplaceVisible) { // Market action occurred.
            ensureMarketItemsObserverIsActive(); debouncedFunctions.highlightMarketplace();
        }
        return response;
    };
    const { open: origXHROpen, send: origXHRSend } = XMLHttpRequest.prototype;
    XMLHttpRequest.prototype.open = function(method, url) { this._hl_url = url; return origXHROpen.apply(this, arguments); };
    XMLHttpRequest.prototype.send = function() {
        this.addEventListener('load', function() {
            const url = this._hl_url ?? '';
            const marketListRegex = /api\.fishtank\.live\/v1\/market(\?[\w=&-]+)?$/;
            const marketActionRegex = /api\.fishtank\.live\/v1\/market\/[\w-]+\/(bid|buyout|cancel)/i;
            if (marketListRegex.test(url) && this.status >= 200 && this.status < 300 && this.responseText) { // Market list fetched via XHR.
                try {
                    SCRIPT_STATE.lastFetchedMarketItems = JSON.parse(this.responseText)?.marketItems ?? [];
                    if (SCRIPT_STATE.isMarketplaceVisible) { ensureMarketItemsObserverIsActive(); debouncedFunctions.highlightMarketplace(); }
                } catch (e) { console.error('[HIGHLIGHTER] XHR market JSON error:', e); }
            } else if (marketActionRegex.test(url) && SCRIPT_STATE.isMarketplaceVisible) { // Market action via XHR.
                ensureMarketItemsObserverIsActive(); debouncedFunctions.highlightMarketplace();
            }
        });
        return origXHRSend.apply(this, arguments);
    };

    // --- DOM OBSERVERS SETUP ---
    // Manages MutationObserver for marketplace item list changes.
    function ensureMarketItemsObserverIsActive() {
        if (!SCRIPT_STATE.isMarketplaceVisible) { // Disconnect if market not visible.
            if (observers.marketItems) { observers.marketItems.disconnect(); observers.marketItems = null; }
            return;
        }
        const el = document.querySelector(SELECTORS.MARKETPLACE_ITEMS_LIST_CONTAINER);
        if (el) { // Target element found.
            if (observers.marketItems && observers.marketItems.target === el) return; // Already observing correct target.
            if (observers.marketItems) observers.marketItems.disconnect(); // Disconnect old observer.
            observers.marketItems = new MutationObserver(() => debouncedFunctions.highlightMarketplace());
            observers.marketItems.observe(el, { childList: true, subtree: true });
            observers.marketItems.target = el;
        } else { // Target not found, ensure disconnected.
            if (observers.marketItems) { observers.marketItems.disconnect(); observers.marketItems = null; }
        }
    }

    // Initializes all MutationObservers for dynamic page content.
    function setupObservers() {
        // Debounce UI update functions to prevent excessive calls.
        debouncedFunctions.highlightInventory = debounce(highlightInventory, 300);
        debouncedFunctions.highlightMarketplace = debounce(highlightMarketplace, 250); // Slightly faster for market.
        debouncedFunctions.filterProfileItems = debounce(filterProfileItems, 300);

        // Observer for user's inventory.
        const invContainer = document.querySelector(SELECTORS.INVENTORY_SLOTS_CONTAINER);
        if (invContainer) {
            observers.inventory = new MutationObserver(muts => {
                if (muts.some(m => m.type === 'childList' || m.type === 'attributes')) debouncedFunctions.highlightInventory();
            });
            observers.inventory.observe(invContainer, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'disabled', 'src'] });
            if (SCRIPT_STATE.profileId) highlightInventory(); // Initial highlight.
        }

        // Observer for marketplace modal visibility.
        observers.marketVisibility = new MutationObserver(async () => {
            const marketEl = document.querySelector(SELECTORS.MARKETPLACE_MODAL);
            const isVisible = marketEl && (marketEl.offsetParent || getComputedStyle(marketEl).display !== 'none');
            if (isVisible && !SCRIPT_STATE.isMarketplaceVisible) { // Market just became visible.
                SCRIPT_STATE.isMarketplaceVisible = true;
                await loadCoreData(true); // Refresh consumed items.
                ensureMarketItemsObserverIsActive();
                if (SCRIPT_STATE.lastFetchedMarketItems?.length) debouncedFunctions.highlightMarketplace();
            } else if (!isVisible && SCRIPT_STATE.isMarketplaceVisible) { // Market just became hidden.
                SCRIPT_STATE.isMarketplaceVisible = false;
                if (observers.marketItems) { observers.marketItems.disconnect(); observers.marketItems = null; }
            }
        });
        observers.marketVisibility.observe(document.body, { childList: true, subtree: true });

        // Observer for profile items tab container appearing/disappearing.
        observers.profileItemsTab = new MutationObserver(async (mutations) => {
            for (const mut of mutations) {
                if (mut.type === 'childList') {
                    for (const node of mut.addedNodes) { // Handle added profile items container.
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const container = node.matches?.(SELECTORS.PROFILE_ITEMS_CONTAINER) ? node : node.querySelector?.(SELECTORS.PROFILE_ITEMS_CONTAINER);
                            if (container && !container.querySelector(`#${PROFILE_ITEM_SEARCH_WRAPPER_ID}`)) {
                                if (!SCRIPT_STATE.allItemsMapByIcon) await loadCoreData(); // Ensure item defs are loaded.
                                const grid = container.querySelector(SELECTORS.PROFILE_ITEMS_GRID);
                                if (SCRIPT_STATE.allItemsMapByIcon && grid) addProfileItemSearch(container, grid);
                                return; // Process one found container.
                            }
                        }
                    }
                    mut.removedNodes.forEach(node => { // Handle removed profile items container.
                        if (node.nodeType === Node.ELEMENT_NODE && node.matches?.(SELECTORS.PROFILE_ITEMS_CONTAINER)) {
                            node.querySelector(`#${PROFILE_ITEM_SEARCH_WRAPPER_ID}`)?.remove();
                            if (observers.profileGrid) { observers.profileGrid.disconnect(); observers.profileGrid = null; }
                        }
                    });
                }
            }
        });
        observers.profileItemsTab.observe(document.body, { childList: true, subtree: true });

        // Observer for item popups in chat.
        observers.chatItemPopup = new MutationObserver(async (mutations) => {
            for (const mut of mutations) {
                if (mut.type === 'childList') {
                    for (const node of mut.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const cardEl = node.matches?.(SELECTORS.CHAT_ITEM_POPUP) ? node : node.querySelector?.(SELECTORS.CHAT_ITEM_POPUP);
                            if (cardEl) { // Chat item popup appeared.
                                const iconDiv = cardEl.querySelector(SELECTORS.CHAT_ITEM_POPUP_ICON_DIV);
                                const imgEl = iconDiv?.querySelector('img');
                                if (imgEl?.src) {
                                    // Ensure core data is loaded (no forced refresh for transient popups).
                                    if (!SCRIPT_STATE.isCoreDataLoaded || !SCRIPT_STATE.allItemsMapByIcon || (SCRIPT_STATE.profileId && !SCRIPT_STATE.consumedItemIds)) {
                                        await loadCoreData();
                                    }
                                    iconDiv.classList.toggle(HIGHLIGHT_CLASS, shouldItemBeHighlighted(getItemFromImg(imgEl)));
                                }
                            }
                        }
                    }
                }
            }
        });
        observers.chatItemPopup.observe(document.body, { childList: true, subtree: true });

        // Initial check for profile items tab already being visible.
        const existingProfileContainer = document.querySelector(SELECTORS.PROFILE_ITEMS_CONTAINER);
        if (existingProfileContainer && !existingProfileContainer.querySelector(`#${PROFILE_ITEM_SEARCH_WRAPPER_ID}`)) {
            const itemsGrid = existingProfileContainer.querySelector(SELECTORS.PROFILE_ITEMS_GRID);
            if (itemsGrid) {
                (SCRIPT_STATE.allItemsMapByIcon ? Promise.resolve() : loadCoreData()).then(() => {
                    if (SCRIPT_STATE.allItemsMapByIcon) addProfileItemSearch(existingProfileContainer, itemsGrid);
                });
            }
        }
    }

    // --- SCRIPT ENTRY POINT ---
    async function main() {
        await loadCoreData(); // Initial data load.
        setupObservers();     // Setup dynamic content monitoring.
    }

    // Run main logic once DOM is ready.
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', main);
    else main();

})();