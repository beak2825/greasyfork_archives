// ==UserScript==
// @name         Flashbank Protection (YouTube UI + Settings)
// @namespace    Violentmonkey Scripts
// @match        https://www.youtube.com/watch*
// @grant        none
// @version      3.1
// @description  Inverts video if bright flashes are detected. YouTube-native toggle + settings panel.
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538687/Flashbank%20Protection%20%28YouTube%20UI%20%2B%20Settings%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538687/Flashbank%20Protection%20%28YouTube%20UI%20%2B%20Settings%29.meta.js
// ==/UserScript==

/*!
MIT License

Copyright (c) 2024 Flashbank Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND.
*/

(function () {
  'use strict';

  const SETTINGS_KEY = 'flashbankSettings';
  const defaultSettings = {
    enableScript: true,
    showOverlayText: true,
    showDebugCanvas: false,
    enableLogging: true,
    thresholdPercent: 55
  };
  const settings = Object.assign({}, defaultSettings, JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'));

  const CHECK_INTERVAL = 250;
  const DETECT_MODE = 'bright';
  const BRIGHT_THRESHOLD = 240;
  const GRAY_TARGET = 80;
  const TOLERANCE = 10;
  const CANVAS_WIDTH = 320;
  const STRIPE_HEIGHT = 20;

  let debugCanvas = null;
  let ctx = null;

  const log = (...args) => {
    if (settings.enableLogging && settings.enableScript) console.log('[Flashbank]', ...args);
  };

  const isBright = (r, g, b) => r >= BRIGHT_THRESHOLD && g >= BRIGHT_THRESHOLD && b >= BRIGHT_THRESHOLD;
  const isGrayMatch = (r, g, b) =>
    Math.abs(r - GRAY_TARGET) < TOLERANCE &&
    Math.abs(g - GRAY_TARGET) < TOLERANCE &&
    Math.abs(b - GRAY_TARGET) < TOLERANCE;

  function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function createOverlayText() {
    let overlay = document.getElementById('flashbank-indicator');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'flashbank-indicator';
      overlay.textContent = '👁 Bright Flash Protection Active';
      Object.assign(overlay.style, {
        position: 'fixed',
        top: '12px',
        right: '12px',
        padding: '8px 14px',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: '#00ff88',
        fontWeight: 'bold',
        fontSize: '14px',
        fontFamily: 'sans-serif',
        borderRadius: '6px',
        zIndex: 999999,
        pointerEvents: 'none'
      });
      document.body.appendChild(overlay);
    }
    overlay.style.display = settings.enableScript && settings.showOverlayText ? 'block' : 'none';
  }

  function createDebugCanvas() {
    if (debugCanvas) return debugCanvas;
    debugCanvas = document.createElement('canvas');
    debugCanvas.width = CANVAS_WIDTH;
    debugCanvas.height = STRIPE_HEIGHT;
    Object.assign(debugCanvas.style, {
      position: 'fixed',
      bottom: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: `${CANVAS_WIDTH}px`,
      height: `${STRIPE_HEIGHT}px`,
      border: '2px solid red',
      zIndex: 999999,
      pointerEvents: 'none'
    });
    document.body.appendChild(debugCanvas);
    ctx = debugCanvas.getContext('2d', { willReadFrequently: true });
    updateDynamicStates();
    return debugCanvas;
  }

  function updateDynamicStates() {
    const overlay = document.getElementById('flashbank-indicator');
    if (overlay) overlay.style.display = settings.enableScript && settings.showOverlayText ? 'block' : 'none';
    if (debugCanvas) debugCanvas.style.display = settings.enableScript && settings.showDebugCanvas ? 'block' : 'none';
  }

  function createSettingsPanel(buttonWrapper) {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'absolute',
      background: '#1e1e1e',
      color: '#fff',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
      fontSize: '13px',
      fontFamily: 'sans-serif',
      zIndex: '2147483647',
      width: '240px',
      display: 'none'
    });

    const addToggle = (label, key) => {
      const wrapper = document.createElement('label');
      wrapper.style.display = 'block';
      wrapper.style.marginBottom = '6px';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = settings[key];
      input.onchange = () => {
        settings[key] = input.checked;
        saveSettings();
        updateDynamicStates();
      };
      wrapper.appendChild(input);
      wrapper.appendChild(document.createTextNode(' ' + label));
      panel.appendChild(wrapper);
    };

    addToggle('Enable script', 'enableScript');
    addToggle('Show overlay', 'showOverlayText');
    addToggle('Show debug canvas', 'showDebugCanvas');
    addToggle('Enable console logs', 'enableLogging');

    const thresholdLabel = document.createElement('label');
    thresholdLabel.textContent = `Threshold: ${settings.thresholdPercent}%`;
    thresholdLabel.style.display = 'block';
    thresholdLabel.style.marginTop = '10px';

    const thresholdSlider = document.createElement('input');
    thresholdSlider.type = 'range';
    thresholdSlider.min = 10;
    thresholdSlider.max = 100;
    thresholdSlider.value = settings.thresholdPercent;
    thresholdSlider.style.width = '100%';
    thresholdSlider.oninput = () => {
      settings.thresholdPercent = parseInt(thresholdSlider.value, 10);
      thresholdLabel.textContent = `Threshold: ${settings.thresholdPercent}%`;
      saveSettings();
    };

    panel.appendChild(thresholdLabel);
    panel.appendChild(thresholdSlider);

    document.body.appendChild(panel);

    const toggleBtn = buttonWrapper.querySelector('button');
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = toggleBtn.getBoundingClientRect();
      panel.style.top = `${rect.bottom + window.scrollY + 8}px`;
      panel.style.left = `${rect.left + window.scrollX}px`;
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !buttonWrapper.contains(e.target)) {
        panel.style.display = 'none';
      }
    });
  }

  function createSettingsButtonInYouTubeBar() {
    const container = document.querySelector('#top-level-buttons-computed');
    if (!container || container.querySelector('[data-flashbank-btn]')) return;

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.setAttribute('data-flashbank-btn', 'true');

    const button = document.createElement('button');
    button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment';
    button.style.marginLeft = '8px';
    button.setAttribute('aria-label', 'Flashbank Protection');
    button.title = 'Flashbank Protection';

    const icon = document.createElement('yt-icon');
    icon.style.width = '24px';
    icon.style.height = '24px';

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("style", "width: 100%; height: 100%;");
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("fill", "currentColor");
    path.setAttribute("d", "M12 2C8.13 2 5 6 5 12s3.13 10 7 10 7-4 7-10S15.87 2 12 2zm0 18c-2.76 0-5-3.58-5-8s2.24-8 5-8 5 3.58 5 8-2.24 8-5 8z");
    svg.appendChild(path);
    icon.appendChild(svg);

    const text = document.createElement('div');
    text.className = 'yt-spec-button-shape-next__button-text-content';
    text.textContent = 'Flashbank';

    button.appendChild(icon);
    button.appendChild(text);
    wrapper.appendChild(button);
    container.appendChild(wrapper);

    createSettingsPanel(wrapper);
  }

  function startFlashbank(video) {
    if (video.dataset.flashbankAttached === 'true') return;
    video.dataset.flashbankAttached = 'true';

    log('Video found, starting flash protection');
    createSettingsButtonInYouTubeBar();
    createOverlayText();
    createDebugCanvas();

    setInterval(() => {
      if (!settings.enableScript || video.paused || video.ended) return;

      try {
        const vidW = video.videoWidth;
        const vidH = video.videoHeight;
        if (!vidW || !vidH) return;

        const stripeYs = [0, Math.floor(vidH / 2 - STRIPE_HEIGHT / 2), vidH - STRIPE_HEIGHT];
        let triggered = false;

        for (const y of stripeYs) {
          ctx.drawImage(video, 0, y, vidW, STRIPE_HEIGHT, 0, 0, CANVAS_WIDTH, STRIPE_HEIGHT);
          const { data } = ctx.getImageData(0, 0, CANVAS_WIDTH, STRIPE_HEIGHT);
          let match = 0;
          const total = data.length / 4;

          for (let i = 0; i < data.length; i += 4) {
            const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
            if ((DETECT_MODE === 'bright' && isBright(r, g, b)) || (DETECT_MODE === 'gray' && isGrayMatch(r, g, b))) {
              match++;
            }
          }

          const percent = (match / total) * 100;
          log(`Stripe y=${y} match: ${percent.toFixed(2)}%`);
          if (percent >= settings.thresholdPercent) {
            triggered = true;
            break;
          }
        }

        video.style.filter = triggered ? 'invert(1)' : 'none';
      } catch (err) {
        log('Frame read error:', err);
      }
    }, CHECK_INTERVAL);
  }

  function watchForVideo() {
    const tryInit = () => {
      const video = document.querySelector('video');
      if (video) startFlashbank(video);
    };

    tryInit();
    const observer = new MutationObserver(tryInit);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function monitorButtonInjection() {
    const observer = new MutationObserver(() => {
      const container = document.querySelector('#top-level-buttons-computed');
      if (container && !container.querySelector('[data-flashbank-btn]')) {
        createSettingsButtonInYouTubeBar();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  watchForVideo();
  monitorButtonInjection();
})();
