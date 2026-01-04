// ==UserScript==
// @name         AWBW Power Nerf
// @namespace    https://greasyfork.org/en/users/1062240
// @version      1.0
// @description  Hides the power buttons and bars! Defeat your opponents on Day-to-Day abilities alone!
// @author       Vincent ～ VIH
// @match        https://awbw.amarriner.com/game.php?*
// @icon         https://cdn.discordapp.com/emojis/1131387035479965817.webp
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511828/AWBW%20Power%20Nerf.user.js
// @updateURL https://update.greasyfork.org/scripts/511828/AWBW%20Power%20Nerf.meta.js
// ==/UserScript==

let playerOverviewBarContainers = document.getElementsByClassName('player-overview-bar');
Array.prototype.forEach.call(playerOverviewBarContainers, function(container) {
    container.style.display = 'none';
});