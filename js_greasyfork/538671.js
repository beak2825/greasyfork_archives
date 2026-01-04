// ==UserScript==
// @name         ChatGPT Temp Chat By Default
// @namespace    nisc
// @version      2025.06.08-B
// @description  Automatically enables temporary mode on ChatGPT unless manually disabled by the user
// @homepageURL  https://github.com/nisc/chatgpt-userscripts/
// @author       nisc
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538671/ChatGPT%20Temp%20Chat%20By%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/538671/ChatGPT%20Temp%20Chat%20By%20Default.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Track if user has manually disabled temporary chat mode
  let userDisabledTempChat = false;

  /**
   * Find the temporary chat toggle button in the UI
   * @returns {HTMLButtonElement|null} The temporary chat button or null if not found
   */
  function getTempChatButton() {
    return document.querySelector('button[aria-label*="temporary chat"]');
  }

  /**
   * Enable temporary chat mode if not manually disabled by user
   * Makes multiple attempts to find and click the button
   */
  function activateTemporaryMode() {
    if (userDisabledTempChat) return;

    let attempts = 0;
    const maxAttempts = 5;
    const interval = 500;

    const tryFindButton = setInterval(() => {
      const tempChatButton = getTempChatButton();
      if (tempChatButton) {
        // Add listener to detect when user manually disables temp chat
        if (!tempChatButton._hasListener) {
          tempChatButton.addEventListener('click', function () {
            userDisabledTempChat = this.getAttribute('aria-label') === 'Turn off temporary chat';
          });
          tempChatButton._hasListener = true;
        }

        // Enable temporary chat if it's currently off
        if (tempChatButton.getAttribute('aria-label') === 'Turn on temporary chat') {
          tempChatButton.click();
        }
        clearInterval(tryFindButton);
      } else if (attempts++ >= maxAttempts) {
        clearInterval(tryFindButton);
      }
    }, interval);
  }

  /**
   * Set up observer to watch for DOM changes that indicate a new chat
   * This ensures we catch new chats created via the UI
   */
  function setupMutationObserver() {
    const targetNode = document.querySelector('#conversation-header-actions') || document.body;
    const observer = new MutationObserver(() => {
      const tempChatButton = getTempChatButton();
      if (tempChatButton && tempChatButton.getAttribute('aria-label') === 'Turn on temporary chat') {
        userDisabledTempChat = false; // Reset flag for new chat
        activateTemporaryMode();
      }
    });
    observer.observe(targetNode, { childList: true, subtree: true });
  }

  /**
   * Handle URL/history state changes to detect new chats
   * This ensures we catch new chats created via URL navigation
   */
  function handleStateChange() {
    if (window.location.pathname.startsWith('/c/')) {
      userDisabledTempChat = false;
      activateTemporaryMode();
    }
  }

  // Wrap history methods to detect URL-based chat changes
  if (!window._historyWrapped) {
    const originalPushState = history.pushState;
    history.pushState = function () {
      originalPushState.apply(this, arguments);
      handleStateChange();
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function () {
      originalReplaceState.apply(this, arguments);
      handleStateChange();
    };
    window._historyWrapped = true;
  }

  // Initialize when page loads
  window.addEventListener('load', function () {
    setupMutationObserver();
    activateTemporaryMode();
  });
})();
