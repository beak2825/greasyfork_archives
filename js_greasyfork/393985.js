// ==UserScript==
// @name            Remover Chat da Twitch
// @name:en         Remove Twitch Chat
// @name:es         Quitar El Chat de Twitch
// @description     remove todas as mensagens do chat da Twitch em um clique
// @description:en  remove all twitch chat messages in a click
// @description:es  elimina todos los mensajes de chat de Twitch con un solo clic
// @version      1.9.8
// @author       raianwz
// @icon         https://i.imgur.com/E0el9Xh.png
// @exclude      *://*.twitch.tv/p/*
// @exclude      *://*.twitch.tv/popout/*/poll*
// @exclude      *://*.twitch.tv/popout/*/reward-queue*
// @exclude      *://*.twitch.tv/popout/*/predictions*
// @exclude      *://*.twitch.tv/popout/moderator/*
// @exclude      *://*.twitch.tv/moderator/*
// @exclude      *://*.twitch.tv/broadcast/*
// @exclude      *://*.twitch.tv/subs/*
// @exclude      *://*.twitch.tv/jobs/*
// @exclude      *://*.twitch.tv/teams/*
// @exclude      *://*.twitch.tv/store/*
// @exclude      *://*.twitch.tv/*/squad
// @exclude      *://player.twitch.tv/*
// @exclude      *://dashboard.twitch.tv/*
// @match        https://www.twitch.tv/*
// @namespace    https://greasyfork.org/users/425245
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/403168/Remover%20Chat%20da%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/403168/Remover%20Chat%20da%20Twitch.meta.js
// ==/UserScript==
let url = window.location.href;
let getElement = (e) => document.querySelector(e), cnt = 0;
let sleep = m => new Promise(r => setTimeout(r, m));
document.addEventListener('readystatechange', e => { e.target.readyState === "complete" ? CheckTrash() : false});
function CheckTrash(){ if(cnt < 3){ !getElement("[name='btn-remove']")? LoadTrash(url) : false } else return;}

function LoadTrash(url){
    const styleTrash = document.createElement('style');
    let lang = document.documentElement.lang;
    let btnName = "🗑", trash, value = {top:'0',bottom:'85%',transY:'160%'};
    styleTrash.type = 'text/css';
    if(url.includes('twitch.tv/popout/')||url.includes('twitch.tv/embed/')){value.top = '100%'; value.bottom = "0"; value.transY='-140%';}
    lang!="pt-BR"? btnName="Remove Chat" : btnName="Remover Chat"
    styleTrash.innerHTML=`.trashTip{ display: none; position: absolute; top: auto; font-size: var(--font-size-6); font-weight: var(--font-weight-semibold);
line-height: var(--line-height-heading);height: fit-content;white-space: nowrap;color: var(--color-text-tooltip);background-color: var(--color-background-tooltip);
border-radius: 0.4em;margin-inline: -33px;padding: 5px 6px; user-select: none;pointer-events: none;margin-bottom: 0px;transition: 2s ease .8s;}.trashTip::before, .trashTip::after{position: absolute;content: "";}
.trashTip::before {top: -6px;left: -6px;width: calc(100% + 12px);height: calc(100% + 12px);z-index: var(--z-index-below);}.trashTip::after {border-radius: 0 0 var(--border-radius-small);
top:${value.top};bottom: ${value.bottom};left: 45%;margin-top: -3px;margin-left: 0px;background-color: var(--color-background-tooltip);width: 6px;height: 6px;transform: rotate(45deg);z-index: var(--z-index-below);}
div.trashWrapper:hover>.trashTip{transform: translateY(${value.transY});display: block; transition: translateY 1s ease 0.2s; z-index: 1;}`
    document.getElementsByTagName('head')[0].appendChild(styleTrash);
    createTrash(btnName,lang);
    console.log('[DEBUG] %cRemove Twitch Chat is enabled','color:green')
}

async function createTrash(btnName,lang){
    let trash, start = 'beforeBegin',where = getElement('.top-nav__prime');
    let seventv = getElement('#seventv-root') ? true : false
    where == null? where = getElement('[data-a-target=chat-settings]') : where
    if(where == null) { await sleep(3*1000); cnt++; CheckTrash(); return}
    if(where !== getElement('.top-nav__prime')){ where = where.offsetParent.parentElement.parentElement.parentNode; start = 'afterbegin'}
    trash=`<div class="Layout-sc-1xcs6mc-0 VxLcr" name="btn-remove"><div class="Layout-sc-1xcs6mc-0 gQAGKi"><div class="Layout-sc-1xcs6mc-0 bWprIP"><div class="InjectLayout-sc-1i43xsx-0 iDMNUO trashWrapper">
<button id="bremove" class="ScCoreButton-sc-ocjdkq-0 iPkwTD ScButtonIcon-sc-9yap0r-0 dcNXJO TrashWrapper"><div class="ButtonIconFigure-sc-1emm8lf-0 lnTwMD"><div class="ScSvgWrapper-sc-wkgzod-0 kccyMt tw-svg"><svg width="20" height="20" viewBox="0 0 20 20" focusable="false" aria-hidden="true" role="presentation">
<path fill-rule="evenodd" d="M12 2H8v1H3v2h14V3h-5V2zM4 7v9a2 2 0 002 2h8a2 2 0 002-2V7h-2v9H6V7H4z M11 7H9v7h2V7z" clip-rule="evenodd"></path></svg></div></div></button><div class="trashTip">${btnName}</div></div></div></div></div>`;
    where.insertAdjacentHTML(start,trash)
    const showTip = () =>{
        let chat = getElement('.chat-scrollable-area__message-container');
        if(seventv){chat=getElement('.seventv-message-container')}
        if(!chat){ !url.includes('twitch.tv/popout/')?chatRestore():window.location.reload(); return;} chat.parentNode.id ="chatMsg"; setTimeout(()=>{chat.remove(); TipRestore(chat,lang);},200)}
    getElement('#bremove').addEventListener("click", () => {showTip()})
}

