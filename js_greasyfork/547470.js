// ==UserScript==
// @name         TORN OC Targets + Tile Highlight
// @namespace    https://torn.oc.tools/
// @version      1.1
// @description  Define target success% (1–10) and highlight the whole role tile when below target. Works with/without TornTools.
// @match        https://www.torn.com/factions.php*
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547470/TORN%20OC%20Targets%20%2B%20Tile%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/547470/TORN%20OC%20Targets%20%2B%20Tile%20Highlight.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'tm_oc_thresholds_v1';
  const UI_VIS_KEY  = 'tm_oc_ui_visible_v1';
  const DEFAULTS = {1:80,2:80,3:80,4:80,5:85,6:85,7:90,8:90,9:92,10:95};

  const sleep = (ms)=>new Promise(r=>setTimeout(r,ms));
  const q  = (sel, r=document)=>r.querySelector(sel);
  const qq = (sel, r=document)=>Array.from(r.querySelectorAll(sel));
  const num = (t)=>{ const m=String(t??'').match(/\d+/); return m?parseInt(m[0],10):NaN; };
  const get = (k,d)=>{ try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{ return d; } };
  const set = (k,v)=>localStorage.setItem(k, JSON.stringify(v));
  let TH = get(STORAGE_KEY, {...DEFAULTS});

  /* ------------------------------ CSS ---------------------------- */
  const css = `
  .tm-oc-fab{position:fixed;top:72px;right:16px;z-index:999999;padding:8px 10px;border-radius:8px;
    border:1px solid rgba(255,255,255,.18);background:#2a2a2a;color:#fff;font-size:12px;cursor:pointer}
  .tm-oc-sidebar{position:fixed;top:72px;right:16px;width:460px;max-height:calc(100vh - 96px);overflow:auto;
    z-index:999999;background:#1e1e1e;border:1px solid rgba(255,255,255,.12);border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.35);color:#e8e8e8}
  .tm-oc-hidden{display:none!important}
  .tm-oc-head{position:sticky;top:0;background:#1e1e1e;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.08);
    display:flex;align-items:center;justify-content:space-between}
  .tm-oc-title{font-weight:700;font-size:14px}
  .tm-btn{padding:6px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.18);background:#2a2a2a;color:#eee;cursor:pointer;font-size:12px}
  .tm-btn:hover{background:#323232}

  /* input grid */
  .tm-oc-body{padding:10px 12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px}
  .tm-oc-row{display:flex;align-items:center;gap:8px;min-width:0}
  .tm-oc-row label{flex:0 0 76px;font-size:12px;opacity:.9}
  .tm-oc-row input{flex:1 1 auto;min-width:0;height:32px;padding:4px 8px;border-radius:6px;border:1px solid rgba(255,255,255,.18);
    background:#262626;color:#eee;outline:none;box-sizing:border-box}
  .tm-oc-row input:focus{border-color:#7aa9ff;box-shadow:0 0 0 2px rgba(122,169,255,.25)}
  .tm-oc-actions{display:flex;gap:8px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.08);flex-wrap:wrap}
  .tm-oc-note{padding:0 12px 12px;font-size:12px;opacity:.8}

  /* HIGHLIGHT */
  .tm-oc-tile-below{
    background: rgb(255 235 59 / 70%) !important;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, .7) inset !important;
    border-radius: 8px !important;
    color: black;
  }
  .tm-oc-tile-below > button[class*="slotHeader"],
  .tm-oc-tile-below > [class*="slotBody"]{
    background: transparent !important;
    box-shadow: none !important;
  }
  `;
  const style = document.createElement('style'); style.textContent = css; document.documentElement.appendChild(style);

  /* ------------------------------ UI ----------------------------- */
  const uiVisible = ()=>localStorage.getItem(UI_VIS_KEY)!=='0';
  const setUiVisible = (v)=>localStorage.setItem(UI_VIS_KEY, v?'1':'0');

  function buildUI(){
    if(!q('#tm-oc-fab')){
      const fab=document.createElement('button');
      fab.id='tm-oc-fab'; fab.className='tm-oc-fab';
      fab.textContent = uiVisible()? 'Hide OC Targets' : 'Show OC Targets';
      fab.addEventListener('click', ()=>{
        const sb=q('#tm-oc-sidebar'); const show = sb?.classList.contains('tm-oc-hidden');
        if(sb) sb.classList.toggle('tm-oc-hidden', !show);
        setUiVisible(!!show);
        fab.textContent = show? 'Hide OC Targets' : 'Show OC Targets';
      });
      document.body.appendChild(fab);
    }
    if(q('#tm-oc-sidebar')) return;

    const sb=document.createElement('div');
    sb.id='tm-oc-sidebar'; sb.className='tm-oc-sidebar';
    if(!uiVisible()) sb.classList.add('tm-oc-hidden');
    sb.innerHTML=`
      <div class="tm-oc-head">
        <span class="tm-oc-title">OC Targets by Level</span>
        <button class="tm-btn" id="tm-oc-hide">Hide</button>
      </div>
      <div class="tm-oc-body">
        ${Array.from({length:10},(_,i)=>{
          const L=i+1, v=TH[L]??'';
          return `<div class="tm-oc-row"><label for="tm-oc-l${L}">Level ${L}</label>
                  <input id="tm-oc-l${L}" type="number" min="0" max="100" step="1" value="${v}"></div>`;
        }).join('')}
      </div>
      <div class="tm-oc-actions">
        <button id="tm-oc-save" class="tm-btn">Save</button>
        <button id="tm-oc-reset" class="tm-btn">Reset defaults</button>
        <button id="tm-oc-reanalyze" class="tm-btn">Re-analyze</button>
      </div>
      <div class="tm-oc-note">Highlights any member whose success% is below the target for that level.</div>
    `;
    document.body.appendChild(sb);

    q('#tm-oc-hide').addEventListener('click', ()=>{
      sb.classList.add('tm-oc-hidden'); setUiVisible(false);
      const fab=q('#tm-oc-fab'); if(fab) fab.textContent='Show OC Targets';
    });
    q('#tm-oc-save').addEventListener('click', ()=>{
      const t={}; for(let l=1;l<=10;l++){ const v=parseInt(q('#tm-oc-l'+l).value,10); t[l]=Number.isFinite(v)?Math.max(0,Math.min(100,v)):DEFAULTS[l]; }
      TH=t; set(STORAGE_KEY, TH); scheduleAnalyze(0);
    });
    q('#tm-oc-reset').addEventListener('click', ()=>{
      TH={...DEFAULTS}; set(STORAGE_KEY, TH);
      for(let l=1;l<=10;l++){ const inp=q('#tm-oc-l'+l); if(inp) inp.value=TH[l]; }
      scheduleAnalyze(0);
    });
    q('#tm-oc-reanalyze').addEventListener('click', ()=>scheduleAnalyze(0));
  }

  /* --------------------------- analysis -------------------------- */
  function getCrimeLevel(crime){
    const span = crime.querySelector('span[class*="levelValue"]') || crime.querySelector('[class*="textLevel"] span');
    return num(span?.textContent);
  }

  // Encontra o "tile" do membro (o wrapper que tem header + body)
  function findMemberTileFromHeader(header, crime){
    let e = header;
    while (e && e !== crime && e !== document.body){
      if (e.querySelector(':scope > [class*="slotBody"]')) return e; // este nó tem o body como filho direto
      e = e.parentElement;
    }
    return header.parentElement || header;
  }

  function analyzeCrime(crime){
    const lvl = getCrimeLevel(crime);
    if(!Number.isFinite(lvl) || lvl<1 || lvl>10) return;
    const target = TH[lvl] ?? DEFAULTS[lvl];

    // limpar marcas só neste crime
    qq('.tm-oc-tile-below', crime).forEach(el=>el.classList.remove('tm-oc-tile-below'));
    qq('.tm-oc-below-target', crime).forEach(el=>el.classList.remove('tm-oc-below-target')); // limpeza de versões antigas

    qq('button[class*="slotHeader"]', crime).forEach(h=>{
      const sc = h.querySelector('[class*="successChance"]');
      const pct = num(sc?.textContent);
      if(Number.isFinite(pct)){
        const tile = findMemberTileFromHeader(h, crime);
        if(tile){
          // aplica no WRAPPER (tile) para cobrir header + body
          tile.classList.toggle('tm-oc-tile-below', pct < target);
        }
      }
    });
  }

  function analyzeAll(){
    qq('.tm-oc-tile-below').forEach(el=>el.classList.remove('tm-oc-tile-below'));
    qq('[data-oc-id]').forEach(analyzeCrime);
  }

  /* ------------------------ observers/setup ---------------------- */
  let t=null;
  const scheduleAnalyze=(ms=80)=>{ clearTimeout(t); t=setTimeout(analyzeAll, ms); };

  function attachObservers(){
    const obs = new MutationObserver(muts=>{
      if(muts.some(m=>m.addedNodes.length || m.removedNodes.length)) scheduleAnalyze(150);
    });
    obs.observe(document.body, {childList:true, subtree:true});
    setInterval(()=>scheduleAnalyze(0), 4000);
    window.addEventListener('hashchange', ()=>scheduleAnalyze(250));
    window.addEventListener('popstate',  ()=>scheduleAnalyze(250));
  }

  (async function init(){
    buildUI();
    for(let i=0;i<150;i++){
      if(q('[data-oc-id]')) break;
      await sleep(100);
    }
    analyzeAll();
    attachObservers();
  })();

})();
