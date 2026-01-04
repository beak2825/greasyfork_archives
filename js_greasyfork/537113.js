// ==UserScript==
// @name        网页字体修改器
// @namespace   greasyfork.org
// @version     4.1
// @description 导入本地字体更换网页字体，支持悬浮球控制和自定义字体颜色，新增字体清晰度调整和网页编辑模式
// @author      ^o^
// @run-at      document-start
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADkAAAA5CAYAAACMGIOFAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAANZSURBVGiB7drLixxVFMfxz0yHYdKTTDKmVXwRxYgu4pOAiBsX4k5QBNe6c+3C/8GNCxcJrgOKa1ERNwERxPgIKsYxjviMUScaE42aSRwXp4SmUre6qqc7qSnrC5cp6j5/99x77lTfQ0c7mKlQZjuuxNYpj6WMdfyOVZytW3mUyJvxMO7WDJFv4XX8WKfylhH5d+DJ7G8TuB7LaoqcHZE/yFJTWMpSLcpEzmLXOI1OkR1ZqkXZcp3LGizai6v4EF+X1L0HewvyjuID/JmoO4s7cRd6ubyxLFkmciv6ibyjOIB3E/nb8bRikYfxnJioImbwOK4We3CYHWJ19XAhNfA8ZSL70h71c7yH7xP5i8IbFvEHTih3Hu+IicyLnBMTOJ+1U4myPdlXbMmT2QBqebiarAgvWmSthcS4kpSJXMhSns/wEc7V6agmq/gEPxTk9RPjSjKOyC+yNE0u4GOxYvKkxpVklMhtuXenhCWLZnjSrOAY/sm932aCIov25DExw3/V6WRMTmZ95Sd0PkuVKRO5gjeE5dbwt9iLy3U62ADncSTrcx2n8TZexTd1Gio7Qj7FfuEA7s06fU362JgGyziY9fkzDuF9YeWJModrxOE86h/6/1gUB/56QdqftVWVvjgvB6p9Gl5ElUGfc2kcTYqzxviGHGbUV0gr6ES2hU5kW+hEtoVOZFvoRLaFTmRb6ES2hU5kW+hENohH8SJewS11K1f9Yepy8xQeyp5fFr//VmazWPLU0HPtS9jNIvK3oefFupU3i8j/hSU7kaNomnftievyJXE9Ny+uCXYPlbkdz2CniB8YiEvbIyKO4SKaJvJ8hTJ78Wwi76CCWIWmLdeN3HmcTmU0zZKP4EHsEXE+P4mr+x6ez8ocxz6cEXemu8Sl1C+XerCTvLqDG4bq/1p3ME1brimG4wYuq3ddwHXCE+4RYWNF3IrH8J1Yet+Km+MypzMsckYYJx8wkWQSIneKUNH7hefbLZbXVYny+3CTOPuO40sRa3cIXyXq5AX1Ct5NlfvwkrBG0R4cldaEc3mipI9Brs7Eoj+qcq2w4BVj1t8iIqRvLClTZMlaHWyUEyJSZKBmEFHGmtifKyVlzuAFPIA3szqVGSuaIseSiE+9zcZEHhZOqGMc/gXbNLbbcR2PuQAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/537113/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537113/%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(() => {
'use strict';
const DEFAULT_COLOR='#333333',FAB_SIZE=50,DEFAULT_CLARITY=0;
let editMode = false; // 编辑模式状态变量

