// ==UserScript==
// @name         Melvor Reduced Grinding
// @description  Reduces combat and skills' interval; Increases exp, mastery, gold, and SC rate; +1 attack roll for combat;
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @author       lucasshiva
// @match		 https://melvoridle.com/*
// @match		 https://*.melvoridle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=melvoridle.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449605/Melvor%20Reduced%20Grinding.user.js
// @updateURL https://update.greasyfork.org/scripts/449605/Melvor%20Reduced%20Grinding.meta.js
// ==/UserScript==

/*
This script's main goal is to reduce the late-game grind. It does the following:
  * -50% combat and skills interval
  * -1.5s monster respawn timer
  * +1 attack roll
  * 50% skill and mastery exp
  * +50% gold (including sales) and slayer coins.
*/

(function () {
    'use strict';

    // Reduces the skills' base interval by times X amount.
    // If you feel the need for a value higher than 2, consider increasing the exp/mastery rates instead.
    const timesFaster = 2;

    // To reduce the combat intervals for both the player and its target, we need to do it by
    // adding these modifiers to the entire game mode. It is, however, possible to reduce the
    // intervals for only the player with 'player.modifiers'. 
    const modifiers = {
        // As stated above, this also applies to enemies.
        decreasedAttackIntervalPercent: 50,

        // These ones apply only to the player, i.e., we can set them in 'player.modifiers'.
        decreasedMonsterRespawnTimer: 1500,
        increasedAttackRolls: 1,
        increasedGlobalMasteryXP: 50,
        increasedGlobalSkillXP: 50,
        increasedGPGlobal: 50,
        increasedGPFromSales: 50,
        increasedSlayerCoins: 50,
    }

    function reduceWoodcuttingInterval() {
        Woodcutting.trees.forEach(tree => {
            tree.baseInterval /= timesFaster;
        })
    }

    function reduceFishingInterval() {
        Fishing.data.forEach(fish => {
            fish.baseMinInterval /= timesFaster;
            fish.baseMaxInterval /= timesFaster;
        })
    }

    function reduceFiremakingInterval() {
        Firemaking.recipes.forEach(log => {
            log.baseInterval /= timesFaster;
        })
    }

    function reduceCookingInterval() {
        Cooking.recipes.forEach(recipe => {
            recipe.baseInterval /= timesFaster;
        })
    }

    function reduceMiningInterval() {
        Mining.rockData.forEach(rock => {
            rock.baseRespawnInterval /= timesFaster;
        })

        game.mining.baseInterval /= timesFaster;
    }

    function reduceSmithingInterval() {
        game.smithing.baseInterval /= timesFaster;
    }

    function reduceThievingInterval() {
        game.thieving.baseInterval /= timesFaster;
        game.thieving.baseStunInterval /= timesFaster;
    }

    function reduceFarmingInterval() {
        items.forEach(item => {
            if (item.timetoGrow !== undefined) {
                item.timetoGrow /= timesFaster;
            }
        })
    }

    function reduceFletchingInterval() {
        game.fletching.baseInterval /= timesFaster;
    }

    function reduceCraftingInterval() {
        game.crafting.baseInterval /= timesFaster;
    }

    function reduceRunecraftingInterval() {
        game.runecrafting.baseInterval /= timesFaster;
    }

    function reduceHerbloreInterval() {
        game.herblore.baseInterval /= timesFaster;
    }

    function reduceAgilityInterval() {
        Agility.obstacles.forEach(obstacle => {
            obstacle.interval /= timesFaster;
        })
    }

    function reduceSummoningInterval() {
        game.summoning.baseInterval /= timesFaster;
    }

    function reduceAstrologyInterval() {
        Astrology.baseInterval /= timesFaster;
    }

    function reduceAltMagicInterval() {
        game.altMagic.baseInterval /= timesFaster;
    }

    function reduceIntervals() {
        // Normal, Hardcore, and Adventure.
        const modes = [0, 1, 2]

        // Do nothing if it's a limited/event game mode.
        if (!modes.includes(currentGamemode)) {
            return;
        }

        GAMEMODES[currentGamemode].modifiers = modifiers;
        reduceWoodcuttingInterval();
        reduceFishingInterval();
        reduceFiremakingInterval();
        reduceCookingInterval();
        reduceMiningInterval();
        reduceSmithingInterval();
        reduceThievingInterval();
        reduceFarmingInterval();
        reduceFletchingInterval();
        reduceCraftingInterval();
        reduceRunecraftingInterval();
        reduceHerbloreInterval();
        reduceAgilityInterval();
        reduceSummoningInterval();
        reduceAstrologyInterval();
        reduceAltMagicInterval();

        // Compute the modifiers.
        player.computeAllStats();
    }

    function loadReducedGrinding() {
        if (isLoaded !== undefined && isLoaded) {
            clearInterval(scriptLoader);

            console.log("Melvor Reduced Grinding: Loading..")
            reduceIntervals();
            console.log("Melvor Reduced Grinding: Loaded.")
        }
    }

    const scriptLoader = setInterval(loadReducedGrinding, 300);

})();
