// ==UserScript==
// @name         Always video progress bar on anime1
// @namespace    https://github.com/gslin/always-video-progress-bar-on-anime1
// @version      0.20210508.0
// @description  Enable progress bar on anime1
// @author       Gea-Suan Lin <darkkiller@gmail.com>
// @match        https://anime1.me/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458639/Always%20video%20progress%20bar%20on%20anime1.user.js
// @updateURL https://update.greasyfork.org/scripts/458639/Always%20video%20progress%20bar%20on%20anime1.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Only \d+ will match.
  if (!document.location.pathname.match(/^\/\d+/)) {
    return;
  }

  const bar = document.createElement('div');
  bar.style = 'background: #000; display: block; height: 5px; margin: 0; padding: 0; position: relative; width: 100%;';

  const loadedbar = document.createElement('div');
  loadedbar.style = 'background: #777; display: block; height: 5px; margin: 0; padding: 0; position: absolute; width: 100%;';
  bar.appendChild(loadedbar);

  const progressbar = document.createElement('div');
  progressbar.style = 'background: red; display: block; height: 5px; margin: 0; padding: 0; position: absolute; width: 100%; z-index: 1;';
  bar.appendChild(progressbar);

  const vjscontainer = document.querySelector('.vjscontainer');
  vjscontainer.appendChild(bar);

  const ob = new window.MutationObserver(() => {
    const vjs = document.querySelector('.video-js');
    if (!vjs || !vjs.classList.contains('vjs-playing')) {
      return;
    }

    const v = document.querySelector('video.vjs-tech');
    if (!v) {
      return;
    }

    v.addEventListener('progress', () => {
      loadedbar.style.width = (100 * v.buffered.end(0) / v.duration) + '%';
    });
    v.addEventListener('timeupdate', () => {
      progressbar.style.width = (100 * v.currentTime / v.duration) + '%';
    });

    ob.disconnect();
  });

  ob.observe(document, {
    childList: true,
    subtree: true,
  });
})();
