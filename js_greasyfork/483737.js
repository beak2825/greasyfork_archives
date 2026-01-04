// ==UserScript==
// @name         Futaba Extender
// @namespace    Futaba-Extender
// @version      0.82
// @description  「二次元裏＠ふたば」を使いやすくするためのユーザースクリプトです。
// @author       Yukiteru
// @match        https://*.2chan.net/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483737/Futaba%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/483737/Futaba%20Extender.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Add styles for the preview container
  let style = document.createElement('style');
  style.textContent = `
    .media-preview-container {
      position: fixed;
      pointer-events: none;
      display: none;
    }

    .media-preview {
      max-width: 100vw;
      max-height: 100vh;
      display: block;
      margin: auto;
    }
  `;
  document.head.appendChild(style);

  // Create the media preview container
  let previewContainer = document.createElement('div');
  previewContainer.className = 'media-preview-container';
  document.body.appendChild(previewContainer);

  // Variable to store the current playing media element
  let currentMedia;

  // Function to show media preview on hover and follow the cursor
  function showMediaPreview(event) {
    let anchor = event.target.closest('a');
    if (anchor && isMediaLink(anchor)) {
      let mediaUrl = anchor.href;

      if (!currentMedia || currentMedia.src !== mediaUrl) {
        currentMedia = createMediaElement(mediaUrl);
      }

      previewContainer.innerHTML = '';
      previewContainer.appendChild(currentMedia);

      previewContainer.style.display = 'block';

      updatePreviewPosition(event);

      if (currentMedia.tagName.toLowerCase() === 'video') {
        currentMedia.play();
      }
    }
  }

  function isMediaLink(anchor) {
    return anchor.querySelector('img') !== null
  }

  function isVideo(url) {
    return url.endsWith('.mp4') || url.endsWith('.webm')
  }

  function createMediaElement(url) {
    let mediaElement;
    if (isVideo(url)) {
      // For videos
      mediaElement = document.createElement('video');
      mediaElement.autoplay = true;
      mediaElement.loop = true;
      mediaElement.muted = true;
    } else {
      // For images
      mediaElement = document.createElement('img');
    }
    mediaElement.className = 'media-preview';
    mediaElement.src = url;
    return mediaElement;
  }

  function updatePreviewPosition(event) {
    let cursorX = event.clientX;
    let cursorY = event.clientY;

    let containerWidth = previewContainer.offsetWidth;
    let containerHeight = previewContainer.offsetHeight;

    let maxX = window.innerWidth - containerWidth;
    let maxY = window.innerHeight - containerHeight;

    let posX = Math.min(cursorX, maxX);
    let posY = Math.min(cursorY, maxY);

    previewContainer.style.top = `${posY}px`;
    previewContainer.style.left = `${posX}px`;
  }

  function hideMediaPreview() {
    previewContainer.style.display = 'none';
    if (currentMedia && currentMedia.tagName.toLowerCase() === 'video') {
      currentMedia.pause();
    }
  }

  function startListener() {
    let mediaLinks = document.querySelectorAll('a');
    mediaLinks.forEach((link) => {
      link.addEventListener('mousemove', updatePreviewPosition);
      link.addEventListener('mouseenter', showMediaPreview);
      link.addEventListener('mouseleave', hideMediaPreview);
    });
  }

  function removeAds() {
    const allDivs = document.querySelectorAll('body > div');
    const divsWithIframes = Array.from(allDivs).filter(div => div.querySelector('iframe') !== null);
    divsWithIframes.forEach(div => div.remove());
  }

  function removeRedirection() {
    const linksToModify = document.querySelectorAll('a[href*="/bin/jump.php?"]');
    linksToModify.forEach(function(link) {
      const originalUrl = decodeURIComponent(link.href.split('/bin/jump.php?')[1]);
      link.href = originalUrl;
    });
  }

  startListener();
  removeAds();
  removeRedirection();
})();
