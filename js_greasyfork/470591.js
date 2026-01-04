// ==UserScript==
// @name        Play Single Video Only
// @namespace   UserScript
// @match       https://www.youtube.com/*
// @match       https://www.facebook.com/*
// @version     1.2
// @license     MIT
// @author      CY Fung
// @description Pause your background video when you play another video in another tab.
// @run-at      document-start
// @grant       GM_addValueChangeListener
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/470591/Play%20Single%20Video%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/470591/Play%20Single%20Video%20Only.meta.js
// ==/UserScript==

(() => {

  const ways = {
    'www.youtube.com': {
      findVideo: () => {

        return document.querySelector('#movie_player video');

      },
      testVideo: (video) => {

        if (video.volume > 1e-5 && video.muted === false) {

        } else {
          return false;
        }

        if (HTMLElement.prototype.matches.call(video, '#movie_player video')) return true;

      }
    },
    'www.facebook.com': {
      findVideo: () => {

        return [...document.querySelectorAll('#watch_feed video')].filter(elm => elm.paused === false)[0]

      },
      testVideo: (video) => {

        if (video.volume > 1e-5 && video.muted === false) {

        } else {
          return false;
        }

        if (HTMLElement.prototype.matches.call(video, '#watch_feed video')) return true;

      }
    }

  };

  const { findVideo, testVideo } = ways[location.hostname];

  if (typeof findVideo !== 'function' || typeof testVideo !== 'function') return;


  GM_addValueChangeListener("t9opC", function (key, oldValue, newValue, remote) {
    if (remote) {
      let video = findVideo();
      if (video && video.paused === false && video.volume > 1e-5 && video.muted === false && testVideo(video)) {
        HTMLVideoElement.prototype.pause.call(video);
      }
    }
  });

  document.addEventListener('play', function (evt) {

    if (!evt || !evt.isTrusted) return;
    const target = (evt || 0).target;
    if (target instanceof HTMLVideoElement) {
      if (testVideo(target)) {
        GM.setValue('t9opC', Date.now());
      }
    }
  }, true);

})();