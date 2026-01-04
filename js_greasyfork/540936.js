// ==UserScript==
// @name         Auto enable grounding and context in Aistudio
// @namespace    Violentmonkey Scripts
// @version      1.1
// @description  Auto-enable "Grounding with Google Search" and "Browse the URL context" once on page load
// @author       Bui Quoc Dung
// @match        https://aistudio.google.com/*
// @grant        none
// @run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/540936/Auto%20enable%20grounding%20and%20context%20in%20Aistudio.user.js
// @updateURL https://update.greasyfork.org/scripts/540936/Auto%20enable%20grounding%20and%20context%20in%20Aistudio.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const selectors = [
    'button[aria-label="Grounding with Google Search"]',
    'button[aria-label="Browse the url context"]'
  ];

  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;
      const timer = setInterval(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearInterval(timer);
          resolve(el);
        } else if ((elapsed += interval) >= timeout) {
          clearInterval(timer);
          reject();
        }
      }, interval);
    });
  }

  async function enableSwitch(selector) {
    try {
      const button = await waitForElement(selector);
      if (button.getAttribute('aria-checked') === 'false') {
        button.click();
      }
    } catch (err) {
      console.warn('Could not find:', selector);
    }
  }

  selectors.forEach(enableSwitch);
})();
