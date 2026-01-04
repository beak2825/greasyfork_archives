// ==UserScript==
// @name         Block Yandex Music Ads
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Mute Yandex.Music advertising!
// @author       You
// @match        https://music.yandex.ru/playlists/*
// @noframes
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476810/Block%20Yandex%20Music%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/476810/Block%20Yandex%20Music%20Ads.meta.js
// ==/UserScript==
'use strict';

(function() {
  var timer;
  var tick = function() {
    timer = setTimeout(function() {
      var pause = window.document.querySelector('[aria-label="Пауза"][type="button"]');

      if (pause) {
        return tick();
      }

      var changed = false;
      var ad = window.document.querySelector('[aria-label="Закрыть рекламу"][type="button"]').closest('[role="dialog"]');

      if (ad && 'hidden' !== window.getComputedStyle(ad).visibility) {
        changed = true;
        ad.click();
      } else {
        var button = window.document.querySelector('[aria-label="Закрыть"][type="button"]');

        if (button) {
          changed = true;
          button.click();
        }
      }

      var video = window.document.querySelector('#video-ad-container');

      if (video) {
        video.remove();
      }

      if (changed) {
        var play = window.document.querySelector('[aria-label="Воспроизведение"][type="button"]');

        if (play) {
          play.click();
        }

        tick();
      } else {
        tick();
      }
    }, 1000);
  };

  tick();
})();