// ==UserScript==
// @name         Google AI Studio - Press Enter to Submit
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces Ctrl+Enter with just Enter to send prompts in Google AI Studio. Shift+Enter still works for new lines.
// @author       PeterDevCoding
// @match        https://aistudio.google.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538931/Google%20AI%20Studio%20-%20Press%20Enter%20to%20Submit.user.js
// @updateURL https://update.greasyfork.org/scripts/538931/Google%20AI%20Studio%20-%20Press%20Enter%20to%20Submit.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // This function sets up the event listener on the prompt textarea.
  const setupEnterListener = (textarea) => {
    // Avoid attaching the event multiple times to the same element.
    if (textarea.dataset.enterHooked) {
      return;
    }
    textarea.dataset.enterHooked = 'true';

    textarea.addEventListener('keydown', function (e) {
      // Check if the 'Enter' key is pressed without any modifier keys (Shift, Ctrl, Meta).
      if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
        // Prevent the default action (which is to create a new line).
        e.preventDefault();

        // Create a new keyboard event that simulates Ctrl+Enter being pressed.
        const ctrlEnterEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'Enter',
          code: 'Enter',
          ctrlKey: true, // This is the magic part!
        });

        // Dispatch the simulated event on the textarea, which the website will interpret as a submit action.
        textarea.dispatchEvent(ctrlEnterEvent);
      }
    });
  };

  // Google AI Studio loads its UI dynamically. We need to wait for the textarea to appear.
  // A MutationObserver is the most efficient way to do this.
  const observer = new MutationObserver((mutations) => {
    // We look for the specific textarea used for prompts.
    const textarea = document.querySelector('textarea.textarea');
    if (textarea) {
      setupEnterListener(textarea);
      // Optional: once we've found and hooked the textarea, we could stop observing
      // to save resources, but keeping it active handles cases where the UI might reload.
      // observer.disconnect();
    }
  });

  // Start observing the entire document body for added or removed nodes.
  observer.observe(document.body, { childList: true, subtree: true });
})();
