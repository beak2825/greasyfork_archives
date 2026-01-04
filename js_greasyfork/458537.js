// ==UserScript==
// @name         OWoT user indicator
// @namespace    https://greasyfork.org/scripts/458537-owot-online-and-offline
// @version      10.4
// @description  leaks your ip (98.6%)
// @author       e_g.
// @match        https://ourworldoftext.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458537/OWoT%20user%20indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/458537/OWoT%20user%20indicator.meta.js
// ==/UserScript==

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