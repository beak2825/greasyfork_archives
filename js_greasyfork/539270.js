// ==UserScript==
// @name         磁力柠檬-预览
// @version      1.1.4
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  一键获取磁力并验车
// @match        https://*.lemongb.top/search?keyword=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lemongb.top
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539270/%E7%A3%81%E5%8A%9B%E6%9F%A0%E6%AA%AC-%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/539270/%E7%A3%81%E5%8A%9B%E6%9F%A0%E6%AA%AC-%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function(){"use strict";const CONFIG={site:{panelSelector:".panel.panel-default.border-radius",detailLinkSelector:'a[href^="/detail/"]',
containerSelector:".panel-footer",magnetSelector:"#magnet",cachePrefix:"magnet_lemon_"},preview:{apiUrl:"https://whatslink.info/api/v1/link",
referer:"https://tmp.nulla.top/",cachePrefix:"preview_"},filter:{dropdownSelector:".dropdown-menu.search-option-dropdown-menu"},filterOptions:[{
text:"小于10GB",sizeGB:10,type:"lt"},{text:"100MB-100GB",minMB:100,maxGB:100,type:"range"},{text:"大于100MB",sizeMB:100,type:"gt"}],cacheTTL:1296e6}
;function t(t){switch(t.type){case"lt":return`lt${1024*(t.sizeGB||0)}mb`;case"gt":
return t.sizeGB?`gt${1024*t.sizeGB}mb`:t.sizeMB?`gt${t.sizeMB}mb`:"gt100mb";case"range":return`gt${t.minMB||100}mb-lt${1024*(t.maxGB||100)}mb`
;default:return"gt100mb"}}function e(t,e=2){if(!+t)return"0 Bytes"
;const i=1024,n=e<0?0:e,o=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],s=Math.floor(Math.log(t)/Math.log(i))
;return`${parseFloat((t/Math.pow(i,s)).toFixed(n))} ${o[s]}`}function i(t){function e(t){const e=document.createElement("input");e.value=t,
document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e)}
navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t).catch(()=>e(t)):e(t)}function n(t,e="007bff"){
const i=document.createElement("button");return i.className="magnet-button",i.textContent=t,
i.style.cssText=`margin-top:5px; padding:2px 8px; background-color:#${e}; color:white; border:none; border-radius:3px; cursor:pointer; font-size:12px;`,
i}class CacheManager{constructor(t,e){this.prefix=t,this.ttl=e}get(t){try{const e=localStorage.getItem(this.prefix+t);if(!e)return null
;const i=JSON.parse(e);return i.timestamp&&Date.now()-i.timestamp>this.ttl?(localStorage.removeItem(this.prefix+t),null):i.data}catch(e){
return void 0,null}}set(t,e){try{localStorage.setItem(this.prefix+t,JSON.stringify({data:e,timestamp:Date.now()}))}catch(i){void 0}}}
const o=new CacheManager(CONFIG.site.cachePrefix,CONFIG.cacheTTL),s=new CacheManager(CONFIG.preview.cachePrefix,CONFIG.cacheTTL)
;class AntiDetectionManager{static clearRestrictionCookies(){
const t=["rate_limit","request_count","visit_count","access_limit","user_visits","daily_limit","hourly_limit","session_count","user_ip","client_ip","remote_ip","visitor_ip","last_visit","visit_time","session_start","first_visit","bot_check","captcha_shown","verify_status","security_check","__cfduid","_cf_clearance","cf_ray","cf_use_ob","frequency_check","throttle","spam_check"],e=[".lemongb.top","lemongb.top",window.location.hostname]
;t.forEach(t=>{e.forEach(e=>{document.cookie=`${t}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${e}`,
document.cookie=`${t}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`})})}static clearLocalStorageRestrictions(){
["visit_count","request_count","last_request_time","daily_requests","hourly_requests","rate_limit_data","user_session_data","access_control"].forEach(t=>{
try{localStorage.removeItem(t)}catch(e){}})}static clearSessionStorageRestrictions(){
["session_requests","temp_limit","page_visits","current_session","visit_tracking"].forEach(t=>{try{sessionStorage.removeItem(t)}catch(e){}})}
static getRandomUserAgent(){
const t=["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36","Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36","Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0","Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/118.0","Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36","Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15"]
;return t[Math.floor(Math.random()*t.length)]}static getRandomDelay(t=1e3,e=3e3){return Math.floor(Math.random()*(e-t+1))+t}static getFakeHeaders(){
return{"User-Agent":this.getRandomUserAgent(),
Accept:"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8","Accept-Language":"zh-CN,zh;q=0.9,en;q=0.8",
"Accept-Encoding":"gzip, deflate, br","Cache-Control":"no-cache",Pragma:"no-cache",
"Sec-Ch-Ua":'"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',"Sec-Ch-Ua-Mobile":"?0","Sec-Ch-Ua-Platform":'"Windows"',
"Sec-Fetch-Dest":"document","Sec-Fetch-Mode":"navigate","Sec-Fetch-Site":"same-origin","Sec-Fetch-User":"?1","Upgrade-Insecure-Requests":"1",
Referer:window.location.origin}}static init(){void 0,this.clearRestrictionCookies(),this.clearLocalStorageRestrictions(),
this.clearSessionStorageRestrictions(),setInterval(()=>{this.clearRestrictionCookies(),this.clearLocalStorageRestrictions(),
this.clearSessionStorageRestrictions()},3e5),window.addEventListener("beforeunload",()=>{this.clearRestrictionCookies(),
this.clearLocalStorageRestrictions(),this.clearSessionStorageRestrictions()})}static async delay(t){return new Promise(e=>setTimeout(e,t))}}
const a=class{static async fetchMagnetLink(t){await this.implementRateLimit();const e=new AbortController,i=setTimeout(()=>e.abort(),15e3);try{
const n=AntiDetectionManager.getFakeHeaders();void 0;const o=await fetch(t,{headers:{...n,Referer:location.origin},signal:e.signal,cache:"no-store",
mode:"cors",credentials:"same-origin"});if(clearTimeout(i),this.lastRequestTime=Date.now(),o.ok){const t=await o.text(),e=this.extractMagnetLink(t)
;return e,void 0,e}return void 0,429===o.status||503===o.status?(void 0,AntiDetectionManager.clearRestrictionCookies(),
AntiDetectionManager.clearLocalStorageRestrictions(),AntiDetectionManager.clearSessionStorageRestrictions(),
await AntiDetectionManager.delay(AntiDetectionManager.getRandomDelay(3e3,8e3)),this.fetchMagnetLinkRetry(t)):null}catch(n){return void 0,
clearTimeout(i),n instanceof Error&&"AbortError"===n.name?(void 0,this.fetchMagnetLinkRetry(t)):null}}static async fetchMagnetLinkRetry(t,e=1){
if(e>2)return void 0,null;void 0,AntiDetectionManager.clearRestrictionCookies(),AntiDetectionManager.clearLocalStorageRestrictions(),
AntiDetectionManager.clearSessionStorageRestrictions(),await AntiDetectionManager.delay(AntiDetectionManager.getRandomDelay(2e3,6e3))
;const i=new AbortController,n=setTimeout(()=>i.abort(),15e3);try{const o=AntiDetectionManager.getFakeHeaders(),s=await fetch(t,{headers:{...o,
Referer:location.origin},signal:i.signal,cache:"no-store",mode:"cors",credentials:"same-origin"});if(clearTimeout(n),s.ok){
const i=await s.text(),n=this.extractMagnetLink(i);return n?(void 0,n):this.fetchMagnetLinkRetry(t,e+1)}return void 0,this.fetchMagnetLinkRetry(t,e+1)
}catch(o){return void 0,clearTimeout(n),this.fetchMagnetLinkRetry(t,e+1)}}static async implementRateLimit(){
const t=Date.now()-this.lastRequestTime,e=AntiDetectionManager.getRandomDelay(1500,4e3);if(t<e){const i=e-t;void 0,await AntiDetectionManager.delay(i)
}}static extractMagnetLink(t){const e=(new DOMParser).parseFromString(t,"text/html").querySelector(CONFIG.site.magnetSelector)
;if(e?.href.startsWith("magnet:?"))return e.href;const i=/magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}(?:&amp;|&)[^'"<>]*/,n=t.match(i)
;return n?n[0].replace(/&amp;/g,"&"):null}static fetchPreviewInfo(t){return new Promise((e,i)=>{GM_xmlhttpRequest({method:"GET",
url:`${CONFIG.preview.apiUrl}?url=${encodeURIComponent(t)}`,headers:{Referer:CONFIG.preview.referer,Origin:CONFIG.preview.referer},onload:t=>{
if(200===t.status)try{const i=JSON.parse(t.responseText);e(i)}catch(n){i(new Error("解析API响应失败"))}else i(new Error(`API请求错误 (状态: ${t.status})`))},
onerror:()=>i(new Error("网络连接错误"))})})}};a.requestCount=0,a.lastRequestTime=0;let r=a;const c=class{static init(){if(this.initialized)return
;this.overlay=document.createElement("div"),
this.overlay.style.cssText="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999; display:none; flex-direction:column; justify-content:center; align-items:center;",
this.largeImg=document.createElement("img"),this.largeImg.style.cssText="max-width: 90%; max-height: 85%; object-fit: contain; cursor: pointer;"
;const t=document.createElement("div")
;t.style.cssText="position: absolute; top: 50%; left: 0; right: 0; display: flex; justify-content: space-between; transform: translateY(-50%); pointer-events: none; padding: 0 15px; box-sizing: border-box;",
this.prevButton=this.createNavButton("<"),this.nextButton=this.createNavButton(">"),t.append(this.prevButton,this.nextButton),
this.counter=document.createElement("div"),this.counter.style.cssText="color: white; font-size: 16px; margin-top: 10px;"
;const e=this.createNavButton("×");e.style.cssText+="position:absolute; top:10px; right:10px; font-size:24px;",
this.overlay.append(this.largeImg,t,this.counter,e),document.body.appendChild(this.overlay),this.addEventListeners(),this.initialized=!0}
static createNavButton(t){const e=document.createElement("button");return e.textContent=t,
e.style.cssText="background: rgba(0,0,0,0.5); color: white; border: none; font-size: 30px; padding: 10px 15px; cursor: pointer; pointer-events: auto; user-select: none;",
e}static addEventListeners(){this.prevButton.onclick=t=>{t.stopPropagation(),this.updateImage(this.currentIndex-1)},this.nextButton.onclick=t=>{
t.stopPropagation(),this.updateImage(this.currentIndex+1)},this.overlay.querySelector('button[style*="top:10px"]')?.addEventListener("click",t=>{
t.stopPropagation(),this.close()}),this.overlay.onclick=()=>this.close(),this.largeImg.onclick=t=>t.stopPropagation(),
document.addEventListener("keydown",t=>{
"none"!==this.overlay.style.display&&("ArrowLeft"===t.key?this.updateImage(this.currentIndex-1):"ArrowRight"===t.key?this.updateImage(this.currentIndex+1):"Escape"===t.key&&this.close())
})}static updateImage(t){t<0||t>=this.imageUrls.length||(this.currentIndex=t,this.largeImg.src=this.imageUrls[t],
this.counter.textContent=`${t+1} / ${this.imageUrls.length}`,this.prevButton.style.visibility=0===t?"hidden":"visible",
this.nextButton.style.visibility=t===this.imageUrls.length-1?"hidden":"visible")}static show(t,e){this.initialized||this.init(),this.imageUrls=t,
this.overlay.style.display="flex",this.updateImage(e)}static close(){this.overlay.style.display="none"}static isValidPreviewData(t){
return t&&"object"==typeof t&&"number"==typeof t.size}static async verify(t,e){const i=s.get(t);if(i&&this.isValidPreviewData(i))return void 0,
DomManager.displayPreviewInfo(i,e),void 0
;void 0,e.textContent="验车中...",e.style.cssText="color: #17a2b8; font-size: 12px; margin-top: 5px; text-align: center;";try{
const i=await r.fetchPreviewInfo(t);if(void 0,i?.name&&i.size>0&&!i.error)s.set(t,i),DomManager.displayPreviewInfo(i,e);else{
const n=i?.name||"获取信息失败(内容不存在或被限制)";void 0,DomManager.showRetryUI(e,t,n)}}catch(n){void 0,DomManager.showRetryUI(e,t,n.message||"未知错误")}}}
;c.initialized=!1,c.imageUrls=[],c.currentIndex=0;let l=c;class DomManager{static adjustLayout(){
const t=document.querySelector(".col-md-6.left"),e=document.querySelector("#right-panel");t&&(t.classList.remove("col-md-6"),
t.classList.add("col-md-10")),e&&(e.style.display="none")}static displayMagnetAndVerify(t,e){const n=e.closest(".panel-footer");if(!n)return
;const o=document.createElement("div")
;o.className="magnet-link",o.style.cssText="margin-top:5px; word-break:break-all; cursor:pointer; background:#f8f9fa; padding:4px 8px; border-radius:3px;"
;const s=document.createElement("code");s.style.cssText="color:#28a745; font-family:monospace;",s.textContent=t,o.appendChild(s),o.title="点击复制磁力链接",
o.addEventListener("click",()=>{i(t);const e=s.textContent;s.textContent="已复制!",setTimeout(()=>{s.textContent=e},2e3)})
;const a=document.createElement("div");a.className="preview-placeholder",e.parentNode?e.parentNode.replaceChild(o,e):n.appendChild(o),
n.appendChild(a),l.verify(t,a)}static displayPreviewInfo(t,i){const n=i.parentNode;if(!n||n.querySelector(".preview-info-container"))return
;const o=document.createElement("div")
;o.className="preview-info-container",o.style.cssText="margin-top: 5px; border-top: 1px solid #eee; padding-top: 10px;"
;const{name:s,size:a,count:r,file_type:c,screenshots:d}=t,h=document.createElement("div")
;if(h.style.cssText="font-size: 13px; background: #f8f9fa; padding: 8px; border-radius: 4px; margin-bottom: 10px; line-height: 1.6;",
h.innerHTML=`\n      <div style="font-weight: bold; margin-bottom: 5px; word-break: break-all;" title="${s}">${s}</div>\n      <div><strong>文件大小:</strong> ${e(a)}</div>\n      <div><strong>文件数量:</strong> ${r||"N/A"}</div>\n      <div><strong>文件类型:</strong> ${c||"N/A"}</div>`,
o.appendChild(h),d?.length){const t=d.map(t=>t.screenshot).filter(Boolean);if(t.length>0){const e=document.createElement("div")
;e.style.cssText="overflow-x: auto; white-space: nowrap; padding: 5px 0;",t.forEach((i,n)=>{const o=document.createElement("img");o.src=i,
o.style.cssText="height: 120px; border-radius: 3px; cursor: pointer; border: 1px solid #ddd; margin-right: 5px; vertical-align: top;",
o.title="点击查看大图",o.onclick=()=>l.show(t,n),e.appendChild(o)}),o.appendChild(e)}}else{const t=document.createElement("div");t.textContent="没有可用的预览图。",
t.style.cssText="font-style: italic; color: #6c757d; font-size: 12px; text-align: center; padding: 10px 0;",o.appendChild(t)}
n.contains(i)&&n.replaceChild(o,i)}static showRetryUI(t,e,i){const o=t.parentNode;if(!o)return;const s=document.createElement("div")
;s.className="preview-failure-container",s.style.cssText="margin-top: 5px;";const a=document.createElement("p")
;a.style.cssText="color: #dc3545; font-size: 12px; margin: 0 0 5px 0;",a.textContent=i;const r=n("重新验车","17a2b8");r.onclick=()=>l.verify(e,s),
s.append(a,r),o.contains(t)&&o.replaceChild(s,t)}}class FilterManager{static init(){this.modifyFilters(),setTimeout(()=>{
this.updateButtonTextFromURL()},100),new MutationObserver(t=>{t.some(t=>t.addedNodes.length>0)&&this.modifyFilters()}).observe(document.body,{
childList:!0,subtree:!0})}static updateButtonTextFromURL(){const t=new URLSearchParams(window.location.search).get("sofs")
;t?this.updateButtonText(t):this.updateButtonText("all")}static updateButtonText(t){const e=document.querySelector("#so-filesize-btn");if(!e)return
;let i="不限大小";if("all"===t)i="不限大小";else if(t.startsWith("lt")){const e=t.match(/lt(\d+)mb/);if(e){const t=parseInt(e[1])
;i=t>=1024?`小于${Math.round(t/1024)}GB`:`小于${t}MB`}}else if(t.startsWith("gt")&&!t.includes("-")){const e=t.match(/gt(\d+)mb/);if(e){
const t=parseInt(e[1]);i=t>=1024?`大于${Math.round(t/1024)}GB`:`大于${t}MB`}}else if(t.includes("-")){const e=t.split("-");if(2===e.length){
const t=e[0].match(/gt(\d+)mb/),n=e[1].match(/lt(\d+)mb/);if(t&&n){const e=parseInt(t[1]),o=parseInt(n[1])
;i=`${e>=1024?`${Math.round(e/1024)}GB`:`${e}MB`}-${o>=1024?`${Math.round(o/1024)}GB`:`${o}MB`}`}}}e.textContent=i}static modifyFilters(){
document.querySelectorAll(CONFIG.filter.dropdownSelector).forEach(t=>{"true"!==t.getAttribute("data-filter-modified")&&(this.modifySizeFilter(t),
t.setAttribute("data-filter-modified","true"))})}static updateOptionsFromURL(){const t=new URLSearchParams(window.location.search).get("sofs")
;if(!t||"all"===t)return;let e=-1,i="";if(t.startsWith("lt")&&!t.includes("-")){e=0;const n=t.match(/lt(\d+)mb/);if(n){const t=parseInt(n[1])
;i=t>=1024?`小于${Math.round(t/1024)}GB`:`小于${t}MB`}}else if(t.includes("-")){e=1;const n=t.split("-");if(2===n.length){
const t=n[0].match(/gt(\d+)mb/),e=n[1].match(/lt(\d+)mb/);if(t&&e){
const n=parseInt(t[1]),o=parseInt(e[1]),s=n>=1024?`${Math.round(n/1024)}GB`:`${n}MB`,a=o>=1024?`${Math.round(o/1024)}GB`:`${o}MB`;i=`${s}-${a}`}}
}else if(t.startsWith("gt")&&!t.includes("-")){e=2;const n=t.match(/gt(\d+)mb/);if(n){const t=parseInt(n[1])
;i=t>=1024?`大于${Math.round(t/1024)}GB`:`大于${t}MB`}}if(e>=0&&i){const t=document.querySelectorAll("a[onclick*=\"searchWithOption('filesize'\"]")
;let n=0;t.forEach(t=>{const o=t.getAttribute("onclick")||"";if(o.includes("searchWithOption('filesize',")&&!o.includes("'all'")){if(n===e){
const e=t.querySelector('span[style*="display: flex"]');if(e){const t=e.querySelector("span:first-child");t&&(t.textContent=i)}}n++}})}}
static modifySizeFilter(e){const i=e.querySelector('a[onclick*="filesize"]')?.closest("ul")
;i&&(i.querySelectorAll('a[onclick*="filesize"]:not([onclick*="\'all\'"])').forEach(t=>t.parentElement?.remove()),
CONFIG.filterOptions.forEach((e,n)=>{const o=document.createElement("li"),s=document.createElement("a"),a=GM_getValue(`custom_filter_${n}`,null)
;let r=e.text,c=t(e);a&&(r=a.text,c=a.param);const l=document.createElement("span");l.style.display="flex",l.style.justifyContent="space-between",
l.style.alignItems="center",l.style.width="100%";const d=document.createElement("span");d.textContent=r;const h=document.createElement("span")
;h.textContent=" +",h.title="点击自定义数值",h.style.color="#007bff",h.style.fontWeight="bold",h.style.cursor="pointer",h.style.marginLeft="10px",
l.appendChild(d),l.appendChild(h),s.style.cursor="pointer",s.appendChild(l),s.setAttribute("onclick",`searchWithOption('filesize', '${c}')`),
h.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),this.handleCustomInput(e,n,d,s)}),o.appendChild(s),i.appendChild(o)}),
this.updateOptionsFromURL())}static handleCustomInput(t,e,i,n){let o="",s="";const a=i.textContent||"";if("gt"===t.type){
const e=a.match(/大于(\d+(?:\.\d+)?)(MB|GB)/);s=e?`${e[1]}${e[2]}`:`${t.sizeGB||t.sizeMB}${t.sizeGB?"GB":"MB"}`,o="请输入最小大小 (如: 500MB 或 2GB):"
}else if("lt"===t.type){const e=a.match(/小于(\d+(?:\.\d+)?)(MB|GB)/);s=e?`${e[1]}${e[2]}`:`${t.sizeGB}GB`,o="请输入最大大小 (如: 10GB 或 5120MB):"
}else if("range"===t.type){const e=a.match(/(\d+(?:\.\d+)?)(MB|GB)-(\d+(?:\.\d+)?)(MB|GB)/)
;s=e?`${e[1]}${e[2]}-${e[3]}${e[4]}`:`${t.minMB?`${Math.round(t.minMB/1024)}GB`:"1GB"}-${t.maxGB?`${t.maxGB}GB`:"30GB"}`,o="请输入大小范围 (如: 2GB-50GB):"}
const r=prompt(o,s);if(r&&""!==r.trim())try{let o="",s="",a={};if("range"===t.type){const t=r.split("-")
;if(2!==t.length)throw new Error("范围格式错误，请使用如 2GB-50GB 的格式");const e=this.parseSize(t[0].trim()),i=this.parseSize(t[1].trim())
;if(e>=i)throw new Error("最小值应小于最大值");o=`gt${e}mb-lt${i}mb`,s=r.trim(),a={text:s,param:o,minValue:e,maxValue:i}}else{const e=this.parseSize(r.trim())
;o=`${t.type}${e}mb`,s="gt"===t.type?`大于${r.trim()}`:`小于${r.trim()}`,a={text:s,param:o,value:e}}GM_setValue(`custom_filter_${e}`,a),i.textContent=s,
n.setAttribute("onclick",`searchWithOption('filesize', '${o}')`);const c=new URL(window.location.href);c.searchParams.set("sofs",o),
c.searchParams.set("p","1"),window.location.href=c.toString()}catch(c){alert(`输入错误: ${c.message}`)}}static parseSize(t){
const e=t.match(/^(\d+(?:\.\d+)?)\s*(MB|GB)$/i);if(!e)throw new Error("格式错误，请使用如 500MB 或 2GB 的格式");const i=parseFloat(e[1]),n=e[2].toUpperCase()
;if(i<=0)throw new Error("大小必须大于0");return"GB"===n?Math.round(1024*i):Math.round(i)}}const d=class{static init(){void 0,this.injectBlockingCSS(),
this.processExistingContent(),new MutationObserver(t=>{t.forEach(t=>{t.addedNodes.forEach(t=>{if(t.nodeType===Node.ELEMENT_NODE){const e=t
;this.processNewElement(e)}})})}).observe(document.body,{childList:!0,subtree:!0})}static injectBlockingCSS(){const t=document.createElement("style")
;t.textContent='\n      /* 隐藏带"在线"标记的广告面板 */\n      .panel.panel-default.border-radius:has(.label.label-primary:contains("在线")) {\n        display: none !important;\n      }\n\n      /* 隐藏站点公告弹窗 */\n      .h:has(.j:contains("站点公告")) {\n        display: none !important;\n      }\n\n      /* 隐藏黑色遮罩层 */\n      #K.g {\n        display: none !important;\n      }\n\n      /* 通用广告拦截规则 */\n      .label.label-primary:contains("在线") {\n        display: none !important;\n      }\n    ',
document.head.appendChild(t)}static processExistingContent(){let t=0;t+=this.removeOnlineAds(),t+=this.removePopups(),t+=this.removeMaskLayers(),t>0}
static processNewElement(t){let e=!1;if(t.matches&&t.matches(CONFIG.site.panelSelector)&&this.isOnlineAd(t)&&(this.blockElement(t,"广告面板"),e=!0),
t.matches&&t.matches(".h")){const i=t.querySelector(".j");i&&"站点公告"===i.textContent?.trim()&&(this.blockElement(t,"站点公告弹窗"),e=!0)}
t.matches&&t.matches("#K.g")&&(this.blockElement(t,"黑色遮罩层"),"function"==typeof window.stop&&window.stop(),e=!0),
e||t.querySelectorAll(CONFIG.site.panelSelector).forEach(t=>{this.isOnlineAd(t)&&this.blockElement(t,"广告面板")})}static removeOnlineAds(){
const t=document.querySelectorAll(CONFIG.site.panelSelector);let e=0;return t.forEach(t=>{
this.isOnlineAd(t)&&!t.hasAttribute("data-ad-removed")&&(this.blockElement(t,"广告面板"),e++)}),e}static removePopups(){
const t=document.querySelectorAll(".j");let e=0;return t.forEach(t=>{if("站点公告"===t.textContent?.trim()){const i=t.closest(".h")
;i&&!i.hasAttribute("data-popup-removed")&&(this.blockElement(i,"站点公告弹窗"),e++)}}),e}static removeMaskLayers(){
const t=document.querySelectorAll("#K.g");let e=0;return t.forEach(t=>{t.hasAttribute("data-mask-removed")||(this.blockElement(t,"黑色遮罩层"),
"function"==typeof window.stop&&window.stop(),e++)}),e}static isOnlineAd(t){const e=t.querySelector(".label.label-primary")
;return!(!e||"在线"!==e.textContent?.trim())}static blockElement(t,e){t.style.display="none",t.setAttribute("data-blocked","true"),this.blockedCount++}}
;d.blockedCount=0;let h=d;class MagnetLemonScript{static main(){void 0,window.location.hostname.includes("lemongb.top")&&(AntiDetectionManager.init(),
h.init(),"loading"===document.readyState?document.addEventListener("DOMContentLoaded",this.initialize.bind(this)):this.initialize())}
static initialize(){void 0,AntiDetectionManager.clearRestrictionCookies(),AntiDetectionManager.clearLocalStorageRestrictions(),
AntiDetectionManager.clearSessionStorageRestrictions(),l.init(),FilterManager.init(),DomManager.adjustLayout(),this.processPanels(),
new MutationObserver(t=>{void 0,t.some(t=>t.addedNodes.length>0)&&this.processPanels()}).observe(document.body,{childList:!0,subtree:!0})}
static processPanels(){const t=document.querySelectorAll(`${CONFIG.site.panelSelector}:not([data-processed])`);t.length>0,0,t.forEach(t=>{
t.setAttribute("data-processed","true"),this.addOrDisplay(t)})}static addOrDisplay(t){
const e=t.querySelector(CONFIG.site.detailLinkSelector),i=t.querySelector(CONFIG.site.containerSelector);if(!e||!i)return void 0,void 0;const s=e.href
;if(i.querySelector(".magnet-button, .magnet-link"))return;const a=o.get(s);if(a){void 0;const t=document.createElement("span");i.appendChild(t),
DomManager.displayMagnetAndVerify(a,t)}else{const t=n("获取磁力");t.addEventListener("click",()=>this.handleFetchButtonClick(s,t)),i.appendChild(t)}}
static async handleFetchButtonClick(t,e){void 0,e.textContent="获取中...",e.disabled=!0;try{const i=await r.fetchMagnetLink(t)
;if(!i)throw new Error("获取失败 (link not found in response)");void 0,o.set(t,i),DomManager.displayMagnetAndVerify(i,e)}catch(i){void 0,
e.textContent="重试获取",e.disabled=!1}}}MagnetLemonScript.main()})();
