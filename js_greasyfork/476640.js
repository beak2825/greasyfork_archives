// ==UserScript==
// @name        setlist.fm to Spotify Playlist one-click button
// @namespace   selbi
// @match       https://www.setlist.fm/setlist/*/*/*.html
// @grant       none
// @version     1.0
// @author      Selbi
// @license     MIT
// @description A script to create playlists on Spotify from setlist.fm setlists using: https://github.com/Selbi182/SetlistFmToSpotifyPlaylist
// @downloadURL https://update.greasyfork.org/scripts/476640/setlistfm%20to%20Spotify%20Playlist%20one-click%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/476640/setlistfm%20to%20Spotify%20Playlist%20one-click%20button.meta.js
// ==/UserScript==

(function() {
  let container = document.querySelector(".setlistHeader h2.h1");
  let converterUrl = `https://setlistfm.selbi.club?auto=${window.location}`;
  container.innerHTML += `<a href="${converterUrl}"><i class="fa fa-spotify"/></a>`;
  let spotifyButton = container.querySelector("i");
  spotifyButton.style.marginLeft = "1em";
  spotifyButton.style.cursor = "pointer";
  spotifyButton.style.color = "#1DB954";
  spotifyButton.title = "Convert to Spotify playlist...";
})();