// ==UserScript==
// @name         Kick Audio Maximizer
// @name:tr      Kick Ses Dengeleyici
// @version      1.1
// @description  Sessiz sesleri yükseltir, yüksek sesleri bastırır (yalnızca Kick.com).
// @author       baris
// @match        *://kick.com/*
// @match        *://*.kick.com/*
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1499991
// @downloadURL https://update.greasyfork.org/scripts/544145/Kick%20Audio%20Maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/544145/Kick%20Audio%20Maximizer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const gainLevels = [1.0, 1.5, 2.0, 2.5, 3.0];
  let currentGainIndex = 2;
  let currentGainNode = null;
  let audioContext = null;

  function waitForVideo() {
    const video = document.querySelector('video');
    if (video && !video.dataset.audioMaximizerApplied) {
      setupAudio(video);
    } else {
      setTimeout(waitForVideo, 1000);
    }
  }

  function setupAudio(video) {
    video.dataset.audioMaximizerApplied = 'true';

    if (!audioContext) {
      audioContext = new AudioContext();
    }

    if (audioContext.state === 'suspended') {
      const resume = () => {
        audioContext.resume();
        window.removeEventListener('click', resume);
        window.removeEventListener('keydown', resume);
      };
      window.addEventListener('click', resume);
      window.addEventListener('keydown', resume);
    }

    try {
      const source = audioContext.createMediaElementSource(video);

      const compressor = audioContext.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-50, audioContext.currentTime);
      compressor.knee.setValueAtTime(30, audioContext.currentTime);
      compressor.ratio.setValueAtTime(20, audioContext.currentTime);
      compressor.attack.setValueAtTime(0.003, audioContext.currentTime);
      compressor.release.setValueAtTime(0.25, audioContext.currentTime);

      const gainNode = audioContext.createGain();
      gainNode.gain.value = gainLevels[currentGainIndex];
      currentGainNode = gainNode;

      source.connect(compressor);
      compressor.connect(gainNode);
      gainNode.connect(audioContext.destination);

      createGainUI();
    } catch (e) {
      console.warn('Kick Audio Maximizer: Audio context hatası:', e);
    }
  }

  function createGainUI() {
    const box = document.createElement('div');
    box.style.position = 'fixed';
    box.style.bottom = '80px';
    box.style.left = '20px';
    box.style.padding = '8px 14px';
    box.style.background = 'linear-gradient(135deg, #222 0%, #444 100%)';
    box.style.color = '#00ffcc';
    box.style.fontFamily = 'monospace';
    box.style.fontSize = '13px';
    box.style.borderRadius = '8px';
    box.style.zIndex = '999999';
    box.style.cursor = 'pointer';
    box.style.userSelect = 'none';
    box.style.boxShadow = '0 4px 10px rgba(0,0,0,0.4)';
    box.style.transition = 'transform 0.1s ease';
    box.style.opacity = '1';

    box.innerText = `🔊 Gain: ${gainLevels[currentGainIndex].toFixed(1)}x`;

    box.addEventListener('click', () => {
      currentGainIndex = (currentGainIndex + 1) % gainLevels.length;
      const newGain = gainLevels[currentGainIndex];
      if (currentGainNode) currentGainNode.gain.value = newGain;
      box.innerText = `🔊 Gain: ${newGain.toFixed(1)}x`;

      // Tıklama animasyonu
      box.style.transform = 'scale(0.95)';
      setTimeout(() => {
        box.style.transform = 'scale(1)';
      }, 100);
    });

    // Mobil dostu uzun basış için
    box.addEventListener('touchstart', (e) => {
      e.preventDefault();
      box.style.transform = 'scale(0.95)';
    });
    box.addEventListener('touchend', (e) => {
      e.preventDefault();
      currentGainIndex = (currentGainIndex + 1) % gainLevels.length;
      const newGain = gainLevels[currentGainIndex];
      if (currentGainNode) currentGainNode.gain.value = newGain;
      box.innerText = `🔊 Gain: ${newGain.toFixed(1)}x`;
      box.style.transform = 'scale(1)';
    });

    document.body.appendChild(box);
  }

  // SPA için gözlemci
  const observer = new MutationObserver(() => {
    waitForVideo();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Başlangıç tetiklemesi
  waitForVideo();
})();
