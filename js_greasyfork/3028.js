// ==UserScript==
// @name           vBulletin easy Mark Read
// @namespace      http://armeagle.nl
// @description    Move the "Mark This Forum Read" button from the Forum Tools dropdown to the forum bar (left of said dropdown).
// @include        *forumdisplay.php?f=*
// @include        http://forums.riftgame.com/forumdisplay.php*
// @include        http://forums.electronicarts.co.uk/*
// @include        http://community.codemasters.com/forum/*
// @include        http://forums.multiplay.co.uk/*
// @include        https://forums.multiplay.com/*
// Add whatever site you need it yourself.
// @version 0.0.1.20140705065008
// @downloadURL https://update.greasyfork.org/scripts/3028/vBulletin%20easy%20Mark%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/3028/vBulletin%20easy%20Mark%20Read.meta.js
// ==/UserScript==

var td_forumtools = document.querySelector('#forumtools');
if ( td_forumtools != null ) {
	// the dropdown menu isn't always the same, for example if you're not allowed to create a new thread.
	var td_options = document.querySelectorAll('#forumtools_menu > form > table > tbody > tr > td');
	if ( td_options.length == 0 ) {
		// change for riftgame forum, using vBulletin 4.0.3
		td_options = document.querySelectorAll('#forumtools > ul > li');
	}
	var td_markread = null;
	for ( options_index = 0; options_index < td_options.length; options_index++ ) {
		var a = td_options[options_index].querySelector('a');
		
		if ( a.textContent.toLowerCase().indexOf('mark this forum read') >= 0 ) {
			td_markread = td_options[options_index];
			break;
		}
	}
	if ( td_markread != null ) {
		td_markread.setAttribute('class', td_forumtools.getAttribute('class'));
		td_markread.setAttribute('nowrap', 'nowrap');
		td_forumtools.parentNode.insertBefore(td_markread, td_forumtools);
	}
}