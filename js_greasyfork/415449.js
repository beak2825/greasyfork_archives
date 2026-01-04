// ==UserScript==
// @name     Backpack TF2 Spell Display
// @author   Pocket Deer
// @description Makes TF2 spelled items more visible on backpack.tf, when page loads
// @version  1.0
// @include  *backpack.tf/*
// @grant    none
// @namespace https://greasyfork.org/ru/users/701306
// @downloadURL https://update.greasyfork.org/scripts/415449/Backpack%20TF2%20Spell%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/415449/Backpack%20TF2%20Spell%20Display.meta.js
// ==/UserScript==

// Original code: https://greasyfork.org/users/313414
// Edited and improved by Pocket Deer
// ===================================
//            CONFIGURATION
// ===================================

// Enables script
var enabled = true;

// Color for spelled items
var SpellBorder = "#56e0e2"; // Not used now

// Make color borders for Halloween Items?
var borders = true;

// Make borders THICC?
var thicc_borders = true;
var thicc_borders_size = 4;

// Colors for types of spells
var colorBound = {
    // --------------------- Paints
    // God tier
    'Spectral': "#ff9900",
    // High tier
    'Chromatic': "#aa80ff",
    // Mid tier
    'Dye Job': '#cccc00',
    // Low tier
    'Putrescent': "#ccff33",
    'Sinister': "#66ff66",
    // --------------------- Footprints
    // God tier
    'Headless': "#300099",
    // High tier
    'Rotten': "#ff9933",
    'Gangreen': "#ffff00",
    // Mid tier
    'Bruised': "#ff6666",
    'TeamSpirit': "#ff471a",
    // Low tier
    'Violent': "#ffa366",
    'CorspeGray': "#9fdfbf",
    // --------------------- Weapons
    'Bombs': '#ff9933',
    'Fire': '#ff9933',
    'Exorcism': "#02d736",
    // --------------------- Voices
    'Voices': "#02d736"
};

//
(function() {
    'use strict';

    var itemNodes = document.getElementsByClassName("item");

    if (enabled === true) start();

    function start() {
        // Checks whether the backpack items have loaded
        var load = setInterval(check, 500);

        function check() {

            if ((itemNodes.length !== 0) === true) {
                clearInterval(load);
                highLightItems();
            }
            else {
                // Refreshes item count
                itemNodes = document.getElementsByClassName("item");
            }
        }
    }

    function highLightItems() {
        for (var i = 0; i < itemNodes.length; i++)
        {
            if(itemNodes[i].hasAttribute("data-spell_1") || itemNodes[i].hasAttribute("data-spell_2"))
            {
                var baseColor = window.getComputedStyle(itemNodes[i], null).getPropertyValue("background-color");
                var spellName1 = itemNodes[i].getAttribute("data-spell_1");
                var spellColor1;
                console.log ("Spell Name is: " + spellName1);
                //console.log ("colorBound length is:" + Object.keys(colorBound).length);
                for (var j = 0; j < Object.keys(colorBound).length; j++){
                    if (spellName1.includes(Object.keys(colorBound)[j])){
                        spellColor1 = Object.values(colorBound)[j];
                        break;
                        //console.log(Object.keys(colorBound)[j] + ' = ' + Object.values(colorBound)[j]);
                    }
                    else {
                        spellColor1 = baseColor;
                    }
                }
                //itemNodes[i].setAttribute("style", "background-image: linear-gradient(to bottom left,"+ baseColor + "," + baseColor + "," + spellColor1 + "," + SpellBorder + ")");
                // Set background gradient for Halloween Items
                itemNodes[i].setAttribute('style', 'background-image: linear-gradient(to bottom left,' + baseColor + ',' + baseColor + ',' + spellColor1 + ')');
                // Set borders for Halloween Items
                if (borders == true) {
                    itemNodes[i].setAttribute('style', itemNodes[i].getAttribute('style') + '; border-color: ' + spellColor1 + ' !important');
                }
                if (thicc_borders == true) {
                    itemNodes[i].setAttribute('style', itemNodes[i].getAttribute('style') + '; border-width: ' + thicc_borders_size + 'px !important');
                }
            }

        }
    }

})();