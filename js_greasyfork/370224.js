// ==UserScript==
// @name         Direct Playlist Links for Youtube
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Simple script to change youtube playlist links (on the play list page under channels) to go directly to the playlist instead of the first video.
// @author       Son_Of_Diablo
// @include         *://*.youtube.com/channel/*/playlists
// @include         *://youtube.com/channel/*/playlists
// @include         *://*.youtube.com/user/*/playlists
// @include         *://youtube.com/user/*/playlists
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370224/Direct%20Playlist%20Links%20for%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/370224/Direct%20Playlist%20Links%20for%20Youtube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var playlists = document.getElementsByClassName("yt-simple-endpoint style-scope ytd-grid-playlist-renderer");
    var playlists2 = document.getElementsByClassName("yt-simple-endpoint style-scope ytd-playlist-thumbnail");
    for (var i = 0; i < playlists.length; i++) {
        changeUrls(playlists[i]);
    }

    for (var i2 = 0; i2 < playlists2.length; i2++) {
        changeUrls(playlists2[i2]);
    }

    function changeUrls(playlist){
    	var tmpUrl = playlist.href;
    	var index = tmpUrl.indexOf("&");
    	playlist.href = "/playlist?" + tmpUrl.substring(index + 1);
    }
})();