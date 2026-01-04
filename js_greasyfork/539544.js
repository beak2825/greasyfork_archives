// ==UserScript==
// @name         Bandcamp Auto-Fill Purchase Dialog
// @namespace    https://romanio.dev
// @version      1.0
// @description  Auto-fills email and zip code on Bandcamp "Digital Album" dialog
// @match        https://*.bandcamp.com/album/*
// @match        https://*.bandcamp.com/track/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539544/Bandcamp%20Auto-Fill%20Purchase%20Dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/539544/Bandcamp%20Auto-Fill%20Purchase%20Dialog.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const EMAIL = "romanio412@gmail.com";
  const ZIP = "61-642";

  const dialogSelector = 'div.ui-dialog[role="dialog"]';
  const emailSelector = '#fan_email_address';
  const zipSelector = '#fan_email_postalcode';

  // Utility: wait for an element to appear
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout waiting for ' + selector)), timeout);
      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          clearTimeout(timer);
          observer.disconnect();
          resolve(el);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }

  function fillForm() {
    const emailInput = document.querySelector(emailSelector);
    const zipInput = document.querySelector(zipSelector);

    if (emailInput && zipInput) {
      emailInput.value = EMAIL;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      zipInput.value = ZIP;
      zipInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  // Watch for the dialog to appear and fill the form
  const observer = new MutationObserver(() => {
    const dialog = document.querySelector(dialogSelector);
    if (dialog && dialog.style.display !== 'none') {
      // Wait a tiny bit to let inputs render
      setTimeout(() => fillForm(), 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})();
