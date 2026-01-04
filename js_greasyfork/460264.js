// ==UserScript==
// @name         AWBW Pixel Pefector
// @namespace    https://awbw.amarriner.com/
// @version      1.5
// @description  Forces all game sprites to look cleaner and nicer and cuter
// @author       twiggy_
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @match        https://awbw.amarriner.com/*?moveplanner*
// @match        https://awbw.amarriner.com/*prevmaps*
// @match        https://awbw.amarriner.com/*editmap*
// @match        https://awbw.amarriner.com/*yourgames*
// @match        https://awbw.amarriner.com/*yourturn*
// @match        https://awbw.amarriner.com/*design*
// @match        https://awbw.amarriner.com/*profile*
// @match        https://awbw.amarriner.com/*
// @icon         https://awbw.amarriner.com/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460264/AWBW%20Pixel%20Pefector.user.js
// @updateURL https://update.greasyfork.org/scripts/460264/AWBW%20Pixel%20Pefector.meta.js
// ==/UserScript==


let pixelPerfect = {
    'image-rendering': 'pixelated',
};

if (document.getElementById('main') !== null)
{
    Object.assign(document.getElementById('main').style, pixelPerfect);
}


// Game Map, and the root obj
if (document.getElementById('gamemap') !== null)
{
    Object.assign(document.getElementById('gamemap').style, pixelPerfect);
}

// Controls UI
if (document.getElementById('map-controls-container') !== null)
{
    Object.assign(document.getElementById('map-controls-container').style, pixelPerfect);
}

// DMG Calc
if (document.getElementById('calculator') !== null)
{
    Object.assign(document.getElementById('calculator').style, pixelPerfect);
}

// Weather canvas
if (document.getElementById('weather-canvas') !== null)
{
    Object.assign(document.getElementById('weather-canvas'), pixelPerfect);
}

// Tile info window
let tileInfoWindow = document.getElementsByClassName('tile-info');
Array.prototype.forEach.call(tileInfoWindow, function(win) {
    win.style.imageRendering = 'pixelated';
});

// Player CO containers
let playerContainers = document.getElementsByClassName('player-overview-container');
Array.prototype.forEach.call(playerContainers, function(container) {
    container.style.imageRendering = 'pixelated';
});

// Event screen COs
let eventCOs = document.getElementsByClassName('event-cos');
Array.prototype.forEach.call(eventCOs, function(co) {
    co.style.imageRendering = 'pixelated';
});