// ==UserScript==
// @name         Diep Tool S
// @name:en      Diep Tool S
// @description  I put the coordinates in the minimap xD
// @description:en I put the coordinates in the minimap xD
// @version      1.0.0
// @author       mememe
// @match        https://diep.io/*
// @require      https://greasyfork.org/scripts/433681-diepapi/code/diepAPI.js?version=1041213
// @grant        none
// @namespace https://greasyfork.org/users/914545
// @downloadURL https://update.greasyfork.org/scripts/445003/Diep%20Tool%20S.user.js
// @updateURL https://update.greasyfork.org/scripts/445003/Diep%20Tool%20S.meta.js
// ==/UserScript==

'use strict';
const { Vector } = window.diepAPI.core;
const { scaling, player, game, minimap } = window.diepAPI.apis;

const { backgroundOverlay } = window.diepAPI.tools;
const ctx = backgroundOverlay.ctx;

// Bases (width = 67 * 50)
const blue_base = new Vector(-11150 + 1675, -11150 + 1675);
const purple_base = new Vector(11150 - 1675, -11150 + 1675);
const green_base = new Vector(-11150 + 1675, 11150 - 1675);
const red_base = new Vector(11150 - 1675, 11150 - 1675);

// Base Drones
const danger_radius = new Vector(5250, 0);
const attack_radius = new Vector(3800, 0);
const locationContainer = document.createElement("div");
locationContainer.style = "pointer-events: none; position: fixed; top:10px; left:10px; font-family: Ubuntu; color: #FFFFFF; font-size: 30px;";
document.body.appendChild(locationContainer);

(() => {
    "use strict";
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    class Arrow {
        constructor() {
            this.values = [
                "IzAwMDAwMA==",
                "MA==",
                "MC4zNQ==",
                "TGVhZGVy",
                "cmVk"
            ];
            this.context = CanvasRenderingContext2D.prototype;
            this.FindArrow();
        }
        Hook(target, callback) {
            this.context[target] = new Proxy(this.context[target], {
                apply(type, _this, args) {
                    callback(_this, args);
                    return type.apply(_this, args);
                },
            });
        }
        FindArrow() {
            this.Hook("moveTo", (_this, args) => {
                if (_this.fillStyle == atob(this.values[0]) && _this.globalAlpha == atob(this.values[1])) {
                    _this.globalAlpha = atob(this.values[2]);
                    _this.fillStyle = atob(this.values[4]);
                }
            });
            this.Hook("drawImage", (_this, args) => {
                if (_this.globalAlpha == atob(this.values[1])) {
                    _this.globalAlpha = atob(this.values[2]);
                }
            });
        }
    }

    new Arrow();

    setInterval(() => {
        if (document.getElementById("loading").innerText == "") {
            setTimeout(() => {
                let g = [ "(" + player.position["x"] + "," + player.position["y"] + ")"]
                locationContainer.innerHTML = `<p>${g[0]}</p>`;
            }, 100);
        }
    });
})();

