// ==UserScript==
// @name         Wplace charge regen ETA bubble
// @namespace    Zex2
// @version      3.0.9
// @description  ETA bubble with draggable UI
// @match        https://wplace.live/*
// @author       Zex2
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue

// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546333/Wplace%20charge%20regen%20ETA%20bubble.user.js
// @updateURL https://update.greasyfork.org/scripts/546333/Wplace%20charge%20regen%20ETA%20bubble.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Storage keys
  const K = {
    cur: 'eta_cur',
    max: 'eta_max',
    debugOn: 'eta_debug_on',
    bubblePos: 'eta_bubble_pos',
    panelPos: 'eta_panel_pos'
  };

  // --- State
  let current = GM_getValue(K.cur, 148);
  let max = GM_getValue(K.max, 208);
  let lastTimer = null;           // seconds until next tick (parsed from (m:ss))
  let lastTickCheck = Date.now(); // ms clock for AFK recovery
  let lastAutoIncAt = 0;          // ms guard to avoid double-increment on regen detection
  let debugEnabled = GM_getValue(K.debugOn, true);

  // --- UI elements
  let bubble, panel, panelBody;

  // --- Menu
  GM_registerMenuCommand('Set current charges', () => {
    const val = prompt('Current charges:', String(current));
    if (val === null) return;
    current = clampInt(parseInt(val, 10), 0, 9999);
    GM_setValue(K.cur, current);
    log(`Manual set: current=${current}`);
    render();
  });

  GM_registerMenuCommand('Set max charges', () => {
    const val = prompt('Max charges:', String(max));
    if (val === null) return;
    max = clampInt(parseInt(val, 10), 1, 9999);
    GM_setValue(K.max, max);
    log(`Manual set: max=${max}`);
    render();
  });

  GM_registerMenuCommand('Toggle debug overlay', () => {
    debugEnabled = !debugEnabled;
    GM_setValue(K.debugOn, debugEnabled);
    if (panel) panel.style.display = debugEnabled ? 'block' : 'none';
    log(`Debug overlay ${debugEnabled ? 'ENABLED' : 'DISABLED'}`);
  });

  GM_registerMenuCommand('Reset positions', () => {
    GM_setValue(K.bubblePos, null);
    GM_setValue(K.panelPos, null);
    place(bubble, { x: null, y: null }, { bottom: 20, right: 20 });
    place(panel, { x: null, y: null }, { top: 20, left: 20 });
    log('Positions reset');
  });

  // --- Ensure body exists then init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    createBubble();
    createPanel();
    makeDraggable(bubble, K.bubblePos, { bottom: 20, right: 20 });
    makeDraggable(panel, K.panelPos, { top: 20, left: 20 });

    // Initial render
    render();

    // Ticker
    setInterval(tick, 500);
  }

  // --- Core loop
  function tick() {
    const timerEl = findTimerEl();
 if (!timerEl) {
  // If we were one short, assume we just got the last charge
  if (current === max - 1) {
    current = max;
    GM_setValue(K.cur, current);
    log(`Final regen: assumed full → current=${current}/${max}`);
  }

  if (current >= max) {
    // Pretend we're at 0 to show total regen time
    const etaSec = (max - 1) * 30 + 30; // full cycle from empty
    setBubble(formatHMS(etaSec) + ' to full', `${current}/${max}`);
  } else {
    setBubble('Waiting for timer…', `${current}/${max}`);
  }
  return;
}




    const untilNext = parseTimer(timerEl.textContent);
    if (untilNext == null) {
      setBubble('Invalid timer', `${current}/${max}`);
      return;
    }

    // Auto-increment on cycle reset (e.g., 0:01 -> 0:30)
    if (lastTimer != null) {
      const jumpedUp = untilNext > lastTimer + 10; // robust jump threshold
      const enoughSinceLastInc = (Date.now() - lastAutoIncAt) > 15000; // guard
      if (jumpedUp && current < max && enoughSinceLastInc) {
        current += 1;
        lastAutoIncAt = Date.now();
        GM_setValue(K.cur, current);
        log(`Regen: timer reset detected (+1) → current=${current}/${max}`);
      }
    }
    lastTimer = untilNext;

    // AFK recovery (award charges for elapsed time)
    const now = Date.now();
    const elapsed = Math.floor((now - lastTickCheck) / 1000);
    if (elapsed > 40) {
      const gained = Math.floor(elapsed / 30);
      if (gained > 0 && current < max) {
        const before = current;
        current = Math.min(max, current + gained);
        GM_setValue(K.cur, current);
        log(`AFK recovery: +${current - before} (elapsed ${elapsed}s) → current=${current}/${max}`);
      }
    }
    lastTickCheck = now;

    // Clamp and render
    if (current >= max) {
      current = max;
      setBubble('Fully charged', `${current}/${max}`);
      return;
    }

    const etaSec = Math.max(0, (max - current - 1) * 30 + untilNext);
    setBubble(formatHMS(etaSec) + ' to full', `${current}/${max}`);
  }

  // --- Helpers
  function findTimerEl() {
    // Scan common inline text containers for a string like "(m:ss)"
    const candidates = document.querySelectorAll('time, span, div, p');
    for (const el of candidates) {
      const t = el.textContent || '';
      if (/\(\d+:\d{2}\)/.test(t)) return el;
    }
    return null;
  }

  function parseTimer(s) {
    const m = /\((\d+):(\d{2})\)/.exec(s || '');
    if (!m) return null;
    const mins = parseInt(m[1], 10);
    const secs = parseInt(m[2], 10);
    if (isNaN(mins) || isNaN(secs)) return null;
    return mins * 60 + secs;
  }

  function formatHMS(totalSec) {
    const s = Math.max(0, Math.ceil(totalSec));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${String(m).padStart(2,'0')}m ${String(sec).padStart(2,'0')}s`;
    return `${m}m ${String(sec).padStart(2,'0')}s`;
  }

  function clampInt(n, lo, hi) {
    if (!Number.isFinite(n)) return lo;
    return Math.min(hi, Math.max(lo, n | 0));
  }

  // --- Bubble renderer (adds edit button; listeners are delegated)
  function setBubble(line1, counts) {
    if (!bubble) return;
    bubble.innerHTML = `
      <div style="font-weight:600">${line1}</div>
      <div style="display:flex; justify-content:center; align-items:center; gap:6px; opacity:.9">
        <span class="charge-counts">${counts}</span>
        <button class="bubble-edit-btn" title="Edit current/max" style="
          background:none; border:1px solid #8a8f98; border-radius:4px; color:#cbd5e1;
          font-size:11px; padding:0 6px; cursor:pointer; line-height:1.6;">⚙️</button>
      </div>
    `;
  }

  function log(msg) {
    if (!panelBody) return;
    const ts = new Date();
    const t = ts.toLocaleTimeString([], { hour12: false });
    const row = document.createElement('div');
    row.textContent = `[${t}] ${msg}`;
    panelBody.appendChild(row);
    // cap to last 120 lines
    while (panelBody.childNodes.length > 120) {
      panelBody.removeChild(panelBody.firstChild);
    }
    if (debugEnabled && panel) panel.style.display = 'block';
  }

  // --- UI builders
  function createBubble() {
    bubble = document.createElement('div');
    Object.assign(bubble.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '8px 10px',
      background: 'rgba(16,18,22,0.9)',
      color: '#e6edf3',
      border: '1px solid #2b3138',
      borderRadius: '10px',
      font: '12px/1.4 system-ui, Segoe UI, Roboto, Arial, sans-serif',
      zIndex: 2147483647,
      boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
      cursor: 'move',
      minWidth: '160px'
    });

    // Delegate edit button click (no duplicate listeners on re-render)
    bubble.addEventListener('click', (e) => {
      const editBtn = e.target.closest('.bubble-edit-btn');
      if (!editBtn) return;
      e.stopPropagation();
      const inVal = prompt('Enter current/max charges:', `${current}/${max}`);
      if (!inVal) return;
      const m = inVal.match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
      if (!m) {
        alert('Format must be: number/number (e.g., 7/10)');
        return;
      }
      const newCur = clampInt(parseInt(m[1], 10), 0, 9999);
      const newMax = clampInt(parseInt(m[2], 10), 1, 9999);
      current = Math.min(newCur, newMax);
      max = newMax;
      GM_setValue(K.cur, current);
      GM_setValue(K.max, max);
      log(`Inline edit via button: current=${current}, max=${max}`);
      render();
    });

    // Prevent drag start when pressing the edit button
    bubble.addEventListener('mousedown', (e) => {
      if (e.target.closest('.bubble-edit-btn')) e.stopPropagation();
    }, true);

    document.body.appendChild(bubble);
    place(bubble, GM_getValue(K.bubblePos, null), { bottom: 20, right: 20 });
  }

  function createPanel() {
    panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'fixed',
      top: '20px',
      left: '20px',
      width: '360px',
      maxHeight: '40vh',
      overflow: 'auto',
      background: 'rgba(10,12,16,0.95)',
      color: '#cbd5e1',
      border: '1px solid #2b3138',
      borderRadius: '8px',
      font: '12px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
      zIndex: 2147483647,
      boxShadow: '0 8px 22px rgba(0,0,0,0.35)',
      display: debugEnabled ? 'block' : 'none',
      cursor: 'move'
    });

    const header = document.createElement('div');
    header.textContent = 'Charge ETA — Debug';
    Object.assign(header.style, {
      padding: '6px 8px',
      fontWeight: '700',
      borderBottom: '1px solid #2b3138',
      background: 'rgba(255,255,255,0.03)'
    });

    const controls = document.createElement('div');
    Object.assign(controls.style, {
      display: 'flex',
      gap: '8px',
      padding: '6px 8px',
      borderBottom: '1px solid #2b3138',
      flexWrap: 'wrap'
    });

    const btnHide = document.createElement('button');
    btnHide.textContent = 'Do not show again';
    styleBtn(btnHide);
    btnHide.onclick = () => {
      debugEnabled = false;
      GM_setValue(K.debugOn, false);
      panel.style.display = 'none';
    };

    const btnClear = document.createElement('button');
    btnClear.textContent = 'Clear';
    styleBtn(btnClear);
    btnClear.onclick = () => {
      panelBody.innerHTML = '';
      log('Log cleared');
    };

    const btnSync = document.createElement('button');
    btnSync.textContent = 'Sync +1';
    styleBtn(btnSync);
    btnSync.onclick = () => {
      if (current < max) {
        current += 1;
        GM_setValue(K.cur, current);
        log(`Manual sync: +1 → current=${current}/${max}`);
        render();
      }
    };

    controls.append(btnHide, btnClear, btnSync);

    panelBody = document.createElement('div');
    Object.assign(panelBody.style, {
      padding: '6px 8px',
      whiteSpace: 'pre-wrap'
    });

    panel.append(header, controls, panelBody);
    document.body.appendChild(panel);
    place(panel, GM_getValue(K.panelPos, null), { top: 20, left: 20 });

    // initial line shows state
    log(`Startup: current=${current}/${max}`);
  }

  function styleBtn(b) {
    Object.assign(b.style, {
      background: '#0b63ff',
      color: 'white',
      border: '1px solid #1547b0',
      padding: '2px 6px',
      borderRadius: '6px',
      cursor: 'pointer',
      font: '600 11px system-ui, sans-serif'
    });
  }

  // --- Positioning + drag with persistence
  function makeDraggable(el, storageKey, fallback) {
    if (!el) return;
    let start = null;
    el.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, input, textarea, select, a')) return;
      start = { x: e.clientX, y: e.clientY, left: el.offsetLeft, top: el.offsetTop };
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!start) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      el.style.left = (start.left + dx) + 'px';
      el.style.top = (start.top + dy) + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    });
    window.addEventListener('mouseup', () => {
      if (!start) return;
      start = null;
      const rect = el.getBoundingClientRect();
      GM_setValue(storageKey, { x: rect.left + window.scrollX, y: rect.top + window.scrollY });
    });

    // Touch
    el.addEventListener('touchstart', (e) => {
      const t = e.touches[0];
      start = { x: t.clientX, y: t.clientY, left: el.offsetLeft, top: el.offsetTop };
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (!start) return;
      const t = e.touches[0];
      const dx = t.clientX - start.x;
      const dy = t.clientY - start.y;
      el.style.left = (start.left + dx) + 'px';
      el.style.top = (start.top + dy) + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    }, { passive: true });
    window.addEventListener('touchend', () => {
      if (!start) return;
      start = null;
      const rect = el.getBoundingClientRect();
      GM_setValue(storageKey, { x: rect.left + window.scrollX, y: rect.top + window.scrollY });
    });

    // Initial placement
    place(el, GM_getValue(storageKey, null), fallback);
  }

  function place(el, saved, fallback) {
    if (!el) return;
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
      el.style.left = saved.x + 'px';
      el.style.top = saved.y + 'px';
      el.style.right = 'auto';
      el.style.bottom = 'auto';
    } else {
      if (fallback.left != null) el.style.left = fallback.left + 'px';
      if (fallback.top != null) el.style.top = fallback.top + 'px';
      if (fallback.right != null) el.style.right = fallback.right + 'px';
      if (fallback.bottom != null) el.style.bottom = fallback.bottom + 'px';
    }
  }

  function render() {
    const timerEl = findTimerEl();
    const untilNext = timerEl ? parseTimer(timerEl.textContent) : null;
    if (current >= max) {
      current = max;
      setBubble('Fully charged', `${current}/${max}`);
      return;
    }
    if (untilNext == null) {
      setBubble('Waiting for timer…', `${current}/${max}`);
      return;
    }
    const etaSec = Math.max(0, (max - current - 1) * 30 + untilNext);
    setBubble(formatHMS(etaSec) + ' to full', `${current}/${max}`);
  }
})();
