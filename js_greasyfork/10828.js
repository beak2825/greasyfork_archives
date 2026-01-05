// ==UserScript==
// @name        MTurk DaddyHunt Moderation
// @description	Use keys 1-6 to rate an image from clean to broken.
// @namespace   http://idlewords.net
// @include     https://www.mturk.com/mturk/*
// @exclude     https://www.mturk.com/mturk/dashboard
// @exclude     https://www.mturk.com/mturk/myhits
// @exclude     https://www.mturk.com/mturk/findhits*
// @exclude     https://www.mturk.com/mturk/searchbar*
// @exclude     https://www.mturk.com/mturk/findquals*
// @exclude     https://www.mturk.com/mturk/pendingquals*
// @exclude     https://www.mturk.com/mturk/youraccount*
// @exclude     https://www.mturk.com/mturk/help*
// @version     1.4
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10828/MTurk%20DaddyHunt%20Moderation.user.js
// @updateURL https://update.greasyfork.org/scripts/10828/MTurk%20DaddyHunt%20Moderation.meta.js
// ==/UserScript==

// make sure we are on a DH HIT; since they use MTurk for their HIT hosting, they do not have a unique URL to match
if ($("h3:contains('IS THIS IMAGE NON SEXUAL, SLIGHTLY SEXUAL, ADULT, OR PROHIBITED?')").length)
{
	$(".question-wrapper").each(function(index, element) {
		$(this).attr('id', 'HITQuestion' + index);

		var img = $(this).find("img")
		// add input to use for keypress handler
		img.before("<p><input type='text' style='width: 15px' id='HITAnswerBox" + index + "' readonly='readonly'></p>");
		$("#HITAnswerBox" + index).css('border-color', 'blue');

		// wrap img in a link to the full-size version
		img.before("<a id='HITImageLink" + index + "'></a>");
		$("#HITImageLink" + index).attr('href', img.attr('src')).attr('target', '_blank');
		$("#HITImageLink" + index).append(img);

		// use 1-6 to select Clean, Somewhat Sexual, Adult, Woman or Multiple People, Reject, and Broken Image,
		// then jump to next image
		$("#HITAnswerBox" + index).keydown(function(event) {
			// discard keypress
			event.preventDefault();
			var question_wrapper = $("#HITQuestion" + index);
			var validEvent = 0;
			if (event.which == 49 || event.which == 97) { // 1
				question_wrapper.find("input[name='Answer_" + (index+1) + "']").eq(0).prop("checked", true);
			} else if (event.which == 50 || event.which == 98) { // 2
				question_wrapper.find("input[name='Answer_" + (index+1) + "']").eq(1).prop("checked", true);
			} else if (event.which == 51 || event.which == 99) { // 3
				question_wrapper.find("input[name='Answer_" + (index+1) + "']").eq(2).prop("checked", true);
			} else if (event.which == 52 || event.which == 100) { // 4
				question_wrapper.find("input[name='Answer_" + (index+1) + "']").eq(3).prop("checked", true);
			} else if (event.which == 53 || event.which == 101) { // 5
				question_wrapper.find("input[name='Answer_" + (index+1) + "']").eq(4).prop("checked", true);
			} else if (event.which == 54 || event.which == 102) { // 6
				question_wrapper.find("input[name='Answer_" + (index+1) + "']").eq(5).prop("checked", true);
			} else if (event.which == 9 && event.shiftKey) {
				// shift+tab to go up one
				$("#HITAnswerBox" + (index-1)).get(0).scrollIntoView();
				$("#HITAnswerBox" + (index-1)).focus();
			}
			if ((event.which >= 49 && event.which <= 54) || (event.which >= 97 && event.which <= 102) || (event.which == 9 && !event.shiftKey)) {
				// scroll to the next image but only if we selected a number or tab was pressed w/o shift
				$("#HITAnswerBox" + (index+1)).get(0).scrollIntoView();
				$("#HITAnswerBox" + (index+1)).focus();
			}
		});

		// add numbers in front of rating descriptions, as a reminder
		$(this).find("span.answer.text").each(function(index, element) {
			var oldText = $(this).text();
			$(this).text((index+1) + ' ' + oldText);
		});
	});
	$('[id^="HITAnswerBox"]').each(function(index, element) {
		$(this).focus(function(index, element) {
			$(this).css('border-color', 'red');
		});
		$(this).blur(function(index, element) {
			$(this).css('border-color', 'blue');
		});
	});
	$("#HITAnswerBox0").get(0).scrollIntoView();
	$("#HITAnswerBox0").focus();
}