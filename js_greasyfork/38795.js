// ==UserScript==
// @name         [GO]ITALIA 
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  ANTI KICK PORRA.
// @author       IMPERATOR/ITALIA
// @match        http://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38795/%5BGO%5DITALIA.user.js
// @updateURL https://update.greasyfork.org/scripts/38795/%5BGO%5DITALIA.meta.js
// ==/UserScript==

setInterval(updatePlayer,90000);
function updatePlayer(){
    socket.emit("2",0,0);
    socket.emit("2",Math.round(camX),Math.round(camY));
}