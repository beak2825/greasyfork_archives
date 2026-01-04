// ==UserScript==
// @name         輕小說文庫 wenku8 字型+大小調整+去除空行
// @namespace    http://tampermonkey.net/
// @version      1.8.1
// @description  即時調整 Wenku8 內容區字型(自定義)與大小，並可一鍵去除多餘空行，狀態自動記憶
// @author       shanlan(ChatGPT o3-mini)
// @match        http*://www.wenku8.net/modules/article/reader.php*cid=*
// @match        http*://www.wenku8.cc/modules/article/reader.php*cid=*
// @match        http*://www.wenku8.net/novel/*
// @match        http*://www.wenku8.cc/novel/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543381/%E8%BC%95%E5%B0%8F%E8%AA%AA%E6%96%87%E5%BA%AB%20wenku8%20%E5%AD%97%E5%9E%8B%2B%E5%A4%A7%E5%B0%8F%E8%AA%BF%E6%95%B4%2B%E5%8E%BB%E9%99%A4%E7%A9%BA%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/543381/%E8%BC%95%E5%B0%8F%E8%AA%AA%E6%96%87%E5%BA%AB%20wenku8%20%E5%AD%97%E5%9E%8B%2B%E5%A4%A7%E5%B0%8F%E8%AA%BF%E6%95%B4%2B%E5%8E%BB%E9%99%A4%E7%A9%BA%E8%A1%8C.meta.js
// ==/UserScript==

