// ==UserScript==
// @name         Bloxd Keystrokes + CPS
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  A keystroke HUD for bloxd.io
// @author       avner
// @match        https://bloxd.io/*
// @match        https://bloxd.io/?utm_source=pwa
// @match        https://staging.bloxd.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536500/Bloxd%20Keystrokes%20%2B%20CPS.user.js
// @updateURL https://update.greasyfork.org/scripts/536500/Bloxd%20Keystrokes%20%2B%20CPS.meta.js
// ==/UserScript==

(() => {
  const SQ   = 60, GAP = 8, SPH = 24;
  const MBW  = Math.round((SQ*3 + GAP*2 - GAP)/2);
  const FONT = '"Minecraft Regular","Minecraft",monospace';

  // Load Minecraft Regular
  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>@import url('https://fonts.cdnfonts.com/css/minecraft-4');</style>`
  );

  // HUD Styles
  const css = `
    #hud {
      position: fixed;
      bottom: 80px;
      left: 40px;
      display: grid;
      grid-template-columns: repeat(3, ${SQ}px);
      grid-template-rows: ${SQ}px ${SQ}px ${SQ}px ${SPH}px;
      gap: ${GAP}px;
      pointer-events: none;
      user-select: none;
      z-index: 99999;
    }
    #hud .key {
      background: rgba(0,0,0,0.30);  /* increased opacity */
      color: #fff;
      font-family: ${FONT};
      font-weight: 400;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      transition: background .12s, color .12s;
      box-shadow: none !important;
      filter: none !important;
    }
    #hud .key[data-k="W"],
    #hud .key[data-k="A"],
    #hud .key[data-k="S"],
    #hud .key[data-k="D"] {
      width: ${SQ}px; height: ${SQ}px; font-size: 26px;
    }
    #mouseRow {
      grid-column: 1 / -1;
      display: flex; gap: ${GAP}px; justify-content: center;
    }
    #mouseRow .key {
      width: ${MBW}px; height: ${SQ}px; font-size: 20px;
    }
    #mouseRow .cps {
      margin-top: 3px; font-size: 13px;
    }
    #hud .key[data-k="SPACE"] {
      grid-column: 1 / -1;
      width: 100%; height: ${SPH}px; font-size: 18px;
      justify-content: center;
    }
    #hud .active {
      background: #fff; color: #000;
    }
  `;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

  // Build HUD
  const hud = document.createElement('div');
  hud.id = 'hud';
  hud.innerHTML = `
    <div></div>
    <div class="key" data-k="W"><span>W</span></div>
    <div></div>
    <div class="key" data-k="A"><span>A</span></div>
    <div class="key" data-k="S"><span>S</span></div>
    <div class="key" data-k="D"><span>D</span></div>
    <div id="mouseRow">
      <div class="key" data-k="LMB"><span>LMB</span><span class="cps" id="cpsL">0 CPS</span></div>
      <div class="key" data-k="RMB"><span>RMB</span><span class="cps" id="cpsR">0 CPS</span></div>
    </div>
    <div class="key" data-k="SPACE"><span>───</span></div>`;
  document.body.appendChild(hud);

  // Key & CPS logic
  const keys = Array.from(hud.querySelectorAll('.key'))
                .reduce((o,el)=>(o[el.dataset.k]=el,o),{});
  const setActive = (k,on) => keys[k]?.classList[on?'add':'remove']('active');
  const mapKey    = k => ({' ':'SPACE'}[k] ?? k.toUpperCase());

  addEventListener('keydown',  e => setActive(mapKey(e.key), true));
  addEventListener('keyup',    e => setActive(mapKey(e.key), false));
  addEventListener('mousedown',e => setActive(e.button?'RMB':'LMB', true));
  addEventListener('mouseup',  e => setActive(e.button?'RMB':'LMB', false));

  let L = [], R = [];
  const cut = () => Date.now() - 1000;
  const upd = () => {
    const t = cut();
    L = L.filter(x => x >= t);
    R = R.filter(x => x >= t);
    hud.querySelector('#cpsL').textContent = `${L.length} CPS`;
    hud.querySelector('#cpsR').textContent = `${R.length} CPS`;
  };
  addEventListener('mousedown', e => { (e.button?R:L).push(Date.now()); upd(); });
  setInterval(upd, 200);
})();
