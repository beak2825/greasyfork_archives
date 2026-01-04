// ==UserScript==
// @name        TimeToKill
// @namespace   http://tampermonkey.net
// @match       https://melvoridle.com
// @match       https://melvoridle.com/*
// @match       https://www.melvoridle.com/*
// @match       https://test.melvoridle.com/*
// @grant       none
// @version     1.1.1
// @author      Gardens#3738
// @description Displays rough extended combat info when actively fighting an enemy.
// @downloadURL https://update.greasyfork.org/scripts/422101/TimeToKill.user.js
// @updateURL https://update.greasyfork.org/scripts/422101/TimeToKill.meta.js
// ==/UserScript==
// (() => {
function effHp() {
    // return equippedFood.map(({ itemID, qty }) => (getFoodHealValue(itemID) || 0) * qty).reduce((a, b) => a + b)
    let foodID = equippedFood[currentCombatFood].itemID
    let foodQty = equippedFood[currentCombatFood].qty;
    if (foodQty == 0) return maxHitpoints;
    return equippedFood[currentCombatFood].qty * getFoodHealValue(foodID) + maxHitpoints;
}
window.effHp = effHp

function enemyMaxHit() {
    if (damageReduction > 0) return Math.floor(combatData.enemy.maximumStrengthRoll * (1 - damageReduction / 100));
    else return combatData.enemy.maximumStrengthRoll;
}

function enemyAccuracy() {
    let enemyAcc;
    let playerDefenceRoll;
    if (combatData.enemy.attackType === CONSTANTS.attackType.Melee) playerDefenceRoll = maximumDefenceRoll;
    else if (combatData.enemy.attackType === CONSTANTS.attackType.Ranged) playerDefenceRoll = maximumRangedDefenceRoll;
    else if (combatData.enemy.attackType === CONSTANTS.attackType.Magic) playerDefenceRoll = maximumMagicDefenceRoll;
    if (combatData.enemy.maximumAttackRoll < playerDefenceRoll) enemyAcc = ((0.5 * combatData.enemy.maximumAttackRoll) / playerDefenceRoll) * 100;
    else enemyAcc = (1 - (0.5 * playerDefenceRoll) / combatData.enemy.maximumAttackRoll) * 100;
    if (combatData.enemy.attackType === CONSTANTS.attackType.Melee && prayerBonusProtectFromMelee > 0) enemyAcc = 100 - protectFromValue;
    else if (combatData.enemy.attackType === CONSTANTS.attackType.Ranged && prayerBonusProtectFromRanged > 0) enemyAcc = 100 - protectFromValue;
    else if (combatData.enemy.attackType === CONSTANTS.attackType.Magic && prayerBonusProtectFromMagic > 0) enemyAcc = 100 - protectFromValue;
    return enemyAcc;
}
window.extended = true

function chunkKills() {
    let respawnTimer = 3;

    let playerHp = extended ? effHp() : maxHitpoints;
    let playerAcc = (playerAccuracy / 100);
    let playerAttackTime = (playerAttackSpeed / 1000);
    let playerHitDamage = (baseMaxHit + 1) / 2;

    let regen = 1 + Math.floor(maxHitpoints / 10 / numberMultiplier) / (hitpointRegenInterval / 1000);

    let enemyHp = combatData.enemy.maxHitpoints;
    let enemyAcc = (enemyAccuracy() / 100);
    let enemyAttackTime = (combatData.enemy.attackSpeed / 1000);
    let enemyHitDamage = (enemyMaxHit() + 1) / 2;

    let playerAttackDamage = playerHitDamage * playerAcc;
    let playerHitsPerSec = playerAcc / playerAttackTime;
    let playerHitsToKill = Math.ceil(enemyHp / playerHitDamage);
    let playerAttacksToKill = playerHitsToKill / playerAcc;
    let playerAttacksToKill1 = Math.ceil(enemyHp / playerAttackDamage);
    let playerRawDps = playerHitDamage * playerHitsPerSec;
    let playerTimeToKill = playerAttacksToKill * playerAttackTime;

    let enemyAttackDamage = enemyHitDamage * enemyAcc; // - regen * enemyAttackTime;
    let enemyHitsPerSec = enemyAcc / enemyAttackTime;
    let enemyHitsToKill = Math.ceil(playerHp / enemyHitDamage);
    let enemyAttacksToKill = enemyHitsToKill / enemyHitsPerSec;
    let enemyAttacksToKill1 = Math.ceil(playerHp / enemyAttackDamage);
    let enemyRawDps = enemyHitDamage * enemyHitsPerSec;
    let enemyTimeToKill = enemyAttacksToKill * enemyAttackTime;


    // if (playerTimeToKill < enemyTimeToKill) {
    //     console.log("winning fight")
    // } else {
    //     console.log("losing fight")
    // }

    let combatDuration = playerTimeToKill + respawnTimer;
    let hpRegainedPerCombat = regen * combatDuration;
    let damageDealtPerSecond = enemyHp / combatDuration;

    let enemyAttacksPerCombat = playerTimeToKill / enemyAttackTime;
    let damageTakenPerCombat = enemyAttacksPerCombat * enemyAttackDamage - hpRegainedPerCombat; // - hpRegainedPerCombat;

    // console.log("player hp:", maxHitpoints, playerTimeToKill, "vs enemy ", enemyTimeToKill);
    // console.log("fightingDuration", fightingDuration);
    // simulate one combat vs one second of fighting
    let enemiesTillDeath = playerHp / damageTakenPerCombat;
    enemiesTillDeath = (enemiesTillDeath < 0) ? Infinity : enemiesTillDeath;
    let s = Math.round(enemiesTillDeath * combatDuration)
    let h = Math.floor(s / 3600)
    let m = Math.floor((s - h * 3600) / 60)
    s = s - 3600 * h - 60 * m
        // let timeString = ` h: ${h} m: ${m} s: ${s}`;
    let timeString = (enemiesTillDeath == Infinity) ? "Forever" : `${h}:${m}:${s}`;
    return {
        timeString,
        enemyHitDamage,
        enemyAcc,
        combatDuration,
        enemiesTillDeath,
        damageDealtPerSecond,
        damageTakenPerCombat,
        playerHitDamage,
        playerAttackDamage,
        playerHitsToKill,
        playerAttacksToKill,
        playerAttacksToKill1,
        playerTimeToKill,

        enemyHitsPerSec,
        enemyHitDamage,
        enemyAttackDamage,
        enemyHitsToKill,
        enemyAttacksToKill,
        enemyAttacksToKill1,
    }
}
window.chunkKills = chunkKills

