// ==UserScript==
// @name        MTurk A9 Category Validation (Non-Masters)
// @namespace   http://idlewords.net
// @description Assists with Category Validation HITs
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     0.3
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11309/MTurk%20A9%20Category%20Validation%20%28Non-Masters%29.user.js
// @updateURL https://update.greasyfork.org/scripts/11309/MTurk%20A9%20Category%20Validation%20%28Non-Masters%29.meta.js
// ==/UserScript==

/*
 Pre-selects "only one" object in image
 - Ctrl + N for "no" (i.e. 0) objects in image
 - Ctrl + M for "more than 1" objects in image
 - Ctrl + O for "only one" object in image
 - Ctrl + B or Ctrl + P for "is blocked or partially out of image"
 - Ctrl + S for Submit
*/

$(document).ready(function() {
	if ($(":contains('If you don\'t know what a')").length) {
		$("input[value='Valid_Object']").prop('checked', true).click();
		$(document).keydown(function(event) {
			if (event.which == 78 && event.ctrlKey) {
				$("input[value='Missing_Object']").prop('checked', true).click();
			} else if (event.which == 79 && event.ctrlKey) {
				$("input[value='Valid_Object']").prop('checked', true).click();
			} else if (event.which == 77 && event.ctrlKey) {
				$("input[value='Multiple_Objects']").prop('checked', true).click();
			} else if ((event.which == 66 || event.which == 80) && event.ctrlKey) {
				$("input[value='Partial_Object']").prop('checked', true);
			} else if (event.which == 83 && event.ctrlKey) {
				$("#submitButton").click();
			}
		});
	}
});