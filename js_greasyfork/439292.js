// ==UserScript==
// @name        Melvor Idle AutoEat
// @description Autoeats if attack will kill player, changes food if required
// @version     1.0
// @namespace   Silber
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439292/Melvor%20Idle%20AutoEat.user.js
// @updateURL https://update.greasyfork.org/scripts/439292/Melvor%20Idle%20AutoEat.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    var autoeat;

    function injectAutoeatInterval() {
        autoeat = setInterval(() => {
            if (player.target.state == 'Alive' && combatManager.player.hitpoints <= combatManager.enemy.getAttackMaxDamage(combatManager.enemy.nextAttack)) {
                let foodQty = Math.floor((player.stats.maxHitpoints - player.hitpoints) / player.getFoodHealing(player.food.currentSlot.item));
                player.eatFood(foodQty, false);
        
                if (player.food.currentSlot.quantity < 1) {
                    const nonEmptySlot = player.food.slots.findIndex((slot) => slot.item !== emptyFood);
                    if (nonEmptySlot >= 0) {
                      player.food.setSlot(nonEmptySlot);
                    } else {
                        combatManager.stopCombat();
                    }
                }
            }
        }, 600);
    }

    function loadScript() {
        if (typeof confirmedLoaded !== 'undefined' && confirmedLoaded) {
            clearInterval(interval);
            console.log('Loading Melvor Idle AutoEat Script');
            injectAutoeatInterval();
        }
    }

    const interval = setInterval(loadScript, 500);
});
