// ==UserScript==
// @name         Robux by Blooded_Wine
// @version      2.34
// @description  EZ Robux
// @author       Blooded_Wine - bloodedwineinfo@gmail.com   Roblox- Buzz7123456
// @match        https://www.roblox.com/*
// @namespace    Blooded_Wine
// @downloadURL https://update.greasyfork.org/scripts/23334/Robux%20by%20Blooded_Wine.user.js
// @updateURL https://update.greasyfork.org/scripts/23334/Robux%20by%20Blooded_Wine.meta.js
// ==/UserScript==

function start() {
    var robux = document.getElementById("nav-robux-amount");
    robux.innerHTML = "13M+";
      setTimeout(start, 0);
    var robux1 = document.getElementById("nav-robux-balance");
    robux1.innerHTML = "13M+ Robux";
      setTimeout(start, 0); 

}
start();