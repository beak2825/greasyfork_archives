// ==UserScript==
// @name         Gaver.io SelfFeed Macro W
// @namespace    http://xnel99x-hosting.tk/
// @version      0.1
// @description  Fast Feeding Macro for Gaver.io (SelfFeed Mode)
// @author       NEL99
// @match        *.gaver.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31356/Gaverio%20SelfFeed%20Macro%20W.user.js
// @updateURL https://update.greasyfork.org/scripts/31356/Gaverio%20SelfFeed%20Macro%20W.meta.js
// ==/UserScript==

var feedInterval = null;
var isEjecting = false;

window.onkeydown$ = window.onkeydown;
window.onkeyup$ = window.onkeyup;

window.onkeydown = function(e){
	if(e.key === 'w' && !isEjecting){
		isEjecting = true;
		feedInterval = setInterval(() => {
			window.webSocket.send(new Uint8Array([21]));
		}, 1);
	}
	window.onkeydown$(e);
};

window.onkeyup = function(e){
	if(e.key === 'w' && isEjecting){
		isEjecting = false;
		clearInterval(feedInterval);
		feedInterval = null;
	}
	window.onkeyup$(e);
};