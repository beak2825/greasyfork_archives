// ==UserScript==
// @name         GeoGuessr High Level Ranks
// @namespace    https://example.com/
// @version      2.1.1
// @description  Replace 1500+ levels with special ranks
// @icon         https://i.imgur.com/wHQjX4m.png
// @license      MIT
// @match        https://www.geoguessr.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/547364/GeoGuessr%20High%20Level%20Ranks.user.js
// @updateURL https://update.greasyfork.org/scripts/547364/GeoGuessr%20High%20Level%20Ranks.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- config ---
  const RECOLOR_TOGGLE = 'on'; // "on" or "off"
  const PROG_ELEMENT_ID = 'gg-ranks-overlay'; // progress overlay id

  const SOLO_RANGES = [
    { min:1500, max:1649, title:'Grand Champion 3', badge:'https://i.imgur.com/aR6fova.png' },
    { min:1650, max:1799, title:'Grand Champion 2', badge:'https://i.imgur.com/No26QT6.png' },
    { min:1800, max:1999, title:'Grand Champion 1', badge:'https://i.imgur.com/DH3XBSr.png' },
    { min:2000, max:2199, title:'Legend',            badge:'https://i.imgur.com/mTCZKHg.png' },
    { min:2200, max:Infinity, title:'Eternal',        badge:'https://i.imgur.com/wHQjX4m.png' },
  ];

  const TEAM_RANGES = [
    { min:1350, max:1399, title:'Grand Champion 3', badge:'https://i.imgur.com/GYUETku.png' },
    { min:1400, max:1499, title:'Grand Champion 2', badge:'https://i.imgur.com/QPo1lET.png' },
    { min:1500, max:1599, title:'Grand Champion 1', badge:'https://i.imgur.com/QLW7KyP.png' },
    { min:1600, max:1699, title:'Legend',            badge:'https://i.imgur.com/1K4mAXB.png' },
    { min:1700, max:Infinity, title:'Eternal',        badge:'https://i.imgur.com/rZsaPIw.png' },
  ];

  // --- constants used by champion detection ---
  const EXACT_CHAMPION_URL = 'https://www.geoguessr.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fchampion.84e780e9.webp&w=1200&q=75';
  const CHAMPION_FILENAME = 'champion.84e780e9.webp';
  const CHAMPION_ENCODED_FRAGMENT = '%2F_next%2Fstatic%2Fmedia%2Fchampion';

  // --- state ---
  let cachedMyId = null;
  let scheduled = null;
  let busy = false;

    // ---- Small fix: keep spectator badge same displayed height and preserve aspect ratio ----
