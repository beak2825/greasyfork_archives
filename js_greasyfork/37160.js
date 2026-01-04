// ==UserScript==
// @name          TimerInTitlebar
// @namespace     https://greasyfork.org/en/users/6503-turk05022014
// @description   Puts the remaining HIT time in the titlebar.
// @match         https://*.mturk.com/projects/*/tasks/*
// @grant         none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js
// @version       1.3.20180405
// @downloadURL https://update.greasyfork.org/scripts/37160/TimerInTitlebar.user.js
// @updateURL https://update.greasyfork.org/scripts/37160/TimerInTitlebar.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var originalTitle = document.title;
$(document).ready(function () {
	setInterval(function () {
		var otime = $(".completion-timer").parent().filter(":first").data().reactProps.originalTimeToCompleteInSeconds;
		var ct = $(".completion-timer").text().split(" ")[0].split(":").reverse();
		var s = (otime - (parseInt(ct[0]) + (parseInt(ct[1])*60) + (ct[2]?parseInt(ct[2])*60*60:0))) * 1000;
		var d = new Date(s).toUTCString().replace(/:/g, " ").split(" ");
		if (d[1] > 1) { document.title = [d[1]-1,d[4],d[5],d[6]].join(":") }
		else if (d[4] > 0) { document.title = [d[4],d[5],d[6]].join(":") }
		else { document.title = [d[5],d[6]].join(":") }
		document.title += " " + originalTitle;
	}, 1000);
});