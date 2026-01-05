/* global W */
// ==UserScript==
// @name         WME Change Segment Display
// @namespace    https://greasyfork.org/en/users/19426-bmtg
// @version      0.21
// @description  Change display of edited segments
// @author       bmtg
// @match        http://*/*
// @include     https://editor-beta.waze.com/*editor/*
// @include     https://www.waze.com/*editor/*
// @exclude     https://www.waze.com/*user/editor/*
// @grant	   none
// @downloadURL https://update.greasyfork.org/scripts/17584/WME%20Change%20Segment%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/17584/WME%20Change%20Segment%20Display.meta.js
// ==/UserScript==
/* jshint -W097 */

(function () {
	'use strict';
	function CSD_bootstrap() {
		if ( "undefined" !== typeof W.loginManager && "undefined" !== typeof W.map) {
			setTimeout(monitorSegments,500);  //  Run the code to check for data return from the Sheets
		} else {
			console.log("Waiting for WME map and login...");
			setTimeout(function () { CSD_bootstrap(); }, 300);
		}
	}
	
	function monitorSegments() {
		for (var segObj in W.model.segments.objects) {
			var segment = W.model.segments.get(segObj);
			var line = document.getElementById(segment.geometry.id);

			if (line === null) {
				continue;
			}

			if ( line.getAttribute('stroke') === '#ff8383' ) {
				line.setAttribute('stroke','#ffFFFF');
				line.setAttribute('stroke-linecap','0');
				line.setAttribute('stroke-width','15');
				line.setAttribute('stroke-dasharray','9 2');
			} else if ( line.getAttribute('stroke') === '#eb7171') {
				line.setAttribute('stroke','#FFFFFF');
				//line.setAttribute('stroke-linecap','0');
				line.setAttribute('stroke-width','14');
				//line.setAttribute('stroke-dasharray','9 4');
			}
		}
		
		//console.log("CSD refreshing");
		setTimeout(monitorSegments,700);
	}
	
	
	
	
	CSD_bootstrap();
	
})();