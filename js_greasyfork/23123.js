// ==UserScript==
// @name         RobuxChanger by stryer21
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script by stryer21
// @author       You
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23123/RobuxChanger%20by%20stryer21.user.js
// @updateURL https://update.greasyfork.org/scripts/23123/RobuxChanger%20by%20stryer21.meta.js
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "800,000";
      setTimeout(start, 0);
}
start();