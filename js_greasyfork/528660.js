// ==UserScript==
// @name         FMHY SafeLink Guard
// @namespace    http://tampermonkey.net/
// @version      0.5.5
// @description  Warns about unsafe/scammy links based on FMHY filterlist
// @author       maxikozie
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @connect      raw.githubusercontent.com
// @run-at       document-end
// @license      MIT
// @icon         https://fmhy.net/fmhy.ico
// @downloadURL https://update.greasyfork.org/scripts/528660/FMHY%20SafeLink%20Guard.user.js
// @updateURL https://update.greasyfork.org/scripts/528660/FMHY%20SafeLink%20Guard.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Restrict script from running on domains owned by FMHY
    const excludedDomains = [
        'fmhy.net',
        'fmhy.pages.dev',
        'fmhy.lol',
        'fmhy.vercel.app',
        'fmhy.xyz'
    ];

    const currentDomain = window.location.hostname.toLowerCase();

    if (excludedDomains.some(domain => currentDomain.endsWith(domain))) {
        console.log(`[FMHY Guard] Script disabled on ${currentDomain}`);
        return;
    }

    // Remote sources for FMHY site lists
    const unsafeListUrl = 'https://raw.githubusercontent.com/fmhy/FMHYFilterlist/main/sitelist.txt';
    const safeListUrl   = 'https://raw.githubusercontent.com/fmhy/bookmarks/main/fmhy_in_bookmarks.html';

    const unsafeDomains = new Set();
    const safeDomains   = new Set();

    // Cached data will be valid for 1 week
    const CACHE_TIME = 7 * 24 * 60 * 60 * 1000; // 1 week in ms
    const CACHE_KEYS = {
        UNSAFE: 'fmhy-unsafeCache',
        SAFE:   'fmhy-safeCache'
    };

    // User-defined overrides and settings
    const userTrusted   = new Set(GM_getValue('trusted', []));
    const userUntrusted = new Set(GM_getValue('untrusted', []));

    const settings = {
        highlightTrusted:   GM_getValue('highlightTrusted', true),
        highlightUntrusted: GM_getValue('highlightUntrusted', true),
        showWarningBanners: GM_getValue('showWarningBanners', true),
        trustedColor:       GM_getValue('trustedColor', '#32cd32'),
        untrustedColor:     GM_getValue('untrustedColor', '#ff4444')
    };

    // Tracking for processed links and counters per domain
    const processedLinks         = new WeakSet();
    const highlightCountTrusted  = new Map();
    const highlightCountUntrusted= new Map();
    const banneredDomains        = new Set();

    // Style for the warning banner
    const warningStyle = `
        background-color: #ff0000;
        color: #fff;
        padding: 2px 6px;
        font-weight: bold;
        border-radius: 4px;
        font-size: 12px;
        margin-left: 6px;
        z-index: 9999;
    `;

    GM_registerMenuCommand('⚙️ FMHY SafeLink Guard Settings', openSettingsPanel);

    GM_registerMenuCommand('🔄 Force Update FMHY Lists', () => {
        GM_deleteValue(CACHE_KEYS.UNSAFE);
        GM_deleteValue(CACHE_KEYS.SAFE);
        alert('FMHY lists cache cleared. The script will fetch fresh data now or on next page load.');
        fetchRemoteLists();
    });

    GM_registerMenuCommand("📂 Download All Caches", function() {
        downloadAllCaches();
    });


    function downloadAllCaches() {
        // Grab both caches from storage
        const unsafeData = GM_getValue(CACHE_KEYS.UNSAFE, null);
        const safeData   = GM_getValue(CACHE_KEYS.SAFE, null);

        // If neither cache is found, no point in downloading
        if (!unsafeData && !safeData) {
            alert("No cache data found for either safe or unsafe.");
            return;
        }

        // Combine them in a single JSON object
        const combinedData = {
            unsafeCache: unsafeData,
            safeCache: safeData
        };

        // Create a blob from the combined JSON
        const blob = new Blob([JSON.stringify(combinedData, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'fmhy-all-caches.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }


    function isValidCache(cacheKey) {
        const cached = GM_getValue(cacheKey, null);
        return cached && cached.timestamp && cached.data && typeof cached.data === 'string';
    }

    // Fetch remote list with 1 week cacheing
    fetchRemoteLists();

    function fetchRemoteLists() {
        const now = Date.now();

        if (isValidCache(CACHE_KEYS.UNSAFE) && (now - GM_getValue(CACHE_KEYS.UNSAFE).timestamp < CACHE_TIME)) {
            const cached = GM_getValue(CACHE_KEYS.UNSAFE);
            parseDomainList(cached.data, unsafeDomains);
            console.log(`[FMHY Guard] Loaded ${unsafeDomains.size} unsafe domains from cache`);
            loadSafeList(now);
        } else {
            fetchUnsafeList(now);
        }
    }

    function incrementHighlightCount(map, domain) {
        if (map.size > 1000) map.clear(); // Reset if too large
        map.set(domain, getHighlightCount(map, domain) + 1);
    }

    function fetchUnsafeList(now) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: unsafeListUrl,
            onload: response => {
                if (response.status !== 200 || !response.responseText) {
                    console.error("[FMHY Guard] Invalid response from server. Using stale cache.");
                    loadSafeList(now);
                    return;
                }
                const data = response.responseText;
                parseDomainList(data, unsafeDomains);
                GM_setValue(CACHE_KEYS.UNSAFE, { timestamp: now, data: data });
                console.log(`[FMHY Guard] Updated unsafe domains cache`);
                loadSafeList(now);
            },
            onerror: () => {
                console.error("[FMHY Guard] Fetch failed, using stale cache.");
                const cached = GM_getValue(CACHE_KEYS.UNSAFE, null);
                if (cached) parseDomainList(cached.data, unsafeDomains);
                loadSafeList(now);
            }
        });
    }

    function loadSafeList(now) {
        const cachedSafe = GM_getValue(CACHE_KEYS.SAFE, null);
        if (cachedSafe && (now - cachedSafe.timestamp < CACHE_TIME)) {
            parseSafeList(cachedSafe.data);
            console.log(`[FMHY Guard] Loaded ${safeDomains.size} safe domains from cache`);
            finishLoading();
        } else {
            fetchSafeList(now);
        }
    }

    function fetchSafeList(now) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: safeListUrl,
            onload: response => {
                const data = response.responseText;
                parseSafeList(data);
                GM_setValue(CACHE_KEYS.SAFE, {
                    timestamp: now,
                    data: data
                });
                console.log(`[FMHY Guard] Updated safe domains cache`);
                finishLoading();
            },
            onerror: () => {
                console.error('[FMHY Guard] Using stale safe cache (fetch failed)');
                const cached = GM_getValue(CACHE_KEYS.SAFE, null);
                if (cached) {
                    parseSafeList(cached.data);
                }
                finishLoading();
            }
        });
    }

    function finishLoading() {
        applyUserOverrides();
        processPage();
    }

    function parseDomainList(text, targetSet) {
        text.split('\n').forEach(line => {
            const domain = line.trim().toLowerCase();
            if (domain && !domain.startsWith('!')) targetSet.add(domain);
        });
    }

    function parseSafeList(data) {
        const doc = new DOMParser().parseFromString(data, 'text/html');
        doc.querySelectorAll('a[href]').forEach(link => {
            const domain = normalizeDomain(new URL(link.href).hostname);
            safeDomains.add(domain);
        });
    }

    function applyUserOverrides() {
        userTrusted.forEach(domain => {
            safeDomains.add(domain);
            unsafeDomains.delete(domain);
        });
        userUntrusted.forEach(domain => {
            unsafeDomains.add(domain);
            safeDomains.delete(domain);
        });
    }

    function processPage() {
        markLinks(document.body);
        observePage();
    }

    function markLinks(container) {
        container.querySelectorAll('a[href]').forEach(link => {
            if (processedLinks.has(link)) return;
            processedLinks.add(link);

            const domain = normalizeDomain(new URL(link.href).hostname);

            // If the current site domain is safe AND the link is internal, skip highlight
            if (
                (safeDomains.has(currentDomain) || userTrusted.has(currentDomain)) &&
                domain === currentDomain
            ) {
                return;
            }

            // Untrusted logic
            if (userUntrusted.has(domain) || (!userTrusted.has(domain) && unsafeDomains.has(domain))) {
                if (settings.highlightUntrusted && getHighlightCount(highlightCountUntrusted, domain) < 2) {
                    highlightLink(link, 'untrusted');
                    incrementHighlightCount(highlightCountUntrusted, domain);
                }
                if (settings.showWarningBanners && !banneredDomains.has(domain)) {
                    addWarningBanner(link);
                    banneredDomains.add(domain);
                }

                // Trusted logic
            } else if (userTrusted.has(domain) || safeDomains.has(domain)) {
                if (settings.highlightTrusted && getHighlightCount(highlightCountTrusted, domain) < 2) {
                    highlightLink(link, 'trusted');
                    incrementHighlightCount(highlightCountTrusted, domain);
                }
            }
        });
    }

    function observePage() {
        new MutationObserver(mutations => {
            for (const { addedNodes } of mutations) {
                for (const node of addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) markLinks(node);
                }
            }
        }).observe(document.body, { childList: true, subtree: true });
    }

    function highlightLink(link, type) {
        const color = (type === 'trusted') ? settings.trustedColor : settings.untrustedColor;
        link.style.textShadow = `0 0 4px ${color}`;
        link.style.fontWeight = 'bold';
    }

    function addWarningBanner(link) {
        const warning = document.createElement('span');
        warning.textContent = '⚠️ FMHY Unsafe Site';
        warning.style = warningStyle;
        link.after(warning);
    }

    function normalizeDomain(hostname) {
        return hostname.replace(/^www\./, '').toLowerCase();
    }

    function getHighlightCount(map, domain) {
        return map.get(domain) || 0;
    }

    function incrementHighlightCount(map, domain) {
        map.set(domain, getHighlightCount(map, domain) + 1);
    }

    function saveSettings() {
        settings.highlightTrusted   = document.getElementById('highlightTrusted').checked;
        settings.highlightUntrusted = document.getElementById('highlightUntrusted').checked;
        settings.showWarningBanners = document.getElementById('showWarningBanners').checked;

        settings.trustedColor   = document.getElementById('trustedColor').value;
        settings.untrustedColor = document.getElementById('untrustedColor').value;

        GM_setValue('highlightTrusted',   settings.highlightTrusted);
        GM_setValue('highlightUntrusted', settings.highlightUntrusted);
        GM_setValue('showWarningBanners', settings.showWarningBanners);
        GM_setValue('trustedColor',       settings.trustedColor);
        GM_setValue('untrustedColor',     settings.untrustedColor);

        saveDomainList('trustedList', userTrusted);
        saveDomainList('untrustedList', userUntrusted);
    }

    function saveDomainList(id, set) {
        set.clear();
        document.getElementById(id).value
            .split('\n')
            .map(d => d.trim().toLowerCase())
            .filter(Boolean)
            .forEach(dom => set.add(dom));

        if (id === 'trustedList') {
            GM_setValue('trusted', [...set]);
        } else {
            GM_setValue('untrusted', [...set]);
        }
    }

    function openSettingsPanel() {
        document.getElementById('fmhy-settings-panel')?.remove();

        const panel = document.createElement('div');
        panel.id = 'fmhy-settings-panel';
        panel.style = `
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            background: #222;
            color: #fff;
            padding: 20px;
            border-radius: 10px;
            font-family: sans-serif;
            font-size: 14px;
            z-index: 99999;
            width: 450px;
            overflow-y: auto;
            overflow-x: hidden;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
        `;

        panel.innerHTML = `
            <h3 style="text-align:center; margin:0 0 15px;">⚙️ FMHY SafeLink Guard Settings</h3>

            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <input type="checkbox" id="highlightTrusted" style="margin-right: 6px;">
                <label for="highlightTrusted" style="flex-grow: 1; cursor: pointer;">🟢 Highlight Trusted Links</label>
                <input type="color" id="trustedColor" style="width: 30px; height: 20px; border: none; cursor: pointer;">
            </div>

            <div style="display: flex; align-items: center; margin-bottom: 8px;">
                <input type="checkbox" id="highlightUntrusted" style="margin-right: 6px;">
                <label for="highlightUntrusted" style="flex-grow: 1; cursor: pointer;">🔴 Highlight Untrusted Links</label>
                <input type="color" id="untrustedColor" style="width: 30px; height: 20px; border: none; cursor: pointer;">
            </div>

            <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <input type="checkbox" id="showWarningBanners" style="margin-right: 6px;">
                <label for="showWarningBanners" style="flex-grow: 1; cursor: pointer;">⚠️ Show Warning Banners</label>
            </div>

            <label style="display: block; margin-bottom: 5px;">Trusted Domains (1 per line):</label>
            <textarea id="trustedList" style="width: 100%; height: 80px; margin-bottom: 10px;"></textarea>

            <label style="display: block; margin-bottom: 5px;">Untrusted Domains (1 per line):</label>
            <textarea id="untrustedList" style="width: 100%; height: 80px; margin-bottom: 10px;"></textarea>

            <div style="text-align: left;">
                <button id="saveSettingsBtn" style="background:#28a745;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;">Save</button>
                <button id="closeSettingsBtn" style="background:#dc3545;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;margin-left:10px;">Close</button>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('highlightTrusted').checked = settings.highlightTrusted;
        document.getElementById('highlightUntrusted').checked = settings.highlightUntrusted;
        document.getElementById('showWarningBanners').checked = settings.showWarningBanners;

        document.getElementById('trustedColor').value   = settings.trustedColor;
        document.getElementById('untrustedColor').value = settings.untrustedColor;

        document.getElementById('trustedList').value   = [...userTrusted].join('\n');
        document.getElementById('untrustedList').value = [...userUntrusted].join('\n');

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            saveSettings();
            panel.remove();
            location.reload();
        });

        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            panel.remove();
        });
    }

    console.log(`[FMHY Guard] Unsafe Domains: ${unsafeDomains.size}, Safe Domains: ${safeDomains.size}`);
    console.log(`[FMHY Guard] Cache Size: ${JSON.stringify(GM_getValue(CACHE_KEYS.UNSAFE)).length} bytes`);

})();