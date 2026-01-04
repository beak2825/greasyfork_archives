// ==UserScript==
// @name         YouTube Sharpen Always On
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sharpening filter for YouTube
// @author       ChatGPT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538310/YouTube%20Sharpen%20Always%20On.user.js
// @updateURL https://update.greasyfork.org/scripts/538310/YouTube%20Sharpen%20Always%20On.meta.js
// ==/UserScript==

(() => {
  const FILTER_ID = 'tm-sharpen-filter';
  const CSS_CLASS = 'tm-sharpen-enabled';
  const BUTTON_ID = 'tm-sharpen-button';
  let filterEnabled = true;
  let currentVideo = null;

  function injectFilterAndStyles() {
    if (document.getElementById(FILTER_ID)) return;

    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'hidden';
    container.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
        <filter id="${FILTER_ID}">
          <feConvolveMatrix order="3" kernelMatrix="0 -0.125 0 -0.125 1.5 -0.125 0 -0.125 0" divisor="1" bias="0"/>
        </filter>
      </svg>
      <style>
        video.${CSS_CLASS} {
          filter: url(#${FILTER_ID}) !important;
        }
        #${BUTTON_ID} {
          font-size: 25px;
          cursor: pointer;
          user-select: none;
          position: relative;
          top: -16px;
          color: red;
          background: transparent;
          border: none;
          opacity: 1;
          transition: color 0.3s, opacity 0.3s;
        }
        #${BUTTON_ID}.active {
          color: gray;
          opacity: 0.5;
        }
      </style>
    `;
    document.body.appendChild(container);
  }

  function toggleFilterButton(btn) {
    filterEnabled = !filterEnabled;
    btn.classList.toggle('active', filterEnabled);
    if (currentVideo) currentVideo.classList.toggle(CSS_CLASS, filterEnabled);
    console.log(`[YT Sharpen] ${filterEnabled ? 'Enabled' : 'Disabled'}`);
  }

  function createToggleButton(controls) {
    if (document.getElementById(BUTTON_ID)) return;

    const btn = document.createElement('button');
    btn.id = BUTTON_ID;
    btn.className = 'ytp-button active';
    btn.title = 'Toggle Sharpen Filter';
    btn.textContent = '❤';
    btn.addEventListener('click', () => toggleFilterButton(btn));
    controls.insertBefore(btn, controls.firstChild);
  }

  function observe() {
    const observer = new MutationObserver(() => {
      const video = document.querySelector('video');
      const controls = document.querySelector('.ytp-right-controls');

      if (video && video !== currentVideo) {
        currentVideo = video;
        currentVideo.classList.toggle(CSS_CLASS, filterEnabled);
      }
      if (controls) createToggleButton(controls);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    injectFilterAndStyles();
    observe();
  }

  window.addEventListener('load', init, { once: true });
  window.addEventListener('yt-navigate-finish', () => setTimeout(init, 500));
})();
