// ==UserScript==
// @name         Bonk Friends - Bonk.io
// @version      1.0.3
// @description  Enables user to see and/or join friends online while in game or lobby.
// @author       inertia_
// @namespace    https://greasyfork.org/en/users/1503369
// @license      MIT
// @match        https://bonk.io/gameframe-release.html
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545262/Bonk%20Friends%20-%20Bonkio.user.js
// @updateURL https://update.greasyfork.org/scripts/545262/Bonk%20Friends%20-%20Bonkio.meta.js
// ==/UserScript==
(function(){
(function(){
const a=["#advertRight","#adboxverticalRightCurse","#adboxverticalCurse","#adboxverticalLeftCurse",'[id^="adboxvertical"]',".advert-right",".ad-container",".adsbygoogle"];function b(d){if(!d)return;a.forEach(e=>d.querySelectorAll(e).forEach(f=>f.style.setProperty("display","none","important")))}function c(d){try{return d&&d.document?d.document:d}catch{ return null}}let g=0;function h(){g++;[document,c(window.parent),c(window.top)].forEach(b);if(g>=30)clearInterval(i)}setTimeout(h,2000);const i=setInterval(h,1000)})();
const j=document.createElement("style");j.textContent=`
#bf_friends{position:fixed;right:calc(env(safe-area-inset-right,0px) + 2px);top:30px;width:220px;max-height:75vh;z-index:2147483647;background:var(--bf-panel-bg,#111);color:var(--bf-text,#e8e8e8);border-radius:7px;box-shadow:0 6px 18px rgba(0,0,0,.35);overflow:hidden;font-family:'futurept_b1',system-ui,sans-serif}
#bf_head{display:flex;align-items:center;gap:6px;background:var(--bf-accent,#009688);color:var(--bf-head-text,#fff);padding:6px 8px;height:34px}
#bf_collapse{width:20px;height:20px;border-radius:6px;border:none;background:var(--bf-head-chip-bg,rgba(0,0,0,.25));color:var(--bf-head-text,#fff);cursor:pointer;line-height:20px;text-align:center;font-weight:700;transition:background .12s}
#bf_collapse:hover{background:var(--bf-head-chip-bg-hover,rgba(0,0,0,.38))}
#bf_title{font-size:15px;font-weight:700;flex:1 1 auto}
#bf_timer{font-size:11px;font-weight:700;opacity:.9;padding:2px 6px;background:var(--bf-timer-bg,rgba(0,0,0,.22));border-radius:6px;min-width:30px;text-align:center;cursor:help}
#bf_body{background:var(--bf-body-bg,#1c1c1c);padding:8px 0;overflow-y:auto;max-height:calc(75vh - 34px)}
#bf_body::-webkit-scrollbar{width:10px}
#bf_body::-webkit-scrollbar-track{background:var(--bf-sb-track,#dddddd)}
#bf_body::-webkit-scrollbar-thumb{background:var(--bf-sb-thumb,#aaaaaa);border-radius:6px}
.bf-row{display:flex;align-items:center;gap:8px;border-radius:0;padding:10px 12px;margin:0}
.bf-row:nth-child(odd){background:var(--bf-row-odd,rgba(58,58,58,.12))}
.bf-row:nth-child(even){background:var(--bf-row-even,rgba(58,58,58,.03))}
.bf-name{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--bf-text,#e4e4e4);font-size:15px}
.bf-join{display:inline-flex;align-items:center;justify-content:center;height:24px;line-height:24px;min-width:58px;padding:0 10px;font-size:14px;letter-spacing:.3px;font-weight:400;cursor:pointer;user-select:none;box-sizing:border-box;background:var(--bf-btn-bg,#6a4032);color:var(--bf-btn-text,#fff);border:0;border-radius:2px;box-shadow:1px 1px 5px -2px rgba(0,0,0,.35);transition:background .12s,filter .12s}
.bf-join:hover{background:var(--bf-btn-bg-hover,#5a382b);filter:brightness(1.02)}
.bf-join:active{transform:translateY(1px)}
.bf-empty{display:flex;align-items:center;justify-content:center;height:40px;background:var(--bf-row-even,rgba(58,58,58,.03));border-radius:0;margin:0;opacity:.85}
#bf_friends.bf-collapsed{width:44px;height:44px;border-radius:12px}
#bf_friends.bf-collapsed #bf_head{padding:0;height:44px;justify-content:center}
#bf_friends.bf-collapsed #bf_collapse{width:28px;height:28px;line-height:28px}
#bf_friends.bf-collapsed #bf_title,#bf_friends.bf-collapsed #bf_body,#bf_friends.bf-collapsed #bf_timer{display:none}
`;document.head.appendChild(j);
const k=(q,r=document)=>r.querySelector(q),l=(q,r=document)=>Array.from(r.querySelectorAll(q)),m=n=>new Promise(o=>setTimeout(o,n));
function n(q){if(!q)return null;q=q.trim();if(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(q)){let r=q.slice(1);if(r.length===3)r=r.split("").map(s=>s+s).join("");const t=parseInt(r,16);return{r:(t>>16)&255,g:(t>>8)&255,b:t&255,a:1}}const u=q.match(/rgba?\(([^)]+)\)/i);if(u){const v=u[1].split(",").map(w=>w.trim());const x=parseFloat(v[0]),y=parseFloat(v[1]),z=parseFloat(v[2]),A=v[3]!=null?parseFloat(v[3]):1;return{r:x,g:y,b:z,a:isNaN(A)?1:A}}return null}
function o(q){if(!q)return 0;const r=[q.r,q.g,q.b].map(s=>{s/=255;return s<=0.03928?s/12.92:Math.pow((s+0.055)/1.055,2.4)});return 0.2126*r[0]+0.7152*r[1]+0.0722*r[2]}
function p(q,r){const s=n(q);if(!s)return q;const t=u=>Math.max(0,Math.min(255,Math.round(u*(1-r))));return`rgba(${t(s.r)},${t(s.g)},${t(s.b)},${s.a??1})`}
function q(r){const s={accent:"#009688",headText:"#fff",headChipBg:"rgba(0,0,0,.25)",headChipBgHover:"rgba(0,0,0,.38)",panelBg:"#111",bodyBg:"#1c1c1c",text:"#e4e4e4",timerBg:"rgba(0,0,0,.22)",btnBg:"#6a4032",btnBgHover:"#5a382b",btnText:"#fff",sbThumb:"#aaaaaa",sbTrack:"#dddddd"},t=k("#friends_topbar")||k(".windowTopBar")||k(".windowTopBar_classic"),u=k("#friendsContainer"),v=k("#friends_scrollcontainer"),w=k("#friends_online_table button, #friends_online_table .brownButton"),x=k("#friends_online_table .friends_cell_name")||u||document.body,y=t&&getComputedStyle(t),z=u&&getComputedStyle(u),A=v&&getComputedStyle(v),B=w&&getComputedStyle(w),C=x&&getComputedStyle(x);if(y?.backgroundColor)s.accent=y.backgroundColor;if(y?.color)s.headText=y.color;if(z?.backgroundColor)s.panelBg=z.backgroundColor;if(A?.backgroundColor)s.bodyBg=A.backgroundColor;if(C?.color)s.text=C.color;if(B?.backgroundColor&&B.backgroundColor!=="rgba(0,0,0,0)"){s.btnBg=B.backgroundColor;s.btnBgHover=p(s.btnBg,.15)}if(B?.color)s.btnText=B.color;const D=n(s.bodyBg),E=o(D),F=(E<0.35)?"rgba(255,255,255,.08)":"rgba(58,58,58,.12)",G=(E<0.35)?"rgba(255,255,255,.03)":"rgba(58,58,58,.03)";r.style.setProperty("--bf-sb-thumb",s.sbThumb);r.style.setProperty("--bf-sb-track",s.sbTrack);r.style.setProperty("--bf-accent",s.accent);r.style.setProperty("--bf-head-text",s.headText);r.style.setProperty("--bf-head-chip-bg",s.headChipBg);r.style.setProperty("--bf-head-chip-bg-hover",s.headChipBgHover);r.style.setProperty("--bf-panel-bg",s.panelBg);r.style.setProperty("--bf-body-bg",s.bodyBg);r.style.setProperty("--bf-row-odd",F);r.style.setProperty("--bf-row-even",G);r.style.setProperty("--bf-text",s.text);r.style.setProperty("--bf-timer-bg",s.timerBg);r.style.setProperty("--bf-btn-bg",s.btnBg);r.style.setProperty("--bf-btn-bg-hover",s.btnBgHover);r.style.setProperty("--bf-btn-text",s.btnText)}
function r(){k("#friends_refresh_button")?.click()}
function s(){const q=/^(none|no one here\.?|no friends online|nobody)$/i,t=k("#friends_online_table");if(t){const u=[...t.querySelectorAll(".friends_cell_name")].map(v=>v.textContent.trim()).filter(w=>w&&!q.test(w));return[...new Set(u)]}const u=["#friendsContainer","#friends_scrollcontainer"].map(v=>k(v)).filter(Boolean),w=new Set();for(const x of u){const y=[...x.querySelectorAll("tr,.friendsrow,.friends_row,.friends_table tr,.friends_table_row,div")];for(const z of y){const A=z.querySelector(".friends_cell_name");if(!A)continue;const B=(A.textContent||"").trim();if(!B||q.test(B))continue;const C=[...z.querySelectorAll("button,div")].some(D=>{const E=(D.textContent||"").trim().toUpperCase();return E==="JOIN"||/join/i.test(D.className)||/join/i.test(D.id)});if(C)w.add(B)}}return[...w]}
function t(q){const r=k("#friends_online_table");if(r){const s=[...r.querySelectorAll(".friends_cell_name")].find(u=>u.textContent.trim()===q);if(s)return s.closest("tr")||s.parentElement}const s=["#friendsContainer","#friends_scrollcontainer"].map(u=>k(u)).filter(Boolean);for(const u of s){const v=[...u.querySelectorAll(".friends_cell_name")].find(w=>w.textContent.trim()===q);if(v)return v.closest("tr")||v.parentElement}return null}
function u(){const q=k("#newbonklobby"),r=k("#gamerenderer canvas"),s=q&&getComputedStyle(q).display!=="none",t=r&&getComputedStyle(r).visibility!=="hidden"&&getComputedStyle(r).opacity!=="0";return s||t}
function v(q){const r=t(q);if(!r)return;let s=[...r.querySelectorAll("button,.brownButton,div")].find(u=>(u.textContent||"").trim().toUpperCase()==="JOIN");if(!s)s=[...r.querySelectorAll("button,.brownButton,div")].find(u=>/join/i.test(u.className)||/join/i.test(u.id));s?.click()}
async function w(q){if(u()){(k("#pretty_top_exit")||k("#newbonklobby_leavebutton")||k("#leavelobbybutton")||k("#lobbyleavebutton")||k("#leavebutton"))?.click();setTimeout(()=>k("#leaveconfirmwindow_okbutton")?.click(),0);await m(1000)}v(q)}
let x=false,y="",z=0;
async function A(q,r){if(x)return;const s=Date.now();if(y===q&&s-z<900)return;x=true;y=q;z=s;r?.setAttribute("disabled","disabled");try{await w(q)}finally{setTimeout(()=>r?.removeAttribute("disabled"),500);x=false}}
let B=null;function C(){if(B&&document.contains(B))return B;B=document.querySelector("#friends_refresh_button")||document.querySelector(".brownButton, .brownButton_classic, .buttonShadow");return B}
function D(q,{hover:r=false,press:s=true}={}){if(!q)return;const t=u=>{const v=C();if(v)v.dispatchEvent(new MouseEvent(u,{bubbles:true,cancelable:true,composed:true}))};if(r){q.addEventListener("mouseenter",()=>t("mouseover"))}if(s){q.addEventListener("mousedown",()=>t("mousedown"));q.addEventListener("mouseup",()=>t("mouseup"))}}
const E=document.createElement("div");E.id="bf_friends";E.innerHTML=`
  <div id="bf_head">
    <button id="bf_collapse" title="Collapse">–</button>
    <div id="bf_title">Friend List</div>
    <div id="bf_timer">30s</div>
  </div>
  <div id="bf_body"></div>
`;document.body.appendChild(E);
const F=k("#bf_body",E),G=k("#bf_collapse",E),H=k("#bf_timer",E);D(G,{hover:false,press:true});H.title="This number counts down to the next update.\nThe game only lets us refresh your friends about once every 30 seconds.\nIf we refresh faster, the list can stop working for a while (rate limited). That’s why it’s a bit slow.";
const I="bf_collapsed_theme";function J(q){E.classList.toggle("bf-collapsed",q);G.textContent=q?"+":"–";try{localStorage.setItem(I,q?"1":"0")}catch{}}
J(localStorage.getItem(I)==="1");G.onclick=a=>{a.stopPropagation();J(!E.classList.contains("bf-collapsed"))};
function K(){F.textContent="";const a=s();if(!a.length){const b=document.createElement("div");b.className="bf-empty";b.textContent="None";F.appendChild(b);return}for(const b of a){const c=document.createElement("div");c.className="bf-row";const d=document.createElement("div");d.className="bf-name";d.textContent=b;const e=document.createElement("button");e.className="bf-join";e.textContent="JOIN";D(e,{hover:true,press:true});e.onclick=f=>{f.preventDefault();f.stopPropagation();A(b,f.currentTarget)};c.append(d,e);F.appendChild(c)}}
const L=30000;let M=Date.now()+L,N=0,O=false;async function P(a=false){if(O)return;const b=Date.now();if(!a&&b-N<L){M=N+L;return}O=true;q(E);r();setTimeout(K,250);N=Date.now();M=N+L;O=false}
setInterval(()=>{P(false)},1000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)P(true)});window.addEventListener("focus",()=>P(true));
P(true);
setInterval(()=>{const a=Math.max(0,M-Date.now());H.textContent=Math.ceil(a/1000)+"s"},200);
})();