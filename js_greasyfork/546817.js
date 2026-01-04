// ==UserScript==
// @name          TweaxBD - Ultimate Features with Enhanced Usability-2-Optimized
// @namespace     eLibrarian-userscripts
// @version       0.1.0
// @author        eLibrarian
// @description   TweaxBD enhances TorrentBD with powerful features and interface tweaks that improve the overall browsing experience!
// @license       GPL-3.0-or-later
// @match         https://*.torrentbd.net/*
// @match         https://*.torrentbd.com/*
// @match         https://*.torrentbd.org/*
// @match         https://*.torrentbd.me/*
// @grant         GM_registerMenuCommand
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_setClipboard
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/546817/TweaxBD%20-%20Ultimate%20Features%20with%20Enhanced%20Usability-2-Optimized.user.js
// @updateURL https://update.greasyfork.org/scripts/546817/TweaxBD%20-%20Ultimate%20Features%20with%20Enhanced%20Usability-2-Optimized.meta.js
// ==/UserScript==

(function () {
  'use strict';

  //: gets material icons
  (function getMaterialIcons() {
    if (!document.querySelector('link[href*="fonts.googleapis.com/icon"]')) {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  })();

  //: internal module namespace
  const INTERNAL = {
    toastRef: null,
    observer: null,
    connectObserver: null,
    runPostMutations: null,
    featuresByKey: new Map(),
  };

  // Lock helper: only lock when lockedState === true
  const isLocked = (k) => INTERNAL.featuresByKey.get(k)?.lockedState === true;

  //: loads lazy libraries
  const getLazyLibraries = {
    _jszip: null,
    async jszip() {
      if (this._jszip) return this._jszip;
      await new Promise((res, rej) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        // Optional: add integrity below if you want strict SRI. Keep exact hash for your CDN file.
        // s.integrity = 'sha512-...';
        s.crossOrigin = 'anonymous';
        s.onload = res;
        s.onerror = () => rej(new Error('JSZip load failed'));
        document.head.appendChild(s);
      });
      // eslint-disable-next-line no-undef
      return (this._jszip = window.JSZip);
    }
  };

  //: routers
  const Router = (() => {
    const rawPath = location.pathname;
    const path = rawPath === '/' ? '/' : rawPath.replace(/\/$/, ''); // normalize trailing slash
    /** tag -> paths[] */
    const groups = new Map([
      ['home', ['/', '/index.php']],
      ['details', ['/torrents-details.php']],
      ['movies', ['/movies.php']],
      ['tv', ['/tv.php']],
      ['activities', ['/activities.php', '/activity.php']],
      ['seedbonus', ['/seedbonus.php']],
      ['seedbonusHistory', ['/seedbonus-history.php']],
      ['breakdown', ['/seedbonus-breakdown.php']],
      ['profile', ['/account-details.php']],
      ['forums', ['/forums.php']],
      ['downloads', ['/download-history.php']],
    ]);
    const tags = Array.from(groups.entries())
      .filter(([, paths]) => paths.includes(path))
      .map(([tag]) => tag)
      .concat('common');

    const is = (tag) => tags.includes(tag);
    const flags = Object.fromEntries(tags.map(t => [t, true]));

    return { path, tags, is, flags };
  })();

  //: precompiled regex
  const RE = {
    number: /[-+]?\d*\.?\d+/,
    size: /([-+]?\d*\.?\d+)\s*(Pi?B|Ti?B|Gi?B|Mi?B|Ki?B|Bytes|B)?/i,
    seed: /(\d+)(y|mo|w|d|h|m)/g
  };

  //: units
  const UNIT = {
    PIB: 1024**5,
    TIB: 1024**4,
    GIB: 1024**3,
    MIB: 1024**2,
    KIB: 1024,
    BYTES: 1,
    B: 1
  };

  // ---- Micro-mods: LRU caches with TTL ----
  const Cache = (() => {
    const mkLRU = (limit=1024, ttlMs=5*60*1000) => {
      const m = new Map(); const t = new Map();
      const now = () => Date.now();
      return {
        get(k){
          if(!m.has(k)) return;
          if (now() - (t.get(k)||0) > ttlMs) { m.delete(k); t.delete(k); return; }
          const v = m.get(k); const ts = t.get(k);
          m.delete(k); t.delete(k);
          m.set(k, v); t.set(k, ts || now());
          return v;
        },
        set(k,v){
          if(m.has(k)) { m.delete(k); t.delete(k); }
          m.set(k,v); t.set(k, now());
          if(m.size>limit){ const k0 = m.keys().next().value; m.delete(k0); t.delete(k0); }
        },
        clear(){ m.clear(); t.clear(); }
      };
    };
    return {
      sizeParse: mkLRU(1024),
      seedtimeParse: mkLRU(1024),
      numberExtract: mkLRU(1024)
    };
  })();

  const Dom = {
    cssOnce(id, css){
      if (document.getElementById(id)) return;
      const s = document.createElement('style'); s.id = id; s.textContent = css;
      document.head.appendChild(s);
    },
    el(tag, attrs={}, children=[]) {
      const node = document.createElement(tag);
      for (const [k,v] of Object.entries(attrs||{})) {
        if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
        else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
        else if (k === 'dataset') Object.assign(node.dataset, v);
        else if (v !== undefined && v !== null) node.setAttribute(k, v);
      }
      (Array.isArray(children) ? children : [children]).forEach(c=>{
        if (c == null) return;
        node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
      });
      return node;
    },
  };

  // -------------------------
  // Utilities
  // -------------------------Handles to refer to:
  const Utils = {
    // Page helpers
    isPage: (p) => {
      const path = Router.path;
      if (typeof p === 'string') return path === p;
      if (Array.isArray(p))     return p.some((x) => Utils.isPage(x));
      if (p instanceof RegExp)  return p.test(path);
      return false;
    },

    isPersonalFreeleech: () =>
      Array.from(document.querySelectorAll('.profile-info-table td'))
        .some((td) => td.textContent.includes('Freeleech')),

    // Parsing & math (CACHED)
    extractNumber: (text) => {
      if (!text) return 0;
      const key = String(text);
      const hit = Cache.numberExtract.get(key);
      if (hit !== undefined) return hit;
      const match = key.replace(/,/g, '').match(RE.number);
      const out = match ? parseFloat(match[0]) : 0;
      Cache.numberExtract.set(key, out);
      return out;
    },

    // Only binary units; plain numbers = GiB
    parseSize: (sizeText) => {
      if (!sizeText) return { bytes: 0, gib: 0 };
      const cleaned = String(sizeText).replace(/,/g, '').trim();
      const hit = Cache.sizeParse.get(cleaned);
      if (hit) return hit;

      if (/^\d+(\.\d+)?$/.test(cleaned)) {
        const v = parseFloat(cleaned);
        const bytes = v * (1024 ** 3);
        const out = { bytes, gib: v };
        Cache.sizeParse.set(cleaned, out);
        return out;
      }

      const m0 = cleaned.match(/^(\d+(?:\.\d+)?)\s*(GiB|MiB|KiB|TiB|PiB|B|Bytes)$/i);
      if (m0) {
        const v = parseFloat(m0[1]);
        let u = m0[2].toUpperCase();
        const mul = UNIT[u] ?? UNIT.GIB;
        const bytes = (isFinite(v) ? v : 0) * mul;
        const out = { bytes, gib: bytes / (1024 ** 3) };
        Cache.sizeParse.set(cleaned, out);
        return out;
      }

      const m = cleaned.match(RE.size);
      if (!m) { const out = { bytes: 0, gib: 0 }; Cache.sizeParse.set(cleaned, out); return out; }
      const val = parseFloat(m[1]);
      let unit = (m[2] || 'GiB').toUpperCase();
      unit = unit.replace(/PIB?/, 'PIB')
                 .replace(/TIB?/, 'TIB')
                 .replace(/GIB?/, 'GIB')
                 .replace(/MIB?/, 'MIB')
                 .replace(/KIB?/, 'KIB');
      const mul = UNIT[unit] ?? UNIT.GIB;
      const bytes = (isFinite(val) ? val : 0) * mul;
      const out = { bytes, gib: bytes / (1024 ** 3) };
      Cache.sizeParse.set(cleaned, out);
      return out;
    },
    toBytes: (sizeText) => Utils.parseSize(sizeText).bytes,
    toGiB: (sizeText) => Utils.parseSize(sizeText).gib,

    /**
     * Parse seedtime like "1y2mo 3w4d 5h6m" into hours.
     * Assumptions:
     *  - 1 year = 8760 h (365 d)
     *  - 1 month = 720 h (30 d)  ← documented fixed assumption for consistency
     */
    parseSeedTimeHours(seedtime){
      if (!seedtime || seedtime === '-') return 0;
      const txt = String(seedtime);
      if (/^\d+\s*(y|mo|w|d|h|m)$/.test(txt)) {
        const n = parseInt(txt,10);
        const u = txt.replace(/\d+\s*/,'');
        return u==='y'?n*8760 : u==='mo'?n*720 : u==='w'?n*168 : u==='d'?n*24 : u==='h'?n : n/60;
      }
      const key = txt.trim(); const hit = Cache.seedtimeParse.get(key); if (hit!==undefined) return hit;
      let hours = 0, m; RE.seed.lastIndex = 0;
      while ((m = RE.seed.exec(key))) {
        const n = m[1]|0;
        hours += m[2]==='y'?n*8760 : m[2]==='mo'?n*720 : m[2]==='w'?n*168 : m[2]==='d'?n*24 : m[2]==='h'?n : n/60;
      }
      Cache.seedtimeParse.set(key, hours); return hours;
    },

    // Formatting
    formatNumber: (n) => {
      const x = Number(n);
      if (!isFinite(x)) return '0';
      const trim2 = (v) => {
        const r = Math.round(v * 100) / 100;
        return (r % 1 === 0) ? String(r) : r.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
      };
      const abs = Math.abs(x);
      if (abs >= 1e9) return trim2(x / 1e9) + 'B';
      if (abs >= 1e6) return trim2(x / 1e6) + 'M';
      if (abs >= 1e3) return trim2(x / 1e3) + 'K';
      return Number.isInteger(x) ? String(x) : trim2(x);
    },

    formatNumberFixed: (number) => {
      if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
      if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
      if (number >= 1e3) return (number / 1e3).toFixed(2) + 'K';
      return number.toFixed(2);
    },

    formatNumberWithCommas: (number) => {
      const n = Number(number);
      return isFinite(n) ? n.toLocaleString() : '0';
    },
    formatBytes: (bytes) => {
      if (!isFinite(bytes) || bytes <= 0) return '0 B';
      const units = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB'];
      const i = Math.max(0, Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024))));
      const v = (bytes / (1024 ** i));
      const s = (Math.round(v*100)/100);
      return (s % 1 === 0 ? String(s) : s.toFixed(2)) + ' ' + units[i];
    },
    formatSizeGiB: (gib) => {
      if (!isFinite(gib) || gib <= 0) return '–';
      if (gib >= 1024) return (Math.round((gib / 1024) * 100) / 100).toString().replace(/\.00$/,'') + ' TiB';
      if (gib >= 1) return (Math.round(gib * 100) / 100).toString().replace(/\.00$/,'') + ' GiB';
      const mib = (gib * 1024);
      return (Math.round(mib * 100) / 100).toString().replace(/\.00$/,'') + ' MiB';
    },
    timeMessage: (hours) => {
      const remaining = {
        years: hours / 8760,
        months: hours / 720,
        weeks: hours / 168,
        days: hours / 24,
        hours
      };
      if (remaining.years >= 1) return (Math.round(remaining.years*100)/100).toString() + ' years';
      if (remaining.months >= 1) return (Math.round(remaining.months*100)/100).toString() + ' months';
      if (remaining.weeks >= 1) return (Math.round(remaining.weeks*100)/100).toString() + ' weeks';
      if (remaining.days >= 1) return (Math.round(remaining.days*100)/100).toString() + ' days';
      return (Math.round(remaining.hours*100)/100).toString() + ' hours';
    },
    compactTime: (hours) => {
      if (hours <= 0 || !isFinite(hours)) return '–';
      let h = Math.floor(hours);
      let y = Math.floor(h / 8760); h %= 8760;
      let mo = Math.floor(h / 720); h %= 720;
      let d = Math.floor(h / 24); h %= 24;
      let hh = h;
      const parts = [];
      if (y) parts.push(y + 'y');
      if (mo) parts.push(mo + 'mo');
      if (d) parts.push(d + 'd');
      if (hh) parts.push(hh + 'h');
      return parts.slice(0, 2).join(' ');
    },

    // Clipboard — robust fallback
    copyTextSafe: async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (e1) {
        try {
          GM_setClipboard(text);
        } catch (e2) {
          const ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          try { document.execCommand('copy'); } catch {}
          ta.remove();
        }
      }
    },

    // Sorting helpers
    cellText: (tr, idx) => {
      const td = tr && tr.children ? tr.children[idx] : null;
      return (td && td.innerText ? td.innerText.trim() : '');
    },

    // IDs
    extractTorrentID: (link) => {
      try {
        const u = new URL(link, location.origin);
        const id = parseInt(u.searchParams.get('id'), 10);
        return isNaN(id) ? null : id;
      } catch (e) { return null; }
    },

    // Label map
    labelMappings: {
      '.short-links': {
        'Torrent Uploads': 'Torrents',
        'Upload Rep': 'Reputations',
        'Forum Rep': 'Upvotes',
        'Seed Time': 'SeedTime',
        'Uploader Rep': 'Reputations'
      },
      'td.center-align': {
        'Total Seed Size:': 'Size:',
        'Avg Seed Time:': 'Avg:',
        'Total Downloaded:': 'Downloaded:',
        'Total Uploaded:': 'Uploaded:',
        'Avg Ratio:': 'Ratio:'
      },
      '.cr-wrapper .cr-label': {
        'Seeding now': 'Activity',
        'Current Seed Size': 'SeedSize',
        'Seedbonus Rate': 'BonusRate',
        'Avg Upload': 'UploadRate',
        'Avg Seed time': 'SeedTime'
      },
      'table.boxed.simple-data-table th.center-align': {
        'Seedtime': 'SeedTime',
        'Hourly Seedbonus': 'SeedBonus'
      }
    },

    // Shared size buckets (DRY)
    sizeBuckets: [
      { label: "Under 100 MiB", match(g){ return g < 0.09765625; } },
      { label: "100 MiB ≤ size < 1 GiB", match(g){ return g >= 0.09765625 && g < 1; } },
      { label: "1 GiB ≤ size < 2 GiB", match(g){ return g >= 1 && g < 2; } },
      { label: "2 GiB ≤ size < 5 GiB", match(g){ return g >= 2 && g < 5; } },
      { label: "Above 5 GiB", match(g){ return g >= 5; } }
    ],
  };

  // -------------------------
  // Once guards (avoid duplicate listeners/menus)
  // -------------------------
  const Once = (() => {
    const done = new Set();
    return {
      do(key, fn){ if (done.has(key)) return; done.add(key); try { fn(); } catch(e){ console.error(e); } },
      reset(){ done.clear(); }
    };
  })();

  // -------------------------
  // FeatureBus (+ feature registry for diff reloads)
  // -------------------------
  const FeatureBus = (function () {
    const groups = new Map(); // id -> { id, name, order, features: [] }

    function register(groupId, groupName, featureDef, order) {
      if (order === void 0) order = 0;
      if (!featureDef || !featureDef.key || !featureDef.run || !featureDef.when) {
        throw new Error('Invalid feature registration for group "' + groupId + '".');
      }
      if (!groups.has(groupId)) {
        groups.set(groupId, { id: groupId, name: groupName, order: order, features: [] });
      }
      const g = groups.get(groupId);
      if (g.features.some(function (f) { return f.key === featureDef.key; })) {
        throw new Error('Duplicate feature key: ' + featureDef.key);
      }
      g.features.push(featureDef);
      INTERNAL.featuresByKey.set(featureDef.key, featureDef);
      if (featureDef.observe && featureDef.observe.length) ObservedSelectors.add(featureDef.observe);
    }

    function groupsArray() {
      return Array.from(groups.values()).sort(function (a, b) {
        return (a.order || 0) - (b.order || 0);
      });
    }

    function buildDefaultConfig() {
      return groupsArray().map(function (g) {
        return {
          name: g.name,
          key: 'group_' + g.id,
          options: g.features.map(function (f) {
            const locked = isLocked(f.key);
            return {
              key: f.key,
              label: f.label,
              info: f.info,
              defaultState: f.defaultState,
              state: !!GM_getValue(f.key, f.defaultState),
              locked
            };
          })
        };
      });
    }

    function buildFeatures() {
      var all = [];
      groupsArray().forEach(function (g) { all = all.concat(g.features); });
      return all.map(function (f) {
        return { key: f.key, when: f.when, run: f.run, observe: f.observe || [] };
      });
    }

    function loadStateObject() {
      return groupsArray().flatMap(function (g) { return g.features; })
        .reduce(function (acc, f) {
          acc[f.key] = !!GM_getValue(f.key, f.defaultState);
          return acc;
        }, {});
    }

    return { register: register, buildDefaultConfig: buildDefaultConfig, buildFeatures: buildFeatures, loadStateObject: loadStateObject };
  })();

  // Back-compat shim
  function getCurrentConfig() { return FeatureBus.loadStateObject(); }

  // ---- Config facade
  const Config = (() => {
    let cache = null;
    const load = () => (cache = FeatureBus.loadStateObject());
    return {
      get(key) { return (cache ?? load())[key]; },
      set(key, val) {
        if (isLocked(key)) return;
        GM_setValue(key, !!val);
        (cache ?? load())[key] = !!val;
      },
      reload() { load(); },
      all() { return (cache ?? load()); }
    };
  })();

  // WeakMap/Set markers (avoid attribute churn)
  const mark = { relabeled: new WeakSet(), sorted: new WeakSet() };

  // -------------------------
  // Shared helper UIs (styles)
  // -------------------------
  Dom.cssOnce('tweaxbd-common-css', `
    .tweaxbd-section-title{ font-size:20px; font-weight:bold; margin:10px 0 5px; color:#ccc; text-align:left; }
    .tweaxbd-table{ margin:20px auto; width:95%; border-collapse:collapse; border-spacing:0; }
    .tweaxbd-table thead tr{ background:#27292f; color:#ccc; font-weight:bold; }
    .tweaxbd-table th,.tweaxbd-table td{ padding:6px 8px; border:1px solid rgba(255,255,255,.06); }
    .tweaxbd-compact-note{ font-size:12.5px; opacity:.9; }
    .disabled-disableNonFreeleech-button { opacity: .5 !important; cursor: not-allowed !important; }
    #torrent-id-btn:active { background-color: inherit !important; color: inherit !important; box-shadow: none !important; }
    .copy-button-icon{ display:inline-flex; align-items:center; cursor:pointer; font-size:12px; color:#B0BEC5; vertical-align:middle; margin-right:5px; user-select:none; }
    .copy-button-icon:hover{ color:#78909C; }
    .copy-button-icon-right{ float:right; margin-left:auto; margin-right:5px; }
    .copy-button-icon[role="button"]{ outline:none; }
    .enhanced-button{ display:inline-flex; align-items:center; color:#B0BEC5; text-decoration:none; gap:4px; cursor:pointer; transition: color .3s ease; }
    .enhanced-button .material-icons{ font-size:20px; color:#B0BEC5; transition: color .3s ease; }
    .enhanced-button .button-text{ font-size:14px; transition: color .3s ease; }
    .torrent-links-ui, .kuddus-torrent-links-ui { display:flex; justify-content:center; align-items:center; margin:10px 0; gap:10px; flex-wrap:wrap; }
    .torrent-links-ui input[type="checkbox"], .kuddus-torrent-links-ui input[type="checkbox"] { transform:scale(1.2); margin-right:5px; }
    th.tab-sortable{ cursor:pointer; }
    /* a11y for toast fallback */
    .tweaxbd-toast{ position:fixed; left:50%; transform:translateX(-50%); bottom:20px;
      background:rgba(0,0,0,.85); color:#fff; padding:8px 12px; border-radius:4px; z-index:99999; font-size:13px; max-width:80vw; text-align:center; }
  `);
  // -------------------------
  // Table helper (DOM builder) with rowSpan/colSpan support
  // -------------------------
  const Tables = (() => {
    function normalizeCell(cell, alignDefault) {
      if (cell == null) return { node: document.createTextNode(''), align: alignDefault };
      if (cell instanceof Node) return { node: cell, align: alignDefault };
      if (typeof cell === 'string' || typeof cell === 'number') {
        return { node: document.createTextNode(String(cell)), align: alignDefault };
      }
      // object cell: { text?, node?, align?, rowSpan?, colSpan?, class? }
      const el = cell.node instanceof Node ? cell.node : document.createTextNode(cell.text ?? '');
      return {
        node: el,
        align: cell.align ?? alignDefault,
        rowSpan: cell.rowSpan,
        colSpan: cell.colSpan,
        className: cell.class
      };
    }

    function build(headers, rows, footerCells) {
      const table = Dom.el('table', { class: 'tweaxbd-table bordered simple-data-table' });
      const thead = Dom.el('thead');
      const trh = Dom.el('tr');
      headers.forEach(h => trh.appendChild(Dom.el('th', { style: `text-align:${h.align||'left'}` }, h.label)));
      thead.appendChild(trh); table.appendChild(thead);

      const tbody = Dom.el('tbody');
      rows.forEach(r => {
        const tr = Dom.el('tr');
        r.forEach((cell, i) => {
          const align = headers[i]?.align || 'left';
          const spec = normalizeCell(cell, align);
          const td = Dom.el('td', { style:`text-align:${spec.align}` });
          if (spec.rowSpan > 1) td.setAttribute('rowspan', String(spec.rowSpan));
          if (spec.colSpan > 1) td.setAttribute('colspan', String(spec.colSpan));
          if (spec.className) td.className = spec.className;
          td.appendChild(spec.node);
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
      if (footerCells && footerCells.length) {
        const trf = Dom.el('tr', { style:'font-weight:bold; background:#27292f; color:#ccc;' });
        footerCells.forEach((c,i)=> {
          const align = headers[i]?.align || 'left';
          const spec = normalizeCell(c, align);
          const td = Dom.el('td', { style:`text-align:${spec.align}` });
          if (spec.colSpan > 1) td.setAttribute('colspan', String(spec.colSpan));
          td.appendChild(spec.node);
          trf.appendChild(td);
        });
        tbody.appendChild(trf);
      }
      table.appendChild(tbody);
      return table;
    }
    function sectionTitle(text){ return Dom.el('div', { class:'tweaxbd-section-title' }, text); }
    function insertSectionWithTable({title, anchor, headers, rows, footerCells}) {
      const titleEl = sectionTitle(title);
      anchor.parentNode.insertBefore(titleEl, anchor);
      const tbl = build(headers, rows, footerCells);
      titleEl.parentNode.insertBefore(tbl, titleEl.nextSibling);
      return tbl;
    }
    return { build, sectionTitle, insertSectionWithTable };
  })();

  // -------------------------
  // Unified relabeling engine
  // -------------------------

  // -------------------------
  // NEW: Observed selectors registry (feature opt-in)
  // -------------------------
  const ObservedSelectors = (() => {
    const set = new Set();
    return {
      add(list) { (list||[]).forEach(s => set.add(s)); },
      list() { return Array.from(set); }
    };
  })();

  // -------------------------
  // NEW: resilient toast API (Materialize-safe) + one-toast policy + aria-live
  // -------------------------
  const Toast = {
    show({ message, autoclose = 2000, progress = false, cancelable = false, onCancel } = {}) {
      try { INTERNAL.toastRef?.close?.(); } catch {}
      if (window.M && typeof M.toast === 'function') {
        const t = M.toast({ html: message, displayLength: autoclose });
        const api = {
          updateMessage(html){
            try { if (t && t.el) t.el.innerHTML = html; } catch {}
          },
          updateProgress(){},
          close(){ try { t.dismiss(); } catch {} }
        };
        INTERNAL.toastRef = api;
        return api;
      }
      const box = Dom.el('div', { class:'tweaxbd-toast', role:'status', 'aria-live':'polite' }, message);
      if (cancelable) {
        box.style.cursor = 'pointer';
        box.title = 'Click to cancel';
        box.addEventListener('click', () => { onCancel?.(); api.close(); }, { once:true });
      }
      document.body.appendChild(box);
      const api = {
        updateMessage(t){ box.textContent = t; },
        updateProgress(){},
        close(){ try { box.remove(); } catch {} }
      };
      INTERNAL.toastRef = api;
      setTimeout(api.close, autoclose);
      return api;
    }
  };


  const RelabelTerms = (() => {
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const SEL = '.cr-wrapper .cr-label, td.center-align, .short-links, table.boxed.simple-data-table th.center-align';

    function relabelNode(el) {
      const maps = Utils.labelMappings;
      const map = el.matches?.('.cr-wrapper .cr-label') ? maps['.cr-wrapper .cr-label']
                : el.matches?.('td.center-align')       ? maps['td.center-align']
                : el.matches?.('.short-links')          ? maps['.short-links']
                : el.matches?.('table.boxed.simple-data-table th.center-align')          ? maps['table.boxed.simple-data-table th.center-align']
                : null;
      if (!map) return;

      const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node, changed = false;
      while ((node = tw.nextNode())) {
        let t = node.nodeValue, orig = t;
        for (const [k,v] of Object.entries(map)) t = t.replace(new RegExp(esc(k), 'g'), v);
        if (t !== orig) { node.nodeValue = t; changed = true; }
      }
      if (changed) el.dataset.tweaxRelabeled = '1';
    }

    function applyToRoot(root) {
      if (root && root.nodeType === 1) {
        if (root.matches(SEL)) relabelNode(root);
        root.querySelectorAll?.(SEL).forEach(relabelNode);
      }
    }

    function applyGlobal() { applyToRoot(document.body); }

    FeatureBus.register('ui', 'UI Refinements', {
      key: 'relabelTerms',
      label: 'Relabel Terms',
      info: 'Relabels site terminology for clarity and consistency. Examples: Torrent Uploads → Torrents, Forum Rep → Upvotes.',
      defaultState: true,
      lockedState: true,
      when: () => Router.is('common'),
      observe: [SEL],
      run: () => {
        safeRun(applyGlobal, { idle: true, label: 'relabelTerms' });
        if (!INTERNAL._relabelMO) {
          INTERNAL._relabelMO = new MutationObserver(muts => {
            for (const m of muts) for (const n of m.addedNodes)
              if (n.nodeType === 1) applyToRoot(n);
          });
          INTERNAL._relabelMO.observe(document.body, { childList: true, subtree: true });
        }
      }
    }, 0);

    return { applyToRoot, applyGlobal, SEL };
  })();

  const AbbreviateSeedBonus = (() => {
    const SEL_WRAP = '.crc-wrapper[title*="Seedbonus"] .cr-value';
    const SEL_TD   = '.table.profile-info-table td:has(a#user-sb)';
    const SEL      = `${SEL_WRAP}, ${SEL_TD}`;

    function format(text) {
      const num = parseFloat(text.replace(/[^\d.-]/g, ''));
      if (!isFinite(num) || !/M\b/i.test(text) || num < 1000) return null;
      return (num / 1000).toFixed(2) + ' B';
    }

    function process(el) {
      if (el.dataset.sbAbbrev === '1') return;
      if (el.matches(SEL_TD)) {
        const a = el.querySelector('a#user-sb');
        if (!a) return;
        const f = format(a.textContent.trim());
        if (f) { a.textContent = f; el.dataset.sbAbbrev = '1'; }
      } else if (el.matches(SEL_WRAP)) {
        const f = format(el.textContent.trim());
        if (f) { el.textContent = f; el.dataset.sbAbbrev = '1'; }
      }
    }

    function applyToRoot(root) {
      if (root && root.nodeType === 1) {
        if (root.matches(SEL)) process(root);
        root.querySelectorAll?.(SEL).forEach(process);
      }
    }
    function applyGlobal() { applyToRoot(document.body); }

    FeatureBus.register('ui', 'UI Refinements', {
      key: 'abbreviateSeedBonus',
      label: 'Seedbonus Abbreviations',
      info: 'Displays large values in a compact format. Example: 1000M → 1B.',
      defaultState: true,
      when: () => Router.is('common'),
      observe: [SEL],
      run: () => {
        safeRun(applyGlobal, { idle: true, label: 'abbreviateSeedBonus' });
        if (!INTERNAL._sbMO) {
          INTERNAL._sbMO = new MutationObserver(muts => {
            for (const m of muts) for (const n of m.addedNodes)
              if (n.nodeType === 1) applyToRoot(n);
          });
          INTERNAL._sbMO.observe(document.body, { childList: true, subtree: true });
        }
      }
    }, 0);

    return { applyToRoot, applyGlobal, SEL };
  })();

  const DisableNonFreeleech = (() => {
    const MARK = 'disabled-disableNonFreeleech-button';
    const OBS  = [
      '.card-content.torr-card',
      '.torrents-table',
      '.movie-torrents-table',
      'tbody tr',
      'td.torrent-name',
      '#dl-btn'
    ];

    // Unified “this item has FL” detector (covers TV page variants too)
    const ICONS = [
      'img[alt="Freeleech"]',
      'img[alt="FL"]',
      '.fl-icon',
      '.badge-fl',
      '.freeleech',
      '[data-rel="fl"]',
      '[data-fl="1"]',
      'td.torrent-name img.rel-icon',
      'img.rel-icon[alt="FL"]',
      'i[title*="Freeleech" i]',
      'i[aria-label*="Freeleech" i]'
    ].join(', ');

    // Include TV-style rows that aren’t inside .torrents-table
    const CASES = [
      ['.card-content.torr-card', ICONS, '#dl-btn, a[href*="download.php?id="]'],
      ['.torrents-table tbody tr', ICONS, 'td a[href*="download.php?id="]'],
      ['.movie-torrents-table tbody tr', ICONS, 'td a[href*="download.php?id="]'],
      ['tbody tr', ICONS, 'td a[href*="download.php?id="]'] // TV fallback
    ];

    const hasSitewideFL = () =>
      !!document.querySelector('img[alt="Freeleech Day"], .freeleech-banner, [data-fl="1"][data-scope="site"]');

    const shouldBlock = () => !Utils.isPersonalFreeleech() && !hasSitewideFL();

    function trapClickOnce() {
      if (document.body.dataset.freeleechListenerAttached) return;
      document.body.addEventListener('click', (e) => {
        const btn = e.target.closest?.(`.${MARK}`);
        if (btn) {
          e.preventDefault();
          e.stopPropagation();
          Toast.show({ message: 'Enable Personal Freeleech or wait for sitewide Freeleech!', autoclose: 2500 });
        }
      }, { capture: true });
      document.body.dataset.freeleechListenerAttached = 'true';
    }

    function disableBtn(btn) {
      if (!btn.classList.contains(MARK)) {
        const href = btn.getAttribute('href');
        if (href && !btn.dataset.hrefBackup) btn.dataset.hrefBackup = href;
        btn.classList.add(MARK);
        btn.removeAttribute('href');
        btn.setAttribute('aria-disabled', 'true');
      }
    }

    function enableBtn(btn) {
      if (btn.classList.contains(MARK)) {
        if (btn.dataset.hrefBackup) btn.setAttribute('href', btn.dataset.hrefBackup);
        btn.removeAttribute('aria-disabled');
        btn.classList.remove(MARK);
      }
    }

    function processScope(root) {
      const block = shouldBlock();

      CASES.forEach(([itemSel, iconSel, btnSel]) => {
        root.querySelectorAll?.(itemSel).forEach(item => {
          // Only treat rows that actually have a download link (filters out random <tr>)
          const btns = item.querySelectorAll(btnSel);
          if (!btns.length) return;

          const hasFL = !!item.querySelector(iconSel);
          btns.forEach(btn => {
            if (block && !hasFL) disableBtn(btn); else enableBtn(btn);
          });
        });
      });

      // Page-level button (details page etc.)
      const pageBtn = root.querySelector?.('#dl-btn, a.btn[href*="download.php?id="]');
      if (pageBtn) {
        const pageHasFL = !!root.querySelector(ICONS);
        if (block && !pageHasFL) disableBtn(pageBtn); else enableBtn(pageBtn);
      }

      trapClickOnce();
    }

    function applyToRoot(root) {
      if (root && root.nodeType === 1) processScope(root);
    }

    function applyGlobal() {
      processScope(document);
    }

    FeatureBus.register('guard', 'Guardrails', {
      key: 'disableNonFreeleech',
      label: 'Disable Non Freeleech Downloads',
      info: 'Disables downloads when freeleech is off.',
      defaultState: false,
      when: () => Router.is('home') || Router.is('profile') || Router.is('details') || Router.is('movies') || Router.is('tv'),
      observe: OBS,
      run: () => {
        safeRun(applyGlobal, { idle: true, label: 'disableNonFreeleech' });
        if (!INTERNAL._flMO) {
          INTERNAL._flMO = new MutationObserver(muts => {
            for (const m of muts) for (const n of m.addedNodes)
              if (n.nodeType === 1) applyToRoot(n);
          });
          INTERNAL._flMO.observe(document.body, { childList: true, subtree: true });
        }
      }
    }, 1);

    return { applyToRoot, applyGlobal, OBS, CASES };
  })();

  const ProfileMerit = (() => {
    const SEL = '.short-links';

    function compute() {
      const wrappers = Array.prototype.slice.call(document.querySelectorAll(SEL));
      const torrentsNode = wrappers.find(function (n) { return /Torrents|Torrent Uploads/i.test(n.textContent); });
      const reputationsNode = wrappers.find(function (n) { return /Reputations|Upload Rep|Uploader Rep|Forum Rep/i.test(n.textContent); });
      if (torrentsNode && reputationsNode) {
        const torrentsValue = Utils.extractNumber((torrentsNode.querySelector('.short-link-counter') || {}).textContent || '0');
        const reputationsValue = Utils.extractNumber((reputationsNode.querySelector('.short-link-counter') || {}).textContent || '0');
        const merit = torrentsValue > 0 ? (reputationsValue / torrentsValue).toFixed(2).replace(/\.00$/, '') : '0';
        const exists = wrappers.some(function (el) { return /\bMerit\b/i.test(el.textContent); });
        if (!exists) {
          const node = Dom.el('div', { class: 'short-links' }, [
            'Merit ',
            Dom.el('span', { class: 'short-link-counter' }, merit)
          ]);
          reputationsNode.parentNode.insertBefore(node, reputationsNode.nextSibling);
        }
      }
    }

    FeatureBus.register('profile', 'Profile', {
      key: 'profileMerit',
      label: 'Merit metric',
      info: 'Shows reputations per torrent upload.',
      defaultState: true,
      when: function () { return Router.is('profile'); },
      observe: [SEL],
      run: () => safeRun(compute, { idle: true, label: 'profileMerit' })
    }, 2);

    return { compute, SEL };
  })();

  const ProfileEfficiency = (() => {
    const SEL = '.cr-wrapper';

    function compute() {
      const wrappers = Array.from(document.querySelectorAll('.cr-wrapper'));

      const findByLabel = (labels) => {
        return wrappers.find(w => {
          const l = w.querySelector('.cr-label');
          return l && labels.includes(l.textContent.trim());
        }) || null;
      };

      const seedSizeNode = findByLabel(['SeedSize', 'Current Seed Size']);
      const bonusRateNode = findByLabel(['BonusRate', 'Seedbonus Rate']);
      if (!seedSizeNode || !bonusRateNode) return;

      const cleanVal = (el) =>
        (el?.textContent || '')
          .trim()
          .replace(/^.*?:\s*/, '')
          .replace(/,/g, '');

      const sizeGiB = Utils.toGiB(cleanVal(seedSizeNode.querySelector('.cr-value')));
      const bonus    = Utils.extractNumber(cleanVal(bonusRateNode.querySelector('.cr-value')));

      if (!isFinite(sizeGiB) || sizeGiB <= 0 || !isFinite(bonus)) return;

      const effText = (bonus / sizeGiB).toFixed(2).replace(/\.00$/, '') + '/GiB';

      const existing = findByLabel(['Efficiency']);
      if (existing) {
        const v = existing.querySelector('.cr-value');
        if (v) v.textContent = ' : ' + effText;
        return;
      }

      const node = Dom.el('div', { class: 'cr-wrapper' }, [
        Dom.el('div', { class: 'cr-label' }, 'Efficiency'),
        Dom.el('div', { class: 'cr-value' }, [': ', effText])
      ]);
      bonusRateNode.after(node);
    }

    FeatureBus.register('profile', 'Profile', {
      key: 'profileEfficiency',
      label: 'Efficiency metric',
      info: 'Shows hourly Seedbonus per GiB (BonusRate / SeedSize).',
      defaultState: true,
      when: () => Router.is('profile'),
      observe: [SEL],
      run: () => safeRun(compute, { idle: true, label: 'profileEfficiency' })
    }, 2);

    return { compute, SEL };
  })();

  const ProfileFlexZone = (() => {
    const ID = 'tweaxbd-flexzone';
    const OBS = ['.short-links', '.cr-wrapper', '.tp-container', 'h6.sub-h6'];

    function findCol(node) {
      let n = node;
      while (n && n !== document.body && !(n.classList && n.classList.contains('col'))) n = n.parentElement;
      return (n && n.classList.contains('col')) ? n : null;
    }

    function findAnchorCol() {
      const header = Array.from(document.querySelectorAll('h6.sub-h6'))
        .find(h => /\blinks\b/i.test(h.textContent) || /\buser\s*info\b/i.test(h.textContent));
      if (header) return findCol(header);

      const anyShort = document.querySelector('.short-links');
      if (anyShort) return findCol(anyShort);

      const anyCr = document.querySelector('.cr-wrapper');
      if (anyCr) return findCol(anyCr);

      const candidates = document.querySelectorAll('#middle-block .col:nth-child(2), main .col:nth-child(2), .row .col:nth-child(2)');
      for (const c of candidates) {
        if (!c) continue;
        const h = c.querySelector('h6.sub-h6');
        const hasGoodHeader = h && (/\blinks\b/i.test(h.textContent) || /\buser\s*info\b/i.test(h.textContent));
        const hasKnownBlocks = c.querySelector('.short-links, .cr-wrapper');
        if (hasGoodHeader || hasKnownBlocks) return c;
      }

      return null;
    }

    function readShortCounter(re) {
      const n = Array.from(document.querySelectorAll('.short-links')).find(el => re.test(el.textContent));
      const v = n?.querySelector('.short-link-counter')?.textContent?.trim();
      return v ? v.replace(/,/g, '') : null;
    }

    const num = (s) => {
      const m = (s || '').match(/[0-9,.]+/);
      return m ? Number(m[0].replace(/,/g, '')) : NaN;
    };

    function meritValue() {
      const v = readShortCounter(/\bMerit\b/i);
      if (v) return v;
      const tStr = readShortCounter(/Torrents|Torrent Uploads/i);
      const rStr = readShortCounter(/Reputations|Upload Rep|Uploader Rep|Forum Rep/i);
      const t = num(tStr), r = num(rStr);
      if (Number.isFinite(t) && t > 0 && Number.isFinite(r)) return (r / t).toFixed(2).replace(/\.00$/, '');
      return '-';
    }

    function collect() {
      const wrappers = Array.from(document.querySelectorAll('.cr-wrapper'));
      const findValue = (labels) => {
        const node = wrappers.find(w => {
          const l = w.querySelector('.cr-label');
          return l && labels.includes(l.textContent.trim());
        });
        const vEl = node ? node.querySelector('.cr-value') : null;
        return vEl ? vEl.textContent.trim().replace(/^.*?:\s*/, '').replace(/,/g, '') : '-';
      };

      const title = document.querySelector('.tp-container')?.getAttribute('title') || '';
      const popularity = (title.match(/^(\d+(?:\.\d+)?)/) || [, '-'])[1];

      return {
        merit: meritValue(),
        popularity,
        seedSize: findValue(['SeedSize', 'Current Seed Size']),
        bonusRate: findValue(['BonusRate', 'Seedbonus Rate']),
        efficiency: findValue(['Efficiency']),
        uploadRate: findValue(['UploadRate', 'Avg Upload']),
        seedTime: findValue(['SeedTime', 'Avg Seed time']),
      };
    }

    const row = (k, v) => Dom.el('div', { class: 'cr-wrapper' }, [
      Dom.el('div', { class: 'cr-label' }, k),
      Dom.el('div', { class: 'cr-value' }, [': ', v]),
    ]);

    function ensurePlacement(flexEl) {
      const anchorCol = findAnchorCol();
      const rowEl = anchorCol?.parentElement;
      if (!rowEl || !anchorCol) return;
      const alreadyBefore = flexEl.parentElement === rowEl && flexEl.nextElementSibling === anchorCol;
      if (!alreadyBefore) rowEl.insertBefore(flexEl, anchorCol);
    }

    function render() {
      const anchorCol = findAnchorCol();
      if (!anchorCol) return;

      const d = collect();
      let flex = document.getElementById(ID);

      const inner = Dom.el('div', {}, [
        Dom.el('h6', { class: 'sub-h6' }, 'FlexZone'),
        Dom.el('div', { class: 'margin-b-10' }, [
          row('Merit', d.merit),
          row('Popularity', d.popularity),
          row('SeedSize', d.seedSize),
          row('BonusRate', d.bonusRate),
          row('Efficiency', d.efficiency),
          row('UploadRate', d.uploadRate),
          row('SeedTime', d.seedTime),
        ]),
      ]);

      ObserverGate.pause(() => {
        if (!flex) {
          flex = Dom.el('div', { id: ID, class: 'col s12 m5' });
          flex.appendChild(inner);
          anchorCol.parentElement.insertBefore(flex, anchorCol);
        } else {
          flex.innerHTML = '';
          flex.appendChild(inner);
          ensurePlacement(flex);
        }
      });
    }

    FeatureBus.register('profile', 'Profile', {
      key: 'profileFlexZone',
      label: 'FlexZone panel',
      info: 'Adds a compact stats panel on profile page (fixed placement)',
      defaultState: true,
      when: () => Router.is('profile'),
      observe: OBS,
      run: () => safeRun(render, { idle: true, label: 'profileFlexZone' }),
    }, 2);

    return { render };
  })();

  const SeedbonusEstimation = (() => {
    const OBS = ['.center-align.tx-1-1'];

    function compute() {
      const seedBonusElement = document.querySelector('.center-align.tx-1-1');
      if (!seedBonusElement) return;
      if (seedBonusElement.dataset._tweaxOptimized === '1') return; // prevent re-render loops

      const regex = /(\d+(?:\.\d+)?)\s*x\s*(\d+)\s*=\s*(\d+(?:\.\d+)?)/i;
      const timeMultipliers = { hour: 1, day: 24, week: 168, month: 720, year: 8760 };

      const raw = (seedBonusElement.textContent || '').trim().replace(/,/g, '');
      const match = raw.match(regex);

      const extracted = match ? parseFloat(match[3]) : Utils.extractNumber(raw);
      const hourlyPoints = Number.isFinite(extracted) && extracted > 0 ? extracted : null;
      if (!match && hourlyPoints == null) return;

      const displayPoints = match
        ? `${parseFloat(match[1]).toFixed(2)} <span style="color:#ff0000;"
             onmouseover="this.style.color='#d00';"
             onmouseout="this.style.color='#ff0000';">
             x${parseInt(match[2],10)} = ${parseFloat(match[3]).toFixed(2)}
           </span>`
        : `${hourlyPoints.toFixed(2)}`;

      const seedPoints = {
        day:   hourlyPoints * timeMultipliers.day,
        week:  hourlyPoints * timeMultipliers.week,
        month: hourlyPoints * timeMultipliers.month,
        year:  hourlyPoints * timeMultipliers.year
      };

      const createLink = (text, title, color, hoverColor, fontSize = '1em') => {
        const a = document.createElement('a');
        a.href = 'seedbonus-breakdown.php';
        a.title = title;
        a.style.cssText = `font-weight:bold;color:${color};text-decoration:none;transition:color .3s;font-size:${fontSize};`;
        a.innerHTML = text;
        a.addEventListener('mouseover', () => (a.style.color = hoverColor));
        a.addEventListener('mouseout',  () => (a.style.color = color));
        return a;
      };

      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode('If you continue seeding, you will receive upto '));
      frag.appendChild(createLink(
        displayPoints,
        'Click to see details seedbonus breakdown',
        '#66ff66', '#5fe3b7', '1.5em'
      ));
      frag.appendChild(document.createTextNode(' points per hour.'));
      frag.appendChild(document.createElement('br'));
      frag.appendChild(document.createTextNode('Resulting '));

      const parts = [
        { txt: `${Utils.formatNumber(seedPoints.day)}/day`,     tip: `${seedPoints.day.toFixed(2)} per day`,   c:'#4caf50',  h:'#a6f5a6' },
        { txt: `${Utils.formatNumber(seedPoints.week)}/week`,   tip: `${seedPoints.week.toFixed(2)} per week`, c:'#2196f3',  h:'#90d8ff' },
        { txt: `${Utils.formatNumber(seedPoints.month)}/month`, tip: `${seedPoints.month.toFixed(2)} per month`, c:'#ffab40', h:'#ffe680' },
        { txt: `${Utils.formatNumber(seedPoints.year)}/year`,   tip: `${seedPoints.year.toFixed(2)} per year`, c:'#ff7043',  h:'#ffa480' }
      ];
      parts.forEach((p, i) => {
        frag.appendChild(createLink(p.txt, p.tip, p.c, p.h));
        frag.appendChild(document.createTextNode(i < parts.length - 1 ? ', ' : '.'));
      });

      const currentSeedBonusEl = document.querySelector('h5.intro-h.center-align span');
      const currentSeedBonus = currentSeedBonusEl ? parseFloat(currentSeedBonusEl.textContent.replace(/,/g, '')) : 0;
      const millionaire = 1_000_000, billionaire = 1_000_000_000;
      const hToM = Math.max(millionaire - currentSeedBonus, 0) / hourlyPoints;
      const hToB = Math.max(billionaire - currentSeedBonus, 0) / hourlyPoints;

      frag.appendChild(document.createElement('br'));
      const status = document.createElement('span');
      status.innerHTML =
        currentSeedBonus >= billionaire
          ? `Congratulations, you're already a <span class="tbdrank star-uploader">billionaire</span>! 🎉`
          : currentSeedBonus >= millionaire
            ? `You're already a <span class="tbdrank wizard">millionaire</span>! 🎉 Keep it up! You are approximately <span class="tbdrank mvp">${Utils.timeMessage(hToB)}</span> away from becoming a <span class="tbdrank star-uploader">billionaire</span>.`
            : `You're on your way to becoming a <span class="tbdrank wizard">millionaire</span>! It will take you approximately <span class="tbdrank mvp">${Utils.timeMessage(hToM)}</span> to get there.`;
      frag.appendChild(status);

      ObserverGate.pause(() => {
        seedBonusElement.innerHTML = '';
        seedBonusElement.appendChild(frag);
        seedBonusElement.dataset._tweaxOptimized = '1';
      });
    }

    FeatureBus.register('seedbonus', 'Seedbonus', {
      key: 'seedbonusEstimation',
      label: 'Estimation header',
      info: 'Show hourly/daily/monthly/yearly seedbonus projections',
      defaultState: true,
      when: () => Router.is('seedbonus'),
      observe: OBS,
      run: () => safeRun(compute, { idle: true, label: 'seedbonusEstimation' })
    }, 3);

    return { compute, OBS };
  })();

  const SeedbonusTableTransform = (() => {
    const OBS = ['#pre-notes-trg'];

    function render() {
      const targetDiv = document.getElementById('pre-notes-trg');
      if (!targetDiv) return;

      ObserverGate.pause(() => {
        targetDiv.innerHTML = `
          <div class="note">For every 60 Minutes of seeding you will receive Seedbonus points per torrent according to the following criteria:</div>
          <div class="overflow-x">
            <table class="table boxed sbpd-table">
              <thead>
                <tr><th style="width: 30%;" class="center-align">Torrent Size</th><th style="width: 50%;">Hourly Seedbonus rate</th><th style="width: 20%;" class="center-align">Hourly Limit</th></tr>
              </thead>
              <tbody>
                <tr><td>Under 100 MiB</td><td style="text-align: left;">No points for torrents under 100 MiB.</td><td class="center-align"><span class="red-text">none</span></td></tr>
                <tr><td>100 MiB ≤ size &lt; 1 GiB</td><td style="text-align: left;">Earn 0.4 points per torrent.</td><td class="center-align"><span class="red-text">200</span></td></tr>
                <tr><td>1 GiB ≤ size &lt; 2 GiB</td><td style="text-align: left;">Earn up to 25 points per torrent.</td><td class="center-align" rowspan="3" valign="top"><span class="green-text">unlimited</span></td></tr>
                <tr><td>2 GiB ≤ size &lt; 5 GiB</td><td style="text-align: left;">Earn up to 40 points per torrent.</td></tr>
                <tr><td>Above 5 GiB</td><td style="text-align: left;">Earn up to 50 points per torrent.</td></tr>
              </tbody>
            </table>
          </div>
          <div class="note">For torrents over 1 GiB, points increase over time, and larger sizes earn them faster.</div>
          <div class="note">Receive <b>500 points</b> by filling a <a href="requests.php" target="_blank">Request</a>.</div>
          <div class="note">Receive <b>50 points</b> for every torrent you upload.</div>
          <div class="note">For every thanks/reputation point in your uploaded torrents, you will receive <b>5 points</b></div>
          <div class="note">A user can gift you up to <b>1000 points</b> in your uploaded torrent. So try to upload quality contents.</div>
        `;
      });
    }

    FeatureBus.register('seedbonus', 'Seedbonus', {
      key: 'seedbonusTableTransform',
      label: 'Table: criteria/notes',
      info: 'Rewrites the criteria table into a clearer layout',
      defaultState: true,
      when: () => Router.is('seedbonus'),
      observe: OBS,
      run: () => safeRun(render, { idle: true, label: 'seedbonusTableTransform' })
    }, 3);

    return { render, OBS };
  })();

  const FixSeedbonusLogs = (() => {
    const OBS = ['.bordered.simple-data-table'];

    function fix() {
      const table = document.querySelector('.bordered.simple-data-table');
      if (!table) return;

      const prev = table.previousElementSibling;
      if (!(prev && prev.dataset && prev.dataset.tweaxTitle === 'trading')) {
        const title = document.createElement('div');
        title.textContent = 'Trading';
        Object.assign(title.style, {
          fontSize: '20px',
          fontWeight: 'bold',
          textAlign: 'left',
          marginTop: '20px'
        });
        title.dataset.tweaxTitle = 'trading';
        table.parentNode.insertBefore(title, table);
      }

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        const cell1 = row.cells[1];
        if (!cell1) return;
        const txt = cell1.textContent.trim();

        if (txt === 'Username') {
          row.cells[3].textContent = 'Changed Username';
        } else if (!txt) {
          row.cells[1].textContent = 'Featured';
          row.cells[3].textContent = 'Featured Torrent';
        }
      });
    }

    FeatureBus.register('seedbonus', 'Seedbonus', {
      key: 'fixSeedbonusLogs',
      label: 'Fix Seedbonus Log History',
      info: 'Fix category or description for seedbonus history entries',
      defaultState: true,
      lockedState: true,
      when: () => Router.is('seedbonusHistory'),
      observe: OBS,
      run: () => safeRun(fix, { idle: true, label: 'fixSeedbonusLogs' })
    }, 3);

    return { fix, OBS };
  })();

  const FixBreakdownColumns = (() => {
    const OBS = ['.table.boxed.simple-data-table', '.simple-data-table'];

    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

    // sample max visible text length for a column (includes header)
    function maxTextLen(table, colIdx, limit = 600) {
      let max = 0, n = 0;
      const grab = (el) => (el?.innerText || '').replace(/\s+/g, ' ').trim();
      // header cell
      const h = table.querySelector(`thead th:nth-child(${colIdx+1})`);
      if (h) max = Math.max(max, grab(h).length);

      // body cells
      table.querySelectorAll('tbody tr').forEach(tr => {
        if (n >= limit) return;
        const td = tr.children[colIdx];
        if (!td) return;
        const t = grab(td);
        if (!t) return;
        max = Math.max(max, t.length);
        n++;
      });
      return max;
    }

    function findHeaderIndexes(table) {
      const ths = table.querySelectorAll('thead th');
      const headerCells = ths.length ? ths : table.querySelectorAll('tbody > tr:first-child th');
      const names = Array.from(headerCells).map(th => (th.innerText || '').trim().toLowerCase());

      const idx = {
        torrent: names.findIndex(t => /torrent/i.test(t)),
        size: names.findIndex(t => /^size$/i.test(t)),
        seedtime: names.findIndex(t => /^seed\s*time$/i.test(t) || /seedtime/i.test(t)),
        seedbonus: names.findIndex(t => /^seed\s*bonus$/i.test(t) || /bonus/i.test(t))
      };

      // fallbacks by position
      const colCount = headerCells.length || (table.querySelector('tbody tr')?.children.length || 0);
      if (idx.torrent   < 0) idx.torrent   = 0;
      if (idx.size      < 0 && colCount >= 2) idx.size = 1;
      if (idx.seedtime  < 0 && colCount >= 3) idx.seedtime = 2;
      if (idx.seedbonus < 0 && colCount >= 4) idx.seedbonus = 3;
      return idx;
    }

    function ensureColgroup(table, colCount) {
      // remove any previous attempt
      table.querySelectorAll(':scope > colgroup.tweaxbd-bd-colgroup, :scope > colgroup.tweaxbd-bd-colgroup2')
        .forEach(cg => cg.remove());
      const cg = document.createElement('colgroup');
      cg.className = 'tweaxbd-bd-colgroup2';
      for (let i = 0; i < colCount; i++) cg.appendChild(document.createElement('col'));
      table.insertBefore(cg, table.firstChild);
      return cg;
    }

    function setColumnPx(table, colIdx, px) {
      if (colIdx < 0) return;
      const cg = table.querySelector(':scope > colgroup.tweaxbd-bd-colgroup2');
      const col = cg?.children[colIdx];
      if (col) {
        col.style.width = px + 'px';
        col.style.minWidth = px + 'px';
      }
      // keep numeric columns tidy & right-aligned (headers + cells)
      table.querySelectorAll(`thead th:nth-child(${colIdx+1}), tbody td:nth-child(${colIdx+1})`).forEach(el => {
        el.style.whiteSpace = 'nowrap';
        el.style.textAlign = 'right';
      });
    }

    function fix() {
      const table =
        document.querySelector('.table.boxed.simple-data-table') ||
        document.querySelector('.simple-data-table');
      if (!table) return;

      // undo any previous forced fixed-layout
      table.classList.remove('tweaxbd-bd-fixed');

      const headerRow = table.querySelector('thead tr') || table.querySelector('tbody tr');
      if (!headerRow) return;

      const colCount = headerRow.children.length;
      ensureColgroup(table, colCount);

      const idx = findHeaderIndexes(table);

      // measure content and map to pixels (avg glyph ~ 7.5–8px in this UI)
      const pxPerChar = 8;

      const lenSize      = maxTextLen(table, idx.size);
      const lenSeedTime  = maxTextLen(table, idx.seedtime);
      const lenSeedBonus = maxTextLen(table, idx.seedbonus);

      // conservative clamps so headers never truncate and values don't wrap
      const wSizePx      = clamp(Math.ceil((lenSize + 1)      * pxPerChar),  90, 150); // e.g., "123.45 GiB"
      const wSeedTimePx  = clamp(Math.ceil((lenSeedTime + 1)  * pxPerChar), 100, 170); // e.g., "11mo 23d"
      const wSeedBonusPx = clamp(Math.ceil((lenSeedBonus + 1) * pxPerChar),  90, 140); // e.g., "SeedBonus"/"50"

      setColumnPx(table, idx.size,      wSizePx);
      setColumnPx(table, idx.seedtime,  wSeedTimePx);
      setColumnPx(table, idx.seedbonus, wSeedBonusPx);

      // keep Torrent column left-aligned and flexible
      table.querySelectorAll(`thead th:nth-child(${idx.torrent+1}), tbody td:nth-child(${idx.torrent+1})`).forEach(el => {
        el.style.textAlign = 'left';
        el.style.whiteSpace = 'normal'; // allow wrapping long titles
      });
    }

    FeatureBus.register('seedbonus', 'Seedbonus', {
      key: 'fixBreakdownColumns',
      label: 'Fix column widths (breakdown)',
      info: 'Sizes Size/SeedTime/SeedBonus in pixels based on content; Torrent stays flexible.',
      defaultState: true,
      when: () => Router.is('breakdown'),
      observe: OBS,
      run: () => safeRun(fix, { idle: true, label: 'fixBreakdownColumns' })
    }, 3);

    return { fix, OBS };
  })();

  const FixSeedingTable = (() => {
    const OBS = ['.table.boxed.simple-data-table', '.simple-data-table'];

    // ---- tiny helpers ----
    const grab = (el) => (el?.innerText || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
    const isVisible = (el) => el && el.isConnected && el.offsetParent !== null && getComputedStyle(el).display !== 'none';

    // size ↔ GiB
    function toGiB(t) {
      if (!t) return 0;
      const s = String(t).replace(/,/g, '').trim();
      const m = s.match(/([-+]?[0-9]*\.?[0-9]+)/);
      const n = m ? parseFloat(m[1]) : 0;
      if (/pi?b/i.test(s)) return n * 1024 * 1024;
      if (/ti?b/i.test(s)) return n * 1024;
      if (/gi?b/i.test(s)) return n;
      if (/mi?b/i.test(s)) return n / 1024;
      if (/ki?b/i.test(s)) return n / (1024 * 1024);
      if (/bytes?\b|[^a-z]b$/i.test(s)) return n / (1024 ** 3);
      return n || 0;
    }
    const fmtSize = (g) => g >= 1024 ? (g / 1024).toFixed(2) + ' TiB'
                        : g >= 1    ?  g.toFixed(2)        + ' GiB'
                                    : (g * 1024).toFixed(2) + ' MiB';

    // seed time
    function seedHours(t) {
      if (!t) return 0;
      let h = 0, m;
      const re = /(\d+)\s*(y|mo|w|d|h|m)\b/gi;
      while ((m = re.exec(String(t)))) {
        const v = +m[1], u = m[2].toLowerCase();
        if (u === 'y')  h += v * 8760;
        else if (u === 'mo') h += v * 720;
        else if (u === 'w')  h += v * 168;
        else if (u === 'd')  h += v * 24;
        else if (u === 'h')  h += v;
        else if (u === 'm')  h += v / 60;
      }
      return h;
    }
    function fmtTime(h) {
      let hrs = Math.max(0, Number(h) || 0);
      if (hrs <= 0) return '–';
      const years  = Math.floor(hrs / 8760); hrs %= 8760;
      const months = Math.floor(hrs / 720);  hrs %= 720;
      const days   = Math.floor(hrs / 24);   hrs %= 24;
      const hours  = Math.floor(hrs);
      const parts = [];
      if (years)  parts.push(`${years}y`);
      if (months) parts.push(`${months}mo`);
      if (!years && !months && days) parts.push(`${days}d`);
      if (!years && !months && hours && parts.length < 2) parts.push(`${hours}h`);
      return parts.slice(0, 2).join(' ');
    }

    // table + header
    function getTable() {
      return document.querySelector('.table.boxed.simple-data-table') ||
             document.querySelector('.simple-data-table');
    }
    function getHeaderRow(table) {
      return table.querySelector('thead tr') || table.querySelector('tbody tr');
    }
    function ensureSizeHeader(headerRow) {
      const cells = Array.from(headerRow.children);
      if (cells.some(th => /^size$/i.test(grab(th)))) return;
      const th = document.createElement('th');
      th.textContent = 'Size';
      cells[0].insertAdjacentElement('afterend', th);
    }

    // move “Size: …” out of Torrent cell
    function extractSizeFromTorrent(td) {
      if (!td) return '-';
      const dv = Array.from(td.querySelectorAll('div')).find(d => /^size\s*:/i.test(grab(d)));
      if (dv) {
        const m = grab(dv).match(/^size\s*:\s*(.+)$/i);
        dv.remove();
        return m ? m[1].trim() : '-';
      }
      const m2 = grab(td).match(/size\s*:\s*([0-9][0-9.,]*)\s*(pi?b|ti?b|gi?b|mi?b|ki?b|bytes|b)\b/i);
      return m2 ? (m2[1] + ' ' + m2[2]) : '-';
    }

    // colgroup (percent widths – light & fast, no measuring)
    function ensureColgroup(table, count) {
      table.querySelectorAll(':scope > colgroup.tweax-seeding-pct').forEach(cg => cg.remove());
      const cg = document.createElement('colgroup');
      cg.className = 'tweax-seeding-pct';
      for (let i = 0; i < count; i++) cg.appendChild(document.createElement('col'));
      table.insertBefore(cg, table.firstChild);
      return cg;
    }
    function setPct(cg, i, pct) {
      const c = cg.children[i];
      if (c) c.style.width = pct + '%';
    }
    function alignCol(table, i, align, nowrap) {
      table.querySelectorAll(`thead th:nth-child(${i+1}), tbody td:nth-child(${i+1})`).forEach(el => {
        el.style.textAlign = align;
        el.style.whiteSpace = nowrap ? 'nowrap' : 'normal';
      });
    }

    // totals row (single + updated)
    function findOurTotals(table) {
      return table.querySelector('tbody tr[data-tweax-total="1"]') || null;
    }
    function hideOriginalTotals(table) {
      const last = table.querySelector('tbody tr:last-child');
      const looksBold = last && /bold/i.test((last.getAttribute('style')||'')) &&
                        Array.from(last.children).every(c => c.tagName === 'TD');
      if (looksBold) last.style.display = 'none';
    }
    function makeBadge(ch, title) {
      const s = document.createElement('span');
      s.textContent = ch;
      s.title = title;
      Object.assign(s.style, {
        display:'inline-block', border:'1px solid currentColor', borderRadius:'999px',
        padding:'1px 6px', fontSize:'10px', opacity:'.8', lineHeight:'1', marginRight:'6px'
      });
      return s;
    }
    function makeAggCell(val, kind /* 'sum' | 'avg' */) {
      const td = document.createElement('td');
      td.className = 'center-align';
      td.style.whiteSpace = 'nowrap';
      const wrap = document.createElement('span');
      Object.assign(wrap.style, { display:'inline-flex', alignItems:'center', gap:'6px' });
      wrap.appendChild(makeBadge(kind === 'sum' ? 'Σ' : 'μ', kind === 'sum' ? 'Total' : 'Average'));
      const v = document.createElement('span');
      v.textContent = val;
      v.style.fontWeight = '600';
      wrap.appendChild(v);
      td.appendChild(wrap);
      return td;
    }

    function recomputeTotals(table) {
      hideOriginalTotals(table);

      const rows = Array.from(table.querySelectorAll('tbody tr'))
        .filter(tr => isVisible(tr) && tr.querySelectorAll('td').length && tr !== findOurTotals(table));

      let sumSize=0, sumDown=0, sumUp=0, sumSeedH=0, nSeed=0, sumRatio=0, nRatio=0;

      for (const tr of rows) {
        if (tr.dataset.tweaxTotal === '1') continue; // our row, skip
        const td = tr.children;
        if (!td || td.length < 6) continue;

        const gSize = toGiB(grab(td[1]));       if (gSize) sumSize += gSize;
        const gDown = toGiB(grab(td[3]));       if (gDown) sumDown += gDown;
        const gUp   = toGiB(grab(td[4]));       if (gUp)   sumUp   += gUp;

        const h     = seedHours(grab(td[2]));   if (h > 0) { sumSeedH += h; nSeed++; }

        const r     = parseFloat(grab(td[5]).replace(/,/g,''));
        if (Number.isFinite(r)) { sumRatio += r; nRatio++; }
      }

      const avgSeed  = nSeed  ? (sumSeedH / nSeed) : 0;
      const avgRatio = nRatio ? (sumRatio / nRatio) : 0;

      let trT = findOurTotals(table);
      if (!trT) {
        trT = document.createElement('tr');
        trT.dataset.tweaxTotal = '1';
        trT.style.fontWeight = '600';
        table.querySelector('tbody').appendChild(trT);
      }
      trT.innerHTML = '';

      const td0 = document.createElement('td');
      td0.textContent = 'Totals (visible)';
      td0.style.textAlign = 'left';
      trT.appendChild(td0);

      trT.appendChild(makeAggCell(fmtSize(sumSize), 'sum'));
      trT.appendChild(makeAggCell(fmtTime(avgSeed), 'avg'));
      trT.appendChild(makeAggCell(fmtSize(sumDown), 'sum'));
      trT.appendChild(makeAggCell(fmtSize(sumUp),   'sum'));
      trT.appendChild(makeAggCell((Math.round(avgRatio*100)/100).toString(), 'avg'));
    }

    function addSizeCells(table, headerRow) {
      const rows = Array.from(table.querySelectorAll('tbody tr'))
        .filter(r => r !== headerRow && r.dataset.tweaxTotal !== '1' && r.querySelectorAll('td').length);

      for (const tr of rows) {
        const tds = Array.from(tr.children);
        // if header was just added, rows still have old cell count → insert Size col once
        if (tds.length === headerRow.children.length) continue;
        const torrentTD = tds[0];
        const newTD = document.createElement('td');
        newTD.className = 'center-align';
        newTD.textContent = extractSizeFromTorrent(torrentTD) || '-';
        torrentTD.insertAdjacentElement('afterend', newTD);
      }
    }

    function setWidths(table) {
      const header = getHeaderRow(table);
      const cg = ensureColgroup(table, header.children.length);

      // 0 Torrent | 1 Size | 2 SeedTime | 3 Downloaded | 4 Uploaded | 5 Ratio
      setPct(cg, 0, 55);
      setPct(cg, 1, 12);
      setPct(cg, 2, 12);
      setPct(cg, 3, 10);
      setPct(cg, 4, 8);
      setPct(cg, 5, 3);

      alignCol(table, 0, 'left',  false);
      alignCol(table, 1, 'right', true);
      alignCol(table, 2, 'right', true);
      alignCol(table, 3, 'right', true);
      alignCol(table, 4, 'right', true);
      alignCol(table, 5, 'right', true);
    }

    function fix() {
      const table = getTable();
      if (!table) return;
      if (table.dataset.tweaxSeedingBusy === '1') return; // re-entrancy guard

      table.dataset.tweaxSeedingBusy = '1';
      try {
        const header = getHeaderRow(table);
        if (!header) return;

        ensureSizeHeader(header);
        addSizeCells(table, header);
        setWidths(table);
        recomputeTotals(table);
      } finally {
        delete table.dataset.tweaxSeedingBusy;
      }
    }

    try {
      FeatureBus.register('seedbonus', 'Seedbonus', {
        key: 'fixSeedingTable',
        label: 'Add Size column & totals (seeding)',
        info: 'Adds Size column after Torrent, moves values out of Torrent, sets compact widths, and keeps a single totals row based on visible items.',
        defaultState: true,
        when: () => (typeof Router !== 'undefined' ? Router.is('activities') : true),
        observe: OBS,
        run: () => safeRun(fix, { idle: true, label: 'fixSeedingTable' })
      }, 3);
    } catch {
      fix();
    }

    return { fix, OBS };
  })();

  const SeedbonusTradeSummary = (() => {
    const OBS = ['.bordered.simple-data-table'];
    const ID  = 'tweaxbd-trade-summary';

    function compute() {
      const srcTable = document.querySelector('.bordered.simple-data-table');
      if (!srcTable) return;

      if (document.getElementById(ID)) return;

      const rows = srcTable.querySelectorAll('tbody tr');
      if (!rows.length) return;

      const categorySums = {
        Traffic:   { sum: 0, count: 0, redeem: 0, unit: 'traffic' },
        Freeleech: { sum: 0, count: 0, redeem: 0, unit: 'hours'   },
        Featured:  { sum: 0, count: 0, redeem: 0, unit: 'torrents'},
        Username:  { sum: 0, count: 0, redeem: 0, unit: 'times'   },
        Rank:      { sum: 0, count: 0, redeem: 0, unit: 'times'   }
      };

      function getRedeemData(cells, category) {
        const text = (cells[3]?.textContent || '').trim();
        if (category === 'Traffic') {
          const m = text.match(/(\d+(?:\.\d+)?)\s*(TiB|GiB|MiB|KiB|PiB|B|Bytes)/i) || [];
          const val  = parseFloat(m[1] || '0');
          const unit = (m[2] || '').toUpperCase();
          const gib = isNaN(val) ? 0 : (
            unit === 'PIB' ? val * 1024 * 1024 :
            unit === 'TIB' ? val * 1024 :
            unit === 'GIB' ? val :
            unit === 'MIB' ? val / 1024 :
            unit === 'KIB' ? val / 1024 / 1024 :
            0
          );
          return { value: gib, unit: 'traffic' };
        } else if (category === 'Freeleech') {
          const h = parseInt((text.match(/\d+/) || ['0'])[0], 10);
          return { value: h, unit: 'hours' };
        }
        return { value: 0, unit: '' };
      }

      rows.forEach((row) => {
        const cells = row.querySelectorAll('td');
        const category = (cells[1]?.textContent?.trim() || '') || 'Featured';
        const points   = parseInt((cells[2]?.textContent || '').trim().replace(',', ''), 10);
        const redeem   = getRedeemData(cells, category);
        if (isNaN(points) || !categorySums[category]) return;
        categorySums[category].sum    += points;
        categorySums[category].count  += 1;
        categorySums[category].redeem += redeem.value;
      });

      categorySums.Featured.redeem = categorySums.Featured.count;
      categorySums.Username.redeem = categorySums.Username.count;
      categorySums.Rank.redeem     = categorySums.Rank.count;

      const make = (tag, text) => {
        const el = document.createElement(tag);
        if (text != null) el.textContent = text;
        return el;
      };

      const wrapper = document.createElement('div');
      wrapper.id = ID;

      const title = make('div', 'Trading Summary');
      title.style.fontSize   = '20px';
      title.style.fontWeight = 'bold';
      title.style.textAlign  = 'left';
      title.style.marginBottom = '5px';
      title.style.marginLeft   = '10px';
      wrapper.appendChild(title);

      const table = make('table');
      table.className = 'bordered simple-data-table';
      table.style.marginLeft  = '20px';
      table.style.marginRight = '20px';
      table.style.width       = '80%';

      const headRow = make('tr');
      headRow.style.backgroundColor = '#27292f';
      const th1 = make('th', 'Category'); th1.style.padding = '6px 8px'; th1.style.textAlign = 'left';
      const th2 = make('th', 'Count');    th2.style.padding = '6px 8px'; th2.style.textAlign = 'center';
      const th3 = make('th', 'Redeem');   th3.style.padding = '6px 8px'; th3.style.textAlign = 'center';
      const th4 = make('th', 'Points');   th4.style.padding = '6px 8px'; th4.style.textAlign = 'right';
      headRow.append(th1, th2, th3, th4);
      table.appendChild(headRow);

      let totalPoints = 0;

      function formatRedeem(d) {
        return d.unit === 'traffic'
          ? Utils.formatSizeGiB(d.redeem)
          : (d.redeem + (['hours','torrents','times'].includes(d.unit) ? (' ' + d.unit) : ''));
      }

      function addRow(label, data, isTotal) {
        const tr = make('tr');
        if (isTotal) { tr.style.fontWeight = 'bold'; tr.style.backgroundColor = '#27292f'; }

        const td1 = make('td', label); td1.style.padding = '6px 8px'; td1.style.textAlign = 'left';
        const td2 = make('td', String(data.count ?? '')); td2.style.padding = '6px 8px'; td2.style.textAlign = 'center';
        const td3 = make('td', isTotal ? '' : formatRedeem(data)); td3.style.padding = '6px 8px'; td3.style.textAlign = 'center';
        const td4 = make('td', Utils.formatNumberFixed(data.sum ?? 0)); td4.style.padding = '6px 8px'; td4.style.textAlign = 'right';

        tr.append(td1, td2, td3, td4);
        table.appendChild(tr);
      }

      Object.keys(categorySums).forEach((cat) => {
        const d = categorySums[cat];
        totalPoints += d.sum;
        addRow(cat, d, false);
      });
      addRow('Total', { sum: totalPoints, count: '', redeem: 0, unit: '' }, true);

      wrapper.appendChild(table);

      const parent = document.querySelector('.content-title');
      const anchorParent = parent?.parentNode || srcTable.parentNode;

      ObserverGate.pause(() => {
        anchorParent.insertBefore(wrapper, (parent?.nextSibling) || srcTable.nextSibling);
      });
    }

    FeatureBus.register('seedbonus', 'Seedbonus', {
      key: 'seedbonusTradeSummary',
      label: 'Summary: seedbonus-history',
      info: 'Aggregate points by category, with totals',
      defaultState: true,
      when: () => Router.is('seedbonusHistory'),
      observe: OBS,
      run: () => IO.onVisibleAll('.bordered.simple-data-table',
        () => safeRun(compute, { idle: true, label: 'seedbonusTradeSummary' }))
    }, 3);

    return { compute, OBS, ID };
  })();

  const SeedbonusBreakdownSummary = (() => {
    const OBS = ['.simple-data-table'];
    const ID  = 'tweaxbd-bd-summary'; // duplicate guard

    function compute() {
      const tb = document.querySelector('.simple-data-table tbody'); if (!tb) return;
      const rows = tb.querySelectorAll('tr:not(:first-child)'); if (!rows.length) return;
      if (document.getElementById(ID)) return;

      // EXACT same buckets as the old table (no "Under 100 MiB")
      const CATEGORIES = [
        { label: "100 MiB ≤ size < 1 GiB", maxRate: 0.4, match: (g) => g >= 0.09765625 && g < 1 },
        { label: "1 GiB ≤ size < 2 GiB",   maxRate: 25,  match: (g) => g >= 1 && g < 2 },
        { label: "2 GiB ≤ size < 5 GiB",   maxRate: 40,  match: (g) => g >= 2 && g < 5 },
        { label: "Above 5 GiB",            maxRate: 50,  match: (g) => g >= 5 }
      ];

      const stats = Object.fromEntries(
        CATEGORIES.map(c => [c.label, { count:0, maxed:0, volume:0, earning:0, maxRate:c.maxRate }])
      );

      rows.forEach(r => {
        const sizeText = r.children[1]?.textContent?.trim() || '';
        const bonusTxt = r.children[3]?.textContent?.trim() || '';
        const g = Utils.toGiB(sizeText);
        const b = Utils.extractNumber(bonusTxt);
        if (!isFinite(g) || !isFinite(b)) return;
        const cat = CATEGORIES.find(c => c.match(g)); if (!cat) return;
        const s = stats[cat.label];
        s.count++; s.volume += g; s.earning += b; if (b >= s.maxRate && s.maxRate > 0) s.maxed++;
      });

      const total = { count:0, maxed:0, volume:0, earning:0, potential:0 };

      const formatNum  = (v) => isFinite(v) ? v.toLocaleString(undefined, { minimumFractionDigits:2, maximumFractionDigits:2 }) : '–';
      const make       = (tag, text) => { const el = document.createElement(tag); if (text!=null) el.textContent = text; return el; };

      const panel = document.querySelector('.card-panel.col.s12.overflow-x');
      const howItWorks = panel?.querySelector('a[href*="faq.php"]')?.parentNode || null;
      if (!panel || !howItWorks) return;

      ObserverGate.pause(() => {
        const title = make('div', 'Breakdown Summary');
        Object.assign(title.style, {
          fontSize:'20px', fontWeight:'bold', margin:'10px 0 5px', textAlign:'left'
        });

        // Build borderless table (do NOT use Tables.build or the tweaxbd-table class)
        const table = document.createElement('table');
        // No 'tweaxbd-table' => no per-cell borders
        table.style.margin = '20px auto';
        table.style.width  = '95%';
        table.style.borderCollapse = 'collapse';
        table.style.borderSpacing  = '0';
        table.id = ID;

        // THEAD
        const thead = document.createElement('thead');
        const hr = document.createElement('tr');
        hr.style.background = '#27292f';
        const headers = [
          ['Category','left'],
          ['Count','right'],
          ['Maxed','right'],
          ['Potential','right'],
          ['Earning','right'],
          ['Progress','right'],
          ['SeedSize','right'],
          ['Efficiency','right']
        ];
        headers.forEach(([label,align]) => {
          const th = make('th', label);
          th.style.padding = '6px 8px'; th.style.textAlign = align;
          hr.appendChild(th);
        });
        thead.appendChild(hr); table.appendChild(thead);

        // TBODY
        const tbody = document.createElement('tbody');

        CATEGORIES.forEach(({ label }) => {
          const s = stats[label];
          const potential  = s.count * s.maxRate;
          const progress   = potential > 0 ? (s.earning / potential * 100) : 0;
          const efficiency = s.volume > 0 ? (s.earning / s.volume) : 0;

          total.count     += s.count;
          total.maxed     += s.maxed;
          total.volume    += s.volume;
          total.earning   += s.earning;
          total.potential += potential;

          const tr = document.createElement('tr');

          const cells = [
            [label, 'left'],
            [String(s.count), 'right'],
            [String(s.maxed), 'right'],
            [formatNum(potential), 'right'],
            [formatNum(s.earning), 'right'],
            [progress.toFixed(2) + '%', 'right'],
            [Utils.formatSizeGiB(s.volume), 'right'],
            [efficiency.toFixed(2), 'right']
          ];
          cells.forEach(([txt, align]) => {
            const td = make('td', txt);
            td.style.padding = '6px 8px'; td.style.textAlign = align;
            tr.appendChild(td);
          });

          tbody.appendChild(tr);
        });

        // TOTAL row
        const totalProgress   = total.potential > 0 ? (total.earning / total.potential * 100) : 0;
        const totalEfficiency = total.volume > 0 ? (total.earning / total.volume) : 0;

        const trTotal = document.createElement('tr');
        trTotal.style.fontWeight = 'bold';
        trTotal.style.background = '#27292f';

        [
          ['Total','left'],
          [String(total.count),'right'],
          [String(total.maxed),'right'],
          [formatNum(total.potential),'right'],
          [formatNum(total.earning),'right'],
          [totalProgress.toFixed(2)+'%','right'],
          [Utils.formatSizeGiB(total.volume),'right'],
          [totalEfficiency.toFixed(2),'right']
        ].forEach(([txt,align]) => {
          const td = make('td', txt);
          td.style.padding = '6px 8px'; td.style.textAlign = align;
          trTotal.appendChild(td);
        });

        tbody.appendChild(trTotal);
        table.appendChild(tbody);

        // Insert and clean up the “How it works” box
        howItWorks.parentNode.insertBefore(title, howItWorks);
        howItWorks.parentNode.insertBefore(table, title.nextSibling);
        howItWorks.remove();
      });
    }

    FeatureBus.register('seedbonus', 'Seedbonus', {
      key: 'seedbonusBreakdownSummary',
      label: 'Summary: breakdown',
      info: 'Aggregate potential/earning/efficiency by size class',
      defaultState: true,
      when: () => Router.is('breakdown'),
      observe: OBS,
      run: () => {
        const fire = () => safeRun(compute, { idle: true, label: 'seedbonusBreakdownSummary' });

        // run now
        fire();

        // also when the source table becomes visible
        if (document.querySelector('.simple-data-table')) {
          IO.onVisibleAll('.simple-data-table', fire);
        }

        // fallback poll
        let tries = 0;
        const iv = setInterval(() => {
          if (document.getElementById(ID)) return clearInterval(iv);
          const tb = document.querySelector('.simple-data-table tbody');
          const panel = document.querySelector('.card-panel.col.s12.overflow-x');
          const how  = panel?.querySelector('a[href*="faq.php"]')?.parentNode;
          if (tb && panel && how) fire();
          if (++tries > 60 || document.getElementById(ID)) clearInterval(iv);
        }, 150);

        window.addEventListener('load', fire, { once: true });
      }
    }, 3);

    return { compute, OBS };
  })();

  const ActivitiesSeedingSummary = (() => {
    const OBS = ['#seeding', '.simple-data-table'];
    const ID  = 'tweax-seeding-summary';

    // ===== Safe shims to Utils (works with old/new names) =====
    const toGiB = (t) => {
      if (!t) return 0;
      try {
        if (Utils?.toGiB) return Number(Utils.toGiB(t));
        if (Utils?.convertToGiB) return Number(Utils.convertToGiB(t));
      } catch {}
      const s = String(t).replace(/,/g, '').trim();
      const n = parseFloat(s.match(/[-+]?[0-9]*\.?[0-9]+/)?.[0] || '0');
      if (/pi?b/i.test(s)) return n * 1024 * 1024;
      if (/ti?b/i.test(s)) return n * 1024;
      if (/gi?b/i.test(s)) return n;
      if (/mi?b/i.test(s)) return n / 1024;
      if (/ki?b/i.test(s)) return n / (1024 * 1024);
      if (/bytes?\b|[^a-z]b$/i.test(s)) return n / (1024 ** 3);
      return n || 0;
    };

    const seedHours = (t) => {
      if (!t) return 0;
      try {
        if (Utils?.parseSeedTimeHours)     return Number(Utils.parseSeedTimeHours(t));
        if (Utils?.convertSeedTimeToHours) return Number(Utils.convertSeedTimeToHours(t));
      } catch {}
      let hours = 0, m;
      const re = /(\d+)\s*(y|mo|w|d|h|m)\b/gi;
      while ((m = re.exec(String(t)))) {
        const v = parseInt(m[1], 10);
        const u = m[2].toLowerCase();
        if (u === 'y')  hours += v * 8760;
        else if (u === 'mo') hours += v * 720;
        else if (u === 'w')  hours += v * 168;
        else if (u === 'd')  hours += v * 24;
        else if (u === 'h')  hours += v;
        else if (u === 'm')  hours += v / 60;
      }
      return hours;
    };

    const fmtSize = (g) => {
      try { if (Utils?.formatSizeGiB) return Utils.formatSizeGiB(g); } catch {}
      const v = Number(g) || 0;
      if (v <= 0) return '–';
      return v >= 1024 ? (v / 1024).toFixed(2) + ' TiB'
           : v >= 1    ? v.toFixed(2)        + ' GiB'
                       : (v * 1024).toFixed(2) + ' MiB';
    };

    const fmtTime = (h) => {
      try { if (Utils?.compactTime) return Utils.compactTime(h); } catch {}
      let hrs = Math.max(0, Number(h) || 0);
      if (hrs <= 0) return '–';
      const years  = Math.floor(hrs / 8760); hrs %= 8760;
      const months = Math.floor(hrs / 720);  hrs %= 720;
      const days   = Math.floor(hrs / 24);   hrs %= 24;
      const hours  = Math.floor(hrs);
      const parts = [];
      if (years)  parts.push(`${years}y`);
      if (months) parts.push(`${months}mo`);
      if (!years && !months && days) parts.push(`${days}d`);
      if (!years && !months && hours && parts.length < 2) parts.push(`${hours}h`);
      return parts.slice(0, 2).join(' ');
    };
    // ==========================================================

    const CATS = [
      { label: 'Under 100 MiB',          match: (g) => g < 0.09765625 },
      { label: '100 MiB ≤ size < 1 GiB', match: (g) => g >= 0.09765625 && g < 1 },
      { label: '1 GiB ≤ size < 2 GiB',   match: (g) => g >= 1 && g < 2 },
      { label: '2 GiB ≤ size < 5 GiB',   match: (g) => g >= 2 && g < 5 },
      { label: 'Above 5 GiB',            match: (g) => g >= 5 },
    ];

    // real data row (not header/total/our summary)
    function looksLikeSeedingRow(tr) {
      const tds = tr?.querySelectorAll('td');
      if (!tds || !tds.length) return false;

      // Exclude the bottom total/average row (varies across skins)
      const hasTotalish = Array.from(tds).some(td => /^\s*(avg|average|total)\s*:/i.test(td.innerText || ''));
      if (hasTotalish) return false;

      if (tr === tr.parentElement?.lastElementChild) return false; // common “summary at bottom” heuristic

      // must look like a torrent row
      const td0 = tds[0];
      const txt0 = (td0.innerText || '').toLowerCase();
      if (td0.querySelector('a[href*="torrents-details.php?id="]')) return true; // most reliable
      if (/size\s*[:=]\s*\d/i.test(txt0)) return true; // legacy “Size: …” inside first cell
      return false;
    }

    // pick the data table (never our summary)
    function getSeedingTable() {
      const near = document.querySelector('#seeding');
      const nearTable =
        near?.parentElement?.querySelector('.overflow-x table') ||
        near?.closest('.col')?.querySelector('.overflow-x table') ||
        document.querySelector('#seeding ~ .col .overflow-x table, #seeding + .col .overflow-x table');

      const valid = (t) => t && !t.closest('#' + ID);
      if (valid(nearTable)) return nearTable;

      const all = Array.from(document.querySelectorAll('table')).filter(t => !t.closest('#' + ID));
      for (const t of all) {
        const rows = Array.from(t.querySelectorAll('tbody tr'));
        if (rows.some(looksLikeSeedingRow)) return t;
      }
      return null;
    }

    // Extract Size from first cell (legacy layout)
    function extractSizeGiBFromFirstCell(td) {
      if (!td) return NaN;
      const flat = (td.innerText || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
      let m = flat.match(/size\s*[:=]?\s*([0-9][0-9.,]*)\s*(pi?b|ti?b|gi?b|mi?b|ki?b|bytes|b)\b/i);
      if (m) return toGiB(m[1] + ' ' + m[2]);
      const all = [...flat.matchAll(/([0-9][0-9.,]*)\s*(pi?b|ti?b|gi?b|mi?b|ki?b|bytes|b)\b/ig)];
      if (all.length) {
        const last = all[all.length - 1];
        return toGiB(last[1] + ' ' + last[2]);
      }
      return NaN;
    }

    // Detect column indexes for new & old layouts
    function detectColumnIdx(table) {
      let size = -1, seed = -1, down = -1, up = -1;

      // Headers may be in <thead> or first <tbody> row.
      const headerCells = Array.from(
        table.querySelectorAll('thead th, tbody > tr:first-child th')
      );
      if (headerCells.length) {
        const names = headerCells.map(th => (th.innerText || '').trim().toLowerCase());
        const find = (re) => names.findIndex(h => re.test(h));

        size = find(/^size$/i);
        seed = find(/(^seed\s*time$)|\bseedtime\b/i);
        down = find(/^downloaded$/i);
        up   = find(/^uploaded$/i);
        // If we found enough via headers, return early.
        if ((size >= 0 || true) && (seed >= 0 || down >= 0 || up >= 0)) {
          // continue; we’ll still sanity-check via a data row below
        }
      }

      const row = Array.from(table.querySelectorAll('tbody tr')).find(looksLikeSeedingRow);
      if (row) {
        const tds = row.querySelectorAll('td');
        const timeRe = /\b(\d+\s*y|\d+\s*mo|\d+\s*w|\d+\s*d|\d+\s*h|\d+\s*m)\b/i;
        const unitRe = /(?:pi?b|ti?b|gi?b|mi?b|ki?b|bytes|b)\b/i;

        // seed time column by pattern
        if (seed < 0) {
          for (let i = 1; i < tds.length; i++) {
            const txt = (tds[i].innerText || '').replace(/\u00A0/g, ' ').trim();
            if (timeRe.test(txt)) { seed = i; break; }
          }
        }

        // collect size-like cells (Size/Downloaded/Uploaded)
        const sizeLikes = [];
        for (let i = 1; i < tds.length; i++) {
          const txt = (tds[i].innerText || '').replace(/\u00A0/g, ' ').trim();
          if (unitRe.test(txt)) sizeLikes.push(i);
        }

        // If header told us where Size is, remove it from candidates
        if (size >= 0) {
          const j = sizeLikes.indexOf(size);
          if (j >= 0) sizeLikes.splice(j, 1);
        } else {
          // Heuristic: if there are 3 size-like columns, the leftmost is usually Size
          if (sizeLikes.length >= 3) {
            size = sizeLikes.shift();
          }
        }

        if (down < 0 && sizeLikes.length)     down = sizeLikes.shift();
        if (up   < 0 && sizeLikes.length)     up   = sizeLikes.shift();
      }

      // Absolute fallbacks (old common layout)
      // Old: Torrent | SeedTime | Downloaded | Uploaded | Ratio
      if (seed < 0) seed = 1;
      if (down < 0) down = 2;
      if (up   < 0) up   = 3;

      return { size, seed, down, up };
    }

    function sourceRows(table) {
      return Array.from(table.querySelectorAll('tbody tr')).filter(tr => {
        if (!tr.querySelectorAll('td').length) return false;
        if (tr.classList.contains('mt_more') || tr.querySelector('.mt_more-trigger')) return false;
        if (tr.closest('#' + ID)) return false;   // never our own table
        return looksLikeSeedingRow(tr);
      });
    }

    function collect(table) {
      const idx = detectColumnIdx(table);
      const stats = Object.fromEntries(CATS.map(c => [c.label, { count:0, size:0, seed:0, down:0, up:0 }]));

      for (const tr of sourceRows(table)) {
        const tds = tr.querySelectorAll('td');

        // NEW layout: read from Size column; OLD: parse from first cell.
        let gSize = Number.NaN;
        if (idx.size >= 0 && tds[idx.size]) {
          gSize = toGiB((tds[idx.size].innerText || '').trim());
        }
        if (!Number.isFinite(gSize)) {
          gSize = extractSizeGiBFromFirstCell(tds[0]);
        }
        if (!Number.isFinite(gSize)) continue;

        const seedText = idx.seed >= 0 ? (tds[idx.seed]?.innerText || '').trim() : '';
        const downText = idx.down >= 0 ? (tds[idx.down]?.innerText || '').trim() : '';
        const upText   = idx.up   >= 0 ? (tds[idx.up]?.innerText   || '').trim() : '';

        const hSeed = seedHours(seedText);
        const gDown = toGiB(downText);
        const gUp   = toGiB(upText);

        const cat = CATS.find(c => c.match(gSize));
        if (!cat) continue;

        const s = stats[cat.label];
        s.count++;
        s.size += gSize;
        s.seed += Number.isFinite(hSeed) ? hSeed : 0;
        s.down += Number.isFinite(gDown) ? gDown : 0;
        s.up   += Number.isFinite(gUp)   ? gUp   : 0;
      }

      const total = Object.values(stats).reduce((t, s) => ({
        count: t.count + s.count,
        size:  t.size  + s.size,
        seed:  t.seed  + s.seed,
        down:  t.down  + s.down,
        up:    t.up    + s.up
      }), { count:0,size:0,seed:0,down:0,up:0 });

      return { stats, total };
    }

    // where to place the summary
    function mount(wrapper) {
      const finder = document.querySelector('.occurrence-finder') ||
                     document.querySelector('input[placeholder*="Search" i]');
      const searchBox = finder
        ? (finder.closest('.mt-10.mb-10') || finder.closest('.mt-10') ||
           finder.closest('.mb-10') || finder.closest('.col') ||
           finder.closest('.row') || finder.parentElement)
        : null;

      const dataTable = getSeedingTable();

      if (searchBox?.parentNode) {
        ObserverGate.pause(() => searchBox.parentNode.insertBefore(wrapper, searchBox));
        return;
      }
      if (dataTable?.parentNode) {
        ObserverGate.pause(() => dataTable.parentNode.insertBefore(wrapper, dataTable));
        return;
      }
      const header = document.getElementById('seeding');
      if (header?.parentNode) {
        ObserverGate.pause(() => header.parentNode.insertBefore(wrapper, header.nextSibling));
        return;
      }
      ObserverGate.pause(() => document.body.prepend(wrapper));
    }

    function render(agg) {
      let wrapper = document.getElementById(ID);
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = ID;
      } else {
        wrapper.innerHTML = '';
      }

      const title = document.createElement('div');
      title.textContent = 'Seeding Summary';
      Object.assign(title.style, { fontSize:'20px', fontWeight:'bold', margin:'10px 0 5px', textAlign:'left' });
      wrapper.appendChild(title);

      const table = document.createElement('table');
      table.style.margin = '20px auto';
      table.style.width = '95%';
      table.style.borderCollapse = 'collapse';
      table.style.borderSpacing = '0';

      const thead = document.createElement('thead');
      const hr = document.createElement('tr');
      hr.style.background = '#27292f';
      hr.style.fontWeight = 'bold';
      ['Category','Count','Size','SeedTime','Downloaded','Uploaded','Ratio'].forEach((h,i)=>{
        const th = document.createElement('th');
        th.textContent = h;
        th.style.padding = '6px 8px';
        th.style.textAlign = (i === 0 ? 'left' : 'right');
        hr.appendChild(th);
      });
      thead.appendChild(hr);
      table.appendChild(thead);

      const tbody = document.createElement('tbody');

      CATS.forEach(({ label }) => {
        const s = agg.stats[label];
        const tr = document.createElement('tr');
        const ratio = s.down > 0 ? (s.up / s.down) : 0;

        const cells = [
          [label, 'left'],
          [String(s.count), 'right'],
          [fmtSize(s.size), 'right'],
          [fmtTime(s.seed), 'right'],
          [fmtSize(s.down), 'right'],
          [fmtSize(s.up), 'right'],
          [(Math.round(ratio * 100) / 100).toString(), 'right']
        ];
        cells.forEach(([txt, align]) => {
          const td = document.createElement('td');
          td.textContent = txt;
          td.style.padding = '6px 8px';
          td.style.textAlign = align;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });

      const T = agg.total;
      const totalRatio = T.down > 0 ? (T.up / T.down) : 0;
      const trT = document.createElement('tr');
      trT.style.background = '#27292f';
      trT.style.fontWeight = 'bold';
      [
        ['Total','left'],
        [String(T.count),'right'],
        [fmtSize(T.size),'right'],
        [fmtTime(T.seed),'right'],
        [fmtSize(T.down),'right'],
        [fmtSize(T.up),'right'],
        [(Math.round(totalRatio * 100) / 100).toString(),'right']
      ].forEach(([txt, align]) => {
        const td = document.createElement('td');
        td.textContent = txt;
        td.style.padding = '6px 8px';
        td.style.textAlign = align;
        trT.appendChild(td);
      });
      tbody.appendChild(trT);

      table.appendChild(tbody);
      wrapper.appendChild(table);

      if (!wrapper.isConnected) mount(wrapper);
    }

    function compute() {
      const table = getSeedingTable();
      if (!table) return;
      const agg = collect(table);
      render(agg);
    }

    FeatureBus.register('activities', 'Activities', {
      key: 'activitiesSeedingSummary',
      label: 'Summary: activities',
      info: 'Aggregate by size class with totals and ratio (supports new/old seeding tables).',
      defaultState: true,
      when: () => Router.is('activities'),
      observe: OBS,
      run: () => {
        const fire = () => safeRun(compute, { idle: true, label: 'activitiesSeedingSummary' });
        fire();
        IO.onVisibleAll('.simple-data-table, .overflow-x table', fire);

        let tries = 0;
        const iv = setInterval(() => {
          if (document.getElementById(ID)) return clearInterval(iv);
          fire();
          if (++tries > 120 || document.getElementById(ID)) clearInterval(iv);
        }, 150);

        window.addEventListener('load', fire, { once: true });
      }
    }, 4);

    return { compute, OBS, ID };
  })();

  const AutoExpandSeasons = (() => {
    const OBS = ['.sc-trigger', 'tr.epi-trigger', '.center-align.mtiub', 'tbody'];
    const BTN_ID = 'toggle-button';
    let isExpanded = false;

    const qSeasonTriggers  = () => Array.from(document.querySelectorAll('.sc-trigger[href^="season"]'));
    const qEpisodeTriggers = () => Array.from(document.querySelectorAll('tr.epi-trigger'));

    function toggleClick(elements, cond) {
      elements.forEach(el => {
        const icon = el.querySelector('i');
        if (cond(icon ? icon.textContent : '')) el.click();
      });
    }

    function toggleElements() {
      const seasonTriggers  = qSeasonTriggers();
      const episodeTriggers = qEpisodeTriggers();
      if (!seasonTriggers.length && !episodeTriggers.length) return;

      toggleClick(seasonTriggers, txt => isExpanded ? txt === 'expand_less' : txt === 'expand_more');
      toggleClick(episodeTriggers, () => true);

      isExpanded = !isExpanded;
      const btn = document.getElementById(BTN_ID);
      if (btn) btn.setAttribute('aria-pressed', String(isExpanded));
    }

    function ensureButton() {
      if (document.getElementById(BTN_ID)) return;
      const container = document.querySelector('.center-align.mtiub') || document.querySelector('tbody');
      if (!container) return;

      const btn = Dom.el('a', {
        id: BTN_ID, class: 'btn topsl-btn', href: '#', role: 'button',
        'aria-pressed': 'false', tabindex: '0', style: 'margin-left:10px'
      }, [
        Dom.el('i', { class: 'material-icons left' }, 'unfold_more'),
        'Toggle'
      ]);

      btn.addEventListener('click', (e) => { e.preventDefault(); toggleElements(); });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleElements(); }
      });

      ObserverGate.pause(() => container.appendChild(btn));
    }

    function run() {
      // only add button when there’s something to toggle
      if (!qSeasonTriggers().length && !qEpisodeTriggers().length) return;
      ensureButton();
    }

    FeatureBus.register('movies_tv', 'Movies & TV', {
      key: 'tvAutoExpand',
      label: 'Toggle seasons/episodes',
      info: 'Single button to expand/collapse all seasons & episodes',
      defaultState: true,
      when: () => Router.is('movies') || Router.is('tv'),
      observe: OBS,
      run: () => safeRun(run, { idle: true, label: 'tvAutoExpand' })
    }, 5);

    return { run, OBS, BTN_ID };
  })();

  const TorrentStats = (() => {
    const ID  = 'tweaxbd-movie-stats';
    const OBS = ['.movie-torrents-table', '.tv-table', '.movie-title-block'];
    const TABLE_SEL = 'table.torrents-table.movie-torrents-table, table.tv-table';
    const CACHE = new Map();

    // Accept only integers (e.g., 0, 25, 1,735). Reject "8.60 GiB", "4y 6mo", etc.
    function parseIntCell(txt) {
      const raw = (txt || '').trim();
      const compact = raw.replace(/\s+/g, '');
      if (!/^(?:\d{1,3}(?:,\d{3})*|\d+)$/.test(compact)) return NaN;
      return parseInt(compact.replace(/,/g, ''), 10);
    }

    function findSLCIndexes(table){
      const ths = table.tHead?.rows?.[0]?.cells || [];
      let s=-1,l=-1,c=-1;
      for (let i=0;i<ths.length;i++){
        const t=(ths[i].textContent||'').trim().toLowerCase();
        if (s<0 && (t==='s'||t.includes('seed'))) s=i;
        else if (l<0 && (t==='l'||t.includes('leech'))) l=i;
        else if (c<0 && (t==='c'||t.includes('complete'))) c=i;
      }
      // Only trust indexes if all 3 were found
      if (s<0 || l<0 || c<0) return { s:-1, l:-1, c:-1 };
      return { s,l,c };
    }

    function parseRowSLC(tr, idxs){
      const tds = tr.cells;

      // Header-based (movies table)
      if (idxs && idxs.s>=0 && idxs.l>=0 && idxs.c>=0 && tds.length > Math.max(idxs.s, idxs.l, idxs.c)) {
        const s = parseIntCell(tds[idxs.s]?.textContent);
        const l = parseIntCell(tds[idxs.l]?.textContent);
        const c = parseIntCell(tds[idxs.c]?.textContent);
        return [Number.isNaN(s)?0:s, Number.isNaN(l)?0:l, Number.isNaN(c)?0:c];
      }

      // Fallback (TV tables without headers): take last 3 integer-only cells in the row
      const ints = [];
      for (const td of tds) {
        const n = parseIntCell(td.textContent);
        if (!Number.isNaN(n)) ints.push(n);
      }
      if (ints.length < 3) return [0,0,0];
      const slice = ints.slice(-3);
      return [slice[0], slice[1], slice[2]]; // S, L, C
    }

    function isDataRow(tr){
      // Count only rows that actually represent a torrent (have details link)
      return !!tr.querySelector('a[href*="torrents-details.php?id="]');
    }

    function sumTablesFromRoot(root){
      let seeders = 0, leechers = 0, completions = 0;
      const tables = root.querySelectorAll(TABLE_SEL);

      tables.forEach(table => {
        const idxs = findSLCIndexes(table);
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(tr => {
          if (!isDataRow(tr)) return;
          const [s,l,c] = parseRowSLC(tr, idxs);
          seeders += s; leechers += l; completions += c;
        });
      });

      return { seeders, leechers, completions };
    }

    function buildStatsEl({seeders, leechers, completions}){
      return Dom.el('div', { class:'col s12 center', style:'margin-top:12px; margin-bottom:8px; text-align:left; font-weight:bold' }, [
        Dom.el('div', { class:'inline-item green100 tooltipped mr-20', 'data-position':'bottom', 'data-delay':'20', 'data-tooltip':'Seeders' }, [
          Dom.el('i', { class:'material-icons left' }, 'file_upload'), ' ', String(seeders)
        ]),
        Dom.el('div', { class:'inline-item red100 tooltipped mr-20', 'data-position':'bottom', 'data-delay':'20', 'data-tooltip':'Leechers' }, [
          Dom.el('i', { class:'material-icons left' }, 'file_download'), ' ', String(leechers)
        ]),
        Dom.el('div', { class:'inline-item orange100 tooltipped mr-20', 'data-tooltip':'Times Completed' }, [
          Dom.el('i', { class:'material-icons left' }, 'done_all'), ' ', String(completions)
        ])
      ]);
    }

    function inject(stats){
      const titleBlock = document.querySelector('.movie-title-block');
      if (!titleBlock) return;

      let host = document.getElementById(ID);
      const inner = buildStatsEl(stats);

      if (!host) {
        host = Dom.el('div', { id: ID });
        host.appendChild(inner);
        const genreBlock = document.querySelector('.movie-title-block + h6');
        if (genreBlock) genreBlock.parentNode.insertBefore(host, genreBlock);
        else titleBlock.parentNode.insertBefore(host, titleBlock.nextSibling);
      } else {
        host.innerHTML = '';
        host.appendChild(inner);
      }
    }

    function getIndexURL(){
      const a = document.querySelector(
        '.movie-title-block a[href*="module=torrents"][href*="id="], ' +
        '.movie-title-block a[href*="movies.php?module=torrents"], ' +
        '.movie-title-block a[href*="tv.php?module=torrents"]'
      );
      if (!a) return null;
      try { return new URL(a.getAttribute('href'), location.href).toString(); }
      catch { return null; }
    }

    async function compute() {
      const titleBlock = document.querySelector('.movie-title-block');
      if (!titleBlock) return;

      if (Router.is('movies') || Router.is('tv')) {
        inject(sumTablesFromRoot(document));
        return;
      }

      if (Router.is('details')) {
        const url = getIndexURL();
        if (!url) return;
        if (CACHE.has(url)) { inject(CACHE.get(url)); return; }

        try {
          const res = await fetch(url, { credentials: 'same-origin' });
          if (!res.ok) throw new Error('fetch failed');
          const html = await res.text();
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const stats = sumTablesFromRoot(doc);
          CACHE.set(url, stats);
          inject(stats);
        } catch (_) { /* ignore */ }
      }
    }

    FeatureBus.register('movies_tv', 'Movies & TV', {
      key: 'movieStats',
      label: 'Movie/TV page mini-stats',
      info: 'Show total Seeders/Leechers/Completions on movie/TV and details pages',
      defaultState: true,
      when: () => Router.is('movies') || Router.is('tv') || Router.is('details'),
      observe: OBS,
      run: () => {
        safeRun(compute, { label: 'movieStats:init' });
        IO.onVisibleAll('.movie-torrents-table', () => safeRun(compute, { label: 'movieStats:movieVisible' }));
        IO.onVisibleAll('.tv-table', () => safeRun(compute, { label: 'movieStats:tvVisible' }));
        IO.onVisibleAll('.movie-title-block', () => safeRun(compute, { label: 'movieStats:titleVisible' }));
      }
    }, 5);

    return { compute, OBS };
  })();

  const ForumCopyTopicId = (() => {
    const ID  = 'forum-copy-icon';
    const OBS = ['#ftta-container'];

    function render() {
      const container = document.querySelector('#ftta-container');
      const trigger   = container ? container.querySelector('#ft-follow') : null;
      if (!container || !trigger) return;

      const id = trigger.getAttribute('data-topic-id');
      if (!id) return;
      if (container.querySelector('#' + ID)) return; // already added

      const copyIcon = document.createElement('i');
      copyIcon.id = ID;
      copyIcon.className = trigger.className;
      copyIcon.title = 'Copy Topic ID';
      copyIcon.textContent = 'content_copy';
      copyIcon.setAttribute('role', 'button');
      copyIcon.setAttribute('tabindex', '0');

      const copyAction = () => {
        Utils.copyTextSafe('TopicID=' + id)
          .then(() => Toast.show({ message: 'Copied Topic ID: ' + id, autoclose: 2000 }))
          .catch(() => Toast.show({ message: 'Failed to copy Topic ID.', autoclose: 2500 }));
      };

      copyIcon.addEventListener('click', copyAction);
      copyIcon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copyAction(); }
      });
      copyIcon.addEventListener('mousedown', (e) => e.preventDefault());

      container.insertBefore(copyIcon, trigger);
    }

    FeatureBus.register('forums', 'Forums', {
      key: 'forumCopyTopicId',
      label: 'Copy Topic ID button',
      info: 'Adds a quick-copy TopicID button next to Follow',
      defaultState: true,
      when: () => Router.is('forums'),
      observe: OBS,
      run: () => safeRun(render, { idle: true, label: 'forumCopyTopicId' })
    }, 6);

    return { render, OBS };
  })();

  const DetailsCopyTorrentId = (() => {
    const ID  = 'torrent-id-btn';
    const OBS = ['.col.s12.m5.l4.center'];

    function render() {
      const container = document.querySelector('.col.s12.m5.l4.center');
      const trigger   = container ? container.querySelector('input[name="id"]') : null;
      if (!container || !trigger) return;

      const id = trigger.value;
      if (!id) return;
      if (container.querySelector('#' + ID)) return; // already added

      const copyButton = Dom.el('a', {
        id: ID,
        class: 'btn waves-effect inline tgaction',
        href: '#',
        role: 'button',
        tabindex: '0'
      }, [
        Dom.el('i', { class: 'material-icons left' }, 'content_copy'),
        ' Torrent ID'
      ]);

      const copyAction = (e) => {
        if (e) e.preventDefault();
        Utils.copyTextSafe('TorrentID=' + id)
          .then(() => Toast.show({ message: 'Copied Torrent ID: ' + id, autoclose: 2000 }))
          .catch(() => Toast.show({ message: 'Failed to copy Torrent ID.', autoclose: 2500 }));
      };

      copyButton.addEventListener('click', copyAction);
      copyButton.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { copyAction(e); }
      });

      const wrapper = Dom.el('div', { class: 'torrtopbtn-wrapper' }, [copyButton]);
      container.appendChild(wrapper);
    }

    FeatureBus.register('details', 'Details', {
      key: 'detailsCopyTorrentId',
      label: 'Copy Torrent ID button',
      info: 'Adds a quick-copy TorrentID button on details page',
      defaultState: true,
      when: () => Router.is('details'),
      observe: OBS,
      run: () => safeRun(render, { idle: true, label: 'detailsCopyTorrentId' })
    }, 6);

    return { render, OBS };
  })();

  const ShoutboxTweaks = (() => {
    const OBS = ['#shoutbox-container', '#shout_text'];
    const FLAG = '_tweaxShoutBound';
    const MAX_CHAR_LIMIT = 200;

    function bind() {
      const container = document.querySelector('#shoutbox-container');
      const input = document.querySelector('#shout_text');
      if (!container || !input) return;
      if (container.dataset[FLAG] === '1') return;

      container.dataset[FLAG] = '1';

      // Enforce 200-char hard limit
      input.addEventListener('input', () => {
        if (input.value.length > MAX_CHAR_LIMIT) {
          input.value = input.value.slice(0, MAX_CHAR_LIMIT);
        }
      });

      // Auto-focus on hover for pointer devices (skip touch)
      if (window.matchMedia('(pointer:fine)').matches) {
        container.addEventListener('mouseover', () => {
          if (!window.getSelection().toString()) input.focus();
        });
      }
    }

    FeatureBus.register('shoutbox', 'Shoutbox', {
      key: 'shoutboxTweaksEnabled',
      label: 'Focus & input limit',
      info: 'Focus on hover + 200 char limit (no hover focus on touch devices)',
      defaultState: true,
      when: () => Router.is('home'),
      observe: OBS,
      run: () => safeRun(bind, { idle: true, label: 'shoutboxTweaks' })
    }, 7);

    return { bind, OBS };
  })();

  const InternalLinksSameTab = (() => {
    const KEY = 'internal-link-intercept';

    function intercept() {
      const HOST = location.host.replace(/^www\./, '');
      document.addEventListener('click', (e) => {
        const a = e.target.closest?.('a[href]');
        if (!a) return;

        // Respect user intent / existing handlers
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        try {
          const u = new URL(a.getAttribute('href'), location.origin);
          // Only same-host links, and skip downloads
          if (u.host.replace(/^www\./, '') === HOST && !a.hasAttribute('download')) {
            a.removeAttribute('target');
          }
        } catch { /* ignore malformed hrefs */ }
      }, true);
    }

    function run() {
      // Ensure single global listener
      Once.do(KEY, intercept);
    }

    FeatureBus.register('utils', 'Utilities', {
      key: 'utilInternalLinks',
      label: 'Internal links: same tab',
      info: 'Only internal links lose target=_blank (externals untouched)',
      defaultState: true,
      when: () => Router.is('common'),
      run: () => safeRun(run, { idle: true, label: 'utilInternalLinks' })
    }, 8);

    return { run };
  })();

  const QuickGoIds = (() => {
    const OBS = ['#shoutbox-container', '#middle-block', '#torrents-main', 'main', 'body'];

    // Build URLs per token type
    const TYPE_TO_URL = {
      TorrentID: id => `${location.origin}/torrents-details.php?id=${id}`,
      UserID:    id => `${location.origin}/account-details.php?id=${id}`,
      TopicID:   id => `${location.origin}/forums.php?action=viewtopic&topicid=${id}`,
      RequestID: id => `${location.origin}/requests.php?module=show&id=${id}`,
      PostID:    id => `${location.origin}/forums.php?action=viewpost&postid=${id}`,
    };

    // One regex for all kinds
    const RX = /(TorrentID|UserID|TopicID|RequestID|PostID)=(\d+)/g;

    // Tags we never process (NOTE: PRE is intentionally NOT here)
    const SKIP_TAGS = new Set(['SCRIPT','STYLE','TEXTAREA','NOSCRIPT']);

    function inSkipContext(textNode) {
      const p = textNode.parentElement;
      if (!p) return true;
      if (SKIP_TAGS.has(p.tagName)) return true;
      // Don’t touch inside links / editors / explicit opt-out
      if (p.closest('a, [contenteditable="true"], .no-linkify, [data-qg-skip]')) return true;
      return false;
    }

    function linkifyTextNode(node) {
      if (!node || node.nodeType !== Node.TEXT_NODE) return;
      if (inSkipContext(node)) return;

      const text = node.nodeValue || '';
      if (text.indexOf('ID=') === -1) return;

      RX.lastIndex = 0;
      let m, last = 0, changed = false;
      const frag = document.createDocumentFragment();

      while ((m = RX.exec(text))) {
        const [full, kind, id] = m;
        if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        const a = document.createElement('a');
        a.textContent = full;
        a.href = TYPE_TO_URL[kind](id);
        a.rel = 'noopener noreferrer';
        a.dataset.qg = '1';
        frag.appendChild(a);
        last = m.index + full.length;
        changed = true;
      }
      if (!changed) return;
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode && node.parentNode.replaceChild(frag, node);
    }

    function walk(root) {
      if (!root || root.nodeType !== Node.ELEMENT_NODE && root !== document) return;
      const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          const v = n.nodeValue;
          if (!v || v.indexOf('ID=') === -1) return NodeFilter.FILTER_REJECT;
          return inSkipContext(n) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      const batch = [];
      while (tw.nextNode()) batch.push(tw.currentNode);
      batch.forEach(linkifyTextNode);
    }

    let mo;
    function run() {
      // Initial pass on likely containers
      OBS.forEach(sel => document.querySelectorAll(sel).forEach(walk));
      walk(document); // safety net

      // Live updates (new messages / edits)
      if (!mo) {
        mo = new MutationObserver(muts => {
          for (const m of muts) {
            if (m.type === 'characterData') {
              linkifyTextNode(m.target);
            } else {
              m.addedNodes.forEach(n => {
                if (n.nodeType === Node.TEXT_NODE) linkifyTextNode(n);
                else if (n.nodeType === Node.ELEMENT_NODE) walk(n);
              });
            }
          }
        });
        mo.observe(document.body, { childList: true, subtree: true, characterData: true });
      }
    }

    FeatureBus.register('utils', 'Utilities', {
      key: 'utilQuickGo',
      label: 'QuickGo: make ID text clickable',
      info: 'Turns “TorrentID=…/UserID=…/TopicID=…/RequestID=…/PostID=…” into links (incl. <pre> & live updates)',
      defaultState: true,
      when: () => Router.is('common'),
      observe: OBS,
      run: () => safeRun(run, { idle: true, label: 'utilQuickGo' })
    }, 8);

    return { run, OBS };
  })();

  const FaqClipper = (() => {

    // --- helpers ---------------------------------------------------------------
    const curLang = () => {
      const v = new URLSearchParams(location.search).get('lang');
      return (v && v.toLowerCase() === 'bn') ? 'bn' : 'en'; // default EN
    };
    const otherLang = (l) => (l === 'bn' ? 'en' : 'bn');

    function buildLangUrl(href, lang) {
      try {
        const u = new URL(href, location.origin);
        u.searchParams.set('lang', lang);
        return u.toString();
      } catch { return href; }
    }

    async function fetchTitleFor(url) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, { signal: controller.signal, credentials: 'include' });
        clearTimeout(timer);
        if (!res.ok) return null;
        const html = await res.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const t = doc.querySelector('#middle-block h4.spidq');
        return t ? t.textContent.trim() : null;
      } catch { return null; }
    }

    function getBaseTitle(header) {
      // clone & strip our widgets to avoid capturing their text
      const clone = header.cloneNode(true);
      clone.querySelectorAll('.copy-button-icon').forEach(el => el.remove());
      let t = (clone.textContent || '').replace(/\s+/g,' ').trim();
      t = t.replace(/\s*\b(Updated|New)\b\s*$/i, '').trim();
      return t;
    }

    function makeBtn({label, alignRight, onClick, aria}) {
      const btn = document.createElement('div');
      btn.className = 'copy-button-icon' + (alignRight ? ' copy-button-icon-right' : '');
      btn.setAttribute('role','button');
      btn.setAttribute('tabindex','0');
      btn.setAttribute('aria-label', aria || 'Copy link');
      const i = document.createElement('i');
      i.className = 'material-icons';
      i.textContent = 'content_copy';
      btn.appendChild(i);
      if (label) btn.appendChild(document.createTextNode(' ' + label));
      btn.addEventListener('click', onClick);
      btn.addEventListener('keydown', (e)=>{ if (e.key==='Enter'||e.key===' ') { e.preventDefault(); onClick(e); }});
      return btn;
    }

    async function handleCopy(e, { baseTitle, href, lang, fetchAltTitle }) {
      e.stopPropagation();
      const link = buildLangUrl(href, lang);
      const title = fetchAltTitle
        ? (await fetchTitleFor(link)) || baseTitle
        : baseTitle;
      await Utils.copyTextSafe(`[url=${link}]${title}[/url]`);
      Toast.show({ message: `Copied (${lang.toUpperCase()}): ${title}`, autoclose: 2000 });
    }

    // --- main per-row wiring ---------------------------------------------------
    function addCopyButtons(header) {
      // clean old buttons we added
      header.querySelectorAll('.copy-button-icon').forEach(b => b.remove());

      const faqLink = header.parentElement?.querySelector('.collapsible-body .right a[href*="faq.php"]');
      if (!faqLink) return;

      const baseTitle = getBaseTitle(header);
      if (!baseTitle) return;

      const langNow   = curLang();
      const langOther = otherLang(langNow);

      // LEFT = current language (icon only)
      const leftBtn = makeBtn({
        label: '',
        alignRight: false,
        aria: `Copy ${langNow.toUpperCase()} link`,
        onClick: (e)=>handleCopy(e, { baseTitle, href: faqLink.href, lang: langNow, fetchAltTitle:false })
      });
      header.prepend(leftBtn);

      // RIGHT = other language (icon + label "EN"/"BN")
      const rightBtn = makeBtn({
        label: langOther.toUpperCase(),
        alignRight: true,
        aria: `Copy ${langOther.toUpperCase()} link`,
        onClick: (e)=>handleCopy(e, { baseTitle, href: faqLink.href, lang: langOther, fetchAltTitle:true })
      });
      header.appendChild(rightBtn);
    }

    function run() {
      document.querySelectorAll('.collapsible-header.faqq').forEach(addCopyButtons);
    }

    // --- FeatureBus hook -------------------------------------------------------
    FeatureBus.register('faq', 'FAQ', {
      key: 'faqClipperEnabled',
      label: 'FAQ Clipper (BBCode copy)',
      info: 'Left copies current language; right copies other language (EN/BN).',
      defaultState: true,
      when: () => Utils.isPage('/faq.php'),
      observe: ['.collapsible-header.faqq'],
      run: () => safeRun(run, { idle:true, label:'faqClipper' })
    }, 9);

    return { run };
  })();

  const TorrentExport = (() => {
    // Also watch Kuddus pagination so we can insert before it.
    const OBS = [
      'table.torrents-table',
      'table.simple-data-table',
      '.kuddus-torrents-table',
      '#kuddus-results-container',
      '#kuddus-results-container .pagination-block',
      '.kuddus-loading-container',
      '#kuddus-loading'
    ];

    function run() {
      const config = {
        allowedPaths: ['/', '/index.php', '/account-details.php', '/activities.php', '/seedbonus-breakdown.php', '/download-history.php'],
        tableSelectors: {
          main: ['table.torrents-table', 'table.simple-data-table', 'table.striped.boxed.notif-table'],
          kuddus: ['.kuddus-torrents-table']
        },
        button: { className: 'enhanced-button', iconClass: 'material-icons', spanClass: 'button-text' },
        ui: {
          mainClass: 'torrent-links-ui',
          kuddusClass: 'kuddus-torrent-links-ui',
          countCheckboxId: 'countCB',
          countCheckboxClass: 'filled-in',
          kuddusCountCheckboxId: 'kuddus-countCB',
          kuddusCountCheckboxClass: 'filled-in'
        },
        download: {
          maxConcurrency: 1,
          maxPerWindow: 1,
          windowMs: 1200,
          betweenRequestsMs: 200,
          retry: { attempts: 5, baseDelayMs: 700, maxDelayMs: 8000, jitter: true }
        }
      };

      const state = {
        isMainPathAllowed: false,
        abortControllers: [],
        cancelDownload: false,
        downloadedFiles: [],
        errors: [],
        isProcessing: false,
        refs: { mainBus: null, kuddusBus: null }
      };

      // ---------- DOM helper ----------
      const Dom = (window.Dom && typeof window.Dom.el === 'function')
        ? window.Dom
        : {
            el(tag, attrs = {}, children = null) {
              const el = document.createElement(tag);
              for (const [k, v] of Object.entries(attrs)) {
                if (k === 'class' || k === 'className') el.className = v;
                else if (k === 'style' && v && typeof v === 'object') {
                  for (const [sk, sv] of Object.entries(v)) {
                    if (sk.startsWith('--')) el.style.setProperty(sk, sv);
                    else el.style[sk] = sv;
                  }
                } else if (k === 'for') el.htmlFor = v;
                else if (v != null) el.setAttribute(k, v);
              }
              if (children != null) {
                if (Array.isArray(children)) children.forEach(c => append(el, c));
                else append(el, children);
              }
              return el;
              function append(p, c) {
                if (c == null) return;
                if (c.nodeType) p.appendChild(c);
                else p.appendChild(document.createTextNode(String(c)));
              }
            }
          };

      // ---------- THEME (restored to the “old” behavior) ----------
      function getThemeInfo() {
        // 1) Respect settings (Greasemonkey / Tampermonkey) if available
        try {
          if (typeof GM_getValue === 'function') {
            const v = GM_getValue('tweaxbdTheme', null);
            if (v === 'night' || v === 'day') return pickTheme(v);
          }
        } catch {}
        // 2) Inspect the tweaxbd popup container class if present
        const container = document.getElementById('tweaxbd-popup-container');
        if (container) {
          const mode = container.classList.contains('tweaxbd-night') ? 'night' : 'day';
          return pickTheme(mode);
        }
        // 3) Fallback: infer by body background luminance
        const bg = getComputedStyle(document.body).backgroundColor || 'rgb(255,255,255)';
        const m = bg.match(/\d+(\.\d+)?/g) || [255,255,255];
        const [r,g,b] = m.map(Number);
        const l = (0.2126*r + 0.7152*g + 0.0722*b)/255;
        return pickTheme(l < 0.5 ? 'night' : 'day');

        function pickTheme(mode) {
          if (mode === 'night') {
            return {
              name: 'night',
              vars: {
                '--te-bg': '#1f242b',
                '--te-fg': '#E8EEF2',
                '--te-ac': '#4b8b61',
                '--te-hover': '#7ed5a8',
                '--te-muted': '#9fb1b9'
              }
            };
          }
          return {
            name: 'day',
            vars: {
              '--te-bg': '#f2f2f2',
              '--te-fg': '#222',
              '--te-ac': '#1A7EA2',
              '--te-hover': '#156b86',
              '--te-muted': '#5d6a70'
            }
          };
        }
      }
      function applyThemeTo(el) {
        if (!el) return;
        const { name, vars } = getThemeInfo();
        el.classList.remove('te-theme-night','te-theme-day');
        el.classList.add('te-theme-' + name);
        Object.entries(vars).forEach(([k,v]) => el.style.setProperty(k, v));
      }
      function watchThemeChanges() {
        // When the popup toggles theme classes, reapply to our UIs
        const attach = () => {
          const target = document.getElementById('tweaxbd-popup-container');
          if (!target) return;
          const reapply = () => {
            applyThemeTo(state.refs.mainBus || document.querySelector('.' + config.ui.mainClass));
            applyThemeTo(state.refs.kuddusBus || document.querySelector('.' + config.ui.kuddusClass));
            // Also repaint toast root if present
            document.querySelectorAll('.te-toast-root').forEach(applyThemeTo);
          };
          const mo = new MutationObserver(muts => {
            if (muts.some(m => m.type === 'attributes' && m.attributeName === 'class')) reapply();
          });
          mo.observe(target, { attributes: true, attributeFilter: ['class'] });
        };
        const bodyMo = new MutationObserver(() => {
          if (document.getElementById('tweaxbd-popup-container')) { attach(); bodyMo.disconnect(); }
        });
        bodyMo.observe(document.body, { childList: true, subtree: true });
        attach();
      }

      // ---- Toast (uses same theme variables; falls back if site’s Toast missing) ----
      const LocalToast = (() => {
        const rootCls = 'te-toast-root';
        const visCls = 'te-toast-visible';
        const progCls = 'te-toast-progress';
        const barCls  = 'te-toast-bar';
        const cancelCls = 'te-toast-x';
        const textCls = 'te-toast-text';
        injectToastCSS();

        function injectToastCSS() {
          if (document.getElementById('te-toast-css')) return;
          const s = document.createElement('style');
          s.id = 'te-toast-css';
          s.textContent = `
            .${rootCls}{
              position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);
              max-width:460px;width:min(92vw,460px);
              background:var(--te-bg, rgba(50,50,50,.96));color:var(--te-fg,#fff);
              border-radius:10px;box-shadow:0 10px 28px rgba(0,0,0,.35);
              padding:14px 18px;opacity:0;transition:opacity .18s ease, transform .18s ease;
              z-index:999999;display:flex;flex-direction:column;row-gap:8px
            }
            .${rootCls}.${visCls}{opacity:1}
            .${cancelCls}{
              position:absolute;right:8px;top:6px;background:transparent;border:none;
              color:inherit;font-size:20px;cursor:pointer;opacity:.85
            }
            .${cancelCls}:hover{opacity:1}
            .${textCls}{line-height:1.35}
            .${progCls}{height:6px;background:rgba(255,255,255,.18);border-radius:4px;overflow:hidden}
            .${barCls}{height:100%;width:0%;background:var(--te-ac,#4b8b61);transition:width .2s ease}
            .${rootCls}.te-theme-day{--te-bg:#f2f2f2;--te-fg:#222;--te-ac:#1A7EA2}
            .${rootCls}.te-theme-night{--te-bg:#1f242b;--te-fg:#E8EEF2;--te-ac:#4b8b61}
          `;
          document.head.appendChild(s);
        }
        function show({ message, progress = false, cancelable = false, onCancel, autoclose }) {
          const theme = getThemeInfo();
          const root = Dom.el('div', { class: `${rootCls} te-theme-${theme.name}` });
          Object.entries(theme.vars).forEach(([k,v]) => root.style.setProperty(k, v));
          const text = Dom.el('div', { class: textCls }, message || '');
          root.appendChild(text);

          let bar;
          if (progress) {
            const track = Dom.el('div', { class: progCls });
            bar = Dom.el('div', { class: barCls });
            track.appendChild(bar);
            root.appendChild(track);
          }
          if (cancelable) {
            const btn = Dom.el('button', { class: cancelCls, title: 'Cancel', 'aria-label': 'Cancel' }, '×');
            btn.addEventListener('click', () => { try { onCancel && onCancel(); } finally { close(); } });
            root.appendChild(btn);
          }

          document.body.appendChild(root);
          root.style.zIndex = String(Array.from(document.querySelectorAll('body *')).reduce((m, n) => {
            const z = parseInt(getComputedStyle(n).zIndex, 10); return isNaN(z) ? m : Math.max(m, z);
          }, 999999) + 2);
          requestAnimationFrame(() => root.classList.add(visCls));

          let tmr = null;
          if (!cancelable && autoclose > 0) tmr = setTimeout(close, autoclose);

          function close() {
            if (tmr) clearTimeout(tmr);
            root.classList.remove(visCls);
            setTimeout(() => root.remove(), 180);
          }
          return {
            updateMessage(msg) { text.textContent = msg; },
            updateProgress(pct) { if (bar) bar.style.width = Math.max(0, Math.min(100, pct)) + '%'; },
            close
          };
        }
        return { show };
      })();
      const Toast = (window.Toast && typeof window.Toast.show === 'function') ? window.Toast : LocalToast;

      // Toolbar CSS with theme-aware vars (restores hover/accent parity)
      (function injectToolbarCSS() {
        if (document.getElementById('te-toolbar-css')) return;
        const s = document.createElement('style'); s.id = 'te-toolbar-css';
        s.textContent = `
          .${config.ui.mainClass}, .${config.ui.kuddusClass}{
            display:flex;justify-content:center;align-items:center;margin:10px 0;gap:10px;flex-wrap:wrap
          }
          .${config.button.className}{
            display:inline-flex;align-items:center;gap:6px;text-decoration:none;cursor:pointer;
            color:var(--te-fg, currentColor);opacity:.95;transition:opacity .15s ease,color .15s ease
          }
          .${config.button.className}.disabled{pointer-events:none;opacity:.5}
          .${config.button.iconClass}{font-size:20px;line-height:1}
          .${config.ui.mainClass}.te-theme-night, .${config.ui.kuddusClass}.te-theme-night { color: var(--te-fg,#CFD8DC) }
          .${config.ui.mainClass}.te-theme-day,  .${config.ui.kuddusClass}.te-theme-day  { color: var(--te-fg,#333) }
          .${config.ui.mainClass}.te-theme-night .${config.button.className}:hover .${config.button.iconClass},
          .${config.ui.mainClass}.te-theme-night .${config.button.className}:hover .${config.button.spanClass},
          .${config.ui.kuddusClass}.te-theme-night .${config.button.className}:hover .${config.button.iconClass},
          .${config.ui.kuddusClass}.te-theme-night .${config.button.className}:hover .${config.button.spanClass}{ color: var(--te-hover, var(--te-ac)) }
          .${config.ui.mainClass}.te-theme-day .${config.button.className}:hover .${config.button.iconClass},
          .${config.ui.mainClass}.te-theme-day .${config.button.className}:hover .${config.button.spanClass},
          .${config.ui.kuddusClass}.te-theme-day .${config.button.className}:hover .${config.button.iconClass},
          .${config.ui.kuddusClass}.te-theme-day .${config.button.className}:hover .${config.button.spanClass}{ color: var(--te-hover, var(--te-ac)) }
          .${config.ui.mainClass} input[type="checkbox"], .${config.ui.kuddusClass} input[type="checkbox"]{ transform:scale(1.1); margin-right:6px }
        `;
        document.head.appendChild(s);
      })();

      // ---------- helpers ----------
      function ensureMaterialIcons() {
        if (!document.querySelector('link[href*="fonts.googleapis.com/icon"]')) {
          const link = document.createElement('link');
          link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      }
      function pauseIfSupported(fn) {
        if (window.ObserverGate && typeof ObserverGate.pause === 'function') ObserverGate.pause(fn);
        else fn();
      }
      function isAllowedPath() {
        const p = location.pathname;
        return config.allowedPaths.some(x => p === x || p.endsWith(x));
      }
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
      const now = () => Date.now();
      function makeRateLimiter(maxPerWindow, windowMs, extraGapMs) {
        let stamps = [];
        return {
          async acquire() {
            for (;;) {
              const t = now();
              stamps = stamps.filter(s => t - s < windowMs);
              if (stamps.length < maxPerWindow) {
                stamps.push(t);
                if (extraGapMs) await sleep(extraGapMs);
                return;
              }
              const wait = windowMs - (t - stamps[0]) + 10;
              await sleep(wait);
            }
          }
        };
      }
      function shouldRetryStatus(s) { return s === 429 || s === 503 || (s >= 500 && s < 600); }
      function parseRetryAfter(header) {
        if (!header) return null;
        const seconds = parseInt(header, 10);
        if (!Number.isNaN(seconds)) return seconds * 1000;
        const d = new Date(header);
        if (!isNaN(d.getTime())) return Math.max(0, d.getTime() - Date.now());
        return null;
      }
      function jittered(ms) { return Math.round(ms * (0.5 + Math.random())); }

      function findMainAnchor() {
        if (window.Router && (Router.is('home') || Router.is('profile'))) {
          return (
            document.querySelector('.pagination') ||
            document.querySelector('#torrents-main .torrents-container') ||
            document.querySelector('table.torrents-table') ||
            document.querySelector(config.tableSelectors.main.join(','))
          );
        }
        if (window.Router && (Router.is('activities') || Router.is('breakdown'))) {
          return (
            document.querySelector('table.simple-data-table') ||
            document.querySelector('.pagination') ||
            document.querySelector('table.torrents-table') ||
            document.querySelector(config.tableSelectors.main.join(','))
          );
        }
        if (window.Router && Router.is('downloads')) {
          return (
            document.querySelector('.pagination') ||
            document.querySelector('table.torrents-table') ||
            document.querySelector(config.tableSelectors.main.join(','))
          );
        }
        return (
          document.querySelector('.pagination') ||
          document.querySelector('#torrents-main .torrents-container') ||
          document.querySelector('table.torrents-table') ||
          document.querySelector(config.tableSelectors.main.join(','))
        );
      }
      function findKuddusAnchor() {
        const topPag =
          document.querySelector('#kuddus-results-container .pagination-block.pb1') ||
          document.querySelector('#kuddus-results-container .pagination-block');
        if (topPag) return topPag;
        const table = document.querySelector('.kuddus-torrents-table');
        if (table) return table;
        const rc = document.getElementById('kuddus-results-container');
        return rc || null;
      }

      function isKuddusLoading() {
        const loader = document.querySelector('.kuddus-loading-container') || document.getElementById('kuddus-loading');
        if (!loader) return false;
        try {
          const el = loader.nodeType === 1 ? loader : loader.parentElement;
          if (!el) return false;
          const s = window.getComputedStyle(el);
          return s && s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0';
        } catch { return false; }
      }
      function countRows(selectors) {
        let n = 0;
        selectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(table => {
            table.querySelectorAll('tbody tr').forEach(row => {
              if (row.querySelector('a[href*="torrents-details.php?id="]')) n++;
            });
          });
        });
        return n;
      }
      function hasResults(isKuddus) {
        if (isKuddus) {
          const rows = countRows(config.tableSelectors.kuddus);
          const hasPag = !!document.querySelector('#kuddus-results-container .pagination-block');
          return rows > 0 || hasPag;
        }
        return countRows(config.tableSelectors.main) > 0;
      }
      function toggleButtonsState(disabled) {
        const buttons = document.querySelectorAll('.' + config.button.className);
        const cbs = document.querySelectorAll(
          '.' + config.ui.mainClass + ' input[type="checkbox"], .' + config.ui.kuddusClass + ' input[type="checkbox"]'
        );
        buttons.forEach(b => b.classList.toggle('disabled', !!disabled));
        cbs.forEach(cb => (cb.disabled = !!disabled));
      }
      function createStyledButton(iconName, tooltipTitle, onClick) {
        const a = Dom.el(
          'a',
          { href: '#', title: tooltipTitle, class: config.button.className, role: 'button', tabindex: '0', 'aria-label': tooltipTitle },
          [Dom.el('i', { class: config.button.iconClass }, iconName), Dom.el('span', { class: config.button.spanClass }, tooltipTitle.split(' ')[0])]
        );
        a.addEventListener('click', e => {
          e.preventDefault();
          if (!a.classList.contains('disabled')) onClick();
        });
        a.addEventListener('keydown', e => {
          if ((e.key === 'Enter' || e.key === ' ') && !a.classList.contains('disabled')) {
            e.preventDefault(); onClick();
          }
        });
        return a;
      }

      // ---------- UI ----------
      function buildUI(isKuddus) {
        const uiClass = isKuddus ? config.ui.kuddusClass : config.ui.mainClass;
        const div = Dom.el('div', { class: uiClass });

        const cbId = isKuddus ? config.ui.kuddusCountCheckboxId : config.ui.countCheckboxId;
        const cbClass = isKuddus ? config.ui.kuddusCountCheckboxClass : config.ui.countCheckboxClass;

        const cb = Dom.el('input', { type: 'checkbox', id: cbId, class: cbClass, role: 'switch', 'aria-checked': 'false' });
        cb.addEventListener('change', () => cb.setAttribute('aria-checked', cb.checked ? 'true' : 'false'));
        const lbl = Dom.el('label', { for: cbId }, 'Count');
        div.appendChild(cb);
        div.appendChild(lbl);

        const copyBtn = createStyledButton('content_copy', 'Copy Links', () => handleClipboard('copy', isKuddus));
        const saveBtn = createStyledButton('save', 'Save Links', () => handleClipboard('save', isKuddus));
        const dlBtn   = createStyledButton('download', 'Download Torrents', () => downloadTorrentsAsZip(isKuddus));
        div.appendChild(copyBtn);
        div.appendChild(saveBtn);
        div.appendChild(dlBtn);

        applyThemeTo(div);
        return div;
      }
      function ensureInserted(isKuddus = false) {
        const uiClass = isKuddus ? config.ui.kuddusClass : config.ui.mainClass;
        let bus = document.querySelector('.' + uiClass);

        if (!bus) {
          bus = buildUI(isKuddus);
          if (isKuddus) state.refs.kuddusBus = bus;
          else state.refs.mainBus = bus;
        } else {
          applyThemeTo(bus);
        }

        const anchor = isKuddus ? findKuddusAnchor() : findMainAnchor();
        if (!anchor || !anchor.parentNode) return null;

        if (bus.nextSibling !== anchor || bus.parentNode !== anchor.parentNode) {
          pauseIfSupported(() => { anchor.parentNode.insertBefore(bus, anchor); });
        }
        return bus;
      }
      function syncVisibility() {
        if (state.refs.mainBus || document.querySelector('.' + config.ui.mainClass)) {
          const bus = state.refs.mainBus || document.querySelector('.' + config.ui.mainClass);
          if (bus) bus.style.display = hasResults(false) ? '' : 'none';
        }
        if (state.refs.kuddusBus || document.querySelector('.' + config.ui.kuddusClass)) {
          const bus = state.refs.kuddusBus || document.querySelector('.' + config.ui.kuddusClass);
          if (bus) bus.style.display = (!isKuddusLoading() && hasResults(true)) ? '' : 'none';
        }
      }
      function handleKuddusSection() {
        if (document.getElementById('kuddus-results-container') || document.querySelector('.kuddus-torrents-table')) {
          const bus = ensureInserted(true);
          if (bus) syncVisibility();
        }
      }

      // ---------- Clipboard & save ----------
      function handleClipboard(action, isKuddus = false) {
        const output = isKuddus ? getKuddusTorrentLinks() : getMainTorrentLinks();
        if (!output) {
          Toast.show({ message: 'No links found!', autoclose: 2000 });
          return;
        }
        toggleButtonsState(true);
        state.isProcessing = true;

        if (action === 'copy') {
          (window.Utils && Utils.copyTextSafe ? Utils.copyTextSafe(output) : navigator.clipboard.writeText(output))
            .then(() => { Toast.show({ message: 'Copied to Clipboard', autoclose: 2000 }); })
            .catch(() => {
              try {
                const ta = document.createElement('textarea');
                ta.value = output; document.body.appendChild(ta);
                ta.select(); document.execCommand('copy'); ta.remove();
                Toast.show({ message: 'Copied to Clipboard', autoclose: 2000 });
              } catch {
                Toast.show({ message: 'Failed to Copy!', autoclose: 2500 });
              }
            })
            .finally(() => { toggleButtonsState(false); state.isProcessing = false; });
        } else {
          const filename = 'TorrentLinks.txt';
          downloadFile(output, filename);
          Toast.show({ message: 'Saved as ' + filename, autoclose: 2000 });
          toggleButtonsState(false);
          state.isProcessing = false;
        }
      }
      function downloadFile(data, fileName, mime = 'text/plain') {
        const blob = typeof data === 'string' ? new Blob([data], { type: mime }) : data;
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(a.href);
      }

      // ---------- DOM download link helpers ----------
      function findDownloadHrefInRow(row) {
        const a =
          row.querySelector('a[href*="/download.php?id="]') ||
          row.querySelector('a[href*="action=download"][href*="id="]') ||
          row.querySelector('a[href*="/download"]');

        if (!a) return null;
        try { return new URL(a.getAttribute('href'), location.origin).href; }
        catch { return null; }
      }
      function collectDownloadTargets(isKuddus, withCount) {
        const selectors = isKuddus ? config.tableSelectors.kuddus : config.tableSelectors.main;
        const targets = [];
        let idx = 0;

        selectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(table => {
            table.querySelectorAll('tbody tr').forEach(row => {
              let url = findDownloadHrefInRow(row);
              if (!url) {
                const a = row.querySelector('a[href*="torrents-details.php?id="]');
                if (a) {
                  try {
                    const u = new URL(a.getAttribute('href'), location.origin);
                    const id = u.searchParams.get('id');
                    if (id) url = `${location.origin}/download.php?id=${id}`;
                  } catch {}
                }
              }
              if (url) targets.push({ url, ordinal: withCount ? (++idx) : null });
            });
          });
        });

        return targets;
      }

      // ---------- Downloader (rate-limited + retries) ----------
      async function downloadTorrentsAsZip(isKuddus = false) {
        const countEl = document.getElementById(isKuddus ? config.ui.kuddusCountCheckboxId : config.ui.countCheckboxId);
        const withCount = !!(countEl && countEl.checked);
        const targets = collectDownloadTargets(isKuddus, withCount);

        if (!targets.length) {
          Toast.show({ message: 'No links found!', autoclose: 2000 });
          return;
        }

        state.downloadedFiles = [];
        state.errors = [];
        state.abortControllers = [];
        state.cancelDownload = false;
        toggleButtonsState(true);

        const toast = Toast.show({
          message: 'Starting download of ' + targets.length + ' torrent(s)...',
          progress: true,
          cancelable: true,
          onCancel: function () {
            state.cancelDownload = true;
            state.abortControllers.forEach(c => { try { c.abort(); } catch {} });
            toast.updateMessage('Download Cancelled');
            setTimeout(() => toast.close(), 3000);
            toggleButtonsState(false);
            state.isProcessing = false;
          }
        });

        const limiter = makeRateLimiter(config.download.maxPerWindow, config.download.windowMs, config.download.betweenRequestsMs);
        const maxWorkers = clamp(config.download.maxConcurrency, 1, 5);
        let completed = 0;
        let nextIndex = 0;

        function sniffLooksLikeTorrent(blob) {
          try { return blob && blob.size > 0; } catch { return true; }
        }
        async function fetchWithRetry(url, options) {
          const { attempts, baseDelayMs, maxDelayMs, jitter } = config.download.retry;
          let attempt = 0, lastErr, lastStatus = 0;

          while (attempt < attempts && !state.cancelDownload) {
            attempt++;
            const controller = new AbortController();
            const merged = {
              credentials: 'include',
              redirect: 'follow',
              cache: 'no-store',
              referrerPolicy: 'strict-origin-when-cross-origin',
              signal: controller.signal,
              ...options
            };
            state.abortControllers.push(controller);

            try {
              await limiter.acquire();
              const res = await fetch(url, merged);
              lastStatus = res.status;

              if (!res.ok) {
                if (shouldRetryStatus(res.status)) {
                  const retryAfter = parseRetryAfter(res.headers.get('Retry-After'));
                  const delay = retryAfter != null ? retryAfter : Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt - 1));
                  await sleep(jitter ? jittered(delay) : delay);
                  continue;
                }
                throw new Error('HTTP ' + res.status + ' ' + res.statusText);
              }
              return res;
            } catch (e) {
              if (e.name === 'AbortError') throw e;
              lastErr = e;
              const delay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt - 1));
              await sleep(jitter ? jittered(delay) : delay);
            }
          }
          throw lastErr || new Error('Failed after retries (last status ' + lastStatus + ')');
        }
        async function downloadOne(target, index) {
          const url = target.url;
          try {
            const res = await fetchWithRetry(url);
            const disp = res.headers.get('Content-Disposition') || '';
            const ct = (res.headers.get('Content-Type') || '').toLowerCase();
            const blob = await res.blob();

            let filename = `[TorrentBD]${index + 1}.torrent`;
            const mStar = disp.match(/filename\*\s*=\s*UTF-8''([^;]+)/i);
            const mPlain = disp.match(/filename\s*=\s*("?)([^";]+)\1/i);
            if (mStar) filename = decodeURIComponent(mStar[1]);
            else if (mPlain) filename = mPlain[2];

            filename = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
            if (!/\.torrent$/i.test(filename)) filename += '.torrent';
            if (target.ordinal != null) filename = `${target.ordinal}. ${filename}`;

            if (!/bittorrent|octet\-stream|x-download|force\-download/.test(ct)) {
              if (!sniffLooksLikeTorrent(blob)) {
                state.errors.push('Suspicious content for ' + url + ' (Content-Type: ' + ct + ') — saved anyway.');
              }
            }
            state.downloadedFiles.push({ blob, filename });
          } catch (e) {
            if (e.name !== 'AbortError') state.errors.push('Error downloading ' + url + ': ' + e.message);
          } finally {
            completed++;
            const pct = Math.round((completed / targets.length) * 100);
            toast.updateMessage('Downloading... (' + pct + '%)');
            toast.updateProgress(pct);
          }
        }
        async function worker() {
          while (!state.cancelDownload) {
            const i = nextIndex++;
            if (i >= targets.length) break;
            await downloadOne(targets[i], i);
          }
        }

        await Promise.all(Array.from({ length: maxWorkers }, () => worker()));

        if (state.downloadedFiles.length > 0 && !state.cancelDownload) {
          try {
            const JSZipCtor = await ensureJSZipCtor();
            const zip = new JSZipCtor();
            state.downloadedFiles.forEach(f => zip.file(f.filename, f.blob));
            const content = await zip.generateAsync({ type: 'blob' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(content);
            a.download = `TorrentMetaFiles_${location.pathname.replace(/\W+/g, '_')}_${Date.now()}.zip`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(a.href);
            Toast.show({ message: 'Downloaded ' + state.downloadedFiles.length + ' torrent(s)', autoclose: 2500 });
          } catch (zipErr) {
            try {
              const tarBlob = await buildTarFromFiles(state.downloadedFiles);
              const a = document.createElement('a');
              a.href = URL.createObjectURL(tarBlob);
              a.download = `TorrentMetaFiles_${location.pathname.replace(/\W+/g, '_')}_${Date.now()}.tar`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(a.href);
              Toast.show({ message: 'ZIP blocked/failed — saved TAR instead', autoclose: 3000 });
            } catch (tarErr) {
              Toast.show({ message: 'Bundling failed: ' + (tarErr && tarErr.message ? tarErr.message : tarErr), autoclose: 3500 });
            }
          }
        } else if (!state.cancelDownload) {
          toast.updateMessage('No torrents Downloaded!');
        }

        if (state.errors.length > 0) {
          const msg = state.errors.length === 1 ? state.errors[0] : state.errors.length + ' issues:\n' + state.errors.join('\n');
          Toast.show({ message: msg, autoclose: 3500 });
        }
        toggleButtonsState(false);
        state.isProcessing = false;
      }

      // ---------- JSZip loader + TAR fallback ----------
      async function ensureJSZipCtor() {
        if (window.getLazyLibraries && typeof getLazyLibraries.jszip === 'function') {
          try {
            const lib = await getLazyLibraries.jszip();
            const ctor = lib && (lib.JSZip || lib.default || lib);
            if (typeof ctor === 'function') return ctor;
          } catch {}
        }
        if (window.JSZip) {
          const ctor = window.JSZip.JSZip || window.JSZip.default || window.JSZip;
          if (typeof ctor === 'function') return ctor;
        }
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
          s.onload = resolve;
          s.onerror = () => reject(new Error('Failed to load JSZip (CSP?)'));
          document.head.appendChild(s);
        });
        const ctor = (window.JSZip && (window.JSZip.JSZip || window.JSZip.default || window.JSZip)) || null;
        if (typeof ctor !== 'function') throw new Error('JSZip not available/constructor missing');
        return ctor;
      }
      async function buildTarFromFiles(files) {
        const entries = await Promise.all(
          files.map(async f => {
            const buf = await f.blob.arrayBuffer();
            return { name: sanitizeTarName(f.filename), data: new Uint8Array(buf) };
          })
        );
        const parts = [];
        for (const e of entries) {
          parts.push(buildTarHeader(e.name, e.data.length));
          parts.push(e.data);
          const pad = (512 - (e.data.length % 512)) % 512;
          if (pad) parts.push(new Uint8Array(pad));
        }
        parts.push(new Uint8Array(512));
        parts.push(new Uint8Array(512));
        return new Blob(parts, { type: 'application/x-tar' });
      }
      function sanitizeTarName(name) { if (name.length > 255) name = name.slice(-255); return name.replace(/\0/g, '_'); }
      function buildTarHeader(name, size) {
        const header = new Uint8Array(512);
        const te = new TextEncoder();
        const write = (o, str, len) => { const b = te.encode(str); header.set(b.slice(0, len), o); };
        const writeOctal = (o, v, len) => { const str = v.toString(8).padStart(len - 1, '0') + '\0'; write(o, str, len); };
        write(0, name, 100); writeOctal(100, 0o777, 8); writeOctal(108, 0, 8); writeOctal(116, 0, 8);
        writeOctal(124, size, 12); writeOctal(136, Math.floor(Date.now()/1000), 12);
        for (let i=148;i<156;i++) header[i]=0x20;
        write(156, '0', 1);
        write(257, 'ustar', 5); header[262]=0; write(263, '00', 2);
        write(265, 'user', 32); write(297, 'user', 32);
        let sum = 0; for (let i=0;i<512;i++) sum += header[i];
        const chk = sum.toString(8).padStart(6,'0'); write(148, chk, 6); header[154]=0; header[155]=0x20;
        return header;
      }

      // ---------- link extraction for copy/save ----------
      function getMainTorrentLinks() {
        const countEnabled = (document.getElementById(config.ui.countCheckboxId) || {}).checked || false;
        return extractTorrentLinks(config.tableSelectors.main, countEnabled);
      }
      function getKuddusTorrentLinks() {
        const el = document.querySelector('.' + config.ui.kuddusClass + ' #' + config.ui.kuddusCountCheckboxId);
        const countEnabled = el ? !!el.checked : false;
        return extractTorrentLinks(config.tableSelectors.kuddus, countEnabled);
      }
      function extractTorrentLinks(selectors, countEnabled) {
        const links = [];
        const base = location.origin;
        let c = countEnabled ? 1 : 0;
        selectors.forEach(sel => {
          document.querySelectorAll(sel).forEach(table => {
            table.querySelectorAll('tbody tr').forEach(row => {
              const a = row.querySelector('a[href*="torrents-details.php?id="]');
              if (!a) return;
              const href = a.getAttribute('href');
              let id = null;
              try { id = new URL(href, base).searchParams.get('id'); } catch {}
              if (!id && window.Utils && typeof Utils.extractTorrentID === 'function') id = Utils.extractTorrentID(href);
              if (!id) return;
              const full = base + '/torrents-details.php?id=' + id;
              links.push(countEnabled ? (c++) + '. ' + full : full);
            });
          });
        });
        return links.join('\n');
      }

      // ---------- init ----------
      function initialize() {
        state.isMainPathAllowed = isAllowedPath();
        ensureMaterialIcons();

        if (state.isMainPathAllowed && findMainAnchor()) state.refs.mainBus = ensureInserted(false);
        handleKuddusSection();
        syncVisibility();

        const mo = new MutationObserver(() => {
          if (state.isMainPathAllowed && findMainAnchor()) state.refs.mainBus = ensureInserted(false);
          handleKuddusSection();
          syncVisibility();
        });
        mo.observe(document.body, { childList: true, subtree: true });

        // initial theme & live updates
        applyThemeTo(state.refs.mainBus || document.querySelector('.' + config.ui.mainClass));
        applyThemeTo(state.refs.kuddusBus || document.querySelector('.' + config.ui.kuddusClass));
        watchThemeChanges();
      }

      initialize();
    }

    // Register with FeatureBus
    FeatureBus.register(
      'export',
      'Export/Download',
      {
        key: 'torrentExportEnabled',
        label: 'Torrent Exporter',
        info: 'Copy/save torrent links & download .torrent files as ZIP',
        defaultState: true,
        when: () => Router.is('common'),
        observe: OBS,
        run: () => safeRun(run, { idle: true, label: 'torrentExport' })
      },
      10
    );

    return { run, OBS };
  })();

  const SmartTableSorting = (() => {
    const W = window;
    const SEL_SIMPLE = '.simple-data-table';
    const SEL_MOVIE  = 'table.torrents-table.movie-torrents-table';

    const TableMeta   = new WeakMap();   // table -> { headers, headerRow }
    const TableCache  = new WeakMap();   // table -> Map<tr, Map<colIdx, val>>
    const Initialized = new WeakSet();

    // ---------- helpers ----------
    const getCache = (table) => {
      let m = TableCache.get(table);
      if (!m) { m = new Map(); TableCache.set(table, m); }
      return m;
    };

    const toBytes = (txt) => {
      if (!txt) return 0;
      const t = String(txt).replace(/,/g,'').trim();
      const m = t.match(/([-+]?\d*\.?\d+)\s*(pi?b|ti?b|gi?b|mi?b|ki?b|b)?/i);
      if (!m) {
        if (typeof W.Utils?.convertToGiB === 'function') return W.Utils.convertToGiB(t) * (1024 ** 3);
        const n = parseFloat(t);
        return Number.isFinite(n) ? n : 0;
      }
      const n = parseFloat(m[1]);
      const u = (m[2] || '').toLowerCase();
      const pow = u.startsWith('pi') ? 5 : u.startsWith('t') ? 4 : u.startsWith('g') ? 3 : u.startsWith('m') ? 2 : u.startsWith('k') ? 1 : 0;
      return (Number.isFinite(n) ? n : 0) * (1024 ** pow);
    };

    const parseSeedHours = (txt) => {
      if (!txt) return 0;
      if (typeof W.Utils?.convertSeedtimeToHours === 'function') return W.Utils.convertSeedtimeToHours(txt);
      let hours = 0;
      String(txt).replace(/(\d+)\s*(y|mo|d|h)/g, (_,v,u)=>{
        const n = parseInt(v,10);
        if (u === 'y') hours += n * 8760;
        else if (u === 'mo') hours += n * 720;
        else if (u === 'd') hours += n * 24;
        else hours += n;
        return '';
      });
      return hours;
    };

    const extractText = (td) => {
      if (!td) return '';
      const title = td.querySelector('img[title]')?.getAttribute('title');
      if (title) return title.toLowerCase().trim();
      const a = td.querySelector('a');
      if (a?.textContent?.trim()) return a.textContent.toLowerCase().trim();
      return (td.innerText || '').toLowerCase().trim();
    };

    const headerMeta = (table) => {
      let meta = TableMeta.get(table);
      if (meta) return meta;

      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody') || table;
      let headerRow = thead?.querySelector('tr');
      if (!headerRow) headerRow = Array.from(tbody.querySelectorAll('tr')).find(r => r.querySelector('th')) || null;

      const headers = headerRow ? Array.from(headerRow.querySelectorAll('th')).map(th => (th.innerText||'').trim()) : [];
      meta = { headers, headerRow };
      TableMeta.set(table, meta);
      return meta;
    };

    const detectColType = (label) => {
      const h = (label || '').toLowerCase();
      if (/^dl$/.test(h)) return 'skip';                 // never sort DL (movies)
      if (/(^|\s)size(\s|$)/.test(h)) return 'size';
      if (h.includes('downloaded') || h.includes('uploaded')) return 'size';
      if (h === 'seedtime' || /^seed\s*time$/.test(h)) return 'time';
      if (/^(s|l|c)$/.test(h)) return 'number';
      if (/hourly\s*seedbonus/.test(h)) return 'number';
      if (h.includes('ratio')) return 'number';          // <-- important for activities/breakdown
      return 'text';
    };

    const isSummaryRow = (tr) => {
      const t0 = (tr?.cells?.[0]?.textContent || '').trim().toLowerCase();
      // keep any kind of "Total"/"Totals (visible)" row at the bottom
      if (/^totals?\b/.test(t0)) return true;
      if (tr?.getAttribute('data-total-row') === '1') return true;
      return false;
    };

    const getCellValue = (table, tr, td, idx, type) => {
      const cache = getCache(table);
      const rowMap = cache.get(tr) || new Map();
      if (rowMap.has(idx)) return rowMap.get(idx);

      const raw = (td?.innerText || '').trim();
      let v;
      if (type === 'size') v = toBytes(raw);
      else if (type === 'time') v = parseSeedHours(raw);
      else if (type === 'number') v = parseFloat(raw.replace(/,/g,'')) || 0;
      else v = extractText(td);

      rowMap.set(idx, v);
      cache.set(tr, rowMap);
      return v;
    };

    const invalidateRow = (table, tr) => getCache(table).delete(tr);

    // ---------- core ----------
    function wireTable(table) {
      if (!table || Initialized.has(table)) return;

      const tbody = table.querySelector('tbody') || table;
      const { headers, headerRow } = headerMeta(table);
      if (!tbody || !headerRow || !headers.length) return;

      const colTypes = headers.map(detectColType);

      // Invalidate cache on dynamic adds
      new MutationObserver((ml)=>{
        for (const m of ml) {
          m.addedNodes && m.addedNodes.forEach(n => {
            if (n.nodeType === 1 && n.tagName === 'TR') invalidateRow(table, n);
          });
        }
      }).observe(tbody, { childList:true });

      Array.from(headerRow.querySelectorAll('th')).forEach((th, idx) => {
        const type = colTypes[idx];

        // DL column (movies) — disable sort
        if (type === 'skip') {
          th.classList.remove('tab-sortable');
          th.style.cursor = '';
          return;
        }

        th.classList.add('tab-sortable');
        th.style.cursor = 'pointer';

        th.addEventListener('click', function () {
          const asc = !this.classList.contains('asc');

          // auto-expand "show more" if present (movies)
          if (table.matches(SEL_MOVIE)) document.querySelector('.mt_more-trigger')?.click();

          // reset indicators
          headerRow.querySelectorAll('th.tab-sortable').forEach(t => {
            t.classList.remove('asc','desc');
            t.removeAttribute('aria-sort');
            t.querySelector('.torr-sort-icon')?.remove();
          });

          // set indicator on current
          this.classList.add(asc ? 'asc' : 'desc');
          this.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
          const iconWrap = document.createElement('span');
          iconWrap.className = 'torr-sort-icon';
          const icon = document.createElement('i');
          icon.className = 'material-icons tiny';
          icon.textContent = asc ? 'arrow_drop_up' : 'arrow_drop_down';
          iconWrap.appendChild(icon);
          this.appendChild(iconWrap);

          // gather rows
          const allRows = Array.from(tbody.querySelectorAll('tr'))
            .filter(r => r.querySelectorAll('td').length && !r.classList.contains('mt_more') && !r.querySelector('.mt_more-trigger'));

          const dataRows    = allRows.filter(r => !isSummaryRow(r));
          const summaryRows = allRows.filter(r =>  isSummaryRow(r));

          // sort
          dataRows.sort((a, b) => {
            const av = getCellValue(table, a, a.children[idx], idx, type);
            const bv = getCellValue(table, b, b.children[idx], idx, type);
            if (type === 'text') return asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
            const an = Number(av) || 0, bn = Number(bv) || 0;
            return asc ? (an - bn) : (bn - an);
          });

          // reflow: data first, then any totals/summary rows at the bottom
          const frag = document.createDocumentFragment();
          dataRows.forEach(tr => frag.appendChild(tr));
          summaryRows.forEach(tr => frag.appendChild(tr));
          tbody.appendChild(frag);
        }, { passive: true });
      });

      Initialized.add(table);
    }

    function makeSortableOnPage() {
      document.querySelectorAll(`${SEL_SIMPLE}, ${SEL_MOVIE}`).forEach(wireTable);
    }

    // ---------- FeatureBus registrations (inside) ----------
    try {
      FeatureBus.register('activities', 'Activities', {
        key: 'activitiesSortable',
        label: 'Enable sorting (activities)',
        info: 'Sorter for activities table (keeps Totals at bottom)',
        defaultState: true,
        when: () => Router.is('activities'),
        observe: [SEL_SIMPLE],
        run: () => IO.onVisibleAll(SEL_SIMPLE, () =>
          safeRun(makeSortableOnPage, { idle:true, label:'activitiesSortable' })
        )
      }, 4);

      FeatureBus.register('seedbonus', 'Seedbonus', {
        key: 'breakdownSortable',
        label: 'Enable sorting (breakdown)',
        info: 'Sorter for breakdown table (keeps Totals at bottom)',
        defaultState: true,
        when: () => Router.is('breakdown'),
        observe: [SEL_SIMPLE],
        run: () => IO.onVisibleAll(SEL_SIMPLE, () =>
          safeRun(makeSortableOnPage, { idle:true, label:'breakdownSortable' })
        )
      }, 3);

      FeatureBus.register('movies_tv', 'Movies & TV', {
        key: 'movieSortable',
        label: 'All movie columns sortable except DL',
        info: 'Smart sorter for movie list',
        defaultState: true,
        when: () => Router.is('movies'),
        observe: [SEL_MOVIE],
        run: () => IO.onVisibleAll(SEL_MOVIE, () =>
          safeRun(makeSortableOnPage, { idle:true, label:'movieSortable' })
        )
      }, 5);
    } catch(e) { /* FeatureBus/Router not ready yet — API still returned */ }

    // expose for debugging if needed
    return { makeSortableOnPage, wireTable };
  })();



  // -------------------------
  // (N) Config UI (a11y: dialog role, focus trap, switches)
  // -------------------------
  let currentTheme = GM_getValue('tweaxbdTheme', 'night');
  let tooltipsVisible = GM_getValue('tweaxbdTooltipsVisible', false);

  function showConfigPopup() {
    if (document.getElementById('tweaxbd-popup-container')) return;

    (function ensureConfigCSS(){
      // viewport sizing (old behavior)
      const vw = Math.max(document.documentElement.clientWidth,  window.innerWidth  || 0);
      const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      const W  = Math.round(vw * 0.56);
      const H  = Math.round(vh * 0.72);

      // palettes
      const colorSelector = 'B';
      const colors = {
        A: `#FFFF00,#FFFF00,#00FF00,#0099FF,#001AFF,#A200FF,#FF0055,#FF0000,#FF5900,#FF5900`,
        B: `#E84817,#B31451,#1A7EA2,#1A9E7F`,
        C: `#FF0000,#FFFF00,#00FF00,#0099FF,#001AFF,#A200FF,#A200FF,#FF0055,#FF0000,#FF0055`,
        D: `#FFFF00,#00FF00,#0099FF,#001AFF,#A200FF,#FF0055,#FF0000,#FF0055`
      };
      const ringStops = colors[colorSelector] || colors.B;

      // replace previous style
      document.getElementById('tweaxbd-config-style')?.remove();

      const css = `
        .tweaxbd-night{ --bg:#171B23; --fg:#FFF; --muted:#B0BEC5; --panel:#2A2C32; --panel-2:#171B23; --border:#CFD8DC; --group-border:rgba(255,255,255,.25); }
        .tweaxbd-day  { --bg:#FFFFFF; --fg:#000; --muted:#333;    --panel:#F2F2F2; --panel-2:#F0F0F0; --border:rgba(0,0,0,.25); --group-border:rgba(0,0,0,.20); }

        #tweaxbd-popup-container.tweaxbd-depth-2{
          position:fixed; top:50%; left:50%; transform:translate(-50%,-50%);
          z-index:9999; display:flex; flex-direction:column; cursor:default;
          width:${W}px; height:${H}px;
          max-width:min(96vw, ${W}px); max-height:min(90vh, ${H}px);
          border-radius:4px; border:none; background:var(--bg); color:var(--fg);
          font-family:Poppins,sans-serif; overflow:visible;
        }

        /* moving edge like the old one */
        @keyframes twxBorderShift{
          0%,100% { background-position: 0% 50%; }
          50%     { background-position:100% 50%; }
        }
        #tweaxbd-popup-container.tweaxbd-depth-2::before,
        #tweaxbd-popup-container.tweaxbd-depth-2::after{
          content:"";
          position:absolute; top:-3px; left:-3px; width:calc(100% + 6px); height:calc(100% + 6px);
          border-radius:5px; z-index:-1; pointer-events:none;
          background:linear-gradient(200deg, ${ringStops});
          background-size:300% 300%;
          animation: twxBorderShift 12s linear infinite;
        }
        #tweaxbd-popup-container.tweaxbd-depth-2::after{ filter:blur(12px); }

        #tweaxbd-container-header{ border-radius:4px 4px 0 0; align-items:center; padding:4px; display:flex; justify-content:space-between; background:var(--panel-2); }
        #tweaxbd-heading{ margin-left:4px; font-size:1.5em; font-weight:500; color:var(--fg); }
        #tweaxbd-body-content{ flex:1 1 auto; min-height:0; display:flex; flex-direction:column; overflow:hidden; }
        #tweaxbd-items-container{ flex:1 1 auto; min-height:0; overflow-y:auto; padding:1rem; background:var(--panel); }
        #tweaxbd-save-container{ flex:0 0 auto; display:flex; justify-content:center; padding:12px; border-radius:0 0 4px 4px; background:var(--panel-2); }

        #tweaxbd-theme-btn,#tweaxbd-close-btn,#tweaxbd-tooltip-btn,#tweaxbd-toggleall-btn,#tweaxbd-export-btn,#tweaxbd-import-btn{
          background:transparent; border-radius:100px; width:28px; height:28px; display:flex; justify-content:center; align-items:center;
          padding:0; margin-left:8px; transition:200ms; cursor:pointer; font-size:16px; line-height:1; border:1px solid var(--border); color:var(--fg);
        }
        #tweaxbd-theme-btn:hover,#tweaxbd-close-btn:hover,#tweaxbd-tooltip-btn:hover,#tweaxbd-toggleall-btn:hover,#tweaxbd-export-btn:hover,#tweaxbd-import-btn:hover{
          background:#2C3E50;
        }

        /* ——— SAVE BUTTON: full-width, blue, immune to site CSS ——— */
        #tweaxbd-popup-container.tweaxbd-depth-2 #tweaxbd-save-container .tweaxbd-save-button{
          all:unset;
          display:flex; align-items:center; justify-content:center; gap:8px;
          width:100% !important;                 /* force full width */
          box-sizing:border-box;
          padding:12px 20px;
          border-radius:8px;
          font-size:16px; font-weight:600;
          background:#007bff !important;         /* keep your theme */
          color:#fff !important;
          cursor:pointer; user-select:none;
        }
        #tweaxbd-popup-container.tweaxbd-depth-2 #tweaxbd-save-container .tweaxbd-save-button:hover{ filter:brightness(.95); }
        #tweaxbd-popup-container.tweaxbd-depth-2 #tweaxbd-save-container .tweaxbd-save-button:active{ transform:translateY(1px); }
        #tweaxbd-popup-container.tweaxbd-depth-2 #tweaxbd-save-container .tweaxbd-save-button > *{ pointer-events:none; }

        /* Toggle switch (restored & scoped) */
        #tweaxbd-popup-container.tweaxbd-depth-2 .tweaxbd-toggle-switch{
          position:relative; width:40px; height:20px; background:#ccc; border-radius:10px;
          cursor:pointer; transition:background-color .3s; display:inline-block; vertical-align:middle;
          box-shadow: inset 0 0 0 1px rgba(0,0,0,.2);
        }
        #tweaxbd-popup-container.tweaxbd-depth-2 .tweaxbd-switch-button{
          position:absolute; top:2px; left:2px; width:16px; height:16px; background:#fff; border-radius:50%;
          transition:left .3s; box-shadow:0 1px 2px rgba(0,0,0,.35);
        }
        #tweaxbd-popup-container.tweaxbd-depth-2 .tweaxbd-toggle-switch.active{ background:#4CAF50; }
        #tweaxbd-popup-container.tweaxbd-depth-2 .tweaxbd-toggle-switch.active .tweaxbd-switch-button{ left:22px; }

        .tweaxbd-switch-container{ display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px; }
        .tweaxbd-switch-label{ font-size:15px; display:grid; grid-template-columns:1fr auto; align-items:center; gap:8px; color:var(--fg); }

        .tweaxbd-info-text{ white-space: pre-line; font-size:11.5px; line-height:1.4; color:#aaa; background:rgba(255,255,255,.04); padding:6px 8px; border-left:3px solid #888; border-radius:3px; margin:5px auto 0 5px; display:inline-block; max-width:calc(100% - 20%); }
        .tweaxbd-group-header{ font-weight:bold; margin:10px 0 5px; cursor:pointer; color:var(--fg); }
        .tweaxbd-group-wrapper{ margin-left:.3ch; padding-left:12px; border-left:2px solid var(--group-border); }
        #tweaxbd-popup-container .tweaxbd-info-text{
          width:100%;
          max-width:100%;
          margin:6px 0 0 0;
          display:block;
          box-sizing:border-box;
          border-radius:6px;
        }
      `;

      const style = document.createElement('style');
      style.id = 'tweaxbd-config-style';
      style.textContent = css;
      document.head.appendChild(style);
    })();

    const container = document.createElement('div');
    container.id = 'tweaxbd-popup-container';
    container.className = 'tweaxbd-depth-2 ' + (currentTheme === 'night' ? 'tweaxbd-night' : 'tweaxbd-day');
    container.setAttribute('role','dialog');
    container.setAttribute('aria-modal','true');
    container.setAttribute('aria-labelledby','tweaxbd-heading');

    const header = document.createElement('div');
    header.id = 'tweaxbd-container-header';

    const title = document.createElement('h5');
    title.id = 'tweaxbd-heading';
    title.innerText = 'TweaxBD Control Panel';

    const themeButton = document.createElement('button');
    themeButton.id = 'tweaxbd-theme-btn';
    themeButton.innerHTML = '<i class="material-icons">' + (currentTheme === 'night' ? 'dark_mode' : 'light_mode') + '</i>';
    themeButton.title = 'Toggle Theme';
    themeButton.addEventListener('click', function () {
      currentTheme = (currentTheme === 'night') ? 'day' : 'night';
      GM_setValue('tweaxbdTheme', currentTheme);
      container.className = 'tweaxbd-depth-2 ' + (currentTheme === 'night' ? 'tweaxbd-night' : 'tweaxbd-day');
      themeButton.innerHTML = '<i class="material-icons">' + (currentTheme === 'night' ? 'dark_mode' : 'light_mode') + '</i>';
    });

    const tooltipButton = document.createElement('button');
    tooltipButton.id = 'tweaxbd-tooltip-btn';
    tooltipButton.innerHTML = '<i class="material-icons">' + (tooltipsVisible ? 'menu_book' : 'info_outline') + '</i>';
    tooltipButton.title = 'Toggle Tooltips';
    tooltipButton.addEventListener('click', function () {
      tooltipsVisible = !tooltipsVisible;
      GM_setValue('tweaxbdTooltipsVisible', tooltipsVisible);
      tooltipButton.innerHTML = '<i class="material-icons">' + (tooltipsVisible ? 'menu_book' : 'info_outline') + '</i>';

      document.querySelectorAll('.tweaxbd-info-text')
        .forEach(el => { el.style.display = tooltipsVisible ? 'block' : 'none'; });
      document.querySelectorAll('.tweaxbd-info-icon')
        .forEach(icon => { icon.style.display = tooltipsVisible ? 'none' : 'inline-block'; });

      if (tooltipsVisible) setAllGroups(true);
      else setAllGroups(false); // uncomment if you also want to collapse all on toggle-off
    });

    // === Toggle ALL features button (next to Tooltip) ===
    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.id = 'tweaxbd-toggleall-btn';

    function allNonLockedAreOn() {
      // Rebuild list each time to avoid ordering issues
      const cfg = Config.all();
      const list = FeatureBus.buildDefaultConfig()
        .flatMap(g => g.options)
        .filter(o => !o.locked)
        .map(o => o.key);
      return list.length ? list.every(k => !!cfg[k]) : false;
    }

    function refreshToggleAllIcon() {
      const allOn = allNonLockedAreOn();
      toggleAllBtn.innerHTML = '<i class="material-icons">' + (allOn ? 'toggle_on' : 'toggle_off') + '</i>';
      toggleAllBtn.title = allOn ? 'Turn ALL features OFF' : 'Turn ALL features ON';
      toggleAllBtn.setAttribute('aria-pressed', allOn ? 'true' : 'false');
    }

    function setAllFeatures(makeOn) {
      const before = Config.all();
      const changed = new Set();

      // Persist states and update visible switches
      FeatureBus.buildDefaultConfig().forEach(group => {
        group.options.forEach(o => {
          if (o.locked) return;                  // don't touch locked
          const prev = !!before[o.key];
          const next = !!makeOn;
          if (prev !== next) changed.add(o.key);
          GM_setValue(o.key, next);              // save
          // reflect in UI toggle row
          const row = document.querySelector(`.tweaxbd-switch-container[data-key="${o.key}"]`);
          const t = row?.querySelector('.tweaxbd-toggle-switch');
          if (t && !t.classList.contains('disabled')) {
            t.classList.toggle('active', next);
            t.setAttribute('aria-checked', next ? 'true' : 'false');
          }
        });
      });

      // Refresh config cache
      Config.reload();

      // Re-run only changed features that are ON and applicable to this page
      const Features = FeatureBus.buildFeatures();
      Features.forEach(f => {
        if (changed.has(f.key) && Config.get(f.key) && f.when()) {
          try { f.run(); } catch (e) { console.error('[TweaxBD]', f.key, e); }
        }
      });

      INTERNAL.runPostMutations?.();
      INTERNAL.connectObserver?.();

      Toast.show({ message: (makeOn ? 'Enabled' : 'Disabled') + ` all features${changed.size ? ` (${changed.size} changed)` : ''}`, autoclose: 1800 });
      refreshToggleAllIcon();
    }

    // Click: if some OFF → turn ALL ON; if all ON → turn ALL OFF
    toggleAllBtn.addEventListener('click', () => setAllFeatures(!allNonLockedAreOn()));

    // initial icon
    refreshToggleAllIcon();

    const closeButton = document.createElement('button');
    closeButton.id = 'tweaxbd-close-btn';
    closeButton.innerHTML = '<i class="material-icons">close</i>';
    closeButton.title = 'Close Popup';
    closeButton.addEventListener('click', function () { cleanupDialog(); });

    function cleanupDialog() {
      document.removeEventListener('keydown', onKeydown);
      container.remove();
      if (lastFocused) lastFocused.focus();
    }

    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.alignItems = 'center';
    btnContainer.style.justifyContent = 'space-between';
    btnContainer.style.width = '100%';

    const leftSide = document.createElement('div');
    leftSide.style.display = 'flex';
    leftSide.style.alignItems = 'center';
    leftSide.appendChild(title);

    const rightSide = document.createElement('div');
    rightSide.style.display = 'flex';
    rightSide.style.alignItems = 'center';

    const exportButton = document.createElement('button');
    exportButton.id = 'tweaxbd-export-btn';
    exportButton.title = 'Export Config';
    exportButton.innerHTML = '<i class="material-icons">file_download</i>';
    exportButton.addEventListener('click', function () {
      const configStr = JSON.stringify(Config.all(), null, 2);
      const blob = new Blob([configStr], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'tweaxConfig.json';
      document.body.appendChild(link); link.click(); link.remove();
      URL.revokeObjectURL(link.href);
      Toast.show({ message: 'Configuration exported', autoclose: 1800 });
    });

    const importButton = document.createElement('button');
    importButton.id = 'tweaxbd-import-btn';
    importButton.title = 'Import Config';
    importButton.innerHTML = '<i class="material-icons">file_upload</i>';
    importButton.addEventListener('click', function () {
      const fileInput = document.createElement('input');
      fileInput.type = 'file'; fileInput.accept = '.json';
      fileInput.addEventListener('change', function (event) {
        const file = event.target.files && event.target.files[0];
        if (!file || file.name.slice(-5).toLowerCase() !== '.json') {
          Toast.show({ message: 'Select a valid .json config file', autoclose: 2500 });
          return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
          try {
            const before = Config.all();
            const cfgObj = JSON.parse(e.target.result);
            const changed = new Set();
            const skipped = [];
            Object.keys(cfgObj).forEach(function (k) {
              if (isLocked(k)) { skipped.push(k); return; }
              const next = !!cfgObj[k];
              const prev = !!before[k];
              if (next !== prev) changed.add(k);
              GM_setValue(k, next);
            });
            Config.reload();
            Toast.show({ message: `Configuration imported (${changed.size} chg${skipped.length ? `, ${skipped.length} locked` : ''}).`, autoclose: 1800 });

            // Re-run only changed features that are active on this page
            const Features = FeatureBus.buildFeatures();
            Features.forEach(f => {
              if (changed.has(f.key) && f.when()) {
                try { f.run(); } catch (err) { console.error('[TweaxBD]', f.key, err); }
              }
            });
            INTERNAL.runPostMutations?.();
            INTERNAL.connectObserver?.();
          } catch (err) {
            Toast.show({ message: 'Invalid configuration format', autoclose: 2500 });
          }
        };
        reader.readAsText(file);
      }, { once: true });
      fileInput.click();
    });

    rightSide.appendChild(themeButton);
    rightSide.appendChild(tooltipButton);
    rightSide.appendChild(toggleAllBtn);
    rightSide.appendChild(exportButton);
    rightSide.appendChild(importButton);
    rightSide.appendChild(closeButton);

    btnContainer.appendChild(leftSide);
    btnContainer.appendChild(rightSide);
    header.appendChild(btnContainer);

    const itemsContainer = document.createElement('div'); itemsContainer.id = 'tweaxbd-items-container';
    const expandedGroups = [];
    function createSwitch(option) {
      const container = document.createElement('div'); container.className = 'tweaxbd-switch-container'; container.setAttribute('data-key', option.key);
      const labelWrapper = document.createElement('div'); labelWrapper.style.display = 'flex'; labelWrapper.style.flexDirection = 'column'; labelWrapper.style.flexGrow = '1';
      const topRow = document.createElement('div'); topRow.style.display = 'flex'; topRow.style.justifyContent = 'space-between'; topRow.style.alignItems = 'center';
      const label = document.createElement('span'); label.className = 'tweaxbd-switch-label'; label.style.fontSize = '15px'; label.textContent = option.label;
      const rightControls = document.createElement('div'); rightControls.style.display = 'flex'; rightControls.style.alignItems = 'center'; rightControls.style.gap = '8px';

      const infoIcon = document.createElement('span'); infoIcon.className = 'tweaxbd-info-icon'; infoIcon.textContent = '🛈'; infoIcon.style.cursor = 'pointer'; infoIcon.style.opacity = '0.6';
      infoIcon.style.transition = 'opacity .2s'; infoIcon.style.display = tooltipsVisible ? 'none' : 'inline-block';
      infoIcon.addEventListener('mouseover', function () { infoIcon.style.opacity = '1'; }); infoIcon.addEventListener('mouseout', function () { infoIcon.style.opacity = '0.6'; });

      const toggle = document.createElement('div'); toggle.className = 'tweaxbd-toggle-switch ' + (option.state ? 'active' : '');
      toggle.setAttribute('role','switch');
      toggle.setAttribute('tabindex','0');
      toggle.setAttribute('aria-checked', option.state ? 'true' : 'false');
      toggle.addEventListener('click', function () {
        option.state = !option.state; toggle.classList.toggle('active');
        toggle.setAttribute('aria-checked', option.state ? 'true' : 'false');
      });
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
      });

      if (option.locked) {
        if (option.state) toggle.classList.add('active');
        toggle.setAttribute('aria-checked', option.state ? 'true' : 'false');

        toggle.classList.add('disabled');
        toggle.setAttribute('aria-disabled', 'true');
        toggle.style.opacity = '.5';
        toggle.style.pointerEvents = 'none';

        label.textContent = option.label + ' 🔒';
      }

      const switchButton = document.createElement('div'); switchButton.className = 'tweaxbd-switch-button';
      toggle.appendChild(switchButton);

      rightControls.appendChild(infoIcon); rightControls.appendChild(toggle);
      topRow.appendChild(label); topRow.appendChild(rightControls);

      const infoText = document.createElement('div'); infoText.textContent = '' + option.info; infoText.className = 'tweaxbd-info-text'; infoText.style.display = tooltipsVisible ? 'block' : 'none';
      infoIcon.addEventListener('click', function () {
        document.querySelectorAll('.tweaxbd-info-text').forEach(function (el) { if (el !== infoText) el.style.display = 'none'; });
        infoText.style.display = (infoText.style.display === 'block') ? 'none' : 'block';
      });

      labelWrapper.appendChild(topRow); labelWrapper.appendChild(infoText); container.appendChild(labelWrapper);
      return container;
    }

    function handleGroupToggle(groupHeader, groupWrapper) {
      const visible = groupWrapper.style.display === 'block';
      const label = groupHeader.textContent.replace(/^▸|▾/, '').trim();
      if (visible) {
        groupWrapper.style.display = 'none'; groupHeader.textContent = '▸ ' + label;
        const idx = expandedGroups.indexOf(groupWrapper); if (idx !== -1) expandedGroups.splice(idx, 1);
        groupWrapper.querySelectorAll('.tweaxbd-info-text').forEach(function (info) { info.style.display = 'none'; });
      } else {
        groupWrapper.style.display = 'block'; groupHeader.textContent = '▾ ' + label; expandedGroups.push(groupWrapper);
        const root = document.getElementById('tweaxbd-popup-container');
        while (root.offsetHeight > window.innerHeight * 0.8 && expandedGroups.length > 1) {
          const oldest = expandedGroups.shift(); const header = oldest.previousElementSibling;
          oldest.style.display = 'none'; if (header && header.classList.contains('tweaxbd-group-header')) header.textContent = '▸ ' + header.textContent.replace(/^▸|▾/, '').trim();
        }
      }
    }

    function setAllGroups(open) {
      const headers = itemsContainer.querySelectorAll('.tweaxbd-group-header');
      headers.forEach((header) => {
        const wrapper = header.nextElementSibling;
        const isOpen = wrapper && wrapper.style.display === 'block';
        if (open && !isOpen) handleGroupToggle(header, wrapper);
        if (!open && isOpen) handleGroupToggle(header, wrapper);
      });
    }

    const defaultConfig = FeatureBus.buildDefaultConfig();
    defaultConfig.forEach(function (group) {
      const groupHeader = document.createElement('div');
      groupHeader.className = 'tweaxbd-group-header';
      groupHeader.textContent = '▸ ' + group.name;

      const groupWrapper = document.createElement('div');
      groupWrapper.className = 'tweaxbd-group-wrapper';
      groupWrapper.style.display = 'none';

      group.options.forEach(function (option) {
        const sw = createSwitch(option);
        groupWrapper.appendChild(sw);
      });

      groupHeader.addEventListener('click', function () { handleGroupToggle(groupHeader, groupWrapper); });
      itemsContainer.appendChild(groupHeader); itemsContainer.appendChild(groupWrapper);
    });

    const saveContainer = document.createElement('div'); saveContainer.id = 'tweaxbd-save-container';
    const saveButton = document.createElement('button');
    saveButton.className = 'tweaxbd-button tweaxbd-save-button';
    saveButton.title = 'Save Config'; saveButton.innerText = '💾 Save';
    saveButton.addEventListener('click', function () {
      const before = Config.all();
      const changed = new Set();
      const skipped = [];
      defaultConfig.forEach(function (g) {
        g.options.forEach(function (o) {
          if (isLocked(o.key)) { skipped.push(o.key); return; }
          const prev = !!before[o.key];
          const next = !!o.state;
          if (prev !== next) changed.add(o.key);
          GM_setValue(o.key, next);
        });
      });
      Config.reload();
      Toast.show({ message: `Configuration saved (${changed.size} chg${skipped.length ? `, ${skipped.length} locked` : ''}).`, autoclose: 2200 });
      cleanupDialog();
      // Selective re-run: only changed features
      const Features = FeatureBus.buildFeatures();
      Features.forEach(f => {
        if (changed.has(f.key) && f.when()) {
          try { f.run(); } catch (e) { console.error('[TweaxBD]', f.key, e); }
        }
      });
      INTERNAL.runPostMutations?.();
      INTERNAL.connectObserver?.();
    });
    saveContainer.appendChild(saveButton);

    container.appendChild(header);
    const body = document.createElement('div'); body.id = 'tweaxbd-body-content';
    body.appendChild(itemsContainer);
    container.appendChild(body);
    container.appendChild(saveContainer);
    document.body.appendChild(container);

    // Expand/collapse groups on open based on saved global toggle
    if (tooltipsVisible) setAllGroups(true);
    else setAllGroups(false);

    // Focus management (trap)
    const focusables = () => Array.from(container.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
    let lastFocused = document.activeElement;
    const first = focusables()[0]; const last = focusables().slice(-1)[0];
    first?.focus();

    function onKeydown(e){
      if (e.key === 'Escape') { e.preventDefault(); cleanupDialog(); return; }
      if (e.key === 'Tab') {
        const list = focusables(); if (list.length === 0) return;
        const firstEl = list[0]; const lastEl = list[list.length-1];
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      }
    }
    document.addEventListener('keydown', onKeydown);
  }

  Once.do('menu-config', () => GM_registerMenuCommand('🛠️ TweaxBD Control Panel', showConfigPopup));

  // -------------------------
  // (O) Ultra-light Observer v2 (adaptive) — optimized
  // -------------------------
  const ObserverGate = (() => {
    let disconnected = false;
    function pause(fn){
      try {
        if (INTERNAL.observer?.disconnect && !disconnected) {
          INTERNAL.observer.disconnect();
          disconnected = true;
        }
        fn();
      } finally {
        if (disconnected && INTERNAL.connectObserver) {
          INTERNAL.connectObserver();
          disconnected = false;
        }
      }
    }
    return { pause };
  })();

  // ---- Visibility gate (single shared IO) ----
  const IO = (() => {
    const seen = new WeakSet();
    let io = null;
    const pending = new Map(); // element -> callback
    function ensure() {
      if (io) return io;
      io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const cb = pending.get(el);
          if (cb && !seen.has(el)) {
            seen.add(el);
            pending.delete(el);
            try { cb(el); } catch {}
          }
          io.unobserve(el);
        });
      }, { rootMargin: '800px 0px' });
      return io;
    }
    function onVisible(selector, cb) {
      const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el || seen.has(el)) return;
      pending.set(el, cb);
      ensure().observe(el);
    }
    function onVisibleAll(selector, cb) {
      const list = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;
      if (!list) return;
      list.forEach((el) => {
        if (seen.has(el)) return;
        pending.set(el, cb);
        ensure().observe(el);
      });
    }
    function clear(){ seen.clear(); pending.clear(); }
    return { onVisible, onVisibleAll, clear };
  })();

  // -------------------------
  // safeRun helper (idle scheduling + try/catch)
  // -------------------------
  function safeRun(run, { idle=false, label='' } = {}) {
    const exec = () => { try { run(); } catch (e) { console.error('[TweaxBD] Feature error:', label, e); } };
    if (idle && 'requestIdleCallback' in window) {
      requestIdleCallback(exec, { timeout: 1500 });
    } else {
      exec();
    }
  }

  (function () {
    // Tunable caps in one place
    const TWEAX_LIMITS = { PROCESS_BUDGET_MS:12, MAX_FLUSH:200, QUEUE_HARD_CAP:2000, HEAVY_DOM_LIMIT:15000 };

    const POST_DEBOUNCE_MS = 650;
    let postTimer = null;
    let firstPostRunDone = false;
    function debouncedPostMutations() { if (postTimer) clearTimeout(postTimer); postTimer = setTimeout(runPostMutations, POST_DEBOUNCE_MS); }

    function runPostMutations() {
      const cfg = Config.all();
      try {
        if (cfg.abbreviateSeedBonus) AbbreviateSeedBonus.applyGlobal();
        if (cfg.relabelTerms && !firstPostRunDone) RelabelTerms.applyGlobal();

        if (cfg.disableNonFreeleech && (Router.is('home') || Router.is('details') || Router.is('movies') || Router.is('tv'))) {
          DisableNonFreeleech.applyGlobal();
        }

        if (Router.is('activities') && cfg.activitiesSortable && !document.querySelector('thead th.tab-sortable')) {
          makeTableSortableForPage();
        }
        if (Router.is('breakdown') && cfg.breakdownSortable && !document.querySelector('thead th.tab-sortable')) {
          makeTableSortableForPage();
        }
        if (Router.is('movies')) {
          if (cfg.movieSortable && !document.querySelector('thead th.tab-sortable')) makeTableSortableForPage();
          if (cfg.movieStats) TorrentStats.compute();
        }

        if (cfg.torrentExportEnabled && !document.querySelector('.torrent-links-ui,.kuddus-torrent-links-ui')) {
          try { TorrentExport.run(); } catch {}
        }
        if (cfg.faqClipperEnabled && Utils.isPage('/faq.php')) {
          const needs = Array.from(document.querySelectorAll('.collapsible-header.faqq'))
            .some(h => !h.querySelector('.copy-button-icon'));
          if (needs) { try { FaqClipper.run(); } catch {} }
        }
        if (cfg.profileFlexZone && Router.is('profile') && !document.getElementById('tweaxbd-flexzone')) {
          try { ProfileFlexZone.render(); } catch {} }
      } catch (e) { /* keep UI responsive */ }
      firstPostRunDone = true;
    }
    // expose internally for config/import flows
    INTERNAL.runPostMutations = runPostMutations;

    // HARD-OFF: remove the Live DOM Watcher (MutationObserver)
    INTERNAL.connectObserver = () => {};  // no-op
    INTERNAL.observer = null;             // nothing to disconnect
    return;                               // exit this IIFE before any MO wiring

    // cheap viewport test
    function isNearViewport(node, pad=1500){
      try {
        const r = node.getBoundingClientRect();
        return r.bottom >= -pad && r.top <= (window.innerHeight + pad);
      } catch { return true; }
    }

    // --- HYBRID SELECTOR REGISTRY (page + feature observe + relabel targets) ---
    const SELECTORS = {
      features: {
        tables: ['.simple-data-table', '.torrents-table', '.movie-torrents-table', '.kuddus-torrents-table'],
        misc: ['#shoutbox-container', '#seeding', '.torrents-container', '.tp-container'],
        anchors: ['a', 'table']
      },
      pages: {
        '/':                       { root: '#torrents-main',                    groups: ['tables','misc','anchors'] },
        '/index.php':              { root: '#torrents-main',                    groups: ['tables','misc','anchors'] },
        '/activities.php':         { root: '#seeding, .simple-data-table',      groups: ['tables','misc','anchors'] },
        '/activity.php':           { root: '#seeding, .simple-data-table',      groups: ['tables','misc','anchors'] },
        '/seedbonus.php':          { root: '.content-title, #middle-block',     groups: ['misc','anchors'] },
        '/seedbonus-breakdown.php':{ root: '.simple-data-table',                groups: ['tables','misc','anchors'] },
        '/movies.php':             { root: '.movie-torrents-table',             groups: ['tables','misc','anchors'] },
        '/tv.php':                 { root: 'tbody',                             groups: ['tables','misc','anchors'] },
        '/torrents-details.php':   { root: '.col.s12.m5.l4.center',             groups: ['misc','anchors'] },
        '/forums.php':             { root: '#ftta-container, #middle-block',    groups: ['anchors'] }
      }
    };

    // Memoized per-path unions for speed
    let memoPath = null;
    let memoSelectors = [];
    let memoTargetQS = '';
    function pageSelectors() {
      if (Router.path === memoPath && memoSelectors.length) return memoSelectors;
      const entry = SELECTORS.pages[Router.path] || SELECTORS.pages['/'] || { groups: Object.keys(SELECTORS.features) };
      const uniq = new Set();
      (entry.groups || []).forEach(g => (SELECTORS.features[g] || []).forEach(s => uniq.add(s)));
      // merge feature-specific observe selectors
      ObservedSelectors.list().forEach(s => uniq.add(s));
      // also merge relabel targets so we catch new labels efficiently
      ['.cr-wrapper .cr-label','td.center-align','.short-links'].forEach(s=>uniq.add(s));
      memoSelectors = Array.from(uniq);
      memoTargetQS = memoSelectors.join(',');
      memoPath = Router.path;
      return memoSelectors;
    }
    function targetQS() { pageSelectors(); return memoTargetQS; }

    function pickObserveTarget() {
      const entry = SELECTORS.pages[Router.path];
      if (!entry || !entry.root) return document.body;
      const firstHit = entry.root.split(',').map(s => s.trim()).map(s => document.querySelector(s)).find(Boolean);
      return firstHit || document.body;
    }

    function hasAnchorOrTargetNodes(node){
      if (node.nodeType !== 1) return false;
      const list = pageSelectors();
      if (list.length && node.matches?.(list.join(','))) return true;
      if (node.childElementCount > 150) return false; // avoid scanning huge subtrees
      return !!node.querySelector?.(targetQS());
    }

    // Adaptive queue with backpressure
    let queue = [];
    let queuedSet = new WeakSet();
    let scheduled = false;
    let observer = null;

    const PROCESS_BUDGET_MS = TWEAX_LIMITS.PROCESS_BUDGET_MS;
    const MAX_FLUSH = TWEAX_LIMITS.MAX_FLUSH;
    const QUEUE_HARD_CAP = TWEAX_LIMITS.QUEUE_HARD_CAP;
    const HEAVY_DOM_LIMIT = TWEAX_LIMITS.HEAVY_DOM_LIMIT;
    let heavyToastShown = false;
    let hardDisabledWatcher = false;

    // leaky-bucket credits
    let credit = 1200, last = performance.now();
    function allow(n) {
      const now = performance.now();
      credit = Math.min(2000, credit + (now - last) * 3);
      last = now;
      if (credit < n) return false;
      credit -= n;
      return true;
    }

    const SHOULD_OBSERVE = () => {
      const cfg = Config.all();
      if (!cfg.utilLiveObserver) return false;
      return (Router.is('home') || Router.is('activities') || Router.is('breakdown') || Router.is('movies') || Router.is('tv') || Router.is('details') || Router.is('forums') || Router.is('seedbonus'));
    };

    function isHeavyDOM() {
      try { return document.getElementsByTagName('*').length > HEAVY_DOM_LIMIT; } catch { return false; }
    }

    function scheduleProcess() {
      if (scheduled) return;
      scheduled = true;
      const idle = window.requestIdleCallback || function (cb) {
        return requestAnimationFrame(function () { cb({ timeRemaining: () => PROCESS_BUDGET_MS }); });
      };
      idle(processQueue);
    }

    function processQueue(deadline) {
      scheduled = false;
      const timeLeft = typeof deadline.timeRemaining === 'function' ? deadline.timeRemaining : () => PROCESS_BUDGET_MS;
      let n = 0;
      while (queue.length && timeLeft() > 1 && n < MAX_FLUSH) {
        const node = queue.shift();
        queuedSet.delete(node);
        try {
          if (isNearViewport(node)) RelabelTerms.applyToRoot(node);
        } catch {}
        n++;
      }
      debouncedPostMutations();
      if (queue.length) scheduleProcess();
    }

    function enqueue(node){
      if (!node || node.nodeType!==1) return;
      if (node.tagName==='STYLE' || node.tagName==='SCRIPT') return;
      if (!hasAnchorOrTargetNodes(node)) return;
      if (queuedSet.has(node)) return;
      queuedSet.add(node);
      queue.push(node);
    }

    function onMutations(records) {
      if (!SHOULD_OBSERVE()) return;
      if (!allow(records.length)) return;

      let useful = false;
      for (const r of records) {
        if (!r.addedNodes?.length) continue;
        if (r.target?.closest?.('#tweaxbd-popup-container')) continue;
        for (const n of r.addedNodes) {
          enqueue(n);
          useful = true;
        }
      }
      if (queue.length > QUEUE_HARD_CAP) {
        queue = queue.slice(-Math.floor(QUEUE_HARD_CAP/2));
        queuedSet = new WeakSet();
        for (const n of queue) if (n && typeof n === 'object') queuedSet.add(n);
      }
      if (useful) scheduleProcess();
    }

    function connectObserver() {
      if (observer) observer.disconnect();
      if (!SHOULD_OBSERVE()) { INTERNAL.observer = null; return; }

      if (isHeavyDOM()) {
        hardDisabledWatcher = true;
        if (!heavyToastShown) {
          Toast.show({ message: 'Live watcher disabled (heavy page). You can enable it from Config.', autoclose: 3500 });
          heavyToastShown = true;
        }
        INTERNAL.observer = null;
        return;
      }

      if (hardDisabledWatcher && !Config.get('utilLiveObserver')) { INTERNAL.observer = null; return; }

      observer = new MutationObserver(onMutations);
      observer.observe(pickObserveTarget(), { childList: true, subtree: true });
      INTERNAL.observer = observer;
    }
    INTERNAL.connectObserver = connectObserver;

    Once.do('visibility-handler', () => {
      document.addEventListener('visibilitychange', function () {
        if (!observer) return;
        if (document.hidden) { observer.disconnect(); IO.clear(); }
        else connectObserver();
      }, { passive: true });
    });

    // single bootstrap path handled outside (see end of file)
  })();

  // -------------------------
  // Bootstrapping: run enabled features once
  // -------------------------
  function initializeTweaks(fromConfigChange) {
    if (fromConfigChange === void 0) fromConfigChange = false;
    const Features = FeatureBus.buildFeatures();
    const cfg = Config.all();
    Features.forEach(function (f) {
      if (cfg[f.key] && f.when()) {
        try { f.run(); } catch (e) { console.error('[TweaxBD]', f.key, e); }
      }
    });
    if (fromConfigChange) {
      const ccfg = Config.all();
      if (ccfg.utilInternalLinks) Once.do('internal-link-intercept', interceptInternalLinkTargets);
      INTERNAL.runPostMutations?.();
      INTERNAL.connectObserver?.();
    }
  }

  // ---- Single bootstrap path (no duplicate runPost/connect) ----
  initializeTweaks();
  INTERNAL.runPostMutations?.();
  INTERNAL.connectObserver?.();

})();