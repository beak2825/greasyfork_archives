// ==UserScript==
// @name         4chan影片自動暫停與縮放管理
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  當影片可視比例不足50%時自動暫停；影片播放時自動縮放符合視窗大小
// @author       shanlan(ChatGPT o3-mini)
// @match        https://boards.4chan.org/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542442/4chan%E5%BD%B1%E7%89%87%E8%87%AA%E5%8B%95%E6%9A%AB%E5%81%9C%E8%88%87%E7%B8%AE%E6%94%BE%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/542442/4chan%E5%BD%B1%E7%89%87%E8%87%AA%E5%8B%95%E6%9A%AB%E5%81%9C%E8%88%87%E7%B8%AE%E6%94%BE%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function(){
"use strict";
const opt={root:null,threshold:0.5},st=new WeakSet,adjust=v=>{
const {width,height}=v.getBoundingClientRect();
if(width>window.innerWidth*0.85||height>window.innerHeight*0.85){
v.style.setProperty("max-width","85vw","important");
v.style.setProperty("max-height","85vh","important")
}
},io=new IntersectionObserver(e=>{
e.forEach(i=>{
const v=i.target;
i.intersectionRatio>=opt.threshold?v.play().catch(()=>{}):v.pause()
})
},opt),observe=v=>{
if(st.has(v)) return;
st.add(v);
io.observe(v);
v.addEventListener("play",()=>{adjust(v)})
},obsAll=()=>{
document.querySelectorAll("video").forEach(v=>{observe(v)})
},mo=new MutationObserver(ms=>{
ms.forEach(m=>{
m.addedNodes.forEach(n=>{
if(n.nodeType===Node.ELEMENT_NODE){
n.tagName==="VIDEO"?observe(n):n.querySelectorAll("video").forEach(v=>{observe(v)})
}
})
})
});
mo.observe(document.body,{childList:true,subtree:true});
obsAll();
window.addEventListener("resize",()=>{
document.querySelectorAll("video").forEach(v=>{
!v.paused&&adjust(v)
})
});

let pausedByPageHide = new WeakSet();
document.addEventListener("visibilitychange",()=>{
if(document.hidden){
pausedByPageHide = new WeakSet();
document.querySelectorAll("video").forEach(v=>{
if(!v.paused){
v.pause();
pausedByPageHide.add(v);
}
})
}else{
document.querySelectorAll("video").forEach(v=>{
if(pausedByPageHide.has(v)){
v.play().catch(()=>{});
}
})
pausedByPageHide = new WeakSet();
}
});
})();