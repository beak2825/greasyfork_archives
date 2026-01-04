// ==UserScript==
// @name         Gold Generator (Ultra Gold) + little fixes
// @namespace    //
// @version      5
// @description  chat '1 1 to get bombs near stash, chat '1 2 to make a small base, press g to stop auto build.
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384527/Gold%20Generator%20%28Ultra%20Gold%29%20%2B%20little%20fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/384527/Gold%20Generator%20%28Ultra%20Gold%29%20%2B%20little%20fixes.meta.js
// ==/UserScript==

  function $(classname) {
    var element = document.getElementsByClassName(classname)
    if (element.length === 1) {
        return element[0]
    } else {
        return element
    }
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

var EXTREME = {}
var changeHeight = document.createElement("style")
changeHeight.type = "text/css"
changeHeight.innerHTML = "@keyframes hud-popup-message {0% { max-height: 0; margin-bottom: 0; opacity: 0; }100% { max-height: 1000px; margin-bottom: 10px; opacity: 1; }} .hud-map .hud-map-spot {display: none;position: absolute;width: 4px;height: 4px;margin: -2px 0 0 -2px;background: #ff5b5b;border-radius: 50%;z-index: 2;} .hud-chat .hud-chat-message { -moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text; -ms-user-select: text; user-select: text; }"
document.body.appendChild(changeHeight)
var widget = '<iframe src="zombs.io/;theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" style="width: 300px;height: 320px;"></iframe>'
$("hud-intro-left").innerHTML = widget
var PopupOverlay = Game.currentGame.ui.getComponent("PopupOverlay")

var input = $("hud-chat-input")
var pets = $("hud-shop-actions-equip")

function clearChat() {
    input.value = null
}

EXTREME.GetGoldStash = function() {
    var entities = Game.currentGame.ui.buildings
    for (var uid in entities) {
        if (!entities.hasOwnProperty(uid)) {
            continue
        }
        var obj = entities[uid]
        if (obj.type == "GoldStash") {
            return obj
        }
    }
}

EXTREME.PlaceBuilding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
    sellBombs()
    upgradeBombs()
}
        let sellBombs = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "BombTower") {
                                Game.currentGame.network.sendRpc({
                                        "name": "DeleteBuilding",
                                        "uid": obj.fromTick.uid
                                })

                        }
                }
        },
        upgradeBombs = () => {
                const entities = Game.currentGame.world.entities
                for(const uid in entities) {
                        if(!entities.hasOwnProperty(uid)) continue
                        const obj = entities[uid]
                        if(obj.fromTick.model == "BombTower") {
                                Game.currentGame.network.sendRpc({
                                        "name": "UpgradeBuilding",
                                        "uid": obj.fromTick.uid
                                })
                        }
                }
        }
EXTREME.BuildBryanSmithBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 96, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -96, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 0, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 0, "BombTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 19222, stashPosition.y + 220, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 2, stashPosition.y + 1922, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 20, stashPosition.y + -1922, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -12292, stashPosition.y + 2222, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -926, stashPosition.y + 926, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 296, stashPosition.y + 926, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 926, stashPosition.y + -2296, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -926, stashPosition.y + -926, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -926, stashPosition.y + 1922, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 92226, stashPosition.y + 1922, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 9226, stashPosition.y + -1922, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -926, stashPosition.y + -1292, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 962, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 962, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -926, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -296, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 1292, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 1922, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -1292, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -1292, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 2828, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 2828, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -2288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -2288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 1922, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 1922, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -1292, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -1292, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 962, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -926, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -296, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 1292, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 1922, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -1292, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -1292, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 2828, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 2828, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -2288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -2288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 1922, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 1922, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -1292, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -1292, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 1922, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -1292, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -1292, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 2828, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 2828, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -2288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -2288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 1922, "MagicTower", 0)
        }
    }, 325)
    function keyDown24(e) {
  switch (e.keyCode) {
    case 71:
          clearInterval(waitForGoldStash);
      break;
  }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", keyDown24);
    } else {
        window.addEventListener("keydown", keyDown24);
    }
}, 0);
}

EXTREME.BuildThingBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 0, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 192, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -192, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 0, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 96, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 96, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -96, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -96, "GoldMine", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 96, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 96, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -96, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -96, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -192, "ArrowTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -192, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -288, "MagicTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + 288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 96, stashPosition.y + -288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -96, stashPosition.y + -288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -96, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 0, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -0, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 0, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -0, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -0, stashPosition.y + 288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -0, stashPosition.y + 288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -288, "CannonTower", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 0, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 24, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 72, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 120, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 168, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 216, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 264, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 312, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -0, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 312, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 264, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 216, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 168, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 120, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 72, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 24, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 0, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -360, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -312, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -264, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -216, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -168, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -120, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -72, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -24, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -0, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 408, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 360, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 312, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + 0, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -360, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -312, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -0, stashPosition.y + -408, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -0, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -72, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -24, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -120, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -168, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -216, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -264, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -312, "Door", 0)
            EXTREME.PlaceBuilding(stashPosition.x + -408, stashPosition.y + -360, "Door", 0)
        }
    }, 900)
    function keyDown25(e) {
  switch (e.keyCode) {
    case 71:
          clearInterval(waitForGoldStash);
      break;
  }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", keyDown25);
    } else {
        window.addEventListener("keydown", keyDown25);
    }
}, 0);
}


