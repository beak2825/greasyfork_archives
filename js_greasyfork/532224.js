// ==UserScript==
// @name         Autoblock
// @namespace    none
// @version      1.1.3
// @description  auto-block users on OWoT
// @author       lime.tmonkey
// @match        https://*.ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=256&domain=ourworldoftext.com
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/532224/Autoblock.user.js
// @updateURL https://update.greasyfork.org/scripts/532224/Autoblock.meta.js
// ==/UserScript==

window.autoBlockList = ["CBAT", "mrbeast6000", "NoraEliseCrypto", "just.ar.andom.person", "just.ar.random.person", "justarandomperson", "JARP", "MothCuntEater", "error3", "Viber", "SkyfallUser", "TowerHeroesPorn", "miuirumaismywife", "thetruthseeker", "abcyhfg", "Dfyhd", "DandS", "OfficerWalterMasterson", "sentrywon"];
(async function() {
    let anonBlocking = localStorage.anonBlocking == 'true';
    let warned = false;
    function ab() {
        for (let u of autoBlockList) {
            w.chat.send("/blockuser "+u);
        }
        if (anonBlocking) {
            w.chat.send("/block anon");
            if (!warned) {
                w.doAnnounce('Anons have been blocked. Unblock anons to toggle automatic anon blocking.');
            }
        }
        warned = true;
    }
    w.on('chatSend', function(e){
        if (e.message == '/block anon') anonBlocking = true;
        if (e.message == '/unblock anon') anonBlocking = false;
        if (anonBlocking) {
            localStorage.anonBlocking = 'true';
        } else {
            localStorage.anonBlocking = 'false';
        }
    })
    await new Promise(function(r){
        let i = setInterval(function(){
            if (window.w && w.socket) {
                r(); clearInterval(i);
            }
        })
    })
    w.on("socketOpen", ()=>ab());
    let socket = w.socket;
    let openFunc = socket.onopen;
    w.on('socketOpen', openFunc);
    socket.onopen = ()=>w.emit("socketOpen");
    setInterval(function(){
        if (socket == w.socket) return;
        w.off('socketOpen', openFunc);
        socket = w.socket;
        openFunc = socket.onopen;
        w.on('socketOpen', openFunc);
        if ((w.socket.onopen+"").toLowerCase() != `()=>w.emit("socketopen")`) {
            w.socket.onopen = ()=>w.emit("socketOpen");
        }
    })
})()