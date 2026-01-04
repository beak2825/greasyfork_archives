// ==UserScript==
// @name         YouTube osu! Play-Along Mode (v1.7.7 Default Trail + 5ms Fade Option)
// @namespace    https://osu.ppy.sh/
// @version      1.7.8
// @description  osu! play-along mode with default trail settings (2 images, 150ms fade) and fade slider that goes down to 5ms 💨🖱️✨🎯 Super snappy!
// @author       ThunderBirdo+ChatGPT
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534611/YouTube%20osu%21%20Play-Along%20Mode%20%28v177%20Default%20Trail%20%2B%205ms%20Fade%20Option%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534611/YouTube%20osu%21%20Play-Along%20Mode%20%28v177%20Default%20Trail%20%2B%205ms%20Fade%20Option%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let popupShown = false;
  let popupDisabled = false;
  let playModeActive = false;
  let customCursorStyle = null;
  let customStyle = null;
  let trailURL = '';
  let trailMax = 2;
  let fadeTime = 150;
  let trailImages = [];
  let trailContainer = null;

  function createPopup() {
    if (document.getElementById('osu-playalong-popup') || popupDisabled) return;

    const popup = document.createElement('div');
    popup.id = 'osu-playalong-popup';
    Object.assign(popup.style, {
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: '#111',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      zIndex: '9999',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    });

    const label = document.createElement('span');
    label.textContent = 'Play Along?';
    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Yes';
    const noBtn = document.createElement('button');
    noBtn.textContent = 'No';

    yesBtn.addEventListener('click', () => {
      const video = document.querySelector('video');
      if (video) video.pause();
      popup.remove();
      requestAnimationFrame(() => {
        setTimeout(showConfigForm, 100);
      });
    });

    noBtn.addEventListener('click', () => {
      popupDisabled = true;
      popup.remove();
    });

    popup.appendChild(label);
    popup.appendChild(yesBtn);
    popup.appendChild(noBtn);
    document.body.appendChild(popup);
  }

  function showConfigForm() {
    if (document.getElementById('osu-playalong-config')) return;

    const form = document.createElement('div');
    form.id = 'osu-playalong-config';
    Object.assign(form.style, {
      position: 'fixed',
      top: '10px',
      left: '10px',
      background: '#222',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      zIndex: '9999',
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      width: '320px',
    });

    const cursorInput = document.createElement('input');
    cursorInput.type = 'text';
    cursorInput.placeholder = 'Cursor Image URL';
    cursorInput.style.width = '100%';

    const defaultCursorBtn = document.createElement('button');
    defaultCursorBtn.textContent = 'Use Default Cursor';
    defaultCursorBtn.addEventListener('click', () => {
      cursorInput.value = 'https://osuskinner.com/elements/interface/cursor/152/1557.png';
    });

    const trailInput = document.createElement('input');
    trailInput.type = 'text';
    trailInput.placeholder = 'Cursor Trail Image URL';
    trailInput.style.width = '100%';

    const defaultTrailBtn = document.createElement('button');
    defaultTrailBtn.textContent = 'Use Default Trail';
    defaultTrailBtn.addEventListener('click', () => {
      trailInput.value = 'https://osuskinner.com/elements/interface/cursortrail/1562/8236.png';
    });

    const trailLengthInput = document.createElement('input');
    trailLengthInput.type = 'range';
    trailLengthInput.min = '0';
    trailLengthInput.max = '50';
    trailLengthInput.value = trailMax;
    const trailLabel = document.createElement('label');
    trailLabel.textContent = `Trail Length: ${trailMax}`;
    trailLengthInput.addEventListener('input', () => {
      trailLabel.textContent = `Trail Length: ${trailLengthInput.value}`;
    });

    const fadeInput = document.createElement('input');
    fadeInput.type = 'range';
    fadeInput.min = '5';
    fadeInput.max = '2000';
    fadeInput.step = '5';
    fadeInput.value = fadeTime;
    const fadeLabel = document.createElement('label');
    fadeLabel.textContent = `Fade Duration: ${fadeTime}ms`;
    fadeInput.addEventListener('input', () => {
      fadeLabel.textContent = `Fade Duration: ${fadeInput.value}ms`;
    });

    const restartCheckbox = document.createElement('input');
    restartCheckbox.type = 'checkbox';
    const restartLabel = document.createElement('label');
    restartLabel.appendChild(restartCheckbox);
    restartLabel.appendChild(document.createTextNode(' Start from beginning'));

    const rateSlider = document.createElement('input');
    rateSlider.type = 'range';
    rateSlider.min = '0.25';
    rateSlider.max = '2';
    rateSlider.step = '0.05';
    rateSlider.value = '1';

    const rateDisplay = document.createElement('div');
    const updateRateDisplay = () => {
      let v = parseFloat(rateSlider.value);
      let label = v === 0.75 ? 'HT' : v === 1.5 ? 'DT' : v.toFixed(2) + 'x';
      rateDisplay.textContent = `Playback: ${label}`;
    };
    rateSlider.addEventListener('input', updateRateDisplay);
    updateRateDisplay();

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';

    startBtn.addEventListener('click', () => {
      const cursorURL = cursorInput.value.trim();
      trailURL = trailInput.value.trim();
      trailMax = parseInt(trailLengthInput.value.trim()) || 0;
      fadeTime = parseInt(fadeInput.value.trim()) || 150;
      const restart = restartCheckbox.checked;
      const rate = parseFloat(rateSlider.value);

      if (!cursorURL) {
        alert('Please enter a cursor image URL.');
        return;
      }

      form.remove();
      startPlayMode(cursorURL, restart, rate);
    });

    form.appendChild(cursorInput);
    form.appendChild(defaultCursorBtn);
    form.appendChild(trailInput);
    form.appendChild(defaultTrailBtn);
    form.appendChild(trailLabel);
    form.appendChild(trailLengthInput);
    form.appendChild(fadeLabel);
    form.appendChild(fadeInput);
    form.appendChild(restartLabel);
    form.appendChild(rateSlider);
    form.appendChild(rateDisplay);
    form.appendChild(startBtn);

    document.body.appendChild(form);
  }

  function startPlayMode(cursorURL, restart, rate) {
    const video = document.querySelector('video');
    const player = document.querySelector('#movie_player');
    if (!video || !player) {
      alert('Video not found.');
      return;
    }

    video.pause();
    if (restart) video.currentTime = 0;
    video.playbackRate = rate;
    playModeActive = true;

    if (customCursorStyle) customCursorStyle.remove();
    customCursorStyle = document.createElement('style');
    customCursorStyle.textContent = `
      * {
        cursor: url("${cursorURL}") 16 16, auto !important;
      }
    `;
    document.head.appendChild(customCursorStyle);

    if (customStyle) customStyle.remove();
    customStyle = document.createElement('style');
    customStyle.textContent = `
      .ytp-chrome-bottom,
      .ytp-gradient-top,
      .ytp-gradient-bottom,
      .ytp-show-cards-title,
      .ytp-title,
      .ytp-pause-overlay,
      .ytp-chrome-top,
      .ytp-bezel {
        display: none !important;
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(customStyle);

    trailContainer = document.querySelector('#movie_player') || document.body;

    if (trailURL && trailMax > 0) {
      document.addEventListener('pointermove', spawnTrailImage);
    }

    window.addEventListener('keydown', blockAllKeys, true);
    window.addEventListener('mousedown', blockClicks, true);
    window.addEventListener('click', blockClicks, true);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && playModeActive) {
        exitPlayMode(video);
      }
    });

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && playModeActive) {
        exitPlayMode(video);
      }
    });

    setTimeout(() => {
      if (player.requestFullscreen) {
        player.requestFullscreen().catch(err => console.log('Fullscreen failed:', err));
      }
      video.play().catch(err => console.log('Play failed:', err));
    }, 100);
  }

  function spawnTrailImage(e) {
    if (!trailContainer) return;

    const trail = document.createElement('img');
    trail.src = trailURL;
    trail.style.position = 'fixed';
    trail.style.left = `${e.clientX}px`;
    trail.style.top = `${e.clientY}px`;
    trail.style.width = '32px';
    trail.style.height = '32px';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '10000';
    trail.style.transition = `opacity ${fadeTime}ms linear`;
    trail.style.opacity = '1';
    trailContainer.appendChild(trail);
    trailImages.push(trail);

    if (trailImages.length > trailMax) {
      const oldest = trailImages.shift();
      oldest.style.opacity = '0';
      setTimeout(() => oldest.remove(), fadeTime);
    }
  }

  function blockAllKeys(e) {
    if (playModeActive) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }

  function blockClicks(e) {
    if (playModeActive) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }

  function exitPlayMode(video) {
    playModeActive = false;

    if (document.fullscreenElement) document.exitFullscreen();
    if (video) {
      video.pause();
      video.playbackRate = 1;
    }

    if (customCursorStyle) {
      customCursorStyle.remove();
      customCursorStyle = null;
    }

    if (customStyle) {
      customStyle.remove();
      customStyle = null;
    }

    for (const img of trailImages) img.remove();
    trailImages = [];
    trailContainer = null;

    document.removeEventListener('pointermove', spawnTrailImage);
    window.removeEventListener('keydown', blockAllKeys, true);
    window.removeEventListener('mousedown', blockClicks, true);
    window.removeEventListener('click', blockClicks, true);
  }

  function onYouTubeWatchPage() {
    if (!location.href.includes('/watch')) return;
    const checkReady = setInterval(() => {
      const video = document.querySelector('video');
      if (video && !popupShown) {
        popupShown = true;
        createPopup();
        clearInterval(checkReady);
      }
    }, 500);
  }

  window.addEventListener('load', onYouTubeWatchPage);

  const observer = new MutationObserver(() => {
    if (
      location.href.includes('/watch') &&
      !popupDisabled &&
      !document.getElementById('osu-playalong-popup') &&
      !document.getElementById('osu-playalong-config')
    ) {
      popupShown = false;
      onYouTubeWatchPage();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
