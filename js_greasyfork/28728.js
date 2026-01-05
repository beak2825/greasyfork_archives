// ==UserScript==
// @name			Jalup NEXT Toggle Furigana
// @namespace		nelemnaru
// @include		https://jalupnext.com/*
// @version		1.1
// @description	Adds a button in the lower-right of the screen to toggle furigana.
// @grant		none
// @require		https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28728/Jalup%20NEXT%20Toggle%20Furigana.user.js
// @updateURL https://update.greasyfork.org/scripts/28728/Jalup%20NEXT%20Toggle%20Furigana.meta.js
// ==/UserScript==

// Add furigana icon
$("<div></div>").append( $("<div>虫</div>").css("margin", "20px") )
	.addClass("rubyicon")
	.css("cursor", "pointer").css("-moz-user-select", "none").css({ "position":"fixed", "bottom":"0", "right":"0", "z-index":"9999999999999" })
	.appendTo("body")
	.click(function() {
		$("rt").toggle();
	})