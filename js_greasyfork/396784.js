// ==UserScript==
// @name           nHentai to E-H Mover 2
// @description    Quickly cross-search any gallery, and move favourites back to E-H/EX.
// @author         Hen Tie
// @homepage       https://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @include        https://nhentai.net/favorites/*
// @include        https://nhentai.net/g/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @icon           https://i.imgur.com/8bq1S92.jpg
// @version        2
// @downloadURL https://update.greasyfork.org/scripts/396784/nHentai%20to%20E-H%20Mover%202.user.js
// @updateURL https://update.greasyfork.org/scripts/396784/nHentai%20to%20E-H%20Mover%202.meta.js
// ==/UserScript==

var url = "https://e-hentai.org/?f_search="

if (/favorites/.test(window.location.pathname)) {
	moveFavourites()
} else {
	findGallery()
}

function moveFavourites() {
	var galTitle = []
	$('.gallery-favorite .caption').each(function(){
		var str = $(this).text();
		str = str.replace(/[\][(){}|~,."'!?+*%:$]/igm,' ') //replace search operators and punctuation/formatting characters
		str = str.replace(/ \w{1,2}\b/igm,'') //remove 1 or 2 char keywords, too short to search
		str = str.replace(/ {2,}/igm,' ') //compress 2+ spaces into just one
		str = str.replace(/^ (?=.*$)/igm,'') //remove leading space
		var isEng = str.match(/english/gi) //check for language
		if (isEng !== null) {
			str = str.replace(isEng[0],''); //remove lang
			str = isEng[0] + ' ' + str; //prepend lang
			str = str.replace(/ {2,}/igm,' ') //compress 2+ spaces into just one
		}
		galTitle.push(str);
	})
	$('.remove-button').each(function(i) {
		$(this).after(
			'<button class="btn btn-primary btn-thin" title="Search on Ex-Hentai">' +
			'<a href="' + url + galTitle[i] + '" target="_blank">' +
			'<i class="fa fa-external-link"></i>' +
			'</a>' +
			'</button>');
	})
}

function findGallery() {
	var str = $('h1').text()
	str = str.replace(/[\][(){}|~,."'!?+*%:$]/igm,' ') //replace search operators and punctuation/formatting characters
	str = str.replace(/ \w{1,2}\b/igm,'') //remove 1 or 2 char keywords, too short to search
	str = str.replace(/ {2,}/igm,' ') //compress 2+ spaces into just one
	str = str.replace(/^ (?=.*$)/igm,'') //remove leading space
	var isEng = str.match(/english/gi) //check for language
	if (isEng !== null) {
		str = str.replace(isEng[0],''); //remove lang
		str = isEng[0] + ' ' + str; //prepend lang
		str = str.replace(/ {2,}/igm,' ') //compress 2+ spaces into just one
	}
	$('#download').before('<a style="min-width:unset;" class="btn btn-primary" title="Search on Ex-Hentai" target="_blank" href="' + url + str + '"><i class="fa fa-external-link"></i></a>');
}