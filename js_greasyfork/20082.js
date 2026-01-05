// ==UserScript==
// @name       Instructables AllSteps Single Page View V2
// @namespace  https://greasyfork.org/users/2329-killerbadger
// @version    2
// @description  Automatically redirect to the ALL Steps page on Instructables, if not already there.
// @include      http://*instructables.com/id/*
// @include      https://*instructables.com/id/*
// @downloadURL https://update.greasyfork.org/scripts/20082/Instructables%20AllSteps%20Single%20Page%20View%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/20082/Instructables%20AllSteps%20Single%20Page%20View%20V2.meta.js
// ==/UserScript==
//Based upon New York Times Single Page View by Fat Knowledge - http://userscripts.org/scripts/show/15601
//Based upon original script: https://greasyfork.org/de/scripts/1848-instructables-allsteps-single-page-view
//Based upon hint for correction https://greasyfork.org/en/forum/discussion/5349/wasnt-working-until-i-changed-line-7-8-to-include-instead-of-match/p1

// Get the current window location
var curLoc = window.location.href;
// Get the html text
//var bodyText = document.body.textContent;
//Not needed for this application

// ------------------------------------------------------------------------
// Redirect to single page view if option inot already selected
// ------------------------------------------------------------------------
if (curLoc.indexOf("id") != -1 && curLoc.indexOf("ALLSTEPS") == -1) {
	if (curLoc.indexOf("?")!=-1){
		var newLoc = curLoc+'&ALLSTEPS';
	} else {
		var newLoc = curLoc+'?ALLSTEPS';
	}
	window.location.replace(newLoc);
} else {
}