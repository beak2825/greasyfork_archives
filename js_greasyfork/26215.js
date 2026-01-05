// ==UserScript==
// @name         Enhanced Map+View
// @namespace    http://vertix.io/
// @version      1.5
// @description  Increases Size and view of map
// @author       Meatman2tasty
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26215/Enhanced%20Map%2BView.user.js
// @updateURL https://update.greasyfork.org/scripts/26215/Enhanced%20Map%2BView.meta.js
// ==/UserScript==

$("#map").css("width","400px");
$("#map").css("height","400px");


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
        if (null != gameMap) {
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
                null != a &&
                mapContext.drawImage(a, 0, 0, mapScale, mapScale),
                delete a
        }
    }
});