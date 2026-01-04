// ==UserScript==
// @name           nHentai to E-H Mover
// @description    Quickly cross-search any gallery, and move favourites back to E-H/EX.
// @author         Hen-Tie
// @homepage       https://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @include        https://nhentai.net/favorites/*
// @include        https://nhentai.net/g/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @icon           https://i.imgur.com/8bq1S92.jpg
// @version        2.1
// @downloadURL https://update.greasyfork.org/scripts/372613/nHentai%20to%20E-H%20Mover.user.js
// @updateURL https://update.greasyfork.org/scripts/372613/nHentai%20to%20E-H%20Mover.meta.js
// ==/UserScript==
$(function(){
	if (/favorites/.test(window.location.pathname)) {
		moveFavourites()
	} else {
		crossSearch()
	}

	function moveFavourites() {
		$('.gallery-favorite').each(function() {
			var rawTitle = $(this).find('.caption').text();
			$(this).find('.remove-button').after(
				'<button class="btn btn-primary btn-thin" title="Search on Ex-Hentai">' +
				'<a href="' + cleanTitle(rawTitle) + '" style="min-width:1em;">' +
				'<i class="fa fa-external-link-alt"></i>' +
				'</a>' +
				'</button>');
		})
	}

	function crossSearch() {
		var rawTitle = $('h1').text();
		$('#download').before('<a style="min-width:3em;" class="btn btn-primary" title="Search on Ex-Hentai" href="' + cleanTitle(rawTitle) + '"><i class="fa fa-external-link-alt"></i></a>');
	}

	function cleanTitle(str) {
		var url = "https://exhentai.org/?f_search=";
		str = str.replace(/[\][(){}|~,."'!?+*%:$]/igm,' ') //replace search operators and punctuation/formatting characters
		str = str.replace(/ \w{1,2} /igm,' ') //remove 1 or 2 char keywords, too short to search
		str = str.replace(/ {2,}/igm,' ') //compress 2+ spaces into just one
		str = str.replace(/^ (?=.*$)/igm,'') //remove leading space
		var isEng = str.match(/english/gi) //check for language
		if (isEng !== null) {
			str = str.replace(isEng[0],'') //remove lang
			str = isEng[0] + ' ' + str //prepend lang
			str = str.replace(/ {2,}/igm,' ') //compress 2+ spaces into just one
		}
		return str = url + str
	}
});