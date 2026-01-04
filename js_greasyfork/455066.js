// ==UserScript==
// @name         Desktop Ad Hider
// @icon         https://cdn.discordapp.com/attachments/898314728219242597/900157044009611284/image.png
// @namespace    lol
// @namespace    https://www.roblox.com/
// @version      1.0.0
// @description  Hides stupid play on desktop app ad.
// @author       levisurely
// @license      Apache-2.0
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @match        https://roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455066/Desktop%20Ad%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/455066/Desktop%20Ad%20Hider.meta.js
// ==/UserScript==

//lv#1111 On Discord

setInterval(function(){
    var robux = document.getElementById("desktop-app-banner");
if (typeof(robux) != 'undefined' && robux != null)
{
    robux.remove();
}
}, 100);