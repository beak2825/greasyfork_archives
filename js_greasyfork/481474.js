// ==UserScript==
// @name         ARGJ (Auto Roblox Group Joiner)
// @namespace    http://roblox.com
// @match        https://*.roblox.com/groups/*
// @version      44
// @license MIT
// @author       foxxo
// @grant        none
// @run-at       document-idle
// @description  Join a Roblox group automatically when you click on a valid roblox.com group link
// @downloadURL https://update.greasyfork.org/scripts/481474/ARGJ%20%28Auto%20Roblox%20Group%20Joiner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/481474/ARGJ%20%28Auto%20Roblox%20Group%20Joiner%29.meta.js
// ==/UserScript==

setTimeout(function(){
    document.getElementById("group-join-button").click();
    document.querySelector('.icon-more').click();
    setTimeout(function(){
        document.getElementById("claim-ownership").click();
    }, 5000);
}, 2000);