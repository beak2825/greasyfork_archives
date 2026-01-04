// ==UserScript==
// @name        Trakt Progress What's Next
// @namespace   http://userscripts.org/users/6623
// @description Show Trakt Progress page with least-recently watched first and only show pending episodes
// @include     https://trakt.tv/users/curtisgibby/progress?pending=*
// @version     2.0.18
// @downloadURL https://update.greasyfork.org/scripts/35293/Trakt%20Progress%20What%27s%20Next.user.js
// @updateURL https://update.greasyfork.org/scripts/35293/Trakt%20Progress%20What%27s%20Next.meta.js
// ==/UserScript==

var progressList = document.getElementById('progress-wrapper').childNodes[0];
var progressShows = Array.prototype.slice.call(document.querySelectorAll('div.row[data-type="show"]'));

var curtisShows = [
	'atlanta',
	'black-mirror',
	'bob-s-burgers',
	'bojack-horseman',
	'devs',
  'disenchantment',
	'drop-dead-diva',
	'elementary',
	'last-week-tonight-with-john-oliver',
	'marvel-s-agents-of-s-h-i-e-l-d',
	'middleditch-schwartz',
	'money-heist',
	'mr-robot',
	'mystery-science-theater-3000',
	'rick-and-morty',
	'schitt-s-creek',
	'star-trek-discovery',
	'star-trek-picard',
  'stranger-things',
	'strike-2017',
	'the-flash-2014',
	'the-good-wife',
  'the-queen-s-gambit',
	'the-simpsons',
	'the-west-wing',
	'the-wonder-years',
	'tom-clancy-s-jack-ryan',
	'the-twilight-zone-2019',
];

var displayOnlyCurtisShows = false;
if (window.location.search.indexOf('curtis') > -1) {
	displayOnlyCurtisShows = true;
}

for (var i = progressShows.length -1; i>=0; i--) {
	var showUrl = progressShows[i].getAttribute("data-url");

	var showSlug = showUrl.replace('/shows/', '');

	var isCurtisShow = (curtisShows.indexOf(showSlug) > -1);

	var displayShow = true;
	if (displayOnlyCurtisShows) {
		if (!isCurtisShow) {
			displayShow = false;
		}
	} else {
		if (isCurtisShow) {
			displayShow = false;
		}
	}

	if (progressShows[i].getAttribute("data-percentage") == "100") {
		displayShow = false;
	}

	if (displayShow) {
		progressList.appendChild(progressShows[i]);
	} else {
		removeMe('div.row[data-url="' + showUrl + '"]');
	}
}

function removeMe(selector) {
	var elem = document.querySelector(selector);
	elem.remove();
}

removeMe(".pagination-bottom");
removeMe("#main-search");
removeMe("footer");
removeMe("#cover-wrapper");

window.scrollTo(0, 1);