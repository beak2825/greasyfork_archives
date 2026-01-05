// ==UserScript==
// @name        MTurk A9 Category Validation-Windows
// @namespace   starvingstatic
// @description Assists with Category Validation HITs--modified from @tubedogg's script to be friendly with Windows
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     1.0
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11700/MTurk%20A9%20Category%20Validation-Windows.user.js
// @updateURL https://update.greasyfork.org/scripts/11700/MTurk%20A9%20Category%20Validation-Windows.meta.js
// ==/UserScript==

/*
 Auto-selects "only one"
 - Ctrl + Shift for "no" (i.e. 0) objects in image
 - Ctrl + C for "more than 1" objects in image
 - Ctrl + Z for "only one" object in image
 - Ctrl + X for "is blocked or partially out of image"
 - Ctrl + V for "I'm not sure"
 - Ctrl + Alt for Submit
*/

$(document).ready(function() {
	if ($(":contains('If you don\'t know what a')").length) {
		$("input[value='Valid_Object']").prop('checked', true).click();
		$(document).keydown(function(event) {
			if (event.which == 16 && event.ctrlKey) {
				$("input[value='Missing_Object']").prop('checked', true).click();
			} else if (event.which == 90 && event.ctrlKey) {
				$("input[value='Valid_Object']").prop('checked', true).click();
			} else if (event.which == 86 && event.ctrlKey) {
				$("input[value='Cannot_See_Unsure']").prop('checked', true).click();
			} else if (event.which == 67 && event.ctrlKey) {
				$("input[value='Multiple_Objects']").prop('checked', true).click();
			} else if ((event.which == 88 || event.which == 80) && event.ctrlKey) {
				$("input[value='Partial_Object']").prop('checked', true);
			} else if (event.which == 18 && event.ctrlKey) {
				$("#submitButton").click();
			}
		});
	}
});