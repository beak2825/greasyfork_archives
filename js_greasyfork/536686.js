// ==UserScript==
// @name         Fetch NFT Miner Levels from ronencoin.tech (with Cache & Refresh)
// @namespace    https://opensea.io/collection/ronen-coin-mining-network/
// @version      1.2
// @author       spyderbibek
// @description  Fetch miner level data from ronencoin.tech and inject levels on OpenSea with cache and refresh button
// @match        https://opensea.io/collection/ronen-coin-mining-network*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      ronencoin.tech
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/536686/Fetch%20NFT%20Miner%20Levels%20from%20ronencointech%20%28with%20Cache%20%20Refresh%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536686/Fetch%20NFT%20Miner%20Levels%20from%20ronencointech%20%28with%20Cache%20%20Refresh%29.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // === CONFIGURATION ===
    const DEBUG = false;  // Set to false to disable debug logs
    const CACHE_KEY = 'ronen_token_levels_cache';
    const CACHE_DATE_KEY = 'ronen_cache_last_refresh';
    const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

    // === UTILS ===
    function debugLog(...args) {
        if (DEBUG) console.log('[NFTLevelInjector]', ...args);
    }
    function formatDate(ts) {
        const d = new Date(ts);
        return d.toLocaleString();
    }

    // Delay helper
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // Cache helpers using GM storage
    async function loadCache() {
        const raw = await GM_getValue(CACHE_KEY, '{}');
        try {
            return JSON.parse(raw);
        } catch {
            return {};
        }
    }

    async function saveCache(cache) {
        await GM_setValue(CACHE_KEY, JSON.stringify(cache));
    }

    async function clearCache() {
        await GM_deleteValue(CACHE_KEY);
        await GM_setValue(CACHE_DATE_KEY, Date.now().toString());
        debugLog('Cache cleared');
        updateRefreshLabel();
    }

    async function getLastRefreshTime() {
        const last = await GM_getValue(CACHE_DATE_KEY, '0');
        return parseInt(last) || 0;
    }

    async function setLastRefreshTime(ts) {
        await GM_setValue(CACHE_DATE_KEY, ts.toString());
    }

    async function isCacheExpired() {
        const last = await getLastRefreshTime();
        return (Date.now() - last) > CACHE_TTL_MS;
    }

    // === DOM Helpers ===
    function findTokenElements() {
        return Array.from(document.querySelectorAll('a[href*="/item/ronin/"]'));
    }

    function getTokenIdFromElement(el) {
        try {
            const urlParts = el.href.split('/');
            return urlParts[urlParts.length - 1];
        } catch {
            return null;
        }
    }

    // === Fetch using GM_xmlhttpRequest with Promise wrapper ===
    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                headers: {
                    'Accept': 'text/html',
                },
                onload: res => {
                    if (res.status >= 200 && res.status < 300) {
                        resolve(res.responseText);
                    } else {
                        reject(new Error(`HTTP status ${res.status}`));
                    }
                },
                onerror: err => reject(err),
            });
        });
    }

    // === Fetch level info from ronencoin.tech with exact token matching ===
    async function fetchLevel(tokenId) {
        debugLog(`Fetching level for token: ${tokenId}`);
        try {
            const url = `https://ronencoin.tech/nft_miners.php?search_token=${tokenId}&type=&level=`;
            const text = await gmFetch(url);

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const rows = doc.querySelectorAll('table tbody tr');
            if (!rows.length) {
                debugLog(`No data rows found for token ${tokenId}`);
                return null;
            }

            // Find exact token match row
            for (const row of rows) {
                const cells = row.querySelectorAll('td');
                if (cells.length < 4) continue;
                const tokenFromTable = cells[0].textContent.trim();
                if (tokenFromTable === tokenId) {
                    const level = cells[3].textContent.trim();
                    debugLog(`Found exact match level ${level} for token ${tokenId}`);
                    return level;
                }
            }

            debugLog(`No exact match found for token ${tokenId}`);
            return null;
        } catch (e) {
            console.error(`[NFTLevelInjector] Error fetching level for token ${tokenId}:`, e);
            return null;
        }
    }

    // === Inject level into page ===
    function injectLevel(tokenId, level) {
        const els = findTokenElements().filter(el => getTokenIdFromElement(el) === tokenId);
        if (els.length === 0) {
            debugLog(`No element found to inject level for token ${tokenId}`);
            return;
        }

        els.forEach(el => {
            if (el.querySelector('.miner-level')) {
                debugLog(`Level already injected for token ${tokenId}`);
                return;
            }
            const span = document.createElement('span');
            span.className = 'miner-level';
            span.style.color = '#facc15';
            span.style.marginLeft = '6px';
            span.style.fontWeight = 'bold';
            span.textContent = `(Lvl: ${level})`;
            el.appendChild(span);
            debugLog(`Injected level for token ${tokenId}`);
        });
    }

    // === Main processing of tokens, with caching ===
    async function processTokens(tokenEls, cache) {
        for (const el of tokenEls) {
            const tokenId = getTokenIdFromElement(el);
            if (!tokenId) continue;

            if (processedTokens.has(tokenId)) {
                // Already processed this token this session
                continue;
            }
            processedTokens.add(tokenId);

            if (cache[tokenId] !== undefined) {
                // Use cached data
                injectLevel(tokenId, cache[tokenId]);
                debugLog(`Used cached level for token ${tokenId}: ${cache[tokenId]}`);
                continue;
            }

            // Fetch fresh data and update cache
            const level = await fetchLevel(tokenId);
            if (level !== null) {
                cache[tokenId] = level;
                injectLevel(tokenId, level);
                debugLog(`Fetched and cached level for token ${tokenId}: ${level}`);
            }

            // Delay between requests
            await delay(800);
        }

        await saveCache(cache);
    }

    // === UI overlay with refresh button and label ===
    function createOverlay() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.left = '10px';
        container.style.background = 'rgba(0,0,0,0.7)';
        container.style.color = '#facc15';
        container.style.padding = '8px 12px';
        container.style.borderRadius = '6px';
        container.style.fontSize = '14px';
        container.style.zIndex = 999999;
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.userSelect = 'none';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '10px';

        const btn = document.createElement('button');
        btn.textContent = 'Refresh Data';
        btn.style.cursor = 'pointer';
        btn.style.background = '#facc15';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.color = '#000';
        btn.style.fontWeight = 'bold';
        btn.style.padding = '4px 8px';
        btn.style.userSelect = 'none';

        const label = document.createElement('div');
        label.style.minWidth = '150px';
        label.textContent = 'Last refreshed: N/A';

        btn.onclick = async () => {
            btn.disabled = true;
            btn.textContent = 'Refreshing...';
            await clearCache();
            await main(true); // force reload data
            btn.textContent = 'Refresh Data';
            btn.disabled = false;
        };

        container.appendChild(btn);
        container.appendChild(label);

        document.body.appendChild(container);

        return label;
    }

    // Update the "Last Refreshed" label
    async function updateRefreshLabel() {
        const lastRefresh = await getLastRefreshTime();
        if (!refreshLabel) return;
        refreshLabel.textContent = `Last refreshed: ${lastRefresh ? formatDate(lastRefresh) : 'Never'}`;
    }

    // === Globals ===
    let processedTokens = new Set();
    let refreshLabel = null;

    // === Main ===
    async function main(forceRefresh = false) {
        processedTokens = new Set();

        let cache = await loadCache();

        // If cache expired or forceRefresh, clear it to force refetch
        if (forceRefresh || await isCacheExpired()) {
            debugLog('Cache expired or forced refresh, clearing cache...');
            await clearCache();
            cache = {};
            await setLastRefreshTime(Date.now());
        }

        updateRefreshLabel();

        const tokens = findTokenElements();
        debugLog(`Initial tokens found: ${tokens.length}`);

        await processTokens(tokens, cache);

        // Set last refresh time if we didn't just clear it
        if (!forceRefresh) {
            await setLastRefreshTime(Date.now());
            updateRefreshLabel();
        }
    }

    // Start the overlay UI
    refreshLabel = createOverlay();

    // Initial run
    await main();

    // Watch for new tokens dynamically added to page
    const observer = new MutationObserver(async mutations => {
        const newTokens = [];
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;

                if (node.matches && node.matches('a[href*="/item/ronin/"]')) {
                    newTokens.push(node);
                }
                newTokens.push(...(node.querySelectorAll ? Array.from(node.querySelectorAll('a[href*="/item/ronin/"]')) : []));
            });
        });
        if (newTokens.length > 0) {
            debugLog(`Detected ${newTokens.length} new token elements`);
            const cache = await loadCache();
            await processTokens(newTokens, cache);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
