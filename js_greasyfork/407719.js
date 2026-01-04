// ==UserScript==
// @name         Melvor Auto Equipment Swap
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically swap equipment set to counter enemies.
// @author       Zek
// @match        https://*.melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407719/Melvor%20Auto%20Equipment%20Swap.user.js
// @updateURL https://update.greasyfork.org/scripts/407719/Melvor%20Auto%20Equipment%20Swap.meta.js
// ==/UserScript==

// Change these if your equipment setup is different.
const MELEE_SET = 0;
const RANGED_SET = 1;
const MAGIC_SET = 2;

const MELEE_ENEMY = 0;
const RANGED_ENEMY = 1;
const MAGIC_ENEMY = 2;

this.autoEquipmentSwap = setInterval(() => {
  if (window.isInCombat && window.combatData.enemy) {
    const playerSet = window.selectedEquipmentSet;
    const enemyType = window.combatData.enemy.attackType;
    if (enemyType === MELEE_ENEMY && playerSet != MAGIC_SET) {
      window.setEquipmentSet(MAGIC_SET);
    } else if (enemyType === RANGED_ENEMY && playerSet != MELEE_SET) {
      window.setEquipmentSet(MELEE_SET);
    } else if (enemyType === MAGIC_ENEMY && playerSet != RANGED_SET) {
      window.setEquipmentSet(RANGED_SET);
    }
  }
}, 250);