(function(){
"use strict";
const uiStyle = document.createElement("style");
uiStyle.textContent = `
.tm-ui-btn, .tm-ui-panel{
  all:unset;
  box-sizing:border-box;
  font-family:sans-serif;
}
.tm-ui-btn{
  position:fixed;
  width:48px;         /* 調整前為 32px */
  height:48px;        /* 調整前為 32px */
  background:#333 !important;
  color:#f1f1f1 !important;
  border:1px solid #555 !important;
  border-radius:50% !important;
  box-shadow:0 2px 8px rgba(0,0,0,0.5) !important;
  display:flex !important;
  align-items:center !important;
  justify-content:center !important;
  font-weight:bold !important;
  font-size:24px !important; /* 調整前為 18px */
  cursor:pointer !important;
  z-index:9999 !important;
  user-select:none !important;
  touch-action:none !important;
}
.tm-ui-panel{
  position:fixed;
  background:#222 !important;
  color:#f1f1f1 !important;
  border:1px solid #555 !important;
  border-radius:12px !important;
  box-shadow:0 2px 12px rgba(0,0,0,0.6) !important;
  padding:12px 16px !important; /* 調整前為 9px 10px */
  font-size:24px !important;      /* 調整前為 18px */
  display:none;
  z-index:9999 !important;
  min-width:480px;    /* 調整前為 320px */
}
.tm-ui-panel select,
.tm-ui-panel input,
.tm-ui-panel button{
  background:#333 !important;
  color:#f1f1f1 !important;
  border:1px solid #555 !important;
  border-radius:6px !important;
  padding:0px 4px !important;
  font-size:26px !important;  /* 調整前為 20px */
  margin-right:8px;
}
.tm-ui-panel button{
  cursor:pointer !important;
  min-width:48px;
  min-height:48px;
}
.tm-ui-panel label,
.tm-ui-panel span{
  color:#f1f1f1 !important;
  font-size:28px !important; /* 調整前為 21px */
}
.tm-ui-panel input[type="text"]{
  width:80px !important;   /* 調整前為 60px */
  text-align:center;
}
`;
document.head.appendChild(uiStyle);
const builtInFonts = [
  ["","預設"],
  ["\"Noto Sans TC\", \"思源黑體\", \"Microsoft JhengHei\", \"微軟正黑體\", sans-serif","思源黑體"],
  ["\"Noto Serif TC\", \"思源宋體\", \"PMingLiU\", \"新細明體\", serif","思源宋體"],
  ["\"Microsoft JhengHei\", \"微軟正黑體\", sans-serif","微軟正黑體"],
  ["\"Microsoft JhengHei UI\", \"微軟正黑體 UI\", sans-serif","微軟正黑體 UI"],
  ["\"PMingLiU\", \"新細明體\", serif","新細明體"],
  ["\"MingLiU\", \"細明體\", serif","細明體"],
  ["\"DFKai-SB\", \"標楷體\", serif","標楷體"],
  ["\"SimSun\", \"宋體\", serif","宋體"],
  ["\"Microsoft YaHei\", \"微軟雅黑\", sans-serif","微軟雅黑"],
  ["Arial, Helvetica, sans-serif","Arial"],
  ["serif","Serif"]
];
let customFonts = [];
try{customFonts = JSON.parse(localStorage.getItem("wenku8_customFonts")||"[]");}catch(e){customFonts = [];}
let font = localStorage.getItem("wenku8_font") || "";
let size = parseInt(localStorage.getItem("wenku8_fontsize")) || 18;
function updateStyle(){
  let s = document.getElementById("wenku8-style");
  if(!s){s = document.createElement("style"); s.id="wenku8-style"; document.head.appendChild(s);}
  s.textContent = `#content, #content * { font-family: ${font||"inherit"} !important; font-size: ${size}px !important; }`;
}
updateStyle();
const mainBtn = document.createElement("div");
mainBtn.textContent = "字";
mainBtn.classList.add("tm-ui-btn");
const panel = document.createElement("div");
panel.classList.add("tm-ui-panel");
const fontLabel = document.createElement("label");
fontLabel.textContent = "字型：";
fontLabel.style.marginRight = "8px";
const fontSel = document.createElement("select");
fontSel.style.marginRight = "20px";
function updateFontOptions(){
  while(fontSel.options.length > 0) fontSel.remove(0);
  const addOption = (arr)=>arr.forEach(([v,n])=>{
    const opt = new Option(n,v);
    if(v===font) opt.selected = true;
    fontSel.add(opt);
  });
  addOption(builtInFonts);
  if(customFonts.length>0) addOption(customFonts);
}
updateFontOptions();
const btnAddFont = document.createElement("button");
btnAddFont.textContent = "+";
const btnDelFont = document.createElement("button");
btnDelFont.textContent = "-";
const sizeContainer = document.createElement("span");
sizeContainer.style.display = "inline-flex";
sizeContainer.style.alignItems = "center";
const sizeLabel = document.createElement("span");
sizeLabel.textContent = "大小：";
sizeLabel.style.marginRight = "8px";
const otherLabel = document.createElement("span");
otherLabel.textContent = "其他：";
otherLabel.style.marginRight = "8px";
const btnMinus = document.createElement("button");
btnMinus.textContent = "－";
Object.assign(btnMinus.style,{width:"36px",height:"36px",fontSize:"22px",marginRight:"8px"});
const sizeInput = document.createElement("input");
Object.assign(sizeInput,{type:"text",value:size});
sizeInput.style.width = "60px";
sizeInput.style.textAlign = "center";
sizeInput.style.marginRight = "8px";
const btnPlus = document.createElement("button");
btnPlus.textContent = "＋";
Object.assign(btnPlus.style,{width:"36px",height:"36px",fontSize:"22px"});
sizeContainer.append(sizeLabel,btnPlus,sizeInput,btnMinus);
const divider = document.createElement("hr");
Object.assign(divider.style,{margin:"8px 0",border:"0",borderTop:"1px solid #555"});
const divider2 = document.createElement("hr");
Object.assign(divider2.style,{margin:"8px 0",border:"0",borderTop:"1px solid #555"});
const btnRemoveBr = document.createElement("button");
let removed = localStorage.getItem("wenku8_removebr") === "1";
btnRemoveBr.textContent = removed ? "恢復空行" : "去除空行";
panel.append(fontLabel,fontSel,btnAddFont,btnDelFont,divider,sizeContainer,divider2,otherLabel,btnRemoveBr);
let originalHTML = null;
function removeBr(){
  const c = document.querySelector("#acontent") || document.querySelector("#content");
  if(!c) return;
  if(originalHTML === null) originalHTML = c.innerHTML;
  c.innerHTML = c.innerHTML.replace(/(?:<br\s*\/?>\s*){2,}/gi,"<br>");
  btnRemoveBr.textContent = "恢復空行";
  removed = true;
  localStorage.setItem("wenku8_removebr","1");
}
function restoreBr(){
  const c = document.querySelector("#acontent") || document.querySelector("#content");
  if(!c) return;
  if(originalHTML !== null) c.innerHTML = originalHTML;
  btnRemoveBr.textContent = "去除空行";
  removed = false;
  localStorage.setItem("wenku8_removebr","0");
}
btnRemoveBr.onclick = function(){ !removed ? removeBr() : restoreBr(); };
setTimeout(()=>{
  const c = document.querySelector("#acontent") || document.querySelector("#content");
  if(!c)return;
  if(removed){
    if(originalHTML===null) originalHTML = c.innerHTML;
    c.innerHTML = c.innerHTML.replace(/(?:<br\s*\/?>\s*){2,}/gi,"<br>");
    btnRemoveBr.textContent = "恢復空行";
  }
},0);
function updateAll(){
  font = fontSel.value;
  if(sizeInput.value.trim()==="") return;
  let num = parseInt(sizeInput.value,10);
  if(num <= 0) num = 18;
  size = num;
  sizeInput.value = size;
  localStorage.setItem("wenku8_font",font);
  localStorage.setItem("wenku8_fontsize",size);
  updateStyle();
}
fontSel.addEventListener("change",updateAll);
sizeInput.addEventListener("input",updateAll);
btnMinus.addEventListener("click",()=>{ size = Math.max(1, size-2); sizeInput.value = size; updateAll(); });
btnPlus.addEventListener("click",()=>{ size = size+2; sizeInput.value = size; updateAll(); });
btnAddFont.onclick = function(){
  const newFontValue = prompt('請輸入字體代碼，例如 "Comic Sans MS", cursive, sans-serif');
  if(!newFontValue)return;
  const newFontName = prompt("請輸入字體顯示名稱");
  if(!newFontName)return;
  customFonts.push([newFontValue,newFontName]);
  localStorage.setItem("wenku8_customFonts",JSON.stringify(customFonts));
  updateFontOptions();
};
btnDelFont.onclick = function(){
  const selVal = fontSel.value;
  const foundIndex = customFonts.findIndex(item=>item[0]===selVal);
  if(foundIndex===-1){ alert("無法刪除內建字體！"); return; }
  if(confirm("確定刪除選定的自訂字體？")){
    customFonts.splice(foundIndex,1);
    localStorage.setItem("wenku8_customFonts",JSON.stringify(customFonts));
    if(font===selVal){ font = ""; localStorage.setItem("wenku8_font",""); }
    updateFontOptions();
    updateStyle();
  }
};
const MARGIN = 8, THRESHOLD = 4;
function setBtnPosition(l,t){ mainBtn.style.left = l+"px"; mainBtn.style.top = t+"px"; }
function clampBtnInView(){
  const vw = window.innerWidth, vh = window.innerHeight;
  const bw = mainBtn.offsetWidth || 32, bh = mainBtn.offsetHeight || 32;
  let l = parseFloat(mainBtn.style.left)||0, t = parseFloat(mainBtn.style.top)||0;
  l = Math.min(Math.max(l,MARGIN),vw-bw-MARGIN);
  t = Math.min(Math.max(t,MARGIN),vh-bh-MARGIN);
  setBtnPosition(l,t);
}
function measurePanelSize(){
  const pd = panel.style.display, pv = panel.style.visibility;
  panel.style.visibility="hidden";
  panel.style.display="block";
  const r = panel.getBoundingClientRect();
  panel.style.display = pd;
  panel.style.visibility = pv;
  return {w:r.width,h:r.height};
}
function positionPanel(){
  if(panel.style.display==="none") return;
  const vw = window.innerWidth, vh = window.innerHeight;
  const btnRect = mainBtn.getBoundingClientRect();
  const r = panel.getBoundingClientRect();
  const sz = (r.width && r.height) ? {w:r.width, h:r.height} : measurePanelSize();
  let left, top;
  const rightSpace = vw - (btnRect.right + MARGIN);
  const leftSpace = btnRect.left - MARGIN;
  if(rightSpace >= sz.w + 20) {
    left = btnRect.right + MARGIN;
  } else if(leftSpace >= sz.w + 20) {
    left = btnRect.left - sz.w - MARGIN;
  } else {
    left = Math.min(Math.max(btnRect.left + (btnRect.width - sz.w) / 2, MARGIN), vw - sz.w - MARGIN);
  }
  top = btnRect.bottom + MARGIN;
  if(top + sz.h > vh - MARGIN) top = vh - sz.h - MARGIN;
  if(top < MARGIN) top = MARGIN;
  panel.style.left = Math.round(left) + "px";
  panel.style.top = Math.round(top) + "px";
}
function togglePanel(){
  if(panel.style.display === "block"){
    panel.style.display = "none";
  }else{
    panel.style.display = "block";
    positionPanel();
  }
}
document.body.append(mainBtn,panel);
let initLeft = parseFloat(localStorage.getItem("wenku8_btn_left"));
let initTop = parseFloat(localStorage.getItem("wenku8_btn_top"));
if(!Number.isFinite(initLeft)) initLeft = window.innerWidth - (mainBtn.offsetWidth||32) - 12;
if(!Number.isFinite(initTop)) initTop = 12;
setBtnPosition(initLeft,initTop);
clampBtnInView();
let dragging = false, startX = 0, startY = 0, originL = 0, originT = 0;
mainBtn.addEventListener("pointerdown",(e)=>{
  e.preventDefault();
  mainBtn.setPointerCapture(e.pointerId);
  dragging = false;
  const rect = mainBtn.getBoundingClientRect();
  startX = e.clientX;
  startY = e.clientY;
  originL = rect.left;
  originT = rect.top;
  const onMove = (ev)=>{
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    if(!dragging && (Math.abs(dx)>THRESHOLD || Math.abs(dy)>THRESHOLD)) dragging = true;
    if(dragging){
      let nl = originL + dx, nt = originT + dy;
      const vw = window.innerWidth, vh = window.innerHeight;
      const bw = mainBtn.offsetWidth, bh = mainBtn.offsetHeight;
      if(nl < MARGIN) nl = MARGIN;
      if(nt < MARGIN) nt = MARGIN;
      if(nl + bw > vw - MARGIN) nl = vw - bw - MARGIN;
      if(nt + bh > vh - MARGIN) nt = vh - bh - MARGIN;
      setBtnPosition(nl,nt);
      if(panel.style.display!=="none") positionPanel();
    }
  };
  const onUp = ()=>{
    mainBtn.releasePointerCapture(e.pointerId);
    document.removeEventListener("pointermove",onMove);
    document.removeEventListener("pointerup",onUp);
    clampBtnInView();
    if(panel.style.display!=="none") positionPanel();
    const l = parseFloat(mainBtn.style.left)||0;
    const t = parseFloat(mainBtn.style.top)||0;
    localStorage.setItem("wenku8_btn_left",String(l));
    localStorage.setItem("wenku8_btn_top",String(t));
    if(!dragging) togglePanel();
    dragging = false;
  };
  document.addEventListener("pointermove",onMove);
  document.addEventListener("pointerup",onUp);
});
mainBtn.addEventListener("click",(e)=>{
  e.preventDefault();
  e.stopPropagation();
});
document.addEventListener("pointerdown",(e)=>{
  if(!panel.contains(e.target) && e.target!==mainBtn) panel.style.display="none";
});
window.addEventListener("resize",()=>{
  clampBtnInView();
  if(panel.style.display!=="none") positionPanel();
});
})();