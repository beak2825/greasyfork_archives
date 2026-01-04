// ==UserScript==
// @name         Mousehunt Burroughs Rift Script (Cypher)
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  Autobot for Mousehunt Burroughs Rift
// @author       Cypher
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543525/Mousehunt%20Burroughs%20Rift%20Script%20%28Cypher%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543525/Mousehunt%20Burroughs%20Rift%20Script%20%28Cypher%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const mhLocation = document.querySelector('.mousehuntHud-environmentName').textContent;
    if (mhLocation === 'Burroughs Rift'){
        console.log('%c[Burroughs Rift] Detected location in Burroughs Rift...', 'color: #2b7cff;')

        // Create priority dropdown in HUD
        const hudContainer = document.querySelector('.frame');
        let existingDropdown = hudContainer.querySelector('select');
        let dropdownBox;

        if (!existingDropdown){
            const wrapper = document.createElement('div');
            wrapper.style.marginTop = '15px'
            wrapper.style.marginLeft = '300px'

            const dropdownLabel = document.createElement('span');
            dropdownLabel.textContent = 'Mist Priority: ';

            const dropdownBox = document.createElement('select');
            
            const options = ['Empty', 'Yellow', 'Green', 'Red'];
            options.forEach((optionText) => {
                const option = document.createElement('option');
                option.value = optionText.toLowerCase().replace(/ /g, '_');
                option.textContent = optionText;
                dropdownBox.appendChild(option);
            });

            const storedPriority = localStorage.getItem('mistPriority');
            if (storedPriority && options.some(opt => opt.toLowerCase() === storedPriority)) {
                dropdownBox.value = storedPriority;
            }

            wrapper.appendChild(dropdownLabel);
            wrapper.appendChild(dropdownBox);

            hudContainer.appendChild(wrapper);
            dropdownBox.addEventListener('change', async () => {
                const selectedPriority = dropdownBox.value;
                localStorage.setItem('mistPriority', selectedPriority);
                console.log(`%c[Burroughs Rift] Selected priority stored: ${selectedPriority}`, 'color: #ffa02b;');
            });
        }
        else {
            console.log('[Burroughs Rift] Priority dropdown already exists, bypassing...');
            const storedPriority = localStorage.getItem('mistPriority');
            if (storedPriority) {
                existingDropdown.value = storedPriority;
            }
        }
    }
    else {
        return;
    }

    // Wrap the entire interval function in an async function
    setInterval(async function(){

        const brieStringTrigger = 500
        const brieStringNum = Number(document.querySelector('[data-item-type="brie_string_cheese"].quantity').textContent);
        const brieStringArm = document.querySelector('a[data-item-type="brie_string_cheese"]');

        const terraRicottaNum = Number(document.querySelector('.baitQuantity[data-item-type="terre_ricotta_cheese"]').textContent);
        const terraRicottaArm = document.querySelector('.mousehuntArmNowButton[data-item-type="terre_ricotta_cheese"]');

        const pollutedParmesanNum = Number(document.querySelector('.baitQuantity[data-item-type="polluted_parmesan_cheese"]').textContent);
        const pollutedParmesanArm = document.querySelector('.mousehuntArmNowButton[data-item-type="polluted_parmesan_cheese"]');

        const mistCanisterNum = Number(document.querySelector('.quantity[data-item-type="mist_canister_stat_item"]').textContent);
        const currentMistLevel = Number(document.querySelector('.mistQuantity').textContent.split('/')[0]);
        const isMisting = document.querySelector('.riftBurroughsHud.is_misting');
        const toggleMist = document.querySelector('.mistButton');
        console.log('Collecting Mist Cansisters, currently:', mistCanisterNum);

        const hudContainer = document.querySelector('.frame');
        const dropdownBox = hudContainer.querySelector('select');
        const storedPriority = dropdownBox.value.toLowerCase();

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

        //Entering Mist
        switch (storedPriority) {
            // Empty Priority
            case 'empty':
                console.log('%c[Burroughs Rift] Detected empty priority...', 'color: #ffa02b;');
                if (currentMistLevel >= 1){
                    if (isMisting){
                        toggleMist.click();
                        await waitFor(2000);
                    }
                }
                break;
            // Yellow Priority
            case 'yellow':
                console.log('%c[Burroughs Rift] Detected yellow priority...', 'color: #ffa02b;');
                if (currentMistLevel >= 5){
                    if (isMisting){
                        toggleMist.click();
                        await waitFor(2000);
                    }
                }
                else if (currentMistLevel <= 1){
                    if(!isMisting){
                        toggleMist.click();
                        await waitFor(2000);
                    }
                }
                break;
            // Green Priority
            case 'green':
                console.log('%c[Burroughs Rift] Detected green priority...', 'color: #ffa02b;');
                if (currentMistLevel >= 18){
                    if (isMisting){
                        toggleMist.click();
                        await waitFor(2000);
                    }
                }
                else if (currentMistLevel <= 6){
                    if(!isMisting){
                        toggleMist.click();
                        await waitFor(2000);
                    }
                }
                break;
            // Red Priority
            case 'red':
                console.log('%c[Burroughs Rift] Detected red priority...', 'color: #ffa02b;');
                if (currentMistLevel === 20){
                    if (isMisting){
                        toggleMist.click();
                        await waitFor(2000);
                    }
                }
                else if (currentMistLevel <= 19){
                    if(!isMisting){
                        toggleMist.click();
                        await waitFor(2000);
                    }
                }
                break;
            default:
                // Optional default action
                break;
        }

    }, 20*1000);

    // Utility function to wait for a specified time
    function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();