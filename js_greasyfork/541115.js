// ==UserScript==
// @name         SteamGifts Key Prices
// @namespace    SteamGifts Key Prices from Deals.GG
// @version      3.3
// @description  A customizable web extension for SteamGifts that displays the lowest keyshop prices from GG.deals directly on all giveaway pages
// @author       Taurus#
// @homepage	 https://github.com/MapperTaurus/SteamGifts-Key-Prices
// @license      https://github.com/MapperTaurus/SteamGifts-Key-Prices/blob/master/LICENSE
// @icon         https://i.imgur.com/UxcFblA.png
// @match        https://www.steamgifts.com/
// @match        https://www.steamgifts.com/giveaway/*
// @match        https://www.steamgifts.com/giveaways*
// @match        https://www.steamgifts.com/user/*
// @match        https://www.steamgifts.com/group/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      gg.deals
// @downloadURL https://update.greasyfork.org/scripts/541115/SteamGifts%20Key%20Prices.user.js
// @updateURL https://update.greasyfork.org/scripts/541115/SteamGifts%20Key%20Prices.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === CONFIG HANDLING ===
    const MODE_KEY = 'priceDisplayMode'; // "auto" or "click"
    const INDIVIDUAL_KEY = 'viewModeIndividual'; // true or false
    const LIST_KEY = 'viewModeList'; // true or false
    const API_KEY = 'ggDealsApiKey'; // API key storage

    const currentMode = GM_getValue(MODE_KEY, 'click');
    const individualEnabled = GM_getValue(INDIVIDUAL_KEY, true);
    const listEnabled = GM_getValue(LIST_KEY, false);
    const apiKey = GM_getValue(API_KEY, '');

    // === PERFORMANCE OPTIMIZATION ===
    const priceCache = new Map();
    const pendingRequests = new Map(); // Prevent duplicate requests
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache
    const MAX_PARALLEL_REQUESTS = apiKey ? 10 : 3; // More parallel requests with API key
    let activeRequests = 0;

    // Initialize cache from stored data
    try {
        const storedCache = GM_getValue('priceCache', {});
        if (storedCache && typeof storedCache === 'object') {
            Object.entries(storedCache).forEach(([key, value]) => {
                if (value && value.timestamp && value.data) {
                    priceCache.set(key, value);
                }
            });
        }
    } catch (e) {
        console.warn('Failed to load price cache:', e);
    }

    function toggleMode() {
        const newMode = currentMode === 'auto' ? 'click' : 'auto';
        GM_setValue(MODE_KEY, newMode);
        alert(`GG.deals price display mode set to: ${newMode.toUpperCase()}\nReload the page to apply changes.`);
    }

    function toggleIndividual() {
        const newState = !individualEnabled;
        GM_setValue(INDIVIDUAL_KEY, newState);
        alert(`Individual page view: ${newState ? 'ON' : 'OFF'}\nReload the page to apply changes.`);
    }

    function toggleList() {
        const newState = !listEnabled;
        GM_setValue(LIST_KEY, newState);
        alert(`List view: ${newState ? 'ON' : 'OFF'}\nReload the page to apply changes.`);
    }

    function manageApiKey() {
        const currentKey = GM_getValue(API_KEY, '');
        const keyPreview = currentKey ? `${currentKey.substring(0, 8)}...` : 'Not set';

        const action = confirm(
            `Current API Key: ${keyPreview}\n\n` +
            `API Key Benefits:\n` +
            `• Higher request limits\n` +
            `• Faster response times\n` +
            `• Better reliability\n\n` +
            `Get your free API key at: https://gg.deals/api\n\n` +
            `Click OK to set/update API key, Cancel to remove it.`
        );

        if (action) {
            // Set or update API key
            const newKey = prompt(
                'Enter your GG.deals API key:\n\n' +
                'You can get a free API key at: https://gg.deals/api\n' +
                'Leave empty to remove the current key.',
                currentKey
            );

            if (newKey !== null) {
                const trimmedKey = newKey.trim();
                GM_setValue(API_KEY, trimmedKey);

                if (trimmedKey) {
                    alert(`✅ API Key saved successfully!\nKey preview: ${trimmedKey.substring(0, 8)}...\n\nReload the page to use the API key.`);
                } else {
                    alert('🗑️ API Key removed. You\'ll use the standard request limits.\n\nReload the page to apply changes.');
                }
            }
        } else {
            // Remove API key
            GM_setValue(API_KEY, '');
            alert('🗑️ API Key removed. You\'ll use the standard request limits.\n\nReload the page to apply changes.');
        }
    }

    // Register menu commands
    GM_registerMenuCommand(`👁️Display Mode: ${currentMode.toUpperCase()}`, toggleMode);
    GM_registerMenuCommand(`📄Individual View: ${individualEnabled ? 'ON' : 'OFF'}`, toggleIndividual);
    GM_registerMenuCommand(`📚List View: ${listEnabled ? 'ON' : 'OFF'}`, toggleList);
    GM_registerMenuCommand(`🔑API Key: ${apiKey ? 'SET' : 'NOT SET'}`, manageApiKey);
    GM_registerMenuCommand(`❤️Like This Script?`, () => {
  window.open('https://github.com/MapperTaurus/SteamGifts-Key-Prices?tab=readme-ov-file#-like-this-script', '_blank');
});

    // === API HELPER FUNCTIONS ===
    function buildApiUrl(endpoint, params = {}) {
        const baseUrl = 'https://gg.deals/api/v2';
        const url = new URL(`${baseUrl}${endpoint}`);

        // Add API key if available
        if (apiKey) {
            params.key = apiKey;
        }

        // Add other parameters
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key]);
            }
        });

        return url.toString();
    }

    function makeApiRequest(endpoint, params, callback) {
        const url = buildApiUrl(endpoint, params);

        activeRequests++;

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'SteamGifts-KeyPrices-UserScript/3.1'
            },
            timeout: apiKey ? 8000 : 15000, // Faster timeout with API key
            onload: function (response) {
                activeRequests--;
                if (response.status === 200) {
                    try {
                        const data = JSON.parse(response.responseText);
                        callback({ success: true, data: data });
                    } catch (err) {
                        console.error("❌API JSON parsing error:", err);
                        callback({ success: false, message: "❌Error parsing API response", error: err });
                    }
                } else if (response.status === 429) {
                    callback({ success: false, message: "⏰Rate limit exceeded", error: `HTTP ${response.status}` });
                } else if (response.status === 401) {
                    callback({ success: false, message: "🔐Invalid API key", error: `HTTP ${response.status}` });
                } else {
                    callback({ success: false, message: `⚠️API request failed (HTTP ${response.status})`, error: `HTTP ${response.status}` });
                }
            },
            onerror: function (error) {
                activeRequests--;
                callback({ success: false, message: `❌Network error`, error: error });
            },
            ontimeout: function() {
                activeRequests--;
                callback({ success: false, message: `⏰Request timeout`, error: 'timeout' });
            }
        });
    }

    // === PAGE DETECTION ===
    function isIndividualGiveawayPage() {
        return window.location.pathname.startsWith('/giveaway/') && window.location.pathname.split('/').length >= 3;
    }

    function isGiveawayListPage() {
        return window.location.pathname === '/' ||
               window.location.pathname.startsWith('/giveaways') ||
               window.location.pathname.startsWith('/user/') ||
               window.location.pathname.startsWith('/group/');
    }

    // === UTILITY FUNCTIONS ===
    function getSteamAppIDFromUrl(steamUrl) {
        if (!steamUrl) return null;
        const match = steamUrl.match(/\/app\/(\d+)/);
        return match ? match[1] : null;
    }

    function getSteamAppID() {
        const steamLink = document.querySelector('a[href*="store.steampowered.com/app/"]');
        if (steamLink) {
            return getSteamAppIDFromUrl(steamLink.href);
        }
        return null;
    }

    function getGameTitle() {
        const titleElement = document.querySelector('.featured__heading__medium');
        return titleElement ? titleElement.textContent.trim() : null;
    }

    function slugify(text) {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    function generatePossiblePackUrls(gameTitle) {
        if (!gameTitle) return [];

        const baseSlug = slugify(gameTitle);
        const variations = [
            baseSlug,
            baseSlug.replace(/-ultimate-edition$/, ''),
            baseSlug.replace(/-deluxe-edition$/, ''),
            baseSlug.replace(/-complete-edition$/, ''),
            baseSlug.replace(/-goty$/, ''),
            baseSlug.replace(/-game-of-the-year-edition$/, '')
        ];

        return [...new Set(variations)].map(slug => `https://gg.deals/pack/${slug}/`);
    }

    // === PRICE FETCHING FUNCTIONS (ENHANCED WITH CACHING) ===
    function getCacheKey(appID, gameTitle) {
        if (appID) {
            return `app_${appID}`;
        } else {
            return `title_${gameTitle}`;
        }
    }

    function getCachedPrice(appID, gameTitle) {
        const cacheKey = getCacheKey(appID, gameTitle);
        const cached = priceCache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
            return cached.data;
        }

        return null;
    }

    function setCachedPrice(appID, gameTitle, data) {
        const cacheKey = getCacheKey(appID, gameTitle);
        priceCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });

        // Clean expired cache entries
        const now = Date.now();
        for (const [key, value] of priceCache.entries()) {
            if (!value.timestamp || now - value.timestamp > CACHE_DURATION) {
                priceCache.delete(key);
            }
        }

        savePriceCache();
    }

    function savePriceCache() {
        try {
            const plainObject = Object.fromEntries(priceCache);
            GM_setValue('priceCache', plainObject);
        } catch (e) {
            console.warn('Failed to save price cache:', e);
        }
    }

    function parseApiGameData(gameData) {
        if (!gameData || !gameData.deals) return null;

        // Filter for keyshop deals only
        const keyshopDeals = gameData.deals.filter(deal =>
            deal.shop && deal.shop.is_keyshop === true
        );

        if (keyshopDeals.length === 0) return null;

        // Find the lowest price
        let lowest = null;
        keyshopDeals.forEach(deal => {
            if (deal.price_new && deal.price_new > 0) {
                if (!lowest || deal.price_new < lowest.value) {
                    lowest = {
                        value: deal.price_new,
                        priceText: `${deal.price_new.toFixed(2)} ${deal.currency || 'USD'}`,
                        discountText: deal.price_cut_percent ? `-${deal.price_cut_percent}%` : null,
                        shopName: deal.shop ? deal.shop.name : 'Unknown'
                    };
                }
            }
        });

        return lowest;
    }

    function fetchPriceViaApi(appID, gameTitle, callback) {
        if (!appID) {
            // No app ID, fallback to scraping immediately
            fetchPriceViaScraping(appID, gameTitle, callback);
            return;
        }

        // Check if we're already fetching this
        const cacheKey = getCacheKey(appID, gameTitle);
        if (pendingRequests.has(cacheKey)) {
            // Add to pending callbacks
            const existingCallbacks = pendingRequests.get(cacheKey);
            existingCallbacks.push(callback);
            return;
        }

        // Check cache first
        const cached = getCachedPrice(appID, gameTitle);
        if (cached) {
            callback(cached);
            return;
        }

        // Rate limit check
        if (activeRequests >= MAX_PARALLEL_REQUESTS) {
            setTimeout(() => fetchPriceViaApi(appID, gameTitle, callback), 100);
            return;
        }

        // Start new request
        pendingRequests.set(cacheKey, [callback]);

        makeApiRequest('/games', { steam: appID }, (result) => {
            const callbacks = pendingRequests.get(cacheKey) || [];
            pendingRequests.delete(cacheKey);

            let finalResult;

            if (result.success && result.data && result.data.length > 0) {
                const gameData = result.data[0];
                const lowest = parseApiGameData(gameData);

                if (lowest) {
                    finalResult = {
                        success: true,
                        price: lowest.priceText,
                        discount: lowest.discountText,
                        url: `https://gg.deals/steam/app/${appID}/`,
                        source: 'API'
                    };

                    // Cache the successful result
                    setCachedPrice(appID, gameTitle, finalResult);

                    // Call all pending callbacks
                    callbacks.forEach(cb => cb(finalResult));
                    return;
                }
            }

            // API failed or no data, fallback to scraping for first callback only
            // to avoid multiple scraping requests for the same game
            if (callbacks.length > 0) {
                fetchPriceViaScraping(appID, gameTitle, (scrapingResult) => {
                    if (scrapingResult.success) {
                        setCachedPrice(appID, gameTitle, scrapingResult);
                    }
                    callbacks.forEach(cb => cb(scrapingResult));
                });
            }
        });
    }

    function parseKeyshopPrices(doc) {
        const keyshopsSection = Array.from(doc.querySelectorAll('.game-boxes-heading.with-filters.with-icon'))
            .find(el => el.querySelector('h2')?.textContent?.includes("Compare prices in Keyshops"));

        if (!keyshopsSection) {
            return null;
        }

        const container = keyshopsSection.closest('section') || keyshopsSection.parentElement;
        const dealBlocks = container.querySelectorAll('.game-deals-item');

        let lowest = null;

        dealBlocks.forEach(block => {
            const priceEl = block.querySelector('.price .price-text');
            const discountEl = block.querySelector('.discount.label');

            if (priceEl && /[\d,.]+/.test(priceEl.textContent)) {
                const priceText = priceEl.textContent.trim();
                const numeric = parseFloat(priceText.replace(/[^0-9.]/g, ''));

                if (!isNaN(numeric)) {
                    if (!lowest || numeric < lowest.value) {
                        lowest = {
                            value: numeric,
                            priceText,
                            discountText: discountEl ? discountEl.textContent.trim() : null
                        };
                    }
                }
            }
        });

        return lowest;
    }

    function tryFetchFromUrl(url, callback, fallbackUrls = []) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    try {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");

                        const lowest = parseKeyshopPrices(doc);

                        if (lowest) {
                            callback({ success: true, price: lowest.priceText, discount: lowest.discountText, url: url, source: 'Scraping' });
                        } else if (fallbackUrls && fallbackUrls.length > 0) {
                            const nextUrl = fallbackUrls.shift();
                            tryFetchFromUrl(nextUrl, callback, fallbackUrls);
                        } else {
                            callback({ success: false, message: "⭕No keyshop prices found", url: url });
                        }
                    } catch (err) {
                        console.error("❌Parsing error:", err);
                        if (fallbackUrls && fallbackUrls.length > 0) {
                            const nextUrl = fallbackUrls.shift();
                            tryFetchFromUrl(nextUrl, callback, fallbackUrls);
                        } else {
                            callback({ success: false, message: "❌Error parsing GG.deals page", url: url });
                        }
                    }
                } else {
                    if (fallbackUrls && fallbackUrls.length > 0) {
                        const nextUrl = fallbackUrls.shift();
                        tryFetchFromUrl(nextUrl, callback, fallbackUrls);
                    } else {
                        callback({ success: false, message: `⚠️GG.deals request failed (HTTP ${response.status})`, url: url });
                    }
                }
            },
            onerror: function (error) {
                if (fallbackUrls && fallbackUrls.length > 0) {
                    const nextUrl = fallbackUrls.shift();
                    tryFetchFromUrl(nextUrl, callback, fallbackUrls);
                } else {
                    callback({ success: false, message: `❌Network error: ${error.error}`, url: url });
                }
            }
        });
    }

    function fetchPriceViaScraping(appID, gameTitle, callback) {
        const urls = [];

        if (appID) {
            urls.push(`https://gg.deals/steam/app/${appID}/`);
        }

        if (gameTitle) {
            urls.push(...generatePossiblePackUrls(gameTitle));
        }

        if (urls.length === 0) {
            callback({ success: false, message: "❌No valid URLs to check", url: "" });
            return;
        }

        const primaryUrl = urls.shift();
        tryFetchFromUrl(primaryUrl, callback, urls);
    }

    function fetchPrice(appID, gameTitle, callback) {
        // Check cache first for instant results
        const cached = getCachedPrice(appID, gameTitle);
        if (cached) {
            callback(cached);
            return;
        }

        // Use API if key is available, otherwise fall back to scraping
        if (apiKey) {
            fetchPriceViaApi(appID, gameTitle, callback);
        } else {
            fetchPriceViaScraping(appID, gameTitle, callback);
        }
    }

    // === DISPLAY FUNCTIONS ===
    function createDiscountBadge(discount) {
        if (!discount || !discount.includes('%')) {
            return `<span style="
                background-color: lime;
                color: black;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: bold;
                margin-left: 6px;
                display: inline-block;
            ">🤑 No Discount</span>`;
        }

        const discountValue = parseInt(discount.replace(/[^0-9]/g, ''), 10);
        let color = '#5cb85c';

        if (discountValue > 90) color = '#d9534f';
        else if (discountValue > 60) color = '#f0ad4e';
        else if (discountValue > 30) color = '#5cb89c';
        else color = '#45cc54';

        return `<span style="
            background-color: ${color};
            color: white;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 6px;
            display: inline-block;
        ">${discount}</span>`;
    }

    function createSourceBadge(source) {
        if (!source || source === 'Scraping') return '';

        return `<span style="
            background-color: #007acc;
            color: white;
            padding: 1px 4px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: bold;
            margin-left: 4px;
            display: inline-block;
        ">API</span>`;
    }

    function updatePriceDisplay(result, priceInfo, button) {
        const isErrorMessage = /^[❌⚠️⭕❓]/.test(result.message || result.price);

        if (result.success) {
            const discountPart = createDiscountBadge(result.discount);
            const sourcePart = createSourceBadge(result.source);
            priceInfo.innerHTML = `<strong>🔑:</strong> <a href="${result.url}" target="_blank" rel="noopener noreferrer" style="font-size:18px;">${result.price}</a>${discountPart}${sourcePart}`;
        } else {
            priceInfo.innerHTML = `<strong>🔑:</strong> <span style="font-size:18px;">${result.message}</span>`;
        }
    }

    function updateListPriceDisplay(result, priceElement) {
        if (result.success) {
            const discountPart = ` ${createDiscountBadge(result.discount)}`;
            const sourcePart = createSourceBadge(result.source);
            priceElement.innerHTML = `<a href="${result.url}" target="_blank" rel="noopener noreferrer" style="color: #3f7300; text-decoration: none; font-weight: bold;">${result.price}</a>${discountPart}${sourcePart}`;
        } else {
            priceElement.innerHTML = `<span style="color: #888; font-size: 12px;">${result.message}</span>`;
        }
    }

    // === INDIVIDUAL PAGE FUNCTIONALITY ===
    function fetchLowestKeyshopPrice(appID, priceInfo, button) {
        if (button) {
            button.textContent = "⏳ Loading...";
            button.disabled = true;
            button.style.cursor = "default";
            button.style.opacity = "0.6";
        }

        const gameTitle = getGameTitle();
        fetchPrice(appID, gameTitle, (result) => {
            updatePriceDisplay(result, priceInfo, button);
        });
    }

    function createClickablePriceLine(appID) {
        const giveawayTitle = document.querySelector('.featured__heading__medium');
        if (giveawayTitle) {
            const priceInfo = document.createElement('div');
            priceInfo.style.marginTop = '2px';
            priceInfo.style.fontSize = '14px';
            priceInfo.style.color = '#f6f6f6';

            const button = document.createElement('button');
            button.textContent = "🔑:";
            button.style.background = "transparent";
            button.style.border = "none";
            button.style.color = "#f6f6f6";
            button.style.fontSize = "18px";
            button.style.cursor = "pointer";
            button.style.padding = "0";
            button.style.marginLeft = "0";
            button.style.fontWeight = "bold";

            button.addEventListener('click', () => {
                fetchLowestKeyshopPrice(appID, priceInfo, button);
            });

            priceInfo.appendChild(button);
            giveawayTitle.parentNode.insertBefore(priceInfo, giveawayTitle.nextSibling);
        }
    }

    function displayAutomatically(appID) {
        const giveawayTitle = document.querySelector('.featured__heading__medium');
        if (giveawayTitle) {
            const priceInfo = document.createElement('div');
            priceInfo.style.marginTop = '2px';
            priceInfo.style.fontSize = '14px';
            priceInfo.style.color = '#f6f6f6';

            giveawayTitle.parentNode.insertBefore(priceInfo, giveawayTitle.nextSibling);
            fetchLowestKeyshopPrice(appID, priceInfo, null);
        }
    }

    // === LIST VIEW FUNCTIONALITY (OPTIMIZED) ===
    function processGiveawayRow(row) {
        const steamLink = row.querySelector('a[href*="store.steampowered.com/app/"]');
        const titleElement = row.querySelector('.giveaway__heading__name');

        if (!steamLink && !titleElement) return;

        const appID = getSteamAppIDFromUrl(steamLink ? steamLink.href : null);
        const gameTitle = titleElement ? titleElement.textContent.trim() : null;

        // Skip if already processed
        if (row.dataset.priceProcessed) return;
        row.dataset.priceProcessed = 'true';

        // Create price element
        const priceElement = document.createElement('div');
        priceElement.style.fontSize = '14px';
        priceElement.style.color = '#f6f6f6';
        priceElement.style.marginTop = '2px';
        priceElement.style.lineHeight = '1.2';

        // Insert price element after the game title
        const headingElement = row.querySelector('.giveaway__heading');
        if (headingElement) {
            // Always add the price element first
            headingElement.appendChild(priceElement);

            // Check cache first for both modes
            const cached = getCachedPrice(appID, gameTitle);
            if (cached) {
                updateListPriceDisplay(cached, priceElement);
                return;
            }

            if (currentMode === 'auto') {
                priceElement.innerHTML = '<span style="color: #888;">⏳ Loading price...</span>';

                fetchPrice(appID, gameTitle, (result) => {
                    updateListPriceDisplay(result, priceElement);
                });
            } else {
                // Click mode
                const button = document.createElement('button');
                button.textContent = "🔑";
                button.style.background = "transparent";
                button.style.border = "1px solid #73a442";
                button.style.color = "#6cc04a";
                button.style.fontSize = "14px";
                button.style.cursor = "pointer";
                button.style.padding = "2px 6px";
                button.style.marginTop = "2px";
                button.style.marginLeft = "8px";
                button.style.borderRadius = "3px";
                button.style.display = "block";

                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    button.textContent = "⏳ Loading...";
                    button.disabled = true;
                    button.style.opacity = "0.6";

                    fetchPrice(appID, gameTitle, (result) => {
                        priceElement.removeChild(button);
                        updateListPriceDisplay(result, priceElement);
                    });
                });

                priceElement.appendChild(button);
            }
        }
    }

    function processAllGiveawayRows() {
        const giveawayRows = document.querySelectorAll('.giveaway__row-outer-wrap');

        if (apiKey && currentMode === 'auto') {
            // Batch process with API for better performance
            const unprocessedRows = Array.from(giveawayRows).filter(row => !row.dataset.priceProcessed);

            // Process in small batches to avoid overwhelming the API
            const batchSize = 5;
            for (let i = 0; i < unprocessedRows.length; i += batchSize) {
                const batch = unprocessedRows.slice(i, i + batchSize);
                setTimeout(() => {
                    batch.forEach(processGiveawayRow);
                }, i * 100); // Small delay between batches
            }
        } else {
            // Process normally
            giveawayRows.forEach(processGiveawayRow);
        }
    }

    // === MAIN INITIALIZATION ===
    function init() {
        // Log current configuration for debugging
        console.log(`🔑 SteamGifts Key Prices v3.1 initialized`);
        console.log(`📊 Mode: ${currentMode}, Individual: ${individualEnabled}, List: ${listEnabled}, API: ${apiKey ? 'SET' : 'NOT SET'}`);

        if (individualEnabled && isIndividualGiveawayPage()) {
            // Individual giveaway page mode
            const appID = getSteamAppID();
            const gameTitle = getGameTitle();

            if (appID || gameTitle) {
                if (currentMode === 'auto') {
                    displayAutomatically(appID);
                } else {
                    createClickablePriceLine(appID);
                }
            } else {
                console.warn("❓Neither Steam App ID nor game title found on this giveaway page.");
            }
        }

        if (listEnabled && isGiveawayListPage()) {
            // List view mode - immediate processing for better performance
            processAllGiveawayRows();

            // Set up observer for dynamically loaded content (pagination, etc.)
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && node.classList.contains('giveaway__row-outer-wrap')) {
                                processGiveawayRow(node);
                            } else {
                                const newRows = node.querySelectorAll && node.querySelectorAll('.giveaway__row-outer-wrap');
                                if (newRows) {
                                    newRows.forEach(processGiveawayRow);
                                }
                            }
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    // Start the script
    init();
})();