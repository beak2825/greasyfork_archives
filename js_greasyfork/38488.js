// ==UserScript==
// @name     TF2 Halloween Spell Search
// @description A script for searching backpack.tf premium for halloween spells a bit easier
// @version  2
// @include  *backpack.tf/premium/search*
// @grant    none
// @namespace https://greasyfork.org/users/170895
// @downloadURL https://update.greasyfork.org/scripts/38488/TF2%20Halloween%20Spell%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/38488/TF2%20Halloween%20Spell%20Search.meta.js
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

    var rows = document.evaluate(
        "/html/body/main/div/div[1]/div/div/ul/li",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    var descriptions = document.evaluate(
        "/html/body/main/div/div[1]/div/div/div/h5",
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null);

    console.log(rows.snapshotLength);
    console.log(descriptions.snapshotLength);

    for(var i = 0; i < rows.snapshotLength; i++){
        var thisRow = rows.snapshotItem(i);
        var thisRowParent = thisRow.parentNode.parentNode;
        var assignedcolor = false;
        if(thisRow.hasAttribute("data-spell_1")){
            console.log("spell found");

            var spellName = thisRow.getAttribute("data-spell_1");

            //Switch on Color Spells
            switch(spellName){
                case "Halloween Spell: Chromatic Corruption":
                    thisRowParent.setAttribute("style", "background-color: " + Chromatic);
                    assignedcolor = true;
                    break;
                case "Halloween Spell: Spectral Spectrum" :
                    thisRowParent.setAttribute("style", "background-color: " + Spectral);
                    assignedcolor = true;
                    break;
                case "Halloween Spell: Putrescent Pigmentation" :
                    thisRowParent.setAttribute("style", "background-color: " + Putrescent);
                    assignedcolor = true;
                    break;
                case "Halloween Spell: Sinister Staining" :
                    thisRowParent.setAttribute("style", "background-color: " + Sinister);
                    assignedcolor = true;
                    break;
                case "Halloween Spell: Die Job" :
                    thisRowParent.setAttribute("style", "background-color: " + Dyejob);
                    assignedcolor = true;
                    break;
                case "Halloween Spell: Headless Horseshoes":
                    thisRowParent.setAttribute("style", "border-color: " + Headless);
                    break;
                case "Halloween Spell: Corpse Gray Footprints":
                    thisRowParent.setAttribute("style", "border-color: " + CorspeGray);
                    break;
                case "Halloween Spell: Gangreen Footprints":
                    thisRowParent.setAttribute("style", "border-color: " + Gangreen);
                    break;
                case "Halloween Spell: Bruised Purple Footprints":
                    thisRowParent.setAttribute("style", "border-color: " + Bruised);
                    break;
                case "Halloween Spell: Violent Violet Footprints":
                    thisRowParent.setAttribute("style", "border-color: " + Violent);
                    break;
                case "Halloween Spell: Rotten Orange Footprints":
                    thisRowParent.setAttribute("style", "border-color: " + Rotten);
                    break;
                case "Halloween Spell: Team Spirit Footprints":
                    thisRowParent.setAttribute("style", "border-color: " + TeamSpirit);
                    break;
                default:
                    thisRowParent.setAttribute("style", "background-color: " + Unknown);
                    assignedcolor = true;
            }

        }

        var currentstyle = thisRowParent.getAttribute("style");
        console.log(currentstyle);

        if(thisRow.hasAttribute("data-spell_2")){
            console.log("this is doubled spelled");

            var spellName2 = thisRow.getAttribute("data-spell_2");

            switch(spellName2){
                case "Halloween Spell: Chromatic Corruption":
                    thisRowParent.setAttribute("style", currentstyle + ";background-color: " + Chromatic);
                    assignedcolor = true;
                    break;
                case "Halloween Spell: Spectral Spectrum" :
                    thisRowParent.setAttribute("style", currentstyle + ";background-color: " + Spectral);
                    assignedcolor = true;
                    break;
                case "Halloween Spell: Putrescent Pigmentation" :
                    thisRowParent.setAttribute("style", currentstyle + ";background-color: " + Putrescent);
                    assignedcolor = true;
                    break;
                case "Halloween Spell: Sinister Staining" :
                    thisRowParent.setAttribute("style", currentstyle + ";background-color: " + Sinister);
                    assignedcolor = true;
                    break;
                case "Halloween Spell: Die Job" :
                    thisRowParent.setAttribute("style", currentstyle + ";background-color: " + Dyejob);
                    assignedcolor = true;
                    break;
                case "Halloween Spell: Headless Horseshoes":
                    thisRowParent.setAttribute("style", currentstyle + ";border-color: " + Headless);
                    break;
                case "Halloween Spell: Corpse Gray Footprints":
                    thisRowParent.setAttribute("style", currentstyle + ";border-color: " + CorspeGray);
                    break;
                case "Halloween Spell: Gangreen Footprints":
                    thisRowParent.setAttribute("style", currentstyle + ";border-color: " + Gangreen);
                    break;
                case "Halloween Spell: Bruised Purple Footprints":
                    thisRowParent.setAttribute("style", currentstyle + ";border-color: " + Bruised);
                    break;
                case "Halloween Spell: Violent Violet Footprints":
                    thisRowParent.setAttribute("style", currentstyle + ";border-color: " + Violent);
                    break;
                case "Halloween Spell: Rotten Orange Footprints":
                    thisRowParent.setAttribute("style", currentstyle + ";border-color: " + Rotten);
                    break;
                case "Halloween Spell: Team Spirit Footprints":
                    thisRowParent.setAttribute("style", currentstyle + ";border-color: " + TeamSpirit);
                    break;
                default:
                    thisRowParent.setAttribute("style", currentstyle + ";border-color: " + Unknown);
            }
        }
        console.log(assignedcolor);
        if ((thisRow.hasAttribute("data-spell_1") || thisRow.hasAttribute("data-spell_2")) &&  !assignedcolor)
        {
            console.log("assigning default color");
            thisRowParent.setAttribute("style", currentstyle + ";background-color: " + Unknown);
        }


    }

    for(var j = 0; j < descriptions.snapshotLength; j++){

        var thisDescription = descriptions.snapshotItem(j);
        var matchingRow = rows.snapshotItem(j);

        console.log(thisDescription.textContent);

        if(matchingRow.hasAttribute("data-spell_1")){
            thisDescription.textContent = thisDescription.textContent + "\r\n" + matchingRow.getAttribute("data-spell_1") + " ";
        }

        if(matchingRow.hasAttribute("data-spell_2")){
            thisDescription.textContent = thisDescription.textContent + "\r\n" + matchingRow.getAttribute("data-spell_2") + " ";
        }
    }
})();