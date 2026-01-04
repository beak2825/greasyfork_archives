// ==UserScript==
// @name           nHentai Full color Filter button
// @description    Adds quick Full color filter to nHentai pages. (Rewrite of English only userscript made by Hen-tie)
// @author         equmaq
// @homepage       https://www.youtube.com/channel/UCyH7P_PFfmVRXNmFbwkYqcw
// @namespace      https://greasyfork.org/en/users/8336990886
// @include        /https:\/\/nhentai\.net\/(parody|favorites|artist|tag|group|category|search)\/(?!.*full color)/
// @icon           https://i.imgur.com/pGYy5SR.png
// @version        5.2
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461164/nHentai%20Full%20color%20Filter%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/461164/nHentai%20Full%20color%20Filter%20button.meta.js
// ==/UserScript==
var pathname = window.location.pathname;
var namespaceQuery = window.location.pathname.split('/')[2];
var searchQuery = window.location.search.split('=')[1];
var namespaceSearchLink = '<div class="sort-type"><a href="https://nhentai.net/search/?q=' + namespaceQuery + '+full color">Full color</a></div>';
var siteSearchLink = '<div class="sort-type"><a href="https://nhentai.net/search/?q=' + searchQuery + '+full color">Full color</a></div>';
var favSearchBtn = '<a class="btn btn-primary" href="https://nhentai.net/favorites/?q=full color+' + searchQuery + '"><i class="fa fa-flag"></i> ENG</a>';
var favPageBtn = '<a class="btn btn-primary" href="https://nhentai.net/favorites/?q=full color+"><i class="fa fa-flag"></i> ENG</a>';

if (/\/(artist|tag|group|category|parody)\//.test(pathname)) { // namespace searches
	document.getElementsByClassName('sort')[0].innerHTML += namespaceSearchLink;
} else if (/\/search\//.test(pathname)) { // general searches
	document.getElementsByClassName('sort')[0].innerHTML += siteSearchLink;
} else if (/\/favorites\//.test(pathname)) { // fav searches
	if (window.location.search.length) {
		document.getElementById('favorites-random-button').insertAdjacentHTML('afterend', favSearchBtn);
	} else {
		document.getElementById('favorites-random-button').insertAdjacentHTML('afterend', favPageBtn);
	}
}