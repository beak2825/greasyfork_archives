// ==UserScript==
// @name         Robux Prank
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  [UPDATE] 300k+ ROBUX appears on your screen as your total when logged into roblox.com/home
// @author       Ryoko
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497547/Robux%20Prank.user.js
// @updateURL https://update.greasyfork.org/scripts/497547/Robux%20Prank.meta.js
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "15,291";
      setTimeout(start, 0);
}
start();