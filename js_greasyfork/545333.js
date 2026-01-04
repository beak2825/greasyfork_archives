// ==UserScript==
// @name         JPDB Draggable Menu
// @namespace    https://greasyfork.org/users/you
// @version      1.3.3
// @description  The submenu is now a draggable and transparency-adjustable element on the site.
// @match        https://jpdb.io/*
// @run-at       document-start
// @inject-into  page
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545333/JPDB%20Draggable%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/545333/JPDB%20Draggable%20Menu.meta.js
// ==/UserScript==


(function () {
  'use strict';

  (function prehideJPDB() {
    if (!location.pathname.startsWith('/review')) return;
    const css = `
      html.jpdbf-prehide .main-row:has(#show-answer),
      html.jpdbf-prehide .main-row:has(#grade-1),
      html.jpdbf-prehide .main-row:has(#grade-2),
      html.jpdbf-prehide .main-row:has(#grade-3),
      html.jpdbf-prehide .main-row:has(#grade-4),
      html.jpdbf-prehide .main-row:has(#grade-5),
      html.jpdbf-prehide .jpdbf-prehide-target{
        visibility: hidden !important;
      }`;
    const st = document.createElement('style');
    st.id = 'jpdbf-prehide';
    st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
    document.documentElement.classList.add('jpdbf-prehide');
    window.__jpdbf_unhideJPDB = (node) => {
      try { if (node) node.classList.remove('jpdbf-prehide-target'); } catch {}
      document.documentElement.classList.remove('jpdbf-prehide');
      try { st.remove(); } catch {}
      try { delete window.__jpdbf_unhideJPDB; } catch {}
    };
  })();

  const TUNE = {
    friction: 0.92, minSpeed: 12, maxSpeed: 6000,
    kickBase: 10, kickGain: 0.006, kickMin: 8, kickMax: 36, kickDur: 160, kickCooldown: 140,
    velWindowMs: 160, releaseQuietMs: 140, releaseQuietPx: 2,
    anchorSense: 24, lockSense: 2,
    intentX: 16, intentY: 14, intentSpeed: 420,
    moveThresh: 6
  };

  GM_addStyle(`
    :root{
      --jpdbfSideW: 32px;
      --jpdbfSideInsetX: 8px;
      --jpdbfSideInsetY: 6px;
      --jpdbfOpNudgeY: -1.5px;
      --jpdbfOpPad: 28px;
    }
    .jpdbf-float{
      position:fixed!important; z-index:2147483647!important; max-width:80vw; width:280px;
      background:rgba(20,20,22,var(--jpdbfAlpha,1)); color:#e7e7e7; border:1px solid #3a3a3a;
      border-radius:14px; box-shadow:none;
      padding:10px; box-sizing:border-box; cursor:grab; user-select:none; touch-action:none; overflow:hidden;
    }
    .jpdbf-float:active{cursor:grabbing}
    .jpdbf-float input[type="submit"], .jpdbf-float button{
      border-radius:10px!important; cursor:pointer; opacity: var(--jpdbfBtnOpacity, 1); transition: opacity .12s ease;
    }
    .jpdbf-float .main-row{ position:relative!important; }
    .jpdbf-float #show-checkbox-1-label.side-button{
      position:absolute!important; top:var(--jpdbfSideInsetY)!important; bottom:var(--jpdbfSideInsetY)!important; left:var(--jpdbfSideInsetX)!important;
      width:var(--jpdbfSideW)!important; display:flex!important; align-items:center!important; justify-content:center!important; margin:0!important; padding:0!important; border-radius:10px!important;
      opacity: var(--jpdbfBtnOpacity, 1); transition: opacity .12s ease;
    }
    .jpdbf-float.jpdbf-has-chevron .main.column{ margin-left:calc(var(--jpdbfSideW) + var(--jpdbfSideInsetX) + 8px)!important; }
    .jpdbf-float.jpdbf-op-open{ padding-bottom:var(--jpdbfOpPad); }
    .jpdbf-op-row{
      margin:8px 0 0; padding:4px 6px 0; width:100%; box-sizing:border-box;
      display:grid; grid-template-columns:1fr minmax(56px,auto); align-items:center; gap:10px;
    }
    .jpdbf-op-row input[type=range]{ width:100%; height:18px; margin:0; background:transparent; appearance:none; -webkit-appearance:none }
    .jpdbf-op-row input[type=range]::-webkit-slider-runnable-track{ height:8px; border-radius:9999px; background:#2b2b2e }
    .jpdbf-op-row input[type=range]::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; margin-top:-4px; width:16px; height:16px; border-radius:9999px; background:#d7d7d7; border:1px solid #666 }
    .jpdbf-op-row input[type=range]::-moz-range-track{ height:8px; border-radius:9999px; background:#2b2b2e }
    .jpdbf-op-row input[type=range]::-moz-range-thumb{ width:16px; height:16px; border-radius:9999px; background:#d7d7d7; border:1px solid #666 }
    .jpdbf-op-val{ display:flex; align-items:center; justify-content:flex-end; white-space:nowrap; font-size:12px; font-variant-numeric:tabular-nums; opacity:.95; min-width:5ch; text-align:right; line-height:1; transform: translateY(var(--jpdbfOpNudgeY)); }
  `);

  const STATE_KEY = 'jpdbf:pos:v1';
  const OPACITY_KEY = 'jpdbf:alpha:v1';

  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));

  function findMenu(){
    const g = qs('#grade-1, #grade-2, #grade-3, #grade-4, #grade-5');
    if (g){ const mr=g.closest('.main-row'); if (mr) return mr; let c=g.parentElement;
      while(c&&c!==document.body){ if(qsa('input[type="submit"]',c).length>=2) return c; c=c.parentElement; } }
    const show = qs('#show-answer') || qs('input[type="submit"][value="Show answer"]');
    if (show){ const mr2=show.closest('.main-row'); if (mr2) return mr2;
      const f=show.closest('form'); if (f) { const r=f.closest('.main-row')||f.parentElement; if(r) return r; }
      return show.parentElement; }
    return null;
  }

  function detectMode(el){
    if (!el) return null;
    if (el.querySelector('#grade-1, #grade-2, #grade-3, #grade-4, #grade-5')) return 'gr';
    if (el.querySelector('#show-answer, input[type="submit"][value="Show answer"]')) return 'sa';
    return null;
  }

  function clamp(l,t,w,h){ const vw=innerWidth,vh=innerHeight; if(l<0)l=0; if(t<0)t=0; if(l+w>vw)l=vw-w; if(t+h>vh)t=vh-h; return {left:l,top:t}; }

  const loadState=()=>{ try{return JSON.parse(localStorage.getItem(STATE_KEY)||'null');}catch{return null;} };
  const saveEntry=e=>{ try{const st=loadState()||{}; st.pos=e; localStorage.setItem(STATE_KEY,JSON.stringify(st));}catch{} };
  const saveFromRect=r=>saveEntry(entryFromRect(r));

  function computeLocksFromRect(r){ const vw=innerWidth,vh=innerHeight,L=TUNE.lockSense;
    return {lockL:r.left<=L,lockR:(vw-(r.left+r.width))<=L,lockT:r.top<=L,lockB:(vh-(r.top+r.height))<=L}; }

  function computeAnchorAxes(r, E){
    const vw=innerWidth,vh=innerHeight;
    const dL=r.left, dT=r.top, dR=vw-(r.left+r.width), dB=vh-(r.top+r.height);
    const ax = dR<=E ? 'right' : (dL<=E ? 'left' : null);
    const ay = dB<=E ? 'bottom': (dT<=E ? 'top'  : null);
    return {ax, ay};
  }
  function maskNearEdges(r, E){
    const vw=innerWidth,vh=innerHeight;
    const dL=r.left, dT=r.top, dR=vw-(r.left+r.width), dB=vh-(r.top+r.height);
    return { L:dL<=E, R:dR<=E, T:dT<=E, B:dB<=E };
  }

  function isAnchoredX(e){ return !!(e && (e.lockL || e.lockR || e.ax==='left' || e.ax==='right')); }
  function isAnchoredY(e){ return !!(e && (e.lockT || e.lockB || e.ay==='top'  || e.ay==='bottom')); }

  function applyAnchoredPosition(w,h,e){
    const vw=innerWidth,vh=innerHeight;
    const ax=e.lockR?'right':(e.lockL?'left':(e.ax||null));
    const ay=e.lockB?'bottom':(e.lockT?'top':(e.ay||null));
    let l=e.x, t=e.y;
    if(ax==='right') l=Math.max(0,Math.min(vw-w,vw-w-(e.offR||0)));
    else if(ax==='left') l=0;
    if(ay==='bottom') t=Math.max(0,Math.min(vh-h,vh-h-(e.offB||0)));
    else if(ay==='top') t=0;
    return clamp(l,t,w,h);
  }

  function entryFromRect(r){
    const a=computeAnchorAxes(r, TUNE.anchorSense);
    const locks=computeLocksFromRect(r);
    const vw=innerWidth,vh=innerHeight;
    const offR=(a.ax==='right')?(vw-(r.left+r.width)):0;
    const offB=(a.ay==='bottom')?(vh-(r.top+r.height)):0;
    return {x:r.left,y:r.top,ax:a.ax,ay:a.ay,offR,offB,...locks};
  }

  function makePartialAnchorEntry(r, mask){
    const vw=innerWidth,vh=innerHeight;
    const e = { x:r.left, y:r.top, ax:null, ay:null, offR:0, offB:0,
      lockL:false, lockR:false, lockT:false, lockB:false };
    if(mask.R){ e.ax='right'; e.lockR=true; e.offR = vw-(r.left+r.width); }
    if(mask.L){ e.ax='left';  e.lockL=true; e.x = 0; }
    if(mask.B){ e.ay='bottom'; e.lockB=true; e.offB = vh-(r.top+r.height); }
    if(mask.T){ e.ay='top';    e.lockT=true; e.y = 0; }
    return e;
  }

  function loadAlpha(){ const v=Number(localStorage.getItem(OPACITY_KEY)); if(Number.isFinite(v) && v>=0.2 && v<=1) return v; return 1; }
  function saveAlpha(v){ localStorage.setItem(OPACITY_KEY, String(v)); }
  function applyOpacityTo(el){ const v = loadAlpha(); el.style.setProperty('--jpdbfAlpha', String(v)); el.style.setProperty('--jpdbfBtnOpacity', String(v)); }

  function ensureOpacityUI(){
    if(!floatingEl) return; const hb = floatingEl.querySelector('.hidden-body'); if(!hb) return;
    if(hb.querySelector('.jpdbf-op-row')) return;
    const row = document.createElement('div'); row.className = 'row jpdbf-op-row';
    const rng = document.createElement('input'); rng.type='range'; rng.min='20'; rng.max='100'; rng.step='1'; rng.value=String(Math.round(loadAlpha()*100)); rng.setAttribute('aria-label','Opacity');
    const val = document.createElement('div'); val.className='jpdbf-op-val'; val.textContent = rng.value+'%';
    rng.addEventListener('input', ()=>{ const p=Math.max(20,Math.min(100,Number(rng.value))); val.textContent=p+'%'; const v=p/100; if(floatingEl){ floatingEl.style.setProperty('--jpdbfAlpha',String(v)); floatingEl.style.setProperty('--jpdbfBtnOpacity',String(v)); } saveAlpha(v); });
    row.appendChild(rng); row.appendChild(val); hb.appendChild(row);
    const checkbox = floatingEl.querySelector('#show-checkbox-1'); if (checkbox) { const sync=()=>{ if(checkbox.checked) floatingEl.classList.add('jpdbf-op-open'); else floatingEl.classList.remove('jpdbf-op-open'); }; checkbox.addEventListener('change', sync); sync(); }
  }

  let floatingEl=null, dragging=false, startX=0, startY=0, startLeft=0, startTop=0;
  let vx=0, vy=0, raf=0, lastMoveX=0, lastMoveY=0, lastMoveT=0;
  let rx=null, ry=null, lastKickX=0, lastKickY=0;

  let lastSAEntry=null;
  let grMovedSinceShown=false;
  let grMovedDistance=0;

  let pendingCenter = null;
  let suppressRO = 0;

  let forceSaveEntry=null, forceSaveUntil=0;
  function setForcedSave(entry, ms=1500){
    forceSaveEntry = entry; forceSaveUntil = performance.now() + ms;
    setTimeout(()=>{ if(performance.now() > forceSaveUntil){ forceSaveEntry=null; } }, ms+200);
  }

  const INTERACTIVE='input,button,select,textarea,label,a,[role="button"],[contenteditable="true"]';
  const stopAnim=()=>{ if(raf) cancelAnimationFrame(raf); raf=0; };
  const samples=[];
  const pushSample=(x,y,t)=>{ samples.push({x,y,t}); const cut=t-TUNE.velWindowMs; while(samples.length&&samples[0].t<cut) samples.shift(); };
  function releaseVelocity(){ if(samples.length<2) return {vx:0,vy:0};
    let S1=0,St=0,Sx=0,Sy=0,Stt=0,Stx=0,Sty=0; for(const s of samples){ S1+=1; St+=s.t; Sx+=s.x; Sy+=s.y; Stt+=s.t*s.t; Stx+=s.t*s.x; Sty+=s.t*s.y; }
    const den=(S1*Stt-St*St)||1; let VX=(S1*Stx-St*Sx)/den*1000; let VY=(S1*Sty-St*Sy)/den*1000;
    const sp=Math.hypot(VX,VY); if(sp>6000){ const k=6000/sp; VX*=k; VY*=k; } return {vx:VX,vy:VY}; }

  function writeAndSave(x,y){
    floatingEl.style.left=x+'px'; floatingEl.style.top=y+'px';
    const r=floatingEl.getBoundingClientRect();
    saveFromRect(r);
  }

  function startInertia(initVx,initVy){
    stopAnim(); vx=initVx; vy=initVy; rx=null; ry=null;
    function tick(prev){
      raf=requestAnimationFrame(ts=>{
        const dt=Math.min(0.05,Math.max(0.001,(ts-prev)/1000)), now=performance.now(), f=Math.pow(TUNE.friction,dt*60);
        vx*=f; vy*=f; const r=floatingEl.getBoundingClientRect(); let nx=r.left+vx*dt, ny=r.top+vy*dt;
        const vw=innerWidth,vh=innerHeight; let hitL=false,hitR=false,hitT=false,hitB=false; const preVx=vx,preVy=vy;
        if(nx<0){nx=0;hitL=true} if(nx+r.width>vw){nx=vw-r.width;hitR=true}
        if(ny<0){ny=0;hitT=true} if(ny+r.height>vh){ny=vh-r.height;hitB=true}
        if((hitL||hitR)&&!rx&&(now-lastKickX>140)){const k=Math.max(8,Math.min(36,10+0.006*Math.abs(preVx))); const to=hitL?Math.min(k,vw-r.width):Math.max(vw-r.width-k,0); rx={from:nx,to,t0:now,dur:160}; vx=0; lastKickX=now;}
        if((hitT||hitB)&&!ry&&(now-lastKickY>140)){const k=Math.max(8,Math.min(36,10+0.006*Math.abs(preVy))); const to=hitT?Math.min(k,vh-r.height):Math.max(vh-r.height-k,0); ry={from:ny,to,t0:now,dur:160}; vy=0; lastKickY=now;}
        if(rx){const p=Math.min(1,(now-rx.t0)/rx.dur); nx=rx.from+(rx.to-rx.from)*(1-Math.pow(1-p,3)); if(p>=1) rx=null;}
        if(ry){const p=Math.min(1,(now-ry.t0)/ry.dur); ny=ry.from+(ry.to-ry.from)*(1-Math.pow(1-p,3)); if(p>=1) ry=null;}
        writeAndSave(nx,ny);
        if((vx*vx+vy*vy)<(12*12)&&!rx&&!ry){raf=0;return}
        tick(ts);
      });
    }
    raf=requestAnimationFrame(tick);
  }

  function freezeAndSave(){
    if(!floatingEl) return;
    stopAnim(); rx=null; ry=null;
    const r=floatingEl.getBoundingClientRect();
    if(forceSaveEntry && performance.now() < forceSaveUntil){
      saveEntry(forceSaveEntry);
    }else{
      saveFromRect(r);
    }
  }

  function syncChevronFlag(){
    if(!floatingEl) return;
    const has = !!floatingEl.querySelector('#show-checkbox-1-label.side-button');
    floatingEl.classList.toggle('jpdbf-has-chevron', has);
  }

  function attachDrag(el){
    if(el._jpdbfBound) return; el._jpdbfBound=true;

    el.addEventListener('pointerdown', e=>{
      if(e.button!==0) return;
      if(e.target.closest(INTERACTIVE)) return;
      stopAnim(); rx=null; ry=null; dragging=true;
      const r=el.getBoundingClientRect();
      startX=e.clientX; startY=e.clientY; startLeft=r.left; startTop=r.top;
      grMovedDistance=0;
      samples.length=0; const now=performance.now(); pushSample(e.clientX,e.clientY,now); lastMoveX=e.clientX; lastMoveY=e.clientY; lastMoveT=now;
      e.preventDefault(); try{el.setPointerCapture(e.pointerId);}catch{}
    }, true);

    window.addEventListener('pointermove', e=>{
      if(!dragging) return;
      const r=el.getBoundingClientRect();
      const nx=startLeft+(e.clientX-startX);
      const ny=startTop+(e.clientY-startY);
      const c=clamp(nx,ny,r.width,r.height);
      writeAndSave(c.left,c.top);
      const dx=c.left-startLeft, dy=c.top-startTop;
      const movedNow=Math.hypot(dx,dy);
      if(detectMode(floatingEl)==='gr') grMovedDistance=Math.max(grMovedDistance,movedNow);
      const now=performance.now(); pushSample(e.clientX,e.clientY,now); lastMoveX=e.clientX; lastMoveY=e.clientY; lastMoveT=now;
    });

    window.addEventListener('pointerup', e=>{
      if(!dragging) return;
      dragging=false; try{el.releasePointerCapture(e.pointerId);}catch{}
      const now=performance.now(); pushSample(e.clientX,e.clientY,now);
      if (detectMode(floatingEl)==='gr') {
        grMovedSinceShown = grMovedDistance > TUNE.moveThresh;
      }
      const quietTime=now-lastMoveT; const quietDist=Math.hypot(e.clientX-lastMoveX,e.clientY-lastMoveY);
      if(quietTime>=TUNE.releaseQuietMs && quietDist<=TUNE.releaseQuietPx){ freezeAndSave(); return; }
      const v=releaseVelocity(); startInertia(v.vx,v.vy);
    });

    const subObs = new MutationObserver(()=>syncChevronFlag());
    subObs.observe(el, {childList:true, subtree:true, attributes:true});

    window.addEventListener('resize', ()=>{
      if(!floatingEl) return;
      const st=loadState(); if(!st||!st.pos) return;
      const r0=floatingEl.getBoundingClientRect();
      const p=applyAnchoredPosition(r0.width,r0.height,st.pos);
      writeAndSave(Math.min(Math.max(0,p.left),innerWidth-r0.width), Math.min(Math.max(0,p.top),innerHeight-r0.height));
    });

    document.addEventListener('click', (e)=>{
      if(!floatingEl || !floatingEl.contains(e.target)) return;
      const t=e.target;
      if(t.matches('#show-answer, input[type="submit"][value="Show answer"]')){
        const r=floatingEl.getBoundingClientRect();
        lastSAEntry = entryFromRect(r);
        grMovedSinceShown = false;
        pendingCenter = {
          prevW: r.width, prevH: r.height,
          anchX: isAnchoredX(lastSAEntry), anchY: isAnchoredY(lastSAEntry)
        };
        freezeAndSave();
        return;
      }
      if(t.matches('#show-checkbox-1-label')) setTimeout(ensureOpacityUI, 0);
    }, true);

    document.addEventListener('submit', (e)=>{
      if(!(floatingEl && floatingEl.contains(e.target))) return;
      const mode = detectMode(floatingEl);
      const r = floatingEl.getBoundingClientRect();

      if(mode==='sa'){
        lastSAEntry = entryFromRect(r);
        grMovedSinceShown = false;
        pendingCenter = {
          prevW: r.width, prevH: r.height,
          anchX: isAnchoredX(lastSAEntry), anchY: isAnchoredY(lastSAEntry)
        };
        freezeAndSave();
        return;
      }

      if(mode==='gr'){
        let nextEntry;
        if(!grMovedSinceShown){
          nextEntry = lastSAEntry || entryFromRect(r);
        }else{
          const near = maskNearEdges(r, TUNE.anchorSense);
          if(near.L || near.R || near.T || near.B){
            nextEntry = makePartialAnchorEntry(r, near);
          }else{
            nextEntry = {x:r.left,y:r.top,ax:null,ay:null,offR:0,offB:0,lockL:false,lockR:false,lockT:false,lockB:false};
          }
        }
        setForcedSave(nextEntry);
        pendingCenter = {
          prevW: r.width, prevH: r.height,
          anchX: isAnchoredX(nextEntry), anchY: isAnchoredY(nextEntry)
        };
        freezeAndSave();
        return;
      }
    }, true);

    document.addEventListener('keydown', (e)=>{
      if(!floatingEl || !floatingEl.contains(e.target)) return;
      if(e.key==='Enter') freezeAndSave();
    }, true);

    window.addEventListener('pagehide', freezeAndSave, {capture:true});
    window.addEventListener('beforeunload', freezeAndSave, {capture:true});
    document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='hidden') freezeAndSave(); }, {capture:true});
  }

  let sizeObs=null;
  function startSizeObserver(el){
    if(sizeObs) try{sizeObs.disconnect();}catch{}
    sizeObs=new ResizeObserver(()=>{
      if(suppressRO>0){ suppressRO--; return; }
      if(!floatingEl) return;
      const r=el.getBoundingClientRect();
      const st=loadState(); const pos=st&&st.pos?st.pos:null;
      if(!pos) return;
      const c=clamp(r.left,r.top,r.width,r.height);
      el.style.left=c.left+'px'; el.style.top=c.top+'px';
      saveFromRect(el.getBoundingClientRect());
    });
    sizeObs.observe(el);
  }

  function applySaved(el){
    const st=loadState(); const r0=el.getBoundingClientRect();
    if(st&&st.pos){
      const p=applyAnchoredPosition(r0.width,r0.height,st.pos); el.style.left=p.left+'px'; el.style.top=p.top+'px';
      saveFromRect(el.getBoundingClientRect());
    }else{
      const c=clamp(Math.max(0,innerWidth-r0.width-20), Math.max(0,innerHeight-r0.height-20), r0.width, r0.height);
      el.style.left=c.left+'px'; el.style.top=c.top+'px'; saveFromRect(el.getBoundingClientRect());
    }
  }

  function runPendingCenterComp(){
    if(!pendingCenter || !floatingEl) return;
    const r=floatingEl.getBoundingClientRect();
    let nl=r.left, nt=r.top;
    if(!pendingCenter.anchX) nl = r.left - (r.width - pendingCenter.prevW)/2;
    if(!pendingCenter.anchY) nt = r.top  - (r.height - pendingCenter.prevH)/2;
    const c = clamp(nl, nt, r.width, r.height);
    suppressRO = 2;
    floatingEl.style.left=c.left+'px';
    floatingEl.style.top =c.top +'px';
    saveFromRect(floatingEl.getBoundingClientRect());
    pendingCenter=null;
  }

  function floatIt(el){
    if(!el || floatingEl===el) return;
    if(floatingEl && floatingEl.isConnected){
      floatingEl.classList.remove('jpdbf-float','jpdbf-op-open','jpdbf-has-chevron','jpdbf-prehide-target');
      floatingEl.style.left=''; floatingEl.style.top='';
    }
    floatingEl=el;
    try{ el.classList.add('jpdbf-prehide-target'); }catch{}
    el.classList.add('jpdbf-float');
    const hasChevron = !!el.querySelector('#show-checkbox-1-label.side-button');
    el.classList.toggle('jpdbf-has-chevron', hasChevron);
    applySaved(el);
    applyOpacityTo(el);
    attachDrag(el);
    startSizeObserver(el);
    if(detectMode(el)==='gr') ensureOpacityUI();
    if (window.__jpdbf_unhideJPDB) window.__jpdbf_unhideJPDB(el);
    requestAnimationFrame(()=>{ runPendingCenterComp(); });
    setTimeout(()=>{ runPendingCenterComp(); }, 120);
  }

  function boot(){ const c=findMenu(); if(c) floatIt(c); }
  new MutationObserver(()=>{ boot(); }).observe(document.documentElement,{childList:true,subtree:true});
  let lastHref=location.href;
  setInterval(()=>{ if(location.href!==lastHref){ lastHref=location.href; boot(); } }, 300);
  boot(); setTimeout(boot, 400);
})();
