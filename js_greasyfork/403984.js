// ==UserScript==
// @name			★moomoo.io Hyahhaaaaa!!
// @version			0.2
// @description		random chat messages.
// @author			nekosan
// @match			*://moomoo.io/*
// @namespace		https://greasyfork.org/ja/scripts/28983-moomoo-io-hyahhaaaaa
// @downloadURL https://update.greasyfork.org/scripts/403984/%E2%98%85moomooio%20Hyahhaaaaa%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/403984/%E2%98%85moomooio%20Hyahhaaaaa%21%21.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var msgs = [
		'im so pretty !!',
		'dont u think so too !!!!',
		'LOLOLOLOLOLOLOLOL!!',
		'Die in hell!!',
		'Ha Ha Ha Haaa!!!',
		'let the power of ree kid smite you!!!',
		'whats your name age and house !!',
		'jkjkjkjkjkjkjkjk!!',
		'Hooooooooooooooooooooooooo!!',
		'imm a pretty person!!',
		'do you wanna go out with me!!',
		'+=+=+=+=+=+!!',
		'Hyahhaaaa!!',
		'i will cut you!!',
		'MULLY SHUT UP!!',
		'Hyahhaaaaaaa!!',
	];

	var cnt = 0;
	var flag = false;
	var oid = -1;

	function chat(m) {
		io.managers[Object.keys(io.managers)[0]].nsps['/'].emit('ch', m);
	}

	function rand(a, b) {
		return a + Math.floor(Math.random() * (b - a + 1));
	}

	document.addEventListener('keydown', function(e) {
		// [Insert] Key : RandomChat ON/OFF
		if (e.keyCode == 45) {
			flag = !flag;
		}
		cnt++;
	});
	document.addEventListener('keyup', function(e) { cnt++; });
	document.addEventListener('mousedown', function(e) { cnt++; });
	document.addEventListener('mouseup', function(e) { cnt++; });
	document.addEventListener('contextmenu', function(e) { cnt++; });

	var timer = setInterval(function() {
		if (flag && cnt > 0) {
			if (cnt > 10 || rand(0, 10 - cnt) === 0) {
				var t = rand(0, msgs.length - 1);
				if (t != oid) {
					chat(msgs[t]);
					cnt = 0;
				}
				oid = t;
			}
		}
	}, 800);

})();