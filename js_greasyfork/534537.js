// ==UserScript==
// @name         Hide Unread Counter in WhatsApp Archived Chat
// @namespace    https://yourdomain.com/
// @version      1.0
// @description  Hides the unread message counter in the "Archived" chat row in WhatsApp Web without removing the archive itself. Works in all languages and is icon-based for reliability.
// @author       DiCK
// @match        https://web.whatsapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534537/Hide%20Unread%20Counter%20in%20WhatsApp%20Archived%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/534537/Hide%20Unread%20Counter%20in%20WhatsApp%20Archived%20Chat.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const hideArchiveCounter = () => {
    // Find all buttons (like the Archived chat button)
    const buttons = document.querySelectorAll('button[aria-label]');
    buttons.forEach(button => {
      // Look for the archive icon inside the button
      const iconTitle = button.querySelector('svg title');
      if (iconTitle && iconTitle.textContent === 'archived-outline') {
        // Inside the Archive button, find spans that show unread counters
        const spans = button.querySelectorAll('span[aria-label]');
        spans.forEach(span => {
          if (/\d+/.test(span.textContent)) {
            span.style.display = 'none'; // Hide the number
          }
        });
      }
    });
  };

  // Monitor the DOM for updates since WhatsApp Web is dynamic
  const observer = new MutationObserver(() => {
    hideArchiveCounter();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Run immediately on load
  hideArchiveCounter();
})();
