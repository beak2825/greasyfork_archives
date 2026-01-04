// ==UserScript==
// @name Baslimbus Owned Toggle
// @match https://baslimbus.info/passive
// @namespace https://dlwlsdn3642.github.io/
// @description  패시브 페이지에서 '내 소유'만 보기 토글
// @version   1.0.0
// @license      MIT
// @run-at document-idle
// @grant none
// @namespace
// @downloadURL https://update.greasyfork.org/scripts/546865/Baslimbus%20Owned%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/546865/Baslimbus%20Owned%20Toggle.meta.js
// ==/UserScript==

(function () {
  const SEASON_KIND = 6;
  const OWNED_LS_KEY = 'selectedIdentities';
  const BTN_LABEL_HTML = '<span class="text-xl text-white">내 소유</span>';
  const BTN_ID = 'owned-support-btn';

  function injectPageScript(js) {
    const s = document.createElement('script');
    s.textContent = js;
    (document.head || document.documentElement).appendChild(s);
    s.remove();
  }

  injectPageScript(`
    (function(){
      const SEASON_KIND=${SEASON_KIND};
      const OWNED_LS_KEY='${OWNED_LS_KEY}';
      const state={on:false,idx:null};
      const norm=s=>(s??'').toString().trim().replace(/\\s+/g,'').normalize('NFC');
      const loadOwned=()=>{try{return new Set(JSON.parse(localStorage.getItem(OWNED_LS_KEY)||'[]').map(Number).filter(Number.isFinite));}catch{return new Set();}};
      async function buildIndex(){
        if(state.idx) return state.idx;
        const map=new Map();
        for(let p=0;p<200;p++){
          const r=await fetch('https://baslimbus.store/dictionary/paginated/identity?size=100&page='+p,{cache:'no-store'});
          if(!r.ok) break;
          const d=await r.json();
          const list=d.list||d;
          for(const it of (list||[])){
            const id=Number(it?.id);
            if(Number.isFinite(id)) map.set(\`\${norm(it?.character)}|\${norm(it?.name)}|\${it?.season??''}\`,id);
          }
          if(d.last===true) break;
        }
        state.idx=map;
        return map;
      }
      function isSkill(input,init){
        try{
          const u=typeof input==='string'?new URL(input,location.origin):new URL(input.url,location.origin);
          const m=(init&&init.method)?String(init.method).toUpperCase():'GET';
          return m==='GET'&&u.pathname.startsWith('/dictionary/paginated/skill/')&&u.pathname.endsWith('/'+SEASON_KIND);
        }catch{return false;}
      }
      const _fetch=window.fetch;
      window.fetch=async function(input,init){
        const res=await _fetch(input,init);
        if(!state.on||!isSkill(input,init)) return res;
        const ct=res.headers.get('content-type')||'';
        if(!ct.includes('application/json')) return res;
        let data; try{data=await res.clone().json();}catch{return res;}
        const list=Array.isArray(data?.list)?data.list:(Array.isArray(data)?data:null);
        if(!Array.isArray(list)||list.length===0) return res;
        const idx=await buildIndex();
        const owned=loadOwned();
        const filtered=list.filter(it=>{
          const key=\`\${norm(it?.sinnerName)}|\${norm(it?.identityName)}|\${it?.season??''}\`;
          const id=idx.get(key);
          return id!=null&&owned.has(id);
        });
        const body=Array.isArray(data)?filtered:{...data,list:filtered};
        return new Response(JSON.stringify(body),{status:res.status,statusText:res.statusText,headers:{'Content-Type':'application/json'}});
      };
      window.addEventListener('message',e=>{
        const m=e?.data; if(!m||m.__ownedSupport!==true) return;
        if(m.type==='toggle'){state.on=!!m.enabled; if(state.on&&!state.idx) buildIndex();}
      });
    })();
  `);

  let btn=null, on=false;

  function setBtn() {
    if (!btn) return;
    btn.classList.remove('bg-primary-400','border','border-primary-100','bg-primary-450');
    if (on) btn.classList.add('bg-primary-400','border','border-primary-100');
    else btn.classList.add('bg-primary-450');
  }

  function mask(el, ms=100){
    if(!el) return ()=>{};
    const wrap=document.createElement('div');
    wrap.style.position='fixed';
    wrap.style.zIndex='2147483647';
    wrap.style.pointerEvents='none';
    const clone=el.cloneNode(true);
    clone.style.transition='none';
    clone.style.animation='none';
    clone.style.margin='0';
    wrap.appendChild(clone);
    document.body.appendChild(wrap);
    let stop=false;
    const place=()=>{if(stop)return;const r=el.getBoundingClientRect();wrap.style.left=r.left+'px';wrap.style.top=r.top+'px';wrap.style.width=r.width+'px';wrap.style.height=r.height+'px';requestAnimationFrame(place);};
    place();
    const off=()=>{if(stop)return;stop=true;wrap.remove();};
    setTimeout(off,ms);
    return off;
  }

  function fire(el){
    ['pointerdown','mousedown','mouseup','click'].forEach(t=>el.dispatchEvent(new MouseEvent(t,{bubbles:true,cancelable:true,view:window})));
  }

  function anchor(){
    const g=document.querySelector('div.grid.grid-cols-3');
    return g?.querySelector('button:nth-of-type(2)')||null;
  }

  function reload(){
    const el=anchor(); if(!el) return;
    mask(el,100); fire(el); setTimeout(()=>fire(el),0);
  }

  function toggle(){
    on=!on; setBtn();
    window.postMessage({__ownedSupport:true,type:'toggle',enabled:on},'*');
    let i=0;(function loop(){if(anchor()){reload();return;} if(++i<10)setTimeout(loop,120);})();
  }

  function gridNode(){
    return document.querySelector('div.bg-primary-500.w-full.rounded.p-4.flex.flex-col.gap-2 div.grid.grid-cols-3')||document.querySelector('div.grid.grid-cols-3');
  }

  function upsert(){
    const g=gridNode(); if(!g) return;
    let exist=document.getElementById(BTN_ID);
    if(exist && exist.parentElement!==g) g.appendChild(exist);
    if(!exist){
      const s=g.querySelector('button, a[role="button"], a[href]');
      exist=document.createElement('button');
      exist.id=BTN_ID;
      exist.type='button';
      exist.className=s?s.className:'inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm font-medium transition bg-primary-450';
      exist.style.whiteSpace='nowrap';
      exist.innerHTML=BTN_LABEL_HTML;
      exist.addEventListener('click',toggle);
      g.appendChild(exist);
    }
    btn=exist; setBtn();
  }

  let scheduled=false;
  const schedule=()=>{ if(scheduled) return; scheduled=true; requestAnimationFrame(()=>{scheduled=false; upsert();}); };

  const mo=new MutationObserver(schedule);
  mo.observe(document.documentElement,{childList:true,subtree:true});

  window.addEventListener('load',schedule);
  document.addEventListener('visibilitychange',schedule,{passive:true});
})();
