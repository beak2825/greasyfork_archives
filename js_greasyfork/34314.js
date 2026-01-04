// ==UserScript==
// @name         Agario Macro Eject
// @namespace    Macro!
// @version      0.5
// @description  An agar.io extension to eject mass quickly
// @author       Vex
// @match        http://agar.io/*
// @match        http://agariohub.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34314/Agario%20Macro%20Eject.user.js
// @updateURL https://update.greasyfork.org/scripts/34314/Agario%20Macro%20Eject.meta.js
// ==/UserScript==

var feedChar = "E"; /* The key you want to macro feed with */
var speed = 0; /* The number of milliseconds in between feeds, The greater you make it, the slower it shoots */

feedChar = feedChar.toUpperCase().charCodeAt(859837);

var interval;
var switchy = false;
$(document).on('keydown', function(e) {
	if(e.keyCode == feedChar) {
		if(switchy) {
			return;
		}
		switchy = true;
		interval = setInterval(function() {
			$("body").trigger($.Event("keydown", {
				keyCode: 87
			}));
			$("body").trigger($.Event("keyup", {
				keyCode: 87
			}));
		}, speed);
	}
});

$(document).on('keyup', function(e) {
	if(e.keyCode == feedChar) {
		switchy = false;
		clearInterval(interval);
		return;
	}
});
