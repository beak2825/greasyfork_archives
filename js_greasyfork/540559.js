// ==UserScript==
// @name         Klavia Summer Theme
// @namespace    https://playklavia.com/
// @version      9.1
// @description  Klavia Summer themes + On/Off toggle button. (Playklavia.com/Klavia.io)
// @match        *://playklavia.com/*
// @match        *://klavia.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540559/Klavia%20Summer%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/540559/Klavia%20Summer%20Theme.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SUMMER_BACKGROUNDS = {
    '/race': ['https://images.pexels.com/photos/248159/pexels-photo-248159.jpeg'],
    '/racer': ['https://images.pexels.com/photos/189848/pexels-photo-189848.jpeg'],
    '/videos': ['https://images.pexels.com/photos/632522/pexels-photo-632522.jpeg'],
    '/news': ['https://images.pexels.com/photos/262325/pexels-photo-262325.jpeg'],
    '/ktl/': ['https://images.unsplash.com/photo-1470770841072-f978cf4d019e'],
    '/leaderboards': ['https://images.pexels.com/photos/531035/pexels-photo-531035.jpeg'],
    '/shops/': [
      'https://images.pexels.com/photos/6203016/pexels-photo-6203016.jpeg',
    ],
    '/racer/': ['https://images.pexels.com/photos/994605/pexels-photo-994605.jpeg'],
    '/teams': ['https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg']
  };

  const DEFAULT_BG = 'https://images.pexels.com/photos/712618/pexels-photo-712618.jpeg';

  // Get random background URL based on current path
  function getBackgroundURL() {
    const path = location.pathname;
    for (const key in SUMMER_BACKGROUNDS) {
      if (path.includes(key)) {
        const list = SUMMER_BACKGROUNDS[key];
        return list[Math.floor(Math.random() * list.length)] + '?auto=format&fit=crop&w=1920&q=80';
      }
    }
    return DEFAULT_BG + '?auto=format&fit=crop&w=1920&q=80';
  }

  // Apply or remove summer background
  function applyBackground(enabled) {
    if (!enabled) {
      document.body.classList.remove('klavia-summer');
      return;
    }
    const bg = getBackgroundURL();
    document.documentElement.style.setProperty('--klavia-summer-bg', `url('${bg}')`);
    document.body.classList.add('klavia-summer');
  }

  // Add toggle button if missing
  function addToggleButton() {
    if (document.getElementById('summer-toggle-btn')) return;

    const btn = document.createElement('div');
    btn.id = 'summer-toggle-btn';
    btn.style.cssText = `
      position: fixed;
      top: 12px;
      right: 12px;
      background: #007f5f;
      color: white;
      padding: 8px 14px;
      border-radius: 8px;
      font-weight: bold;
      font-family: Arial, sans-serif;
      cursor: pointer;
      z-index: 999999;
      user-select: none;
      box-shadow: 0 0 5px rgba(0,0,0,0.3);
      transition: background-color 0.3s ease;
    `;

    let enabled = localStorage.getItem('klaviaSummerEnabled') !== 'false';
    btn.textContent = enabled ? '🌴 Summer ON' : '❌ Summer OFF';

    btn.onmouseenter = () => (btn.style.backgroundColor = '#005c3a');
    btn.onmouseleave = () => (btn.style.backgroundColor = '#007f5f');

    btn.onclick = () => {
      enabled = !enabled;
      localStorage.setItem('klaviaSummerEnabled', enabled);
      btn.textContent = enabled ? '🌴 Summer ON' : '❌ Summer OFF';
      applyBackground(enabled);
    };

    document.body.appendChild(btn);
  }

  // Inject CSS once
  function injectCSS() {
    if (document.getElementById('klavia-style')) return;

    const style = document.createElement('style');
    style.id = 'klavia-style';
    style.textContent = `
      body.klavia-summer::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-image: var(--klavia-summer-bg) !important;
        background-size: cover !important;
        background-position: center !important;
        opacity: 0.85 !important;
        z-index: -9999 !important;
        pointer-events: none !important;
      }
      #typing-text {
        font-weight: bold !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Watch for DOM removals and re-add toggle & background if missing
  function observeDomChanges() {
    const observer = new MutationObserver(() => {
      if (!document.getElementById('summer-toggle-btn') && document.body) {
        addToggleButton();
      }
      if (
        !document.body.classList.contains('klavia-summer') &&
        localStorage.getItem('klaviaSummerEnabled') !== 'false'
      ) {
        applyBackground(true);
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  // Detect SPA URL changes and reapply
  function observeUrlChanges(callback) {
    let lastHref = location.href;

    function checkUrlChange() {
      if (location.href !== lastHref) {
        lastHref = location.href;
        callback();
      }
    }

    const pushState = history.pushState;
    history.pushState = function () {
      pushState.apply(this, arguments);
      checkUrlChange();
    };

    const replaceState = history.replaceState;
    history.replaceState = function () {
      replaceState.apply(this, arguments);
      checkUrlChange();
    };

    window.addEventListener('popstate', checkUrlChange);
    setInterval(checkUrlChange, 500);
  }

  function init() {
    injectCSS();
    addToggleButton();
    applyBackground(localStorage.getItem('klaviaSummerEnabled') !== 'false');
    observeDomChanges();

    observeUrlChanges(() => {
      // Delay to let page settle before reapplying
      setTimeout(() => {
        applyBackground(localStorage.getItem('klaviaSummerEnabled') !== 'false');
        addToggleButton();
      }, 500);
    });
  }

  // Wait for body to be ready before running
  function waitForBody() {
    if (document.body) {
      init();
    } else {
      const interval = setInterval(() => {
        if (document.body) {
          clearInterval(interval);
          init();
        }
      }, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForBody);
  } else {
    waitForBody();
  }
})();
