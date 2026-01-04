// ==UserScript==
// @name Chain Helper PDA Bridge
// @namespace https://tornpanel.online/
// @description faction-only use. Adds a draggable, collapsible “Chain Helper” panel for TornPDA mobile: join/leave queue, show chain #, queue pos, ETA (mm:ss), syncs with tornpanel.online. No automation; no API keys.
// @version 1.6.2
// @license All Rights Reserved
// @match https://www.torn.com/*
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/544755/Chain%20Helper%20PDA%20Bridge.user.js
// @updateURL https://update.greasyfork.org/scripts/544755/Chain%20Helper%20PDA%20Bridge.meta.js
// ==/UserScript==

(() => {
"use strict";
if (window.top !== window) return;
if (document.getElementById("tpda-chain-helper")) return;

const API_ROOT = "https://tornpanel.online/api";
const BRIDGE_MIN_INTERVAL_MS = 5000;
const POLL_BASE_MS = 5000;
const POLL_MAX_MS = 30000;
const ETA_STALE_MS = 45000;
const ETA_RESYNC_DRIFT_S = 3;
const TARGET_TS_KEY = "tpda_chain_helper_target_ts";
const SAFE_MARGIN = 6; // px margin from edges

const KEYS = {
user: "tpda_chain_helper_username",
collapsed: "tpda_chain_helper_collapsed",
pos: "tpda_chain_helper_pos"
};

function dbg(...a){try{console.log("[ChainHelper DEBUG]",...a.map(x=>typeof x==="object"?JSON.stringify(x):String(x)));}catch{}}
function detectUsername(){const el=document.querySelector(".user-name, .username");return el&&el.textContent?el.textContent.trim():null;}
function getCurrentUsername(){const dom=detectUsername();if(dom&&dom.length>1)return dom;const s=localStorage.getItem(KEYS.user)||"";return s.length>1?s:null;}

const style=document.createElement("style");
style.id="chain-helper-style";
style.textContent=`
#tpda-chain-helper{position:fixed;bottom:20px;left:20px;width:240px;background:rgba(0,0,0,.82);color:#0ff;padding:12px;border-radius:8px;font-family:sans-serif;font-size:13px;z-index:999999;box-shadow:0 0 10px #0ff;user-select:none;touch-action:none;}
#tpda-chain-helper.collapsed{width:40px;height:40px;padding:4px;overflow:hidden;}
#tpda-chain-helper .header{display:flex;justify-content:space-between;align-items:center;}
#tpda-chain-helper .header .title{flex:1;font-weight:600;color:#9ef;}
#tpda-chain-helper .header button{background:none;border:none;color:#0ff;cursor:pointer;font-size:1.2em;padding:6px;min-width:44px;min-height:44px;line-height:1;}
#tpda-chain-helper .inner{margin-top:8px;display:flex;flex-direction:column;gap:6px;}
#tpda-chain-helper.collapsed .inner{display:none;}
#tpda-chain-helper button.action{padding:10px 0;border:none;border-radius:6px;cursor:pointer;font-weight:700;margin-top:2px;}
#tpda-chain-helper button#join{background:#0ff;color:#000;}
#tpda-chain-helper button#leave{background:#c0392b;color:#fff;}
#tpda-chain-helper .status{font-size:12px;color:#fff;margin-bottom:2px;}
#tpda-chain-helper .info{line-height:1.35;}
#tpda-remote-sync{background:#011;color:#0f8;border-radius:5px;font-size:12px;margin-top:7px;padding:4px 6px;}
#tpda-remote-sync.off{color:#f88;}
#tpda-chain-helper a#tpda-link{color:#8cf;text-decoration:underline;font-size:12px;align-self:flex-start;margin-top:4px;}
`;
document.head.appendChild(style);

const storedUser=localStorage.getItem(KEYS.user)||"";
let collapsed=localStorage.getItem(KEYS.collapsed)==="1";

const container=document.createElement("div");
container.id="tpda-chain-helper";
if(collapsed) container.classList.add("collapsed");
container.innerHTML=`
<div class="header">
<span class="title" id="tpda-title">Chain Helper</span>
<button id="toggle" aria-label="Toggle">${collapsed?"➕":"➖"}</button>
</div>
<div class="inner">
<div class="status" id="chain-status">Status: idle</div>
<div class="info">
<div id="chain-user">User: ${storedUser||"--"}</div>
<div id="chain-my">My #: —</div>
<div id="chain-pos">Queue pos: N/A</div>
<div id="chain-eta">ETA: —:—</div>
</div>
<button class="action" id="join">Get My #</button>
<button class="action" id="leave">Kick Me</button>
<div id="tpda-remote-sync" class="off">Remote Sync: Offline</div>
<a id="tpda-link" href="https://tornpanel.online" target="_blank" rel="noopener">tornpanel.online</a>
</div>
`;
document.body.appendChild(container);

// --- position restore + clamping ---
function clampToViewport() {
const vw=window.innerWidth, vh=window.innerHeight;
const w=container.offsetWidth||240, h=container.offsetHeight||180;
const curLeft=parseFloat(container.style.left)||20;
const curTop =parseFloat(container.style.top)|| (vh - h - 20);
const left=Math.min(vw - w - SAFE_MARGIN, Math.max(SAFE_MARGIN, curLeft));
const top =Math.min(vh - h - SAFE_MARGIN, Math.max(SAFE_MARGIN, curTop));
container.style.left=left+"px";
container.style.top =top+"px";
container.style.bottom="auto";
// if >90% off-screen somehow, snap to default
const offX = (curLeft<-w*0.9)||(curLeft>vw*0.9);
const offY = (curTop<-h*0.9)||(curTop>vh*0.9);
if(offX||offY){ snapToDefault(); }
}
function snapToDefault(){
container.style.left="20px";
container.style.top ="auto";
container.style.bottom="20px";
localStorage.setItem(KEYS.pos, JSON.stringify({top:container.style.top,left:container.style.left}));
}
try{
const p=JSON.parse(localStorage.getItem(KEYS.pos)||"{}");
if(p.top) container.style.top=p.top;
if(p.left) container.style.left=p.left;
if(p.top||p.left) container.style.bottom="auto";
}catch{}
// clamp after restore
setTimeout(clampToViewport,0);
window.addEventListener("resize", () => clampToViewport());

const toggleBtn=container.querySelector("#toggle");
const titleEl =container.querySelector("#tpda-title");
const statusEl =container.querySelector("#chain-status");
const userEl =container.querySelector("#chain-user");
const myEl =container.querySelector("#chain-my");
const posEl =container.querySelector("#chain-pos");
const etaEl =container.querySelector("#chain-eta");
const joinBtn =container.querySelector("#join");
const leaveBtn =container.querySelector("#leave");
const remoteBox=container.querySelector("#tpda-remote-sync");

function setCollapsed(v){
collapsed=v;
localStorage.setItem(KEYS.collapsed, v?"1":"0");
container.classList.toggle("collapsed", v);
toggleBtn.textContent=v?"➕":"➖";
}
toggleBtn.addEventListener("click",()=>setCollapsed(!collapsed));
titleEl.addEventListener("click",()=>setCollapsed(!collapsed));

// double-tap title to reset position
let lastTap=0;
titleEl.addEventListener("touchend",()=>{
const now=Date.now();
if(now-lastTap<350){ snapToDefault(); clampToViewport(); }
lastTap=now;
});

// Drag with clamping
let dragging=false, dx=0, dy=0;
container.addEventListener("pointerdown", e=>{
if(e.button!==0) return;
dragging=true;
dx=e.clientX - container.offsetLeft;
dy=e.clientY - container.offsetTop;
container.setPointerCapture(e.pointerId);
});
container.addEventListener("pointermove", e=>{
if(!dragging) return;
const w=container.offsetWidth, h=container.offsetHeight;
const vw=window.innerWidth, vh=window.innerHeight;
const newLeft=Math.min(vw - w - SAFE_MARGIN, Math.max(SAFE_MARGIN, e.clientX - dx));
const newTop =Math.min(vh - h - SAFE_MARGIN, Math.max(SAFE_MARGIN, e.clientY - dy));
container.style.left=newLeft+"px";
container.style.top =newTop +"px";
container.style.bottom="auto";
});
container.addEventListener("pointerup", ()=>{
dragging=false;
clampToViewport();
localStorage.setItem(KEYS.pos, JSON.stringify({top:container.style.top,left:container.style.left}));
});

function fmtMMSS(sec){const m=Math.floor(sec/60).toString().padStart(2,"0");const s=(sec%60).toString().padStart(2,"0");return `${m}:${s}`;}
function setStatus(txt){statusEl.textContent=`Status: ${txt}`;}
function setRemoteState(online,tip=""){remoteBox.textContent=`Remote Sync: ${online?"Online":"Offline"}`;remoteBox.classList.toggle("off",!online);if(tip)remoteBox.title=tip;}
function setImmediateResetAfterLeave(){myEl.textContent="My #: —";posEl.textContent="Queue pos: N/A";etaEl.textContent="ETA: —:—";stopCountdown();}
function disableBtn(btn,ms=1500){btn.disabled=true;setTimeout(()=>{btn.disabled=false;},ms);}

let lastBridgeAsk=0;
function safePostToExtension(type,payload={}){const now=Date.now();if(now-lastBridgeAsk<BRIDGE_MIN_INTERVAL_MS)return;lastBridgeAsk=now;window.postMessage(Object.assign({source:"tornPDA_bridge",type},payload),"*");}

let countdownInterval=null;
function stopCountdown(){clearInterval(countdownInterval);countdownInterval=null;}
function startCountdownTo(tsMs){
if(!tsMs||tsMs<Date.now()){etaEl.textContent="ETA: —:—";return;}
localStorage.setItem(TARGET_TS_KEY,String(tsMs));
stopCountdown();
const tick=()=>{const remain=Math.max(0,Math.floor((tsMs-Date.now())/1000));etaEl.textContent=`ETA: ${fmtMMSS(remain)}`;if(remain<=0)stopCountdown();};
tick(); countdownInterval=setInterval(tick,1000);
}
const savedTs=Number(localStorage.getItem(TARGET_TS_KEY)||0);
if(savedTs&&(Date.now()-savedTs)<ETA_STALE_MS) startCountdownTo(savedTs); else localStorage.removeItem(TARGET_TS_KEY);

function scheduleNativeTimerIfAvailable(sec){try{if(!window.flutter_inappwebview||!sec||sec<=0)return;window.flutter_inappwebview.callHandler("setTimer",{seconds:sec,message:"Torn PDA Timer"});}catch{}}
function cancelNativeNotification(id){try{if(!window.flutter_inappwebview)return;window.flutter_inappwebview.callHandler("cancelNotification",{id});}catch{}}

async function doJoin(){
disableBtn(joinBtn);
let u=getCurrentUsername();
if(!u){u=prompt("Enter your Torn username:",localStorage.getItem(KEYS.user)||"")||"";if(!u)return;localStorage.setItem(KEYS.user,u);}
userEl.textContent=`User: ${u}`; setStatus("requesting");
try{
const body={user:u,detectedUser:detectUsername()||undefined};
const res=await PDA_httpPost(`${API_ROOT}/enqueue`,{"Content-Type":"application/json"},JSON.stringify(body));
dbg("Enqueue POST:",res&&res.responseText);
safePostToExtension("enqueueUser",{user:u});
triggerPollSoon(); setStatus("done");
}catch(e){setStatus("POST error");}
}
async function doLeave(){
disableBtn(leaveBtn);
const u=getCurrentUsername(); if(!u){alert("Set your username first.");return;}
setStatus("kicking"); setImmediateResetAfterLeave();
try{
const res=await PDA_httpPost(`${API_ROOT}/leave`,{"Content-Type":"application/json"},JSON.stringify({user:u}));
dbg("Leave POST:",res&&res.responseText);
safePostToExtension("kickUser",{user:u});
cancelNativeNotification(123);
triggerPollSoon(); setStatus("done");
}catch(e){setStatus("POST error");}
}
joinBtn.addEventListener("click",doJoin);
leaveBtn.addEventListener("click",doLeave);

window.addEventListener("message", e=>{
if(e.source!==window||!e.data||e.data.source!=="extensionBridge")return;
const d=e.data; dbg("FROM extension:",d);
if(d.type==="status"){setStatus(d.online?"online":"offline");}
if(d.type==="statsResponse"){
if(typeof d.queueLength==="number") posEl.textContent=`Queue pos: ${d.queueLength}`;
else posEl.textContent="Queue pos: N/A";
}
if(d.type==="chainResponse"){
if(d.user){localStorage.setItem(KEYS.user,d.user);userEl.textContent=`User: ${d.user}`;}
if(typeof d.queuePosition==="number") posEl.textContent=`Queue pos: ${d.queuePosition}`; else posEl.textContent="Queue pos: N/A";
if(d.assignedNumber!=null) myEl.textContent=`My #: #${d.assignedNumber}`; else myEl.textContent="My #: —";
if(typeof d.targetHitTimestamp==="number"){
const now=Date.now();
if(Math.abs(d.targetHitTimestamp-now)<=ETA_STALE_MS){
const remain=Math.max(0,Math.floor((d.targetHitTimestamp-now)/1000));
const cur=Number(localStorage.getItem(TARGET_TS_KEY)||0);
if(!cur||Math.abs(cur-d.targetHitTimestamp)>ETA_RESYNC_DRIFT_S*1000){
startCountdownTo(d.targetHitTimestamp);
scheduleNativeTimerIfAvailable(remain);
}
}else{localStorage.removeItem(TARGET_TS_KEY);etaEl.textContent="ETA: —:—";stopCountdown();}
}
setStatus("done");
}
});

let pollTimer=null, pollInterval=POLL_BASE_MS;
function scheduleNextPoll(ms){clearTimeout(pollTimer);pollTimer=setTimeout(pollBackend,ms);}
function triggerPollSoon(){scheduleNextPoll(250);}
async function pollBackend(){
const u=getCurrentUsername();
if(!u){setRemoteState(false,"No username");scheduleNextPoll(pollInterval);return;}
try{
const res=await PDA_httpGet(`${API_ROOT}/status?user=${encodeURIComponent(u)}`);
let data; try{data=JSON.parse(res.responseText);}catch{setRemoteState(false,"Bad JSON");bumpBackoff();return;}
setRemoteState(true); pollInterval=POLL_BASE_MS;
if(data.queuePosition!=null) posEl.textContent=`Queue pos: ${data.queuePosition}`; else posEl.textContent="Queue pos: N/A";
if(data.assignedNumber!=null) myEl.textContent=`My #: #${data.assignedNumber}`; else myEl.textContent="My #: —";
if(data.status) setStatus(data.status); if(data.error) setStatus(data.error);
}catch(e){setRemoteState(false,"Offline/backoff");bumpBackoff();return;}
scheduleNextPoll(pollInterval);
}
function bumpBackoff(){pollInterval=Math.min(POLL_MAX_MS, pollInterval*2 || POLL_BASE_MS*2);scheduleNextPoll(pollInterval);}

function setRemoteState(online,tip=""){remoteBox.textContent=`Remote Sync: ${online?"Online":"Offline"}`;remoteBox.classList.toggle("off",!online);if(tip)remoteBox.title=tip;}

setStatus("checking");
safePostToExtension("getStatus");
safePostToExtension("getStats");
setInterval(()=>{safePostToExtension("getStatus");safePostToExtension("getStats");},30000);
scheduleNextPoll(250);
})();