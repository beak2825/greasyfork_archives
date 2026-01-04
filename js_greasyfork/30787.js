// ==UserScript==
// @name            MyAnimeList.net: All My Friend's Entries
// @version         0.1.2
// @description	    Add the "All My Friend's Entries" box from the stats page in anime or manga details.
// @include         https://myanimelist.net/anime*
// @include         https://myanimelist.net/manga*
// @namespace       https://greasyfork.org/users/134346
// @downloadURL https://update.greasyfork.org/scripts/30787/MyAnimeListnet%3A%20All%20My%20Friend%27s%20Entries.user.js
// @updateURL https://update.greasyfork.org/scripts/30787/MyAnimeListnet%3A%20All%20My%20Friend%27s%20Entries.meta.js
// ==/UserScript==

(function() { if (typeof jQuery == 'undefined') $ = unsafeWindow.$;

var pos = $('h2:contains(Reviews)');
if (!pos.length) return;

var curlink = window.location.toString();
var statslink = '';
if (curlink.lastIndexOf('?') != -1) {statslink = curlink.substring(0, curlink.lastIndexOf('?')) + '/stats';}
else {statslink = curlink + '/stats';}

$.get(statslink, function (data) {
	var link = $('a[name=members]', $(data).children());
	if (!link) return;
	var next = link.nextAll();
	pos.before(link).before(next);
	if (next.length == 1)
		pos.before($('<div style="margin:10px 0"/>').append('No users found with this Anime/Manga in their list.')).before('<br/>');
});

})();