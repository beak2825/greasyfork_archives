// ==UserScript==
// @name        MTurk Research Tasks Keyboard Shortcuts 2
// @description Add keyboard shortcuts to MTurk requester Research Task's HITs for "How Old" and "Commonsense"
// @namespace   http://idlewords.net
// @include     https://vqa.cloudcv.org/*
// @version     0.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11028/MTurk%20Research%20Tasks%20Keyboard%20Shortcuts%202.user.js
// @updateURL https://update.greasyfork.org/scripts/11028/MTurk%20Research%20Tasks%20Keyboard%20Shortcuts%202.meta.js
// ==/UserScript==

$.noConflict();
if ($("h3:contains('How Old Do You Think a Person Needs')").length) {
	$(document).keydown(function(event) {
		var rated = 0;
		switch(event.which) {
			case 49:
			case 97:
				$("#csToddler").prop('checked', true);
				rated = 1;
				break;
			case 50:
			case 98:
				$(":radio[value='yChild']").prop('checked', true);
				rated = 1;
				break;
			case 51:
			case 99:
				$(":radio[value='oChild']").prop('checked', true);
				rated = 1;
				break;
			case 52:
			case 100:
				$(":radio[value='yTeen']").prop('checked', true);
				rated = 1;
				break;
			case 53:
			case 101:
				$(":radio[value='adult']").prop('checked', true);
				rated = 1;
				break;
		}
		if (rated == 1) {
			event.preventDefault();
			$("#nextButton").click();
		}
	});
} else if ($("h3:contains('Do These Questions Need Common')").length) {
	$(document).keydown(function(event) {
		if (event.which == 49 || event.which == 97) {
			$("input#csYes").prop('checked', true);
			event.preventDefault();
			$("#nextButton").click();
		} else if (event.which == 50 || event.which == 98) {
			$("input#csNo").prop('checked', true);
			event.preventDefault();
			$("#nextButton").click();
		}
	});
}