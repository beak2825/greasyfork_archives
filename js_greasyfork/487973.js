// ==UserScript==
// @name         creed auto battle
// @namespace    Devinho_
// @version      2024-02-211
// @description  https://www.youtube.com/@wdevinho_
// @author       Devinho_
// @license MIT
// @match        https://eclipserpg.com/battle.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokemoncreed.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487973/creed%20auto%20battle.user.js
// @updateURL https://update.greasyfork.org/scripts/487973/creed%20auto%20battle.meta.js
// ==/UserScript==

var _INTERVAL = 1000;
var battleTimes = 0;
// CHANGE TO input[value="Bolt Strike"]
//RESTART BATTLE
setInterval(()=>{
    var selectAttack = $('table.battlefast form input[value="Bolt Strike"]');
    if (!selectAttack) return;
    selectAttack.click()
    battleTimes += 1;

    if(battleTimes === 2) {
        console.log("battle times", battleTimes);
        var restartBattle = $('table.battlefast td.bord button.button');
        if (!restartBattle) return;
        restartBattle.click();
        battleTimes = 0;
    }

}, _INTERVAL);