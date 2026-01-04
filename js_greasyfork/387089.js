// ==UserScript==
// @name         theHunter auto join all competitions
// @namespace    https://greasyfork.org/fr/users/153112-spychopat
// @version      0.1
// @description  Add a button to join all avalaible competitions at once. You need to be on competitions page first ! It will only joins competitions that are displayed on screen !
// @author       Spychopat
// @match        https://www.thehunter.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387089/theHunter%20auto%20join%20all%20competitions.user.js
// @updateURL https://update.greasyfork.org/scripts/387089/theHunter%20auto%20join%20all%20competitions.meta.js
// ==/UserScript==


function joinAllComp() {
    var buttons = [];
    do {
        console.log("check buttons...");
        buttons = document.getElementsByClassName("btn btn-primary btn-join");
    } while (buttons.length = 0);
    console.log("Buttons found ! Starting clicking buttons...");
    for (var i = 0; i < buttons.length; i++) {
        console.log("Clicking button "+i+"...");
        buttons[i].click();
    }
}

(function() {
    'use strict';
    var btn = document.createElement("BUTTON");
    btn.innerHTML = "JOIN ALL COMPETITIONS";
    btn.onclick = function(){joinAllComp()};
    btn.style.background = "#f9370d";
    btn.style.border = "none";
    btn.style.color = "#fff";
    btn.style.borderRadius = "5px";
    btn.style.fontSize = "20px";
    btn.style.padding = "10px";
    btn.style.margin = "10px";
    btn.style.boxShadow = "2px 2px rgba(0,0,0,0.4)";
    document.getElementById("page_menu").appendChild(btn);

})();