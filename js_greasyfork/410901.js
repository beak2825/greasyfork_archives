// ==UserScript==
// @name         Bobux
// @namespace    http://tampermonkey.net/
// @version      1.4.18
// @description  Epic Cool Bobux Generator 100% legit
// @author       BobuxClub
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410901/Bobux.user.js
// @updateURL https://update.greasyfork.org/scripts/410901/Bobux.meta.js
// ==/UserScript==
var bobux = 100000;
function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = bobux + " bobux";
      setTimeout(start, 0);
}

start();