function dataRow(text, id) {
    let element = `<div class="col-8">
    <h5 class="font-w400 font-size-sm text-combat-smoke m-1">${text}</h5>
    </div>`
    let number = `<div class="col-4">
    <h5 id="${id}" class="font-w600 font-size-sm text-combat-smoke text-right m-1"></h5>
    </div>`
    return element + number
}

function injectChunkData() {
    if (document.getElementById("ttk") === null) {
        console.log("Injecting TTK data")
        let root = $("#combat-player-chance-to-hit").parent();
        // let effHpElement = `<div class="col-8">
        //         <h5 class="font-w400 font-size-sm text-combat-smoke m-1">Effective HP:</h5>
        //         </div>`
        // let effHpNumber = `<div class="col-4">
        //         <h5 id="effHp" class="font-w600 font-size-sm text-combat-smoke text-right m-1"></h5>
        //         </div>`
        let effHpRow = dataRow("Effective HP:", "effHp");
        let ttkElement = `<div class="col-8">
                <h5 class="font-w400 font-size-sm text-combat-smoke m-1">Time to kill:</h5>
                </div>`
        let ttkNumber = `<div class="col-4">
                <h5 id="ttk" class="font-w600 font-size-sm text-combat-smoke text-right m-1"></h5>
                </div>`
        let etdElement = `<div class="col-8">
                <h5 class="font-w400 font-size-sm text-combat-smoke m-1">Enemies till dead:</h5>
                </div>`
        let etdNumber = `<div class="col-4">
                <h5 id="etd" class="font-w600 font-size-sm text-combat-smoke text-right m-1"></h5>
                </div>`
        let ttdElement = `<div class="col-8">
                <h5 class="font-w400 font-size-sm text-combat-smoke m-1">Time till dead:</h5>
                </div>`
        let ttdNumber = `<div class="col-4">
                <h5 id="ttd" class="font-w600 font-size-sm text-combat-smoke text-right m-1"></h5>
                </div>`
        let ddpsElement = `<div class="col-8">
                <h5 class="font-w400 font-size-sm text-combat-smoke m-1">Net DPS:</h5>
                </div>`
        let ddpsNumber = `<div class="col-4">
                <h5 id="ddps" class="font-w600 font-size-sm text-combat-smoke text-right m-1"></h5>
                </div>`
        root.after(effHpRow, ttkElement, ttkNumber, etdElement, etdNumber, ttdElement, ttdNumber, ddpsElement, ddpsNumber);
    }
}

let refUpdateCombatInfoIcons = updateCombatInfoIcons;

updateCombatInfoIcons = function() {
    refUpdateCombatInfoIcons()
    setTimeout(() => {

        let combatInfo = chunkKills()
        let enemiesTillDeath = Math.floor(combatInfo.enemiesTillDeath)
        let playerTimeToKill = Math.round(combatInfo.playerTimeToKill)
        let damageDealtPerSecond = Math.round(combatInfo.damageDealtPerSecond * 10) / 10
        enemiesTillDeath = (enemiesTillDeath === Infinity) ? "inf" : enemiesTillDeath;
        injectChunkData();
        $("#effHp").text(effHp());
        $("#ttk").text(playerTimeToKill);
        $("#etd").text(enemiesTillDeath);
        $("#ddps").text(damageDealtPerSecond);
        $("#ttd").text(combatInfo.timeString);
        // let name = $("#combat-enemy-name").text()
        // $("#combat-enemy-name").text(name + " (" + playerTimeToKill + "s, " + enemiesTillDeath + "x)")
    }, 10)
}

// })()