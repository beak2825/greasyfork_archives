// ==UserScript==
// @name         Profile-names-CLEAR
// @namespace    https://www.torn.com/
// @version      1.21
// @description  Floating Settings (font: system/google/custom, size, bold, color, align) + proper alignment inside honor badge.
// @author       SuperGogu[3580072]
// @match        https://www.torn.com/*
// @run-at       document-end
// @license      Apache-2.0
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/531838/Profile-names-CLEAR.user.js
// @updateURL https://update.greasyfork.org/scripts/531838/Profile-names-CLEAR.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SETTINGS_KEY = 'pnc_settings_v3';
  const DEFAULTS = {
    fontSource: 'system',
    googleFamily: '',
    fontFamily: 'Tahoma, serif',
    fontSize: 12,
    bold: false,
    color: '#ffffff',
    align: 'left', // left | center | right
    panel: { x: 24, y: 80, visible: true }
  };

  const load = k => { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } };
  const save = (k,v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  const clamp = (n,a,b) => Math.max(a, Math.min(b, n));
  const isMobile = () => /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  const normHex = c => { if(!c) return '#ffffff'; c=c.trim(); if(!c.startsWith('#')) c='#'+c; return /^#([0-9a-fA-F]{6})$/.test(c)?c:'#ffffff'; };

  let settings = Object.assign({}, DEFAULTS, load(SETTINGS_KEY) || {});
  if (!load(SETTINGS_KEY)) save(SETTINGS_KEY, settings);

  const SYSTEM_FONT_CANDIDATES = ['Arial','Verdana','Tahoma','Trebuchet MS','Segoe UI','Calibri','Cambria','Georgia','Times New Roman','Courier New','Consolas','Menlo','Monaco','Lucida Console','Lucida Sans Unicode','Helvetica Neue','Helvetica','Ubuntu','Cantarell','Roboto','Noto Sans','Noto Serif','Source Sans Pro','Inter'];
  const GOOGLE_FONTS = ['Inter','Roboto','Open Sans','Lato','Montserrat','Poppins','Nunito','Raleway','Oswald','Merriweather','Playfair Display','Source Sans 3','Noto Sans','Noto Serif','Rubik','Quicksand','Work Sans','IBM Plex Sans'];

  // ---------- CSS (fix alignment inside badge) ----------
  function injectCSS(){
    const css = `
    .pnc-panel, .pnc-panel * { box-sizing: border-box; }
    .pnc-panel{
      position:fixed; top:${settings.panel.y}px; left:${settings.panel.x}px; width:300px;
      background:#1e2227; color:#eaecef; border:1px solid #3a3f45; border-radius:10px;
      box-shadow:0 12px 30px rgba(0,0,0,.35); z-index:2147483647;
      font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Arial,Helvetica Neue,Noto Sans,Emoji;
    }
    .pnc-panel.hidden{ display:none; }
    .pnc-panel-header{ padding:10px 12px; border-bottom:1px solid #2e3338; font-size:14px; font-weight:600; cursor:move; display:flex; align-items:center; justify-content:space-between; user-select:none; }
    .pnc-close{ cursor:pointer; padding:2px 8px; border-radius:6px; background:#2b2f36; }
    .pnc-panel-body{ padding:12px; display:grid; gap:12px; font-size:13px; }
    .pnc-field label{ display:block; margin-bottom:6px; color:#b7c0cc; font-size:12px; }
    .pnc-select, .pnc-input{ width:100%; max-width:100%; padding:8px 10px; background:#262b31; border:1px solid #3a4047; color:#eaecef; border-radius:8px; outline:none; }
    .pnc-row{ display:grid; grid-template-columns:1fr auto; gap:8px; align-items:center; }
    .pnc-seg{ display:grid; grid-template-columns:repeat(3,1fr); gap:6px; }
    .pnc-seg button{ padding:6px 8px; background:#262b31; border:1px solid #3a4047; color:#eaecef; border-radius:8px; cursor:pointer; }
    .pnc-seg button.active{ background:#3a3f45; }
    .pnc-color{ appearance:none; -webkit-appearance:none; width:32px; height:32px; padding:0; border:1px solid #3a4047; border-radius:999px; background:conic-gradient(red, yellow, lime, cyan, blue, magenta, red); cursor:pointer; }
    .pnc-color::-webkit-color-swatch-wrapper { padding:0; border-radius:999px; }
    .pnc-color::-webkit-color-swatch { border:none; border-radius:999px; }
    .pnc-gear-btn{ position:fixed; bottom:16px; right:auto; left:16px; width:36px; height:36px; line-height:36px; text-align:center; border-radius:50%; background:#2b2f36; color:#fff; cursor:pointer; z-index:2147483647; font-weight:700; box-shadow:0 4px 12px rgba(0,0,0,.3); user-select:none; }
    .pnc-row-left{ display:flex; align-items:center; justify-content:flex-start; gap:8px; }
    .pnc-row-left input[type="checkbox"]{ margin:0; }


    /* --- KEY FIX: keep name inside honor badge and let text-align work --- */
    .honor-text-wrap .honor-text-svg{
      position:absolute !important;
      left:0 !important; right:0 !important;
      width:100% !important;
      top:50% !important;
      transform:translateY(-50%) !important;   /* vertical center only */
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      padding:0 2px;
    }
    /* Hide duplicate original text to avoid shifting */
    .honor-text-wrap .honor-text-svg + .honor-text{ display:none !important; }
    `;
    const s=document.createElement('style'); s.id='pnc-style'; s.textContent=css; document.head.appendChild(s);
  }

  // ---------- Google Fonts ----------
  function ensureLink(id, href, rel, crossorigin){ if (document.getElementById(id)) return; const l=document.createElement('link'); l.id=id; l.rel=rel; l.href=href; if (crossorigin) l.crossOrigin='anonymous'; document.head.appendChild(l); }
  function loadGoogleFont(family){
    const urlFamily = family.replace(/ /g,'+');
    ensureLink('pnc-preconnect-gf1','https://fonts.googleapis.com','preconnect');
    ensureLink('pnc-preconnect-gf2','https://fonts.gstatic.com','preconnect', true);
    let link=document.getElementById('pnc-google-font');
    if(!link){ link=document.createElement('link'); link.id='pnc-google-font'; link.rel='stylesheet'; document.head.appendChild(link); }
    link.href=`https://fonts.googleapis.com/css2?family=${urlFamily}:wght@400;700&display=swap`;
  }

  // ---------- System font detection ----------
  function isFontPresent(font){
    const testStr='mmmmmmmmmmlliWWWWW', bases=['monospace','sans-serif','serif'];
    const body=document.body||document.documentElement, def={}, spans={};
    bases.forEach(base=>{ const s=document.createElement('span'); s.style.position='absolute'; s.style.left='-9999px'; s.style.fontSize='72px'; s.style.fontFamily=base; s.textContent=testStr; body.appendChild(s); def[base]=s.getBoundingClientRect().width; spans[base]=s; });
    let ok=false; bases.forEach(base=>{ spans[base].style.fontFamily=`"${font}", ${base}`; if (spans[base].getBoundingClientRect().width!==def[base]) ok=true; });
    bases.forEach(base=>spans[base].remove()); return ok;
  }

  // ---------- Apply styles ----------
  function styleHonor(el){
    el.style.fontFamily = settings.fontFamily;
    el.style.fontSize   = `${parseInt(settings.fontSize,10)||12}px`;
    el.style.fontWeight = settings.bold ? '700' : '400';
    el.style.color      = normHex(settings.color);
    el.style.textAlign  = settings.align;
    el.style.borderRadius = '5px';
    if (isMobile()) el.style.textShadow='2px 2px 3px #000';
    else el.style.textShadow='4px 4px 5px #000';
  }

  function processHonor(){
    const list = document.querySelectorAll('.honor-text-svg');
    list.forEach(el=>{
      if(!el.dataset.cleaned){
        // merge spans if needed
        const spans=el.querySelectorAll('span[data-char]');
        if(spans.length){
          let t=''; spans.forEach(s=> t += s.getAttribute('data-char'));
          el.textContent=t;
        }
        el.dataset.cleaned='true';
      }
      // hide duplicate native text (next sibling)
      const sib = el.nextElementSibling;
      if (sib && sib.classList.contains('honor-text')) sib.style.display='none';
      styleHonor(el);
    });
  }

  // ---------- UI ----------
  let panelRef=null;
  function createUI(){
    const gear=document.createElement('div');
    gear.className='pnc-gear-btn'; gear.title='Settings'; gear.textContent='⚙️';
    gear.addEventListener('click', openPanel); document.body.appendChild(gear);

    const panel=document.createElement('div');
    panel.className='pnc-panel'+(settings.panel.visible?'':' hidden');
    panel.innerHTML=`
      <div class="pnc-panel-header" id="pnc-drag">
        <span>Profile-names-CLEAR • Settings</span>
        <span class="pnc-close" id="pnc-close">✕</span>
      </div>
      <div class="pnc-panel-body">
        <div class="pnc-field">
          <label for="pnc-font-select">Font</label>
          <select id="pnc-font-select" class="pnc-select"></select>
        </div>
        <div class="pnc-field" id="pnc-custom-wrap" style="display:none;">
          <label for="pnc-font-custom">Custom</label>
          <input id="pnc-font-custom" class="pnc-input" type="text" placeholder='"Tahoma, serif"'>
        </div>
        <div class="pnc-field">
          <label for="pnc-size">Size</label>
          <div class="pnc-row"><input id="pnc-size" class="pnc-input" type="number" min="8" max="48" step="1"></div>
        </div>
        <div class="pnc-field">
          <label>Bold</label>
          <div class="pnc-row-left"><input id="pnc-bold" type="checkbox"></div>
        </div>
        <div class="pnc-field">
          <label>Color</label>
          <input id="pnc-color" class="pnc-color" type="color">
        </div>
        <div class="pnc-field">
          <label>Align</label>
          <div class="pnc-seg" id="pnc-align">
            <button type="button" data-align="left">Left</button>
            <button type="button" data-align="center">Center</button>
            <button type="button" data-align="right">Right</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(panel); panelRef=panel;

    const fontSelect=panel.querySelector('#pnc-font-select');
    const customWrap=panel.querySelector('#pnc-custom-wrap');
    const customInput=panel.querySelector('#pnc-font-custom');
    const sizeInput=panel.querySelector('#pnc-size');
    const boldInput=panel.querySelector('#pnc-bold');
    const colorInput=panel.querySelector('#pnc-color');
    const alignSeg=panel.querySelector('#pnc-align');

    (function buildSystem(){
      const available=SYSTEM_FONT_CANDIDATES.filter(isFontPresent);
      const og=document.createElement('optgroup'); og.label='System';
      available.forEach(n=>{ const o=document.createElement('option'); o.value=`sys:${n}`; o.textContent=n; og.appendChild(o); });
      if(!available.length){ const o=document.createElement('option'); o.disabled=true; o.textContent='(none detected)'; og.appendChild(o); }
      fontSelect.appendChild(og);
    })();
    (function buildGoogle(){
      const og=document.createElement('optgroup'); og.label='Google';
      GOOGLE_FONTS.forEach(n=>{ const o=document.createElement('option'); o.value=`g:${n}`; o.textContent=n; og.appendChild(o); });
      fontSelect.appendChild(og);
    })();
    (function buildCustom(){
      const og=document.createElement('optgroup'); og.label='Other';
      const opt=document.createElement('option'); opt.value='custom'; opt.textContent='Custom';
      og.appendChild(opt); fontSelect.appendChild(og);
    })();

    sizeInput.value=parseInt(settings.fontSize,10);
    boldInput.checked=!!settings.bold;
    colorInput.value=normHex(settings.color);

    function setInitialFontSelection(){
      if (settings.fontSource==='google' && settings.googleFamily){
        fontSelect.value=`g:${settings.googleFamily}`; customWrap.style.display='none';
      } else if (settings.fontSource==='system'){
        const first=(settings.fontFamily||'').split(',')[0].replace(/["']/g,'').trim();
        const sysVal=`sys:${first}`;
        if ([...fontSelect.options].some(o=>o.value===sysVal)){ fontSelect.value=sysVal; customWrap.style.display='none'; }
        else { fontSelect.value='custom'; customWrap.style.display=''; }
      } else { fontSelect.value='custom'; customWrap.style.display=''; }
      customInput.value=settings.fontFamily;
    }
    setInitialFontSelection();

    function updateAlignUI(){ alignSeg.querySelectorAll('button').forEach(b=> b.classList.toggle('active', b.dataset.align===settings.align)); }
    updateAlignUI();

    fontSelect.addEventListener('change', ()=>{
      const v=fontSelect.value;
      if (v.startsWith('sys:')){ const n=v.slice(4); settings.fontSource='system'; settings.googleFamily=''; settings.fontFamily=`"${n}", sans-serif`; customWrap.style.display='none'; const l=document.getElementById('pnc-google-font'); if(l) l.remove(); }
      else if (v.startsWith('g:')){ const f=v.slice(2); settings.fontSource='google'; settings.googleFamily=f; settings.fontFamily=`"${f}", sans-serif`; customWrap.style.display='none'; loadGoogleFont(f); }
      else { settings.fontSource='custom'; customWrap.style.display=''; }
      save(SETTINGS_KEY, settings); applyNow();
    });

    customInput.addEventListener('input', ()=>{ settings.fontSource='custom'; settings.fontFamily=(customInput.value||DEFAULTS.fontFamily).trim(); save(SETTINGS_KEY, settings); applyNow(); });
    sizeInput.addEventListener('input', ()=>{ settings.fontSize=clamp(parseInt(sizeInput.value,10)||DEFAULTS.fontSize,8,48); save(SETTINGS_KEY, settings); applyNow(); });
    boldInput.addEventListener('change', ()=>{ settings.bold=!!boldInput.checked; save(SETTINGS_KEY, settings); applyNow(); });
    colorInput.addEventListener('input', ()=>{ settings.color=normHex(colorInput.value); save(SETTINGS_KEY, settings); applyNow(); });
    alignSeg.querySelectorAll('button').forEach(btn=> btn.addEventListener('click', ()=>{ settings.align=btn.dataset.align; save(SETTINGS_KEY, settings); updateAlignUI(); applyNow(); }));

    panel.querySelector('#pnc-close').addEventListener('click', ()=>{ settings.panel.visible=false; save(SETTINGS_KEY, settings); panel.classList.add('hidden'); });

    makeMovable(panel, panel.querySelector('#pnc-drag'));

    if (typeof GM_registerMenuCommand==='function'){ GM_registerMenuCommand('PNC: Open Settings', openPanel); }
  }

  function makeMovable(box, handle){
    let sx=0, sy=0, sl=0, st=0, drag=false;
    const down=e=>{ drag=true; sx=e.clientX; sy=e.clientY; const r=box.getBoundingClientRect(); sl=r.left; st=r.top; document.addEventListener('pointermove', move); document.addEventListener('pointerup', up, {once:true}); };
    const move=e=>{ if(!drag) return; box.style.left=`${sl+(e.clientX-sx)}px`; box.style.top=`${st+(e.clientY-sy)}px`; };
    const up=()=>{ drag=false; document.removeEventListener('pointermove', move); const r=box.getBoundingClientRect(); settings.panel.x=Math.round(r.left); settings.panel.y=Math.round(r.top); save(SETTINGS_KEY, settings); };
    handle.style.touchAction='none'; handle.addEventListener('pointerdown', down);
  }

  function openPanel(){ if (!panelRef) return; settings.panel.visible=true; save(SETTINGS_KEY, settings); panelRef.classList.remove('hidden'); }
  function applyNow(){ document.querySelectorAll('.honor-text-svg').forEach(styleHonor); }

  function start(){
    if (!document.body) return setTimeout(start, 50);
    injectCSS();
    createUI();
    processHonor();
    if (settings.fontSource==='google' && settings.googleFamily) loadGoogleFont(settings.googleFamily);
    const obs=new MutationObserver(processHonor); obs.observe(document.body, { childList:true, subtree:true });
    if (settings.panel.visible && panelRef) panelRef.classList.remove('hidden');
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
