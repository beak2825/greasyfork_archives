// ==UserScript==
// @name        TVMaze Subtitles
// @namespace   tvmaze
// @description Link addic7ed subs
// @icon        http://tvmazecdn.com/images/favico/favicon.ico
// @author      vBm <vbm@omertabeyond.com>
// @oujs:author vBm
// @license     The MIT License (MIT)
// @supportURL  https://github.com/vBm/snippets/issues
// @include     http://www.tvmaze.com/episodes/*
// @version     0.1.1
// @date        19/10/2015
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13255/TVMaze%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/13255/TVMaze%20Subtitles.meta.js
// ==/UserScript==

var showInfoName = $('div#general-info-panel').find('p').first().find('a').text();

var showInfoRegex = /Number\:.*(\d+).*\n\s+Episode.(\d+)/g;
var match = showInfoRegex.exec($('div#general-info-panel p')[0].innerHTML);

var showInfoSeason = match[1];
var showInfoEpisode = match[2];
var showInfoEpisodeName = $('header h1').text();

// Due to different names either one of pages use we have to create an array to circumvent around it.
var addic7ed = {
	'Legends': 'Legends_(2014)',
	'The Flash': 'The Flash (2014)',
	'House Of Cards': 'House_of_Cards_(2013)',
	'Secrets & Lies': 'Secrets and Lies'
};

showInfoName = addic7ed[showInfoName] || showInfoName;

var subtitlesUrl = 'http://www.addic7ed.com/serie/'+showInfoName+'/'+showInfoSeason+'/'+showInfoEpisode+'/'+showInfoEpisodeName;
console.log(subtitlesUrl);

$('#main-img').append(
	$('<a>').attr({
		id: 'watching',
		class: 'radius small button secondary addic7ed',
		target: '_blank',
		style: 'margin-top: 3px'
	}).text(' Addic7ed subs').click(
		function() {
			window.open(subtitlesUrl);
	})
);

$('<i class="fa fa-download"></i>').prependTo('.addic7ed');
