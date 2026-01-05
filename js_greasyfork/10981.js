// ==UserScript==
// @name        MTurk EyeApps
// @namespace   http://idlewords.net
// @description Add keyboard shortcuts to EyeApps HITs
// @include     https://www.mturkcontent.com/dynamic/hit*
// @version     0.1
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10981/MTurk%20EyeApps.user.js
// @updateURL https://update.greasyfork.org/scripts/10981/MTurk%20EyeApps.meta.js
// ==/UserScript==

function keyHandler(event, index) {
	var rating_id = "-1";
	switch(event.which) {
		case 48:
		case 96:
			rating_id = "10";
			break;
		case 49:
		case 97:
			rating_id = "1";
			break;
		case 50:
		case 98:
			rating_id = "2";
			break;
		case 51:
		case 99:
			rating_id = "3";
			break;
		case 52:
		case 100:
			rating_id = "4";
			break;
		case 53:
		case 101:
			rating_id = "5";
			break;
		case 54:
		case 102:
			rating_id = "6";
			break;
		case 55:
		case 103:
			rating_id = "7";
			break;
		case 56:
		case 104:
			rating_id = "8";
			break;
		case 57:
		case 105:
			rating_id = "9";
	}

	var doScrollDown = false;
	var isRated = false;

	if (rating_id != "-1") {
		$("input[id=rating" + index + "_" + rating_id +"]").prop('checked', true);
		doScrollDown = true;
		isRated = true;
	}

	if ($("input[name='rating" + index + "']:checked").val() !== undefined) {
		isRated = true;
	}

	var idWord = '';
	if (event.which == 73) { //"I"nappropriate
		idWord = "Inappropriate";
	} else if (event.which == 71) { //I don't "g"et it
		idWord = "Idontgetit";
	} else if (event.which == 68 || event.which == 67) { //
		idWord = "baddisplay";
	}

	if (idWord) {
		if ($("#" + idWord + index).prop('checked') === true) {
			$("#" + idWord + index).prop('checked', false);
		} else {
			$("#" + idWord + index).prop('checked', true);
		}
		if (isRated || event.which == 68 || event.which == 67) {
			doScrollDown = true;
		}
	}

	var scrollTarget = '';
	var focusTarget = '';
	if (index+1 == $("[id^=ratingbox]").length) {
		scrollTarget = "#submitButton";
		focusTarget = "#submitButton";
	} else {
		scrollTarget = "#headline_" + (index+1);
		focusTarget = "#ratingbox_" + (index+1);
	}

	if ((event.which == 9 && !event.shiftKey) || doScrollDown) {
		event.preventDefault();
		$(scrollTarget).get(0).scrollIntoView();
		$(focusTarget).focus();
	} else if (event.which == 9 && event.shiftKey && index != 0) {
		event.preventDefault();
		$("#headline_" + (index-1)).get(0).scrollIntoView();
		$("#ratingbox_" + (index-1)).focus();
	}

}

if ($("p:contains('For the text and images below')").length) {
	$("h2").each(function(index, element) {
		$(this).attr('id', 'headline_' + index);
		$(this).addClass('headline');
		$(this).html('<input type="text" name="ratingbox" value="" id="ratingbox_' + index + '" readonly="readonly" />&nbsp;&nbsp;' + $(this).text());
		$("#ratingbox_" + index).css('width', '5px').css('border-color', 'blue');
		$("#ratingbox_" + index).keydown(function(event) {
			keyHandler(event, index);
		});
	});

	$('[id^="ratingbox"]').each(function(r_index, element) {
		$(this).focus(function(f_index, element) {
			$(this).css('border-color', 'red');
		});
		$(this).blur(function(b_index, element) {
			$(this).css('border-color', 'blue');
		});
	});
	
	var i = 0;
	$("input[type='radio'][name^='rating']").each(function(radio_index, element) {
		i++;
		if (i == 11) {
			i = 1;
		}
		$(this).attr('id', $(this).attr('name') + '_' + i);
	});

	$("#headline_0").get(0).scrollIntoView();
	$("#ratingbox_0").focus();
}