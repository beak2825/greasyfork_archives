// ==UserScript==
// @name         Kone Sidebar Remover
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  kone.gg 사이드바 및 프로필 버튼 삭제 (컨텍스트 메뉴 + 개별 자동삭제)
// @author       Tasteful-1
// @match        https://kone.gg/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546017/Kone%20Sidebar%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/546017/Kone%20Sidebar%20Remover.meta.js
// ==/UserScript==
(()=>{'use strict';const s=['.hidden.lg\\:block.space-y-2.break-all.md\\:space-y-4.lg\\:min-w-64.lg\\:max-w-72.shrink-0','.-order-1.shrink-0.transition-all.hidden.lg\\:block.w-18[data-open="false"]','aside.fixed.top-14.bottom-0.left-0[data-open="false"]','aside.fixed.top-14.bottom-0.left-0[data-open="true"]'],p='button[data-slot="dropdown-menu-trigger"]',k1='sidebarAutoDeleteEnabled',k2='profileAutoDeleteEnabled';let o1=null,o2=null,m=[];const r=(l,f)=>{let c=0;l.forEach(x=>{document.querySelectorAll(x).forEach(e=>{e.remove();c++})});return c>0},t=(l)=>{l.forEach(x=>{document.querySelectorAll(x).forEach(e=>{e.style.display=e.style.display==='none'?'':  'none'})})},g1=()=>GM_getValue(k1,false),g2=()=>GM_getValue(k2,false),st1=()=>{r(s);o1=new MutationObserver(()=>r(s));o1.observe(document.body,{childList:true,subtree:true})},sp1=()=>{if(o1){o1.disconnect();o1=null}},st2=()=>{r([p]);o2=new MutationObserver(()=>r([p]));o2.observe(document.body,{childList:true,subtree:true})},sp2=()=>{if(o2){o2.disconnect();o2=null}},tg1=()=>{const n=!g1();GM_setValue(k1,n);n?st1():sp1();u()},tg2=()=>{const n=!g2();GM_setValue(k2,n);n?st2():sp2();u()},u=()=>{m.forEach(i=>{try{GM_unregisterMenuCommand(i)}catch(e){}});m=[];const s1=g1()?'ON':'OFF',s2=g2()?'ON':'OFF';m.push(GM_registerMenuCommand('사이드바 삭제',()=>r(s)));m.push(GM_registerMenuCommand('사이드바 토글',()=>t(s)));m.push(GM_registerMenuCommand(`사이드바 자동삭제 ${s1}`,tg1));m.push(GM_registerMenuCommand('프로필 버튼 삭제',()=>r([p])));m.push(GM_registerMenuCommand('프로필 버튼 토글',()=>t([p])));m.push(GM_registerMenuCommand(`프로필 버튼 자동삭제 ${s2}`,tg2))};(()=>{u();if(g1())st1();if(g2())st2()})();document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>{}):null})();