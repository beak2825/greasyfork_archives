// ==UserScript==
// @name        MTurk Validate or Identify Gas Stations/Communications Towers
// @namespace   http://idlewords.net
// @description Adds keyboard shortcuts
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     0.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11263/MTurk%20Validate%20or%20Identify%20Gas%20StationsCommunications%20Towers.user.js
// @updateURL https://update.greasyfork.org/scripts/11263/MTurk%20Validate%20or%20Identify%20Gas%20StationsCommunications%20Towers.meta.js
// ==/UserScript==

if ($("p:contains('Does this image contain a')").length) {
	$(document).keydown(function(event) {
		if (event.which == 49 || event.which == 97) {
			$("#AnswerGroup_0").prop('checked', true).focus();
		} else if (event.which == 50 || event.which == 98) {
			$("#AnswerGroup_2").prop('checked', true).focus();
		} else if (event.which == 51 || event.which == 99) {
			$("#AnswerGroup_3").prop('checked', true).focus();
		} else if (event.which == 83 && event.ctrlKey) {
			$("#submitButton").click();
		}
	});
}