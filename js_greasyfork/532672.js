// ==UserScript==
// @name         ROBLOX 2016 Gamecard Addon For RLOT 
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Restores the old look of the gamecard to match its 2016 counterpart
// @match        *://www.roblox.com/*
// @author       The Noise!
// @grant        GM_addStyle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAaJJREFUeJztmsFOAjEQhv/tildvJPpE8gQQTx6IvpnRJ1hj0OfRxIOGg0FY64mkIYRMu+1MGea7sYdO9+u0204BDMMwDMM4VRqpwK6b+vD33+RJpC9OIujl653ffbYrhAsRAR+/33ufS0gQEXCI8WLOKqE6AZ/rJWs8dgGUNL94uWXLguoyAACW/Q9brCoFcGICOIOdP9+IfOsPwSZgvJj7je+5wpFhE8D9eaNyVjqA1BaXii2CJRtP3dZyngyLCXDd1Nc670OKCKh93odUtwZwF0ayBxsy+hJVoawZcEypv4Vk/FhebNS0WF0/RGVRdWvAENYJW21VAoD4bFUnIBYTIN2BEsRMA5UCAKDtZiQJagV40JJArQCANhVUC6BsrVULoKBWAPVgpVJAzKlSpYAYTIB0B3ITW1RRJaBJKHCpEtBPHqMNqBHgEsubagRsEkYfUCQglZMXEL9oVFYhdmiS0x8YcDFSi4ihlynJU0Dqv70ho6Yd3EaWl2i7madWYHKSYxCyj+LV271/X33lbnYvVQrYUnqNSLkGMwzDMAzDCPkHg/Jw0+Nv/a8AAAAASUVORK5CYII=
// @grant        GM_xmlhttpRequest
// @connect      games.roblox.com
// @connect      api.roblox.com
// @connect      apis.roblox.com
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532672/ROBLOX%202016%20Gamecard%20Addon%20For%20RLOT.user.js
// @updateURL https://update.greasyfork.org/scripts/532672/ROBLOX%202016%20Gamecard%20Addon%20For%20RLOT.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Debug mode
    const DEBUG = true;
    function log(...args) {
        if (DEBUG) console.log('[Roblox 2016 Gamecard]', ...args);
    }
    function logError(...args) {
        console.error('[Roblox 2016 Gamecard ERROR]', ...args);
    }

    // Skip on certain favorites page
    const currentUrl = window.location.href;
    if (currentUrl.match(/roblox\.com\/users\/\d+\/favorites#!\/places/)) {
        log("Skipping execution on favorites places page");
        return;
    }

    // Cache & rate limits
    const CACHE_VERSION       = 1;
    const CACHE_EXPIRY        = 24 * 60 * 60 * 1000;
    const API_DELAY           = 2000;
    const MAX_RETRIES         = 3;
    const RETRY_DELAY         = 5000;
    let lastAPICall           = 0;
    let pendingRequests       = [];
    let isProcessingQueue     = false;
    let gameDataCache         = {};
    let placeToUniverseCache  = {};
    let lastCacheSave         = 0;
    const CACHE_SAVE_DELAY    = 10000;

    // Page-type flags
    const isChartsPage    = currentUrl.includes('roblox.com/charts');
    const isGamesPage     = currentUrl.includes('roblox.com/games/');
    const isUsersPage     = currentUrl.includes('roblox.com/users');
    const isExactGamesUrl = /^https?:\/\/www\.roblox\.com\/games\/?(\?.*)?$/.test(currentUrl);

    log("Initializing on:", currentUrl);

    // Bail on unsupported pages
    if (currentUrl.includes('roblox.com/groups/') ||
        currentUrl.includes('roblox.com/communities/')) {
        log("Skipping on unsupported page type");
        return;
    }

    // Load cache
    function loadCache() {
        try {
            let gameCache = {};
            const cachedData = JSON.parse(localStorage.getItem('roblox2016GamecardCache') || '{}');
            if (cachedData.version === CACHE_VERSION && cachedData.data) {
                const now = Date.now();
                for (const [id, item] of Object.entries(cachedData.data)) {
                    if (now - item.timestamp < CACHE_EXPIRY) {
                        gameCache[id] = item.data;
                    }
                }
                log(`Loaded ${Object.keys(gameCache).length} games from cache`);
            }
            let mappingCache = {};
            const pm = JSON.parse(localStorage.getItem('roblox2016PlaceToUniverseCache') || '{}');
            if (pm.data) mappingCache = pm.data;
            log(`Loaded ${Object.keys(mappingCache).length} place→universe mappings`);
            return { gameCache, mappingCache };
        } catch (e) {
            logError("Cache load failed", e);
            return { gameCache: {}, mappingCache: {} };
        }
    }

    // Throttled save
    function saveCache() {
        const now = Date.now();
        if (now - lastCacheSave < CACHE_SAVE_DELAY) return;
        lastCacheSave = now;
        try {
            const cacheObj = { version: CACHE_VERSION, timestamp: now, data: {} };
            for (const [id, data] of Object.entries(gameDataCache)) {
                cacheObj.data[id] = { timestamp: now, data };
            }
            localStorage.setItem('roblox2016GamecardCache', JSON.stringify(cacheObj));
            localStorage.setItem('roblox2016PlaceToUniverseCache',
                                 JSON.stringify({ version: CACHE_VERSION, timestamp: now, data: placeToUniverseCache }));
            log(`Saved ${Object.keys(gameDataCache).length} games & ${Object.keys(placeToUniverseCache).length} mappings`);
        } catch (e) {
            logError("Cache save failed", e);
        }
    }

    // Extract IDs
    function getGameId(card) {
        try {
            const uId = findUniverseId(card);
            if (uId) return { universeId: uId, placeId: null };
            const pId = findPlaceId(card);
            if (pId) {
                if (placeToUniverseCache[pId]) {
                    return { universeId: placeToUniverseCache[pId], placeId: pId };
                }
                return { universeId: null, placeId: pId };
            }
            return { universeId: null, placeId: null };
        } catch (e) {
            logError("getGameId error", e);
            return { universeId: null, placeId: null };
        }
    }
    function findUniverseId(card) {
        if (card.dataset.universeId) return card.dataset.universeId;
        const link = card.querySelector('a.game-card-link[id]');
        if (link && /^\d+$/.test(link.id)) return link.id;
        for (const a of card.querySelectorAll('a')) {
            const m = a.href.match(/[?&]universeId=(\d+)/);
            if (m) return m[1];
        }
        return null;
    }
    function findPlaceId(card) {
        if (card.dataset.placeId) return card.dataset.placeId;
        if (isUsersPage) {
            const link = card.querySelector('a.game-card-link');
            const m = link && link.href.match(/\/games\/(\d+)/);
            if (m) return m[1];
        }
        for (const a of card.querySelectorAll('a')) {
            let m = a.href.match(/[?&]placeId=(\d+)/);
            if (m) return m[1];
            m = a.href.match(/\/games\/(\d+)/);
            if (m) return m[1];
        }
        return null;
    }

    // Convert placeId → universeId
    function convertPlaceIdToUniverseId(placeId, cb) {
        log("Converting placeId", placeId);
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://apis.roblox.com/universes/v1/places/${placeId}/universe`,
            headers: { Accept: "application/json" },
            onload(res) {
                if (res.status === 200) {
                    try {
                        const d = JSON.parse(res.responseText);
                        if (d.universeId) {
                            placeToUniverseCache[placeId] = d.universeId;
                            saveCache();
                            return cb(d.universeId);
                        }
                    } catch (e) { logError("Parse error", e); }
                }
                logError("Convert failed", res.status);
                cb(null);
            },
            onerror(err) {
                logError("Convert error", err);
                cb(null);
            }
        });
    }

    // Process a single card
    const processedCards = new Set();
    function processCard(card, priority = 0) {
        if (processedCards.has(card)) return;
        processedCards.add(card);

        const { universeId, placeId } = getGameId(card);
        if (universeId) {
            const ext = createExtension(card, universeId);
            ext.dataset.priority = priority;
            if (gameDataCache[universeId]) {
                updateExtension(ext, gameDataCache[universeId]);
            } else {
                queueAPIRequest(universeId, ext, priority);
            }
        } else if (placeId) {
            const ext = createExtension(card, null);
            ext.dataset.priority = priority;
            ext.dataset.placeId = placeId;
            convertPlaceIdToUniverseId(placeId, uId => {
                if (uId) {
                    ext.dataset.universeId = uId;
                    if (gameDataCache[uId]) {
                        updateExtension(ext, gameDataCache[uId]);
                    } else {
                        queueAPIRequest(uId, ext, priority);
                    }
                } else {
                    updateExtension(ext, {
                        upVotes: 0, downVotes: 0,
                        creatorName: "Unknown", creatorId: "1", creatorType: "user"
                    });
                }
            });
        }
    }

    // Queue & fetch
    function queueAPIRequest(uId, ext, priority = 0, retryCount = 0) {
        pendingRequests.push({ universeId: uId, extension: ext, priority, retryCount, timestamp: Date.now() });
        pendingRequests.sort((a, b) => b.priority - a.priority);
        if (!isProcessingQueue) processAPIQueue();
    }
    function processAPIQueue() {
        if (!pendingRequests.length) { isProcessingQueue = false; return; }
        isProcessingQueue = true;
        const now = Date.now();
        if (now - lastAPICall < API_DELAY) {
            return setTimeout(processAPIQueue, API_DELAY - (now - lastAPICall) + 100);
        }
        const req = pendingRequests.shift();
        fetchGameData(req.universeId, req.extension, req.retryCount);
    }
    function fetchGameData(uId, ext, retryCount = 0) {
        lastAPICall = Date.now();
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://games.roblox.com/v1/games/votes?universeIds=${uId}`,
            headers: { Accept: "application/json" },
            onload(res) {
                let up = 0, down = 0;
                if (res.status === 200) {
                    try {
                        const d = JSON.parse(res.responseText).data[0];
                        up = d.upVotes; down = d.downVotes;
                    } catch (e) { logError("Votes parse", e); }
                }
                fetchCreatorInfo(uId, ext, up, down);
                setTimeout(processAPIQueue, API_DELAY);
            },
            onerror() {
                fetchCreatorInfo(uId, ext, 0, 0);
                setTimeout(processAPIQueue, API_DELAY);
            }
        });
    }
    function fetchCreatorInfo(uId, ext, up, down) {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://games.roblox.com/v1/games?universeIds=${uId}`,
            headers: { Accept: "application/json" },
            onload(res) {
                let name = "ROBLOX", id = "1", type = "user";
                if (res.status === 200) {
                    try {
                        const c = JSON.parse(res.responseText).data[0].creator;
                        name = c.name; id = c.id; type = c.type.toLowerCase();
                    } catch (e) {}
                }
                const data = { upVotes: up, downVotes: down, creatorName: name, creatorId: id, creatorType: type };
                gameDataCache[uId] = data;
                saveCache();
                updateExtension(ext, data);
            },
            onerror() {
                const data = { upVotes: up, downVotes: down, creatorName: "Unknown", creatorId: "1", creatorType: "user" };
                gameDataCache[uId] = data;
                saveCache();
                updateExtension(ext, data);
            }
        });
    }

    // Helper to force the separator line on top
    function bringSeparatorToFront(ext) {
        const sep = ext.querySelector('.card-separator-line');
        if (sep) sep.style.zIndex = '10000';
    }

    // Build the hover extension
    function createExtension(card, universeId) {
        if (!card.dataset.cardId) {
            card.dataset.cardId = `card-${Math.floor(Math.random() * 1e6)}`;
        }
        const cid    = card.dataset.cardId;
        let   ext    = document.getElementById(`extension-${cid}`);
        let   shadow = document.getElementById(`shadow-${cid}`);
        if (ext && shadow) return ext;

        ext = document.createElement('div');
        ext.className = 'card-extension';
        ext.id        = `extension-${cid}`;
        if (universeId) ext.dataset.universeId = universeId;
        ext.innerHTML = `
            <div class="vote-up-count">...</div>
            <div class="vote-down-count">...</div>
            <div class="card-separator-line"></div>
            <div class="game-creator-container">
                <span class="game-creator-by">By </span>
                <a class="game-creator-name" href="#">...</a>
            </div>
        `;

        shadow = document.createElement('div');
        shadow.className = 'card-shadow';
        shadow.id        = `shadow-${cid}`;

        document.body.appendChild(ext);
        document.body.appendChild(shadow);

        function show() {
            ext.style.zIndex    = '9999';
            shadow.style.zIndex = '9998';

            const r = card.getBoundingClientRect();

            // move extension 2px higher (subtract 3 from bottom)
            ext.style.top  = (r.bottom + window.scrollY - 3) + 'px';
            ext.style.left = (r.left   + window.scrollX)    + 'px';

            // fixed width: 146px on games pages (150 − 4), 150px elsewhere
            const width = isGamesPage ? 146 : 150;
            ext.style.width    = width + 'px';
            shadow.style.width = width + 'px';

            shadow.style.top    = (r.top    + window.scrollY) + 'px';
            shadow.style.left   = (r.left   + window.scrollX) + 'px';
            shadow.style.height = (r.height + 44) + 'px';

            bringSeparatorToFront(ext);

            ext.style.display    = shadow.style.display = 'block';
        }
        function hide() {
            ext.style.display    = shadow.style.display = 'none';
        }

        card.addEventListener('mouseenter', show);
        card.addEventListener('mouseleave', e => {
            if (![ext, shadow].includes(e.relatedTarget)) hide();
        });
        ext.addEventListener('mouseenter', show);
        ext.addEventListener('mouseleave', e => {
            if (![card, shadow].includes(e.relatedTarget)) hide();
        });
        shadow.addEventListener('mouseenter', show);
        shadow.addEventListener('mouseleave', e => {
            if (![card, ext].includes(e.relatedTarget)) hide();
        });

        return ext;
    }

    function updateExtension(ext, data) {
        try {
            ext.querySelector('.vote-up-count').textContent   = data.upVotes.toLocaleString();
            ext.querySelector('.vote-down-count').textContent = data.downVotes.toLocaleString();
            const nameEl = ext.querySelector('.game-creator-name');
            nameEl.textContent = data.creatorName;
            nameEl.href = data.creatorType === 'user'
                ? `https://www.roblox.com/users/${data.creatorId}/profile`
                : `https://www.roblox.com/groups/${data.creatorId}`;
            ext.classList.add('has-data');
        } catch (e) {
            logError("updateExtension error", e);
        }
    }

    // Replace empty-vote spans with an empty bar
    function processEmptyVotes() {
        document.querySelectorAll('span.info-label.no-vote:not(.processed-empty-label)')
            .forEach(label => {
                label.classList.add('processed-empty-label');

                // --- FIX START ---
                // Skip hidden/no-op elements (the original markup often uses "hidden")
                if (label.classList.contains('hidden') ||
                    label.offsetParent === null ||
                    window.getComputedStyle(label).display === 'none') {
                    if (DEBUG) log('Skipping hidden no-vote label', label);
                    return;
                }

                // If the container already has a percentage label or a vote-bar inserted,
                // skip to avoid creating a duplicate bar.
                const parent = label.parentNode;
                if (parent && (
                    parent.querySelector('.info-label.vote-percentage-label') ||
                    parent.querySelector('.vote-bar-seg-container') ||
                    parent.querySelector('.processed-label')
                )) {
                    if (DEBUG) log('Skipping no-vote because a vote-percentage or vote-bar already exists', label);
                    return;
                }
                // --- FIX END ---

                const wrap = document.createElement('div');
                wrap.style.display = 'inline-flex';
                wrap.style.alignItems = 'center';
                wrap.appendChild(createSegmentedBar(0));
                wrap.appendChild(createThumbsDownIcon());
                label.parentNode.replaceChild(wrap, label);
            });
    }

    // Process percentage labels (1–100)
    const processedVoteLabels = new Set();
    function processVoteLabels() {
        document.querySelectorAll('.info-label.vote-percentage-label:not(.processed-label)')
            .forEach(label => {
                processedVoteLabels.add(label);
                label.classList.add('processed-label');
                const pct = parseInt(label.textContent, 10);
                if (isNaN(pct)) return;
                const wrap = document.createElement('div');
                wrap.style.display = 'inline-flex';
                wrap.style.alignItems = 'center';
                wrap.appendChild(createSegmentedBar(pct));
                wrap.appendChild(createThumbsDownIcon());
                label.parentNode.replaceChild(wrap, label);
            });
    }

    function createSegmentedBar(percent) {
        const segs = [19, 19, 19, 19, 21];
        const totalFill = (percent / 100) * 97;
        let rem = totalFill;
        const cont = document.createElement('div');
        cont.className = 'vote-bar-seg-container';
        segs.forEach(w => {
            const seg = document.createElement('div');
            seg.className = 'vote-segment';
            seg.style.width = w + 'px';
            const fill = document.createElement('div');
            fill.className = 'vote-segment-filled';
            const fw = Math.min(w, Math.max(0, rem));
            fill.style.width = fw + 'px';
            rem -= fw;
            seg.appendChild(fill);
            cont.appendChild(seg);
        });
        return cont;
    }
    function createThumbsDownIcon() {
        const s = document.createElement('span');
        s.className = 'vote-thumbs-down-icon';
        return s;
    }

    // Process all cards
    function processAllCards() {
        // --- FIX: process percentage labels first, then empty/no-vote spans ---
        processVoteLabels();
        processEmptyVotes();

        document.querySelectorAll('.game-sort-carousel-wrapper .game-card-container:not(.gamecard-processed)')
            .forEach(c => { c.classList.add('gamecard-processed'); processCard(c, 10); });
        if (isUsersPage) {
            document.querySelectorAll('.game-card:not(.gamecard-processed), .hover-game-card:not(.gamecard-processed)')
                .forEach(c => { c.classList.add('gamecard-processed'); processCard(c, 5); });
        }
        document.querySelectorAll('.game-card-container:not(.gamecard-processed)')
            .forEach(c => { c.classList.add('gamecard-processed'); processCard(c, 0); });
    }

    // CSS styles
    GM_addStyle(`
        .vote-bar-seg-container { display:inline-block; width:105px; height:6px; vertical-align:middle; }
        .vote-segment { display:inline-block; height:100%; background:#b8b8b8; position:relative; vertical-align:middle; }
        .vote-segment:not(:last-child){margin-right:2px;}
        .vote-segment-filled { background:#757575; height:100%; width:0; }
        .vote-thumbs-down-icon {
            background-image:url("https://static.rbxcdn.com/images/Icons/thumbs.svg");
            background-position:-16px -16px; background-repeat:no-repeat; background-size:32px;
            display:none; height:16px; width:16px; margin-left:0; position:relative; top:9px; filter:brightness(150%);
        }
        .game-card-container:hover .vote-segment,
        .game-card:hover .vote-segment { background:#eeadad !important; }
        .game-card-container:hover .vote-segment-filled,
        .game-card:hover .vote-segment-filled { background:#02b757 !important; }
        .game-card-container:hover .vote-thumbs-down-icon,
        .game-card:hover .vote-thumbs-down-icon { display:inline-block !important; }

        /* no longer hiding .no-vote spans; replaced via JS */

        .card-extension {
            position:absolute;
            height:45px;
            background:#fff;
            border-bottom-left-radius:3px;
            border-bottom-right-radius:3px;
            display:none;
            z-index:9999 !important;
            box-shadow:none;
            pointer-events:auto;
        }
        .card-shadow {
            position:absolute;
            display:none;
            z-index:9998 !important;
            pointer-events:none;
            background:transparent;
            border-radius:3px;
            box-shadow:0 3px 6px rgba(0,0,0,0.4),
                        3px 0 6px -3px rgba(0,0,0,0.4),
                       -3px 0 6px -3px rgba(0,0,0,0.4);
        }

        .vote-up-count {
            color:#02b757; font-size:12px!important; font-weight:300; opacity:0.6;
            position:absolute; left:7px; top:-5px;
        }
        .vote-down-count {
            color:rgb(226,118,118); font-size:12px!important; font-weight:300; opacity:0.6;
            position:absolute; right:7px; top:-5px;
        }

        .card-separator-line {
            position:absolute;
            height:1px;
            left:0; right:0;
            bottom:30px;
            background-color:#e3e3e3;
            z-index:10000 !important;
        }

        .game-creator-container {
            font-size:12px; font-weight:400; margin-left:3px;
            overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
            width:calc(100% - 18px);
            position:absolute; bottom:5px; left:3px;
        }
        .game-creator-by { color:#b8b8b8; font-size:12px; }
        .game-creator-name {
            color:#00a2ff!important; text-decoration:none; font-size:12px; cursor:pointer;
        }
        .game-creator-name:hover { text-decoration:underline; }

        .game-card-container, .game-card { z-index:auto!important; }
        .game-card-container:hover, .game-card:hover { z-index:10!important; }
    `);

    // Init
    function initialize() {
        const { gameCache, mappingCache } = loadCache();
        gameDataCache        = gameCache;
        placeToUniverseCache = mappingCache;
        processAllCards();
        new MutationObserver(muts => {
            if (muts.some(m => m.addedNodes.length)) processAllCards();
        }).observe(document.body, { childList:true, subtree:true });
        window.addEventListener('scroll', () => {
            clearTimeout(window._r2016_t);
            window._r2016_t = setTimeout(processAllCards, 500);
        }, { passive:true });
        setInterval(saveCache, 30000);
    }
    setTimeout(initialize, 500);
})();
