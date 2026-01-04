// ==UserScript==
// @name        Samplefocus Downloader
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Replaces the original download button to a one that redirects to the mp3 file page.
// @author      ToxicBiohazard
// @match       *://*.samplefocus.com/*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524853/Samplefocus%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/524853/Samplefocus%20Downloader.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const originalLink = document.querySelector('.download-link');

  if (!originalLink) {
    console.warn('Original download link not found.');
    return;
  }

  const audioElement = document.querySelector('audio');

  if (!audioElement || !audioElement.src) {
    console.error('No audio element found or no source loaded.');
    return;
  }

  const audioSrc = audioElement.src;

  const downloadSample = () => {
    if (confirm('Download the audio sample?')) {
      const link = document.createElement('a');
      link.href = audioSrc;
      link.download = 'extracted-audio.mp3';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const downloadButton = document.createElement('button');
  downloadButton.classList.add('btn-large', 'waves-effect', 'waves-light');
  downloadButton.textContent = 'Download Sample';
  downloadButton.addEventListener('click', downloadSample);

  originalLink.parentNode.replaceChild(downloadButton, originalLink);
})();