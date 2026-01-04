// ==UserScript==
// @name         Base Zones
// @description  made with much love
// @version      0.0.11
// @author       Cazka#1820
// @match        *://diep.io/*
// @grant        none
// @require      https://greasyfork.org/scripts/433681-diepapi/code/diepAPI.js?version=1683698
// @namespace    https://greasyfork.org/users/541070
// @downloadURL https://update.greasyfork.org/scripts/433682/Base%20Zones.user.js
// @updateURL https://update.greasyfork.org/scripts/433682/Base%20Zones.meta.js
// ==/UserScript==
'use strict';
const { Vector } = window.diepAPI.core;
const { scaling, player, game } = window.diepAPI.apis;

const { backgroundOverlay } = window.diepAPI.tools;
const ctx = backgroundOverlay.ctx;

// Bases (width = 67 * 50)
const green_base = new Vector(-11150 + 1675, -11150 + 1675);
const red_base = new Vector(11150 - 1675, -11150 + 1675);
const purple_base = new Vector(-11150 + 1675, 11150 - 1675);
const blue_base = new Vector(11150 - 1675, 11150 - 1675);

// Base Drones
const danger_radius = new Vector(5250, 0);
const attack_radius = new Vector(3800, 0);

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