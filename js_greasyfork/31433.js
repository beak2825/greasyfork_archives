// ==UserScript==
// @name          Flickr - AUTO Video Play / Replay v.5
// @version       v.6
// @description	  Video Auto Play and Replay - by IA DuckDuckDo (Adaptation for Gm "Utags")
// @icon          https://external-content.duckduckgo.com/ip3/blog.flickr.net.ico
// @namespace     https://greasyfork.org/fr/users/8-decembre?sort=updated
// @include       https://www.flickr.com/photos/*
// @exclude	  http*://*flickr.com/photos/*/favorites*
// @exclude	  http*://*flickr.com/photos/*/favorites/*
// @exclude	  http*://*flickr.com/photos/*/albums*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/31433/Flickr%20-%20AUTO%20Video%20Play%20%20Replay%20v5.user.js
// @updateURL https://update.greasyfork.org/scripts/31433/Flickr%20-%20AUTO%20Video%20Play%20%20Replay%20v5.meta.js
// ==/UserScript==

// Flickr - AUTO Video Play / Replay v.5 (delete Flickr - Video AUTO Play / Replay v.10 because this one is better)

// Muting the video before playing it is a good workaround for the autoplay policy issue
function loadScript(url, callback) {
  var script = document.createElement('script');
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

loadScript('https://code.jquery.com/jquery-3.6.0.min.js', function() {
  (function($) {
    'use strict';

    console.log('Script loaded');

    // Function to check if the modal is open
    function isModalOpen() {
      return $('.browser_extension_settings_container:visible, .utags_modal:visible').length > 0;
    }

    // Wait for the video element to be loaded
    var videoElement = document.querySelector('.fluid.html-photo-page-scrappy-view video#video_1_html5_api');
    if (videoElement) {
      console.log('Video element found');
      // Set the video to auto play and loop
      videoElement.autoplay = true;
      videoElement.loop = true;
      videoElement.muted = true; // Mute the video
      videoElement.volume = 0.5;

      console.log('Auto-play and loop properties set');

      // Add an event listener to play the video when the user interacts with it
      videoElement.addEventListener('click', function() {
        if (!isModalOpen()) {
          this.play();
        }
      });

      // Add an event listener to replay the video when it ends
      videoElement.addEventListener('ended', function() {
        if (!isModalOpen()) {
          this.play();
        }
      });

      // Add an event listener to handle volume control
      videoElement.addEventListener('volumechange', function() {
        this.muted = false;
      });

      // Play the video
      if (!isModalOpen()) {
        videoElement.play();
      }

      console.log('Video played');
    } else {
      console.log('Video element not found');

      // If the video element is not found, wait for it to be loaded
      var intervalId = setInterval(function() {
        if (isModalOpen()) {
          return;
        }
        var videoElement = document.querySelector('.fluid.html-photo-page-scrappy-view video#video_1_html5_api');
        if (videoElement) {
          console.log('Video element found after interval');

          // Set the video to auto play and loop
          videoElement.autoplay = true;
          videoElement.loop = true;
          videoElement.muted = true; // Mute the video
          videoElement.volume = 0.5;

          console.log('Auto-play and loop properties set after interval');

          // Add an event listener to play the video when the user interacts with it
          videoElement.addEventListener('click', function() {
            if (!isModalOpen()) {
              this.play();
            }
          });

          // Add an event listener to replay the video when it ends
          videoElement.addEventListener('ended', function() {
            if (!isModalOpen()) {
              this.play();
            }
          });

          // Add an event listener to handle volume control
          videoElement.addEventListener('volumechange', function() {
            this.muted = false;
          });

          // Play the video
          if (!isModalOpen()) {
            videoElement.play();
          }

          console.log('Video played after interval');

          // Clear the interval
          clearInterval(intervalId);
        }
      }, 100);
    }
  })(null);
});
