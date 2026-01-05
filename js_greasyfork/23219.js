// ==UserScript==
// @name         Enemy Radar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  see your enemies in red, credits to HighNoon643
// @author       dabby
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23219/Enemy%20Radar.user.js
// @updateURL https://update.greasyfork.org/scripts/23219/Enemy%20Radar.meta.js
// ==/UserScript==
/* jshint expr: true */
function drawMiniMap2() {
    mapCanvas.width = mapCanvas.width;
    mapContext.globalAlpha = 1;
    for (var a = 0; a < gameObjects.length; ++a) "player" == gameObjects[a].type && gameObjects[a].onScreen && (gameObjects[a].index == player.index || gameObjects[a].team !== player.team || gameObjects[a].isBoss) && (mapContext.fillStyle = gameObjects[a].index == player.index ? "#fff" : gameObjects[a].isBoss ? "#db4fcd" : "#d20d12", mapContext.beginPath(), mapContext.arc(gameObjects[a].x / gameWidth * mapScale, gameObjects[a].y / gameHeight * mapScale, pingScale, 0, 2 * mathPI, !0), mapContext.closePath(), mapContext.fill());
}
setInterval(drawMiniMap2, 1);