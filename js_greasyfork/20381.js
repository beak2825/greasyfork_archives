// ==UserScript==
// @name         AE Clan
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AE clan
// @author       UnicornAssassin
// @match        http://agar.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20381/AE%20Clan.user.js
// @updateURL https://update.greasyfork.org/scripts/20381/AE%20Clan.meta.js
// ==/UserScript==

//waits for the page to load
window.onload = function start(a) {

    //replaces title
    //h2 selects all h2 elements
    $("h2").replaceWith('<h2>AE Clan</h2>');

    //document.getElementById("start").addEventListener("keypress", myFunction);

    //function myFunction() {
    // document.getElementById("start").style.border.color = "black";
    toggleSettings();



    setTimeout(function() {
        MC.showFreeCoins(); return false;
    }, 3000);







    // }

};