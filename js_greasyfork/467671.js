// ==UserScript==
// @name         Roblox+ Icon Hider
// @icon         https://cdn.discordapp.com/attachments/898314728219242597/900157044009611284/image.png
// @namespace    lol
// @namespace    https://www.roblox.com/
// @version      1.1.2
// @description  Hides Roblox+ Icon
// @author       levisurely
// @license      Apache-2.0
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @match        https://roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467671/Roblox%2B%20Icon%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/467671/Roblox%2B%20Icon%20Hider.meta.js
// ==/UserScript==

setInterval(function(){
    var robux = document.querySelector(".rplus-icon-32x32");
if (typeof(robux) != 'undefined' && robux != null)
{
    robux.style.visibility="hidden"
}
}, 100);