const main=()=>{
const defaultFont={name:'system-ui(默认)',fontFamily:'system-ui',isDefault:true};
let fontData=GM_getValue('fontData',{fonts:[defaultFont],currentFont:defaultFont.name,fontColor:DEFAULT_COLOR,fabPosition:null,clarityValue:DEFAULT_CLARITY});
if(fontData.clarityValue===undefined){
fontData.clarityValue=DEFAULT_CLARITY;
GM_setValue('fontData',fontData);
}
const cachedFontBlobUrls={};
let fab=null,panel=null,overlay=null,isFabVisible=GM_getValue('fabVisible',true);
GM_addStyle(`
#via-font-fab{position:fixed;width:${FAB_SIZE}px;height:${FAB_SIZE}px;background:linear-gradient(45deg,#2196F3,#9C27B0);color:white;border-radius:50%;text-align:center;line-height:${FAB_SIZE}px;font-size:24px;font-weight:bold;box-shadow:0 4px 8px rgba(0,0,0,0.3);z-index:999999;touch-action:none;user-select:none;transition:left 0.2s,top 0.2s,transform 0.2s ease,opacity 0.2s ease;opacity:0.7;transform:scale(0.8);cursor:pointer;}
#via-font-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);z-index:999997;display:none;opacity:0;transition:opacity 0.3s ease;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);}
#via-font-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) scale(0.8);background:rgba(255,255,255,0.85);border-radius:16px;box-shadow:0 12px 30px rgba(0,0,0,0.25);padding:20px;max-height:80vh;overflow-y:auto;z-index:999998;width:90%;max-width:420px;opacity:0;transition:all 0.3s cubic-bezier(0.175,0.885,0.32,1.275);display:none;backdrop-filter:blur(20px) saturate(180%);-webkit-backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,0.3);}
.panel-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:12px;border-bottom:1px solid rgba(0,0,0,0.1);}
.panel-title{margin:0;font-weight:600;color:#333;font-size:18px;}
.close-btn{background:none;border:none;font-size:24px;cursor:pointer;color:#777;transition:color 0.2s;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:rgba(0,0,0,0.05);}
.close-btn:hover{background:rgba(0,0,0,0.08);color:#333;}
.setting-group{margin-bottom:15px;padding:12px;background:rgba(255,255,255,0.5);border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.05);}
.setting-label{display:block;margin-bottom:6px;font-weight:500;color:#444;font-size:14px;}
.font-select{width:100%;padding:10px 12px;border-radius:8px;border:1px solid rgba(0,0,0,0.1);font-size:14px;background:rgba(255,255,255,0.8);box-shadow:0 1px 4px rgba(0,0,0,0.05);transition:border-color 0.2s;}
.font-select:focus{border-color:#2196F3;outline:none;box-shadow:0 0 0 2px rgba(33,150,243,0.2);}
.color-controls{display:flex;align-items:center;gap:8px;}
.color-picker{width:40px;height:32px;padding:1px;border-radius:6px;border:1px solid rgba(0,0,0,0.1);background:rgba(255,255,255,0.8);cursor:pointer;}
.color-input{flex:1;padding:8px 12px;border-radius:8px;border:1px solid rgba(0,0,0,0.1);font-size:13px;background:rgba(255,255,255,0.8);box-shadow:0 1px 4px rgba(0,0,0,0.05);}
.color-reset-btn{padding:6px 12px;background:rgba(240,240,240,0.7);border:1px solid rgba(0,0,0,0.1);border-radius:6px;cursor:pointer;transition:all 0.2s;font-size:13px;}
.color-reset-btn:hover{background:rgba(224,224,224,0.7);}
.upload-area{margin:20px 0;padding:15px 12px;background:rgba(249,249,249,0.5);border-radius:10px;border:2px dashed rgba(0,0,0,0.1);text-align:center;transition:background 0.2s;}
.upload-area:hover{background:rgba(240,240,240,0.6);}
.installed-fonts-title{margin-bottom:12px;font-size:16px;color:#444;}
.fonts-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;}
.font-item{background:rgba(245,245,245,0.7);padding:12px;border-radius:10px;text-align:center;transition:transform 0.2s,box-shadow 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.05);}
.font-item:hover{transform:translateY(-3px);box-shadow:0 3px 12px rgba(0,0,0,0.1);background:rgba(255,255,255,0.8);}
.font-name{font-size:14px;margin-bottom:10px;color:#333;font-weight:500;}
.delete-btn{padding:7px 12px;background:rgba(255,77,79,0.9);color:white;border:none;border-radius:6px;cursor:pointer;width:100%;transition:background 0.2s;font-size:13px;}
.delete-btn:hover{background:rgba(255,51,54,0.9);}
.clarity-controls{display:flex;flex-direction:column;gap:8px;margin-top:12px;padding:12px;background:rgba(255,255,255,0.5);border-radius:10px;box-shadow:0 1px 4px rgba(0,0,0,0.05);}
.clarity-slider{width:100%;height:6px;-webkit-appearance:none;appearance:none;background:#e0e0e0;border-radius:3px;outline:none;}
.clarity-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:18px;height:18px;border-radius:50%;background:#2196F3;cursor:pointer;box-shadow:0 1px 3px rgba(0,0,0,0.2);border:2px solid white;}
.clarity-value-display{text-align:center;font-size:13px;color:#444;font-weight:500;}
.clarity-description{font-size:12px;color:#666;margin-top:3px;text-align:center;}
.edit-mode-indicator{position:fixed;top:10px;right:10px;background:rgba(255,0,0,0.7);color:white;padding:5px 10px;border-radius:4px;font-size:12px;z-index:1000000;display:none;}
@media (max-width:500px){#via-font-panel{width:95%;padding:15px 10px;}.fonts-grid{grid-template-columns:repeat(auto-fill,minmax(130px,1fr));}}`);

// 创建编辑模式指示器
const createEditIndicator = () => {
  const indicator = document.createElement('div');
  indicator.className = 'edit-mode-indicator';
  indicator.textContent = '编辑模式已启用';
  indicator.id = 'edit-mode-indicator';
  document.body.appendChild(indicator);
  return indicator;
};

// 切换编辑模式
const toggleEditMode = () => {
  if (editMode) {
    exitEditMode();
  } else {
    enterEditMode();
  }
  editMode = !editMode;
};

// 进入编辑模式
const enterEditMode = () => {
  document.body.contentEditable = 'true';
  document.getElementById('edit-mode-indicator').style.display = 'block';
  GM_registerMenuCommand('🛑 退出编辑模式', toggleEditMode);
};

// 退出编辑模式
const exitEditMode = () => {
  document.body.contentEditable = 'false';
  document.getElementById('edit-mode-indicator').style.display = 'none';
  GM_registerMenuCommand('✏️ 进入编辑模式', toggleEditMode);
};

const createFAB=()=>{
fab=document.createElement('div');
fab.id='via-font-fab';
if(fontData.fabPosition){
fab.style.left=`${fontData.fabPosition.x}px`;
fab.style.top=`${fontData.fabPosition.y}px`;
}else{
fab.style.right='20px';
fab.style.bottom='30px';
}
fab.innerHTML='Aa';
document.body.appendChild(fab);
if(!isFabVisible){fab.style.display='none';}
return fab;};

const createPanel=()=>{
overlay=document.createElement('div');
overlay.id='via-font-overlay';
document.body.appendChild(overlay);
panel=document.createElement('div');
panel.id='via-font-panel';
panel.innerHTML=`<div class="panel-header"><h3 class="panel-title">字体设置</h3><button class="close-btn">×</button></div><div class="panel-content"></div>`;
document.body.appendChild(panel);
return panel;};

const setupDrag=()=>{
let startX,startY,initialX,initialY,dragging=false,fabTimer=null,edgeTimer=null;
const onTouchStart=e=>{
if(e.touches[0]){
const touch=e.touches[0];
startX=touch.clientX;
startY=touch.clientY;
initialX=fab.offsetLeft;
initialY=fab.offsetTop;
fab.style.transition='none';
fab.style.opacity='1';
fab.style.transform='scale(1)';
clearTimeout(fabTimer);
clearTimeout(edgeTimer);
document.addEventListener('touchmove',onTouchMove);
document.addEventListener('touchend',onTouchEnd);}};
const onTouchMove=e=>{
if(e.touches[0]){
const touch=e.touches[0];
const diffX=touch.clientX-startX;
const diffY=touch.clientY-startY;
if(Math.abs(diffX)>5||Math.abs(diffY)>5){dragging=true;}
let newX=initialX+diffX;
let newY=initialY+diffY;
const maxX=window.innerWidth-fab.offsetWidth;
const maxY=window.innerHeight-fab.offsetHeight;
newX=Math.max(0,Math.min(newX,maxX));
newY=Math.max(0,Math.min(newY,maxY));
fab.style.left=`${newX}px`;
fab.style.top=`${newY}px`;
fab.style.right='auto';
fab.style.bottom='auto';}};
const onTouchEnd=()=>{
document.removeEventListener('touchmove',onTouchMove);
document.removeEventListener('touchend',onTouchEnd);
fab.style.transition='left 0.2s, top 0.2s, transform 0.2s ease, opacity 0.2s ease';
if(dragging){
fontData.fabPosition={x:fab.offsetLeft,y:fab.offsetTop};
GM_setValue('fontData',fontData);
dragging=false;}
clearTimeout(fabTimer);
fabTimer=setTimeout(()=>{
fab.style.opacity='0.7';
fab.style.transform='scale(0.8)';
edgeTimer=setTimeout(()=>checkEdge(),100);},800);};
fab.addEventListener('touchstart',onTouchStart);};

const checkEdge=()=>{
if(!fab)return;
const fabRect=fab.getBoundingClientRect();
const windowWidth=window.innerWidth;
const edgeThreshold=10;
if(fabRect.left<edgeThreshold){
fab.style.transform='scale(0.8) translateX(-40%)';
fab.style.opacity='0.5';
}else if(windowWidth-fabRect.right<edgeThreshold){
fab.style.transform='scale(0.8) translateX(40%)';
fab.style.opacity='0.5';
}else{
fab.style.transform='scale(0.8)';
fab.style.opacity='0.7';}};

const createStyleElement=(elementId,highPriority=false)=>{
let styleElement=document.getElementById(elementId);
if(!styleElement){
styleElement=document.createElement('style');
styleElement.id=elementId;
if(highPriority){document.head.insertBefore(styleElement,document.head.firstChild);}
else{document.head.appendChild(styleElement);}}
return styleElement;};

const fontFaceStyleElement=createStyleElement('font-face-style',true);
const commonStyleElement=createStyleElement('font-common-style',true);
const colorStyleElement=createStyleElement('font-color-style');
const clarityStyleElement=createStyleElement('font-clarity-style');

const updateCommonStyles=()=>{
const selectedFont=fontData.fonts.find(font=>font.name===fontData.currentFont);
if(!selectedFont)return;
const cssRules=`html *:not(i):not(em):not(:empty) { font-family: "${selectedFont.fontFamily}" !important; }`;
commonStyleElement.textContent=cssRules;};

const applyColor=()=>{
if(fontData.fontColor===DEFAULT_COLOR){
colorStyleElement.textContent='';
return;}
colorStyleElement.textContent=`body, body * { color: ${fontData.fontColor} !important; }`;};

const updateFontFaces=selectedFont=>{
if(!selectedFont||!selectedFont.storageKey){
fontFaceStyleElement.textContent='';
updateCommonStyles();
return;}
const fontBlobUrl=cachedFontBlobUrls[selectedFont.storageKey]||'';
if(fontBlobUrl){
const fontFaceCss=`@font-face { font-family: "${selectedFont.fontFamily}"; src: url(${fontBlobUrl}) format('${selectedFont.format}'); }`;
fontFaceStyleElement.textContent=fontFaceCss;
updateCommonStyles();
return;}
const fontChunks=GM_getValue(`font_${selectedFont.storageKey}_chunks`,[]);
const totalChunks=GM_getValue(`font_${selectedFont.storageKey}_total`,0);
if(fontChunks.length===totalChunks){
Promise.all(fontChunks.map(index=>GM_getValue(`font_${selectedFont.storageKey}_chunk_${index}`)))
.then(base64Chunks=>{
const base64Data=base64Chunks.join('');
const blob=base64ToBlob(base64Data,selectedFont.mimeType);
const fontBlobUrl=URL.createObjectURL(blob);
cachedFontBlobUrls[selectedFont.storageKey]=fontBlobUrl;
const fontFaceCss=`@font-face { font-family: "${selectedFont.fontFamily}"; src: url(${fontBlobUrl}) format('${selectedFont.format}'); }`;
fontFaceStyleElement.textContent=fontFaceCss;
updateCommonStyles();});}};

const updateClarityStyle=()=>{
const value=fontData.clarityValue;
clarityStyleElement.textContent=`*:not(pre):not(code):not(tt):not(kbd):not(samp) {-webkit-text-stroke:${value}px !important;text-stroke:${value}px !important;}`;};

const togglePanel=()=>{
if(panel.style.display==='none'||panel.style.display===''){
overlay.style.display='block';
panel.style.display='block';
setTimeout(()=>{
overlay.style.opacity='1';
panel.style.opacity='1';
panel.style.transform='translate(-50%,-50%) scale(1)';},10);
refreshPanel();
}else{
overlay.style.opacity='0';
panel.style.opacity='0';
panel.style.transform='translate(-50%,-50%) scale(0.8)';
setTimeout(()=>{
overlay.style.display='none';
panel.style.display='none';},300);}};

const refreshPanel=()=>{
const content=panel.querySelector('.panel-content');
if(!content)return;
content.innerHTML=`
<div class="setting-group">
<label class="setting-label">当前字体</label>
<select class="font-select">
${fontData.fonts.map(font=>`<option value="${font.name}"${fontData.currentFont===font.name?' selected':''}>${font.name}</option>`).join('')}
</select></div>
<div class="setting-group">
<label class="setting-label">字体颜色</label>
<div class="color-controls">
<input type="color" class="color-picker" value="${fontData.fontColor}">
<input type="text" class="color-input" value="${fontData.fontColor}">
<button class="color-reset-btn">重置</button></div></div>
<div class="setting-group">
<label class="setting-label">字体清晰度</label>
<div class="clarity-controls">
<input type="range" min="0" max="0.8" step="0.05" value="${fontData.clarityValue}" class="clarity-slider">
<div class="clarity-value-display">当前值:${fontData.clarityValue.toFixed(2)}</div>
<div class="clarity-description">调整字体边缘清晰度（0为默认，0.8为最清晰）</div></div></div>
<div class="upload-area">
<label class="setting-label">上传字体文件(.ttf,.otf,.woff,.woff2)</label>
<input type="file" accept=".ttf,.otf,.woff,.woff2" multiple style="width:100%;padding:8px"></div>
<div class="setting-group">
<h4 class="installed-fonts-title">已安装字体(${fontData.fonts.length})</h4>
<div class="fonts-grid">
${fontData.fonts.filter(f=>!f.isDefault).map(font=>`<div class="font-item"><div class="font-name">${font.name}</div><button data-font="${font.name}" class="delete-btn">删除</button></div>`).join('')}</div></div>`;
setupPanelEvents();};

const setupPanelEvents=()=>{
panel.querySelector('.font-select').addEventListener('change',e=>{
fontData.currentFont=e.target.value;
const selectedFont=fontData.fonts.find(f=>f.name===fontData.currentFont);
if(selectedFont){
updateFontFaces(selectedFont);
GM_setValue('fontData',fontData);}});
const colorPicker=panel.querySelector('.color-picker');
const colorInput=panel.querySelector('.color-input');
const colorResetBtn=panel.querySelector('.color-reset-btn');
colorPicker.addEventListener('input',e=>{
fontData.fontColor=e.target.value;
colorInput.value=e.target.value;
applyColor();
GM_setValue('fontData',fontData);});
colorInput.addEventListener('input',e=>{
const value=e.target.value;
if(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)){
fontData.fontColor=value;
colorPicker.value=value;
applyColor();
GM_setValue('fontData',fontData);}});
colorResetBtn.addEventListener('click',()=>{
fontData.fontColor=DEFAULT_COLOR;
colorPicker.value=DEFAULT_COLOR;
colorInput.value=DEFAULT_COLOR;
applyColor();
GM_setValue('fontData',fontData);});
panel.querySelector('input[type="file"]').addEventListener('change',e=>{
handleFontUpload(Array.from(e.target.files));});
panel.querySelectorAll('.delete-btn').forEach(btn=>{
btn.addEventListener('click',()=>{
const fontName=btn.dataset.font;
handleDeleteFont(fontName);});});
panel.querySelector('.close-btn').addEventListener('click',togglePanel);
overlay.addEventListener('click',e=>{if(e.target===overlay)togglePanel();});
const claritySlider=panel.querySelector('.clarity-slider');
if(claritySlider){
claritySlider.addEventListener('input',e=>{
const value=parseFloat(e.target.value);
fontData.clarityValue=value;
panel.querySelector('.clarity-value-display').textContent=`当前值:${value.toFixed(2)}`;
updateClarityStyle();
GM_setValue('fontData',fontData);});}};

