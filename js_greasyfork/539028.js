// ==UserScript==
// @name         animepahe anti spoiler
// @version      1.0
// @description  blackout episode thumbnails in both browsing an anime and player but leave homepage alone
// @author       imyourhuckleberry6
// @match        https://animepahe.com/anime/*
// @match        https://animepahe.org/anime/*
// @match        https://animepahe.ru/anime/*
//
// @match        https://animepahe.com/play/*
// @match        https://animepahe.org/play/*
// @match        https://animepahe.ru/play/*
// @icon         https://animepahe.ru/favicon-96x96.png
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1481739
// @downloadURL https://update.greasyfork.org/scripts/539028/animepahe%20anti%20spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/539028/animepahe%20anti%20spoiler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function blackOutThumbnails() {
        var thumbnails = document.getElementsByClassName("episode-snapshot");
        for (var thumbnail of thumbnails) {
            thumbnail.style.border = "4px solid white";
            thumbnail.style.position = "relative";

            var overlay = document.createElement("div");
            overlay.style.position = "absolute";
            overlay.style.top = 0;
            overlay.style.left = 0;
            overlay.style.width = "100%";
            overlay.style.height = "100%";
            overlay.style.backgroundColor = "#331a00";
            overlay.style.zIndex = 1;
            overlay.style.pointerEvents = "none";

            thumbnail.appendChild(overlay);
        }
    }

    function blackOutNextEpisodeImage() {
        var nextEpLink = document.querySelector('a[title="Play Next Episode"]');
        if (!nextEpLink) return;

        nextEpLink.style.position = "relative";
        nextEpLink.style.border = "4px solid white";
        nextEpLink.style.display = "inline-block";

        var overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "black";
        overlay.style.zIndex = 1;
        overlay.style.pointerEvents = "none";

        nextEpLink.appendChild(overlay);
    }

	function blackOutPrevEpisodeImage() {
        var prevEpLink = document.querySelector('a[title="Play Previous Episode"]');
        if (!prevEpLink) return;

        prevEpLink.style.position = "relative";
        prevEpLink.style.border = "4px solid white";
        prevEpLink.style.display = "inline-block";

        var overlay = document.createElement("div");
        overlay.style.position = "absolute";
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "black";
        overlay.style.zIndex = 1;
        overlay.style.pointerEvents = "none";

        prevEpLink.appendChild(overlay);
    }

    // Wait until 3 types of elements are available before applying effects
    var checkLoaded = setInterval(function() {
        var thumbReady = document.getElementsByClassName("episode-snapshot")[0];
        var nextEpReady = document.querySelector('a[title="Play Next Episode"]');
		var prevEpReady = document.querySelector('a[title="Play Previous Episode"]');
        if (thumbReady || nextEpReady || prevEpReady) {
            if (thumbReady) blackOutThumbnails();
            if (nextEpReady) blackOutNextEpisodeImage();
			if (prevEpReady) blackOutPrevEpisodeImage();
            clearInterval(checkLoaded);
        }
    }, 100);
})();
