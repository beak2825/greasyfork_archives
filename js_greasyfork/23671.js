// ==UserScript==
// @name         Auto respawn, No kick
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto spawner
// @author       meatman2tasty
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23671/Auto%20respawn%2C%20No%20kick.user.js
// @updateURL https://update.greasyfork.org/scripts/23671/Auto%20respawn%2C%20No%20kick.meta.js
// ==/UserScript==

function respawn() {
    setTimeout(respawn, 50);
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