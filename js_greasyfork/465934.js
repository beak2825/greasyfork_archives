// ==UserScript==
// @name         Disable YouTube Autoplay on Homepage
// @namespace    http://yourdomainhere/
// @version      1
// @description  Disables automatic video playback on the YouTube homepage and displays only the video thumbnails.
// @author       Agnar
// @match        https://www.youtube.com/
// @grant        none
// @license      CC-BY-NC
// @downloadURL https://update.greasyfork.org/scripts/465934/Disable%20YouTube%20Autoplay%20on%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/465934/Disable%20YouTube%20Autoplay%20on%20Homepage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find all video thumbnails on the homepage
    var videos = document.querySelectorAll('#contents ytd-rich-item-renderer');

    // Loop through each video and remove the autoplay attribute
    videos.forEach(function(video) {
        video.removeAttribute('autoplay');
    });

    // Disable the autoplay of the first video in the recommended videos section
    var recommendedVideo = document.querySelector('#contents #items ytd-compact-autoplay-renderer video');
    if (recommendedVideo) {
        recommendedVideo.removeAttribute('autoplay');
    }

    // Disable the autoplay of the first video in the up next section
    var upNextVideo = document.querySelector('#secondary #items ytd-compact-autoplay-renderer video');
    if (upNextVideo) {
        upNextVideo.removeAttribute('autoplay');
    }

    // Remove all video player elements on the page
    var players = document.querySelectorAll('ytd-player');
    players.forEach(function(player) {
        player.remove();
    });

    // Remove all video overlay elements on the page
    var overlays = document.querySelectorAll('.ytd-thumbnail-overlay-playback-status-renderer');
    overlays.forEach(function(overlay) {
        overlay.remove();
    });
})();