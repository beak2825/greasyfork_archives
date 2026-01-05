// ==UserScript==
// @name        Don't Read Below the Line
// @namespace   http://xyxyx.org/
// @include     http://www.theguardian.com/*
// @include     https://www.theguardian.com/*
// @include     http://www.dailymail.co.uk/*
// @include     https://www.dailymail.co.uk/*
// @version     0.3
// @grant       none
// @description Script intended to reduce misanthropic feelings, by hiding the comments section on some UK newspapers.
// @downloadURL https://update.greasyfork.org/scripts/258/Don%27t%20Read%20Below%20the%20Line.user.js
// @updateURL https://update.greasyfork.org/scripts/258/Don%27t%20Read%20Below%20the%20Line.meta.js
// ==/UserScript==

console.log("Trying to hide comments");

var hideIfFound = function(element) {
	if (!element) {
		console.log("Not found");
	} else {
		console.log("Hiding");
		element.style.visibility = 'hidden';
	}
}

// Gaurdian
hideIfFound(document.getElementById("comments"));
hideIfFound(document.getElementById("top-comments"));
hideIfFound(document.getElementById("d2-root"));

// Daily Mail
hideIfFound(document.getElementById("reader-comments"));
