// ==UserScript==
// @name         图寻 Tuxun Pro Plus 一键坐标
// @namespace    sv-helper
// @version      2.0
// @description  F10打开小窗；Shift+X 标记答案；Ctrl+Shift+X 一键5K。
// @author       MEA_Tres / Cetonell
// @match        https://tuxun.fun/*
// @run-at       document-start
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547551/%E5%9B%BE%E5%AF%BB%20Tuxun%20Pro%20Plus%20%E4%B8%80%E9%94%AE%E5%9D%90%E6%A0%87.user.js
// @updateURL https://update.greasyfork.org/scripts/547551/%E5%9B%BE%E5%AF%BB%20Tuxun%20Pro%20Plus%20%E4%B8%80%E9%94%AE%E5%9D%90%E6%A0%87.meta.js
// ==/UserScript==
/* global google */
(() => {
  'use strict';

  // state/utils
  const S={gsvPool:[],gsvActive:null,miniMap:null,answerLL:null,pinEl:null,pinBtn:null,pinVisible:false,
    panel:null,panelHeader:null,content:null,controls:null,kbdBox:null,posKey:'svh_panel_pos_v2',dragging:false,
    bridgeReady:false,cache:new Map(),gid:null,gidReq:null};
  const isPoint=()=>/\/point(\/|$)/.test(location.pathname);
  const isChallenge=()=>/\/challenge(\/|$)/.test(location.pathname);
  const gameIdFromURL=()=>location.pathname.split('/').filter(Boolean).pop();
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const waitUntil=(p,t=8e3,s=80)=>new Promise((res,rej)=>{const t0=Date.now();(function L(){if(p())res();else if(Date.now()-t0>t)rej();else setTimeout(L,s)}())});
  const fmt=n=>(+n).toFixed?(+n).toFixed(6):n;
  const k5=(lat,lng)=>`${(+lat).toFixed(5)},${(+lng).toFixed(5)}`;
  const offsetLL=(lat,lng)=>{const r=5+Math.random()*10,a=Math.random()*Math.PI*2,dLat=r/111320,dLng=r/(111320*Math.cos(lat*Math.PI/180));return{lat:lat+dLat*Math.sin(a),lng:lng+dLng*Math.cos(a)};};
  function toastEl(){let t=document.getElementById('svh-toast');if(!t){t=document.createElement('div');t.id='svh-toast';
    Object.assign(t.style,{position:'fixed',left:'50%',top:'50%',transform:'translate(-50%,-50%)',zIndex:2147483647,background:'rgba(0,0,0,.72)',color:'#fff',padding:'10px 14px',borderRadius:'12px',fontSize:'14px',boxShadow:'0 6px 20px rgba(0,0,0,.25)',opacity:'0',transition:'opacity .18s'});
    document.documentElement.appendChild(t);}return t;}
  function showToast(text,ms=2200){const t=toastEl();t.textContent=text;t.style.opacity='1';clearTimeout(t.__timer);t.__timer=setTimeout(()=>t.style.opacity='0',ms);}

  // challenge gid
  function resetGid(){S.gid=null;S.gidReq=null;try{delete window.__svh_gid;}catch{}}
  const saveGid=g=>{if(g){S.gid=g;window.__svh_gid=g;}};
  async function ensureGid(){
    if(!isChallenge())return null;
    if(S.gid) return S.gid;
    if(S.gidReq){try{await S.gidReq;}catch{} return S.gid;}
    const urlId=gameIdFromURL(); if(urlId&&/^[a-f0-9-]{24,36}$/i.test(urlId)) saveGid(urlId);
    S.gidReq=(async()=>{
      try{
        const r=await fetch(`${location.origin}/api/v0/tuxun/challenge/getGameInfo?challengeId=${encodeURIComponent(urlId)}`,{credentials:'include'});
        const j=r.ok?await r.json():null; saveGid(j?.data?.id);
      }catch{}
      if(!S.gid){
        const n=document.getElementById('__NEXT_DATA__')?.textContent||'';
        const m=n.match(/"gameId"\s*:\s*"([^"]{8,})"/)||n.match(/\b[a-f0-9]{24}\b/i);
        saveGid(m?.[1]||m?.[0]||null);
      }
      return S.gid;
    })();
    try{await S.gidReq;}finally{S.gidReq=null;}
    return S.gid;
  }

  // point WS bridge
  function injectPointBridge(){
    if(!isPoint()||S.bridgeReady) return;
    const code=`(function(){if(window.__SVH_POINT_BRIDGE__)return;const b=window.__SVH_POINT_BRIDGE__={canAnswer:false,ws:null,lastTick:null};
      const W=window.WebSocket;window.WebSocket=function(...a){const ws=new W(...a);ws.addEventListener('message',e=>{try{
        const d=JSON.parse(e.data);if(d&&d.scope==='tuxun') b.ws=ws;
        if(d?.scope==='tuxun'&&d.data?.type==='tick'){b.lastTick=d.data;const st=String(d.data.status||'').toLowerCase();
          const tl=Number(d.data.timeLeft??d.data.leftTime??d.data.remainTime??NaN);const inRes=/rank|result|settle/.test(st);
          const ok=Number.isFinite(tl)?tl>0:null;b.canAnswer=!inRes&&(ok===null?st==='wait':ok);}
      }catch{}});return ws;};
      window.addEventListener('message',e=>{const m=e?.data;if(!m||m.__svh!=='POINT'||m.cmd!=='point_guess')return;
        if(!b.ws){window.postMessage({__svh:'POINT_FEEDBACK',ok:false,err:'no-ws'},'*');return;}
        if(!b.canAnswer&&!window.__SVH_FORCE_POINT__){window.postMessage({__svh:'POINT_FEEDBACK',ok:false,err:'not-answering'},'*');return;}
        try{b.ws.send(JSON.stringify({scope:'tuxun',data:{type:'pin',lat:m.lat,lng:m.lng}}));
          setTimeout(()=>{try{b.ws.send(JSON.stringify({scope:'tuxun',data:{type:'confirm',lat:m.lat,lng:m.lng}}));}catch{};
            window.postMessage({__svh:'POINT_FEEDBACK',ok:true},'*');},80+Math.floor(Math.random()*60));
        }catch(err){window.postMessage({__svh:'POINT_FEEDBACK',ok:false,err:String(err&&err.message||err)},'*');}},false);
      window.postMessage({__svh:'POINT_READY'},'*');})();`;
    const s=document.createElement('script');s.textContent=code;document.documentElement.appendChild(s);s.remove();
    window.addEventListener('message',e=>{
      const d=e?.data;if(!d||typeof d!=='object')return;
      if(d.__svh==='POINT_READY') S.bridgeReady=true;
      if(d.__svh==='POINT_FEEDBACK'){
        if(d.ok) showToast('已提交（积分赛）');
        else showToast(d.err==='not-answering'?'当前不可提交（等待结算/下一题）':(d.err==='no-ws'?'连接未就绪，请稍后再试':'提交失败：'+d.err));
      }
    },false);
  }

  // HTTP pin/guess
  const api={
    pin:async(lat,lng)=>{const ch=isChallenge(),base=ch?'/api/v0/tuxun/challenge':'/api/v0/tuxun/game';
      const gid=ch?(S.gid||await ensureGid()):gameIdFromURL(); if(ch&&!gid) throw new Error('no-gid');
      const url=`${location.origin}${base}/pin?gameId=${encodeURIComponent(gid)}&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&_=${Date.now()}`;
      return fetch(url,{method:'GET',credentials:'same-origin'});},
    guess:async(lat,lng)=>{const ch=isChallenge(),base=ch?'/api/v0/tuxun/challenge':'/api/v0/tuxun/game';
      const gid=ch?(S.gid||await ensureGid()):gameIdFromURL(); if(ch&&!gid) throw new Error('no-gid');
      const url=`${location.origin}${base}/guess?gameId=${encodeURIComponent(gid)}&lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&_=${Date.now()}`;
      return fetch(url,{method:'GET',credentials:'same-origin'});}
  };

  // GSV hook
  function hookGSV(){
    if(!window.google||!google.maps) return false;
    if(google.maps.StreetViewPanorama&&!google.maps.StreetViewPanorama.__svh){
      const O=google.maps.StreetViewPanorama;
      google.maps.StreetViewPanorama=function(...a){const x=new O(...a);trackSVP(x,true);return x;};
      google.maps.StreetViewPanorama.prototype=O.prototype;google.maps.StreetViewPanorama.__svh=true;
    }
    if(google.maps.Map&&!google.maps.Map.__svh){
      const M=google.maps.Map;
      google.maps.Map=function(...a){const m=new M(...a);const gsv=m.getStreetView?.bind(m);
        if(gsv&&!m.__svh_gsv){m.getStreetView=function(){const p=gsv();if(p)trackSVP(p,true);return p;};m.__svh_gsv=true;}
        return m;};
      google.maps.Map.prototype=M.prototype;google.maps.Map.__svh=true;
    }
    return true;
  }
  function trackSVP(p,newInst=false){if(!S.gsvPool.includes(p))S.gsvPool.push(p);const mark=()=>{S.gsvActive=p;};
    p.addListener?.('position_changed',mark);p.addListener?.('pano_changed',mark);mark();if(newInst) hidePin();}
  (function poll(){ if(hookGSV()) return; setTimeout(poll,80); })();

  // round/route
  function hidePin(){try{S.miniMap?.off?.('move',S.pinEl?.__reproject);S.miniMap?.off?.('zoom',S.pinEl?.__reproject);S.miniMap?.off?.('resize',S.pinEl?.__reproject);}catch{}
    S.pinEl?.remove();S.pinEl=null;S.pinVisible=false;S.pinBtn&&(S.pinBtn.textContent='📌 显示答案');}
  function resetRound(){S.answerLL=null;hidePin();panelHide(false);}
  function onRouteChange(){resetRound();resetGid();setTimeout(()=>{hookGSV();ensureGid().catch(()=>{});injectPointBridge();},0);}
  const _push=history.pushState;history.pushState=function(...a){const r=_push.apply(this,a);onRouteChange();return r;};
  addEventListener('popstate',onRouteChange);

  // minimap
  function ensureMiniMap(){
    if(S.miniMap&&typeof S.miniMap.project==='function') return S.miniMap;
    const seen=new WeakSet(),ok=o=>o&&typeof o==='object'&&typeof o.project==='function'&&typeof o.getCenter==='function';
    const st=[window];while(st.length){const o=st.pop();if(!o||typeof o!=='object'||seen.has(o))continue;seen.add(o);
      try{if(ok(o)||(typeof o.getCanvasContainer==='function'&&ok(o))){S.miniMap=o;break;}
        for(const k in o){const v=o[k];if(v&&typeof v==='object'&&!seen.has(v))st.push(v);}
      }catch{}}
    return S.miniMap||null;
  }

  // panel
  function panelLoadPos(){try{const j=localStorage.getItem(S.posKey);if(!j)return null;const p=JSON.parse(j);
      if(Number.isFinite(p.left)&&Number.isFinite(p.top)) return p;}catch{} return null;}
  function panelSavePos(){if(!S.panel) return;const left=parseFloat(S.panel.style.left)||24;const top=parseFloat(S.panel.style.top)||24;
    try{localStorage.setItem(S.posKey,JSON.stringify({left,top}));}catch{}}
  function panelShow(){if(!S.panel) return;S.panel.style.display='block';S.panel.style.opacity='0';S.panel.style.transform='scale(0.98)';
    requestAnimationFrame(()=>{S.panel.style.transition='opacity .18s, transform .18s, box-shadow .18s';S.panel.style.opacity='1';S.panel.style.transform='scale(1)';S.panel.style.boxShadow='0 20px 40px rgba(0,0,0,.28)';});}
  function panelHide(save=true){if(!S.panel||S.panel.style.display==='none')return;if(save)panelSavePos();
    S.panel.style.transition='opacity .15s, transform .15s, box-shadow .15s';S.panel.style.opacity='0';S.panel.style.transform='scale(0.98)';S.panel.style.boxShadow='0 6px 18px rgba(0,0,0,.2)';
    setTimeout(()=>{if(S.panel)S.panel.style.display='none';},160);}
  function togglePanel(){if(!S.panel) return;if(S.panel.style.display==='none'||!S.panel.style.display){if(!S.panel.__initedPos){
        const p=panelLoadPos();S.panel.style.left=(p?.left??(window.innerWidth-340-24))+'px';S.panel.style.top=(p?.top??80)+'px';S.panel.__initedPos=true;}
      panelShow();locate().catch(()=>{});}else panelHide(true);}

  function mountUI(){
    if(S.panel) return;
    const panel=document.createElement('div');S.panel=panel;
    Object.assign(panel.style,{position:'fixed',left:'calc(100% - 340px - 24px)',top:'80px',width:'340px',minHeight:'120px',zIndex:2147483647,display:'none',
      background:'rgba(255,255,255,0.75)',backdropFilter:'blur(16px) saturate(1.1)',WebkitBackdropFilter:'blur(16px) saturate(1.1)',
      border:'1px solid rgba(255,255,255,0.6)',borderRadius:'16px',boxShadow:'0 10px 22px rgba(0,0,0,.18)',color:'#111',
      fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text","Segoe UI",Roboto,Helvetica,Arial'});

    const header=document.createElement('div');S.panelHeader=header;
    Object.assign(header.style,{height:'34px',display:'flex',alignItems:'center',padding:'0 12px',cursor:'grab',borderBottom:'1px solid rgba(255,255,255,0.5)',borderTopLeftRadius:'16px',borderTopRightRadius:'16px',gap:'10px'});
    const redBtn=document.createElement('span');
    Object.assign(redBtn.style,{width:'16px',height:'16px',borderRadius:'50%',display:'inline-block',background:'#ff5f57',boxShadow:'inset 0 0 0 1px rgba(0,0,0,.08)',cursor:'pointer',transition:'transform .12s, box-shadow .12s'});
    redBtn.title='关闭'; redBtn.onmouseenter=()=>{redBtn.style.boxShadow='0 0 0 3px rgba(255,95,87,.25), inset 0 0 0 1px rgba(0,0,0,.08)';};
    redBtn.onmouseleave=()=>{redBtn.style.boxShadow='inset 0 0 0 1px rgba(0,0,0,.08)';}; redBtn.onclick=()=>panelHide(true);
    const title=document.createElement('div');Object.assign(title.style,{fontSize:'12px',fontWeight:'600',color:'#333',letterSpacing:'.2px'});title.textContent='图寻 Pro Plus · 坐标';
    header.append(redBtn,title); panel.appendChild(header);

    const content=document.createElement('div');S.content=content;Object.assign(content.style,{padding:'10px 12px 8px',fontSize:'12px',lineHeight:'1.6',whiteSpace:'pre-wrap',wordBreak:'break-word',userSelect:'text'});panel.appendChild(content);
    const controls=document.createElement('div');S.controls=controls;Object.assign(controls.style,{padding:'0 12px 10px',display:'flex',gap:'8px',flexWrap:'wrap'});panel.appendChild(controls);

    const kbd=document.createElement('div');S.kbdBox=kbd;
    Object.assign(kbd.style,{margin:'0 12px 12px',padding:'10px 12px',borderRadius:'12px',background:'rgba(255,255,255,0.6)',border:'1px solid rgba(0,0,0,0.06)',boxShadow:'inset 0 1px 0 rgba(255,255,255,.6)',color:'#333',fontSize:'12px',lineHeight:'1.7'});
    const row=(build,desc)=>{const line=document.createElement('div');Object.assign(line.style,{display:'flex',alignItems:'center',gap:'10px',margin:'2px 0'});
      const keys=document.createElement('div');Object.assign(keys.style,{display:'flex',alignItems:'center',gap:'6px',whiteSpace:'nowrap'});
      const mk=t=>{const s=document.createElement('span');s.textContent=t;Object.assign(s.style,{padding:'2px 7px',border:'1px solid rgba(0,0,0,.18)',borderRadius:'6px',background:'#fff',fontSize:'11px',fontWeight:'600',letterSpacing:'.2px',boxShadow:'0 1px 0 rgba(0,0,0,.03)'});return s;};
      const plus=()=>{const p=document.createElement('span');p.textContent='+';Object.assign(p.style,{opacity:.7});return p;};
      build(mk,plus,keys); const d=document.createElement('span');d.textContent='：'+desc; line.append(keys,d); return line;};
    const ttl=document.createElement('div');ttl.textContent='⌨ 快捷键';Object.assign(ttl.style,{fontWeight:'600',marginBottom:'6px'});kbd.appendChild(ttl);
    kbd.appendChild(row((K,P,w)=>{w.append(K('F10'));},'打开/关闭小窗'));
    kbd.appendChild(row((K,P,w)=>{w.append(K('Shift'),P(),K('X'));},'在小地图标记当前位置'));
    kbd.appendChild(row((K,P,w)=>{w.append(K('Ctrl'),P(),K('Shift'),P(),K('X'));},'一键 5k（偏移 5–15 m 并自动确认）'));
    panel.appendChild(kbd);

    document.body.appendChild(panel);

    // drag
    let sx=0,sy=0,sl=0,st=0;
    const move=e=>{const x=(e.touches?e.touches[0].clientX:e.clientX),y=(e.touches?e.touches[0].clientY:e.clientY);
      let L=sl+(x-sx),T=st+(y-sy);const pad=8,W=panel.offsetWidth,H=panel.offsetHeight;L=Math.min(window.innerWidth-pad,Math.max(-W+pad,L));T=Math.min(window.innerHeight-pad,Math.max(0,T));
      panel.style.left=L+'px';panel.style.top=T+'px';};
    const end=()=>{S.dragging=false;header.style.cursor='grab';document.removeEventListener('mousemove',move);document.removeEventListener('mouseup',end);
      document.removeEventListener('touchmove',move);document.removeEventListener('touchend',end);panelSavePos();};
    const start=e=>{if(e.target===redBtn)return;S.dragging=true;header.style.cursor='grabbing';
      sx=(e.touches?e.touches[0].clientX:e.clientX);sy=(e.touches?e.touches[0].clientY:e.clientY);sl=parseFloat(panel.style.left)||0;st=parseFloat(panel.style.top)||0;
      document.addEventListener('mousemove',move);document.addEventListener('mouseup',end);document.addEventListener('touchmove',move,{passive:false});document.addEventListener('touchend',end);e.preventDefault();};
    header.addEventListener('mousedown',start);header.addEventListener('touchstart',start,{passive:false});

    // click-outside hide
    addEventListener('mousedown',e=>{if(!S.panel||S.panel.style.display==='none')return;if(S.dragging)return;if(!S.panel.contains(e.target))panelHide(true);},true);
  }

  // panel content
  const renderInfo=(lat,lng,i)=>[`纬度: ${fmt(lat)}`,`经度: ${fmt(lng)}`,`国家: ${i?.country||'-'}`,`一级行政区: ${i?.admin1||'-'}`,`二级行政区: ${i?.admin2||'-'}`,`城市/城镇: ${i?.locality||'-'}`,`地址: ${i?.address||'-'}`].join('\n');

  function setPanel(html,lat=null,lng=null){
    if(!S.panel) return;
    S.content.textContent=''; S.controls.innerHTML=''; S.content.innerHTML=html.replace(/\n/g,'<br/>');

    if(lat!=null&&lng!=null){
      const mkBtn=(text,style={},onClick=()=>{})=>{const b=document.createElement('button');b.textContent=text;
        Object.assign(b.style,{padding:'6px 10px',borderRadius:'10px',border:'1px solid rgba(0,0,0,.08)',background:'rgba(255,255,255,0.65)',backdropFilter:'blur(10px)',cursor:'pointer',fontSize:'12px',transition:'transform .12s, box-shadow .12s'},style);
        b.onmouseenter=()=>{b.style.transform='translateY(-1px)';b.style.boxShadow='0 8px 16px rgba(0,0,0,.12)';};
        b.onmouseleave=()=>{b.style.transform='none';b.style.boxShadow='none';}; b.onclick=onClick; return b;};

      const copyBtn = mkBtn('复制经纬度',{},()=>navigator.clipboard.writeText(`${fmt(lat)},${fmt(lng)}`).then(()=>showToast(`已复制：${fmt(lat)},${fmt(lng)}`)).catch(()=>{}));
      const gmapBtn = mkBtn('Google地图',{},()=>window.open(`https://maps.google.com/?cbll=${lat},${lng}&layer=c`,'_blank'));
      const pinBtn  = mkBtn(S.pinVisible?'📌 隐藏答案':'📌 显示答案',{background:'#0b5cff',color:'#fff',border:'1px solid #0b5cff'},()=>{togglePin();pinBtn.textContent=S.pinVisible?'📌 隐藏答案':'📌 显示答案';}); S.pinBtn=pinBtn;
      const kBtn    = mkBtn('🎯 一键5k',{background:'#16a34a',color:'#fff',border:'1px solid #16a34a'},()=>oneKey5k());

      S.controls.append(copyBtn,gmapBtn,pinBtn,kBtn);
    }
  }

  // locate/mark/5k
  async function locateBare(force=false){
    if(!force&&S.answerLL) return true;
    try{await waitUntil(()=>S.gsvPool.length>0);}catch{return false;}
    const svp=S.gsvActive||S.gsvPool[0];const pos=svp?.getPosition?.();if(!pos)return false;
    const lat=pos.lat?.()??pos.lat,lng=pos.lng?.()??pos.lng;S.answerLL={lat:+lat,lng:+lng};return true;
  }
  async function locate(){
    if(!S.panel) return; setPanel('定位中…');
    try{await waitUntil(()=>S.gsvPool.length>0);}catch{setPanel('未捕获到街景实例');return;}
    const svp=S.gsvActive||S.gsvPool[0];const pos=svp?.getPosition?.();if(!pos){setPanel('未获得坐标');return;}
    const lat=pos.lat?.()??pos.lat,lng=pos.lng?.()??pos.lng;
    setPanel([`纬度: ${fmt(lat)}`,`经度: ${fmt(lng)}`,'国家: 查询中…','一级行政区: 查询中…','二级行政区: 查询中…','城市/城镇: 查询中…','地址: 查询中…'].join('\n'),lat,lng);
    const key=k5(lat,lng);
    if(S.cache.has(key)) setPanel(renderInfo(lat,lng,S.cache.get(key)),lat,lng);
    else{try{const d=await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=10&addressdetails=1`,{headers:{Accept:'application/json'}}).then(r=>r.json());
        const a=d?.address||{};const info={country:a.country||'',admin1:a.state||a.region||a.province||'',admin2:a.county||a.district||'',locality:a.city||a.town||a.village||a.suburb||'',address:d?.display_name||''};
        S.cache.set(key,info);setPanel(renderInfo(lat,lng,info),lat,lng);}catch{setPanel(renderInfo(lat,lng,null),lat,lng);} }
    S.answerLL={lat:+lat,lng:+lng};S.pinEl?.__reproject?.();
  }
  function ensurePin(map){
    const c=map.getContainer?.()||map.getCanvasContainer?.();if(!c)return null;
    if(!S.pinEl){const pin=document.createElement('div');Object.assign(pin.style,{position:'absolute',width:'18px',height:'18px',background:'#0b5cff',borderRadius:'50%',boxShadow:'0 0 6px rgba(0,0,0,.35)',transform:'translate(-50%,-100%)',pointerEvents:'none',zIndex:'9999'});
      const tail=document.createElement('div');Object.assign(tail.style,{position:'absolute',left:'50%',top:'100%',width:0,height:0,borderLeft:'5px solid transparent',borderRight:'5px solid transparent',borderTop:'8px solid #0b5cff',transform:'translateX(-50%)'});pin.appendChild(tail);
      c.appendChild(pin); pin.__reproject=()=>{if(!S.answerLL)return;const p=S.miniMap.project([S.answerLL.lng,S.answerLL.lat]);pin.style.left=`${p.x}px`;pin.style.top=`${p.y}px`;};
      S.pinEl=pin; S.miniMap.on?.('move',pin.__reproject);S.miniMap.on?.('zoom',pin.__reproject);S.miniMap.on?.('resize',pin.__reproject);}
    return S.pinEl;
  }
  function togglePin(){if(!S.answerLL){locate().then(()=>S.answerLL&&togglePin());return;}
    const map=ensureMiniMap();if(!map){alert('未找到小地图实例');return;}S.miniMap=map;
    if(S.pinVisible){hidePin();}else{ensurePin(map);S.pinEl.__reproject();S.pinVisible=true;}
    S.pinBtn&&(S.pinBtn.textContent=S.pinVisible?'📌 隐藏答案':'📌 显示答案');}
  async function oneKey5k(){
    try{
      if(!(await locateBare(true))){showToast('未获得街景坐标');return;}
      const {lat,lng}=offsetLL(S.answerLL.lat,S.answerLL.lng);
      if(isPoint()){if(!S.bridgeReady) injectPointBridge(); window.postMessage({__svh:'POINT',cmd:'point_guess',lat,lng},'*');return;}
      if(isChallenge()&&!(S.gid||await ensureGid())){showToast('未捕获本题编号');return;}
      await api.pin(lat,lng);await sleep(150+Math.random()*150);await api.guess(lat,lng);
      panelHide(true);showToast('已自动5k');
    }catch{showToast('一键5k失败，请重试');}
  }

  // observers & clicks
  new MutationObserver(()=>{if(S.pinVisible){const c=S.miniMap?.getContainer?.()||S.miniMap?.getCanvasContainer?.();if(!c||!document.contains(c))hidePin();}hookGSV();})
    .observe(document.documentElement,{childList:true,subtree:true});
  addEventListener('click',e=>{const t=(e.target&&((e.target.closest?.('button,a,div'))||e.target));const txt=(t?.textContent||'').trim();if(txt&&/(确定选择|下一轮|下一题|返回|next|结果)/i.test(txt)) resetRound();},true);

  // hotkeys
  addEventListener('keydown',async e=>{
    const tag=(e.target?.tagName||'').toLowerCase();const ed=e.target&&(e.target.isContentEditable||e.target.getAttribute?.('contenteditable')==='true');
    if(tag==='input'||tag==='textarea'||ed) return;
    const isX=(e.code==='KeyX'||(typeof e.key==='string'&&e.key.toLowerCase()==='x'));
    if(e.code==='F10'||e.key==='F10'){e.preventDefault();togglePanel();return;}
    if(isX&&e.shiftKey&&e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();oneKey5k();}
    if(isX&&e.shiftKey&&!e.ctrlKey&&!e.altKey&&!e.metaKey){e.preventDefault();if(!(await locateBare(true)))return;const map=ensureMiniMap();if(!map)return;S.miniMap=map;ensurePin(map);S.pinEl.__reproject();S.pinVisible=true;S.pinBtn&&(S.pinBtn.textContent='📌 隐藏答案');showToast('已在地图标记位置');}
  });

  // boot
  const boot=()=>{mountUI();ensureGid().catch(()=>{});injectPointBridge();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
