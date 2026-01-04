// ==UserScript==
// @name         </> Kurt & Java Kaynak Algılayıcı
// @namespace    http://tampermonkey.net/
// @version      15.1
// @description  Mağaza Üstün de Gözükür
// @author       Kurt
// @match        zombs.io
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424139/%3C%3E%20Kurt%20%20Java%20Kaynak%20Alg%C4%B1lay%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/424139/%3C%3E%20Kurt%20%20Java%20Kaynak%20Alg%C4%B1lay%C4%B1c%C4%B1.meta.js
// ==/UserScript==

// Tokens Eklenicek Bilginize
(function() {
    'use strict';
})();

window.loadedIDS = function(){
   var returns = []
    Object.entries(Game.currentGame.world.entities).forEach((stuff => {
    if(stuff[1].targetTick.entityClass == "PlayerEntity" && stuff[1].targetTick.name !== Game.currentGame.world.entities[Game.currentGame.world.getMyUid()].targetTick.name){
        returns.push(stuff[1].targetTick.name +
                     " - Odun: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.wood +
                     ", Taş: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.stone +
                     ", Altın: " + Game.currentGame.world.entities[stuff[1].targetTick.uid].targetTick.gold)
    }
}))
    return returns;
}
var i = setInterval(function(){
    document.querySelector('.hud-menu-icon').innerText = JSON.stringify(window.loadedIDS())
}, 100)