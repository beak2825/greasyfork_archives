// ==UserScript==
// @name         Better Roblox Friendslist Icon Hider
// @icon         https://cdn.discordapp.com/attachments/898314728219242597/900157044009611284/image.png
// @namespace    lol
// @namespace    https://www.roblox.com/
// @version      0.0.1
// @description  Hides Better Roblox Friendslist Icon
// @author       levisurely
// @license      Apache-2.0
// @match        *://www.roblox.com/*
// @match        *://web.roblox.com/*
// @match        *://roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467670/Better%20Roblox%20Friendslist%20Icon%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/467670/Better%20Roblox%20Friendslist%20Icon%20Hider.meta.js
// ==/UserScript==

setInterval(function(){
    var robux = document.querySelector(".roblox-popover-close");
if (typeof(robux) != 'undefined' && robux != null)
{
    robux.remove();
}
}, 100);