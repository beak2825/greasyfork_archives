// ==UserScript==
// @name         Auto Server Creator FFA/8 Players/No pass. Press "\" to start server, and press "=" to join.
// @namespace    meatman2tasty
// @version      0.2
// @description  Press "\" to start server, and press "=" to join
// @author       meatman2tasty
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26207/Auto%20Server%20Creator%20FFA8%20PlayersNo%20pass%20Press%20%22%5C%22%20to%20start%20server%2C%20and%20press%20%22%3D%22%20to%20join.user.js
// @updateURL https://update.greasyfork.org/scripts/26207/Auto%20Server%20Creator%20FFA8%20PlayersNo%20pass%20Press%20%22%5C%22%20to%20start%20server%2C%20and%20press%20%22%3D%22%20to%20join.meta.js
// ==/UserScript==


document.addEventListener("keydown", function(a) {
    if (a.keyCode == 220) {
socket.emit("cSrv",{srvPlayers:8,srvHealthMult:1,srvSpeedMult:1,srvPass:"",srvModes:"2"});
    }
}, false);

document.addEventListener("keydown", function(a) { // Press '=' to respawn
    if (a.keyCode == 187) {
startGame("player");
socket.emit("respawn");
    }
}, false);