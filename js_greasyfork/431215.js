// ==UserScript==
// @name        Bomb Underground when Energy full - pokeclicker.com
// @namespace   Violentmonkey Scripts
// @match       https://www.pokeclicker.com/
// @grant       none
// @version     1.0
// @author      Ivan Lay
// @description Automatically use Bomb when the next energy tick will put you at max energy or above. Use it or lose it! This is horribly horribly inefficient, but it's better than wasting energy.
// @downloadURL https://update.greasyfork.org/scripts/431215/Bomb%20Underground%20when%20Energy%20full%20-%20pokeclickercom.user.js
// @updateURL https://update.greasyfork.org/scripts/431215/Bomb%20Underground%20when%20Energy%20full%20-%20pokeclickercom.meta.js
// ==/UserScript==

function useBomb() {
  while (
    App.game.underground.getMaxEnergy() -
      Math.floor(App.game.underground.energy) <=
    App.game.underground.getEnergyGain() *
      App.game.oakItems.calculateBonus(OakItems.OakItem.Cell_Battery)
  ) {
    Mine.bomb();
    //console.log("Mined!");
  }
}

function loopMine() {
  var bombLoop = setInterval(function () {
    //console.log("Checking underground...");
    useBomb();
  }, 10000); // Every 10 seconds
}

loopMine();