// ==UserScript==
// @name         Gartic.io Pro Drawing Assist (Sparkle UI + Grid + Guides + DnD)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Reference overlay + grid + shape guides + color helper for Gartic.io. URL/file/drag-n-drop, drag/scale/rotate/opacity/lock/reset/clear, glittery UI, and hotkeys.
// @match        *://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545951/Garticio%20Pro%20Drawing%20Assist%20%28Sparkle%20UI%20%2B%20Grid%20%2B%20Guides%20%2B%20DnD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545951/Garticio%20Pro%20Drawing%20Assist%20%28Sparkle%20UI%20%2B%20Grid%20%2B%20Guides%20%2B%20DnD%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- Styles ----------
  const css = `
  :root {
    --da-bg: rgba(18,18,30,.96);
    --da-panel-w: 280px;
    --da-accent1:#ff6eb4;
    --da-accent2:#ff9bd3;
    --da-text:#fff;
  }
  #da-panel, #da-color {
    position: fixed; top: 20px; left: 20px; z-index: 999999; width: var(--da-panel-w);
    background: var(--da-bg); color: var(--da-text); border-radius: 14px; padding: 12px;
    box-shadow: 0 10px 30px rgba(255, 150, 200, 0.35); font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    user-select: none; overflow: hidden;
  }
  #da-color { top: 20px; left: calc(20px + var(--da-panel-w) + 12px); }
  /* Sparkles only inside panels */
  #da-panel::before, #da-color::before{
    content: ""; position: absolute; inset: -50% -50%;
    background:
      radial-gradient(2px 2px at 20% 30%, #ffffffcc, transparent 40%),
      radial-gradient(2px 2px at 80% 70%, #ff69b4cc, transparent 40%),
      radial-gradient(2px 2px at 50% 50%, #ffd700cc, transparent 40%);
    animation: da-spark 4s linear infinite; pointer-events: none;
  }
  @keyframes da-spark { from{transform:translate(0,0)} to{transform:translate(-35%,-35%)} }
  h3{margin:0 0 8px 0; text-align:center; font-size:16px; color:#ffd1e9}
  .da-row{margin-top:8px}
  input[type="text"], input[type="file"], input[type="number"]{
    width:100%; background:#1f1f2b; color:#fff; border:1px solid #3a3a4d; border-radius:8px; padding:6px 8px; font-size:13px; box-sizing:border-box; outline:none;
  }
  input[type="text"]:focus{ border-color:#ff7abf; box-shadow:0 0 0 3px rgba(255,122,191,.2) }
  .da-label{font-size:12px;opacity:.9;display:flex;justify-content:space-between}
  input[type="range"]{ -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:999px; background:linear-gradient(90deg,#ff7abf,#ffd1e9); outline:none; margin-top:4px}
  input[type="range"]::-webkit-slider-thumb{ -webkit-appearance:none; width:16px;height:16px;border-radius:50%;background:#fff;border:2px solid #ff7abf; box-shadow:0 0 10px rgba(255,122,191,.7); cursor:pointer}
  .da-flex{display:flex; gap:8px}
  .da-col{flex:1}
  .da-btn{
    width:100%; padding:9px 10px; border:none; border-radius:10px; font-weight:700; font-size:14px; color:#fff; cursor:pointer; margin-top:8px;
    background:linear-gradient(120deg,var(--da-accent1),var(--da-accent2),var(--da-accent1)); background-size:220% 220%;
    box-shadow:0 8px 20px rgba(255,110,180,.35); transition:transform .15s ease, box-shadow .2s ease, opacity .2s ease; position:relative; overflow:hidden;
  }
  .da-btn:hover{ transform:translateY(-1px); box-shadow:0 12px 26px rgba(255,110,180,.5) }
  .da-btn::after{ content:""; position:absolute; top:0; left:-150%; width:120%; height:100%;
    background:linear-gradient(120deg,transparent 0%,rgba(255,255,255,.35) 50%,transparent 100%); transform:skewX(-20deg); animation:da-glitter 3s linear infinite}
  @keyframes da-glitter { 0%{left:-150%} 60%{left:110%} 100%{left:110%} }
  .gray{ background-image:linear-gradient(120deg,#607d8b,#8aa2ad,#607d8b) }
  .warn{ background-image:linear-gradient(120deg,#ff9800,#ffc36a,#ff9800) }
  .danger{ background-image:linear-gradient(120deg,#e53935,#ff6b66,#e53935) }
  #da-show{
    position:fixed; top:20px; left:20px; z-index:1000000; display:none; padding:8px 12px; border-radius:10px; border:none; font-weight:800; color:#fff; cursor:pointer;
    background:linear-gradient(120deg,#2196f3,#64b5f6,#2196f3); background-size:220% 220%; box-shadow:0 8px 20px rgba(33,150,243,.35)
  }
  #da-overlay{
    position:absolute; top:100px; left:100px; width:380px; height:auto; opacity:.7; transform-origin:center center; pointer-events:auto; z-index:999998;
    user-select:none; -webkit-user-drag:none; cursor:grab;
  }
  /* Grid canvas overlay (over content, not blocking clicks) */
  #da-grid{
    position:fixed; inset:0; pointer-events:none; z-index:999997; opacity:.4; display:none;
  }
  /* Guides */
  .da-guide{ position:absolute; border:2px dashed rgba(255,206,230,.9); z-index:999999; cursor:move; box-shadow:0 0 10px rgba(255,110,180,.35) inset }
  .da-circle{ border-radius:50% }
  .da-handle{ position:absolute; width:10px;height:10px;background:#ffd1e9;border:2px solid #ff7abf;border-radius:50%; z-index:9999999; cursor:nwse-resize }
  .da-handle.br{ right:-7px; bottom:-7px }
  .da-handle.tl{ left:-7px; top:-7px }
  /* Color panel */
  #da-color .swatch{ display:flex; gap:8px; flex-wrap:wrap; margin-top:8px }
  #da-color .swatch button{ width:22px;height:22px;border-radius:6px;border:none;cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,.25) }
  #da-color .mini{ display:flex; gap:8px; margin-top:8px }
  #da-color input[type="color"]{ width:100%; height:40px; border:none; border-radius:8px; padding:0 }
  #da-copy{ margin-top:8px }
  .da-help{ font-size:11px; opacity:.85; margin-top:8px; line-height:1.35 }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- Main Panel ----------
  const panel = document.createElement('div');
  panel.id = 'da-panel';
  panel.innerHTML = `
    <h3>✨ Drawing Assist</h3>
    <div class="da-row"><input type="text" id="da-url" placeholder="Paste image URL & press Enter"></div>
    <div class="da-row"><input type="file" id="da-file" accept="image/*"></div>
    <div class="da-row"><div class="da-label"><span>Opacity</span><span id="da-op-val">0.70</span></div>
      <input type="range" id="da-op" min="0" max="1" step="0.01" value="0.70"></div>
    <div class="da-row"><div class="da-label"><span>Scale</span><span id="da-sc-val">1.00×</span></div>
      <input type="range" id="da-sc" min="0.10" max="3.00" step="0.05" value="1.00"></div>
    <div class="da-row"><div class="da-label"><span>Rotate</span><span id="da-rt-val">0°</span></div>
      <input type="range" id="da-rt" min="0" max="360" step="1" value="0"></div>
    <div class="da-row"><label style="font-size:12px; display:flex; align-items:center; gap:8px;">
      <input type="checkbox" id="da-lock"> Lock image position</label></div>
    <div class="da-flex">
      <button class="da-btn gray" id="da-grid-toggle">Grid: Off</button>
      <button class="da-btn gray" id="da-grid-settings">⚙</button>
    </div>
    <div class="da-flex">
      <button class="da-btn" id="da-circle-toggle">Circle Guide</button>
      <button class="da-btn" id="da-rect-toggle">Rect Guide</button>
    </div>
    <button class="da-btn danger" id="da-clear">Clear Image</button>
    <button class="da-btn warn"   id="da-reset">Reset Transform/Pos</button>
    <button class="da-btn gray"   id="da-hide">Hide UI</button>
    <div class="da-help">
      <b>Hotkeys:</b> H (UI), G (grid), C (circle), V (rect), Arrows (move), +/- (scale), , . (rotate), [ ] (opacity), R (reset), Del (clear). Shift = bigger steps. Drag & drop an image onto the page to load it.
    </div>
  `;
  document.body.appendChild(panel);

  // ---------- Color Helper Panel ----------
  const colorPanel = document.createElement('div');
  colorPanel.id = 'da-color';
  colorPanel.innerHTML = `
    <h3>🎨 Color Helper</h3>
    <div class="mini">
      <input type="color" id="da-color-input" value="#ff6eb4">
      <input type="text" id="da-color-hex" value="#ff6eb4">
    </div>
    <div class="swatch" id="da-swatch"></div>
    <button class="da-btn" id="da-copy">Copy HEX</button>
    <div class="da-help">Tip: pick here, then click game color closest to this value.</div>
  `;
  document.body.appendChild(colorPanel);

  // ---------- Floating Show Button ----------
  const showBtn = document.createElement('button');
  showBtn.id = 'da-show';
  showBtn.textContent = 'Show UI';
  document.body.appendChild(showBtn);

  // ---------- Overlay Image ----------
  const overlay = document.createElement('img');
  overlay.id = 'da-overlay';
  overlay.alt = '';
  document.body.appendChild(overlay);

  // ---------- Grid Canvas ----------
  const grid = document.createElement('canvas');
  grid.id = 'da-grid';
  document.body.appendChild(grid);

  // ---------- Guides (rectangle & circle) ----------
  function createGuide(className, defaultW=150, defaultH=150){
    const g = document.createElement('div');
    g.className = `da-guide ${className}`;
    g.style.left = '120px'; g.style.top = '120px';
    g.style.width = `${defaultW}px`; g.style.height = `${defaultH}px`;
    const tl = document.createElement('div'); tl.className='da-handle tl';
    const br = document.createElement('div'); br.className='da-handle br';
    g.appendChild(tl); g.appendChild(br);
    document.body.appendChild(g);

    // drag
    let dragging=false, offX=0, offY=0;
    g.addEventListener('mousedown', (e)=>{
      if (e.target.classList.contains('da-handle')) return;
      dragging=true;
      const r=g.getBoundingClientRect();
      offX=e.clientX - r.left; offY=e.clientY - r.top;
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e)=>{
      if(!dragging) return;
      g.style.left = `${e.clientX - offX + window.scrollX}px`;
      g.style.top  = `${e.clientY - offY + window.scrollY}px`;
    });
    document.addEventListener('mouseup', ()=> dragging=false);

    // resize (tl & br)
    let resizing=null, startX=0, startY=0, startW=0, startH=0, startL=0, startT=0;
    function startResize(which,e){
      resizing=which;
      const r=g.getBoundingClientRect();
      startX=e.clientX; startY=e.clientY;
      startW=r.width; startH=r.height; startL=r.left + window.scrollX; startT=r.top + window.scrollY;
      e.preventDefault();
      e.stopPropagation();
    }
    tl.addEventListener('mousedown', e=> startResize('tl',e));
    br.addEventListener('mousedown', e=> startResize('br',e));
    document.addEventListener('mousemove', (e)=>{
      if(!resizing) return;
      if(resizing==='br'){
        const w=Math.max(20, startW + (e.clientX - startX));
        const h=Math.max(20, startH + (e.clientY - startY));
        g.style.width = `${w}px`; g.style.height = `${h}px`;
      }else{
        const dx = e.clientX - startX, dy = e.clientY - startY;
        const w=Math.max(20, startW - dx);
        const h=Math.max(20, startH - dy);
        g.style.width = `${w}px`; g.style.height = `${h}px`;
        g.style.left = `${startL + dx}px`; g.style.top = `${startT + dy}px`;
      }
    });
    document.addEventListener('mouseup', ()=> resizing=null);

    g.style.display = 'none';
    return g;
  }
  const circleGuide = createGuide('da-circle', 160,160);
  const rectGuide   = createGuide('da-rect', 200,120);

  // ---------- State ----------
  let scale = 1, rotation = 0, locked = false;
  const qs = s => document.querySelector(s);
  const urlInput = qs('#da-url'), fileInput = qs('#da-file');
  const opRange = qs('#da-op'), scRange = qs('#da-sc'), rtRange = qs('#da-rt');
  const opVal = qs('#da-op-val'), scVal = qs('#da-sc-val'), rtVal = qs('#da-rt-val');
  const clearBtn = qs('#da-clear'), resetBtn = qs('#da-reset'), hideBtn = qs('#da-hide');
  const lockChk = qs('#da-lock');
  const gridToggle = qs('#da-grid-toggle'), gridSettings = qs('#da-grid-settings');

  function applyTransform(){ overlay.style.transform = `scale(${scale}) rotate(${rotation}deg)`; }
  function clamp(n,min,max){ return Math.max(min, Math.min(max, n)); }
  function typing(el){ if(!el) return false; const t=(el.tagName||'').toLowerCase(); const type=(el.type||'').toLowerCase(); return t==='input'||t==='textarea'||el.isContentEditable||type==='text'||type==='search'; }

  // ---------- Overlay loading ----------
  urlInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ overlay.src = urlInput.value.trim(); }});
  fileInput.addEventListener('change', e=>{
    const f=e.target.files?.[0]; if(!f) return;
    const rd=new FileReader(); rd.onload = ev => overlay.src = ev.target.result; rd.readAsDataURL(f);
  });
  // Drag & Drop anywhere
  window.addEventListener('dragover', e=>{ e.preventDefault(); });
  window.addEventListener('drop', e=>{
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      if (f.type.startsWith('image/')) {
        const rd=new FileReader(); rd.onload = ev=> overlay.src=ev.target.result; rd.readAsDataURL(f);
      }
    } else {
      const text = e.dataTransfer.getData('text/uri-list') || e.dataTransfer.getData('text/plain');
      if (text && /^https?:\/\//i.test(text)) overlay.src = text.trim();
    }
  });

  // ---------- Controls ----------
  opRange.addEventListener('input', ()=>{ overlay.style.opacity = opRange.value; opVal.textContent = Number(opRange.value).toFixed(2); });
  scRange.addEventListener('input', ()=>{ scale = Number(scRange.value); scVal.textContent=`${scale.toFixed(2)}×`; applyTransform(); });
  rtRange.addEventListener('input', ()=>{ rotation = Number(rtRange.value); rtVal.textContent=`${rotation}°`; applyTransform(); });
  lockChk.addEventListener('change', ()=>{ locked = lockChk.checked; overlay.style.cursor = locked ? 'default' : 'grab'; });
  clearBtn.addEventListener('click', ()=> overlay.src='');
  resetBtn.addEventListener('click', ()=>{
    overlay.style.top='100px'; overlay.style.left='100px';
    scale=1; rotation=0; scRange.value='1.00'; rtRange.value='0'; scVal.textContent='1.00×'; rtVal.textContent='0°';
    opRange.value='0.70'; overlay.style.opacity='0.70'; opVal.textContent='0.70'; applyTransform();
  });
  hideBtn.addEventListener('click', ()=>{ panel.style.display='none'; colorPanel.style.display='none'; showBtn.style.display='block'; });
  showBtn.addEventListener('click', ()=>{ panel.style.display='block'; colorPanel.style.display='block'; showBtn.style.display='none'; });

  // ---------- Drag overlay (no jump) ----------
  let dragging=false, offX=0, offY=0;
  overlay.addEventListener('mousedown', (e)=>{
    if(locked) return;
    dragging=true; overlay.style.cursor='grabbing';
    const r=overlay.getBoundingClientRect();
    offX=e.clientX - r.left; offY=e.clientY - r.top; e.preventDefault();
  });
  document.addEventListener('mousemove', (e)=>{
    if(!dragging) return;
    overlay.style.left = `${e.clientX - offX + window.scrollX}px`;
    overlay.style.top  = `${e.clientY - offY + window.scrollY}px`;
  });
  document.addEventListener('mouseup', ()=>{ dragging=false; if(!locked) overlay.style.cursor='grab'; });

  // ---------- Quick resize (Shift + Wheel) ----------
  document.addEventListener('wheel', (e)=>{
    if(!overlay.src) return;
    if(e.shiftKey){
      e.preventDefault();
      const step = e.deltaY<0 ? 0.05 : -0.05;
      scale = clamp(scale + step, 0.10, 3.00);
      scRange.value = scale.toFixed(2); scVal.textContent = `${scale.toFixed(2)}×`; applyTransform();
    }
  }, {passive:false});

  // ---------- Grid ----------
  let gridOn=false, gridSpacing=40, gridOpacity=0.4;
  function drawGrid(){
    grid.width = window.innerWidth; grid.height = window.innerHeight;
    const ctx = grid.getContext('2d');
    ctx.clearRect(0,0,grid.width,grid.height);
    ctx.globalAlpha = gridOpacity;
    ctx.strokeStyle = '#ffc2e6';
    ctx.lineWidth = 1;
    for(let x=0; x<grid.width; x+=gridSpacing){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,grid.height); ctx.stroke(); }
    for(let y=0; y<grid.height; y+=gridSpacing){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(grid.width,y); ctx.stroke(); }
  }
  function toggleGrid(force){
    gridOn = (typeof force==='boolean') ? force : !gridOn;
    grid.style.display = gridOn ? 'block' : 'none';
    gridToggle.textContent = `Grid: ${gridOn?'On':'Off'}`;
    if (gridOn){ drawGrid(); }
  }
  window.addEventListener('resize', ()=>{ if(gridOn) drawGrid(); });

  // Grid settings prompt (simple)
  gridSettings.addEventListener('click', ()=>{
    const sp = prompt('Grid spacing (px):', String(gridSpacing));
    if(sp!==null){
      const n = Math.max(5, Math.min(400, parseInt(sp,10)||gridSpacing));
      gridSpacing = n;
    }
    const op = prompt('Grid opacity (0-1):', String(gridOpacity));
    if(op!==null){
      const f = Math.max(0, Math.min(1, parseFloat(op)||gridOpacity));
      gridOpacity = f;
    }
    if(gridOn) drawGrid();
  });
  gridToggle.addEventListener('click', ()=> toggleGrid());

  // ---------- Guides toggles ----------
  function toggleEl(el){ el.style.display = (el.style.display==='none' || !el.style.display) ? 'block' : 'none'; }
  qs('#da-circle-toggle').addEventListener('click', ()=> toggleEl(circleGuide));
  qs('#da-rect-toggle').addEventListener('click', ()=> toggleEl(rectGuide));

  // ---------- Color helper ----------
  const colorInput = qs('#da-color-input');
  const colorHex   = qs('#da-color-hex');
  const copyBtn    = qs('#da-copy');
  const swatch = qs('#da-swatch');
  const presets = ['#000000','#ffffff','#ff6eb4','#ff9bd3','#ff9800','#ffd700','#00bcd4','#4caf50','#9c27b0','#e91e63'];
  presets.forEach(hex=>{
    const b=document.createElement('button'); b.style.background=hex; b.title=hex;
    b.addEventListener('click', ()=>{ colorInput.value=hex; colorHex.value=hex; });
    swatch.appendChild(b);
  });
  colorInput.addEventListener('input', ()=> colorHex.value = colorInput.value);
  colorHex.addEventListener('input', ()=> {
    let v=colorHex.value.trim();
    if(!v.startsWith('#')) v='#'+v;
    if(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) colorInput.value=v;
  });
  copyBtn.addEventListener('click', ()=>{
    const v = colorHex.value.trim();
    navigator.clipboard?.writeText(v).then(()=>{ copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy HEX',800); });
  });

  // ---------- Keyboard Hotkeys ----------
  document.addEventListener('keydown', (e)=>{
    if(typing(e.target)) return;
    const move = e.shiftKey? 20:5, stepScale = e.shiftKey? .10:.05, stepRot = e.shiftKey? 10:2, stepOp = e.shiftKey? .10:.05;

    switch(e.key){
      case 'h': case 'H':
        if (panel.style.display==='none'){ panel.style.display='block'; colorPanel.style.display='block'; showBtn.style.display='none'; }
        else { panel.style.display='none'; colorPanel.style.display='none'; showBtn.style.display='block'; }
        break;
      case 'g': case 'G': toggleGrid(); break;
      case 'c': case 'C': toggleEl(circleGuide); break;
      case 'v': case 'V': toggleEl(rectGuide); break;

      case 'ArrowLeft':  e.preventDefault(); overlay.style.left = `${(parseFloat(overlay.style.left)||100)-move}px`; break;
      case 'ArrowRight': e.preventDefault(); overlay.style.left = `${(parseFloat(overlay.style.left)||100)+move}px`; break;
      case 'ArrowUp':    e.preventDefault(); overlay.style.top  = `${(parseFloat(overlay.style.top )||100)-move}px`; break;
      case 'ArrowDown':  e.preventDefault(); overlay.style.top  = `${(parseFloat(overlay.style.top )||100)+move}px`; break;

      case '+': case '=':
        if(!overlay.src) break;
        scale = clamp(scale + stepScale, .10, 3.00); scRange.value=scale.toFixed(2); scVal.textContent=`${scale.toFixed(2)}×`; applyTransform(); break;
      case '-':
        if(!overlay.src) break;
        scale = clamp(scale - stepScale, .10, 3.00); scRange.value=scale.toFixed(2); scVal.textContent=`${scale.toFixed(2)}×`; applyTransform(); break;

      case ',': // rotate left
        if(!overlay.src) break;
        rotation = (rotation - stepRot + 360)%360; rtRange.value=rotation; rtVal.textContent=`${rotation}°`; applyTransform(); break;
      case '.': // rotate right
        if(!overlay.src) break;
        rotation = (rotation + stepRot)%360; rtRange.value=rotation; rtVal.textContent=`${rotation}°`; applyTransform(); break;

      case '[': // opacity down
        if(!overlay.src) break;
        opRange.value = clamp(parseFloat(opRange.value)-stepOp,0,1).toFixed(2); overlay.style.opacity=opRange.value; opVal.textContent=opRange.value; break;
      case ']': // opacity up
        if(!overlay.src) break;
        opRange.value = clamp(parseFloat(opRange.value)+stepOp,0,1).toFixed(2); overlay.style.opacity=opRange.value; opVal.textContent=opRange.value; break;

      case 'r': case 'R':
        overlay.style.top='100px'; overlay.style.left='100px'; scale=1; rotation=0;
        scRange.value='1.00'; rtRange.value='0'; scVal.textContent='1.00×'; rtVal.textContent='0°';
        opRange.value='0.70'; overlay.style.opacity='0.70'; opVal.textContent='0.70'; applyTransform(); break;

      case 'Delete': overlay.src=''; break;
    }
  });

})();
