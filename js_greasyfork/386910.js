// ==UserScript==
// @name     Backpack TF2 Spell Display
// @description A script for searching backpack.tf premium for halloween spells a bit easier. Updated to run automatically when items load.
// @version  1.21
// @include  *backpack.tf/*
// @grant    none
// @namespace https://greasyfork.org/users/313414
// @downloadURL https://update.greasyfork.org/scripts/386910/Backpack%20TF2%20Spell%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/386910/Backpack%20TF2%20Spell%20Display.meta.js
// ==/UserScript==

// CONFIG
var enabled = true;

(function() {
    'use strict';

    var Chromatic = "#aa80ff";
    var Putrescent = "#ccff33";
    var Sinister = "#66ff66";
    var Spectral = "#ff9900";
    var Dyejob = "#cccc00";
    var Unknown = "#bfbfbf";

    var Headless = "#300099";
    var CorspeGray = "#9fdfbf";
    var Gangreen = "#ffff00";
    var Bruised = "#ff6666";
    var Violent = "#ffa366";
    var Rotten = "#ff9933";
    var TeamSpirit = "#ff471a";

    var SpellBorder = "#ff4d4d";

    var itemNodes = document.getElementsByClassName("item");

    if (enabled === true) start();

    function start() {
        // Checks whether the backpack items have loaded
        var load = setInterval(check, 500);

        function check() {

            if (itemsLoaded() === true) {
                clearInterval(load);
                highLightItems();
            }
            else {
                // Refreshes item count
                itemNodes = document.getElementsByClassName("item");
            }
        }
    }

    function itemsLoaded() {
        return (itemNodes.length !== 0);
    }

    function highLightItems() {
        for (var i = 0; i < itemNodes.length; i++)
        {
            if(itemNodes[i].hasAttribute("data-spell_1") || itemNodes[i].hasAttribute("data-spell_2"))
            {
                var baseColor = window.getComputedStyle(itemNodes[i], null).getPropertyValue("background-color");
                itemNodes[i].setAttribute("style", "background-image: linear-gradient(to bottom left,"+ baseColor + "," + baseColor + "," + SpellBorder + ")");
            }

        }
    }

})();