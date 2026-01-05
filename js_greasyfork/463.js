// ==UserScript==
// @name		Greasyfork Require Easy Get Latest Version
// @description		Puts the link for the latest version of a library into an input with autoselect instead of a code tag.
// @namespace		Tobbe
// @author		Tobbe
// @version		1.4
//
// @include		https://greasyfork.org/*/scripts/*
//
// @require		https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// 
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/463/Greasyfork%20Require%20Easy%20Get%20Latest%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/463/Greasyfork%20Require%20Easy%20Get%20Latest%20Version.meta.js
// ==/UserScript==

(function() {
	var scriptLink = $('#script-content > p > code:first-child');

	if(scriptLink) {
		var input = $('<input type="text" style="width: 100%" readonly="readonly">');
		input.val(scriptLink.html()).focus(function() { $(this).select(); });

		scriptLink.replaceWith(input);
	}
})();