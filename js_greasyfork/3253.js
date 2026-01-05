// ==UserScript==
// @name        Mturk Title Fixer
// @namespace   DonovanM
// @author	DonovanM (dnast)
// @description Change the titles on Mturk pages to be more descriptive
// @include     https://www.mturk.com/mturk/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @version     0.9.5
// @grant       none
// @copyright	2013+
// @downloadURL https://update.greasyfork.org/scripts/3253/Mturk%20Title%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/3253/Mturk%20Title%20Fixer.meta.js
// ==/UserScript==

/** This simple script makes the page titles more useful. Most pages on Mechanical Turk simply have
    "Amazon Mechanical Turk" for the title and if you have multiple tabs open, it can be hard
    to determine which is which at a glance. This script puts an appropriate title for nearly
    every page on AMT.
**/
var title = $("title").text().trim();
var existingTitle = title.replace(/Amazon Mechanical Turk( - )?/, "");
var newText = "";

if (existingTitle != "") {
	existingTitle += " - AMT";
} else {
	existingTitle = " - AMT";

	if ($(".capsulelink_bold > div:nth-child(1)").length > 0) {
		newText = $(".capsulelink_bold > div:nth-child(1)").text().trim();
	} else if ($(".title_orange_text_bold").length > 0) {
		newText = $(".title_orange_text_bold").text().trim();
	} else if ($(".error_title").length > 0) {
		newText = $(".error_title").text().trim();
	} else {
		existingTitle = "AMT";
	}
}

$("title").text(newText + existingTitle);
