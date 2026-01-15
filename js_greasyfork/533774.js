// ==UserScript==
// @name         1337x - Steam Hover Preview 
// @namespace    https://greasyfork.org/en/users/1340389-deonholo
// @version      3.5.2
// @description  On-hover Steam thumbnail, description, Steam Ratings, user-defined tags (same as Steam store page), release date, and a direct "Open on Steam" link for 1337x game torrent titles
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/x432yc9hx5t6o2gbe9ccr7k5l6u8
// @author       DeonHolo
// @license      MIT
// @match        *://*.1337x.to/*
// @match        *://*.1337x.ws/*
// @match        *://*.1337x.is/*
// @match        *://*.1337x.gd/*
// @match        *://*.x1337x.cc/*
// @match        *://*.1337x.st/*
// @match        *://*.x1337x.ws/*
// @match        *://*.1337x.eu/*
// @match        *://*.1337x.se/*
// @match        *://*.x1337x.eu/*
// @match        *://*.x1337x.se/*
// @match        http://l337xdarkkaqfwzntnfk5bmoaroivtl6xsbatabvlb52umg6v3ch44yd.onion/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      store.steampowered.com
// @connect      steamcdn-a.akamaihd.net
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533774/1337x%20-%20Steam%20Hover%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/533774/1337x%20-%20Steam%20Hover%20Preview.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const tip = document.createElement('div');
    tip.className = 'steamHoverTip';
    const SEL = 'table.torrent-list td.name a[href^="/torrent/"], table.torrents td.name a[href^="/torrent/"], table.table-list td.name a[href^="/torrent/"]';
    const MIN_INTERVAL = 50;
    const MAX_CACHE = 100;
    const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours for persistent cache
    const MEMORY_CACHE_TTL = 15 * 60 * 1000; // 15 min for in-memory during session
    const HIDE_DELAY = 100;
    const FADE_DURATION = 200;
    const API_TIMEOUT = 8000;
    const SHOW_DELAY = 0;
    const STORAGE_KEY = 'steamHoverCache_v1';
    const CONCURRENT_HIDDEN = 4; // Fetch 4 games at once when tab is hidden
    const DEBUG_MODE = false; // Set to true for debugging

    // Game detection - URL-based + uploader name detection
    const isGameCategoryPage = /\/(Games|category-search\/[^\/]+\/Games)\//i.test(window.location.pathname);

    // Known game uploaders/repackers
    const GAME_UPLOADERS = [
        'fitgirl', 'dodi', 'elamigos', 'kaoskrew', 'kaos', 'johncena141',
        'masquerade', 'gnarly', 'cpasbien', 'rg mechanics', 'flt', 'codex',
        'plaza', 'skidrow', 'razor1911', 'prophet', 'reloaded', 'hoodlum',
        'darksiders', 'empress', 'tenoke', 'tinyiso', 'gog', 'igggamescom',
        'igggames', 'ovagames', 'xatab', 'r.g. catalyst', 'decepticon',
        'heroskeep', 'gamedrive', 'emadmoner'
    ];

    function isGameTorrent(link) {
        // If we're on a Games category page, all torrents are games
        if (isGameCategoryPage) return true;

        const row = link.closest('tr');
        if (!row) return false;

        const titleText = link.textContent.toLowerCase();

        // EXCLUSION: Skip if title contains software keywords
        const softwareKeywords = [
            'adobe', 'photoshop', 'illustrator', 'premiere', 'after effects', 'acrobat',
            'microsoft', 'office', 'windows', 'visual studio', 'autocad', 'matlab',
            'pdf', 'antivirus', 'vmware', 'virtualbox', 'driver', 'daemon tools',
            'spotify', 'netflix', 'vlc', 'winrar', 'idm', 'internet download',
            'fl studio', 'ableton', 'logic pro', 'cubase', 'pro tools',
            'final cut', 'davinci', 'sony vegas', 'camtasia', 'obs studio',
            'malwarebytes', 'avast', 'kaspersky', 'norton', 'bitdefender',
            'ccleaner', 'teamviewer', 'anydesk', 'zoom', 'discord', 'slack',
            'android', 'apk', 'mod apk', 'ipa', 'ios app'
        ];
        if (softwareKeywords.some(kw => titleText.includes(kw))) {
            return false;
        }

        // EXCLUSION: Known software uploaders
        const uploaderLink = row.querySelector('td a[href*="/user/"]');
        const uploaderName = uploaderLink ? uploaderLink.textContent.trim().toLowerCase() : '';
        const softwareUploaders = ['crackshash', 'appdoze', 'haxnode', 'softwarecave'];
        if (softwareUploaders.some(u => uploaderName.includes(u))) {
            return false;
        }

        // DETECTION: Check for game/PC icons
        const nameCell = link.closest('td');
        if (nameCell) {
            const gameIcon = nameCell.querySelector('i.flaticon-games, i.flaticon-apps');
            if (gameIcon) return true;
        }

        // DETECTION: Known game uploaders
        if (uploaderLink && GAME_UPLOADERS.some(u => uploaderName.includes(u))) {
            return true;
        }

        // DETECTION: Title contains repacker markers
        const titleMarkers = ['fitgirl', 'dodi', 'elamigos', 'plaza', 'codex', 'skidrow', 'repack', 'gog'];
        if (titleMarkers.some(m => titleText.includes(m))) {
            return true;
        }

        return false;
    }

    // Debug logger helper
    function debugLog(...args) {
        if (DEBUG_MODE) console.log('[Steam Hover]', ...args);
    }

    // Flag to pause preloading when user is actively hovering
    let userHovering = false;
    let isPageHidden = document.hidden || false;

    // Page Visibility API - detect when user leaves/returns
    document.addEventListener('visibilitychange', () => {
        isPageHidden = document.hidden;
        if (isPageHidden) {
            console.log('[Steam Hover] Tab hidden - enabling fast preload mode');
        } else {
            console.log('[Steam Hover] Tab visible - switching to normal mode');
        }
    });

    // Persistent cache: Load from storage on init
    function loadPersistentCache() {
        try {
            const stored = GM_getValue(STORAGE_KEY, null);
            if (stored) {
                const parsed = JSON.parse(stored);
                const now = Date.now();
                let loaded = 0;
                for (const [key, value] of Object.entries(parsed)) {
                    // Only load if not expired AND has valid data (skip null entries!)
                    if (value.data && value.ts && (now - value.ts) < CACHE_TTL) {
                        apiCache.set(key, value);
                        loaded++;
                    }
                }
                console.log(`[Steam Hover] Loaded ${loaded} cached games from storage`);
            }
        } catch (e) {
            console.warn('[Steam Hover] Failed to load persistent cache:', e);
        }
    }

    // Persistent cache: Save to storage (debounced)
    let saveTimeout = null;
    function savePersistentCache() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            try {
                const obj = {};
                const now = Date.now();
                for (const [key, value] of apiCache.entries()) {
                    // Only save valid entries that aren't expired
                    if (value.data && value.ts && (now - value.ts) < CACHE_TTL) {
                        obj[key] = value;
                    }
                }
                GM_setValue(STORAGE_KEY, JSON.stringify(obj));
            } catch (e) {
                console.warn('[Steam Hover] Failed to save persistent cache:', e);
            }
        }, 1000); // Debounce saves by 1 second
    }

    // Expose cache clearing function to console
    window.clearSteamHoverCache = function () {
        apiCache.clear();
        GM_setValue(STORAGE_KEY, '{}');
        console.log('[Steam Hover] ✅ Cache cleared! Refresh the page to re-fetch all games.');
    };

    // Concurrent fetch helper for hidden tab mode
    async function fetchBatch(names) {
        const promises = names.map(name =>
            fetchSteam(name).catch(() => null)
        );
        await Promise.all(promises);
    }

    async function preloadAll() {
        const links = Array.from(document.querySelectorAll(SEL));
        const toFetch = [];

        for (const link of links) {
            // Only preload game torrents
            if (!isGameTorrent(link)) continue;

            const name = cleanName(link.textContent);
            if (name && !apiCache.has(name)) {
                toFetch.push(name);
            }
        }

        // Remove duplicates
        const uniqueNames = [...new Set(toFetch)];
        console.log(`[Steam Hover] Preloading ${uniqueNames.length} games...`);

        let i = 0;
        while (i < uniqueNames.length) {
            // Pause preloading if user is hovering
            while (userHovering && !isPageHidden) {
                await new Promise(r => setTimeout(r, 200));
            }

            if (isPageHidden) {
                // Fast mode: fetch multiple games concurrently
                const batch = uniqueNames.slice(i, i + CONCURRENT_HIDDEN);
                await fetchBatch(batch);
                i += CONCURRENT_HIDDEN;
                await new Promise(r => setTimeout(r, MIN_INTERVAL)); // Brief pause between batches
            } else {
                // Normal mode: fetch one at a time
                await fetchSteam(uniqueNames[i]).catch(() => { });
                i++;
                await new Promise(r => setTimeout(r, MIN_INTERVAL * 2));
            }
        }

        console.log(`[Steam Hover] Preloading complete!`);
    }

    // Start preloading after page is idle
    window.addEventListener('load', () => {
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => preloadAll(), { timeout: 3000 });
        } else {
            setTimeout(preloadAll, 2000);
        }
    });

    GM_addStyle(`
        .steamHoverTip {
            position: absolute;
            padding: 8px;
            background: rgba(240, 240, 240, 0.97);
            border: 1px solid #555;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
            z-index: 2147483647;
            max-width: 310px;
            font-size: 12px;
            line-height: 1.45;
            display: none;
            white-space: normal !important;
            overflow-wrap: break-word;
            color: #111;
            opacity: 0;
            transition: opacity ${FADE_DURATION}ms ease-in-out;
            pointer-events: none;
        }
 
        .steamHoverTip p {
            margin: 0 0 5px 0;
            padding: 0;
        }
        .steamHoverTip p:last-child {
            margin-bottom: 0;
        }
        .steamHoverTip img {
            display: block;
            width: 100%;
            margin-bottom: 8px;
            border-radius: 2px;
        }
        .steamHoverTip strong {
            color: #000;
        }
        .steamHoverTip .steamRating,
        .steamHoverTip .steamTags,
        .steamHoverTip .steamReleaseDate {
            margin-top: 8px;
            font-size: 12px;
            color: #333;
        }
        .steamHoverTip .steamReleaseDate {
            margin-top: 2px;
            font-size: 11px;
            color: #555;
        }
        .steamHoverTip .steamTags strong,
        .steamHoverTip .steamRating strong {
            color: #111;
            margin-right: 4px;
        }
        .steamHoverTip .ratingStars {
            color: #f5c518;
            margin-right: 6px;
            letter-spacing: 1px;
            font-size: 14px;
            display: inline-block;
            vertical-align: middle;
        }
        .steamHoverTip .ratingText {
            vertical-align: middle;
        }
        .steamHoverTip a {
            color: #0645ad;
            text-decoration: underline;
            cursor: pointer;
        }
        .steamHoverTip .loadingContainer {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .steamHoverTip .spinner {
            width: 18px;
            height: 18px;
            border: 2px solid #ddd;
            border-top-color: #1b2838;
            border-radius: 50%;
            animation: steamSpinner 0.8s linear infinite;
            flex-shrink: 0;
        }
        @keyframes steamSpinner {
            to { transform: rotate(360deg); }
        }

        /* Magnet Download Button in Tooltip - matches existing link style */
        .steamHoverTip .magnetDownloadBtn {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 0;
            margin: 0;
            border: none;
            background: none;
            color: #66c0f4;
            font-size: 12px;
            cursor: pointer;
            text-decoration: underline;
            font-family: inherit;
        }
        .steamHoverTip .magnetDownloadBtn:hover {
            color: #fff;
        }
        .steamHoverTip .magnetDownloadBtn.loading {
            pointer-events: none;
            opacity: 0.7;
            text-decoration: none;
        }
        .steamHoverTip .tipActions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 8px;
            padding-top: 6px;
            border-top: 1px solid rgba(255,255,255,0.1);
        }
    `);

    const apiCache = new Map();
    loadPersistentCache(); // Load cached data from previous sessions
    let lastRequest = 0;
    let hoverId = 0;
    let showTimeout = null;
    let hideTimeout = null;
    let displayTimeout = null;
    let currentFetch = null;
    let trackingMove = false;
    let lastMoveEvent = null;
    let currentHoveredLink = null;

    document.body.appendChild(tip);

    function pruneCache(map) {
        if (map.size > MAX_CACHE) {
            map.delete(map.keys().next().value);
        }
    }

    function getRatingStars(percent, desc) {
        const filled = '★';
        const empty = '☆';
        const p = parseInt(percent, 10);
        let stars = '';

        if (!isNaN(p)) {
            if (p >= 95) stars = filled.repeat(5);
            else if (p >= 80) stars = filled.repeat(4) + empty;
            else if (p >= 70) stars = filled.repeat(3) + empty.repeat(2);
            else if (p >= 40) stars = filled.repeat(2) + empty.repeat(3);
            else if (p >= 20) stars = filled + empty.repeat(4);
            else stars = empty.repeat(5);
        } else if (desc) {
            const d = desc.toLowerCase();
            if (d.includes('overwhelmingly positive')) stars = filled.repeat(5);
            else if (d.includes('very positive')) stars = filled.repeat(4) + empty;
            else if (d.includes('mostly positive')) stars = filled.repeat(4) + empty;
            else if (d.includes('positive')) stars = filled.repeat(4) + empty;
            else if (d.includes('mixed')) stars = filled.repeat(3) + empty.repeat(2);
            else if (d.includes('mostly negative')) stars = filled.repeat(2) + empty.repeat(3);
            else if (d.includes('negative')) stars = filled + empty.repeat(4);
            else if (d.includes('very negative')) stars = filled + empty.repeat(4);
            else if (d.includes('overwhelmingly negative')) stars = filled + empty.repeat(4);
        }
        return stars ? `<span class="ratingStars">${stars}</span>` : '';
    }

    function cleanName(raw) {
        // Early exclusions for non-games
        if (/soundtrack|ost|demo|dlc pack|artbook|season pass|multiplayer crack|trainer/i.test(raw)) {
            return null;
        }

        let name = raw.trim();

        // Remove bracketed prefixes like [Bober Bros], [FitGirl], etc. at the START
        name = name.replace(/^\[[^\]]*\]\s*/g, '');

        // Normalize separators: dots and underscores to spaces
        name = name.replace(/[._]/g, ' ');

        // Remove common technical suffixes
        name = name.replace(/\s+(x64|x86|64bit|32bit|64-bit|32-bit)\b/gi, '');
        name = name.replace(/\s+MULTI\d*\b/gi, '');
        name = name.replace(/\s+(incl|incl\.|including)\s+.*/gi, '');

        // Strip years and season/episode markers
        name = name.replace(/\(\d{4}\)/, '').replace(/S\d{1,2}(E\d{1,2})?/, '').trim();

        // Remove bracketed content with known group/repack patterns
        name = name.replace(/\[[^\]]*(?:Repack|FitGirl|DODI|ElAmigos|GOG|P2P|ISO)\][^\]]*$/gi, '').trim();

        // Split on version/build/technical markers AND brackets/parentheses
        const delim = /(?:\s-\s|\(|\[|\bUpdate\b|\bBuild\b|\bHotfix\b|\bPatch\b|v\d[\d.]*|v\s+\d|\bCrack\b|\bFixed?\b|\bLinux\b|\bMac\b|\bMacOS\b|\bWindows\b|\bPortable\b|\bREPACK\b|\bRIP\b)/i;
        name = name.split(delim)[0].trim();

        // Expanded scene group removal (at end of name)
        const sceneGroups = /\s*[-\s](CODEX|CPY|SKIDROW|PLAZA|HOODLUM|FLT|DOGE|DARKSiDERS|EMPRESS|RUNE|TENOKE|TiNYiSO|ElAmigos|FitGirl|DODI|RAZOR1911|RELOADED|PROPHET|FAIRLIGHT|GOG|P2P|STEAM|STEAMPUNKS|3DM|ALI213|ANOMALY|KAOS|REVOLT|SiMPLEX|ISO|elamigos|Bober\s*Bros)$/i;
        name = name.replace(sceneGroups, '').trim();

        // Remove "The", "Sid Meier's", etc. ONLY if > 3 words remain
        const words = name.split(/\s+/);
        if (words.length > 3) {
            name = name.replace(/^(The|Sid Meier'?s|Tom Clancy'?s)\s+/i, '').trim();
        }

        // Clean up extra whitespace
        name = name.replace(/\s{2,}/g, ' ').trim();

        return name.length >= 2 ? name : null;
    }

    function gmFetch(url, responseType = 'json', timeout = API_TIMEOUT) {
        const wait = Math.max(0, MIN_INTERVAL - (Date.now() - lastRequest));
        return new Promise(resolve => setTimeout(resolve, wait))
            .then(() => new Promise((resolve, reject) => {
                lastRequest = Date.now();
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    responseType: responseType,
                    timeout: timeout,
                    headers: {
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cookie': 'birthtime=0; mature_content=1; wants_mature_content=1; lastagecheckage=1-0-1990'
                    },
                    onload: (res) => {
                        if (res.status >= 200 && res.status < 300) {
                            if (responseType === 'json') {
                                if (typeof res.response === 'object' && res.response !== null) {
                                    resolve(res.response);
                                } else {
                                    try {
                                        resolve(JSON.parse(res.responseText));
                                    } catch (e) {
                                        console.error(`JSON parse error for ${url}:`, e, res.responseText);
                                        reject(new Error(`JSON parse error for ${url}`));
                                    }
                                }
                            } else {
                                resolve(res.response || res.responseText);
                            }
                        } else {
                            console.warn(`HTTP ${res.status} for ${url}`);
                            reject(new Error(`HTTP ${res.status} for ${url}`));
                        }
                    },
                    onerror: (err) => {
                        console.error(`Network error for ${url}:`, err);
                        reject(new Error(`Network error for ${url}: ${err.statusText || err.error || 'Unknown'}`));
                    },
                    ontimeout: () => {
                        console.warn(`Timeout ${timeout}ms for ${url}`);
                        reject(new Error(`Timeout ${timeout}ms for ${url}`));
                    },
                    onabort: () => {
                        console.warn(`Aborted request for ${url}`);
                        reject(new Error(`Aborted request for ${url}`));
                    }
                });
            }));
    }

    // Fallback strategy: progressively remove words from the end
    async function fetchSteamWithFallback(originalName) {
        const words = originalName.split(/\s+/);

        // Always try the full name first, then progressively shorter versions
        // For single-word names, only try once. For multi-word, try up to 4 versions.
        const maxAttempts = Math.min(words.length, 4);

        for (let i = 0; i < maxAttempts; i++) {
            const tryName = words.slice(0, words.length - i).join(' ');
            if (tryName.length < 2) continue;

            debugLog(`🔄 Fallback attempt ${i + 1}/${maxAttempts}: "${tryName}"`);
            const result = await fetchSteam(tryName);
            if (result) return result;
        }

        return null;
    }

    async function fetchSteam(name) {
        debugLog(`🔍 Searching for: "${name}"`);
        const now = Date.now();
        const hit = apiCache.get(name);
        if (hit && now - hit.ts < CACHE_TTL) {
            debugLog(`📦 Cache hit for "${name}"`, hit.data ? '✓ has data' : '✗ cached as null');
            return hit.data;
        }

        let appId = null;

        // First: Search for the game
        try {
            const searchUrl = `https://store.steampowered.com/api/storesearch/?cc=us&l=en&term=${encodeURIComponent(name)}`;
            debugLog(`📡 Fetching search API:`, searchUrl);
            const searchRes = await gmFetch(searchUrl, 'json');
            debugLog(`📥 Search response:`, searchRes ? `${searchRes.total || 0} results` : 'null/undefined');
            let result = searchRes?.items?.[0];
            if (searchRes?.items?.length > 1) {
                const exactMatch = searchRes.items.find(item => item.name.toLowerCase() === name.toLowerCase());
                if (exactMatch) {
                    debugLog(`🎯 Found exact match: "${exactMatch.name}" (AppID: ${exactMatch.id})`);
                    result = exactMatch;
                }
            }
            appId = result?.id;
            if (!appId) {
                debugLog(`❌ No AppID found for "${name}"`);
                throw new Error('No suitable AppID found in search results.');
            }
            debugLog(`✓ Found AppID: ${appId} for "${result?.name}"`);
        } catch (err) {
            debugLog(`❌ Steam search failed for "${name}":`, err.message);
            console.warn(`Steam search failed for "${name}":`, err.message);
            apiCache.set(name, { data: null, ts: now });
            pruneCache(apiCache);
            return null;
        }

        // Second: Fetch details and reviews in parallel for speed
        let reviewInfo = null;
        let appData = null;
        try {
            const detailsUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us&l=en`;
            const reviewUrl = `https://store.steampowered.com/appreviews/${appId}?json=1&language=all&purchase_type=all&filter=summary`;
            debugLog(`📡 Fetching details and reviews for AppID: ${appId}`);

            const [detailsRes, reviewRes] = await Promise.all([
                gmFetch(detailsUrl, 'json').catch((e) => { debugLog(`❌ Details fetch error:`, e.message); return null; }),
                gmFetch(reviewUrl, 'json').catch((e) => { debugLog(`❌ Reviews fetch error:`, e.message); return null; })
            ]);

            debugLog(`📥 Details response:`, detailsRes ? (detailsRes[appId]?.success ? '✓ success' : '✗ failed') : 'null');
            if (detailsRes?.[appId]?.success) {
                appData = detailsRes[appId].data;
                debugLog(`✓ Got app data: "${appData.name}"`);
            } else {
                throw new Error('Failed to fetch app details or API indicated failure.');
            }

            if (reviewRes?.success && reviewRes.query_summary) {
                const summary = reviewRes.query_summary;
                const percent = summary.total_reviews ? Math.round((summary.total_positive / summary.total_reviews) * 100) : null;
                reviewInfo = {
                    desc: summary.review_score_desc || 'No Reviews',
                    percent: percent,
                    total: summary.total_reviews || 0
                };
                debugLog(`✓ Got reviews: ${reviewInfo.desc} (${reviewInfo.total} reviews)`);
            }
        } catch (err) {
            debugLog(`❌ Details/reviews fetch failed for AppID ${appId}:`, err.message);
            console.warn(`Steam details/reviews fetch failed for AppID ${appId}:`, err.message);
            if (!appData) {
                apiCache.set(name, { data: null, ts: now });
                pruneCache(apiCache);
                return null;
            }
        }

        // Third: Get user-defined tags by scraping the Steam store page
        let tags = [];
        if (appData) {
            try {
                const storePageUrl = `https://store.steampowered.com/app/${appId}/`;
                debugLog(`🏷️ Fetching tags from store page:`, storePageUrl);
                const storeHtml = await gmFetch(storePageUrl, 'text');
                if (storeHtml) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(storeHtml, 'text/html');
                    const tagElements = doc.querySelectorAll('a.app_tag');
                    tags = Array.from(tagElements)
                        .map(el => el.textContent.trim())
                        .filter(tag => tag && tag !== '+')
                        .slice(0, 5);
                    debugLog(`✓ Found ${tags.length} tags:`, tags.join(', ') || '(none)');
                }
            } catch (tagErr) {
                debugLog(`⚠️ Tag scraping failed for AppID ${appId}:`, tagErr.message, '- using fallback genres');
                console.warn(`[Steam Hover] Failed to fetch tags for AppID ${appId}:`, tagErr.message);
                // Fallback to genres if tag scraping fails
                tags = (appData.genres || []).map(g => g.description).slice(0, 5);
            }
        }

        const data = {
            ...appData,
            tags: tags,
            reviewInfo: reviewInfo,
            releaseDate: appData.release_date?.date || null,
            storeUrl: `https://store.steampowered.com/app/${appId}/`
        };
        debugLog(`✅ Successfully fetched Steam data for "${name}" -> "${data.name}"`);
        apiCache.set(name, { data: data, ts: now });
        pruneCache(apiCache);
        savePersistentCache(); // Save to storage for future sessions
        return data;
    }

    function positionTip(ev) {
        if (!tip) return;
        let x = ev.pageX + 15;
        let y = ev.pageY + 15;
        const tipWidth = tip.offsetWidth;
        const tipHeight = tip.offsetHeight;
        const margin = 10;
        const scrollX = window.scrollX || window.pageXOffset;
        const scrollY = window.scrollY || window.pageYOffset;
        const viewWidth = window.innerWidth;
        const viewHeight = window.innerHeight;
        if (x + tipWidth + margin > scrollX + viewWidth) {
            x = ev.pageX - tipWidth - 15;
            if (x < scrollX + margin) {
                x = scrollX + margin;
            }
        }
        if (x < scrollX + margin) {
            x = scrollX + margin;
        }
        if (y + tipHeight + margin > scrollY + viewHeight) {
            let yAbove = ev.pageY - tipHeight - 15;
            if (yAbove > scrollY + margin) {
                y = yAbove;
            } else {
                y = scrollY + viewHeight - tipHeight - margin;
                if (y < scrollY + margin) {
                    y = scrollY + margin;
                }
            }
        }
        if (y < scrollY + margin) {
            y = scrollY + margin;
        }
        tip.style.left = `${x}px`;
        tip.style.top = `${y}px`;
    }

    function startHideAnimation() {
        if (tip.style.display !== 'none' && tip.style.opacity !== '0') {
            tip.style.opacity = '0';
            tip.style.pointerEvents = 'none';
            trackingMove = false;
            clearTimeout(displayTimeout);
            displayTimeout = setTimeout(() => {
                tip.style.display = 'none';
            }, FADE_DURATION);
        } else if (tip.style.display !== 'none') {
            clearTimeout(displayTimeout);
            displayTimeout = setTimeout(() => { tip.style.display = 'none'; }, FADE_DURATION);
        }
    }

    function actuallyHideTip() {
        hoverId++;
        currentFetch = null;
        currentHoveredLink = null;
        clearTimeout(showTimeout);
        startHideAnimation();
    }

    function scheduleHideTip() {
        clearTimeout(hideTimeout);
        clearTimeout(displayTimeout);
        hideTimeout = setTimeout(actuallyHideTip, HIDE_DELAY);
    }

    function cancelHideTip() {
        clearTimeout(hideTimeout);
        clearTimeout(displayTimeout);
        if (tip.style.display === 'block' && tip.style.opacity === '0') {
            tip.style.opacity = '1';
            tip.style.pointerEvents = 'auto';
        }
    }

    function triggerShowAndFadeIn(event, gameName) {
        cancelHideTip();
        clearTimeout(displayTimeout);
        tip.innerHTML = `<div class="loadingContainer"><div class="spinner"></div><span>Loading <strong>${gameName}</strong>…</span></div>`;
        positionTip(event);
        tip.style.display = 'block';
        void tip.offsetHeight;
        tip.style.opacity = '1';
        tip.style.pointerEvents = 'auto';
    }

    tip.addEventListener('mouseenter', () => {
        cancelHideTip();
        if (trackingMove) {
            trackingMove = false;
        }
    });

    tip.addEventListener('mouseleave', () => {
        scheduleHideTip();
    });

    document.addEventListener('mouseover', async (e) => {
        const targetLink = e.target.closest(SEL);
        const isOverTip = tip.contains(e.target);

        if (targetLink || isOverTip) {
            cancelHideTip();
        }

        if (!targetLink || (targetLink === currentHoveredLink && !trackingMove)) {
            return;
        }

        // Only show Steam info for game torrents
        if (!isGameTorrent(targetLink)) {
            return;
        }

        if (currentHoveredLink && targetLink !== currentHoveredLink && tip.style.display === 'block') {
            tip.style.opacity = '0';
            tip.style.pointerEvents = 'none';
            tip.style.display = 'none';
            hoverId++;
            trackingMove = false;
            currentFetch = null;
        }

        currentHoveredLink = targetLink;
        userHovering = true;
        const rawName = targetLink.textContent;
        debugLog(`👆 HOVER on: "${rawName}"`);
        let gameName = cleanName(rawName);
        debugLog(`🧹 Cleaned name: "${gameName}"`);

        // Fallback: if cleanName returned null, use a basic cleaned version
        if (!gameName) {
            // Basic cleanup: split on brackets/parens, take first part
            gameName = rawName.trim()
                .replace(/^\[[^\]]*\]\s*/g, '')  // Remove [brackets] at start
                .replace(/[._]/g, ' ')            // Normalize separators
                .split(/[\(\[]/)[0]               // Split on ( or [
                .split(/\s+/)
                .slice(0, 4)                      // First 4 words
                .join(' ')
                .trim();
            if (!gameName || gameName.length < 2) {
                currentHoveredLink = null;
                userHovering = false;
                return;
            }
        }

        clearTimeout(showTimeout);

        const thisId = ++hoverId;
        trackingMove = true;
        lastMoveEvent = e;

        triggerShowAndFadeIn(e, gameName);

        showTimeout = setTimeout(async () => {
            if (hoverId !== thisId || !currentHoveredLink || currentHoveredLink !== targetLink) {
                if (!currentHoveredLink || currentHoveredLink !== targetLink) {
                    trackingMove = false;
                }
                return;
            }

            currentFetch = fetchSteamWithFallback(gameName);
            const data = await currentFetch;
            debugLog(`📝 Hover fetch result for "${gameName}":`, data ? `✓ got data for "${data.name}"` : '✗ null');
            currentFetch = null;

            if (hoverId !== thisId || !currentHoveredLink || currentHoveredLink !== targetLink) {
                if (!currentHoveredLink || currentHoveredLink !== targetLink) {
                    trackingMove = false;
                }
                return;
            }

            if (!data) {
                const searchUrl = `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`;
                tip.innerHTML = `<p>No Steam info found for<br><strong>${gameName}</strong></p><p><a href="${searchUrl}" target="_blank" rel="noopener noreferrer">Search on Steam</a></p>`;
            } else {
                const tagsHtml = data.tags?.length ?
                    `<p class="steamTags"><strong>Tags:</strong> ${data.tags.join(' • ')}</p>` :
                    '';
                const reviewHtml = (data.reviewInfo && data.reviewInfo.desc !== 'N/A' && data.reviewInfo.desc !== 'No Reviews') ?
                    `<p class="steamRating"><strong>Rating:</strong> ${getRatingStars(data.reviewInfo.percent, data.reviewInfo.desc)}<span class="ratingText">${data.reviewInfo.desc}${data.reviewInfo.total ? `  |  ${data.reviewInfo.total.toLocaleString()} reviews` : ''}</span></p>` :
                    '';
                const releaseDateHtml = data.releaseDate ?
                    `<p class="steamReleaseDate"><strong>Released:</strong> ${data.releaseDate}</p>` :
                    '';

                tip.innerHTML = `
                    ${data.header_image ? `<img src="${data.header_image}" alt="${data.name || gameName}" onerror="this.style.display='none'">` : ''}
                    <p><strong>${data.name || gameName}</strong></p>
                    ${releaseDateHtml}
                    <p>${data.short_description || 'No description available.'}</p>
                    ${reviewHtml}
                    ${tagsHtml}
                    <div class="tipActions">
                        ${data.storeUrl ? `<a href="${data.storeUrl}" target="_blank" rel="noopener noreferrer">🎮 Open on Steam</a>` : '<span></span>'}
                        <button class="magnetDownloadBtn" data-torrent-url="${window.location.origin}${targetLink.getAttribute('href')}">
                            🧲 Magnet Download
                        </button>
                    </div>
                `;
            }

            if (hoverId === thisId && currentHoveredLink === targetLink) {
                positionTip(lastMoveEvent);
                trackingMove = false;
                tip.style.opacity = '1';
                tip.style.pointerEvents = 'auto';
            } else {
                startHideAnimation();
            }

        }, SHOW_DELAY);
    }, true);


    document.addEventListener('mouseout', (e) => {
        const leavingCurrentLink = currentHoveredLink && currentHoveredLink === e.target.closest(SEL);
        const destinationIsTip = tip.contains(e.relatedTarget);
        if (leavingCurrentLink && !destinationIsTip) {
            scheduleHideTip();
            currentHoveredLink = null;
            userHovering = false;
        }
    }, true);

    document.addEventListener('pointermove', (e) => {
        if (trackingMove && tip.style.display === 'block') {
            lastMoveEvent = e;
            positionTip(e);
        }
    }, { capture: true, passive: true });

    // ═══════════════════════════════════════════════════════════════════════════
    // MAGNET DOWNLOAD BUTTON (in hover card)
    // ═══════════════════════════════════════════════════════════════════════════

    // Magnet link cache to avoid re-fetching
    const magnetCache = new Map();

    // Fetch magnet link from torrent page
    async function fetchMagnetLink(torrentUrl) {
        // Ensure full URL
        const fullUrl = torrentUrl.startsWith('http')
            ? torrentUrl
            : window.location.origin + torrentUrl;

        console.log('[Magnet Download] Fetching:', fullUrl);

        // Check cache first
        if (magnetCache.has(fullUrl)) {
            console.log('[Magnet Download] Cache hit!');
            return magnetCache.get(fullUrl);
        }

        // Use regular fetch - same origin so cookies are included automatically
        const response = await fetch(fullUrl, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html'
            }
        });

        console.log('[Magnet Download] Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const magnetLink = doc.querySelector('a[href^="magnet:"]');

        if (magnetLink) {
            const magnet = magnetLink.getAttribute('href');
            magnetCache.set(fullUrl, magnet);
            console.log('[Magnet Download] Found magnet link!');
            return magnet;
        } else {
            console.error('[Magnet Download] No magnet link found in page');
            throw new Error('Magnet link not found');
        }
    }

    // Handle clicks on magnet download button inside tooltip
    tip.addEventListener('click', async (e) => {
        const btn = e.target.closest('.magnetDownloadBtn');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        if (btn.classList.contains('loading')) return;

        const torrentUrl = btn.dataset.torrentUrl;
        console.log('[Magnet Download] Torrent URL:', torrentUrl);

        if (!torrentUrl) {
            console.error('[Magnet Download] No torrent URL found in button data');
            return;
        }

        // Show loading state
        const originalContent = btn.innerHTML;
        btn.classList.add('loading');
        btn.textContent = '⏳ Loading...';

        try {
            const magnet = await fetchMagnetLink(torrentUrl);
            console.log('[Magnet Download] Got magnet link:', magnet.substring(0, 60) + '...');

            // Open magnet link - this triggers qBittorrent!
            window.location.href = magnet;

            // Show success briefly
            btn.classList.remove('loading');
            btn.textContent = '✓ Opening...';

            setTimeout(() => {
                btn.innerHTML = originalContent;
            }, 2000);

        } catch (err) {
            console.error('[Magnet Download] Error:', err);
            btn.classList.remove('loading');
            btn.textContent = '✗ Failed - ' + err.message;

            setTimeout(() => {
                btn.innerHTML = originalContent;
            }, 3000);
        }
    });

    console.log("1337x Steam Hover Preview script loaded.");

})();