// ==UserScript==
// @name         Prevent Picarto.tv chat clears
// @description  Prevent Picarto.tv chat clears by overwriting the function
// @version      0.1
// @author       sam9
// @match        http://picarto.tv/*
// @match        https://picarto.tv/*
// @grant        none
// @namespace https://greasyfork.org/users/92814
// @downloadURL https://update.greasyfork.org/scripts/26351/Prevent%20Picartotv%20chat%20clears.user.js
// @updateURL https://update.greasyfork.org/scripts/26351/Prevent%20Picartotv%20chat%20clears.meta.js
// ==/UserScript==
_s9aM = addMsg;
addMsg = function(d,t) {
	if (t == 'clear') {
		$('#msgs').append('<li><span class="update colBG2">Blocked a clear command</span></li>');
		lastTimestamp = '';
		lastUsername = '';
		return;
	}
	_s9aM(d,t);
}