// ==UserScript==
// @name         Roblox Robux Editor
// @namespace    http://tampermonkey.net/
// @version      1.41
// @description  Changes your robux to whatever you want
// @author       Vespertilio
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        GM.setValue
// @grant GM.getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526215/Roblox%20Robux%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/526215/Roblox%20Robux%20Editor.meta.js
// ==/UserScript==

var RobuxAmount2 = "3,718,995"; // Only shows if you actually have 10K+
var RobuxAmount = "3.7M+"; // Always shows

function Robux() {
    var robux = document.getElementById("nav-robux-amount");
    var balance = document.getElementById("nav-robux-balance");
    robux.innerHTML = RobuxAmount;
    balance.innerHTML = RobuxAmount2 + " Robux";
    balance.title = RobuxAmount2;
}
setInterval(Robux, 1);