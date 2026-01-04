// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422889/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/422889/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...//Draconyx Gear (Use one at a time)
PIXI.game.prodigy.player.backpack.data.outfit.push({"N":999999,"ID":52});
PIXI.game.prodigy.player.backpack.data.hat.push({"N":999999,"ID":61});
PIXI.game.prodigy.player.backpack.data.weapon.push({"N":1,"ID":77});

//Max Member stars
javascript:PIXI.game.prodigy.player.data.storedMemberStars=99999999999999

//99 Conjure cubes (you can change the number)
 PIXI.game.prodigy.debugMisc.getCubes(99)
 
 //Sets the amount of all your currencies to 9 million. (you can change number)
x = PIXI.game.prodigy.player.backpack.data.currency
for (i in x) {
x[i] = {"ID": x[i].ID, "N": 9000000}
}

//All outfits
PIXI.game.prodigy.player.backpack.data.outfit=[]
x = PIXI.game.state.states.Boot._gameData.outfit
for (i in x) {
PIXI.game.prodigy.player.backpack.data.outfit[i] = {"ID": x[i].ID, "N": 1}
}

//All boots
PIXI.game.prodigy.player.backpack.data.boots=[]
x = PIXI.game.state.states.Boot._gameData.boots
for (i in x) {
PIXI.game.prodigy.player.backpack.data.boots[i] = {"ID": x[i].ID, "N": 1}
}

//All hats
PIXI.game.prodigy.player.backpack.data.hat=[]
x = PIXI.game.state.states.Boot._gameData.hat
for (i in x) {
PIXI.game.prodigy.player.backpack.data.hat[i] = {"ID": x[i].ID, "N": 1}
}

//Trails Master set
function TrialmastersGear() {
PIXI.game.prodigy.player.backpack.data.hat.push({"N":999999,"ID":23});
PIXI.game.prodigy.player.backpack.data.outfit.push({"N":999999,"ID":24});
PIXI.game.prodigy.player.backpack.data.boots.push({"N":999999,"ID":18});
PIXI.game.prodigy.player.backpack.data.weapon.push({"N":1,"ID":47});
}                                                

TrialmastersGear();

//W124RD_Nickname
function W124RD_Nickname() {
PIXI.game.prodigy.player.appearance._name.nickname=7;
}

W124RD_Nickname();

//Free membership
function membership() {
PIXI.game.prodigy.player.tt=true;
}

membership();

//Level 100
function level100() {
PIXI.game.prodigy.player.data.level=100;
}

level100();

// Instantly kills the Titan.
PIXI.game.prodigy.titansNetworkHandler.hitTitan(Infinity)

//Lets you skip the tutorial (Make sure to give yourself a name first)
PIXI.game.prodigy.debugQuests.completeTutorial()

// Allows your player to level with the addStars function
PIXI.game.prodigy.player.addStars()

// Use this right after you get into the Dark Tower! (Be the god of the dark tower)
PIXI.game.prodigy.debugMisc.tpTowerFloor(100) 
PIXI.game.prodigy.player.modifiers.damage=10000000; // 10000000x Damage
PIXI.game.prodigy.player.modifiers.maxHearts=100000000; // 100000000x HP
PIXI.game.prodigy.player.heal(9999999999999999999999999999999999999999999999)
})();