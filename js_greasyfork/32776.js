// ==UserScript==
// @name        Youtube Playlist Link Fix
// @namespace   https://greasyfork.org/users/151127-zeksm
// @description Changes the playlist links on YouTube's playlist overview pages so that clicking them shows the page for the playlist in question instead of playing its first video (in other words, restores the old behaviour).
// @include     https://youtube.com/*
// @include     https://www.youtube.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32776/Youtube%20Playlist%20Link%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/32776/Youtube%20Playlist%20Link%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    replaceLinks();

    var body = document.getElementsByTagName("body")[0];
    body.addEventListener("yt-navigate-finish", function(e) {
        replaceLinks();
    });

    function replaceLinks() {
        if (location.href.indexOf("playlists") !== -1) {
            var links = document.querySelectorAll("a.ytd-grid-playlist-renderer");
            for (var i=0,imax=links.length; i<imax; i++) {
                var url = links[i].href;
                var playlistID = url.split("list=")[1];
                links[i].href = "https://www.youtube.com/playlist?list=" + playlistID;
                links[i].outerHTML = links[i].outerHTML;
            }
        }
    }
})();