// ==UserScript==
// @name         Enemy Radar
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  see your enemies in red
// @author       dabby
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25350/Enemy%20Radar.user.js
// @updateURL https://update.greasyfork.org/scripts/25350/Enemy%20Radar.meta.js
// ==/UserScript==
/* jshint expr: true */

$(document).ready(function() {
    window.drawMiniMap = function() {
        mapCanvas.width = mapCanvas.width, mapContext.globalAlpha = 1;
        for (var a = 0; a < gameObjects.length; ++a)
            "player" == gameObjects[a].type &&
                gameObjects[a].onScreen &&
                (gameObjects[a].index == player.index ||
                 gameObjects[a].team !== player.team ||
                 gameObjects[a].team == player.team ||
                 gameObjects[a].isBoss) &&
                (mapContext.fillStyle = gameObjects[a].index == player.index ? "#fff" : gameObjects[a].isBoss ? "#db4fcd" : gameObjects[a].team !== player.team ? "#d20d12" : "#5151d9",
                 mapContext.beginPath(),
                 mapContext.arc(gameObjects[a].x / gameWidth * mapScale, gameObjects[a].y / gameHeight * mapScale, pingScale, 0, 2 * mathPI, !0),
                 mapContext.closePath(),
                 mapContext.fill());
        if (null !== gameMap) {
            for (mapContext.globalAlpha = 1, a = 0; a < gameMap.pickups.length; ++a)
                gameMap.pickups[a].active &&
                    ("lootcrate" == gameMap.pickups[a].type ? mapContext.fillStyle = "#ffd100" : "healthpack" == gameMap.pickups[a].type &&
                     (mapContext.fillStyle = "#5ed951"),
                     mapContext.beginPath(),
                     mapContext.arc(gameMap.pickups[a].x / gameWidth * mapScale, gameMap.pickups[a].y / gameHeight * mapScale, pingScale, 0, 2 * mathPI, !0),
                     mapContext.closePath(),
                     mapContext.fill());
            mapContext.globalAlpha = 1.0,
                a = getCachedMiniMap(),
                null !== a &&
                mapContext.drawImage(a, 0, 0, mapScale, mapScale),
                delete a;
        }
    };
});