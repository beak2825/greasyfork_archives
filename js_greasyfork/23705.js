// ==UserScript==
// @name         RobuxChanger by anil
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Script by ModderOP
// @author       You
// @match        https://web.roblox.com/home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23705/RobuxChanger%20by%20anil.user.js
// @updateURL https://update.greasyfork.org/scripts/23705/RobuxChanger%20by%20anil.meta.js
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "8M+";
      setTimeout(start, 0);
}