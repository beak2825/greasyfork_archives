// ==UserScript==
// @name         Melvor Auto Eat
// @version      1.8.3
// @description  Automatically eats if health gets too low (runs when necessary)
// @author       Arcanus
// @match        https://*.melvoridle.com/*
// @grant        none
// @noframes
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/394850/Melvor%20Auto%20Eat.user.js
// @updateURL https://update.greasyfork.org/scripts/394850/Melvor%20Auto%20Eat.meta.js
// ==/UserScript==

this.getMonsterMaxHit = (monster) => {
    let maxHit = 0;
    let normalChance = 100;
    let maximumStrengthRoll;
    if (MONSTERS[monster].attackType === CONSTANTS.attackType.Melee) {
        let effectiveStrengthLevel = Math.floor(MONSTERS[monster].strengthLevel + 8 + 1);
        maximumStrengthRoll = Math.floor(numberMultiplier * (1.3 + (effectiveStrengthLevel / 10) + (MONSTERS[monster].strengthBonus / 80) + (effectiveStrengthLevel * MONSTERS[monster].strengthBonus / 640)));
    }
    else if (MONSTERS[monster].attackType === CONSTANTS.attackType.Ranged) {
        let effectiveStrengthLevel = Math.floor(MONSTERS[monster].rangedLevel + 8 + 1);
        maximumStrengthRoll = Math.floor(numberMultiplier * (1.3 + (effectiveStrengthLevel / 10) + (MONSTERS[monster].strengthBonusRanged / 80) + (effectiveStrengthLevel * MONSTERS[monster].strengthBonusRanged / 640)));
    }
    else if (MONSTERS[monster].attackType === CONSTANTS.attackType.Magic) {
        if (MONSTERS[monster].selectedSpell === null || MONSTERS[monster].selectedSpell === undefined) maximumStrengthRoll = Math.floor(numberMultiplier * (MONSTERS[monster].setMaxHit + MONSTERS[monster].setMaxHit * (MONSTERS[monster].damageBonusMagic / 100)));
        else maximumStrengthRoll = Math.floor(numberMultiplier * (SPELLS[MONSTERS[monster].selectedSpell].maxHit + SPELLS[MONSTERS[monster].selectedSpell].maxHit * (MONSTERS[monster].damageBonusMagic / 100)));
    }

    if (MONSTERS[monster].hasSpecialAttack) {
        let specialMax;
        for (let i = 0; i < MONSTERS[monster].specialAttackID.length; i++) {
            let specialAttack = enemySpecialAttacks[MONSTERS[monster].specialAttackID[i]];
            if (MONSTERS[monster].overrideSpecialChances !== undefined) {
                normalChance -= MONSTERS[monster].overrideSpecialChances[i];
            } else {
                normalChance -= specialAttack.chance;
            }
            if (specialAttack.setDamage !== null) {
                specialMax = specialAttack.setDamage * numberMultiplier;
            } else {
                specialMax = maximumStrengthRoll;
            }
            specialMax *= specialAttack.stunDamageMultiplier;
            if (specialMax > maxHit) maxHit = specialMax;
        }
    }
    if (normalChance > 0 && (maximumStrengthRoll > maxHit)) maxHit = maximumStrengthRoll;
    //Special Attack Max Hit
    return maxHit;
}

this.monsterMaxHits = []
for(let i = 0; i < MONSTERS.length; i++) {
    monsterMaxHits.push(getMonsterMaxHit(i))
}

this.autoEat = setInterval(()=>{
    while ((isInCombat && combatData.player.hitpoints <= Math.ceil((1 - damageReduction / 100) * monsterMaxHits[combatData.enemy.id] )) || (isThieving && combatData.player.hitpoints <= Math.ceil((1 - damageReduction / 100) * thievingNPC[npcID].maxHit * numberMultiplier))) {
        if(combatData.player.hitpoints == skillLevel[CONSTANTS.skill.Hitpoints] * numberMultiplier) {
            stopCombat(false, true)
            combatData.enemy.id = 37
            break
        }
        if(equippedFood[currentCombatFood].qty == 0) {
            if (equippedFood.some(food=>food.qty))
                selectEquippedFood(equippedFood.findIndex(food=>food.qty))
            else {
                let found = false
                for (let i = 0; i < bank.length; i++) {
                    if(typeof(items[bank[i].id].healsFor) !== "undefined") {
                        equipFood(i,bank[i].id,bank[i].qty)
                        selectEquippedFood(0)
                        found = true
                        break
                    }
                }
                if(!found) {
                    if(isInCombat) {
                        stopCombat(false, true)
                        combatData.enemy.id = 37
                    }
                    if(isThieving) pickpocket(npcID, true)
                    break
                }
            }
        }
        eatFood()
    }
},50)