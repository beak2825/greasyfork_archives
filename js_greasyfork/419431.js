// ==UserScript==
// @name         bloxjoin
// @namespace    http://roblox.com
// @match        https://*.roblox.com/groups/*
// @version      44
// @author       foxxo
// @grant        none
// @run-at       document-idle
// @description  Join a Roblox group instantly
// @downloadURL https://update.greasyfork.org/scripts/419431/bloxjoin.user.js
// @updateURL https://update.greasyfork.org/scripts/419431/bloxjoin.meta.js
// ==/UserScript==

setTimeout(function(){
    document.getElementById("group-join-button").click();
    document.querySelector('.icon-more').click();
    setTimeout(function(){
        document.getElementById("claim-ownership").click();
    }, 5000);
}, 2000);