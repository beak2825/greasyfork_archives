// ==UserScript==
// @name         Robux Hider
// @icon         https://cdn.discordapp.com/attachments/898314728219242597/900157044009611284/image.png
// @namespace    lol
// @namespace    https://www.roblox.com/
// @version      1.1.1
// @description  Hides how much robux you have.
// @author       levisurely
// @license      Apache-2.0
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @match        https://roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450012/Robux%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/450012/Robux%20Hider.meta.js
// ==/UserScript==

//lev#9999 On Discord
//discord.gg/tmYQr99wTa

setInterval(function(){
    var robux = document.getElementById("nav-robux-amount");
if (typeof(robux) != 'undefined' && robux != null)
{
    robux.remove();
}
}, 100);