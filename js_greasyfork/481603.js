// ==UserScript==
// @name         Deezer Enhancements
// @namespace    http://schuppentier.org
// @version      2024-03-18
// @description  Search Genius for the currently playing song and open song.link page for easier sharing
// @author       Dennis
// @match        https://www.deezer.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deezer.com
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481603/Deezer%20Enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/481603/Deezer%20Enhancements.meta.js
// ==/UserScript==

/* global dzPlayer */
(function() {
    'use strict';

    GM_registerMenuCommand('Search for song in Genius', () => {
		const currentSong = dzPlayer.getCurrentSong();
        const searchString = `${currentSong.SNG_TITLE} ${currentSong.ART_NAME}`;
        const geniusUrl = `https://genius.com/search?q=${encodeURIComponent(searchString)}`;
        window.open(geniusUrl, "_blank");
	});

    function odesli(itunesJson) {
        const currentSongTitle = dzPlayer.getCurrentSong().SNG_TITLE;

        const matchingSongs = itunesJson.results.filter((item) => item.trackName === currentSongTitle);
        const songId = matchingSongs[0].trackId;
        const odesliUrl = `https://song.link/i/${songId}`;

        window.open(odesliUrl, "_blank");
        navigator.clipboard.setText(odesliUrl);
    }

    var callbackFunctionTag = document.createElement('SCRIPT');
    callbackFunctionTag.textContent = odesli.toString();

    document.getElementsByTagName('HEAD')[0].appendChild(callbackFunctionTag);

    GM_registerMenuCommand('Open song.link page', () => {
        const currentSong = dzPlayer.getCurrentSong();
        const currentSongTitle = currentSong.SNG_TITLE;
        const currentSongArtist = currentSong.ART_NAME;

        var scriptTag = document.createElement('SCRIPT');
        scriptTag.src = `https://itunes.apple.com/search?term=${encodeURIComponent(currentSongTitle)}%20${encodeURIComponent(currentSongArtist)}&country=DE&entity=song&callback=odesli`;

        document.getElementsByTagName('HEAD')[0].appendChild(scriptTag);
    });
})();