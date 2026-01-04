// ==UserScript==
// @name         instagram 短影音停用重播、解除靜音、增加可點擊的進度條
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  IG 短影音停用重播、解除靜音、增加可點擊的進度條
// @author       shanlan(grok-code-fast-1)
// @match        *://www.instagram.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538847/instagram%20%E7%9F%AD%E5%BD%B1%E9%9F%B3%E5%81%9C%E7%94%A8%E9%87%8D%E6%92%AD%E3%80%81%E8%A7%A3%E9%99%A4%E9%9D%9C%E9%9F%B3%E3%80%81%E5%A2%9E%E5%8A%A0%E5%8F%AF%E9%BB%9E%E6%93%8A%E7%9A%84%E9%80%B2%E5%BA%A6%E6%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/538847/instagram%20%E7%9F%AD%E5%BD%B1%E9%9F%B3%E5%81%9C%E7%94%A8%E9%87%8D%E6%92%AD%E3%80%81%E8%A7%A3%E9%99%A4%E9%9D%9C%E9%9F%B3%E3%80%81%E5%A2%9E%E5%8A%A0%E5%8F%AF%E9%BB%9E%E6%93%8A%E7%9A%84%E9%80%B2%E5%BA%A6%E6%A2%9D.meta.js
// ==/UserScript==

(function(){
'use strict';
const enhance = v => {
if(!v || v.__enhanced) return;
v.__enhanced = true;
v.loop = false;
v.addEventListener('ended',()=>{ v.pause(); v.currentTime = v.duration });
v.addEventListener('canplay', function h(){
setTimeout(()=>{
if(v.muted)
if(location.pathname.startsWith("/stories/")){
let b = v.closest('div[style*="width"]')?.parentNode?.parentNode?.parentNode
?.querySelector('div[aria-label="Toggle audio"]');
b && b.click();
} else {
let muteBtn = v.parentElement.querySelector('[aria-label="已靜音"], [aria-label="Toggle audio"], [role="button"] svg[aria-label="已靜音"]')?.closest('[role="button"]');
muteBtn && muteBtn.click();
// 備用：直接設定 v.muted = false; 但 IG 可能會重設
v.muted = false;
}
setTimeout(()=> v.muted && console.warn('解除靜音失敗'),300);
},100);
v.removeEventListener('canplay', h);
});
if(!v.parentElement.querySelector('.progress')){
let bar = document.createElement('div'), ind = document.createElement('div');
bar.className = 'progress';
Object.assign(bar.style, {position:'absolute', bottom:'0', left:'0', width:'100%', height:'8px', background:'rgba(0,0,0,0.5)', cursor:'pointer', zIndex:9999});
Object.assign(ind.style, {height:'100%', width:'0%', background:'#f00'});
bar.appendChild(ind);
if(getComputedStyle(v.parentElement).position === 'static') v.parentElement.style.position = 'relative';
v.parentElement.appendChild(bar);
v.addEventListener('timeupdate', ()=> ind.style.width = (v.currentTime/v.duration*100 || 0) + '%');
bar.addEventListener('click', e=>{
let r = bar.getBoundingClientRect();
v.currentTime = v.duration * ((e.clientX - r.left)/r.width);
});
}
};
const scan = n => {
if(!n) return;
n.nodeName==='VIDEO' ? enhance(n) : n.querySelectorAll?.('video').forEach(enhance);
};
new MutationObserver(ms => ms.forEach(m => m.addedNodes && m.addedNodes.forEach(scan)))
.observe(document.body, {childList:true, subtree:true});
document.querySelectorAll('video').forEach(enhance);
})();