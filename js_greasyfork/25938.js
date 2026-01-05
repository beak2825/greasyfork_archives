// ==UserScript==
// @name         Pro boosting vertix script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto spawner
// @author       meatman2tasty
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25938/Pro%20boosting%20vertix%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/25938/Pro%20boosting%20vertix%20script.meta.js
// ==/UserScript==

function respawn() {
    setTimeout(respawn, 1);
    if (player.dead && !inMainMenu) {
         startGame('player');
    hideMenuUI();
    hideUI(true);
    document.getElementById('startMenuWrapper').style.display = 'none';
    }
}
respawn();

function noKick() {
    shootBullet(player);
    setTimeout(noKick, 5000);
}
noKick();