EXTREME.RecordBase = function(baseName) {
    var base = ""
    var stash = EXTREME.GetGoldStash();
    if (stash == undefined) {
        return
    }
    var stashPosition = {
        x: stash.x,
        y: stash.y
    }
    var buildings = Game.currentGame.ui.buildings;
    for (var uid in buildings) {
        if (!buildings.hasOwnProperty(uid)) {
            continue
        }

        var obj = buildings[uid]
        var x = Game.currentGame.world.entities[obj.uid].fromTick.position.x - stashPosition.x
        var y = Game.currentGame.world.entities[obj.uid].fromTick.position.y - stashPosition.y
        base += "EXTREME.PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + Game.currentGame.world.entities[obj.uid].fromTick.model + "', " + Game.currentGame.world.entities[obj.uid].fromTick.yaw + ");"
    }
    localStorage.setItem(baseNaame, base)
                         }


var stash
var stashPosition
EXTREME.buildRecordedBase = function(myBaseName) {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = EXTREME.GetGoldStash();
            if (stash == undefined) return
            stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            var basecode = localStorage.getItem(myBaseName)
            basecode = new Function(basecode)
            return basecode()
        }
    }, 250)
}

EXTREME.DeleteRecordedbase = function(mybasename) {
    if (localStorage.getItem(mybasename)) {
        PopupOverlay.showHint(EXTREME.popups.popupDeletedRecordedBase.text, EXTREME.popups.popupDeletedRecordedBase.time)
        localStorage.removeItem(mybasename)
    } else {
        PopupOverlay.showHint(EXTREME.popups.popupUnknownbase.text, EXTREME.popups.popupUnknownbase.time)
    }
}

EXTREME.commands = [
    "'1",
    "`2",
    "`3",
    "`4",
    "`5",
    "`6"
]

EXTREME.popups = {
    popupBuildBase: {
        text: "Successfully built ",
        secondtext: " base!",
        time: 4000
    },
    popupUnknownbase: {
        text: "Invalid base name",
        time: 4000
    },
    popupWaitingForGoldStash: {
        text: "Waiting for GoldStash...",
        time: 4000
    },
    popupBaseAlreadySaved: {
        text: "You already have saved a base with this name!",
        time: 4000
    },
    popupBaseRecorded: {
        text: "Successfully recorded base!",
        time: 4000
    },
    popupDeleteRecordedBase: {
        text: "Are you sure to want to delete your recorded base?",
        time: 10000,
        onaccept: function() {
            EXTREME.DeleteRecordedbase(mybasename)
        }
    },
    popupDeletedRecordedBase: {
        text: "Successfully deleted recorded base.",
        time: 4000
    },
    popupRecordedBases: {
        text: "Recorded bases:",
        time: 20000
    },
    popupNoBaseRecorded: {
        text: "You didn't record any base!",
        time: 4000
    },
    popupCommands: {
        text: "Here are the commands: ",
        time: 10000
    },
    popupBadCommand: {
        text: "This command doesn't exist.",
        time: 2000
    }
}

EXTREME.sendBotMessage = function(msg) {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "[BOT]",
        message: msg
    })
}

EXTREME.bases = [
    "2",
    "1",
]


function CheckCommand(e) {
    switch (e.which) {
        case 13:
            if (!(EXTREME.commands.indexOf(input.value) > -1)) {
                PopupOverlay.showHint(EXTREME.popups.popupBadCommand.text, EXTREME.popups.popupBadCommand.time)
                clearChat()
            }
    }
    document.removeEventListener("keydown", CheckCommand)
}

function AutoBuildBase(e) {
    switch (e.which) {
        case 13:
            var base = input.value.toLowerCase().substring(0, EXTREME.commands[0].length)
            base = input.value.toLowerCase().replace(base, "")
            base = base.trim()
            var waitingForGoldStash = setInterval(function() {
                var stash = EXTREME.GetGoldStash();
                if (stash == undefined) {
                    PopupOverlay.showHint(EXTREME.popups.popupWaitingForGoldStash.text, EXTREME.popups.popupWaitingForGoldStash.time)
                    return
                } else {
                    clearInterval(waitingForGoldStash)
                    if (base === EXTREME.bases[0]) {
                        EXTREME.BuildThingBase()
                        PopupOverlay.showHint(EXTREME.popups.popupBuildBase.text + EXTREME.bases[0] + EXTREME.popups.popupBuildBase.secondtext, EXTREME.popups.popupBuildBase.time)
                    } else if (base === EXTREME.bases[1]) {
                        EXTREME.BuildBryanSmithBase()
                        PopupOverlay.showHint(EXTREME.popups.popupBuildBase.text + EXTREME.bases[1] + EXTREME.popups.popupBuildBase.secondtext, EXTREME.popups.popupBuildBase.time)
                    } else {
                        PopupOverlay.showHint(EXTREME.popups.popupUnknownbase.text, EXTREME.popups.popupUnknownbase.time)
                    }
                }
            }, 500)
            clearChat()
            document.removeEventListener("keydown", AutoBuildBase)
    }
}

