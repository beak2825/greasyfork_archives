// ==UserScript==
// @name         Defend Attack Switcher
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Saves and loads defend settings. Make sure you click on "Update Settings" after loading.
// @author       LePluB
// @match        https://www.torn.com/preferences.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502107/Defend%20Attack%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/502107/Defend%20Attack%20Switcher.meta.js
// ==/UserScript==


var savedLoadouts = "{}";
const buttonTemplate = `
<div class="lp-defendSetups">
<input id="lp-defendSetup1" class="torn-btn btn-big update lp-defendSetupButton" type="submit" slot=1 value="LOAD DEFEND SETUP 1">
<input id="lp-defendSetup2" class="torn-btn btn-big update lp-defendSetupButton" type="submit" slot=2 value="LOAD DEFEND SETUP 2">
<input id="lp-defendSetup3" class="torn-btn btn-big update lp-defendSetupButton" type="submit" slot=3 value="LOAD DEFEND SETUP 3">
<br><br>
<input id="lp-defendSetupSave1" class="torn-btn btn-big update lp-defendSetupButton" type="submit" slot=1 value="SAVE DEFEND SETUP 1">
<input id="lp-defendSetupSave2" class="torn-btn btn-big update lp-defendSetupButton" type="submit" slot=2 value="SAVE DEFEND SETUP 2">
<input id="lp-defendSetupSave3" class="torn-btn btn-big update lp-defendSetupButton" type="submit" slot=3 value="SAVE DEFEND SETUP 3">
</div>
`



function addButtons() {

    document.querySelector("div#attack-preferences form").insertAdjacentHTML("beforeend", buttonTemplate);
    document.querySelector("input#lp-defendSetupSave1").addEventListener("click", saveLoadoutEvent, false);
    document.querySelector("input#lp-defendSetupSave2").addEventListener("click", saveLoadoutEvent, false);
    document.querySelector("input#lp-defendSetupSave3").addEventListener("click", saveLoadoutEvent, false);
    document.querySelector("input#lp-defendSetup1").addEventListener("click", loadLoadoutEvent, false);
    document.querySelector("input#lp-defendSetup2").addEventListener("click", loadLoadoutEvent, false);
    document.querySelector("input#lp-defendSetup3").addEventListener("click", loadLoadoutEvent, false);
}


function applyLoadout(loadout) {

    console.log("Applying", loadout);
    // Primary
    document.querySelector("div[name=wp-primary] a").innerHTML = parseInt(loadout.primaryPercent);
    document.querySelector("input[name=pw-reload][value=Off]").removeAttribute("checked");
    document.querySelector("input[name=pw-reload][value=On]").removeAttribute("checked");
    if (loadout.primaryReload == true) {
        document.querySelector("input[name=pw-reload][value=On]").setAttribute("checked", true);
    } else {
        document.querySelector("input[name=pw-reload][value=Off]").setAttribute("checked", true);
    }

    // Secondary
    document.querySelector("div[name=wp-secondary] a").innerHTML = parseInt(loadout.secondaryPercent);
    document.querySelector("input[name=sw-reload][value=Off]").removeAttribute("checked");
    document.querySelector("input[name=sw-reload][value=On]").removeAttribute("checked");
    if (loadout.secondaryReload == true) {
        document.querySelector("input[name=sw-reload][value=On]").setAttribute("checked", true);
    } else {
        document.querySelector("input[name=sw-reload][value=Off]").setAttribute("checked", true);
    }

    //Melee
    document.querySelector("div[name=wp-melee] a").innerHTML = parseInt(loadout.meleePercent);

    //Temp
    document.querySelector("div[name=wp-temporary] a").innerHTML = parseInt(loadout.tempPercent);

}

function newLoadout() {
    const loadout = new Object();
    loadout.primaryPercent = 0
    loadout.primaryReload = false
    loadout.secondaryPercent = 0
    loadout.secondaryReload = false
    loadout.meleePercent = 0
    loadout.tempPercent = 0

    return loadout
}

function loadoutFromPage() {

    const loadout = newLoadout();
    loadout.primaryPercent = document.querySelector("div[name=wp-primary] a").innerHTML

    if (document.querySelector("input[name=pw-reload][value=On]").checked == true) {
       loadout.primaryReload = true;
    } else {
       loadout.primaryReload = false;
    }

    loadout.secondaryPercent = document.querySelector("div[name=wp-secondary] a").innerHTML
    if (document.querySelector("input[name=sw-reload][value=On]").checked == true) {
       loadout.secondaryReload = true;
    } else {
       loadout.secondaryReload = false;
    }

    loadout.meleePercent = document.querySelector("div[name=wp-melee] a").innerHTML
    loadout.tempPercent = document.querySelector("div[name=wp-temporary] a").innerHTML


    return loadout

}


function loadLoadouts() {

    savedLoadouts = localStorage.getItem("lp-defendSetups");
    if (savedLoadouts == null) {
        savedLoadouts = "{}"
    }

}

function saveLoadout(slot, loadout) {

    const jsonLoadouts = JSON.parse(savedLoadouts);
    const loadoutAsString = JSON.stringify(loadout);
    jsonLoadouts[slot] = loadoutAsString

    console.log("Saving", jsonLoadouts);
    localStorage.setItem("lp-defendSetups", JSON.stringify(jsonLoadouts));
    savedLoadouts = JSON.stringify(jsonLoadouts);

}

function saveLoadoutEvent(event) {


    const slot = event.target.slot;
    const currentLoadout = loadoutFromPage();

    saveLoadout(slot, currentLoadout);

}

function loadLoadoutEvent(event) {

    const slot = event.target.slot;
    console.log(slot)
    console.log(savedLoadouts);
    const jsonLoadouts = JSON.parse(savedLoadouts);
    const requestedLoadout = JSON.parse(jsonLoadouts[slot]);

    applyLoadout(requestedLoadout);
}

(function() {
    'use strict';

    loadLoadouts();
    addButtons();

})();