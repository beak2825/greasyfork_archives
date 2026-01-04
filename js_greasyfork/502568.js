// ==UserScript==
// @name         Nekto.me chat bot
// @namespace    https://github.com/Ciyoxe/nekto-auto
// @version      2024-08-04
// @description  Chat automation bot
// @author       Ciyoxe
// @match        https://nekto.me/chat/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502568/Nektome%20chat%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/502568/Nektome%20chat%20bot.meta.js
// ==/UserScript==

var m=Object.defineProperty;var b=(n,t,e)=>t in n?m(n,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[t]=e;var a=(n,t,e)=>(b(n,typeof t!="symbol"?t+"":t,e),e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const i of o)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function e(o){const i={};return o.integrity&&(i.integrity=o.integrity),o.referrerPolicy&&(i.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?i.credentials="include":o.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(o){if(o.ep)return;o.ep=!0;const i=e(o);fetch(o.href,i)}})();class c{constructor(){a(this,"listeners",new Set);a(this,"oneShots",new Set)}once(t){this.oneShots.add(t)}on(t){this.listeners.add(t)}off(t){this.listeners.delete(t),this.oneShots.delete(t)}emit(t){for(const e of this.listeners)e(t);for(const e of this.oneShots)e(t);this.oneShots.clear()}}class k{constructor(){a(this,"onLeavingToggle",new c);a(this,"onMessagingToggle",new c);a(this,"onSkippingToggle",new c);a(this,"onHotkeysToggle",new c);a(this,"onThemeToggle",new c);a(this,"onDataAccess",new c);a(this,"ui");this.ui=document.createElement("div"),Object.assign(this.ui.style,{margin:"0",padding:"10px",position:"fixed",top:"60px",width:"300px",height:"600px",borderRadius:"10px",zIndex:"2",flexDirection:"column",display:"flex",gap:"10px"}),this.ui.className="main_step chat-box",this.ui.innerHTML=`
        <button id="autoui-leaving"   class="btn btn-default">Завершение чатов ✗</button>
        <button id="autoui-messaging" class="btn btn-default">Отправка сообщений ✗</button>
        <button id="autoui-skipping"  class="btn btn-default">Переключение чатов ✗</button>
        <button id="autoui-hotkeys"   class="btn btn-default">Хоткеи ✗</button>
        <button id="autoui-theme"     class="btn btn-default">Темная тема ✗</button>
        <button id="autoui-data"      class="btn btn-default">Данные чатов</button>
        <br>
        <div id="autoui-status"></div>
        <br>
        <div id="autoui-debug" style="overflow-y: scroll; background: #0002; border-radius: 4px; padding: 4px; height: 100%;"></div>
        `,document.body.appendChild(this.ui),this.ui.querySelector("#autoui-leaving").onclick=t=>{this.onLeavingToggle.emit(u(t,"Завершение чатов"))},this.ui.querySelector("#autoui-messaging").onclick=t=>{this.onMessagingToggle.emit(u(t,"Отправка сообщений"))},this.ui.querySelector("#autoui-skipping").onclick=t=>{this.onSkippingToggle.emit(u(t,"Переключение чатов"))},this.ui.querySelector("#autoui-theme").onclick=t=>{this.onThemeToggle.emit(u(t,"Темная тема"))},this.ui.querySelector("#autoui-hotkeys").onclick=t=>{this.onHotkeysToggle.emit(u(t,"Хоткеи"))},this.ui.querySelector("#autoui-data").onclick=()=>{this.onDataAccess.emit()},this.ui.querySelector("#autoui-hotkeys").title=`
        ctrl + ➡ - Завершить чат
        ctrl + ⬆ - Откатить сохранение
        ctrl + ⬇ - Написать первым
        `,setInterval(()=>this.updatePosition(),1e3)}updatePosition(){const t=document.querySelector(".chat-box.col-xs-12");if(t){const e=t.getBoundingClientRect();this.ui.style.left=`${e.right+10}px`}else this.ui.style.left="",this.ui.style.right="50px"}setStatus(t){this.ui.querySelector("#autoui-status").innerHTML=t}setDebug(t){this.ui.querySelector("#autoui-debug").innerHTML=t}}function u(n,t){const e=n.target;return e.classList.contains("checked")?(e.textContent=t+" ✗",e.classList.remove("checked"),!1):(e.textContent=t+" ✓",e.classList.add("checked"),!0)}class y{constructor(){a(this,"checkpoints",[]);a(this,"wasChanges",!1);a(this,"nodes",[]);a(this,"path",[]);this.loadTree(),setInterval(()=>this.saveTree(),3e4),setInterval(()=>this.saveCheckpoint(),1e4)}saveCheckpoint(){this.wasChanges||this.checkpoints.length===0?(this.wasChanges=!1,this.checkpoints.push(JSON.stringify(this.nodes))):this.checkpoints.push(null),this.checkpoints.length>60&&this.checkpoints.shift()}saveTree(){localStorage.setItem("nekto-auto-chatTree",JSON.stringify({nodes:this.nodes}))}loadTree(){const t=localStorage.getItem("nekto-auto-chatTree");try{this.nodes=JSON.parse(t).nodes}catch{this.nodes=[]}this.wasChanges=!0}restoreCheckpoint(t){const e=Math.min(this.checkpoints.length-1,Math.round(t/1e4)),s=this.checkpoints.length-1-e;for(let o=s;o>=0;o--)if(this.checkpoints[o]!==null){console.log("RESTORED CHECKPOINT",w(JSON.stringify(this.nodes),this.checkpoints[o])),this.nodes=JSON.parse(this.checkpoints[o]),this.checkpoints=[],this.saveTree();return}}moveNext(t,e){const s=this.nextNodes;for(const i of s)if(i.self===e&&i.text.toUpperCase().trim()===t.toUpperCase().trim()){this.path.push(i);return}const o={self:e,text:t,children:[]};s.push(o),this.path.push(o),this.wasChanges=!0}reset(){this.path.length=0}get currentNode(){return this.path[this.path.length-1]??null}get nextNodes(){const t=this.path[this.path.length-1];return t?t.children:this.nodes}get depth(){return this.path.length}set data(t){this.nodes=t,this.wasChanges=!0}}function w(n,t){const e=n.length>t.length?n:t,s=n.length>t.length?t:n;let o=0,i=e.length-1;for(let r=0;r<s.length;r++)if(e[r]!==s[r]){o=r;break}for(let r=0;r<s.length;r++)if(e[e.length-1-r]!==s[s.length-1-r]){i=e.length-1-r;break}return e.slice(o,i+1)}class x{constructor(t){a(this,"messaging",!1);a(this,"leaving",!1);a(this,"skipping",!1);a(this,"plugin");a(this,"tree");a(this,"maxDepth",7);this.tree=new y,this.plugin=t,t.onStateChanged.on(({prev:e,curr:s})=>{s==="chat-finished-by-self"&&this.tree.currentNode&&this.tree.depth<this.maxDepth&&(this.tree.currentNode.dead=!0),e!=="chat-end-confirmation"&&s==="in-active-chat"&&this.tree.reset(),this.skipping&&((t.state.status==="chat-finished-by-self"||t.state.status==="chat-finished-by-nekto")&&t.state.nextChat(),t.state.status==="chat-end-confirmation"&&t.state.confirmExit())}),t.onNewMessage.on(({text:e,self:s})=>{this.tree.depth>=this.maxDepth||(this.tree.moveNext(s?e:e.toLowerCase().replaceAll(`
`," ").replaceAll("	"," ").replaceAll("<"," ").replaceAll(">"," ").replaceAll("  "," ").trim().substring(0,256),s),this.doNextAction())})}waitForMessage(){let s="waiting",o=Date.now();const i=Date.now(),r=()=>{this.plugin.onUserTyping.off(h),this.plugin.onNewMessage.off(l),clearInterval(d),s!=="user-answered"&&this.sendMessage()},h=g=>{g||(o=Date.now())},l=({self:g})=>{g||(s="user-answered")};this.plugin.onUserTyping.on(h),this.plugin.onNewMessage.on(l);const d=setInterval(()=>{Date.now()-i>1e4&&(s="typing-timeout"),!this.plugin.isUserTyping&&Date.now()-o>2e3&&(s="user-inactive"),s!=="waiting"&&r()},100)}doNextAction(){const t=this.tree.currentNode,e=this.tree.nextNodes;if(this.leaving&&!t.self&&t.dead){this.plugin.state.status==="in-active-chat"&&this.plugin.state.exitChat();return}if(e.length===0)return;const s=e.filter(i=>!i.self).length,o=e.filter(i=>i.self).length+1;if(S(s/(s+o))){this.waitForMessage();return}this.sendMessage()}sendMessage(){if(!this.messaging)return;const t=this.tree.nextNodes.filter(s=>s.self);if(t.length===0)return;const e=v(t.map(s=>s.text));this.plugin.state.status==="in-active-chat"&&e!==null&&this.plugin.state.sendMessage(e)}}function S(n){return Math.random()<=n}function v(n){return n[Math.floor(Math.random()*n.length)]??null}class _{constructor(){a(this,"updateTime",200);a(this,"state",{status:null});a(this,"messages",[]);a(this,"isUserTyping",!1);a(this,"onStateChanged",new c);a(this,"onNewMessage",new c);a(this,"onUserTyping",new c);this.onStateChanged.on(({prev:e,curr:s})=>{s==="in-active-chat"&&e!=="chat-end-confirmation"&&(this.messages.length=0)});const t=()=>{this.updateTyping(),this.updateState(),this.updateMessages(),this.updateTime!==null&&setTimeout(t,this.updateTime)};t()}updateState(){const t=L(),e=this.state;t.status!==e.status&&(this.state=t,this.onStateChanged.emit({prev:e.status,curr:t.status}))}updateMessages(){const t=T();if(this.messages.length<t.length)for(let e=this.messages.length;e<t.length;e++)this.messages.push(t[e]),this.onNewMessage.emit(t[e])}updateTyping(){const t=D();this.isUserTyping!==t&&(this.isUserTyping=t,this.onUserTyping.emit(t))}get status(){return this.state.status}}function T(){var e;const n=document.querySelectorAll(".mess_block"),t=[];for(const s of n){const o=s.classList.contains("self"),i=(e=s.querySelector(".window_chat_dialog_text"))==null?void 0:e.textContent;i!=null&&t.push({text:i,self:o})}return t}function N(n){const t=document.querySelector(".emojionearea-editor"),e=document.querySelector("#sendMessageBtn");if(t===null||e===null)throw new Error("Not in chat state");t.textContent=n,e.click()}function C(){const n=document.querySelector(".close_dialog_btn");if(n===null)throw new Error("Not in chat state");n.click()}function f(){var n;for(const t of document.querySelectorAll(".talk_over_button"))if((n=t.textContent)!=null&&n.includes("Изменить параметры")){t.click();return}throw new Error("Not in chat-finished state")}function p(){var n;for(const t of document.querySelectorAll(".talk_over_button"))if((n=t.textContent)!=null&&n.includes("Начать новый чат")){t.click();return}throw new Error("Not in chat-finished state")}function M(){const n=document.querySelector(".swal2-confirm");if(n===null)throw new Error("Not in confirmation state");n.click()}function q(){const n=document.querySelector(".swal2-cancel");if(n===null)throw new Error("Not in confirmation state");n.click()}function A(){const n=document.querySelector("#searchCompanyBtn");if(n===null)throw new Error("Not in params-menu state");n.click()}function E(){const n=document.querySelector(".btn-stop-search");if(n===null)throw new Error("Not in queue-waiting state");n.click()}function L(){var t;const n=document.querySelector("#mask_cap");if(n!==null&&n.style.display!=="none")return{status:"captcha-solving"};if(document.querySelector(".mainStep.chat-box")!==null)return{status:"in-params-menu",startChat:A};if(document.querySelector("#search_company_loading")!==null)return{status:"in-queue-waiting",exitQueue:E};if(document.querySelector(".swal2-popup")!==null)return{status:"chat-end-confirmation",confirmExit:M,cancelExit:q};if(document.querySelector(".chat_step")!==null){const e=document.querySelector(".status-end");if(e!==null&&e.style.display!=="none"){const s=document.querySelector(".talk_over_text");return s!==null&&((t=s.textContent)!=null&&t.startsWith("Собеседник завершил чат"))?{status:"chat-finished-by-nekto",exitToMenu:f,nextChat:p}:{status:"chat-finished-by-self",exitToMenu:f,nextChat:p}}return{status:"in-active-chat",sendMessage:N,exitChat:C}}return{status:null}}function D(){const n=document.querySelector(".window_chat_dialog_write span");return n===null?!1:n.style.visibility!=="hidden"}class O{constructor(){a(this,"style",document.createElement("style"))}setheme(){this.style.innerHTML=I,this.style.isConnected||document.head.appendChild(this.style)}removeTheme(){this.style.isConnected&&this.style.remove()}}const I=`
:root {
    --night-background-color: #303446;
    --night-modal-background: #303446;
    --night-chat-message-area-background: #303446;
    --night-chat-message-area-wrapper-background: #303446;
    --night-active-checkbox-background-color: #B9BAF1;
    --night-active-checkbox-adult-background-color: #e78284;
    --night-active-checkbox-roles-background-color: #cb9ce8;
    --night-checkbox-background-color: #414558;
    --night-header-adult-background-color: #443D4E;
    --night-header-roles-background-color: #3A3257;
    --night-checkbox-border-color: #51576d;
    --night-disabled-checkbox-background-color: #777d99;
    --night-chat-messages-self-background: #414558;
    --night-chat-messages-self-color: #c6d0f5;
    --night-chat-messages-self-border-color: #51576d;
    --night-chat-messages-nekto-background: #414558;
    --night-chat-messages-nekto-color: #c6d0f5;
    --night-chat-messages-nekto-border-color: #51576d;
    --night-header-background-color: #303446;
    --night-button-new-chat-color: #A6D088;
    --night-button-stop-color: #8caaee;
    --night-button-scan-color: #A6D088;
    --night-button-stop-talk-color: #A6D088;
    --night-button-send-message-color: #A6D088;
    --night-text-color: #c6d0f5;
    --night-button-continue-color: #ef9f76;
    --night-chat-unread-message-background: #393e51;
    --night-complain-link: 
}
body.night_theme {
    background: #292c3c !important;
}
.night_theme .btn-default,
.night_theme .adult_topic_search .btn-default,
.night_theme .roles_topic_search .btn-default {
    color: #c6d0f5 !important;
}
.night_theme .btn-default.checked,
.night_theme .adult_topic_search .btn-default.checked,
.night_theme .adult_topic_search .btn-default.checked.disabled,
.night_theme .roles_topic_search .btn-default.checked,
.night_theme .roles_topic_search .btn-default.checked.disabled {
    color: #282B3C !important;
}
#reportIcon {
    opacity: 0.7;
}
.window_chat_message {
    padding: 15px 30px;   
}
.message_box_block {
    width: 100%;
    border: 2px solid #51576d;
    border-radius: 10px;
}
center,
.navbar .pritch,
.header_chat .left_block_hc,
.chat_message_ava,
.window_chat_ava,
.window_chat_icon_my {
    display: none
}
.night_theme .navbar {
    background: #232634
}
`;class U{constructor(t,e){a(this,"enabled",!0);document.addEventListener("keydown",s=>{if(this.enabled&&s.ctrlKey&&(s.code==="ArrowRight"&&t.state.status==="in-active-chat"&&t.state.exitChat(),s.code==="ArrowDown"&&t.state.status==="in-active-chat"&&e.sendMessage(),s.code==="ArrowUp")){const o=Number.parseInt(prompt("Откат. Время в минутах:","3"));Number.isFinite(o)&&e.tree.restoreCheckpoint(o*6e4)}})}}async function H(){const n=new _,t=new x(n),e=new k,s=new O,o=new U(n,t);setInterval(()=>document.dispatchEvent(new MouseEvent("mousemove")),200),e.onLeavingToggle.on(i=>t.leaving=i),e.onMessagingToggle.on(i=>t.messaging=i),e.onSkippingToggle.on(i=>t.skipping=i),e.onThemeToggle.on(i=>i?s.setheme():s.removeTheme()),e.onHotkeysToggle.on(i=>o.enabled=i),e.onDataAccess.on(()=>{const i=JSON.stringify(t.tree.nodes),r=prompt("Данные всех чатов:",i);if(r)try{t.tree.data=JSON.parse(r)}catch{alert("Неверные данные")}}),n.onStateChanged.on(({curr:i})=>{switch(i){case"captcha-solving":e.setStatus("Решите каптчу");break;case"chat-end-confirmation":e.setStatus("Завершение чата");break;case"chat-finished-by-nekto":case"chat-finished-by-self":e.setStatus("Чат завершен");break;case"in-params-menu":e.setStatus("Меню параметров");break;case"in-queue-waiting":e.setStatus("Ожидание собеседника...");break;case"in-active-chat":e.setStatus("В чате");break;default:e.setStatus("");break}}),setInterval(()=>{const i=[];t.tree.nextNodes.forEach(r=>{const h=r.text.replaceAll(`
`," ").replaceAll("	"," ").replaceAll("<"," ").replaceAll(">"," ").replaceAll("  "," ").trim().substring(0,30);if(h.length===0)return;const l=document.body.classList.contains("night_theme"),d=r.self?l?"#8caaee":"darkblue":r.dead?l?"#e78284":"darkred":l?"#a6d189":"darkgreen";i.push(`<span style="color: ${d}">${h}</span>`)}),e.setDebug(i.join("<br>"))},1e3)}try{H()}catch(n){console.log("Error: ",n)}
