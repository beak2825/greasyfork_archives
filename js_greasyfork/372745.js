// JavaScript source code
// ==UserScript==
// @name TF2 Halloween Spell Classifieds Search
// @description A script used to used with the backpack.tf classifieds search to make spell searching easier
// @desctiption Credit goes Magic Genie
// @version 2.5
// @include *backpack.tf/classifieds*
// @grant    none
// @namespace https://greasyfork.org/users/170895
// @downloadURL https://update.greasyfork.org/scripts/372745/TF2%20Halloween%20Spell%20Classifieds%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/372745/TF2%20Halloween%20Spell%20Classifieds%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //begin logging data
    console.log("start");

    //set the path for which screen element is considered the rows
    var rows = document.evaluate(
        "/html/body/main/div/div[1]/div/div/ul/li/span/div/ul/li",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    //set the path for which screen element is the description
    var descriptions = document.evaluate(
        "/html/body/main/div/div[1]/div/div/ul/li/div/h5",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    //log the rows and the description
    console.log(rows.snapshotLength);
    console.log(descriptions.snapshotLength);

    //traverse through each row accordingly
    for (var i = 0; i < rows.snapshotLength; i++) {
        //variables for the refences to the spell data toggles, this way can easily be changed if the pathway is changed
        var spell1 = "data-spell_1";
        var spell2 = "data-spell_2";

        var thisRow = rows.snapshotItem(i);
        //acquire the grandparent node (the parent node of the node that is the parent to this row)

        //keep track whether or not a color has been assigned
        if (thisRow.hasAttribute(spell1)) {
            console.log("spell found");
            //get the data attribute from this row
            spellSearch(spell1, thisRow);
            //update and log style
        }

        if (thisRow.hasAttribute(spell2)) {
            console.log("second spell found");
            spellSearch(spell2, thisRow);
        }

    }

    for (var j = 0; j < descriptions.snapshotLength; j++) {

        var thisDescription = descriptions.snapshotItem(j);
        var matchingRow = rows.snapshotItem(j);

        console.log(thisDescription.textContent);

        if (matchingRow.hasAttribute(spell1)) {
            thisDescription.textContent += "\r\n" + matchingRow.getAttribute(spell1) + " ";
        }

        if (matchingRow.hasAttribute(spell2)) {
            thisDescription.textContent += "\r\n" + matchingRow.getAttribute(spell2);
        }
    }
})();

//takes in the data attribute when found and will then determine which type it is
function spellSearch(spellNum, thisRow) {
    //get parent row
    var thisRowParent = thisRow.parentNode.parentNode.parentNode.parentNode;
    var thisRowParent2 = thisRow.parentNode.parentNode.parentNode;
    //get the spell name from the passed variable
    var spellName = thisRow.getAttribute(spellNum);
    //setting styles
    var currentStyle = thisRowParent.getAttribute("style");
    //Paint Based Spell Variables along with Hex Color Codes
    var Chromatic = "#aa80ff";
    var Putrescent = "#ccff33";
    var Sinister = "#66ff66";
    var Spectral = "#ff9900";
    var DieJob = "#cccc00";

    //Footprint Based Spell Varaibles along with Hex Color Codes
    var Headless = "#300099";
    var CorpseGray = "#9fdfbf";
    var Gangreen = "#ffff00";
    var Bruised = "#ff6666";
    var Violent = "#ffa366";
    var Rotten = "#ff9933";
    var TeamSpirit = "#ff471a";

    //Miscellaeous Spell variables
    var Voices = "#bfbfbf";
    var UnknownSpell = "#f442bc";

    //log the current style
    console.log(currentStyle);
    //Switch on Color Spells
    switch (spellName) {
        case "Halloween Spell: Chromatic Corruption":
            thisRowParent.setAttribute("style", currentStyle + ";background-color: " + Chromatic);
            break;
        case "Halloween Spell: Spectral Spectrum":
            thisRowParent.setAttribute("style", currentStyle + ";background-color: " + Spectral);
            break;
        case "Halloween Spell: Putrescent Pigmentation":
            thisRowParent.setAttribute("style", currentStyle + ";background-color: " + Putrescent);
            break;
        case "Halloween Spell: Sinister Staining":
            thisRowParent.setAttribute("style", currentStyle + ";background-color: " + Sinister);
            break;
        case "Halloween Spell: Die Job":
            thisRowParent.setAttribute("style", currentStyle + ";background-color: " + DieJob);
            break;
        case "Halloween Spell: Headless Horseshoes":
            thisRowParent2.setAttribute("style", currentStyle + ";background-color: " + Headless);
            break;
        case "Halloween Spell: Corpse Gray Footprints":
            thisRowParent2.setAttribute("style", currentStyle + ";background-color: " + CorpseGray);
            break;
        case "Halloween Spell: Gangreen Footprints":
            thisRowParent2.setAttribute("style", currentStyle + ";background-color: " + Gangreen);
            break;
        case "Halloween Spell: Bruised Purple Footprints":
            thisRowParent2.setAttribute("style", currentStyle + ";background-color: " + Bruised);
            break;
        case "Halloween Spell: Violent Violet Footprints":
            thisRowParent2.setAttribute("style", currentStyle + ";background-color: " + Violent);
            break;
        case "Halloween Spell: Rotten Orange Footprints":
            thisRowParent2.setAttribute("style", currentStyle + ";background-color: " + Rotten);
            break;
        case "Halloween Spell: Team Spirit Footprints":
            thisRowParent2.setAttribute("style", currentStyle + ";background-color: " + TeamSpirit);
            break;
        //may need to add a check to make the border gray isntead if already has a color spell
        case "Halloween Spell: Voices From Below":
            thisRowParent.setAttribute("style", currentStyle + ";background-color: " + Voices);
            break;
        //all weapon spells are below, they pull from other variable colors
        case "Halloween Spell: Exorcism":
            thisRowParent.setAttribute("style", currentStyle + ";background-color: " + Voices);
            break;
        case "Halloween Spell: Halloween Fire":
            thisRowParent2.setAttribute("style", currentStyle + ";background-color: " + Sinister);
            break;
        case "Halloween Spell: Pumpkin Bombs":
            thisRowParent2.setAttribute("style", currentStyle + ";background-color: " + Rotten);
            break;
        default:
            thisRowParent.setAttribute("style", currentStyle + ";background-color: " + UnknownSpell);
            console.log(spellName + "is a New or Unknown Spell");
            break;
    }
    console.log(spellName);

}