const handleFontUpload=async files=>{
for(const file of files){await processFontFile(file);}
refreshPanel();};

const processFontFile=file=>{
return new Promise(resolve=>{
const originalName=file.name.replace(/\.[^/.]+$/,"");
const extension=file.name.slice(file.name.lastIndexOf('.'));
let newName=originalName;
let index=2;
while(fontData.fonts.some(f=>f.name===newName)){
newName=`${originalName}(${index})`;
index++;}
const reader=new FileReader();
reader.onload=()=>{
const result=reader.result;
const base64Data=result.split(',')[1];
const mimeType=result.split(',')[0].split(':')[1];
const storageKey='font_'+Date.now();
const format=getFontFormat(file.name);
const chunkSize=500000;
const chunks=[];
for(let i=0;i<base64Data.length;i+=chunkSize){
const chunk=base64Data.substring(i,i+chunkSize);
GM_setValue(`font_${storageKey}_chunk_${chunks.length}`,chunk);
chunks.push(chunks.length);}
GM_setValue(`font_${storageKey}_chunks`,chunks);
GM_setValue(`font_${storageKey}_total`,chunks.length);
fontData.fonts.push({
name:newName,
fontFamily:newName,
originalFileName:file.name,
mimeType:mimeType,
storageKey:storageKey,
format:format,
fileSize:file.size});
fontData.currentFont=newName;
GM_setValue('fontData',fontData);
const selectedFont=fontData.fonts.find(f=>f.name===newName);
if(selectedFont){updateFontFaces(selectedFont);}
resolve();};
reader.readAsDataURL(file);});};

