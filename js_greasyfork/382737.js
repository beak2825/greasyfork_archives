// ==UserScript==
// @name         base saver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382737/base%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/382737/base%20saver.meta.js
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

var Ultimate = {}

var changeHeight = document.createElement("style")
changeHeight.type = "text/css"
changeHeight.innerHTML = "@keyframes hud-popup-message {0% { max-height: 0; margin-bottom: 0; opacity: 0; }100% { max-height: 1000px; margin-bottom: 10px; opacity: 1; }} .hud-map .hud-map-spot {display: none;position: absolute;width: 4px;height: 4px;margin: -2px 0 0 -2px;background: #ff5b5b;border-radius: 50%;z-index: 2;} .hud-chat .hud-chat-message { -moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text; -ms-user-select: text; user-select: text; }"
document.body.appendChild(changeHeight)
var widget = '<iframe src="https://discordapp.com/widget?id=509768077932625920&amp;theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" style="width: 300px;height: 320px;"></iframe>'
$("hud-intro-left").innerHTML = widget

var PopupOverlay = Game.currentGame.ui.getComponent("PopupOverlay")

var input = $("hud-chat-input")
var pets = $("hud-shop-actions-equip")

function clearChat() {
    input.value = null
}

Ultimate.GetGoldStash = function() {
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

Ultimate.PlaceBuilding = function(x, y, building, yaw) {
    Game.currentGame.network.sendRpc({
        name: "MakeBuilding",
        x: x,
        y: y,
        type: building,
        yaw: yaw
    })
}

Ultimate.BuildBryanSmithBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = Ultimate.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Ultimate.PlaceBuilding(stashPosition.x + 0, stashPosition.y + 0, 'GoldStash', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -192, stashPosition.y + -48, 'GoldMine', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -192, stashPosition.y + 48, 'GoldMine', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -192, 'GoldMine', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -192, 'GoldMine', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 192, stashPosition.y + -48, 'GoldMine', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 48, 'GoldMine', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 192, 'GoldMine', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 192, 'GoldMine', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 288, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 288, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 288, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 288, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -48, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 48, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -288, stashPosition.y + 144, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -288, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -288, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -144, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 288, stashPosition.y + -48, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 48, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 144, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 144, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 144, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 240, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 240, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 336, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 384, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 480, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 576, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 432, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -288, stashPosition.y + -144, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -144, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -144, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -432, stashPosition.y + -240, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -240, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 240, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 384, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 432, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -288, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -384, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -480, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -432, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -384, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -288, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -384, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -480, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -432, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -384, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -240, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 432, stashPosition.y + -240, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 528, stashPosition.y + -240, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -144, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -144, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -144, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 384, stashPosition.y + -48, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 48, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -48, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 48, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 576, stashPosition.y + -48, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 48, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 240, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 336, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 528, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 576, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 384, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 384, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 48, stashPosition.y + 480, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 480, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -48, stashPosition.y + 576, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 480, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 576, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -240, stashPosition.y + 528, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -336, stashPosition.y + 480, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -384, stashPosition.y + -48, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 48, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 144, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -48, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 48, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 144, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -432, stashPosition.y + 240, 'CannonTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -384, stashPosition.y + 336, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 480, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -480, stashPosition.y + 336, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -528, stashPosition.y + 240, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 480, stashPosition.y + -336, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -480, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -384, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -384, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -480, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 48, stashPosition.y + -576, 'BombTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -576, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 240, stashPosition.y + -528, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 336, stashPosition.y + -480, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -48, stashPosition.y + -576, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -576, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -240, stashPosition.y + -528, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -336, stashPosition.y + -480, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 48, 'ArrowTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -576, stashPosition.y + 144, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -48, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -576, stashPosition.y + -144, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -528, stashPosition.y + -240, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -480, stashPosition.y + -336, 'MagicTower', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -144, stashPosition.y + -192, 'Harvester', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 144, stashPosition.y + -192, 'Harvester', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 144, stashPosition.y + 192, 'Harvester', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -144, stashPosition.y + 192, 'Harvester', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -168, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -120, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -72, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -648, stashPosition.y + -24, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 24, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 72, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 120, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -648, stashPosition.y + 168, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -120, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -72, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -696, stashPosition.y + -24, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 24, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 72, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -696, stashPosition.y + 120, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 120, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 120, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 552, stashPosition.y + 168, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 600, stashPosition.y + 168, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -168, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -120, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -72, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 648, stashPosition.y + -24, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 24, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 72, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 120, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 648, stashPosition.y + 168, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -120, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -72, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 696, stashPosition.y + -24, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 24, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 72, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 120, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -168, stashPosition.y + -648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 168, stashPosition.y + -648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -120, stashPosition.y + -696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -72, stashPosition.y + -696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -24, stashPosition.y + -696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 24, stashPosition.y + -696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 72, stashPosition.y + -696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 120, stashPosition.y + -696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -168, stashPosition.y + 648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 168, stashPosition.y + 648, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -120, stashPosition.y + 696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -72, stashPosition.y + 696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -24, stashPosition.y + 696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 24, stashPosition.y + 696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 72, stashPosition.y + 696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 120, stashPosition.y + 696, 'Wall', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 312, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 360, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -120, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -120, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 120, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 216, stashPosition.y + 120, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -312, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 216, stashPosition.y + -360, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + 264, stashPosition.y + -360, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -360, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -216, stashPosition.y + -312, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -264, stashPosition.y + -360, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 312, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -216, stashPosition.y + 360, 'Door', 0);
            Ultimate.PlaceBuilding(stashPosition.x + -264, stashPosition.y + 360, 'Door', 0);
        }
    }, 100)
}

