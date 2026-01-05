// ==UserScript==
// @name        UW Social Media locations helper (MTurk)
// @namespace   https://greasyfork.org/users/3408
// @author      DonovanM
// @description A simple script that makes it easier to do UW Social Media locations HITs on MTurk (Mechanical Turk)
// @include     https://www.mturkcontent.com/dynamic/hit*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @version     0.9
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3998/UW%20Social%20Media%20locations%20helper%20%28MTurk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3998/UW%20Social%20Media%20locations%20helper%20%28MTurk%29.meta.js
// ==/UserScript==

$(document).ready(function() {
	if ($(document).text().indexOf("Read the following location and answer the true/false question below:") !== -1)
		main();
})

var SEARCH_PREFIX = "https://www.google.com/search?q=";
var LOCAL_STORAGE = "mturk-uw-locations";

function main() {
	var settings = loadSettings();
	$(window).keydown(checkKey);

	// Add style and make it easier to select true or false
	$("table").css({ 'width': "100%", 'border-spacing': "0" });
	$("td:first-child").css({ 'width': "25px" });
	$("#submitButton").css({ 'width': "100%", 'padding': "5px" });

	$("td:nth-child(2)")
		.css({
			'font'    : "14pt sans-serif",
			'padding' : "3px",
			'cursor'  : "default"
		})
		.click(function() {
			$("input", $(this).prev()).prop("checked", true).change();
		});

	$("tr").hover(
		function() { $("td", $(this)).css('background-color', "#def"); },
		function() { $("td", $(this)).css('background-color', ""); }
	)

	// Linkify quoted text
	var keywordDiv = $(".highlight-box > div:nth-child(3)");
	var keyword = keywordDiv.text();

	keywordDiv.empty().append(
		$("<a>")
			.text(keyword)
			.attr('href', SEARCH_PREFIX + keyword.replace(/ /g, '+'))
			.attr('target', "_blank")
			.css({ 'font-weight': "bold", 'font': "13pt sans-serif"})
	);

	// Auto-submit stuff
	$("#submitButton").after(
		$('<label><input type="checkbox" id="autoSubmit" />Auto-submit <a id="help"> ? </a></label>')
			.css({
				'display'    : "block",
				'text-align' : "center",
				'font'       : "9pt sans-serif"
			})
	);

	$("#autoSubmit")
		.prop('checked', settings.autoSubmit)
		.change(function() {
			settings.autoSubmit = $(this).prop('checked');
			saveSettings(settings);
		}
	);

	$("input[type='radio']").change(function() {
		if (settings.autoSubmit)
			$("#submitButton").click();
	});

	// Help info
	var helpText = "Press 1 or T for True.\nPress 2 or F for False.\nIf auto-submit is selected, the HIT will be automatically submitted after making a selection.";
	$("#help")
		.attr('title', helpText)
		.css({
			'font-weight': "bold",
			'font-size': "125%",
			'color': "#999",
			'cursor': "help"
		});
}

function checkKey(e) {
	switch(e.keyCode) {
		case 49: // 1
		case 84: // T
			select(true);
			break;
		case 50: // 2
		case 70: // F
			select(false);
	}
}

function select(isTrue) {
	var buttons = $("input[type='radio']");
	if (isTrue)
		buttons.eq(0).prop('checked', true).change();
	else
		buttons.eq(1).prop('checked', true).change();
}

function loadSettings() {
	var settings = localStorage.getItem(LOCAL_STORAGE);
	
	if (settings) 
		return JSON.parse(settings);
	else
		return { autoSubmit: false };
}

function saveSettings(settings) {
	localStorage.setItem(LOCAL_STORAGE, JSON.stringify(settings));
}