// ==UserScript==
// @name         Drillz.io Invincibility
// @namespace    -
// @version      1
// @description  Places you at random point on map and heals when health is low
// @author       Jared Bledsoe
// @match        *://drillz.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34787/Drillzio%20Invincibility.user.js
// @updateURL https://update.greasyfork.org/scripts/34787/Drillzio%20Invincibility.meta.js
// ==/UserScript==

setInterval(function() {
	if(Game.players[ME].health<25) {
		socket.emit("nk","me");
    }
},50);

