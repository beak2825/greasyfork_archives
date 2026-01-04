// ==UserScript==
// @name         TesterTV_ScrollButtons
// @namespace    https://greasyfork.org/ru/scripts/482232-testertv-scrollbuttons
// @version      2025.09.16
// @description  Quick scroll buttons that keep the same on-screen size and the same distance from bottom/sides while zooming.
// @license      GPL-3.0-or-later
// @author       TesterTV
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/482232/TesterTV_ScrollButtons.user.js
// @updateURL https://update.greasyfork.org/scripts/482232/TesterTV_ScrollButtons.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const isIframe = window !== window.top;

  // ====== Constants / Defaults
  const BTN_SIZE = '50px';
  const FONT_SIZE = '50px';
  // Gaps are in CSS px at the moment the script loads (we'll keep them visually constant across zoom)
  const GAP_SIDE = '0px';
  const GAP_BOTTOM = '6px';

  // Defaults für speicherbare Abstände (aus obigen Konstanten)
  const DEF_SIDE_GAP_PX   = parseFloat(GAP_SIDE)   || 0;
  const DEF_BOTTOM_GAP_PX = parseFloat(GAP_BOTTOM) || 0;

  const DEF_SIDE_OPT = '0';    // 0=right,1=left,2=disable
  const DEF_BOTTOM_OPT = '0';  // 0=enable,1=disable
  const DEF_SIDE_SLIDER = '42';  // %
  const DEF_BOTTOM_SLIDER = '50'; // %

  const Z_TOPSIDE = '9996';
  const Z_BOTHSIDE = '9998';
  const Z_BOTTOM = '9999';
  const Z_PANEL = '10000';

  // ====== Styles
  const css = `
    .scroll-btn {
      height:${BTN_SIZE}; width:${BTN_SIZE}; font-size:${FONT_SIZE};
      position:fixed; background:transparent; border:none; outline:none;
      opacity:.05; cursor:pointer; user-select:none;
      transform-origin:center; will-change:transform; /* zoom-fix base */
    }
    .scroll-btn:hover { opacity:1 }
    #TopSideButton { z-index:${Z_TOPSIDE}; }
    #BottomSideButton { z-index:${Z_BOTHSIDE}; }
    #BottomButton { z-index:${Z_BOTTOM}; transform:translate(-50%, 0); }
    #OptionPanel {
      position:fixed; top:50%; left:50%; transform:translate(-50%, -50%);
      background:#303236; color:#fff; padding:10px; border:1px solid grey;
      z-index:${Z_PANEL}; font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
    }
    #OptionPanel .title { font-weight:bold; text-decoration:underline; font-size:20px; margin-bottom:6px; display:block; }
    #OptionPanel .row { margin:6px 0; display:flex; align-items:center; gap:6px; }
    #OptionPanel label { font-size:15px; margin-right:6px; white-space:nowrap; }
    #OptionPanel select { font-size:15px; }
    #OptionPanel input[type=range] {
      width:140px; background:#74e3ff; border:none; height:5px; outline:none; appearance:none;
    }
    #OptionPanel .val { min-width:48px; text-align:right; opacity:.9; }
    #DonateBtn {
      width:180px; height:25px; font-size:10px; color:#303236; background:#fff;
      border:1px solid grey; position:relative; left:50%; transform:translateX(-50%); margin-top:8px;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.documentElement.appendChild(style);

  // ====== Helpers
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const makeBtn = (id, text, onClick) => {
    const b = document.createElement('button');
    b.id = id;
    b.className = 'scroll-btn';
    b.textContent = text;
    document.body.appendChild(b);
    b.addEventListener('click', onClick);
    if (isIframe) b.style.display = 'none';
    return b;
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'auto' });
  const scrollToBottom = () => window.scrollTo({ top: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight), behavior: 'auto' });

  // ====== Create Buttons
  const TopSideButton = makeBtn('TopSideButton', '⬆️', scrollToTop);
  const BottomSideButton = makeBtn('BottomSideButton', '⬇️', scrollToBottom);
  const BottomButton = makeBtn('BottomButton', '⬆️', scrollToTop);

  // ====== Load settings
  let [sideOpt, sideSlider, bottomOpt, bottomSlider, sideGapPx, bottomGapPx] = await Promise.all([
    GM.getValue('SideButtonsOption',        DEF_SIDE_OPT),
    GM.getValue('SideButtonsSliderOption',  DEF_SIDE_SLIDER),
    GM.getValue('BottomButtonOption',       DEF_BOTTOM_OPT),
    GM.getValue('BottomButtonSliderOption', DEF_BOTTOM_SLIDER),
    // Neu: Abstände (in px)
    GM.getValue('SideGapPx',   DEF_SIDE_GAP_PX),
    GM.getValue('BottomGapPx', DEF_BOTTOM_GAP_PX),
  ]);

  // Coerce / vorbereiten
  sideOpt      = String(sideOpt ?? DEF_SIDE_OPT);
  bottomOpt    = String(bottomOpt ?? DEF_BOTTOM_OPT);
  sideSlider   = String(sideSlider ?? DEF_SIDE_SLIDER);
  bottomSlider = String(bottomSlider ?? DEF_BOTTOM_SLIDER);

  // Basis-Pixelwerte (werden über Slider geändert und gespeichert)
  let SIDE_GAP_BASE_PX   = Number(sideGapPx   ?? DEF_SIDE_GAP_PX)   || 0;
  let BOTTOM_GAP_BASE_PX = Number(bottomGapPx ?? DEF_BOTTOM_GAP_PX) || 0;

  // ====== Zoom + gap compensation
  // Keep button size and gaps visually the same across page zoom by counter-scaling and adjusting px gaps
  const BASE_DPR = window.devicePixelRatio || 1;
  let lastDPR = BASE_DPR;

  function gapCssPx(basePx) {
    const dpr = window.devicePixelRatio || 1;
    // Convert desired base CSS px to current CSS px so that device-physical gap stays constant
    const cssPx = (basePx * BASE_DPR) / dpr;
    return cssPx + 'px';
  }

  function updateTransformOrigins() {
    // Side buttons: anchor scaling to the side so horizontal distance stays the same
    if (sideOpt === '1') { // left
      TopSideButton.style.transformOrigin = 'left center';
      BottomSideButton.style.transformOrigin = 'left center';
    } else { // right (default)
      TopSideButton.style.transformOrigin = 'right center';
      BottomSideButton.style.transformOrigin = 'right center';
    }
    // Bottom button: anchor scaling to bottom so bottom distance stays the same
    BottomButton.style.transformOrigin = 'center bottom';
  }

  function applyZoomFix() {
    const currentDPR = window.devicePixelRatio || 1;
    lastDPR = currentDPR;
    const s = BASE_DPR / currentDPR; // counter-scale by zoom changes

    // Scale buttons (size stays constant on screen)
    TopSideButton.style.transform = `scale(${s})`;
    BottomSideButton.style.transform = `scale(${s})`;
    BottomButton.style.transform = `translate(-50%, 0) scale(${s})`;
  }

  // ====== Apply settings to UI
  function applySideButtons() {
    if (isIframe) {
      TopSideButton.style.display = 'none';
      BottomSideButton.style.display = 'none';
      return;
    }

    const disabled = sideOpt === '2';
    TopSideButton.style.display = disabled ? 'none' : 'block';
    BottomSideButton.style.display = disabled ? 'none' : 'block';
    if (disabled) return;

    // Vertical positions
    const v = clamp(Number(sideSlider), 4, 96);
    TopSideButton.style.top = v + '%';
    BottomSideButton.style.top = (100 - v) + '%';

    // Horizontal positions + gap compensation
    const sideGap = gapCssPx(SIDE_GAP_BASE_PX);
    if (sideOpt === '1') {
      TopSideButton.style.left = sideGap;
      BottomSideButton.style.left = sideGap;
      TopSideButton.style.right = '';
      BottomSideButton.style.right = '';
    } else {
      TopSideButton.style.right = sideGap;
      BottomSideButton.style.right = sideGap;
      TopSideButton.style.left = '';
      BottomSideButton.style.left = '';
    }

    updateTransformOrigins();
  }

  function applyBottomButton() {
    if (isIframe) {
      BottomButton.style.display = 'none';
      return;
    }
    const enabled = bottomOpt !== '1';
    BottomButton.style.display = enabled ? 'block' : 'none';

    // Bottom gap compensation
    BottomButton.style.bottom = gapCssPx(BOTTOM_GAP_BASE_PX);

    // Horizontal % with center correction
    const x = clamp(Number(bottomSlider), 0, 95);
    BottomButton.style.left = x + '%';

    updateTransformOrigins();
  }

  function updateButtonsForMediaOrFullscreen() {
    const isMediaUrl = /\.(?:jpg|jpeg|png|gif|svg|webp|apng|webm|mp4|mp3|wav|ogg)(?:[#?].*)?$/i
      .test(location.pathname + location.search + location.hash);
    const isFullScreen = !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
    const vis = (isMediaUrl || isFullScreen) ? 'hidden' : 'visible';
    [TopSideButton, BottomSideButton, BottomButton].forEach(b => b.style.visibility = vis);
  }

  // Initial apply
  applySideButtons();
  applyBottomButton();
  applyZoomFix();
  updateButtonsForMediaOrFullscreen();

  // ====== Keep in sync on zoom/resize/fullscreen
  const onLayoutChange = () => {
    applySideButtons();      // recalculates side gap and origin
    applyBottomButton();     // recalculates bottom gap and origin
    applyZoomFix();          // reapplies counter-scale
    updateButtonsForMediaOrFullscreen();
  };

  window.addEventListener('resize', onLayoutChange, { passive: true });
  window.addEventListener('orientationchange', onLayoutChange, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', onLayoutChange, { passive: true });
    window.visualViewport.addEventListener('scroll', onLayoutChange, { passive: true }); // pinch-zoom panning
  }
  // Fallback polling for DPR changes
  setInterval(() => {
    const dpr = window.devicePixelRatio || 1;
    if (dpr !== lastDPR) onLayoutChange();
    updateButtonsForMediaOrFullscreen();
  }, 500);

  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange']
    .forEach(evt => document.addEventListener(evt, updateButtonsForMediaOrFullscreen));

  // ====== Options Panel
  function showOptionsPanel(e) {
    e.preventDefault();

    // Remove any existing panel
    const existing = document.getElementById('OptionPanel');
    if (existing) existing.remove();

    const panel = document.createElement('div');
    panel.id = 'OptionPanel';
    panel.innerHTML = `
      <span class="title">Options</span>

      <div class="row">
        <label>Side buttons:</label>
        <select id="SidePos">
          <option value="0">Right</option>
          <option value="1">Left</option>
          <option value="2">Disable</option>
        </select>
      </div>

      <div class="row">
        <label>Bottom button:</label>
        <select id="BottomVis">
          <option value="0">Enable</option>
          <option value="1">Disable</option>
        </select>
      </div>

      <div class="row">
        <label>⬆️⬇️ position:</label>
        <input id="SideV" type="range" min="4" max="96" step="1">
        <span class="val" id="SideVVal"></span>
      </div>

      <div class="row">
        <label>⬆️ position:</label>
        <input id="BottomH" type="range" min="0" max="95" step="1">
        <span class="val" id="BottomHVal"></span>
      </div>

      <hr style="border:none; border-top:1px solid #555; opacity:.6; margin:8px 0;">

      <div class="row">
        <label>Side distance (px):</label>
        <input id="SideGap" type="range" min="0" max="200" step="1">
        <span class="val" id="SideGapVal"></span>
      </div>

      <div class="row">
        <label>Bottom distance (px):</label>
        <input id="BottomGap" type="range" min="0" max="200" step="1">
        <span class="val" id="BottomGapVal"></span>
      </div>

      <button id="DonateBtn">💳Please support me!🤗</button>
    `;
    document.body.appendChild(panel);

    // Init fields
    const ddSide = panel.querySelector('#SidePos');
    const ddBottom = panel.querySelector('#BottomVis');
    const rngSide = panel.querySelector('#SideV');
    const rngBottom = panel.querySelector('#BottomH');

    const rngSideGap = panel.querySelector('#SideGap');
    const rngBottomGap = panel.querySelector('#BottomGap');

    const sideGapVal = panel.querySelector('#SideGapVal');
    const bottomGapVal = panel.querySelector('#BottomGapVal');
    const sideVVal = panel.querySelector('#SideVVal');
    const bottomHVal = panel.querySelector('#BottomHVal');

    ddSide.value = sideOpt;
    ddBottom.value = bottomOpt;

    rngSide.value = clamp(Number(sideSlider), 4, 96);
    sideVVal.textContent = `${rngSide.value}%`;

    rngBottom.value = clamp(Number(bottomSlider), 0, 95);
    bottomHVal.textContent = `${rngBottom.value}%`;

    // Startwerte + Labels der neuen Abstands-Slider
    rngSideGap.value = clamp(Math.round(SIDE_GAP_BASE_PX), 0, 200);
    sideGapVal.textContent = `${rngSideGap.value} px`;

    rngBottomGap.value = clamp(Math.round(BOTTOM_GAP_BASE_PX), 0, 200);
    bottomGapVal.textContent = `${rngBottomGap.value} px`;

    // Enforce "at least one visible"
    function wouldHideAll(nextSideOpt = ddSide.value, nextBottomOpt = ddBottom.value) {
      return nextSideOpt === '2' && nextBottomOpt === '1';
    }

    ddSide.addEventListener('change', async () => {
      const next = ddSide.value;
      if (wouldHideAll(next, ddBottom.value)) {
        alert("All buttons can't be invisible! 🫠");
        ddSide.value = sideOpt;
        return;
      }
      sideOpt = next;
      await GM.setValue('SideButtonsOption', sideOpt);
      applySideButtons();
      applyZoomFix();
    });

    ddBottom.addEventListener('change', async () => {
      const next = ddBottom.value;
      if (wouldHideAll(ddSide.value, next)) {
        alert("All buttons can't be invisible! 🫠");
        ddBottom.value = bottomOpt;
        return;
      }
      bottomOpt = next;
      await GM.setValue('BottomButtonOption', bottomOpt);
      applyBottomButton();
      applyZoomFix();
    });

    rngSide.addEventListener('input', async () => {
      sideSlider = String(rngSide.value);
      sideVVal.textContent = `${rngSide.value}%`;
      await GM.setValue('SideButtonsSliderOption', sideSlider);
      applySideButtons();
    });

    rngBottom.addEventListener('input', async () => {
      bottomSlider = String(rngBottom.value);
      bottomHVal.textContent = `${rngBottom.value}%`;
      await GM.setValue('BottomButtonSliderOption', bottomSlider);
      applyBottomButton();
    });

    // Abstands-Slider speichern + anwenden
    rngSideGap.addEventListener('input', async () => {
      SIDE_GAP_BASE_PX = Number(rngSideGap.value);
      sideGapVal.textContent = `${SIDE_GAP_BASE_PX} px`;
      await GM.setValue('SideGapPx', SIDE_GAP_BASE_PX);
      applySideButtons();
    });

    rngBottomGap.addEventListener('input', async () => {
      BOTTOM_GAP_BASE_PX = Number(rngBottomGap.value);
      bottomGapVal.textContent = `${BOTTOM_GAP_BASE_PX} px`;
      await GM.setValue('BottomGapPx', BOTTOM_GAP_BASE_PX);
      applyBottomButton();
    });

    panel.querySelector('#DonateBtn').addEventListener('click', () => {
      GM_openInTab('https://greasyfork.org/ru/scripts/482232-testertv-scrollbuttons');
    });

    // Close panel when clicking outside
    const onDocClick = (evt) => {
      if (!panel.contains(evt.target)) {
        panel.remove();
        document.removeEventListener('click', onDocClick, true);
      }
    };
    setTimeout(() => document.addEventListener('click', onDocClick, true), 0);
  }

  // Open panel on right-click of any button
  [TopSideButton, BottomSideButton, BottomButton].forEach(b => {
    b.addEventListener('contextmenu', showOptionsPanel);
  });

})();