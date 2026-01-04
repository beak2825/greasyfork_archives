// ==UserScript==
// @name         TikTok DMs - Realistic Middle-Click Autoscroll Firefox
// @namespace    Fanatiikon
// @version      1.1.2
// @description  Simulates native middle-click scroll in TikTok DMs, continues scrolling until clicked again.
// @match        https://www.tiktok.com/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1495774
// @downloadURL https://update.greasyfork.org/scripts/543053/TikTok%20DMs%20-%20Realistic%20Middle-Click%20Autoscroll%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/543053/TikTok%20DMs%20-%20Realistic%20Middle-Click%20Autoscroll%20Firefox.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SELECTOR = '.css-96mvex-DivChatMain';

  let isAutoscrolling = false;
  let scrollInterval = null;
  let startY = 0;
  let currentY = 0;

  function startAutoscroll(panel, startClientY) {
    startY = startClientY;
    currentY = startClientY;

    document.body.style.cursor = 'ns-resize';
    isAutoscrolling = true;

    scrollInterval = setInterval(() => {
      const delta = (currentY - startY) * 0.2;
      panel.scrollTop += delta;
    }, 16); // ~60fps

    document.addEventListener('mousemove', trackMouse);
    document.addEventListener('mousedown', stopAutoscroll, true);
    document.addEventListener('mouseup', ignoreClick, true);
    document.addEventListener('contextmenu', stopAutoscroll, true);
  }

  function stopAutoscroll(e) {
    if (!isAutoscrolling) return;

    isAutoscrolling = false;
    clearInterval(scrollInterval);
    scrollInterval = null;
    document.body.style.cursor = '';

    document.removeEventListener('mousemove', trackMouse);
    document.removeEventListener('mousedown', stopAutoscroll, true);
    document.removeEventListener('mouseup', ignoreClick, true);
    document.removeEventListener('contextmenu', stopAutoscroll, true);
    e.stopImmediatePropagation(); // block the click from interacting with TikTok
    e.preventDefault(); // prevent weird UI flickers
  }

  function ignoreClick(e) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }

  function trackMouse(e) {
    currentY = e.clientY;
  }

  function attachScrollSim(panel) {
    if (!panel || panel.__simScrollInstalled) return;
    panel.__simScrollInstalled = true;

    panel.addEventListener('mousedown', (e) => {
      if (e.button === 1) {
        e.preventDefault();
        e.stopImmediatePropagation();

        if (!isAutoscrolling) {
          startAutoscroll(panel, e.clientY);
        } else {
          stopAutoscroll(e); // second middle click = stop
        }
      }
    }, true);
  }

  const observer = new MutationObserver(() => {
    const panel = document.querySelector(SELECTOR);
    if (panel) attachScrollSim(panel);
  });

  observer.observe(document.body, { childList: true, subtree: true });

  console.log('🌀 Realistic TikTok middle-click scroll simulation ready.');
})();
