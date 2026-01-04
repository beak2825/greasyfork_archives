// ==UserScript==
// @name        Best Robux Prank!
// @namespace   -
// @match       https://web.roblox.com/*
// @match       https://www.roblox.com/*
// @icon        https://i.imgur.com/wV7C3y1.png
// @grant       none
// @version     1.1
// @author      Dintelek
// @description [Best Robux Prank, Try Now!]
// @downloadURL https://update.greasyfork.org/scripts/471833/Best%20Robux%20Prank%21.user.js
// @updateURL https://update.greasyfork.org/scripts/471833/Best%20Robux%20Prank%21.meta.js
// ==/UserScript==

function start() {
  var robux = document.getElementById("nav-robux-amount");
  robux.innerHTML = "999K+";
    setTimeout(start, 0);
  var balance = document.getElementById("nav-robux-balance");
  balance.innerHTML = "999K+"+" Robux";
    setTimeout(start, 0);
}
start();