// ==UserScript==
// @name        MakeTitlesFit
// @namespace   https://greasyfork.org/en/users/6503-turk05022014
// @version     1.0.20180114
// @description	Makes it so the title isn't truncated in the Title column.
//              In addition to making titles fit, it will also help make requester names fit.
//              Really long requester names won't look correct.
//              This may break scripts.
//              Use at your own risk.
//              I won't be held liable; you've been warned.
//              Has a 1500 millisecond delay to help mitigate interference with scripts.
// @match       https://worker.mturk.com/?filters*
// @match       https://worker.mturk.com/projects?*
// @match       https://worker.mturk.com/projects
// @match       https://worker.mturk.com/projects/
// @match       https://worker.mturk.com/projects/?filters*
// @match       https://worker.mturk.com/projects/?page_size=*
// @match       https://worker.mturk.com/requesters/*
// @match       https://worker.mturk.com/?*
// @match       https://worker.mturk.com/
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/36951/MakeTitlesFit.user.js
// @updateURL https://update.greasyfork.org/scripts/36951/MakeTitlesFit.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$().ready(function() {
	window.setTimeout(function () {
		$("span.requester-column.text-truncate").each(function(index) {
			$(this).find("a.hidden-sm-down").wrap('<div style="float:left;height:25px;"></div>');
		});
		$('span.project-name-column.text-truncate, span.requester-column.text-truncate').each(function(index) {
			var el = $(this).get(0);
			var link = $(this).find("a");
			$(this).css('white-space', 'normal');
			if ($(this).parent().height() < el.clientHeight) {
				$(this).parent().height(el.clientHeight);
			}
		});
	}, 1500);
	//Will wait 1500 milliseconds before activating to help prevent script conflicts.
});