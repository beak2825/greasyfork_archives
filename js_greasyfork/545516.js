// ==UserScript==
// @name         CellCraft Visual Mod: Skins & Name Colors (S E N S E)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Change how skins and names look in CellCraft (local only) + S E N S E menu
// @author       S E N S E
// @license      S E N S E
// @match        *://cellcraft.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545516/CellCraft%20Visual%20Mod%3A%20Skins%20%20Name%20Colors%20%28S%20E%20N%20S%20E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545516/CellCraft%20Visual%20Mod%3A%20Skins%20%20Name%20Colors%20%28S%20E%20N%20S%20E%29.meta.js
// ==/UserScript==

(function(){
  'use strict';

  /* -------------------------
     Helper: localStorage helpers
     -------------------------*/
  const KEY = 'sense_cell_mod_v1';
  const defaults = {
    mySkinUrl: '',
    myNameColor: '#00ff00',
    othersSkinUrl: '',       // a default skin to replace others with
    othersNameColor: '#ff00ff',
    replacements: {}         // mapping exact names -> {skinUrl, color}
  };
  function loadState(){
    try {
      const raw = localStorage.getItem(KEY);
      if(!raw) return {...defaults};
      return Object.assign({}, defaults, JSON.parse(raw));
    } catch(e){ return {...defaults}; }
  }
  function saveState(s){ localStorage.setItem(KEY, JSON.stringify(s)); }

  let state = loadState();

  /* -------------------------
     UI: Collapsible S E N S E menu (right side)
     -------------------------*/
  function makeMenu(){
    const wrapper = document.createElement('div');
    wrapper.id = 'sense-menu';
    Object.assign(wrapper.style, {
      position: 'fixed',
      top: '12vh',
      right: '12px',
      zIndex: 999999,
      fontFamily: 'Arial, sans-serif',
      userSelect: 'none'
    });

    // collapsed button
    const button = document.createElement('button');
    button.innerText = 'S E N S E';
    Object.assign(button.style, {
      width: '48px',
      height: '48px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(90deg,#0f172a,#0ea5a0)',
      color: '#fff',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
    });

    // panel
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      width: '260px',
      padding: '10px',
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      borderRadius: '8px',
      marginTop: '8px',
      display: 'none',
      fontSize: '13px',
      boxShadow: '0 6px 18px rgba(0,0,0,0.5)'
    });

    panel.innerHTML = `
      <div style="font-weight:700; margin-bottom:6px">CellCraft Visual Mod</div>
      <div style="font-size:12px; opacity:0.85; margin-bottom:6px">By S E N S E — local visual changes only</div>

      <div style="margin-bottom:8px">
        <div style="font-weight:600">My Skin (image URL)</div>
        <input id="sense-my-skin" placeholder="https://image.png" style="width:100%; margin-top:4px; padding:6px; border-radius:4px; border:none"/>
        <button id="sense-my-skin-set" style="margin-top:6px;padding:6px;border-radius:4px;border:none;cursor:pointer">Apply My Skin</button>
      </div>

      <div style="margin-bottom:8px">
        <div style="font-weight:600">My Name Color</div>
        <input id="sense-my-color" type="color" style="width:44px;height:32px;margin-top:4px;border:0;padding:0"/>
        <button id="sense-my-color-set" style="margin-left:8px;padding:6px;border-radius:4px;border:none;cursor:pointer">Set</button>
      </div>

      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06); margin:8px 0"/>

      <div style="margin-bottom:8px">
        <div style="font-weight:600">Replace Others' Skin (URL)</div>
        <input id="sense-others-skin" placeholder="https://image.png" style="width:100%; margin-top:4px; padding:6px; border-radius:4px; border:none"/>
        <button id="sense-others-skin-set" style="margin-top:6px;padding:6px;border-radius:4px;border:none;cursor:pointer">Apply to Others</button>
      </div>

      <div style="margin-bottom:8px">
        <div style="font-weight:600">Replace Others' Name Color</div>
        <input id="sense-others-color" type="color" style="width:44px;height:32px;margin-top:4px;border:0;padding:0"/>
        <button id="sense-others-color-set" style="margin-left:8px;padding:6px;border-radius:4px;border:none;cursor:pointer">Set</button>
      </div>

      <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06); margin:8px 0"/>

      <div style="margin-bottom:8px">
        <div style="font-weight:600">Per-player Overrides</div>
        <div style="font-size:12px; opacity:0.9; margin-bottom:6px">Exact name match</div>
        <input id="sense-name-key" placeholder="PlayerName" style="width:48%; padding:6px; border-radius:4px; border:none;"/>
        <input id="sense-name-skin" placeholder="skin URL" style="width:48%; padding:6px; border-radius:4px; border:none; float:right"/>
        <input id="sense-name-color" type="color" style="margin-top:6px;"/>
        <button id="sense-add-repl" style="display:block;margin-top:6px;padding:6px;border-radius:4px;border:none;cursor:pointer">Add / Save Override</button>
        <div id="sense-repl-list" style="margin-top:8px; max-height:90px; overflow:auto; font-size:12px"></div>
      </div>

      <div style="text-align:right; margin-top:8px">
        <button id="sense-reset" style="padding:6px;border-radius:6px;border:none;cursor:pointer">Reset</button>
      </div>
    `;

    wrapper.appendChild(button);
    wrapper.appendChild(panel);
    document.body.appendChild(wrapper);

    // restore inputs
    const inMySkin = panel.querySelector('#sense-my-skin');
    const inMyColor = panel.querySelector('#sense-my-color');
    const inOthersSkin = panel.querySelector('#sense-others-skin');
    const inOthersColor = panel.querySelector('#sense-others-color');

    inMySkin.value = state.mySkinUrl || '';
    inMyColor.value = state.myNameColor || '#00ff00';
    inOthersSkin.value = state.othersSkinUrl || '';
    inOthersColor.value = state.othersNameColor || '#ff00ff';

    // Toggle panel
    button.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    // Buttons
    panel.querySelector('#sense-my-skin-set').addEventListener('click', () => {
      state.mySkinUrl = inMySkin.value.trim();
      saveState(state);
      flash('Applied: my skin');
    });
    panel.querySelector('#sense-my-color-set').addEventListener('click', () => {
      state.myNameColor = inMyColor.value;
      saveState(state);
      flash('Applied: my name color');
    });
    panel.querySelector('#sense-others-skin-set').addEventListener('click', () => {
      state.othersSkinUrl = inOthersSkin.value.trim();
      saveState(state);
      flash('Applied: others skin');
    });
    panel.querySelector('#sense-others-color-set').addEventListener('click', () => {
      state.othersNameColor = inOthersColor.value;
      saveState(state);
      flash('Applied: others name color');
    });

    // per-player overrides
    const nameKey = panel.querySelector('#sense-name-key');
    const nameSkin = panel.querySelector('#sense-name-skin');
    const nameColor = panel.querySelector('#sense-name-color');
    const addBtn = panel.querySelector('#sense-add-repl');
    const replList = panel.querySelector('#sense-repl-list');

    function renderReplList(){
      replList.innerHTML = '';
      const keys = Object.keys(state.replacements || {});
      if(keys.length === 0){ replList.innerHTML = '<i style="opacity:0.7">No overrides</i>'; return; }
      keys.forEach(k => {
        const v = state.replacements[k] || {};
        const div = document.createElement('div');
        div.style.padding = '6px';
        div.style.borderBottom = '1px solid rgba(255,255,255,0.03)';
        div.innerHTML = `<b>${escapeHtml(k)}</b> — color: <span style="color:${v.color||'#fff'}">${v.color||'—'}</span> — skin: ${v.skin ? '<a href="'+escapeHtml(v.skin)+'" target="_blank">link</a>' : '—'} <button data-name="${escapeHtml(k)}" style="float:right">Remove</button>`;
        replList.appendChild(div);
      });
      replList.querySelectorAll('button').forEach(btn=>{
        btn.addEventListener('click', (ev)=>{
          const key = ev.target.getAttribute('data-name');
          delete state.replacements[key];
          saveState(state);
          renderReplList();
          flash('Removed override');
        });
      });
    }
    addBtn.addEventListener('click', ()=>{
      const k = nameKey.value.trim();
      if(!k){ flash('Enter exact player name'); return; }
      state.replacements[k] = {
        skin: nameSkin.value.trim() || null,
        color: nameColor.value || null
      };
      saveState(state);
      renderReplList();
      flash('Saved override for: ' + k);
      nameKey.value = ''; nameSkin.value = '';
    });

    panel.querySelector('#sense-reset').addEventListener('click', ()=>{
      if(confirm('Reset all S E N S E visual settings?')){
        state = {...defaults};
        saveState(state);
        inMySkin.value = ''; inMyColor.value = '#00ff00';
        inOthersSkin.value = ''; inOthersColor.value = '#ff00ff';
        renderReplList();
        flash('Reset done');
      }
    });

    renderReplList();
  }

  function escapeHtml(s){ return String(s).replace(/[&<>"'`]/g, (c)=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;' }[c])); }

  function flash(msg){
    const b = document.createElement('div');
    b.innerText = msg;
    Object.assign(b.style, {
      position:'fixed', left:'50%', transform:'translateX(-50%)',
      bottom:'20px', padding:'8px 12px', background:'rgba(0,0,0,0.8)',
      color:'#fff', borderRadius:'8px', zIndex:999999
    });
    document.body.appendChild(b);
    setTimeout(()=>b.remove(), 1800);
  }

  /* -------------------------
     Intercept drawing: drawImage + fillText
     We'll attempt to replace skin images and name colors on-the-fly.
     This is heuristic-based: it changes images/text as they're drawn.
     -------------------------*/

  // small cache for replacement images
  const replacementImageCache = new Map();
  function getReplacementImage(url){
    if(!url) return null;
    if(replacementImageCache.has(url)) return replacementImageCache.get(url);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    replacementImageCache.set(url, img);
    return img;
  }

  // Hook drawImage to swap skin images with user-provided images.
  const origDrawImage = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function(...args){
    try {
      // args[0] can be an Image, Canvas, Video, or HTMLImageElement
      const source = args[0];
      if(source && source.src && typeof source.src === 'string'){
        const src = source.src;
        // Heuristics: skins/players images often have 'skin' or 'player' in url or are small sprites.
        // We'll apply replacement for:
        //  - if this image is likely a player-sprite by size (e.g., small) OR user set replacements.
        // Replace logic:
        // 1) if there is exact override for a name — we can't know name here, skip.
        // 2) if source corresponds to your own skin (we can't know either), use state.mySkinUrl for any matching sprite pattern.
        // 3) if state.othersSkinUrl exists, and src looks like a skin sprite, swap to that.
        const low = src.toLowerCase();
        const looksLikeSkin = /skin|player|cell|blob|sprite|avatar|face|body/.test(low) || (/\.png$|\.jpg$|\.jpeg$/.test(low) && (source.naturalWidth <= 256 && source.naturalHeight <= 256));
        if(looksLikeSkin){
          // Prefer user-specific URLs if present
          const replUrl = state.othersSkinUrl || state.mySkinUrl;
          if(replUrl){
            const replImg = getReplacementImage(replUrl);
            if(replImg && replImg.complete){
              // draw replacement image instead of original but keep drawing args (position + size)
              args[0] = replImg;
            } else {
              // Not yet loaded: attempt to draw and let browser fetch; still safe to call original
              replImg && replImg.addEventListener('load', ()=>{ /* will be used next draws */ });
            }
          }
        }
      }
    } catch(e){ /* fail silently */ }
    return origDrawImage.apply(this, args);
  };

  // We'll override fillStyle temporarily when drawing names.
  const origFillText = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth){
    try {
      if(typeof text === 'string' && text.length > 0 && text.length < 60){
        const t = text.trim();

        // exact override
        if(state.replacements && state.replacements[t]){
          const color = state.replacements[t].color || state.othersNameColor || state.myNameColor;
          if(color){
            const prev = this.fillStyle;
            this.fillStyle = color;
            const res = origFillText.apply(this, arguments);
            this.fillStyle = prev;
            return res;
          }
        }

        // if text equals "You" or your own name heuristic: use myNameColor
        // We attempt to detect your name by reading DOM username if present (fallback).
        const myName = detectMyName();
        if(myName && t === myName){
          const prev = this.fillStyle;
          this.fillStyle = state.myNameColor || prev;
          const res = origFillText.apply(this, arguments);
          this.fillStyle = prev;
          return res;
        }

        // Otherwise, if othersNameColor set, color other players
        if(state.othersNameColor){
          // Avoid coloring UI texts by simple heuristics: names are usually short (<24) and not contain colons or spaces-only strings.
          if(t.length <= 24 && !/[:\[\]\(\)]/.test(t)){
            const prev = this.fillStyle;
            this.fillStyle = state.othersNameColor;
            const res = origFillText.apply(this, arguments);
            this.fillStyle = prev;
            return res;
          }
        }
      }
    } catch(e){ /* ignore */ }
    return origFillText.apply(this, arguments);
  };

  // Attempt to discover player's name from page (some games have an input or label)
  function detectMyName(){
    // Many .io games have an input#nick or input[name=nick] — try a few guesses
    const selectors = ['input[name="nick"]','input#nick','input#name','input[name="name"]','input[type="text"]'];
    for(const s of selectors){
      const el = document.querySelector(s);
      if(el && el.value && el.value.trim().length>0) return el.value.trim();
    }
    // fallback: look for elements containing "Nickname" or "Name" — but avoid heavy querying
    return null;
  }

  /* -------------------------
     Small periodic refresh to pick up new state and ensure everything loads
     -------------------------*/
  function refreshState(){
    state = loadState();
  }
  setInterval(refreshState, 2000);

  /* -------------------------
     Create UI after page load
     -------------------------*/
  window.addEventListener('load', () => {
    try { makeMenu(); } catch(e){ console.error('SENSE UI failed', e); }
  });

  // quick apply if script injected after load
  setTimeout(()=>{ try { makeMenu(); } catch(e){} }, 1500);

})();