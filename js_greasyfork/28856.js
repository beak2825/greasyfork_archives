// ==UserScript==
// @name         ★moomoo.io NumPadChat
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  chat
// @author       nekosan
// @match        *://moomoo.io/*
// @namespace    https://greasyfork.org/en/scripts/28856-moomoo-io-numpadchat
// @downloadURL https://update.greasyfork.org/scripts/28856/%E2%98%85moomooio%20NumPadChat.user.js
// @updateURL https://update.greasyfork.org/scripts/28856/%E2%98%85moomooio%20NumPadChat.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var msgs = [
		'hello',
		'Yes',
		'No',
		'OK!',
		'hey',
		'join team plz',
		'nice!',
		'Help me!!',
		'plz go away',
		'NOOOOOOOOO!!!',
		'lol',
		'thanks',
		'-',
		'!',
		'...',
		'bye'
	];

	function chat(m){
		io.managers[Object.keys(io.managers)[0]].nsps['/'].emit('ch', m);
	}

	document.addEventListener('keydown', function(e) {
		if (e.keyCode >= 96 && e.keyCode <= 111) {
			chat(msgs[e.keyCode - 96]);
		}
	});
})();