Ultimate.BuildThingBase = function() {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            var stash = Ultimate.GetGoldStash();
            if (stash == undefined) return
            var stashPosition = {
                x: stash.x,
                y: stash.y
            }
            clearInterval(waitForGoldStash)
            Ultimate.PlaceBuilding(stashPosition.x + 96, stashPosition.y, "GoldMine", 0)
            Ultimate.PlaceBuilding(stashPosition.x, stashPosition.y + 96, "GoldMine", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 144, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x, stashPosition.y + 192, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 240, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 192, stashPosition.y, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 96, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 240, stashPosition.y + 192, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 336, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 192, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 288, stashPosition.y, "GoldMine", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 96, "GoldMine", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 192, "GoldMine", 0)
            Ultimate.PlaceBuilding(stashPosition.x, stashPosition.y + 288, "GoldMine", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 336, "GoldMine", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 432, "GoldMine", 0)
            Ultimate.PlaceBuilding(stashPosition.x, stashPosition.y + 384, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 432, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 528, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 384, stashPosition.y, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 96, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 192, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 336, stashPosition.y + 336, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 432, stashPosition.y + 432, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 480, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 288, "ArrowTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 528, "CannonTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 624, "CannonTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 528, stashPosition.y + 96, "CannonTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 192, "CannonTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 480, stashPosition.y, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 576, stashPosition.y, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 96, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 720, stashPosition.y + 192, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 288, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x, stashPosition.y + 480, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x, stashPosition.y + 576, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 96, stashPosition.y + 624, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 192, stashPosition.y + 720, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 672, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 672, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 624, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 480, stashPosition.y + 528, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 576, "BombTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 288, "BombTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 384, stashPosition.y + 576, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 312, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 360, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 264, stashPosition.y + 408, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 312, stashPosition.y + 408, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 456, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 504, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 408, stashPosition.y + 504, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 408, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 288, stashPosition.y + 768, "CannonTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 768, stashPosition.y + 288, "CannonTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 672, stashPosition.y + 384, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 624, stashPosition.y + 480, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 576, stashPosition.y + 384, "MagicTower", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 744, stashPosition.y + 360, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 696, stashPosition.y + 456, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 456, stashPosition.y + 696, "Door", 0)
            Ultimate.PlaceBuilding(stashPosition.x + 360, stashPosition.y + 744, "Door", 0)
        }
    }, 100)
}

