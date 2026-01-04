// ==UserScript==
// @name         Teleport Script to  Player
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try pressing Control + O to open Teleport Menu. Working on Http and Https
// @author       DragonFrostIce, Togekiss(or just King Tortle)
// @match        *://manyland.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manyland.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462141/Teleport%20Script%20to%20%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/462141/Teleport%20Script%20to%20%20Player.meta.js
// ==/UserScript==

async function main() {
    await $.getScript("https://cdn.jsdelivr.net/gh/parseml/many-deobf@latest/deobf.js");

    ig.game.alertDialog.open(`
    <style>
    body {
        margin-top: 0px;
    }
    </style>
    <b>Manyland Documentation Example</b>
    <p class="miftThankYouMessage">Enter a player's name to teleport to: </p>
    <input type="text" id="pName"></input>
    `,
    true,
    () => {
        playerName = document.getElementById("pName").value
        updatePlayers();
        let player = ig.game.players.filter(p => p.screenName == playerName);
        ig.game.player.pos = player[0].pos;
    },
    "Tele", null, null, null, null, null, null, null, true);
}
setInterval(()=>{if(ig.input.state("ctrl")&&ig.input.state("o")&&!ig.game.alertDialog.isOpen){main()}}, 0)