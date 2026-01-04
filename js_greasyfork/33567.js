// ==UserScript==
// @name         foes.io script account spam
// @namespace    http://foes.io/*
// @version      1.022
// @description  Currently allows you to press 'z' to create account and 'x' to logout
// @author       Meatman2tasty
// @match        https://foes.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33567/foesio%20script%20account%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/33567/foesio%20script%20account%20spam.meta.js
// ==/UserScript==

//account spam//
document.addEventListener("keydown", function(a) { // Press 'z' to create account
    if (a.keyCode == 90) {
document.getElementById("accName").value= Math.random().toString(36).substring(7);
document.getElementById("accEmail").value= Math.random().toString(36).substring(7) + "@mail.com";
document.getElementById("accPass").value= Math.random().toString(36).substring(7);
setTimeout(registerAcc(0), 1000);
    }
}, false);


document.addEventListener("keydown", function(a) { // Press 'x' to log out
    if (a.keyCode == 88) {
setTimeout(logoutAcc(0), 1000);
    }
}, false);
