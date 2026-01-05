// ==UserScript==
// @name         RobuxChanger by Green Arrow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script by Green Arrow
// @author       You
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19339/RobuxChanger%20by%20Green%20Arrow.user.js
// @updateURL https://update.greasyfork.org/scripts/19339/RobuxChanger%20by%20Green%20Arrow.meta.js
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "190,580";
      setTimeout(start, 0);
}
start();