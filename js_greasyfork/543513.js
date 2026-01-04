// ==UserScript==
// @name         Coursera Subtitles Toggle
// @description  Turn English subtitles on/off with the 'C' key.
// @namespace    http://tampermonkey.net/
// @version      0.4
// @author       Elias
// @match        *://www.coursera.org/learn/*
// @match        *://www.coursera.org/lecture/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543513/Coursera%20Subtitles%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/543513/Coursera%20Subtitles%20Toggle.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // If using another subtitle, change the value
  const defaultSub = 'en';
  let subtitlesEnabled = true;
  let englishSubtitleTrack = null;

  document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyC' && englishSubtitleTrack) {
      subtitlesEnabled = !subtitlesEnabled;
      englishSubtitleTrack.mode = subtitlesEnabled ? 'showing' : 'disabled';
    }
  });

  const setupSubtitleTrack = (video) => {
    const track = Array.from(video.textTracks).find(t => t.language === defaultSub);

    if (track) {
      englishSubtitleTrack = track;
      englishSubtitleTrack.mode = subtitlesEnabled ? 'showing' : 'disabled';
    }
  };

  const handleMutations = (mutationsList, observer) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeName === 'VIDEO') {
            const video = node;
            if (video.readyState >= 1) {
              setupSubtitleTrack(video);
            } else {
              video.addEventListener('loadedmetadata', () => setupSubtitleTrack(video), {once: true});
            }
          }
        })
      }
    })
  };

  const observer = new MutationObserver(handleMutations);
  observer.observe(document.body, {childList: true, subtree: true});
})();