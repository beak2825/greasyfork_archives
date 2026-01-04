// ==UserScript==
// @name         DRTV YouTube-style Controls
// @namespace    https://stefanjakobsen.com/
// @version      2025-06-02
// @description  Pause/play og dobbeltklik for fuldskærm på DR TV video – YouTube-feeling!
// @author       Stefan Jakobsen
// @match        https://www.dr.dk/drtv/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/DR_TV_logo.svg/2048px-DR_TV_logo.svg.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537989/DRTV%20YouTube-style%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/537989/DRTV%20YouTube-style%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addDRTVClickPlayPause() {
      [
        '.player-overlay',
        '.player__wrapper--controls',
        '.player'
      ].forEach((sel) => {
        const el = document.querySelector(sel);
        if (el && !el.hasAttribute('drtv-addon-setup')) {
          el.addEventListener('click', function (e) {
            if (
              e.target.closest('.drtv-player-controls') ||
              e.target.closest('.drtv-player-button__fullscreen') ||
              e.target.closest('.player-metadata__back-button')
            ) return;

            const v = document.querySelector('video');
            if (v) v.paused ? v.play() : v.pause();
            e.stopPropagation();
          });

          el.addEventListener('dblclick', function (e) {
            if (
              e.target.closest('.drtv-player-controls') ||
              e.target.closest('.drtv-player-button__fullscreen') ||
              e.target.closest('.player-metadata__back-button')
            ) return;

            const fullscreenEl = document.querySelector('.player');
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              fullscreenEl.requestFullscreen();
            }
            e.stopPropagation();
          });
          el.setAttribute('drtv-addon-setup', '1');
        }
      });
    }

    // Kør første gang
    setTimeout(addDRTVClickPlayPause, 2000);

    // MutationObserver til at re-hooke, hvis videoen skifter
    const observer = new MutationObserver(() => addDRTVClickPlayPause());
    observer.observe(document.body, { childList: true, subtree: true });

})();
