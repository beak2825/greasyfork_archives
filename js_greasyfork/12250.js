// ==UserScript==
// @name        Better YouTube
// @namespace   feifeihang.info
// @description Toggle mini player when scrolling down in YouTube. Video download by using youtubeinmp3.com API. Rebind space key for play/pause (no more accidentally scroll down).
// @include     https://youtu.be/*
// @include     http://youtu.be/*
// @include     https://www.youtube.com/*
// @include     http://www.youtube.com/*
// @version     5.2.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12250/Better%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/12250/Better%20YouTube.meta.js
// ==/UserScript==
(function (window, document, undefined) {
  var MP3_API = 'http://youtubeinmp3.com/fetch/?video=';
  var fontAwesome = document.createElement('link');
  fontAwesome.rel = 'stylesheet';
  fontAwesome.href = 'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css';
  document.head.appendChild(fontAwesome);
  var isRight = true;
  // find and keep a reference of the video player.
  var player;
  var stylePlayer = '';
  var video;
  var videoSize = {
  };
  var controls;
  var controlsWidth;
  // a flag to indicate is the mini player is toggled.
  var isToggled = false;
  var isTogglable = true;
  var originalHeight;
  var s2sBtn;
  var hasAddedMini = false;
  var shouldToggle = false;
  var urlBuffer = '';
  var playBtn;
  window.setInterval(function () {
    if (isToggled &&
    !/^http[sS]*\:\/\/www\.youtube\.com\/watch[?]*/.test(window.location.href) &&
    shouldToggle) {
      turnOff();
      shouldToggle = false;
      window.removeEventListener('keydown', bindSpaceKey, true);
    }
    if (!shouldToggle &&
    /^http[sS]*\:\/\/www\.youtube\.com\/watch[?]*/.test(window.location.href)) {
      if (window.location.href !== urlBuffer) {
        isToggled = false;
        urlBuffer = urlBuffer;
        // bind whitespace key.
        playBtn = document.querySelector('.ytp-play-button');
        if (playBtn) {
          window.addEventListener('keydown', bindSpaceKey, true);
        }
      }
      shouldToggle = true;
    }
    if (/^http[sS]*\:\/\/www\.youtube\.com\/watch[?]*/.test(window.location.href)) {
      // check and add MP3 download button.
      var mp3Id = 'better-youtube-mp3-download-btn';
      if (!document.querySelector('#' + mp3Id)) {
        var container = document.querySelector('#watch8-secondary-actions');
        var btn = document.createElement('a');
        btn.innerHTML = '<i class="fa fa-lg fa-download"></i> Download';
        btn.id = mp3Id;
        btn.className += ' yt-uix-button yt-uix-button-size-default yt-uix-button-opacity yt-uix-button-has-icon no-icon-markup pause-resume-autoplay action-panel-trigger';
        btn.style = 'display: inline-block; line-height: 25px; color: rgb(230, 33, 23); font-weight: bold;';
        btn.onmouseenter = function () {
          this.href = MP3_API + window.location.href;
        }
        btn.onmouseout = function () {
          this.href = '';
        }
        container.insertBefore(btn, container.firstChild);
      }
    }
  }, 500);
  var intervalId = window.setInterval(function () {
    if (!hasAddedMini &&
    /^http[sS]*\:\/\/www\.youtube\.com\/watch[?]*/.test(window.location.href)) {
      shouldToggle = true;
      player = document.querySelector('#movie_player');
      video = document.querySelector('#movie_player video.video-stream');
      controls = document.querySelector('#movie_player .ytp-chrome-bottom');
      window.addEventListener('scroll', function () {
        if (!isTogglable) {
          return false;
        }
        // when scrolling up to 1/3 original player height, turn off mini player.

        if (isToggled && window.pageYOffset < originalHeight / 3) {
          turnOff();
          return;
        }
        // when scrolling down to 1/3 player height, go to mini player mode.

        if (shouldToggle) {
          gotoMini();
        }
      }, false);
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
            turnOff();
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
      hasAddedMini = true;
      window.clearInterval(intervalId);
    }
  }, 500);
  function bindSpaceKey(evt) {
    var inputs = document.querySelectorAll('input[type=text], textarea, div.yt-simplebox-text');
    inputs = Array.prototype.slice.apply(inputs);
    if (inputs.indexOf(document.activeElement) === - 1 && evt.keyCode === 32) {
      evt.preventDefault();
      playBtn.click();
    }
  }
  function turnOff() {
    player.style = stylePlayer;
    video.style.width = videoSize.width;
    video.style.height = videoSize.height;
    video.style.left = videoSize.left;
    video.style.top = videoSize.top;
    controls.style.width = controlsWidth;
    if (document.querySelector('.ytp-size-button')) {
      document.querySelector('.ytp-size-button').style.display = 'inline-block';
    }
    if (s2sBtn) {
      s2sBtn.remove();
    }
    isToggled = false;
  }
  function gotoMini() {
    if (!isToggled &&
    window.pageYOffset >= parseInt(player.offsetHeight, 10) / 3) {
      originalHeight = parseInt(player.offsetHeight, 10);
      stylePlayer = player.style.cssText;
      videoSize = {
        height: video.style.height,
        width: video.style.width,
        left: video.style.left,
        top: video.style.top
      };
      controlsWidth = controls.style.width;
      var top = 'top: ' + (window.innerHeight - 270) + 'px;';
      var left = 'left: ' + (window.innerWidth - 430) + 'px;';
      var fontString = '';
      if (isRight) {
        player.style = 'position: fixed; bottom: 20px; left: 20px; height: 230px;' +
        'width: 400px; z-index: 9999999;' + top + left;
        fontString = '<i class="fa fa-2x fa-caret-square-o-left"></i>';
      } 
      else {
        player.style = 'position: fixed; bottom: 20px; left: 20px; height: 230px;' +
        'width: 400px; z-index: 9999999;' + top;
        fontString = '<i class="fa fa-2x fa-caret-square-o-right"></i>';
      }
      video.style.height = '250px';
      video.style.width = '400px';
      video.style.top = '-10px';
      video.style.left = '0';
      controls.style.width = '350px';
      // now, hide the switch size button.
      if (document.querySelector('.ytp-size-button')) {
        document.querySelector('.ytp-size-button').style.display = 'none';
      }
      // add the 'Side-to-side' button.

      s2sBtn = document.createElement('button');
      s2sBtn.className += ' ytp-button';
      s2sBtn.style.lineHeight = '10px';
      s2sBtn.innerHTML = fontString;
      s2sBtn.setAttribute('title', 'Mini player side to side');
      s2sBtn.onclick = function () {
        if (isRight) {
          player.style = 'position: fixed; bottom: 20px; left: 20px; height: 230px;' +
          'width: 400px; z-index: 9999999;' + top;
          fontString = '<i class="fa fa-2x fa-caret-square-o-right"></i>';
          isRight = false;
        } 
        else {
          player.style = 'position: fixed; bottom: 20px; left: 20px; height: 230px;' +
          'width: 400px; z-index: 9999999;' + top + left;
          fontString = '<i class="fa fa-2x fa-caret-square-o-right"></i>';
          isRight = true;
        }
        s2sBtn.innerHTML = fontString;
      };
      var fullscreen = document.querySelector('.ytp-fullscreen-button');
      fullscreen.parentElement.insertBefore(s2sBtn, null);
      isToggled = true;
    }
  }
}) (window, document);
