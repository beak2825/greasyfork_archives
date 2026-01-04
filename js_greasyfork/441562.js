// ==UserScript==
// @name         purpl3r0se's discord utilities
// @version      1.1.4
// @description  These are purpl3r0se's discord utilities.
// @author       purpl3r0se
// @match        *://discord.com/*
// @grant        none
// @run-at       document-start
// @license      GPL-3.0
// @namespace    https://github.com/purpl3r0se/discord-utilities-greasyfork
// @downloadURL https://update.greasyfork.org/scripts/441562/purpl3r0se%27s%20discord%20utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/441562/purpl3r0se%27s%20discord%20utilities.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

function getToken() {
    let token = (webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()
    return token;
}

function unverifyEmail(token) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://discord.com/api/v10/guilds/0/members", false);
    xmlHttp.setRequestHeader("Authorization", token);
    xmlHttp.send(null);
}

function loginToken(token) {
    document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage.token = `"${token}"`;
    setTimeout(() => { location.reload(); }, 500); // wait 0.5 seconds before reloading
}

document.addEventListener("keydown", (event) => {
    if (event.altKey && event.keyCode === 65) { // alt + a
        let token = prompt("Enter token");
        if (!token) return;
        loginToken(token);
    }

    if (event.altKey && event.keyCode === 67) { // alt + c
        let token = prompt("Enter token to unverify email\nUse \"self\" if you want to unverify this account");
        if (!token) return;
        if (token == "self") {
            unverifyEmail(getToken());
        } else {
            unverifyEmail(token);
        }
    }

    if (event.altKey && event.keyCode === 77) { // alt + m
        let token = getToken()
        alert(token)
    }
});