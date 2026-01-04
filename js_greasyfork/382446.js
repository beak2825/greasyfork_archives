// ==UserScript==
// @name         Auto Bow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  go to the settings and hit Auto Bow
// @author       Darkness 196
// @match        zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382446/Auto%20Bow.user.js
// @updateURL https://update.greasyfork.org/scripts/382446/Auto%20Bow.meta.js
// ==/UserScript==

// Auto Bow
var grid = '';
grid += `"<button id="bow" class="btn btn-blue" style="width: 100%; height: 50px;">Turn Autobow On</button>";
grid += "<center><h2>For the auto bow to work you need to have a purchased bow first! </h2>";`
document.getElementsByClassName("hud-settings-grid")[0].innerHTML = grid;

//AutoBow
var button25 = document.getElementById("bow");
button25.addEventListener("click", startbow);
button25.addEventListener("click", stopbow);
var bow = null;
function startbow() {
clearInterval(bow);
  if (bow !== null) {
    bow = null;
  } else {
          if(Game.currentGame.ui.inventory.Bow) {
              Game.currentGame.network.sendRpc({
                        name: "EquipItem",
                        itemName: "Bow",
                        tier: Game.currentGame.ui.inventory.Bow.tier
                  })
              bow = setInterval(function() {
                  Game.currentGame.inputPacketScheduler.scheduleInput({
                            space: 1
                            })
                  Game.currentGame.inputPacketScheduler.scheduleInput({
                            space: 0
                            })
                  Game.currentGame.inputPacketScheduler.scheduleInput({
                            space: 0
                            })
                }, 0);
           }
     }
}
          function stopbow() {
  var trade = document.getElementById("bow");
  if (trade.innerHTML == "Turn Autobow On") {
    trade.innerHTML = "Turn Autobow Off";
  } else {
    trade.innerHTML = "Turn Autobow On";
  }
}