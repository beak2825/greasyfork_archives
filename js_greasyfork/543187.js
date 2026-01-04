// ==UserScript==
// @name         Mousehunt Furoma Rift Script (Cypher)
// @namespace    http://tampermonkey.net/
// @version      0.19
// @description  Autobot for Mousehunt Furoma Rift
// @author       Cypher
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543187/Mousehunt%20Furoma%20Rift%20Script%20%28Cypher%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543187/Mousehunt%20Furoma%20Rift%20Script%20%28Cypher%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const mhLocation = document.querySelector('.mousehuntHud-environmentName').textContent;
    if (mhLocation !== 'Furoma Rift'){
        return;
    }

    // Wrap the entire interval function in an async function
    setInterval(async function(){
        const brieStringTrigger = 500
        const riftVacBuyTrigger = 1000
        const riftCurdBuyTrigger = 1000
        const ionizedSaltBuyTrigger = 500

        const enerchiCharm = document.querySelector('a[data-item-type="rift_furoma_energy_trinket"]');
        const enerchiCharmNum = Number(document.querySelector('a[data-item-type="rift_furoma_energy_trinket"]').querySelector('.quantity').textContent);
        const enerchiCharmArm = document.querySelector('a[data-item-type="rift_furoma_energy_trinket"]').querySelector('.mousehuntArmNowButton');

        const brieString = document.querySelector('a[data-item-type="brie_string_cheese"]');
        const brieStringNum = Number(document.querySelector('a[data-item-type="brie_string_cheese"]').querySelector('.quantity').textContent);
        const brieStringArm = document.querySelector('a[data-item-type="brie_string_cheese"]').querySelector('.mousehuntArmNowButton');

        const riftGlutter = document.querySelector('a[data-item-type="rift_glutter_cheese"]');
        const riftGlutterNum = Number(document.querySelector('a[data-item-type="rift_glutter_cheese"]').querySelector('.quantity').textContent);
        const riftGlutterArm = document.querySelector('a[data-item-type="rift_glutter_cheese"]').querySelector('.mousehuntArmNowButton');

        const riftCombat = document.querySelector('a[data-item-type="rift_combat_cheese"]');
        const riftCombatNum = Number(document.querySelector('a[data-item-type="rift_combat_cheese"]').querySelector('.quantity').textContent);
        const riftCombatArm = document.querySelector('a[data-item-type="rift_combat_cheese"]').querySelector('.mousehuntArmNowButton');

        const riftSusheese = document.querySelector('a[data-item-type="rift_susheese"]');
        const riftSusheeseNum = Number(document.querySelector('a[data-item-type="rift_susheese"]').querySelector('.quantity').textContent);
        const riftSusheeseArm = document.querySelector('a[data-item-type="rift_susheese"]').querySelector('.mousehuntArmNowButton');

        const riftRumble = document.querySelector('a[data-item-type="rift_rumble_cheese"]');
        const riftRumbleNum = Number(document.querySelector('a[data-item-type="rift_rumble_cheese"]').querySelector('.quantity').textContent);
        const riftRumbleArm = document.querySelector('a[data-item-type="rift_rumble_cheese"]').querySelector('.mousehuntArmNowButton');

        const riftOnyx = document.querySelector('a[data-item-type="rift_onyx_cheese"]');
        const riftOnyxNum = Number(document.querySelector('a[data-item-type="rift_onyx_cheese"]').querySelector('.quantity').textContent);
        const riftOnyxArm = document.querySelector('a[data-item-type="rift_onyx_cheese"]').querySelector('.mousehuntArmNowButton');

        const riftAscended = document.querySelector('a[data-item-type="rift_hapless_cheese"]');
        const riftAscendedNum = Number(document.querySelector('a[data-item-type="rift_hapless_cheese"]').querySelector('.quantity').textContent);
        const riftAscendedArm = document.querySelector('a[data-item-type="rift_hapless_cheese"]').querySelector('.mousehuntArmNowButton');

        //Check and restock Brie String
        console.log('Checking Brie String...');
        if (brieStringNum <= brieStringTrigger) {
            const returnCamp = document.querySelector('li.camp > a');
            const cheeseShop = document.querySelector('li.cheese_shoppe > a');
            cheeseShop.click();
            await waitFor(2000);
            const brieStringText = document.querySelector('div.itemPurchaseView-container.brie_string_cheese input[type="text"]');
            brieStringText.value = String(brieStringTrigger);
            await waitFor(2000);
            const brieStringBuy = document.querySelector('div.itemPurchaseView-container.brie_string_cheese .itemPurchaseView-action-form-button.buy');
            brieStringBuy.click();
            await waitFor(2000);
            const brieStringBuyConfirm = document.querySelector('div.itemPurchaseView-container.brie_string_cheese .itemPurchaseView-action-confirm-button');
            brieStringBuyConfirm.click();
            await waitFor(2000);
            returnCamp.click();
            await waitFor(2000);
            console.log(brieStringTrigger, 'Brie String bought, returning to camp');
        }
        else {
            console.log(brieStringNum, 'Brie String found, buying bypassed');
        }

        //Check and restock Rift Vacuum Charm
        console.log('Checking Rift Vacuum Charm...')
        const checkCharm = document.querySelector('button[data-item-classification="trinket"]')
        checkCharm.click();
        await waitFor(2000);
        const riftVacNum = Number(document.querySelector('[data-item-id="1553"] .campPage-trap-itemBrowser-favorite-item-image-quantity').textContent.replace(/,/g, ''));
        const closeCharm = document.querySelector('.campPage-trap-blueprint-closeButton');
        closeCharm.click();
        await waitFor(2000);
        if (riftVacNum <= riftVacBuyTrigger) {
            const returnCamp = document.querySelector('li.camp > a')
            const charmShop = document.querySelector('li.charm_shoppe > a');
            charmShop.click();
            await waitFor(2000);
            const riftVacContainer = document.querySelector('div.itemPurchaseView-container.rift_vacuum_trinket input[type="text"]');
            riftVacContainer.value = String(riftVacBuyTrigger);
            await waitFor(2000);
            const riftVacBuy = document.querySelector('div.itemPurchaseView-container.rift_vacuum_trinket .itemPurchaseView-action-form-button.buy');
            riftVacBuy.click();
            await waitFor(2000);
            const riftVacBuyConfirm = document.querySelector('div.itemPurchaseView-container.rift_vacuum_trinket .itemPurchaseView-action-confirm-button');
            riftVacBuyConfirm.click();
            await waitFor(2000);
            returnCamp.click();
            await waitFor(2000);
            console.log(riftVacBuyTrigger, 'Rift Vacuum bought, returning to camp');
        }
        else {
            console.log(riftVacNum, 'Rift Vacuum found, buying bypassed');
        }

        //Open and close Crafting Menu
        console.log('Checking Crafting Materials...')
        const checkCraftSupplies = document.querySelector('a.riftFuromaHUD-itemGroup-craftButton');
        checkCraftSupplies.click();
        await waitFor(2000);
        const closeCraftSupplies = document.querySelectorAll('a.riftFuromaHUD-craftingPopup-tabHeader span');
        closeCraftSupplies.forEach(span => {
            if (span.innerText === 'x') {
                span.parentNode.click();
            }
            });
        await waitFor(2000);
        //Check and restock Crafting Materials (Ionized Salt/Rift Curd/Tiny Platinum Bar)
        const riftCurdNum = Number(document.querySelector('div[data-part-type="rift_cheese_curd_crafting_item"] .quantity').innerText);
        const ionizedSaltNum = Number(document.querySelector('div[data-part-type="ionized_salt_craft_item"] .quantity').innerText);
        if (riftCurdNum <= riftCurdBuyTrigger) {
            const returnCamp = document.querySelector('li.camp > a');
            const generalShop = document.querySelector('li.general_store > a');
            generalShop.click();
            await waitFor(2000);
            const riftCurdText = document.querySelector('div.itemPurchaseView-container.rift_cheese_curd_crafting_item input[type="text"]');
            riftCurdText.value = String(riftCurdBuyTrigger);
            await waitFor(2000);
            const riftCurdBuy = document.querySelector('div.itemPurchaseView-container.rift_cheese_curd_crafting_item .itemPurchaseView-action-form-button.buy');
            riftCurdBuy.click();
            await waitFor(2000);
            const riftCurdBuyConfirm = document.querySelector('div.itemPurchaseView-container.rift_cheese_curd_crafting_item .itemPurchaseView-action-confirm-button');
            riftCurdBuyConfirm.click();
            await waitFor(2000);
            returnCamp.click();
            await waitFor(2000);
            console.log(riftCurdBuyTrigger, 'Rift Curd bought, returning to camp');
        }
        else {
            console.log(riftCurdNum, 'Rift Curd found, buying bypassed');
        }
        if (ionizedSaltNum <= ionizedSaltBuyTrigger) {
            const returnCamp = document.querySelector('li.camp > a');
            const generalShop = document.querySelector('li.general_store > a');
            generalShop.click();
            await waitFor(2000);
            const ionizedSaltText = document.querySelector('div.itemPurchaseView-container.ionized_salt_craft_item input[type="text"]');
            ionizedSaltText.value = String(ionizedSaltBuyTrigger);
            await waitFor(2000);
            const ionizedSaltBuy = document.querySelector('div.itemPurchaseView-container.ionized_salt_craft_item .itemPurchaseView-action-form-button.buy');
            ionizedSaltBuy.click();
            await waitFor(2000);
            const ionizedSaltBuyConfirm = document.querySelector('div.itemPurchaseView-container.ionized_salt_craft_item .itemPurchaseView-action-confirm-button');
            ionizedSaltBuyConfirm.click();
            await waitFor(2000);
            returnCamp.click();
            await waitFor(2000);
            console.log(ionizedSaltBuyTrigger, 'Ionized Salt bought, returning to camp');
        }
        else {
            console.log(ionizedSaltNum, 'Ionized Salt found, buying bypassed');
        }

        //Global Location Variables
        console.log('Checking location...');
        const highestConnectedBattery = document.querySelectorAll('.riftFuromaHUD-battery.connected').length;
        const depletedBattery = document.querySelectorAll('.riftFuromaHUD-battery.connected.exhausted').length;
        const currentHighestBatteryLeft = highestConnectedBattery - depletedBattery;
        const currentCheese = document.querySelector('span.campPage-trap-baitName').textContent;
        console.log('Currently armed with', currentCheese);

        //Outside the Grand Pagoda
        if (currentHighestBatteryLeft === 0) {
            console.log('Detected outside the Grand Pagoda, checking Enerchi levels...');
            const allUnlockedBatteryDict = document.querySelectorAll('a.riftFuromaHUD-battery.unlocked');
            const highestUnlockedBattery = allUnlockedBatteryDict[allUnlockedBatteryDict.length - 1];
            const highestUnlockedBatteryEnerchi = Number(highestUnlockedBattery.getAttribute('data-energy'));
            const enerchiLeft = Number(document.querySelector('.riftFuromaHUD-chargeLevel-stat-value.riftFuromaHUD-droid-details-energy-value').textContent.replace(/,/g, ''));
            //Entering Pagoda with highest battery
            if (enerchiLeft >= highestUnlockedBatteryEnerchi) {
                highestUnlockedBattery.click();
                await waitFor(2000);
                const enterPagodaConfirm = document.querySelector('.riftFuromaHUD-confirmPopup-viewState.enterPagoda .mousehuntActionButton.confirm');
                enterPagodaConfirm.click();
                await waitFor(2000);
                console.log('Entering Grand Pagoda with Battery', allUnlockedBatteryDict.length);
            }
            else {
                console.log('Charging Enerchi, current Enerchi:', enerchiLeft, '/', highestUnlockedBatteryEnerchi);
            }
        }

        //Inside the Grand Pagoda
        else {
            //For Battery 10
            if (currentHighestBatteryLeft === 10) {
                console.log('Detected Battery 10, arming Rift Onyx...');
                if (currentCheese !== 'Null Onyx Gorgonzola'){
                    riftOnyxArm.click();
                    await waitFor(2000);
                }
            }
            //For Battery 9
            else if (currentHighestBatteryLeft === 9){
                console.log('Detected Battery 9, arming Rift Rumble...');
                if (currentCheese !== 'Rift Rumble Cheese'){
                    riftRumbleArm.click();
                    await waitFor(2000);
                }
            }
            //For Battery 8 and 7
            else if (currentHighestBatteryLeft === 8 || currentHighestBatteryLeft === 7){
                console.log('Detected Battery 7/8...');
                const clawHeirloomNum = Number(document.querySelector('div[data-part-type="rift_claw_shard_craft_item"]').querySelector('.quantity').textContent);
                const fangHeirloomNum = Number(document.querySelector('div[data-part-type="rift_fang_shard_craft_item"]').querySelector('.quantity').textContent);
                const beltHeirloomNum = Number(document.querySelector('div[data-part-type="rift_belt_shard_craft_item"]').querySelector('.quantity').textContent);
                const checkHeirloom = [
                    { name: 'clawHeirloom', quantity: clawHeirloomNum, query: 'div[data-part-type="rift_claw_shard_craft_item"]' },
                    { name: 'fangHeirloom', quantity: fangHeirloomNum, query: 'div[data-part-type="rift_fang_shard_craft_item"]' },
                    { name: 'beltHeirloom', quantity: beltHeirloomNum, query: 'div[data-part-type="rift_belt_shard_craft_item"]' }
                ];
                const minHeirloom = checkHeirloom.reduce((min, heirloom) => (heirloom.quantity < min.quantity ? heirloom : min), checkHeirloom[0]);
                //Arm Master Cheese of lowest heirloom quantity
                if (minHeirloom.name === 'clawHeirloom'){
                    console.log('Claw/Fang/Belt', clawHeirloomNum, '/', fangHeirloomNum, '/', beltHeirloomNum, '|| Arming Rift Susheese...');
                    if (currentCheese !== 'Rift Susheese'){
                        riftSusheeseArm.click();
                        await waitFor(2000);
                    }
                }
                else if (minHeirloom.name === 'fangHeirloom'){
                    console.log('Claw/Fang/Belt', clawHeirloomNum, '/', fangHeirloomNum, '/', beltHeirloomNum, '|| Arming Rift Combat...');
                    if (currentCheese !== 'Rift Combat Cheese'){
                        riftCombatArm.click();
                        await waitFor(2000);
                    }
                }
                else if (minHeirloom.name === 'beltHeirloom'){
                    console.log('Claw/Fang/Belt', clawHeirloomNum, '/', fangHeirloomNum, '/', beltHeirloomNum, '|| Arming Rift Glutter...');
                    if (currentCheese !== 'Rift Glutter Cheese'){
                        riftGlutterArm.click();
                        await waitFor(2000);
                    }
                }
                else {

                }
            }
            //For Battery 6, 5, 4 and 3
            else if (currentHighestBatteryLeft === 6 || currentHighestBatteryLeft === 5 || currentHighestBatteryLeft === 4 || currentHighestBatteryLeft === 3){
                console.log('Detected Battery 3-6, arming Brie String...');
                if (currentCheese !== 'Brie String Cheese'){
                    brieStringArm.click();
                    await waitFor(2000);
                }
            }
            //For below Battery 3
            else {
                console.log('Detected Battery 2, leaving Pagoda...');
                const recallDroid = document.querySelector('.riftFuromaHUD-leavePagoda');
                recallDroid.click();
                await waitFor(2000);
                const recallDroidConfirm = document.querySelector('.riftFuromaHUD-confirmPopup-viewState.leavePagoda .mousehuntActionButton.confirm');
                const recallDroidCancel = document.querySelector('.riftFuromaHUD-confirmPopup-viewState.leavePagoda .mousehuntActionButton.confirm');
                recallDroidConfirm.click();
                await waitFor(2000);
            }
        }
    }, 20*1000);

    // Utility function to wait for a specified time
    function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();