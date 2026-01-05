// ==UserScript==
// @name        FollowShows Subtitles
// @namespace   followshows
// @description Link addic7ed subs
// @icon        http://followshows.com/favicon.ico
// @author      vBm <vbm@omertabeyond.com>
// @oujs:author vBm
// @license     The MIT License (MIT)
// @supportURL  https://github.com/vBm/snippets/issues
// @include     http://followshows.com/show/*
// @include     http://www.followshows.com/show/*
// @version     1.7.5.8
// @date        30/03/2015
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13254/FollowShows%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/13254/FollowShows%20Subtitles.meta.js
// ==/UserScript==

var showInfoName = $('div#top-link a').first().text();
var showInfoSeasonDummy = $('#top-link').find('h1').first().text().match(/(\d+)/g);
var showInfoSeason = showInfoSeasonDummy[0].replace(/\D/g, '').replace(/^0+/, '');
var showInfoEpisode = showInfoSeasonDummy[1].replace(/\D/g, '').replace(/^0+/g, '');
var showInfoEpisodeName = $('.episode-title').text();

// Due to different names either one of pages use we have to create an array to circumvent around it.
var addic7ed = {
	'Legends (TNT)': 'Legends_(2014)',
	'Äkta Människor': 'Real_Humans_(Äkta_Människor)',
	'The Game (2014)': 'The Game (UK)',
	'The Librarians (US)': 'The Librarians (2014)',
	'The Royals (2015)': 'The Royals (E)',
	'Undateable (2013)': 'Undateable (2014)',
	'Secrets & Lies (ABC)': 'Secrets and Lies',
	'House of Cards (2012)': 'House of Cards (2013)'
};

showInfoName = addic7ed[showInfoName] || showInfoName;

var subtitlesUrl = 'http://www.addic7ed.com/serie/'+showInfoName+'/'+showInfoSeason+'/'+showInfoEpisode+'/'+showInfoEpisodeName;

$('.buttons').append(
	$('<a>').attr({
		class: 'btn btn-success addic7ed',
		target: '_blank'
	}).text(' Addic7ed subs').click(
		function() {
			window.open(subtitlesUrl);
	})
);

$('<i class="fa fa-download"></i>').prependTo('.addic7ed');
