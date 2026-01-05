// ==UserScript==
// @name         RobuxGiver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  your able to steal roblox's robux
// @author       You
// @match        https://www.roblox.com/*
// @grant        none
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "101B+"
      setTimeout(start, 0);
}
start();