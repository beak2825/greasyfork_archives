// ==UserScript==
// @name         wplace overlay script made by Furry Crew
// @namespace    https://c11v.dev/userscripts/wplace-overlay
// @version      2.3.1
// @description  Minimal overlay. No export/import. Camera lock infra kept without UI. GUI can be minimized.
// @match        https://wplace.live/*
// @run-at       document-idle
// @inject-into  page
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/545754/wplace%20overlay%20script%20made%20by%20Furry%20Crew.user.js
// @updateURL https://update.greasyfork.org/scripts/545754/wplace%20overlay%20script%20made%20by%20Furry%20Crew.meta.js
// ==/UserScript==

(function () {
  // single-instance guard
  const KEY = "__WPO_SIMPLE_SINGLETON__";
  try { if (window[KEY]?.destroy) window[KEY].destroy(true); } catch {}
  const singleton = { destroy: ()=>{} };
  window[KEY] = singleton;

  const LS_KEY = "wplace.overlay.gui.simple.v1";
  const WM_TEXT_MAIN = "Made by Furry Crew";

  const log = (...a)=>console.log("[wplace-overlay]", ...a);
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));

  function toast(msg){
    const el=document.createElement("div");
    el.textContent=msg;
    el.style.cssText="position:fixed;left:50%;bottom:16px;transform:translateX(-50%);padding:8px 12px;background:rgba(0,0,0,.85);color:#fff;font:12px system-ui,sans-serif;border-radius:8px;z-index:2147483647";
    document.body.appendChild(el);
    setTimeout(()=>el.remove(),1200);
  }

  async function waitForBody(){
    if(document.body) return;
    await new Promise(r=>{
      const obs=new MutationObserver(()=>{
        if(document.body){ obs.disconnect(); r(); }
      });
      obs.observe(document.documentElement,{childList:true,subtree:true});
    });
  }

  let state = {
    on:true, x:0, y:0, scale:1, rot:0, opacity:0.25,
    imageInfo:{ w:0, h:0, name:"" },
    step:5,
    lock:false,
    minimized:false
  };
  try {
    const prev = JSON.parse(localStorage.getItem(LS_KEY)||"{}");
    Object.assign(state, prev);
  } catch {}

  function save(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }

  // overlay canvas
  let cvs=null, ctx=null, imgBitmap=null, iw=0, ih=0;
  function makeCanvas(){
    cvs=document.createElement("canvas");
    ctx=cvs.getContext("2d");
    Object.assign(cvs.style,{
      position:"fixed", top:"0", left:"0", width:"100vw", height:"100vh",
      pointerEvents:"none", zIndex:"2147483647"
    });
    cvs.width=window.innerWidth; cvs.height=window.innerHeight;
    const onResize=()=>{ cvs.width=innerWidth; cvs.height=innerHeight; draw(); };
    window.addEventListener("resize", onResize);
    cvs.__onResize = onResize;
    document.body.appendChild(cvs);
  }
  function clear(){ if(!ctx) return; ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,cvs.width,cvs.height); }

  function drawWatermark(){
    const pad = 10, baseSize = 14;
    ctx.save();
    ctx.imageSmoothingEnabled=true;
    ctx.globalAlpha = 0.9;
    ctx.font = `600 ${baseSize}px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, sans-serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 1;
    ctx.fillStyle = "white";
    ctx.fillText(WM_TEXT_MAIN, 10, cvs.height - pad);
    ctx.restore();
  }

  function draw(){
    if(!ctx) return;
    clear();
    if(imgBitmap && state.on){
      const cx=cvs.width/2, cy=cvs.height/2;
      ctx.save();
      ctx.globalAlpha=clamp(state.opacity,0,1);
      ctx.imageSmoothingEnabled=false;
      ctx.translate(cx+state.x, cy+state.y);
      ctx.rotate(state.rot*Math.PI/180);
      ctx.scale(state.scale, state.scale);
      ctx.drawImage(imgBitmap, -iw/2, -ih/2);
      ctx.restore();
    }
    drawWatermark();
  }

  async function loadFromFile(file){
    try{
      const bmp=await createImageBitmap(file);
      imgBitmap=bmp; iw=bmp.width; ih=bmp.height;
      state.imageInfo={ w:iw, h:ih, name:file.name||"" };
      draw(); refreshFooter();
      toast(`Loaded ${file.name} ${iw}×${ih}`);
      save();
    }catch{ toast("Failed to load file"); }
  }
  function chooseImageFile(){
    const inp=document.createElement("input");
    inp.type="file";
    inp.accept="image/png,image/jpeg,image/webp,image/gif";
    inp.onchange=()=>{ const f=inp.files && inp.files[0]; if(f) loadFromFile(f); };
    inp.click();
  }

  // camera lock infra kept without UI
  let isLeftDown = false;
  const lockProxy = document.createElement("div");
  Object.assign(lockProxy.style, {
    position:"fixed", inset:"0", zIndex:"2147483646", pointerEvents:"none"
  });
  lockProxy.onclick = (e)=>{
    const target = document.elementFromPoint(e.clientX, e.clientY);
    if(target && target !== lockProxy){
      const evt = new MouseEvent("click", {bubbles:true, cancelable:true, clientX:e.clientX, clientY:e.clientY, button:0});
      target.dispatchEvent(evt);
    }
  };
  ["mousedown","mousemove","mouseup","wheel","contextmenu","touchstart","touchmove","touchend"].forEach(type=>{
    lockProxy.addEventListener(type, ev=>{
      ev.stopImmediatePropagation();
      ev.preventDefault();
    }, {passive:false});
  });

  function applyLockSideEffects(){
    lockProxy.style.pointerEvents = state.lock ? "auto" : "none";
  }

  function installLockHandlers(){
    window.addEventListener("wheel", (e)=>{
      if(!state.lock) return;
      e.stopImmediatePropagation();
      e.preventDefault();
    }, {capture:true, passive:false});

    window.addEventListener("mousedown", (e)=>{
      if(!state.lock) return;
      isLeftDown = e.button === 0;
      e.stopImmediatePropagation();
      e.preventDefault();
    }, {capture:true});

    window.addEventListener("mousemove", (e)=>{
      if(!state.lock) return;
      if(isLeftDown){
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, {capture:true});

    window.addEventListener("mouseup", (e)=>{
      if(!state.lock) return;
      isLeftDown = false;
      e.stopImmediatePropagation();
      e.preventDefault();
    }, {capture:true});

    window.addEventListener("touchstart", (e)=>{
      if(!state.lock) return;
      e.stopImmediatePropagation();
      e.preventDefault();
    }, {capture:true, passive:false});

    window.addEventListener("touchmove", (e)=>{
      if(!state.lock) return;
      e.stopImmediatePropagation();
      e.preventDefault();
    }, {capture:true, passive:false});

    window.addEventListener("keydown", (e)=>{
      if(!state.lock) return;
      const k = e.key.toLowerCase();
      const block = new Set(["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright","+","-","=","_"," ","pageup","pagedown","home","end"]);
      if(block.has(k) || (e.ctrlKey && (k==="+" || k==="=" || k==="-" ))){
        e.stopImmediatePropagation();
        e.preventDefault();
      }
    }, {capture:true});
  }
  installLockHandlers();

  // GUI
  let guiHost=null, shadow=null, keepAliveId=null;
  function buildGUI(){
    guiHost=document.createElement("div");
    shadow=guiHost.attachShadow({mode:"open"});

    const style=document.createElement("style");
    style.textContent=`
      :host { all: initial; }
      *, *::before, *::after { box-sizing: border-box; }
      .panel{
        position:fixed; top:16px; right:16px;
        background:#0f0f10; color:#eaeaea; font:12px system-ui,sans-serif;
        border:1px solid #222; border-radius:12px; padding:12px; z-index:2147483647;
        box-shadow:0 12px 24px rgba(0,0,0,.4); user-select:none;
        width:auto; max-width:min(420px, calc(100vw - 32px));
        max-height:calc(100vh - 32px); overflow:auto;
      }
      .title{ display:flex; align-items:center; justify-content:space-between; font-weight:700; margin-bottom:8px; cursor:move; gap:8px; }
      .title-left{ display:flex; align-items:center; gap:8px; }
      .sublabel{ color:#a9a9a9; font-size:10px; white-space:nowrap; }
      .title-btn{
        margin-left:auto; background:#171718; color:#eaeaea; border:1px solid #2d2d2f; border-radius:8px;
        padding:4px 8px; cursor:pointer; font:12px system-ui,sans-serif;
      }
      .btns{ display:flex; gap:8px; flex-wrap:wrap; margin-bottom:6px; }
      .row{ display:grid; grid-template-columns:1fr auto; gap:8px; align-items:center; margin:10px 0; }
      .controls{ display:grid; grid-template-columns: 1fr minmax(68px,92px); gap:8px; grid-column:1 / span 2; align-items:center; }
      input[type="number"]{
        width:100%; min-width:68px; background:#171718; color:#eaeaea; border:1px solid #2d2d2f; border-radius:8px;
        padding:6px 8px; font:12px system-ui,sans-serif;
      }
      input[type="range"]{ width:100%; }
      button,label{
        background:#171718; color:#eaeaea; border:1px solid #2d2d2f; border-radius:8px;
        padding:6px 8px; cursor:pointer; font:12px system-ui,sans-serif;
      }
      button:active{ transform:translateY(1px); }
      .mono{ font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; }
      .footer{
        margin-top:8px; border-top:1px solid #1d1d1f; padding-top:6px;
        display:flex; justify-content:space-between; align-items:center; color:#a6a6a6; font-size:10px;
        gap:8px; flex-wrap:wrap;
      }
      .footer .mono { white-space:nowrap; }
      .dpad{
        display:grid; grid-template-columns:repeat(3,32px); grid-template-rows:repeat(3,32px);
        gap:6px;
      }
      .dpad button{ padding:0; height:32px; width:32px; }
      .dpad .spacer{ visibility:hidden; }
      .min-note{ color:#a6a6a6; font-size:10px; }
      @media (max-width: 420px){
        .controls{ grid-template-columns: 1fr minmax(60px,80px); }
        .dpad{ grid-template-columns:repeat(3,28px); grid-template-rows:repeat(3,28px); }
        .dpad button{ width:28px; height:28px; }
      }
    `;

    const wrap=document.createElement("div");
    wrap.innerHTML=`
      <div class="panel" id="panel" aria-live="polite">
        <div class="title" id="drag">
          <div class="title-left">
            <span>Overlay</span>
            <span class="sublabel">${WM_TEXT_MAIN}</span>
          </div>
          <button id="min" class="title-btn" title="Minimize">▾</button>
        </div>

        <div id="content">
          <div class="btns">
            <button id="load">Load image</button>
            <button id="toggle">${state.on?"Hide":"Show"}</button>
            <button id="save">Save</button>
            <button id="reset">Reset</button>
          </div>

          <div class="row">
            <label>Opacity</label>
            <div class="controls">
              <input class="range" id="opacity" type="range" min="0" max="1" step="0.05" value="${state.opacity}">
              <input class="mono" id="opacity_n" type="number" min="0" max="1" step="0.01" value="${state.opacity.toFixed(2)}">
            </div>
          </div>

          <div class="row">
            <label>Scale</label>
            <div class="controls">
              <input class="range" id="scale" type="range" min="0.01" max="10" step="0.01" value="${state.scale}">
              <input class="mono" id="scale_n" type="number" min="0.01" max="10" step="0.001" value="${state.scale.toFixed(3)}">
            </div>
          </div>

          <div class="row">
            <label>Rotation</label>
            <div class="controls">
              <input class="range" id="rot" type="range" min="-180" max="180" step="1" value="${state.rot}">
              <input class="mono" id="rot_n" type="number" min="-180" max="180" step="1" value="${state.rot.toFixed(0)}">
            </div>
          </div>

          <div class="row">
            <label>Position</label>
            <div class="row" style="grid-column:1 / span 2; grid-template-columns:auto 1fr; align-items:center;">
              <div class="dpad">
                <span class="spacer"></span>
                <button id="up" title="Up">↑</button>
                <span class="spacer"></span>

                <button id="left" title="Left">←</button>
                <button id="center" title="Center">•</button>
                <button id="right" title="Right">→</button>

                <span class="spacer"></span>
                <button id="down" title="Down">↓</button>
                <span class="spacer"></span>
              </div>
              <div style="justify-self:end; display:flex; align-items:center; gap:8px;">
                <span>Step</span>
                <input class="mono" id="step_n" type="number" min="1" max="200" step="1" value="${state.step}">
              </div>
            </div>
          </div>

          <div class="footer">
            <span id="imgmeta">${state.imageInfo?.name ? `${state.imageInfo.name} ${state.imageInfo.w}×${state.imageInfo.h}` : "No image loaded"}</span>
            <span class="mono" id="scale_meta">${state.scale.toFixed(3)}×</span>
          </div>
        </div>
        <div id="minnote" class="min-note" style="display:none;">Minimized. Click ▸ to expand</div>
      </div>
    `;

    shadow.append(style, wrap);
    document.body.appendChild(guiHost);

    const $$=(id)=>shadow.getElementById(id);

    // drag panel
    const panel=$$("panel");
    const drag=$$("drag");
    let dx=0, dy=0, dragging=false;
    drag.addEventListener("mousedown", e=>{
      dragging=true;
      const r=panel.getBoundingClientRect();
      dx=e.clientX-r.left; dy=e.clientY-r.top; e.preventDefault();
    });
    window.addEventListener("mousemove", e=>{
      if(!dragging) return;
      panel.style.left=(e.clientX-dx)+"px";
      panel.style.top=(e.clientY-dy)+"px";
      panel.style.right="auto";
    });
    window.addEventListener("mouseup", ()=>dragging=false);

    // minimize toggle
    const content = $$("content");
    const minBtn = $$("min");
    const minNote = $$("minnote");
    function applyMinimized(){
      if(state.minimized){
        content.style.display="none";
        minNote.style.display="block";
        minBtn.textContent="▸";
        minBtn.title="Expand";
      }else{
        content.style.display="";
        minNote.style.display="none";
        minBtn.textContent="▾";
        minBtn.title="Minimize";
      }
    }
    minBtn.addEventListener("click", ()=>{
      state.minimized = !state.minimized;
      applyMinimized();
      save();
    });
    // also allow double click on title bar
    drag.addEventListener("dblclick", ()=>{
      state.minimized = !state.minimized;
      applyMinimized();
      save();
    });
    applyMinimized();

    // buttons
    $$("load").addEventListener("click", chooseImageFile);
    $$("toggle").addEventListener("click", ()=>{ state.on=!state.on; $$("toggle").textContent=state.on?"Hide":"Show"; draw(); save(); });
    $$("save").addEventListener("click", ()=>{ save(); toast("Saved"); });
    $$("reset").addEventListener("click", ()=>{
      Object.assign(state,{x:0,y:0,scale:1,rot:0});
      $$("scale").value=state.scale; $$("scale_n").value=state.scale.toFixed(3);
      $$("rot").value=state.rot; $$("rot_n").value=state.rot.toFixed(0);
      draw(); refreshFooter(); save();
    });

    // sliders
    const syncRangeNum = (rangeId, numId, onChange) => {
      const r=$$(rangeId), n=$$(numId);
      const fmt = (id,val)=>{
        if(id.includes("scale")) return val.toFixed(3);
        if(id.includes("opacity")) return val.toFixed(2);
        if(id.includes("rot")) return val.toFixed(0);
        return String(val);
      };
      const clampTo = (v,min,max)=>Math.min(max,Math.max(min,v));
      r.addEventListener("input", ()=>{ const v=parseFloat(r.value); n.value=fmt(numId, v); onChange(v); save(); });
      n.addEventListener("change", ()=>{ let v=parseFloat(n.value); if(isNaN(v)) return; let min=parseFloat(r.min), max=parseFloat(r.max); v = clampTo(v,min,max); r.value=String(v); n.value=fmt(numId, v); onChange(v); save(); });
    };

    syncRangeNum("opacity","opacity_n",(v)=>{ state.opacity=v; draw(); });
    syncRangeNum("scale","scale_n",(v)=>{ state.scale=v; draw(); refreshFooter(); });
    syncRangeNum("rot","rot_n",(v)=>{ state.rot=v; draw(); });

    $$("step_n").addEventListener("change", ()=>{
      const v = parseInt($$("step_n").value,10);
      if(!isNaN(v) && v>=1 && v<=200){ state.step=v; save(); }
      $$("step_n").value = String(state.step);
    });

    // dpad
    const move = (dx,dy)=>{ state.x += dx; state.y += dy; draw(); save(); };
    const hold = (el,fn)=>{
      let t, rep;
      const start=()=>{ fn(); t=setTimeout(()=>{ rep=setInterval(fn, 40); }, 300); };
      const stop=()=>{ clearTimeout(t); clearInterval(rep); };
      el.addEventListener("mousedown", start);
      el.addEventListener("mouseup", stop);
      el.addEventListener("mouseleave", stop);
      el.addEventListener("touchstart", e=>{ e.preventDefault(); start(); }, {passive:false});
      el.addEventListener("touchend", stop);
    };
    hold($$("up"),   ()=>move(0, -state.step));
    hold($$("down"), ()=>move(0,  state.step));
    hold($$("left"), ()=>move(-state.step, 0));
    hold($$("right"),()=>move( state.step, 0));
    $$("center").addEventListener("click", ()=>{ state.x=0; state.y=0; draw(); save(); });

    refreshFooter();
  }

  function refreshFooter(){
    try{
      const scaleMeta = shadow?.getElementById("scale_meta");
      if(scaleMeta) scaleMeta.textContent = `${state.scale.toFixed(3)}×`;
      const meta = shadow?.getElementById("imgmeta");
      if(meta) meta.textContent = state.imageInfo?.name ? `${state.imageInfo.name} ${state.imageInfo.w}×${state.imageInfo.h}` : "No image loaded";
    }catch{}
  }

  function applyState(next){
    Object.assign(state, next || {});
    const $ = (id)=>shadow?.getElementById(id);
    if($){
      const s=$("scale"), sn=$("scale_n");
      if(s){ s.value = String(state.scale); }
      if(sn){ sn.value = state.scale.toFixed(3); }
      const r=$("rot"), rn=$("rot_n");
      if(r){ r.value = String(state.rot); }
      if(rn){ rn.value = state.rot.toFixed(0); }
      const op=$("opacity"), opn=$("opacity_n");
      if(op){ op.value = String(state.opacity); }
      if(opn){ opn.value = state.opacity.toFixed(2); }
      const step=$("step_n"); if(step) step.value = String(state.step);
      const tog=$("toggle"); if(tog) tog.textContent = state.on?"Hide":"Show";
      const minBtn = $("min"); if(minBtn){ /* handled by applyMinimized during build */ }
      refreshFooter();
    }
    applyLockSideEffects();
    draw();
  }

  function keepAlive(){
    const ensure=()=>{
      if(!document.body) return;
      if(cvs && !cvs.isConnected){ document.body.appendChild(cvs); }
      if(guiHost && !guiHost.isConnected){ document.body.appendChild(guiHost); }
      if(lockProxy && !lockProxy.isConnected){ document.body.appendChild(lockProxy); }
    };
    return setInterval(ensure, 1000);
  }

  // cleanup
  singleton.destroy = function destroy(fromPrev){
    try{ clearInterval(keepAliveId); }catch{}
    try{
      if(cvs){ window.removeEventListener("resize", cvs.__onResize || (()=>{})); cvs.remove(); }
      if(guiHost) guiHost.remove();
      if(lockProxy) lockProxy.remove();
    }catch{}
    if(!fromPrev) toast("Overlay removed");
  };

  // tiny API
  singleton.setLock = function(v){
    state.lock = !!v;
    applyLockSideEffects();
    save();
    toast(state.lock ? "Camera locked" : "Camera unlocked");
  };

  (async function init(){
    await waitForBody();
    document.body.appendChild(lockProxy); // keep under canvas
    makeCanvas();
    buildGUI();
    keepAliveId = keepAlive();
    applyLockSideEffects();

    document.addEventListener("paste", async e=>{
      const items=e.clipboardData?.items||[];
      for(const it of items){
        if(it.type && it.type.startsWith("image/")){
          const f=it.getAsFile(); if(f) await loadFromFile(f);
          e.preventDefault(); break;
        }
      }
    }, true);

    log("wplace overlay ready");
    toast("Overlay ready. Load image to begin");
  })();
})();
