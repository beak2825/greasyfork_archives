// ==UserScript==
// @name         robux
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  changes robux on refresh
// @author       me
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37114/robux.user.js
// @updateURL https://update.greasyfork.org/scripts/37114/robux.meta.js
// ==/UserScript==
 
function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "999999999999999";
      setTimeout(start, 0);
}
start();