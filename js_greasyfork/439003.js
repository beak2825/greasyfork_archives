// ==UserScript==
// @name         Melvor Astrology 5 Reroll
// @version      1.0.0
// @description  All astrology rerolls will net 5% modifiers
// @author       WhoeverWantsIt
// @match        https://*.melvoridle.com/*
// @exclude      https://wiki.melvoridle.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/439003/Melvor%20Astrology%205%20Reroll.user.js
// @updateURL https://update.greasyfork.org/scripts/439003/Melvor%20Astrology%205%20Reroll.meta.js
// ==/UserScript==

((main) => {
    var script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    'use strict';

    function replaceRerollSpecificAstrologyModifier() {
        const _rerollSpecificAstrologyModifier = rerollSpecificAstrologyModifier;
        rerollSpecificAstrologyModifier = (id, i, applySingleCost=false, confirmed=true, bypass=false) => {
            let renderUIUpdate = false;
            if (!canRerollModifier(id, i)) {
                notifyPlayer(CONSTANTS.skill.Astrology, "Oi, it's locked. What are you doing?", "danger");
                return;
            }
            if (applySingleCost) {
                if (i % 2 === 0) {
                    if (getBankQty(CONSTANTS.item.Stardust) < getSingleStardustCost()) {
                        notifyPlayer(CONSTANTS.skill.Astrology, templateString(getLangString("ASTROLOGY", "MISC_4"), {
                            itemName: items[CONSTANTS.item.Stardust].name
                        }), "danger");
                        return;
                    } else {
                        updateItemInBank(getBankId(CONSTANTS.item.Stardust), CONSTANTS.item.Stardust, -getSingleStardustCost());
                        renderUIUpdate = true;
                    }
                } else {
                    if (getBankQty(CONSTANTS.item.Golden_Stardust) < getSingleGoldenStardustCost()) {
                        notifyPlayer(CONSTANTS.skill.Astrology, templateString(getLangString("ASTROLOGY", "MISC_4"), {
                            itemName: items[CONSTANTS.item.Golden_Stardust].name
                        }), "danger");
                        return;
                    } else {
                        updateItemInBank(getBankId(CONSTANTS.item.Golden_Stardust), CONSTANTS.item.Golden_Stardust, -getSingleGoldenStardustCost());
                        renderUIUpdate = true;
                    }
                }
            }
            delete activeAstrologyModifiers[id][i];
            activeAstrologyModifiers[id][i] = {};
            const valueRoll = Math.random() * 100;
            let value = 0;
            for (let i = 0; i < AstrologyDefaults.valueWeight.length; i++) {
                value++;
                if (valueRoll < AstrologyDefaults.valueWeight[i])
                    break;
            }
            value = 5;
            if (value === 1)
                game.stats.Astrology.inc(AstrologyStats.MinRollsHit);
            else if (value === 5)
                game.stats.Astrology.inc(AstrologyStats.MaxRollsHit);
            let randomSkill = ASTROLOGY[id].skills[Math.floor(Math.random() * ASTROLOGY[id].skills.length)];
            let modifierList;
            let modValue;
            if (i % 2 !== 0) {
                modifierList = JSON.parse(JSON.stringify(ASTROLOGY[id].uniqueModifiers));
                game.stats.Astrology.inc(AstrologyStats.UniqueRerolls);
            } else {
                modifierList = JSON.parse(JSON.stringify(AstrologyDefaults.standardAstrologyModifierList));
                game.stats.Astrology.inc(AstrologyStats.StandardRerolls);
                if (!SKILLS[randomSkill].hasMastery) {
                    let modsToRemove = [];
                    for (let i = 0; i < modifierList.length; i++) {
                        if (!modifierData[modifierList[i]].isCombatModifier)
                            modsToRemove.push(modifierList[i]);
                    }
                    if (randomSkill === Skills.Hitpoints || randomSkill === Skills.Slayer || randomSkill === Skills.Prayer) {
                        modsToRemove.push("increasedHiddenSkillLevel");
                        if (randomSkill === Skills.Slayer)
                            modifierList.push("increasedSlayerCoins");
                    }
                    for (let i = 0; i < modsToRemove.length; i++) {
                        if (modifierList.indexOf(modsToRemove[i]) >= 0)
                            modifierList.splice(modifierList.indexOf(modsToRemove[i]), 1);
                    }
                } else {
                    let modsToRemove = [];
                    for (let i = 0; i < modifierList.length; i++) {
                        if (modifierData[modifierList[i]].isCombatModifier)
                            modsToRemove.push(modifierList[i]);
                    }
                    if (id === 7 && randomSkill === CONSTANTS.skill.Agility) {
                        modsToRemove.push("increasedChanceToDoubleItemsSkill");
                        modifierList.push("decreasedAgilityObstacleCost");
                    }
                    for (let i = 0; i < modsToRemove.length; i++) {
                        if (modifierList.indexOf(modsToRemove[i]) >= 0)
                            modifierList.splice(modifierList.indexOf(modsToRemove[i]), 1);
                    }
                }
            }
            const random = Math.floor(Math.random() * modifierList.length);
            modValue = value;
            if (modifierData[modifierList[random]].isSkill) {
                if (!SKILLS[randomSkill].hasMastery && !modifierData[modifierList[random]].isCombatModifier) {
                    const skillID = ASTROLOGY[id].skills.indexOf(randomSkill);
                    if (skillID === 0)
                        randomSkill = ASTROLOGY[id].skills[1];
                    else
                        randomSkill = ASTROLOGY[id].skills[0];
                }
                modValue = [randomSkill, value];
                activeAstrologyModifiers[id][i][modifierList[random]] = [modValue];
            } else {
                activeAstrologyModifiers[id][i][modifierList[random]] = modValue;
            }
            if (applySingleCost)
                updatePlayerStats();
            if (renderUIUpdate)
                updateAllAstrologyModifiers(id);
        
        };

    }

    function loadScript() {
        if (window.isLoaded) {
            clearInterval(interval);
            replaceRerollSpecificAstrologyModifier();
        }
    }

    const interval = setInterval(loadScript, 500);
});
