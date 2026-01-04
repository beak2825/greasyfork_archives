// ==UserScript==
// @name         FOTW tool
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  tool for crwflags.com/fotw/flags
// @author       Derus
// @match        *://www.crwflags.com/fotw/flags/*
// @grant        GM_addStyle
// @require      https://unpkg.com/fuse.js@6.6.2/dist/fuse.min.js
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545462/FOTW%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/545462/FOTW%20tool.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const Config = {
        BASE_URL: 'https://www.crwflags.com/fotw/flags/',
        DB_NAME: 'crwflags_tool_v7',
        STORE_NAME: 'flags',
        FAV_KEY: 'fotw_favs_v7',
        SESSION_CONTEXT_KEY: 'fotw_nav_context_v7',
        SESSION_HISTORY_KEY: 'fotw_history_v9',
        INSPECTOR_STATE_KEY: 'fotw_inspector_minimized_v9',
        HISTORY_STATE_KEY: 'fotw_history_minimized_v9',
        FETCH_TIMEOUT_MS: 12000,
        KEYWORD_SCRAPE_DELAY_MS: 100,
        SEARCH_RESULT_LIMIT: 80,
        DEBOUNCE_DELAY_MS: 300,
        HISTORY_MAX_SIZE: 15,
    };

    const State = {
        fuse: null,
        masterList: [],
        db: null,
        isRebuilding: false,
        favorites: new Set(),
        currentList: [],
        currentIndex: -1,
        currentItem: null,
        flagPreviewCache: new Map(),
        debounceTimer: null,
        historyList: [],
        inspectorFlags: [],
        isViewingFavorites: false,
    };

    const JUNK_PAGE_IDS = new Set([
        'index.html', 'host.html', 'fe_writ.html', 'mailme.html',
        'disclaim.html', 'search.html', 'mirror.html', 'mirrors.html'
    ]);

    // --- DOM Elements ---
    let statusEl, searchEl, resultsEl, infoEl, categoryFilterEl, btnFavToggle,
        btnRebuild, inspectorPanel, inspectorTitle, inspectorContent,
        historyPanel, historyTitle, historyContent;

    // --- Helper Functions ---
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const escapeHtml = s => (s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const filenameFromId = id => id ? id.split('/').pop().split('?')[0].split('#')[0].toLowerCase() : '';
    const isTwoLetterCountryId = id => /^[a-z]{2}(?:\.html?)?$/.test(filenameFromId(id));
    const isIndexPageId = id => /^keyword[a-z]\.html?$/.test(filenameFromId(id));

    // --- UI Update Functions ---
    function setStatus(msg) { statusEl.textContent = msg; }
    function toggleControls(enabled) { document.querySelectorAll('#fotwPanel button, #fotwPanel input, #fotwPanel select').forEach(el => el.disabled = !enabled); }
    function renderList(element, items) { if (!items?.length) { element.innerHTML = ''; return; } element.innerHTML = items.map(it => ` <div data-id="${escapeHtml(it.id)}" data-url="${escapeHtml(it.url)}"> ${escapeHtml(it.name)} <span style="opacity:.6; font-size:11px">[${escapeHtml(it.category)}]</span> </div>`).join(''); }
    function updateFavButton() { const isFav = State.favorites.has(State.currentItem?.id); btnFavToggle.textContent = isFav ? '🌟 Unfav' : '⭐ Fav'; }
    function updateCurrentItemDisplay() { if (!State.currentItem) { infoEl.innerHTML = 'No item selected or not in DB.'; btnFavToggle.disabled = true; return; } infoEl.innerHTML = `<b>${escapeHtml(State.currentItem.name)}</b> <br><small style="opacity:.7;">[${escapeHtml(State.currentItem.category)}]</small> <br><a href="${escapeHtml(State.currentItem.url)}" target="_blank" rel="noopener noreferrer">Open page</a> <span id="copyLinkBtn" title="Copy Link">📋</span>`; updateFavButton(); btnFavToggle.disabled = false; document.getElementById('copyLinkBtn').addEventListener('click', copyCurrentLink); }

    // --- Data & State Management ---
    const DbUtils = { open: () => new Promise((resolve, reject) => { const r = indexedDB.open(Config.DB_NAME, 1); r.onupgradeneeded = e => { if (!e.target.result.objectStoreNames.contains(Config.STORE_NAME)) e.target.result.createObjectStore(Config.STORE_NAME, { keyPath: 'id' }); }; r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); }), getAll: db => new Promise((resolve, reject) => { try { const r = db.transaction(Config.STORE_NAME, 'readonly').objectStore(Config.STORE_NAME).getAll(); r.onsuccess = () => resolve(r.result || []); r.onerror = () => reject(r.error); } catch (e) { reject(e); } }), putBatch: (db, items) => new Promise((resolve, reject) => { try { const t = db.transaction(Config.STORE_NAME, 'readwrite'); const s = t.objectStore(Config.STORE_NAME); items.forEach(item => s.put(item)); t.oncomplete = resolve; t.onerror = () => reject(t.error); } catch (e) { reject(e); } }) };
    async function fetchWithTimeout(url, timeoutMs = Config.FETCH_TIMEOUT_MS) { const controller = new AbortController(); const timeoutId = setTimeout(() => controller.abort(), timeoutMs); try { const response = await fetch(url, { signal: controller.signal }); if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`); return await response.text(); } finally { clearTimeout(timeoutId); } }
    function loadFavorites() { State.favorites = new Set(JSON.parse(localStorage.getItem(Config.FAV_KEY) || '[]')); }
    function saveFavorites() { localStorage.setItem(Config.FAV_KEY, JSON.stringify(Array.from(State.favorites))); }
    function loadHistory() { try { const storedHistory = sessionStorage.getItem(Config.SESSION_HISTORY_KEY); if (!storedHistory) return; const historyIds = JSON.parse(storedHistory); const masterMap = new Map(State.masterList.map(item => [item.id, item])); State.historyList = historyIds.map(id => masterMap.get(id)).filter(Boolean); } catch (e) { console.error("Could not parse history:", e); State.historyList = []; } }

    // --- Core Logic Functions ---
    function goToItem(item) { if (!item?.url) return; if (State.currentList?.length) { const context = { list: State.currentList.map(i => i.id), index: State.currentIndex }; sessionStorage.setItem(Config.SESSION_CONTEXT_KEY, JSON.stringify(context)); } location.href = item.url; }
    function toggleFavorite() { if (!State.currentItem) return; const id = State.currentItem.id; if (State.favorites.has(id)) { State.favorites.delete(id); } else { State.favorites.add(id); } saveFavorites(); updateFavButton(); }
    async function copyCurrentLink(event) { if (!State.currentItem) return; try { await navigator.clipboard.writeText(State.currentItem.url); const originalText = event.target.textContent; event.target.textContent = 'Copied!'; setTimeout(() => { event.target.textContent = originalText; }, 1500); } catch (err) { console.error('Failed to copy link:', err); } }
    async function getFlagImageUrl(pageUrl) { if (State.flagPreviewCache.has(pageUrl)) return State.flagPreviewCache.get(pageUrl); try { const html = await fetchWithTimeout(pageUrl); const doc = new DOMParser().parseFromString(html, 'text/html'); const flagImg = doc.querySelector('p img[src*="images/"]'); if (flagImg?.src) { const imageUrl = new URL(flagImg.src, pageUrl).href; State.flagPreviewCache.set(pageUrl, imageUrl); return imageUrl; } } catch (error) { console.warn(`Could not fetch preview for ${pageUrl}:`, error); } State.flagPreviewCache.set(pageUrl, null); return null; }

    function updateInspector() { const masterMap = new Map(State.masterList.map(item => [item.id, item])); const foundIds = new Set(); for (const a of document.links) { if (a.href.startsWith(Config.BASE_URL)) { const id = a.href.slice(Config.BASE_URL.length); if (masterMap.has(id) && id !== State.currentItem?.id && !JUNK_PAGE_IDS.has(id)) foundIds.add(id); } } State.inspectorFlags = Array.from(foundIds).map(id => masterMap.get(id)); if (State.inspectorFlags.length > 0) { inspectorPanel.style.display = 'block'; inspectorTitle.textContent = `🔎 Flag Inspector (${State.inspectorFlags.length})`; renderList(inspectorContent, State.inspectorFlags); } else { inspectorPanel.style.display = 'none'; } }
    function updateHistory() { if (!State.currentItem) return; const currentId = State.currentItem.id; const existingIndex = State.historyList.findIndex(item => item.id === currentId); if (existingIndex > -1) State.historyList.splice(existingIndex, 1); State.historyList.unshift(State.currentItem); if (State.historyList.length > Config.HISTORY_MAX_SIZE) { State.historyList = State.historyList.slice(0, Config.HISTORY_MAX_SIZE); } sessionStorage.setItem(Config.SESSION_HISTORY_KEY, JSON.stringify(State.historyList.map(item => item.id))); if (State.historyList.length > 0) { historyPanel.style.display = 'block'; historyTitle.textContent = `🕒 Session History (${State.historyList.length})`; renderList(historyContent, State.historyList); } else { historyPanel.style.display = 'none'; } }

    async function rebuildMasterList() { if (State.isRebuilding) return; State.isRebuilding = true; toggleControls(false); btnRebuild.disabled = true; setStatus('Rebuilding DB...'); const newMap = new Map(); try { const letters = 'abcdefghijklmnopqrstuvwxyz'; for (let i = 0; i < letters.length; i++) { const char = letters[i]; const path = `${Config.BASE_URL}keyword${char}.html`; try { const html = await fetchWithTimeout(path); const doc = new DOMParser().parseFromString(html, 'text/html'); for (const a of doc.querySelectorAll('a[href]')) { const url = new URL(a.href, path).href; if (url.startsWith(Config.BASE_URL)) { const id = url.slice(Config.BASE_URL.length); const name = a.textContent?.trim() || id; if (!newMap.has(id)) newMap.set(id, { id, name, url, category: 'misc' }); } } } catch (e) { console.warn(`Failed to fetch keyword page for "${char}":`, e); } setStatus(`Rebuild: Scanned '${char.toUpperCase()}' (${i + 1}/${letters.length}) | Found: ${newMap.size}`); await sleep(Config.KEYWORD_SCRAPE_DELAY_MS); } let allItems = Array.from(newMap.values()); setStatus(`Categorizing ${allItems.length} links...`); const obscureKeywords = /\b(proposed|fictional|micronation|unofficial|club|football|society|organization|personal|local custom|movement|variant|political|party|separatist|ethnic|company|house flag|aspirant|cultural|sports|association|UFE|unidentified)\b/i; for (const item of allItems) { if (isTwoLetterCountryId(item.id)) item.category = 'country'; else if (isIndexPageId(item.id)) item.category = 'index'; else { const name = item.name.toLowerCase(); if (/\b(historical|history|former|formerly|obsolete)\b/i.test(name)) item.category = 'historical'; else if (/\b(ensign|naval|jack|pennant|burgee|yacht|ship|maritime|merchant)\b/i.test(name)) item.category = 'maritime'; else if (/\b(region|province|municipal|city|county|prefecture|oblast|krai|state|provincial)\b/i.test(name)) item.category = 'regional'; else if (obscureKeywords.test(name) || item.name.split(/\s+/).length > 4) item.category = 'obscure'; else item.category = 'regional'; } } State.masterList = allItems.filter(item => item.category !== 'index' && !JUNK_PAGE_IDS.has(item.id)); await DbUtils.putBatch(State.db, State.masterList); State.fuse = new Fuse(State.masterList, { keys: ['name'], threshold: 0.3 }); setStatus(`Rebuild complete: ${State.masterList.length} items.`); } catch (e) { setStatus(`Rebuild failed: ${e.message}`); console.error("Rebuild failed:", e); } finally { State.isRebuilding = false; toggleControls(true); } }

    function setupPanel() { GM_addStyle(` #fotwPanel { position:fixed; top:48px; right:12px; width:360px; max-height:85vh; overflow-y:auto; background:#003399; padding:14px; border-radius:10px; font-family:Arial,sans-serif; color:#fff; box-shadow:0 0 18px rgba(0,0,0,0.7); z-index:2147483647; } #fotwHeader { font-size:18px; font-weight:700; margin-bottom:10px; text-align:center; user-select:none; } #fotwSearchInput, #fotwCategoryFilter { width:100%; padding:8px; font-size:14px; border-radius:6px; border:none; margin-bottom:8px; box-sizing:border-box; } #fotwButtonsRow { display:grid; grid-template-columns:repeat(3, 1fr); gap:6px; justify-items:stretch; margin-bottom:8px; } #fotwButtonsRow button { background:#0055cc; border:none; border-radius:6px; padding:8px 6px; color:#fff; font-size:13px; cursor:pointer; transition: background-color 0.2s; } #fotwButtonsRow button:hover:not([disabled]) { background:#0077ff; } #fotwSearchResults { background:#fff; color:#000; max-height:260px; overflow-y:auto; border-radius:6px; display:none; font-size:13px; margin-bottom:8px; } #fotwSearchResults div, .fotw-sub-content div { padding:8px 10px; border-bottom:1px solid #ddd; cursor:pointer; } #fotwSearchResults div:hover, .fotw-sub-content div:hover { background:#f0f0f0; } #fotwFlagInfo { background:#002266; border-radius:8px; padding:10px; font-size:13px; min-height:60px; line-height:1.4em; word-break:break-word; margin-bottom: 8px; } button[disabled] { opacity:0.6; cursor:not-allowed; } #fotwPreviewPanel { position: fixed; z-index: 2147483647; background: rgba(255, 255, 255, 0.95); border: 1px solid #ccc; box-shadow: 0 4px 12px rgba(0,0,0,0.4); padding: 8px; border-radius: 6px; pointer-events: none; max-width: 250px; text-align: center; color: #333; font-size: 12px; } #fotwPreviewPanel img { max-width: 100%; max-height: 150px; display: block; } .fotw-sub-panel { margin-top: 8px; background: #002266; border-radius: 8px; } .fotw-sub-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; font-weight: bold; user-select: none; } .fotw-sub-toggle { font-family: monospace; cursor: pointer; padding: 2px 6px; border-radius: 4px; background: #0055cc; } .fotw-sub-content { background:#fff; color:#000; max-height:200px; overflow-y:auto; border-radius: 0 0 6px 6px; font-size:13px; } #copyLinkBtn { cursor: pointer; margin-left: 8px; font-size: 16px; vertical-align: middle; } `); const panel = document.createElement('div'); panel.id = 'fotwPanel'; panel.innerHTML = ` <div id="fotwHeader">⚑ FOTW tool</div> <input id="fotwSearchInput" type="search" placeholder="Search flags..." disabled> <select id="fotwCategoryFilter" disabled> <option value="all">All Categories</option><option value="country">Countries</option><option value="historical">Historical</option><option value="regional">Regional/Subnational</option><option value="maritime">Maritime</option><option value="obscure">Obscure</option> </select> <div id="fotwButtonsRow"> <button id="btnRandom" title="Random from entire database" disabled>🎲 Random</button> <button id="btnRandomHistorical" title="Random historical flag" disabled>🏛 Historical</button> <button id="btnRandomObscure" title="Random obscure flag" disabled>🏴 Obscure</button> <button id="btnRandomFav" title="Random favorite" disabled>🎯 Random Fav</button> <button id="btnViewFavs" title="Show/Hide favorites" disabled>📂 View Favs</button> <button id="btnFavToggle" title="Add/Remove favorite" disabled>⭐ Fav</button> <button id="btnRebuild" title="Rebuild database" disabled>🔄 Rebuild DB</button> </div> <div id="fotwStatus" style="font-size:13px; min-height:18px; margin-bottom:6px; font-weight:bold;">Initializing...</div> <div id="fotwSearchResults"></div> <div id="fotwFlagInfo"></div> <div id="fotwInspectorPanel" class="fotw-sub-panel" style="display:none;"> <div class="fotw-sub-header"> <span id="fotwInspectorTitle">🔎 Flag Inspector (0)</span> <button id="fotwInspectorToggle" class="fotw-sub-toggle">[–]</button> </div> <div id="fotwInspectorContent" class="fotw-sub-content"></div> </div> <div id="fotwHistoryPanel" class="fotw-sub-panel" style="display:none;"> <div class="fotw-sub-header"> <span id="fotwHistoryTitle">🕒 Session History (0)</span> <button id="fotwHistoryToggle" class="fotw-sub-toggle">[–]</button> </div> <div id="fotwHistoryContent" class="fotw-sub-content"></div> </div> `; document.body.appendChild(panel); statusEl = document.getElementById('fotwStatus'); searchEl = document.getElementById('fotwSearchInput'); resultsEl = document.getElementById('fotwSearchResults'); infoEl = document.getElementById('fotwFlagInfo'); categoryFilterEl = document.getElementById('fotwCategoryFilter'); btnFavToggle = document.getElementById('btnFavToggle'); btnRebuild = document.getElementById('btnRebuild'); inspectorPanel = document.getElementById('fotwInspectorPanel'); inspectorTitle = document.getElementById('fotwInspectorTitle'); inspectorContent = document.getElementById('fotwInspectorContent'); historyPanel = document.getElementById('fotwHistoryPanel'); historyTitle = document.getElementById('fotwHistoryTitle'); historyContent = document.getElementById('fotwHistoryContent'); }
    function bindEventListeners() { searchEl.addEventListener('input', () => { clearTimeout(State.debounceTimer); State.debounceTimer = setTimeout(() => { State.isViewingFavorites = false; const term = searchEl.value?.trim(); if (!term) { renderList(resultsEl, []); resultsEl.style.display = 'none'; return; } const category = categoryFilterEl.value; let results = State.fuse.search(term, { limit: Config.SEARCH_RESULT_LIMIT }).map(r => r.item); if (category !== 'all') { results = results.filter(it => it.category === category); } renderList(resultsEl, results); resultsEl.style.display = 'block'; State.currentList = results; }, Config.DEBOUNCE_DELAY_MS); }); let previewPanel = null; document.getElementById('fotwPanel').addEventListener('mouseover', async (e) => { const resultDiv = e.target.closest('div[data-url]'); if (!resultDiv) return; if (!previewPanel) { previewPanel = document.createElement('div'); previewPanel.id = 'fotwPreviewPanel'; document.body.appendChild(previewPanel); } previewPanel.innerHTML = 'Loading...'; previewPanel.style.display = 'block'; const imageUrl = await getFlagImageUrl(resultDiv.dataset.url); if (previewPanel.style.display === 'none') return; previewPanel.innerHTML = imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="Flag preview">` : 'No preview'; }); document.getElementById('fotwPanel').addEventListener('mousemove', e => { if (previewPanel) { previewPanel.style.left = `${e.clientX + 20}px`; previewPanel.style.top = `${e.clientY + 20}px`; } }); document.getElementById('fotwPanel').addEventListener('mouseout', e => { if (previewPanel && e.target.closest('div[data-url]')) previewPanel.style.display = 'none'; }); document.getElementById('fotwPanel').addEventListener('click', e => { const div = e.target.closest('div[data-id]'); if (!div) return; const id = div.dataset.id; if (div.parentElement === resultsEl) { State.currentIndex = State.currentList.findIndex(it => it.id === id); goToItem(State.currentList[State.currentIndex]); } else { const item = State.masterList.find(it => it.id === id); if (item) goToItem(item); } }); categoryFilterEl.addEventListener('change', () => searchEl.dispatchEvent(new Event('input', { bubbles: true }))); const createRandomHandler = (category) => () => { const pool = category ? State.masterList.filter(it => it.category === category) : State.masterList; if (pool.length > 0) goToItem(pool[Math.floor(Math.random() * pool.length)]); }; document.getElementById('btnRandom').addEventListener('click', createRandomHandler()); document.getElementById('btnRandomHistorical').addEventListener('click', createRandomHandler('historical')); document.getElementById('btnRandomObscure').addEventListener('click', createRandomHandler('obscure')); document.getElementById('btnViewFavs').addEventListener('click', () => { if (State.isViewingFavorites) { resultsEl.style.display = 'none'; renderList(resultsEl, []); State.isViewingFavorites = false; return; } const favArray = State.masterList.filter(it => State.favorites.has(it.id)); if (!favArray.length) { alert('No favorites yet.'); return; } searchEl.value = ''; State.currentList = favArray; State.currentIndex = -1; renderList(resultsEl, favArray); resultsEl.style.display = 'block'; setStatus(`Showing ${favArray.length} favorite(s).`); State.isViewingFavorites = true; }); document.getElementById('btnRandomFav').addEventListener('click', () => { const favArray = State.masterList.filter(it => State.favorites.has(it.id)); if (!favArray.length) { alert('No favorites yet.'); return; } State.currentList = favArray; State.currentIndex = Math.floor(Math.random() * favArray.length); goToItem(favArray[State.currentIndex]); }); btnFavToggle.addEventListener('click', toggleFavorite); btnRebuild.addEventListener('click', () => { if (confirm('This will rebuild the flag database from the website.\nThis can take a minute but is recommended for the best categories.\nContinue?')) { rebuildMasterList(); } }); const createToggleHandler = (contentEl, key) => (e) => { const isMinimized = contentEl.style.display === 'none'; contentEl.style.display = isMinimized ? 'block' : 'none'; e.target.textContent = isMinimized ? '[–]' : '[+]'; localStorage.setItem(key, !isMinimized); }; document.getElementById('fotwInspectorToggle').addEventListener('click', createToggleHandler(inspectorContent, Config.INSPECTOR_STATE_KEY)); document.getElementById('fotwHistoryToggle').addEventListener('click', createToggleHandler(historyContent, Config.HISTORY_STATE_KEY)); }

    async function initializeApp() {
        setupPanel();
        toggleControls(false);
        try {
            const startTime = Date.now();
            while (typeof window.Fuse === 'undefined') { await sleep(50); if (Date.now() - startTime > 5000) throw new Error("Fuse.js failed to load"); }
            setStatus('Opening local DB...');
            State.db = await DbUtils.open();
            State.masterList = await DbUtils.getAll(State.db);
            if (State.masterList.length === 0) { setStatus('No local DB found. Starting build...'); await rebuildMasterList(); }
            setStatus(`Loaded ${State.masterList.length} flags. Initializing...`);
            State.fuse = new Fuse(State.masterList, { keys: ['name'], threshold: 0.3 });
            const isInspectorMinimized = localStorage.getItem(Config.INSPECTOR_STATE_KEY) === 'true'; if (isInspectorMinimized) { inspectorContent.style.display = 'none'; document.getElementById('fotwInspectorToggle').textContent = '[+]'; } const isHistoryMinimized = localStorage.getItem(Config.HISTORY_STATE_KEY) === 'true'; if (isHistoryMinimized) { historyContent.style.display = 'none'; document.getElementById('fotwHistoryToggle').textContent = '[+]'; }
            loadFavorites();
            loadHistory();
            const currentPageId = location.href.startsWith(Config.BASE_URL) ? location.href.slice(Config.BASE_URL.length) : null;
            State.currentItem = State.masterList.find(it => it.id === currentPageId) || null;
            const storedContext = sessionStorage.getItem(Config.SESSION_CONTEXT_KEY); let contextLoaded = false; if (storedContext) { try { const context = JSON.parse(storedContext); const idToItemMap = new Map(State.masterList.map(item => [item.id, item])); State.currentList = context.list.map(id => idToItemMap.get(id)).filter(Boolean); State.currentIndex = context.index; contextLoaded = true; } catch (e) { sessionStorage.removeItem(Config.SESSION_CONTEXT_KEY); } }
            if (contextLoaded) { setStatus(`Context restored from session.`); if (currentPageId) { const restoredIndex = State.currentList.findIndex(it => it.id === currentPageId); if (restoredIndex !== -1) State.currentIndex = restoredIndex; } } else if (State.currentItem) { setStatus(`No session context.`); State.currentList = State.masterList.filter(it => it.category === State.currentItem.category); State.currentIndex = State.currentList.findIndex(it => it.id === currentPageId); }
            toggleControls(true);
            updateCurrentItemDisplay();
            updateHistory();
            updateInspector();
            bindEventListeners();
        } catch (e) {
            setStatus(`Initialization Error: ${e.message}`);
            console.error("Fatal script error:", e);
            btnRebuild.disabled = false;
        }
    }

    initializeApp();
})();