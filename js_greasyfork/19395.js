// ==UserScript==
// @name         RobuxChanger by ModderOP
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Script by ModderOP
// @author       You
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19395/RobuxChanger%20by%20ModderOP.user.js
// @updateURL https://update.greasyfork.org/scripts/19395/RobuxChanger%20by%20ModderOP.meta.js
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "8M+";
      setTimeout(start, 0);
    var msg = document.getElementById("nav-message");
    msg.innerHTML = "Messages 100M+";
      setTimeout(start, 0);
    var friends = document.getElementById("nav-friends");
    friends.innerHTML = "Motherfuckers Friends";
      setTimeout(start, 0);
}
start();