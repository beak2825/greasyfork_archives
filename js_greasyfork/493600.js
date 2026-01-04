// ==UserScript==
// @name         Defense with Melee - Zombs.io
// @namespace    http://tampermonkey.net/
// @version      v0.5
// @description  This script provides an easier way to defend your base in Zombs.io by selling Melee Towers at night and placing them in the morning.
// @author       lasche (laschedev)
// @match        localhost
// @match        https://zombs.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493600/Defense%20with%20Melee%20-%20Zombsio.user.js
// @updateURL https://update.greasyfork.org/scripts/493600/Defense%20with%20Melee%20-%20Zombsio.meta.js
// ==/UserScript==

let savedMelees = [];
let meleeTrick = false;

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = `
<button class="btn btn-green" id="saveMelee">Save Melee's</button>
<button class="btn btn-green" id="meleeTrick">Enable Melee Trick!</button>
`;

document.getElementById('saveMelee').addEventListener('click', function() {
    savedMelees = Object.values(game.ui.buildings).filter(building => building.type === "MeleeTower");
});

document.getElementById('meleeTrick').addEventListener('click', function() {
    meleeTrick = !meleeTrick;
    this.innerText = meleeTrick ? "Disable Melee Trick!" : "Enable Melee Trick!";
    this.className = meleeTrick ? "btn btn-red" : "btn btn-green";
});

async function sellBuilding(uid) {
    game.network.sendPacket(9, { name: "DeleteBuilding", uid: uid || 1 });
    await new Promise(resolve => setTimeout(resolve, 200));
}

game.network.addPacketHandler(9, async data => {
    switch (data.name) {
        case "DayCycle":
            for (const melee of savedMelees) {
                const isThereMeleeTower = Object.values(game.ui.buildings).forEach(building => building.type == "MeleeTower" && building.x == melee.x && building.y == melee.y );
                if (!data.response.isDay) {
                    Object.values(game.ui.buildings).forEach(building => building.type == "MeleeTower" && building.x == melee.x && building.y == melee.y ? melee.uid = building.uid : 0 )
                    await sellBuilding(melee.uid);
                } else if (data.response.isDay && !isThereMeleeTower && meleeTrick) {
                    game.network.sendPacket(9, { name: 'MakeBuilding', x: melee.x, y: melee.y, type: "MeleeTower", yaw: 0});
                }
            }
            break;
    }
});
