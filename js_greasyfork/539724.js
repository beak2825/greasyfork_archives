// ==UserScript==
// @name         谷歌搜图-增强
// @version      1.1.3
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  谷歌搜图增强功能，多站点搜索切换
// @match        https://www.google.com/search?*site%3A*
// @match        https://www.google.com/search?*site:*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      api.github.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539724/%E8%B0%B7%E6%AD%8C%E6%90%9C%E5%9B%BE-%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/539724/%E8%B0%B7%E6%AD%8C%E6%90%9C%E5%9B%BE-%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function(){"use strict";const CONFIG={DEBUG_MODE:!0,STORAGE:{GM_GITHUB_TOKEN_KEY:"googleSearchMultiSite_github_token",
GM_GIST_ID_KEY:"googleSearchMultiSite_gist_id",LOCALSTORAGE_SITES_KEY:"customSiteRowsText",LOCALSTORAGE_NAVBAR_POSITION_KEY:"navBarPosition",
LOCALSTORAGE_TEXTAREA_WIDTH_KEY:"googleSearchMultiSite_siteConfigTextareaWidth",
LOCALSTORAGE_TEXTAREA_HEIGHT_KEY:"googleSearchMultiSite_siteConfigTextareaHeight"},GIST:{FILENAME:"googleSearchMultiSite_sites-config.txt",
DESCRIPTION:"谷歌多站点搜索配置"},
DEFAULT_SITES:["暗香,anxiangge.cc 2nt,mm2211.blog.2nt.com 2048,hjd2048.com","Intporn,forum.intporn.com EC,eroticity.net SPS,sexpicturespass.com planetsuzy,planetsuzy.org"].join("\n"),
SELECTORS:{searchBox:"textarea[name='q']",submitButton:"button[type='submit']"},UI:{NAVBAR:{DEFAULT_POSITION:{top:"100px",left:"10px"},Z_INDEX:"10000"
},DIALOG:{Z_INDEX:"99999",SETTINGS_Z_INDEX:"10000"},NOTIFICATION:{Z_INDEX:"10001"}}};class ModuleManager{static getPageType(){
const t=window.location.href,e=this.hasRealSiteParam(t)
;return e&&(t.includes("udm=2")||t.includes("tbm=isch"))?"site-image-search":e?"site-search":t.includes("udm=48")?"image-search":"normal-search"}
static hasRealSiteParam(t){if(t.includes("site%3A"))return!0;const e=new URLSearchParams(new URL(t).search).get("q")||""
;return/\bsite:[^\s]+\b/.test(e)}static shouldEnableMultiSiteFeatures(){const t=this.getPageType();return"site-search"===t||"site-image-search"===t}
static getPageTypeDescription(){switch(this.getPageType()){case"site-image-search":return"站点图片搜索页面";case"site-search":return"多站点搜索页面"
;case"image-search":return"以图搜图页面";case"normal-search":return"普通搜索页面";default:return"未知页面类型"}}static logPageType(){void 0}}function t(t){
return t.split("\n").map(t=>t.trim().split(/\s+/).filter(Boolean).map(t=>{const[e,i]=t.split(",");return{name:e||"",url:i||""}
}).filter(t=>t.name&&t.url)).filter(t=>t.length>0)}function e(){
return(new URLSearchParams(window.location.search).get("q")||"").replace(/site:[^\s]+/g,"").trim()}function i(){
return document.querySelector(CONFIG.SELECTORS.searchBox)}class Storage{static get(t,e=null){try{const i=GM_getValue(t);if(null==i)return e;try{
return JSON.parse(i)}catch{return i}}catch(i){return void 0,e}}static set(t,e){try{const i=JSON.stringify(e);return GM_setValue(t,i),!0}catch(i){
return void 0,!1}}static delete(t){try{return GM_deleteValue(t),!0}catch(e){return void 0,!1}}static listKeys(){try{return GM_listValues()}catch(t){
return void 0,[]}}static migrateFromLocalStorage(t,e=!0){try{const i=localStorage.getItem(t);if(null!==i){try{const e=JSON.parse(i);this.set(t,e)
}catch{GM_setValue(t,i)}return e&&localStorage.removeItem(t),!0}return!1}catch(i){return void 0,!1}}}const n=class{static init(){
if(!i())return void 0,void 0;this.createNavBar(),this.setupDragEvents()}static createNavBar(){this.navBar||(this.navBar=document.createElement("div"),
this.applyNavBarStyles(),this.loadPosition(),this.createSiteButtons(),document.body.appendChild(this.navBar))}static applyNavBarStyles(){
this.navBar&&Object.assign(this.navBar.style,{position:"fixed",top:CONFIG.UI.NAVBAR.DEFAULT_POSITION.top,left:CONFIG.UI.NAVBAR.DEFAULT_POSITION.left,
zIndex:CONFIG.UI.NAVBAR.Z_INDEX,background:"#f8f8f8",border:"1px solid #ccc",padding:"3px 10px",borderRadius:"8px",
boxShadow:"0 4px 8px rgba(0, 0, 0, 0.2)",display:"flex",flexDirection:"column",gap:"5px",cursor:"move",transition:"all 0.3s ease"})}
static loadPosition(){if(!this.navBar)return;const t=Storage.get(CONFIG.STORAGE.LOCALSTORAGE_NAVBAR_POSITION_KEY,null)
;t&&(this.navBar.style.top=t.top,this.navBar.style.left=t.left)}static savePosition(){if(!this.navBar)return;const t={top:this.navBar.style.top,
left:this.navBar.style.left};Storage.set(CONFIG.STORAGE.LOCALSTORAGE_NAVBAR_POSITION_KEY,t)}static createSiteButtons(){
this.navBar&&t(Storage.get(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY,CONFIG.DEFAULT_SITES)??CONFIG.DEFAULT_SITES).forEach(t=>{
const e=document.createElement("div");e.style.display="flex",e.style.gap="5px",t.forEach(({name:t,url:i})=>{const n=document.createElement("button")
;n.textContent=t,this.applyButtonStyles(n),n.addEventListener("click",()=>{this.performSearch(i)}),e.appendChild(n)}),this.navBar.appendChild(e)})}
static applyButtonStyles(t){Object.assign(t.style,{padding:"2px 6px",cursor:"pointer",border:"1px solid #ccc",background:"#f8f8f8",borderRadius:"5px",
fontSize:"10px"})}static performSearch(t){const n=i();if(!n)return;const s=e();n.value=`${s} site:${t}`
;const o=document.querySelector(CONFIG.SELECTORS.submitButton);o&&o.click()}static setupDragEvents(){
this.navBar&&(this.navBar.addEventListener("mousedown",t=>{this.isDragging=!0,this.offsetX=t.clientX-this.navBar.offsetLeft,
this.offsetY=t.clientY-this.navBar.offsetTop,this.navBar.style.transition="none"}),window.addEventListener("mousemove",t=>{
this.isDragging&&this.navBar&&(this.navBar.style.left=t.clientX-this.offsetX+"px",this.navBar.style.top=t.clientY-this.offsetY+"px")}),
window.addEventListener("mouseup",()=>{this.isDragging&&this.navBar&&(this.isDragging=!1,this.savePosition(),
this.navBar.style.transition="all 0.3s ease")}))}static hideNavBar(){this.navBar&&(this.navBar.remove(),this.navBar=null)}static refreshButtons(){
this.navBar&&(this.navBar.innerHTML="",this.createSiteButtons())}static cleanup(){this.hideNavBar()}};n.navBar=null,n.isDragging=!1,n.offsetX=0,
n.offsetY=0;let s=n;const o=class{static initContainer(){return this.container||(this.container=document.createElement("div"),
this.container.id="toast-container",Object.assign(this.container.style,{position:"fixed",top:"20px",right:"20px",zIndex:"99999",pointerEvents:"none"
}),document.body.appendChild(this.container)),this.container}static show(t,e="info",i=4e3){
const n=this.initContainer(),s=document.createElement("div");s.textContent=t,Object.assign(s.style,{padding:"12px 20px",marginBottom:"10px",
borderRadius:"6px",color:"white",boxShadow:"0 2px 12px rgba(0,0,0,0.15)",opacity:"0",transform:"translateX(100%)",transition:"all 0.3s ease-out",
fontSize:"14px",fontWeight:"400",maxWidth:"300px",wordWrap:"break-word",pointerEvents:"auto",cursor:"pointer"});const o={success:"#10B981",
error:"#EF4444",warning:"#F59E0B",info:"#3B82F6"};return s.style.backgroundColor=o[e],s.addEventListener("click",()=>{this.removeToast(s)}),
n.appendChild(s),setTimeout(()=>{s.style.opacity="1",s.style.transform="translateX(0)"},10),i>0&&setTimeout(()=>{this.removeToast(s)},i),s}
static removeToast(t){t.style.opacity="0",t.style.transform="translateX(100%)",setTimeout(()=>{t.parentNode&&t.remove()},300)}static success(t,e=4e3){
return this.show(t,"success",e)}static error(t,e=5e3){return this.show(t,"error",e)}static warning(t,e=4e3){return this.show(t,"warning",e)}
static info(t,e=3e3){return this.show(t,"info",e)}};o.container=null;let a=o;function r(t,e){{const t=document.getElementById(e);if(t)return t}
const i=document.createElement("style");return i.id=e,i.textContent=t,document.head.appendChild(i),i}class SettingsPanel{static show(){void 0
;const t=document.getElementById("googleSearchMultiSite-settings-dialog");t&&t.remove();const e=document.createElement("div")
;e.id="googleSearchMultiSite-settings-dialog";const i=document.createElement("div");i.id="googleSearchMultiSite-settings-dialog-content",
i.innerHTML=`\n      <button id="googleSearchMultiSite-settings-close-btn" title="关闭">&times;</button>\n      <h3>Gist 同步参数配置</h3>\n      <div>\n        <label for="gist_token_input_gsms">GitHub 个人访问令牌 (Token):</label>\n        <input type="password" id="gist_token_input_gsms" value="${Storage.get(CONFIG.STORAGE.GM_GITHUB_TOKEN_KEY,"")}" placeholder="例如 ghp_xxxxxxxxxxxxxxxxx">\n        <small>Token 用于授权访问您的Gist。需要 Gist 读写权限。</small>\n      </div>\n      <div>\n        <label for="gist_id_input_gsms">Gist ID:</label>\n        <input type="text" id="gist_id_input_gsms" value="${Storage.get(CONFIG.STORAGE.GM_GIST_ID_KEY,"")}" placeholder="例如 123abc456def7890">\n        <small>Gist ID 是备份用Gist的标识。若为空，首次上传时将自动创建并保存。</small>\n      </div>\n      <div class="rw-dialog-buttons">\n        <button id="settings_cancel_btn_gsms" class="rw-cancel-btn">取消</button>\n        <button id="settings_save_btn_gsms" class="rw-save-btn">保存配置</button>\n      </div>\n    `,
e.appendChild(i),document.body.appendChild(e),this.applyStyles();const n=t=>{"Escape"===t.key&&s()},s=()=>{document.removeEventListener("keydown",n),
e.remove()},o=()=>{const t=document.getElementById("gist_token_input_gsms").value.trim(),e=document.getElementById("gist_id_input_gsms").value.trim()
;Storage.set(CONFIG.STORAGE.GM_GITHUB_TOKEN_KEY,t),Storage.set(CONFIG.STORAGE.GM_GIST_ID_KEY,e);let i="Gist参数已保存!"
;t||e?t?e||(i="Gist ID已清空, Token已保存。"):i="Token已清空, Gist ID已保存。":i="Gist参数已清空。",a.show(i,"success"),s()},r=()=>{s(),a.show("参数设置已取消。","info")}
;document.getElementById("settings_save_btn_gsms")?.addEventListener("click",o),
document.getElementById("settings_cancel_btn_gsms")?.addEventListener("click",r),
document.getElementById("googleSearchMultiSite-settings-close-btn")?.addEventListener("click",r),document.addEventListener("keydown",n)}
static applyStyles(){
r(`\n      #googleSearchMultiSite-settings-dialog {\n        position: fixed; top: 0; left: 0; width: 100%; height: 100%;\n        background-color: rgba(0,0,0,0.6); z-index: ${CONFIG.UI.DIALOG.SETTINGS_Z_INDEX};\n        display: flex; justify-content: center; align-items: center; font-family: sans-serif;\n      }\n      #googleSearchMultiSite-settings-dialog-content {\n        background: white; padding: 25px; border-radius: 8px;\n        box-shadow: 0 5px 20px rgba(0,0,0,0.3); width: 400px; max-width: 90%;\n        position: relative;\n      }\n      #googleSearchMultiSite-settings-dialog-content h3 { margin-top: 0; margin-bottom: 20px; text-align: center; color: #333; font-size: 1.3em; }\n      #googleSearchMultiSite-settings-dialog-content label { display: block; margin-bottom: 5px; color: #555; font-size: 0.95em; }\n      #googleSearchMultiSite-settings-dialog-content input[type="text"], #googleSearchMultiSite-settings-dialog-content input[type="password"] {\n        width: 100%; padding: 10px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; margin-bottom: 0; font-size: 1em;\n      }\n      #googleSearchMultiSite-settings-dialog-content small { font-size:0.8em; color:#777; display:block; margin-top:4px; margin-bottom:12px; }\n      #googleSearchMultiSite-settings-dialog-content .rw-dialog-buttons { text-align: right; margin-top: 15px; }\n      #googleSearchMultiSite-settings-dialog-content .rw-dialog-buttons button { padding: 10px 18px; border-radius: 4px; border: none; cursor: pointer; font-size: 0.95em; transition: background-color 0.2s ease; }\n      #googleSearchMultiSite-settings-dialog-content .rw-dialog-buttons .rw-cancel-btn { margin-right: 10px; background-color: #f0f0f0; color: #333; }\n      #googleSearchMultiSite-settings-dialog-content .rw-dialog-buttons .rw-cancel-btn:hover { background-color: #e0e0e0; }\n      #googleSearchMultiSite-settings-dialog-content .rw-dialog-buttons .rw-save-btn { background-color: #4CAF50; color: white; }\n      #googleSearchMultiSite-settings-dialog-content .rw-dialog-buttons .rw-save-btn:hover { background-color: #45a049; }\n      #googleSearchMultiSite-settings-close-btn { position: absolute; top: 10px; right: 10px; font-size: 1.5em; color: #aaa; cursor: pointer; background: none; border: none; padding: 5px; line-height: 1; }\n      #googleSearchMultiSite-settings-close-btn:hover { color: #777; }\n    `,"googleSearchMultiSite-settings-styles")
}}class SiteConfigEditor{static show(){
const t=Storage.get(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY,CONFIG.DEFAULT_SITES)??CONFIG.DEFAULT_SITES,{row1:e,row2:i}=this.buildInitialRowTexts(t),n=document.createElement("div")
;this.applyMaskStyles(n);const o=document.createElement("div");this.applyDialogStyles(o);const r=document.createElement("div")
;r.textContent="自定义站点配置",r.style.fontWeight="bold",r.style.fontSize="18px",r.style.marginBottom="10px",o.appendChild(r)
;const c=document.createElement("div")
;c.textContent='面板固定为两行按钮：上面一行、下面一行。每个按钮用空格分隔，格式为 "名字,网址"（例如：暗香,anxiangge.cc 2nt,mm2211.blog.2nt.com）。\n在同一个框内随意换行不会增加新的一行按钮。',
c.style.fontSize="13px",c.style.color="#666",c.style.marginBottom="8px",c.style.whiteSpace="pre-line",o.appendChild(c)
;const l=document.createElement("div");l.textContent="第一行按钮：",l.style.fontSize="13px",l.style.margin="4px 0 4px",o.appendChild(l)
;const d=document.createElement("textarea");d.value=e,this.setupTextarea(d),o.appendChild(d);const u=document.createElement("div")
;u.textContent="第二行按钮：",u.style.fontSize="13px",u.style.margin="8px 0 4px",o.appendChild(u);const g=document.createElement("textarea");g.value=i,
this.setupTextarea(g),o.appendChild(g);const h=document.createElement("div");h.style.display="flex",h.style.justifyContent="flex-end",
h.style.gap="12px";const p=this.createButton("保存","#4caf50",()=>{const t=this.serializeRows(d.value,g.value)
;Storage.set(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY,t),this.saveTextareaSize(d),document.body.removeChild(n),s.refreshButtons(),
a.show("站点配置已保存！","success")});h.appendChild(p);const m=this.createButton("取消","#eee",()=>{this.saveTextareaSize(d),document.body.removeChild(n)})
;h.appendChild(m),o.appendChild(h),n.appendChild(o),document.body.appendChild(n)}static buildInitialRowTexts(e){
const i=t(e),n=t=>t.map(t=>`${t.name},${t.url}`).join(" ");if(0===i.length)return{row1:"",row2:""};if(1===i.length)return{row1:n(i[0]),row2:""}
;const s=i.slice(2).flat(),o=i[1].concat(s);return{row1:n(i[0]),row2:n(o)}}static applyMaskStyles(t){Object.assign(t.style,{position:"fixed",left:"0",
top:"0",width:"100vw",height:"100vh",background:"rgba(0,0,0,0.25)",zIndex:CONFIG.UI.DIALOG.Z_INDEX,display:"flex",alignItems:"center",
justifyContent:"center"})}static serializeRows(t,e){const i=t=>{const e=t.split(/\s+/).map(t=>t.trim()).filter(Boolean)
;return e.length?e.join(" "):null};return[i(t),i(e)].filter(t=>!!t).join("\n")}static applyDialogStyles(t){Object.assign(t.style,{background:"#fff",
borderRadius:"10px",boxShadow:"0 8px 32px rgba(0,0,0,0.18)",padding:"24px 24px 16px 24px",minWidth:"480px",maxWidth:"90vw",display:"flex",
flexDirection:"column",alignItems:"stretch"})}static setupTextarea(t){
const e=Storage.get(CONFIG.STORAGE.LOCALSTORAGE_TEXTAREA_WIDTH_KEY,null),i=Storage.get(CONFIG.STORAGE.LOCALSTORAGE_TEXTAREA_HEIGHT_KEY,null)
;Object.assign(t.style,{width:e||"100%",height:i||"240px",fontSize:"14px",padding:"10px",border:"1px solid #bbb",borderRadius:"6px",resize:"both",
overflow:"auto",marginBottom:"16px",fontFamily:"monospace,Consolas,Menlo"})}static createButton(t,e,i){const n=document.createElement("button")
;return n.textContent=t,Object.assign(n.style,{padding:"6px 18px",background:e,color:"#eee"===e?"#333":"#fff",border:"none",borderRadius:"5px",
fontSize:"15px",cursor:"pointer"}),n.onclick=i,n}static saveTextareaSize(t){Storage.set(CONFIG.STORAGE.LOCALSTORAGE_TEXTAREA_WIDTH_KEY,t.style.width),
Storage.set(CONFIG.STORAGE.LOCALSTORAGE_TEXTAREA_HEIGHT_KEY,t.style.height)}}class GistAPI{static async request(t,config){
if(!t)throw new Error("GitHub Token 未提供");const e={...config,headers:{...config.headers,Authorization:`token ${t}`,
Accept:"application/vnd.github.v3+json"}};return new Promise((t,i)=>{GM_xmlhttpRequest({...e,onload:e=>{e.status>=200&&e.status<300?t(e):i(e)},
onerror:t=>i(t)})})}static async getFile(t,e,i){if(!e)throw new Error("Gist ID 未提供");try{const n=await this.request(t,{method:"GET",
url:`https://api.github.com/gists/${e}`}),s=JSON.parse(n.responseText);return s.files&&s.files[i]?s.files[i]:null}catch(n){throw n}}
static async updateFile(t,e,i,n){if(!e)throw new Error("Gist ID 未提供");try{return await this.request(t,{method:"PATCH",
url:`https://api.github.com/gists/${e}`,headers:{"Content-Type":"application/json"},data:JSON.stringify({files:{[i]:{content:n}}})}),!0}catch(s){
throw s}}static async createGist(t,e,i,n,s=!1){try{const o=await this.request(t,{method:"POST",url:"https://api.github.com/gists",headers:{
"Content-Type":"application/json"},data:JSON.stringify({description:n,public:s,files:{[e]:{content:i}}})});return JSON.parse(o.responseText).id
}catch(o){throw o}}static async deleteGist(t,e){if(!e)throw new Error("Gist ID 未提供");try{return await this.request(t,{method:"DELETE",
url:`https://api.github.com/gists/${e}`}),!0}catch(i){throw i}}}class GistSync{static getGitHubToken(){
return Storage.get(CONFIG.STORAGE.GM_GITHUB_TOKEN_KEY,"")||""}static getGistId(){return Storage.get(CONFIG.STORAGE.GM_GIST_ID_KEY,"")||""}
static async getGistFile(){const t=this.getGitHubToken(),e=this.getGistId();if(!t)return void 0,null;if(!e)return void 0,null;try{
const i=await GistAPI.getFile(t,e,CONFIG.GIST.FILENAME);return i?(CONFIG.DEBUG_MODE,0,i):(CONFIG.DEBUG_MODE,0,null)}catch(i){
return 404===i.status?a.show("Gist 未找到，请检查Gist ID配置","warning",5e3):a.show(`获取Gist文件失败: ${i.statusText||"Unknown error"}`,"error"),null}}
static async updateGistFile(t){const e=this.getGitHubToken(),i=this.getGistId();if(!e||!i)return a.show("GitHub Token 或 Gist ID 未配置","error"),!1;try{
return await GistAPI.updateFile(e,i,CONFIG.GIST.FILENAME,t),CONFIG.DEBUG_MODE,!0}catch(n){
return a.show(`更新Gist文件失败: ${n.statusText||"Unknown error"}`,"error"),!1}}static async createGist(t){const e=this.getGitHubToken()
;if(!e)return a.show("GitHub Token 未配置","error"),null;try{const i=await GistAPI.createGist(e,CONFIG.GIST.FILENAME,t,CONFIG.GIST.DESCRIPTION,!1)
;return CONFIG.DEBUG_MODE,0,i}catch(i){return a.show(`创建Gist失败: ${i.statusText||"Unknown error"}`,"error"),null}}static async uploadToGist(){
if(!this.getGitHubToken())return a.show("GitHub Token 未配置。请通过油猴菜单「⚙️ 配置Gist同步参数」进行设置。","error"),void 0
;const t=Storage.get(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY,CONFIG.DEFAULT_SITES)||CONFIG.DEFAULT_SITES,e=this.getGistId(),i=a.show("上传配置到Gist中...","info",0)
;try{let n=!1,s=!1;if(e)n=await this.updateGistFile(t);else{const e=await this.createGist(t);e&&(Storage.set(CONFIG.STORAGE.GM_GIST_ID_KEY,e),n=!0,
s=!0)}i.remove(),n&&(s?a.show("新Gist已创建并自动保存！","success",7e3):a.show("配置已成功同步到Gist！","success"))}catch(n){i.remove()}}static async downloadFromGist(){
if(!this.getGitHubToken())return a.show("GitHub Token 未配置。请通过油猴菜单「⚙️ 配置Gist同步参数」进行设置。","error"),void 0
;if(!this.getGistId())return a.show("Gist ID 未配置。请通过油猴菜单「⚙️ 配置Gist同步参数」进行设置，或先上传一次。","warning",5e3),void 0;const t=a.show("从Gist下载配置中...","info",0)
;try{const e=await this.getGistFile();t.remove(),e&&e.content?(Storage.set(CONFIG.STORAGE.LOCALSTORAGE_SITES_KEY,e.content),s.refreshButtons(),
a.show("已从Gist下载并覆盖本地配置！","success",3e3)):a.show("从Gist下载配置失败，未找到有效内容。","error")}catch(e){t.remove(),a.show("从Gist下载时发生错误。","error")}}}
class GoogleMultiSiteSearchApp{static main(){
void 0,"loading"===document.readyState?document.addEventListener("DOMContentLoaded",this.initialize.bind(this)):this.initialize()}static initialize(){
try{const t=ModuleManager.getPageType();if("image-search"===t||"normal-search"===t)return CONFIG.DEBUG_MODE,0,void 0;this.registerMenuCommands(),
this.initializeModules(),setTimeout(()=>{ModuleManager.shouldEnableMultiSiteFeatures()&&s.init()},1e3),CONFIG.DEBUG_MODE}catch(t){void 0}}
static registerMenuCommands(){
ModuleManager.shouldEnableMultiSiteFeatures()&&"function"==typeof GM_registerMenuCommand?(GM_registerMenuCommand("⚙️ 配置Gist同步参数",()=>SettingsPanel.show()),
GM_registerMenuCommand("⬆️ 上传配置到 Gist",()=>GistSync.uploadToGist()),GM_registerMenuCommand("⬇️ 从 Gist 下载配置",()=>GistSync.downloadFromGist()),
GM_registerMenuCommand("⚙️ 设置站点",()=>SiteConfigEditor.show())):void 0}static initializeModules(){ModuleManager.logPageType(),
ModuleManager.shouldEnableMultiSiteFeatures(),"normal-search"===ModuleManager.getPageType()}static cleanup(){try{s.cleanup()}catch(t){void 0}}}
GoogleMultiSiteSearchApp.main()})();
