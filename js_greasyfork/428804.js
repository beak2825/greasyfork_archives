// ==UserScript==
// @name         popcat.click hekk
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ok so this is popcat.click hekk yea
// @author       ParkusDaking
// @match        https://popcat.click/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428804/popcatclick%20hekk.user.js
// @updateURL https://update.greasyfork.org/scripts/428804/popcatclick%20hekk.meta.js
// ==/UserScript==

var event = new KeyboardEvent('keydown', {
	key: 'g',
	ctrlKey: true
});

setInterval(function(){
	for (var a = 0; a < 100; a++) {
		document.dispatchEvent(event);
	}
}, 0);