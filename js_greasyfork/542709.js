// ==UserScript==
// @name         Open in YMusic Button for YouTube
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Adds "Open in YMusic" button below YouTube videos.
// @author       FIRANVAR
// @match        https://www.youtube.com/watch*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542709/Open%20in%20YMusic%20Button%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/542709/Open%20in%20YMusic%20Button%20for%20YouTube.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BUTTON_ID = 'open-in-ymusic-button';

  function createYMusicButton(videoId) {
    const button = document.createElement('a');
    button.id = BUTTON_ID;
    button.textContent = 'Open in YMusic';
    button.href = `https://music.youtube.com/watch?v=${videoId}`;
    button.target = '_blank';
    button.style.display = 'inline-block';
    button.style.marginLeft = '10px';
    button.style.padding = '9px 12px';
    button.style.background = '#ff0000';
    button.style.color = 'white';
    button.style.borderRadius = '18px';
    button.style.textDecoration = 'none';
    button.style.fontWeight = 'bold';
    button.style.fontSize = '14px';
    button.style.cursor = 'pointer';
    return button;
  }

  function getVideoIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
  }

  function addButton() {
    const videoId = getVideoIdFromURL();
    if (!videoId) return;

    // Avoid duplicate buttons
    if (document.getElementById(BUTTON_ID)) return;

    // Find the container to insert the button
    const actionButtons = document.querySelector('#top-level-buttons-computed');
    if (actionButtons) {
      const ymusicButton = createYMusicButton(videoId);
      actionButtons.appendChild(ymusicButton);
    }
  }

  // Re-run on navigation (for SPA routing in YouTube)
  const observer = new MutationObserver(() => {
    addButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Initial run
  window.addEventListener('load', addButton);
})();
