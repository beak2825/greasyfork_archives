// ==UserScript==
// @name        Troll Free Robux
// @namespace   Tampermonkey Scripts
// @description Troll your friends by loading this in and getting a fake 10 mil robux!
// @match       https://www.roblox.com/*
// @grant       none
// @version     1.0
// @author      AmsterPlays
// @description 5/6/2020, 1:08:07 PM
// @downloadURL https://update.greasyfork.org/scripts/402768/Troll%20Free%20Robux.user.js
// @updateURL https://update.greasyfork.org/scripts/402768/Troll%20Free%20Robux.meta.js
// ==/UserScript==
function start() {
document.getElementById("nav-robux-amount").innerText = "10M+";
// Change 10M+ to whatever you want for that much fake robux. (You can do words too)
}
window.onload = start;