// ==UserScript==
// @name         热舞驿站-优化
// @version      1.0.4
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  在列表页显示和操作帖子的阅读状态
// @match        https://www.rewuyizhan1.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rewuyizhan1.com
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @grant        unsafeWindow
// @connect      www.rewuyizhan1.com
// @connect      api.github.com
// @connect      pan.baidu.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539805/%E7%83%AD%E8%88%9E%E9%A9%BF%E7%AB%99-%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539805/%E7%83%AD%E8%88%9E%E9%A9%BF%E7%AB%99-%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function(){"use strict";const CONFIG={BASE_URL:"https://www.rewuyizhan1.com",READ_HISTORY:{COLLECT_ICON_UNCOLLECTED:"icon-check-circle-o",
COLLECT_ICON_COLLECTED:"icon-check-circle",COLLECT_TEXT_UNCOLLECTED:"未读",COLLECT_TEXT_COLLECTED:"✔ 已读",COLLECT_COLOR_UNCOLLECTED:"#999",
COLLECT_COLOR_COLLECTED:"#4CAF50",COLLECT_BUTTON_STYLE:{padding:"2px 6px",backgroundColor:"rgba(0, 0, 0, 0.1)",color:"#999",borderRadius:"3px",
fontSize:"11px",textDecoration:"none"},GM_COLLECTION_KEY:"rewuyizhan_collected_posts",GM_GITHUB_TOKEN_KEY:"rewuyizhan_github_token",
GM_GIST_ID_KEY:"rewuyizhan_gist_id",GM_CLOUD_COUNT_KEY:"rewuyizhan_cloud_count",GM_BUTTONS_POS_KEY:"rewuyizhan_buttons_position",
GIST_FILENAME:"rewuyizhan_collections.json",LIST_PAGE_POSTS_CONTAINER:"#posts.posts.grids",LIST_PAGE_POST_ITEM:".post.grid",
MAIN_PAGE_POST_ITEM:".container .grids.clearfix .post.grid",POST_TITLE_LINK:'.con h3[itemprop="name headline"] > a',POST_CON_DIV:".con",
POST_H3_TITLE:'h3[itemprop="name headline"]',POST_CAT_DIV:".cat",CONTENT_PAGE_TITLE:"h1.article-title",
CONTENT_PAGE_ORIGINAL_BUTTON:"div.article-act a.article-collect",CONTENT_PAGE_ORIGINAL_BUTTON_CONTAINER:"div.article-act",
BUTTON_CLASS:"collect-button",BUTTON_CLASS_COLLECTED:"collected",BUTTON_TEXT_COLLECTED:"✔ 已读",BUTTON_TEXT_UNCOLLECTED:"未读",
BUTTON_ICON_CLASS_COLLECTED:"icon-check-circle",BUTTON_ICON_CLASS_UNCOLLECTED:"icon-check-circle-o",BUTTON_STYLE_LIST:{padding:"2px 6px",
backgroundColor:"rgba(0, 0, 0, 0.1)",color:"#999",borderRadius:"3px",fontSize:"11px",textDecoration:"none"},BUTTON_STYLE_UNCOLLECTED:{color:"#999",
backgroundColor:"transparent"},BUTTON_STYLE_COLLECTED:{color:"#4CAF50",backgroundColor:"transparent",border:"1px solid #ccc"}},LINK_EXTRACTOR:{
ARTICLE_HEADER:".article-header",ARTICLE_TITLE:"h1.article-title",ARTICLE_META:".article-meta",DOWNLOAD_IFRAME_FINAL_LINK:".msg a.link",
DOWNLOAD_IFRAME_EXTRACT_CODE:".msg p .erphpdown-code",DOWNLOAD_IFRAME_PASS_CODE:".hidden-content .erphpdown-code",
DOWNLOAD_IFRAME_PAYWALL:"#erphpdown-paybox",POST_ID_BTN_COLLECT:"a.article-collect[data-id]",POST_ID_BTN_ZAN:"a.article-zan[data-id]",
POST_ID_BTN_DOWNLOAD:"a.erphpdown-down-layui",CACHE_KEY_PREFIX:"link-getter-cache-"}};function t(t){return new Promise((e,n)=>{GM_xmlhttpRequest({
...t,onload:t=>{t.status>=200&&t.status<400?e(t):n(new Error(`HTTP Error: ${t.status} ${t.statusText}`))},onerror:t=>{void 0,
n(new Error(`网络请求失败: ${t.error||t.statusText||"未知错误"}`))}})})}function e(){const t=document.querySelector(CONFIG.LINK_EXTRACTOR.POST_ID_BTN_COLLECT)
;if(t?.dataset.id)return t.dataset.id;const e=document.querySelector(CONFIG.LINK_EXTRACTOR.POST_ID_BTN_ZAN);if(e?.dataset.id)return e.dataset.id
;const n=document.body.className.match(/postid-(\d+)/);if(n&&n[1])return n[1]
;const o=document.querySelector(CONFIG.LINK_EXTRACTOR.POST_ID_BTN_DOWNLOAD);if(o?.href){const t=new URLSearchParams(o.search)
;if(t.has("postid"))return t.get("postid")}const i=window.location.pathname.match(/\/(\d+)\.html/);return i&&i[1]?i[1]:null}const n=class{
static init(){if(this.isInitialized)return;const t=document.querySelector(CONFIG.LINK_EXTRACTOR.ARTICLE_HEADER);t&&(this.injectUI(t),
this.isInitialized=!0)}static injectUI(t){const e=t.querySelector(CONFIG.LINK_EXTRACTOR.ARTICLE_TITLE);if(!e)return
;const n=document.createElement("div");n.className="link-getter-container";const o=document.createElement("button");o.id="get-link-btn",
o.textContent="获取链接";const i=document.createElement("div");i.id="link-result-div",i.style.display="none",n.appendChild(o),n.appendChild(i)
;const s=t.querySelector(CONFIG.LINK_EXTRACTOR.ARTICLE_META);s?s.insertAdjacentElement("afterend",n):e.parentNode?.insertBefore(n,e.nextSibling),
this.applyStyles(),this.checkCache(),o.addEventListener("click",this.handleGetLinkClick.bind(this))}static async handleGetLinkClick(n){
const o=n.target;o.disabled=!0,o.textContent="⏳ 正在获取中...",o.style.backgroundColor="#555";const i=document.getElementById("link-result-div")
;i.style.display="none",i.innerHTML="";try{const n=e();if(!n)throw new Error("无法找到 Post ID。");const i=`${CONFIG.LINK_EXTRACTOR.CACHE_KEY_PREFIX}${n}`
;localStorage.removeItem(i);const s=`/wp-content/plugins/erphpdown/download.php?postid=${n}&iframe=1`,r=(await t({method:"GET",url:s
})).responseText,a=(new DOMParser).parseFromString(r,"text/html"),c=a.querySelector(CONFIG.LINK_EXTRACTOR.DOWNLOAD_IFRAME_FINAL_LINK),l=a.querySelector(CONFIG.LINK_EXTRACTOR.DOWNLOAD_IFRAME_EXTRACT_CODE),d=a.querySelector(CONFIG.LINK_EXTRACTOR.DOWNLOAD_IFRAME_PASS_CODE)
;if(!c){if(a.querySelector(CONFIG.LINK_EXTRACTOR.DOWNLOAD_IFRAME_PAYWALL))throw new Error("需要购买或VIP权限。");throw new Error("无法在下载页面中找到最终下载链接。")}
const u=c.getAttribute("href"),p=l?l.textContent?.trim():"无",h=d?d.textContent?.trim():"无",g=`/wp-content/plugins/erphpdown/${u}`,T=(await t({
method:"GET",url:g,headers:{Referer:s}})).finalUrl;this.displayResult(T,p??"无",h??"无");const _={link:T,code:p,pass:h}
;localStorage.setItem(i,JSON.stringify(_)),o.textContent="✅ 获取成功！",o.style.backgroundColor="#4CAF50",setTimeout(()=>{o.disabled=!1,
o.textContent="获取链接",o.style.backgroundColor=""},1500)}catch(s){void 0,this.displayError(s.message),o.disabled=!1,o.textContent="❌ 获取失败, 请重试",
o.style.backgroundColor="#F44336"}}static checkCache(){const t=e();if(!t)return
;const n=`${CONFIG.LINK_EXTRACTOR.CACHE_KEY_PREFIX}${t}`,o=localStorage.getItem(n);if(o)try{const t=JSON.parse(o)
;this.displayResult(t.link,t.code,t.pass)}catch(i){localStorage.removeItem(n)}}static displayResult(t,e,n){
const o=document.getElementById("link-result-div")
;o&&(o.style.display="block",o.innerHTML=`\n        <div class="result-item">\n            <span class="result-label">分享链接:</span>\n            <input type="text" class="result-input" value="${t}" readonly>\n            <button class="copy-btn" data-copy="${t}">复制</button>\n            <a href="${t}" target="_blank" class="open-link-btn">打开</a>\n        </div>\n        <div class="result-item">\n            <span class="result-label">提取码:</span>\n            <input type="text" class="result-input short" value="${e}" readonly>\n            <button class="copy-btn" data-copy="${e}">复制</button>\n        </div>\n        <div class="result-item">\n            <span class="result-label">解压密码:</span>\n            <input type="text" class="result-input" value="${n}" readonly>\n            <button class="copy-btn" data-copy="${n}">复制</button>\n        </div>\n    `,
o.querySelectorAll(".copy-btn").forEach(t=>{t.addEventListener("click",t=>{const e=t.target,n=e.dataset.copy
;n&&navigator.clipboard.writeText(n).then(()=>{const t=e.textContent;e.textContent="已复制!",setTimeout(()=>{e.textContent=t},1500)})})}))}
static displayError(t){const e=document.getElementById("link-result-div");e&&(e.style.display="block",
e.innerHTML=`<div class="error-message">错误: ${t}</div>`)}static applyStyles(){
GM_addStyle("\n        #get-link-btn {\n            background-color: #555; color: white; border: none; padding: 6px 12px;\n            font-size: 14px; font-weight: normal; border-radius: 4px; cursor: pointer;\n            margin: 10px 0; transition: background-color 0.3s;\n        }\n        #get-link-btn:hover { background-color: #ff5f33; }\n        #get-link-btn:disabled { background-color: #ccc; cursor: not-allowed; }\n        #link-result-div {\n            border: 2px dashed #ff5f33; border-radius: 5px; padding: 15px;\n            margin: 10px 0; font-size: 14px;\n        }\n        .link-getter-container { margin: 15px 0; }\n        .result-item { display: flex; align-items: center; margin-bottom: 10px; }\n        .result-item:last-child { margin-bottom: 0; }\n        .result-label { font-weight: bold; color: #333; width: 80px; flex-shrink: 0; }\n        .result-input {\n            flex-grow: 1; padding: 5px 8px; border: 1px solid #ccc; border-radius: 3px;\n            font-size: 14px; margin-right: 10px;\n        }\n        .result-input.short { flex-grow: 0; width: 100px; }\n        .copy-btn, .open-link-btn {\n            padding: 5px 10px; border: 1px solid #ccc; border-radius: 3px;\n            background-color: #f0f0f0; cursor: pointer; text-decoration: none;\n            color: #333; font-size: 14px; white-space: nowrap;\n        }\n        .copy-btn:hover, .open-link-btn:hover { background-color: #e0e0e0; }\n        .open-link-btn { background-color: #4CAF50; color: white; border-color: #4CAF50; margin-left: 5px; }\n        .error-message { color: #F44336; font-weight: bold; text-align: center; padding: 10px; }\n    ")
}};n.isInitialized=!1;let o=n;const i=class{static initContainer(){return this.container||(this.container=document.createElement("div"),
this.container.id="toast-container",Object.assign(this.container.style,{position:"fixed",top:"20px",right:"20px",zIndex:"99999",pointerEvents:"none"
}),document.body.appendChild(this.container)),this.container}static show(t,e="info",n=4e3){
const o=this.initContainer(),i=document.createElement("div");i.textContent=t,Object.assign(i.style,{padding:"12px 20px",marginBottom:"10px",
borderRadius:"6px",color:"white",boxShadow:"0 2px 12px rgba(0,0,0,0.15)",opacity:"0",transform:"translateX(100%)",transition:"all 0.3s ease-out",
fontSize:"14px",fontWeight:"400",maxWidth:"300px",wordWrap:"break-word",pointerEvents:"auto",cursor:"pointer"});const s={success:"#10B981",
error:"#EF4444",warning:"#F59E0B",info:"#3B82F6"};return i.style.backgroundColor=s[e],i.addEventListener("click",()=>{this.removeToast(i)}),
o.appendChild(i),setTimeout(()=>{i.style.opacity="1",i.style.transform="translateX(0)"},10),n>0&&setTimeout(()=>{this.removeToast(i)},n),i}
static removeToast(t){t.style.opacity="0",t.style.transform="translateX(100%)",setTimeout(()=>{t.parentNode&&t.remove()},300)}static success(t,e=4e3){
return this.show(t,"success",e)}static error(t,e=5e3){return this.show(t,"error",e)}static warning(t,e=4e3){return this.show(t,"warning",e)}
static info(t,e=3e3){return this.show(t,"info",e)}};i.container=null;let s=i;class Storage{static get(t,e=null){try{const n=GM_getValue(t)
;if(null==n)return e;try{return JSON.parse(n)}catch{return n}}catch(n){return void 0,e}}static set(t,e){try{const n=JSON.stringify(e)
;return GM_setValue(t,n),!0}catch(n){return void 0,!1}}static delete(t){try{return GM_deleteValue(t),!0}catch(e){return void 0,!1}}static listKeys(){
try{return GM_listValues()}catch(t){return void 0,[]}}static migrateFromLocalStorage(t,e=!0){try{const n=localStorage.getItem(t);if(null!==n){try{
const e=JSON.parse(n);this.set(t,e)}catch{GM_setValue(t,n)}return e&&localStorage.removeItem(t),!0}return!1}catch(n){return void 0,!1}}}class GistAPI{
static async request(t,config){if(!t)throw new Error("GitHub Token 未提供");const e={...config,headers:{...config.headers,Authorization:`token ${t}`,
Accept:"application/vnd.github.v3+json"}};return new Promise((t,n)=>{GM_xmlhttpRequest({...e,onload:e=>{e.status>=200&&e.status<300?t(e):n(e)},
onerror:t=>n(t)})})}static async getFile(t,e,n){if(!e)throw new Error("Gist ID 未提供");try{const o=await this.request(t,{method:"GET",
url:`https://api.github.com/gists/${e}`}),i=JSON.parse(o.responseText);return i.files&&i.files[n]?i.files[n]:null}catch(o){throw o}}
static async updateFile(t,e,n,o){if(!e)throw new Error("Gist ID 未提供");try{return await this.request(t,{method:"PATCH",
url:`https://api.github.com/gists/${e}`,headers:{"Content-Type":"application/json"},data:JSON.stringify({files:{[n]:{content:o}}})}),!0}catch(i){
throw i}}static async createGist(t,e,n,o,i=!1){try{const s=await this.request(t,{method:"POST",url:"https://api.github.com/gists",headers:{
"Content-Type":"application/json"},data:JSON.stringify({description:o,public:i,files:{[e]:{content:n}}})});return JSON.parse(s.responseText).id
}catch(s){throw s}}static async deleteGist(t,e){if(!e)throw new Error("Gist ID 未提供");try{return await this.request(t,{method:"DELETE",
url:`https://api.github.com/gists/${e}`}),!0}catch(n){throw n}}}class GistSync{static getGitHubToken(){
return Storage.get(CONFIG.READ_HISTORY.GM_GITHUB_TOKEN_KEY,"")||""}static getGistId(){return Storage.get(CONFIG.READ_HISTORY.GM_GIST_ID_KEY,"")||""}
static async getGistFile(t=!1){const e=this.getGitHubToken(),n=this.getGistId();if(!e)return t||s.show("GitHub Token 未配置","error"),null
;if(!n)return t||s.show("Gist ID 未配置","error"),null;try{const o=await GistAPI.getFile(e,n,CONFIG.READ_HISTORY.GIST_FILENAME)
;return o?(t||s.show("Gist数据获取成功","success"),o):(t||s.show(`Gist 内未找到备份文件: ${CONFIG.READ_HISTORY.GIST_FILENAME}`,"warning"),null)}catch(o){
return t||s.show("获取Gist数据失败","error"),null}}static async updateGistFile(t,e=!1){const n=this.getGitHubToken(),o=this.getGistId()
;if(!n||!o)return e||s.show("GitHub Token 或 Gist ID 未配置","error"),!1;try{return await GistAPI.updateFile(n,o,CONFIG.READ_HISTORY.GIST_FILENAME,t),
e||s.show("Gist数据更新成功！","success"),!0}catch(i){return e||s.show("更新Gist数据失败","error"),!1}}static async createGistFile(t){const e=this.getGitHubToken()
;if(!e)return s.show("GitHub Token 未配置","error"),null;try{const n=await GistAPI.createGist(e,CONFIG.READ_HISTORY.GIST_FILENAME,t,"热舞驿站阅读记录备份",!1)
;return Storage.set(CONFIG.READ_HISTORY.GM_GIST_ID_KEY,n),s.show("Gist创建成功！ID已自动保存","success"),n}catch(n){return s.show("创建Gist失败","error"),null}}
static async uploadToGist(t=!1){if(!GistSync.getGitHubToken())return s.show("GitHub Token 未配置。请通过油猴菜单「⚙️ 配置Gist同步参数」进行设置。","error"),!1
;const e=Storage.get(CONFIG.READ_HISTORY.GM_COLLECTION_KEY,"[]")||"[]",n=new Set(JSON.parse(e));let o=null;t||(o=s.show("正在合并本地数据到Gist...","info",0))
;try{let e=!1,r=GistSync.getGistId(),a=n;if(r){const o=await GistSync.getGistFile(!0);let s=new Set;if(o&&o.content)try{const t=JSON.parse(o.content)
;Array.isArray(t)&&(s=new Set(t.map(String)))}catch(i){void 0}a=new Set([...n,...s]);const r=JSON.stringify(Array.from(a),null,2)
;e=await GistSync.updateGistFile(r,t)}else{const t=JSON.stringify(Array.from(n),null,2);await GistSync.createGistFile(t)&&(e=!0)}return o&&o.remove(),
e?(t||s.show(`数据合并成功！云端现有 ${a.size} 条记录`,"success"),Storage.set(CONFIG.READ_HISTORY.GM_COLLECTION_KEY,JSON.stringify(Array.from(a))),
Storage.set(CONFIG.READ_HISTORY.GM_CLOUD_COUNT_KEY,a.size),FloatingUI.updateCloudCount(a.size),FloatingUI.updateLocalCount(a.size),
!0):(t||s.show("上传到Gist失败。","error"),!1)}catch(r){return o&&o.remove(),t||"用户取消上传"===r.message||s.show("上传到Gist时发生错误。","error"),!1}}
static async forceUploadToGist(){if(!GistSync.getGitHubToken())return s.show("GitHub Token 未配置。","error"),!1
;const t=Storage.get(CONFIG.READ_HISTORY.GM_COLLECTION_KEY,"[]")||"[]",e=new Set(JSON.parse(t)),n=s.show("正在合并本地数据到Gist...","info",0);try{
let t=!1,i=GistSync.getGistId(),r=e;if(i){const n=await GistSync.getGistFile(!0);let i=new Set;if(n&&n.content)try{const t=JSON.parse(n.content)
;Array.isArray(t)&&(i=new Set(t.map(String)))}catch(o){void 0}r=new Set([...e,...i]);const s=JSON.stringify(Array.from(r),null,2)
;t=await GistSync.updateGistFile(s,!0)}else{const n=JSON.stringify(Array.from(e),null,2);await GistSync.createGistFile(n)&&(t=!0)}return n.remove(),
t?(Storage.set(CONFIG.READ_HISTORY.GM_COLLECTION_KEY,JSON.stringify(Array.from(r))),Storage.set(CONFIG.READ_HISTORY.GM_CLOUD_COUNT_KEY,r.size),
FloatingUI.updateCloudCount(r.size),FloatingUI.updateLocalCount(r.size),s.show(`数据合并成功！云端现有 ${r.size} 条记录`,"success"),!0):(s.show("合并上传失败。","error"),
!1)}catch(i){return n.remove(),s.show("合并上传时发生错误。","error"),!1}}static async forceDownloadFromGist(){
if(!GistSync.getGitHubToken()||!GistSync.getGistId())return s.show("GitHub Token或Gist ID未配置。","error"),void 0
;const t=s.show("正在合并云端数据到本地...","info",0);try{
const e=Storage.get(CONFIG.READ_HISTORY.GM_COLLECTION_KEY,"[]")||"[]",n=new Set(JSON.parse(e)),o=await GistSync.getGistFile(!0)
;if(!o||!o.content)return t.remove(),s.show("未找到云端数据文件。","error"),void 0
;const i=JSON.parse(o.content),r=new Set(Array.isArray(i)?i.map(String):[]),a=new Set([...n,...r])
;Storage.set(CONFIG.READ_HISTORY.GM_COLLECTION_KEY,JSON.stringify(Array.from(a))),Storage.set(CONFIG.READ_HISTORY.GM_CLOUD_COUNT_KEY,r.size),
FloatingUI.updateCloudCount(r.size),FloatingUI.updateLocalCount(a.size),t.remove(),s.show(`数据合并完成！本地现有 ${a.size} 条记录，将刷新页面应用更改。`,"success",3e3),
setTimeout(()=>window.location.reload(),1500)}catch(e){t.remove(),s.show("合并下载时发生错误。","error")}}}class FloatingUI{static init(){this.createButtons(),
this.applyStyles(),this.makeDraggable(),this.loadPosition()}static updateLocalCount(t){this.countButton&&(this.countButton.innerHTML=t.toString())}
static updateCloudCount(t){this.cloudButton&&(this.cloudButton.innerHTML=t.toString(),this.cloudButton.title=`云端已读记录数量: ${t}`)}static createButtons(){
const t=CONFIG.READ_HISTORY;this.countButton=this.createButton("rewuyizhan-count-button","0","本地已读记录数量 (可上下拖动)"),
document.body.appendChild(this.countButton);const e=Storage.get(t.GM_CLOUD_COUNT_KEY,"-")||"-"
;this.cloudButton=this.createButton("rewuyizhan-cloud-button",String(e),`云端已读记录数量: ${e}`),document.body.appendChild(this.cloudButton),
this.uploadButton=this.createButton("rewuyizhan-upload-button","↑","点击合并上传本地记录到Gist"),document.body.appendChild(this.uploadButton),
this.uploadButton.addEventListener("click",this.handleUploadClick.bind(this))}static createButton(t,e,n){const o=document.createElement("div")
;return o.id=t,o.className="rewuyizhan-btn",o.innerHTML=e,o.title=n,o}static async handleUploadClick(){
if(!this.uploadButton.classList.contains("uploading")){this.uploadButton.classList.add("uploading"),this.uploadButton.innerHTML="⏳";try{
if(!(await GistSync.uploadToGist(!1)))throw new Error("Upload failed");this.uploadButton.classList.remove("uploading"),
this.uploadButton.classList.add("success"),this.uploadButton.innerHTML="✓",setTimeout(()=>{this.uploadButton.classList.remove("success"),
this.uploadButton.innerHTML="↑"},2e3)}catch(t){this.uploadButton.classList.remove("uploading"),this.uploadButton.innerHTML="✗",setTimeout(()=>{
this.uploadButton.innerHTML="↑"},2e3)}}}static makeDraggable(){this.countButton.onmousedown=t=>{
const e=this.countButton.getBoundingClientRect(),n=e.top+e.height/2,o=t.clientY-n,i=t=>{
const e=t.clientY-o,n=window.innerHeight-e,i=Math.max(10,Math.min(n,window.innerHeight-10));this.countButton.style.bottom=`${i}px`,
this.uploadButton.style.bottom=`${i}px`,this.cloudButton.style.bottom=`${i+25}px`},s=()=>{document.removeEventListener("mousemove",i),
document.removeEventListener("mouseup",s),this.savePosition()};document.addEventListener("mousemove",i),document.addEventListener("mouseup",s),
t.preventDefault()}}static savePosition(){Storage.set(CONFIG.READ_HISTORY.GM_BUTTONS_POS_KEY,JSON.stringify({bottom:this.countButton.style.bottom}))}
static loadPosition(){const t=Storage.get(CONFIG.READ_HISTORY.GM_BUTTONS_POS_KEY);if(t)try{const e=JSON.parse(t);if(e.bottom){
const t=e.bottom.includes("px")?e.bottom:`${e.bottom}px`;this.countButton.style.bottom=t,this.uploadButton.style.bottom=t,
this.cloudButton.style.bottom=`${parseFloat(t)+25}px`}}catch(e){}}static applyStyles(){
GM_addStyle("\n            .rewuyizhan-btn {\n                position: fixed; color: white; padding: 3px 5px; font-size: 12px;\n                display: flex; justify-content: center; align-items: center;\n                user-select: none; text-align: center; line-height: 1;\n                z-index: 2147483647; opacity: 0.3; transition: opacity 0.2s ease;\n                min-width: 14px; will-change: transform, bottom;\n            }\n            .rewuyizhan-btn:hover { opacity: 1; }\n            #rewuyizhan-count-button {\n                bottom: 50%; left: 0; background-color: rgba(76, 175, 80, 0.8);\n                border-radius: 0 3px 3px 0; cursor: ns-resize; box-shadow: 1px 1px 3px rgba(0,0,0,0.2);\n                transform: translateY(0);\n            }\n            #rewuyizhan-cloud-button {\n                bottom: calc(50% + 25px); left: 0; background-color: rgba(156, 39, 176, 0.8);\n                border-radius: 0 3px 3px 0; box-shadow: 1px 1px 3px rgba(0,0,0,0.2);\n            }\n            #rewuyizhan-upload-button {\n                bottom: 50%; right: 0; background-color: rgba(33, 150, 243, 0.8);\n                border-radius: 3px 0 0 3px; cursor: pointer; box-shadow: -1px 1px 3px rgba(0,0,0,0.2);\n            }\n            #rewuyizhan-upload-button.uploading { background-color: #FFC107; cursor: wait; }\n            #rewuyizhan-upload-button.success { background-color: #4CAF50; }\n        ")
}}const r=class{static isListPage(){return!!document.querySelector("#posts.posts.grids")}static isMainPage(){
return!!document.querySelector(".container .grids.clearfix .post.grid")}static getLocalCount(){return this.collectedPostIdsCache.size}
static loadCollectedPostsFromGM(){const t=Storage.get(CONFIG.READ_HISTORY.GM_COLLECTION_KEY);if(t)try{
this.collectedPostIdsCache=new Set(JSON.parse(t))}catch(e){void 0,this.collectedPostIdsCache=new Set}else this.collectedPostIdsCache=new Set}
static saveCollectedPostsToGM(){try{const t=Array.from(this.collectedPostIdsCache)
;Storage.set(CONFIG.READ_HISTORY.GM_COLLECTION_KEY,JSON.stringify(t))}catch(t){void 0}}static updateButtonAppearance(t,e){
const n=t.querySelector("i"),o=t.querySelector("span")
;n&&(n.className="icon "+(e?CONFIG.READ_HISTORY.BUTTON_ICON_CLASS_COLLECTED:CONFIG.READ_HISTORY.BUTTON_ICON_CLASS_UNCOLLECTED)),
o&&(o.textContent=e?CONFIG.READ_HISTORY.BUTTON_TEXT_COLLECTED:CONFIG.READ_HISTORY.BUTTON_TEXT_UNCOLLECTED),
t.style.color=e?CONFIG.READ_HISTORY.BUTTON_STYLE_COLLECTED.color:CONFIG.READ_HISTORY.BUTTON_STYLE_UNCOLLECTED.color,
t.dataset.collected=e?"true":"false"}static refreshAllPostStatus(){document.querySelectorAll(".list-collect-btn[data-id]").forEach(t=>{
const e=t.dataset.id;if(e){const n=this.collectedPostIdsCache.has(e);this.updateButtonAppearance(t,n)}})
;const t=document.querySelector(".content-collect-btn[data-id]");if(t){const e=t.dataset.id;if(e){const n=this.collectedPostIdsCache.has(e)
;this.updateButtonAppearance(t,n)}}}static getIndividualPostCollectionState(t,e){const n=this.collectedPostIdsCache.has(t)
;return e&&this.updateButtonAppearance(e,n),n}static async handleCollectClick(t){t.preventDefault();const e=t.currentTarget,n=e.dataset.id
;if(!n)return;const o=this.collectedPostIdsCache.has(n);o?this.collectedPostIdsCache.delete(n):this.collectedPostIdsCache.add(n);const i=!o
;if(this.saveCollectedPostsToGM(),this.updateButtonAppearance(e,i),FloatingUI.updateLocalCount(this.collectedPostIdsCache.size),
!this.isListPage()&&!this.isMainPage()){const t=document.querySelector(`a.article-collect[data-id="${n}"]`);t&&(t.classList.toggle("active",i),
t.innerHTML=`<i class="icon ${i?CONFIG.READ_HISTORY.BUTTON_ICON_CLASS_COLLECTED:CONFIG.READ_HISTORY.BUTTON_ICON_CLASS_UNCOLLECTED}"></i>${i?CONFIG.READ_HISTORY.BUTTON_TEXT_COLLECTED:CONFIG.READ_HISTORY.BUTTON_TEXT_UNCOLLECTED}`)
}if(i){const t=this.collectedPostIdsCache.size,e=Storage.get(CONFIG.READ_HISTORY.GM_CLOUD_COUNT_KEY,0);if(null!==e&&t>=e+5){
const n=s.info(`本地记录比云端多 ${t-e} 条，开始自动同步...`,0);try{const t=await GistSync.uploadToGist(!0);n.remove(),
t?s.success("自动同步成功！"):s.error("自动同步失败，请检查控制台。")}catch(r){n.remove(),s.error("自动同步时发生错误，请检查控制台。")}}}}static initListPage(){
document.querySelectorAll(".post.grid").forEach(t=>{const e=t,n=e.dataset.id,o=e.querySelector('.con h3[itemprop="name headline"] > a')
;if(!n||!o||e.querySelector(".list-collect-btn"))return;const i=e.querySelector(".con"),s=i?i.querySelector('h3[itemprop="name headline"]'):null
;if(!i||!s)return void 0,void 0;const r=document.createElement("a");r.href="javascript:;",r.className="list-collect-btn",r.dataset.id=n,
r.title="点击未读/取消未读",
r.innerHTML=`<i class="icon ${CONFIG.READ_HISTORY.BUTTON_ICON_CLASS_UNCOLLECTED}"></i> <span>${CONFIG.READ_HISTORY.BUTTON_TEXT_UNCOLLECTED}</span>`,
Object.assign(r.style,CONFIG.READ_HISTORY.BUTTON_STYLE_LIST);const a=document.createElement("div");Object.assign(a.style,{display:"flex",
justifyContent:"space-between",alignItems:"center",marginBottom:"5px"});const c=i.querySelector(".cat");if(c){const t=c.cloneNode(!0)
;t.style.marginRight="auto",a.appendChild(t),c.style.display="none"}else{const t=document.createElement("div");t.style.marginRight="auto",
a.appendChild(t)}a.appendChild(r),i.insertBefore(a,s),this.getIndividualPostCollectionState(n,r),
r.addEventListener("click",this.handleCollectClick.bind(this))})}static initContentPage(){
const t=document.querySelector("h1.article-title"),e=document.querySelector("div.article-act a.article-collect");if(t&&e){const n=e.dataset.id
;if(!n)return;const o=this.getIndividualPostCollectionState(n);e.classList.contains("active")!==o&&(e.classList.toggle("active",o),
e.innerHTML=`<i class="icon ${o?CONFIG.READ_HISTORY.BUTTON_ICON_CLASS_COLLECTED:CONFIG.READ_HISTORY.BUTTON_ICON_CLASS_UNCOLLECTED}"></i>${o?CONFIG.READ_HISTORY.BUTTON_TEXT_COLLECTED:CONFIG.READ_HISTORY.BUTTON_TEXT_UNCOLLECTED}`)
;const i=document.createElement("a");i.href="javascript:;",i.dataset.id=n,i.classList.add("content-collect-btn"),Object.assign(i.style,{
fontSize:"16px",padding:"8px 12px",marginLeft:"15px",border:"1px solid #ccc",borderRadius:"5px",textDecoration:"none",display:"inline-flex",
alignItems:"center",verticalAlign:"middle"}),i.innerHTML='<i class="icon"></i><span style="margin-left:5px;"></span>',
this.updateButtonAppearance(i,o),i.addEventListener("click",this.handleCollectClick.bind(this));const s=document.createElement("span")
;Object.assign(s.style,{display:"inline-block",verticalAlign:"middle"}),s.appendChild(i),t.parentNode?.insertBefore(s,t.nextSibling)
;const r=document.querySelector("div.article-act");r&&(r.style.display="none")}else void 0}static addValueChangeListener(){
"function"==typeof GM_addValueChangeListener&&(GM_addValueChangeListener(CONFIG.READ_HISTORY.GM_COLLECTION_KEY,(t,e,n,o)=>{
o&&(this.loadCollectedPostsFromGM(),this.refreshAllPostStatus(),FloatingUI.updateLocalCount(this.collectedPostIdsCache.size))}),
GM_addValueChangeListener(CONFIG.READ_HISTORY.GM_CLOUD_COUNT_KEY,(t,e,n,o)=>{o&&FloatingUI.updateCloudCount(n??"-")}))}}
;r.collectedPostIdsCache=new Set;let a=r;class RightClickUnlocker{static init(){
["contextmenu","copy","cut","paste","selectstart","dragstart"].forEach(t=>{document.addEventListener(t,t=>{t.stopImmediatePropagation()},!0)})
;const t=document.createElement("style")
;t.innerHTML="\n            * {\n                -webkit-user-select: text !important;\n                -moz-user-select: text !important;\n                -ms-user-select: text !important;\n                user-select: text !important;\n            }\n        ",
document.head.appendChild(t)}}class SettingsPanel{static show(){const t=document.getElementById("rewuyizhan-settings-dialog");t&&t.remove()
;const e=document.createElement("div");e.id="rewuyizhan-settings-dialog";const n=document.createElement("div")
;n.id="rewuyizhan-settings-dialog-content",
n.innerHTML=`\n            <button id="rewuyizhan-settings-close-btn" title="关闭">&times;</button>\n            <h3>Gist同步配置</h3>\n            <div>\n                <label for="gist_token_input">GitHub Token:</label>\n                <input type="password" id="gist_token_input" value="${Storage.get(CONFIG.READ_HISTORY.GM_GITHUB_TOKEN_KEY,"")}" placeholder="例如 ghp_xxxxxxxxxxxxxxxxx">\n                <small>Token用于访问您的Gist，需要Gist读写权限</small>\n            </div>\n            <div>\n                <label for="gist_id_input">Gist ID:</label>\n                <input type="text" id="gist_id_input" value="${Storage.get(CONFIG.READ_HISTORY.GM_GIST_ID_KEY,"")}" placeholder="例如 123abc456def7890">\n                <small>Gist标识，留空时首次同步会自动创建</small>\n            </div>\n            <div class="rw-dialog-buttons">\n                <button id="settings_cancel_btn" class="rw-cancel-btn">取消</button>\n                <button id="settings_save_btn" class="rw-save-btn">保存</button>\n            </div>\n        `,
e.appendChild(n),document.body.appendChild(e),SettingsPanel.applyStyles();const o=t=>{"Escape"===t.key&&i()},i=()=>{
document.removeEventListener("keydown",o),e.remove()},r=async()=>{const t=document.getElementById("gist_token_input").value.trim()
;let e=document.getElementById("gist_id_input").value.trim();e=SettingsPanel.extractGistId(e),Storage.set(CONFIG.READ_HISTORY.GM_GITHUB_TOKEN_KEY,t),
Storage.set(CONFIG.READ_HISTORY.GM_GIST_ID_KEY,e),s.show("Gist同步参数已保存","success"),t&&e&&await SettingsPanel.tryFetchCloudData(),i()}
;document.getElementById("settings_save_btn")?.addEventListener("click",r),
document.getElementById("settings_cancel_btn")?.addEventListener("click",i),
document.getElementById("rewuyizhan-settings-close-btn")?.addEventListener("click",i),document.addEventListener("keydown",o)}static extractGistId(t){
if(!t)return"";const e=t.match(/github\.com\/[^\/]+\/([a-f0-9]+)/);return e?e[1]:(/^[a-f0-9]+$/.test(t),t)}static async tryFetchCloudData(){try{
const t=s.show("正在获取云端数据...","info",0),e=await GistSync.getGistFile(!0);if(e&&e.content){const n=JSON.parse(e.content);if(Array.isArray(n)){
const e=n.length;return Storage.set(CONFIG.READ_HISTORY.GM_CLOUD_COUNT_KEY,e),FloatingUI.updateCloudCount(e),t.remove(),
s.show(`云端数据获取成功！共 ${e} 条记录`,"success"),void 0}}t.remove(),s.show("云端暂无数据或数据格式错误","warning")}catch(t){void 0,s.show("获取云端数据失败，请检查配置","error")}}
static applyStyles(){
GM_addStyle('\n            #rewuyizhan-settings-dialog {\n                position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n                background-color: rgba(0,0,0,0.6); z-index: 10000;\n                display: flex; justify-content: center; align-items: center; font-family: sans-serif;\n            }\n            #rewuyizhan-settings-dialog-content {\n                background: white; padding: 25px; border-radius: 8px;\n                box-shadow: 0 5px 20px rgba(0,0,0,0.3); width: 400px; max-width: 90%;\n                position: relative;\n            }\n            #rewuyizhan-settings-dialog-content h3 { margin-top: 0; margin-bottom: 20px; text-align: center; color: #333; font-size: 1.3em; }\n            #rewuyizhan-settings-dialog-content label { display: block; margin-bottom: 5px; color: #555; font-size: 0.95em; }\n            #rewuyizhan-settings-dialog-content input[type="text"], #rewuyizhan-settings-dialog-content input[type="password"] {\n                width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; font-size: 1em;\n            }\n            #rewuyizhan-settings-dialog-content small { font-size:0.8em; color:#777; display:block; margin-top:4px; margin-bottom:12px; }\n            #rewuyizhan-settings-dialog-content .rw-dialog-buttons { text-align: right; margin-top: 15px; }\n            #rewuyizhan-settings-dialog-content .rw-dialog-buttons button { padding: 10px 18px; border-radius: 4px; border: none; cursor: pointer; font-size: 0.95em; transition: background-color 0.2s ease; }\n            #rewuyizhan-settings-dialog-content .rw-dialog-buttons .rw-cancel-btn { margin-right: 10px; background-color: #f0f0f0; color: #333; }\n            #rewuyizhan-settings-dialog-content .rw-dialog-buttons .rw-cancel-btn:hover { background-color: #e0e0e0; }\n            #rewuyizhan-settings-dialog-content .rw-dialog-buttons .rw-save-btn { background-color: #4CAF50; color: white; }\n            #rewuyizhan-settings-dialog-content .rw-dialog-buttons .rw-save-btn:hover { background-color: #45a049; }\n            #rewuyizhan-settings-close-btn { position: absolute; top: 10px; right: 10px; font-size: 1.5em; color: #aaa; cursor: pointer; background: none; border: none; padding: 5px; line-height: 1; }\n            #rewuyizhan-settings-close-btn:hover { color: #777; }\n        ')
}}(function(){RightClickUnlocker.init(),a.loadCollectedPostsFromGM(),a.addValueChangeListener()
;const t=window.location.href.startsWith(CONFIG.BASE_URL)&&!window.location.href.includes("/page/")&&!window.location.href.includes("/xiazaiqu/")&&!!document.querySelector("h1.article-title")
;if(!t&&document.querySelector(".post.grid")){a.initListPage()
;const t=document.querySelector("#posts.posts.grids")||document.querySelector(".posts")||document.body;t&&new MutationObserver(t=>{
t.some(t=>"childList"===t.type&&Array.from(t.addedNodes).some(t=>t.nodeType===Node.ELEMENT_NODE&&t.matches(".post.grid")))&&a.initListPage()
}).observe(t,{childList:!0})}async function e(){
const t=GM_getValue(CONFIG.READ_HISTORY.GM_GITHUB_TOKEN_KEY,""),e=GM_getValue(CONFIG.READ_HISTORY.GM_GIST_ID_KEY,"");if(t&&e)try{
const t=await GistSync.getGistFile(!0);if(t&&t.content){const e=JSON.parse(t.content);if(Array.isArray(e)){const t=e.length
;GM_setValue(CONFIG.READ_HISTORY.GM_CLOUD_COUNT_KEY,t),FloatingUI.updateCloudCount(t)}}}catch(n){}else{
const t=GM_getValue(CONFIG.READ_HISTORY.GM_CLOUD_COUNT_KEY,"-");FloatingUI.updateCloudCount(t)}}"complete"===document.readyState?(FloatingUI.init(),
FloatingUI.updateLocalCount(a.getLocalCount()),e()):window.addEventListener("load",()=>{FloatingUI.init(),
FloatingUI.updateLocalCount(a.getLocalCount()),e()}),t&&a.initContentPage(),document.querySelector(CONFIG.LINK_EXTRACTOR.ARTICLE_HEADER)&&o.init(),
GM_registerMenuCommand("⚙️ 配置Gist同步参数",()=>{SettingsPanel.show()}),GM_registerMenuCommand("⬆️ 本地合并到云端",async()=>{
const t=a.getLocalCount(),e=GM_getValue(CONFIG.READ_HISTORY.GM_CLOUD_COUNT_KEY,0)
;confirm(`将合并本地 ${t} 条记录到云端 ${e} 条，合并后云端将包含所有数据，确定吗？`)&&await GistSync.forceUploadToGist()}),GM_registerMenuCommand("⬇️ 云端合并到本地",async()=>{
const t=a.getLocalCount(),e=GM_getValue(CONFIG.READ_HISTORY.GM_CLOUD_COUNT_KEY,0)
;confirm(`将合并云端 ${e} 条记录到本地 ${t} 条，合并后本地将包含所有数据，确定吗？`)&&await GistSync.forceDownloadFromGist()})})()})();
