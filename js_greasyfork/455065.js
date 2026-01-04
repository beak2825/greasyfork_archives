// ==UserScript==
// @name         Age Menu Hider
// @icon         https://cdn.discordapp.com/attachments/898314728219242597/900157044009611284/image.png
// @namespace    lol
// @namespace    https://www.roblox.com/
// @version      1.0.1
// @description  Hides how much stupid age menu for old accs without age you have.
// @author       levisurely
// @license      Apache-2.0
// @match        https://www.roblox.com/*
// @match        https://web.roblox.com/*
// @match        https://roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455065/Age%20Menu%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/455065/Age%20Menu%20Hider.meta.js
// ==/UserScript==

//lv#1111 On Discord

setInterval(function(){
    var e = document.getElementById("simplemodal-overlay");
    var robux = document.getElementById("simplemodal-container");
    if (typeof(robux) != 'undefined' && robux != null)
    {
        robux.remove();
    };
    if (typeof(e) != 'undefined' && e != null)
    {
        e.remove();
    }
}, 100);