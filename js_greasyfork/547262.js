// ==UserScript==
// @name         Mousehunt Fort Rox Script (Cypher)
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  Autobot for Mousehunt Fort Rox
// @author       Cypher
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547262/Mousehunt%20Fort%20Rox%20Script%20%28Cypher%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547262/Mousehunt%20Fort%20Rox%20Script%20%28Cypher%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const mhLocation = document.querySelector('.mousehuntHud-environmentName').textContent;
    if (mhLocation !== 'Fort Rox'){
        return;
    }
    else{
        console.log('[Fort Rox] Detected location in Fort Rox...')
    }

    // Wrap the entire interval function in an async function
    setInterval(async function(){

        const arcaneTrapList = [
            'Chrome Circlet of Pursuing',
            'Circlet of Pursuing',
            'Circlet of Seeking',
            'Event Horizon',
            'Droid Archmagus',
            'Grand Arcanum'
        ]

        const shadowTrapList = [
            'Infinite Dark Magic Mirrors',
            'Dark Magic Mirrors',
            'Chrome Temporal Turbine',
            'Temporal Turbine',
            'Clockwork Portal',
            'Interdimensional Crossbow',
            'Anniversary Reaper\'s Perch'
        ]

        const manaNum = Number(document.querySelector('.fortRoxHUD-mana.quantity[data-item-type="fort_rox_tower_mana_stat_item"]').textContent.trim().replace(/,/g, ''));
        const manaActivate = document.querySelector('.fortRoxHUD-spellContainer .fortRoxHUD-spellTowerButton.normal.inactive');
        const manaDeactivate = document.querySelector('.fortRoxHUD-spellContainer .fortRoxHUD-spellTowerButton.normal.active');

        const goudaBuyTrigger = 300;
        const goudaCheeseNum = Number(document.querySelector('.fortRoxHUD-item-quantity.quantity[data-item-type="gouda_cheese"]').textContent.trim().replace(/,/g, ''));

        const curdWheyBuyTrigger = 1000;

        const cresecentCheeseTrigger = 30;
        const cresecentCheeseNum = Number(document.querySelector('.fortRoxHUD-item-quantity.quantity[data-item-type="crescent_cheese"]').textContent.trim().replace(/,/g, ''));
        const crescentCheeseArmButton = document.querySelector('a[data-item-type="crescent_cheese"].mousehuntArmNowButton.recommended');

        const moonCheeseNum = Number(document.querySelector('.fortRoxHUD-item-quantity.quantity[data-item-type="moon_cheese"]').textContent.trim().replace(/,/g, ''));
        const moonCheeseArmButton = document.querySelector('a[data-item-type="moon_cheese"].mousehuntArmNowButton.recommended');

        const meteoriteKeepTrigger = 100;
        const meteoriteNum = Number(document.querySelector('.fortRoxHUD-item-quantity.quantity[data-item-type="meteorite_piece_craft_item"]').textContent.trim().replace(/,/g, ''));
        const howliteNum = Number(document.querySelector('.fortRoxHUD-item-quantity.quantity[data-item-type="howlite_stat_item"]').textContent.trim().replace(/,/g, ''));
        const bloodStoneNum = Number(document.querySelector('.fortRoxHUD-item-quantity.quantity[data-item-type="blood_stone_stat_item"]').textContent.trim().replace(/,/g, ''));

        // Check and restock Crescent Cheese
        const craftCresecentNum = Math.floor((meteoriteNum - meteoriteKeepTrigger) / 3);
        if (craftCresecentNum !== 0){
            if (cresecentCheeseNum <= cresecentCheeseTrigger){
                console.log('[Fort Rox] Current Crescent Cheese owned:', cresecentCheeseNum)
                const craftCrescentCheese = document.querySelector('a[data-item-type="crescent_cheese"].fortRoxHUD-bait-craftButton');
                craftCrescentCheese.click();
                await waitFor(2000);
                const curdWheyNum = Number(document.querySelector('.inventoryPage-confirmPopup-itemRow-quantity[data-item-type="curds_and_whey_craft_item"]').getAttribute('data-owned'));
                if (curdWheyNum <= curdWheyBuyTrigger){
                    const craftCancelButton = document.querySelector('mousehuntActionButton.inventoryPage-confirmPopup-suffix-button.lightBlue');
                    craftCancelButton.click();
                    await waitFor(2000);
                    const returnCamp = document.querySelector('li.camp > a');
                    const generalShop = document.querySelector('li.general_store > a');
                    generalShop.click();
                    await waitFor(2000);
                    const curdWheyText = document.querySelector('div.itemPurchaseView-container.curds_and_whey_craft_item input[type="text"]');
                    curdWheyText.value = String(curdWheyBuyTrigger);
                    await waitFor(2000);
                    const curdWheyBuy = document.querySelector('div.itemPurchaseView-container.curds_and_whey_craft_item .itemPurchaseView-action-form-button.buy');
                    curdWheyBuy.click();
                    await waitFor(2000);
                    const curdWheyBuyConfirm = document.querySelector('div.itemPurchaseView-container.curds_and_whey_craft_item .itemPurchaseView-action-confirm-button');
                    curdWheyBuyConfirm.click();
                    await waitFor(2000);
                    returnCamp.click();
                    await waitFor(2000);
                    console.log(curdWheyBuyTrigger, 'Curd and Whey bought, returning to camp');
                    craftCrescentCheese.click();
                    await waitFor(2000);
                }
                const craftCrescentText = document.querySelector('div.inventoryPage-confirmPopup-suffix-quantityContainer[type="text"]');
                craftCrescentText.value = String(craftCresecentNum);
                await waitFor(2000);
                const craftConfirmButton = document.querySelector('mousehuntActionButton.inventoryPage-confirmPopup-suffix-button.confirm');
                craftConfirmButton.click();
                await waitFor(2000);
            }
        }

        // Check and restock Gouda Cheese
        if (goudaCheeseNum <= goudaBuyTrigger){
            const returnCamp = document.querySelector('li.camp > a');
            const cheeseShop = document.querySelector('li.cheese_shoppe > a');
            cheeseShop.click();
            await waitFor(2000);
            const goudaText = document.querySelector('div.itemPurchaseView-container.gouda_cheese input[type="text"]');
            goudaText.value = String(goudaBuyTrigger);
            await waitFor(2000);
            const goudaBuy = document.querySelector('div.itemPurchaseView-container.gouda_cheese .itemPurchaseView-action-form-button.buy');
            goudaBuy.click();
            await waitFor(2000);
            const goudaBuyConfirm = document.querySelector('div.itemPurchaseView-container.gouda_cheese .itemPurchaseView-action-confirm-button');
            goudaBuyConfirm.click();
            await waitFor(2000);
            returnCamp.click();
            await waitFor(2000);
            console.log(goudaBuyTrigger, 'Gouda bought, returning to camp');
        }
        else {
            console.log(goudaCheeseNum, 'Gouda found, buying bypassed');
        }

        // Twilight Phase - 35 hunts
        if (document.querySelector('.fortRoxHUD.night.stage_one')){
            console.log('[Fort Rox] Currently in Twilight phase...');
            // Set Trap
            const checkShadowPower = document.querySelector('.campPage-trap-trapStat-powerTypeIcon.Shadow');
            if (!checkShadowPower){
                console.log('[Fort Rox] Current trap type is not Shadow')
                const weaponButton = document.querySelector('button[data-item-classification="weapon"]');
                weaponButton.click();
                await waitFor(2000);
                let bestTrap = null;
                outerLoop: for (const trapName of shadowTrapList){
                    console.log(`[Fort Rox] Finding ${trapName}...`)
                    const trapItems = document.querySelectorAll('.campPage-trap-itemBrowser-item-name');
                    for (const item of trapItems){
                        if (item.textContent.trim().includes(trapName)){
                            console.log(`[Fort Rox] Arming best trap found: ${trapName}`)
                            bestTrap = item;
                            const armButton = bestTrap.closest('.campPage-trap-itemBrowser-item').querySelector('.campPage-trap-itemBrowser-item-armButton');
                            armButton.click();
                            await waitFor(2000);
                            const closeTrap = document.querySelector('.campPage-trap-blueprint-closeButton');
                            closeTrap.click();
                            await waitFor(2000);
                            break outerLoop; // Breaks out of outer loop
                        }
                    }
                }
            }
            // Set Cheese
            if (cresecentCheeseNum > cresecentCheeseTrigger){
                if (!crescentCheeseArmButton){
                    console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Crescent Cheese...');
                    crescentCheeseArmButton.click();
                    await waitFor(2000);
                }
            }
            else {
                console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Gouda Cheese...');
                const goudaArmButton = document.querySelector('a[data-item-type="gouda_cheese"].mousehuntArmNowButton.discouraged');
                goudaArmButton.click();
            }
        }

        // Midnight Phase - 25 hunts
        else if (document.querySelector('.fortRoxHUD.night.stage_two')) {
            console.log('[Fort Rox] Currently in Midnight phase...');
            // Set Trap
            const checkShadowPower = document.querySelector('.campPage-trap-trapStat-powerTypeIcon.Shadow');
            if (!checkShadowPower){
                console.log('[Fort Rox] Current trap type is not Shadow')
                const weaponButton = document.querySelector('button[data-item-classification="weapon"]');
                weaponButton.click();
                await waitFor(2000);
                let bestTrap = null;
                outerLoop: for (const trapName of shadowTrapList){
                    console.log(`[Fort Rox] Finding ${trapName}...`)
                    const trapItems = document.querySelectorAll('.campPage-trap-itemBrowser-item-name');
                    for (const item of trapItems){
                        if (item.textContent.trim().includes(trapName)){
                            console.log(`[Fort Rox] Arming best trap found: ${trapName}`)
                            bestTrap = item;
                            const armButton = bestTrap.closest('.campPage-trap-itemBrowser-item').querySelector('.campPage-trap-itemBrowser-item-armButton');
                            armButton.click();
                            await waitFor(2000);
                            const closeTrap = document.querySelector('.campPage-trap-blueprint-closeButton');
                            closeTrap.click();
                            await waitFor(2000);
                            break outerLoop; // Breaks out of outer loop
                        }
                    }
                }
            }
            // Set Cheese
            if (cresecentCheeseNum > cresecentCheeseTrigger){
                if (!crescentCheeseArmButton){
                    console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Crescent Cheese...');
                    crescentCheeseArmButton.click();
                    await waitFor(2000);
                }
            }
            else {
                console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Gouda Cheese...');
                const goudaArmButton = document.querySelector('a[data-item-type="gouda_cheese"].mousehuntArmNowButton.discouraged');
                goudaArmButton.click();
            }
        }

        // Pitch Phase - 10 hunts
        else if (document.querySelector('.fortRoxHUD.night.stage_three')) {
            console.log('[Fort Rox] Currently in Pitch phase...');
            // Set Trap
            const checkArcanePower = document.querySelector('.campPage-trap-trapStat-powerTypeIcon.Arcane');
            if (!checkArcanePower){
                console.log('[Fort Rox] Current trap type is not Arcane')
                const weaponButton = document.querySelector('button[data-item-classification="weapon"]');
                weaponButton.click();
                await waitFor(2000);
                let bestTrap = null;
                outerLoop: for (const trapName of arcaneTrapList){
                    console.log(`[Fort Rox] Finding ${trapName}...`)
                    const trapItems = document.querySelectorAll('.campPage-trap-itemBrowser-item-name');
                    for (const item of trapItems){
                        if (item.textContent.trim().includes(trapName)){
                            console.log(`[Fort Rox] Arming best trap found: ${trapName}`)
                            bestTrap = item;
                            const armButton = bestTrap.closest('.campPage-trap-itemBrowser-item').querySelector('.campPage-trap-itemBrowser-item-armButton');
                            armButton.click();
                            await waitFor(2000);
                            const closeTrap = document.querySelector('.campPage-trap-blueprint-closeButton');
                            closeTrap.click();
                            await waitFor(2000);
                            break outerLoop; // Breaks out of outer loop
                        }
                    }
                }
            }
            // Set Cheese
            if (cresecentCheeseNum > cresecentCheeseTrigger){
                if (!crescentCheeseArmButton){
                    console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Crescent Cheese...');
                    crescentCheeseArmButton.click();
                    await waitFor(2000);
                }
            }
            else {
                console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Gouda Cheese...');
                const goudaArmButton = document.querySelector('a[data-item-type="gouda_cheese"].mousehuntArmNowButton.discouraged');
                goudaArmButton.click();
            }
        }

        // Utter Darkness Phase - 25 hunts
        else if (document.querySelector('.fortRoxHUD.night.stage_four')) {
            console.log('[Fort Rox] Currently in Utter Darkness phase...');
            // Set Trap
            const checkArcanePower = document.querySelector('.campPage-trap-trapStat-powerTypeIcon.Arcane');
            if (!checkArcanePower){
                console.log('[Fort Rox] Current trap type is not Arcane')
                const weaponButton = document.querySelector('button[data-item-classification="weapon"]');
                weaponButton.click();
                await waitFor(2000);
                let bestTrap = null;
                outerLoop: for (const trapName of arcaneTrapList){
                    console.log(`[Fort Rox] Finding ${trapName}...`)
                    const trapItems = document.querySelectorAll('.campPage-trap-itemBrowser-item-name');
                    for (const item of trapItems){
                        if (item.textContent.trim().includes(trapName)){
                            console.log(`[Fort Rox] Arming best trap found: ${trapName}`)
                            bestTrap = item;
                            const armButton = bestTrap.closest('.campPage-trap-itemBrowser-item').querySelector('.campPage-trap-itemBrowser-item-armButton');
                            armButton.click();
                            await waitFor(2000);
                            const closeTrap = document.querySelector('.campPage-trap-blueprint-closeButton');
                            closeTrap.click();
                            await waitFor(2000);
                            break outerLoop; // Breaks out of outer loop
                        }
                    }
                }
            }
            // Set Cheese
            if (cresecentCheeseNum > cresecentCheeseTrigger){
                if (!crescentCheeseArmButton){
                    console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Crescent Cheese...');
                    crescentCheeseArmButton.click();
                    await waitFor(2000);
                }
            }
            else {
                console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Gouda Cheese...');
                const goudaArmButton = document.querySelector('a[data-item-type="gouda_cheese"].mousehuntArmNowButton.discouraged');
                goudaArmButton.click();
            }
        }

        // First Light Phase - 35 hunts
        else if (document.querySelector('.fortRoxHUD.night.stage_five')) {
            console.log('[Fort Rox] Currently in First Light phase...');
            // Set Trap
            const checkArcanePower = document.querySelector('.campPage-trap-trapStat-powerTypeIcon.Arcane');
            if (!checkArcanePower){
                console.log('[Fort Rox] Current trap type is not Arcane')
                const weaponButton = document.querySelector('button[data-item-classification="weapon"]');
                weaponButton.click();
                await waitFor(2000);
                let bestTrap = null;
                outerLoop: for (const trapName of arcaneTrapList){
                    console.log(`[Fort Rox] Finding ${trapName}...`)
                    const trapItems = document.querySelectorAll('.campPage-trap-itemBrowser-item-name');
                    for (const item of trapItems){
                        if (item.textContent.trim().includes(trapName)){
                            console.log(`[Fort Rox] Arming best trap found: ${trapName}`)
                            bestTrap = item;
                            const armButton = bestTrap.closest('.campPage-trap-itemBrowser-item').querySelector('.campPage-trap-itemBrowser-item-armButton');
                            armButton.click();
                            await waitFor(2000);
                            const closeTrap = document.querySelector('.campPage-trap-blueprint-closeButton');
                            closeTrap.click();
                            await waitFor(2000);
                            break outerLoop; // Breaks out of outer loop
                        }
                    }
                }
            }
            // Set Cheese
            if (cresecentCheeseNum > cresecentCheeseTrigger){
                if (!crescentCheeseArmButton){
                    console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Crescent Cheese...');
                    crescentCheeseArmButton.click();
                    await waitFor(2000);
                }
            }
            else {
                console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Gouda Cheese...');
                const goudaArmButton = document.querySelector('a[data-item-type="gouda_cheese"].mousehuntArmNowButton.discouraged');
                goudaArmButton.click();
            }
        }

        // Dawn Phase
        else if (document.querySelector('.fortRoxHUD.night.stage_six')) {
            console.log('[Fort Rox] Currently in Dawn phase...');
            // Set Trap
            const checkArcanePower = document.querySelector('.campPage-trap-trapStat-powerTypeIcon.Arcane');
            if (!checkArcanePower){
                console.log('[Fort Rox] Current trap type is not Arcane')
                const weaponButton = document.querySelector('button[data-item-classification="weapon"]');
                weaponButton.click();
                await waitFor(2000);
                let bestTrap = null;
                outerLoop: for (const trapName of arcaneTrapList){
                    console.log(`[Fort Rox] Finding ${trapName}...`)
                    const trapItems = document.querySelectorAll('.campPage-trap-itemBrowser-item-name');
                    for (const item of trapItems){
                        if (item.textContent.trim().includes(trapName)){
                            console.log(`[Fort Rox] Arming best trap found: ${trapName}`)
                            bestTrap = item;
                            const armButton = bestTrap.closest('.campPage-trap-itemBrowser-item').querySelector('.campPage-trap-itemBrowser-item-armButton');
                            armButton.click();
                            await waitFor(2000);
                            const closeTrap = document.querySelector('.campPage-trap-blueprint-closeButton');
                            closeTrap.click();
                            await waitFor(2000);
                            break outerLoop; // Breaks out of outer loop
                        }
                    }
                }
            }
            // Set Cheese
            if (cresecentCheeseNum > cresecentCheeseTrigger){
                if (!crescentCheeseArmButton){
                    console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Crescent Cheese...');
                    crescentCheeseArmButton.click();
                    await waitFor(2000);
                }
            }
            else {
                console.log(cresecentCheeseNum, 'Crescent Cheese detected. Arming Gouda Cheese...');
                const goudaArmButton = document.querySelector('a[data-item-type="gouda_cheese"].mousehuntArmNowButton.discouraged');
                goudaArmButton.click();
            }
        }
    }, 20*1000);

    // Utility function to wait for a specified time
    function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();