// ==UserScript==
// @name           IMDb Trakt Link
// @namespace		https://greasyfork.org/en/users/7864-curtis-gibby
// @description    Add link on IMDb movie pages to that title's page on Trakt
// @grant			none
// @version			1.0.1
// @include			http*://*.imdb.com/title/*/*
// @include			http*://*.imdb.com/title/*/#*
// @include			http*://*.imdb.com/title/*/combined*
// @include			http*://*.imdb.com/title/*/maindetails*
// @include			http*://imdb.com/title/*/*
// @include			http*://imdb.com/title/*/#*
// @include			http*://imdb.com/title/*/combined*
// @include			http*://imdb.com/title/*/maindetails*
// @downloadURL https://update.greasyfork.org/scripts/374639/IMDb%20Trakt%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/374639/IMDb%20Trakt%20Link.meta.js
// ==/UserScript==

var topNav = document.getElementById('imdbHeader');
var linkPadding = 3;
var linkTop = topNav.offsetHeight + linkPadding;

var link = document.createElement('a');
link.href = 'https://trakt.tv/search/imdb?q=tt' + getIMDBid();
link.setAttribute('target','_blank');
link.innerHTML = '<img src="https://walter.trakt.tv/hotlink-ok/public/favicon.ico" alt="Search Trakt.tv" style="width: 16px; height: 16px;"/>';
link.style.position = 'absolute';
link.style.top = linkTop + 'px';
link.style.right = linkPadding + 'px';
document.body.appendChild(link);


function getIMDBid () {
	var regexImdbNum = /\/title\/tt(\d{7})\//;
	id = regexImdbNum.exec(document.location);
	return id[1];
}
