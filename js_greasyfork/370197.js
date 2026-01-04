// ==UserScript==
// @name         Pornhub Earnings Button
// @namespace    https://greasyfork.org/en/scripts/370197-pornhub-earnings-button
// @version      0.2
// @description  Adds a button for the "Earnings" tab
// @author       Phlegomatic
// @match        https://www.pornhub.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370197/Pornhub%20Earnings%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/370197/Pornhub%20Earnings%20Button.meta.js
// ==/UserScript==

var Menu = document.getElementById("headerMainMenu"); // Pornhub's Menu
var URL = "https://www.pornhub.com/model/payments"; // Earnings Page Address
var cURL = window.location; // Current URL

createButton();

function createButton() {
    var btn = document.createElement("BUTTON");
    var t = document.createTextNode(" $ ");

    btn.setAttribute('title', 'Earnings');
    btn.style.color = "#000000";
    btn.style.background = "#85bb65";
    btn.style.border = "none";
    btn.style.fontSize = "large";

    if(cURL==URL){ // on Earnings Page
       btn.setAttribute('title', 'Return');
    }

    btn.appendChild(t);
    Menu.appendChild(btn);

    Menu.onclick = function() {
        if(cURL==URL){ // on Earnings Page
            window.history.back(); // Go back to the previous page
        }else{
            window.location = URL;
        }
    };
}