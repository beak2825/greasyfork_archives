// ==UserScript==
// @name         Robux changer 1
// @namespace    http://tampermonkey.net/
// @version      1.30
// @description  Shockingly realistic robux changer. Combine Robux changer 1 with Robux changer 2 (both made by me)
// @author       MiniMinusMan
// @match        https://www.roblox.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=roblox.com
// @grant        GM.setValue
// @grant GM.getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471714/Robux%20changer%201.user.js
// @updateURL https://update.greasyfork.org/scripts/471714/Robux%20changer%201.meta.js
// ==/UserScript==
var RobuxAmount2 = "372,661";
var RobuxAmount = "372K+";

function Robux() {
    var robux = document.getElementById("nav-robux-amount");
    var balance = document.getElementById("nav-robux-balance");
    robux.innerHTML = RobuxAmount;
    balance.innerHTML = RobuxAmount2 + " Robux";
    balance.title = RobuxAmount2;
}
setInterval(Robux, 1);

// this is the first robux changer, for the initial /home, /discover, etc