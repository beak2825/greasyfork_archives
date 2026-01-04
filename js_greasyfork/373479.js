// ==UserScript==
// @name         krunker spam
// @namespace    https://krunker.io/*
// @version      1.03
// @description  it just spams lul, \
// @author       Meatman2tasty
// @match        krunker.io/*
// @match        http://krunker.io/*
// @match        http://www.krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373479/krunker%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/373479/krunker%20spam.meta.js
// ==/UserScript==


document.addEventListener("keydown", function(a) { // press '\' 
    if (a.keyCode == 220) {
document.getElementById("accName").value=Math.random().toString(36).substring(7);
    }
}, false);

document.addEventListener("keydown", function(a) { // press '\' 
    if (a.keyCode == 220) {
document.getElementById("accPass").value=Math.random().toString(36).substring(7);
    }
}, false);

document.addEventListener("keydown", function(a) { // Press '\''
    if (a.keyCode == 220) {
setTimeout(registerAcc(),200);
    }
}, false);

document.addEventListener("keydown", function(a) { // Press ']''
    if (a.keyCode == 221) {
setTimeout(logoutAcc(),200);
    }
}, false);

