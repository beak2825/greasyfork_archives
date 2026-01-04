// ==UserScript==
// @name         Prime Video - toggle pause on minimize or hide
// @version      2025-04-06
// @namespace    Jakub Marcinkowski
// @description  Pause Amazon Prime Video movie on minimize, hide, tab switch... and play when it's back.
// @author       Jakub Marcinkowski <kuba.marcinkowski on g mail>
// @copyright    2024+, Jakub Marcinkowski <kuba.marcinkowski on g mail>
// @license      Zlib
// @homepageURL  https://gist.github.com/JakubMarcinkowski
// @homepageURL  https://github.com/JakubMarcinkowski
// @match        https://*.primevideo.com/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii01MCAtNTAgMTAwIDEwMCI+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB5MT0iMSIgeDI9IjEiPjxzdG9wIHN0b3AtY29sb3I9IiMwYTNkODAiLz48c3RvcCBzdG9wLWNvbG9yPSIjMDI5YmQyIiBvZmZzZXQ9IjEiLz48L2xpbmVhckdyYWRpZW50PjxjaXJjbGUgcj0iNTAiIGZpbGw9InVybCgjZykiLz48cGF0aCBkPSJNLTEzLC0yMFYyMEwyMCwwIiBmaWxsPSIjZmZmIi8+PC9zdmc+
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500035/Prime%20Video%20-%20toggle%20pause%20on%20minimize%20or%20hide.user.js
// @updateURL https://update.greasyfork.org/scripts/500035/Prime%20Video%20-%20toggle%20pause%20on%20minimize%20or%20hide.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.addEventListener("visibilitychange", () => {
    const player = document.querySelector('video[id^="dummy"][src^="blob"]');
    if (document.visibilityState === 'hidden') {
      player.pause();
    } else {
      player.play();
    }
  });
})();