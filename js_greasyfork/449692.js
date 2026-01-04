// ==UserScript==
// @name         Get your Discord Token
// @name:ja      Get your Discord Token
// @namespace    https://discord.com/
// @version      1.0.0
// @description  Get your token
// @description:ja Discord Tokenを入手
// @author       You
// @match *.discord.com/*
// @exclude support.discord.com/*
// @exclude support-dev.discord.com/*
// @namespace https://greasyfork.org/users/585161
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449692/Get%20your%20Discord%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/449692/Get%20your%20Discord%20Token.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const token = (webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()
    await navigator.clipboard.writeText(token);
    alert("Token copied");
    // Your code here...
})();