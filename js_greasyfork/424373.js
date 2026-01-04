// ==UserScript==
// @name        RECK
// @namespace   http://tampermonkey.net
// @match       https://melvoridle.com
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @grant       none
// @version     1.02
// @author      Gardens#3738
// @description Reroll to a good corruption!
// @downloadURL https://update.greasyfork.org/scripts/424373/RECK.user.js
// @updateURL https://update.greasyfork.org/scripts/424373/RECK.meta.js
// ==/UserScript==
window.reroll = function(equipmentSlot, rollsLeft = 20, lastMods = "default") {
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
        console.log("modHTML")
        console.log(modHTML)
        console.log("lastMods")
        console.log(lastMods)
        console.log();
        // if same mods or bad mods, reroll
        let goodMod = false;
        for (let child of element.children) {
            if (child.outerHTML.indexOf("success") != -1 &&
                child.innerHTML.toLowerCase().indexOf("movement") == -1 &&
                child.innerHTML.toLowerCase().indexOf("stamina") == -1 &&
                child.innerHTML.toLowerCase().indexOf("teleportation") == -1 &&
                child.innerHTML.toLowerCase().indexOf("update") == -1 &&
                child.innerHTML.toLowerCase().indexOf("gang") == -1 &&
                child.innerHTML.length > 0) {
                goodMod = true;
            } else {}
        }

        if (goodMod == false || modHTML == lastMods) {
            setTimeout(() => {
                reroll(equipmentSlot, rollsLeft - 1, modHTML)
            }, 50);
        } else
            return;
    }
}

window.enableCorruptionReroller = function(retries = 20) {
    if (document.getElementById("corruption-equipment-slot-0")) {
        for (let i = 0; i < 20; i++) {
            let element = document.getElementById("corruption-equipment-slot-" + i);
            if (element) {
                element.parentElement.parentElement.setAttribute("onclick", `reroll(${i})`)
            }
        }
        console.log("RECK enabled. Reroll away! - Gardens")
    } else {
        if (retries == 0) {
            "RECK: retries ran out. Maybe you're not in Chaos Mode?";
        } else {
            setTimeout(() => enableCorruptionReroller(retries - 1), 1000);
        }
    }
}

enableCorruptionReroller();