function RecordCustomBase(e) {
    switch (e.which) {
        case 13:
            var baseName = input.value.toLowerCase().substring(0, EXTREME.commands[1].length)
            baseName = input.value.toLowerCase().replace(baseName, "")
            baseName = baseName.trim()
            if (localStorage.getItem(baseName)) {
                clearChat()
                PopupOverlay.showHint(EXTREME.popups.popupBaseAlreadySaved.text, EXTREME.popups.popupBaseAlreadySaved.time)
            } else {
                clearChat()
                PopupOverlay.showHint(EXTREME.popups.popupBaseRecorded.text, EXTREME.popups.popupBaseRecorded.time)
                EXTREME.RecordBase(baseName)
            }
            document.removeEventListener("keydown", RecordCustomBase)
    }
}

function BuildCustomBase(e) {
    switch (e.which) {
        case 13:
            var nameOfBase = input.value.toLowerCase().substring(0, EXTREME.commands[2].length)
            nameOfBase = input.value.toLowerCase().replace(nameOfBase, "")
            nameOfBase = nameOfBase.trim()
            clearChat()
            if (localStorage.getItem(nameOfBase)) {
                PopupOverlay.showHint(EXTREME.popups.popupBuildBase.text + nameOfBase + EXTREME.popups.popupBuildBase.secondtext, EXTREME.popups.popupBuildBase.time)
                EXTREME.buildRecordedBase(nameOfBase)
            } else {
                PopupOverlay.showHint(EXTREME.popups.popupUnknownbase.text, EXTREME.popups.popupUnknownbase.time)
            }
            document.removeEventListener("keydown", BuildCustomBase)
    }
}

var mybasename

function DeleteRecordedbase(e) {
    switch (e.which) {
        case 13:
            mybasename = input.value.toLowerCase().substring(0, EXTREME.commands[3].length)
            mybasename = input.value.toLowerCase().replace(mybasename, "")
            mybasename = mybasename.trim()
            PopupOverlay.showConfirmation(EXTREME.popups.popupDeleteRecordedBase.text, EXTREME.popups.popupDeleteRecordedBase.time, EXTREME.popups.popupDeleteRecordedBase.onaccept)
            clearChat()
            document.removeEventListener("keydown", DeleteRecordedbase)
    }
}

function getRecordedBases(e) {
    switch (e.which) {
        case 13:
            var value = Object.keys(localStorage).filter(function (x) {
                return localStorage.getItem(x).startsWith('EXTREME');
            })
            if (value.length === 0) {
                    PopupOverlay.showHint(EXTREME.popups.popupNoBaseRecorded.text, EXTREME.popups.popupNoBaseRecorded.time)
                } else {
                    PopupOverlay.showHint(EXTREME.popups.popupRecordedBases.text + "<br>" + value, EXTREME.popups.popupRecordedBases.time)
                }
            clearChat()
            document.removeEventListener("keydown", getRecordedBases)
    }
}

function getCommands(e) {
    switch (e.which) {
        case 13:
            clearChat()
            var commands = JSON.stringify(EXTREME.commands)
            commands = JSON.parse(commands)
            for(var i = 0; i < EXTREME.commands.length; i++) {
                commands[i] = commands[i].replace(/^/,' ');
            }
            PopupOverlay.showHint(EXTREME.popups.popupCommands.text + commands, EXTREME.popups.popupCommands.time)
            document.removeEventListener("keydown", getCommands)
    }
}

input.addEventListener("input", function() {
    if (input.value.toLowerCase().indexOf(EXTREME.commands[0]) >= 0) {
        document.addEventListener("keydown", AutoBuildBase)
    } else if (input.value.toLowerCase().indexOf(EXTREME.commands[1]) >= 0) {
        document.addEventListener("keydown", RecordCustomBase)
    } else if (input.value.toLowerCase().indexOf(EXTREME.commands[2]) >= 0) {
        document.addEventListener("keydown", BuildCustomBase)
    } else if (input.value.toLowerCase().indexOf(EXTREME.commands[3]) >= 0) {
        document.addEventListener("keydown", DeleteRecordedbase)
    } else if (input.value.toLowerCase().indexOf(EXTREME.commands[4]) >= 0) {
        document.addEventListener("keydown", getRecordedBases)
    } else if (input.value.toLowerCase().indexOf(EXTREME.commands[5]) >= 0) {
        document.addEventListener("keydown", getCommands)
    } else if (input.value.startsWith("'")) {
        document.addEventListener("keydown", CheckCommand)
    }
})