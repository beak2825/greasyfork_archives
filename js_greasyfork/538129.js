// ==UserScript==
// @name         YouTube Autoplay Fix
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @namespace    https://github.com/Sikarii/Userscripts
// @description  Fixes YouTube autoplay not working for playlists past 400 entries
// @version      1.0.2
// @match        https://www.youtube.com/watch*&list=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538129/YouTube%20Autoplay%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/538129/YouTube%20Autoplay%20Fix.meta.js
// ==/UserScript==

const hookPlayer = () => {
  const playerEl = document.querySelector("video.html5-main-video");
  if (!playerEl) {
    return;
  }

  playerEl.addEventListener("ended", () => {
    playerEl.paused && setTimeout(switchToNextVideo, 2000);
  });
};

const switchToNextVideo = () => {
  const panelEls = [
    ...document.querySelectorAll("ytd-playlist-panel-video-renderer"),
  ];

  const selectedIdx = panelEls.findIndex((x) => x.hasAttribute("selected"));

  const nextElement = panelEls[selectedIdx + 1];
  if (!nextElement) {
    return;
  }

  const thumbnailEl = nextElement.querySelector("#thumbnail");
  return thumbnailEl?.click();
};

(function () {
  "use strict";

  const params = new URLSearchParams(window.location.search);

  const inPlaylist = params.has("list");
  const playlistIndex = parseInt(params.get("index"));

  // Playlists break past 400 videos, so we better fix it
  return inPlaylist && playlistIndex >= 400 && hookPlayer();
})();
