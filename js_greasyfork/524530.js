// ==UserScript==
// @name         connecting screen skipper
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  connects you to a server, after you change gamemode or region (takes some time)
// @author       r!PsAw
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524530/connecting%20screen%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/524530/connecting%20screen%20skipper.meta.js
// ==/UserScript==

function clear(obj, funcName) {
    obj[funcName] = () => {};
}

function start(){
    //clear(extern, 'showMenu'); //soft lock game after death
    //clear(extern, 'setScreenSizeZoom'); //stop scaling entirely
    //clear(extern, 'connectLobby'); //soft lock game immediatly
    clear(extern, 'disconnect_game'); //required for the script to work
    clear(extern, 'setGamemode'); //skipping connection screen after switching gamemode
    clear(extern, 'setRegion'); //skipping connection screen after switching region
}

function init(){
    (window.lobby_ip)?start():setTimeout(init, 100);
}
init();