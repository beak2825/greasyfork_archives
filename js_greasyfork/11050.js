// ==UserScript==
// @name         Club Penguin blue rectangle fix
// @namespace    http://fan-club-penguin.cz/
// @version      0.3
// @description  Fixes blue rectangles on Club Penguin and also makes it a little faster on some computers
// @author       Lisured
// @run-at       document-start
// @match        http://play.clubpenguin.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11050/Club%20Penguin%20blue%20rectangle%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/11050/Club%20Penguin%20blue%20rectangle%20fix.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function(event) {
	var rgb = window.getComputedStyle(document.body)['background-color'].match(/\d+/g);
	var hex = '#' + parseInt(rgb[0]).toString(16) + parseInt(rgb[1]).toString(16) + parseInt(rgb[2]).toString(16);

	var newRenderFunction = CP.FlashClient.prototype.render.toString().replace('"transparent"', '"direct", "bgcolor": "' + hex + '"');
	CP.FlashClient.prototype.render = new Function(newRenderFunction.substring(newRenderFunction.indexOf('{')+1,newRenderFunction.lastIndexOf('}')));
});

