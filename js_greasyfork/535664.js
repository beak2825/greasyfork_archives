// ==UserScript==
// @name         Threads 全能助手 6.6 (頂級優化)
// @namespace    http://tampermonkey.net/
// @version      6.6
// @description  v6.6：支援多目標、自訂首頁、自動登入憑證帶入、靜默401/429、GraphQL統計、增強UI、長短休息、錯誤日誌
// @author       ChatGPT
// @match        *://threads.net/*
// @match        *://www.threads.net/*
// @match        *://threads.com/*
// @match        *://www.threads.com/*
// @run-at       document-idle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @language     zh-TW
// @downloadURL https://update.greasyfork.org/scripts/535664/Threads%20%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B%2066%20%28%E9%A0%82%E7%B4%9A%E5%84%AA%E5%8C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535664/Threads%20%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B%2066%20%28%E9%A0%82%E7%B4%9A%E5%84%AA%E5%8C%96%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[ThreadsV66] script loaded');
    const wait = ms => new Promise(res => setTimeout(res, ms));

    // --- 防偵測 & UA 隨機 ---
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'languages', { get: () => ['zh-TW','zh'] });
    Object.defineProperty(navigator, 'plugins',   { get: () => [1,2,3,4,5] });
    const UA_SUFFIX = [
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.96 Mobile Safari/537.36',
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.90 Mobile Safari/537.36',
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6082.47 Mobile Safari/537.36'
    ];
    const baseUA = navigator.userAgent.replace(/\s*\(.+?\)/, '');
    Object.defineProperty(navigator, 'userAgent', { get: () => baseUA + UA_SUFFIX[Math.floor(Math.random()*UA_SUFFIX.length)] });

    // --- 自動登入 Token ---
    function getAccessToken() {
        try {
            const boot = window.__bootstrapSharedData || window.__INIT_DATA || {};
            return boot.config?.accessToken || boot.accessToken || null;
        } catch { return null; }
    }

    // --- 攔截 fetch，靜默處理 401/429 並統計 GraphQL ---
    const _fetch = window.fetch;
    window.fetch = async (res, init={}) => {
        const url = typeof res==='string'?res:res.url;
        init.credentials = 'include';
        const token = getAccessToken();
        if(token){ init.headers = {...(init.headers||{}), Authorization:'Bearer '+token}; }
        let rsp;
        try { rsp = await _fetch(res, init); } catch(e){ return Promise.reject(e); }
        if(rsp.status===401||rsp.status===429) return rsp;
        if(init.method==='POST'&&(url.includes('/graphql/query')||url.includes('/api/graphql'))) console.log('[GQL]',url,init.body);
        return rsp;
    };

    // --- 通知 ---
    function notify(t,x){ GM_notification?GM_notification({title:t,text:x,timeout:2000}):console.log(t,x); }

    // --- 狀態儲存 ---
    const NS='ThreadsV66_';
    const S={T:NS+'T',I:NS+'I',H:NS+'H',R:NS+'R',L:NS+'L',M:NS+'M'};
    const save=(k,v)=>GM_setValue(k,v), load=(k,d)=>{const v=GM_getValue(k);return v!==undefined?v:d};
    const rand=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;

    // --- 模擬參數 ---
    const RPT={
        stay:[20000,30000], browse:[120000,180000],
        scrollFast:[window.innerHeight*0.8,window.innerHeight*1.2],
        scrollSlow:[window.innerHeight*0.3,window.innerHeight*0.6],
        waitFast:[1000,2000], waitSlow:[4000,6000],
        pause:[3000,10000]
    };

    // --- UI ---
    const pid='tm_threads_v66'; if(document.getElementById(pid))return;
    const panel=document.createElement('div');panel.id=pid;
    Object.assign(panel.style,{position:'fixed',top:'10px',right:'10px',background:'#fff',border:'1px solid #ccc',padding:'8px',fontSize:'13px',zIndex:9999});
    panel.innerHTML=`
        <div id='tb-status'>狀態: 待命</div>
        循環:<span id='tb-loops'>0</span> 觀看:<span id='tb-views'>0</span><br>
        目標(URL逗號):<br><textarea id='tb-targets' style='width:200px;height:40px'></textarea><br>
        首頁:<input id='tb-home' style='width:200px'><br>
        最大循環(空=∞):<input id='tb-max' style='width:100px'><br>
        <button id='tb-start'>▶</button><button id='tb-stop'>■</button>
    `;
    document.body.appendChild(panel);
    const stEl=document.getElementById('tb-status'), lpEl=document.getElementById('tb-loops'), vwEl=document.getElementById('tb-views');
    const taEl=document.getElementById('tb-targets'), hEl=document.getElementById('tb-home'), mEl=document.getElementById('tb-max');
    const sEl=document.getElementById('tb-start'), xEl=document.getElementById('tb-stop');
    taEl.value=load(S.T,''); hEl.value=load(S.H,location.origin); mEl.value=load(S.M,'');
    function updStatus(t){stEl.textContent='狀態: '+t;} function updStats(){lpEl.textContent=load(S.L,0);vwEl.textContent=load(S.I,0);} updStats();

    function getList(){try{return taEl.value.split(',').map(s=>s.trim()).filter(s=>s);}catch{return[];}}
    function nextURL(){const a=getList(),i=(load(S.I,-1)+1)%a.length;save(S.I,i);return a[i];}
    function atTarget(){return getList().some(u=>location.href.startsWith(u));}
    let visited=false;

    async function scrollOne(){const f=Math.random()<0.5,step=rand(...(f?RPT.scrollFast:RPT.scrollSlow));const maxY=document.documentElement.scrollHeight-window.innerHeight;let d;
        if(window.scrollY>=maxY)d=-1;else if(window.scrollY<=0)d=1;else d=Math.random()<0.7?1:-1;
        window.scrollTo({top:Math.min(Math.max(0,window.scrollY+step*d),maxY),behavior:'smooth'});
        await wait(...(f?RPT.waitFast:RPT.waitSlow));}

    async function simulate(){const tgt=atTarget();if(tgt)visited=true;updStatus('瀏覽 '+(tgt?'目標':'首頁'));notify('模擬','開始');
        const dur=rand(...(tgt?RPT.stay:RPT.browse)),start=Date.now();while(Date.now()-start<dur&&load(S.R,false)){await scrollOne();}
        if(!load(S.R,false))return;await wait(...RPT.pause);
        save(S.H,hEl.value||location.origin);save(S.T,taEl.value);
        if(tgt&&location.href===hEl.value&&visited){let c=load(S.L,0)+1;save(S.L,c);updStats();if(mEl.value&&c>=parseInt(mEl.value))return stop();visited=false;}
        location.href=tgt?hEl.value:nextURL();}

    async function run(){updStatus('運行中');save(S.R,true);while(load(S.R,true)){await simulate();save(S.I,load(S.I));save(S.L,load(S.L));await wait(rand( parseInt(mEl.value)||30,parseInt(mEl.value)||60 )*1000);}updStatus('已停止');}

    function stop(){save(S.R,false);updStatus('已停止');notify('停止','完成');}

    sEl.onclick=()=>run();xEl.onclick=()=>stop();
})();
