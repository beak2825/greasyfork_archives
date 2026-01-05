// ==UserScript==
// @name        MTurk David White - Two Music Links: Same Album or Different Album?
// @namespace   http://idlewords.net
// @description Use 1 - 4 to select Yes, No, 404, or Cannot Tell, and Ctrl+S or Enter to submit. Opens both links automatically (must have MTurk Message Receiver installed)
// @include     https://s3.amazonaws.com/mturk_bulk/hits*
// @include		https://www.mturkcontent.com/dynamic/hit*
// @version     0.3
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11883/MTurk%20David%20White%20-%20Two%20Music%20Links%3A%20Same%20Album%20or%20Different%20Album.user.js
// @updateURL https://update.greasyfork.org/scripts/11883/MTurk%20David%20White%20-%20Two%20Music%20Links%3A%20Same%20Album%20or%20Different%20Album.meta.js
// ==/UserScript==

if ($(":contains('Decide if the links both refer to the same')").length || $(":contains('Look at the information in the two links')").length) {
	var link1 = $("a:contains('Link 1')").last().attr('href');
	var link2 = $("a:contains('Link 2')").last().attr('href');
	if (link1.match('itunes') || link1.match('yahoo')) {
		window.parent.postMessage("music1!!!!!" + link1, "https://www.mturk.com");
	} else {
		window.parent.postMessage("music1!!!!!" + 'about:blank', "https://www.mturk.com");
		$("#submitButton").parent().after($("<iframe src='" + link1 + "' width='45%' height='600' id='link1'></iframe>"));
	}
	if (link2.match('itunes') || link2.match('yahoo')) {
		window.parent.postMessage("music2!!!!!" + link2, "https://www.mturk.com");
	} else {
		window.parent.postMessage("music2!!!!!" + 'about:blank', "https://www.mturk.com");
		$("#submitButton").parent().after($("<iframe src='" + link2 + "' width='45%' height='600' id='link1'></iframe>"));
	}
} else if ($(":contains('Look at the information in the link')").length) {
	var link = $("a:contains('Link')").last().attr('href');
	window.parent.postMessage("music1!!!!!" + link, "https://www.mturk.com");
}
$("div.panel-primary").hide();
$("input[value='No']").prop('checked', true);
/*var instructHead = $("div.panel-primary").children().eq(1).children("strong:contains('Instructions')");
var instructBody = instructHead.parent().parent().next();
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
});*/
$(document).keydown(function(event) {
	if (event.which == 83 && event.ctrlKey || event.which == 13) {
		event.preventDefault();
		$("#submitButton").click();
	}
	if (event.which == 49 || event.which == 97) {
		$("input[value='Yes']").prop('checked', true);
	}
	if (event.which == 50 || event.which == 98) {
		$("input[value='No']").prop('checked', true);
	}
	if (event.which == 51 || event.which == 99) {
		$("input[value='404']").prop('checked', true);
	}
	if (event.which == 52 || event.which == 100) {
		$("input[value='Cannot Tell']").prop('checked', true);
	}
});