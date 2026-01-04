// ==UserScript==
// @name        Playlist thumbnail to overview
// @namespace   Luis
// @match       https://www.youtube.com/feed/playlists*
// @grant       none
// @version     1.0.1
// @author      Luis
// @description Replaces playlist thumbnail link on https://www.youtube.com/feed/playlists* from link to first video in playlist to link to playlist overview.
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/535159/Playlist%20thumbnail%20to%20overview.user.js
// @updateURL https://update.greasyfork.org/scripts/535159/Playlist%20thumbnail%20to%20overview.meta.js
// ==/UserScript==

setTimeout(() => {
  let targets = document.querySelectorAll('a[href^="/watch?v="].yt-lockup-view-model-wiz__content-image');

  for (let el of targets) {
    el.href = el.href.replace(/watch\?v=.+?&/, "playlist?");
    el.onclick = (e) => e.stopPropagation();
  }
}, 1000);