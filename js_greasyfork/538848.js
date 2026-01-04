// ==UserScript==
// @name         維基百科 wikipedia 短網址複製
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  會在維基百科畫面的右上角多兩種不同格式的短網址能夠一鍵複製
// @author       shanlan(ChatGPT o3-mini)
// @match        https://*.wikipedia.org/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538848/%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%20wikipedia%20%E7%9F%AD%E7%B6%B2%E5%9D%80%E8%A4%87%E8%A3%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/538848/%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%20wikipedia%20%E7%9F%AD%E7%B6%B2%E5%9D%80%E8%A4%87%E8%A3%BD.meta.js
// ==/UserScript==
 
(function(){
"use strict";
const notify=m=>{
let d=document.createElement("div");
d.textContent=m;
d.style.cssText="position:fixed;top:20px;right:20px;background:linear-gradient(135deg,#28a745,#218838);color:#fff;padding:10px;border-radius:8px;z-index:9999;transition:opacity .5s;opacity:0";
document.body.appendChild(d);
setTimeout(()=>d.style.opacity="1",50);
setTimeout(()=>{d.style.opacity="0";setTimeout(()=>d.remove(),500);},3000);
};
const clickConfirm=()=>{let b=document.querySelector(".oo-ui-window-foot .oo-ui-buttonElement-button");b&&b.click();};
window.addEventListener("load",()=>{
let o=document.getElementById("t-urlshortener"),
a=o&&o.querySelector("a"),
d=document.getElementById("pt-sitesupport-2")||document.getElementById("pt-sitesupport");
if(!o||!a||!d)return;
 
// 原有按鈕 (複製短網址並隱藏對話)
let c=o.cloneNode(true);
c.id="t-urlshortener-clone";
let ca=c.querySelector("a");
ca.removeAttribute("id");
ca.addEventListener("click",e=>{
e.preventDefault();
a.click();
let i,cnt=0,interval=setInterval(()=>{
cnt++;
i=document.getElementById("ooui-2");
if(i&&i.value.trim()){
let w=i.closest(".oo-ui-window"); w&&(w.style.display="none");
clearInterval(interval);
let s=i.value.trim();
if(navigator.clipboard&&navigator.clipboard.writeText)
navigator.clipboard.writeText(s).then(()=>{notify(s); setTimeout(clickConfirm,300);});
else {i.select();document.execCommand("copy");notify(s);setTimeout(clickConfirm,300);}
}
cnt>30&&clearInterval(interval);
},100);
});
 
// 新增按鈕：使用 Wiki 頁面 ID 製作短網址
let c2=o.cloneNode(true);
c2.id="t-urlshortener-wikiid";
let ca2=c2.querySelector("a");
ca2.removeAttribute("id");
ca2.textContent = "WikiID 短網址"; // 修改按鈕顯示文字
ca2.addEventListener("click",e=>{
e.preventDefault();
// 從 mw.config 取頁面 ID，若無則略過
let id = (window.mw && mw.config && mw.config.get("wgArticleId")) || null;
if(!id){
notify("無法取得 Wiki ID");
return;
}
let s = location.protocol + "//" + location.host + "/?curid=" + id;
if(navigator.clipboard&&navigator.clipboard.writeText)
navigator.clipboard.writeText(s).then(()=>notify(s)).catch(console.error);
else {
let t = document.createElement("textarea"); t.value=s;
document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove();
notify(s);
}
});
 
// 插入兩個按鈕: 原有按鈕置於資助維基前，新按鈕緊接其右邊
d.parentNode.insertBefore(c, d);
// 若想排列在同一行，可調整新按鈕的 margin
c2.style.marginLeft = "10px";
d.parentNode.insertBefore(c2, d);
});
})();