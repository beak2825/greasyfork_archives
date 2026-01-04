// ==UserScript==
// @name         Letterboxd → FLAM (Mobile Firefox) 
// @namespace    http://tampermonkey.net/
// @version      3.7.1-mobile.1
// @description  Mobile-optimized build for Firefox Android. Send Letterboxd lists and nanogenre pages to Kodi (Fenlight)
// @match        https://letterboxd.com/*/list/*
// @match        https://letterboxd.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @connect      *
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/546942/Letterboxd%20%E2%86%92%20FLAM%20%28Mobile%20Firefox%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546942/Letterboxd%20%E2%86%92%20FLAM%20%28Mobile%20Firefox%29.meta.js
// ==/UserScript==

/*
Mobile changes vs desktop:
- Replaced window.open UIs with single-page modals that stack and are scrollable
- Floating FAB (draggable) with actions: FLAM, Settings
- Mobile-safe CSS (larger taps, safe-area insets, high z-index)
- Modal number/all picker instead of window.prompt
- Slightly more conservative mobile defaults (batch/pause), but desktop defaults preserved for non-mobile
*/

(async function () {
  'use strict';

  // ─── Platform helpers ───────────────────────────────────────────────────
  const IS_MOBILE = (() => {
    const ua = navigator.userAgent || '';
    const m = /Android|iPhone|iPad|Mobile|Tablet/i.test(ua);
    const small = Math.min(window.innerWidth, window.innerHeight) < 900;
    return m || small;
  })();

  // ─── Config (defaults; user-tunable via Settings) ───────────────────────
  const TMDB_API_KEY = 'f090bb54758cabf231fb605d3e3e0468';
  const DEFAULT_BATCH_SIZE_DESKTOP = 5;
  const DEFAULT_PAUSE_MS_DESKTOP = 150;
  const DEFAULT_BATCH_SIZE_MOBILE  = 4;    // slightly gentler on mobile
  const DEFAULT_PAUSE_MS_MOBILE    = 180;  // slightly longer pause
  const DEFAULT_FINALRETRY_DELAY = 300;
  const DEFAULT_FINALRETRY_MIN_LIST_SIZE = 400;

  const DEFAULT_BATCH_SIZE = IS_MOBILE ? DEFAULT_BATCH_SIZE_MOBILE : DEFAULT_BATCH_SIZE_DESKTOP;
  const DEFAULT_PAUSE_MS   = IS_MOBILE ? DEFAULT_PAUSE_MS_MOBILE   : DEFAULT_PAUSE_MS_DESKTOP;

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

  // fanart supports 'author_fanart' (default) and fallback when missing
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

  // Soft limit for list size (friendly block for > 5000 items)
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

  // ─── Gzip+Base64 helper (works if CompressionStream is supported) ───────
  async function gzipBase64(str) {
    try {
      const enc = new TextEncoder().encode(str);
      const cs = new (self.CompressionStream || function(){throw 0;})('gzip');
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
                toast('✅ Base cache refreshed.');
              } else {
                toast('❌ Base cache corrupt (odd length).');
              }
            } else {
              toast(`❌ Base cache HTTP ${res.status}.`);
            }
          } finally { resolve(); }
        },
        onerror: () => { toast('❌ Base cache network error.'); resolve(); },
        ontimeout: () => { toast('❌ Base cache request timed out.'); resolve(); },
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

  async function loadLocalOverridesOnce() { if (!LOCAL_OVERRIDES) LOCAL_OVERRIDES = await getCache(CACHE_KEY); }
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
        toast('⚠️ Configure Kodi IP & port in Settings.');
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
          if (res.status >= 200 && res.status < 300) resolve(true);
          else { toast(`❌ Kodi responded with status ${res.status}.`); resolve(false); }
        },
        onerror: () => { toast('❌ Failed to contact Kodi.'); resolve(false); },
        ontimeout: () => { toast('❌ Kodi request timed out.'); resolve(false); }
      });
    });
  }

  // ─── Mobile UI primitives (toasts + modals + FAB) ───────────────────────
  function toast(message, onClick) {
    const t = document.createElement('div');
    t.textContent = message;
    Object.assign(t.style, {
      position: 'fixed',
      left: '50%',
      bottom: `calc(16px + env(safe-area-inset-bottom, 0px))`,
      transform: 'translateX(-50%)',
      background: '#222',
      color: '#fff',
      padding: '12px 14px',
      borderRadius: '10px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.35)',
      zIndex: 2147483647,
      cursor: onClick ? 'pointer' : 'default',
      fontSize: '14px',
      maxWidth: '88vw',
      textAlign: 'center'
    });
    if (onClick) t.addEventListener('click', () => { onClick(); document.body.removeChild(t); });
    document.body.append(t);
    setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 5000);
  }

  function modal(title, contentEl, opts = {}) {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 2147483646, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    });

    const panel = document.createElement('div');
    Object.assign(panel.style, {
      background: '#1a1a1a', color: '#eee', borderRadius: '12px',
      width: 'min(720px, 96vw)', maxHeight: '90vh', overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0,0,0,0.45)', border: '1px solid #2a2a2a',
      display: 'flex', flexDirection: 'column'
    });

    const header = document.createElement('div');
    header.textContent = title || '';
    Object.assign(header.style, {
      padding: '14px 16px', fontWeight: '600', fontSize: '16px',
      borderBottom: '1px solid #2a2a2a', background: '#202020'
    });

    const body = document.createElement('div');
    Object.assign(body.style, { padding: '12px', overflow: 'auto', flex: '1 1 auto' });
    if (contentEl) body.append(contentEl);

    const footer = document.createElement('div');
    Object.assign(footer.style, {
      padding: '10px 12px', borderTop: '1px solid #2a2a2a', background: '#202020',
      display: 'flex', gap: '8px', justifyContent: 'flex-end'
    });

    const btnClose = document.createElement('button');
    btnClose.textContent = opts.closeText || 'Close';
    styleBtn(btnClose, true);
    btnClose.onclick = () => overlay.remove();

    if (!opts.hideDefaultClose) footer.append(btnClose);

    panel.append(header, body, footer);
    overlay.append(panel);
    document.body.append(overlay);

    return { overlay, panel, header, body, footer, close: () => overlay.remove() };
  }

  function styleBtn(b, secondary = false) {
    Object.assign(b.style, {
      background: secondary ? '#444' : '#e50914',
      color: '#fff', border: 'none', borderRadius: '8px',
      padding: '10px 12px', cursor: 'pointer', fontSize: '14px', minWidth: '44px', minHeight: '36px'
    });
  }

  // Floating FAB (draggable)
  function addFAB() {
    const fab = document.createElement('div');
    fab.id = 'lbd-flam-fab';
    fab.innerHTML = `
      <div class="core">FLAM</div>
      <div class="menu">
        <button data-action="send">Send (FLAM)</button>
        <button data-action="settings">Settings</button>
        <button data-action="tools">Tools</button>
      </div>
    `;
    Object.assign(fab.style, {
      position: 'fixed',
      bottom: `calc(18px + env(safe-area-inset-bottom, 0px))`,
      right: '14px',
      width: '56px',
      height: '56px',
      zIndex: 2147483645
    });
    fab.querySelector('.core').style.cssText = `
      background:#e50914;color:#fff;width:56px;height:56px;border-radius:28px;
      display:flex;align-items:center;justify-content:center;
      font-weight:700;letter-spacing:0.6px;box-shadow:0 6px 18px rgba(0,0,0,0.35);
      user-select:none;touch-action:none;
    `;
    const menu = fab.querySelector('.menu');
    Object.assign(menu.style, {
      position: 'absolute',
      bottom: '64px',
      right: '0',
      display: 'none',
      flexDirection: 'column',
      gap: '8px',
      minWidth: '160px'
    });
    const makeMenuBtn = (el) => {
      styleBtn(el, true);
      el.style.textAlign = 'left';
      el.style.borderRadius = '10px';
      el.style.background = '#2a2a2a';
      el.style.border = '1px solid #3a3a3a';
      el.style.padding = '10px 12px';
      el.style.width = 'auto';
    };
    menu.querySelectorAll('button').forEach(makeMenuBtn);

    let open = false;
    const core = fab.querySelector('.core');
    core.addEventListener('click', () => {
      open = !open;
      menu.style.display = open ? 'flex' : 'none';
    });
    // Drag
    let dragging = false, sx=0, sy=0, bx=0, by=0;
    const start = (e) => {
      dragging = true;
      const t = e.touches ? e.touches[0] : e;
      sx = t.clientX; sy = t.clientY;
      const r = fab.getBoundingClientRect();
      bx = r.right; by = r.bottom;
      e.preventDefault();
    };
    const move = (e) => {
      if (!dragging) return;
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - sx;
      const dy = t.clientY - sy;
      const nb = by + dy;
      const nr = bx + dx;
      fab.style.right = `${Math.max(6, window.innerWidth - nr)}px`;
      fab.style.bottom = `${Math.max(6, window.innerHeight - nb)}px`;
    };
    const end = () => { dragging = false; };
    core.addEventListener('mousedown', start); document.addEventListener('mousemove', move); document.addEventListener('mouseup', end);
    core.addEventListener('touchstart', start, {passive:false}); document.addEventListener('touchmove', move, {passive:false}); document.addEventListener('touchend', end);

    // Actions
    menu.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      menu.style.display = 'none'; open = false;
      const act = b.dataset.action;
      if (act === 'send') flamFlow();
      else if (act === 'settings') showSettings();
      else if (act === 'tools') showToolsPanel();
    });

    document.body.append(fab);
  }

  // ─── In-page Modals replacing window.open / prompt ──────────────────────
  function confirmHowManyModal(totalCount) {
    return new Promise((resolve) => {
      const box = document.createElement('div');
      box.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:10px">
          <div style="color:#ccc">Send how many items from this page/list?</div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <input id="m-count" type="number" min="1" placeholder="e.g., 50" inputmode="numeric"
                   style="flex:1 1 160px;background:#222;color:#eee;border:1px solid #444;border-radius:10px;padding:10px 12px;font-size:16px">
            <button id="m-all">All (${totalCount})</button>
          </div>
        </div>
      `;
      const { overlay, footer, close } = modal('How many items?', box);
      const btnOk = document.createElement('button'); btnOk.textContent = 'OK'; styleBtn(btnOk);
      const btnCancel = document.createElement('button'); btnCancel.textContent = 'Cancel'; styleBtn(btnCancel, true);
      footer.append(btnCancel, btnOk);
      box.querySelector('#m-all').onclick = () => { resolve({ all:true }); close(); };
      btnCancel.onclick = () => { resolve(null); close(); };
      btnOk.onclick = () => {
        const v = parseInt(box.querySelector('#m-count').value, 10);
        if (Number.isFinite(v) && v > 0) { resolve({ all:false, count:v }); close(); }
      };
    });
  }

  function bigTextareaModal(title, initial, extraInfoHTML, opts = {}) {
    return new Promise((resolve) => {
      const cont = document.createElement('div');
      cont.innerHTML = `
        ${extraInfoHTML || ''}
        <textarea style="width:100%;height:320px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px;font-size:14px;white-space:pre-wrap">${initial || ''}</textarea>
      `;
      const { overlay, footer, close } = modal(title, cont);
      const btnCopy = document.createElement('button'); btnCopy.textContent = 'Copy'; styleBtn(btnCopy, true);
      const btnOk = document.createElement('button'); btnOk.textContent = opts.okText || 'Close'; styleBtn(btnOk);
      footer.append(btnCopy, btnOk);
      btnCopy.onclick = async () => {
        const ta = cont.querySelector('textarea');
        try {
          await navigator.clipboard.writeText(ta.value);
          btnCopy.textContent = 'Copied!';
          setTimeout(()=>btnCopy.textContent='Copy',1200);
        } catch { ta.select(); document.execCommand('copy'); }
      };
      btnOk.onclick = () => { close(); resolve(true); };
    });
  }

  function editDescriptionOverlay(defaultDesc) {
    return new Promise(resolve => {
      const cont = document.createElement('div');
      cont.innerHTML = `
        <div style="color:#bbb;font-size:13px;margin:0 0 8px">Edit the description to send with this list.</div>
        <textarea id="kodieditdesc_text" style="width:100%; height:300px; font-size:14px; box-sizing:border-box; background:#181818; color:#ddd; border:1px solid #333; border-radius:10px; padding:10px; white-space:pre-wrap;">${defaultDesc}</textarea>
      `;
      const { overlay, footer, close } = modal('Edit Description', cont);
      const btnSave = document.createElement('button'); btnSave.textContent = 'Save'; styleBtn(btnSave);
      const btnCancel = document.createElement('button'); btnCancel.textContent = 'Cancel'; styleBtn(btnCancel, true);
      footer.append(btnCancel, btnSave);
      btnSave.onclick = () => { const val = cont.querySelector('#kodieditdesc_text').value; close(); resolve(val); };
      btnCancel.onclick = () => { close(); resolve(null); };
    });
  }

  function askForActionOverlay() {
    return new Promise((resolve) => {
      const cont = document.createElement('div');
      cont.innerHTML = `
        <div style="font-size:13px; color:#bbb; margin:0 0 14px;">
          Which Kodi action do you want to use for this run?
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button id="actView">View</button>
          <button id="actImport">Import</button>
          <button id="actImportView">Import + View</button>
        </div>
      `;
      const { footer, close } = modal('Choose Action', cont);
      ['actView','actImport','actImportView'].forEach(id=>{
        const b = cont.querySelector('#'+id); styleBtn(b, id!=='actImportView'); b.style.minWidth='120px';
      });
      const btnCancel = document.createElement('button'); btnCancel.textContent = 'Cancel'; styleBtn(btnCancel, true); footer.append(btnCancel);
      const finish = (val) => { close(); resolve(val); };
      cont.querySelector('#actView').onclick = () => finish('view');
      cont.querySelector('#actImport').onclick = () => finish('import');
      cont.querySelector('#actImportView').onclick = () => finish('import_view');
      btnCancel.onclick = () => finish(null);
    });
  }

  // ─── Smart Log / Review Panel (now as modals) ───────────────────────────
  function reasonsToText(entry) {
    const r = entry.reasons || [];
    const parts = [];
    const has = (k) => r.includes(k);

    if (has('manual_override')) {
      parts.push('You manually selected a different TMDb title.');
    } else if (has('exact_title_year') && has('director_match')) {
      parts.push('Exact title + year matched multiple candidates; chose the one with a matching director.');
    } else if (has('exact_title_year') && has('runtime_match')) {
      parts.push(`Exact title + year matched multiple candidates; used runtime (±${RUNTIME_TOL_MIN}m).`);
    } else if (has('exact_title_year') && has('fallback_tmdb_top')) {
      parts.push('Multiple exact title + year matches; no tie-breaker, fell back to TMDb top.');
    } else if (has('exact_title_year')) {
      parts.push('Chose an exact title + year match (TMDb top wasn’t exact).');
    } else if (has('exact_title_only') && has('director_match')) {
      parts.push('Title matched exactly; used director to break ties.');
    } else if (has('exact_title_only') && has('runtime_match')) {
      parts.push(`Title matched exactly; used runtime tie-breaker (±${RUNTIME_TOL_MIN}m).`);
    } else if (has('exact_title_only') && has('fallback_tmdb_top')) {
      parts.push('Multiple exact title matches; fell back to TMDb top.');
    } else if (has('no_results')) {
      parts.push('TMDb search returned no results.');
    } else {
      parts.push('Chosen over TMDb top based on heuristics.');
    }
    if (entry.matchedDirectors?.length) parts.push(`Matched director(s): ${entry.matchedDirectors.join(', ')}.`);
    if (typeof entry.runtimeUsed === 'number' && typeof entry.lbRuntime === 'number') parts.push(`LB runtime ${entry.lbRuntime}m used.`);
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
  function openSmartLogModal() {
    if (!SMART_LOG.length) { toast(smartLogEnabled() ? 'No changes logged yet.' : 'Enable logging in settings.'); return; }
    const pre = document.createElement('pre');
    pre.style.whiteSpace = 'pre-wrap';
    pre.style.wordBreak = 'break-word';
    pre.style.margin = '0';
    pre.style.fontSize = '12px';
    const listName = getListNameFromPage();
    const autoChanges = SMART_LOG.filter(e => !e.reasons.includes('manual_override')).length;
    const manualChanges = SMART_LOG.filter(e => e.reasons.includes('manual_override')).length;
    const byReason = {};
    SMART_LOG.forEach(e => e.reasons.forEach(r => byReason[r] = (byReason[r] || 0) + 1));
    const header = [
      `Smart-Match Log — ${new Date().toLocaleString()}`,
      `List: ${listName}`,
      `Auto changes: ${autoChanges}  •  Manual overrides: ${manualChanges}`,
      `Reasons: ${Object.keys(byReason).map(k => `${k}:${byReason[k]}`).join('  ') || '—'}`
    ].join('\n');
    const lines = [header, ''];
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
    pre.textContent = lines.join('\n');

    const { footer } = modal('Smart-Match Log', pre);
    const btnCopy = document.createElement('button'); btnCopy.textContent = 'Copy All'; styleBtn(btnCopy, true);
    footer.prepend(btnCopy);
    btnCopy.onclick = async () => {
      try { await navigator.clipboard.writeText(pre.textContent); btnCopy.textContent='Copied!'; setTimeout(()=>btnCopy.textContent='Copy All',1200); }
      catch {}
    };
  }

  async function openReviewPanelModal() {
    const changed = SMART_LOG.filter(e => !e.reasons.includes('no_results'));
    if (!changed.length) { toast('No changed picks to review.'); return { action: 'close' }; }

    // Container
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;gap:12px';
    const sum = document.createElement('div');
    sum.style.cssText = 'font-size:12px;color:#bbb';
    sum.textContent = 'Loading candidates…';
    wrap.append(sum);

    // Modal
    const { footer, body, close } = modal('Review Changes', wrap);
    const btnSaveSend = document.createElement('button'); btnSaveSend.textContent = 'Save & Send'; styleBtn(btnSaveSend);
    const btnSaveClose = document.createElement('button'); btnSaveClose.textContent = 'Save & Close'; styleBtn(btnSaveClose, true);
    const btnSave = document.createElement('button'); btnSave.textContent = 'Save'; styleBtn(btnSave, true);
    footer.append(btnSaveSend, btnSaveClose, btnSave);

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
    } catch (err) {
      sum.innerHTML = `<span style="color:#ff6b6b">Error loading candidates: ${String(err)}</span>`;
    }
    sum.textContent = `Items with changes: ${changed.length}`;

    function posterUrl(p) { return p ? `${TMDB_IMG_BASE}${TMDB_POSTER_SIZE}${p}` : ''; }

    changed
      .slice()
      .sort((a, b) => (a.listIndex || 999999) - (b.listIndex || 999999))
      .forEach(e => {
        const card = document.createElement('div');
        card.style.cssText = 'background:#141414;border:1px solid #2a2a2a;border-radius:12px;padding:10px';
        const dirs = (e.lbDirectors || []).join(', ') || '—';
        const reasoning = reasonsToText(e);

        const info = document.createElement('div');
        info.innerHTML = `
          <div style="font-weight:700;display:flex;gap:8px;align-items:center">
            <span style="color:#ff3b3b;font-size:18px">#${e.listIndex || '?'}</span>
            <span>${e.lbTitle} (${e.lbYear})</span>
          </div>
          <div style="color:#bbb;font-size:12px">film:${e.filmId}</div>
          <div style="color:#bbb;font-size:12px">Directors: ${dirs}</div>
          <div style="color:#bbb;font-size:12px">TMDb top: ${e.top ? `${e.top.title} (${e.top.release_date || 'n/a'}) [${e.top.id}]` : 'n/a'}</div>
          <div style="color:#bbb;font-size:12px">Our choice: ${e.chosen ? `${e.chosen.title} (${e.chosen.release_date || 'n/a'}) [${e.chosen.id}]` : 'n/a'}</div>
          <div style="color:#dcdcdc;font-size:12px;margin-top:6px">${reasoning}</div>
        `;

        const grid = document.createElement('div');
        grid.style.cssText = 'display:flex;gap:10px;overflow-x:auto;padding:6px 0';

        const candidates = candidateMap[e.filmId] || [];
        const currentChosenId = e.chosen?.id || e.top?.id || null;

        if (candidates.length) {
          candidates.forEach(c => {
            const tile = document.createElement('div');
            tile.style.cssText = 'width:140px;border:1px solid #333;border-radius:10px;overflow:hidden;background:#1a1a1a;flex:0 0 auto;position:relative';
            tile.innerHTML = `
              ${c.id === e.top?.id ? '<div style="position:absolute;top:6px;left:6px;background:#2d7dff;color:#fff;font-size:10px;padding:2px 6px;border-radius:6px">TMDb top</div>' : ''}
              ${c.id === currentChosenId ? '<div style="position:absolute;top:6px;right:6px;background:#e50914;color:#fff;font-size:10px;padding:2px 6px;border-radius:6px">Chosen</div>' : ''}
              <img src="${posterUrl(c.poster_path)}" alt="" style="width:100%;height:210px;object-fit:cover;background:#222">
              <div style="padding:6px;font-size:12px">
                <div style="font-weight:600">${c.title || '(no title)'}</div>
                <div style="font-size:11px;color:#bbb">${(c.release_date || 'n/a')} [${c.id}]</div>
                <label style="display:flex;align-items:center;gap:6px;margin-top:4px;font-size:12px">
                  <input type="radio" name="sel-${e.filmId}" value="${c.id}" ${c.id === currentChosenId ? 'checked' : ''}> Select
                </label>
              </div>
            `;
            grid.append(tile);
          });
        } else {
          const empty = document.createElement('div');
          empty.style.cssText = 'width:240px;border:1px solid #333;border-radius:10px;background:#1a1a1a;padding:10px';
          empty.innerHTML = `
            <div style="font-weight:600">No TMDb results</div>
            <div style="font-size:11px;color:#bbb">Enter TMDb ID:</div>
            <input type="text" name="manual-${e.filmId}" style="width:100%;box-sizing:border-box;background:#222;color:#eee;border:1px solid #444;border-radius:8px;padding:8px 10px;font-size:12px;margin-top:4px" inputmode="numeric">
          `;
          grid.append(empty);
        }

        card.append(info, grid);
        wrap.append(card);
      });

    async function applySaves(doc) {
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
      if (changesApplied > 0) await persistOverrides({ alsoBackup: true });
      return changesApplied;
    }

    btnSave.onclick = async () => {
      const n = await applySaves(body);
      sum.textContent = n ? `Saved ${n} override(s).` : `No changes to save.`;
    };
    btnSaveClose.onclick = async () => {
      const n = await applySaves(body);
      sum.textContent = n ? `Saved ${n} override(s).` : `No changes to save.`;
      close();
    };
    btnSaveSend.onclick = async () => {
      const n = await applySaves(body);
      sum.textContent = n ? `Saved ${n} override(s). Sending…` : `Sending…`;
      close();
      await flamFlow(/*forceAction*/null, /*reviewWasOpen*/true);
    };

    return { action: 'open' };
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
        if (r.status === 429) await sleep(LBD_BACKOFF_BASE * (i + 1));
        else return;
      } catch { await sleep(LBD_BACKOFF_BASE * (i + 1)); }
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
        if (r.status === 429) await sleep(TMDB_BACKOFF_BASE * (i + 1));
        else { item.matches = []; return; }
      } catch { await sleep(TMDB_BACKOFF_BASE * (i + 1)); }
    }
    item.matches = [];
  }
  async function searchTmdb(query, year) {
    const url = `https://api.themoviedb.org/3/search/movie?` +
      new URLSearchParams({ api_key: TMDB_API_KEY, query: query, year: year || '' });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try { const r = await fetch(url); if (r.ok) return (await r.json()).results || []; if (r.status === 429) await sleep(TMDB_BACKOFF_BASE * (i + 1)); else return []; }
      catch { await sleep(TMDB_BACKOFF_BASE * (i + 1)); }
    }
    return [];
  }
  async function fetchTmdbCredits(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?` + new URLSearchParams({ api_key: TMDB_API_KEY });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try { const r = await fetch(url); if (r.ok) return r.json(); if (r.status === 429) await sleep(TMDB_BACKOFF_BASE * (i + 1)); else return null; }
      catch { await sleep(TMDB_BACKOFF_BASE * (i + 1)); }
    }
    return null;
  }
  async function fetchTmdbDetails(id) {
    const url = `https://api.themoviedb.org/3/movie/${id}?` + new URLSearchParams({ api_key: TMDB_API_KEY });
    for (let i = 0; i < TMDB_MAX_RETRIES; i++) {
      try { const r = await fetch(url); if (r.ok) return r.json(); if (r.status === 429) await sleep(TMDB_BACKOFF_BASE * (i + 1)); else return null; }
      catch { await sleep(TMDB_BACKOFF_BASE * (i + 1)); }
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
        filmId, detailsEndpoint, title, year,
        originalName: '', directors: [], runtime: null,
        matches: [], tmdbId: '', isTv:false, listIndex: ++idx
      });
    });
    return items;
  }

  async function scrapeItemsSmart() {
    if (isListPage()) return await scrapeAllItems_ListPages();
    if (isNanogenreLike()) return scrapeNanogenreItems_CurrentPage();
    const items = scrapeFrom(document);
    items.forEach((it, i) => it.listIndex = i + 1);
    return items;
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
          try { it.tmdbId = await resolveBestTmdbForItem(it, /*isFinalRetry=*/false); }
          catch (e) { console.error('resolveBestTmdbForItem failed (first pass):', it, e); it.tmdbId = ''; }
          if (it.tmdbId) { it.isTv = false; overrideSetPacked(it.filmId, it.tmdbId, it.isTv); }
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
            if (!hasMatches && it.title) await fetchTmdbSearchResults(it);
          }));
          await Promise.all(batch.map(async it => {
            try { it.tmdbId = await resolveBestTmdbForItem(it, /*isFinalRetry=*/true); }
            catch (e) { console.error('resolveBestTmdbForItem failed (final pass):', it, e); it.tmdbId = ''; }
            if (it.tmdbId) { it.isTv = false; overrideSetPacked(it.filmId, it.tmdbId, it.isTv); }
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
      if (itemMt === defaultMt) listItems.push({ id: tmdbId });
      else listItems.push({ id: tmdbId, mt: itemMt });
    }

    const rawJson = JSON.stringify(listItems);

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
          if (url) parts.push(['fanart', url]);
          else if (fanartFallback === 'first_4' || fanartFallback === 'random') parts.push(['fanart', fanartFallback]);
        } else {
          parts.push(['fanart', fanartStrategy]);
        }
      }
      return parts;
    }

    const commonParts = buildCommonParts();

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

    const choice = b64 ? 'base64' : 'raw';
    const url = (choice === 'base64') ? gzUrl : rawUrl;
    const urlBytes = (choice === 'base64') ? gzBytes : rawBytes;

    return { url, choice, urlBytes, rawUrl, rawBytes, gzUrl, gzBytes };
  }

  // ─── Run control to enforce single base-load per run ────────────────────
  let RUN_BASE_LOADED = false;
  async function startRun() { RUN_BASE_LOADED = false; DIRTY_OVERRIDES = false; }
  async function ensureBaseLoadedOnceForRun() {
    if (!RUN_BASE_LOADED) { await loadBaseBinOnce({ allowRevalidate: false }); RUN_BASE_LOADED = true; }
  }
  async function resolveActionForThisRun() {
    const stored = GM_getValue('kodiAction', 'import_view');
    if (stored === 'ask') return await askForActionOverlay();
    return stored;
  }

  // ─── Friendly soft-limit overlay ────────────────────────────────────────
  function showTooManyItemsOverlay(totalCount) {
    const box = document.createElement('div');
    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <div style="background:#e50914;width:28px;height:28px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-weight:800">!</div>
        <h3 style="margin:0;font-size:18px">This list is a little too epic to send in one go</h3>
      </div>
      <div style="font-size:13px; color:#ccc; line-height:1.55;">
        Your list contains <strong>${totalCount.toLocaleString()}</strong> items. For reliability, sending lists over
        <strong>${MAX_LIST_ITEMS.toLocaleString()}</strong> items isn’t supported in a single run.
        <br><br>
        Try sending it in smaller parts (for example, a few pages at a time or the first 5,000), or filter the list and send again.
      </div>
    `;
    modal('Too many items', box);
  }

  // ─── Core flows: Show URL & FLAM send ───────────────────────────────────
  async function handleShowUrl() {
    await startRun();
    await ensureBaseLoadedOnceForRun();
    await loadLocalOverridesOnce();

    let items;
    try { items = await scrapeItemsSmart(); }
    catch { toast('Scrape failed'); return; }
    if (!items.length) { toast('No items'); return; }

    if (items.length > MAX_LIST_ITEMS) { showTooManyItemsOverlay(items.length); return; }

    if (isListPage()) {
      const res = await confirmHowManyModal(items.length);
      if (!res) return;
      if (!res.all) items = items.slice(0, res.count);
    }

    // DESCRIPTION (default ON now)
    let descriptionText = null;
    if (GM_GetOrSet('descEnable', true)) {
      const pageDesc = getListDescriptionFromPage() || DEFAULT_DESCRIPTION;
      if (GM_GetOrSet('descMode', 'send') === 'edit') {
        const edited = await editDescriptionOverlay(pageDesc);
        if (edited === null) return;
        descriptionText = sanitizeDescPreservingBreaks(edited);
      } else { descriptionText = pageDesc; }
    }

    const startLen = SMART_LOG.length;
    await processItems(items, LOCAL_OVERRIDES);
    const changes = SMART_LOG.length - startLen;

    const actionChoice = await resolveActionForThisRun();
    if (GM_getValue('kodiAction', 'import_view') === 'ask' && !actionChoice) return;

    const info = await buildUrlFromCache(items, descriptionText, actionChoice);

    const limitBytes = 65536;
    const pctUsed = Math.min(100, Math.round((info.urlBytes / limitBytes) * 1000) / 10);
    const savings = (typeof info.gzBytes === 'number') ? (info.rawBytes - info.gzBytes) : 0;
    const extra = `
      <div style="margin:10px 0; padding:8px; background:#1b1b1b; border:1px solid #333; border-radius:10px; color:#ddd; font-size:12px; line-height:1.5">
        <div><strong>Raw URL:</strong> ${info.rawBytes} bytes</div>
        <div><strong>Gzip+Base64 URL:</strong> ${typeof info.gzBytes === 'number' ? info.gzBytes + ' bytes' : 'n/a (compression unavailable)'}</div>
        <div><strong>Savings:</strong> ${typeof info.gzBytes === 'number' ? (savings + ' bytes (' + (info.rawBytes ? Math.round((savings / info.rawBytes) * 100) : 0) + '%)') : '—'}</div>
        <div><strong>Using:</strong> ${info.choice === 'base64' ? 'base64_items (gzip+base64)' : 'list_items (raw JSON)'}</div>
        <div><strong>Limit usage:</strong> ${info.urlBytes} / ${limitBytes} bytes (${pctUsed}%)</div>
      </div>
    `;
    await bigTextareaModal('FLAM URL', info.url, extra);

    if (smartLogEnabled() && changes > 0) {
      toast(`Smart-match changed ${changes} pick${changes === 1 ? '' : 's'} — tap to review`, () => openReviewPanelModal());
    }
  }

  async function flamFlow(forceAction = null, reviewWasOpen = false) {
    const startTime = performance.now();

    await startRun();
    await ensureBaseLoadedOnceForRun();
    await loadLocalOverridesOnce();

    let actionChoice = forceAction ?? await resolveActionForThisRun();
    if (GM_getValue('kodiAction', 'import_view') === 'ask' && !actionChoice) { toast('Cancelled'); return; }

    let items;
    try { items = await scrapeItemsSmart(); }
    catch { toast('Scrape failed'); return; }
    if (!items.length) { toast('No items'); return; }

    if (items.length > MAX_LIST_ITEMS) { showTooManyItemsOverlay(items.length); return; }

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

    // DESCRIPTION
    let descriptionText = null;
    if (GM_GetOrSet('descEnable', true)) {
      const pageDesc = getListDescriptionFromPage() || DEFAULT_DESCRIPTION;
      if (GM_GetOrSet('descMode', 'send') === 'edit') {
        const edited = await editDescriptionOverlay(pageDesc);
        if (edited === null) { toast('Cancelled'); return; }
        descriptionText = sanitizeDescPreservingBreaks(edited);
      } else { descriptionText = pageDesc; }
    }

    const startLen = SMART_LOG.length;
    await processItems(items, LOCAL_OVERRIDES);
    const changes = SMART_LOG.length - startLen;

    // Auto-open review BEFORE sending if enabled and there are changes
    if (smartLogEnabled() && GM_GetOrSet('smartReviewAutoOpen', false) && changes > 0 && !reviewWasOpen) {
      const res = await openReviewPanelModal();
      if (!res || res.action !== 'open') { /* user will continue via Save & Send */ return; }
    }

    const info = await buildUrlFromCache(items, descriptionText, actionChoice);
    const ok = await sendToKodi(info.url);
    const elapsedMs = Math.max(0, Math.round(performance.now() - startTime));
    toast(ok ? '✅ Sent to Kodi' : '❌ Send failed');

    const limitBytes = 65536;
    const pct = Math.min(100, Math.round((info.urlBytes / limitBytes) * 1000) / 10);
    toast(`📦 Cache — binary: ${baseHitCount} • uncached: ${uncachedCount}\n📨 Bytes: ${info.urlBytes} / ${limitBytes} (${pct}%) ${info.choice === 'base64' ? '[gzip+base64]' : '[raw JSON]'}\n⏱ ${(elapsedMs / 1000).toFixed(1)}s`);

    if (smartLogEnabled() && !GM_GetOrSet('smartReviewAutoOpen', false) && changes > 0) {
      toast(`Smart-match changed ${changes} pick${changes === 1 ? '' : 's'} — tap to review`, () => openReviewPanelModal());
    }
  }

  // ─── Tools Panel (Show URL, Show/Edit/Clear Cache, Smart Log, Review) ───
  function showToolsPanel() {
    const cont = document.createElement('div');
    cont.innerHTML = `
      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
        <button id="btnShowUrl" title="Build & view plugin URL">Show URL</button>
        <button id="btnShowCache" title="Open overrides as JSON">Show Cache</button>
        <button id="btnEditCache" title="Open editor for overrides">Edit Cache</button>
        <button id="btnClearCache" title="Clear overrides">Clear Cache</button>
        <button id="btnSmartLog" title="Open Smart-Match Log">Show Smart Log</button>
        <button id="btnReviewChanges" title="Open Review Panel">Review Changes</button>
      </div>
      <div style="color:#bbb; font-size:12px;">Utilities have been moved here. Use the FAB for sending.</div>
    `;
    const { body, footer, close } = modal('Tools', cont);
    cont.querySelectorAll('button').forEach(b => styleBtn(b, true));
    cont.querySelector('#btnShowUrl').onclick = async () => { await handleShowUrl(); };
    cont.querySelector('#btnShowCache').onclick = async () => {
      await loadLocalOverridesOnce();
      const pre = document.createElement('pre');
      pre.style.cssText = 'white-space:pre-wrap;word-break:break-word;margin:0;font-size:12px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px';
      pre.textContent = JSON.stringify(LOCAL_OVERRIDES || {}, null, 2);
      const { footer: f } = modal('Overrides JSON', pre);
      const c = document.createElement('button'); c.textContent = 'Copy'; styleBtn(c, true); f.prepend(c);
      c.onclick = async () => { try { await navigator.clipboard.writeText(pre.textContent); c.textContent='Copied!'; setTimeout(()=>c.textContent='Copy',1200);} catch{} };
    };
    cont.querySelector('#btnEditCache').onclick = openCacheEditorModal;
    cont.querySelector('#btnClearCache').onclick = async () => { await clearCache(); LOCAL_OVERRIDES = {}; DIRTY_OVERRIDES = false; toast('Overrides cleared'); };
    cont.querySelector('#btnSmartLog').onclick = openSmartLogModal;
    cont.querySelector('#btnReviewChanges').onclick = openReviewPanelModal;

    const btnClose = document.createElement('button'); btnClose.textContent = 'Close'; styleBtn(btnClose);
    footer.append(btnClose); btnClose.onclick = close;
  }

  // ─── Cache Editor (modal) ───────────────────────────────────────────────
  async function openCacheEditorModal() {
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

    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <div class="stats" style="font-size:12px;color:#bbb;margin-bottom:8px">${statsHtml(current, backup)}</div>
      <textarea id="cacheArea" style="width:100%;height:420px;box-sizing:border-box;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px;font-family:ui-monospace, Menlo, Consolas, monospace;font-size:12px">${JSON.stringify(current, null, 2)}</textarea>
      <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap">
        <button id="validateBtn" class="secondary">Validate</button>
        <button id="revertBtn" class="secondary">Revert Additions (since last build)</button>
        <button id="saveBtn">Save</button>
      </div>
      <div id="msg" style="margin-top:8px;color:#aaa;font-size:12px"></div>
    `;
    const { body, footer, close } = modal('Edit Overrides', wrap);
    const msg = wrap.querySelector('#msg');
    function setMsg(text, ok = false) { msg.textContent = text; msg.style.color = ok ? '#7bd88f' : '#aaa'; }
    wrap.querySelectorAll('button').forEach(b => styleBtn(b, b.id!=='saveBtn'));

    function parseArea() {
      try {
        const obj = JSON.parse(wrap.querySelector('#cacheArea').value);
        if (typeof obj !== 'object' || Array.isArray(obj) || obj === null) { setMsg('JSON must be an object mapping filmId → { tmdbId, type }.'); return null; }
        return obj;
      } catch (e) { setMsg('Invalid JSON: ' + e.message); return null; }
    }
    function validateShape(obj) {
      for (const [k, v] of Object.entries(obj)) {
        if (typeof k !== 'string') { setMsg(`Key ${k} must be a string`); return false; }
        if (typeof v !== 'object' || v === null) { setMsg(`Value for key ${k} must be { tmdbId, type }`); return false; }
        const tmdbId = Number(v.tmdbId);
        if (!Number.isFinite(tmdbId)) { setMsg(`tmdbId for ${k} must be a number`); return false; }
        const type = String(v.type || 'm').toLowerCase();
        if (!(type === 'm' || type === 'tv')) { setMsg(`type for ${k} must be "m" or "tv"`); return false; }
      }
      return true;
    }

    wrap.querySelector('#validateBtn').onclick = () => {
      const obj = parseArea(); if (!obj) return;
      if (!validateShape(obj)) return;
      setMsg('Looks good ✔', true);
    };
    wrap.querySelector('#revertBtn').onclick = () => {
      const cur = parseArea(); if (!cur) return;
      const bak = backup || {};
      const bakSet = new Set(Object.keys(bak));
      let removed = 0;
      for (const k of Object.keys(cur)) { if (!bakSet.has(k)) { delete cur[k]; removed++; } }
      wrap.querySelector('#cacheArea').value = JSON.stringify(cur, null, 2);
      wrap.querySelector('.stats').textContent = statsHtml(cur, bak);
      setMsg(removed ? `Removed ${removed} new key(s) added since last build. Review and click Save to persist.` : 'No new keys to remove.', !!removed);
    };
    wrap.querySelector('#saveBtn').onclick = async () => {
      const obj = parseArea(); if (!obj) return;
      if (!validateShape(obj)) return;
      try {
        const packed = fromFriendly(obj);
        await setCache(packed, CACHE_KEY);
        LOCAL_OVERRIDES = packed;
        DIRTY_OVERRIDES = false;
        wrap.querySelector('.stats').textContent = statsHtml(obj, backup || {});
        setMsg('Saved ✔', true);
      } catch (e) { setMsg('Save failed: ' + e.message); }
    };

    const btnClose = document.createElement('button'); btnClose.textContent='Close'; styleBtn(btnClose);
    footer.append(btnClose); btnClose.onclick = close;
  }

  // ─── Settings UI (Tabbed + Scrollable) ──────────────────────────────────
  function showSettings() {
    const panel = document.createElement('div');
    panel.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <h2 style="color:#fff;margin:0;font-size:18px">Kodi Settings</h2>
        <div style="display:flex; gap:6px;">
          <button class="kodi-tab-btn" data-tab="general">General</button>
          <button class="kodi-tab-btn" data-tab="tools">Tools</button>
        </div>
      </div>

      <!-- Tabs content -->
      <div id="kodi-tab-general" class="kodi-tab" style="display:block">
        <label style="color:#fff">Kodi IP:</label>
        <input id="kodiIp" style="width:100%;margin-bottom:8px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px"/>

        <label style="color:#fff">Kodi Port:</label>
        <input id="kodiPort" style="width:100%;margin-bottom:8px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px"/>

        <label style="color:#fff">Kodi User:</label>
        <input id="kodiUser" style="width:100%;margin-bottom:8px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px"/>

        <label style="color:#fff">Kodi Pass:</label>
        <input id="kodiPass" type="password" style="width:100%;margin-bottom:12px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px"/>

        <label style="color:#fff">Default Action:</label>
        <select id="kodiAction" style="width:100%;margin-bottom:16px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px">
          <option value="">Omit Action key</option>
          <option value="view">view</option>
          <option value="import">import</option>
          <option value="import_view">import_view</option>
          <option value="ask">Ask each time</option>
        </select>

        <label style="color:#fff">Busy indicator:</label>
        <select id="indicator" style="width:100%;margin-bottom:16px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px">
          <option value="none">none</option>
          <option value="busy">busy</option>
          <option value="progress">progress</option>
        </select>

        <label style="color:#fff"><input type="checkbox" id="descEnable"/> Add Description</label>
        <div id="descOptions" style="margin:8px 0;display:none;color:#fff">
          <label>Edit mode:</label>
          <select id="descMode" style="width:100%;margin-bottom:8px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px">
            <option value="send">Send without editing</option>
            <option value="edit">Edit before sending</option>
          </select>
        </div>

        <hr style="border-color:#444;margin:14px 0">

        <div id="advancedGroup" style="${SHOW_ADVANCED_SETTINGS_UI ? '' : 'display:none;'}">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
            <div>
              <label style="color:#fff">Batch size:</label>
              <input id="batchSize" type="number" min="1" step="1" style="width:100%;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px"/>
            </div>
            <div>
              <label style="color:#fff">Pause between batches (ms):</label>
              <input id="pauseMs" type="number" min="0" step="10" style="width:100%;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px"/>
            </div>
            <div>
              <label style="color:#fff">Final retry delay (ms):</label>
              <input id="finalRetryDelayMs" type="number" min="0" step="10" style="width:100%;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px"/>
            </div>
            <div>
              <label style="color:#fff">Final retry min list size:</label>
              <input id="finalRetryMinListSize" type="number" min="0" step="1" style="width:100%;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px"/>
            </div>
          </div>
          <hr style="border-color:#444;margin:14px 0">
        </div>

        <label style="color:#fff"><input type="checkbox" id="smartLogEnable"/> Enable Smart-Match Logging</label><br>
        <label style="color:#fff"><input type="checkbox" id="smartReviewAutoOpen"/> Auto-open Review Panel BEFORE sending when changes occur</label>

        <hr style="border-color:#444;margin:14px 0">

        <div>
          <h3 style="color:#fff;margin:0 0 8px;">Artwork Options</h3>
          <div style="display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:10px">
            <div style="border:1px solid #333;border-radius:10px;padding:10px;">
              <label style="color:#fff"><input type="checkbox" id="posterEnable"/> Enable Poster</label>
              <div style="color:#bbb;font-size:12px;margin:6px 0 8px">Include the <code>poster</code> key in the URL.</div>
              <label style="color:#fff">Poster selection:</label>
              <select id="posterStrategy" style="width:100%;margin-top:4px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px">
                <option value="first_4">first_4</option>
                <option value="random">random</option>
              </select>
            </div>
            <div style="border:1px solid #333;border-radius:10px;padding:10px;">
              <label style="color:#fff"><input type="checkbox" id="fanartEnable"/> Enable Fanart</label>
              <div style="color:#bbb;font-size:12px;margin:6px 0 8px">The <code>fanart</code> key accepts either a strategy or a direct URL.</div>
              <label style="color:#fff">Fanart selection:</label>
              <select id="fanartStrategy" style="width:100%;margin-top:4px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px">
                <option value="author_fanart">author_fanart (use page backdrop)</option>
                <option value="first_4">first_4</option>
                <option value="random">random</option>
              </select>
              <div id="fanartFallbackBox" style="margin-top:8px; display:none;">
                <label style="color:#fff">If author_fanart missing, fallback to:</label>
                <select id="fanartFallback" style="width:100%;margin-top:4px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px">
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
          <h3 style="color:#fff;margin:0 0 8px;">Media Type Defaults</h3>
          <label style="color:#fff">Default media type (items w/o per-item <code>mt</code>):</label>
          <select id="defaultMediaType" style="width:100%;margin:6px 0 8px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px">
            <option value="m">m (movies)</option>
            <option value="tv">tv (TV shows)</option>
          </select>
          <div style="color:#bbb;font-size:12px;margin-top:4px">
            Top-level query key is <code>media_type_default</code>. Per-item <code>mt</code> is only added when it differs from this default.
          </div>
        </div>

        <hr style="border-color:#444;margin:14px 0">
        <div>
          <h3 style="color:#fff;margin:0 0 8px;">Cache Tools</h3>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px">
            <button id="downloadCacheBtn">Download Overrides</button>
            <button id="refreshBaseCacheBtn">Refresh Base Cache</button>
          </div>
          <div style="display:grid;grid-template-columns:1fr;gap:8px;align-items:end;">
            <div>
              <label style="color:#fff">Base cache URL (.bin):</label>
              <input id="baseBinUrl" style="width:100%;margin-top:4px;background:#181818;color:#ddd;border:1px solid #333;border-radius:10px;padding:10px"/>
              <div style="color:#bbb;font-size:12px;margin-top:4px">Raw GitHub URL to lbd_tmdb_pairs_u32.bin</div>
            </div>
            <div style="display:flex;gap:8px;">
              <button id="resetBaseBinUrlBtn" class="secondary">Reset URL</button>
            </div>
          </div>
          <div id="cacheToolMsg" style="color:#bbb;font-size:12px;margin-top:8px;"></div>
        </div>
      </div>

      <div id="kodi-tab-tools" class="kodi-tab" style="display:none">
        <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
          <button id="btnShowUrl" title="Build & view plugin URL">Show URL</button>
          <button id="btnShowCache" title="Open overrides as JSON">Show Cache</button>
          <button id="btnEditCache" title="Open editor for overrides">Edit Cache</button>
          <button id="btnClearCache" title="Clear overrides">Clear Cache</button>
          <button id="btnSmartLog" title="Open Smart-Match Log">Show Smart Log</button>
          <button id="btnReviewChanges" title="Open Review Panel">Review Changes</button>
        </div>
        <div style="color:#bbb; font-size:12px;">
          Utilities live here on mobile. Use the FAB for sending.
        </div>
      </div>
    `;

    const { overlay, panel: shell, footer, close } = modal('Kodi Settings', panel, { hideDefaultClose: true });
    const btnSave = document.createElement('button'); btnSave.textContent='Save'; styleBtn(btnSave);
    const btnClose = document.createElement('button'); btnClose.textContent='Close'; styleBtn(btnClose, true);
    footer.append(btnClose, btnSave);
    btnClose.onclick = close;

    // Enhance tab buttons
    panel.querySelectorAll('.kodi-tab-btn').forEach(b => { styleBtn(b, true); b.style.padding='8px 10px'; });

    function activateTab(name) {
      panel.querySelectorAll('.kodi-tab').forEach(el => el.style.display = 'none');
      const btns = panel.querySelectorAll('.kodi-tab-btn');
      btns.forEach(b => { b.style.background = (b.dataset.tab === name) ? '#e50914' : '#444'; });
      const shown = panel.querySelector(`#kodi-tab-${name}`);
      if (shown) shown.style.display = 'block';
    }
    panel.querySelectorAll('.kodi-tab-btn').forEach(b => b.addEventListener('click', () => activateTab(b.dataset.tab)));

    // Populate (General)
    panel.querySelector('#kodiIp').value = GM_getValue('kodiIp', '');
    panel.querySelector('#kodiPort').value = GM_getValue('kodiPort', '');
    panel.querySelector('#kodiUser').value = GM_getValue('kodiUser', '');
    panel.querySelector('#kodiPass').value = GM_GetOrSet('kodiPass', '');

    panel.querySelector('#kodiAction').value = GM_getValue('kodiAction', 'import_view');
    panel.querySelector('#indicator').value = GM_GetOrSet('indicator', 'busy');

    panel.querySelector('#descEnable').checked = GM_GetOrSet('descEnable', true);
    panel.querySelector('#descMode').value = GM_GetOrSet('descMode', 'send');
    panel.querySelector('#smartLogEnable').checked = smartLogEnabled();
    panel.querySelector('#smartReviewAutoOpen').checked = GM_GetOrSet('smartReviewAutoOpen', false);

    panel.querySelector('#batchSize')?.setAttribute('value', GM_GetOrSet('batchSize', DEFAULT_BATCH_SIZE));
    panel.querySelector('#pauseMs')?.setAttribute('value', GM_GetOrSet('pauseMs', DEFAULT_PAUSE_MS));
    panel.querySelector('#finalRetryDelayMs')?.setAttribute('value', GM_GetOrSet('finalRetryDelayMs', DEFAULT_FINALRETRY_DELAY));
    panel.querySelector('#finalRetryMinListSize')?.setAttribute('value', GM_GetOrSet('finalRetryMinListSize', DEFAULT_FINALRETRY_MIN_LIST_SIZE));

    panel.querySelector('#posterEnable').checked = GM_GetOrSet('posterEnable', POSTER_ENABLE_DEFAULT);
    panel.querySelector('#posterStrategy').value = GM_GetOrSet('posterStrategy', POSTER_STRATEGY_DEFAULT);

    panel.querySelector('#fanartEnable').checked = GM_GetOrSet('fanartEnable', FANART_ENABLE_DEFAULT);
    panel.querySelector('#fanartStrategy').value = GM_GetOrSet('fanartStrategy', FANART_STRATEGY_DEFAULT);
    panel.querySelector('#fanartFallback').value = GM_GetOrSet('fanartFallback', FANART_FALLBACK_DEFAULT);
    function refreshFanartFallbackVisibility() {
      const strat = panel.querySelector('#fanartStrategy').value;
      panel.querySelector('#fanartFallbackBox').style.display = (strat === 'author_fanart') ? 'block' : 'none';
    }
    panel.querySelector('#fanartStrategy').addEventListener('change', refreshFanartFallbackVisibility);
    refreshFanartFallbackVisibility();

    panel.querySelector('#baseBinUrl').value = GM_GetOrSet('baseBinUrl', BASE_BIN_URL_DEFAULT);
    panel.querySelector('#defaultMediaType').value = GM_GetOrSet('defaultMediaType', DEFAULT_MEDIA_TYPE_DEFAULT);

    const descOpts = panel.querySelector('#descOptions');
    panel.querySelector('#descEnable').addEventListener('change', e => {
      descOpts.style.display = e.target.checked ? 'block' : 'none';
    });
    if (panel.querySelector('#descEnable').checked) descOpts.style.display = 'block';

    // Cache tools handlers
    const cacheMsg = panel.querySelector('#cacheToolMsg');
    function setCacheMsg(txt, ok = false) { cacheMsg.textContent = txt || ''; cacheMsg.style.color = ok ? '#8ee6a4' : '#bbb'; }

    panel.querySelector('#downloadCacheBtn').onclick = async () => {
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
      } catch (e) { toast('❌ Failed to download overrides: ' + (e?.message || e)); }
    };

    panel.querySelector('#refreshBaseCacheBtn').onclick = async () => {
      setCacheMsg('Refreshing base cache…');
      await refreshBaseBinNow();
      setCacheMsg('Base cache refreshed.', true);
    };

    panel.querySelector('#resetBaseBinUrlBtn').onclick = () => {
      panel.querySelector('#baseBinUrl').value = BASE_BIN_URL_DEFAULT;
      setCacheMsg('Base cache URL reset (unsaved).');
    };

    btnSave.onclick = () => {
      GM_setValue('kodiIp', panel.querySelector('#kodiIp').value.trim());
      GM_setValue('kodiPort', panel.querySelector('#kodiPort').value.trim());
      GM_setValue('kodiUser', panel.querySelector('#kodiUser').value);
      GM_setValue('kodiPass', panel.querySelector('#kodiPass').value);
      GM_setValue('kodiAction', panel.querySelector('#kodiAction').value);
      GM_setValue('indicator', panel.querySelector('#indicator').value);
      GM_setValue('descEnable', panel.querySelector('#descEnable').checked);
      GM_setValue('descMode', panel.querySelector('#descMode').value);
      GM_setValue('smartLogEnable', panel.querySelector('#smartLogEnable').checked);
      GM_setValue('smartReviewAutoOpen', panel.querySelector('#smartReviewAutoOpen').checked);

      GM_setValue('posterEnable', panel.querySelector('#posterEnable').checked);
      GM_setValue('posterStrategy', panel.querySelector('#posterStrategy').value);

      GM_setValue('fanartEnable', panel.querySelector('#fanartEnable').checked);
      GM_setValue('fanartStrategy', panel.querySelector('#fanartStrategy').value);
      GM_setValue('fanartFallback', panel.querySelector('#fanartFallback').value);

      const bsEl = panel.querySelector('#batchSize');
      const pmEl = panel.querySelector('#pauseMs');
      const frdEl = panel.querySelector('#finalRetryDelayMs');
      const frsEl = panel.querySelector('#finalRetryMinListSize');
      if (bsEl) GM_setValue('batchSize', Math.max(1, parseInt(bsEl.value, 10) || DEFAULT_BATCH_SIZE));
      if (pmEl) GM_setValue('pauseMs', Math.max(0, parseInt(pmEl.value, 10) || DEFAULT_PAUSE_MS));
      if (frdEl) GM_setValue('finalRetryDelayMs', Math.max(0, parseInt(frdEl.value, 10) || DEFAULT_FINALRETRY_DELAY));
      if (frsEl) GM_setValue('finalRetryMinListSize', Math.max(0, parseInt(frsEl.value, 10) || DEFAULT_FINALRETRY_MIN_LIST_SIZE));

      GM_setValue('baseBinUrl', panel.querySelector('#baseBinUrl').value.trim() || BASE_BIN_URL_DEFAULT);
      GM_setValue('defaultMediaType', panel.querySelector('#defaultMediaType').value);

      toast('✅ Settings saved');
      close();
    };

    // Tools tab buttons
    panel.querySelector('#btnShowUrl').onclick = handleShowUrl;
    panel.querySelector('#btnShowCache').onclick = async () => {
      await loadLocalOverridesOnce();
      const pre = document.createElement('pre');
      pre.style.cssText = 'white-space:pre-wrap; word-break:break-word; margin:0; padding:10px; background:#181818;color:#ddd;border:1px solid #333;border-radius:10px';
      pre.textContent = JSON.stringify(LOCAL_OVERRIDES || {});
      modal('Overrides JSON', pre);
    };
    panel.querySelector('#btnEditCache').onclick = openCacheEditorModal;
    panel.querySelector('#btnClearCache').onclick = async () => { await clearCache(); LOCAL_OVERRIDES = {}; DIRTY_OVERRIDES = false; toast('Overrides cleared'); };
    panel.querySelector('#btnSmartLog').onclick = openSmartLogModal;
    panel.querySelector('#btnReviewChanges').onclick = openReviewPanelModal;

    // Initialize state
    activateTab('general');
  }

  // ─── Bootstrap UI (FAB) ─────────────────────────────────────────────────
  function initUI() {
    if (IS_MOBILE) addFAB();
    else {
      // Desktop fallback: small fixed buttons (kept minimal)
      const bar = document.createElement('div');
      Object.assign(bar.style, { position:'fixed', top:'10px', right:'10px', display:'flex', gap:'8px', zIndex:2147483645 });
      const bSend = document.createElement('button'); bSend.textContent='FLAM'; styleBtn(bSend);
      bSend.style.textTransform='uppercase'; bSend.style.letterSpacing='0.6px'; bSend.onclick = () => flamFlow();
      const bSettings = document.createElement('button'); bSettings.textContent='⚙'; styleBtn(bSettings, true); bSettings.onclick = showSettings;
      bar.append(bSend, bSettings); document.body.append(bar);
    }
  }

  // ─── Start ──────────────────────────────────────────────────────────────
  initUI();
})();
