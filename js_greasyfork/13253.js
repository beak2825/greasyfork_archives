// ==UserScript==
// @name        FollowShows Remaining
// @namespace   followshows
// @description Show a number of remaining episodes to watch
// @icon        http://followshows.com/favicon.ico
// @author      vBm <vbm@omertabeyond.com>
// @oujs:author vBm
// @license     The MIT License (MIT)
// @supportURL  https://github.com/vBm/snippets/issues
// @include     http://followshows.com/user/*
// @version     4.3
// @date        17/03/2015
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13253/FollowShows%20Remaining.user.js
// @updateURL https://update.greasyfork.org/scripts/13253/FollowShows%20Remaining.meta.js
// ==/UserScript==

$('#stats').append(
	$('<div>').append(
		$('<span>').attr({
			class: 'addic7ed'
		}),
		$('<div>').attr({
			class: 'title'
		}).css(
			'cursor', 'pointer'
		).click(
			function() {
				prompt('Total count:', textPrep());
			}
		).text('EPISODES TO WATCH')
	)
);

function textPrep() {
	var numbers = $('#stats').text().match(/\d+/g),
	shows = numbers[0],
	watched = numbers[3],
	remain = numbers[4];
	return 'FollowShows stats: ' + shows + ' shows || ' + watched + ' episodes watched || ' + remain + ' episodes to watch';
}

if (!$('a.btn-follow-user').attr('user')) {
	$.ajax({
		url: '//' + document.location.hostname + '/home/watchlist',
		cache: false,
	}).done(function(data) {
		var totalEpisodesSum, totalEpisodes = [];
		if ($(data).find('.stats').size() !== 0 ) {
			$(data).find('.stats').each(function() {
				totalEpisodes.push(parseInt($(this).text().match(/\d+/)[0], 10));
			});
			totalEpisodesSum = totalEpisodes.reduce(function(a, b) {
				return a + b;
			});
			$('.addic7ed').text(totalEpisodesSum);
		} else {
			$('.addic7ed').text('N/A');
		}
	});
} else {
	$('.addic7ed').text('N/A');
}
