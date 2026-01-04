// ==UserScript==
// @name         Wykop - podświetl wpisy użytkownika na mikroblogu
// @namespace    https://github.com/lopezloo
// @version      1.0
// @description  Podświetla powyższe wpisy użytkownika po najechaniu na jego nick we wpisie na wykopowym mikroblogu.
// @author       lopezloo
// @license      GPL-3.0
// @match        https://www.wykop.pl/wpis/*
// @match        https://www.wykop.pl/mikroblog*
// @match        https://www.wykop.pl/ludzie/*
// @match        https://www.wykop.pl/tag/*
// @match        https://www.wykop.pl/moj/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/438770/Wykop%20-%20pod%C5%9Bwietl%20wpisy%20u%C5%BCytkownika%20na%20mikroblogu.user.js
// @updateURL https://update.greasyfork.org/scripts/438770/Wykop%20-%20pod%C5%9Bwietl%20wpisy%20u%C5%BCytkownika%20na%20mikroblogu.meta.js
// ==/UserScript==

GM_addStyle('.overHighlight { border-left: 3px solid #34db7f; margin-left: -3px; }');

function highlightPeople() {
	var name = $(this).text();
	var time = Date.parse($(this).closest('div.text').parent('div').find('.author > a > .affect > time').attr('datetime'));

	$mainEntry = $(this).closest('.entry.iC');
	$mainEntry.find('.wblock.dC').each(function() {
		$author = $(this).find('.author');
		var name2 = $author.find('a.showProfileSummary').text();

		if(name === name2) {
			var time2 = Date.parse($author.find('a > .affect > time').attr('datetime'));

			if(time > time2) {
				$(this).addClass('overHighlight');
			}
		}
	});
}

function unhighlightPeople() {
	$('.wblock.dC').each(function() {
		if($(this).hasClass('overHighlight')) {
			$(this).removeClass('overHighlight');
		}
	});
}

$(document).ready(function() {
	$(document).on('mouseenter', 'a.showProfileSummary', highlightPeople);
	$(document).on('mouseleave', 'a.showProfileSummary', unhighlightPeople);
});
