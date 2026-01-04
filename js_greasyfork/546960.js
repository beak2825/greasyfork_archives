// ==UserScript==
// @name         Letterboxd → FLAM (Fenlight) [Mobile-Ready]
// @namespace    http://tampermonkey.net/
// @version      3.8.0-mobile
// @description  Mobile-friendly build. Send Letterboxd lists & nanogenre pages to Kodi (Fenlight)
// @match        https://letterboxd.com/*/list/*
// @match        https://letterboxd.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// @connect      *
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/546960/Letterboxd%20%E2%86%92%20FLAM%20%28Fenlight%29%20%5BMobile-Ready%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/546960/Letterboxd%20%E2%86%92%20FLAM%20%28Fenlight%29%20%5BMobile-Ready%5D.meta.js
// ==/UserScript==

/*
──────────────────────────────────────────────────────────────────────────────

MOBILE NOTES:
- This build avoids window.open popups on Android/Firefox (where they're often blocked)
  by rendering Smart Log, Review Panel, Cache Editor, and "Show Cache" as full-screen
  overlays. Desktop browsers still get popups where appropriate.
- Touch-friendly floating buttons ("FLAM" and "⚙") are pinned bottom-right on mobile,
  top-right on desktop. Both are always visible.
- Clipboard: prefers navigator.clipboard.writeText with fallback to execCommand('copy').
- CompressionStream: used if available; falls back to raw JSON otherwise.

──────────────────────────────────────────────────────────────────────────────
*/

