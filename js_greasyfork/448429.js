// ==UserScript==
// @name        Melvor Better Tooltips
// @description Adds extra useful information to some of the game's tooltips.
// @version     1.3
// @author      OldAbblis#6012
// @namespace   http://tampermonkey.net/
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @noframes
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/448429/Melvor%20Better%20Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/448429/Melvor%20Better%20Tooltips.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function betterTooltips() {
        createItemInformationTooltip = (itemID, showStats = false) => {
            let potionCharges = "", description = "", spec = getItemSpecialAttackInformation(itemID), hp = "", passive = "", html = "", baseStats = "", totalPrice = "", remainingCharges = "";
            const item = items[itemID];

            if (showStats && item.isEquipment)
                baseStats = getItemBaseStatsBreakdown(itemID);
            if (item.isPotion)
                potionCharges = "<small class='text-warning'>" + templateString(getLangString("MENU_TEXT", "POTION_CHARGES"), {charges: `${items[itemID].potionCharges}`}) + "</small><br>";
            if (item.description !== undefined)
                description = "<small class='text-info'>" + items[itemID].description + "</small><br>";
            if (isFood(item))
                hp = "<img class='skill-icon-xs ml-2' src='" + CDNDIR + "assets/media/skills/hitpoints/hitpoints.svg'><span class='text-success'>+" + player.getFoodHealing(item) + "</span>";
            if (isEquipment(item) && item.validSlots.includes("Passive") && equipmentSlotData.Passive.unlocked)
                passive = '<br><small class="text-success">' + getLangString("MENU_TEXT", "PASSIVE_SLOT_COMPATIBLE") + "</small>";
            if (isEquipment(item) && item.validSlots.includes("Gloves") && item.name.includes("ing Gloves"))
                remainingCharges = '<small class="badge badge-info">' + formatNumber(glovesTracker[items[itemID].gloveID].remainingActions) + " Charges</small>";
            if (getBankQty(itemID) !== 1)
                totalPrice = "(" + numberWithCommas(getItemSalePrice(itemID) * getBankQty(itemID)) + ")";

            html += `<div class="text-center">
                <div class="media d-flex align-items-center push">
                    <div class="mr-3">
                        <img class="bank-img m-1" src="${getItemMedia(itemID)}">
                    </div>
                    <div class="media-body">
                        <div class="font-size-sm">
                            ${remainingCharges}
                        </div>
                        <div class="font-w600">
                            ${items[itemID].name} <span style="font-weight: 400 !important">
                                (ID: ${itemID})
                            </span>
                        </div>
                        ${potionCharges}
                        ${description}
                        ${spec}
                        <div class="font-size-sm">
                            <img class="skill-icon-xs" src="${CDNDIR}assets/media/main/coins.svg"> ${numberWithCommas(getItemSalePrice(itemID))} ${totalPrice}
                            <br>
                            ${hp}
                            ${passive}
                            <br>
                        </div>
                        ${baseStats}
                    </div>
                </div>
            </div>`;

            return html;
        }
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('Loading Melvor Better Tooltips script');
            betterTooltips();
        }
    }

    const interval = setInterval(loadScript, 500);
});
