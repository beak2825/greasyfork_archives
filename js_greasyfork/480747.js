// ==UserScript==
// @name        YouTube Channel Trailer Pauser
// @namespace   https://greasyfork.org/en/users/34131-velc-gf
// @version     1.0.1
// @author      Velarde, Louie C.
// @description Stops channel trailers from playing automatically
// @match       https://www.youtube.com/*
// @icon        https://www.google.com/s2/favicons?domain=www.youtube.com&sz=64
// @license     LGPL-3.0
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/480747/YouTube%20Channel%20Trailer%20Pauser.user.js
// @updateURL https://update.greasyfork.org/scripts/480747/YouTube%20Channel%20Trailer%20Pauser.meta.js
// ==/UserScript==

function main() {
  let channelPlayer = document.querySelector('ytd-channel-video-player-renderer');
  if (!channelPlayer) return;

  new MutationObserver((mutationList, observer) => {
    for (let mutation of mutationList) {
      for (let node of mutation.addedNodes) {
        if (node.nodeName === 'VIDEO') {
          node.addEventListener('loadstart', (e) => e.target.pause(), { once: true, passive: true });
          observer.disconnect();
        }
      }
    }
  }).observe(channelPlayer, { childList: true, subtree: true });
}

window.addEventListener('yt-navigate-finish', main);