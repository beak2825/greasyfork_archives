// ==UserScript==
// @name		Notatkowator 2000 
// @namespace		http://www.wykop.pl/ludzie/piokom123/
// @description		Szybki podgląd notek
// @author		piokom123
// @version		1.3
// @grant		none
// @include		http://www.wykop.pl/*
// @include		https://www.wykop.pl/*
// @run-at 		document-end
// @downloadURL https://update.greasyfork.org/scripts/1993/Notatkowator%202000.user.js
// @updateURL https://update.greasyfork.org/scripts/1993/Notatkowator%202000.meta.js
// ==/UserScript==
// Ukłony dla @parasolki za nadanie dodatkowi tej boskiej nazwy ;)

function main() {
	var loggedInNick = $('.logged-user .ellipsis span b').html();
	var cacheCookieName = 'userNotesCache';
	var cacheCookieExpirationName = 'userNotesCacheExpiration';
	var cacheCookieMinutes = 15;
	var notes = {};

	/**
	 * Loads notes from cache or fetches them from website if cache doesn't exist or is invalid
	 */
	function loadNotes() {
		var cachedNotes = getData(cacheCookieName);
		if (typeof cachedNotes === 'undefined') {
			fetchNotes();
		} else {
			notes = JSON.parse(cachedNotes);
			showNotes(notes);
		}
	}

	/**
	 * Asynchronously fetches notes from website, saves it and shows
	 */
	function fetchNotes() {
		setTimeout(function() {
			$.ajax('https://www.wykop.pl/moj/notatki-o-uzytkownikach/')
			.done(function(data) {
				parseNotes(data);

				saveNotes();

				showNotes();
			});
		}, 100);
	}

	/**
	 * Parses user notes list HTML and returns as object
	 */
	function parseNotes(data) {
		notes = {};

		$('#notesList li p', data).each(function(index, item) {
			notes[$('a b', item).html()] = parseNote(item.innerHTML);
		});
	}

	/**
	 * Parses HTML of one note
	 */
	function parseNote(content) {
		var parsedNote = '';
		var match = content.split('</b></a>');
		match = match[1].trim();

		if (match.indexOf('|') === -1) {
			parsedNote = match;
		} else {
			match = match.split('|');
			parsedNote = match[0];
		}

		parsedNote = activateLinks(parsedNote);

		return parsedNote;
	}

	function activateLinks(content) {
		if (content.indexOf('http://') !== -1 || content.indexOf('https://') !== -1) {
			content = content.replace(/(https?:\/\/([^\s]+))/g, '<a href="$1" target="_blank">$1</a>');
		}

		return content;
	}

	function saveNotes() {
		notesString = JSON.stringify(notes);

		saveData(cacheCookieName, notesString);
	}

	/**
	 * Shows notes on website
	 */
	function showNotes() {
		$('.author .showProfileSummary b').each(function(index, item) {
			var nick = item.innerHTML.trim();

			if (typeof notes[nick] !== 'undefined') {
				$(item.parentNode.parentNode).append('<span class="note2000 notesFor' + nick + '" style="padding-right: 55px; white-space: normal !important;">| ' + notes[nick] + '</span>');
			}
		});
	}

	/**
	 * Gets data from local storage. Can return 'undefined' if data doesn't exist or is invalid.
	 */
	function getData(name) {
		if (typeof localStorage !== 'undefined') {
			var expirationCookie = getCookie(cacheCookieExpirationName);
			if (typeof expirationCookie === 'undefined') {
				return;
			}

			var data = localStorage.getItem(name);
			if (typeof data !== 'undefined' && data !== null && data !== '') {
				return data;
			}
		}
	}

	/**
	 * Saves data to local storage and sets expiration cookie
	 */
	function saveData(name, value) {
		if (typeof localStorage !== 'undefined') {
			saveCookie(cacheCookieExpirationName, 'valid', cacheCookieMinutes);

			var data = localStorage.setItem(name, value);
		}
	}

	function getCookie(name) {
		var i, x, y, ARRcookies = document.cookie.split(";");
		for (i = 0; i < ARRcookies.length; i++) {
			x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
			y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
			x = x.replace(/^\s+|\s+$/g, "");
			if (x === name) {
				return unescape(y);
			}
		}
	}

	function saveCookie(name, value, minutes) {
		var exdate = new Date();
		exdate.setMinutes(exdate.getMinutes() + minutes);

		value = escape(value) + "; domain=.wykop.pl; path=/" + ((minutes===null) ? "" : "; expires=" + exdate.toUTCString());
		document.cookie = name + "=" + value;
	}

	function addBlackListsStats() {
		jQuery(jQuery('.blackListForm')[0]).before(
			'<div style="width: 100%; padding: 25px; text-align: center">'
			+ 'Osoby na #czarnolisto: <b>' + jQuery('div[data-type="users"] .usercard').length + '</b>'
			+ ', w tym: <span class="color-2">bordo (<b>' + jQuery('div[data-type="users"] .color-2').length + '</b>)</span>'
			+ ', <span class="color-1">pomarańczki (<b>' + jQuery('div[data-type="users"] .color-1').length + '</b>)</span>'
			+ ', <span class="color-0">zielonki (<b>' + jQuery('div[data-type="users"] .color-0').length + '</b>)</span>'
			+ ', <span class="color-1001">zbanowani (<b>' + jQuery('div[data-type="users"] .color-1001').length + '</b>)</span>'
			+ ', <span class="color-1002">ragequity (<b>' + jQuery('div[data-type="users"] .color-1002').length + '</b>)</span>'
			+ '<br />'
			+ 'Tagi na #czarnolisto: <b>' + jQuery('div[data-type="hashtags"] .tagcard').length + '</b>'
			+ '<br />'
			+ 'Domeny na #czarnolisto: <b>' + jQuery('div[data-type="domains"] .tag').length + '</b>'
			+ '</div>');
	}

	function addNotesStats() {
		jQuery('#notesList').before(
			'<div style="width: 100%; padding: 25px; text-align: center">'
			+ 'Wszystkie notatki: <b>' + jQuery('#notesList li').length + '</b>'
			+ ', w tym o: <span class="color-2">bordo (<b>' + jQuery('#notesList .color-2').length + '</b>)</span>'
			+ ', <span class="color-1">pomarańczkach (<b>' + jQuery('#notesList .color-1').length + '</b>)</span>'
			+ ', <span class="color-0">zielonkach (<b>' + jQuery('#notesList .color-0').length + '</b>)</span>'
			+ ', <span class="color-1001">zbanowanych (<b>' + jQuery('#notesList .color-1001').length + '</b>)</span>'
			+ ', <span class="color-1002">ragequitach (<b>' + jQuery('#notesList .color-1002').length + '</b>)</span>'
			+ '</div>');
	}

	$(document).ready(function() {
		if (typeof loggedInNick === 'undefined') {
			return;
		}

		loadNotes();

		$(document).on('DOMNodeInserted', function(e) {
			if ($('.author .showProfileSummary b', $(e.target)).length > 0) {
				var nodes = $('.author .showProfileSummary b', $(e.target));

				for (var i = 0; i < nodes.length; i++) {
					node = $(nodes[i]);
					var nick = node.html().trim();

					if (typeof notes[nick] !== 'undefined') {
						if ($('.note2000', node.parent().parent()).length != 0) {
							continue;
						}

						$(node.parent().parent()).append('<span class="note2000 notesFor' + nick + '" style="padding-right: 55px; white-space: normal !important;">| ' + notes[nick] + '</span>');
					}
				}
			}
		});

		if (document.location.href.indexOf('ustawienia/czarne-listy') !== -1) {
			addBlackListsStats();
		}

		if (document.location.href.indexOf('moj/notatki-o-uzytkownikach') !== -1) {
			addNotesStats();
		}
	});
}

if (typeof $ == 'undefined') {
	if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
		// Firefox
		var $ = unsafeWindow.jQuery;
		main();
	} else {
		// Chrome
		addJQuery(main);
	}
} else {
	// Opera >.>
	main();
}

function addJQuery(callback) {
	var script = document.createElement("script");
	script.textContent = "(" + callback.toString() + ")();";
	document.body.appendChild(script);
}
