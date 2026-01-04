// ==UserScript==
// @name         Mousehunt Draconic Depths Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Donate: paypal.me/mousehuntscripter
// @author       You
// @match        https://www.mousehuntgame.com/camp.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mousehuntgame.com
// @grant        none
// @license      GNU
// @downloadURL https://update.greasyfork.org/scripts/503908/Mousehunt%20Draconic%20Depths%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/503908/Mousehunt%20Draconic%20Depths%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wrap the entire interval function in an async function
    setInterval(async function(){
        const fireCheese = document.querySelector('button[title="Fiery Fontina Cheese"]');
        const iceCheese = document.querySelector('button[title="Icy Isabirra Cheese"]');
        const poisonCheese = document.querySelector('button[title="Poisonous Provolone Cheese"]');

        const title = document.querySelector('.draconicDepthsForgeView__title');
        if (title && title.textContent == "Crucible Forge") {
            const reroll0 = document.querySelector('button[data-slot="0"].draconicDepthsCrucibleView__rerollButton');
            const reroll1 = document.querySelector('button[data-slot="1"].draconicDepthsCrucibleView__rerollButton');
            const reroll2 = document.querySelector('button[data-slot="2"].draconicDepthsCrucibleView__rerollButton');
            const rerollConfirm = document.querySelector('.draconicDepthsCrucibleRerollDialogView__rerollButton');

            const select0 = document.querySelector('button[data-slot="0"].draconicDepthsCrucibleView__crucibleSelectButton');
            const select1 = document.querySelector('button[data-slot="1"].draconicDepthsCrucibleView__crucibleSelectButton');
            const select2 = document.querySelector('button[data-slot="2"].draconicDepthsCrucibleView__crucibleSelectButton');

            const enterCavern = document.querySelector('.draconicDepthsForgeView__enterCavernButton');
            const enterCavernConfirm = document.querySelector('.draconicDepthsEnterCavernDialogView__enterButton');

            const droid1 = document.querySelector('.draconicDepthsCrucibleView_crucibleView--0');
            const droid2 = document.querySelector('.draconicDepthsCrucibleView_crucibleView--1');
            const droid3 = document.querySelector('.draconicDepthsCrucibleView_crucibleView--2');

            let poisonDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--poison');
            let iceDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--ice');
            let fireDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--fire');
            let maxLength = Math.max(poisonDroids.length, iceDroids.length, fireDroids.length);

            const claimButton = document.querySelector('.draconicDepthsForgeView__openDuplicatorChestButton');
            if (claimButton && !claimButton.classList.contains('draconicDepthsForgeView__openDuplicatorChestButton--hidden')) {
                claimButton.click();

                await waitFor(1000);
                const burnButton = document.querySelector('span.draconicDepthsClaimDuplicatorChestDialogView__sliderBackGroundText:nth-child(4)')
                burnButton.click();
                await waitFor(1000);
                const claimConfirm = document.querySelector('.draconicDepthsClaimDuplicatorChestDialogView__confirmButton');
                claimConfirm.click()
                await waitFor(1000);
                const claimConfirm2 = document.querySelector('.draconicDepthsClaimDuplicatorChestDialogView__finalConfirmButton');
                claimConfirm2.click()
                await waitFor(3000);
            }

            let rerollType = '';
            if (poisonDroids.length === maxLength) {
                rerollType = 'poison';
                while (true) {
                    if ( !droid1.classList.contains('draconicDepthsCrucibleView_crucibleView--poison') ) {
                        reroll0.click();
                        const rerollConfirm = document.querySelector('.draconicDepthsCrucibleRerollDialogView__rerollButton');
                        rerollConfirm.click();
                        await waitFor(2000);
                    }
                    if ( !droid2.classList.contains('draconicDepthsCrucibleView_crucibleView--poison') ) {
                        reroll1.click();
                        const rerollConfirm = document.querySelector('.draconicDepthsCrucibleRerollDialogView__rerollButton');
                        rerollConfirm.click();
                        await waitFor(2000);
                    }
                    if ( !droid3.classList.contains('draconicDepthsCrucibleView_crucibleView--poison') ) {
                        reroll2.click();
                        const rerollConfirm = document.querySelector('.draconicDepthsCrucibleRerollDialogView__rerollButton');
                        rerollConfirm.click();
                        await waitFor(2000);
                    }
                    const poisonDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--poison');
                    const iceDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--ice');
                    const fireDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--fire');
                    const maxLength = Math.max(poisonDroids.length, iceDroids.length, fireDroids.length);
                    if (maxLength == 3) {
                        break
                    }
                    await waitFor(5000);
                }
                if (!poisonCheese.classList.contains('active')) {
                    poisonCheese.click();
                }
            } else if (iceDroids.length === maxLength) {
                rerollType = 'ice';
                while (true) {
                    if ( !droid1.classList.contains('draconicDepthsCrucibleView_crucibleView--ice') ) {
                        reroll0.click();
                        const rerollConfirm = document.querySelector('.draconicDepthsCrucibleRerollDialogView__rerollButton');
                        rerollConfirm.click();
                        await waitFor(2000);
                    }
                    if ( !droid2.classList.contains('draconicDepthsCrucibleView_crucibleView--ice') ) {
                        reroll1.click();
                        const rerollConfirm = document.querySelector('.draconicDepthsCrucibleRerollDialogView__rerollButton');
                        rerollConfirm.click();
                        await waitFor(2000);
                    }
                    if ( !droid3.classList.contains('draconicDepthsCrucibleView_crucibleView--ice') ) {
                        reroll2.click();
                        const rerollConfirm = document.querySelector('.draconicDepthsCrucibleRerollDialogView__rerollButton');
                        rerollConfirm.click();
                        await waitFor(2000);
                    }
                    const poisonDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--poison');
                    const iceDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--ice');
                    const fireDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--fire');
                    const maxLength = Math.max(poisonDroids.length, iceDroids.length, fireDroids.length);
                    if (maxLength == 3) {
                        break
                    }
                    await waitFor(5000);
                }
                if (!iceCheese.classList.contains('active')) {
                    iceCheese.click();
                }
            } else if (fireDroids.length === maxLength) {
                rerollType = 'fire';
                while (maxLength != 3) {
                    if ( !droid1.classList.contains('draconicDepthsCrucibleView_crucibleView--fire') ) {
                        reroll0.click();
                        const rerollConfirm = document.querySelector('.draconicDepthsCrucibleRerollDialogView__rerollButton');
                        rerollConfirm.click();
                        await waitFor(2000);
                    }
                    if ( !droid2.classList.contains('draconicDepthsCrucibleView_crucibleView--fire') ) {
                        reroll1.click();
                        const rerollConfirm = document.querySelector('.draconicDepthsCrucibleRerollDialogView__rerollButton');
                        rerollConfirm.click();
                        await waitFor(2000);
                    }
                    if ( !droid3.classList.contains('draconicDepthsCrucibleView_crucibleView--fire') ) {
                        reroll2.click();
                        const rerollConfirm = document.querySelector('.draconicDepthsCrucibleRerollDialogView__rerollButton');
                        rerollConfirm.click();
                        await waitFor(2000);
                    }
                    const poisonDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--poison');
                    const iceDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--ice');
                    const fireDroids = document.querySelectorAll('.draconicDepthsCrucibleView__droid--fire');
                    const maxLength = Math.max(poisonDroids.length, iceDroids.length, fireDroids.length);
                    if (maxLength == 3) {
                        break
                    }
                    await waitFor(5000);
                }
                if (!fireCheese.classList.contains('active')) {
                    fireCheese.click();
                }
            }

            if (select0.textContent == 'Ready') {
                select0.click();
            }
            if (select1.textContent == 'Ready') {
                select1.click();
            }
            if (select2.textContent == 'Ready') {
                select2.click();
            }
            if (select0.textContent == 'Selected' && select1.textContent == 'Selected' && select2.textContent == 'Selected' && enterCavern.textContent.includes('Abyssal')) {
                enterCavern.click();
                enterCavernConfirm.click();
            }

        }
        if (document.querySelector('.draconicDepthsCavernView__cavernName').textContent.includes('Abyssal')){
            //arm the right cheese
            const cavernName = document.querySelector('.draconicDepthsCavernView__cavernName').textContent;
            if (cavernName.includes('Toxic')) {
                if (!poisonCheese.classList.contains('active')) {
                    poisonCheese.click();
                }
            }
            if (cavernName.includes('Flame')) {
                if (!fireCheese.classList.contains('active')) {
                    fireCheese.click();
                }
            }
            const reinforceButton = document.querySelector('.draconicDepthsCavernView__reinforceCavernButton');
            const maxButton = document.querySelector('.draconicDepthsReinforceCavernDialogView__maxButton');
            const reinforceConfirmButton = document.querySelector('.draconicDepthsReinforceCavernDialogView__reinforceButton');
            if (!reinforceButton.classList.contains('draconicDepthsCavernView__reinforceCavernButton--disabled')) {
                reinforceButton.click();
                await waitFor(1000);
                maxButton.click();
                reinforceConfirmButton.click();
            }
        }

    }, 20*1000);

    // Utility function to wait for a specified time
    function waitFor(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();
