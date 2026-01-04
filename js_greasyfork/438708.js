// ==UserScript==
// @name     Louisclub's backpack spell display
// @author   louisclub
// @description Display colors and outline for spells
// @version  1.1
// @include  *backpack.tf/*
// @grant    none
// @namespace tobedetermined
// @downloadURL https://update.greasyfork.org/scripts/438708/Louisclub%27s%20backpack%20spell%20display.user.js
// @updateURL https://update.greasyfork.org/scripts/438708/Louisclub%27s%20backpack%20spell%20display.meta.js
// ==/UserScript==

// Original code: https://greasyfork.org/users/313414
// Edited and improved by louisclub
// ===================================
//            CONFIGURATION
// ===================================

// Enables script
var enabled = true;

// Make thick borders?
var thicc_borders = true;
var thicc_borders_size = 5;
var postLifeColor = "#ff0000";
var postLife_borders_size = 7;

// Colors for types of spells
var colorBound = {
    // --------------------- Paints
    'Spectral': "#ff9900",
    'Chromatic': "#aa80ff",
    'Die Job': '#cccc00',
    'Putrescent': "#ccff33",
    'Sinister': "#66ff66",
    // --------------------- Weapons
    //'Exorcism': "#02d736",
    // --------------------- Voices
    //'Voices': "#02d736"
};

// colors for borders
var colorBorder = {

    // --------------------- Footprints
    'Headless': "#300099",
    'Rotten': "#ff9933",
    'Gangreen': "#ffff00",
    'Bruised': "#ff6666",
    'Team Spirit': "#ff471a",
    'Violent': "#ffa366",
    'Corpse Gray': "#9fdfbf",
    // --------------------- Weapons
    'Bombs': "#ff9933",
    'Fire': "#ff9933"
};

var cornerBound = {

    // --------------------- Weapons
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
            var cornerColour = "#02d736";
            var backgroundColor = window.getComputedStyle(itemNodes[i], null).getPropertyValue("background-color");
            var borderColor = "#56e0e2";

            var hasBackground = false;
            var hasBorder = false;
            var hasCorner = false;
            var isPostLife = false;

            var originalId = itemNodes[i].getAttribute("data-original_id");

            // check for spell1
            if(itemNodes[i].hasAttribute("data-spell_1"))
            {
                var spellName = itemNodes[i].getAttribute("data-spell_1");
                console.log ("Spell Name is: " + spellName);

                // check for post life
                if (originalId > 3251762665){
                    isPostLife = true;
                }

                //check for background color
                for (var j = 0; j < Object.keys(colorBound).length; j++){
                    if (spellName.includes(Object.keys(colorBound)[j])){
                        backgroundColor = Object.values(colorBound)[j];
                        hasBackground = true;
                        break;
                    }
                }
                // check for border color
                for (j = 0; j < Object.keys(colorBorder).length; j++){
                    if (spellName.includes(Object.keys(colorBorder)[j])){
                        borderColor = Object.values(colorBorder)[j];
                        hasBorder = true;
                        break;
                    }
                }

                // check for voice color
                for (j = 0; j < Object.keys(cornerBound).length; j++){
                    if (spellName.includes(Object.keys(cornerBound)[j])){
                        cornerColour = Object.values(cornerBound)[j];
                        hasCorner = true;
                        break;
                    }
                }
            }

            // check for spell2
            if(itemNodes[i].hasAttribute("data-spell_2"))
            {
                spellName = itemNodes[i].getAttribute("data-spell_2");
                console.log ("Spell Name is: " + spellName);

                // check for background color
                for (j = 0; j < Object.keys(colorBound).length; j++){
                    if (spellName.includes(Object.keys(colorBound)[j])){
                        backgroundColor = Object.values(colorBound)[j];
                        hasBackground = true;
                        break;
                    }
                }
                // check for border color
                for (j = 0; j < Object.keys(colorBorder).length; j++){
                    if (spellName.includes(Object.keys(colorBorder)[j])){
                        borderColor = Object.values(colorBorder)[j];
                        hasBorder = true;
                        break;
                    }
                }

                // check for voice color
                for (j = 0; j < Object.keys(cornerBound).length; j++){
                    if (spellName.includes(Object.keys(cornerBound)[j])){
                        cornerColour = Object.values(cornerBound)[j];
                        hasCorner = true;
                        break;
                    }
                }
            }

            // apply colors
            if (hasBackground){
                itemNodes[i].setAttribute("style", "background-color: " + backgroundColor);
            }
            if (hasCorner){
                itemNodes[i].setAttribute('style', 'background-image: linear-gradient(to bottom left,' + backgroundColor + ',' + backgroundColor + ',' + cornerColour + ')');
            }
            if (hasBorder){
                itemNodes[i].setAttribute('style', itemNodes[i].getAttribute('style') + '; border-color: ' + borderColor + ' !important');
                itemNodes[i].setAttribute('style', itemNodes[i].getAttribute('style') + '; border-width: ' + thicc_borders_size + 'px !important');
            }


            // show post lifes
            if (isPostLife){
                itemNodes[i].setAttribute('style', itemNodes[i].getAttribute('style') + '; border-color: ' + postLifeColor + ' !important');
                itemNodes[i].setAttribute('style', itemNodes[i].getAttribute('style') + '; border-width: ' + postLife_borders_size + 'px !important');
            }

        }
    }

})();