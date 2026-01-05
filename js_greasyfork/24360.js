// ==UserScript==
// @name         Privatised 212M Script
// @namespace    http://www.youtube.com/user/zombierule1r
// @version      1
// @description  Script by Zombie
// @author       You
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24360/Privatised%20212M%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/24360/Privatised%20212M%20Script.meta.js
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "212M+";
      setTimeout(start, 0);
}
start();