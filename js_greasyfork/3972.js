// ==UserScript==
// @name        AJ Ghergich Helper (MTurk)
// @description	A simple helper script for AJ Ghergich email HITs on MTurk (Mechanical Turk). It linkifies the URL, automatically focuses on the email input box and makes it easier to select the "Not found" button.
// @namespace   https://greasyfork.org/users/3408
// @author		DonovanM
// @include		https://s3.amazonaws.com/mturk_bulk/hits*
// @require	   	http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @version     0.9.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3972/AJ%20Ghergich%20Helper%20%28MTurk%29.user.js
// @updateURL https://update.greasyfork.org/scripts/3972/AJ%20Ghergich%20Helper%20%28MTurk%29.meta.js
// ==/UserScript==

window.addEventListener("load", checkAJ, false);

function checkAJ() {
	if (document.getElementsByTagName("h3")[0].innerHTML.indexOf("Find The Email Address For The URL Below") !== -1)
		main();
}

function main() {
	$("table").css({ 'border-width': "0", 'border-spacing': "0", 'border-collapse': "collapse" });
	$("td").css({ 'border': "0", 'padding': "2px" });

	var url = $("#mturk_form > p:nth-child(4) > b:nth-child(1)");
	var parent = url.parent();
	var textBox = $("#Q1Url");
	var cantFind = $("#mturk_form > table:nth-child(6) > tbody:nth-child(1) > tr:nth-child(3)");
	var radios = $("input:radio");

	$("#submitButton").css({'width': "100%", 'height': "40px"});

	url.remove();

	link = $("<a>");

	if (url.text().indexOf("http") == -1) {
		link.attr('href', "http://" + url.text())
	} else {
		link.attr('href', url.text())
	}

	link.text(url.text()).attr('target', "_blank");

	url = link;
	url.click(function() { textBox.focus() });

	cantFind
		.css('height', "40px")
		.click(function() { radios.eq(0).prop('checked', true) })
		.hover(
			function() { $("td", this).css("background-color" , "#cef")},
			function() { $("td", this).css("background-color" , "white")}
		);
	cantFind.css('cursor', "pointer");
	parent.append(url);
}