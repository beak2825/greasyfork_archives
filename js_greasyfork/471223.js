// ==UserScript==
// @name         itch.io Hide Paid Games
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to hide non-free games on itch.io
// @author       You
// @match        https://itch.io/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itch.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471223/itchio%20Hide%20Paid%20Games.user.js
// @updateURL https://update.greasyfork.org/scripts/471223/itchio%20Hide%20Paid%20Games.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.pp = function(n,d) {
        var lastParent = null;
        if(d == 0) { return n };
        for(var i = 0; i < d; i++) {
            lastParent = (lastParent ?? n).parentNode;
            if(!lastParent) {
                return null
            };
        };
        return lastParent;
    };

    window.removeGamesWithPrices = function() {
        //Iterated parent getter

        //Get game result list (for removeChild)
        var gameGrid = document.getElementsByClassName("game_grid_widget")[0];

        //Get the cells with prices by getting the price tags and ascending to the game results themselves
        var gameCellsWithPrices = Array.from(document.getElementsByClassName("price_value")).map(x => window.pp(x,4));

        //Remove the games with prices
        for(var j = 0; j < gameCellsWithPrices.length; j++) {
            gameGrid.removeChild(gameCellsWithPrices[j])
        };
    };

    //GUI
    var topBar = document.querySelector(".search_header:has(h2)");
    var removeButton = document.createElement("button");
        removeButton.innerText = "Remove paid results";
        removeButton.addEventListener("click",window.removeGamesWithPrices);
        removeButton.style.margin = "20px 40px 0 40px";
    topBar.appendChild(removeButton)
})();