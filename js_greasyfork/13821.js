// ==UserScript==
// @name         A9 Data Collection Keybindings & Default Selections
// @namespace    
// @version      1.3
// @icon         http://i.imgur.com/hKKkPgY.png
// @description  Review and validate an image
// @author       bottles (based on Kadauchi's and Space's scripts)
// @include https://www.mturkcontent.com/dynamic/*
// @include      https://s3.amazonaws.com/*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/13821/A9%20Data%20Collection%20Keybindings%20%20Default%20Selections.user.js
// @updateURL https://update.greasyfork.org/scripts/13821/A9%20Data%20Collection%20Keybindings%20%20Default%20Selections.meta.js
// ==/UserScript==

// To do: make image category text bigger/more obvious

$(document).ready(function() {
	if ($(":contains('Target image category:')").length) {
		$("input[id='is_correct_category_true']").prop('checked', true).focus();
        $("input[id='is_screenshot_false']").prop('checked', true);
        $("input[id='is_watermarked_false']").prop('checked', true);
        $("input[id='is_child_safe_true']").prop('checked', true);
        $("input[id='is_personal_false']").prop('checked', true);
        $("input[id='num_objects_1']").prop('checked', true);
        $("input[value='none']").prop('checked', true);
		$(document).keydown(function(event) {
			if (event.which == 97) { // numpad1
				$("input[id='is_correct_category_false']").prop('checked', true);
                $("input[id='num_objects_0']").prop('checked', true);
            }
			if (event.which == 98) { // numpad2
				$("input[id='is_screenshot_true']").prop('checked', true);
            }
			if (event.which == 99) { // numpad3
				$("input[id='is_watermarked_true']").prop('checked', true);
            }
            if (event.which == 100) { // numpad4
				$("input[id='is_child_safe_false']").prop('checked', true);
            }
            if (event.which == 101) { // numpad5
				$("input[id='is_personal_true']").prop('checked', true);    
            }
            if (event.which == 49) { // 1
				$("input[id='num_objects_1']").prop('checked', true);
            }
            if (event.which == 50) { // 2
				$("input[id='num_objects_2']").prop('checked', true);
            }
            if (event.which == 51) { // 3
				$("input[id='num_objects_3']").prop('checked', true);
            }
            if (event.which == 52) { // 4
				$("input[id='num_objects_4']").prop('checked', true); 
            }
            if (event.which == 53) { // 5
				$("input[id='num_objects_5']").prop('checked', true);
            }
            if (event.which == 54) { // 6
				$("input[id='num_objects_6']").prop('checked', true);
            }
			if (event.which == 96 && event.altKey) { // alt+numpad0
                $("input[value='none']").click();
            }
            if (event.which == 97 && event.altKey) { // alt+numpad1
                $("input[value='dimlighting']").click();
            }
            if (event.which == 98 && event.altKey) { // alt+numpad2
                $("input[value='occlusions']").click();
            }
            if (event.which == 99 && event.altKey) { // alt+numpad3
                $("input[value='heavyshadows']").click();
            }
            if (event.which == 100 && event.altKey) { // alt+numpad4
                $("input[value='blur']").click();
            }
            if (event.which == 101 && event.altKey) { // alt+numpad5
                $("input[value='glare']").click();
            }
            if (event.which == 102 && event.altKey) { // alt+numpad6
                $("input[value='other']").click();
            }
            if (event.which == 13) { // Enter
				$("#submitButton").click();
            }
		});
	}
});