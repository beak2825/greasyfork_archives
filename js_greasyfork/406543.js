// ==UserScript==
// @name        pokercoaching.com video hotkeys
// @namespace   Violentmonkey Scripts
// @match       http*://*.pokercoaching.com/*
// @grant       none
// @version     1.3
// @author      -
// @description Enables keyboard hotkeys for videos on pokercoaching.com
// @require     https://www.gitcdn.xyz/repo/lammyking/videojs-hotkeys/3cda1fa05b95e8c62e48effced69cd39e7e40b92/videojs.hotkeys.js
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/406543/pokercoachingcom%20video%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/406543/pokercoachingcom%20video%20hotkeys.meta.js
// ==/UserScript==


function init(videoElement) {
  
  if (!window.videojs || !videoElement) return;

  window.videojs(videoElement).ready(function() {

    // The website is a bit of a mess and sometimes embeds videojs twice,
    // in which case the instance we got might not have any controls.
    // Make sure they are there, otherwise the hotkeys plugin doesn't work.
    this.controls(true);

    const playbackRates = [.5, .75, 1, 1.25, 1.5, 1.75, 2, 5, 10];

    const changePlaybackRate = (function(indexDelta) {
      const currentPlaybackRate = this.playbackRate();
      const indexOrNA = playbackRates.indexOf(this.playbackRate());
      const index = indexOrNA === -1 ? playbackRates.indexOf(1) : indexOrNA;
      const newIndex = Math.min(Math.max(index + indexDelta, 0), playbackRates.length - 1);
      this.playbackRate(playbackRates[newIndex]);
    }).bind(this);

    this.hotkeys({
      volumeStep: 0.1,
      seekStep: 5,
      enableModifiersForNumbers: false,
      alwaysCaptureHotkeys: true,
      captureDocumentHotkeys: true,
      documentHotkeysFocusElementFilter: function (el) {
        return el.tagName.toLowerCase() !== 'textarea';
      },
      customKeys: {
        slower: {
          key: function (e) {
            return e.key === '<';
          },
          handler: function () {
            changePlaybackRate(-1);
          },
        },
        faster: {
          key: function (e) {
            return e.key === '>';
          },
          handler: function () {
            changePlaybackRate(1);
          },
        },
      }
    });

  });
}


function waitForVideo() {
  const videoElement = document.getElementsByTagName('video')[0];
  if (!videoElement) return setTimeout(waitForVideo, 100);
  init(videoElement);
}

waitForVideo();
