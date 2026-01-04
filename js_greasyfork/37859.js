// ==UserScript==
// @name           Trakt Rotten Tomatoes Link and Info
// @namespace      https://greasyfork.org/en/users/7864-curtis-gibby
// @description    Add link on Trakt movie pages to search that title on Rotten Tomatoes
// @version  1.0.3
// @grant    none
// @include        https://trakt.tv/movies/*
// @downloadURL https://update.greasyfork.org/scripts/37859/Trakt%20Rotten%20Tomatoes%20Link%20and%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/37859/Trakt%20Rotten%20Tomatoes%20Link%20and%20Info.meta.js
// ==/UserScript==

// ==Test Cases ==
// https://trakt.tv/movies/inception-2010 -- Inception (2010) -- Certified Fresh (trophy)
// https://trakt.tv/movies/cars-3-2017 -- Cars 3 (2017) -- Fresh (check)
// https://trakt.tv/movies/troll-2-1990 -- Troll 2 (1990) -- Rotten (ban)
// https://trakt.tv/movies/we-love-you-sally-carmichael-2017 -- We Love You, Sally Charmichael (2017) -- Unknown (exclamation mark)
// https://trakt.tv/movies/wonder-2017 -- Wonder (2017) -- *not* Wonder Woman (2017)

var title = document.querySelectorAll("a.btn-checkin")[0].getAttribute('data-top-title');
var year = parseInt(document.querySelectorAll('meta[property="og:title"]')[0].getAttribute('content').match(/\(([0-9]{4})\)/)[1]);
imdbLink = document.querySelectorAll("a[href^='http://www.imdb.com']")[0];

var rottenTomatoesLink = imdbLink.cloneNode(true);
rottenTomatoesLink.href = 'https://duckduckgo.com/?q=site%3Arottentomatoes.com+' + encodeURIComponent(title) + '+' + year + '+!&t=hg';
var apiUrl = 'http://www.omdbapi.com/?i=' + getImdbId(imdbLink) + '&apikey=f8e72126';

rottenTomatoesLink.setAttribute('data-original-title', 'Checking OMDb API...');

rottenTomatoesLink.innerHTML = 'Rotten Tomatoes <i class="fa fa-spinner fa-spin"></i>';

imdbLink.parentNode.appendChild(rottenTomatoesLink);

var newXHR = new XMLHttpRequest();
newXHR.addEventListener( 'load', parseValidResponse );
newXHR.addEventListener("error", transferFailed);
newXHR.open( 'GET', apiUrl );
newXHR.send();

function updateError() {
	rottenTomatoesLink.setAttribute('data-original-title', 'Error getting RT data');
	rottenTomatoesLink.innerHTML = 'Rotten Tomatoes <i class="fa fa-exclamation-circle"></i>';
}

function transferFailed(e) {
	updateError();
}

function parseValidResponse() {
	data = JSON.parse(this.response);
	updateError();
	if (data.length == 0 || data.Ratings.length == 0) {
		return false;
	}

	Object.keys(data.Ratings).forEach(function(key) {
		rating = data.Ratings[key];
		if (rating.Source == 'Rotten Tomatoes') {
			var ratingNumber = parseInt(rating.Value);
			var altText = rating.Value;
			rtIcon = 'ban';
			if (ratingNumber == null) {
				rtIcon = 'question-circle';
			}
			if (ratingNumber > 60) {
				rtIcon = 'check';
			}
			if (ratingNumber > 75) {
				rtIcon = 'trophy';
			}

			rottenTomatoesLink.innerHTML = 'Rotten Tomatoes <i class="fa fa-' + rtIcon + '"></i>';
			rottenTomatoesLink.setAttribute('data-original-title', altText);
			return true;
		}
	});
}

function getImdbId(imdbLink) {
	return 'tt' + imdbLink.getAttribute("href").split('/tt')[1];
}