(function keepBadgeHeight() {
  const SELECTOR = 'img.post-guess-player-spectator_badgeImage__6UwJi';

  // store original displayed height (once)
  function storeOriginalHeight(img) {
    if (!img || img.dataset.gg_orig_display_height) return;
    try {
      const rect = img.getBoundingClientRect();
      const h = Math.round(rect && rect.height ? rect.height : img.clientHeight || 36);
      img.dataset.gg_orig_display_height = String(h);
    } catch (e) { img.dataset.gg_orig_display_height = '36'; }
  }

  // apply sizing so width auto-scales and ratio preserved
  function applyFixedSizing(img) {
    if (!img) return;
    const orig = Number(img.dataset.gg_orig_display_height) || (img.clientHeight || 36);
    img.style.height = orig + 'px';
    img.style.maxHeight = orig + 'px';
    img.style.width = 'auto';
    img.style.objectFit = 'contain';
    // prevent flex shrinking if inside flex container
    img.style.flex = '0 0 auto';
  }

  // initialize existing images
  try {
    document.querySelectorAll(SELECTOR).forEach(img => {
      storeOriginalHeight(img);
      // if already replaced by your script mark, ensure sizing now
      if (img.dataset.gg_replaced) applyFixedSizing(img);
    });
  } catch (e) {}

  // observe additions and src/srcset changes
  const mo = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length) {
        m.addedNodes.forEach(node => {
          if (node.nodeType !== 1) return;
          // direct image node
          if (node.matches && node.matches(SELECTOR)) {
            storeOriginalHeight(node);
            if (node.dataset.gg_replaced) applyFixedSizing(node);
          }
          // or nested images
          try {
            node.querySelectorAll && node.querySelectorAll(SELECTOR).forEach(img => {
              storeOriginalHeight(img);
              if (img.dataset.gg_replaced) applyFixedSizing(img);
            });
          } catch (e) {}
        });
      }
      if (m.type === 'attributes' && (m.attributeName === 'src' || m.attributeName === 'srcset')) {
        const target = m.target;
        if (target && target.matches && target.matches(SELECTOR)) {
          // ensure we remembered original height
          storeOriginalHeight(target);
          // tiny delay so browser can update source; then enforce the sizing
          setTimeout(() => applyFixedSizing(target), 8);
        }
      }
    }
  });

  mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'srcset'] });

  // also expose a manual helper (optional) you can call from console:
  window.__gg_fixBadgeNow = () => document.querySelectorAll(SELECTOR).forEach(img => { storeOriginalHeight(img); applyFixedSizing(img); });
})();


  // --- network helpers ---
  async function fetchJson(path) {
    const url = path.startsWith('http') ? path : `${location.origin}${path}`;
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error('Fetch failed: ' + res.status);
    return res.json();
  }

  async function getMyUserId() {
    if (cachedMyId) return cachedMyId;
    try {
      const me = await fetchJson('/api/v3/profiles/me');
      cachedMyId = me?.id || me?.userId || null;
      return cachedMyId;
    } catch (e) {
      console.warn('[gg] getMyUserId failed', e);
      return null;
    }
  }

  async function getRatingsMe() { try { return await fetchJson('/api/v4/ranked-system/ratings/me'); } catch (e) { return null; } }
  async function getProfileProgress(id) { if (!id) return null; try { return await fetchJson(`/api/v4/ranked-system/progress/${id}`); } catch (e) { return null; } }
  async function getTeamBest(id) { if (!id) return null; try { return await fetchJson(`/api/v4/ranked-team-duels/best/${id}`); } catch (e) { return null; } }
  async function getTeamByTeammateId(teammateId) { if (!teammateId) return null; try { return await fetchJson(`/api/v4/ranked-team-duels/me/teams/${teammateId}`); } catch (e) { console.warn('[gg] getTeamByTeammateId failed', e); return null; } }

  // --- rating extraction helpers ---
  function ratingFromRatingsMe(payload, myId) {
    if (!payload || !myId) return null;
    const arr = Array.isArray(payload) ? payload : (Array.isArray(payload.players) ? payload.players : (Array.isArray(payload.data) ? payload.data : null));
    if (!arr) return null;
    const ent = arr.find(x => String(x.userId) === String(myId) || String(x.id) === String(myId));
    return ent ? (ent.rating ?? ent.value ?? ent.elo ?? null) : null;
  }
  function ratingFromProgress(p) { return p ? (p.rating ?? p.value ?? p.currentRating ?? p.elo ?? null) : null; }

  function ratingFromTeamBest(payload) {
    if (!payload) return null;
    if (typeof payload.rating === 'number' || typeof payload.rating === 'string') return Number(payload.rating);
    if (payload.best && (typeof payload.best.rating === 'number' || typeof payload.best.rating === 'string')) return Number(payload.best.rating);
    if (payload.data && typeof payload.data === 'object') {
      if (typeof payload.data.rating === 'number' || typeof payload.data.rating === 'string') return Number(payload.data.rating);
      if (Array.isArray(payload.data) && payload.data.length && (typeof payload.data[0].rating === 'number' || typeof payload.data[0].rating === 'string')) return Number(payload.data[0].rating);
    }
    if (Array.isArray(payload) && payload.length) {
      const c = payload[0];
      if (c && (typeof c.rating === 'number' || typeof c.rating === 'string')) return Number(c.rating);
    }
    if (typeof payload.value === 'number' || typeof payload.value === 'string') return Number(payload.value);
    if (payload.best && (typeof payload.best.value === 'number' || typeof payload.best.value === 'string')) return Number(payload.best.value);
    const stack = [payload];
    const seen = new Set();
    while (stack.length) {
      const o = stack.pop();
      if (!o || typeof o !== 'object' || seen.has(o)) continue;
      seen.add(o);
      if ('rating' in o && (typeof o.rating === 'number' || typeof o.rating === 'string')) return Number(o.rating);
      for (const k of Object.keys(o)) {
        const v = o[k];
        if (v && typeof v === 'object') stack.push(v);
      }
    }
    return null;
  }

  // find the *first* rating property in API response (breadth-first-ish)
  function findFirstRating(payload) {
    if (!payload) return null;
    const queue = [payload];
    const seen = new Set();
    while (queue.length) {
      const node = queue.shift();
      if (!node || typeof node !== 'object' || seen.has(node)) continue;
      seen.add(node);
      if ('rating' in node && (typeof node.rating === 'number' || typeof node.rating === 'string')) return Number(node.rating);
      const keys = Object.keys(node);
      for (let i = 0; i < keys.length; i++) {
        const v = node[keys[i]];
        if (v && typeof v === 'object') queue.push(v);
      }
    }
    return null;
  }

  function mapRange(rating, ranges) {
    if (rating == null) return null;
    const n = Number(rating);
    if (!Number.isFinite(n)) return null;
    return ranges.find(rr => n >= rr.min && n <= rr.max) || null;
  }

  // --- DOM helpers (widgets, champion detection) ---
  function findWidgetByHeadingText(headingText) {
    const nodes = Array.from(document.querySelectorAll('[class*="profile-v2_widgetRow"]'));
    for (const n of nodes) {
      const h2 = n.querySelector('h2.headline_heading__2lf9L, h2');
      if (!h2) continue;
      if ((h2.textContent || '').trim().toLowerCase() === headingText.toLowerCase()) return n;
    }
    return null;
  }
  function findRankedWidget() { return findWidgetByHeadingText('Ranked duels'); }
  function findTeamWidget() { return findWidgetByHeadingText('Team Duels'); }

  function imgIsChampion(img) {
    if (!img) return false;
    const s = img.getAttribute('src') || '';
    const srcset = img.getAttribute('srcset') || '';
    if (!s && !srcset) return false;
    if (s === EXACT_CHAMPION_URL) return true;
    if (s.includes(CHAMPION_FILENAME) || s.includes(CHAMPION_ENCODED_FRAGMENT)) return true;
    if (srcset) {
      const parts = srcset.split(',').map(p => p.trim().split(/\s+/)[0]);
      if (parts.includes(EXACT_CHAMPION_URL)) return true;
      if (parts.some(p => p.includes(CHAMPION_FILENAME) || p.includes(CHAMPION_ENCODED_FRAGMENT))) return true;
    }
    return false;
  }

  function findWidgetChampionImg(widget) {
    if (!widget) return null;
    const imgs = Array.from(widget.querySelectorAll('img'));
    for (const img of imgs) if (imgIsChampion(img)) return img;
    return null;
  }

  function findWidgetDivisionTitle(widget) {
    if (!widget) return null;
    const div = widget.querySelector('[class*="widget_divisionText"], .widget_divisionText__s8kZK');
    if (div) {
      const candidate = Array.from(div.querySelectorAll('label,div,span')).find(el => ((el.textContent||'').trim().toLowerCase() === 'champion'));
      if (candidate) return candidate;
    }
    return Array.from(widget.querySelectorAll('label,div,span')).find(el => ((el.textContent||'').trim().toLowerCase() === 'champion')) || null;
  }

  function storeOriginal(el) {
    if (!el) return;
    if (el.tagName === 'IMG') {
      if (!el.dataset.gg_orig_src) el.dataset.gg_orig_src = el.getAttribute('src') || '';
      if (!el.dataset.gg_orig_srcset) el.dataset.gg_orig_srcset = el.getAttribute('srcset') || '';
    } else {
      if (!el.dataset.gg_orig_html) el.dataset.gg_orig_html = el.innerHTML;
    }
  }
  function restoreOriginal(el) {
    if (!el) return;
    if (el.tagName === 'IMG') {
      if (el.dataset.gg_orig_src) {
        const cur = el.getAttribute('src') || '';
        if (cur !== el.dataset.gg_orig_src) {
          el.setAttribute('src', el.dataset.gg_orig_src);
          if (el.dataset.gg_orig_srcset) el.setAttribute('srcset', el.dataset.gg_orig_srcset);
        }
      }
      delete el.dataset.gg_replaced;
    } else {
      if (el.dataset.gg_orig_html) {
        if (el.innerHTML !== el.dataset.gg_orig_html) el.innerHTML = el.dataset.gg_orig_html;
      }
    }
  }

  function applySoloInWidget(range, widget) {
    if (!widget) return;
    const titleEl = findWidgetDivisionTitle(widget);
    const imgEl = findWidgetChampionImg(widget);
    if (titleEl) storeOriginal(titleEl);
    if (imgEl) storeOriginal(imgEl);
    if (!range) { if (titleEl) restoreOriginal(titleEl); if (imgEl) restoreOriginal(imgEl); return; }
    if (titleEl && /champion/i.test((titleEl.textContent||'').trim())) titleEl.innerHTML = `<span class="gg-title-text">${escapeHtml(range.title)}</span>`;
    if (imgEl && range.badge) { imgEl.setAttribute('src', range.badge); imgEl.setAttribute('srcset', `${range.badge} 1x, ${range.badge} 2x`); imgEl.dataset.gg_replaced='1'; }
  }

  function applyTeamInWidget(range, widget) {
    if (!widget) return;
    const titleEl = findWidgetDivisionTitle(widget);
    const imgEl = findWidgetChampionImg(widget);
    if (titleEl) storeOriginal(titleEl);
    if (imgEl) storeOriginal(imgEl);
    if (!range) { if (titleEl) restoreOriginal(titleEl); if (imgEl) restoreOriginal(imgEl); return; }
    if (titleEl && /champion/i.test((titleEl.textContent||'').trim())) titleEl.innerHTML = `<span class="gg-title-text">${escapeHtml(range.title)}</span>`;
    if (imgEl && range.badge) { imgEl.setAttribute('src', range.badge); imgEl.setAttribute('srcset', `${range.badge} 1x, ${range.badge} 2x`); imgEl.dataset.gg_replaced='1'; }
  }

  function scanChampionImgs(range, root=document) {
    const imgs = Array.from(root.querySelectorAll('img'));
    for (const img of imgs) {
      if (!imgIsChampion(img)) continue;
      storeOriginal(img);
      if (range && range.badge) { img.setAttribute('src', range.badge); img.setAttribute('srcset', `${range.badge} 1x, ${range.badge} 2x`); img.dataset.gg_replaced='1'; }
      else restoreOriginal(img);
    }
  }

  function escapeHtml(s) { if (s==null) return ''; return String(s).replace(/[&<>\"']/g, m=> ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'})[m]); }

  function applyGlobal(range) {
    const t = document.querySelector('.division-header_title__9hvNH') || document.querySelector('[class^="division-header_title__"], [class*="division-header_title"]');
    const img = (document.querySelector('img[class^="division-header_badge__"], img[class*="division-header_badge"]') || Array.from(document.querySelectorAll('img')).find(imgIsChampion));
    if (t) storeOriginal(t); if (img) storeOriginal(img);
    if (!range) { if (t) restoreOriginal(t); if (img) restoreOriginal(img); return; }
    if (t) t.innerHTML = `<span class="gg-title-text">${escapeHtml(range.title)}</span>`;
    if (img && range.badge) { img.setAttribute('src', range.badge); img.setAttribute('srcset', `${range.badge} 1x, ${range.badge} 2x`); img.dataset.gg_replaced='1'; }
  }

  // --- header recolor helpers ---
  function setHeaderCss(css) {
    let s = document.getElementById('gg-header-css');
    if (!s) {
      s = document.createElement('style');
      s.id = 'gg-header-css';
      document.head.appendChild(s);
    }
    s.textContent = css;
  }
  function clearHeaderCss() {
    const s = document.getElementById('gg-header-css');
    if (s) s.remove();
  }

  function recolorHeader(range, isTeamDuel = false) {
    if (RECOLOR_TOGGLE.toLowerCase() !== "on") { clearHeaderCss(); return; }
    if (!range || !range.title) { clearHeaderCss(); return; }

    const title = String(range.title || '').toLowerCase();
    let background = null;
    let overlay = null;
    let overlayOpacity = 1.0;

    if (title.includes('grand champion')) {
      background = "linear-gradient(179deg, #8b0000 -3.95%, #ff0000 95.2%)";
      overlay    = "linear-gradient(41deg, #330613, #bf1755)";
      overlayOpacity = 0.7;
    } else if (title.includes('legend')) {
      background = "linear-gradient(179deg, #b8860b -3.95%, #ffd700 95.2%)";
      overlay    = "linear-gradient(41deg, #2b1900, #d68940)";
      overlayOpacity = 0.75;
    } else if (title.includes('eternal')) {
      background = "linear-gradient(179deg, #ffdee3 -3.95%, #ffdbe2 95.2%)";
      overlay    = "linear-gradient(41deg, #5e4d5b, #c2089a)";
      overlayOpacity = 0.6;
    } else {
      clearHeaderCss();
      return;
    }

    const css = `
      /* division header background */
      [class^="division-header_background__"], [class*="division-header_background__"] { background: ${background} !important; }
      /* hide underlying pattern to avoid clashing */
      [class^="division-header_pattern__"]::before, [class*="division-header_pattern__"]::before { opacity: 0 !important; }
      /* overlay (top gradient) */
      [class^="division-header_overlay__"], [class*="division-header_overlay__"] { background: ${overlay} !important; opacity: ${overlayOpacity} !important; }
    `;
    setHeaderCss(css);
  }

  // ---------------- PROGRESS (injected as gg-ranks-overlay inside division-header_root__) ----------------

  // compute progress fraction and next range given rating & ranges list
  function computeProgress(rating, ranges) {
    if (rating == null) return null;
    const n = Number(rating);
    if (!Number.isFinite(n)) return null;
    // find index of current range
    let idx = ranges.findIndex(rr => n >= rr.min && n <= rr.max);
    if (idx === -1) {
      // below first threshold -> no progress shown (as before)
      if (n < ranges[0].min) return null;
      // if above last range -> no next
      idx = ranges.length - 1;
    }
    const cur = ranges[idx];
    const next = (idx + 1) < ranges.length ? ranges[idx + 1] : null;
    if (!next || !isFinite(next.min)) return null; // no next rank
    const span = next.min - cur.min;
    if (!span || span <= 0) return null;
    const fraction = (n - cur.min) / span;
    return { fraction: Math.max(0, Math.min(1, fraction)), nextRange: next };
  }

  // progress CSS tailored to gg-ranks-overlay
  function installProgressCss() {
    let s = document.getElementById('gg-prog-css');
    if (!s) {
      s = document.createElement('style');
      s.id = 'gg-prog-css';
      document.head.appendChild(s);
    }
    s.textContent = `
      /* ensure the division header root doesn't clip our absolute element */
      [class^="division-header_root__"], [class*="division-header_root__"] {
        overflow: visible !important;
      }

      /* overlay element (absolute inside division-header_root__) */
      #${PROG_ELEMENT_ID} {
        position: absolute;
        pointer-events: none;
        z-index: 999999 !important;
        display: block;
        bottom: -8px;
        transition: opacity 240ms ease;
      }

      /* card */
      #${PROG_ELEMENT_ID} .gg-prog-card {
        pointer-events: none;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 18px 10px;
        border-radius: 6px;
        background: transparent;
        box-shadow: none;
        width: 70%;
        box-sizing: border-box;
      }

      #${PROG_ELEMENT_ID} .gg-prog-bar {
        height: 10px;
        width: 100%;
        background: rgba(255,255,255,0.08);
        border-radius: 3px;
        overflow: hidden;
        position: relative;
      }

      #${PROG_ELEMENT_ID} .gg-prog-fill {
        height: 100%;
        width: 0%;
        transition: width 450ms ease;
        border-radius: 3px;
        box-shadow: inset 0 -1px 0 rgba(0,0,0,0.12);
        background: linear-gradient(90deg, rgba(255,80,80,0.95), rgba(200,40,40,0.95));
      }

      #${PROG_ELEMENT_ID} .gg-next-icon {
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:4px;
        min-width:44px;
      }
      #${PROG_ELEMENT_ID} .gg-next-icon img {
        width:36px;
        height:36px;
        object-fit:contain;
        border-radius:6px;
        background: none;
        padding: 0;
      }
      #${PROG_ELEMENT_ID} .gg-next-min {
        font-size:12px;
        color: rgba(255,255,255,0.95);
        margin-top:-2px;
        font-family: var(--default-font, 'ggFont', sans-serif);
        white-space: nowrap;
        font-weight: 700;
        font-style: oblique 12deg;
      }

      /* nudge */
      .gg-prog-nudge > * { transform: translateY(-17px); will-change: transform; }

      @media (max-width: 720px) {
        #${PROG_ELEMENT_ID} .gg-next-icon img { width:32px; height:32px; }
        .gg-prog-nudge > * { transform: translateY(-3px); }
      }
    `;
  }

  // insert the overlay inside the division-header root, anchored by left-col measurements (old behaviour)
  function ensureProgressElement_inRoot(nextRange, leftPx, widthPx) {
    // find division-header root
    const root = document.querySelector('[class^="division-header_root__"], [class*="division-header_root__"]');
    if (!root) return null;

    // make sure root allows visible overflow and is positioned for absolute children
    try {
      const computed = window.getComputedStyle(root);
      if (!root.dataset.gg_orig_overflow) root.dataset.gg_orig_overflow = root.style.overflow || '';
      root.style.overflow = 'visible';

      if (!root.dataset.gg_orig_pos && computed.position === 'static') {
        root.dataset.gg_orig_pos = '';
        root.style.position = 'relative';
      }
    } catch (e) {
      // ignore
    }

    let el = document.getElementById(PROG_ELEMENT_ID);
    if (!el) {
      el = document.createElement('div');
      el.id = PROG_ELEMENT_ID;
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = `
        <div class="gg-prog-card" aria-hidden="true">
          <div style="flex:1 1 auto; min-width:0;">
            <div class="gg-prog-bar">
              <div class="gg-prog-fill" style="width:0%"></div>
            </div>
          </div>
          <div class="gg-next-icon" title="">
            <img src="${escapeHtml(nextRange?.badge || '')}" alt="${escapeHtml(nextRange?.title || '')}" />
            <div class="gg-next-min">${escapeHtml(nextRange?.min || '')}</div>
          </div>
        </div>
      `;
      // set left/width/bottom as inline styles (like your old element)
      el.style.left = `${leftPx}px`;
      el.style.width = `${widthPx}px`;
      el.style.bottom = '-8px';

      // store data attributes used previously
      el.dataset.lastLeft = String(leftPx);
      el.dataset.lastWidth = String(widthPx);
      el.dataset.lastFill = '0.00';
      el.dataset.lastBadge = nextRange?.badge || '';
      el.dataset.lastNextMin = nextRange?.min ? String(nextRange.min) : '';

      root.appendChild(el);
    } else {
      // update next badge/title and inline sizing
      const img = el.querySelector('.gg-next-icon img');
      const t = el.querySelector('.gg-next-min');
      if (img) img.src = nextRange?.badge || '';
      if (t) t.textContent = nextRange?.min ?? '';
      el.style.left = `${leftPx}px`;
      el.style.width = `${widthPx}px`;
      el.dataset.lastLeft = String(leftPx);
      el.dataset.lastWidth = String(widthPx);
      el.dataset.lastBadge = nextRange?.badge || '';
      el.dataset.lastNextMin = nextRange?.min ? String(nextRange.min) : '';
    }

    // nudge left column up (same class you used before)
    const leftCol = root.querySelector('[class^="division-header_left__"], [class*="division-header_left__"], [class^="division-header_left"], [class*="division-header_left"]');
    if (leftCol) leftCol.classList.add('gg-prog-nudge');

    return el;
  }

  // remove overlay & nudge class, and try to restore root inline styles if we changed them
  function removeProgressElement_inRoot() {
    const el = document.getElementById(PROG_ELEMENT_ID);
    if (el) el.remove();

    const root = document.querySelector('[class^="division-header_root__"], [class*="division-header_root__"]');
    if (root) {
      const leftCol = root.querySelector('[class^="division-header_left__"], [class*="division-header_left__"], [class^="division-header_left"], [class*="division-header_left"]');
      if (leftCol) leftCol.classList.remove('gg-prog-nudge');
      // attempt to restore overflow/position we changed earlier (best-effort)
      try {
        if (root.dataset.gg_orig_overflow !== undefined) {
          root.style.overflow = root.dataset.gg_orig_overflow || '';
          delete root.dataset.gg_orig_overflow;
        }
        if (root.dataset.gg_orig_pos !== undefined) {
          // if we had previously set dataset.gg_orig_pos to '' we restored to static
          root.style.position = root.dataset.gg_orig_pos || '';
          delete root.dataset.gg_orig_pos;
        }
      } catch (e) {}
    }
    // remove css
    const s = document.getElementById('gg-prog-css');
    if (s) s.remove();
  }

  // top-level renderProgress that computes left/width using left column and calls ensureProgressElement_inRoot
  function renderProgress_inRoot(range, rating, rangesArray) {
    if (!range || rating == null) { removeProgressElement_inRoot(); return; }
    const info = computeProgress(rating, rangesArray);
    if (!info || !info.nextRange) { removeProgressElement_inRoot(); return; }

    // ensure CSS installed
    installProgressCss();

    // measure left column relative to root
    const root = document.querySelector('[class^="division-header_root__"], [class*="division-header_root__"]');
    if (!root) { removeProgressElement_inRoot(); return; }

    const leftCol = root.querySelector('[class^="division-header_left__"], [class*="division-header_left__"], [class^="division-header_left"], [class*="division-header_left"]');
    // fallback measurements if leftCol not found
    let leftPx = 8;
    const PROG_OFFSET_X = 10; // ← increase this to move right
    let widthPx = 176;
    try {
      const rootRect = root.getBoundingClientRect();
      if (leftCol) {
        const leftRect = leftCol.getBoundingClientRect();
        // compute left relative to root
        leftPx = Math.max(2, Math.round(leftRect.left - rootRect.left) + PROG_OFFSET_X);
        // compute width similar to your old logic: a bit wider than left column; cap to reasonable values
        widthPx = Math.max(140, Math.min(520, Math.round(leftRect.width * 1.6)));
      } else {
        // fallback: base width on root width
        const r = root.getBoundingClientRect();
        leftPx = 8;
        widthPx = Math.max(140, Math.min(520, Math.round(r.width * 0.35)));
      }
    } catch (e) {
      // ignore measurement errors and use defaults
    }

    // ensure DOM present
    const el = ensureProgressElement_inRoot(info.nextRange, leftPx, widthPx);
    if (!el) return;

    // set fill
    const fill = el.querySelector('.gg-prog-fill');
    if (fill) {
      const pct = Math.round(info.fraction * 10000) / 100; // 2 decimals
      fill.style.width = `${pct}%`;
      el.dataset.lastFill = String(pct.toFixed(2));
    }

    // update title attribute on next-icon
    const nextIcon = el.querySelector('.gg-next-icon');
    if (nextIcon) {
      if (info.nextRange && info.nextRange.min) {
        nextIcon.title = `Next tier requires ${info.nextRange.min}`;
        el.dataset.lastNextMin = String(info.nextRange.min);
      } else {
        nextIcon.title = '';
        el.dataset.lastNextMin = '';
      }
    }

    // ensure visible
    el.style.display = 'block';
  }

  // wrapper names used by the rest of the script
  function renderProgress(range, rating, rangesArray) { renderProgress_inRoot(range, rating, rangesArray); }
  function clearProgress() { removeProgressElement_inRoot(); }
  function installProgressCssWrapper() { installProgressCss(); }

  // ---------------- SVG Gradient helper functions ----------------

  // pick two hex stops for the left gradient based on rating + duel type
  function pickSvgGradientStops(rating, isTeamDuel) {
    if (rating == null) return null;

    // color choices (you can tweak)
    const redA = '#6940cf', redB = '#DC3C4C';
    const yellowA = '#6940cf', yellowB = '#DCAA3C';
    const pinkA = '#6940cf', pinkB = '#ff8ad8';

    const maxCap = 2600; // optional cap for pink group - you can remove if you want unbounded

    if (isTeamDuel) {
      if (rating >= 1350 && rating <= 1599) return [redA, redB];
      if (rating >= 1600 && rating <= 1699) return [yellowA, yellowB];
      if (rating >= 1700 && rating <= maxCap) return [pinkA, pinkB];
      return null;
    } else {
      if (rating >= 1500 && rating <= 1999) return [redA, redB];
      if (rating >= 2000 && rating <= 2199) return [yellowA, yellowB];
      if (rating >= 2200 && rating <= maxCap) return [pinkA, pinkB];
      return null;
    }
  }

  // search for the sliding background SVG used in matchmaking screens
  function getSlidingSvg() {
    // try team-matchmaking container first
    let container = document.querySelector('.team-matchmaking-layout_root__xFn5v');
    if (container) {
      const svg = container.querySelector('svg.sliding-background_root__oJrQp') || container.querySelector('svg');
      if (svg) return svg;
    }
    // try unranked-matchmaking container
    container = document.querySelector('.unranked-matchmaking-layout_root__L8lN8');
    if (container) {
      const svg = container.querySelector('svg.sliding-background_root__oJrQp') || container.querySelector('svg');
      if (svg) return svg;
    }
    // fallback: search globally for the expected svg class
    const svgGlobal = document.querySelector('svg.sliding-background_root__oJrQp') || document.querySelector('svg');
    return svgGlobal || null;
  }

  // update the leftGradient stops; restore originals when rating == null
  function updateSvgGradient(rating, isTeamDuel) {
    try {
      const svg = getSlidingSvg();
      if (!svg) return;

      // find the linearGradient with id leftGradient (or nearest linearGradient)
      let grad = svg.querySelector('linearGradient#leftGradient, linearGradient[id*="leftGradient"]');
      if (!grad) {
        // fallback: first linearGradient in defs
        const defs = svg.querySelector('defs');
        if (defs) grad = defs.querySelector('linearGradient');
      }
      if (!grad) return;

      const stops = Array.from(grad.querySelectorAll('stop'));
      if (!stops.length) return;

      // store original stop colors once so we can restore later
      if (!grad.dataset.gg_origStops) {
        try {
          const orig = stops.map(s => s.getAttribute('stop-color') || '');
          grad.dataset.gg_origStops = JSON.stringify(orig);
        } catch (e) { grad.dataset.gg_origStops = JSON.stringify(['#6840CF','#393273']); }
      }

      if (rating == null) {
        // restore original colors
        try {
          const orig = JSON.parse(grad.dataset.gg_origStops || '[]');
          for (let i = 0; i < stops.length && i < orig.length; i++) {
            stops[i].setAttribute('stop-color', orig[i]);
          }
        } catch (e) {
          // nothing
        }
        return;
      }

      const chosen = pickSvgGradientStops(rating, isTeamDuel);
      if (!chosen) {
        // if no mapping, restore original
        try {
          const orig = JSON.parse(grad.dataset.gg_origStops || '[]');
          for (let i = 0; i < stops.length && i < orig.length; i++) {
            stops[i].setAttribute('stop-color', orig[i]);
          }
        } catch (e) {}
        return;
      }

      // apply chosen stops: prefer mapping to first two stops; if stops length >2, set first and last
      if (stops.length === 1) {
        stops[0].setAttribute('stop-color', chosen[0]);
      } else if (stops.length >= 2) {
        stops[0].setAttribute('stop-color', chosen[0]);
        stops[stops.length - 1].setAttribute('stop-color', chosen[1]);
      }
    } catch (e) {
      console.warn('[gg] updateSvgGradient error', e);
    }
  }

  // --------------------------------------------------------------------
  // The rest of the script integrates with the existing handlers and calls
  // updateSvgGradient(...) where appropriate.
  // --------------------------------------------------------------------

  // --- multiplayer teams canvas extraction (existing) ---
  function findTeammateIdFromCanvas() {
    const c = document.querySelector('canvas.team-avatars_friend__5QyKU[id$="_local"]');
    if (!c) return null;
    const id = c.getAttribute('id') || '';
    if (!id) return null;
    return id.endsWith('_local') ? id.slice(0, -'_local'.length) : id;
  }

  // ---------- NEW: unranked-overlay detection & revert ----------
  // when the unranked info overlay is present and visible (display:flex), we want
  // to immediately revert all of our visual changes and stop.
  function isUnrankedOverlayVisible() {
    try {
      const els = Array.from(document.querySelectorAll('div'));
      for (const d of els) {
        const cls = (d.className || '');
        if (typeof cls !== 'string') continue;
        if (cls.indexOf('unranked-info-overlay_root__MbgSp') !== -1 && cls.indexOf('unranked-info-overlay_reveal__L2ob_') !== -1) {
          const cs = window.getComputedStyle(d);
          if (cs && cs.display === 'flex') return true;
        }
      }
    } catch (e) { /* ignore */ }
    return false;
  }

// helper: fetch the user's position (1..250) from the leaderboard (pages of the API), or null if not found
async function fetchTop250Position(userId) {
  if (!userId) return null;

  // endpoints to cover 0..99, 100..199, 200..249
  const pages = [
    { url: '/api/v4/ranked-system/ratings?limit=100', base: 0 },
    { url: '/api/v4/ranked-system/ratings?offset=100&limit=100', base: 100 },
    { url: '/api/v4/ranked-system/ratings?offset=200&limit=50',  base: 200 }
  ];

  for (const p of pages) {
    try {
      const payload = await fetchJson(p.url);
      if (!payload) continue;
      const arr = Array.isArray(payload) ? payload : (Array.isArray(payload.data) ? payload.data : (Array.isArray(payload.players) ? payload.players : null));
      if (!arr || !arr.length) continue;

      // find user in this page
      const idx = arr.findIndex(i => String(i.userId || i.id || i.playerId || i.user_id) === String(userId));
      if (idx === -1) continue;

      const item = arr[idx];
      // prefer explicit position/rank if available, otherwise compute from page base + index
      const pos = (typeof item.position === 'number') ? item.position
                : (typeof item.rank === 'number') ? item.rank
                : (p.base + idx + 1);

      return Number.isFinite(pos) ? Number(pos) : null;
    } catch (e) {
      // ignore and try next page
    }
  }

  return null;
}



  function revertAllChanges() {
    try {
      // restore any image/text we replaced
      const replaced = Array.from(document.querySelectorAll('[data-gg_replaced="1"], [data-gg_replaced]'));
      for (const el of replaced) restoreOriginal(el);

      // also restore any element that stored original html/src via our dataset keys
      const withOrig = Array.from(document.querySelectorAll('[data-gg_orig_html], [data-gg_orig_src], [data-gg_orig_srcset]'));
      for (const el of withOrig) restoreOriginal(el);

      // clear header css
      clearHeaderCss();

      // clear any division header glow
      try { clearDivisionHeaderGlow(); } catch (e) {}

      // restore svg gradients (both team/solo) if they were modified
      updateSvgGradient(null, false);
      updateSvgGradient(null, true);

      // remove progress overlay and css
      removeProgressElement_inRoot();

      // remove top100 css if present
      const topCss = document.getElementById('gg-top100-css');
      if (topCss) topCss.remove();

      // remove any tm-top100 classes and restore originals if we stored them
      const topEls = Array.from(document.querySelectorAll('.tm-top100'));
      for (const e of topEls) {
        if (e && e.dataset && e.dataset.gg_orig_html) restoreOriginal(e);
        e.classList.remove('tm-top100');
        if (e && e.dataset && e.dataset.gg_top100) delete e.dataset.gg_top100;
      }

    } catch (e) {
      console.error('[gg] revertAllChanges error', e);
    }
  }

  // helper: check whether a given userId appears in the top-100 ratings API
  async function checkTop100(userId) {
    if (!userId) return false;
    try {
      const payload = await fetchJson('/api/v4/ranked-system/ratings?limit=100');
      if (!payload) return false;
      const arr = Array.isArray(payload) ? payload : (Array.isArray(payload.data) ? payload.data : (Array.isArray(payload.players) ? payload.players : null));
      if (!arr) return false;
      return arr.some(item => String(item.userId || item.id || item.playerId || item.user_id) === String(userId));
    } catch (e) {
      return false;
    }
  }

  function installTop100Css() {
    if (document.getElementById('gg-top100-css')) return;
    const s = document.createElement('style');
    s.id = 'gg-top100-css';
    s.textContent = `
      .tm-top100 {
        background: linear-gradient(90deg, rgba(255,200,210,1), rgba(255,230,200,1), rgba(210,255,220,1), rgba(220,220,255,1));
        background-size: 300% 100%;
        text-shadow: 0 0 7px rgba(255,255,255,0.25);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: tm-paleRainbow 20s linear infinite;
        font-weight: 700;
      }
      @keyframes tm-paleRainbow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(s);
  }

// apply or remove Top/Rank label based on numeric position (pos)
// pos = number (1..250) or null
function applyOrRemoveTop100(pos) {
  try {
    // target only the label inside the user-card-title container
    const containers = Array.from(document.querySelectorAll('div[data-qa="user-card-title"]'));
    if (!containers.length) {
      // cleanup any stray labels we may have previously modified
      const other = Array.from(document.querySelectorAll('label.tm-top100'));
      for (const l of other) {
        if (l && l.dataset && l.dataset.gg_top100) { restoreOriginal(l); l.classList.remove('tm-top100'); delete l.dataset.gg_top100; }
      }
      return;
    }

    // show ranks up to 250
    const shouldApply = typeof pos === 'number' && pos >= 1 && pos <= 250;
    // only install rainbow css for top 100
    if (shouldApply && pos <= 100) installTop100Css();

    for (const c of containers) {
      const l = c.querySelector('label.label_label__9xkbh.shared_blackWeight__DLnqe.label_uppercase__DTBcv');
      if (!l) continue;

      if (shouldApply) {
        // keep original stored so we can fully restore later
        if (!l.dataset || !l.dataset.gg_orig_html) storeOriginal(l);

        l.textContent = `Rank #${pos}`;

        // rainbow only for top 100
        if (pos <= 100) {
          l.classList.add('tm-top100');
          l.dataset.gg_top100 = String(pos);
        } else {
          // ensure rainbow class removed for 101..250
          l.classList.remove('tm-top100');
          // store numeric pos so we can detect modification later
          l.dataset.gg_top100 = String(pos);
        }
      } else {
        // not in top-250: restore original if we previously modified
        if (l.dataset && l.dataset.gg_top100) {
          restoreOriginal(l);
          l.classList.remove('tm-top100');
          delete l.dataset.gg_top100;
        }
      }
    }
  } catch (e) { console.warn('[gg] applyOrRemoveTop100 error', e); }
}



  // pick a glow color (rgba) based on the range title
  function pickGlowColor(range) {
    if (!range || !range.title) return null;
    const t = String(range.title).toLowerCase();
    if (t.includes('grand champion')) return 'rgba(220,60,60,0.1)';
    if (t.includes('legend')) return 'rgba(255,200,0,0.1)';
    if (t.includes('eternal')) return 'rgba(194,58,155,0.1)';
    return 'rgba(100,100,100,0.6)';
  }

  // apply a soft glow to the division header root element matching the user's rank
  function applyDivisionHeaderGlow(range) {
    try {
      const root = document.querySelector('[class^="division-header_root__"], [class*="division-header_root__"]');
      if (!root) return;
      const color = pickGlowColor(range) || 'rgba(0,0,0,0)';
      // store original boxShadow if not already stored
      if (!root.dataset.gg_orig_boxshadow) root.dataset.gg_orig_boxshadow = root.style.boxShadow || '';
      root.style.transition = 'box-shadow 350ms ease, filter 350ms ease';
      // subtle multi-layer glow
      root.style.boxShadow = `0 8px 30px 6px ${color}, 0 0 60px 18px ${color}`;
      root.dataset.gg_header_glow = '1';
    } catch (e) { /* ignore */ }
  }

  function clearDivisionHeaderGlow() {
    try {
      const root = document.querySelector('[class^="division-header_root__"], [class*="division-header_root__"]');
      if (!root) return;
      if (root.dataset && root.dataset.gg_orig_boxshadow !== undefined) {
        root.style.boxShadow = root.dataset.gg_orig_boxshadow || '';
        delete root.dataset.gg_orig_boxshadow;
      } else {
        root.style.boxShadow = '';
      }
      if (root.dataset) delete root.dataset.gg_header_glow;
    } catch (e) { /* ignore */ }
  }

  // ---------- end new section ----------

