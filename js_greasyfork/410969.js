// ==UserScript==
// @name         [MH] Recall Droid Total Enerchi Calculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Calculate how much enerchi you will have in total if you retreat now
// @author       https://greasyfork.org/en/users/685781-meowth
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410969/%5BMH%5D%20Recall%20Droid%20Total%20Enerchi%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/410969/%5BMH%5D%20Recall%20Droid%20Total%20Enerchi%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.getElementsByClassName('riftFuromaHUD-chargeLevel-stat')[0] == null) { return; }
    main_exec();
    document.body.addEventListener('click', main_exec, true);
})();

function parseEnergy(class_name){
    return parseInt(document.getElementsByClassName(class_name)[0].textContent.split(",").join(""));
}

function createEnerchiClassAndAppendToToolTip(class_name, text){
    var oldElement = document.getElementsByClassName(class_name+"-meowth-furoma-calc");
    if (oldElement[0] != null) {
        oldElement[0].remove();
    }
    var element = document.createElement("div");
    element.classList.add(class_name);
    element.classList.add(class_name+"-meowth-furoma-calc");
    element.style.backgroundColor = "#3AE4EB";
    element.appendChild(document.createTextNode(text));
    document.getElementsByClassName('riftFuromaHUD-chargeLevel-stat droid_energy')[0].appendChild(element);
}

function main_exec() {
    var current_enerchi = parseEnergy("riftFuromaHUD-chargeLevel-stat-value riftFuromaHUD-droid-details-energy-value");
    var droid_charge = parseEnergy("riftFuromaHUD-chargeLevel-stat-value riftFuromaHUD-droid-charge");
    var total_enerchi = Math.floor(current_enerchi + droid_charge / 2);

    console.log("Enerchi:" + total_enerchi);

    createEnerchiClassAndAppendToToolTip("riftFuromaHUD-chargeLevel-stat-label", "After Recall");
    createEnerchiClassAndAppendToToolTip("riftFuromaHUD-chargeLevel-stat-value", total_enerchi.toLocaleString());
}