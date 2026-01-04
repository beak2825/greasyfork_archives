// ==UserScript==
// @name         Anti kick by [TW]精不 do bloble.io
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  ANTI KICK PORRA.
// @author       [TW]精不
// @match        http://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36518/Anti%20kick%20by%20%5BTW%5D%E7%B2%BE%E4%B8%8D%20do%20blobleio.user.js
// @updateURL https://update.greasyfork.org/scripts/36518/Anti%20kick%20by%20%5BTW%5D%E7%B2%BE%E4%B8%8D%20do%20blobleio.meta.js
// ==/UserScript==

setInterval(updatePlayer,90000);
function updatePlayer(){
    socket.emit("2",0,0);
    socket.emit("2",Math.round(camX),Math.round(camY));
}