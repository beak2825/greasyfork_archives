// ==UserScript==
// @name         creed auto battle
// @namespace    Devinho_
// @version      2024-02-2111
// @description  https://www.youtube.com/@wdevinho_
// @author       Devinho_
// @license      MIT
// @match        https://eclipserpg.com/battle.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pokemoncreed.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488194/creed%20auto%20battle.user.js
// @updateURL https://update.greasyfork.org/scripts/488194/creed%20auto%20battle.meta.js
// ==/UserScript==

var _INTERVAL = 1000;
var battleTimes = 0;

setInterval(() => {
    var selectAttack = $('input[value="Aqua Tail"]');
    if (!selectAttack.length) return;
    selectAttack.click();
    battleTimes += 1;

    if (battleTimes === 2) {
        console.log("battle times", battleTimes);
        var restartBattle = $('button.button:contains("Restart")');
        if (!restartBattle.length) return;
        restartBattle.click();
        battleTimes = 0;
    }
}, _INTERVAL);
