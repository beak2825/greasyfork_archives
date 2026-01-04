// ==UserScript==
// @name         Robux Hider
// @icon         https://cdn.discordapp.com/attachments/898314728219242597/900157044009611284/image.png
// @namespace    lol
// @version      1.1.1
// @description  Hides how much robux you have.
// @author       LevitatingDeveloper
// @license      Apache-2.0
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @match        https://roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432864/Robux%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/432864/Robux%20Hider.meta.js
// ==/UserScript==

setInterval(function(){
    var robux = document.getElementById("nav-robux-amount");
if (typeof(robux) != 'undefined' && robux != null)
{
    robux.remove();
}
}, 100);