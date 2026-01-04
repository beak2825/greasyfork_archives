// ==UserScript==
// @name         Soldados menos sieg
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A fragment of code from NoobScript V3 - The quick troops selector. Press q for selecting all but commander, e for selecting everything, and c for selecting the commander.
// @author       NoobishHacker
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403532/Soldados%20menos%20sieg.user.js
// @updateURL https://update.greasyfork.org/scripts/403532/Soldados%20menos%20sieg.meta.js
// ==/UserScript==
window.addEventListener("keyup", function(a) {
    a = a.keyCode ? a.keyCode : a.which;

    if (a === 81) { // All troops except commander
        selUnits = [];
        units.forEach((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                unit.info.name !== 'Commander' && selUnits.push(unit)

            }
        });
   addEventListener("keydown", function(a){
if (a.keyCode== 69) { // Soldier
        selUnits = [];
        units.forEach((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                unit.info.name !== 'Siege Ram' && selUnits.push(unit)
            }
            return true;
        });
        selUnitType = "Unit";
    }
});
        selUnitType = "Unit";
    } else if (a === 67) { // Commander
        selUnits = [];
        units.every((unit) => {
            if (unit.owner === player.sid && unit.type === 1) {
                if (!unit.info) unit.info = getUnitFromPath(unit.uPath);
                if (unit.info.name === 'Commander') {
                    selUnits.push(unit)
                    return false;
                }
            }
            return true;
        });
        selUnitType = "Unit";
    }
});