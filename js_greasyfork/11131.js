// ==UserScript==
// @name        MTurk Nova Flag images
// @namespace   http://idlewords.net
// @description Pre-checks "No images" for Nova - Flag images HITs
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     2
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11131/MTurk%20Nova%20Flag%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/11131/MTurk%20Nova%20Flag%20images.meta.js
// ==/UserScript==

if ($("p:contains('Please mark the images if they show')").length) {
	var instructHead = $("div.panel-heading").children("strong:contains('Instructions')");
	var instructBody = instructHead.parent().next();
	instructBody.prop('id','instruct_body');
	instructHead.html("<a href='javascript:void();' id='hide_instruct'>+</a> Instructions");
	instructHead.children("a").css('color', 'white');

	$("#hide_instruct").click(function() {
		if ($("#instruct_body").is(":visible")) {
			var replaceText = $(this).text().replace("-", "+");
			$(this).text(replaceText);
			$("#instruct_body").hide();
		} else {
			var replaceText = $(this).text().replace("-", "+");
			$(this).text(replaceText);
			$("#instruct_body").show();
		}
	});
	$("#hide_instruct").click();

	$("#checkbox10").prop('checked', true);
	$("[id^='checkbox']").change(function() {
		if ($(this).prop('checked') === true) {
			if ($(this).prop('id') === 'checkbox10') {
				$("[id^='checkbox']").filter("[id!='checkbox10']").each(function (){
					$(this).prop('checked', false);
				});
			} else if ($("#checkbox10").prop('checked') === true) {
				$("#checkbox10").prop('checked', false);
			}
		}
	});
}