// ==UserScript==
// @name         videocelebs-预览
// @version      1.1.1
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  优化 videocelebs.net 增加预览图，视频自动加宽，性能优化快速加载
// @match        https://videocelebs.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=videocelebs.net
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542788/videocelebs-%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542788/videocelebs-%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function(){"use strict";const CONFIG={selectors:{rightSidebar:".right_sidebar",middleDiv:".midle_div",
videoList:".list_videos",mainContentItems:".midle_div .item.big",popularVideoItems:".list_videos .item",
itemTitleLink:".title h2 a",itemImage:".first > a > img",popularImage:"img.thumb",
header:".header, .header_block, header"},fetchTimeout:5e3,maxPreviewImages:4};class CookieManager{
static clearRestrictionCookies(){const t=["kt_ips","kt_remote_ips"];t.forEach(t=>{
document.cookie=`${t}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.videocelebs.net`});void 0}}
function createElement(t,e=[],i={}){const o=document.createElement(t);if(e.length)o.className=e.join(" ")
;Object.assign(o,i);return o}const t=class _StyleManager{static injectInitialStyles(){if(this.initialStyle)return
;this.initialStyle=createElement("style",[],{
textContent:`\n        ${CONFIG.selectors.rightSidebar}, ${CONFIG.selectors.middleDiv}, ${CONFIG.selectors.videoList} {\n            visibility: hidden !important;\n        }\n      `
});document.head.appendChild(this.initialStyle)}static applyMainStyles(){this.initialStyle?.remove()
;if(this.mainStyle)return;this.mainStyle=createElement("style",[],{
textContent:`\n        /* 全局背景色调整 */\n        body { background-color: #121212 !important; margin: 0 !important; padding: 0 !important; width: 100% !important; overflow-x: hidden !important; color: #e0e0e0 !important; }\n        .wrap_all { width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 !important; }\n        /* 右侧边栏 */\n        .right_sidebar { position: fixed !important; right: 0 !important; width: 260px !important; overflow-y: auto !important; z-index: 1000 !important; background-color: #1e2a38 !important; padding: 10px !important; border-radius: 8px 0 0 8px !important; box-shadow: 0 0 10px rgba(0,0,0,0.3) !important; visibility: visible !important; transition: none !important; }\n        .right_sidebar h3 { color: #64b5f6 !important; font-weight: bold !important; border-bottom: 1px solid #2c3e50 !important; padding-bottom: 8px !important; }\n        .right_sidebar .menu a, .right_sidebar #menu-years a, .right_sidebar .release a { color: #b0bec5 !important; transition: color 0.2s ease !important; }\n        .right_sidebar .menu a:hover, .right_sidebar #menu-years a:hover, .right_sidebar .release a:hover { color: #fff !important; }\n        .right_sidebar .tagcloud a { color: #b0bec5 !important; display: inline-block !important; margin: 2px !important; padding: 2px 6px !important; background-color: #2c3e50 !important; border-radius: 3px !important; transition: all 0.2s ease !important; }\n        .right_sidebar .tagcloud a:hover { background-color: #3498db !important; color: #fff !important; }\n        .right_sidebar .pupular_video .wpp-post-title { color: #b0bec5 !important; display: block !important; margin-top: 4px !important; transition: color 0.2s ease !important; }\n        .right_sidebar .pupular_video .wpp-post-title:hover { color: #fff !important; }\n        .right_sidebar::-webkit-scrollbar { width: 5px !important; }\n        .right_sidebar::-webkit-scrollbar-track { background: rgba(0,0,0,0.2) !important; }\n        .right_sidebar::-webkit-scrollbar-thumb { background: rgba(52, 152, 219, 0.5) !important; border-radius: 3px !important; }\n        .right_sidebar::-webkit-scrollbar-thumb:hover { background: rgba(52, 152, 219, 0.7) !important; }\n        /* 主内容区域 */\n        .midle_div { margin: 0 280px 0 0 !important; padding: 20px 0 20px 0 !important; width: auto !important; max-width: calc(100% - 280px) !important; box-sizing: border-box !important; display: block !important; visibility: visible !important; }\n        .midle_div > h1 { margin-left: 0 !important; padding-left: 15px !important; color: #64b5f6 !important; border-bottom: 1px solid #2c3e50 !important; padding-bottom: 10px !important; margin-bottom: 20px !important; }\n        .midle_div > center { margin: 0 20px 0 0 !important; }\n        /* 统一的内容项卡片样式 */\n        .midle_div .item.big, .list_videos .item { display: flex !important; flex-direction: column !important; margin: 0 0 20px 0 !important; background-color: #1e2a38 !important; border-radius: 8px !important; padding: 15px !important; box-shadow: 0 3px 10px rgba(0,0,0,0.3) !important; position: relative !important; transition: transform 0.2s ease, box-shadow 0.2s ease !important; width: calc(100% - 20px) !important; border-left: 3px solid #3498db !important; overflow: visible !important; visibility: visible !important; }\n        .midle_div .item.big:hover, .list_videos .item:hover { transform: translateX(5px) !important; box-shadow: 0 5px 15px rgba(0,0,0,0.4) !important; border-left: 3px solid #64b5f6 !important; }\n        .list_videos .item { width: auto !important; margin-bottom: 15px !important; padding-bottom: 10px !important; }\n        /* 统一的标题样式 */\n        .midle_div .item.big .title, .list_videos .item .title { order: 1 !important; margin-bottom: 12px !important; padding-bottom: 8px !important; border-bottom: 1px solid #2c3e50 !important; position: relative !important; }\n        .midle_div .item.big .title:after, .list_videos .item .title:after { content: "" !important; position: absolute !important; bottom: -1px !important; left: 0 !important; width: 50px !important; height: 3px !important; background-color: #3498db !important; border-radius: 3px !important; }\n        .midle_div .item.big .title h2, .list_videos .item .title h2 { font-size: 18px !important; margin: 0 !important; padding: 3px 0 !important; line-height: 1.3 !important; }\n        .list_videos .item .title h2 { font-size: 16px !important; }\n        .midle_div .item.big .title h2 a, .list_videos .item .title h2 a { color: #64b5f6 !important; text-decoration: none !important; font-weight: 600 !important; transition: color 0.2s ease !important; }\n        .list_videos .item .title h2 a { font-weight: 500 !important; }\n        .midle_div .item.big .title h2 a:hover, .list_videos .item .title h2 a:hover { color: #90caf9 !important; }\n        /* 统一的预览图网格 */\n        .preview-grid { display: grid !important; grid-template-columns: repeat(4, 1fr) !important; gap: 10px !important; width: 100% !important; margin-top: 8px !important; }\n        .list_videos .item .preview-grid { margin-bottom: 10px !important; order: 2 !important; }\n        .preview-grid a { position: relative !important; overflow: hidden !important; border-radius: 6px !important; cursor: pointer !important; aspect-ratio: 16 / 9 !important; box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important; display: block !important; border: 2px solid transparent !important; transition: border-color 0.2s ease !important; }\n        .preview-grid a:hover { border-color: #3498db !important; }\n        .preview-grid a img { width: 100% !important; height: 100% !important; object-fit: cover !important; display: block !important; border-radius: 4px !important; transition: transform 0.3s ease !important; }\n        .preview-grid a:hover img { transform: scale(1.05) !important; }\n        /* 隐藏原始图片 */\n        .midle_div .item.big .first > a > img, .list_videos .item > a > .img { display: none !important; }\n        .midle_div .item.big .wrap, .midle_div .item.big .rating { display: none !important; }\n        .midle_div .item.big .first { order: 2 !important; }\n        /* 图片查看器 */\n        .image-viewer-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.95); z-index: 9999; display: flex; justify-content: center; align-items: center; cursor: pointer; }\n        .image-viewer-content { max-width: 90%; max-height: 90%; position: relative; display: flex; justify-content: center; align-items: center; }\n        .image-viewer-content img { max-width: 100%; max-height: 90vh; object-fit: contain; border-radius: 4px; box-shadow: 0 0 20px rgba(0,0,0,0.7); }\n        .image-viewer-prev, .image-viewer-next { position: absolute; top: 50%; transform: translateY(-50%); background-color: rgba(52,152,219,0.3); color: white; font-size: 24px; font-weight: bold; width: 50px; height: 50px; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; transition: background-color 0.3s; z-index: 10000; }\n        .image-viewer-prev { left: 20px; }\n        .image-viewer-next { right: 20px; }\n        .image-viewer-prev:hover, .image-viewer-next:hover { background-color: rgba(52,152,219,0.7); }\n        .image-viewer-counter { position: absolute; bottom: -30px; color: white; font-size: 14px; background-color: rgba(52,152,219,0.5); padding: 5px 10px; border-radius: 12px; }\n        /* 分页导航 */\n        .wp-pagenavi { margin-top: 20px !important; padding: 10px !important; background-color: #1e2a38 !important; border-radius: 8px !important; text-align: center !important; box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important; }\n        .wp-pagenavi a, .wp-pagenavi span { margin: 0 3px !important; padding: 5px 10px !important; border-radius: 4px !important; border: none !important; background-color: #2c3e50 !important; color: #b0bec5 !important; transition: all 0.2s ease !important; }\n        .wp-pagenavi a:hover { background-color: #3498db !important; color: #fff !important; }\n        .wp-pagenavi span.current { background-color: #3498db !important; color: #fff !important; }\n        /* 大屏幕适配 */\n        @media (min-width: 1800px) {\n            .bg { display: flex !important; justify-content: center !important; }\n            .wrap_all { max-width: 1800px !important; margin: 0 auto !important; }\n        }\n      `
});document.head.appendChild(this.mainStyle)}};t.initialStyle=null;t.mainStyle=null;let e=t;class DomManager{
static adjustSidebar(){const t=document.querySelector(CONFIG.selectors.rightSidebar);if(!t)return
;const e=document.querySelector(CONFIG.selectors.header);const i=e?e.getBoundingClientRect().height:0
;const o=window.scrollY||document.documentElement.scrollTop;t.style.top=(o>=i?0:i-o)+"px"
;t.style.height=`calc(100vh - ${t.style.top})`}static observeDOMChanges(callback){
const observer=new MutationObserver(t=>{const e=t.some(t=>t.addedNodes.length>0);if(e)requestAnimationFrame(callback)})
;observer.observe(document.body,{childList:true,subtree:true})}}const i=class _LightboxManager{static init(){
if(this.initialized||document.querySelector(".image-viewer-overlay"))return;let t=[];let e=0
;const i=createElement("div",["image-viewer-overlay"]);i.style.display="none"
;const o=createElement("div",["image-viewer-content"]);const r=createElement("img")
;const a=createElement("div",["image-viewer-prev"],{innerHTML:"&#10094;"})
;const n=createElement("div",["image-viewer-next"],{innerHTML:"&#10095;"})
;const s=createElement("div",["image-viewer-counter"]);o.append(r,a,n,s);i.appendChild(o);document.body.appendChild(i)
;const closeViewer=()=>{i.style.display="none";document.body.style.overflow="auto"};const updateCounter=()=>{
s.textContent=`${e+1} / ${t.length}`;a.style.display=t.length>1?"flex":"none";n.style.display=t.length>1?"flex":"none"}
;const showImage=i=>{e=(i+t.length)%t.length;r.src=t[e];updateCounter()};i.addEventListener("click",t=>{
if(t.target===i)closeViewer()});a.addEventListener("click",t=>{t.stopPropagation();showImage(e-1)})
;n.addEventListener("click",t=>{t.stopPropagation();showImage(e+1)});document.addEventListener("keydown",t=>{
if("flex"!==i.style.display)return
;if("ArrowLeft"===t.key)a.click();else if("ArrowRight"===t.key)n.click();else if("Escape"===t.key)closeViewer()})
;window.videocelebsViewer={show:(o,r=0)=>{t=o;e=r;i.style.display="flex";document.body.style.overflow="hidden"
;showImage(e)}};this.initialized=true}static show(t,e=0){if(window.videocelebsViewer)window.videocelebsViewer.show(t,e)}
};i.initialized=false;let o=i;const r=class _PreviewManager{static initStats(){try{
const t=localStorage.getItem("videocelebs-stats");if(t)this.stats={...this.stats,...JSON.parse(t)}
;if(!this.stats.sessionStart)this.stats.sessionStart=Date.now();this.stats.pageViews++;this.saveStats();this.logStats()
}catch(t){void 0}}static saveStats(){try{localStorage.setItem("videocelebs-stats",JSON.stringify(this.stats))}catch(t){
void 0}}static updateTimeWindowStats(){const t=Date.now();const e=t-60*60*1e3;const i=t-24*60*60*1e3
;this.stats.requestTimes=this.stats.requestTimes.filter(t=>t>i)
;this.stats.lastHourRequests=this.stats.requestTimes.filter(t=>t>e).length
;this.stats.last24HourRequests=this.stats.requestTimes.length}static logStats(){this.updateTimeWindowStats()
;const t=this.stats.sessionStart?Math.round((Date.now()-this.stats.sessionStart)/1e3/60):0
;const e=this.stats.fetchCount+this.stats.smartConstruct>0?Math.round(this.stats.smartConstruct/(this.stats.fetchCount+this.stats.smartConstruct)*100):0
;void 0;void 0;void 0;void 0;if(this.stats.fetchCount>0){const e=t>0?(this.stats.fetchCount/t).toFixed(2):"0";void 0}}
static resetStats(){this.stats={sessionStart:Date.now(),pageViews:0,fetchCount:0,smartConstruct:0,requestTimes:[],
lastHourRequests:0,last24HourRequests:0};localStorage.removeItem("videocelebs-stats");void 0}static getStats(){return{
...this.stats}}static analyzeLimitTrigger(){this.updateTimeWindowStats();const t=Date.now()
;const e=this.stats.sessionStart?Math.round((t-this.stats.sessionStart)/1e3/60):0;void 0;void 0;void 0;void 0;void 0
;void 0;void 0;void 0;void 0;void 0;void 0;if(this.stats.fetchCount>0&&e>0){const t=(this.stats.fetchCount/e).toFixed(2)
;const i=(this.stats.fetchCount/e*60).toFixed(1);void 0;void 0}if(this.stats.requestTimes.length>=2){
const t=this.stats.requestTimes.slice(-5);const e=[];for(let i=1;i<t.length;i++)e.push(Math.round((t[i]-t[i-1])/1e3))
;void 0}void 0
;if(this.stats.fetchCount<10)void 0;else if(this.stats.lastHourRequests>=10)void 0;else if(this.stats.last24HourRequests>=50)void 0;else if(e<10)void 0;else void 0
;void 0;void 0}static tryConstructPreviewUrls(t){const e=[];try{
const i=[(t,e)=>`${t.replace(/\d+\.jpg$/i,"")}${e}.jpg`,(t,e)=>`${t.replace(/\.jpg$/i,"")}_${e}.jpg`,(t,e)=>`${t.replace(/\.jpg$/i,"")}-${e}.jpg`]
;for(const o of i){const i=[];for(let e=1;e<=CONFIG.maxPreviewImages;e++){const r=o(t,e);if(r!==t)i.push(r)}
if(i.length>0){e.push(...i);this.stats.smartConstruct++;this.saveStats();void 0;break}}}catch(i){void 0}
if(0===e.length)e.push(t);return e}static async fetchDetailPageImages(t){try{const e=Date.now();this.stats.fetchCount++
;this.stats.requestTimes.push(e);this.updateTimeWindowStats();this.saveStats();void 0;void 0;const i=new AbortController
;const o=setTimeout(()=>i.abort(),CONFIG.fetchTimeout);const r=await fetch(t,{signal:i.signal});clearTimeout(o)
;if(!r.ok)throw new Error(`HTTP error! status: ${r.status}`);const a=await r.text()
;const n=(new DOMParser).parseFromString(a,"text/html")
;let s=Array.from(n.querySelectorAll('a[rel="screenshots"]'),t=>t.href)
;if(0===s.length)s=Array.from(n.querySelectorAll('a[href*="/wp-content/uploads/"]')).map(t=>t.href).filter(t=>t.endsWith(".jpg"))
;return s.slice(0,CONFIG.maxPreviewImages)}catch(e){void 0;return[]}}static addPreviewImages(t,e){t.innerHTML=""
;e.forEach((i,r)=>{const a=createElement("a",[],{href:"javascript:void(0);"});const n=createElement("img",[],{src:i})
;n.onerror=()=>a.remove();a.addEventListener("click",t=>{t.preventDefault();o.show(e,r)});a.appendChild(n)
;t.appendChild(a)});const i=e.length
;if(i>0)t.style.gridTemplateColumns=`repeat(${Math.min(i,CONFIG.maxPreviewImages)}, 1fr)`}
static async processMainContentItem(t){if("true"===t.dataset.processed)return;t.dataset.processed="true"
;const e=t.querySelector(CONFIG.selectors.itemTitleLink);if(!e)return;const i=e.href
;const o=t.querySelector(CONFIG.selectors.itemImage);if(!o)return;const r=createElement("div",["preview-grid"])
;const a=o.src;let n=[];if(a.includes("/videos_screenshots/")){
const t=a.replace(/\/source\/\d+\.jpg$/,"").replace(/\/\d+x\d+\/.*?\.jpg$/,"")
;for(let e=1;e<=CONFIG.maxPreviewImages;e++)n.push(`${t}/source/${e}.jpg`)}else{n=this.tryConstructPreviewUrls(a)
;if(n.length<=1&&i){void 0;const t=await this.fetchDetailPageImages(i);if(t.length>0)n=t}if(0===n.length)n.push(a)}
this.addPreviewImages(r,n);const s=t.querySelector(".first");if(s){s.innerHTML="";s.appendChild(r)}}
static processPopularVideoItem(t){if("true"===t.dataset.processed)return;t.dataset.processed="true"
;const e=t.querySelector(CONFIG.selectors.popularImage);if(!e||!e.src.includes("/videos_screenshots/"))return
;const i=e.src.replace(/\/\d+x\d+\/.*?\.jpg$/,"");const o=parseInt(e.dataset.cnt||"4")
;const r=Math.min(o,CONFIG.maxPreviewImages);const a=[];for(let s=1;s<=r;s++)a.push(`${i}/source/${s}.jpg`)
;if(0===a.length)return;const n=createElement("div",["preview-grid"]);this.addPreviewImages(n,a);t.appendChild(n)}}
;r.stats={sessionStart:0,pageViews:0,fetchCount:0,smartConstruct:0,requestTimes:[],lastHourRequests:0,
last24HourRequests:0};let a=r;class VideoCelebsScript{static main(){void 0;CookieManager.clearRestrictionCookies()
;e.injectInitialStyles();window.addEventListener("DOMContentLoaded",()=>{e.applyMainStyles();o.init()
;setTimeout(()=>a.initStats(),100);const processAllItems=()=>{
document.querySelectorAll(CONFIG.selectors.mainContentItems).forEach(t=>a.processMainContentItem(t))
;document.querySelectorAll(CONFIG.selectors.popularVideoItems).forEach(t=>a.processPopularVideoItem(t))}
;processAllItems();DomManager.observeDOMChanges(processAllItems);DomManager.adjustSidebar()
;window.addEventListener("resize",DomManager.adjustSidebar)
;window.addEventListener("scroll",()=>requestAnimationFrame(DomManager.adjustSidebar))})}}window.videocelebsStats={
show:()=>a.logStats(),get:()=>a.getStats(),reset:()=>a.resetStats(),limitHit:()=>a.analyzeLimitTrigger()}
;VideoCelebsScript.main()})();
