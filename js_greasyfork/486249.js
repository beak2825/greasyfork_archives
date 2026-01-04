// ==UserScript==
// @name       Fullscreen Whatsapp Web
// @description Make the Whatsapp Web interface occupy the whole viewport even on large screens (idea suggested by POPO7)
// @namespace   StephenP
// @match       https://web.whatsapp.com/*
// @grant       GM_registerMenuCommand
// @version     1.2
// @author      StephenP
// @license     AGPL-3.0
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/486249/Fullscreen%20Whatsapp%20Web.user.js
// @updateURL https://update.greasyfork.org/scripts/486249/Fullscreen%20Whatsapp%20Web.meta.js
// ==/UserScript==
const st=document.createElement("STYLE");
st.innerHTML=".app-wrapper-web .two, .app-wrapper-web .three{top: 0 !important; width: 100%  !important; max-width: 100%  !important; height: 100%  !important;}";
document.body.appendChild(st);
const com=GM_registerMenuCommand('(Un)blur chats list', blurChatList);
function blurChatList(){
  let blurred=document.getElementById("blurChatList");
  if(!blurred){
    const bl=document.createElement("STYLE");
    bl.id="blurChatList";
    bl.innerHTML="#pane-side{filter: blur(10px)}";
    document.body.appendChild(bl);
  }
  else{
    blurred.remove();
  }
}