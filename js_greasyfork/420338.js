// ==UserScript==
// @name         Zombs.io resource detector
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Open settings and see all the resources of whoever you are next to.
// @author       You
// @match        *://zombs.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420338/Zombsio%20resource%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/420338/Zombsio%20resource%20detector.meta.js
// ==/UserScript==
window.loadedIDS = function(){
   var returns = []
    Object.entries(Game.currentGame.world.entities).forEach((stuff => {
    if(stuff[1].targetTick.entityClass == "PlayerEntity" && stuff[1].targetTick.name !== Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.name){
        returns.push(stuff[1].targetTick.name + " - Wood: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.wood + ", Stone: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.stone + ", Gold: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.gold)
    }
}))
    return returns;
}
 
var i = setInterval(function(){
    document.querySelector('.hud-settings-grid').innerText = JSON.stringify(window.loadedIDS())
}, 100)