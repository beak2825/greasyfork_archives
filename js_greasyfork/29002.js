// ==UserScript==
// @name         MooMoo right click weapon swap
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  swaps weapons when right clicked
// @author       meatman2tasty
// @match        http://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29002/MooMoo%20right%20click%20weapon%20swap.user.js
// @updateURL https://update.greasyfork.org/scripts/29002/MooMoo%20right%20click%20weapon%20swap.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var bow = false;
	
	$("#gameCanvas").mousedown(function(ev){
		if(ev.which == 3) {
			ev.preventDefault();
			if (bow) {
				$('#actionBarItem0').click();
				$('#actionBarItem1').click();
				$('#actionBarItem2').click();
			} else {
				$('#actionBarItem3').click();
			}
			bow = !bow;
		}
	});

})();