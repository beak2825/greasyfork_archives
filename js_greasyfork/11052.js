// ==UserScript==
// @name        MTurk Record information from clothing tags
// @description Adds keyboard shortcuts to MTurk "Record information from clothing tags" HITs
// @namespace   http://idlewords.net
// @include     https://s3.amazonaws.com/mturk_bulk/hits*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11052/MTurk%20Record%20information%20from%20clothing%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/11052/MTurk%20Record%20information%20from%20clothing%20tags.meta.js
// ==/UserScript==

$(document).ready(function() {
	if ($("p:contains('Identify brand, size, and material')").length) {
		$("select[name='brand']").focus();
		$(document).keydown(function(event) {
			if (event.which == 83 && event.ctrlKey) {
				$("#submitButton").click();
			}
		});
		$("select").each(function(index, element) {
			$(this).attr('tabindex', (index+1));
		})
		$("select").keydown(function(event) {
			if ($(this).attr('name') == 'material_1' || $(this).attr('name') == 'material_2' || $(this).attr('name') == 'material_3') {
				var select_name = 'material';
			} else if ($(this).attr('name').substr(0,4) == 'size') {
				var select_name = 'size';
			} else {
				var select_name = 'brand';
			}
			if (event.which == 76 && event.ctrlKey) {
				event.preventDefault();
				if ($("input[name='" + select_name + "_not_in_list']").prop('checked') === false) {
					$("input[name='" + select_name + "_not_in_list']").prop('checked', true);
				} else {
					$("input[name='" + select_name + "_not_in_list']").prop('checked', false);
				}
			} else if (event.which == 73 && event.ctrlKey) {
				event.preventDefault();
				if ($("input[name='" + select_name + "_not_in_image']").prop('checked') === false) {
					$("input[name='" + select_name + "_not_in_image']").prop('checked', true);
				} else {
					$("input[name='" + select_name + "_not_in_image']").prop('checked', false);
				}
			}
		});
	}
});