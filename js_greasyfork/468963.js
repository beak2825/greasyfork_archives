// ==UserScript==
// @name        EMF-Title-Fixer
// @description Add song name and artist to the page title on Educational Media Foundation sites
// @namespace   https://gitlab.com/RunningDroid/userscripts
// @homepageURL https://gitlab.com/RunningDroid/userscripts
// @supportURL  https://gitlab.com/RunningDroid/userscripts/-/issues/?label_name%5B%5D=EMF%20Title%20Fixer
// @match       https://listen.klove.com/
// @match       https://listen.air1.com/
// @grant       none
// @noframes
// @run-at      document-idle
// @version     1.1.0
// @author      Runningdroid
// @copyright   2023, Runningdroid
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/468963/EMF-Title-Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/468963/EMF-Title-Fixer.meta.js
// ==/UserScript==

// decide which site we're on early, because it (hopefully) won't change
if (location.hostname.includes('air1')) {
	site = 'Air1'
} else if (location.hostname.includes('klove')) {
	site = 'K-LOVE'
} else {
	console.log('Invalid site, all bets are off')
	site = 'Invalid'
}


// be safe to try and avoid excess errors
if (EMF.PlayerMetaData.update !== undefined) {
	// override the function in use so we don't have to resort to polling
	EMF.PlayerMetaData.update = function () {
		console.log('Update the songs on the page with data in the array'),
		$('.album-art').removeAttr('style'),
		console.log('song', EMF.PlayerMetaData.Songs[0]),
		$('#nowPlaying-image').attr('src', EMF.PlayerMetaData.Songs[0].Image),
		$('#nowPlaying-title').html(EMF.PlayerMetaData.Songs[0].Title),
		$('#nowPlaying-title').attr('data-songId', EMF.PlayerMetaData.Songs[0].SongId),
		$('#nowPlaying-title').attr('data-automationId', EMF.PlayerMetaData.Songs[0].AutomationId),
		$('#nowPlaying-songLink').attr('href', EMF.PlayerMetaData.Songs[0].SongLink),
		$('#nowPlaying-songLink-mobile').attr('href', EMF.PlayerMetaData.Songs[0].SongLink),
		$('#nowPlaying-artist').html(EMF.PlayerMetaData.Songs[0].Artist),
		$('#nowPlaying-artist').attr('data-artistId', EMF.PlayerMetaData.Songs[0].ArtistId),
		$('#nowPlaying-artistLink').attr('href', EMF.PlayerMetaData.Songs[0].ArtistLink),
		$('#nowPlaying-artistLink-mobile').attr('href', EMF.PlayerMetaData.Songs[0].ArtistLink),
		$('#nowPlaying-artistFacebook').attr('href', EMF.PlayerMetaData.Songs[0].ArtistFacebook),
		$('#nowPlaying-artistFacebook-dropdown-mobile').attr('href', EMF.PlayerMetaData.Songs[0].ArtistFacebook),
		$('#nowPlaying-artistTwitter').attr('href', EMF.PlayerMetaData.Songs[0].ArtistTwitter),
		$('#nowPlaying-artistTwitter-dropdown-mobile').attr('href', EMF.PlayerMetaData.Songs[0].ArtistFacebook),
		document.title = EMF.PlayerMetaData.Songs[0].Title + ' By ' + EMF.PlayerMetaData.Songs[0].Artist + ' On ' + site // the only new line
		EMF.PlayerMetaData.hideShow(),
		$('.last-played a').each(
			(
				function (t) {
					$(this).find('.song-title').html(EMF.PlayerMetaData.Songs[t + 1].Title),
					$(this).find('.song-artist').html(EMF.PlayerMetaData.Songs[t + 1].Artist),
					$(this).find('img').attr('src', EMF.PlayerMetaData.Songs[t + 1].Image),
					$(this).attr('href', EMF.PlayerMetaData.Songs[t + 1].SongLink)
				}
			)
		)
	}

	EMF.PlayerMetaData.init = function () {
	EMF.PlayerMetaData.Song.Image = $('#nowPlaying-image').attr('src'),
	EMF.PlayerMetaData.Song.Title = $('#nowPlaying-title').text(),
	EMF.PlayerMetaData.Song.SongId = $('#nowPlaying-title').attr('data-songId'),
	EMF.PlayerMetaData.Song.AutomationId = $('#nowPlaying-title').attr('data-automationId'),
	EMF.PlayerMetaData.Song.SongLink = $('#nowPlaying-songLink').attr('href'),
	EMF.PlayerMetaData.Song.ArtistId = $('#nowPlaying-artist').attr('data-artistId'),
	EMF.PlayerMetaData.Song.Artist = $('#nowPlaying-artist').text(),
	EMF.PlayerMetaData.Song.ArtistLink = $('#nowPlaying-artistLink').attr('href'),
	EMF.PlayerMetaData.Song.ArtistFacebook = $('#nowPlaying-artistFacebook').attr('href'),
	EMF.PlayerMetaData.Song.ArtistTwitter = $('#nowPlaying-artistTwitter').attr('href'),
	EMF.PlayerMetaData.Songs.push(EMF.PlayerMetaData.Song),
	document.title = EMF.PlayerMetaData.Songs[0].Title + ' By ' + EMF.PlayerMetaData.Songs[0].Artist + ' On ' + site // the only new line
	EMF.PlayerMetaData.hideShow(),
	$('.last-played a').each(
		(
			function (t) {
				var a = Object.create(EMF.PlayerMetaData.Song);
				a.Title = $(this).find('.song-title').text(),
				a.Artist = $(this).find('.song-artist').text(),
				a.Image = $(this).find('img').attr('src'),
				a.SongLink = $(this).attr('href'),
				EMF.PlayerMetaData.Songs.push(a)
			}
		)
	)
	}
} else {
	console.log('EMF.PlayerMetaData.update is undefined, overriding it is pointless.')
	console.log('If you see this message on klove.com or air1.com please report it at https://gitlab.com/RunningDroid/userscripts/-/issues')
}
