// ==UserScript==
// @name         Spotify PL w SP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  PL w SP
// @author       parkie
// @license      JMB
// @match        https://open.spotify.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541727/Spotify%20PL%20w%20SP.user.js
// @updateURL https://update.greasyfork.org/scripts/541727/Spotify%20PL%20w%20SP.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const playlistUrl = 'https://open.spotify.com/playlist/0W6R2yFo2fSmLEMGonvByy'; // Your Playlist URL
  const playbackSpeed = 3; // Playback rate
  const preservePitch = true; // true = preserve pitch

 
  if (!window.location.href.includes(playlistUrl)) {
    window.location.href = playlistUrl;
    return;
  }

   const descriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');
  Object.defineProperty(HTMLMediaElement.prototype, 'playbackRate', {
    get: descriptor.get,
    set(val) {
      descriptor.set.call(this, playbackSpeed);
    }
  });

  const applyMediaSettings = () => {
    document.querySelectorAll('audio, video').forEach(el => {
      el.playbackRate = playbackSpeed;
      el.preservesPitch = preservePitch;
    });
  };
  new MutationObserver(applyMediaSettings).observe(document.documentElement, { childList: true, subtree: true });

  // -------------------------
  // -------------------------
  window.addEventListener('load', () => {
    const lastPlayedTrack = localStorage.getItem("lastPlayedTrack");

    const waitForTracks = (callback) => {
      const checkInterval = setInterval(() => {
        const tracks = document.querySelectorAll('[data-testid="tracklist-row"]');
        if (tracks.length > 0) {
          clearInterval(checkInterval);
          callback(tracks);
        }
      }, 1000);
    };

    const autoplayTrack = (tracks) => {
      let targetTrack = null;

      if (lastPlayedTrack) {
        targetTrack = Array.from(tracks).find(track => {
          const name = track.querySelector('.encore-text-body-medium')?.textContent?.trim();
          return name === lastPlayedTrack;
        });
      }

      if (!targetTrack) {
        console.log("Playing first track.");
        targetTrack = tracks[0];
      }

      targetTrack.scrollIntoView({ behavior: "smooth", block: "center" });

      const playBtn = targetTrack.querySelector('button[aria-label^="Play"], button[aria-label="Resume"]');
      if (playBtn) {
        setTimeout(() => playBtn.click(), 1000);
        monitorPlayback(tracks);
      } else {
        console.warn("Play button not found.");
      }
    };

    const monitorPlayback = (tracks) => {
      const observer = new MutationObserver(() => {
        const currentTrack = Array.from(tracks).find(track =>
          track.querySelector('[data-testid="playing-indicator"]')
        );
        if (!currentTrack) return;

        const name = currentTrack.querySelector('.encore-text-body-medium')?.textContent?.trim();
        if (name) localStorage.setItem("lastPlayedTrack", name);

        if (Array.from(tracks).indexOf(currentTrack) === tracks.length - 1) {
          const pauseBtn = document.querySelector('button[aria-label="Pause"]');
          if (pauseBtn) pauseBtn.click();
          observer.disconnect();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });
    };

    waitForTracks(autoplayTrack);
  });
})();
