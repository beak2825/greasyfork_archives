// ==UserScript==
// @name            BoyfriendTV Auto-Fullscreen
// @version         1.069
// @description     Automatically starts playback and enters fullscreen on boyfriendtv.com
// @author          n who?
// @match           https://boyfriendtv.com/videos/*
// @match           https://boyfriendtv.com/videos/**
// @match           https://*.boyfriendtv.com/videos/*
// @match           https://*.boyfriendtv.com/videos/**
// @include         https://boyfriendtv.com/videos/*
// @include         https://boyfriendtv.com/videos/**
// @include         https://*.boyfriendtv.com/videos/*
// @include         https://*.boyfriendtv.com/videos/**
// @grant           none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/542508/BoyfriendTV%20Auto-Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/542508/BoyfriendTV%20Auto-Fullscreen.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // Helper: wait for a condition with a timeout
  function waitFor(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        } else if (Date.now() - start > timeout) {
          clearInterval(timer);
          reject(`Timed out waiting for ${selector}`);
        }
      }, 200);
    });
  }

  // Kick off once the player element exists
  waitFor('video').then(video => {
    // Mute first if autoplay is blocked
    video.muted = true;

    // Play
    video.play().catch(err => console.warn('Autoplay blocked:', err));

    // Then fullscreen if allowed
    if (video.requestFullscreen) {
      video.requestFullscreen().catch(e => {
        console.warn('Fullscreen request failed:', e);
      });
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  }).catch(err => {
    console.error(err);
  });

})();