Ultimate.RecordBase = function(baseNaame) {
    var base = ""
    var stash = Ultimate.GetGoldStash();
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
        base += "Ultimate.PlaceBuilding(stashPosition.x + " + x + ", stashPosition.y + " + y + ", '" + Game.currentGame.world.entities[obj.uid].fromTick.model + "', " + Game.currentGame.world.entities[obj.uid].fromTick.yaw + ");"
    }
    localStorage.setItem(baseNaame, base)
}


var stash
var stashPosition
Ultimate.buildRecordedBase = function(myBaseName) {
    var waitForGoldStash = setInterval(function() {
        if (document.querySelectorAll("[data-building]")[10].classList[1] == "is-disabled") {
            stash = Ultimate.GetGoldStash();
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

Ultimate.DeleteRecordedbase = function(mybasename) {
    if (localStorage.getItem(mybasename)) {
        PopupOverlay.showHint(Ultimate.popups.popupDeletedRecordedBase.text, Ultimate.popups.popupDeletedRecordedBase.time)
        localStorage.removeItem(mybasename)
    } else {
        PopupOverlay.showHint(Ultimate.popups.popupUnknownbase.text, Ultimate.popups.popupUnknownbase.time)
    }
}

Ultimate.commands = [
    "/buildbase",
    "/recordbase",
    "/buildcustombase",
    "/deleterecordedbase",
    "/getcustombases",
    "/commands"
]

Ultimate.popups = {
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
            Ultimate.DeleteRecordedbase(mybasename)
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

Ultimate.sendBotMessage = function(msg) {
    Game.currentGame.ui.getComponent("Chat").onMessageReceived({
        displayName: "[BOT]",
        message: msg
    })
}

Ultimate.bases = [
    "thing",
    "bryansmith"
]


function CheckCommand(e) {
    switch (e.which) {
        case 13:
            if (!(Ultimate.commands.indexOf(input.value) > -1)) {
                PopupOverlay.showHint(Ultimate.popups.popupBadCommand.text, Ultimate.popups.popupBadCommand.time)
                clearChat()
            }
    }
    document.removeEventListener("keydown", CheckCommand)
}

function AutoBuildBase(e) {
    switch (e.which) {
        case 13:
            var base = input.value.toLowerCase().substring(0, Ultimate.commands[0].length)
            base = input.value.toLowerCase().replace(base, "")
            base = base.trim()
            var waitingForGoldStash = setInterval(function() {
                var stash = Ultimate.GetGoldStash();
                if (stash == undefined) {
                    PopupOverlay.showHint(Ultimate.popups.popupWaitingForGoldStash.text, Ultimate.popups.popupWaitingForGoldStash.time)
                    return
                } else {
                    clearInterval(waitingForGoldStash)
                    if (base === Ultimate.bases[0]) {
                        Ultimate.BuildThingBase()
                        PopupOverlay.showHint(Ultimate.popups.popupBuildBase.text + Ultimate.bases[0] + Ultimate.popups.popupBuildBase.secondtext, Ultimate.popups.popupBuildBase.time)
                    } else if (base === Ultimate.bases[1]) {
                        Ultimate.BuildBryanSmithBase()
                        PopupOverlay.showHint(Ultimate.popups.popupBuildBase.text + Ultimate.bases[1] + Ultimate.popups.popupBuildBase.secondtext, Ultimate.popups.popupBuildBase.time)
                    } else {
                        PopupOverlay.showHint(Ultimate.popups.popupUnknownbase.text, Ultimate.popups.popupUnknownbase.time)
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
            var baseName = input.value.toLowerCase().substring(0, Ultimate.commands[1].length)
            baseName = input.value.toLowerCase().replace(baseName, "")
            baseName = baseName.trim()
            if (localStorage.getItem(baseName)) {
                clearChat()
                PopupOverlay.showHint(Ultimate.popups.popupBaseAlreadySaved.text, Ultimate.popups.popupBaseAlreadySaved.time)
            } else {
                clearChat()
                PopupOverlay.showHint(Ultimate.popups.popupBaseRecorded.text, Ultimate.popups.popupBaseRecorded.time)
                Ultimate.RecordBase(baseName)
            }
            document.removeEventListener("keydown", RecordCustomBase)
    }
}

function BuildCustomBase(e) {
    switch (e.which) {
        case 13:
            var nameOfBase = input.value.toLowerCase().substring(0, Ultimate.commands[2].length)
            nameOfBase = input.value.toLowerCase().replace(nameOfBase, "")
            nameOfBase = nameOfBase.trim()
            clearChat()
            if (localStorage.getItem(nameOfBase)) {
                PopupOverlay.showHint(Ultimate.popups.popupBuildBase.text + nameOfBase + Ultimate.popups.popupBuildBase.secondtext, Ultimate.popups.popupBuildBase.time)
                Ultimate.buildRecordedBase(nameOfBase)
            } else {
                PopupOverlay.showHint(Ultimate.popups.popupUnknownbase.text, Ultimate.popups.popupUnknownbase.time)
            }
            document.removeEventListener("keydown", BuildCustomBase)
    }
}

var mybasename

function DeleteRecordedbase(e) {
    switch (e.which) {
        case 13:
            mybasename = input.value.toLowerCase().substring(0, Ultimate.commands[3].length)
            mybasename = input.value.toLowerCase().replace(mybasename, "")
            mybasename = mybasename.trim()
            PopupOverlay.showConfirmation(Ultimate.popups.popupDeleteRecordedBase.text, Ultimate.popups.popupDeleteRecordedBase.time, Ultimate.popups.popupDeleteRecordedBase.onaccept)
            clearChat()
            document.removeEventListener("keydown", DeleteRecordedbase)
    }
}

function getRecordedBases(e) {
    switch (e.which) {
        case 13:
            var value = Object.keys(localStorage).filter(function (x) {
                return localStorage.getItem(x).startsWith('Ultimate');
            })
            if (value.length === 0) {
                    PopupOverlay.showHint(Ultimate.popups.popupNoBaseRecorded.text, Ultimate.popups.popupNoBaseRecorded.time)
                } else {
                    PopupOverlay.showHint(Ultimate.popups.popupRecordedBases.text + "<br>" + value, Ultimate.popups.popupRecordedBases.time)
                }
            clearChat()
            document.removeEventListener("keydown", getRecordedBases)
    }
}

function getCommands(e) {
    switch (e.which) {
        case 13:
            clearChat()
            var commands = JSON.stringify(Ultimate.commands)
            commands = JSON.parse(commands)
            for(var i = 0; i < Ultimate.commands.length; i++) {
                commands[i] = commands[i].replace(/^/,' ');
            }
            PopupOverlay.showHint(Ultimate.popups.popupCommands.text + commands, Ultimate.popups.popupCommands.time)
            document.removeEventListener("keydown", getCommands)
    }
}

input.addEventListener("input", function() {
    if (input.value.toLowerCase().indexOf(Ultimate.commands[0]) >= 0) {
        document.addEventListener("keydown", AutoBuildBase)
    } else if (input.value.toLowerCase().indexOf(Ultimate.commands[1]) >= 0) {
        document.addEventListener("keydown", RecordCustomBase)
    } else if (input.value.toLowerCase().indexOf(Ultimate.commands[2]) >= 0) {
        document.addEventListener("keydown", BuildCustomBase)
    } else if (input.value.toLowerCase().indexOf(Ultimate.commands[3]) >= 0) {
        document.addEventListener("keydown", DeleteRecordedbase)
    } else if (input.value.toLowerCase().indexOf(Ultimate.commands[4]) >= 0) {
        document.addEventListener("keydown", getRecordedBases)
    } else if (input.value.toLowerCase().indexOf(Ultimate.commands[5]) >= 0) {
        document.addEventListener("keydown", getCommands)
    } else if (input.value.startsWith("/")) {
        document.addEventListener("keydown", CheckCommand)
    }
})
