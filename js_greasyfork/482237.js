// ==UserScript==
// @name         TesterTV_YouTube_Effects
// @namespace    https://greasyfork.org/ru/scripts/482237-testertv-youtube-effects
// @version      2025.08.30
// @description  Add video effects with persistent sliders
// @license      GPL-3.0-or-later
// @author       TesterTV
// @match        https://www.youtube.com/*
// @match        https://m.youtube.com/*
// @match        https://music.youtube.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/482237/TesterTV_YouTube_Effects.user.js
// @updateURL https://update.greasyfork.org/scripts/482237/TesterTV_YouTube_Effects.meta.js
// ==/UserScript==

(() => {
  'use strict';

  if (window.top !== window) return; // no iframes

  const STORAGE_KEY = 'TesterTV_YouTube_Effects_state_v2';

  const FILTERS = [
    { id: 'blur',       css: 'blur',       label: 'Blur',         min: 0,    max: 50,   step: 1,   default: 0,   unit: 'px'  },
    { id: 'brightness', css: 'brightness', label: 'Brightness',   min: 0,    max: 200,  step: 1,   default: 100, unit: '%'   },
    { id: 'contrast',   css: 'contrast',   label: 'Contrast',     min: 0,    max: 200,  step: 1,   default: 100, unit: '%'   },
    { id: 'grayscale',  css: 'grayscale',  label: 'Grayscale',    min: 0,    max: 100,  step: 1,   default: 0,   unit: '%'   },
    { id: 'hue',        css: 'hue-rotate', label: 'Hue Rotate',   min: 0,    max: 360,  step: 1,   default: 0,   unit: 'deg' },
    { id: 'invert',     css: 'invert',     label: 'Invert Color', min: 0,    max: 100,  step: 1,   default: 0,   unit: '%'   },
    { id: 'saturate',   css: 'saturate',   label: 'Saturation',   min: 0,    max: 200,  step: 1,   default: 100, unit: '%'   },
    { id: 'sepia',      css: 'sepia',      label: 'Sepia',        min: 0,    max: 100,  step: 1,   default: 0,   unit: '%'   },
  ];

  const TRANSFORMS = [
    { id: 'rotate',  css: 'rotate',     label: 'Rotation',   min: 0,     max: 360,  step: 1,   default: 0,  unit: 'deg' },
    { id: 'tx',      css: 'translateX', label: 'TranslateX', min: -7680, max: 7680, step: 1,   default: 0,  unit: 'px'  },
    { id: 'ty',      css: 'translateY', label: 'TranslateY', min: -4320, max: 4320, step: 1,   default: 0,  unit: 'px'  },
    { id: 'scale',   css: 'scale',      label: 'Scale',      min: 1,     max: 10,   step: 0.1, default: 1,  unit: ''    },
    { id: 'scaleX',  css: 'scaleX',     label: 'ScaleX',     min: -1,    max: 10,   step: 0.1, default: 1,  unit: ''    },
    { id: 'scaleY',  css: 'scaleY',     label: 'ScaleY',     min: -1,    max: 10,   step: 0.1, default: 1,  unit: ''    },
  ];

  const ALL = [...FILTERS, ...TRANSFORMS];
  const DEFAULTS = Object.fromEntries(ALL.map(s => [s.id, s.default]));
  const state = loadState();
  ensureStyle();

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return { ...DEFAULTS, ...saved };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function buildCSS() {
    const filter = FILTERS.map(f => `${f.css}(${state[f.id]}${f.unit})`).join(' ');
    const transform = TRANSFORMS.map(t => `${t.css}(${state[t.id]}${t.unit})`).join(' ');
    // Apply to all <video> elements; !important to win over site styles
    return `
      video {
        filter: ${filter} !important;
        transform: ${transform} !important;
        transform-origin: center center !important;
      }
    `;
  }

  function ensureStyle() {
    let s = document.getElementById('ttv-effects-style');
    if (!s) {
      s = document.createElement('style');
      s.id = 'ttv-effects-style';
      document.head.appendChild(s);
    }
    s.textContent = buildCSS();
  }

  function createSliderRow(cfg) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:10px;margin:6px 0;';

    const label = document.createElement('label');
    label.textContent = cfg.label;
    label.style.cssText = 'width:110px;color:#fff;';
    label.htmlFor = `ttv-${cfg.id}`;

    const input = document.createElement('input');
    input.type = 'range';
    input.id = `ttv-${cfg.id}`;
    input.min = cfg.min;
    input.max = cfg.max;
    input.step = cfg.step;
    input.value = state[cfg.id];
    input.style.cssText = 'flex:1;';

    input.addEventListener('input', () => {
      state[cfg.id] = Number(input.value);
      ensureStyle();
      saveState();
    });

    row.append(label, input);
    return row;
  }

  function createPanel() {
    if (document.getElementById('ttv-effects-panel')) {
      return document.getElementById('ttv-effects-panel');
    }

    const panel = document.createElement('div');
    panel.id = 'ttv-effects-panel';
    panel.style.cssText = [
      'position:fixed',
      'top:50%',
      'left:50%',
      'transform:translate(-50%,-50%)',
      'background:rgba(0,0,0,.75)',
      'border:1px solid #555',
      'border-radius:8px',
      'padding:12px 14px',
      'z-index:999999',
      'color:#fff',
      'min-width:380px',
      'max-width:520px',
      'backdrop-filter:blur(3px)',
    ].join(';');

    const title = document.createElement('div');
    title.textContent = 'Effects';
    title.style.cssText = 'font-weight:700;font-size:18px;margin-bottom:8px;text-decoration:underline;';
    panel.appendChild(title);

    // Sliders
    ALL.forEach(cfg => panel.appendChild(createSliderRow(cfg)));

    // Buttons
    const btns = document.createElement('div');
    btns.style.cssText = 'display:flex;gap:10px;justify-content:center;margin-top:12px;';

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.cssText = 'padding:6px 12px;border:1px solid #888;border-radius:6px;background:#fff;color:#222;cursor:pointer;';
    resetBtn.addEventListener('click', () => {
      Object.assign(state, DEFAULTS);
      panel.querySelectorAll('input[type="range"]').forEach(inp => {
        const id = inp.id.replace('ttv-', '');
        inp.value = state[id];
      });
      ensureStyle();
      saveState();
    });

    const donateBtn = document.createElement('button');
    donateBtn.textContent = '💳 Please support me';
    donateBtn.style.cssText = 'padding:6px 12px;border:1px solid #888;border-radius:6px;background:#fff;color:#222;cursor:pointer;';
    donateBtn.addEventListener('click', () => {
      if (typeof GM_openInTab === 'function') {
        GM_openInTab('https://greasyfork.org/ru/scripts/482237-testertv-youtube-effects');
      } else {
        window.open('https://greasyfork.org/ru/scripts/482237-testertv-youtube-effects', '_blank');
      }
    });

    btns.append(resetBtn, donateBtn);
    panel.appendChild(btns);

    panel.style.display = 'none';
    document.body.appendChild(panel);

    // Hide when clicking outside
    document.addEventListener('click', (e) => {
      const btn = document.getElementById('ttv-effects-btn');
      if (!panel.contains(e.target) && e.target !== btn) panel.style.display = 'none';
    }, { capture: true });

    return panel;
  }

function addButton() {
  const right = document.querySelector('.ytp-right-controls');
  const chrome = right && right.parentElement; // .ytp-chrome-controls
  if (!chrome || !right || document.getElementById('ttv-effects-btn')) return;

  const btn = document.createElement('button');
  btn.id = 'ttv-effects-btn';
  btn.className = 'ytp-button';
  btn.textContent = '🎛️';
  btn.title = 'Video effects';
  btn.setAttribute('aria-label', 'Video effects');
  btn.style.fontSize = '20px';
  btn.style.borderRadius = '5%'; // override any previous '6px'

  Object.assign(btn.style, {
    background: 'none',
    border: '2px solid transparent',
    color: 'inherit',
    margin: '0 8px',
    width: '36px',
    height: '36px',
    boxSizing: 'border-box',     // border doesn't change size
    display: 'inline-block',     // match YT buttons
    verticalAlign: 'middle',
    lineHeight: '36px',          // centers emoji inside
    textAlign: 'center',
    cursor: 'pointer',
    alignSelf: 'center',         // KEY: center within the flex parent
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const panel = createPanel();
    panel.style.display = (!panel.style.display || panel.style.display === 'none') ? 'block' : 'none';
    btn.style.borderColor = '#74e3ff';
    setTimeout(() => (btn.style.borderColor = 'transparent'), 200);
  });
  btn.addEventListener('mouseenter', () => (btn.style.borderColor = '#74e3ff'));
  btn.addEventListener('mouseleave', () => (btn.style.borderColor = 'transparent'));

  // Left of the entire right-controls cluster
  chrome.insertBefore(btn, right);
}
  // Bootstrap
  function start() {
    ensureStyle();     // Apply saved values immediately
    addButton();       // Try once now
    setInterval(addButton, 1000); // Handle SPA navigation / player reloads
  }

  start();
})();