function drawZones() {
    ctx.save();

    ctx.globalAlpha = 0.08;

    if (player.gamemode === '4teams') {
        let center;
        const radius1 = scaling.toCanvasUnits(danger_radius).x;
        const radius2 = scaling.toCanvasUnits(attack_radius).x;

        //blue
        center = scaling.toCanvasPos(blue_base);
        ctx.fillStyle = '#006480';
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ff6480';
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius2, 0, 2 * Math.PI);
        ctx.fill();

        //purple
        center = scaling.toCanvasPos(purple_base);
        ctx.fillStyle = '#644280';
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ff4280';
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius2, 0, 2 * Math.PI);
        ctx.fill();

        //green
        center = scaling.toCanvasPos(green_base);
        ctx.fillStyle = '#00803e';
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ff803e';
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius2, 0, 2 * Math.PI);
        ctx.fill();

        //red
        center = scaling.toCanvasPos(red_base);
        ctx.fillStyle = '#963033';
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius1, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = '#ff3033';
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius2, 0, 2 * Math.PI);
        ctx.fill();

        const canvas = document.getElementById("canvas");
        let minictx = canvas.getContext("2d");

        let mmsizecut_x =  minimap.minimapDim["x"] / 5
        let mmsizecut_y = minimap.minimapDim["y"] /5

        minictx.textBaseline = 'center';
        minictx.textAlign = 'center';

        minictx.beginPath();
        minictx.fillStyle = "#000000";
        // A1
        minictx.rect(minimap.minimapPos["x"], minimap.minimapPos["y"], mmsizecut_x , mmsizecut_y);
        minictx.fillText("A1", minimap.minimapPos["x"] + mmsizecut_x / 2, minimap.minimapPos["y"] + mmsizecut_y / 2);
        // A2
        minictx.rect(minimap.minimapPos["x"] + mmsizecut_x, minimap.minimapPos["y"], mmsizecut_x , mmsizecut_y);
        minictx.fillText("A2", minimap.minimapPos["x"] + mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + mmsizecut_y / 2);
        // A3
        minictx.rect(minimap.minimapPos["x"] + 2 * mmsizecut_x, minimap.minimapPos["y"], mmsizecut_x , mmsizecut_y);
        minictx.fillText("A3", minimap.minimapPos["x"] +  2 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + mmsizecut_y / 2);
        // A4
        minictx.rect(minimap.minimapPos["x"] + 3 * mmsizecut_x, minimap.minimapPos["y"], mmsizecut_x , mmsizecut_y);
        minictx.fillText("A4", minimap.minimapPos["x"] +  3 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + mmsizecut_y / 2);
        // A5
        minictx.rect(minimap.minimapPos["x"] + 4 * mmsizecut_x, minimap.minimapPos["y"], mmsizecut_x , mmsizecut_y);
        minictx.fillText("A5", minimap.minimapPos["x"] +  4 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + mmsizecut_y / 2);

        // B1
        minictx.rect(minimap.minimapPos["x"], minimap.minimapPos["y"] + mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("B1", minimap.minimapPos["x"] + mmsizecut_x / 2, minimap.minimapPos["y"] + mmsizecut_y + mmsizecut_y / 2);
        // B2
        minictx.rect(minimap.minimapPos["x"] + mmsizecut_x, minimap.minimapPos["y"] + mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("B2", minimap.minimapPos["x"] + mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + mmsizecut_y + mmsizecut_y / 2);
        // B3
        minictx.rect(minimap.minimapPos["x"] + 2 * mmsizecut_x, minimap.minimapPos["y"] + mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("B3", minimap.minimapPos["x"] + 2 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + mmsizecut_y + mmsizecut_y / 2);
        // B4
        minictx.rect(minimap.minimapPos["x"] + 3 * mmsizecut_x, minimap.minimapPos["y"] + mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("B4", minimap.minimapPos["x"] + 3 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + mmsizecut_y + mmsizecut_y / 2);
        // B5
        minictx.rect(minimap.minimapPos["x"] + 4 * mmsizecut_x, minimap.minimapPos["y"] + mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("B5", minimap.minimapPos["x"] +4 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + mmsizecut_y + mmsizecut_y / 2);

        // C1
        minictx.rect(minimap.minimapPos["x"], minimap.minimapPos["y"] + 2 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("C1", minimap.minimapPos["x"] + mmsizecut_x / 2, minimap.minimapPos["y"] + 2 * mmsizecut_y + mmsizecut_y / 2);
        // C2
        minictx.rect(minimap.minimapPos["x"] + mmsizecut_x, minimap.minimapPos["y"]  + 2 *mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("C2", minimap.minimapPos["x"] + mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + 2 * mmsizecut_y + mmsizecut_y / 2);
        // C3
        minictx.rect(minimap.minimapPos["x"] + 2 * mmsizecut_x, minimap.minimapPos["y"]  + 2 *mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("C3", minimap.minimapPos["x"] + 2 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + 2 * mmsizecut_y + mmsizecut_y / 2);
        // C4
        minictx.rect(minimap.minimapPos["x"] + 3 * mmsizecut_x, minimap.minimapPos["y"]  + 2 *mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("C4", minimap.minimapPos["x"] + 3 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + 2 * mmsizecut_y + mmsizecut_y / 2);
        // C5
        minictx.rect(minimap.minimapPos["x"] + 4 * mmsizecut_x, minimap.minimapPos["y"]  + 2 *mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("C5", minimap.minimapPos["x"] + 4 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + 2 * mmsizecut_y + mmsizecut_y / 2);

        // D1
        minictx.rect(minimap.minimapPos["x"], minimap.minimapPos["y"] + 3 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("D1", minimap.minimapPos["x"] + mmsizecut_x / 2, minimap.minimapPos["y"] + 3 * mmsizecut_y + mmsizecut_y / 2);
        // D2
        minictx.rect(minimap.minimapPos["x"] + mmsizecut_x, minimap.minimapPos["y"] + 3 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("D2", minimap.minimapPos["x"] + mmsizecut_x +  mmsizecut_x / 2, minimap.minimapPos["y"] + 3 * mmsizecut_y + mmsizecut_y / 2);
        // D3
        minictx.rect(minimap.minimapPos["x"] + 2 * mmsizecut_x, minimap.minimapPos["y"] + 3 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("D3", minimap.minimapPos["x"] + 2 * mmsizecut_x +  mmsizecut_x / 2, minimap.minimapPos["y"] + 3 * mmsizecut_y + mmsizecut_y / 2);
        // D4
        minictx.rect(minimap.minimapPos["x"] + 3 * mmsizecut_x, minimap.minimapPos["y"] + 3 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("D4", minimap.minimapPos["x"] + 3 * mmsizecut_x +  mmsizecut_x / 2, minimap.minimapPos["y"] + 3 * mmsizecut_y + mmsizecut_y / 2);
        // D5
        minictx.rect(minimap.minimapPos["x"] + 4 * mmsizecut_x, minimap.minimapPos["y"] + 3 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("D5", minimap.minimapPos["x"] + 4 * mmsizecut_x +  mmsizecut_x / 2, minimap.minimapPos["y"] + 3 * mmsizecut_y + mmsizecut_y / 2);

        // E1
        minictx.rect(minimap.minimapPos["x"], minimap.minimapPos["y"] + 4 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("E1", minimap.minimapPos["x"] + mmsizecut_x / 2, minimap.minimapPos["y"] + 4 * mmsizecut_y + mmsizecut_y / 2);
        // E2
        minictx.rect(minimap.minimapPos["x"] + mmsizecut_x, minimap.minimapPos["y"] + 4 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("E2", minimap.minimapPos["x"] + mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + 4 * mmsizecut_y + mmsizecut_y / 2);
        // E3
        minictx.rect(minimap.minimapPos["x"] + 2 * mmsizecut_x, minimap.minimapPos["y"]  + 4 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("E3", minimap.minimapPos["x"] + 2 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + 4 * mmsizecut_y + mmsizecut_y / 2);
        // E4
        minictx.rect(minimap.minimapPos["x"] + 3 * mmsizecut_x, minimap.minimapPos["y"]  + 4 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("E4", minimap.minimapPos["x"] + 3 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + 4 * mmsizecut_y + mmsizecut_y / 2);
        // E5
        minictx.rect(minimap.minimapPos["x"] + 4 * mmsizecut_x, minimap.minimapPos["y"]  + 4 * mmsizecut_y, mmsizecut_x , mmsizecut_y);
        minictx.fillText("E5", minimap.minimapPos["x"] + 4 * mmsizecut_x + mmsizecut_x / 2, minimap.minimapPos["y"] + 4 * mmsizecut_y + mmsizecut_y / 2);
        minictx.stroke() ;

    } else if (player.gamemode === 'teams') {
        let coords1;
        let coords2;

        //blue
        coords1 = scaling.toCanvasPos(new Vector(-11150, -11150));
        coords2 = scaling.toCanvasPos(new Vector(-11150 + 5500, 11150));
        ctx.fillStyle = '#006480';
        ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);
        coords2 = scaling.toCanvasPos(new Vector(-11150 + 4150, 11150));
        ctx.fillStyle = '#ff6480';
        ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

        //red
        coords1 = scaling.toCanvasPos(new Vector(11150, -11150));
        coords2 = scaling.toCanvasPos(new Vector(11150 - 5500, 11150));
        ctx.fillStyle = '#963033';
        ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);
        coords2 = scaling.toCanvasPos(new Vector(11150 - 4150, 11150));
        ctx.fillStyle = '#ff3033';
        ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);
    }
    //pentagon nest
    let coords1;
    let coords2;

    coords1 = scaling.toCanvasPos(new Vector(-1115, -1115));
    coords2 = scaling.toCanvasPos(new Vector(1115, 1115));
    ctx.fillStyle = '#8aff69';
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    ctx.restore();
}

game.once('ready', () => {
    game.on('frame', () => {
        drawZones();
    });
});