// ==UserScript==
// @name         Bonk.io - Picky
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Select a random or nth map in your map selector with a simple shortcut.
// @author       danik0011
// @match        https://*.bonk.io/*
// @match        https://*.bonkisback.io/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542647/Bonkio%20-%20Picky.user.js
// @updateURL https://update.greasyfork.org/scripts/542647/Bonkio%20-%20Picky.meta.js
// ==/UserScript==

document.addEventListener('keydown',e=>{
    if(document.getElementById('ingamechatinputtext')===document.activeElement
    || document.getElementById('newbonklobby_chat_input')===document.activeElement) return; // not run while in chat
    if(e.repeat || !e.altKey) return; // not be loud if holding and not run if alt isnt held

    const maps = document.querySelectorAll('.maploadwindowmapdiv'); // get an array of all "map" boxes
    if(!maps.length) return;
    let map;

    if(e.code.startsWith('Digit')) map = maps[(Number(e.code.slice(5))+9)%10]; // pick nth map, where 1 = 1st, 9 = 9th, 0 = 10th
    if(e.code == 'ShiftRight') map = maps[Math.floor(Math.random()*maps.length)]; // pick random map

    const button = map.querySelector('.maploadwindowtextmode_picks, .maploadwindowtextmode');
     // additional compat with sal's hostmod - changes mode to the one suggested in map

    if(button) { button.click(); return }
    if(map) map.click();
})