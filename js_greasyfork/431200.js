// ==UserScript==
// @name        Auto Clicker - pokeclicker.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.1
// @author      Ivan Lay
// @description Clicks through battles appropriately depending on the game state.
// @downloadURL https://update.greasyfork.org/scripts/431200/Auto%20Clicker%20-%20pokeclickercom.user.js
// @updateURL https://update.greasyfork.org/scripts/431200/Auto%20Clicker%20-%20pokeclickercom.meta.js
// ==/UserScript==

function autoClicker() {
  var autoClickerLoop = setInterval(function () {
    // Click while in a normal battle
    if (App.game.gameState == GameConstants.GameState.fighting) {
      Battle.clickAttack();
    }

    // Click while in a gym battle
    if (App.game.gameState === GameConstants.GameState.gym) {
      GymBattle.clickAttack();
    }

    // Click while in a dungeon - will also interact with non-battle tiles (e.g. chests)
    if (App.game.gameState === GameConstants.GameState.dungeon) {
      if (DungeonRunner.fighting() && !DungeonBattle.catching()) {
        DungeonBattle.clickAttack();
      } else if (
        DungeonRunner.map.currentTile().type() ===
        GameConstants.DungeonTile.chest
      ) {
        DungeonRunner.openChest();
      } else if (
        DungeonRunner.map.currentTile().type() ===
          GameConstants.DungeonTile.boss &&
        !DungeonRunner.fightingBoss()
      ) {
        DungeonRunner.startBossFight();
      }
    }

    // Click while in Safari battles
    if (Safari.inBattle()) {
      BattleFrontierBattle.clickAttack();
    }
  }, 50); // The app hard-caps click attacks at 50
}

autoClicker();