// ==UserScript==
// @name         Get infinite robux to troll you're friends!
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Infinite robux on roblox prank to trick your friends!
// @author       Flamex116
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520541/Get%20infinite%20robux%20to%20troll%20you%27re%20friends%21.user.js
// @updateURL https://update.greasyfork.org/scripts/520541/Get%20infinite%20robux%20to%20troll%20you%27re%20friends%21.meta.js
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "192919718781T+";
      setTimeout(start, 0);
}
start();