// ==UserScript==
// @name         DriversEd Auto-Next with Stop Button
// @namespace    https://driversed.com/
// @version      1.0.1
// @description  Auto-click the "Next" button when timer ends, with a Stop button to cancel auto-clicking.
// @author       NellowTCS
// @match        https://app.driversed.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544171/DriversEd%20Auto-Next%20with%20Stop%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/544171/DriversEd%20Auto-Next%20with%20Stop%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitAndClickNext() {
    const btn = document.getElementById('arrow-next');
    if (!btn) {
      console.warn('Next button not found, retrying...');
      setTimeout(waitAndClickNext, 500);
      return;
    }

    const observer = new MutationObserver(() => {
      if (!btn.disabled) {
        console.log('Next button enabled! Clicking now...');
        btn.click();
        observer.disconnect();
        removeStopButton();
      }
    });

    observer.observe(btn, { attributes: true, attributeFilter: ['disabled'] });
    console.log('Waiting for button to be enabled...');

    if (!document.getElementById('stop-auto-next')) {
      const stopBtn = document.createElement('button');
      stopBtn.id = 'stop-auto-next';
      stopBtn.textContent = 'Stop Auto-Next';
      stopBtn.style.position = 'fixed';
      stopBtn.style.bottom = '20px';
      stopBtn.style.right = '20px';
      stopBtn.style.zIndex = 10000;
      stopBtn.style.background = '#ff4d4d';
      stopBtn.style.color = '#fff';
      stopBtn.style.border = 'none';
      stopBtn.style.padding = '10px 14px';
      stopBtn.style.borderRadius = '6px';
      stopBtn.style.cursor = 'pointer';
      stopBtn.style.fontSize = '14px';
      stopBtn.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

      stopBtn.onclick = () => {
        observer.disconnect();
        console.log('Auto-clicker stopped manually.');
        removeStopButton();
      };

      document.body.appendChild(stopBtn);
    }

    function removeStopButton() {
      const existing = document.getElementById('stop-auto-next');
      if (existing) existing.remove();
    }
  }

  waitAndClickNext();
})();