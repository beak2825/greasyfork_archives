// ==UserScript==
// @name         sis001-预览
// @version      1.3.6
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  sis001第一会所综合社区，帖子图片预览，板块收纳，搜索优化
// @match        https://sis001.com/*
// @match        https://*.sis001.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sis001.com
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539804/sis001-%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/539804/sis001-%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function(){"use strict";const e={ACCENT:"#00599F",BORDER_LIGHT:"#e3e6ea",TEXT_PRIMARY:"#2c3e50",TEXT_SECONDARY:"#666",TEXT_LIGHT:"#999",
TEXT_ERROR:"#333"},t={SM:"6px",ROUND:"50%",PILL:"999px"},n={LIGHT:"0 2px 6px rgba(0,0,0,0.08)"},i={select(e){return document.querySelector(e)},
selectAll(e){return document.querySelectorAll(e)},create(e,t={},n={}){const i=document.createElement(e);return Object.entries(t).forEach(([e,t])=>{
i.setAttribute(e,t)}),Object.entries(n).forEach(([e,t])=>{i.style[e]=t}),i},addStyle(e,t){const n=document.createElement("style");return t&&(n.id=t),
n.textContent=e,document.head.appendChild(n),n}};async function a(e,t,n=8){const i=[...e],a=new Set,r=[];async function o(){if(0===i.length)return
;const e=i.shift(),s=t(e).then(e=>{r.push(e)}).finally(()=>{a.delete(s)});return a.add(s),a.size>=n&&await Promise.race(Array.from(a)),o()}
return await o(),await Promise.all(Array.from(a)),r}const r={resolve(e,t){try{return new URL(t,e).href}catch(n){return void 0,t}},isHttp(e){
return/^https?:\/\//i.test(e)}},o={applyButtonStyle(t,options={}){
const{primary:n=!1}=options,i=["display:inline-flex","align-items:center","justify-content:center","height:28px","padding:0 12px","border-radius:6px","font-size:12px","line-height:1","cursor:pointer","user-select:none","white-space:nowrap","box-sizing:border-box"],a=n?`background:${e.ACCENT};color:#fff;border:1px solid ${e.ACCENT}`:`background:#fff;color:${e.TEXT_PRIMARY};border:1px solid ${e.BORDER_LIGHT}`
;t.style.cssText=[...i,a].join(";")},ensureToggleStyles(){if(document.querySelector('style[data-sis-toggle-style="1"]'))return
;const a=`.sis-toggle{display:inline-flex;align-items:center;gap:${t.SM};cursor:pointer;user-select:none;height:28px;padding:0 12px;border:1px solid ${e.BORDER_LIGHT};border-radius:${t.SM};background:#fff;box-shadow:${n.LIGHT};vertical-align:middle;box-sizing:border-box}.sis-toggle .sis-input{position:absolute;opacity:0;width:0;height:0}.sis-toggle .sis-switch{position:relative;width:30px;height:16px;background:#e5e7eb;border-radius:${t.PILL};box-shadow:inset 0 0 0 1px #d1d5db;flex:0 0 30px}.sis-toggle .sis-switch::before{content:"";position:absolute;top:2px;left:2px;width:12px;height:12px;background:#fff;border-radius:${t.ROUND};box-shadow:0 1px 2px rgba(0,0,0,.2)}.sis-toggle .sis-input:checked + .sis-text + .sis-switch{background:${e.ACCENT}}.sis-toggle .sis-input:checked + .sis-text + .sis-switch::before{transform:translateX(14px)}.sis-toggle .sis-text{color:${e.TEXT_ERROR};font-size:12px}`
;i.addStyle(a,"sis-toggle-styles").setAttribute("data-sis-toggle-style","1")}},s={createOverlay(){return i.create("div",{},{position:"fixed",
inset:"0",background:"rgba(0,0,0,0.4)",zIndex:"10001",display:"flex",alignItems:"center",justifyContent:"center"})},createPanel(e="480px"){
return i.create("div",{},{width:e,maxWidth:"92vw",maxHeight:"80vh",overflow:"auto",background:"#fff",borderRadius:"10px",
boxShadow:"0 10px 30px rgba(0,0,0,.2)"})},createHeader(e,t){const n=i.create("div",{},{padding:"12px 16px",borderBottom:"1px solid #e9ecef",
fontWeight:"600",display:"flex",justifyContent:"space-between",alignItems:"center"});n.textContent=e;const a=i.create("button")
;return a.textContent="×",o.applyButtonStyle(a),a.onclick=t,n.appendChild(a),n},createFooter(e,t,n="保存并刷新"){const a=i.create("div",{},{
padding:"12px 16px",borderTop:"1px solid #e9ecef",display:"flex",justifyContent:"flex-end",gap:"10px"}),r=i.create("button");r.textContent="取消",
o.applyButtonStyle(r),r.onclick=e;const s=i.create("button");return s.textContent=n,o.applyButtonStyle(s),s.onclick=t,a.appendChild(r),
a.appendChild(s),a}},c={waitForDOMContentLoaded(){return"loading"===document.readyState?new Promise(e=>{
document.addEventListener("DOMContentLoaded",()=>e(),{once:!0})}):Promise.resolve()},waitForWindowLoad(){
return"complete"!==document.readyState?new Promise(e=>{window.addEventListener("load",()=>e(),{once:!0})}):Promise.resolve()}},l=class{static init(){
this.setupMagnetLinks()}static setupMagnetLinks(){i.select(".t_msgfont")&&i.selectAll(".t_msgfont").forEach(e=>{this.processPost(e)})}
static processPost(e){if(this.processed.has(e))return;const t=/([a-fA-F0-9]{40})/g
;t.test(e.innerHTML)&&(e.innerHTML=e.innerHTML.replace(t,e=>`magnet:?xt=urn:btih:${e}`)),this.processed.add(e)}static refresh(){
this.setupMagnetLinks()}};l.processed=new WeakSet;let d=l;class AdRemover{static init(){this.injectHidingCSS(),this.removeRulesTable(),
this.removePublicMessages(),this.removeStickyTopics(),this.removeImportantTopics(),this.removeAdministrativeThreads(),setTimeout(()=>{
this.removeRulesTable(),this.removePublicMessages(),this.removeStickyTopics(),this.removeImportantTopics(),this.removeAdministrativeThreads()},1e3)}
static injectHidingCSS(){if(i.select('style[data-sis-ad-remover="1"]'))return
;const e='\n      /* 立即隐藏本版规则表格 */\n      table[summary="Rules and Recommend"] { display: none !important; }\n      \n      /* 立即隐藏公共消息 */\n      .maintable#pmprompt,\n      .box#pmprompt { display: none !important; }\n      \n      /* 立即隐藏固定主题和重要主题区块 */\n      thead.separation { display: none !important; }\n      tbody[id^="stickthread_"] { display: none !important; }\n      \n      /* 立即隐藏版务相关帖子（备用CSS） */\n      .sis-hide-admin { display: none !important; }\n    '
;i.addStyle(e).setAttribute("data-sis-ad-remover","1")}static removeRulesTable(){
const e=document.querySelector('table[summary="Rules and Recommend"]');e&&e.remove()}static removePublicMessages(){
const e=document.querySelector(".maintable#pmprompt");e&&e.remove();const t=document.querySelector(".box#pmprompt");t&&t.remove()}
static removeTopicsByType(e){document.querySelectorAll("thead.separation").forEach(t=>{const n=t.querySelectorAll("font");let i=!1;if(n.forEach(t=>{
e.some(e=>t.textContent?.includes(e))&&(i=!0)}),i){t.remove();let e=t.nextElementSibling
;for(;e&&"TBODY"===e.tagName&&e.id&&e.id.startsWith("stickthread_");){const t=e;e=e.nextElementSibling,t.remove()}}})}static removeStickyTopics(){
this.removeTopicsByType(["固定主題"])}static removeImportantTopics(){this.removeTopicsByType(["重要主題"])}static removeAdministrativeThreads(){
document.querySelectorAll('tbody[id^="stickthread_"], tbody[id^="normalthread_"]').forEach(e=>{
e.querySelectorAll('em a[href*="typeid=528"]').length>0&&(e.classList.add("sis-hide-admin"),setTimeout(()=>{e.remove()},10))})}static refresh(){
this.removeRulesTable(),this.removePublicMessages(),this.removeStickyTopics(),this.removeImportantTopics(),this.removeAdministrativeThreads()}}
class PostLayoutManager{static async transformPostLayout(e,t){if(e.querySelector(".sis-preview-row"))return;const n=e.querySelector("tr");if(!n)return
;let a=0;n.querySelectorAll("th, td").forEach(e=>{const t=parseInt(e.getAttribute("colspan")||"1");a+=t});const r=i.create("tr",{
class:"sis-preview-row"}),o=i.create("td",{colspan:String(a)});o.style.cssText="padding: 15px 20px; background: #fafafa;"
;const s=this.createImageSection();o.appendChild(s),r.appendChild(o),e.appendChild(r),await t(s)}static createImageSection(){
const e=i.create("div",{},{minHeight:"40px"}),t=i.create("div",{},{color:"#999",fontSize:"13px"});return t.textContent="正在加载图片预览...",e.appendChild(t),
e}}class Storage{static get(e,t=null){try{const n=GM_getValue(e);if(null==n)return t;try{return JSON.parse(n)}catch{return n}}catch(n){return void 0,t
}}static set(e,t){try{const n=JSON.stringify(t);return GM_setValue(e,n),!0}catch(n){return void 0,!1}}static delete(e){try{return GM_deleteValue(e),!0
}catch(t){return void 0,!1}}static listKeys(){try{return GM_listValues()}catch(e){return void 0,[]}}static migrateFromLocalStorage(e,t=!0){try{
const n=localStorage.getItem(e);if(null!==n){try{const t=JSON.parse(n);this.set(e,t)}catch{GM_setValue(e,n)}return t&&localStorage.removeItem(e),!0}
return!1}catch(n){return void 0,!1}}}const p={collectNames:"sis_board_collect_names",favoriteNames:"sis_board_favorite_names",
collectionOpen:"sis_board_collection_open",favoriteOpen:"sis_board_favorite_open",searchFavForums:"sis_search_fav_forums",
searchLastSelection:"sis_search_last_selection",searchFavAuto:"sis_search_fav_auto",previewMaxImages:"sis_preview_max_images"},h={
MAX_IMAGES_PER_POST:4};class Config{static getMaxImagesPerPost(){return h.MAX_IMAGES_PER_POST}static getCollectedBoardNames(){try{
const e=Storage.get(p.collectNames,"");if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)?t:[]}catch(e){return void 0,[]}}
static setCollectedBoardNames(e){try{Storage.set(p.collectNames,JSON.stringify(e||[]))}catch(t){void 0}}static getFavoriteBoardNames(){try{
const e=Storage.get(p.favoriteNames,"");if(!e)return[];const t=JSON.parse(e);return Array.isArray(t)?t:[]}catch(e){return void 0,[]}}
static setFavoriteBoardNames(e){try{Storage.set(p.favoriteNames,JSON.stringify(e||[]))}catch(t){void 0}}static getCollectionOpen(){try{
return"1"===(Storage.get(p.collectionOpen,"0")??"0")}catch(e){return void 0,!1}}static setCollectionOpen(e){try{
Storage.set(p.collectionOpen,e?"1":"0")}catch(t){void 0}}static getFavoriteOpen(){try{return"1"===(Storage.get(p.favoriteOpen,"0")??"0")}catch(e){
return void 0,!1}}static setFavoriteOpen(e){try{Storage.set(p.favoriteOpen,e?"1":"0")}catch(t){void 0}}static getSearchFavForums(){try{
const e=Storage.get(p.searchFavForums,"");return e?JSON.parse(e):[]}catch(e){return void 0,[]}}static setSearchFavForums(e){try{
Storage.set(p.searchFavForums,JSON.stringify(e||[]))}catch(t){void 0}}static getSearchFavAuto(){try{
return"1"===(Storage.get(p.searchFavAuto,"0")??"0")}catch(e){return void 0,!1}}static setSearchFavAuto(e){try{Storage.set(p.searchFavAuto,e?"1":"0")
}catch(t){void 0}}static getSearchLastSelection(){try{const e=Storage.get(p.searchLastSelection,"");return e?JSON.parse(e):[]}catch(e){return void 0,
[]}}static setSearchLastSelection(e){try{Storage.set(p.searchLastSelection,JSON.stringify(e||[]))}catch(t){void 0}}}class ImageExtractor{
static extractAndGroupImages(e){const t=e.querySelector(".t_msgfont")||e.querySelector(".postmessage");if(!t)return{images:[],domainGroups:new Map}
;const n=t.cloneNode(!0);this.cleanContentClone(n)
;const i=Array.from(n.querySelectorAll("img")),a=i.filter(e=>this.isValidContentImage(e)),r=this.groupImagesByDomain(a);this.applyImageLimits(r)
;const o=Array.from(r.keys()),s=o[0]||"",c=r.get(s)||[];return this.logExtractionResults(c,i,o),{images:c,domainGroups:r}}static cleanContentClone(e){
e.querySelectorAll(".quote").forEach(e=>e.remove()),e.querySelectorAll(".ad_pip, .ad_thread3_0, .ad_thread4_0").forEach(e=>e.remove()),
e.querySelectorAll(".postratings, .comment_digg").forEach(e=>e.remove())}static isValidContentImage(e){
const t=e.getAttribute("onclick")||"",n=e.getAttribute("onload")||"",i=e.getAttribute("src")||e.src||""
;if(!i||i.length<=10||i.includes("data:"))return!1;if(!/\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(i))return!1
;if(i.includes("images/green001/")||i.includes("images/attachicons/")||i.includes("images/joinvip.gif")||i.includes("/ad_")||i.includes("advertisement"))return!1
;if(i.includes("images/smilies/")&&this.isSmallImage(e))return!1
;if(i.includes("images/common/")&&(i.match(/\/(she|mengmengda|yang|\d{5}SIS\d+)\.gif$/)||this.isSmallImage(e)))return!1
;if(i.includes("attachments/month_1605/20160525_dcf868ad")&&i.includes(".gif"))return!1;const a=t.includes("zoom(this"),r=n.includes("attachimg(this")
;return a&&r}static groupImagesByDomain(e){const t=new Map;return e.forEach(e=>{const n=this.getImageSource(e),i=this.extractDomain(n)
;t.has(i)||t.set(i,[]),t.get(i).push(e)}),t}static applyImageLimits(e){const t=Config.getMaxImagesPerPost();Array.from(e.keys()).forEach(n=>{
const i=e.get(n)||[];e.set(n,i.slice(0,t))})}static logExtractionResults(e,t,n){e.length>0?void 0:t.length>5&&(void 0,
("localhost"===window.location.hostname||window.location.hostname.includes("dev"))&&t.slice(0,3).forEach((e,t)=>{e.getAttribute("src")||e.src,
e.getAttribute("onclick"),e.getAttribute("onload")}))}static isSmallImage(e){const t=e.getAttribute("width"),n=e.getAttribute("height");if(t||n){
const e=parseInt(t||"0",10),i=parseInt(n||"0",10);if(e>0&&e<=100||i>0&&i<=100)return!0}const i=e.style;if(i.width||i.height){
const e=parseInt(i.width,10),t=parseInt(i.height,10);if(e>0&&e<=100||t>0&&t<=100)return!0}
if(e.naturalWidth>0&&e.naturalHeight>0&&(e.naturalWidth<=100||e.naturalHeight<=100))return!0;const a=e.getAttribute("src")||""
;return[/\/meemo\d{3}\.gif$/i,/\/\w{2,6}\.gif$/i,/\/emoji_\w+\.gif$/i,/\/smiley_\w+\.gif$/i].some(e=>e.test(a))}static extractDomain(e){try{
return new URL(e).hostname}catch{return"unknown"}}static getImageSource(e){return e.getAttribute("src")||e.src||""}}const g=class{static get(e){
const t=this.cache.get(e);return t?Date.now()-t.timestamp>this.maxAge?(this.cache.delete(e),null):t:null}static set(e,t,n){
if(this.cache.size>=this.maxSize){const e=this.cache.keys().next().value;e&&this.cache.delete(e)}this.cache.set(e,{urls:t,domainGroups:n,
timestamp:Date.now(),extractedCount:t.length})}static cleanup(){const e=Date.now(),t=[];this.cache.forEach((n,i)=>{
e-n.timestamp>this.maxAge&&t.push(i)}),t.forEach(e=>this.cache.delete(e)),t.length>0}static getStats(){return{size:this.cache.size,
maxSize:this.maxSize}}static clear(){this.cache.clear()}};g.cache=new Map,g.maxSize=800,g.maxAge=72e5;let u=g;class ImageLoader{
static async loadImagesForPost(e,t,n,i=0){const a=2,o=u.get(e);if(o&&0===i)return void 0,t.innerHTML="",
0===o.urls.length?(this.showSimpleNoImageMessage(t),void 0):(n&&n(o.urls,o.domainGroups),void 0);try{const i=await fetch(e)
;if(!i.ok)throw new Error(`请求失败，状态码: ${i.status}`);const a=await i.text();if(a.includes("<b>Parse error</b>"))throw new Error("服务器返回PHP解析错误")
;const o=(new DOMParser).parseFromString(a,"text/html"),{images:s,domainGroups:c}=ImageExtractor.extractAndGroupImages(o);if(t.innerHTML="",
0===s.length)return this.showSimpleNoImageMessage(t),u.set(e,[],new Map),void 0;const l=s.map(t=>r.resolve(e,ImageExtractor.getImageSource(t)))
;return u.set(e,l,c),n&&n(l,c),void 0}catch(s){const r=s instanceof Error?s.message:"未知错误";0===i||r.includes("Parse error")||r.includes("500"),0
;const o=i<a,c=0===i?"重试":`重试 (${i}/${a})`;return this.showStaticFailureMessage(t,r.includes("403")||r.includes("权限")?"访问受限":"加载失败",o?()=>{
setTimeout(()=>{this.loadImagesForPost(e,t,n,i+1)},Math.min(1e3+1e3*i,3e3))}:void 0,c),void 0}}static showStaticFailureMessage(t,n,a,r="重试"){
t.innerHTML="",
t.style.cssText="\n      padding: 8px 20px;\n      background: transparent;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      height: auto;\n      min-height: 30px;\n      max-height: 30px;\n      gap: 10px;\n    "
;const o=i.create("div",{},{color:e.TEXT_LIGHT,fontSize:"13px",fontStyle:"italic",lineHeight:"1.2"});if(o.textContent=n,t.appendChild(o),a){
const n=i.create("button")
;n.textContent=r,n.style.cssText=`\n        padding: 2px 8px;\n        font-size: 11px;\n        margin-left: 8px;\n        cursor: pointer;\n        border: 1px solid ${e.TEXT_LIGHT};\n        background: transparent;\n        border-radius: 3px;\n        color: ${e.TEXT_LIGHT};\n      `,
n.onclick=e=>{e.stopPropagation(),a()},t.appendChild(n)}}static showSimpleNoImageMessage(t){t.innerHTML="",
t.style.cssText="\n      padding: 8px 20px;\n      background: transparent;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      height: auto;\n      min-height: 30px;\n      max-height: 30px;\n    "
;const n=i.create("div",{},{color:e.TEXT_LIGHT,fontSize:"13px",fontStyle:"italic",textAlign:"center",lineHeight:"1.2"});n.textContent="帖子内无图片内容",
t.appendChild(n)}}const m=class{static init(){this.overlay||(this.overlay=document.createElement("div"),
this.overlay.style.cssText="\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background: rgba(0, 0, 0, 0.95);\n      z-index: 999999;\n      display: none;\n      align-items: center;\n      justify-content: center;\n    ",
this.img=document.createElement("img"),
this.img.style.cssText="\n      max-width: 85%;\n      max-height: 85%;\n      object-fit: contain;\n      border-radius: 4px;\n    ",
this.counter=document.createElement("div"),
this.counter.style.cssText="\n      position: absolute;\n      top: 20px;\n      left: 50%;\n      transform: translateX(-50%);\n      color: white;\n      background: rgba(0, 0, 0, 0.6);\n      padding: 8px 16px;\n      border-radius: 20px;\n      font-size: 14px;\n    ",
this.prevBtn=this.createNavButton("‹","left"),this.nextBtn=this.createNavButton("›","right"),this.overlay.appendChild(this.img),
this.overlay.appendChild(this.counter),this.overlay.appendChild(this.prevBtn),this.overlay.appendChild(this.nextBtn),
document.body.appendChild(this.overlay),this.setupEvents())}static createNavButton(e,t){const n=document.createElement("button")
;return n.innerHTML="‹"===e?'<svg viewBox="0 0 24 24" fill="white" width="30" height="30"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>':'<svg viewBox="0 0 24 24" fill="white" width="30" height="30"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>',
n.style.cssText=`\n      position: fixed;\n      ${t}: 16px;\n      top: 50%;\n      transform: translateY(-50%);\n      width: 40px;\n      height: 40px;\n      background: rgba(255, 255, 255, 0.2);\n      border-radius: 50%;\n      border: none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: white;\n      cursor: pointer;\n      user-select: none;\n      z-index: 10002;\n    `,
n}static setupEvents(){this.overlay.onclick=e=>{e.target===this.overlay&&this.close()},this.prevBtn.onclick=e=>{e.stopPropagation(),this.prev()},
this.nextBtn.onclick=e=>{e.stopPropagation(),this.next()},document.addEventListener("keydown",e=>{
"flex"===this.overlay?.style.display&&("Escape"===e.key?this.close():"ArrowLeft"===e.key?this.prev():"ArrowRight"===e.key&&this.next())})}
static show(e,t=0){this.init(),this.images=e,this.currentIndex=t,this.updateImage(),this.overlay.style.display="flex"}static close(){
this.overlay&&(this.overlay.style.display="none")}static prev(){this.currentIndex=(this.currentIndex-1+this.images.length)%this.images.length,
this.updateImage()}static next(){this.currentIndex=(this.currentIndex+1)%this.images.length,this.updateImage()}static updateImage(){
const e=this.images[this.currentIndex];this.img.style.display="none",this.img.src="",
this.counter.textContent=`${this.currentIndex+1} / ${this.images.length}`,this.images.length<=1?(this.prevBtn.style.display="none",
this.nextBtn.style.display="none",this.counter.style.display="none"):(this.prevBtn.style.display="flex",this.nextBtn.style.display="flex",
this.counter.style.display="block"),this.img.onload=()=>{this.img.style.display="block"},this.img.onerror=()=>{this.img.alt="图片加载失败"},this.img.src=e}}
;m.overlay=null,m.img=null,m.counter=null,m.prevBtn=null,m.nextBtn=null,m.images=[],m.currentIndex=0;let f=m;class ImageRenderer{
static renderImages(e,t,n,i,a=0){e.innerHTML="";const o=Array.from(i.keys());if(0===o.length||0===t.length)return this.showGlobalFailure(e),void 0
;if(a>=o.length)return void 0,this.showGlobalFailure(e),void 0;const s=o[a],c=i.get(s)||[];if(0===c.length)return this.showGlobalFailure(e),void 0
;const l=c.map(e=>r.resolve(n,ImageExtractor.getImageSource(e)));void 0;const d=document.createElement("div")
;d.style.cssText="\n      display: flex !important;\n      gap: 12px !important;\n      width: 100% !important;\n    ";let p=0,h=0;const g=l.length
;l.forEach((s,c)=>{const l=document.createElement("div")
;l.style.cssText="\n        flex: 1 !important;\n        min-width: 0 !important;\n        height: 200px !important;\n        background: #f5f5f5 !important;\n        border-radius: 4px !important;\n        overflow: hidden !important;\n        cursor: pointer !important;\n        display: flex !important;\n        align-items: center !important;\n        justify-content: center !important;\n      "
;const u=document.createElement("img")
;u.src=s,u.style.cssText="\n        max-width: 100% !important;\n        max-height: 100% !important;\n        width: auto !important;\n        height: auto !important;\n        object-fit: contain !important;\n        display: block !important;\n      ",
u.onload=()=>{h++},u.onerror=()=>{p++,p+h===g&&(p>g/2&&a<o.length-1?(void 0,setTimeout(()=>{this.renderImages(e,t,n,i,a+1)
},500)):p===g&&a<o.length-1&&(void 0,this.renderImages(e,t,n,i,a+1)))},l.onclick=e=>{e.preventDefault(),e.stopPropagation()
;const i=t.map(e=>r.resolve(n||location.href,e));f.show(i,c)},l.appendChild(u),d.appendChild(l)}),e.appendChild(d)}static showGlobalFailure(t){
t.innerHTML="",
t.style.cssText="\n      padding: 8px 20px;\n      background: transparent;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      height: auto;\n      min-height: 30px;\n      max-height: 30px;\n    "
;const n=i.create("div",{},{fontSize:"12px",color:e.TEXT_SECONDARY,textAlign:"center",fontStyle:"italic"});n.textContent="帖子内可能无图",t.appendChild(n)}}
class ImagePreview{static async init(){await this.displayThreadImages()}static async displayThreadImages(){
if(i.select(".postmessage")||i.select("#postlist")||i.select(".plhin")||i.select(".t_msgfont"))return
;const e=window.location.href.includes("/search.php"),t=window.location.href.includes("/tag.php");let n=[];if(e||t){const e=i.selectAll("tbody")
;n=Array.from(e).filter(e=>{const t=e.querySelector('a[href*="thread-"], a[href*="viewthread.php"]'),n=e.querySelector(".icon");return t&&n})}else{
const e=i.selectAll('tbody[id^="normalthread_"]');n=Array.from(e)}
const r=n.filter(e=>(!e.id||!e.id.startsWith("stickthread_"))&&(!e.querySelector(".new-post-layout")&&!!e.querySelector('a[href*="thread-"], a[href*="viewthread.php"]')))
;await a(r,async e=>{const t=e.querySelector('a[href*="thread-"], a[href*="viewthread.php"]');if(!t)return;const n=t.href
;let i=t.textContent?.trim()||"";if(!i){const t=e.querySelector('span[id^="thread_"]');t&&(i=t.textContent?.trim()||"")}
await PostLayoutManager.transformPostLayout(e,async e=>{await ImageLoader.loadImagesForPost(n,e,(t,i)=>{ImageRenderer.renderImages(e,t,n,i)})})},15)}}
class BoardManager{static init(){this.normalizeExclusiveLists(),this.setupBoardCollectionCollapse(),this.setupBoardFavoriteSection()}
static normalizeExclusiveLists(){const e=new Set(Config.getFavoriteBoardNames()),t=new Set(Config.getCollectedBoardNames());let n=!1;e.forEach(e=>{
t.has(e)&&(t.delete(e),n=!0)}),n&&Config.setCollectedBoardNames(Array.from(t))}static findBoardElementsMap(){const e=new Map
;return i.selectAll("div.mainbox.forumlist").forEach(t=>{const n=t.querySelector("h3 > a"),i=n?.textContent?.trim()||"";i&&!e.has(i)&&e.set(i,t)}),e}
static moveBoardsToContainer(e,t){const n=this.findBoardElementsMap(),i=[];return e.forEach(e=>{const a=n.get(e);a&&(t.appendChild(a),i.push(e))}),i}
static setupBoardCollectionCollapse(){this.setupBoardSection({containerId:"board-collection-container",title:"板块收纳区",
getBoardNames:()=>Config.getCollectedBoardNames(),getOpenState:()=>Config.getCollectionOpen(),setOpenState:e=>Config.setCollectionOpen(e),
onSettings:()=>this.openBoardCollectSettings(),insertMethod:e=>this.insertContainer(e),emptyMessage:'未选择任何板块，可点击右侧"设置"进行选择。'})}
static setupBoardFavoriteSection(){this.setupBoardSection({containerId:"board-favorite-container",title:"板块收藏区",
getBoardNames:()=>Config.getFavoriteBoardNames(),getOpenState:()=>Config.getFavoriteOpen(),setOpenState:e=>Config.setFavoriteOpen(e),
onSettings:()=>this.openBoardFavoriteSettings(),insertMethod:e=>this.insertFavoriteContainer(e),emptyMessage:'未选择任何收藏板块，可点击右侧"设置"进行选择。'})}
static setupBoardSection(config){if(i.select(`#${config.containerId}`))return
;const e=new Set(config.getBoardNames()),t=Array.from(i.selectAll("div.mainbox.forumlist"));if(0===t.length)return;const n=t.filter(t=>{
const n=t.querySelector("h3 > a"),i=n?.textContent?.trim()||"";return i&&e.has(i)
}),a=this.createBoardContainer(config.containerId,config.title,n.length),{content:r}=this.setupContainerElements(a,{isOpen:config.getOpenState(),
onToggle:config.setOpenState,onSettings:config.onSettings,title:config.title,count:n.length});if(config.insertMethod(a),
0===n.length)this.showEmptyMessage(r,config.emptyMessage);else{const e=n.map(e=>{const t=e.querySelector("h3 > a");return t?.textContent?.trim()||""})
;this.moveBoardsToContainer(e,r)}}static createBoardContainer(e,t,n){return i.create("div",{id:e},{margin:"12px 0",border:"1px solid #e3e6ea",
borderRadius:"10px",boxShadow:"0 3px 12px rgba(0,0,0,0.08)",overflow:"hidden",background:"#fff"})}static setupContainerElements(e,options){
const t=i.create("div",{},{padding:"10px 14px",background:options.isOpen?"#f0f0f0":"linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
border:options.isOpen?"2px solid #d0d0d0":"none",borderBottom:"1px solid #e9ecef",cursor:"pointer",userSelect:"none",display:"flex",
alignItems:"center",justifyContent:"space-between"}),n=i.create("span",{},{fontWeight:"600",color:"#2c3e50",fontSize:"14px"})
;n.textContent=`${options.title}（共 ${options.count} 个）`;const a=i.create("span",{},{fontSize:"12px",color:"#666"})
;a.textContent=options.isOpen?"[点击收起]":"[点击展开]";const r=i.create("button");r.textContent="设置",r.title="选择需要管理的板块",o.applyButtonStyle(r),
r.addEventListener("click",e=>{e.stopPropagation(),options.onSettings()});const s=i.create("div",{},{display:"flex",alignItems:"center",gap:"10px"})
;s.appendChild(a),s.appendChild(r),t.appendChild(n),t.appendChild(s);const c=i.create("div",{},{padding:"10px",background:"#fafafa",
border:"2px solid #d0d0d0",borderTop:"none",display:options.isOpen?"":"none"});return t.addEventListener("click",()=>{const e="none"===c.style.display
;c.style.display=e?"":"none",a.textContent=e?"[点击收起]":"[点击展开]",t.style.background=e?"#f0f0f0":"linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
t.style.border=e?"2px solid #d0d0d0":"none",t.style.borderBottom="1px solid #e9ecef",options.onToggle(e)}),e.appendChild(t),e.appendChild(c),{
header:t,content:c,toggleHint:a}}static insertContainer(e){
const t=i.select('table.portalbox[summary="HeadBox"]')||i.select("#hottags")?.closest("table")||i.select("#hottags");if(t?.parentNode){
const n=t.parentNode;t.nextSibling?n.insertBefore(e,t.nextSibling):n.appendChild(e)}else document.body.appendChild(e)}
static insertFavoriteContainer(e){const t=i.select("#board-collection-container");if(t?.parentNode){const n=t.parentNode
;t.nextSibling?n.insertBefore(e,t.nextSibling):n.appendChild(e)}else this.insertContainer(e)}static showEmptyMessage(e,t){const n=i.create("div",{},{
color:"#666",fontSize:"12px"});n.textContent=t,e.appendChild(n)}static openBoardCollectSettings(){const e=this.getAllBoardNames()
;this.openBoardSettings(e,Config.getCollectedBoardNames(),"板块收纳设置","勾选需要收纳到顶部的板块：",e=>{const t=new Set(Config.getFavoriteBoardNames())
;e.forEach(e=>t.delete(e)),Config.setFavoriteBoardNames(Array.from(t)),Config.setCollectedBoardNames(e),location.reload()})}
static openBoardFavoriteSettings(){const e=this.getAllBoardNames()
;this.openBoardSettings(e,Config.getFavoriteBoardNames(),"板块收藏设置",'勾选需要加入"板块收藏区"的板块：',e=>{const t=new Set(Config.getCollectedBoardNames())
;e.forEach(e=>t.delete(e)),Config.setCollectedBoardNames(Array.from(t)),Config.setFavoriteBoardNames(e),location.reload()})}static getAllBoardNames(){
const e=Array.from(i.selectAll("div.mainbox.forumlist > h3 > a")).map(e=>e.textContent?.trim()||"").filter(Boolean);return Array.from(new Set(e))}
static openBoardSettings(e,t,n,a,r){const o=s.createOverlay(),c=s.createPanel("520px"),l=s.createHeader(n,()=>o.remove()),d=i.create("div",{},{
padding:"12px 16px"}),p=i.create("div",{},{color:"#666",marginBottom:"8px"});p.textContent=a,d.appendChild(p);const h=i.create("div",{},{
display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}),g=new Set(t);e.forEach(e=>{const t=i.create("label",{},{display:"flex",alignItems:"center",
gap:"6px",padding:"6px",border:"1px solid #eee",borderRadius:"6px"}),n=i.create("input",{type:"checkbox"});n.checked=g.has(e),n.onchange=()=>{
n.checked?g.add(e):g.delete(e)};const a=i.create("span");a.textContent=e,t.appendChild(n),t.appendChild(a),h.appendChild(t)}),d.appendChild(h)
;const u=s.createFooter(()=>o.remove(),()=>r(Array.from(g)));c.appendChild(l),c.appendChild(d),c.appendChild(u),o.appendChild(c),
document.body.appendChild(o)}}class SearchOptimizer{static init(){this.setupSearchFavorites()}static setupSearchFavorites(){
if(!/\/search\.php(\?|$)/.test(location.pathname+location.search))return;const e=i.select("#srchfid")
;e&&"SELECT"===e.tagName&&e.multiple&&(this.createSearchTools(e),this.setupTopGrouping(e),this.setupAutoRemember(e))}static createSearchTools(e){
const t=i.create("div",{},{margin:"6px 0",display:"flex",gap:"12px",alignItems:"center"}),n=i.create("button",{type:"button"},{height:"30px"})
;n.textContent="置顶设置",o.applyButtonStyle(n),n.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),this.openSearchFavSettings(e)}),
o.ensureToggleStyles();const{switchWrap:a}=this.createToggleSwitch();t.appendChild(n),t.appendChild(a),e.parentNode?.insertBefore(t,e)}
static createToggleSwitch(){const e=i.create("label",{class:"sis-toggle"}),t=i.create("input",{type:"checkbox",class:"sis-input"})
;t.checked=Config.getSearchFavAuto();const n=i.create("span",{class:"sis-text"});n.textContent="多选记忆";const a=i.create("span",{class:"sis-switch"})
;return e.appendChild(t),e.appendChild(n),e.appendChild(a),t.addEventListener("change",()=>{if(Config.setSearchFavAuto(t.checked),t.checked){
const e=i.select("#srchfid");if(e){const t=Array.from(e.selectedOptions).map(e=>e.value).filter(Boolean);t.length>0&&Config.setSearchLastSelection(t)}
}}),{switchWrap:e,switchInput:t}}static setupTopGrouping(e){const t=Config.getSearchFavForums();if(0===t.length)return;const n=i.create("optgroup",{
label:"常用置顶"});e.insertBefore(n,e.firstChild);const options=Array.from(e.querySelectorAll("option"));t.forEach(e=>{
const t=options.find(t=>t.value===e);t&&n.appendChild(t)})}static setupAutoRemember(e){if(!Config.getSearchFavAuto())return
;const t=Config.getSearchLastSelection();t.length>0&&Array.from(e.options).forEach(e=>{e.selected=t.includes(e.value)}),
e.addEventListener("change",()=>{const t=Array.from(e.selectedOptions).map(e=>e.value).filter(Boolean);Config.setSearchLastSelection(t)})}
static openSearchFavSettings(e){
const t=Array.from(e.querySelectorAll("option")).filter(e=>e.value),n=s.createOverlay(),i=s.createPanel("1100px"),a=s.createHeader("置顶设置",()=>n.remove()),{body:r,favSet:o}=this.createPanelBody(e,t),c=s.createFooter(()=>n.remove(),()=>{
Config.setSearchFavForums(Array.from(o)),location.reload()});i.appendChild(a),i.appendChild(r),i.appendChild(c),n.appendChild(i),
document.body.appendChild(n)}static createPanelBody(e,t){const n=i.create("div",{},{padding:"12px 16px",display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:"12px"}),a=new Set(Config.getSearchFavForums())
;return this.organizeOptions(e,t).forEach(e=>{const t=this.createGroupCard(e,a);n.appendChild(t)}),{body:n,favSet:a}}static organizeOptions(e,t){
const n=[];Array.from(e.querySelectorAll("optgroup")).forEach(e=>{const options=Array.from(e.querySelectorAll("option")).filter(e=>e.value)
;options.length>0&&n.push({label:e.label||"分组",options:options})})
;const i=Array.from(e.children).filter(e=>"OPTION"===e.tagName&&e.value&&"all"!==e.value);return i.length>0&&n.unshift({label:"其他",options:i}),n}
static createGroupCard(e,t){const n=i.create("div",{},{border:"1px solid #e9ecef",borderRadius:"8px",overflow:"hidden",background:"#fff"
}),a=i.create("div",{},{padding:"8px 10px",background:"#f8f9fa",borderBottom:"1px solid #e9ecef",fontWeight:"600",color:"#2c3e50",fontSize:"12px"})
;a.textContent=e.label;const r=i.create("div",{},{padding:"8px 10px",display:"flex",flexDirection:"column",gap:"6px"});return e.options.forEach(e=>{
const n=i.create("label",{},{display:"flex",alignItems:"center",gap:"6px",padding:"6px",border:"1px solid #eee",borderRadius:"6px"
}),a=i.create("input",{type:"checkbox"});a.checked=t.has(e.value),a.onchange=()=>{a.checked?t.add(e.value):t.delete(e.value)};const o=i.create("span")
;o.textContent=e.textContent?.trim()||"",n.appendChild(a),n.appendChild(o),r.appendChild(n)}),n.appendChild(a),n.appendChild(r),n}}async function y(){
try{x(),AdRemover.init(),"loading"===document.readyState&&await c.waitForDOMContentLoaded(),d.init(),await c.waitForWindowLoad(),
await ImagePreview.init(),BoardManager.init(),SearchOptimizer.init(),setInterval(()=>{u.cleanup()},3e5)}catch(e){void 0}}function x(){
const e=document.querySelectorAll("a");for(let t=0;t<e.length;t++){const n=e[t];if(n.textContent&&n.textContent.includes("电脑版")){
window.location.href=n.href;break}}}y()})();