function TipRestore(chat, lang){
    if(!url.includes('twitch.tv/popout/')){
        let time = new Date();
        let msg = {name:'Dica', prf1: 'Para restaurar o chat e as mensagens',prf2: 'clique aqui para restaurar', prf3:'ou vá para' ,prf4: 'Configurações de Chat', prf5: 'Ocultar Chat', prf6: 'e depois clique em', prf7: 'Mostrar Chat', prf8: 'Para deletar está mensagem', prf9:'clique aqui'}
        if(lang != "pt-BR") { msg = {name:'Tip', prf1: 'To restore chat and messages,',prf2:'click here to restore', prf3:'or go to', prf4: 'Chat Settings', prf5: 'Hide Chat', prf6: 'and click', prf7: 'Show Chat', prf8: 'To delete this message', prf9:'click here' }}
        const tipMsg = `<div class="Layout-sc-1xcs6mc-0 cwtKyw dtoOxd"><div class="chat-line__message" name="Tmsg" align-items="center">
<div class="Layout-sc-1xcs6mc-0 cwtKyw chat-line__message-container"><div class="Layout-sc-1xcs6mc-0"><div class="Layout-sc-1xcs6mc-0 kBzdhm chat-line__no-background"><span class="chat-line__timestamp">${time.toLocaleTimeString().slice(0,5)}</span>
<div class="Layout-sc-1xcs6mc-0 plvaC nnbce chat-line__username-container chat-line__username-container--hoverable"><span><div class="InjectLayout-sc-1i43xsx-0 jbmPmA dvtAVE"><button data-a-target="chat-badge">
<img alt="AutoModerador" class="chat-badge" src="https://static-cdn.jtvnw.net/badges/v1/df9095f6-a8a0-4cc2-bb33-d908c0adffb8/1" srcset="https://static-cdn.jtvnw.net/badges/v1/df9095f6-a8a0-4cc2-bb33-d908c0adffb8/1 1x, https://static-cdn.jtvnw.net/badges/v1/df9095f6-a8a0-4cc2-bb33-d908c0adffb8/2 2x, https://static-cdn.jtvnw.net/badges/v1/df9095f6-a8a0-4cc2-bb33-d908c0adffb8/3 4x">
</button></div></span><span class="chat-line__username" role="button" tabindex="0"><span><span class="chat-author__display-name" style="color: rgb(0, 173, 3);">${msg.name}</span></span></span></div><span>: </span><span class="" data-a-target="chat-line-message-body"><span class="text-fragment" data-a-target="chat-message-text">${msg.prf1}<em id="restore" style="cursor: pointer;color: #a970ff;"> ${msg.prf2} </em>
${msg.prf3} <strong>${msg.prf4}</strong></span><div class="chat-line__message--emote-button" data-test-selector="emote-button"><div class="InjectLayout-sc-1i43xsx-0 jbmPmA dvtAVE"><span data-a-target="emote-name"><div class="Layout-sc-1xcs6mc-0 eRdKzO gJnMyS chat-image__container"><img alt="Settings" class="chat-image chat-line__message--emote" src="https://i.imgur.com/IiyiIfg.png"></div></span></div></div>—&gt;<strong>${msg.prf5}</strong>
${msg.prf6} <strong>${msg.prf7}</strong>.\t\n${msg.prf8}</span>  <button id="clsMsg" class="ScCoreLink-sc-16kq0mq-0 jSrrlW link-fragment tw-link jUiaVy" style="color: rgb(255 0 0);">${msg.prf9}&#x274C</button><span class="text-fragment" data-a-target="chat-message-text"></span></div></div></div></div></div>`;
     getElement('#chatMsg').innerHTML = `${tipMsg}`;
    getElement('em#restore').addEventListener("click", () => chatRestore());
    getElement('img[alt="Settings"]').addEventListener("click", () => chatRestore())}
    getElement('#clsMsg').addEventListener("click", () => getElement('[name="Tmsg"]').remove())
}

async function chatRestore(){
    getElement('[data-a-target="chat-settings"]').click()
    await sleep(100)
    if(getElement('[data-a-target="switch-chat-settings-mode"]')){getElement('[data-a-target="switch-chat-settings-mode"]').click(); await sleep(40);}
    getElement('[data-a-target="hide-chat-button"]').click()
    await sleep(40)
    getElement('[data-a-target="show-chat-button"]').click()
    await sleep(3000)
    CheckTrash()
}