"use strict";

// ==UserScript==
// @name         Moodle Videoplayer Extention
// @namespace    http://aarsalmon.starfree.jp/
// @version      0.1.2
// @description  ブラウザの標準ビデオプレーヤーを拡張します(岡大Moodle専用)
// @author       AAAR_Salmon
// @match        https://moodle.el.okayama-u.ac.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412626/Moodle%20Videoplayer%20Extention.user.js
// @updateURL https://update.greasyfork.org/scripts/412626/Moodle%20Videoplayer%20Extention.meta.js
// ==/UserScript==
(function () {
  'use strict';

  var style = document.createElement('style');
  style.textContent = "\n\t\t.mediaplugin_videojs > div {\n\t\t\twidth: 100vw;\n\t\t\tmax-width: 100% !important;\n\t\t}";
  document.head.appendChild(style);
  document.querySelectorAll('video').forEach(function (v) {
    v.addEventListener('keydown', function (event) {
      event.preventDefault();
      var keyName = event.key;

      switch (keyName) {
        case ' ':
          //space
          if (v.paused) {
            v.play();
          } else {
            v.pause();
          }

          break;

        case 'ArrowRight':
          v.currentTime += 5;
          break;

        case 'ArrowLeft':
          v.currentTime -= 5;
          break;

        case 'ArrowUp':
          v.volume = v.volume <= 0.9 ? v.volume + 0.1 : 1;
          break;

        case 'ArrowDown':
          v.volume = v.volume >= 0.1 ? v.volume - 0.1 : 0;
          break;

        case '>':
          if (v.playbackRate < 3) {
            v.playbackRate += 0.25;
          }

          break;

        case '<':
          if (v.playbackRate > 0.25) {
            v.playbackRate -= 0.25;
          }

          break;
      }
    });
  });
})();