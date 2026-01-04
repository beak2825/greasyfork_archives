// ==UserScript==
// @license MIT
// @name         Event Look
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  meke events bigger again
// @author       dark2care
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535302/Event%20Look.user.js
// @updateURL https://update.greasyfork.org/scripts/535302/Event%20Look.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitForPanel() {
    const panel = document.querySelector('.i4d-comp-panel-body');
    if (!panel) {
      requestAnimationFrame(waitForPanel);
      return;
    }

    stylePanel(panel);
  }

  function stylePanel(panel) {
    // === СТИЛІ ДЛЯ ПАНЕЛІ ВНИЗУ ЕКРАНУ ===
    panel.style.position = 'fixed';
    panel.style.bottom = '10';
    panel.style.left = '0';
    panel.style.width = '100%';
    panel.style.height = '700px';
    panel.style.background = '#fff';
    panel.style.borderTop = '1px solid #ccc'; // Додамо верхню межу для розділення
    panel.style.zIndex = '9999';
    panel.style.boxShadow = '0 -5px 10px rgba(0,0,0,0.2)'; // Тінь зверху
    panel.style.overflow = 'auto';
  }

  waitForPanel();
})();
