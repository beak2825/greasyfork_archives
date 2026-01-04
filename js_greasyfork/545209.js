// ==UserScript==
// @name         Krunker Fun Pack — Full (Crosshair + Glow + Visuals)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Visual-only enhancements for Krunker.io — expanded crosshair, neon/invert, kill flash, and a configurable visible-enemy glow (on-screen only). Saves settings locally.
// @author       You
// @match        *://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545209/Krunker%20Fun%20Pack%20%E2%80%94%20Full%20%28Crosshair%20%2B%20Glow%20%2B%20Visuals%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545209/Krunker%20Fun%20Pack%20%E2%80%94%20Full%20%28Crosshair%20%2B%20Glow%20%2B%20Visuals%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* ---------------------------
     Settings storage & defaults
     --------------------------- */
  const STORAGE_KEY = 'krunkerFunPack_v1';
  const defaults = {
    // crosshair
    crossType: 'Dot',           // Dot, Circle, Star, Plus, X, Hybrid, Outlined Dot
    crossColor: '#00FF00',
    crossSize: 12,
    crossThickness: 2,
    crossGap: 4,
    crossAlpha: 1.0,

    // visuals
    neon: false,
    invert: false,
    theme: 'Default',

    // kill flash
    killFlash: false,

    // enemy glow
    glowEnabled: false,
    glowColor: '#00FFFF',
    glowStrength: 1.4,   // multiplier for opacity
    glowSize: 36,        // spread radius
    glowSampleFreq: 150, // ms, how often to run pixel sampling

    // player name for kill detection (optional)
    playerName: ''
  };

  let settings = Object.assign({}, defaults, JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'));
  function saveSettings() { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); }

  /* ---------------------------
     Helper DOM utilities
     --------------------------- */
  function $tag(name, attrs = {}, html = '') {
    const el = document.createElement(name);
    Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
    el.innerHTML = html;
    return el;
  }

  /* ---------------------------
     UI: compact draggable panel
     --------------------------- */
  const panel = $tag('div', { id: 'funpack-panel' });
  panel.style.cssText = [
    'position:fixed', 'bottom:12px', 'right:12px', 'width:200px',
    'background:rgba(8,8,10,0.9)', 'color:#fff', 'padding:8px',
    'font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif', 'font-size:12px',
    'border-radius:8px', 'z-index:9999999', 'user-select:none', 'cursor:move'
  ].join(';');

  panel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <strong>Fun Pack</strong>
      <small style="opacity:.7">v1.4</small>
    </div>

    <div style="margin-bottom:6px">
      <label style="display:block;margin-bottom:4px"><small>Crosshair</small></label>
      <select id="fp_crossType" style="width:100%; margin-bottom:6px">
        <option>Dot</option><option>Circle</option><option>Star</option>
        <option>Plus</option><option>X</option><option>Hybrid</option><option>Outlined Dot</option>
      </select>
      <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
        <input type="color" id="fp_crossColor" style="flex:0 0 40px">
        <input type="range" id="fp_crossSize" min="2" max="60" style="flex:1">
      </div>
      <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
        <input type="range" id="fp_crossThickness" min="1" max="12" style="flex:1">
        <input type="range" id="fp_crossGap" min="0" max="30" style="flex:1">
      </div>
      <label style="display:flex;gap:6px;align-items:center"><small>Alpha</small>
        <input type="range" id="fp_crossAlpha" min="0.1" max="1" step="0.05" style="flex:1">
      </label>
    </div>

    <div style="margin-bottom:6px;border-top:1px solid rgba(255,255,255,0.04);padding-top:6px">
      <label style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span>Neon Vision</span><input type="checkbox" id="fp_neon">
      </label>
      <label style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span>Invert Colors</span><input type="checkbox" id="fp_invert">
      </label>
      <label style="display:flex;justify-content:space-between;align-items:center">
        <span>Kill Flash</span><input type="checkbox" id="fp_killFlash">
      </label>
    </div>

    <div style="margin-top:6px;border-top:1px solid rgba(255,255,255,0.04);padding-top:6px">
      <label style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span><small>Visible Enemy Glow</small></span>
        <input type="checkbox" id="fp_glowEnabled">
      </label>
      <label style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
        <input type="color" id="fp_glowColor" style="flex:0 0 44px">
        <input type="range" id="fp_glowSize" min="6" max="120" style="flex:1">
      </label>
      <label style="display:flex;gap:6px;align-items:center;margin-bottom:6px">
        <span style="font-size:11px">Strength</span>
        <input type="range" id="fp_glowStrength" min="0.2" max="3" step="0.1" style="flex:1">
      </label>
      <label style="display:flex;gap:6px;align-items:center;">
        <span style="font-size:11px">Sample ms</span>
        <input type="range" id="fp_glowFreq" min="50" max="800" step="25" style="flex:1">
      </label>
    </div>

    <div style="margin-top:8px;border-top:1px solid rgba(255,255,255,0.04);padding-top:6px;display:flex;gap:6px">
      <input id="fp_saveBtn" type="button" value="Save" style="flex:1;padding:6px;background:#2a2a2a;border-radius:6px;border:none;color:#fff;cursor:pointer">
      <input id="fp_resetBtn" type="button" value="Reset" style="flex:1;padding:6px;background:#3a3a3a;border-radius:6px;border:none;color:#fff;cursor:pointer">
    </div>
    <div style="margin-top:6px;font-size:11px;opacity:.8">Glow is approximate — only highlights already-visible pixels (no through-wall detection).</div>
  `;

  document.body.appendChild(panel);

  // make draggable
  (function makeDraggable(el) {
    let down = false, dx = 0, dy = 0;
    el.addEventListener('mousedown', (ev) => {
      down = true; dx = ev.offsetX; dy = ev.offsetY;
      el.style.transition = 'none';
    });
    window.addEventListener('mouseup', () => down = false);
    window.addEventListener('mousemove', (ev) => {
      if (!down) return;
      el.style.left = (ev.pageX - dx) + 'px';
      el.style.top = (ev.pageY - dy) + 'px';
      el.style.right = 'unset'; el.style.bottom = 'unset';
    });
  })(panel);

  /* ---------------------------
     Wire up controls -> settings
     --------------------------- */
  const $ = id => document.getElementById(id);
  const map = {
    crossType: 'fp_crossType',
    crossColor: 'fp_crossColor',
    crossSize: 'fp_crossSize',
    crossThickness: 'fp_crossThickness',
    crossGap: 'fp_crossGap',
    crossAlpha: 'fp_crossAlpha',
    neon: 'fp_neon',
    invert: 'fp_invert',
    killFlash: 'fp_killFlash',
    glowEnabled: 'fp_glowEnabled',
    glowColor: 'fp_glowColor',
    glowSize: 'fp_glowSize',
    glowStrength: 'fp_glowStrength',
    glowSampleFreq: 'fp_glowFreq'
  };

  // populate UI with current settings (or defaults)
  function initUIFromSettings() {
    $(map.crossType).value = settings.crossType || defaults.crossType;
    $(map.crossColor).value = settings.crossColor || defaults.crossColor;
    $(map.crossSize).value = settings.crossSize || defaults.crossSize;
    $(map.crossThickness).value = settings.crossThickness || defaults.crossThickness;
    $(map.crossGap).value = settings.crossGap || defaults.crossGap;
    $(map.crossAlpha).value = settings.crossAlpha || defaults.crossAlpha;
    $(map.neon).checked = !!settings.neon;
    $(map.invert).checked = !!settings.invert;
    $(map.killFlash).checked = !!settings.killFlash;
    $(map.glowEnabled).checked = !!settings.glowEnabled;
    $(map.glowColor).value = settings.glowColor || defaults.glowColor;
    $(map.glowSize).value = settings.glowSize || defaults.glowSize;
    $(map.glowStrength).value = settings.glowStrength || defaults.glowStrength;
    $(map.glowSampleFreq).value = settings.glowSampleFreq || defaults.glowSampleFreq;
  }
  initUIFromSettings();

  // Save button & reset
  $('fp_saveBtn').addEventListener('click', () => {
    saveFromUI();
    saveSettings();
    alert('Fun Pack settings saved!');
  });
  $('fp_resetBtn').addEventListener('click', () => {
    settings = Object.assign({}, defaults);
    saveSettings();
    initUIFromSettings();
    applyAll();
  });

  // On change live update
  ['fp_crossType','fp_crossColor','fp_crossSize','fp_crossThickness','fp_crossGap','fp_crossAlpha',
   'fp_neon','fp_invert','fp_killFlash','fp_glowEnabled','fp_glowColor','fp_glowSize','fp_glowStrength','fp_glowFreq']
    .forEach(id => {
      const el = $(id);
      if (!el) return;
      el.addEventListener('input', () => { saveFromUI(); applyAll(); });
      el.addEventListener('change', () => { saveFromUI(); applyAll(); });
    });

  function saveFromUI() {
    settings.crossType = $(map.crossType).value;
    settings.crossColor = $(map.crossColor).value;
    settings.crossSize = parseInt($(map.crossSize).value, 10);
    settings.crossThickness = parseInt($(map.crossThickness).value, 10);
    settings.crossGap = parseInt($(map.crossGap).value, 10);
    settings.crossAlpha = parseFloat($(map.crossAlpha).value);
    settings.neon = !!$(map.neon).checked;
    settings.invert = !!$(map.invert).checked;
    settings.killFlash = !!$(map.killFlash).checked;
    settings.glowEnabled = !!$(map.glowEnabled).checked;
    settings.glowColor = $(map.glowColor).value;
    settings.glowSize = parseInt($(map.glowSize).value, 10);
    settings.glowStrength = parseFloat($(map.glowStrength).value);
    settings.glowSampleFreq = parseInt($(map.glowSampleFreq).value, 10);
    saveSettings();
  }

  /* ---------------------------
     Crosshair overlay
     --------------------------- */
  const chCanvas = document.createElement('canvas');
  chCanvas.width = chCanvas.height = 512;
  chCanvas.style.position = 'fixed';
  chCanvas.style.top = '50%';
  chCanvas.style.left = '50%';
  chCanvas.style.transform = 'translate(-50%,-50%)';
  chCanvas.style.pointerEvents = 'none';
  chCanvas.style.zIndex = 9999998;
  chCanvas.style.mixBlendMode = 'normal';
  document.body.appendChild(chCanvas);
  const chCtx = chCanvas.getContext('2d');

  function drawCrosshairOnce() {
    const scale = window.devicePixelRatio || 1;
    const size = settings.crossSize || defaults.crossSize;
    const thick = settings.crossThickness || defaults.crossThickness;
    const gap = settings.crossGap || defaults.crossGap;
    const alpha = settings.crossAlpha || defaults.crossAlpha;
    // canvas size based on size
    const W = Math.max(120, size * 8);
    chCanvas.width = W * scale;
    chCanvas.height = W * scale;
    chCanvas.style.width = W + 'px';
    chCanvas.style.height = W + 'px';
    chCtx.setTransform(scale, 0, 0, scale, 0, 0);
    chCtx.clearRect(0, 0, W, W);
    chCtx.globalAlpha = alpha;
    chCtx.strokeStyle = settings.crossColor || '#00FF00';
    chCtx.fillStyle = settings.crossColor || '#00FF00';
    chCtx.lineWidth = Math.max(1, thick);

    const cx = W / 2, cy = W / 2;
    chCtx.beginPath();
    switch (settings.crossType) {
      case 'Dot':
        chCtx.beginPath(); chCtx.arc(cx, cy, Math.max(1.5, thick+1), 0, Math.PI*2); chCtx.fill();
        break;
      case 'Circle':
        chCtx.beginPath(); chCtx.arc(cx, cy, size, 0, Math.PI*2); chCtx.stroke();
        break;
      case 'Star':
        for (let i = 0; i < 5; i++) {
          const angle = (18 + i * 72) * Math.PI / 180;
          const x = cx + size * Math.cos(angle);
          const y = cy - size * Math.sin(angle);
          chCtx.moveTo(cx, cy);
          chCtx.lineTo(x, y);
        }
        chCtx.stroke();
        break;
      case 'Plus':
        chCtx.moveTo(cx - size, cy); chCtx.lineTo(cx - gap, cy);
        chCtx.moveTo(cx + gap, cy); chCtx.lineTo(cx + size, cy);
        chCtx.moveTo(cx, cy - size); chCtx.lineTo(cx, cy - gap);
        chCtx.moveTo(cx, cy + gap); chCtx.lineTo(cx, cy + size);
        chCtx.stroke();
        break;
      case 'X':
        chCtx.moveTo(cx - size, cy - size); chCtx.lineTo(cx - gap, cy - gap);
        chCtx.moveTo(cx + gap, cy + gap); chCtx.lineTo(cx + size, cy + size);
        chCtx.moveTo(cx - size, cy + size); chCtx.lineTo(cx - gap, cy + gap);
        chCtx.moveTo(cx + gap, cy - gap); chCtx.lineTo(cx + size, cy - size);
        chCtx.stroke();
        break;
      case 'Hybrid':
        chCtx.beginPath(); chCtx.arc(cx, cy, size, 0, Math.PI*2); chCtx.stroke();
        chCtx.moveTo(cx - size, cy); chCtx.lineTo(cx + size, cy);
        chCtx.moveTo(cx, cy - size); chCtx.lineTo(cx, cy + size);
        chCtx.stroke();
        break;
      case 'Outlined Dot':
        chCtx.beginPath(); chCtx.arc(cx, cy, Math.max(1.5, thick+1), 0, Math.PI*2); chCtx.fill();
        chCtx.beginPath(); chCtx.arc(cx, cy, Math.max(4, thick+4), 0, Math.PI*2); chCtx.stroke();
        break;
      default:
        chCtx.beginPath(); chCtx.arc(cx, cy, Math.max(1.5, thick+1), 0, Math.PI*2); chCtx.fill();
    }
    chCtx.globalAlpha = 1;
  }

  /* ---------------------------
     Visual filters & kill flash
     --------------------------- */
  // kill flash overlay
  const flashDiv = document.createElement('div');
  flashDiv.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;opacity:0;z-index:9999997;transition:opacity 0.15s ease';
  document.body.appendChild(flashDiv);

  // kill detection via kill feed (as before)
  const killFeedObserver = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(node => {
        if (!node || !node.innerText) return;
        const text = node.innerText || '';
        if (!settings.killFlash) return;
        if (settings.playerName && text.includes(settings.playerName)) {
          // differentiate headshot patterns
          const html = node.innerHTML || '';
          const isHS = text.includes('HS') || /headshot/i.test(html);
          triggerKillFlash(isHS ? 'gold' : 'white', isHS ? 700 : 150);
        }
      });
    });
  });

  function tryAttachKillFeedObserver() {
    const feed = document.querySelector('#killFeed') || document.querySelector('.killFeed') || document.querySelector('[id*="kill"]');
    if (feed) {
      killFeedObserver.observe(feed, { childList: true, subtree: true });
      return true;
    }
    return false;
  }

  // attempt attaching periodically if not present yet
  const killFeedAttachInterval = setInterval(() => {
    if (tryAttachKillFeedObserver()) clearInterval(killFeedAttachInterval);
  }, 1000);

  function triggerKillFlash(color = 'white', ms = 150) {
    if (!settings.killFlash) return;
    flashDiv.style.background = color;
    flashDiv.style.opacity = '1';
    setTimeout(() => { flashDiv.style.opacity = '0'; }, ms);
  }

  // apply neon/invert via CSS filters (only affects page visuals and overlay)
  function applyFilters() {
    const filters = [];
    if (settings.neon) filters.push('contrast(1.7) saturate(1.6) brightness(1.05)');
    if (settings.invert) filters.push('invert(1)');
    // apply to body & many run-time elements (game canvas is a canvas, this won't tamper with internal rendering)
    document.documentElement.style.filter = filters.join(' ') || '';
  }

  /* ---------------------------
     Visible enemy glow overlay
     (samples game canvas pixels)
     --------------------------- */

  // overlay canvas for glow drawing
  const glowCanvas = document.createElement('canvas');
  glowCanvas.style.position = 'fixed';
  glowCanvas.style.left = '0';
  glowCanvas.style.top = '0';
  glowCanvas.style.width = '100%';
  glowCanvas.style.height = '100%';
  glowCanvas.style.pointerEvents = 'none';
  glowCanvas.style.zIndex = 9999995;
  document.body.appendChild(glowCanvas);
  const glowCtx = glowCanvas.getContext('2d');

  // find the largest canvas on page (likely the game's canvas)
  function findGameCanvas() {
    const canvases = Array.from(document.querySelectorAll('canvas'));
    if (!canvases.length) return null;
    // pick canvas with largest area on screen
    let best = null, bestArea = 0;
    canvases.forEach(c => {
      const rect = c.getBoundingClientRect();
      const area = rect.width * rect.height;
      if (area > bestArea) { bestArea = area; best = c; }
    });
    return best;
  }

  let gameCanvas = null;
  function refreshGameCanvas() {
    gameCanvas = findGameCanvas();
  }
  refreshGameCanvas();
  // try refreshing once per 2s in case game switches canvas
  setInterval(refreshGameCanvas, 2000);

  // keep overlay canvas sized correctly
  function resizeOverlay() {
    const scale = window.devicePixelRatio || 1;
    glowCanvas.width = Math.round(window.innerWidth * scale);
    glowCanvas.height = Math.round(window.innerHeight * scale);
    glowCanvas.style.width = window.innerWidth + 'px';
    glowCanvas.style.height = window.innerHeight + 'px';
    glowCtx.setTransform(scale, 0, 0, scale, 0, 0);
  }
  window.addEventListener('resize', resizeOverlay);
  resizeOverlay();

  // sampling routine:
  // cast several short rays from center outwards, sample pixels along them,
  // consider a hit when we find a pixel whose brightness differs significantly from background.
  // This is approximate and depends on map/skin colors.
  function sampleForVisibleEnemy() {
    if (!gameCanvas || !settings.glowEnabled) { glowCtx.clearRect(0,0,glowCanvas.width, glowCanvas.height); return; }
    try {
      // draw the game canvas onto an offscreen canvas so we can read pixels
      const off = document.createElement('canvas');
      const gw = gameCanvas.width, gh = gameCanvas.height;
      off.width = gw; off.height = gh;
      const offCtx = off.getContext('2d');
      offCtx.drawImage(gameCanvas, 0, 0, gw, gh);
      // now sample from screen center
      const rect = gameCanvas.getBoundingClientRect();
      const centerX = Math.round(rect.left + rect.width / 2);
      const centerY = Math.round(rect.top + rect.height / 2);
      const maxDist = Math.min(rect.width, rect.height) * 0.45;
      const angles = [0, 15, -15, 30, -30, 45, -45, 90, -90].map(a => a * Math.PI / 180);
      let hits = [];
      const threshold = 35; // brightness difference threshold
      for (let ang of angles) {
        // sample along ray
        for (let d = 8; d < maxDist; d += Math.max(6, settings.glowSize / 6)) {
          const sx = Math.round((centerX + d * Math.cos(ang)) - rect.left); // relative to game canvas
          const sy = Math.round((centerY - d * Math.sin(ang)) - rect.top);
          if (sx < 0 || sy < 0 || sx >= gw || sy >= gh) break;
          // get pixel
          const p = offCtx.getImageData(sx, sy, 1, 1).data;
          const r = p[0], g = p[1], b = p[2], a = p[3];
          // skip very transparent or nearly black background pixels
          const brightness = (0.299*r + 0.587*g + 0.114*b);
          if (a < 40) continue;
          // Heuristic: player models tend to be colored and not identical to background sky/floor.
          if (brightness > threshold + 10 || brightness < 220) {
            // Further heuristics: ensure pixel is not near fully uniform background by checking local neighborhood
            // sample a small neighborhood
            const n = offCtx.getImageData(Math.max(0,sx-2), Math.max(0,sy-2), Math.min(5, gw-sx+2), Math.min(5, gh-sy+2)).data;
            // compute local variance
            let mean = 0, count = n.length/4;
            for (let i=0;i<n.length;i+=4) {
              mean += (0.299*n[i] + 0.587*n[i+1] + 0.114*n[i+2]);
            }
            mean /= count;
            let variance = 0;
            for (let i=0;i<n.length;i+=4) {
              const val = (0.299*n[i] + 0.587*n[i+1] + 0.114*n[i+2]);
              variance += (val - mean) * (val - mean);
            }
            variance /= Math.max(1, count);
            if (variance > 30) {
              // map to screen coordinates
              const screenX = rect.left + sx;
              const screenY = rect.top + sy;
              hits.push({x: screenX, y: screenY});
              break; // stop along this ray
            }
          }
        }
      }

      // draw glow overlay for hits (convert to overlay coordinates)
      glowCtx.clearRect(0,0,glowCanvas.width, glowCanvas.height);
      if (hits.length) {
        glowCtx.save();
        glowCtx.globalCompositeOperation = 'lighter';
        for (let h of hits) {
          const gx = h.x, gy = h.y;
          const radius = settings.glowSize || 36;
          const color = settings.glowColor || '#00FFFF';
          const strength = settings.glowStrength || 1.4;
          // convert to CSS pixels for drawing
          glowCtx.beginPath();
          glowCtx.fillStyle = hexToRgba(color, 0.06 * strength);
          glowCtx.arc(gx, gy, radius * 0.9, 0, Math.PI*2);
          glowCtx.fill();
          glowCtx.beginPath();
          glowCtx.fillStyle = hexToRgba(color, 0.12 * strength);
          glowCtx.arc(gx, gy, radius * 0.6, 0, Math.PI*2);
          glowCtx.fill();
          glowCtx.beginPath();
          glowCtx.fillStyle = hexToRgba(color, 0.22 * strength);
          glowCtx.arc(gx, gy, radius * 0.3, 0, Math.PI*2);
          glowCtx.fill();
        }
        glowCtx.restore();
      } else {
        // nothing visible
        glowCtx.clearRect(0,0,glowCanvas.width, glowCanvas.height);
      }
    } catch (err) {
      // fail silently — sampling can throw if cross-origin or timing issues
      // clear overlay
      glowCtx.clearRect(0,0,glowCanvas.width, glowCanvas.height);
      // console.debug('Glow sample error', err);
    }
  }

  function hexToRgba(hex, alpha=1) {
    // supports #RRGGBB
    const h = hex.replace('#','');
    const r = parseInt(h.substring(0,2),16);
    const g = parseInt(h.substring(2,4),16);
    const b = parseInt(h.substring(4,6),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // schedule sampling loop (throttled by settings.glowSampleFreq)
  let samplingTimer = null;
  function startSamplingLoop() {
    if (samplingTimer) clearInterval(samplingTimer);
    if (!settings.glowEnabled) return;
    samplingTimer = setInterval(sampleForVisibleEnemy, Math.max(50, settings.glowSampleFreq || 150));
  }
  function stopSamplingLoop() { if (samplingTimer) { clearInterval(samplingTimer); samplingTimer = null; } }

  /* ---------------------------
     Apply everything
     --------------------------- */
  function applyAll() {
    drawCrosshairOnce();
    applyFilters();
    if (settings.glowEnabled) startSamplingLoop(); else stopSamplingLoop();
  }

  // initial apply
  applyAll();

  // observe for changes to primary canvas (re-attach if needed)
  const bodyObserver = new MutationObserver(() => {
    refreshGameCanvas();
  });
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  /* ---------------------------
     Utility: keep overlay sizing synced
     --------------------------- */
  function syncOverlaySize() {
    // update glowCanvas size (device pixel ratio handled inside sampling)
    const scale = window.devicePixelRatio || 1;
    glowCanvas.width = Math.round(window.innerWidth * scale);
    glowCanvas.height = Math.round(window.innerHeight * scale);
    glowCanvas.style.width = window.innerWidth + 'px';
    glowCanvas.style.height = window.innerHeight + 'px';
    glowCtx.setTransform(scale, 0, 0, scale, 0, 0);
  }
  window.addEventListener('resize', syncOverlaySize);
  syncOverlaySize();

  /* ---------------------------
     React to UI load+changes
     --------------------------- */
  // On load, ensure UI reflects settings
  initUIFromSettings();
  applyAll();

  // minor: refresh crosshair on animation frames for crispness (only when settings change)
  let lastCrossHash = '';
  setInterval(() => {
    const hash = [settings.crossType, settings.crossSize, settings.crossThickness, settings.crossColor, settings.crossGap, settings.crossAlpha].join('|');
    if (hash !== lastCrossHash) { lastCrossHash = hash; drawCrosshairOnce(); }
  }, 300);

  // When page unload, stop timers
  window.addEventListener('beforeunload', () => {
    stopSamplingLoop();
  });

  // Export apply function globally to help debugging via console if needed
  window.__krunkerFunPackApply = applyAll;

})();
