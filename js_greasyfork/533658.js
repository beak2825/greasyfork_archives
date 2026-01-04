// ==UserScript==
// @name         Threads V2.2
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  支援多目標、自訂首頁、倒數顯示與防偵測功能，優化時間並正確計算完整循環次數 (首頁→目標→回首頁)。
// @author       ChatGPT
// @match        https://www.threads.net/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533658/Threads%20V22.user.js
// @updateURL https://update.greasyfork.org/scripts/533658/Threads%20V22.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // --- 防偵測 ---
    Object.defineProperty(navigator, 'webdriver', {get:() => false});
    Object.defineProperty(navigator, 'languages', {get:() => ['zh-TW','zh']});
    Object.defineProperty(navigator, 'plugins', {get:() => [1,2,3,4,5]});
    const UA_SUFFIX = [
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.96 Mobile Safari/537.36',
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.90 Mobile Safari/537.36',
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6082.47 Mobile Safari/537.36'
    ];
    const baseUA = navigator.userAgent.replace(/\s*\(.+?\)/, '');
    Object.defineProperty(navigator, 'userAgent', {get:() => baseUA + UA_SUFFIX[Math.floor(Math.random()*UA_SUFFIX.length)]});

    // --- 存儲鍵 ---
    const NS = 'ThreadsV22_';
    const STORAGE = {TARGETS:NS+'TARGETS', IDX:NS+'IDX', HOME:NS+'HOME', RUN:NS+'RUN', LOOP:NS+'LOOP', MAX:NS+'MAX'};
    const DEFAULT_HOME = 'https://www.threads.net';
    const DEFAULT_TARGETS = ['https://www.threads.net/posts/xxxxxx'];

    // --- 時間設定 (毫秒) ---
    const R = {STAY:[20000,30000], BROWSE:[60000,90000], SCROLL:[1000,3000], PAUSE:[3000,10000]};
    const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
    const wait=ms=>new Promise(r=>setTimeout(r,ms));
    const save=(k,v)=>GM_setValue(k,v);
    const load=(k,d)=>{const v=GM_getValue(k);return v!==undefined?v:d;};

    // --- 通知 ---
    function notify(title,text){
        if(typeof GM_notification==='function') GM_notification({title,text,timeout:2000});
        else toast(`${title}: ${text}`);
    }
    function toast(msg){
        const d=document.createElement('div'); d.textContent=msg;
        Object.assign(d.style,{position:'fixed',bottom:'20px',left:'50%',transform:'translateX(-50%)',background:'rgba(0,0,0,0.7)',color:'#fff',padding:'6px 10px',borderRadius:'4px',zIndex:99999});
        document.body.appendChild(d);
        setTimeout(()=>d.remove(),2000);
    }

    // --- UI ---
    const PID='tm_threads_v22'; if(document.getElementById(PID)) return;
    const panel=document.createElement('div'); panel.id=PID;
    Object.assign(panel.style,{position:'fixed',top:'10px',right:'10px',background:'#fff',border:'1px solid #ccc',padding:'8px',fontSize:'13px',zIndex:9999});
    const btnStart=document.createElement('button'); btnStart.textContent='開始';
    const btnStop=document.createElement('button'); btnStop.textContent='暫停'; btnStop.style.marginLeft='6px';
    const inpMax=document.createElement('input'); inpMax.placeholder='最大循環次數(留空無限)'; inpMax.style.width='100%'; inpMax.style.margin='4px 0';
    const inpHome=document.createElement('input'); inpHome.placeholder='首頁 URL'; inpHome.style.width='100%'; inpHome.style.margin='4px 0';
    const inpTar=document.createElement('textarea'); inpTar.placeholder='多目標 URL (逗號分隔)'; inpTar.style.width='100%'; inpTar.style.height='50px'; inpTar.style.margin='4px 0';
    const lblStatus=document.createElement('div'); lblStatus.textContent='狀態: 待命';
    const lblLoop=document.createElement('div'); lblLoop.textContent='完整循環: 0';
    const lblCount=document.createElement('div'); lblCount.textContent='倒數: 0s';
    panel.append(btnStart,btnStop,inpMax,inpHome,inpTar,lblStatus,lblLoop,lblCount);
    document.body.appendChild(panel);
    const updateStatus=t=>lblStatus.textContent='狀態: '+t;

    // --- 初始化值 ---
    inpHome.value=load(STORAGE.HOME,DEFAULT_HOME);
    inpTar.value=load(STORAGE.TARGETS,JSON.stringify(DEFAULT_TARGETS)).replace(/[\[\]"]+/g,'').split(',').join(', ');

    // --- 取值與狀態 ---
    function getTargets(){try{return JSON.parse(load(STORAGE.TARGETS,JSON.stringify(DEFAULT_TARGETS)));}catch{return DEFAULT_TARGETS;}}
    function getNext(){const list=getTargets();let idx=load(STORAGE.IDX,-1);idx=(idx+1)%list.length;save(STORAGE.IDX,idx);return list[idx];}
    function isTarget(){return getTargets().some(u=>location.href.startsWith(u));}

    // 紀錄進入目標頁
    let visitedTarget=load(STORAGE.RUN,false)?false:false;

    // --- 滾動模擬 ---
    async function scrollOnce(){const step=window.innerHeight*(Math.random()*0.5+0.5);let y=Math.min(Math.max(0,window.scrollY+step*(Math.random()<0.7?1:-1)),document.documentElement.scrollHeight-window.innerHeight);window.scrollTo({top:y,behavior:'smooth'});await wait(rand(...R.SCROLL));}

    // --- 單次模擬 ---
    async function simulate(){
        const tgt=isTarget();
        if(tgt) visitedTarget=true; // 標記已到目標頁
        updateStatus('瀏覽 '+(tgt?'目標頁':'首頁'));
        notify('模擬','開始 '+(tgt?'目標頁':'首頁'));
        const duration=rand(...(tgt?R.STAY:R.BROWSE));
        let rem=duration; lblCount.textContent='倒數: '+Math.ceil(rem/1000)+'s';
        const ti=setInterval(()=>{rem-=1000;lblCount.textContent='倒數: '+(rem>0?Math.ceil(rem/1000):0)+'s';},1000);
        const t0=Date.now(); while(Date.now()-t0<duration&&load(STORAGE.RUN,false)) await scrollOnce(); clearInterval(ti); lblCount.textContent='倒數: 0s';
        if(!load(STORAGE.RUN,false))return;
        await wait(rand(...R.PAUSE));
        const homeUrl=inpHome.value.trim()||DEFAULT_HOME; save(STORAGE.HOME,homeUrl);
        const nextUrl=tgt?homeUrl:getNext();
        // 完整循環：從目標頁返回首頁時計數一次
        if(tgt && nextUrl===homeUrl && visitedTarget){
            let c=load(STORAGE.LOOP,0)+1; save(STORAGE.LOOP,c); lblLoop.textContent='完整循環: '+c;
            // 檢查上限
            const m=load(STORAGE.MAX,Infinity); if(m!==Infinity&&c>=m){stop(`達上限 ${m}`);return;}
            visitedTarget=false;
        }
        location.href=nextUrl;
    }

    // --- 頁面載入自動啟動 ---
    function autoContinue(){ if(load(STORAGE.RUN,false)){ btnStart.disabled=true; lblLoop.textContent='完整循環: '+load(STORAGE.LOOP,0); simulate(); }}
    window.addEventListener('load',()=>setTimeout(autoContinue,3000));

    // --- 執行迴圈 ---
    async function runner(){ while(load(STORAGE.RUN,false)) await simulate(); }

    function stop(msg){ save(STORAGE.RUN,false); updateStatus('已停止'); notify('停止',msg||'已停止'); btnStart.disabled=false; }

    // --- 按鈕事件 ---
    btnStart.onclick=()=>{
        const m=parseInt(inpMax.value); if(!isNaN(m))save(STORAGE.MAX,m);
        const arr=inpTar.value.split(',').map(s=>s.trim()).filter(s=>s); if(arr.length)save(STORAGE.TARGETS,JSON.stringify(arr));
        save(STORAGE.IDX,-1); save(STORAGE.LOOP,0); save(STORAGE.RUN,true); visitedTarget=false;
        lblLoop.textContent='完整循環: 0'; updateStatus('運行中'); btnStart.disabled=true; runner();
    };
    btnStop.onclick=()=>stop('手動停止');
})();
