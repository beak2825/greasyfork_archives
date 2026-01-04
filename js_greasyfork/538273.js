// ==UserScript==
// @name         Indeed Column Tweaker
// @namespace    https://greasyfork.org/en/users/50935-neonhd
// @version      0.8.2
// @author       Prismaris
// @description  Enables grid customization of Indeed's job search results (requires matching userstyle).
// @match        https://*.indeed.com/*
// @match        https://*.indeed.ca/*
// @match        https://*.indeed.co.uk/*
// @match        https://*.indeed.*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538273/Indeed%20Column%20Tweaker.user.js
// @updateURL https://update.greasyfork.org/scripts/538273/Indeed%20Column%20Tweaker.meta.js
// ==/UserScript==
/* eslint-env browser */

(() => {
  'use strict';

  /* ─── limits & step ─────────────────────────────────────────────── */
  const COL_MIN = 1;
  const COL_MAX = 6;
  const STEP = 40; // px exchanged by [ / ]

  const L_MIN = 580;
  const L_MAX = 1200;
  const R_MIN = 360;
  const R_MAX = 960;

  /* ─── preset table (index 1-5) ──────────────────────────────────── */
  const PRESETS = {
    1: { cols: 1, left: 480, right: 880 },
    2: { cols: 2, left: 660, right: 720 },
    3: { cols: 3, left: 860, right: 600 },
    4: { cols: 4, left: 980, right: 480 },
    5: { cols: 5, left: 1120, right: 420 }
  };

  const STORAGE_KEY = 'indeed-column-tweaker-preset';
  const root = document.documentElement;

  /* helpers --------------------------------------------------------- */
  const isEdit = (el) =>
    ['INPUT', 'TEXTAREA'].includes(el.tagName) || el.isContentEditable;

  const clamp = (val, lo, hi) => Math.min(Math.max(val, lo), hi);
  const num = (v) => parseInt(v, 10) || 0;

  /* preset management ----------------------------------------------- */
  const savePreset = (presetKey) => {
    localStorage.setItem(STORAGE_KEY, presetKey);
  };

  const loadPreset = () => {
    const savedPreset = localStorage.getItem(STORAGE_KEY);
    if (savedPreset && PRESETS[savedPreset]) {
      const p = PRESETS[savedPreset];
      setCols(p.cols);
      setLeft(p.left);
      setRight(p.right);
    }
  };

  /* --columns-------------------------------------------------------- */
  const getCols = () =>
    clamp(+getComputedStyle(root).getPropertyValue('--cols') || 3, COL_MIN, COL_MAX);
  const setCols = (n) => root.style.setProperty('--cols', clamp(n, COL_MIN, COL_MAX));

  /* pane widths ----------------------------------------------------- */
  const getLeft = () => num(getComputedStyle(root).getPropertyValue('--pane-w') || '800');
  const getRight = () => num(getComputedStyle(root).getPropertyValue('--pane-r') || '640');

  const setLeft = (px) =>
    root.style.setProperty('--pane-w', `${clamp(px, L_MIN, L_MAX)}px`);
  const setRight = (px) =>
    root.style.setProperty('--pane-r', `${clamp(px, R_MIN, R_MAX)}px`);

  /* see-saw swap ---------------------------------------------------- */
  const sway = (delta) => {
    let L = getLeft() + delta;
    let R = getRight() - delta;

    if (L < L_MIN) { R -= L_MIN - L; L = L_MIN; }
    if (L > L_MAX) { R -= L - L_MAX; L = L_MAX; }
    if (R < R_MIN) { L -= R_MIN - R; R = R_MIN; }
    if (R > R_MAX) { L -= R - R_MAX; R = R_MAX; }

    setLeft(L);
    setRight(L_MIN <= L && L <= L_MAX ? R : getRight());
  };

  /* keyboard -------------------------------------------------------- */
  window.addEventListener(
    'keydown',
    (e) => {
      if (isEdit(e.target)) return;

      const { key } = e;
      let ok = true;

      if (key >= '1' && key <= '5') {
        const p = PRESETS[key];
        setCols(p.cols);
        setLeft(p.left);
        setRight(p.right);
        savePreset(key);
      } else if (key === '+' || key === '=') {
        setCols(getCols() + 1);
      } else if (key === '-') {
        setCols(getCols() - 1);
      } else if (key === '[') {
        sway(-STEP);
      } else if (key === ']') {
        sway(+STEP);
      } else {
        ok = false;
      }

      if (ok) e.preventDefault();
    },
    true
  );

  /* optional on-screen – / + buttons (unchanged) -------------------- */
  const ui = document.createElement('div');
  ui.style.cssText =
    'position:fixed;bottom:1rem;right:1rem;display:flex;gap:.5rem;z-index:10000;';
  const btn = (t) => {
    const b = document.createElement('button');
    b.textContent = t;
    b.style.cssText =
      'width:32px;height:32px;border-radius:50%;background:#222;color:#fff;' +
      'border:1px solid #666;cursor:pointer;';
    return b;
  };
  const minus = btn('–');
  const plus = btn('+');
  ui.append(minus, plus);
  document.body.append(ui);
  minus.addEventListener('click', () => setCols(getCols() - 1));
  plus .addEventListener('click', () => setCols(getCols() + 1));

  // Apply saved preset on script load
  loadPreset();
})();