// replace the existing function with this code
async function handleMultiplayerTeamsPage() {
  try {
    // if the unranked overlay is visible, always revert and do nothing
    if (isUnrankedOverlayVisible()) { revertAllChanges(); return; }

    // get my id early (used as a fallback)
    const myId = await getMyUserId();

    // 1) try teammate canvas lookup (most reliable when present)
    let teammateId = findTeammateIdFromCanvas();
    let payload = null;
    let rating = null;

    if (teammateId) {
      payload = await getTeamByTeammateId(teammateId);
      // try the team-specific parser first, fallback to findFirstRating
      rating = ratingFromTeamBest(payload) ?? findFirstRating(payload);
    }

    // 2) fallback: try fetching the current user's team-best (if teammate canvas not present or didn't return a rating)
    if ((rating == null || !Number.isFinite(Number(rating))) && myId) {
      try {
        payload = await getTeamBest(myId);
        rating = ratingFromTeamBest(payload) ?? findFirstRating(payload);
      } catch (e) {
        // ignore, we'll clear below if nothing found
        rating = rating ?? null;
      }
    }

    // if still no rating, restore/clear everything and exit
    if (rating == null || !Number.isFinite(Number(rating))) {
      applyGlobal(null);
      scanChampionImgs(null, document);
      recolorHeader(null, true);
      clearDivisionHeaderGlow();
      updateSvgGradient(null, true); // restore svg for teams
      clearProgress();
      return;
    }

    // we have a team rating -> map to TEAM_RANGES and apply effects
    const range = mapRange(rating, TEAM_RANGES);
    applyGlobal(range);
    scanChampionImgs(range, document);
    recolorHeader(range, true); // recolor for teams page (if you want)
    if (range) applyDivisionHeaderGlow(range); else clearDivisionHeaderGlow();
    updateSvgGradient(rating, true); // update svg for teams page
    renderProgress(range, rating, TEAM_RANGES); // progress for team inside root

  } catch (e) {
    console.error('[gg] handleMultiplayerTeamsPage error', e);
  }
}


  // --- /user/[id] handler ---
  async function handleUserPage(playerId) {
    if (!playerId) {
      applyGlobal(null);
      scanChampionImgs(null, document);
      recolorHeader(null, false);
      updateSvgGradient(null, false);
      clearProgress();
      applyOrRemoveTop100(false);
      return;
    }
    try {
      // solo (progress API)
      const progress = await getProfileProgress(playerId);
      const soloRating = ratingFromProgress(progress);
      console.debug('[gg-user] progress payload for', playerId, progress);
      console.debug('[gg-user] parsed soloRating:', soloRating);
      const soloRange = mapRange(soloRating, SOLO_RANGES);
      const rankedWidget = findRankedWidget();
      if (rankedWidget) { applySoloInWidget(soloRange, rankedWidget); scanChampionImgs(soloRange, rankedWidget); }

      // team (first rating in best API)
      const teamPayload = await getTeamBest(playerId);
      console.debug('[gg-user] teamPayload for', playerId, teamPayload);
      const teamRating = findFirstRating(teamPayload);
      console.debug('[gg-user] first team rating found:', teamRating);
      const teamRange = mapRange(teamRating, TEAM_RANGES);
      const teamWidget = findTeamWidget();
      if (teamWidget) { applyTeamInWidget(teamRange, teamWidget); scanChampionImgs(teamRange, teamWidget); }

// fetch numeric position (1..100) and apply Rank label
const pos = await fetchTop250Position(playerId);
applyOrRemoveTop100(pos);


      // clear/restore global header recolor and clear progress for user pages
      recolorHeader(null, false);
      updateSvgGradient(null, false);
      clearProgress();
    } catch (e) {
      console.error('[gg] handleUserPage error', e);
    }
  }

  // --- main update loop (integrated recolor, progress, svg calls) ---
  async function updateOnce() {
    if (busy) return;
    busy = true;
    try {
      // if the unranked overlay is visible, revert all and skip updates
      if (isUnrankedOverlayVisible()) { revertAllChanges(); busy = false; return; }

      const path = location.pathname || '/';
      const isMultiplayer = (path === '/multiplayer' || path === '/multiplayer/');
      const isTeamsPage = (path === '/multiplayer/teams' || path.startsWith('/multiplayer/teams/'));
      const isUserPage = path.startsWith('/user/');
      const isProfile = (path === '/me/profile' || path.startsWith('/me/profile/') || path.startsWith('/user/'));

      // /multiplayer/teams specific handler
      if (isTeamsPage) {
        await handleMultiplayerTeamsPage();
        busy = false;
        return;
      }

      // /user/[id] handler (explicit)
      if (isUserPage) {
        const parts = path.split('/').filter(Boolean);
        const playerId = parts[1] || null;
        await handleUserPage(playerId);
        busy = false;
        return;
      }

      if (!isMultiplayer && !isProfile) {
        const rW = findRankedWidget(); if (rW) applySoloInWidget(null, rW);
        const tW = findTeamWidget(); if (tW) applyTeamInWidget(null, tW);
        applyGlobal(null); scanChampionImgs(null, document);
        recolorHeader(null, false);
        updateSvgGradient(null, false);
        clearProgress();
        busy = false; return;
      }

      if (isMultiplayer) {
        const myId = await getMyUserId(); if (!myId) { recolorHeader(null,false); clearDivisionHeaderGlow(); updateSvgGradient(null,false); clearProgress(); busy=false; return; }
        const payload = await getRatingsMe(); const rating = ratingFromRatingsMe(payload, myId);
        const range = mapRange(rating, SOLO_RANGES);
        applyGlobal(range); scanChampionImgs(range, document);
        recolorHeader(range, false); // recolor for multiplayer page (solo rank)
        if (range) applyDivisionHeaderGlow(range); else clearDivisionHeaderGlow();
        updateSvgGradient(rating, false); // update svg gradient for solo on multiplayer page
        renderProgress(range, rating, SOLO_RANGES); // progress for solo on multiplayer page (inside root)
        busy = false; return;
      }

      // profile pages (/me/profile)
      let profileId = null;
      if (path === '/me/profile' || path.startsWith('/me/profile/')) profileId = await getMyUserId();
      else { const parts = path.split('/').filter(Boolean); profileId = parts[1] || null; }
      if (!profileId) { recolorHeader(null,false); updateSvgGradient(null,false); clearProgress(); busy=false; return; }

      // solo
      const progress = await getProfileProgress(profileId);
      const soloRating = ratingFromProgress(progress);
      const soloRange = mapRange(soloRating, SOLO_RANGES);
      const rankedWidget = findRankedWidget();
      if (rankedWidget) { applySoloInWidget(soloRange, rankedWidget); scanChampionImgs(soloRange, rankedWidget); }

      // team (improved extraction). Only run for /me/profile for now.
      if (path === '/me/profile' || path === '/me/profile/') {
        const teamPayload = await getTeamBest(profileId);
        console.debug('[gg-team] teamPayload:', teamPayload);
        const teamRating = ratingFromTeamBest(teamPayload);
        console.debug('[gg-team] parsed teamRating:', teamRating);
        const teamRange = mapRange(teamRating, TEAM_RANGES);
        console.debug('[gg-team] parsed teamRange:', teamRange);
        const teamWidget = findTeamWidget();
        if (teamWidget) { applyTeamInWidget(teamRange, teamWidget); scanChampionImgs(teamRange, teamWidget); }
      }

      // profile pages don't recolour the global division header (keep as original)
      recolorHeader(null,false);
      updateSvgGradient(null,false);
      clearProgress();

      busy = false;
    } catch (e) {
      console.error('[gg] update error', e);
      recolorHeader(null,false);
      updateSvgGradient(null,false);
      clearProgress();
      busy = false;
    }
  }

  // scheduling/observers (compact)
  function schedule(delay=0){ if (scheduled) clearTimeout(scheduled); scheduled = setTimeout(()=>{ scheduled=null; updateOnce(); }, delay); }
  (function(){ const wrap=(m)=>{ const orig=history[m]; history[m]=function(){ const rv=orig.apply(this,arguments); window.dispatchEvent(new Event('gg-route-change')); return rv; }; }; wrap('pushState'); wrap('replaceState'); window.addEventListener('popstate', ()=>window.dispatchEvent(new Event('gg-route-change'))); window.addEventListener('gg-route-change', ()=>{ schedule(150); }); })();
  const mo = new MutationObserver((mutations)=>{ for (const m of mutations) { if (m.type==='childList' && (m.addedNodes.length||m.removedNodes.length)) { schedule(20); break; } if (m.type==='attributes' && (m.attributeName==='src'||m.attributeName==='srcset'||m.attributeName==='class')) { schedule(160); break; } } });
  function start(){ if(document.body) mo.observe(document.body,{ childList:true, subtree:true, attributes:true }); window.addEventListener('resize', ()=>schedule(50)); window.addEventListener('scroll', ()=>schedule(50), { passive:true }); schedule(70); }
  if (document.readyState==='loading') window.addEventListener('DOMContentLoaded', start, { once:true }); else start();
  window.addEventListener('beforeunload', ()=>{ try{ mo.disconnect(); } catch(e){} });

})();
