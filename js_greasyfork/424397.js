// ==UserScript==
// @name        Target Corruption
// @namespace   http://tampermonkey.net
// @match       https://melvoridle.com
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @grant       none
// @version     1.02
// @author      Gardens#3738
// @description Reroll to whatever corruption you want!
// @downloadURL https://update.greasyfork.org/scripts/424397/Target%20Corruption.user.js
// @updateURL https://update.greasyfork.org/scripts/424397/Target%20Corruption.meta.js
// ==/UserScript==

window.targetReroll = function(equipmentSlot, targetMods, rollsLeft = 100, lastMods = "default") {
    let cost = getRandomModifierCost(equipmentSlot);
    let element = document.getElementById("corruption-equipment-slot-" + equipmentSlot);
    // if modding possible
    if (rollsLeft > 0 && gp >= cost && equippedItems[equipmentSlot] > 0) {
        // let currentText;
        // get current mods
        if (lastMods == "default")
            lastMods = element.innerHTML;

        // reroll
        getEquipmentCorruption(equipmentSlot);

        let modHTML = element.innerHTML;
        // if same mods or bad mods, reroll
        let goodMod = false;
        for (let child of element.children) {
            if (child.outerHTML.indexOf("success") != -1) {
                for (let targetMod of targetMods) {
                    if (child.innerHTML.toLowerCase().indexOf(targetMod) != -1) {
                        goodMod = true;
                    }
                }
            }
        }

        if (goodMod == false || modHTML == lastMods) {
            setTimeout(() => {
                targetReroll(equipmentSlot, targetMods, rollsLeft - 1, modHTML)
            }, 50);
        } else
            return;
    }
}

// usage:
// targetReroll(2, ["mining", "doubling", "preservation", "smithing"], 200)