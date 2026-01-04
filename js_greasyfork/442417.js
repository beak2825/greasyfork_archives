// ==UserScript==
// @name         Map Marker
// @namespace    http://tampermonkey.net/
// @version      1
// @description  For DatOneDuck & HIT
// @author       Havy
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442417/Map%20Marker.user.js
// @updateURL https://update.greasyfork.org/scripts/442417/Map%20Marker.meta.js
// ==/UserScript==

game.network.addRpcHandler('ReceiveChatMessage', function(e) {
    if(e.uid == game.ui.playerTick.uid) {
        if(e.message == "!marker") {
            var map = document.getElementById("hud-map");
            map.insertAdjacentHTML("beforeend", `<div style="color: red; display: block; left: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.left)}%; top: ${parseInt(game.ui.components.Map.playerElems[game.world.getMyUid()].marker.style.top)}%; position: absolute;" class='hud-map-player'></div>`)
            game.ui.components.PopupOverlay.showHint(`Added Marker`);
        };
    };
});