// ==UserScript==
// @name     Backpack TF2 Spell Display
// @description A script for searching backpack.tf premium for halloween spells a bit easier
// @version  1
// @include  *backpack.tf/profiles*
// @run-at   context-menu
// @grant    none
// @namespace https://greasyfork.org/users/170895
// @downloadURL https://update.greasyfork.org/scripts/367675/Backpack%20TF2%20Spell%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/367675/Backpack%20TF2%20Spell%20Display.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("start");
    var Chromatic = "#aa80ff";
    var Putrescent = "#ccff33";
    var Sinister = "#66ff66";
    var Spectral = "#ff9900";
    var Dyejob = "#cccc00";
    var Unknown = "#bfbfbf";

    var Headless = "#300099";
    var CorspeGray = "#9fdfbf";
    var Gangreen = "#ffff00";
    var Bruised  = "#ff6666";
    var Violent  = "#ffa366";
    var Rotten   = "#ff9933";
    var TeamSpirit = "#ff471a";

    var SpellBorder = "#ff4d4d";

    var itemNodes = document.getElementsByClassName("item");

    for (var i = 0; i < itemNodes.length; i++)
    {
        if(itemNodes[i].hasAttribute("data-spell_1") || itemNodes[i].hasAttribute("data-spell_2"))
        {
            console.log("spells found");
            itemNodes[i].setAttribute("style", "background-color: " + SpellBorder);
        }

    }

    console.log(itemNodes.length);

    console.log("end");

})();