// ==UserScript==
// @name        WordPress - Sort My Favorites
// @version		0.2
// @author		Tim Berneman
// @copyright	Tim Berneman (c) 2015
// @namespace   wordpress_sort_my_favorites
// @description Sort WordPress favorites alphabetically.
// @include		/https?:\/\/profiles\.wordpress\.org\/(.*)#content-favorites\/?/
// @include		https://wordpress.org/plugins/browse/favorites/
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.js
// @run-at		document-end
//
// License: http://creativecommons.org/licenses/by-nc-sa/3.0/
//
// CHANGELOG:
// v0.1 ~ initial release - sort favorites on profiles.wordpress.org/username#content-favorites
// v0.2 ~ added more code - sort favorites on wordpress.org/plugins/browse/favorites/ as well
//
// @downloadURL https://update.greasyfork.org/scripts/12040/WordPress%20-%20Sort%20My%20Favorites.user.js
// @updateURL https://update.greasyfork.org/scripts/12040/WordPress%20-%20Sort%20My%20Favorites.meta.js
// ==/UserScript==

$(document).ready(function() {
	
	// For profiles.wordpress.org/username#content-favorites
	var sorted = $.makeArray($('#content-favorites .favorite-plugins ul li')).sort(function(a,b){
		return ( $(a).children('h3').text().trim() < $(b).children('h3').text().trim() ) ? -1 : 1;
	});
	$('#content-favorites .favorite-plugins ul').html(sorted);
	
	// For wordpress.org/plugins/browse/favorites
	var sorted = $.makeArray($('#the-list .plugin-card')).sort(function(a,b){
		return ( $(a).attr('class') < $(b).attr('class') ) ? -1 : 1;
	});
	$('#the-list').html(sorted);
});