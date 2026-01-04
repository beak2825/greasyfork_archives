// ==UserScript==
// @name         就要宽屏
// @version      1.1.7
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  好色TV·九色·视频宽屏
// @match        https://hsex.tv/*
// @match        https://hsex.men/*
// @match        https://hsex.icu/*
// @match        https://*.jiuse.vip/*
// @match        https://91porny.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=91porny.com
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539510/%E5%B0%B1%E8%A6%81%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/539510/%E5%B0%B1%E8%A6%81%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function(){"use strict";var t,e,n;function i(){const t=location.hostname
;return t.includes("hsex")?"hsex":t.includes("91porny")||t.includes("jiuse")?"jiuse":null}async function o(){const t=i();if(!t)return void 0,void 0
;void 0;try{"hsex"===t?await Promise.resolve().then(()=>h):"jiuse"===t&&await Promise.resolve().then(()=>A)}catch(e){void 0}}o();const s={selectors:{
videoContainer:".videos_box",videoElement:".video-js",mainContainer:".container",videoCol:".col-md-8",sideCol:".col-md-4",
panelDefault:".panel-default"}};let a=((t=class{static init(){this.setWideScreenMode(),this.setupResizeListener()}static setWideScreenMode(){
const t=document.querySelector(s.selectors.videoContainer),e=document.querySelector(s.selectors.videoElement);(t||e)&&(this.applyVideoColClasses(),
this.applySideColClasses(),t&&!t.classList.contains("hsx-initialized")&&(t.classList.add("hsx-hidden-until-ready"),setTimeout(()=>{
t.classList.remove("hsx-hidden-until-ready"),t.classList.add("hsx-initialized")},100)),
e&&!e.classList.contains("vjs-fluid")&&e.classList.add("vjs-fluid"))}static applyVideoColClasses(){
const t=document.querySelector(s.selectors.videoCol);t&&(t.classList.remove("col-md-8"),t.classList.add("col-md-12"))}static applySideColClasses(){
const t=document.querySelector(s.selectors.sideCol);t&&(t.style.display="none")}static setupResizeListener(){
this.resizeHandlerAdded||(window.addEventListener("resize",()=>{this.setWideScreenMode()}),this.resizeHandlerAdded=!0)}}).resizeHandlerAdded=!1,t)
;function createElement(t,e,n){const i=document.createElement(t);return e&&Object.entries(e).forEach(([t,e])=>{
null!=e&&("style"===t&&"string"==typeof e?i.setAttribute("style",e):"style"===t&&"object"==typeof e?Object.assign(i.style,e):"className"===t&&"string"==typeof e||"class"===t&&"string"==typeof e?i.className=e:"function"==typeof e&&t.startsWith("on")?i[t]=e:"textContent"===t?i.textContent=e:"innerHTML"===t?i.innerHTML=e:"string"==typeof e||"number"==typeof e?i.setAttribute(t,String(e)):i[t]=e)
}),i}function r(t,e){if(e){const t=document.getElementById(e);if(t)return t}const n=document.createElement("style");return e&&(n.id=e),
n.textContent=t,document.head.appendChild(n),n}function d(t){const e=document.getElementById(t);return!(!e||"STYLE"!==e.tagName||(e.remove(),0))}
function l(t,e){Object.assign(t.style,e)}class LayoutReflow{static init(){this.reflowLayout()}static reflowLayout(){try{
const t=this.findLeftColumn(),e=this.findRightColumn();if(!t)return
;const n=document.querySelector(s.selectors.panelDefault)||document.querySelector(s.selectors.videoContainer)||t
;let i=document.querySelector(".hsx-two-col");i||(i=this.createTwoColumnLayout(n,t))
;const o=i.querySelector(".hsx-left"),a=i.querySelector(".hsx-right");this.handleRecommendedVideos(t,a),this.handleAuthorVideos(e,o)}catch(t){void 0}}
static findLeftColumn(){const t=document.querySelector(".videos");if(t){const e=t.closest(".col-md-8, .col-md-12");if(e)return e}
const e=document.querySelector(s.selectors.panelDefault);if(e){const t=e.closest(".col-md-8, .col-md-12");if(t)return t}
return document.querySelector(".col-md-8")||document.querySelector("#container .row > .col-md-12")}static findRightColumn(){
const t=document.querySelector(s.selectors.sideCol);if(t)return t
;const e=Array.from(document.querySelectorAll("h4")).find(t=>t.textContent&&-1!==t.textContent.indexOf("作者视频"))
;return e?e.closest(".col-md-4")||e.closest(".col-md-12"):null}static createTwoColumnLayout(t,e){this.injectTabStyles();const n=createElement("div",{
id:"hsx-tab-container",style:{display:"flex",gap:"10px",padding:"10px 0"}}),i=createElement("button",{className:"tab-btn active",textContent:"作者视频"
}),o=createElement("button",{className:"tab-btn",textContent:"推荐视频"});n.appendChild(i),n.appendChild(o);const s=document.createElement("div")
;s.className="hsx-two-col single-left";const a=document.createElement("div");a.className="hsx-left";const r=document.createElement("div")
;return r.className="hsx-right",s.appendChild(a),s.appendChild(r),t&&t.parentNode?(t.parentNode.insertBefore(n,t.nextSibling),
n.parentNode.insertBefore(s,n.nextSibling)):(e.appendChild(n),e.appendChild(s)),i.addEventListener("click",()=>{i.classList.add("active"),
o.classList.remove("active"),s.classList.add("single-left"),s.classList.remove("single-right")}),o.addEventListener("click",()=>{
o.classList.add("active"),i.classList.remove("active"),s.classList.add("single-right"),s.classList.remove("single-left")}),s}static injectTabStyles(){
if(document.getElementById("hsex-tab-styles"))return
;const t="\n      .tab-btn {\n        padding: 8px 16px;\n        background: #333;\n        color: #fff;\n        border: 1px solid #555;\n        border-radius: 4px;\n        cursor: pointer;\n        transition: all 0.3s;\n      }\n      .tab-btn:hover {\n        background: #444;\n      }\n      .tab-btn.active {\n        background: #007bff;\n        border-color: #007bff;\n      }\n    ",e=document.createElement("style")
;e.id="hsex-tab-styles",e.textContent=t,document.head.appendChild(e)}static handleRecommendedVideos(t,e){if(e&&0===e.childElementCount){
const n=Array.from(t.querySelectorAll("h4")).find(t=>t.textContent&&-1!==t.textContent.indexOf("推荐视频"));if(n){
let i=n.closest(".col-xs-12")||n.closest(".col-md-12")||n.parentElement
;for(i=i?i.nextElementSibling:null;i&&t.contains(i)&&(!i.classList||!i.classList.contains("hsx-two-col"));){const t=i.nextElementSibling
;if(i.querySelector&&i.querySelector(".thumbnail")){e.appendChild(i);const t=i.querySelector(".image");t&&(t.style.backgroundSize="cover",
t.style.backgroundPosition="center",t.style.minHeight="120px")}i=t}}}}static handleAuthorVideos(t,e){if(e&&0===e.childElementCount&&t){
const n=Array.from(t.querySelectorAll("h4")).find(t=>t.textContent&&-1!==t.textContent.indexOf("作者视频"));if(n){
let i=n.closest(".col-md-12")||n.closest(".col-xs-12")||t;for(i=i?i.nextElementSibling:null;i&&(t.contains(i)||i.closest(".col-md-4"));){
const t=i.nextElementSibling;if(i.querySelector&&i.querySelector(".thumbnail")){e.appendChild(i);const t=i.querySelector(".image")
;t&&(t.style.backgroundSize="cover",t.style.backgroundPosition="center",t.style.minHeight="90px")}i=t}}
0===e.querySelectorAll(".thumbnail").length&&Array.from(t.querySelectorAll(".thumbnail")).forEach(t=>{
const n=t.closest(".col-xs-6, .col-md-3, .col-xs-12, .col-md-12")||t;if(!e.contains(n)){e.appendChild(n);const t=n.querySelector(".image")
;t&&(t.style.backgroundSize="cover",t.style.backgroundPosition="center",t.style.minHeight="90px")}}),t&&t.parentElement&&(t.style.display="none")}}}
let c=((e=class{static init(){this.injected||(r(this.styles.wideScreen,"hsex-widescreen"),r(this.styles.layout,"hsex-layout"),this.injected=!0)}
static setElementStyles(t,e){Object.assign(t.style,e)}}).injected=!1,e.styles={
wideScreen:'\n      .container {\n        width: 100% !important;\n        max-width: 100% !important;\n        padding: 0 8px !important;\n      }\n      .videos_box {\n        width: 100% !important;\n        max-width: 100% !important;\n        margin: 0 auto !important;\n        position: relative !important;\n        z-index: 5 !important;\n        aspect-ratio: 16 / 9 !important;\n        min-height: 200px !important;\n        overflow: hidden !important;\n      }\n      .videos_box.hsx-hidden-until-ready { visibility: hidden !important; }\n      .video-js,\n      .video-play-dimensions {\n        width: 100% !important;\n        max-width: 100% !important;\n        position: relative !important;\n        z-index: 5 !important;\n      }\n      .video-js.vjs-fluid {\n        padding-top: 56.25% !important;\n        height: auto !important;\n      }\n      .video-play-dimensions { height: auto !important; }\n      .video-js .vjs-poster { opacity: 0.001 !important; }\n      .col-md-12 {\n        width: 100% !important;\n        max-width: 100% !important;\n        flex-basis: 100% !important;\n        padding: 0 10px !important;\n      }\n      .vjs-control-bar {\n        position: absolute !important;\n        left: 0 !important;\n        right: 0 !important;\n        bottom: 0 !important;\n        z-index: 10 !important;\n        clear: none !important;\n        width: auto !important;\n      }\n      .panel-default {\n        position: relative !important;\n        clear: both !important;\n        margin-top: 16px !important;\n        z-index: 1 !important;\n        width: 100% !important;\n        float: none !important;\n      }\n      .col-md-12:after {\n        content: "" !important;\n        display: table !important;\n        clear: both !important;\n      }\n      .thumbnail { margin-bottom: 15px; }\n    ',
layout:'\n      .hsx-two-col {\n        display: grid !important;\n        grid-template-columns: minmax(280px, 1fr) minmax(0, 3fr) !important;\n        grid-gap: 16px !important;\n        margin-top: 16px !important;\n        width: 100% !important;\n      }\n      .hsx-two-col.single-left,\n      .hsx-two-col.single-right {\n        grid-template-columns: 1fr !important;\n      }\n      .hsx-two-col.single-left .hsx-right { display: none !important; }\n      .hsx-two-col.single-right .hsx-left { display: none !important; }\n      .hsx-left,\n      .hsx-right {\n        width: 100% !important;\n        display: grid !important;\n        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;\n        gap: 12px !important;\n        align-content: start !important;\n      }\n      .hsx-right > *,\n      .hsx-left > * { display: block !important; }\n      .hsx-two-col [class*="col-"] {\n        float: none !important;\n        width: auto !important;\n        max-width: 100% !important;\n        padding: 0 !important;\n      }\n      .hsx-two-col .row { margin: 0 !important; display: contents !important; }\n      .hsx-two-col .thumbnail {\n        margin-bottom: 0 !important;\n        display: block !important;\n      }\n      .hsx-two-col .thumbnail .image {\n        background-position: center center !important;\n        background-size: cover !important;\n        width: 100% !important;\n        min-height: 120px !important;\n      }\n    '
},e),m=((n=class{static init(){this.addQuickSwitchButton()}static addQuickSwitchButton(){if(document.getElementById(this.BUTTON_ID))return
;const t=document.querySelector("h3.panel-title");if(!t)return;const e=t.textContent?.trim();if(!e)return;const n=this.createButton(e)
;t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="space-between",t.style.flexWrap="wrap",t.style.gap="10px",t.appendChild(n)
}static createButton(t){const e=document.createElement("button");return e.id=this.BUTTON_ID,e.textContent="🔍 九色",e.title=`在九色搜索: ${t}`,
Object.assign(e.style,{padding:"4px 12px",fontSize:"12px",fontWeight:"500",backgroundColor:"#ff6b9d",color:"#fff",border:"none",borderRadius:"15px",
cursor:"pointer",transition:"all 0.3s ease",whiteSpace:"nowrap",flexShrink:"0"}),e.addEventListener("mouseenter",()=>{
e.style.backgroundColor="#ff4081",e.style.transform="scale(1.05)"}),e.addEventListener("mouseleave",()=>{e.style.backgroundColor="#ff6b9d",
e.style.transform="scale(1)"}),e.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation()
;const n=this.truncateSearchKeyword(t),i=this.JIUSE_SEARCH_URL+encodeURIComponent(n);window.open(i,"_blank")}),e}static truncateSearchKeyword(t){
return t.length<=this.MAX_SEARCH_LENGTH?t:t.substring(0,this.MAX_SEARCH_LENGTH)}}).BUTTON_ID="hsx-quick-switch-jiuse",
n.JIUSE_SEARCH_URL="https://91porny.com/search?keywords=",n.MAX_SEARCH_LENGTH=15,n);function debounce(t,e){let n;return(...i)=>{clearTimeout(n),
n=setTimeout(()=>t.apply(null,i),e)}}const p=class{static setDefaultDelay(t){this.defaultDelay=t}static registerHandler(config){
this.handlers.push(config)}static init(){this.isInitialized||(this.setupDocumentListeners(),this.setupMutationObserver(),this.isInitialized=!0)}
static setupDocumentListeners(){const t=()=>this.triggerAllHandlers()
;"loading"===document.readyState?document.addEventListener("DOMContentLoaded",t):t(),document.addEventListener("load",t=>{const e=t.target
;"VIDEO"!==e.tagName&&"IFRAME"!==e.tagName||this.triggerAllHandlers()},!0),window.addEventListener("load",t)}static setupMutationObserver(){
const t=()=>{if(!document.body)return setTimeout(t,100),void 0;const e=new Map;this.handlers.forEach(t=>{const n=t.debounceDelay??this.defaultDelay
;e.set(t.name,debounce(t.handler,n))}),this.observer=new MutationObserver(t=>{this.handlers.forEach(n=>{let i=t;if(n.filter&&(i=t.filter(n.filter)),
i.length>0){const t=e.get(n.name);t&&t(i)}})}),this.observer.observe(document.body,{childList:!0,subtree:!0})};t()}static triggerAllHandlers(){
this.handlers.forEach(t=>{try{t.handler([])}catch(e){void 0}})}static destroy(){this.observer&&(this.observer.disconnect(),this.observer=null),
this.handlers=[],this.isInitialized=!1}};p.observer=null,p.handlers=[],p.isInitialized=!1,p.defaultDelay=250;let u=p;function init(){
u.registerHandler({name:"HsexVideoModules",handler:()=>{a.setWideScreenMode(),LayoutReflow.reflowLayout(),m.addQuickSwitchButton()}}),u.init(),
a.init(),LayoutReflow.init(),m.init()}c.init(),init();const h=Object.freeze(Object.defineProperty({__proto__:null,CONFIG:s},Symbol.toStringTag,{
value:"Module"})),CONFIG={debounceDelay:250,selectors:{videoContainer:".videoPlayContainer",videoElement:".video-js",
videoColumn:".left.col-60.offset-md-10.col-md-40, .left.col-md-40.offset-md-10.col-60"}},y=class{static init(){
this.injectStyles(["wideScreen","videoRecommendation","adBlocker","downloadOptimizer","thumbnail","utilities"])}static injectStyles(t){t.forEach(t=>{
this.injectedStyles.has(t)||(this.addStyleToDocument(t,this.styles[t]),this.injectedStyles.add(t))})}static injectStyle(t){this.injectStyles([t])}
static addCustomStyle(t,e){this.injectedStyles.has(t)||(this.addStyleToDocument(t,e),this.injectedStyles.add(t))}static addStyleToDocument(t,e){
r(e.trim(),`jiuse-${t}`)}static removeStyle(t){d(`jiuse-${t}`)&&this.injectedStyles.delete(t)}static setElementStyles(t,e){l(t,e)}}
;y.injectedStyles=new Set,y.styles={
wideScreen:"\n      /* 重置顶部间距 */\n      body {\n        margin-top: 0 !important;\n        padding-top: 0 !important;\n      }\n      .container {\n        margin-top: 0 !important;\n        padding-top: 0 !important;\n      }\n      /* 重置所有视频相关容器的顶部间距 */\n      .row,\n      .row:first-child,\n      body .container .row,\n      body .container .row:first-child {\n        margin-top: 0 !important;\n        padding-top: 0 !important;\n      }\n      .videoPlayContainer {\n        width: 100% !important;\n        max-width: 100% !important;\n        margin: 0 auto !important;\n        margin-top: 0 !important;\n        padding-top: 0 !important;\n        opacity: 0 !important;\n        transition: opacity 0.3s ease !important;\n      }\n      .videoPlayContainer.wide-screen-ready {\n        opacity: 1 !important;\n      }\n      .video-js {\n        width: 100% !important;\n        max-width: 100% !important;\n      }\n      .row .col-100 {\n        width: 100% !important;\n        max-width: 100% !important;\n        flex-basis: 100% !important;\n        margin: 0 !important;\n        padding: 0 10px !important;\n        margin-top: 0 !important;\n        padding-top: 0 !important;\n      }\n      .row .side.col-40.col-md-50 {\n        display: none;\n      }\n      .videoPlayContainer .scale {\n        padding-bottom: 0 !important;\n        height: auto !important;\n        min-height: 0 !important;\n        aspect-ratio: unset !important;\n        margin-top: 0 !important;\n        padding-top: 0 !important;\n      }\n      .videoPlayContainer .video-js {\n        position: relative !important;\n        top: 0 !important;\n        left: 0 !important;\n      }\n      .videoPlayContainer,\n      .videoPlayContainer > *,\n      .col-100 {\n        margin-top: 0 !important;\n        padding-top: 0 !important;\n      }\n      /* 确保视频列容器无顶部间距 */\n      .left.col-100,\n      .row .left.col-100 {\n        margin-top: 0 !important;\n        padding-top: 0 !important;\n      }\n    ",
videoRecommendation:"\n      #recommended-videos-container, \n      #author-videos-container {\n        flex-wrap: wrap;\n      }\n      #author-info-container a {\n        color: #4a90e2;\n        display: block;\n        margin-bottom: 10px;\n        text-decoration: none;\n      }\n      #author-info-container a:hover {\n        text-decoration: underline;\n      }\n    ",
adBlocker:"\n      /* 隐藏特定广告容器 */\n      .aa9965ce0d851e635fa7ec1dbf56d965,\n      #po-s6,\n      .d9867a703dd9335a77b9f88459aa7bff {\n        display: none !important;\n        visibility: hidden !important;\n      }\n    ",
downloadOptimizer:'\n      /* 下载按钮优化样式 */\n      .nav-link[data-optimized="download"] {\n        cursor: pointer !important;\n      }\n      .nav-link[data-optimized="download"] i {\n        color: #28a745 !important;\n      }\n      .nav-link[data-optimized="download"] span {\n        color: #28a745 !important;\n      }\n      .nav-link[data-optimized="download"]:hover i,\n      .nav-link[data-optimized="download"]:hover span {\n        color: #34ce57 !important;\n      }\n    ',
thumbnail:"\n      /* 让缩略图显示完整而非裁剪 */\n      .display .img {\n        background-size: contain !important;\n        background-repeat: no-repeat !important;\n        background-position: center !important;\n        background-color: #000 !important;\n      }\n    ",
utilities:"\n      /* 动画过渡 */\n      .smooth-transition {\n        transition: all 0.3s ease;\n      }\n    "};let f=y;const g=class{static init(){
this.setWideScreenMode(),this.setupResizeListener()}static setWideScreenMode(){
const t=document.querySelector(CONFIG.selectors.videoContainer),e=document.querySelector(CONFIG.selectors.videoElement)
;(t||e)&&(this.applyVideoColumnClasses(),setTimeout(()=>{this.calculateVideoHeight(t,e),t&&t.classList.add("wide-screen-ready")},100))}
static applyVideoColumnClasses(){const t=document.querySelector(CONFIG.selectors.videoColumn)
;t&&(t.classList.remove("col-60","offset-md-10","col-md-40"),t.classList.add("col-100"))}static calculateVideoHeight(t,e){if(e){const n=16/9;let i=0
;if(i=t&&t.offsetWidth>0?t.offsetWidth:e.offsetWidth>0?e.offsetWidth:window.innerWidth,i>0){const t=i/n;f.setElementStyles(e,{height:`${t}px`})}}}
static setupResizeListener(){this.resizeHandlerAdded||(window.addEventListener("resize",()=>{
const t=document.querySelector(CONFIG.selectors.videoContainer),e=document.querySelector(CONFIG.selectors.videoElement);this.calculateVideoHeight(t,e)
}),this.resizeHandlerAdded=!0)}};g.resizeHandlerAdded=!1;let b=g;class VideoRecommendation{static init(){this.modifyVideoRecommendations()}
static modifyVideoRecommendations(){if(document.getElementById("rec-tabs-container"))return
;const t=Array.from(document.querySelectorAll("h5.container-title")).find(t=>"视频推荐"===t.textContent?.trim());if(!t)return
;const e=t.parentElement,n=e.nextElementSibling;if(!n||!n.classList.contains("row"))return;n.id="recommended-videos-container",n.style.display="flex"
;const i=this.createAuthorInfoContainer();n.parentNode?.insertBefore(i,n);const o=this.createAuthorVideosContainer()
;i.parentNode?.insertBefore(o,i.nextSibling);const{recommendedBtn:s,authorBtn:a,buttonContainer:r}=this.createTabButtons();e.innerHTML="",
e.appendChild(r),this.setupTabEvents(s,a,n,o,i)}static createAuthorInfoContainer(){const t=document.createElement("div")
;return t.id="author-info-container",t.style.display="none",t}static createAuthorVideosContainer(){const t=document.createElement("div")
;return t.id="author-videos-container",t.className="row",t.style.display="none",t}static createTabButtons(){this.injectTabStyles()
;const t=createElement("div",{id:"rec-tabs-container",style:{display:"flex",gap:"10px",padding:"10px 0"}}),e=createElement("button",{
className:"tab-btn active",textContent:"视频推荐"}),n=createElement("button",{className:"tab-btn",textContent:"作者视频"});return t.appendChild(e),
t.appendChild(n),{recommendedBtn:e,authorBtn:n,buttonContainer:t}}static setupTabEvents(t,e,n,i,o){t.addEventListener("click",()=>{
t.classList.add("active"),e.classList.remove("active"),n.style.display="flex",i.style.display="none",o.style.display="none"}),
e.addEventListener("click",()=>{if(e.classList.add("active"),t.classList.remove("active"),n.style.display="none",i.style.display="flex",
o.style.display="block",0===i.children.length){const t=document.querySelector('.d-flex.justify-content-between a[href*="/author/"]')
;t?this.fetchAuthorInfoAndVideos(t.href,i,o):i.innerHTML='<p style="color: white; padding: 20px;">未找到当前视频的作者信息。</p>'}})}
static fetchAuthorInfoAndVideos(t,e,n){e.innerHTML='<p style="color: white; padding: 20px;">正在加载作者视频...</p>',n.innerHTML="",
fetch(t).then(t=>t.text()).then(i=>{
const o=(new DOMParser).parseFromString(i,"text/html"),s=Array.from(o.querySelectorAll("p, h1, h2, h3, h4, h5")).find(t=>t.textContent?.includes("共计")&&t.textContent?.includes("视频"))
;if(s){const e=document.createElement("a");e.href=t,e.target="_blank";let i=s.textContent?.trim()||"",o=i.split("，")[0];o===i&&(o=i.split(",")[0]),
e.textContent=o,e.title="点击跳转作者主页",n.appendChild(e)}const a=o.querySelectorAll(".colVideoList");e.innerHTML="",a.length>0?a.forEach(t=>{
e.appendChild(t)}):e.innerHTML='<p style="color: white; padding: 20px;">该作者没有其他视频。</p>'}).catch(t=>{void 0,
e.innerHTML='<p style="color: white; padding: 20px;">加载作者视频失败。</p>'})}static injectTabStyles(){if(document.getElementById("jiuse-tab-styles"))return
;const t="\n      .tab-btn {\n        padding: 8px 16px;\n        background: #333;\n        color: #fff;\n        border: 1px solid #555;\n        border-radius: 4px;\n        cursor: pointer;\n        transition: all 0.3s;\n      }\n      .tab-btn:hover {\n        background: #444;\n      }\n      .tab-btn.active {\n        background: #007bff;\n        border-color: #007bff;\n      }\n    ",e=document.createElement("style")
;e.id="jiuse-tab-styles",e.textContent=t,document.head.appendChild(e)}}const v=class{static init(){this.isInitialized||(this.setupAdWatcher(),
this.isInitialized=!0),this.removeAuthorComments()}static removeAuthorComments(){const t=document.querySelector(".aa9965ce0d851e635fa7ec1dbf56d965")
;t&&t.remove();const e=document.getElementById("po-s6")
;e&&e.remove(),document.querySelectorAll('div[class*="aa9965ce0d851e635fa7ec1dbf56d965"]').forEach(t=>{t.remove()})}static setupAdWatcher(){
u.registerHandler({name:"AdBlocker",handler:t=>{t&&(t.forEach(t=>{t.addedNodes.length>0&&t.addedNodes.forEach(t=>{if(t.nodeType===Node.ELEMENT_NODE){
const e=t;this.isAdElement(e)&&e.remove(),e.querySelectorAll(".aa9965ce0d851e635fa7ec1dbf56d965, #po-s6").forEach(t=>{t.remove()})}})}),
this.removeAuthorComments())},debounceDelay:100,filter:t=>t.addedNodes.length>0})}static isAdElement(t){const e=t.className||"",n=t.id||""
;return e.includes("aa9965ce0d851e635fa7ec1dbf56d965")||"po-s6"===n}};v.isInitialized=!1;let x=v;const S=class{static init(){
this.optimizeDownloadTabs()}static optimizeDownloadTabs(){
const t=document.querySelector('a[href="#videoShowTabDownload"]'),e=document.querySelector(".downloadBtn[data-id]")
;if(t&&e&&!this.processed.has(t))try{if(!e.getAttribute("data-id"))return;t.removeAttribute("data-toggle"),t.removeAttribute("href"),
t.setAttribute("data-optimized","download"),t.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation();const n=e.querySelector("button")
;n?n.click():e.click()});const n=t.querySelector("span");n&&(n.textContent="下载");const i=document.querySelector("#videoShowTabDownload")
;if(i&&(i.style.display="none"),t.classList.contains("active")){t.classList.remove("active")
;const e=document.querySelector('a[href="#videoShowTabAbout"]'),n=document.querySelector("#videoShowTabAbout");e&&n&&(e.classList.add("active"),
n.classList.add("show","active"))}this.processed.add(t)}catch(n){void 0}}};S.processed=new Set;let w=S;const C=class{static init(){
this.addQuickSwitchButton()}static addQuickSwitchButton(){if(document.getElementById(this.BUTTON_ID))return
;const t=document.querySelector("h4.container-title");if(!t)return;const e=t.textContent?.trim();if(!e)return;const n=this.createButton(e)
;t.style.display="flex",t.style.alignItems="center",t.style.justifyContent="space-between",t.style.flexWrap="wrap",t.style.gap="10px",t.appendChild(n)
}static createButton(t){const e=document.createElement("button");return e.id=this.BUTTON_ID,e.textContent="🔍 好色",e.title=`在好色搜索: ${t}`,
Object.assign(e.style,{padding:"4px 12px",fontSize:"12px",fontWeight:"500",backgroundColor:"#7c4dff",color:"#fff",border:"none",borderRadius:"15px",
cursor:"pointer",transition:"all 0.3s ease",whiteSpace:"nowrap",flexShrink:"0"}),e.addEventListener("mouseenter",()=>{
e.style.backgroundColor="#651fff",e.style.transform="scale(1.05)"}),e.addEventListener("mouseleave",()=>{e.style.backgroundColor="#7c4dff",
e.style.transform="scale(1)"}),e.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation()
;const n=this.truncateSearchKeyword(t),i=this.HSEX_SEARCH_URL+encodeURIComponent(n);window.open(i,"_blank")}),e}static truncateSearchKeyword(t){
return t.length<=this.MAX_SEARCH_LENGTH?t:t.substring(0,this.MAX_SEARCH_LENGTH)}};C.BUTTON_ID="jiuse-quick-switch-hsex",
C.HSEX_SEARCH_URL="https://hsex.tv/search.htm?search=",C.MAX_SEARCH_LENGTH=15;let E=C;function L(){const t=location.pathname
;return/\/(video|vod|play)\//.test(t)||t.includes(".html")}f.init(),L()?function(){u.setDefaultDelay(CONFIG.debounceDelay),u.registerHandler({
name:"JiuseVideoModules",handler:()=>{b.setWideScreenMode(),VideoRecommendation.modifyVideoRecommendations(),w.optimizeDownloadTabs(),
E.addQuickSwitchButton()},filter:t=>{if(0===t.addedNodes.length)return!1;for(const e of Array.from(t.addedNodes))if(e.nodeType===Node.ELEMENT_NODE){
const t=e
;if(t.matches&&(t.matches(".videoPlayContainer")||t.matches(".video-js")||t.matches('[class*="recommend"]')||t.matches('[class*="video"]')||t.matches('[class*="download"]')||"VIDEO"===t.tagName||"IFRAME"===t.tagName))return!0
}return!1}}),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",()=>{b.init(),VideoRecommendation.init(),w.init(),E.init()
}):(b.init(),VideoRecommendation.init(),w.init(),E.init()),x.init(),u.init()}():void 0;const A=Object.freeze(Object.defineProperty({__proto__:null,
CONFIG:CONFIG},Symbol.toStringTag,{value:"Module"}))})();
