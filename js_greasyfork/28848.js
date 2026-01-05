// ==UserScript==
// @name         RobuxChanger by ModderOP,MaxManuel78,TheOneJoke
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Script by MaxManuel78,ModderOP;TheOneJoke
// @author       You,ModderOP,TheOneJoke
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28848/RobuxChanger%20by%20ModderOP%2CMaxManuel78%2CTheOneJoke.user.js
// @updateURL https://update.greasyfork.org/scripts/28848/RobuxChanger%20by%20ModderOP%2CMaxManuel78%2CTheOneJoke.meta.js
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000B+";
      setTimeout(start, 0);
}
start();