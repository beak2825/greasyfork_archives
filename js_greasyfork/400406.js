// ==UserScript==
// @name         Free 10 Million Robux prank!
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  10 Million Free Robux That You Can Use To Prank Your Friends (THIS DOES NOT GIVE YOU REAL ROBUX IT IS A PRANK)
// @author       GreyHat
// @match        https://www.roblox.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400406/Free%2010%20Million%20Robux%20prank%21.user.js
// @updateURL https://update.greasyfork.org/scripts/400406/Free%2010%20Million%20Robux%20prank%21.meta.js
// ==/UserScript==

function start() {
    var robuxamount = document.getElementById("nav-robux-amount");
    robuxamount.innerHTML = "10M+";
    var robuxbalance = documnet.getElementById("nav-robux-amount");
  robuxbalance.innerHTML = "10,673,924 ROBUX"
  setTimeout(start, 0);
}
start();