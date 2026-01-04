// ==UserScript==
// @name         Vidstack Player for LMS Thapar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  Enhance <video> elements with Vidstack player on LMS Thapar website
// @author       You
// @match        https://lms.thapar.edu/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495652/Vidstack%20Player%20for%20LMS%20Thapar.user.js
// @updateURL https://update.greasyfork.org/scripts/495652/Vidstack%20Player%20for%20LMS%20Thapar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Import styles
    var styleElement = document.createElement('link');
    styleElement.rel = 'stylesheet';
    styleElement.href = 'https://cdn.vidstack.io/player/theme.css';
    document.head.appendChild(styleElement);

    var videoStyleElement = document.createElement('link');
    videoStyleElement.rel = 'stylesheet';
    videoStyleElement.href = 'https://cdn.vidstack.io/player/video.css';
    document.head.appendChild(videoStyleElement);

    // Import elements
    var scriptElement = document.createElement('script');
    scriptElement.src = 'https://cdn.vidstack.io/player';
    scriptElement.type = 'module';
    document.body.appendChild(scriptElement);

    // Replace <video> elements with Vidstack player markup
    function replaceVideosWithVidstackPlayer() {
        var videos = document.querySelectorAll('video');
        videos.forEach(function(video) {
            var src = getVideoSource(video);
            if (src) {
                var poster = video.poster;
                var thumbnails = video.getAttribute('data-thumbnails');

                // Create <media-player> element
                var mediaPlayer = document.createElement('media-player');
                mediaPlayer.setAttribute('src', src);
                mediaPlayer.setAttribute('title', 'Video');
                mediaPlayer.setAttribute('poster', poster);

                // Create <media-provider> element
                var mediaProvider = document.createElement('media-provider');

                // Create <media-video-layout> element
                var mediaVideoLayout = document.createElement('media-video-layout');
                mediaVideoLayout.setAttribute('thumbnails', thumbnails);

                // Append elements to <media-player>
                mediaPlayer.appendChild(mediaProvider);
                mediaPlayer.appendChild(mediaVideoLayout);

                // Replace <video> with <media-player>
                video.parentNode.replaceChild(mediaPlayer, video);
            }
        });
    }

    // Function to retrieve video source
    function getVideoSource(video) {
        if (video.src) {
            return video.src;
        } else if (video.querySelector('source')) {
            return video.querySelector('source').src;
        }
        return null;
    }

    // Call replaceVideosWithVidstackPlayer() when the page is fully loaded
    window.addEventListener('load', function() {
        replaceVideosWithVidstackPlayer();
    });
})();
