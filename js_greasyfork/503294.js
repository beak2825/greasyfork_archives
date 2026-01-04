// ==UserScript==
// @name         robux
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  changes robux on refresh
// @author       me
// @match        https://www.roblox.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503294/robux.user.js
// @updateURL https://update.greasyfork.org/scripts/503294/robux.meta.js
// ==/UserScript==
 
function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "650K+";
      setTimeout(start, 0);
}
start();