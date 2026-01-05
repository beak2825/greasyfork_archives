// ==UserScript==
// @name        MyShows: sort serials
// @namespace   https://github.com/powerman/userjs-myshows
// @description Sort serials in alphabetic order on myshows.me
// @include     http://myshows.me/profile/
// @include     https://myshows.me/profile/
// @match       http://myshows.me/profile/
// @match       https://myshows.me/profile/
// @version     3.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2517/MyShows%3A%20sort%20serials.user.js
// @updateURL https://update.greasyfork.org/scripts/2517/MyShows%3A%20sort%20serials.meta.js
// ==/UserScript==

window.addEventListener('load', function(){
	'use strict';

	function sort_shows(){
		// sort lists at right panel
		$('ul.firmList').html(function(){
			return $(this).children().sort(function(a,b){
				return $(a).text() < $(b).text() ? -1 : 1;
			});
		});
		// sort main content
		$('main').html(function(){
			return $(this).children(':first-child').nextUntil('h2').andSelf().add(
				$(this).find('h2').map(function(){
					return $(this).nextUntil('h2').andSelf();
				}).sort(function(a,b){
					return a.first().find('a').text() < b.first().find('a').text() ? -1 : 1;
				}).map(function(){
					return this.map(function(){
						// .add() above re-order
						// added items if they're
						// jQuery/DOM objects, map
						// them to strings to
						// keep current order
						return this.outerHTML;
					}).get();
				})
			).get();
		});
		// ... and move AD to the end
		$('main hr').prevUntil('.seasonBlock, p, h2, h1').andSelf().remove().appendTo('main');
	}

	var rate_handler = jQuery._data($('.rate-episode').get(0)).events.click[0].handler;
	sort_shows();
	$('.rate-episode').bind('click', rate_handler);
	// from document.ready handler
	$('div.seasonBlock').each(function () {
		siteSeasonBlock = new SeasonBlock();
		siteSeasonBlock.init($(this));
	});

}, false);
