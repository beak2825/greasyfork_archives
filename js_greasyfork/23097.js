// ==UserScript==
// @name         RobuxChanger by ModderOP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script by ModderOP
// @author       You
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23097/RobuxChanger%20by%20ModderOP.user.js
// @updateURL https://update.greasyfork.org/scripts/23097/RobuxChanger%20by%20ModderOP.meta.js
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "900";
      setTimeout(start, 900);
}
start();
