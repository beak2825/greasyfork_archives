// ==UserScript==
// @name         Redacted :: Add Last Role
// @namespace    https://greasyfork.org/en/scripts/371713-redacted-add-last-role
// @version      1.1
// @description  Use the last Artist Role when adding the next Artist.
// @author       newstarshipsmell
// @include      /https://redacted\.ch/requests\.php\?action=new(?!&groupid=\d+)/
// @include      /https://redacted\.ch/upload\.php(?!\?groupid=\d+)/
// @include      /https://redacted\.ch/torrents\.php\?(page=\d+&)?id=\d+(&torrentid=\d+)?(#comments)?/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371713/Redacted%20%3A%3A%20Add%20Last%20Role.user.js
// @updateURL https://update.greasyfork.org/scripts/371713/Redacted%20%3A%3A%20Add%20Last%20Role.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var pageType = location.pathname.split('/')[1].split('.php')[0];
	var addArtistBtn = document.querySelector('a[onclick^="AddArtistField"]');
	addArtistBtn.setAttribute('href', 'javascript:void(0);');
	addArtistBtn.onclick = function(){
		switch(pageType) {
			case 'torrents':
				artistCnt = window.ArtistFieldCount;
				var addArtists = document.getElementById('AddArtists');
				var lastRole = artistCnt == 1 ? addArtists.lastChild.previousSibling : addArtists.lastChild;
				var lastRoleNum = lastRole.selectedIndex;
				window.eval('AddArtistField();');
				artistCnt = window.ArtistFieldCount;
				var newRole = addArtists.lastChild;
				newRole.selectedIndex = lastRoleNum;
				break;
			case 'upload':
				window.eval('AddArtistField();');
				var artistCnt = window.eval('ArtistCount');
				var roles = window.importance;
				roles[artistCnt - 1].selectedIndex = roles[artistCnt - 2].selectedIndex;
				break;
			case 'requests':
				window.eval('AddArtistField();');
				artistCnt = document.getElementsByName("artists[]").length;
				roles = window.importance;
				roles[artistCnt - 1].selectedIndex = roles[artistCnt - 2].selectedIndex;
				break;
			default:
		}
	};
})();