const handleDeleteFont=fontName=>{
if(!confirm(`确定要删除字体"${fontName}"吗？`))return;
const fontIndex=fontData.fonts.findIndex(f=>f.name===fontName);
if(fontIndex===-1)return;
const font=fontData.fonts[fontIndex];
if(font.storageKey){
const fontChunks=GM_getValue(`font_${font.storageKey}_chunks`,[]);
fontChunks.forEach((_,i)=>GM_deleteValue(`font_${font.storageKey}_chunk_${i}`));
GM_deleteValue(`font_${font.storageKey}_chunks`);
GM_deleteValue(`font_${font.storageKey}_total`);
if(cachedFontBlobUrls[font.storageKey]){
URL.revokeObjectURL(cachedFontBlobUrls[font.storageKey]);
delete cachedFontBlobUrls[font.storageKey];}}
fontData.fonts.splice(fontIndex,1);
if(fontData.currentFont===fontName){
fontData.currentFont=fontData.fonts[0].name;}
GM_setValue('fontData',fontData);
const selectedFont=fontData.fonts.find(f=>f.name===fontData.currentFont);
if(selectedFont){updateFontFaces(selectedFont);}
refreshPanel();};

const base64ToBlob=(base64String,mimeType)=>{
const byteCharacters=atob(base64String);
const byteArrays=[];
for(let i=0;i<byteCharacters.length;i+=512){
const slice=byteCharacters.slice(i,i+512);
const byteNumbers=new Array(slice.length);
for(let j=0;j<slice.length;j++){byteNumbers[j]=slice.charCodeAt(j);}
byteArrays.push(new Uint8Array(byteNumbers));}
return new Blob(byteArrays,{type:mimeType});};

const getFontFormat=fileName=>{
const ext=fileName.split('.').pop().toLowerCase();
return{'ttf':'truetype','otf':'opentype','woff':'woff','woff2':'woff2'}[ext]||'truetype';};

fab=createFAB();
createPanel();
setupDrag();
createEditIndicator(); // 创建编辑模式指示器
window.addEventListener('resize',checkEdge);
checkEdge();
fab.addEventListener('click',togglePanel);
const selectedFont=fontData.fonts.find(font=>font.name===fontData.currentFont);
if(selectedFont){updateFontFaces(selectedFont);}
applyColor();
updateClarityStyle();
GM_registerMenuCommand('🎨 打开字体设置',togglePanel);
GM_registerMenuCommand('🔄 切换悬浮球显示',()=>{
isFabVisible=!isFabVisible;
fab.style.display=isFabVisible?'block':'none';
GM_setValue('fabVisible',isFabVisible);});
// 初始化编辑模式菜单
GM_registerMenuCommand('✏️ 进入编辑模式', toggleEditMode);};

if(document.readyState==='loading'){
document.addEventListener('DOMContentLoaded',main);
}else{main();}
})();