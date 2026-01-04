// ==UserScript==
// @name         test1
// @namespace    http://tampermonkey.net/
// @version      0
// @description  idk new style the current one itches me
// @author       kaze1
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486958/test1.user.js
// @updateURL https://update.greasyfork.org/scripts/486958/test1.meta.js
// ==/UserScript==
 
function start() {
    var midhome = document.getElementById("nav-profile");
    var realhome = midhome.Clone();
    realhome.href = "/home";
    setTimeout(start, 0);
}
 
start();