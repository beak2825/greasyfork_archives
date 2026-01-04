// ==UserScript==
// @name Steam Search For SkidrowReloaded, IGG-Games, and x1337x.
// @description Adds buttons to Steam pages that searches for them on SkidrowReloaded, IGG-Games, or x1337x on a new tab.
// @version 1.1
// @license MIT
// @match https://store.steampowered.com/app/*
// @namespace https://greasyfork.org/users/930830
// @downloadURL https://update.greasyfork.org/scripts/470424/Steam%20Search%20For%20SkidrowReloaded%2C%20IGG-Games%2C%20and%20x1337x.user.js
// @updateURL https://update.greasyfork.org/scripts/470424/Steam%20Search%20For%20SkidrowReloaded%2C%20IGG-Games%2C%20and%20x1337x.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the game name from the URL after /app/number/
    var gameName = window.location.pathname.split("/")[3];
    // Modified game name for IGG-Games
    var modifiedGameName = gameName.replace(/_/g, "+");


    // Create a new button element for SkidrowReloaded
    var buttonSkidrow = document.createElement("a");
    buttonSkidrow.className = "btnv6_blue_hoverfade btn_medium";
    buttonSkidrow.style.marginLeft = "10px";
    buttonSkidrow.innerHTML = '<span>SkidrowReloaded</span>';
    buttonSkidrow.style.backgroundColor = "#0B0C10";

    buttonSkidrow.onclick = function() {
        window.open("https://www.skidrowreloaded.com/?s=" + encodeURIComponent(gameName));
    };

    // Create a new button element for IGG-Games
    var buttonIGG = document.createElement("a");
    buttonIGG.className = "btnv6_blue_hoverfade btn_medium";
    buttonIGG.style.marginLeft = "10px";
    buttonIGG.innerHTML = '<span>IGG-Games</span>';
    buttonIGG.style.backgroundColor = "#3B3B3B";

    buttonIGG.onclick = function() {
        window.open("https://igg-games.com/?s=" + encodeURIComponent(modifiedGameName).replace(/%2B/g, "+"));
    };

    // Create a new button element for x1337x
    var buttonTorrent = document.createElement("a");
    buttonTorrent.className = "btnv6_blue_hoverfade btn_medium";
    buttonTorrent.style.marginLeft = "10px";
    buttonTorrent.innerHTML = '<span>x1337x</span>';
    buttonTorrent.style.backgroundColor = "#902600";

    buttonTorrent.onclick = function() {
        window.open("https://x1337x.ws/srch?search=" + encodeURIComponent(gameName));
    };

    //Find the ignore button and insert the new buttons near it
    var ignoreButton = document.querySelector("#ignoreBtn");
    if (ignoreButton) {
        ignoreButton.parentNode.insertBefore(buttonSkidrow, ignoreButton.nextSibling);
        ignoreButton.parentNode.insertBefore(buttonIGG, buttonSkidrow.nextSibling);
        ignoreButton.parentNode.insertBefore(buttonTorrent, buttonIGG.nextSibling);
    }
})();
