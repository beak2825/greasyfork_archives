// ==UserScript==
// @name        Auto Clicker - pokeclicker.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.1
// @author      Ivan Lay
// @description Clicks through battles appropriately depending on the game state.
// @downloadURL https://update.greasyfork.org/scripts/445627/Auto%20Clicker%20-%20pokeclickercom.user.js
// @updateURL https://update.greasyfork.org/scripts/445627/Auto%20Clicker%20-%20pokeclickercom.meta.js
// ==/UserScript==
var autoClick = true;
var node = document.createElement('div');
node.classList.add('card');
node.classList.add('mb-3');
node.innerHTML = '<div id="scriptClickAutomation" class="card-header"><span>AutoClick</span></div><div id="clickBody" class="card-body"><button id="toggleClick" class="btn btn-success" type="button">'
               + 'AutoClick Enabled</button></div>'

node.setAttribute('id', 'autoClickContainer');
document.getElementById('left-column').appendChild(node);
document.getElementById('toggleClick').addEventListener('click', ToggleAutoClick, false);

function ToggleAutoClick(){
    autoClick = !autoClick;
    var button = document.getElementById('toggleClick');
    if (!autoClick) {
        button.classList.remove('btn-success');
        button.classList.add('btn-danger');
        button.innerText = 'AutoClick Disabled';
    } else {
        button.classList.remove('btn-danger');
        button.classList.add('btn-success');
        button.innerText = 'AutoClick Enabled';
    }
}

function autoClicker() {
  var autoClickerLoop = setInterval(function () {
    if (autoClick){
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
    }
  }, 50); // The app hard-caps click attacks at 50
}

function waitForLoad(){
    var timer = setInterval(function() {
        if (!document.getElementById("game").classList.contains("loading")) {
            // Check if the game window has loaded
            clearInterval(timer);
            autoClicker();
        }
    }, 200);
}

waitForLoad();