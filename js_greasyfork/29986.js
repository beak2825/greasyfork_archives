// ==UserScript==
// @name        IMDb VodLocker Embeds
// @description Embeds vodlocker.to videos into IMDB
// @include     http://www.imdb.com/title/tt*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @version     1.0 
// @namespace https://greasyfork.org/users/126610
// @downloadURL https://update.greasyfork.org/scripts/29986/IMDb%20VodLocker%20Embeds.user.js
// @updateURL https://update.greasyfork.org/scripts/29986/IMDb%20VodLocker%20Embeds.meta.js
// ==/UserScript==
// 
jQuery(document).ready(function($) {
	var id = getMovieId();
	function getMovieId() {
		var id = location.pathname.match(/title\/tt(.*?)\//i)[1];
		return id;
	}
	var fh = '<div id="IMDbPlus"><hr>';
	fh += '<iframe src="http://vodlocker.to/embed?i='+id+'" width="640" height="360" allowscriptaccess="always" allowfullscreen="true" scrolling="no" frameborder="0"></iframe></div>';
	$((location.pathname.match(/combined/)) ? '#action-box' : '#title-overview-widget').append(fh);
});