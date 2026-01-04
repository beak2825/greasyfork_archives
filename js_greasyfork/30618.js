// ==UserScript==
// @name         Plex custom shortcuts
// @namespace    https://www.lastrik.ch/
// @version      2.1.1
// @description  Add the possibility to use custom shortcuts in plex
// @author       Lastrik
// @match        http*://*:32400/*
// @match        http*://app.plex.tv/web/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        none
// @license  MIT
// @downloadURL https://update.greasyfork.org/scripts/30618/Plex%20custom%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/30618/Plex%20custom%20shortcuts.meta.js
// ==/UserScript==

(function() {
	'use strict';

	/*
	This script adds a few tweaks to the pley web player. You can enable/disable them below
	*/

	var removePlayIcon = true;

	/*
   	You can add your own shortcuts here. Syntax : addShortcut(<keyCode>,<action>);
    List of possible actions :
    ------------------------------------
    toggleFullscreen    : toggle fullscreen
    togglePlayPause     : toggle play/pause
    volup               : volume up
    voldown             : volume down
    -------------------------------------
    There is a special keyCode which is doubleClick in order to do action on double clicks. You can find which key equals which keyCode here : http://keycode.info/
    */

	var shortcuts = [];

	/* Example shortcuts */
	addShortcut("75", "togglePlayPause");
	addShortcut("70", "toggleFullscreen");
	addShortcut("doubleClick", "toggleFullscreen");

	/* Add your own here */


	/* My code, touch only if you know js or you might break this script */
	function addShortcut(keyCode, action) {
		shortcuts.push(new Shortcut(keyCode, action));
	}

	function init() {
		if (location.hostname != 'app.plex.tv' && location.port != '32400') {
			return;
		}
		$("body").dblclick(function(e) {
			for (var i = 0; i < shortcuts.length; i++) {
				if (shortcuts[i].keyCode == "doubleClick") {
					e.stopImmediatePropagation();
					eval(shortcuts[i].action + "()");
				}
			}
		});
		checkPrefs();
		document.body.addEventListener('keydown', checkShortcuts);
		console.log("initialized Better plex keybindings");
	}
	init();

	function checkPrefs() {
		if (removePlayIcon) {
			setInterval(function() {
				if (isVideo()) {
					$(".alert-player.alert-paused").remove();
				}
			}, 1000)
		}
	}

	function checkShortcuts(e) {
		for (var i = 0; i < shortcuts.length; i++) {
			if (shortcuts[i].keyCode == e.keyCode) {
				eval(shortcuts[i].action + "()");
			}
		}
	}

	function volup() {
		if (isVideo()) {
			var vid = document.getElementById("html-video");
			vid.volume += 0.1;
		}
	}

	function voldown() {
		if (isVideo()) {
			var vid = document.getElementById("html-video");
			vid.volume -= 0.1;
		}
	}

	function togglePlayPause() {
		var vid = document.getElementById("html-video");
		if (isVideo()) {
			if (vid.paused) {
				vid.play();
			} else {
				vid.pause();
			}
		}
	}

	function toggleFullscreen() {
		if (isVideo()) {
			if (runPrefixMethod(document, "FullScreen") || runPrefixMethod(document, "IsFullScreen")) {
				runPrefixMethod(document, "CancelFullScreen");
			} else {
				runPrefixMethod(document.getElementsByClassName("video-container")[0], "RequestFullScreen");
			}
		}
	}

	function isVideo() {
		if (document.getElementsByClassName("video-container").length === 1) {
			return true;
		} else {
			return false;
		}
	}

	var pfx = ["webkit", "moz", "ms", "o", ""];

	function runPrefixMethod(obj, method) {
		var p = 0,
			m, t;
		while (p < pfx.length && !obj[m]) {
			m = method;
			if (pfx[p] == "") {
				m = m.substr(0, 1).toLowerCase() + m.substr(1);
			}
			m = pfx[p] + m;
			t = typeof obj[m];
			if (t != "undefined") {
				pfx = [pfx[p]];
				return (t == "function" ? obj[m]() : obj[m]);
			}
			p++;
		}
	}

})();

function Shortcut(keyCode, action) {
	return {
		"keyCode": keyCode,
		"action": action
	};
}
