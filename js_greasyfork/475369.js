// ==UserScript==
// @name the ultimate discord owot chat bundle
// @namespace discord_owotchat
// @version 1.3
// @description Makes OWOT Chat more like Discord 
// @author Some_people
// @match https://ourworldoftext.com/*
// @icon https://https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475369/the%20ultimate%20discord%20owot%20chat%20bundle.user.js
// @updateURL https://update.greasyfork.org/scripts/475369/the%20ultimate%20discord%20owot%20chat%20bundle.meta.js
// ==/UserScript==

/* MIT Licence
Copyright © 2023 ntg

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

/* ECF has been removed for your safety */
 
/* OWOT USER INDICATOR BY E_G. */
 
let warn = true;
let people = [];
let timeout;
 
//Part made by KKosty4ka
var chat_upper = document.getElementById("chat_upper");
chat_upper.appendChild(document.createElement("br"));
var typing_display = chat_upper.appendChild(document.createElement("span"));
typing_display.style.display = "flex";
typing_display.style.justifyContent = "center";
typing_display.style.alignItems = "center";
//Part made by KKosty4ka
 
menu.addCheckboxOption('Online Offline warning', function(){
    warn = true;
}, function(){
    warn = false;
}, true);
 
w.broadcastReceive(true);
w.on('cmd', function(e){
    if(!e.username || !warn) return;
    if(e.data.startsWith('online')){
        clientChatResponse(e.username + " is online!");
    }
    else if(e.data.startsWith('offline')){
        clientChatResponse(e.username + " is now offline.");
    }
    else if(e.data.startsWith('back')){
        clientChatResponse(e.username + " is back.");
    }
    else if(e.data.startsWith('afk')){
        clientChatResponse(e.username + " is AFK. (Idle)");
    }
    else if(e.data.startsWith('typing')){
        if(!people.includes(e.username)) people.push(e.username);
        typing_display.innerText = people.join(" and ") + " " + (people.length > 1 ? "are" : "is") + " typing...";
    }
    else if(e.data.startsWith('untyping')){
        people = people.filter((x, i)=>i != people.indexOf(e.username))
        typing_display.innerText = people.length ? people.join(" and ") + " " + (people.length > 1 ? "are" : "is") + " typing..." : "Currently, no one is typing";
    };
});
 
setTimeout(function(){
    w.broadcastCommand('online', true);
}, 1000);
 
window.addEventListener('beforeunload', function(){
    w.broadcastCommand('offline', true)
});
 
window.onblur = function(){w.broadcastCommand('afk', true)};
 
window.onfocus = function(){w.broadcastCommand('back', true)};
 
elm.chatbar.oninput = function(e){
    if(timeout) clearTimeout(timeout);
    if(!elm.chatbar.value.length) w.broadcastCommand("untyping", true);
    if(!!elm.chatbar.value.length && !people.includes(state.userModel.username)) w.broadcastCommand('typing', true);
    timeout = setTimeout(function(){
        w.broadcastCommand("untyping", true);
    }, 5000);
};
 
/* DARK MODE CHAT BY YAGTON */
 
(() => {
    const changes = [
        ["#chat_window", "backgroundColor", "#3c3836"],
        ["#chat_close", "backgroundColor", "#cc241d"],
        ["#chat_upper", "color", "#fbf1c7"],
        ["#chatbar", "backgroundColor", "#282828"],
        ["#chatbar", "color", "#fbf1c7"],
        ["#chatbar", "border", "1px solid #1d2021"],
        ["#chatsend", "backgroundColor", "#282828"],
        ["#chatsend", "color", "#fbf1c7"],
        ["#chatsend", "border", "1px solid #1d2021"],
        [".unread", "color", "#fb4934"],
        [".chatfield", "backgroundColor", "#282828"],
        [".chatfield", "color", "#fbf1c7"],
    ];
 
    for (let i of changes)
        for (let e of document.querySelectorAll(i[0]))
            e.style[i[1]] = i[2];
 
    // because .chat_tab_selected has to be done differently :ohno:
    let head  = document.getElementsByTagName('head')[0];
    let st = document.createElement('style');
    st.innerHTML = ".chat_tab_selected { background-color: #504945; }";
    head.appendChild(st);
})();
 
/* DISCORD SOUNDS BY GUEST-1052 (SPAGHETTI CODE WARNING) */
sa=new Audio ("https://www.myinstants.com/media/sounds/discordmute.mp3");la=new Audio("https://www.myinstants.com/media/sounds/discord-message.mp3");w.on('chatmod',e=>{if(/@silent/i.test(e.message)){} else{if(e.realUsername=="[ Server ]"&&/deleted|blocked|muted/i.test(e.message)){sa.currentTime=0;sa.play()} else{la.currentTime=0;la.play()}}});
 
/* KEYBOARD SOUNDS (USELESS) */
 
onkeydown=_=>{ze=new Audio("https://www.myinstants.com/media/sounds/pressing-a-pc-key.mp3");ze.playbackRate=3.2;ze.volume=0.25;ze.play()}