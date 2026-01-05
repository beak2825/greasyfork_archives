// ==UserScript==
// @name       Instructables AllSteps Single Page View
// @namespace  https://greasyfork.org/users/2329-killerbadger
// @version    0.1.1
// @description  Automatically redirect to the ALL Steps page on Instructables, if not already there.
// @match      http*://*.instructables.com/id/*
// @downloadURL https://update.greasyfork.org/scripts/1848/Instructables%20AllSteps%20Single%20Page%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/1848/Instructables%20AllSteps%20Single%20Page%20View.meta.js
// ==/UserScript==
//Based upon New York Times Single Page View by Fat Knowledge - http://userscripts.org/scripts/show/15601

// Get the current window location
var curLoc = window.location.href;
// Get the html text
//var bodyText = document.body.textContent;
//Not needed for this application

// ------------------------------------------------------------------------
// Redirect to single page view if option is not already selected
// ------------------------------------------------------------------------
if (curLoc.indexOf("id") != -1 && curLoc.indexOf("ALLSTEPS") == -1) {
	if (curLoc.indexOf("?")!=-1){
		var newLoc = curLoc+'&ALLSTEPS';
	} else {
		var newLoc = curLoc+'?ALLSTEPS';
	}
	window.location.replace(newLoc);
} else {
/* Do Nothing */
}