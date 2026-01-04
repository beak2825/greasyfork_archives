// ==UserScript==
// @name         Letterboxd → FLAM (Fenlight) [MOBILE]
// @namespace    http://tampermonkey.net/
// @version      3.4.0-mobile
// @description  Mobile-friendly: Send Letterboxd lists & nanogenre pages to Kodi (Fenlight) via TMDB with smart matching. Touch-first UI: floating dock, full-screen overlays, large tap targets, momentum scrolling. All tools moved into Settings tabs.
// @match        https://letterboxd.com/*/list/*
// @match        https://letterboxd.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @connect      *
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/546512/Letterboxd%20%E2%86%92%20FLAM%20%28Fenlight%29%20%5BMOBILE%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/546512/Letterboxd%20%E2%86%92%20FLAM%20%28Fenlight%29%20%5BMOBILE%5D.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  // ─────────────────────────────────────────────────────────────────────────────
  // Mobile base CSS (safe-area, touch targets, overlays, momentum scrolling)
  // ─────────────────────────────────────────────────────────────────────────────
  GM_addStyle(`
    :root {
      --kb-z: 2147483647;
      --kb-gap: 10px;
      --kb-safe-right: env(safe-area-inset-right, 0px);
      --kb-safe-bottom: env(safe-area-inset-bottom, 0px);
      --kb-safe-top: env(safe-area-inset-top, 0px);
      --kb-radius: 12px;
      --kb-btn-h: 44px;
      --kb-red: #e50914;
      --kb-bg: #111;
      --kb-panel: #1c1c1c;
      --kb-border: #2a2a2a;
      --kb-text: #eee;
      --kb-sub: #bbb;
    }
    .kb-floating-dock {
      position: fixed;
      right: calc(16px + var(--kb-safe-right));
      bottom: calc(16px + var(--kb-safe-bottom));
      display: flex;
      flex-direction: column;
      gap: 8px;
      z-index: var(--kb-z);
    }
    .kb-btn {
      min-height: var(--kb-btn-h);
      padding: 10px 14px;
      font-size: 14px;
      line-height: 1;
      background: var(--kb-red);
      color: #fff;
      border: none;
      border-radius: 999px;
      box-shadow: 0 6px 18px rgba(0,0,0,.35);
      cursor: pointer;
      touch-action: manipulation;
    }
    .kb-btn[disabled] { opacity:.6 }
    .kb-btn--ghost { background:#444 }
    .kb-toast {
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      bottom: calc(80px + var(--kb-safe-bottom));
      background: #222;
      color: #fff;
      padding: 12px 14px;
      border-radius: var(--kb-radius);
      box-shadow: 0 6px 18px rgba(0,0,0,.35);
      z-index: var(--kb-z);
      font-size: 14px;
      max-width: min(92vw, 520px);
    }
    .kb-sideinfo {
      position: fixed;
      right: calc(16px + var(--kb-safe-right));
      bottom: calc(88px + var(--kb-safe-bottom));
      background: #1b1b1b;
      color:#eee;
      border: 1px solid #333;
      border-radius: var(--kb-radius);
      padding: 10px 12px;
      font-size: 13px;
      line-height: 1.45;
      z-index: var(--kb-z);
      box-shadow: 0 6px 18px rgba(0,0,0,.35);
      max-width: min(92vw, 360px);
      white-space: pre-wrap;
    }
    .kb-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,.7);
      z-index: var(--kb-z);
      display: flex; align-items: center; justify-content: center;
      padding: 16px;
    }
    .kb-panel {
      width: min(680px, 96vw);
      max-height: 92vh;
      background: #222;
      color: var(--kb-text);
      border-radius: var(--kb-radius);
      border: 1px solid var(--kb-border);
      display: flex; flex-direction: column;
      overflow: hidden;
    }
    .kb-panel__header, .kb-panel__footer {
      padding: 12px 14px;
      background: #1b1b1b;
      border-bottom: 1px solid var(--kb-border);
    }
    .kb-panel__footer { border-top: 1px solid var(--kb-border); border-bottom: none; }
    .kb-panel__title { margin: 0; font-size: 16px; }
    .kb-panel__body {
      padding: 12px 14px;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
    }
    .kb-input, .kb-select, .kb-textarea {
      width: 100%;
      background: #181818;
      color: #ddd;
      border: 1px solid #333;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .kb-textarea { min-height: 180px; white-space: pre-wrap; }
    .kb-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    @media (max-width: 640px) { .kb-row { grid-template-columns: 1fr; } }
    .kb-chip { display:inline-block; padding:6px 10px; border-radius:999px; font-size:12px; background:#2d2d2d; color:#eee; }
    .kb-sep { border:0; border-top:1px solid #333; margin: 14px 0; }
    .kb-badge { display:inline-block; padding:2px 6px; border-radius:6px; font-size:11px; color:#fff; background:#e50914 }
    .kb-badge--alt { background:#2d7dff }
    .kb-grid { display:flex; gap:10px; overflow-x:auto; padding-bottom:6px; -webkit-overflow-scrolling:touch; }
    .kb-card {
      width: 140px; flex: 0 0 auto; background:#1a1a1a; border:1px solid #333;
      border-radius: 8px; overflow:hidden; position:relative;
    }
    .kb-card img { width:100%; height:210px; object-fit:cover; background:#222 }
    .kb-card__cap { padding:8px; font-size:12px }
    .kb-actions { display:flex; gap:8px; flex-wrap: wrap; }
    .kb-actions .kb-btn { min-height: 40px; padding: 8px 12px; font-size: 13px; }
    .kb-tabs { display:flex; gap:6px; }
    .kb-tabbtn { background:#444; color:#fff; border:none; border-radius:8px; padding:8px 12px; }
    .kb-tabbtn--active { background: var(--kb-red); }
    .kb-sticky-bottom {
      position: sticky; bottom: 0; background:#1b1b1b;
      padding: 10px 12px; border-top:1px solid var(--kb-border);
    }
  `);

  // ─── Config (unchanged logic) ───────────────────────────────────────────
  const TMDB_API_KEY = 'f090bb54758cabf231fb605d3e3e0468';
  const DEFAULT_BATCH_SIZE = 5;
  const DEFAULT_PAUSE_MS = 150;
  const DEFAULT_FINALRETRY_DELAY = 300;
  const DEFAULT_FINALRETRY_MIN_LIST_SIZE = 400;

  const LBD_MAX_RETRIES = 3;
  const LBD_BACKOFF_BASE = 200;
  const TMDB_MAX_RETRIES = 3;
  const TMDB_BACKOFF_BASE = 200;

  const CACHE_KEY = 'lbd_tmdb_cache_overrides';
  const CACHE_BACKUP_KEY = 'lbd_tmdb_cache_backup';

  const DEFAULT_DESCRIPTION = '';
  const RUNTIME_TOL_MIN = 3;

  const POSTER_ENABLE_DEFAULT = true;
  const POSTER_STRATEGY_DEFAULT = 'first_4';
  const FANART_ENABLE_DEFAULT = true;
  const FANART_STRATEGY_DEFAULT = 'first_4';

  const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/';
  const TMDB_POSTER_SIZE = 'w185';
  const BASE_BIN_URL_DEFAULT = 'https://raw.githubusercontent.com/hcgiub001/letterboxd-tmdb-cache/main/lbd_tmdb_pairs_u32.bin';
  const DEFAULT_MEDIA_TYPE_DEFAULT = 'm';

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  let SMART_LOG = [];
  function smartLogEnabled() { return GM_getValue('smartLogEnable', true); }
  function GM_GetOrSet(key, def) { const v = GM_getValue(key); return (typeof v === 'undefined') ? def : v; }

  // ─── Helpers (unchanged) ────────────────────────────────────────────────
  const normalizeText = (s) => (s || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  function stripDiacritics(s) { return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function normalizeTitle(s) { return stripDiacritics(s).toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim(); }
  function normalizeName(s) { return stripDiacritics(s).toLowerCase().replace(/\s+/g, ' ').trim(); }
  function htmlToTextWithBreaks(html) {
    if (!html) return '';
    let t = html;
    t = t.replace(/<br\s*\/?>/gi, '\n');
    t = t.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
    t = t.replace(/<\/?p[^>]*>/gi, '');
    t = t.replace(/<li[^>]*>\s*/gi, '• ');
    t = t.replace(/<\/li>\s*/gi, '\n');
    t = t.replace(/<\/?ul[^>]*>/gi, '');
    t = t.replace(/<\/?ol[^>]*>/gi, '');
    t = t.replace(/<[^>]+>/g, '');
    const ta = document.createElement('textarea');
    ta.innerHTML = t.replace(/&nbsp;/gi, '\u00A0');
    t = ta.value;
    t = t.replace(/\u00A0/g, ' ');
    t = t.replace(/\r\n/g, '\n').replace(/^\s+/, '').replace(/\s+$/, '');
    return t;
  }
  function getListNameFromPage() {
    const h1Preferred = document.querySelector('h1.title-1.prettify');
    const prefer = normalizeText(h1Preferred?.textContent);
    if (prefer) return prefer;
    const h1Alt = document.querySelector('h1.headline-1') || document.querySelector('h1');
    return normalizeText(h1Alt?.textContent) || 'Letterboxd List';
  }
  function getListDescriptionFromPage() {
    const div = document.querySelector('div.body-text.-prose.-hero.clear.js-collapsible-text');
    if (!div) return '';
    return htmlToTextWithBreaks(div.innerHTML);
  }
  function sanitizeDescPreservingBreaks(s) {
    if (!s) return '';
    return s.replace(/\u00A0/g, ' ')
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, '  ')
      .trim();
  }
  function getListAuthorFromPage() {
    const span = document.querySelector('span[itemprop="name"]');
    return normalizeText(span?.textContent) || '';
  }
  function isListPage() { return /\/list\//.test(location.pathname); }
  function isNanogenreLike() {
    return !!document.querySelector('section.genre-group ul.poster-list li[data-film-id], section.-themes ul.poster-list li[data-film-id], main ul.poster-list li[data-film-id][data-film-slug]');
  }

  // ─── IndexedDB (unchanged) ──────────────────────────────────────────────
  function openDB() {
    return new Promise((resolve, reject) => {
      const rq = indexedDB.open('FenlightCacheDB', 2);
      rq.onupgradeneeded = () => {
        const db = rq.result;
        if (!db.objectStoreNames.contains('tmdbCache')) db.createObjectStore('tmdbCache');
        if (!db.objectStoreNames.contains('tmdbBase')) db.createObjectStore('tmdbBase');
      };
      rq.onsuccess = () => resolve(rq.result);
      rq.onerror = () => reject(rq.error);
    });
  }
  async function getCache(key = CACHE_KEY) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction('tmdbCache', 'readonly');
      const rq = tx.objectStore('tmdbCache').get(key);
      rq.onsuccess = () => res(rq.result || {});
      rq.onerror = () => rej(rq.error);
    });
  }
  async function setCache(obj, key = CACHE_KEY) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction('tmdbCache', 'readwrite');
      const rq = tx.objectStore('tmdbCache').put(obj, key);
      rq.onsuccess = () => res();
      rq.onerror = () => rej(rq.error);
    });
  }
  async function clearCache() {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction('tmdbCache', 'readwrite');
      const rq = tx.objectStore('tmdbCache').delete(CACHE_KEY);
      rq.onsuccess = () => res();
      rq.onerror = () => rej(rq.error);
    });
  }
  async function getBaseFromIDB() {
    const db = await openDB();
    const tx = db.transaction('tmdbBase', 'readonly');
    const store = tx.objectStore('tmdbBase');
    const bufP = new Promise((res, rej) => { const r = store.get('base_bin'); r.onsuccess = () => res(r.result || null); r.onerror = () => rej(r.error); });
    const etgP = new Promise((res, rej) => { const r = store.get('base_etag'); r.onsuccess = () => res(r.result || ''); r.onerror = () => rej(r.error); });
    const [buf, etag] = await Promise.all([bufP, etgP]);
    return { buf, etag };
  }
  async function putBaseToIDB(buf, etag) {
    const db = await openDB();
    const tx = db.transaction('tmdbBase', 'readwrite');
    await Promise.all([
      new Promise((res, rej) => { const r = tx.objectStore('tmdbBase').put(buf, 'base_bin'); r.onsuccess = res; r.onerror = () => rej(r.error); }),
      new Promise((res, rej) => { const r = tx.objectStore('tmdbBase').put(etag || '', 'base_etag'); r.onsuccess = res; r.onerror = () => rej(r.error); }),
    ]);
  }

  // ─── Binary base cache loader (unchanged) ───────────────────────────────
  function baseBinUrl() { return GM_GetOrSet('baseBinUrl', BASE_BIN_URL_DEFAULT); }
  let BASE_PAIRS_U32 = null;  let BASE_COUNT = 0;

  async function loadBaseBinOnce({ allowRevalidate = true } = {}) {
    if (!BASE_PAIRS_U32) {
      const { buf } = await getBaseFromIDB();
      if (buf && buf.byteLength) {
        const u32 = new Uint32Array(buf);
        if (u32.length % 2 === 0) { BASE_PAIRS_U32 = u32; BASE_COUNT = u32.length >>> 1; }
      }
    }
    if (!allowRevalidate) return;
    const { etag } = await getBaseFromIDB();
    await new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: baseBinUrl(),
        headers: etag ? { 'If-None-Match': etag } : {},
        responseType: 'arraybuffer',
        onload: async (res) => {
          try {
            if (res.status === 304 && BASE_PAIRS_U32) { resolve(); return; }
            if (res.status >= 200 && res.status < 300 && res.response) {
              const newBuf = res.response;
              const u32 = new Uint32Array(newBuf);
              if (u32.length % 2 === 0) {
                BASE_PAIRS_U32 = u32; BASE_COUNT = u32.length >>> 1;
                const m = String(res.responseHeaders || '').match(/etag:\s*(.+)/i);
                const newEtag = m ? m[1].trim() : '';
                try { await putBaseToIDB(newBuf, newEtag); } catch {}
              }
            }
          } finally { resolve(); }
        },
        onerror: () => resolve(),
        ontimeout: () => resolve(),
      });
    });
  }
  async function refreshBaseBinNow() {
    await new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: baseBinUrl(),
        responseType: 'arraybuffer',
        onload: async (res) => {
          try {
            if (res.status >= 200 && res.status < 300 && res.response) {
              const newBuf = res.response;
              const u32 = new Uint32Array(newBuf);
              if (u32.length % 2 === 0) {
                BASE_PAIRS_U32 = u32; BASE_COUNT = u32.length >>> 1;
                const m = String(res.responseHeaders || '').match(/etag:\s*(.+)/i);
                const newEtag = m ? m[1].trim() : '';
                try { await putBaseToIDB(newBuf, newEtag); } catch {}
                alert('✅ Base cache refreshed.');
              } else { alert('❌ Base cache corrupt (odd length).'); }
            } else { alert(`❌ Base cache HTTP ${res.status}.`); }
          } finally { resolve(); }
        },
        onerror: () => { alert('❌ Base cache network error.'); resolve(); },
        ontimeout: () => { alert('❌ Base cache request timed out.'); resolve(); },
      });
    });
  }

  // ─── Packed helpers & two-tier access (unchanged) ───────────────────────
  function baseLookupPacked(idNum) {
    if (!BASE_PAIRS_U32) return undefined;
    let lo = 0, hi = BASE_COUNT - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1;
      const k = BASE_PAIRS_U32[mid << 1];
      if (k === idNum) return BASE_PAIRS_U32[(mid << 1) + 1];
      if (k < idNum) lo = mid + 1; else hi = mid - 1;
    }
    return undefined;
  }
  function unpack(packed) { return { isTv: (packed & 1) === 1, tmdbId: packed >>> 1 }; }
  let LOCAL_OVERRIDES = null;
  async function loadLocalOverridesOnce() { if (!LOCAL_OVERRIDES) LOCAL_OVERRIDES = await getCache(CACHE_KEY); }
  function overrideGetPacked(filmIdStr) {
    const v = LOCAL_OVERRIDES ? LOCAL_OVERRIDES[filmIdStr] : undefined;
    return Number.isFinite(v) ? v : undefined;
  }
  function overrideSetPacked(filmIdStr, tmdbId, isTv) {
    if (!LOCAL_OVERRIDES) LOCAL_OVERRIDES = {};
    LOCAL_OVERRIDES[filmIdStr] = (tmdbId << 1) | (isTv ? 1 : 0);
  }
  async function persistOverrides() { if (LOCAL_OVERRIDES) await setCache(LOCAL_OVERRIDES, CACHE_KEY); }
  function getFromAnyCachePacked(filmIdStr) {
    const vLocal = overrideGetPacked(filmIdStr);
    if (vLocal !== undefined) return vLocal;
    const idNum = Number(filmIdStr);
    if (Number.isFinite(idNum)) return baseLookupPacked(idNum);
    return undefined;
  }

  // ─── Kodi sender (unchanged) ────────────────────────────────────────────
  function sendToKodi(url) {
    const ip = GM_getValue('kodiIp', '').trim();
    const port = GM_getValue('kodiPort', '').trim();
    const user = GM_getValue('kodiUser', '');
    const pass = GM_getValue('kodiPass', '');
    return new Promise((resolve) => {
      if (!ip || !port) { alert('⚠️ Please configure Kodi IP & port in settings.'); resolve(false); return; }
      GM_xmlhttpRequest({
        method: 'POST',
        url: `http://${ip}:${port}/jsonrpc`,
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Basic ' + btoa(`${user}:${pass}`) },
        data: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'Player.Open', params: { item: { file: url } } }),
        timeout: 15000,
        onload: (res) => { if (res.status >= 200 && res.status < 300) resolve(true); else { alert(`❌ Kodi responded with status ${res.status}.`); resolve(false); } },
        onerror: () => { alert('❌ Failed to contact Kodi.'); resolve(false); },
        ontimeout: () => { alert('❌ Kodi request timed out.'); resolve(false); }
      });
    });
  }

  // ─── Mobile UI helpers ──────────────────────────────────────────────────
  function mkEl(tag, props = {}, styles = {}) {
    const el = document.createElement(tag);
    Object.assign(el, props);
    Object.assign(el.style, styles);
    return el;
  }
  function showToast(message, onClick) {
    const t = mkEl('div', { className: 'kb-toast', textContent: message });
    if (onClick) { t.style.cursor = 'pointer'; t.addEventListener('click', () => { onClick(); t.remove(); }); }
    document.body.append(t);
    setTimeout(() => { t.remove(); }, 5000);
  }
  function showSideInfoNearButton(_btn, lines, ms = 5000) {
    try { const prev = document.getElementById('kb-sideinfo'); if (prev) prev.remove(); } catch {}
    const box = mkEl('div', { id: 'kb-sideinfo', className: 'kb-sideinfo' });
    box.textContent = lines.join('\n');
    document.body.append(box);
    setTimeout(() => { try { box.remove(); } catch {} }, ms);
  }
  function overlayPanel({ title = '', content, footerButtons = [] }) {
    const overlay = mkEl('div', { className: 'kb-overlay' });
    const panel = mkEl('div', { className: 'kb-panel' });
    const header = mkEl('div', { className: 'kb-panel__header' });
    const h = mkEl('h2', { className: 'kb-panel__title' });
    h.textContent = title;
    const body = mkEl('div', { className: 'kb-panel__body' });
    const footer = mkEl('div', { className: 'kb-sticky-bottom' });
    header.append(h);
    if (content) body.append(content);
    const actions = mkEl('div', { className: 'kb-actions' });
    footerButtons.forEach(btn => actions.append(btn));
    footer.append(actions);
    panel.append(header, body, footer);
    overlay.append(panel);
    document.body.append(overlay);
    return { overlay, panel, body, header, footer };
  }

  // ─── Description editor (unchanged logic; mobile layout) ────────────────
  function editDescriptionOverlay(defaultDesc) {
    return new Promise(resolve => {
      const ta = mkEl('textarea', { id: 'kodieditdesc_text', className: 'kb-textarea' });
      ta.value = defaultDesc || '';
      const saveBtn = mkEl('button', { className: 'kb-btn', textContent: 'Save' });
      const cancelBtn = mkEl('button', { className: 'kb-btn kb-btn--ghost', textContent: 'Cancel' });
      const { overlay, body, footer } = overlayPanel({
        title: 'Edit Description',
        content: ta,
        footerButtons: [saveBtn, cancelBtn]
      });
      saveBtn.onclick = () => { const val = ta.value; overlay.remove(); resolve(val); };
      cancelBtn.onclick = () => { overlay.remove(); resolve(null); };
    });
  }

  // ─── Smart Log (overlay version) ────────────────────────────────────────
  function reasonsToText(entry) {
    const r = entry.reasons || [];
    const parts = [];
    const has = (k) => r.includes(k);
    if (has('manual_override')) parts.push('You manually selected a different TMDb title.');
    else if (has('exact_title_year') && has('director_match')) parts.push('Exact title + year matched multiple; used matching director.');
    else if (has('exact_title_year') && has('runtime_match')) parts.push(`Exact title + year matched multiple; used runtime (±${RUNTIME_TOL_MIN}m).`);
    else if (has('exact_title_year') && has('fallback_tmdb_top')) parts.push('Multiple exact title + year; fell back to TMDb top.');
    else if (has('exact_title_year')) parts.push('Chose an exact title + year match.');
    else if (has('exact_title_only') && has('director_match')) parts.push('Title matched; used director to break ties.');
    else if (has('exact_title_only') && has('runtime_match')) parts.push(`Title matched; used runtime (±${RUNTIME_TOL_MIN}m).`);
    else if (has('exact_title_only') && has('fallback_tmdb_top')) parts.push('Multiple exact title; fell back to TMDb top.');
    else if (has('no_results')) parts.push('TMDb search returned no results.');
    else parts.push('Chosen over TMDb top based on heuristics.');
    if (entry.matchedDirectors?.length) parts.push(`Matched director(s): ${entry.matchedDirectors.join(', ')}.`);
    if (typeof entry.runtimeUsed === 'number' && typeof entry.lbRuntime === 'number') parts.push(`LB runtime ${entry.lbRuntime}m used.`);
    if (typeof entry.candidates === 'number') parts.push(`${entry.candidates} candidate(s).`);
    if (has('final_retry')) parts.push('Final retry pass.');
    return parts.join(' ');
  }
  function openSmartLogOverlay() {
    if (!SMART_LOG.length) { alert(smartLogEnabled() ? 'No changes logged yet.' : 'Enable logging in settings.'); return; }
    const pre = mkEl('pre', {}, { whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0, fontSize: '12px' });
    const listName = getListNameFromPage();
    const autoChanges = SMART_LOG.filter(e => !e.reasons.includes('manual_override')).length;
    const manualChanges = SMART_LOG.filter(e => e.reasons.includes('manual_override')).length;
    const byReason = {};
    SMART_LOG.forEach(e => e.reasons.forEach(r => byReason[r] = (byReason[r] || 0) + 1));
    const header = [
      `Smart-Match Log — ${new Date().toLocaleString()}`,
      `List: ${listName}`,
      `Auto changes: ${autoChanges}  •  Manual overrides: ${manualChanges}`,
      `Reasons: ${Object.keys(byReason).map(k => `${k}:${byReason[k]}`).join('  ') || '—'}`,
      ''
    ].join('\n');
    const lines = [header];
    SMART_LOG
      .slice()
      .sort((a, b) => (a.listIndex || 999999) - (b.listIndex || 999999))
      .forEach(e => {
        lines.push(`#${e.listIndex || '?'}  film:${e.filmId}  ${e.lbTitle} (${e.lbYear})`);
        const topLine = e.top ? `  TMDb top:   ${e.top.title} (${e.top.release_date || 'n/a'}) [${e.top.id}]` : '  TMDb top:   n/a';
        const chLine = e.chosen ? `  Our choice: ${e.chosen.title} (${e.chosen.release_date || 'n/a'}) [${e.chosen.id}]` : '  Our choice: n/a';
        lines.push(topLine, chLine, `  Reasoning:  ${reasonsToText(e)}`);
        if (e.matchedDirectors?.length) lines.push(`  Match dir:  ${e.matchedDirectors.join(', ')}`);
        if (typeof e.runtimeUsed === 'number') lines.push(`  Runtime tol: ±${RUNTIME_TOL_MIN} min (LB ${e.lbRuntime}m)`);
        if (typeof e.candidates === 'number') lines.push(`  Candidates: ${e.candidates}`);
        lines.push('');
      });
    pre.textContent = lines.join('\n');
    const closeBtn = mkEl('button', { className: 'kb-btn kb-btn--ghost', textContent: 'Close' });
    const { overlay } = overlayPanel({ title: 'Smart-Match Log', content: pre, footerButtons: [closeBtn] });
    closeBtn.onclick = () => overlay.remove();
  }
  function updateSmartLogButtonState() {
    const btn = document.getElementById('btnSmartLog');
    const enabled = smartLogEnabled();
    if (btn) {
      btn.disabled = !enabled || SMART_LOG.length === 0;
      btn.title = enabled ? (SMART_LOG.length ? 'Open Smart-Match Log' : 'No changes logged yet') : 'Enable logging in settings';
    }
  }

  // ─── Review Panel (overlay + promise) ───────────────────────────────────
  async function openReviewPanelPromise() {
    const changed = SMART_LOG.filter(e => !e.reasons.includes('no_results'));
    if (!changed.length) { alert('No changed picks to review.'); return { action: 'close' }; }

    return new Promise(async (resolve) => {
      let resolved = false; const safeResolve = (p) => { if (!resolved) { resolved = true; resolve(p); } };

      const wrap = mkEl('div');
      const summary = mkEl('div', {}, { fontSize: '13px', color: '#bbb', marginBottom: '10px' });
      summary.textContent = 'Loading candidates…';
      wrap.append(summary);

      const listWrap = mkEl('div');
      wrap.append(listWrap);

      const saveSend = mkEl('button', { className: 'kb-btn', textContent: 'Save & Send' });
      const saveClose = mkEl('button', { className: 'kb-btn kb-btn--ghost', textContent: 'Save & Close' });
      const saveOnly = mkEl('button', { className: 'kb-btn kb-btn--ghost', textContent: 'Save' });
      const close = mkEl('button', { className: 'kb-btn kb-btn--ghost', textContent: 'Close' });

      const { overlay, body } = overlayPanel({
        title: 'Review Changes',
        content: wrap,
        footerButtons: [saveSend, saveClose, saveOnly, close]
      });

      overlay.addEventListener('keydown', (e) => { if (e.key === 'Escape') { overlay.remove(); safeResolve({ action: 'close' }); } });

      // Fetch candidates
      const candidateMap = {};
      try {
        await Promise.all(changed.map(async e => {
          const results = await searchTmdb(e.lbTitle, e.lbYear);
          const ensureIds = new Set([e.top?.id, e.chosen?.id].filter(Boolean));
          const byId = new Map(results.map(r => [r.id, r]));
          ensureIds.forEach(id => { if (id && !byId.has(id)) byId.set(id, { id, title: '(from earlier result)', release_date: '', poster_path: null }); });
          candidateMap[e.filmId] = Array.from(byId.values()).slice(0, 20);
        }));
        summary.textContent = `Items with changes: ${changed.length}`;
      } catch (err) {
        summary.textContent = `Error loading candidates: ${String(err)}`;
      }

      function posterUrl(p) { return p ? `${TMDB_IMG_BASE}${TMDB_POSTER_SIZE}${p}` : ''; }

      changed
        .slice()
        .sort((a, b) => (a.listIndex || 999999) - (b.listIndex || 999999))
        .forEach(e => {
          const entry = mkEl('div', {}, { background:'#141414', border:'1px solid #2a2a2a', borderRadius:'8px', marginBottom:'12px', padding:'10px' });

          const meta = mkEl('div');
          const titleRow = mkEl('div', {}, { fontWeight:'600', display:'flex', alignItems:'center', gap:'8px', marginBottom:'4px' });
          const pos = mkEl('span', {}, { fontSize:'18px', color:'#ff3b3b', fontWeight:'800' });
          pos.textContent = `#${e.listIndex || '?'}`;
          const ttl = mkEl('span'); ttl.textContent = ` ${e.lbTitle} (${e.lbYear})`;
          titleRow.append(pos, ttl);
          const meta1 = mkEl('div', {}, { color:'#bbb', fontSize:'12px' }); meta1.textContent = `film:${e.filmId}`;
          const meta2 = mkEl('div', {}, { color:'#bbb', fontSize:'12px' }); meta2.textContent = `Directors: ${(e.lbDirectors || []).join(', ') || '—'}`;
          const meta3 = mkEl('div', {}, { color:'#bbb', fontSize:'12px' }); meta3.textContent = `TMDb top: ${e.top ? `${e.top.title} (${e.top.release_date || 'n/a'}) [${e.top.id}]` : 'n/a'}`;
          const meta4 = mkEl('div', {}, { color:'#bbb', fontSize:'12px' }); meta4.textContent = `Our choice: ${e.chosen ? `${e.chosen.title} (${e.chosen.release_date || 'n/a'}) [${e.chosen.id}]` : 'n/a'}`;
          const reason = mkEl('div', {}, { fontSize:'12px', marginTop:'6px' }); reason.textContent = reasonsToText(e);
          meta.append(titleRow, meta1, meta2, meta3, meta4, reason);

          const grid = mkEl('div', { className: 'kb-grid' }, { marginTop:'8px' });
          const candidates = candidateMap[e.filmId] || [];
          const currentChosenId = e.chosen?.id || e.top?.id || null;

          if (candidates.length) {
            candidates.forEach(c => {
              const card = mkEl('label', { className:'kb-card' });
              const img = mkEl('img'); img.src = posterUrl(c.poster_path);
              const cap = mkEl('div', { className:'kb-card__cap' });
              const tt = mkEl('div', {}, { fontWeight: '600' }); tt.textContent = c.title || '(no title)';
              const sub = mkEl('div', {}, { fontSize:'11px', color:'#bbb' }); sub.textContent = `${(c.release_date || 'n/a')} [${c.id}]`;
              const choose = mkEl('div', {}, { marginTop:'6px', display:'flex', alignItems:'center', gap:'6px' });
              const radio = mkEl('input'); radio.type='radio'; radio.name = `sel-${e.filmId}`; radio.value = String(c.id); radio.checked = c.id === currentChosenId;
              choose.append(radio, mkEl('span', { textContent: 'Select' }));
              cap.append(tt, sub, choose);
              if (c.id === e.top?.id) {
                const b = mkEl('div', { className:'kb-badge kb-badge--alt' }, { position:'absolute', top:'6px', left:'6px' }); b.textContent='TMDb top'; card.append(b);
              }
              if (c.id === currentChosenId) {
                const b = mkEl('div', { className:'kb-badge' }, { position:'absolute', top:'6px', right:'6px' }); b.textContent='Chosen'; card.append(b);
              }
              card.append(img, cap);
              grid.append(card);
            });
          } else {
            const card = mkEl('div', { className:'kb-card' });
            const cap = mkEl('div', { className:'kb-card__cap' });
            const tt = mkEl('div', {}, { fontWeight:'600' }); tt.textContent = 'No TMDb results';
            const sub = mkEl('div', {}, { fontSize:'11px', color:'#bbb', margin:'6px 0' }); sub.textContent = 'Enter TMDb ID:';
            const input = mkEl('input', { name: `manual-${e.filmId}`, className:'kb-input' });
            cap.append(tt, sub, input); card.append(cap); grid.append(card);
          }

          entry.append(meta, grid);
          listWrap.append(entry);
        });

      async function applySavesToCache(doc) {
        await loadLocalOverridesOnce();
        let changesApplied = 0;
        for (const e of changed) {
          const radios = doc.querySelectorAll(`input[name="sel-${e.filmId}"]`);
          let selectedId = null;
          radios.forEach(r => { if (r.checked) selectedId = parseInt(r.value, 10); });
          if (!selectedId) {
            const manual = doc.querySelector(`input[name="manual-${e.filmId}"]`);
            if (manual && manual.value.trim()) {
              const idNum = parseInt(manual.value.trim(), 10);
              if (Number.isFinite(idNum)) selectedId = idNum;
            }
          }
          if (!selectedId) continue;

          const beforePacked = overrideGetPacked(e.filmId);
          const beforeId = Number.isFinite(beforePacked) ? (beforePacked >>> 1) : (e.chosen?.id || e.top?.id || null);
          if (beforeId !== selectedId) {
            overrideSetPacked(e.filmId, selectedId, /*isTv=*/false);
            changesApplied++;
            const top = e.top ? { ...e.top } : null;
            const newChosen = { id: selectedId, title: '(manual)', release_date: '' };
            SMART_LOG.push({
              filmId: e.filmId,
              listIndex: e.listIndex || 0,
              lbTitle: e.lbTitle,
              lbYear: e.lbYear,
              lbDirectors: e.lbDirectors,
              lbRuntime: e.lbRuntime,
              top,
              chosen: newChosen,
              reasons: ['manual_override'],
              candidates: null,
              matchedDirectors: [],
              runtimeUsed: null,
              timestamp: Date.now()
            });
          }
        }
        if (changesApplied > 0) await persistOverrides();
        return changesApplied;
      }

      close.onclick = () => { overlay.remove(); safeResolve({ action: 'close' }); };
      saveOnly.onclick = async () => {
        try {
          const n = await applySavesToCache(overlay);
          summary.textContent = n ? `Saved ${n} override(s).` : 'No changes to save.';
          updateSmartLogButtonState();
        } catch (err) { summary.textContent = 'Save error: ' + String(err); }
      };
      saveClose.onclick = async () => {
        try {
          const n = await applySavesToCache(overlay);
          summary.textContent = n ? `Saved ${n} override(s).` : 'No changes to save.';
          overlay.remove(); safeResolve({ action: 'save-close' });
          updateSmartLogButtonState();
        } catch (err) { summary.textContent = 'Save error: ' + String(err); }
      };
      saveSend.onclick = async () => {
        try {
          const n = await applySavesToCache(overlay);
          summary.textContent = (n ? `Saved ${n} override(s). ` : '') + 'Sending…';
          overlay.remove(); safeResolve({ action: 'save-send' });
          updateSmartLogButtonState();
        } catch (err) { summary.textContent = 'Save error: ' + String(err); }
      };
    });
  }

  // ─── Cache Editor (overlay) ─────────────────────────────────────────────
  async function openCacheEditor() {
    await loadLocalOverridesOnce();
    const currentPacked = LOCAL_OVERRIDES || {};
    const backupPacked = await getCache(CACHE_BACKUP_KEY);

    const toFriendly = (packedMap) => {
      const obj = {};
      for (const [k, v] of Object.entries(packedMap || {})) {
        if (!Number.isFinite(v)) continue;
        const { tmdbId, isTv } = unpack(v);
        obj[k] = { tmdbId, type: isTv ? 'tv' : 'm' };
      }
      return obj;
    };
    const fromFriendly = (friendly) => {
      const packed = {};
      for (const [k, v] of Object.entries(friendly || {})) {
        const id = Number(k);
        if (!Number.isFinite(id)) continue;
        const tmdbId = Number(v?.tmdbId);
        if (!Number.isFinite(tmdbId)) continue;
        const type = String(v?.type || 'm').toLowerCase();
        const isTv = (type === 'tv');
        packed[k] = (tmdbId << 1) | (isTv ? 1 : 0);
      }
      return packed;
    };

    const current = toFriendly(currentPacked);
    const backup = toFriendly(backupPacked);

    const stats = (cur, bak) => {
      const curKeys = Object.keys(cur || {}).length;
      const bakKeys = Object.keys(bak || {}).length;
      let added = 0;
      if (bak && cur) {
        const bset = new Set(Object.keys(bak));
        added = Object.keys(cur).filter(k => !bset.has(k)).length;
      }
      return `Current: ${curKeys} • Backup: ${bakKeys} • Added since backup: ${added}`;
    };

    const area = mkEl('textarea', { className: 'kb-textarea' });
    area.value = JSON.stringify(current, null, 2);

    const msg = mkEl('div', {}, { color:'#bbb', fontSize:'12px', marginTop:'8px' });
    const stat = mkEl('div', {}, { color:'#bbb', fontSize:'12px', marginBottom:'8px' });
    stat.textContent = stats(current, backup);

    const actions = mkEl('div', { className:'kb-actions' });
    const validateBtn = mkEl('button', { className:'kb-btn kb-btn--ghost', textContent:'Validate' });
    const revertBtn = mkEl('button', { className:'kb-btn', textContent:'Revert Additions' });
    const saveBtn = mkEl('button', { className:'kb-btn', textContent:'Save' });
    const closeBtn = mkEl('button', { className:'kb-btn kb-btn--ghost', textContent:'Close' });

    const container = mkEl('div');
    container.append(stat, area, actions, msg);
    actions.append(validateBtn, revertBtn, saveBtn, closeBtn);

    const { overlay } = overlayPanel({ title: 'Edit Overrides', content: container, footerButtons: [] });
    closeBtn.onclick = () => overlay.remove();

    const parseArea = () => {
      try {
        const obj = JSON.parse(area.value);
        if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) { msg.textContent = 'JSON must be an object mapping filmId → { tmdbId, type }.'; return null; }
        return obj;
      } catch (e) { msg.textContent = 'Invalid JSON: ' + e.message; return null; }
    };
    const validateShape = (obj) => {
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v !== 'object' || v === null) { msg.textContent = `Value for key ${k} must be { tmdbId, type }`; return false; }
        const tmdbId = Number(v.tmdbId); if (!Number.isFinite(tmdbId)) { msg.textContent = `tmdbId for ${k} must be a number`; return false; }
        const type = String(v.type || 'm').toLowerCase(); if (!(type === 'm' || type === 'tv')) { msg.textContent = `type for ${k} must be "m" or "tv"`; return false; }
      }
      return true;
    };

    validateBtn.onclick = () => {
      const obj = parseArea(); if (!obj) return;
      if (!validateShape(obj)) return;
      msg.textContent = 'Looks good ✔';
    };

    revertBtn.onclick = () => {
      const cur = parseArea(); if (!cur) return;
      const bak = backup || {};
      const bakSet = new Set(Object.keys(bak));
      let removed = 0;
      for (const k of Object.keys(cur)) { if (!bakSet.has(k)) { delete cur[k]; removed++; } }
      area.value = JSON.stringify(cur, null, 2);
      stat.textContent = stats(cur, bak);
      msg.textContent = removed ? `Removed ${removed} new key(s) added since last build.` : 'No new keys to remove.';
    };

    saveBtn.onclick = async () => {
      const obj = parseArea(); if (!obj) return;
      if (!validateShape(obj)) return;
      try {
        const packed = fromFriendly(obj);
        await setCache(packed, CACHE_KEY);
        LOCAL_OVERRIDES = packed;
        stat.textContent = stats(obj, backup || {});
        msg.textContent = 'Saved ✔';
      } catch (e) { msg.textContent = 'Save failed: ' + e.message; }
    };
  }

  // ─── TMDb helpers (unchanged) ───────────────────────────────────────────
  async function fetchLbdMetadata(item) {
    if (!item?.detailsEndpoint || item.title) return;
    for (let i = 0; i < LBD_MAX_RETRIES; i++) {
      try {
        const r = await fetch(item.detailsEndpoint, { credentials: 'include' });
        if (r.ok) {
          const j = await r.json();
          item.title = j.name || '';
          item.year = j.releaseYear || '';
          item.originalName = j.originalName || '';
          item.runtime = (typeof j.runTime === 'number') ? j.runTime : null;
          item.directors = Array.isArray(j.directors) ? j.directors.map(d => d.name).filter(Boolean) : [];
          return;
        }
        if (r.status === 429) await sleep(LBD_BACKOFF_BASE * (i + 1)); else return;
      } catch { await sleep(LBD_BACKOFF_BASE * (i + 1)); }
    }
  }
  async function fetchTmdbSearchResults(item) {
    if (!item?.title) { item.matches = []; return; }
    const url = `https://api.themoviedb.org/3/search/movie?` + new URLSearchParams({ api_key: TMDB_API_KEY, query: item.title, year: item.year });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) { const d = await r.json(); item.matches = Array.isArray(d.results) ? d.results : []; return; }
        if (r.status === 429) await sleep(TMDB_BACKOFF_BASE * (i + 1)); else { item.matches = []; return; }
      } catch { await sleep(TMDB_BACKOFF_BASE * (i + 1)); }
    }
    item.matches = [];
  }
  async function searchTmdb(query, year) {
    const url = `https://api.themoviedb.org/3/search/movie?` + new URLSearchParams({ api_key: TMDB_API_KEY, query: query, year: year || '' });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) return (await r.json()).results || [];
        if (r.status === 429) await sleep(TMDB_BACKOFF_BASE * (i + 1)); else return [];
      } catch { await sleep(TMDB_BACKOFF_BASE * (i + 1)); }
    }
    return [];
  }
  async function fetchTmdbCredits(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?` + new URLSearchParams({ api_key: TMDB_API_KEY });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) return r.json();
        if (r.status === 429) await sleep(TMDB_BACKOFF_BASE * (i + 1)); else return null;
      } catch { await sleep(TMDB_BACKOFF_BASE * (i + 1)); }
    }
    return null;
  }
  async function fetchTmdbDetails(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?` + new URLSearchParams({ api_key: TMDB_API_KEY });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) return r.json();
        if (r.status === 429) await sleep(TMDB_BACKOFF_BASE * (i + 1)); else return null;
      } catch { await sleep(TMDB_BACKOFF_BASE * (i + 1)); }
    }
    return null;
  }
  function extractDirectorNames(cred) {
    if (!cred || !Array.isArray(cred.crew)) return [];
    const out = [];
    for (const c of cred.crew) {
      const job = (c.job || '').toLowerCase();
      const dept = (c.department || '').toLowerCase();
      const looksDirector = dept === 'directing' || job.includes('director');
      if (looksDirector && c.name) out.push(normalizeName(c.name));
    }
    return Array.from(new Set(out));
  }
  function alreadyLoggedSameChoice(filmId, chosenId) {
    return SMART_LOG.some(e =>
      e.filmId === filmId &&
      e.chosen?.id === chosenId &&
      !e.reasons.includes('manual_override') &&
      !e.reasons.includes('final_retry')
    );
  }
  async function resolveBestTmdbForItem(item, isFinalRetry = false) {
    const results = item.matches || [];
    const top = results[0] || null;
    const lbTitleNorm = normalizeTitle(item.title);
    const lbOrigNorm = normalizeTitle(item.originalName || '');
    const lbYearStr = String(item.year || '');
    const lbDirNormSet = new Set((item.directors || []).map(normalizeName));
    function tmdbYear(m) { const d = (m.release_date || '').slice(0, 4); return d || ''; }
    function tmdbTitleMatches(m) {
      const cand = [m.title, m.original_title].filter(Boolean);
      return cand.some(t => {
        const nt = normalizeTitle(t);
        return nt === lbTitleNorm || (lbOrigNorm && nt === lbOrigNorm);
      });
    }
    if (top && tmdbTitleMatches(top) && tmdbYear(top) !== lbYearStr) {
      const topCreds = await fetchTmdbCredits(top.id);
      const topDirs = extractDirectorNames(topCreds);
      const dirMatch = topDirs.some(n => lbDirNormSet.has(n));
      if (dirMatch) return top.id || '';
    }
    const exactTitleYear = results.filter(m => tmdbTitleMatches(m) && tmdbYear(m) === lbYearStr);
    if (exactTitleYear.length === 1) { const chosen = exactTitleYear[0]; maybeLogChange(item, top, chosen, ['exact_title_year'], { candidates: 1 }, isFinalRetry); return chosen.id || ''; }
    if (exactTitleYear.length > 1) {
      const creditsList = await Promise.all(exactTitleYear.map(m => fetchTmdbCredits(m.id)));
      const dirMatches = [];
      for (let i = 0; i < exactTitleYear.length; i++) {
        const tmDirNames = extractDirectorNames(creditsList[i]);
        const matchNames = tmDirNames.filter(n => lbDirNormSet.has(n));
        if (matchNames.length) dirMatches.push({ idx: i, matchNames });
      }
      if (dirMatches.length === 1) {
        const chosen = exactTitleYear[dirMatches[0].idx];
        maybeLogChange(item, top, chosen, ['exact_title_year', 'director_match'], { candidates: exactTitleYear.length, matchedDirectors: dirMatches[0].matchNames }, isFinalRetry);
        return chosen.id || '';
      }
      const detailsList = await Promise.all(exactTitleYear.map(m => fetchTmdbDetails(m.id)));
      const rtMatches = [];
      for (let i = 0; i < exactTitleYear.length; i++) {
        const det = detailsList[i];
        if (!det || typeof det.runtime !== 'number' || typeof item.runtime !== 'number') continue;
        if (Math.abs(det.runtime - item.runtime) <= RUNTIME_TOL_MIN) rtMatches.push(i);
      }
      if (rtMatches.length === 1) {
        const chosen = exactTitleYear[rtMatches[0]];
        maybeLogChange(item, top, chosen, ['exact_title_year', 'runtime_match'], { candidates: exactTitleYear.length, runtime: item.runtime }, isFinalRetry);
        return chosen.id || '';
      }
      if (top) { const chosen = top; maybeLogChange(item, top, chosen, ['exact_title_year', 'fallback_tmdb_top'], { candidates: exactTitleYear.length }, isFinalRetry); return chosen.id || ''; }
      const chosen = exactTitleYear[0];
      maybeLogChange(item, top, chosen, ['exact_title_year'], { candidates: exactTitleYear.length }, isFinalRetry);
      return chosen.id || '';
    }
    const exactTitleOnly = results.filter(m => tmdbTitleMatches(m));
    if (exactTitleOnly.length === 1) { const chosen = exactTitleOnly[0]; maybeLogChange(item, top, chosen, ['exact_title_only'], { candidates: 1 }, isFinalRetry); return chosen.id || ''; }
    if (exactTitleOnly.length > 1) {
      const creditsList = await Promise.all(exactTitleOnly.map(m => fetchTmdbCredits(m.id)));
      const dirMatches = [];
      for (let i = 0; i < exactTitleOnly.length; i++) {
        const tmDirNames = extractDirectorNames(creditsList[i]);
        const matchNames = tmDirNames.filter(n => lbDirNormSet.has(n));
        if (matchNames.length) dirMatches.push({ idx: i, matchNames });
      }
      if (dirMatches.length === 1) {
        const chosen = exactTitleOnly[dirMatches[0].idx];
        maybeLogChange(item, top, chosen, ['exact_title_only', 'director_match'], { candidates: exactTitleOnly.length, matchedDirectors: dirMatches[0].matchNames }, isFinalRetry);
        return chosen.id || '';
      }
      const detailsList = await Promise.all(exactTitleOnly.map(m => fetchTmdbDetails(m.id)));
      const rtMatches = [];
      for (let i = 0; i < exactTitleOnly.length; i++) {
        const det = detailsList[i];
        if (!det || typeof det.runtime !== 'number' || typeof item.runtime !== 'number') continue;
        if (Math.abs(det.runtime - item.runtime) <= RUNTIME_TOL_MIN) rtMatches.push(i);
      }
      if (rtMatches.length === 1) {
        const chosen = exactTitleOnly[rtMatches[0]];
        maybeLogChange(item, top, chosen, ['exact_title_only', 'runtime_match'], { candidates: exactTitleOnly.length, runtime: item.runtime }, isFinalRetry);
        return chosen.id || '';
      }
      if (results[0]) return results[0].id || '';
      if (exactTitleOnly.length) return exactTitleOnly[0].id || '';
    }
    if (results[0]) return results[0].id || '';
    return '';
  }
  function maybeLogChange(item, top, chosen, reasons, extra, isFinalRetry = false) {
    if (!smartLogEnabled()) return;
    const topId = top?.id || null;
    const chosenId = chosen?.id || null;
    const reasonsList = Array.isArray(reasons) ? reasons.slice() : [];
    if (isFinalRetry && !reasonsList.includes('final_retry')) reasonsList.push('final_retry');
    if (isFinalRetry) {
      if (chosenId != null && alreadyLoggedSameChoice(item.filmId, chosenId)) return;
      if (!chosen && !top) {
        const hadNoResults = SMART_LOG.some(e => e.filmId === item.filmId && e.reasons.includes('no_results'));
        if (hadNoResults) return;
      }
    }
    const changed = reasonsList.includes('manual_override') ? true : (topId !== chosenId);
    if (!changed) return;
    SMART_LOG.push({
      filmId: item.filmId,
      listIndex: item.listIndex || 0,
      lbTitle: item.title,
      lbYear: item.year,
      lbDirectors: item.directors || [],
      lbRuntime: item.runtime,
      top: top ? { id: top.id, title: top.title, release_date: top.release_date || '' } : null,
      chosen: chosen ? { id: chosen.id, title: chosen.title, release_date: chosen.release_date || '' } : null,
      reasons: reasonsList,
      candidates: extra?.candidates ?? null,
      matchedDirectors: extra?.matchedDirectors || [],
      runtimeUsed: typeof extra?.runtime === 'number' ? extra.runtime : null,
      timestamp: Date.now()
    });
  }

  // ─── Scrape & process (unchanged) ───────────────────────────────────────
  function scrapeFrom(doc) {
    return Array.from(doc.querySelectorAll('ul.poster-list li'))
      .map(li => {
        const ed = li.querySelector('[data-details-endpoint]');
        if (!ed) return null;
        return {
          filmId: ed.dataset.filmId,
          detailsEndpoint: location.origin + ed.dataset.detailsEndpoint,
          title: '',
          year: '',
          originalName: '',
          directors: [],
          runtime: null,
          matches: [],
          tmdbId: '',
          isTv: false,
          listIndex: 0
        };
      })
      .filter(x => x);
  }
  async function scrapeAllItems_ListPages() {
    const pages = Array.from(document.querySelectorAll('li.paginate-page'))
      .map(li => parseInt(li.textContent, 10))
      .filter(n => n);
    const count = pages.length ? Math.max(...pages) : 1;
    const urls = [];
    const base = location.pathname.replace(/\/page\/\d+\/?$/, '').replace(/\/?$/, '/');
    for (let p = 1; p <= count; p++) { urls.push(location.origin + base + (p > 1 ? `page/${p}/` : '')); }
    const docs = await Promise.all(urls.map(u =>
      fetch(u, { credentials: 'include' })
        .then(r => r.ok ? r.text() : Promise.reject())
        .then(t => new DOMParser().parseFromString(t, 'text/html'))
    ));
    const items = docs.flatMap(scrapeFrom);
    items.forEach((it, idx) => { it.listIndex = idx + 1; });
    return items;
  }
  function scrapeNanogenreItems_CurrentPage() {
    const lis = document.querySelectorAll('section.genre-group ul.poster-list li[data-film-id], section.-themes ul.poster-list li[data-film-id], main ul.poster-list li[data-film-id][data-film-slug]');
    const items = []; let idx = 0;
    lis.forEach(li => {
      const filmId = li.getAttribute('data-film-id') || '';
      if (!filmId) return;
      const ed = li.querySelector('[data-details-endpoint]');
      const detailsEndpoint = ed ? (location.origin + ed.getAttribute('data-details-endpoint')) : '';
      const img = li.querySelector('img');
      const title = (img?.getAttribute('alt') || '').trim();
      const year = li.getAttribute('data-film-release-year') || '';
      items.push({ filmId, detailsEndpoint, title, year, originalName:'', directors:[], runtime:null, matches:[], tmdbId:'', isTv:false, listIndex: ++idx });
    });
    return items;
  }
  async function scrapeItemsSmart() {
    if (isListPage()) return await scrapeAllItems_ListPages();
    else if (isNanogenreLike()) return scrapeNanogenreItems_CurrentPage();
    else { const items = scrapeFrom(document); items.forEach((it, i) => it.listIndex = i + 1); return items; }
  }
  async function processItems(items, providedOverrides = null) {
    await loadBaseBinOnce({ allowRevalidate: true });
    await loadLocalOverridesOnce();
    if (providedOverrides) LOCAL_OVERRIDES = providedOverrides;
    try { await setCache(JSON.parse(JSON.stringify(LOCAL_OVERRIDES || {})), CACHE_BACKUP_KEY); } catch {}
    const batchSize = parseInt(GM_GetOrSet('batchSize', DEFAULT_BATCH_SIZE), 10) || DEFAULT_BATCH_SIZE;
    const pauseMs = parseInt(GM_GetOrSet('pauseMs', DEFAULT_PAUSE_MS), 10) || DEFAULT_PAUSE_MS;
    const toFetch = [];
    items.forEach(it => {
      const packed = getFromAnyCachePacked(it.filmId);
      if (packed !== undefined) {
        const { tmdbId, isTv } = unpack(packed);
        it.tmdbId = tmdbId; it.isTv = isTv;
      } else { toFetch.push(it); }
    });
    const batches = [];
    for (let i = 0; i < toFetch.length; i += batchSize) {
      const batch = toFetch.slice(i, i + batchSize);
      batches.push((async () => {
        await Promise.all(batch.map(fetchLbdMetadata));
        await Promise.all(batch.map(fetchTmdbSearchResults));
        await Promise.all(batch.map(async it => {
          it.tmdbId = await resolveBestTmdbForItem(it, /*isFinalRetry=*/false);
          if (it.tmdbId) { it.isTv = false; overrideSetPacked(it.filmId, it.tmdbId, it.isTv); }
        }));
      })());
      await sleep(pauseMs);
    }
    await Promise.all(batches); await persistOverrides();

    const minSize = parseInt(GM_GetOrSet('finalRetryMinListSize', DEFAULT_FINALRETRY_MIN_LIST_SIZE), 10) || 0;
    const unresolved = items.filter(it => !(it.tmdbId));
    if (items.length >= minSize && unresolved.length) {
      const delay = parseInt(GM_GetOrSet('finalRetryDelayMs', DEFAULT_FINALRETRY_DELAY), 10) || 0;
      if (delay > 0) await sleep(delay);
      const frBatches = [];
      for (let i = 0; i < unresolved.length; i += batchSize) {
        const batch = unresolved.slice(i, i + batchSize);
        frBatches.push((async () => {
          await Promise.all(batch.map(fetchLbdMetadata));
          await Promise.all(batch.map(async it => {
            const hasMatches = Array.isArray(it.matches) && it.matches.length > 0;
            if (!hasMatches && it.title) { await fetchTmdbSearchResults(it); }
          }));
          await Promise.all(batch.map(async it => {
            it.tmdbId = await resolveBestTmdbForItem(it, /*isFinalRetry=*/true);
            if (it.tmdbId) { it.isTv = false; overrideSetPacked(it.filmId, it.tmdbId, it.isTv); }
          }));
        })());
        await sleep(pauseMs);
      }
      await Promise.all(frBatches); await persistOverrides();
    }
    return LOCAL_OVERRIDES || {};
  }

  // ─── URL builder (unchanged) ────────────────────────────────────────────
  function buildUrlFromCache(items, descriptionText) {
    const listItems = [];
    const defaultMt = GM_GetOrSet('defaultMediaType', DEFAULT_MEDIA_TYPE_DEFAULT); // 'm' | 'tv'
    for (const it of items) {
      let packed = getFromAnyCachePacked(it.filmId); let tmdbId, isTv;
      if (packed !== undefined) ({ tmdbId, isTv } = unpack(packed));
      else if (it.tmdbId) { tmdbId = Number(it.tmdbId); isTv = !!it.isTv; }
      else { tmdbId = ''; isTv = false; }
      const itemMt = isTv ? 'tv' : 'm';
      if (itemMt === defaultMt) listItems.push({ id: tmdbId });
      else listItems.push({ id: tmdbId, mt: itemMt });
    }
    const listName = getListNameFromPage();
    const author = getListAuthorFromPage();
    let action = GM_getValue('kodiAction', 'import'); if (action === 'ask') action = 'import';
    const busyIndicator = GM_GetOrSet('indicator', 'none');
    const description = (typeof descriptionText === 'string' && descriptionText !== '') ? descriptionText : null;
    const posterEnabled = GM_GetOrSet('posterEnable', POSTER_ENABLE_DEFAULT);
    const posterStrategy = GM_GetOrSet('posterStrategy', POSTER_STRATEGY_DEFAULT);
    const fanartEnabled = GM_GetOrSet('fanartEnable', FANART_ENABLE_DEFAULT);
    const fanartStrategy = GM_GetOrSet('fanartStrategy', FANART_STRATEGY_DEFAULT);
    const parts = [];
    parts.push(['mode', 'personal_lists.external']);
    if (action) parts.push(['action', action]);
    parts.push(['list_type', 'tmdb']);
    parts.push(['list_items', JSON.stringify(listItems)]);
    parts.push(['list_name', listName]);
    parts.push(['author', author]);
    parts.push(['media_type', defaultMt]);
    parts.push(['busy_indicator', busyIndicator]);
    if (description != null) parts.push(['description', description]);
    if (posterEnabled) parts.push(['poster', posterStrategy]);
    if (fanartEnabled) parts.push(['fanart', fanartStrategy]);
    let url = 'plugin://plugin.video.fenlight/?';
    url += parts.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    return url;
  }

  // ─── Show URL (overlay) ─────────────────────────────────────────────────
  async function handleShowUrl(btnEl) {
    if (btnEl) btnEl.disabled = true;
    let items;
    try { items = await scrapeItemsSmart(); }
    catch { alert('Scrape failed'); if (btnEl) btnEl.disabled = false; return; }
    if (!items.length) { alert('No items'); if (btnEl) btnEl.disabled = false; return; }

    if (isListPage()) {
      const how = prompt('How many items? number or "all":', 'all');
      if (how === null) { if (btnEl) btnEl.disabled = false; return; }
      const all = how.trim().toLowerCase() === 'all';
      const count = all ? Infinity : parseInt(how, 10);
      if (!all && (isNaN(count) || count < 1)) { alert('Invalid number'); if (btnEl) btnEl.disabled = false; return; }
      if (!all) items = items.slice(0, count);
    }

    await Promise.all([loadBaseBinOnce({ allowRevalidate: true }), loadLocalOverridesOnce()]);

    // Description
    let descriptionText = null;
    if (GM_getValue('descEnable', false)) {
      const pageDesc = getListDescriptionFromPage() || DEFAULT_DESCRIPTION;
      if (GM_getValue('descMode', 'send') === 'edit') {
        const edited = await editDescriptionOverlay(pageDesc);
        if (edited === null) { if (btnEl) btnEl.disabled = false; return; }
        descriptionText = sanitizeDescPreservingBreaks(edited);
      } else { descriptionText = pageDesc; }
    }

    const startLen = SMART_LOG.length;
    await processItems(items, LOCAL_OVERRIDES);
    const changes = SMART_LOG.length - startLen;

    const url = buildUrlFromCache(items, descriptionText);
    const limitBytes = 65536;
    const urlBytes = (typeof TextEncoder !== 'undefined') ? new TextEncoder().encode(url).length : unescape(encodeURIComponent(url)).length;
    const pct = Math.min(100, Math.round((urlBytes / limitBytes) * 1000) / 10);

    const ta = mkEl('textarea', { className:'kb-textarea', spellcheck:false });
    ta.value = url;

    const copyBtn = mkEl('button', { className:'kb-btn', textContent:'Copy URL' });
    const closeBtn = mkEl('button', { className:'kb-btn kb-btn--ghost', textContent:'Close' });

    const info = mkEl('div', {}, { color:'#bbb', fontSize:'12px', marginTop:'8px' });
    info.textContent = `URL size: ${urlBytes} / ${limitBytes} bytes (${pct}%)`;

    const box = mkEl('div'); box.append(ta, info);

    const { overlay } = overlayPanel({ title: 'FLAM URL', content: box, footerButtons: [copyBtn, closeBtn] });

    copyBtn.onclick = async () => {
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(ta.value);
        else { ta.select(); document.execCommand('copy'); }
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy URL'; }, 1200);
      } catch { showToast('Could not copy. Select all manually.'); }
    };
    closeBtn.onclick = () => overlay.remove();

    if (smartLogEnabled() && changes > 0) { showToast(`Smart-match changed ${changes} pick${changes === 1 ? '' : 's'} — tap to review`, () => openReviewPanelPromise()); }
    updateSmartLogButtonState();
    if (btnEl) btnEl.disabled = false;
  }

  // ─── Floating bottom dock (mobile) ──────────────────────────────────────
  const dock = mkEl('div', { className:'kb-floating-dock' });
  const flamBtn = mkEl('button', { className:'kb-btn', textContent:'FLAM' });
  const settingsBtn = mkEl('button', { className:'kb-btn kb-btn--ghost', textContent:'⚙ Settings' });
  dock.append(flamBtn, settingsBtn);
  document.body.append(dock);

  // ─── FLAM action (unchanged core with mobile side-info) ─────────────────
  flamBtn.addEventListener('click', async function () {
    const btn = this; btn.disabled = true;
    const startTime = performance.now();
    btn.textContent = 'Processing…';

    await Promise.all([loadBaseBinOnce({ allowRevalidate: true }), loadLocalOverridesOnce()]);

    let items;
    try { items = await scrapeItemsSmart(); }
    catch { alert('Scrape failed'); btn.disabled = false; btn.textContent = 'FLAM'; return; }
    if (!items.length) { alert('No items'); btn.disabled = false; btn.textContent = 'FLAM'; return; }

    // Cache hit stats BEFORE processing
    const overrides0 = await getCache(CACHE_KEY);
    let baseHitCount = 0; let uncachedCount = 0;
    for (const it of items) {
      const hasOverride = Number.isFinite(overrides0[it.filmId]);
      if (hasOverride) continue;
      const basePacked = baseLookupPacked(Number(it.filmId));
      if (basePacked !== undefined) baseHitCount++; else uncachedCount++;
    }
    btn.textContent = `Processing… (${baseHitCount} base • ${uncachedCount} uncached)`;

    // Description
    let descriptionText = null;
    if (GM_GetOrSet('descEnable', false)) {
      const pageDesc = getListDescriptionFromPage() || DEFAULT_DESCRIPTION;
      if (GM_GetOrSet('descMode', 'send') === 'edit') {
        const edited = await editDescriptionOverlay(pageDesc);
        if (edited === null) { btn.disabled = false; btn.textContent = 'FLAM'; return; }
        descriptionText = sanitizeDescPreservingBreaks(edited);
      } else { descriptionText = pageDesc; }
    }

    const startLen = SMART_LOG.length;
    await processItems(items, LOCAL_OVERRIDES);
    const changes = SMART_LOG.length - startLen;

    if (smartLogEnabled() && GM_GetOrSet('smartReviewAutoOpen', false) && changes > 0) {
      const res = await openReviewPanelPromise();
      if (!res || res.action !== 'save-send') {
        btn.textContent = 'Cancelled';
        setTimeout(() => { btn.textContent = 'FLAM'; btn.disabled = false; }, 1200);
        updateSmartLogButtonState();
        return;
      }
    }

    const url = buildUrlFromCache(items, descriptionText);

    // URL size (bytes) & % of 64KB limit
    const urlBytes = (typeof TextEncoder !== 'undefined') ? new TextEncoder().encode(url).length : unescape(encodeURIComponent(url)).length;
    const limitBytes = 65536;
    const pct = Math.min(100, Math.round((urlBytes / limitBytes) * 1000) / 10);

    const ok = await sendToKodi(url);
    const elapsedMs = Math.max(0, Math.round(performance.now() - startTime));
    btn.textContent = ok ? 'Sent!' : 'Failed';
    setTimeout(() => { btn.textContent = 'FLAM'; }, 1200);
    btn.disabled = false;

    const infoLines = [
      `📦 Cache — binary: ${baseHitCount} • uncached: ${uncachedCount}`,
      `🔗 URL size: ${urlBytes} / ${limitBytes} bytes (${pct}%)`,
      `⏱ Elapsed: ${(elapsedMs / 1000).toFixed(1)}s`
    ];
    showSideInfoNearButton(btn, infoLines, 5000);

    if (smartLogEnabled() && !GM_GetOrSet('smartReviewAutoOpen', false) && changes > 0) {
      showToast(`Smart-match changed ${changes} pick${changes === 1 ? '' : 's'} — tap to review`, () => openReviewPanelPromise());
    }
    updateSmartLogButtonState();
  });

  // ─── Settings (overlay with tabs; mobile-first) ─────────────────────────
  function showSettings() {
    if (document.getElementById('kodisettings')) return;

    const root = mkEl('div', { id:'kodisettings' });
    // Tabs
    const tabBar = mkEl('div', { className:'kb-tabs' });
    const tabGeneral = mkEl('button', { className:'kb-tabbtn kb-tabbtn--active', textContent:'General', 'data-tab':'general' });
    const tabTools = mkEl('button', { className:'kb-tabbtn', textContent:'Tools', 'data-tab':'tools' });
    tabBar.append(tabGeneral, tabTools);

    const general = mkEl('div', { id:'kodi-tab-general' });
    const tools = mkEl('div', { id:'kodi-tab-tools' }, { display:'none' });

    // General content
    general.innerHTML = `
      <label>Kodi IP:</label>
      <input id="kodiIp" class="kb-input"/>
      <label style="margin-top:8px">Kodi Port:</label>
      <input id="kodiPort" class="kb-input"/>
      <label style="margin-top:8px">Kodi User:</label>
      <input id="kodiUser" class="kb-input"/>
      <label style="margin-top:8px">Kodi Pass:</label>
      <input id="kodiPass" type="password" class="kb-input"/>

      <label style="margin-top:10px">Default Action:</label>
      <select id="kodiAction" class="kb-select">
        <option value="">Omit Action key</option>
        <option value="view">view</option>
        <option value="import">import</option>
        <option value="import_view">import_view</option>
        <option value="ask">Ask each time</option>
      </select>

      <label style="margin-top:10px">Busy indicator:</label>
      <select id="indicator" class="kb-select">
        <option value="none">none</option>
        <option value="busy">busy</option>
        <option value="progress">progress</option>
      </select>

      <label style="margin-top:10px"><input type="checkbox" id="descEnable"/> Add Description</label>
      <div id="descOptions" style="display:none; margin:8px 0">
        <label>Edit mode:</label>
        <select id="descMode" class="kb-select">
          <option value="send">Send without editing</option>
          <option value="edit">Edit before sending</option>
        </select>
      </div>

      <hr class="kb-sep">

      <div class="kb-row">
        <div>
          <label>Batch size:</label>
          <input id="batchSize" type="number" min="1" step="1" class="kb-input"/>
        </div>
        <div>
          <label>Pause between batches (ms):</label>
          <input id="pauseMs" type="number" min="0" step="10" class="kb-input"/>
        </div>
        <div>
          <label>Final retry delay (ms):</label>
          <input id="finalRetryDelayMs" type="number" min="0" step="10" class="kb-input"/>
        </div>
        <div>
          <label>Final retry min list size:</label>
          <input id="finalRetryMinListSize" type="number" min="0" step="1" class="kb-input"/>
        </div>
      </div>

      <label style="margin-top:8px"><input type="checkbox" id="smartLogEnable"/> Enable Smart-Match Logging</label><br>
      <label><input type="checkbox" id="smartReviewAutoOpen"/> Auto-open Review Panel BEFORE sending when changes occur</label>

      <hr class="kb-sep">

      <div>
        <h3 style="margin:0 0 8px;">Artwork Options</h3>
        <div class="kb-row">
          <div style="border:1px solid #333;border-radius:8px;padding:10px;">
            <label><input type="checkbox" id="posterEnable"/> Enable Poster</label>
            <div style="color:#bbb;font-size:12px;margin:6px 0 8px">Include the <code>poster</code> key in the URL.</div>
            <label>Poster selection:</label>
            <select id="posterStrategy" class="kb-select" style="margin-top:4px">
              <option value="first_4">first_4</option>
              <option value="random">random</option>
            </select>
          </div>
          <div style="border:1px solid #333;border-radius:8px;padding:10px;">
            <label><input type="checkbox" id="fanartEnable"/> Enable Fanart</label>
            <div style="color:#bbb;font-size:12px;margin:6px 0 8px">Include the <code>fanart</code> key in the URL.</div>
            <label>Fanart selection:</label>
            <select id="fanartStrategy" class="kb-select" style="margin-top:4px">
              <option value="first_4">first_4</option>
              <option value="random">random</option>
            </select>
          </div>
        </div>
      </div>

      <hr class="kb-sep">

      <div>
        <h3 style="margin:0 0 8px;">Media Type Defaults</h3>
        <label>Default media type (items w/o per-item <code>mt</code>):</label>
        <select id="defaultMediaType" class="kb-select" style="margin-top:6px">
          <option value="m">m (movies)</option>
          <option value="tv">tv (TV shows)</option>
        </select>
        <div style="color:#bbb;font-size:12px;margin-top:4px">
          Per-item <code>mt</code> is only added when it differs from this default. The top-level <code>media_type</code> is always set to this default.
        </div>
      </div>

      <hr class="kb-sep">

      <div>
        <h3 style="margin:0 0 8px;">Cache Tools</h3>
        <div class="kb-actions" style="margin-bottom:6px">
          <button id="downloadCacheBtn" class="kb-btn">Download Overrides</button>
          <button id="refreshBaseCacheBtn" class="kb-btn">Refresh Base Cache</button>
        </div>
        <div class="kb-row" style="align-items:end">
          <div>
            <label>Base cache URL (.bin):</label>
            <input id="baseBinUrl" class="kb-input" style="margin-top:4px"/>
            <div style="color:#bbb;font-size:12px;margin-top:4px">Raw GitHub URL to lbd_tmdb_pairs_u32.bin</div>
          </div>
          <div class="kb-actions">
            <button id="resetBaseBinUrlBtn" class="kb-btn kb-btn--ghost">Reset URL</button>
          </div>
        </div>
        <div id="cacheToolMsg" style="color:#bbb;font-size:12px;margin-top:8px;"></div>
      </div>
    `;

    // Tools content
    const toolsWrap = mkEl('div');
    toolsWrap.innerHTML = `
      <div class="kb-actions" style="margin-bottom:10px">
        <button id="btnShowUrl" class="kb-btn" title="Build & view plugin URL">Show URL</button>
        <button id="btnShowCache" class="kb-btn" title="Open overrides as JSON">Show Cache</button>
        <button id="btnEditCache" class="kb-btn" title="Open editor for overrides">Edit Cache</button>
        <button id="btnClearCache" className="kb-btn" title="Clear overrides">Clear Cache</button>
        <button id="btnSmartLog" class="kb-btn" title="Open Smart-Match Log" disabled>Show Smart Log</button>
        <button id="btnReviewChanges" class="kb-btn" title="Open Review Panel">Review Changes</button>
      </div>
      <div style="color:#bbb;font-size:12px">Utilities have been moved here. Use FLAM to send; use these to inspect/tweak.</div>
    `;
    tools.append(toolsWrap);

    root.append(tabBar, general, tools);

    const saveBtn = mkEl('button', { className:'kb-btn', textContent:'Save' });
    const closeBtn = mkEl('button', { className:'kb-btn kb-btn--ghost', textContent:'Close' });

    const { overlay, body } = overlayPanel({ title: 'Kodi Settings', content: root, footerButtons: [saveBtn, closeBtn] });

    // Tab behavior
    function activateTab(name) {
      [tabGeneral, tabTools].forEach(b => b.classList.toggle('kb-tabbtn--active', b.dataset.tab === name));
      general.style.display = (name === 'general') ? 'block' : 'none';
      tools.style.display = (name === 'tools') ? 'block' : 'none';
    }
    tabGeneral.onclick = () => activateTab('general');
    tabTools.onclick = () => activateTab('tools');
    activateTab('general');

    // Populate values
    body.querySelector('#kodiIp').value = GM_getValue('kodiIp', '');
    body.querySelector('#kodiPort').value = GM_getValue('kodiPort', '');
    body.querySelector('#kodiUser').value = GM_getValue('kodiUser', '');
    body.querySelector('#kodiPass').value = GM_GetOrSet('kodiPass', '');

    body.querySelector('#kodiAction').value = GM_getValue('kodiAction', 'import');
    body.querySelector('#indicator').value = GM_GetOrSet('indicator', 'none');
    body.querySelector('#descEnable').checked = GM_GetOrSet('descEnable', false);
    body.querySelector('#descMode').value = GM_GetOrSet('descMode', 'send');
    body.querySelector('#smartLogEnable').checked = smartLogEnabled();
    body.querySelector('#smartReviewAutoOpen').checked = GM_GetOrSet('smartReviewAutoOpen', false);

    body.querySelector('#batchSize').value = GM_GetOrSet('batchSize', DEFAULT_BATCH_SIZE);
    body.querySelector('#pauseMs').value = GM_GetOrSet('pauseMs', DEFAULT_PAUSE_MS);
    body.querySelector('#finalRetryDelayMs').value = GM_GetOrSet('finalRetryDelayMs', DEFAULT_FINALRETRY_DELAY);
    body.querySelector('#finalRetryMinListSize').value = GM_GetOrSet('finalRetryMinListSize', DEFAULT_FINALRETRY_MIN_LIST_SIZE);

    body.querySelector('#posterEnable').checked = GM_GetOrSet('posterEnable', POSTER_ENABLE_DEFAULT);
    body.querySelector('#posterStrategy').value = GM_GetOrSet('posterStrategy', POSTER_STRATEGY_DEFAULT);
    body.querySelector('#fanartEnable').checked = GM_GetOrSet('fanartEnable', FANART_ENABLE_DEFAULT);
    body.querySelector('#fanartStrategy').value = GM_GetOrSet('fanartStrategy', FANART_STRATEGY_DEFAULT);

    body.querySelector('#baseBinUrl').value = GM_GetOrSet('baseBinUrl', BASE_BIN_URL_DEFAULT);
    body.querySelector('#defaultMediaType').value = GM_GetOrSet('defaultMediaType', DEFAULT_MEDIA_TYPE_DEFAULT);

    const descOpts = body.querySelector('#descOptions');
    body.querySelector('#descEnable').addEventListener('change', e => {
      descOpts.style.display = e.target.checked ? 'block' : 'none';
    });
    if (body.querySelector('#descEnable').checked) descOpts.style.display = 'block';

    // Cache tools handlers
    const cacheMsg = body.querySelector('#cacheToolMsg');
    function setCacheMsg(txt, ok = false) { cacheMsg.textContent = txt || ''; cacheMsg.style.color = ok ? '#8ee6a4' : '#bbb'; }

    body.querySelector('#downloadCacheBtn').onclick = async () => {
      try {
        await loadLocalOverridesOnce();
        const nice = {};
        for (const [k, packed] of Object.entries(LOCAL_OVERRIDES || {})) {
          if (!Number.isFinite(packed)) continue;
          const { tmdbId, isTv } = unpack(packed);
          nice[k] = { tmdbId, type: isTv ? 'tv' : 'm' };
        }
        const blob = new Blob([JSON.stringify(nice, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'lbd_tmdb_overrides.json';
        document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
        setCacheMsg('Downloaded overrides.', true);
      } catch (e) { alert('❌ Failed to download overrides: ' + (e?.message || e)); }
    };
    body.querySelector('#refreshBaseCacheBtn').onclick = async () => {
      setCacheMsg('Refreshing base cache…');
      await refreshBaseBinNow();
      setCacheMsg('Base cache refreshed.', true);
    };
    body.querySelector('#resetBaseBinUrlBtn').onclick = () => {
      body.querySelector('#baseBinUrl').value = BASE_BIN_URL_DEFAULT;
      setCacheMsg('Base cache URL reset (unsaved).');
    };

    saveBtn.onclick = () => {
      GM_setValue('kodiIp', body.querySelector('#kodiIp').value.trim());
      GM_setValue('kodiPort', body.querySelector('#kodiPort').value.trim());
      GM_setValue('kodiUser', body.querySelector('#kodiUser').value);
      GM_setValue('kodiPass', body.querySelector('#kodiPass').value);
      GM_setValue('kodiAction', body.querySelector('#kodiAction').value);
      GM_setValue('indicator', body.querySelector('#indicator').value);
      GM_setValue('descEnable', body.querySelector('#descEnable').checked);
      GM_setValue('descMode', body.querySelector('#descMode').value);
      GM_setValue('smartLogEnable', body.querySelector('#smartLogEnable').checked);
      GM_setValue('smartReviewAutoOpen', body.querySelector('#smartReviewAutoOpen').checked);

      GM_setValue('posterEnable', body.querySelector('#posterEnable').checked);
      GM_setValue('posterStrategy', body.querySelector('#posterStrategy').value);
      GM_setValue('fanartEnable', body.querySelector('#fanartEnable').checked);
      GM_setValue('fanartStrategy', body.querySelector('#fanartStrategy').value);

      GM_setValue('batchSize', Math.max(1, parseInt(body.querySelector('#batchSize').value, 10) || DEFAULT_BATCH_SIZE));
      GM_setValue('pauseMs', Math.max(0, parseInt(body.querySelector('#pauseMs').value, 10) || DEFAULT_PAUSE_MS));
      GM_setValue('finalRetryDelayMs', Math.max(0, parseInt(body.querySelector('#finalRetryDelayMs').value, 10) || DEFAULT_FINALRETRY_DELAY));
      GM_setValue('finalRetryMinListSize', Math.max(0, parseInt(body.querySelector('#finalRetryMinListSize').value, 10) || DEFAULT_FINALRETRY_MIN_LIST_SIZE));

      GM_setValue('baseBinUrl', body.querySelector('#baseBinUrl').value.trim() || BASE_BIN_URL_DEFAULT);
      GM_setValue('defaultMediaType', body.querySelector('#defaultMediaType').value);

      overlay.remove();
      alert('✅ Settings saved');
      updateSmartLogButtonState();
    };
    closeBtn.onclick = () => overlay.remove();

    // Tools tab buttons
    body.querySelector('#btnShowUrl').onclick = function () { handleShowUrl(this); };
    body.querySelector('#btnShowCache').onclick = async () => {
      await loadLocalOverridesOnce();
      const pre = mkEl('pre', {}, { whiteSpace:'pre-wrap', wordBreak:'break-word', margin:0, fontSize:'12px' });
      pre.textContent = JSON.stringify(LOCAL_OVERRIDES || {}, null, 2);
      const closeBtn2 = mkEl('button', { className:'kb-btn kb-btn--ghost', textContent:'Close' });
      const { overlay: ov2 } = overlayPanel({ title:'Overrides JSON', content: pre, footerButtons:[closeBtn2] });
      closeBtn2.onclick = () => ov2.remove();
    };
    body.querySelector('#btnEditCache').onclick = openCacheEditor;
    body.querySelector('#btnClearCache').onclick = async () => { await clearCache(); LOCAL_OVERRIDES = {}; alert('Overrides cleared'); };
    body.querySelector('#btnSmartLog').onclick = openSmartLogOverlay;
    body.querySelector('#btnReviewChanges').onclick = () => openReviewPanelPromise();

    updateSmartLogButtonState();
  }

  settingsBtn.addEventListener('click', showSettings);
})();
