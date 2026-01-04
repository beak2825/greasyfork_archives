// ==UserScript==
// @name         Threads 5.0
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  支援擬人化隨機滑動模式、自動休息、偵測異常並回退，支援 threads.net/.com 及 SPA 導航偵測
// @author       ChatGPT
// @match        https://threads.net/*
// @match        https://www.threads.net/*
// @match        https://*.threads.net/*
// @match        https://threads.com/*
// @match        https://www.threads.com/*
// @match        https://*.threads.com/*
// @run-at       document-idle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534766/Threads%2050.user.js
// @updateURL https://update.greasyfork.org/scripts/534766/Threads%2050.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 捕捉未處理錯誤，自動停止並回退
    window.addEventListener('error', e => {
        console.error('ThreadsV25 uncaught error:', e.error);
        stop('偵測到錯誤，自動停止');
    });

    // ── 防偵測 ──
    Object.defineProperty(navigator, 'webdriver', {get:() => false});
    Object.defineProperty(navigator, 'languages', {get:() => ['zh-TW','zh']});
    Object.defineProperty(navigator, 'plugins', {get:() => [1,2,3,4,5]});
    const UA_SUFFIX = [
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.96 Mobile Safari/537.36',
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.90 Mobile Safari/537.36',
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6082.47 Mobile Safari/537.36'
    ];
    const baseUA = navigator.userAgent.replace(/\s*\(.+?\)/, '');
    Object.defineProperty(navigator, 'userAgent', {
        get: () => baseUA + UA_SUFFIX[Math.floor(Math.random() * UA_SUFFIX.length)]
    });

    // ── 基本設定 ──
    const DOMAIN = location.origin;
    const DEFAULT_HOME = DOMAIN;
    const DEFAULT_TARGETS = [`${DOMAIN}/posts/xxxxxx`];
    const NS = 'ThreadsV25_';
    const STORAGE = {
        TARGETS: NS + 'TARGETS', IDX: NS + 'IDX', HOME: NS + 'HOME', RUN: NS + 'RUN',
        LOOP: NS + 'LOOP', MAX: NS + 'MAX'
    };
    const R = {
        STAY: [20000, 30000],               // 目標頁停留
        BROWSE: [120000, 180000],           // 首頁長瀏覽
        SCROLL_FAST: [window.innerHeight*0.8, window.innerHeight*1.2],
        SCROLL_SLOW: [window.innerHeight*0.3, window.innerHeight*0.6],
        WAIT_FAST: [1000, 2000],
        WAIT_SLOW: [4000, 6000],
        PAUSE: [3000, 10000],               // 換頁前暫停
        REST: [300000, 600000]              // 自動休息 (5~10 分鐘)
    };
    const rand = (a,b) => Math.floor(Math.random()*(b-a+1))+a;
    const wait = ms => new Promise(r=>setTimeout(r, ms));
    const save = (k,v) => GM_setValue(k,v);
    const load = (k,d) => { const v = GM_getValue(k); return v!==undefined? v: d; };

    // ── 通知 ──
    function notify(title,text){
        GM_notification
            ? GM_notification({title,text,timeout:2000})
            : console.log(`${title}: ${text}`);
    }

    // ── UI 面板 ──
    const PID = 'tm_threads_v25';
    if(document.getElementById(PID)) return;
    const panel = document.createElement('div'); panel.id=PID;
    Object.assign(panel.style, {position:'fixed',top:'10px',right:'10px',
        background:'#fff',border:'1px solid #ccc',padding:'8px',fontSize:'13px',zIndex:9999});
    const btnStart=document.createElement('button');btnStart.textContent='開始';
    const btnStop=document.createElement('button');btnStop.textContent='暫停';btnStop.style.marginLeft='6px';
    const inpMax=document.createElement('input');inpMax.placeholder='最大循環(空無限)';inpMax.style.width='100%';
    const inpHome=document.createElement('input');inpHome.placeholder='首頁 URL';inpHome.style.width='100%';
    const inpTar=document.createElement('textarea');inpTar.placeholder='目標 URL(逗號分隔)';inpTar.style.width='100%';inpTar.style.height='50px';
    const lblStatus=document.createElement('div');lblStatus.textContent='狀態: 待命';
    const lblLoop=document.createElement('div');lblLoop.textContent='完整循環: 0';
    const lblCount=document.createElement('div');lblCount.textContent='倒數: 0s';
    panel.append(btnStart,btnStop,inpMax,inpHome,inpTar,lblStatus,lblLoop,lblCount);
    document.body.appendChild(panel);
    const updateStatus=t=>lblStatus.textContent='狀態: '+t;
    inpHome.value = load(STORAGE.HOME,DEFAULT_HOME);
    inpTar.value = load(STORAGE.TARGETS,JSON.stringify(DEFAULT_TARGETS)).replace(/[\[\]"]+/g,'').split(',').join(', ');

    function getTargets(){ try{ return JSON.parse(load(STORAGE.TARGETS,JSON.stringify(DEFAULT_TARGETS))); }
        catch{return DEFAULT_TARGETS;} }
    function getNext(){ let list=getTargets(),i=load(STORAGE.IDX,-1); i=(i+1)%list.length; save(STORAGE.IDX,i); return list[i]; }
    function isTarget(){ return getTargets().some(u=>location.href.startsWith(u)); }
    let visitedTarget=false;

    // ── 隨機滑動 ──
    async function scrollOnce(){
        // 模擬快/慢閱讀
        const fast = Math.random()<0.5;
        const step = fast
            ? rand(...R.SCROLL_FAST)
            : rand(...R.SCROLL_SLOW);
        let dir;
        const maxY=document.documentElement.scrollHeight-window.innerHeight;
        if(window.scrollY>=maxY*rand(90,98)/100) dir=-1;
        else if(window.scrollY<=maxY*rand(0,2)/100) dir=1;
        else dir = Math.random()<0.7?1:-1;
        const y=Math.min(Math.max(0,window.scrollY+step*dir),maxY);
        window.scrollTo({top:y,behavior:'smooth'});
        await wait( fast ? rand(...R.WAIT_FAST) : rand(...R.WAIT_SLOW) );
    }

    // ── 核心模擬 ──
    async function simulate(){
        const target=isTarget(); if(target) visitedTarget=true;
        updateStatus('瀏覽 '+(target?'目標頁':'首頁'));
        notify('模擬','開始 '+(target?'目標頁':'首頁'));
        const duration = rand(...(target?R.STAY:R.BROWSE));
        let rem=duration; lblCount.textContent='倒數: '+Math.ceil(rem/1000)+'s';
        const ti=setInterval(()=>{ rem-=1000; lblCount.textContent='倒數: '+(rem>0?Math.ceil(rem/1000):0)+'s'; },1000);
        const t0=Date.now();
        while(Date.now()-t0<duration && load(STORAGE.RUN,false)) await scrollOnce();
        clearInterval(ti); lblCount.textContent='倒數: 0s';
        if(!load(STORAGE.RUN,false)) return;
        await wait(rand(...R.PAUSE));
        const home=inpHome.value.trim()||DEFAULT_HOME; save(STORAGE.HOME,home);
        const next=target?home:getNext();
        if(target&& next===home && visitedTarget){
            let c=load(STORAGE.LOOP,0)+1; save(STORAGE.LOOP,c); lblLoop.textContent='完整循環: '+c;
            // 每5循環休息一次
            if(c%5===0){ notify('休息','自動休息中'); await wait(rand(...R.REST)); }
            const m=load(STORAGE.MAX,Infinity); if(m!==Infinity&&c>=m){ stop(`達上限 ${m}`); return; }
            visitedTarget=false;
        }
        location.href=next;
    }
    function runner(){ return simulate().then(()=>load(STORAGE.RUN,false)&&runner()); }
    function stop(msg){ save(STORAGE.RUN,false); updateStatus('已停止'); notify('停止',msg||'已停止'); btnStart.disabled=false; }

    btnStart.onclick=()=>{
        const m=parseInt(inpMax.value); if(!isNaN(m)) save(STORAGE.MAX,m);
        const arr=inpTar.value.split(',').map(s=>s.trim()).filter(s=>s); if(arr.length) save(STORAGE.TARGETS,JSON.stringify(arr));
        save(STORAGE.IDX,-1); save(STORAGE.LOOP,0); save(STORAGE.RUN,true);
        visitedTarget=false; lblLoop.textContent='完整循環: 0'; updateStatus('運行中'); btnStart.disabled=true; runner();
    };
    btnStop.onclick=()=>stop('手動停止');

    // ── SPA 導航偵測 ──
    ['pushState','replaceState'].forEach(fn=>{
        const orig=history[fn]; history[fn]=function(){ orig.apply(this,arguments); window.dispatchEvent(new Event('urlchange')); };
    });
    window.addEventListener('popstate',()=>window.dispatchEvent(new Event('urlchange')));
    window.addEventListener('urlchange',()=>load(STORAGE.RUN,false)&&simulate());
    window.addEventListener('load',()=>setTimeout(()=>load(STORAGE.RUN,false)&&simulate(),3000));
})();
