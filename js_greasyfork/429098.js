// ==UserScript==
// @name        Server Crasher
// @namespace   zombs.io
// @match       http://zombs.io/
// @grant       none
// @version     1.0
// @author      -
// @description https://www.youtube.com/watch?v=dQw4w9WgXcQ
// @downloadURL https://update.greasyfork.org/scripts/429098/Server%20Crasher.user.js
// @updateURL https://update.greasyfork.org/scripts/429098/Server%20Crasher.meta.js
// ==/UserScript==

document.querySelector("#hud-menu-settings > div").innerHTML = `
<div style="text-align: center; overflow: auto">
    <button type="button" id="serverCrasher" class="btn btn-red" style="width: 90%">Crash server</button>
</div>
`;

document.querySelector("#serverCrasher").onclick = () => {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to crash the server?", 1e4, function() {
        game.ui.onServerShuttingDown();
        game.ui.components.PopupOverlay.showHint("Crashing server");
        window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
    })
}