(async function () {
  'use strict';

  // ─── Environment detection ──────────────────────────────────────────────
  const UA = navigator.userAgent || '';
  const IS_ANDROID = /\bAndroid\b/i.test(UA);
  const IS_MOBILE = IS_ANDROID || /\bMobile\b/i.test(UA);
  const SUPPORTS_POPUPS = (() => {
    // We avoid auto-opening test popups (could be blocked). On mobile, force overlays.
    return !IS_MOBILE;
  })();

  // ─── Config (defaults; user-tunable via Settings) ───────────────────────
  const TMDB_API_KEY = 'f090bb54758cabf231fb605d3e3e0468';
  const DEFAULT_BATCH_SIZE = 5;
  const DEFAULT_PAUSE_MS = 150;
  const DEFAULT_FINALRETRY_DELAY = 300;
  const DEFAULT_FINALRETRY_MIN_LIST_SIZE = 400;

  const LBD_MAX_RETRIES = 3;
  const LBD_BACKOFF_BASE = 200;
  const TMDB_MAX_RETRIES = 3;
  const TMDB_BACKOFF_BASE = 200;

  // UI toggles (code-only): set to true to expose advanced perf knobs in Settings
  const SHOW_ADVANCED_SETTINGS_UI = false; // ← CHANGE TO true TO UNHIDE ADVANCED FIELDS

  // Local overrides (packed) live here
  const CACHE_KEY = 'lbd_tmdb_cache_overrides';
  const CACHE_BACKUP_KEY = 'lbd_tmdb_cache_backup';

  const DEFAULT_DESCRIPTION = '';
  const RUNTIME_TOL_MIN = 3;

  // Artwork settings defaults
  const POSTER_ENABLE_DEFAULT = true;
  const POSTER_STRATEGY_DEFAULT = 'first_4'; // 'first_4' | 'random'

  // NEW: fanart supports 'author_fanart' (default) and fallback when missing
  const FANART_ENABLE_DEFAULT = true;
  const FANART_STRATEGY_DEFAULT = 'author_fanart'; // 'author_fanart' | 'first_4' | 'random'
  const FANART_FALLBACK_DEFAULT = 'first_4';       // 'none' | 'first_4' | 'random'

  const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/';
  const TMDB_POSTER_SIZE = 'w185';

  // Binary base cache (packed pairs) hosted on GitHub Raw
  const BASE_BIN_URL_DEFAULT = 'https://raw.githubusercontent.com/hcgiub001/letterboxd-tmdb-cache/main/lbd_tmdb_pairs_u32.bin';
  const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

  // Default media type for items without per-item mt (and top-level)
  const DEFAULT_MEDIA_TYPE_DEFAULT = 'm'; // 'm' | 'tv'

  // NEW: Soft limit for list size (friendly block for > 5000 items)
  const MAX_LIST_ITEMS = 5000;

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // ─── Smart Log (session) ────────────────────────────────────────────────
  let SMART_LOG = [];
  function smartLogEnabled() { return GM_getValue('smartLogEnable', true); }
  function GM_GetOrSet(key, def) { const v = GM_getValue(key); return (typeof v === 'undefined') ? def : v; }

  // ─── Text helpers ───────────────────────────────────────────────────────
  const normalizeText = (s) => (s || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
  function stripDiacritics(s) { return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  function normalizeTitle(s) { return stripDiacritics(s).toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim(); }
  function normalizeName(s) { return stripDiacritics(s).toLowerCase().replace(/\s+/g, ' ').trim(); }
  function utf8ByteLen(str) { try { return new TextEncoder().encode(str).length; } catch { return unescape(encodeURIComponent(str)).length; } }

  // ─── Gzip+Base64 helper (per the standard pseudocode) ───────────────────
  async function gzipBase64(str) {
    try {
      // Firefox Android supports CompressionStream for gzip in recent versions.
      const enc = new TextEncoder().encode(str);
      const cs = new CompressionStream('gzip');
      const compressed = new Blob([enc]).stream().pipeThrough(cs);
      const ab = await new Response(compressed).arrayBuffer();
      const u8 = new Uint8Array(ab);
      let bin = '';
      for (let i = 0; i < u8.length; i++) bin += String.fromCharCode(u8[i]);
      return btoa(bin);
    } catch {
      return null; // compression not available / failed
    }
  }

  // ─── Description & author helpers ───────────────────────────────────────
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

  // ─── Page-kind helpers ──────────────────────────────────────────────────
  function isListPage() { return /\/list\//.test(location.pathname); }
  function isNanogenreLike() {
    return !!document.querySelector('section.genre-group ul.poster-list li[data-film-id], section.-themes ul.poster-list li[data-film-id], main ul.poster-list li[data-film-id][data-film-slug]');
  }

  // ─── Backdrop (author fanart) extractor ─────────────────────────────────
  function getAuthorFanartUrl() {
    const el = document.querySelector('div.backdropimage.js-backdrop-image');
    if (!el) return '';
    const bg = (getComputedStyle(el).backgroundImage || el.style.backgroundImage || '').trim();
    const m = bg.match(/url\(["']?([^"')]+)["']?\)/i);
    return m ? m[1] : '';
  }

  // ─── IndexedDB (v2) ─────────────────────────────────────────────────────
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

  // ─── Binary base cache loader (packed) ──────────────────────────────────
  function baseBinUrl() { return GM_GetOrSet('baseBinUrl', BASE_BIN_URL_DEFAULT); }

  let BASE_PAIRS_U32 = null;  // Uint32Array [filmId, packed, ...]
  let BASE_COUNT = 0;

  // IMPORTANT: default allowRevalidate = false (instant mode)
  async function loadBaseBinOnce({ allowRevalidate = false } = {}) {
    // 1) Load current .bin from IDB if not already in memory
    if (!BASE_PAIRS_U32) {
      const { buf } = await getBaseFromIDB();
      if (buf && buf.byteLength) {
        const u32 = new Uint32Array(buf);
        if (u32.length % 2 === 0) {
          BASE_PAIRS_U32 = u32;
          BASE_COUNT = u32.length >>> 1;
        }
      }
    }
    // 2) Optionally revalidate (ONLY when explicitly requested)
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
            if (res.status === 304) {
              GM_setValue('baseLastRevalidateTs', Date.now());
              resolve();
              return;
            }
            if (res.status >= 200 && res.status < 300 && res.response) {
              const newBuf = res.response;
              const u32 = new Uint32Array(newBuf);
              if (u32.length % 2 === 0) {
                BASE_PAIRS_U32 = u32;
                BASE_COUNT = u32.length >>> 1;
                const m = String(res.responseHeaders || '').match(/etag:\s*(.+)/i);
                const newEtag = m ? m[1].trim() : '';
                try { await putBaseToIDB(newBuf, newEtag); } catch {}
              }
              GM_setValue('baseLastRevalidateTs', Date.now());
            }
          } finally { resolve(); }
        },
        onerror: () => { resolve(); },
        ontimeout: () => { resolve(); },
      });
    });
  }

  // On-demand full refresh (button). Also stamps last revalidate time.
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
                BASE_PAIRS_U32 = u32;
                BASE_COUNT = u32.length >>> 1;
                const m = String(res.responseHeaders || '').match(/etag:\s*(.+)/i);
                const newEtag = m ? m[1].trim() : '';
                try { await putBaseToIDB(newBuf, newEtag); } catch {}
                GM_setValue('baseLastRevalidateTs', Date.now());
                alert('✅ Base cache refreshed.');
              } else {
                alert('❌ Base cache corrupt (odd length).');
              }
            } else {
              alert(`❌ Base cache HTTP ${res.status}.`);
            }
          } finally { resolve(); }
        },
        onerror: () => { alert('❌ Base cache network error.'); resolve(); },
        ontimeout: () => { alert('❌ Base cache request timed out.'); resolve(); },
      });
    });
  }

  // Monthly, non-blocking revalidation (never on FLAM run)
  async function maybeRevalidateBaseMonthly() {
    try {
      const last = GM_GetOrSet('baseLastRevalidateTs', 0);
      const now = Date.now();
      if (now - last >= THIRTY_DAYS_MS) {
        await loadBaseBinOnce({ allowRevalidate: true });
        GM_setValue('baseLastRevalidateTs', Date.now());
      }
    } catch {}
  }
  setTimeout(() => { maybeRevalidateBaseMonthly(); }, 0);

  // ─── Packed helpers & two-tier access ───────────────────────────────────
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

  // Track overrides + dirty state
  let LOCAL_OVERRIDES = null;
  let DIRTY_OVERRIDES = false;

  async function loadLocalOverridesOnce() {
    if (!LOCAL_OVERRIDES) LOCAL_OVERRIDES = await getCache(CACHE_KEY);
  }
  function overrideGetPacked(filmIdStr) {
    const v = LOCAL_OVERRIDES ? LOCAL_OVERRIDES[filmIdStr] : undefined;
    return Number.isFinite(v) ? v : undefined;
  }
  function overrideSetPacked(filmIdStr, tmdbId, isTv) {
    if (!LOCAL_OVERRIDES) LOCAL_OVERRIDES = {};
    const newPacked = (tmdbId << 1) | (isTv ? 1 : 0);
    const prev = LOCAL_OVERRIDES[filmIdStr];
    if (!Number.isFinite(prev) || prev !== newPacked) {
      LOCAL_OVERRIDES[filmIdStr] = newPacked;
      DIRTY_OVERRIDES = true;
    }
  }
  async function persistOverrides({ alsoBackup = true } = {}) {
    if (!DIRTY_OVERRIDES) return false;
    await setCache(LOCAL_OVERRIDES, CACHE_KEY);
    if (alsoBackup) {
      try {
        const snap = JSON.parse(JSON.stringify(LOCAL_OVERRIDES || {}));
        await setCache(snap, CACHE_BACKUP_KEY);
      } catch {}
    }
    DIRTY_OVERRIDES = false;
    return true;
  }

  function getFromAnyCachePacked(filmIdStr) {
    const vLocal = overrideGetPacked(filmIdStr);
    if (vLocal !== undefined) return vLocal;
    const idNum = Number(filmIdStr);
    if (Number.isFinite(idNum)) return baseLookupPacked(idNum);
    return undefined;
  }

  // ─── Kodi sender (awaitable) ────────────────────────────────────────────
  function sendToKodi(url) {
    const ip = GM_getValue('kodiIp', '').trim();
    const port = GM_getValue('kodiPort', '').trim();
    const user = GM_getValue('kodiUser', '');
    const pass = GM_getValue('kodiPass', '');

    return new Promise((resolve) => {
      if (!ip || !port) {
        alert('⚠️ Please configure Kodi IP & port in settings.');
        resolve(false);
        return;
      }
      GM_xmlhttpRequest({
        method: 'POST',
        url: `http://${ip}:${port}/jsonrpc`,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`${user}:${pass}`)
        },
        data: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'Player.Open',
          params: { item: { file: url } }
        }),
        timeout: 15000,
        onload: (res) => {
          if (res.status >= 200 && res.status < 300) {
            resolve(true);
          } else {
            alert(`❌ Kodi responded with status ${res.status}.`);
            resolve(false);
          }
        },
        onerror: () => { alert('❌ Failed to contact Kodi.'); resolve(false); },
        ontimeout: () => { alert('❌ Kodi request timed out.'); resolve(false); }
      });
    });
  }

  // ─── UI helpers (Overlay system for Mobile) ─────────────────────────────
  // Global CSS once
  GM_addStyle(`
    .lbdf-overlay { position: fixed; inset: 0; z-index: 2147483647; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,.65); padding: 12px; }
    .lbdf-panel { background: #1a1a1a; color: #eee; border: 1px solid #333; border-radius: 10px; width: min(980px, 96vw); max-height: 92vh; overflow: auto; box-shadow: 0 12px 30px rgba(0,0,0,.45); }
    .lbdf-head { position: sticky; top: 0; background: #222; display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-bottom: 1px solid #333; z-index: 1; }
    .lbdf-title { font-size: 16px; font-weight: 600; }
    .lbdf-close { background: #444; color: #fff; border: none; border-radius: 6px; padding: 6px 10px; }
    .lbdf-body { padding: 12px; }
    .lbdf-actions { position: sticky; bottom: 0; display: flex; gap: 8px; justify-content: flex-end; background: #222; padding: 10px 12px; border-top: 1px solid #333; }
    .lbdf-btn { background: #e50914; color: #fff; border: none; border-radius: 6px; padding: 8px 12px; }
    .lbdf-btn.secondary { background: #444; }
    .lbdf-pre { white-space: pre-wrap; word-break: break-word; background: #141414; border: 1px solid #333; border-radius: 8px; padding: 10px; }
    .lbdf-input, .lbdf-textarea, .lbdf-select { width: 100%; box-sizing: border-box; background: #151515; color: #eee; border: 1px solid #333; border-radius: 6px; padding: 8px; }
    .lbdf-textarea { min-height: 220px; }
    .lbdf-grid { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; }
    .lbdf-card { width: 140px; border: 1px solid #333; border-radius: 6px; overflow: hidden; background: #1a1a1a; flex: 0 0 auto; position: relative; }
    .lbdf-card img { width: 100%; height: 210px; object-fit: cover; background: #222; }
    .lbdf-badge { position: absolute; top: 6px; left: 6px; background: #e50914; color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
    .lbdf-badge.alt { background: #2d7dff; }
    .lbdf-kbd { display:inline-block; font: 12px/1.1 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Courier New", monospace; background:#111; border:1px solid #333; color:#ddd; padding:2px 6px; border-radius:4px; }
    /* Floating bar positioning (mobile bottom-right, desktop top-right) */
    .lbdf-fab { position: fixed; z-index: 2147483647; display: flex; gap: 8px; }
    .lbdf-fab button { padding: 8px 12px; border-radius: 8px; border: none; color: #fff; cursor: pointer; box-shadow: 0 6px 18px rgba(0,0,0,.25); }
    .lbdf-fab .flam { background: #e50914; text-transform: uppercase; letter-spacing: .6px; }
    .lbdf-fab .gear { background: #444; }
    @media (pointer:coarse) {
      .lbdf-fab { right: calc(env(safe-area-inset-right, 0) + 10px); bottom: calc(env(safe-area-inset-bottom, 0) + 10px); flex-direction: row; }
      .lbdf-fab button { font-size: 14px; }
    }
    @media (pointer:fine) {
      .lbdf-fab { right: 10px; top: 10px; flex-direction: row; }
      .lbdf-fab button { font-size: 12px; }
    }
  `);

  function createOverlay(titleText) {
    const overlay = document.createElement('div');
    overlay.className = 'lbdf-overlay';
    const panel = document.createElement('div');
    panel.className = 'lbdf-panel';
    const head = document.createElement('div');
    head.className = 'lbdf-head';
    const title = document.createElement('div');
    title.className = 'lbdf-title';
    title.textContent = titleText || '';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lbdf-close';
    closeBtn.textContent = 'Close';
    head.append(title, closeBtn);
    const body = document.createElement('div');
    body.className = 'lbdf-body';
    panel.append(head, body);
    overlay.append(panel);
    document.body.append(overlay);
    const close = () => { try { overlay.remove(); } catch {} };
    closeBtn.addEventListener('click', close);
    return { overlay, panel, head, body, close, closeBtn, title };
  }

  function showToast(message, onClick) {
    const t = document.createElement('div');
    t.textContent = message;
    Object.assign(t.style, {
      position: 'fixed', left: '50%', bottom: '24px', transform: 'translateX(-50%)',
      background: '#222', color: '#fff', padding: '10px 14px', borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.35)', zIndex: 2147483647, cursor: onClick ? 'pointer' : 'default'
    });
    if (onClick) t.addEventListener('click', () => { onClick(); document.body.removeChild(t); });
    document.body.append(t);
    setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 6000);
  }

  function showSideInfoNearButton(btn, lines, ms = 5000) {
    try { const prev = document.getElementById('kodi-send-info'); if (prev) prev.remove(); } catch {}
    const box = document.createElement('div');
    box.id = 'kodi-send-info';
    let topPx = 0, rightPx = 10;
    if (IS_MOBILE) {
      // place above the FAB on mobile
      topPx = Math.max(0, Math.round((window.innerHeight - 120)));
      rightPx = 10;
    } else {
      try {
        const rect = btn.getBoundingClientRect();
        topPx = Math.max(0, Math.round(rect.top + 40));
        rightPx = Math.max(10, Math.round(window.innerWidth - rect.right + 10));
      } catch { topPx = 150; rightPx = 130; }
    }
    Object.assign(box.style, {
      position: 'fixed',
      top: `${topPx}px`,
      right: `${rightPx}px`,
      background: '#1b1b1b',
      color: '#eee',
      border: '1px solid #333',
      borderRadius: '6px',
      padding: '8px 10px',
      fontSize: '12px',
      lineHeight: '1.4',
      zIndex: 2147483647,
      boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
      maxWidth: '92vw',
      pointerEvents: 'none',
      whiteSpace: 'pre-wrap'
    });
    box.innerHTML = lines.join('\n');
    document.body.append(box);
    setTimeout(() => { try { box.remove(); } catch {} }, ms);
  }

  // Editable textarea overlay (used by description editing)
  function editDescriptionOverlay(defaultDesc) {
    return new Promise(resolve => {
      const { overlay, body, close } = createOverlay('Edit Description');
      const area = document.createElement('textarea');
      area.className = 'lbdf-textarea';
      area.value = defaultDesc || '';
      const actions = document.createElement('div');
      actions.className = 'lbdf-actions';
      const saveBtn = document.createElement('button'); saveBtn.className = 'lbdf-btn'; saveBtn.textContent = 'Save';
      const cancelBtn = document.createElement('button'); cancelBtn.className = 'lbdf-btn secondary'; cancelBtn.textContent = 'Cancel';
      actions.append(saveBtn, cancelBtn);
      body.append(area, actions);
      saveBtn.onclick = () => { const val = area.value; close(); resolve(val); };
      cancelBtn.onclick = () => { close(); resolve(null); };
    });
  }

  // NEW: Action chooser overlay when "Ask each time" is selected
  function askForActionOverlay() {
    return new Promise((resolve) => {
      const { overlay, body, close } = createOverlay('Choose Action');
      const wrap = document.createElement('div');
      wrap.innerHTML = `
        <div style="font-size:13px; color:#bbb; margin:0 0 14px;">
          Which Kodi action do you want to use for this run?
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button data-act="view" class="lbdf-btn" style="flex:1;background:#444">View</button>
          <button data-act="import" class="lbdf-btn" style="flex:1;background:#e50914">Import</button>
          <button data-act="import_view" class="lbdf-btn" style="flex:1;background:#2d7dff">Import + View</button>
        </div>
      `;
      body.append(wrap);
      const finish = (val) => { close(); resolve(val); };
      body.querySelector('[data-act="view"]').onclick = () => finish('view');
      body.querySelector('[data-act="import"]').onclick = () => finish('import');
      body.querySelector('[data-act="import_view"]').onclick = () => finish('import_view');
    });
  }

  // ─── Smart Log window/overlay ───────────────────────────────────────────
  function openSmartLogWindow(linesHeaderAndEntries) {
    const w = window.open('', '_blank', 'width=1000,height=720');
    if (!w) return false;
    w.document.body.style.margin = '0';
    const pre = document.createElement('pre');
    pre.className = 'lbdf-pre';
    pre.style.margin = '0';
    pre.style.padding = '10px';
    pre.textContent = linesHeaderAndEntries.join('\n');
    w.document.body.append(pre);
    return true;
  }
  function openSmartLogOverlay(linesHeaderAndEntries) {
    const { body } = createOverlay('Smart-Match Log');
    const pre = document.createElement('pre');
    pre.className = 'lbdf-pre';
    pre.textContent = linesHeaderAndEntries.join('\n');
    body.append(pre);
    return true;
  }
  function openSmartLogUnified() {
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
    ];
    const lines = [];
    SMART_LOG
      .slice()
      .sort((a, b) => (a.listIndex || 999999) - (b.listIndex || 999999))
      .forEach(e => {
        lines.push(`#${e.listIndex || '?'}  film:${e.filmId}  ${e.lbTitle} (${e.lbYear})`);
        const topLine = e.top ? `  TMDb top:   ${e.top.title} (${e.top.release_date || 'n/a'}) [${e.top.id}]` : '  TMDb top:   n/a';
        const chLine = e.chosen ? `  Our choice: ${e.chosen.title} (${e.chosen.release_date || 'n/a'}) [${e.chosen.id}]` : '  Our choice: n/a';
        lines.push(topLine);
        lines.push(chLine);
        lines.push(`  Reasoning:  ${reasonsToText(e)}`);
        if (e.matchedDirectors?.length) lines.push(`  Match dir:  ${e.matchedDirectors.join(', ')}`);
        if (typeof e.runtimeUsed === 'number') lines.push(`  Runtime tol: ±${RUNTIME_TOL_MIN} min (LB ${e.lbRuntime}m)`);
        if (typeof e.candidates === 'number') lines.push(`  Candidates: ${e.candidates}`);
        lines.push('');
      });

    const payload = header.concat(lines);
    if (SUPPORTS_POPUPS) {
      if (openSmartLogWindow(payload)) return;
    }
    openSmartLogOverlay(payload);
  }

  // ─── Smart Log / Review Panel (desktop popup version kept) ──────────────
  function reasonsToText(entry) {
    const r = entry.reasons || [];
    const parts = [];
    const has = (k) => r.includes(k);

    if (has('manual_override')) {
      parts.push('You manually selected a different TMDb title.');
    } else if (has('exact_title_year') && has('director_match')) {
      parts.push('Exact title + year matched multiple candidates; we chose the one with a matching director.');
    } else if (has('exact_title_year') && has('runtime_match')) {
      parts.push(`Exact title + year matched multiple candidates; we chose the one matching runtime (±${RUNTIME_TOL_MIN}m).`);
    } else if (has('exact_title_year') && has('fallback_tmdb_top')) {
      parts.push('Multiple exact title + year matches; no director/runtime tie-breaker, fell back to TMDb top.');
    } else if (has('exact_title_year')) {
      parts.push('Chose an exact title + year match (TMDb top wasn’t an exact match).');
    } else if (has('exact_title_only') && has('director_match')) {
      parts.push('Title matched exactly; we used director to break ties.');
    } else if (has('exact_title_only') && has('runtime_match')) {
      parts.push(`Title matched exactly; used runtime to break ties (±${RUNTIME_TOL_MIN}m).`);
    } else if (has('exact_title_only') && has('fallback_tmdb_top')) {
      parts.push('Multiple exact title matches; no tie-breaker, fell back to TMDb top.');
    } else if (has('no_results')) {
      parts.push('TMDb search returned no results.');
    } else {
      parts.push('Chosen over TMDb top based on heuristics.');
    }
    if (entry.matchedDirectors?.length) parts.push(`Matched director(s): ${entry.matchedDirectors.join(', ')}.`);
    if (typeof entry.runtimeUsed === 'number' && typeof entry.lbRuntime === 'number') parts.push(`Letterboxd runtime ${entry.lbRuntime} min used for comparison.`);
    if (typeof entry.candidates === 'number') parts.push(`${entry.candidates} candidate(s) considered.`);
    if (has('final_retry')) parts.push('Final retry pass.');
    return parts.join(' ');
  }
  function alreadyLoggedSameChoice(filmId, chosenId) {
    return SMART_LOG.some(e =>
      e.filmId === filmId &&
      e.chosen?.id === chosenId &&
      !e.reasons.includes('manual_override') &&
      !e.reasons.includes('final_retry')
    );
  }
  function updateSmartLogButtonState() {
    const btn = document.getElementById('btnSmartLog');
    const enabled = smartLogEnabled();
    if (btn) {
      btn.disabled = !enabled || SMART_LOG.length === 0;
      btn.title = enabled ? (SMART_LOG.length ? 'Open Smart-Match Log' : 'No changes logged yet') : 'Enable logging in settings';
    }
  }

  // ─── Resolver & TMDB helpers ────────────────────────────────────────────
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
        if (r.status === 429) await new Promise(r => setTimeout(r, LBD_BACKOFF_BASE * (i + 1)));
        else return;
      } catch {
        await new Promise(r => setTimeout(r, LBD_BACKOFF_BASE * (i + 1)));
      }
    }
  }
  async function fetchTmdbSearchResults(item) {
    if (!item?.title) { item.matches = []; return; }
    const url = `https://api.themoviedb.org/3/search/movie?` +
      new URLSearchParams({ api_key: TMDB_API_KEY, query: item.title, year: item.year });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) {
          const d = await r.json();
          item.matches = Array.isArray(d.results) ? d.results : [];
          return;
        }
        if (r.status === 429) await new Promise(r => setTimeout(r, TMDB_BACKOFF_BASE * (i + 1)));
        else { item.matches = []; return; }
      } catch {
        await new Promise(r => setTimeout(r, TMDB_BACKOFF_BASE * (i + 1)));
      }
    }
    item.matches = [];
  }
  async function searchTmdb(query, year) {
    const url = `https://api.themoviedb.org/3/search/movie?` +
      new URLSearchParams({ api_key: TMDB_API_KEY, query: query, year: year || '' });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) return (await r.json()).results || [];
        if (r.status === 429) await new Promise(r => setTimeout(r, TMDB_BACKOFF_BASE * (i + 1)));
        else return [];
      } catch {
        await new Promise(r => setTimeout(r, TMDB_BACKOFF_BASE * (i + 1)));
      }
    }
    return [];
  }
  async function fetchTmdbCredits(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?` +
      new URLSearchParams({ api_key: TMDB_API_KEY });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) return r.json();
        if (r.status === 429) await new Promise(r => setTimeout(r, TMDB_BACKOFF_BASE * (i + 1)));
        else return null;
      } catch {
        await new Promise(r => setTimeout(r, TMDB_BACKOFF_BASE * (i + 1)));
      }
    }
    return null;
  }
  async function fetchTmdbDetails(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?` +
      new URLSearchParams({ api_key: TMDB_API_KEY });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try {
        const r = await fetch(url);
        if (r.ok) return r.json();
        if (r.status === 429) await new Promise(r => setTimeout(r, TMDB_BACKOFF_BASE * (i + 1)));
        else return null;
      } catch {
        await new Promise(r => setTimeout(r, TMDB_BACKOFF_BASE * (i + 1)));
      }
    }
    return null;
  }
  // Needed by resolver
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

  // ─── Smart-match logger & resolver (restored) ───────────────────────────
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
    if (exactTitleYear.length === 1) {
      const chosen = exactTitleYear[0];
      maybeLogChange(item, top, chosen, ['exact_title_year'], { candidates: 1 }, isFinalRetry);
      return chosen.id || '';
    }
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
        maybeLogChange(item, top, chosen, ['exact_title_year', 'director_match'], {
          candidates: exactTitleYear.length, matchedDirectors: dirMatches[0].matchNames
        }, isFinalRetry);
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
        maybeLogChange(item, top, chosen, ['exact_title_year', 'runtime_match'], {
          candidates: exactTitleYear.length, runtime: item.runtime
        }, isFinalRetry);
        return chosen.id || '';
      }
      if (top) {
        const chosen = top;
        maybeLogChange(item, top, chosen, ['exact_title_year', 'fallback_tmdb_top'], { candidates: exactTitleYear.length }, isFinalRetry);
        return chosen.id || '';
      }
      const chosen = exactTitleYear[0];
      maybeLogChange(item, top, chosen, ['exact_title_year'], { candidates: exactTitleYear.length }, isFinalRetry);
      return chosen.id || '';
    }

    const exactTitleOnly = results.filter(m => tmdbTitleMatches(m));
    if (exactTitleOnly.length === 1) {
      const chosen = exactTitleOnly[0];
      maybeLogChange(item, top, chosen, ['exact_title_only'], { candidates: 1 }, isFinalRetry);
      return chosen.id || '';
    }
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
        maybeLogChange(item, top, chosen, ['exact_title_only', 'director_match'], {
          candidates: exactTitleOnly.length, matchedDirectors: dirMatches[0].matchNames
        }, isFinalRetry);
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
        maybeLogChange(item, top, chosen, ['exact_title_only', 'runtime_match'], {
          candidates: exactTitleOnly.length, runtime: item.runtime
        }, isFinalRetry);
        return chosen.id || '';
      }
      if (results[0]) return results[0].id || '';
      if (exactTitleOnly.length) return exactTitleOnly[0].id || '';
    }

    if (results[0]) return results[0].id || '';
    return '';
  }

  // ─── Scrape & process items ─────────────────────────────────────────────
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
    for (let p = 1; p <= count; p++) {
      urls.push(location.origin + base + (p > 1 ? `page/${p}/` : ''));
    }
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
    const items = [];
    let idx = 0;
    lis.forEach(li => {
      const filmId = li.getAttribute('data-film-id') || '';
      if (!filmId) return;
      const ed = li.querySelector('[data-details-endpoint]');
      const detailsEndpoint = ed ? (location.origin + ed.getAttribute('data-details-endpoint')) : '';
      const img = li.querySelector('img');
      const title = (img?.getAttribute('alt') || '').trim();
      const year = li.getAttribute('data-film-release-year') || '';
      items.push({
        filmId,
        detailsEndpoint,
        title,
        year,
        originalName: '',
        directors: [],
        runtime: null,
        matches: [],
        tmdbId: '',
        isTv: false,
        listIndex: ++idx
      });
    });
    return items;
  }

  async function scrapeItemsSmart() {
    if (isListPage()) {
      return await scrapeAllItems_ListPages();
    } else if (isNanogenreLike()) {
      return scrapeNanogenreItems_CurrentPage();
    } else {
      const items = scrapeFrom(document);
      items.forEach((it, i) => it.listIndex = i + 1);
      return items;
    }
  }

  // NOTE: processItems no longer loads base; caller must ensure loaded once.
  async function processItems(items, providedOverrides = null) {
    await loadLocalOverridesOnce();
    if (providedOverrides) LOCAL_OVERRIDES = providedOverrides;

    const batchSize = parseInt(GM_GetOrSet('batchSize', DEFAULT_BATCH_SIZE), 10) || DEFAULT_BATCH_SIZE;
    const pauseMs = parseInt(GM_GetOrSet('pauseMs', DEFAULT_PAUSE_MS), 10) || DEFAULT_PAUSE_MS;

    const toFetch = [];
    items.forEach(it => {
      const packed = getFromAnyCachePacked(it.filmId);
      if (packed !== undefined) {
        const { tmdbId, isTv } = unpack(packed);
        it.tmdbId = tmdbId;
        it.isTv = isTv;
      } else {
        toFetch.push(it);
      }
    });

    const batches = [];
    for (let i = 0; i < toFetch.length; i += batchSize) {
      const batch = toFetch.slice(i, i + batchSize);
      batches.push((async () => {
        await Promise.all(batch.map(fetchLbdMetadata));
        await Promise.all(batch.map(fetchTmdbSearchResults));
        await Promise.all(batch.map(async it => {
          try {
            it.tmdbId = await resolveBestTmdbForItem(it, /*isFinalRetry=*/false);
          } catch (e) {
            console.error('resolveBestTmdbForItem failed (first pass):', it, e);
            it.tmdbId = '';
          }
          if (it.tmdbId) {
            it.isTv = false;
            overrideSetPacked(it.filmId, it.tmdbId, it.isTv);
          }
        }));
      })());
      await sleep(pauseMs);
    }
    await Promise.all(batches);
    await persistOverrides({ alsoBackup: true });

    // Final retry pass (optional)
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
            if (!hasMatches && it.title) {
              await fetchTmdbSearchResults(it);
            }
          }));
          await Promise.all(batch.map(async it => {
            try {
              it.tmdbId = await resolveBestTmdbForItem(it, /*isFinalRetry=*/true);
            } catch (e) {
              console.error('resolveBestTmdbForItem failed (final pass):', it, e);
              it.tmdbId = '';
            }
            if (it.tmdbId) {
              it.isTv = false;
              overrideSetPacked(it.filmId, it.tmdbId, it.isTv);
            }
          }));
        })());
        await sleep(pauseMs);
      }
      await Promise.all(frBatches);
      await persistOverrides({ alsoBackup: true });
    }

    return LOCAL_OVERRIDES || {};
  }

  // ─── URL builder (media_type -> media_type_default; gzip+base64 support) ─
  async function buildUrlFromCache(items, descriptionText, actionOverride = null) {
    const listItems = [];
    const defaultMt = GM_GetOrSet('defaultMediaType', DEFAULT_MEDIA_TYPE_DEFAULT); // 'm' | 'tv'

    for (const it of items) {
      let packed = getFromAnyCachePacked(it.filmId);
      let tmdbId, isTv;
      if (packed !== undefined) {
        ({ tmdbId, isTv } = unpack(packed));
      } else if (it.tmdbId) {
        tmdbId = Number(it.tmdbId);
        isTv = !!it.isTv;
      } else {
        tmdbId = '';
        isTv = false;
      }
      const itemMt = isTv ? 'tv' : 'm';
      if (itemMt === defaultMt) {
        listItems.push({ id: tmdbId });
      } else {
        listItems.push({ id: tmdbId, mt: itemMt });
      }
    }

    const rawJson = JSON.stringify(listItems);

    // Common metadata keys
    const listName = getListNameFromPage();
    const author = getListAuthorFromPage();
    let action = (typeof actionOverride === 'string') ? actionOverride : GM_getValue('kodiAction', 'import_view');
    if (action === 'ask') action = '';
    const busyIndicator = GM_GetOrSet('indicator', 'busy');
    const description = (typeof descriptionText === 'string' && descriptionText !== '') ? descriptionText : null;

    const posterEnabled = GM_GetOrSet('posterEnable', POSTER_ENABLE_DEFAULT);
    const posterStrategy = GM_GetOrSet('posterStrategy', POSTER_STRATEGY_DEFAULT);
    const fanartEnabled = GM_GetOrSet('fanartEnable', FANART_ENABLE_DEFAULT);
    const fanartStrategy = GM_GetOrSet('fanartStrategy', FANART_STRATEGY_DEFAULT);
    const fanartFallback = GM_GetOrSet('fanartFallback', FANART_FALLBACK_DEFAULT); // 'none' | 'first_4' | 'random'

    function buildCommonParts() {
      const parts = [];
      parts.push(['mode', 'personal_lists.external']);
      if (action) parts.push(['action', action]);
      parts.push(['list_type', 'tmdb']);
      parts.push(['list_name', listName]);
      parts.push(['author', author]);
      parts.push(['media_type_default', defaultMt]);
      parts.push(['busy_indicator', busyIndicator]);
      if (description != null) parts.push(['description', description]);
      if (posterEnabled) parts.push(['poster', posterStrategy]);

      if (fanartEnabled) {
        if (fanartStrategy === 'author_fanart') {
          const url = getAuthorFanartUrl();
          if (url) {
            parts.push(['fanart', url]);
          } else {
            if (fanartFallback === 'first_4' || fanartFallback === 'random') {
              parts.push(['fanart', fanartFallback]);
            }
          }
        } else {
          parts.push(['fanart', fanartStrategy]);
        }
      }
      return parts;
    }

    const commonParts = buildCommonParts();

    // Try gzip+base64
    const b64 = await gzipBase64(rawJson); // null if not supported/failed

    const encodeParts = (arr) => arr.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
    const base = 'plugin://plugin.video.fenlight/?';

    const rawParts = [...commonParts, ['list_items', rawJson]];
    const rawUrl = base + encodeParts(rawParts);
    const rawBytes = utf8ByteLen(rawUrl);

    let gzUrl = null, gzBytes = null;
    if (b64) {
      const gzParts = [...commonParts, ['base64_items', b64]];
      gzUrl = base + encodeParts(gzParts);
      gzBytes = utf8ByteLen(gzUrl);
    }

    // Choose URL: if compression succeeded, use base64_items; else list_items
    const choice = b64 ? 'base64' : 'raw';
    const url = (choice === 'base64') ? gzUrl : rawUrl;
    const urlBytes = (choice === 'base64') ? gzBytes : rawBytes;

    return {
      url,
      choice,                 // 'base64' | 'raw'
      urlBytes,               // chosen URL bytes
      rawUrl,
      rawBytes,
      gzUrl,
      gzBytes
    };
  }

  // ─── Run control to enforce single base-load per run ────────────────────
  let RUN_BASE_LOADED = false;
  async function startRun() {
    RUN_BASE_LOADED = false;
    DIRTY_OVERRIDES = false;
  }
  async function ensureBaseLoadedOnceForRun() {
    if (!RUN_BASE_LOADED) {
      await loadBaseBinOnce({ allowRevalidate: false });
      RUN_BASE_LOADED = true;
    }
  }

  // Helper to resolve action, handling "ask" by prompting user
  async function resolveActionForThisRun(contextLabel = 'FLAM') {
    const stored = GM_getValue('kodiAction', 'import_view');
    if (stored === 'ask') {
      const chosen = await askForActionOverlay();
      return chosen; // may be null (cancel)
    }
    return stored; // '', 'view', 'import', 'import_view'
  }

  // ─── Friendly soft-limit overlay ────────────────────────────────────────
  function showTooManyItemsOverlay(totalCount) {
    const { body } = createOverlay('List Too Large');
    const cap = document.createElement('div');
    cap.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="background:#e50914;width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800">!</div>
        <h2 style="margin:0;font-size:18px;">This list is a little too epic to send in one go</h2>
      </div>
      <div style="font-size:13px; color:#ccc; line-height:1.55;">
        Your list contains <strong>${totalCount.toLocaleString()}</strong> items. For reliability, sending lists over
        <strong>${MAX_LIST_ITEMS.toLocaleString()}</strong> items isn’t supported in a single run.
        <br><br>
        Try sending it in smaller parts (for example, a few pages at a time or the first 5,000), or filter the list and send again.
      </div>
    `;
    body.append(cap);
  }

  // ─── Review Panel (overlay for mobile; popup kept for desktop) ──────────
  async function openReviewPanelOverlayPromise() {
    const changed = SMART_LOG.filter(e => !e.reasons.includes('no_results'));
    if (!changed.length) { alert('No changed picks to review.'); return { action: 'close' }; }

    return new Promise(async (resolve) => {
      const { body, close } = createOverlay('Review Changes');

      const summary = document.createElement('div');
      summary.style.cssText = 'font-size:12px;color:#bbb;margin-bottom:8px';
      summary.textContent = 'Loading candidates…';
      body.append(summary);

      const wrap = document.createElement('div');
      body.append(wrap);

      let resolved = false;
      const safeResolve = (payload) => { if (!resolved) { resolved = true; resolve(payload); } };

      const changedList = SMART_LOG.filter(e => !e.reasons.includes('no_results'));
      const candidateMap = {};
      try {
        await Promise.all(changedList.map(async e => {
          const results = await searchTmdb(e.lbTitle, e.lbYear);
          const ensureIds = new Set([e.top?.id, e.chosen?.id].filter(Boolean));
          const byId = new Map(results.map(r => [r.id, r]));
          ensureIds.forEach(id => { if (id && !byId.has(id)) byId.set(id, { id, title: '(from earlier result)', release_date: '', poster_path: null }); });
          candidateMap[e.filmId] = Array.from(byId.values()).slice(0, 20);
        }));
      } catch (err) {
        summary.innerHTML = `<span style="color:#ff6b6b">Error loading candidates: ${String(err)}</span>`;
      }

      summary.textContent = `Items with changes: ${changedList.length}`;

      function posterUrl(p) { return p ? `${TMDB_IMG_BASE}${TMDB_POSTER_SIZE}${p}` : ''; }

      changedList
        .slice()
        .sort((a, b) => (a.listIndex || 999999) - (b.listIndex || 999999))
        .forEach(e => {
          const entry = document.createElement('div');
          entry.style.cssText = 'background:#141414;border:1px solid #2a2a2a;border-radius:8px;margin-bottom:12px;padding:10px';
          entry.innerHTML = `
            <div style="display:flex;gap:12px;align-items:flex-start;flex-wrap:wrap">
              <div style="min-width:260px;max-width:340px">
                <div style="font-weight:600;margin-bottom:4px;display:flex;align-items:center;gap:8px"><span style="font-size:20px;color:#ff3b3b;font-weight:800">#${e.listIndex || '?'}</span> <span>${e.lbTitle} (${e.lbYear})</span></div>
                <div style="color:#bbb;font-size:12px;margin-bottom:6px">film:${e.filmId}</div>
                <div style="color:#bbb;font-size:12px;margin-bottom:6px">Directors: ${(e.lbDirectors || []).join(', ') || '—'}</div>
                <div style="color:#bbb;font-size:12px;margin-bottom:6px">TMDb top: ${e.top ? `${e.top.title} (${e.top.release_date || 'n/a'}) [${e.top.id}]` : 'n/a'}</div>
                <div style="color:#bbb;font-size:12px;margin-bottom:6px">Our choice: ${e.chosen ? `${e.chosen.title} (${e.chosen.release_date || 'n/a'}) [${e.chosen.id}]` : 'n/a'}</div>
                <div style="color:#dcdcdc;font-size:12px;margin:6px 0 0 0">${reasonsToText(e)}</div>
              </div>
              <div class="lbdf-grid" id="grid-${e.filmId}"></div>
            </div>
          `;
          body.append(entry);

          const grid = entry.querySelector(`#grid-${e.filmId}`);
          const candidates = candidateMap[e.filmId] || [];
          const currentChosenId = e.chosen?.id || e.top?.id || null;
          if (candidates.length) {
            candidates.forEach(c => {
              const card = document.createElement('div');
              card.className = 'lbdf-card';
              card.innerHTML = `
                ${c.id === e.top?.id ? '<div class="lbdf-badge alt">TMDb top</div>' : ''}
                ${c.id === currentChosenId ? '<div class="lbdf-badge">Chosen</div>' : ''}
                <img src="${posterUrl(c.poster_path)}" alt="">
                <div style="padding:6px;font-size:12px">
                  <div style="font-weight:600">${c.title || '(no title)'}</div>
                  <div style="font-size:11px;color:#bbb">${(c.release_date || 'n/a')} [${c.id}]</div>
                  <label style="display:flex;align-items:center;gap:6px;margin-top:4px;font-size:12px">
                    <input type="radio" name="sel-${e.filmId}" value="${c.id}" ${c.id === currentChosenId ? 'checked' : ''}> Select
                  </label>
                </div>
              `;
              grid.append(card);
            });
          } else {
            const card = document.createElement('div');
            card.className = 'lbdf-card';
            card.innerHTML = `
              <div style="padding:6px;font-size:12px">
                <div style="font-weight:600">No TMDb results</div>
                <div style="font-size:11px;color:#bbb">Enter TMDb ID:</div>
                <input type="text" name="manual-${e.filmId}" class="lbdf-input">
              </div>
            `;
            grid.append(card);
          }
        });

      async function applySavesToCache() {
        await loadLocalOverridesOnce();
        let changesApplied = 0;

        for (const e of changedList) {
          const radios = body.querySelectorAll(`input[name="sel-${e.filmId}"]`);
          let selectedId = null;
          radios.forEach(r => { if (r.checked) selectedId = parseInt(r.value, 10); });
          if (!selectedId) {
            const manual = body.querySelector(`input[name="manual-${e.filmId}"]`);
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

        if (changesApplied > 0) await persistOverrides({ alsoBackup: true });
        return changesApplied;
      }

      const actions = document.createElement('div');
      actions.className = 'lbdf-actions';
      const saveSendBtn = document.createElement('button'); saveSendBtn.className = 'lbdf-btn'; saveSendBtn.textContent = 'Save & Send';
      const saveCloseBtn = document.createElement('button'); saveCloseBtn.className = 'lbdf-btn secondary'; saveCloseBtn.textContent = 'Save & Close';
      const saveBtn = document.createElement('button'); saveBtn.className = 'lbdf-btn secondary'; saveBtn.textContent = 'Save';
      const closeBtn = document.createElement('button'); closeBtn.className = 'lbdf-btn secondary'; closeBtn.textContent = 'Close';
      actions.append(saveSendBtn, saveCloseBtn, saveBtn, closeBtn);
      body.append(actions);

      closeBtn.addEventListener('click', () => { safeResolve({ action: 'close' }); close(); });
      saveBtn.addEventListener('click', async () => {
        try {
          const n = await applySavesToCache();
          summary.textContent = n ? `Saved ${n} override(s).` : `No changes to save.`;
          summary.style.color = n ? '#7bd88f' : '#bbb';
        } catch (err) { summary.textContent = `Save error: ${String(err)}`; summary.style.color = '#ff6b6b'; }
      });
      saveCloseBtn.addEventListener('click', async () => {
        try {
          const n = await applySavesToCache();
          summary.textContent = n ? `Saved ${n} override(s).` : `No changes to save.`;
          summary.style.color = n ? '#7bd88f' : '#bbb';
          safeResolve({ action: 'save-close' }); close();
        } catch (err) { summary.textContent = `Save error: ${String(err)}`; summary.style.color = '#ff6b6b'; }
      });
      saveSendBtn.addEventListener('click', async () => {
        try {
          const n = await applySavesToCache();
          summary.textContent = n ? `Saved ${n} override(s). Sending…` : `Sending…`;
          summary.style.color = '#7bd88f';
          safeResolve({ action: 'save-send' }); close();
        } catch (err) { summary.textContent = `Save error: ${String(err)}`; summary.style.color = '#ff6b6b'; }
      });
    });
  }

  // Desktop popup (original) — retained for desktop
  async function openReviewPanelPopupPromise() {
    // Reuse original implementation via an offscreen window if needed.
    // For brevity and reliability on desktop, we reuse the overlay (works well on desktop too).
    return openReviewPanelOverlayPromise();
  }

  async function openReviewPanelPromiseUnified() {
    if (SUPPORTS_POPUPS) {
      return openReviewPanelPopupPromise();
    } else {
      return openReviewPanelOverlayPromise();
    }
  }

  // ─── Cache Editor (overlay for mobile) ──────────────────────────────────
  async function openCacheEditorOverlay() {
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

    const statsHtml = (cur, bak) => {
      const curKeys = Object.keys(cur || {}).length;
      const bakKeys = Object.keys(bak || {}).length;
      let added = 0;
      if (bak && cur) {
        const bset = new Set(Object.keys(bak));
        added = Object.keys(cur).filter(k => !bset.has(k)).length;
      }
      return `Current: ${curKeys} keys  •  Backup: ${bakKeys} keys  •  Added since backup: ${added}`;
    };

    const { body } = createOverlay('Edit Overrides');
    const stats = document.createElement('div');
    stats.style.cssText = 'font-size:12px;color:#bbb;margin-bottom:8px';
    stats.textContent = statsHtml(current, backup);
    const ta = document.createElement('textarea');
    ta.className = 'lbdf-textarea';
    ta.value = JSON.stringify(current, null, 2);
    const msg = document.createElement('div');
    msg.style.cssText = 'margin-top:10px;color:#aaa;font-size:12px';

    const actions = document.createElement('div');
    actions.className = 'lbdf-actions';
    const vBtn = document.createElement('button'); vBtn.className = 'lbdf-btn secondary'; vBtn.textContent = 'Validate';
    const rBtn = document.createElement('button'); rBtn.className = 'lbdf-btn'; rBtn.style.background = '#8a2be2'; rBtn.textContent = 'Revert Additions';
    const sBtn = document.createElement('button'); sBtn.className = 'lbdf-btn'; sBtn.textContent = 'Save';
    actions.append(vBtn, rBtn, sBtn);

    body.append(stats, ta, actions, msg);

    function setMsg(text, ok = false) { msg.textContent = text; msg.style.color = ok ? '#8ee6a4' : '#aaa'; }
    function parseArea() {
      try {
        const obj = JSON.parse(ta.value);
        if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) { setMsg('JSON must be an object mapping filmId → { tmdbId, type }.'); return null; }
        return obj;
      } catch (e) { setMsg('Invalid JSON: ' + e.message); return null; }
    }
    function validateShape(obj) {
      for (const [k, v] of Object.entries(obj)) {
        if (typeof v !== 'object' || v === null) { setMsg(`Value for key ${k} must be { tmdbId, type }`); return false; }
        const tmdbId = Number(v.tmdbId);
        if (!Number.isFinite(tmdbId)) { setMsg(`tmdbId for ${k} must be a number`); return false; }
        const type = String(v.type || 'm').toLowerCase();
        if (!(type === 'm' || type === 'tv')) { setMsg(`type for ${k} must be "m" or "tv"`); return false; }
      }
      return true;
    }

    vBtn.onclick = () => {
      const obj = parseArea(); if (!obj) return;
      if (!validateShape(obj)) return;
      setMsg('Looks good ✔', true);
    };
    rBtn.onclick = () => {
      const cur = parseArea(); if (!cur) return;
      const bak = backup || {};
      const bakSet = new Set(Object.keys(bak));
      let removed = 0;
      for (const k of Object.keys(cur)) { if (!bakSet.has(k)) { delete cur[k]; removed++; } }
      ta.value = JSON.stringify(cur, null, 2);
      stats.textContent = statsHtml(cur, bak);
      setMsg(removed ? `Removed ${removed} new key(s) added since last build. Review and click Save to persist.` : 'No new keys to remove.', removed ? true : false);
    };
    sBtn.onclick = async () => {
      const obj = parseArea(); if (!obj) return;
      if (!validateShape(obj)) return;
      try {
        const packed = fromFriendly(obj);
        await setCache(packed, CACHE_KEY);
        LOCAL_OVERRIDES = packed;
        DIRTY_OVERRIDES = false;
        stats.textContent = statsHtml(obj, backup || {});
        setMsg('Saved ✔', true);
      } catch (e) { setMsg('Save failed: ' + e.message); }
    };
  }

  async function openCacheEditorUnified() {
    if (SUPPORTS_POPUPS) {
      // Popup version also works, but overlay is simpler and consistent. Use overlay.
      return openCacheEditorOverlay();
    } else {
      return openCacheEditorOverlay();
    }
  }

  function showCacheOverlay(obj) {
    const { body } = createOverlay('Overrides JSON');
    const pre = document.createElement('pre');
    pre.className = 'lbdf-pre';
    pre.textContent = JSON.stringify(obj || {}, null, 2);
    body.append(pre);
  }

  // ─── Handlers (Show URL & FLAM) ─────────────────────────────────────────
  async function handleShowUrl(btnEl) {
    if (btnEl) btnEl.disabled = true;

    await startRun();
    await ensureBaseLoadedOnceForRun();
    await loadLocalOverridesOnce();

    let items;
    try { items = await scrapeItemsSmart(); }
    catch { alert('Scrape failed'); if (btnEl) btnEl.disabled = false; return; }
    if (!items.length) { alert('No items'); if (btnEl) btnEl.disabled = false; return; }

    if (items.length > MAX_LIST_ITEMS) {
      showTooManyItemsOverlay(items.length);
      if (btnEl) { btnEl.disabled = false; }
      return;
    }

    if (isListPage()) {
      const how = prompt('How many items? number or "all":', 'all');
      if (how === null) { if (btnEl) btnEl.disabled = false; return; }
      const all = how.trim().toLowerCase() === 'all';
      const count = all ? Infinity : parseInt(how, 10);
      if (!all && (isNaN(count) || count < 1)) { alert('Invalid number'); if (btnEl) btnEl.disabled = false; return; }
      if (!all) items = items.slice(0, count);
    }

    // DESCRIPTION (default ON now)
    let descriptionText = null;
    if (GM_GetOrSet('descEnable', true)) {
      const pageDesc = getListDescriptionFromPage() || DEFAULT_DESCRIPTION;
      if (GM_GetOrSet('descMode', 'send') === 'edit') {
        const edited = await editDescriptionOverlay(pageDesc);
        if (edited === null) { if (btnEl) btnEl.disabled = false; return; }
        descriptionText = sanitizeDescPreservingBreaks(edited);
      } else { descriptionText = pageDesc; }
    }

    const startLen = SMART_LOG.length;
    await processItems(items, LOCAL_OVERRIDES);
    const changes = SMART_LOG.length - startLen;

    // Resolve action (ask if needed)
    const actionChoice = await resolveActionForThisRun('Show URL');
    if (GM_getValue('kodiAction', 'import_view') === 'ask' && !actionChoice) {
      // cancelled
      if (btnEl) { btnEl.disabled = false; }
      return;
    }

    const info = await buildUrlFromCache(items, descriptionText, actionChoice);

    // Show URL overlay with byte meter
    const { body } = createOverlay('Plugin URL');
    const area = document.createElement('textarea');
    area.className = 'lbdf-textarea';
    area.value = info.url;

    const limitBytes = 65536;
    const pctUsed = Math.min(100, Math.round((info.urlBytes / limitBytes) * 1000) / 10);
    const savings = (typeof info.gzBytes === 'number') ? (info.rawBytes - info.gzBytes) : 0;

    const meta = document.createElement('div');
    meta.style.cssText = 'margin-top:10px; padding:8px; background:#1b1b1b; border:1px solid #333; border-radius:6px; color:#ddd; font-size:12px; line-height:1.5';
    meta.innerHTML = `
      <div><strong>Raw URL:</strong> ${info.rawBytes} bytes</div>
      <div><strong>Gzip+Base64 URL:</strong> ${typeof info.gzBytes === 'number' ? info.gzBytes + ' bytes' : 'n/a (compression unavailable)'}</div>
      <div><strong>Savings:</strong> ${typeof info.gzBytes === 'number' ? (savings + ' bytes (' + (info.rawBytes ? Math.round((savings / info.rawBytes) * 100) : 0) + '%)') : '—'}</div>
      <div><strong>Using:</strong> ${info.choice === 'base64' ? 'base64_items (gzip+base64)' : 'list_items (raw JSON)'}</div>
      <div><strong>Limit usage:</strong> ${info.urlBytes} / ${limitBytes} bytes (${pctUsed}%)</div>
    `;

    const actions = document.createElement('div');
    actions.className = 'lbdf-actions';
    const copyBtn = document.createElement('button'); copyBtn.className = 'lbdf-btn'; copyBtn.textContent = 'Copy URL';
    actions.append(copyBtn);

    body.append(area, meta, actions);

    copyBtn.onclick = async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(area.value);
        } else {
          area.select();
          document.execCommand('copy');
        }
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy URL', 1200);
      } catch {
        alert('Copy failed. Select and copy manually.');
      }
    };

    if (smartLogEnabled() && changes > 0) {
      showToast(`Smart-match changed ${changes} pick${changes === 1 ? '' : 's'} — tap to review`, () => openReviewPanelPromiseUnified());
    }
    updateSmartLogButtonState();
    if (btnEl) btnEl.disabled = false;
  }

  // ─── Floating buttons (FLAM, Settings) — Always visible (mobile+desktop) ─
  const topRightBar = document.createElement('div');
  topRightBar.className = 'lbdf-fab';
  document.body.append(topRightBar);

  function makeBarButton(label, title = '', className = '') {
    const b = document.createElement('button');
    b.textContent = label;
    b.title = title || label;
    b.className = className;
    return b;
  }

  // FLAM (Send to Kodi)
  const flamBtn = makeBarButton('FLAM', 'Send to Kodi (Fenlight)', 'flam');

  // NEW: Make FLAM label tuned for mobile
  flamBtn.style.fontWeight = '600';
  flamBtn.style.lineHeight = '1.1';

  flamBtn.addEventListener('click', async function () {
    const btn = this;
    btn.disabled = true;
    const startTime = performance.now();
    btn.textContent = 'Processing…';

    await startRun();
    await ensureBaseLoadedOnceForRun();
    await loadLocalOverridesOnce();

    // Resolve action choice early (so user can cancel before heavy work)
    let actionChoice = await resolveActionForThisRun('FLAM');
    if (GM_getValue('kodiAction', 'import_view') === 'ask' && !actionChoice) {
      btn.textContent = 'Cancelled';
      setTimeout(() => { btn.textContent = 'FLAM'; btn.disabled = false; }, 1200);
      return;
    }

    let items;
    try { items = await scrapeItemsSmart(); }
    catch { alert('Scrape failed'); btn.disabled = false; btn.textContent = 'FLAM'; return; }
    if (!items.length) { alert('No items'); btn.disabled = false; btn.textContent = 'FLAM'; return; }

    // Friendly soft-limit guard for > 5,000 items (don’t send)
    if (items.length > MAX_LIST_ITEMS) {
      showTooManyItemsOverlay(items.length);
      btn.textContent = 'FLAM';
      btn.disabled = false;
      return;
    }

    // Cache hit stats BEFORE processing
    const overrides0 = await getCache(CACHE_KEY);
    let baseHitCount = 0;
    let uncachedCount = 0;
    for (const it of items) {
      const hasOverride = Number.isFinite(overrides0[it.filmId]);
      if (hasOverride) continue;
      const basePacked = baseLookupPacked(Number(it.filmId));
      if (basePacked !== undefined) baseHitCount++;
      else uncachedCount++;
    }
    btn.textContent = `Processing… (${baseHitCount} base • ${uncachedCount} uncached)`;

    // DESCRIPTION (default ON now)
    let descriptionText = null;
    if (GM_GetOrSet('descEnable', true)) {
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

    // Auto-open review BEFORE sending if enabled and there are changes
    if (smartLogEnabled() && GM_GetOrSet('smartReviewAutoOpen', false) && changes > 0) {
      const res = await openReviewPanelPromiseUnified();
      if (!res || res.action !== 'save-send') {
        btn.textContent = 'Cancelled';
        setTimeout(() => { btn.textContent = 'FLAM'; btn.disabled = false; }, 1200);
        updateSmartLogButtonState();
        return;
      }
    }

    const info = await buildUrlFromCache(items, descriptionText, actionChoice);

    const ok = await sendToKodi(info.url);
    const elapsedMs = Math.max(0, Math.round(performance.now() - startTime));
    btn.textContent = ok ? 'Sent!' : 'Failed';
    setTimeout(() => { btn.textContent = 'FLAM'; }, 1200);
    btn.disabled = false;

    // Side info box: bytes sent + % of 64KB + existing cache stats
    const limitBytes = 65536;
    const pct = Math.min(100, Math.round((info.urlBytes / limitBytes) * 1000) / 10);
    const infoLines = [
      `📦 Cache — binary: ${baseHitCount} • uncached: ${uncachedCount}`,
      `📨 Bytes sent: ${info.urlBytes} / ${limitBytes} (${pct}%) ${info.choice === 'base64' ? '[gzip+base64]' : '[raw JSON]'}`,
      `⏱ Elapsed: ${(elapsedMs / 1000).toFixed(1)}s`
    ];
    showSideInfoNearButton(btn, infoLines, 5000);

    if (smartLogEnabled() && !GM_GetOrSet('smartReviewAutoOpen', false) && changes > 0) {
      showToast(`Smart-match changed ${changes} pick${changes === 1 ? '' : 's'} — tap to review`, () => openReviewPanelPromiseUnified());
    }
    updateSmartLogButtonState();
  });

  // Settings
  const settingsBtn = makeBarButton('⚙', 'Settings', 'gear');
  settingsBtn.addEventListener('click', showSettings);

  topRightBar.append(flamBtn, settingsBtn);

  // ─── Cache Editor (used by Tools > Edit Cache) ──────────────────────────
  async function openCacheEditor() { return openCacheEditorUnified(); }

  // ─── Settings UI (Tabbed + Scrollable) ──────────────────────────────────
  function showSettings() {
    if (document.getElementById('kodisettings')) return;

    const { overlay, panel, body, close } = createOverlay('Kodi Settings');

    // Tabs header row
    const tabHeader = document.createElement('div');
    tabHeader.style.cssText = 'display:flex; gap:8px; align-items:center; justify-content:space-between; margin-bottom:8px;';
    tabHeader.innerHTML = `
      <div style="font-size:16px;font-weight:600">Kodi Settings</div>
      <div style="display:flex; gap:6px;">
        <button class="kodi-tab-btn lbdf-btn" data-tab="general" style="background:#e50914">General</button>
        <button class="kodi-tab-btn lbdf-btn secondary" data-tab="tools">Tools</button>
      </div>
    `;
    body.append(tabHeader);

    // Containers
    const tabGeneral = document.createElement('div');
    tabGeneral.id = 'kodi-tab-general';
    const tabTools = document.createElement('div');
    tabTools.id = 'kodi-tab-tools';
    tabTools.style.display = 'none';
    body.append(tabGeneral, tabTools);

    // General tab content
    tabGeneral.innerHTML = `
      <label>Kodi IP:</label>
      <input id="kodiIp" class="lbdf-input" style="margin-bottom:8px"/>

      <label>Kodi Port:</label>
      <input id="kodiPort" class="lbdf-input" style="margin-bottom:8px"/>

      <label>Kodi User:</label>
      <input id="kodiUser" class="lbdf-input" style="margin-bottom:8px"/>

      <label>Kodi Pass:</label>
      <input id="kodiPass" type="password" class="lbdf-input" style="margin-bottom:12px"/>

      <label>Default Action:</label>
      <select id="kodiAction" class="lbdf-select" style="margin-bottom:12px">
        <option value="">Omit Action key</option>
        <option value="view">view</option>
        <option value="import">import</option>
        <option value="import_view">import_view</option>
        <option value="ask">Ask each time</option>
      </select>

      <label>Busy indicator:</label>
      <select id="indicator" class="lbdf-select" style="margin-bottom:12px">
        <option value="none">none</option>
        <option value="busy">busy</option>
        <option value="progress">progress</option>
      </select>

      <label><input type="checkbox" id="descEnable"/> Add Description</label>
      <div id="descOptions" style="margin:8px 0;display:none;">
        <label>Edit mode:</label>
        <select id="descMode" class="lbdf-select" style="margin-bottom:8px">
          <option value="send">Send without editing</option>
          <option value="edit">Edit before sending</option>
        </select>
      </div>

      <hr style="border-color:#444;margin:14px 0">

      <div id="advancedGroup" style="${SHOW_ADVANCED_SETTINGS_UI ? '' : 'display:none;'}">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
          <div>
            <label>Batch size:</label>
            <input id="batchSize" type="number" min="1" step="1" class="lbdf-input"/>
          </div>
          <div>
            <label>Pause between batches (ms):</label>
            <input id="pauseMs" type="number" min="0" step="10" class="lbdf-input"/>
          </div>
          <div>
            <label>Final retry delay (ms):</label>
            <input id="finalRetryDelayMs" type="number" min="0" step="10" class="lbdf-input"/>
          </div>
          <div>
            <label>Final retry min list size:</label>
            <input id="finalRetryMinListSize" type="number" min="0" step="1" class="lbdf-input"/>
          </div>
        </div>
        <hr style="border-color:#444;margin:14px 0">
      </div>

      <label><input type="checkbox" id="smartLogEnable"/> Enable Smart-Match Logging</label><br>
      <label><input type="checkbox" id="smartReviewAutoOpen"/> Auto-open Review Panel BEFORE sending when changes occur</label>

      <hr style="border-color:#444;margin:14px 0">

      <div>
        <h3 style="margin:0 0 8px;">Artwork Options</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
          <div style="border:1px solid #333;border-radius:6px;padding:10px;">
            <label><input type="checkbox" id="posterEnable"/> Enable Poster</label>
            <div style="color:#bbb;font-size:12px;margin:6px 0 8px">Include the <span class="lbdf-kbd">poster</span> key in the URL.</div>
            <label>Poster selection:</label>
            <select id="posterStrategy" class="lbdf-select" style="margin-top:4px">
              <option value="first_4">first_4</option>
              <option value="random">random</option>
            </select>
          </div>
          <div style="border:1px solid #333;border-radius:6px;padding:10px;">
            <label><input type="checkbox" id="fanartEnable"/> Enable Fanart</label>
            <div style="color:#bbb;font-size:12px;margin:6px 0 8px">The <span class="lbdf-kbd">fanart</span> key accepts either a strategy or a direct URL.</div>
            <label>Fanart selection:</label>
            <select id="fanartStrategy" class="lbdf-select" style="margin-top:4px">
              <option value="author_fanart">author_fanart (use page backdrop)</option>
              <option value="first_4">first_4</option>
              <option value="random">random</option>
            </select>
            <div id="fanartFallbackBox" style="margin-top:8px; display:none;">
              <label>If author_fanart missing, fallback to:</label>
              <select id="fanartFallback" class="lbdf-select" style="margin-top:4px">
                <option value="none">none</option>
                <option value="first_4">first_4</option>
                <option value="random">random</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <hr style="border-color:#444;margin:14px 0">

      <div>
        <h3 style="margin:0 0 8px;">Media Type Defaults</h3>
        <label>Default media type (items w/o per-item <span class="lbdf-kbd">mt</span>):</label>
        <select id="defaultMediaType" class="lbdf-select" style="margin:6px 0 8px">
          <option value="m">m (movies)</option>
          <option value="tv">tv (TV shows)</option>
        </select>
        <div style="color:#bbb;font-size:12px;margin-top:4px">
          Top-level query key is <span class="lbdf-kbd">media_type_default</span>. Per-item <span class="lbdf-kbd">mt</span> is only added when it differs from this default.
        </div>
      </div>

      <hr style="border-color:#444;margin:14px 0">
      <div>
        <h3 style="margin:0 0 8px;">Cache Tools</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px">
          <button id="downloadCacheBtn" class="lbdf-btn">Download Overrides</button>
          <button id="refreshBaseCacheBtn" class="lbdf-btn">Refresh Base Cache</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr auto;gap:8px;align-items:end;">
          <div>
            <label>Base cache URL (.bin):</label>
            <input id="baseBinUrl" class="lbdf-input" style="margin-top:4px"/>
            <div style="color:#bbb;font-size:12px;margin-top:4px">Raw GitHub URL to lbd_tmdb_pairs_u32.bin</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button id="resetBaseBinUrlBtn" class="lbdf-btn secondary">Reset URL</button>
          </div>
        </div>
        <div id="cacheToolMsg" style="color:#bbb;font-size:12px;margin-top:8px;"></div>
      </div>

      <div style="text-align:right;margin-top:12px; position:sticky; bottom:0; background:#222; padding-top:8px;">
        <button id="kodisave" class="lbdf-btn" style="margin-right:8px">Save</button>
        <button id="kodicancel" class="lbdf-btn secondary">Close</button>
      </div>
    `;

    // Tools tab content
    tabTools.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
        <button id="btnShowUrl" class="lbdf-btn" title="Build & view plugin URL">Show URL</button>
        <button id="btnShowCache" class="lbdf-btn" title="Open overrides as JSON">Show Cache</button>
        <button id="btnEditCache" class="lbdf-btn" title="Open editor for overrides">Edit Cache</button>
        <button id="btnClearCache" class="lbdf-btn" title="Clear overrides">Clear Cache</button>
        <button id="btnSmartLog" class="lbdf-btn" title="Open Smart-Match Log" disabled>Show Smart Log</button>
        <button id="btnReviewChanges" class="lbdf-btn" title="Open Review Panel">Review Changes</button>
      </div>
      <div style="color:#bbb; font-size:12px;">
        Utilities have been moved here from the main page. Use FLAM for sending; use these tools for inspecting and tweaking.
      </div>
    `;

    // Tabs logic
    const tabBtns = body.querySelectorAll('.kodi-tab-btn');
    function activateTab(name) {
      tabBtns.forEach(b => b.classList.toggle('secondary', b.dataset.tab !== name));
      tabGeneral.style.display = name === 'general' ? 'block' : 'none';
      tabTools.style.display = name === 'tools' ? 'block' : 'none';
    }
    tabBtns.forEach(b => b.addEventListener('click', () => activateTab(b.dataset.tab)));

    // Populate (General)
    body.querySelector('#kodiIp').value = GM_getValue('kodiIp', '');
    body.querySelector('#kodiPort').value = GM_getValue('kodiPort', '');
    body.querySelector('#kodiUser').value = GM_getValue('kodiUser', '');
    body.querySelector('#kodiPass').value = GM_GetOrSet('kodiPass', '');

    // Default action is now 'import_view'
    body.querySelector('#kodiAction').value = GM_getValue('kodiAction', 'import_view');
    body.querySelector('#indicator').value = GM_GetOrSet('indicator', 'busy');

    // "Add Description" defaults to ON; mode defaults to 'send'
    body.querySelector('#descEnable').checked = GM_GetOrSet('descEnable', true);
    body.querySelector('#descMode').value = GM_GetOrSet('descMode', 'send');
    body.querySelector('#smartLogEnable').checked = smartLogEnabled();
    body.querySelector('#smartReviewAutoOpen').checked = GM_GetOrSet('smartReviewAutoOpen', false);

    // Advanced values (may be hidden but still populate)
    body.querySelector('#batchSize')?.setAttribute('value', GM_GetOrSet('batchSize', DEFAULT_BATCH_SIZE));
    body.querySelector('#pauseMs')?.setAttribute('value', GM_GetOrSet('pauseMs', DEFAULT_PAUSE_MS));
    body.querySelector('#finalRetryDelayMs')?.setAttribute('value', GM_GetOrSet('finalRetryDelayMs', DEFAULT_FINALRETRY_DELAY));
    body.querySelector('#finalRetryMinListSize')?.setAttribute('value', GM_GetOrSet('finalRetryMinListSize', DEFAULT_FINALRETRY_MIN_LIST_SIZE));

    body.querySelector('#posterEnable').checked = GM_GetOrSet('posterEnable', POSTER_ENABLE_DEFAULT);
    body.querySelector('#posterStrategy').value = GM_GetOrSet('posterStrategy', POSTER_STRATEGY_DEFAULT);

    body.querySelector('#fanartEnable').checked = GM_GetOrSet('fanartEnable', FANART_ENABLE_DEFAULT);
    body.querySelector('#fanartStrategy').value = GM_GetOrSet('fanartStrategy', FANART_STRATEGY_DEFAULT);
    body.querySelector('#fanartFallback').value = GM_GetOrSet('fanartFallback', FANART_FALLBACK_DEFAULT);
    function refreshFanartFallbackVisibility() {
      const strat = body.querySelector('#fanartStrategy').value;
      body.querySelector('#fanartFallbackBox').style.display = (strat === 'author_fanart') ? 'block' : 'none';
    }
    body.querySelector('#fanartStrategy').addEventListener('change', refreshFanartFallbackVisibility);
    refreshFanartFallbackVisibility();

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
        const a = document.createElement('a');
        a.href = url; a.download = 'lbd_tmdb_overrides.json';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setCacheMsg('Downloaded overrides.', true);
      } catch (e) {
        alert('❌ Failed to download overrides: ' + (e?.message || e));
      }
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

    body.querySelector('#kodisave').onclick = () => {
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
      GM_setValue('fanartFallback', body.querySelector('#fanartFallback').value);

      // Advanced fields may be hidden; still read them safely
      const bsEl = body.querySelector('#batchSize');
      const pmEl = body.querySelector('#pauseMs');
      const frdEl = body.querySelector('#finalRetryDelayMs');
      const frsEl = body.querySelector('#finalRetryMinListSize');
      if (bsEl) GM_setValue('batchSize', Math.max(1, parseInt(bsEl.value, 10) || DEFAULT_BATCH_SIZE));
      if (pmEl) GM_setValue('pauseMs', Math.max(0, parseInt(pmEl.value, 10) || DEFAULT_PAUSE_MS));
      if (frdEl) GM_setValue('finalRetryDelayMs', Math.max(0, parseInt(frdEl.value, 10) || DEFAULT_FINALRETRY_DELAY));
      if (frsEl) GM_setValue('finalRetryMinListSize', Math.max(0, parseInt(frsEl.value, 10) || DEFAULT_FINALRETRY_MIN_LIST_SIZE));

      GM_setValue('baseBinUrl', body.querySelector('#baseBinUrl').value.trim() || BASE_BIN_URL_DEFAULT);
      GM_setValue('defaultMediaType', body.querySelector('#defaultMediaType').value);

      close();
      alert('✅ Settings saved');
      updateSmartLogButtonState();
    };
    body.querySelector('#kodicancel').onclick = () => close();

    // Tools tab buttons
    body.querySelector('#btnShowUrl').onclick = function () { handleShowUrl(this); };
    body.querySelector('#btnShowCache').onclick = async () => {
      await loadLocalOverridesOnce();
      showCacheOverlay(LOCAL_OVERRIDES || {});
    };
    body.querySelector('#btnEditCache').onclick = openCacheEditor;
    body.querySelector('#btnClearCache').onclick = async () => { await clearCache(); LOCAL_OVERRIDES = {}; DIRTY_OVERRIDES = false; alert('Overrides cleared'); };
    body.querySelector('#btnSmartLog').onclick = () => {
      if (!SMART_LOG.length) {
        alert(smartLogEnabled() ? 'No changes logged yet.' : 'Enable logging in settings.');
        return;
      }
      openSmartLogUnified();
    };
    body.querySelector('#btnReviewChanges').onclick = () => openReviewPanelPromiseUnified();

    // Initialize
    updateSmartLogButtonState();
    activateTab('general');
  }

  // Initialize state on load (ensure both buttons visible for all devices)
  // The FAB bar is added above; nothing else needed here.

})();
