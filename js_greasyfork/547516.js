// ==UserScript==
// @name        Kick & YouTube Night Boost
// @name:tr     Kick & YouTube Gece Görüş
// @description:tr  Gerçek switch görünümü. Beklemede yarı şeffaf, hover'da tam görünür. OFF: değişiklik yok, ON: gamma=0.7.
// @description  Real switch UI. Faded when idle, full on hover. OFF: no change, ON: gamma=0.7.
// @namespace   http://tampermonkey.net/
// @version     1.1
// @author      baris
// @match       *://*.kick.com/*
// @match       *://kick.com/*
// @match       *://*.youtube.com/*
// @match       *://youtube.com/*
// @match       *://youtu.be/*
// @grant       none
// @license     GNU GPLv3
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/547516/Kick%20%20YouTube%20Night%20Boost.user.js
// @updateURL https://update.greasyfork.org/scripts/547516/Kick%20%20YouTube%20Night%20Boost.meta.js
// ==/UserScript==

(() => {
  const STORAGE_KEY = 'nb.switch.gamma.enabled';
  const DEF_ENABLED = false;     // OFF by default
  const GAMMA_EXP   = 0.7;       // ON exponent
  const UI_BOTTOM_PX = 80;
  const UI_FALLBACK_LEFT = 340;  // if audio widget not found
  const SVG_ID = 'nb-switch-gamma-svg';
  const FILTER_ID = 'nb-switch-gamma-filter';
  const UI_HOST_ID = 'nb-switch-gamma-toggle-host';

  let enabled = loadEnabled();

  function loadEnabled() {
    try { const r = localStorage.getItem(STORAGE_KEY); if (r != null) return JSON.parse(r); } catch {}
    return DEF_ENABLED;
  }
  function saveEnabled() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(enabled)); } catch {}
  }

  // Shadow DOM UI (no site CSS conflicts)
  function ensureUI() {
    if (document.getElementById(UI_HOST_ID)) return;

    const host = document.createElement('div');
    host.id = UI_HOST_ID;
    host.style.position = 'fixed';
    host.style.bottom = UI_BOTTOM_PX + 'px';
    host.style.left = guessLeftPosition() + 'px';
    host.style.zIndex = '2147483647';
    host.style.pointerEvents = 'auto';
    host.style.userSelect = 'none';
    document.body.appendChild(host);

    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `
      <style>
        :host { all: initial; }
        .wrap {
          all: unset;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(0,0,0,0.85);
          color: #fff;
          font: 11px/1 monospace;
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.35);
          box-shadow: 0 2px 10px rgba(0,0,0,0.6);
          cursor: pointer;
          opacity: .12;                   /* idle: slightly transparent */
          transition: opacity .25s ease, transform .1s ease;
        }
        .wrap:hover { opacity: 1; }       /* hover: fully visible */

        .switch {
          width: 44px; height: 22px;
          border-radius: 999px;
          background: ${enabled ? '#3b82f6' : '#555'};
          position: relative;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15);
          transition: background .18s ease;
        }
        .knob {
          width: 18px; height: 18px;
          border-radius: 50%;
          background: #fff;
          position: absolute; top: 2px; left: ${enabled ? '24px' : '2px'};
          transition: left .18s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,.4);
        }
        .label { margin: 0; }
      </style>
      <div class="wrap" id="wrap">
        <div class="switch" id="sw"><div class="knob" id="knob"></div></div>
        <div class="label">Gamma 0.7</div>
      </div>
    `;

    const wrap = root.getElementById('wrap');
    const sw   = root.getElementById('sw');
    const knob = root.getElementById('knob');

    function render() {
      sw.style.background = enabled ? '#3b82f6' : '#555';
      knob.style.left = enabled ? '24px' : '2px';
    }
    function toggle(on) {
      enabled = typeof on === 'boolean' ? on : !enabled;
      saveEnabled();
      render();
      wrap.style.transform = 'scale(0.96)';
      setTimeout(() => wrap.style.transform = 'scale(1)', 90);
      applyToAll();
    }

    wrap.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); toggle(); });
    wrap.addEventListener('contextmenu', e => { e.preventDefault(); toggle(false); });

    // track audio widget and keep our box to its right
    setInterval(() => {
      const left = guessLeftPosition();
      if (host.style.left !== left + 'px') host.style.left = left + 'px';
    }, 1500);

    render();
  }

  // Place to the right of "Maximizer by Barış" if present
  function guessLeftPosition() {
    try {
      const allDivs = document.querySelectorAll('div');
      for (const d of allDivs) {
        const txt = d.textContent || '';
        if (txt.includes('Maximizer by Barış')) {
          const rect = d.getBoundingClientRect();
          if (rect && rect.width) return Math.max(10, Math.round(rect.left + rect.width + 16));
        }
      }
    } catch {}
    return UI_FALLBACK_LEFT;
  }

  // Global SVG gamma filter (so CSS url(#id) resolves)
  function ensureSVG() {
    if (document.getElementById(SVG_ID)) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('id', SVG_ID);
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.style.position = 'absolute';
    svg.style.left = '-9999px';
    svg.style.top = '-9999px';

    const defs   = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', FILTER_ID);

    const comp = document.createElementNS('http://www.w3.org/2000/svg', 'feComponentTransfer');
    const mk = tag => {
      const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
      n.setAttribute('type', 'gamma');
      n.setAttribute('amplitude', '1');
      n.setAttribute('offset', '0');
      n.setAttribute('exponent', String(GAMMA_EXP));
      return n;
    };
    comp.appendChild(mk('feFuncR'));
    comp.appendChild(mk('feFuncG'));
    comp.appendChild(mk('feFuncB'));
    filter.appendChild(comp);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.documentElement.appendChild(svg);
  }

  function applyToVideo(video) {
    if (!video) return;
    if (!enabled) {
      if (video.dataset.nbsPrevFilter !== undefined) {
        video.style.filter = video.dataset.nbsPrevFilter;
        delete video.dataset.nbsPrevFilter;
        delete video.dataset.nbsApplied;
      }
      return;
    }
    ensureSVG();
    if (video.dataset.nbsPrevFilter === undefined) {
      video.dataset.nbsPrevFilter = video.style.filter || '';
    }
    const base = (video.dataset.nbsPrevFilter || '').trim();
    if (!/url\(#nb-switch-gamma-filter\)/.test(base)) {
      video.style.filter = `${base} url(#${FILTER_ID})`.trim();
    } else {
      video.style.filter = base;
    }
    video.dataset.nbsApplied = '1';
  }

  function applyToAll() {
    document.querySelectorAll('video').forEach(v => applyToVideo(v));
  }

  function init() {
    if (!document.body) return;
    ensureUI();
    applyToAll();

    // watch for new video elements
    const mo = new MutationObserver(() => {
      document.querySelectorAll('video').forEach(v => applyToVideo(v));
      if (!document.getElementById(UI_HOST_ID)) ensureUI();
    });
    mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
  }

  // YouTube SPA
  function ytHooks() {
    window.addEventListener('yt-navigate-finish', () => setTimeout(init, 500));
    window.addEventListener('popstate', () => setTimeout(init, 500));
  }

  // URL change poller
  let lastURL = location.href;
  setInterval(() => {
    if (location.href !== lastURL) {
      lastURL = location.href;
      setTimeout(init, 400);
    }
  }, 800);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { init(); if (location.hostname.includes('youtube.com')) ytHooks(); }, { once: true });
  } else {
    init();
    if (location.hostname.includes('youtube.com')) ytHooks();
  }
})();
