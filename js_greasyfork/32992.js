// ==UserScript==
// @name        Youtube Mini Player (Fork)
// @namespace   feifeihang.info
// @description Toggle mini player when scrolling down in Youtube
// @include     https://youtu.be/*
// @include     http://youtu.be/*
// @include     https://www.youtube.com/watch?*
// @include     http://www.youtube.com/watch?*
// @author      Feifei Hang
// @maintainer  Braden Best
// @version     5.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32992/Youtube%20Mini%20Player%20%28Fork%29.user.js
// @updateURL https://update.greasyfork.org/scripts/32992/Youtube%20Mini%20Player%20%28Fork%29.meta.js
// ==/UserScript==
window.addEventListener('load', function () {
  (function (window, document, undefined) {
    // find and keep a reference of the video player.
    var player = document.querySelector('#movie_player');
    var stylePlayer = '';
    var video = document.querySelector('#movie_player video.video-stream');
    var videoSize = {
    };
    var controls = document.querySelector('#movie_player .ytp-chrome-bottom');
    var controlsWidth;
    // a flag to indicate is the mini player is toggled.
    var isToggled = false;
    var isTogglable = true;
    var originalHeight = undefined;
    window.addEventListener('scroll', function () {
      if (!isTogglable) {
        return false;
      }
      // when scrolling up to 1/3 original player height, turn off mini player.

      if (isToggled && window.pageYOffset < originalHeight / 3) {
        player.style = stylePlayer;
        video.style.width = videoSize.width;
        video.style.height = videoSize.height;
        video.style.left = videoSize.left;
        controls.style.width = controlsWidth;
        if (document.querySelector('.ytp-size-button')) {
          document.querySelector('.ytp-size-button').style.display = 'inline-block';
        }
        isToggled = false;
        return;
      }
      // when scrolling down to 1/3 player height, go to mini player mode.

      gotoMini();
    }, false);
    function gotoMini() {
      if (!isToggled &&
      window.pageYOffset >= parseInt(player.offsetHeight, 10) / 3) {
        originalHeight = parseInt(player.offsetHeight, 10);
        stylePlayer = player.style.cssText;
        videoSize = {
          height: video.style.height,
          width: video.style.width,
          left: video.style.left
        };
        controlsWidth = controls.style.width;
        var top = 'top: ' + (window.innerHeight - 270) + 'px;';
        var left = 'left: ' + (window.innerWidth - 430) + 'px;';
        player.style = 'position: fixed; bottom: 20px; left: 20px; height: 250px;' +
        'width: 400px; z-index: 9999999;' + top + left;
        video.style.height = '250px';
        video.style.width = '350px';
        video.style.left = '0';
        controls.style.width = '350px';
        // now, hide the switch size button.
        if (document.querySelector('.ytp-size-button')) {
          document.querySelector('.ytp-size-button').style.display = 'none';
        }
        isToggled = true;
      }
    }
    // add a mini player toggle button.

    var btn = document.createElement('div');
    btn.className += ' yt-uix-button yt-uix-button-size-default yt-uix-button-primary';
    btn.innerHTML = 'Mini: on';
    btn.style = 'line-height: 26px; height: 26px; margin-left: 5px;';
    btn.onclick = function () {
      if (this.innerHTML === 'Mini: on') {
        this.innerHTML = 'Mini: off';
        isTogglable = false;
        if (isToggled) {
          player.style = stylePlayer;
          video.style.width = videoSize.width;
          video.style.height = videoSize.height;
          video.style.left = videoSize.left;
          controls.style.width = controlsWidth;
          if (document.querySelector('.ytp-size-button')) {
            document.querySelector('.ytp-size-button').style.display = 'inline-block';
          }
          isToggled = false;
        }
      } 
      else {
        this.innerHTML = 'Mini: on';
        gotoMini();
        isTogglable = true;
      }
    }
    var dom = document.querySelector('#yt-masthead-signin') ||
    document.querySelector('#yt-masthead-user');
    dom.appendChild(btn);
  }) (window, document);
}, false);
