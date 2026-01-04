// ==UserScript==
// @name         喵国建设者  Kittens Game Cheat
// @version      1.0
// @description  猫国建设者,已解锁的资源 999999999/2s
// @author       Nio
// @include     *bloodrizer.ru/games/kittens/*
// @include     *kittensgame.com/*
// @match       *likexia.gitee.io/*
// @grant        none
// @namespace https://greasyfork.org/users/826997
// @downloadURL https://update.greasyfork.org/scripts/434179/%E5%96%B5%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%20%20Kittens%20Game%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/434179/%E5%96%B5%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%20%20Kittens%20Game%20Cheat.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var i=0;

function AddValue ()
{
    if((game.resPool.resources.length)>=0){
        for(i=0;i<game.resPool.resources.length;i++){
             if (game.resPool.resources[i].unlocked === true) {
                 game.resPool.resources[i].value += 999999999
             }
//            game.resPool.resources[i].value += 9999999999999999999999999999999999999999999999999999999999999999999
        }
    }
//    game.resPool.resourceMap.titanium.value += 99999999999999999999999
}

setInterval(AddValue,2000);

})()