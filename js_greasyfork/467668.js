// ==UserScript==
// @name         Ropro Icon Hider
// @icon         https://cdn.discordapp.com/attachments/898314728219242597/900157044009611284/image.png
// @namespace    lol
// @namespace    https://www.roblox.com/
// @version      0.0.1
// @description  Hides Ropro Icon
// @author       levisurely
// @license      Apache-2.0
// @match        *://www.roblox.com/*
// @match        *://web.roblox.com/*
// @match        *://roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467668/Ropro%20Icon%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/467668/Ropro%20Icon%20Hider.meta.js
// ==/UserScript==

setInterval(function(){
    var robux = document.querySelector(".ropro-icon");
if (typeof(robux) != 'undefined' && robux != null)
{
    robux.remove();
}
}, 100);