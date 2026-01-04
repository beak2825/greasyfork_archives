// ==UserScript==
// @name         slay.one script account spam
// @namespace    https://slay.one/*
// @version      1.03
// @description  Currently allows you to press 'z' to create account and 'x' to logout
// @author       Meatman2tasty
// @match        https://slay.one/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33760/slayone%20script%20account%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/33760/slayone%20script%20account%20spam.meta.js
// ==/UserScript==

//account spam//
document.addEventListener("keydown", function(a) { // Press 'z' to create account
    if (a.keyCode == 90) {
document.getElementById("inputUserName").value= Math.random().toString(36).substring(7);
document.getElementById("inputUserEmail").value= Math.random().toString(36).substring(7) + "@mail.com";
document.getElementById("inputUserPass").value= "420";
setTimeout(registerAcc(0), 1000);
apply4Clan("420z");
    }
}, false);

document.addEventListener("keydown", function(a) { // Press 'x' to log out
    if (a.keyCode == 88) {
setTimeout(logout(0), 1000);
    }
}, false);
