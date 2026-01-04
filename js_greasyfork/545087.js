// ==UserScript==
// @name         Universal Image Resizer & Downloader (by Eliminater74)
// @namespace    https://greasyfork.org/en/users/123456-eliminater74
// @version      1.7
// @description  Resize any image client-side (CORS-safe). Alt+Right-Click or hover chip to open. Blob preview + anchor download. Remembers last settings + last-used format (sticky). Timestamped filenames with tokens. Quick presets + Platform presets dropdown in header.
// @author       Eliminater74
// @license      MIT
// @match        *://*/*
// @icon         https://www.tiktok.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @connect      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545087/Universal%20Image%20Resizer%20%20Downloader%20%28by%20Eliminater74%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545087/Universal%20Image%20Resizer%20%20Downloader%20%28by%20Eliminater74%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // =========================
  // Defaults + storage
  // =========================
  const DEFAULTS = {
    width: 3000,
    height: 3000,
    mode: 'contain',                 // 'contain' | 'cover' | 'stretch'
    bgColor: '#000000',              // used for letterbox in 'contain'
    format: 'image/jpeg',            // 'image/jpeg' | 'image/png' | 'image/webp'
    quality: 0.95,                   // for JPEG/WEBP
    filenameTpl: '{name}_{w}x{h}_{YYYY}-{MM}-{DD}_{hh}{mm}{ss}', // tokens below
    minImgEdge: 160,                 // only show chip if image larger than this
    showHoverChip: true,
    chipCorner: 'top-left',          // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    useAltRightClick: true           // true = Alt+RightClick; false = plain RightClick (replaces native menu on images)
  };

  const STORE_KEY = 'uird:lastOptions';
  const STORE_LAST_FORMAT = 'uird:lastFormat';

  const saved = safeGet(STORE_KEY) || {};
  const stickyFmt = safeGet(STORE_LAST_FORMAT);

  let state = {
    selectedImg: null,
    lastHoverImg: null,
    options: { ...DEFAULTS, ...(saved || {}) }
  };
  if (stickyFmt) state.options.format = stickyFmt;  // stick to last used (e.g., JPG)



  // =========================
  // Platform presets
  // =========================
  const PLATFORM_PRESETS = [
    {
      title: 'Suno',
      items: [
        { label: 'Video 1080×1920 (9:16)', w: 1080, h: 1920 },
        { label: 'Video 720×1280 (Min)',   w: 720,  h: 1280 },
        { label: 'Cover 3000×3000',        w: 3000, h: 3000 },
        { label: 'Cover 1600×1600',        w: 1600, h: 1600 }
      ]
    },
    {
      title: 'YouTube',
      items: [
        { label: 'Thumbnail 1280×720',       w: 1280, h: 720 },
        { label: 'Channel Banner 2560×1440', w: 2560, h: 1440 },
        { label: 'Channel Icon 800×800',     w: 800,  h: 800 },
        { label: 'Shorts 1080×1920',         w: 1080, h: 1920 }
      ]
    },
    {
      title: 'TikTok',
      items: [
        { label: 'Video 1080×1920',       w: 1080, h: 1920 },
        { label: 'Alt Vertical 720×1280', w: 720,  h: 1280 },
        { label: 'Profile 200×200',       w: 200,  h: 200 }
      ]
    },
    {
      title: 'Instagram',
      items: [
        { label: 'Post Square 1080×1080',   w: 1080, h: 1080 },
        { label: 'Post Portrait 1080×1350', w: 1080, h: 1350 },
        { label: 'Story/Reel 1080×1920',    w: 1080, h: 1920 }
      ]
    },
    {
      title: 'Spotify / DistroKid',
      items: [
         { label: 'Album Cover 3000×3000', w: 3000, h: 3000 },
         { label: 'Alt Cover 1600×1600',   w: 1600, h: 1600 }
      ]
    }
  ];

  // =========================
  // Tiny DOM helpers
  // =========================
  function h(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v);
    });
    (Array.isArray(children) ? children : [children]).forEach(c => {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }
  function injectCSS(css) { document.head.appendChild(h('style', { type: 'text/css' }, css)); }

  injectCSS(`
    .uird-chip{position:absolute;z-index:2147483647;background:rgba(0,0,0,.85);color:#fff;font:12px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:4px 8px;border:1px solid rgba(255,255,255,.2);border-radius:6px;cursor:pointer;user-select:none;box-shadow:0 2px 8px rgba(0,0,0,.4);pointer-events:auto}
    .uird-panel{position:fixed;right:20px;bottom:20px;width:340px;background:#111;color:#eee;border:1px solid #333;border-radius:10px;z-index:2147483647;box-shadow:0 8px 24px rgba(0,0,0,.6);font:13px/1.3 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif}
    .uird-panel .hdr{padding:8px 12px;background:#1a1a1a;border-bottom:1px solid #333;border-radius:10px 10px 0 0;display:flex;align-items:center;justify-content:space-between;cursor:move}
    .uird-panel .hdr .left{display:flex;align-items:center;gap:6px}
    .uird-panel .hdr .right{display:flex;align-items:center;gap:6px}
    .uird-panel .body{padding:10px 12px 12px;display:grid;grid-template-columns:1fr 1fr;gap:8px}
    .uird-panel label{opacity:.9;font-size:12px}
    .uird-panel input[type="number"],.uird-panel input[type="text"],.uird-panel select{width:100%;padding:6px 8px;background:#0f0f0f;color:#eee;border:1px solid #333;border-radius:6px;outline:none}
    .uird-panel input[type="color"]{width:100%;height:32px;padding:0;border:1px solid #333;border-radius:6px;background:#0f0f0f}
    .uird-panel .row-2{grid-column:span 2}
    .uird-panel .btns{grid-column:span 2;display:flex;gap:8px}
    .uird-panel button{padding:6px 10px;background:#212121;color:#fff;border:1px solid #3a3a3a;border-radius:8px;cursor:pointer}
    .uird-panel button:hover{background:#2a2a2a}
    .uird-tag{display:inline-block;padding:4px 8px;border:1px solid #444;border-radius:6px;background:#181818;cursor:pointer;margin-right:6px;margin-bottom:6px}
    .uird-subtle{opacity:.65;font-size:11px}

    /* Compact dropdown menu */
    .uird-dd-wrap{position:relative;display:inline-block}
    .uird-dd{position:absolute;top:100%;left:0;min-width:260px;max-height:60vh;overflow:auto;background:#0f0f0f;border:1px solid #333;border-radius:10px;box-shadow:0 10px 26px rgba(0,0,0,.6);padding:8px;z-index:2147483647}
    .uird-dd .group{margin-bottom:8px}
    .uird-dd .group-title{font-size:12px;font-weight:600;opacity:.9;margin:6px 2px}
    .uird-dd .item{display:block;width:100%;text-align:left;margin:4px 0;padding:6px 8px;border:1px solid #444;border-radius:8px;background:#181818;cursor:pointer}
    .uird-dd .item:hover{background:#232323}
    .uird-dd .sep{height:1px;background:#222;margin:6px 0}
  `);

  // =========================
  // Hover chip
  // =========================
  let chip, chipHover = false, clearSelTimer;
  function ensureChip() {
    if (chip) return chip;

    // Create chip container
    chip = h('div', { class: 'uird-chip', style: { display: 'none', gap: '8px', alignItems: 'center' } });

    // Main "Resize" button part
    const mainBtn = h('span', {}, 'Resize');
    mainBtn.onclick = (e) => {
        e.stopPropagation();
        if (!state.selectedImg && state.lastHoverImg) state.selectedImg = state.lastHoverImg;
        if (state.selectedImg) openPanel();
    };
    chip.appendChild(mainBtn);

    // Suno/Vertical "Fast Action" button
    const sunoBtn = h('span', {
            style: { borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '8px', fontWeight: 'bold', color: '#ffd700' },
            title: 'Quick 9:16 (1080x1920) Cover [Click: Panel, Alt+Click: Download]'
        }, '⚡ 9:16');

        sunoBtn.onclick = (e) => {
            e.stopPropagation();
            if (!state.selectedImg && state.lastHoverImg) state.selectedImg = state.lastHoverImg;
            if (!state.selectedImg) return;

            // Set Suno Video Defaults
            state.options.width = 1080;
            state.options.height = 1920;
            state.options.mode = 'cover';
            saveOptions();

            if (e.altKey) {
                // Alt+Click -> Instant Download
                processCurrentImage(true);
            } else {
                // Click -> Open Panel (so they can verify crop)
                // We force panel open even if already open to update inputs
                if(panel) { panel.remove(); panel = null; }
                openPanel();
            }
        };
        chip.appendChild(sunoBtn);

    chip.addEventListener('mouseenter', () => { chipHover = true; });
    chip.addEventListener('mouseleave', () => { chipHover = false; scheduleClearSelection(); });

    document.body.appendChild(chip);
    return chip;
  }
  function positionChipFor(img) {
    const rect = img.getBoundingClientRect();
    const ch = ensureChip();
    const pad = 8;
    let x, y;
    switch (state.options.chipCorner) {
      case 'top-right':    x = scrollX + rect.left + rect.width - 70; y = scrollY + rect.top + pad; break;
      case 'bottom-left':  x = scrollX + rect.left + pad;            y = scrollY + rect.top + rect.height - 30; break;
      case 'bottom-right': x = scrollX + rect.left + rect.width - 70; y = scrollY + rect.top + rect.height - 30; break;
      default:             x = scrollX + rect.left + pad;            y = scrollY + rect.top + pad;
    }
    ch.style.left = `${x}px`;
    ch.style.top  = `${y}px`;
    ch.style.display = 'flex';
  }
  function scheduleClearSelection() {
    clearTimeout(clearSelTimer);
    clearSelTimer = setTimeout(() => {
      if (!chipHover) { state.selectedImg = null; ensureChip().style.display = 'none'; }
    }, 250);
  }

  // =========================
  // Draggable panel
  // =========================
  function makeDraggable(panel, handle) {
    let sx, sy, sl, st, dragging = false;
    handle.addEventListener('mousedown', (e) => {
      dragging = true; sx = e.clientX; sy = e.clientY;
      const r = panel.getBoundingClientRect(); sl = r.left; st = r.top; e.preventDefault();
    });
    addEventListener('mousemove', (e) => {
      if (!dragging) return;
      panel.style.left = (sl + (e.clientX - sx)) + 'px';
      panel.style.top  = (st + (e.clientY - sy)) + 'px';
      panel.style.right = 'auto'; panel.style.bottom = 'auto';
    });
    addEventListener('mouseup', () => dragging = false);
  }

  // =========================
  // Persist helpers
  // =========================
  function safeGet(key) {
    try { return GM_getValue(key); } catch { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
  }
  function safeSet(key, value) {
    try { GM_setValue(key, value); } catch { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }
  }
  function saveOptions() { safeSet(STORE_KEY, state.options); }
  function saveLastFormat(fmt) { safeSet(STORE_LAST_FORMAT, fmt); }

  // =========================
  // Panel UI
  // =========================
  let panel;
  function openPanel() {
    if (panel) { panel.style.display = 'block'; return; }

    // header with dropdown + reset/close
    const ddWrap = h('div', { class: 'uird-dd-wrap' }, [
      button('Platform Presets ▾', (e) => {
        makeDropdown(e.target, (close) => {
          const out = [];
          for (const group of PLATFORM_PRESETS) {
            out.push(h('div', { class: 'group' }, [
              h('div', { class: 'group-title' }, group.title),
              ...group.items.map(it =>
                h('button', {
                  class: 'item', title: `${it.w}×${it.h}`,
                  onclick: () => { setWH(it.w, it.h); close(); }
                }, it.label)
              )
            ]));
            out.push(h('div', { class: 'sep' }));
          }
          out.pop();
          return out;
        });
      })
    ]);

    panel = h('div', { class: 'uird-panel' }, [
      h('div', { class: 'hdr' }, [
        h('div', { class: 'left' }, [
          h('div', {}, 'Image Resizer'),
          ddWrap
        ]),
        h('div', { class: 'right' }, [
          h('button', {
            style: { background: '#2a2a2a', padding: '4px 8px', borderRadius: '6px', border: '1px solid #555' },
            onclick: () => { state.options = { ...DEFAULTS, format: (safeGet(STORE_LAST_FORMAT) || DEFAULTS.format) }; rerenderInputs(); saveOptions(); }
          }, 'Reset'),
          h('button', { style: { background: '#3a3a3a', padding: '4px 8px', borderRadius: '6px', border: '1px solid #555' }, onclick: () => panel.style.display = 'none' }, '✕')
        ])
      ]),

      h('div', { class: 'body' }, [
        // Quick Presets (expanded a bit)
        h('div', { class: 'row-2 uird-subtle' }, 'Quick Presets'),
        chipRow(['3000x3000','4096x4096','2048x2048','1600x1600','1080x1080']),
        chipRow(['5120x2880','3840x2160','2560x1440','2048x1152','1920x1080']),
        chipRow(['1440x2560','1080x1920','1536x2048','1242x2688','1280x720']),

        // Size
        numField('Width', 'width'),
        numField('Height', 'height'),

        // Mode
        selectField('Mode', 'mode', [
          ['contain', 'contain (letterbox)'],
          ['cover',   'cover (crop)'],
          ['stretch', 'stretch (no aspect)']
        ]),

        // BG color
        colorField('BG Color (contain)', 'bgColor'),

        // Format & quality (format sticks)
        selectField('Format', 'format', [
          ['image/jpeg', 'JPEG (.jpg)'],
          ['image/png',  'PNG (.png)'],
          ['image/webp', 'WEBP (.webp)']
        ], (v) => { saveLastFormat(v); return v; }),
        numField('Quality (JPEG/WEBP)', 'quality', { step: '0.01', min: '0', max: '1', isFloat: true }),

        // Filename template + help
        h('div', { class: 'row-2' }, [
          h('label', {}, 'Filename Template'),
          h('input', {
            type: 'text',
            value: state.options.filenameTpl,
            oninput: e => { state.options.filenameTpl = e.target.value; saveOptions(); }
          }),
          h('div', { class: 'uird-subtle row-2' },
            'Tokens: {name} {w} {h} {ext} {ts} {YYYY} {MM} {DD} {hh} {mm} {ss} {site} {title}')
        ]),

        // Behavior toggles
        selectField('Chip Corner', 'chipCorner', [
          ['top-left', 'top-left'],
          ['top-right', 'top-right'],
          ['bottom-left', 'bottom-left'],
          ['bottom-right', 'bottom-right']
        ]),
        selectField('Right-Click trigger', 'useAltRightClick', [
          ['true', 'Alt + Right-Click'],
          ['false', 'Right-Click (no menu)']
        ], v => v === 'true'),

        // Buttons
        h('div', { class: 'btns' }, [
          h('button', { onclick: () => processCurrentImage(false) }, 'Preview (new tab)'),
          h('button', { onclick: () => processCurrentImage(true)  }, 'Download')
        ]),
      ])
    ]);

    document.body.appendChild(panel);
    makeDraggable(panel, panel.querySelector('.hdr'));

    function chipRow(list) {
      return h('div', { class: 'row-2' },
        list.map(sz => h('span', { class: 'uird-tag', onclick: () => applySizeToken(sz) }, sz))
      );
    }

    function applySizeToken(token) {
      const [w, h] = token.split('x').map(n => parseInt(n, 10));
      if (!isFinite(w) || !isFinite(h)) return;
      setWH(w, h);
    }

    function setWH(w, h) {
      state.options.width = w; state.options.height = h; saveOptions(); rerenderInputs();
    }

    function numField(label, key, cfg = {}) {
      const inp = h('input', {
        type: 'number',
        value: state.options[key],
        step: cfg.step || (cfg.isFloat ? '0.01' : '1'),
        min: cfg.min || '0', max: cfg.max || '20000',
        oninput: e => {
          state.options[key] = cfg.isFloat ? clampFloat(e.target.value, 0, 100, state.options[key]) : clampInt(e.target.value, 1, 20000);
          saveOptions();
        }
      });
      return h('div', {}, [ h('label', {}, label), inp ]);
    }
    function selectField(label, key, opts, map = v => v) {
      const sel = h('select', {
        onchange: e => { state.options[key] = map(e.target.value); saveOptions(); }
      }, opts.map(([v, t]) => h('option', { value: String(v), selected: String(state.options[key]) === String(v) }, t)));
      return h('div', {}, [ h('label', {}, label), sel ]);
    }
    function colorField(label, key) {
      const inp = h('input', {
        type: 'color',
        value: state.options[key],
        oninput: e => { state.options[key] = e.target.value; saveOptions(); }
      });
      return h('div', {}, [ h('label', {}, label), inp ]);
    }
    function rerenderInputs() {
      panel.remove();
      panel = null;
      openPanel();
    }
  }

  function clampInt(v, min, max) { v = parseInt(v || 0, 10); if (isNaN(v)) v = min; return Math.max(min, Math.min(max, v)); }
  function clampFloat(v, min, max, fallback) { v = parseFloat(v); if (isNaN(v)) return fallback; return Math.max(min, Math.min(max, v)); }

  // =========================
  // CORS-safe image loading
  // =========================
  function fetchImageArrayBuffer(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        responseType: 'arraybuffer',
        onload: (res) => {
          if (res.status >= 200 && res.status < 300 && res.response) {
            const ct = res.responseHeaders?.match(/content-type:\s*([^\n\r;]+)/i)?.[1]?.trim() || '';
            resolve({ buffer: res.response, contentType: ct });
          } else reject(new Error('Failed to fetch image: ' + res.status));
        },
        onerror: err => reject(err)
      });
    });
  }

  async function loadBitmapFromURL(src) {
    if (/^(data|blob):/i.test(src)) {
      const resp = await fetch(src);
      const blob = await resp.blob();
      const bmp = (self.createImageBitmap) ? await createImageBitmap(blob) : await blobToCanvas(URL.createObjectURL(blob));
      return { bmp, blob, name: guessNameFromURL('image'), type: blob.type || 'image/png' };
    }
    const { buffer, contentType } = await fetchImageArrayBuffer(src);
    const type = contentType || guessMimeFromURL(src) || 'image/png';
    const blob = new Blob([buffer], { type });
    const bmp = (self.createImageBitmap) ? await createImageBitmap(blob) : await blobToCanvas(URL.createObjectURL(blob));
    return { bmp, blob, name: guessNameFromURL(src), type };
  }

  function blobToCanvas(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        c.getContext('2d').drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(c);
      };
      img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
  }

  function guessNameFromURL(url) {
    try {
      const u = new URL(url, location.href);
      const base = (u.pathname.split('/').pop() || 'image').split('?')[0].split('#')[0];
      const noExt = base.replace(/\.[a-z0-9]+$/i, '');
      return noExt || 'image';
    } catch { return 'image'; }
  }
  function guessMimeFromURL(url) {
    const ext = (url.split('.').pop() || '').toLowerCase().split('?')[0];
    if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
    if (ext === 'png') return 'image/png';
    if (ext === 'webp') return 'image/webp';
    return '';
  }

  // =========================
  // Resize math
  // =========================
  function computeDrawParams(sw, sh, dw, dh, mode) {
    if (mode === 'stretch') return { sx: 0, sy: 0, sw, sh, dx: 0, dy: 0, dw, dh };
    const sr = sw / sh, dr = dw / dh;

    if (mode === 'contain') {
      let w, h;
      if (sr > dr) { w = dw; h = Math.round(dw / sr); }
      else { h = dh; w = Math.round(dh * sr); }
      const dx = Math.round((dw - w) / 2), dy = Math.round((dh - h) / 2);
      return { sx: 0, sy: 0, sw, sh, dx, dy, dw: w, dh: h };
    }

    // cover
    let cw, ch, cx, cy;
    if (sr > dr) { ch = sh; cw = Math.round(ch * dr); cx = Math.round((sw - cw) / 2); cy = 0; }
    else { cw = sw; ch = Math.round(cw / dr); cx = 0; cy = Math.round((sh - ch) / 2); }
    return { sx: cx, sy: cy, sw: cw, sh: ch, dx: 0, dy: 0, dw, dh };
  }

  // =========================
  // Filename templating
  // =========================
  function formatFilename(tpl, baseName, w, h, ext) {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const tokens = {
      '{name}': sanitize(baseName || 'image'),
      '{w}': String(w),
      '{h}': String(h),
      '{ext}': ext,
      '{ts}': String(Math.floor(now.getTime() / 1000)),
      '{YYYY}': String(now.getFullYear()),
      '{MM}': pad(now.getMonth() + 1),
      '{DD}': pad(now.getDate()),
      '{hh}': pad(now.getHours()),
      '{mm}': pad(now.getMinutes()),
      '{ss}': pad(now.getSeconds()),
      '{site}': sanitize(location.host || 'site'),
      '{title}': sanitize(document.title || 'untitled')
    };
    let out = tpl;
    for (const [k, v] of Object.entries(tokens)) out = out.split(k).join(v);
    return out;
  }
  function sanitize(s) {
    return (s || '').replace(/[\\/:*?"<>|]+/g, '_').replace(/\s+/g, ' ').trim();
  }

  // =========================
  // Core: process + preview/download (blob-based)
  // =========================
  async function processCurrentImage(doDownload) {
    const img = state.selectedImg || state.lastHoverImg;
    if (!img) return;
    const o = state.options;

    try {
      const src = img.currentSrc || img.src || img.dataset?.src || img.getAttribute('src');
      const { bmp, name } = await loadBitmapFromURL(src);

      const canvas = document.createElement('canvas');
      canvas.width = o.width; canvas.height = o.height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';

      if (o.mode === 'contain') { ctx.fillStyle = o.bgColor || '#000'; ctx.fillRect(0, 0, canvas.width, canvas.height); }

      const p = computeDrawParams(
        bmp.width || bmp.canvas?.width || canvas.width,
        bmp.height || bmp.canvas?.height || canvas.height,
        canvas.width, canvas.height, o.mode
      );
      ctx.drawImage(bmp, p.sx, p.sy, p.sw, p.sh, p.dx, p.dy, p.dw, p.dh);

      const ext = o.format === 'image/png' ? 'png' : (o.format === 'image/webp' ? 'webp' : 'jpg');
      const outBase = formatFilename(o.filenameTpl || DEFAULTS.filenameTpl, name, o.width, o.height, ext);
      const fileName = `${outBase}.${ext}`;

      const blob = await new Promise(res => canvas.toBlob(res, o.format, o.format === 'image/png' ? undefined : o.quality));
      if (!blob) throw new Error('Failed to generate output blob');
      const blobURL = URL.createObjectURL(blob);

      // persist last-used format aggressively
      saveLastFormat(o.format);

      if (doDownload) {
        const a = document.createElement('a');
        a.href = blobURL; a.download = fileName;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(blobURL), 5000);
      } else {
        const w = window.open('about:blank', '_blank', 'noopener');
        if (w && w.document) {
          w.document.title = fileName;
          w.document.body.style.margin = '0';
          const imgEl = w.document.createElement('img');
          imgEl.src = blobURL;
          imgEl.style.display = 'block';
          imgEl.style.maxWidth = '100%';
          imgEl.style.maxHeight = '100vh';
          w.document.body.appendChild(imgEl);
          w.addEventListener('unload', () => URL.revokeObjectURL(blobURL));
        } else {
          GM_openInTab(blobURL, { active: true, insert: true });
        }
      }
    } catch (err) {
      console.error('[Universal Image Resizer] Error:', err);
      alert('Image resize failed:\n' + (err?.message || err));
    }
  }

  // =========================
  // Hover + Right-Click bindings (unchanged)
  // =========================
  function bindHoverForImages(root = document) {
    root.querySelectorAll('img').forEach(img => {
      if (img.__uirdBound) return;
      img.__uirdBound = true;

      img.addEventListener('mouseenter', () => {
        if (!state.options.showHoverChip) return;
        const r = img.getBoundingClientRect();
        if (r.width < state.options.minImgEdge && r.height < state.options.minImgEdge) return;
        state.selectedImg = img; state.lastHoverImg = img;
        positionChipFor(img);
      });
      img.addEventListener('mouseleave', () => { scheduleClearSelection(); });

      // R to open panel
      img.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') { state.selectedImg = img; state.lastHoverImg = img; openPanel(); }
      });
      img.tabIndex = img.tabIndex || 0;

      // Alt+RightClick (default) or plain RightClick
      img.addEventListener('contextmenu', (e) => {
        const wantAlt = state.options.useAltRightClick;
        const trigger = wantAlt ? e.altKey : true;
        if (trigger) {
          e.preventDefault();
          state.selectedImg = img; state.lastHoverImg = img;
          openPanel();
        }
      });

      const recalc = () => state.selectedImg === img && positionChipFor(img);
      const debouncedRecalc = debounce(recalc, 100);

      addEventListener('scroll', debouncedRecalc, { passive: true });
      addEventListener('resize', debouncedRecalc);
    });
  }

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  const mo = new MutationObserver(muts => {
    for (const m of muts) {
      m.addedNodes && m.addedNodes.forEach(n => {
        if (n.nodeType === 1) {
          if (n.tagName === 'IMG') bindHoverForImages(n.parentNode || document);
          else bindHoverForImages(n);
        }
      });
    }
  });

  function init() {
    ensureChip();
    bindHoverForImages(document);
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') init();
  else addEventListener('DOMContentLoaded', init);

  // =========================
  // Dropdown helpers
  // =========================
  function makeDropdown(anchorBtn, contentBuilder) {
    // close any open first
    document.querySelectorAll('.uird-dd').forEach(d => d.remove());
    const wrap = anchorBtn.closest('.uird-dd-wrap') || anchorBtn.parentNode;
    const dd = h('div', { class: 'uird-dd' }, contentBuilder(() => dd.remove()));
    wrap.appendChild(dd);

    const onDoc = (e) => {
      if (!dd.contains(e.target) && !anchorBtn.contains(e.target)) {
        dd.remove(); document.removeEventListener('mousedown', onDoc);
      }
    };
    document.addEventListener('mousedown', onDoc);
    const onKey = (e) => { if (e.key === 'Escape') { dd.remove(); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
  }
  function button(text, onclick) { return h('button', { onclick }, text); }

})();
