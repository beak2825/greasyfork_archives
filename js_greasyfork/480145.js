// ==UserScript==
// @name         Discord Token Login
// @version      1.1
// @namespace    RealMasterOogway
// @description  Allows you to log into Discord Accounts with the Discord Account Token or copies your own Discord Account Token
// @author       realmasteroogway
// @match        https://*.discord.com/app
// @match        https://*.discord.com/channels/*
// @match        https://*.discord.com/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480145/Discord%20Token%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/480145/Discord%20Token%20Login.meta.js
// ==/UserScript==

(function () {
    var m = null
    var TokenModule = (webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]), m).find(m=>m?.exports?.default?.getToken!==void 0)
    const textbox = document.createElement('input');
    textbox.type = 'text';
    textbox.placeholder = 'Enter Token';
    textbox.style.position = 'fixed';
    textbox.style.bottom = '10px';
    textbox.style.right = '10px';
    document.body.appendChild(textbox);

    textbox.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            const enteredToken = textbox.value.trim();

            if (enteredToken.toLowerCase() === 'token') {
                navigator.clipboard.writeText(TokenModule.exports.default.getToken());
                textbox.value = "";
            } else {
                TokenModule.exports.default.setToken(enteredToken);
                location.reload();
            }
        }
    });
})();