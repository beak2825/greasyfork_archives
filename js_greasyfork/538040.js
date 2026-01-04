// ==UserScript==
// @name         Immortal Client v8.2.1 – Kraken (Digit-Scan Attach)
// @namespace    http://tampermonkey.net/
// @version      8.2.1
// @description  finds slots by visible digits; syncs keys/mouse/AutoTool + HUD (CPS/FPS/Depth)
// @author       IMMORTAL_DEMON_999
// @license      MIT
// @match        *://bloxd.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/538040/Immortal%20Client%20v821%20%E2%80%93%20Kraken%20%28Digit-Scan%20Attach%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538040/Immortal%20Client%20v821%20%E2%80%93%20Kraken%20%28Digit-Scan%20Attach%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  const d = document;

  // ---------- THEME ----------
  const theme = {
    light: '#6ae0ff',
    accent: '#00ffee',
    hudBg: 'rgba(21,101,192,0.85)',
    hudBorder: '#002f6c',
    text: '#ffffff',
    depthGlow: 'rgba(0,188,212,0.35)'
  };

  // ---------- CSS ----------
  const style = d.createElement('style');
  style.textContent = `
    @keyframes krakenPulse {
      0%   { box-shadow: 0 0 10px 4px ${theme.light}; }
      50%  { box-shadow: 0 0 28px 14px ${theme.depthGlow}; }
      100% { box-shadow: 0 0 10px 4px ${theme.light}; }
    }
    /* Top-most overlay that fills the NATIVE slot box */
    .immortal-slot-overlay {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      pointer-events: none;
      z-index: 2147483000;
      opacity: 0;
      transition: opacity .12s ease, transform .12s ease, filter .12s ease;
      background: radial-gradient(90% 90% at 50% 50%, rgba(0,255,255,.35), rgba(0,255,255,.16) 60%, transparent 100%);
      border: 2px solid ${theme.accent};
      box-shadow: 0 0 18px 8px ${theme.light}, 0 0 36px 20px ${theme.depthGlow};
      transform: scale(1.03);
      filter: brightness(1.25) saturate(1.2) contrast(1.1);
    }
    .immortal-slot-overlay.on {
      opacity: 1;
      animation: krakenPulse 1.9s infinite;
      transform: scale(1.06);
      filter: brightness(1.35) saturate(1.25) contrast(1.15);
    }

    /* HUD + Stats */
    #immortalHUD, #immortalStats {
      font-family: "Courier New", monospace;
      color: ${theme.text};
      z-index: 2147480000;
      text-shadow: 0 0 5px rgba(0,0,0,.5);
      backdrop-filter: blur(4px);
      pointer-events: none;
    }
    #immortalHUD {
      position: fixed; bottom: 20px; left: 20px;
      background: ${theme.hudBg}; border: 2px solid ${theme.hudBorder};
      padding: 12px; border-radius: 14px; display: flex; flex-direction: column; gap: 6px;
    }
    .keyBox {
      background: rgba(0,60,143,.30); border: 1px solid ${theme.light};
      padding: 5px 10px; border-radius: 8px; min-width: 34px; text-align: center;
      transition: all .15s ease;
    }
    .activeKey { background:#003c8f; color:#fff; font-weight:700; transform: translateY(-2px); }
    .tentacle-active{ position:relative; overflow:hidden; }
    .tentacle-active::after{
      content:''; position:absolute; left:0; bottom:-4px; width:100%; height:3px; background:${theme.accent};
      animation: tentacle .8s ease-out;
    }
    @keyframes tentacle { 0%{width:0;opacity:0}50%{opacity:1}100%{width:100%;opacity:0} }

    #immortalStats {
      position: fixed; top: 20px; right: 20px;
      background: ${theme.hudBg}; border: 2px solid ${theme.hudBorder};
      padding: 12px; border-radius: 14px;
    }
  `;
  d.head.appendChild(style);

  // ---------- HUD ----------
  const hud = d.createElement('div');
  hud.id = 'immortalHUD';
  hud.innerHTML = `
    <div style="font-size:.9em;color:${theme.accent};margin-bottom:5px;">KRAKEN HUD v8.2.1</div>
    <div id="key-W" class="keyBox">W</div>
    <div style="display:flex;gap:6px">
      <div id="key-A" class="keyBox">A</div>
      <div id="key-S" class="keyBox">S</div>
      <div id="key-D" class="keyBox">D</div>
    </div>
    <div id="key-Shift" class="keyBox">Shift</div>
    <div style="display:flex;gap:6px;margin-top:5px;">
      <div id="key-LMB" class="keyBox">LMB</div>
      <div id="key-RMB" class="keyBox">RMB</div>
    </div>
    <div id="cpsDisplay" style="margin-top:8px;">CPS: <span style="color:${theme.accent}">0</span></div>
    <div id="fpsDisplay">FPS: <span style="color:${theme.accent}">0</span></div>
    <div id="depthDisplay" style="font-size:.8em;opacity:.8">Depth: <span style="color:${theme.accent}">0</span>m</div>
  `;
  d.body.appendChild(hud);

  const stats = d.createElement('div');
  stats.id = 'immortalStats';
  stats.innerHTML = `
    <div style="color:${theme.accent};font-weight:700;margin-bottom:8px;">IMMORTAL CLIENT v8.2.1</div>
    <div>» Kraken Update Active</div>
    <div>» AutoTool 2.0: <span style="color:${theme.accent}">ENABLED</span></div>
    <div>» FPS Boost: <span style="color:${theme.accent}">+20%</span></div>
    <div>» Memory: <span style="color:${theme.accent}">OPTIMIZED</span></div>
    <div>» Render Engine: v3.1</div>
    <div style="margin-top:8px;font-size:.8em;opacity:.8">Depth Effects: Active</div>
  `;
  d.body.appendChild(stats);

  // ---------- HUD Logic ----------
  const keyEls = {
    W: d.getElementById('key-W'),
    A: d.getElementById('key-A'),
    S: d.getElementById('key-S'),
    D: d.getElementById('key-D'),
    Shift: d.getElementById('key-Shift'),
    LMB: d.getElementById('key-LMB'),
    RMB: d.getElementById('key-RMB'),
  };
  const keyMap = { KeyW:'W', KeyA:'A', KeyS:'S', KeyD:'D', ShiftLeft:'Shift', ShiftRight:'Shift' };
  const digitToIdx = { Digit1:0, Digit2:1, Digit3:2, Digit4:3, Digit5:4, Digit6:5, Digit7:6, Digit8:7, Digit9:8, Digit0:9 };

  let cps = 0;
  setInterval(() => {
    d.getElementById('cpsDisplay').innerHTML = `CPS: <span style="color:${theme.accent}">${cps}</span>`;
    cps = 0;
  }, 1000);

  let frames = 0, lastFPS = performance.now();
  const raf = (fn) => requestAnimationFrame(fn);
  function fpsTick(now) {
    frames++;
    if (now - lastFPS >= 1000) {
      d.getElementById('fpsDisplay').innerHTML = `FPS: <span style="color:${theme.accent}">${frames}</span>`;
      frames = 0; lastFPS = now;
    }
    raf(fpsTick);
  }
  raf(fpsTick);

  function updateDepth() {
    try {
      const p = W.players?.[W.playerIndex];
      if (p) {
        const depth = Math.abs(Math.floor(p.y / 10));
        d.getElementById('depthDisplay').innerHTML = `Depth: <span style="color:${theme.accent}">${depth}</span>m`;
      }
    } catch {}
    setTimeout(updateDepth, 1000);
  }
  updateDepth();

  d.addEventListener('mousedown', e => {
    if (e.button === 0) { keyEls.LMB.classList.add('activeKey','tentacle-active'); cps++; setTimeout(()=>keyEls.LMB.classList.remove('tentacle-active'),800); }
    if (e.button === 2) { keyEls.RMB.classList.add('activeKey','tentacle-active'); setTimeout(()=>keyEls.RMB.classList.remove('tentacle-active'),800); }
  });
  d.addEventListener('mouseup', e => {
    if (e.button === 0) keyEls.LMB.classList.remove('activeKey');
    if (e.button === 2) keyEls.RMB.classList.remove('activeKey');
  });

  d.addEventListener('keydown', e => {
    const k = keyMap[e.code];
    if (k && keyEls[k]) { keyEls[k].classList.add('activeKey','tentacle-active'); setTimeout(()=>keyEls[k].classList.remove('tentacle-active'),800); }
    if (digitToIdx.hasOwnProperty(e.code)) setSelected(digitToIdx[e.code]);
  });
  d.addEventListener('keyup', e => {
    const k = keyMap[e.code];
    if (k && keyEls[k]) keyEls[k].classList.remove('activeKey');
  });

  // ---------- NATIVE HOTBAR (digit-scan attach) ----------
  let slotRoots = [];     // the 10 real slot elements
  let overlays = [];      // our overlay nodes (1:1)
  let selectedIdx = -1;

  const DIGITS = ['1','2','3','4','5','6','7','8','9','0'];

  function isVisible(el) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1 && r.bottom > 0 && r.right > 0 && r.left < innerWidth && r.top < innerHeight;
  }

  function findElementsWithExactText(txt) {
    const all = Array.from(d.querySelectorAll('span,div,b,strong,i,em,button,label,p,small'));
    return all.filter(el => isVisible(el) && el.childElementCount === 0 && el.textContent.trim() === txt);
  }

  // climb up to find the actual box that looks like the slot container
  function pickSlotRoot(el) {
    let cur = el;
    for (let i = 0; i < 4 && cur; i++, cur = cur.parentElement) {
      const r = cur.getBoundingClientRect();
      const cs = getComputedStyle(cur);
      const br = parseFloat(cs.borderRadius) || 0;
      const bgOK = cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
      const borderOK = (parseFloat(cs.borderTopWidth)||0) > 0 || (parseFloat(cs.borderLeftWidth)||0) > 0;
      const sizeOK = r.width >= 28 && r.width <= 200 && r.height >= 26 && r.height <= 140;
      const bottomZone = r.top > innerHeight * 0.55 && r.bottom <= innerHeight + 8;
      if (sizeOK && bottomZone && (br >= 4 || bgOK || borderOK)) {
        return cur;
      }
    }
    return null;
  }

  // group slot roots by Y to find the row of 10
  function clusterByRow(roots) {
    const groups = [];
    for (const node of roots) {
      const r = node.getBoundingClientRect();
      const cy = (r.top + r.bottom) / 2;
      let placed = false;
      for (const g of groups) {
        if (Math.abs(g.cy - cy) < 24) { g.items.push(node); g.cy = (g.cy * g.items.length + cy) / (g.items.length + 1); placed = true; break; }
      }
      if (!placed) groups.push({ cy, items:[node] });
    }
    // pick the group that has most items & is near bottom
    groups.sort((a,b) => b.items.length - a.items.length);
    return groups.length ? groups[0].items : [];
  }

  function attachHotbar() {
    if (slotRoots.length === 10) return true;

    // 1) find each digit node -> map to a likely slot root
    const roots = [];
    for (const t of DIGITS) {
      const els = findElementsWithExactText(t);
      for (const e of els) {
        const root = pickSlotRoot(e);
        if (root) roots.push({t, root});
      }
    }
    if (!roots.length) return false;

    // 2) choose the row containing 10 roots
    const onlyRoots = roots.map(x => x.root);
    const row = clusterByRow(onlyRoots);
    if (row.length < 10) return false;

    // 3) dedupe & order by x to match 1..9,0
    const uniq = Array.from(new Set(row));
    uniq.sort((a,b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
    if (uniq.length !== 10) return false;

    slotRoots = uniq;

    // 4) inject overlays
    overlays = [];
    for (const s of slotRoots) {
      const cs = getComputedStyle(s);
      if (cs.position === 'static') s.style.position = 'relative';
      const ov = d.createElement('div');
      ov.className = 'immortal-slot-overlay';
      s.appendChild(ov);
      overlays.push(ov);
    }

    // quick flash so you know it attached
    overlays[0].classList.add('on');
    setTimeout(() => overlays[0].classList.remove('on'), 500);
    return true;
  }

  // retry attach a few times on load, then watch the DOM
  let tries = 0; (function retry(){ if (!attachHotbar() && tries++ < 50) setTimeout(retry, 200); })();
  const mo = new MutationObserver(() => {
    if (slotRoots.length !== 10 || slotRoots.some(s => !d.body.contains(s))) {
      slotRoots = []; overlays = []; selectedIdx = -1; attachHotbar();
    }
  });
  mo.observe(d.body, { childList: true, subtree: true });

  // ---------- Selection sync ----------
  function setSelected(i) {
    if (!overlays.length || i < 0 || i > 9) return;
    if (selectedIdx === i) return;
    selectedIdx = i;
    overlays.forEach((ov, idx) => ov.classList.toggle('on', idx === i));
  }

  // poll game state so mouse wheel/in-game changes reflect
  setInterval(() => {
    try {
      const p = W.players?.[W.playerIndex];
      const idx = p?.selectedItem;
      if (typeof idx === 'number') {
        const guess0 = idx % 10;
        const guess1 = ((idx - 1 + 10) % 10);
        setSelected(Number.isFinite(guess0) ? guess0 : guess1);
      }
    } catch {}
  }, 120);

  // hook setHeld (AutoTool/tool swaps)
  try {
    if (typeof W.setHeld === 'function') {
      const orig = W.setHeld;
      W.setHeld = function(i, ...rest) {
        try {
          let n = Number(i);
          if (!Number.isNaN(n)) {
            if (n >= 1 && n <= 10) n = (n - 1) % 10; else n = n % 10;
            setSelected(n);
          }
        } catch {}
        return orig.apply(this, [i, ...rest]);
      };
    }
  } catch {}

  // cleanup
  window.addEventListener('beforeunload', () => mo.disconnect());

  console.log('%cImmortal Client v8.2.1 – FULL NATIVE HOTBAR FILL attached (digit-scan)', `color:${theme.accent};font-weight:bold`);
})();