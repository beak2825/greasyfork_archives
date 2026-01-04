// ==UserScript==
// @name         Ad skipper yt
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play Youtube ads at 5x speed, and skip after 6 seconds undetected.
// @author       TTT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507717/Ad%20skipper%20yt.user.js
// @updateURL https://update.greasyfork.org/scripts/507717/Ad%20skipper%20yt.meta.js
// ==/UserScript==
const targetNode = document.body;
const config = { attributes: false, childList: true, subtree: true };
const callback = function(mutationsList, observer) {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      document.querySelectorAll('.ytp-ad-text').forEach(adText => {
        var player = document.querySelector('.video-stream.html5-main-video');
        if (player) {
          player.playbackRate = 5;
          if (player.currentTime > 29) {
            if (document.contains(document.getElementsByClassName("ytp-preview-ad")[0])) {
              document.getElementsByClassName("html5-video-container")[0].children[0].currentTime = 250;
            }
            if (document.contains(document.getElementsByClassName('ytp-skip-ad-button__text')[0])) {
              document.getElementsByClassName('ytp-skip-ad-button__text')[0].click();
            }
          }
        }
      });
    }
  }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);