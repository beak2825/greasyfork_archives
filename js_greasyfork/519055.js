// ==UserScript==
// @name         Blur WhatsApp Chats
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  Blurs inactive WhatsApp chats and reveals them on hover
// @author       Meer Sagor
// @match        https://web.whatsapp.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whatsapp.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519055/Blur%20WhatsApp%20Chats.user.js
// @updateURL https://update.greasyfork.org/scripts/519055/Blur%20WhatsApp%20Chats.meta.js
// ==/UserScript==
(function () {
  'use strict';
  /**
   * Apply blur effect to an element
   */
  function applyBlurEffect(element) {
    if (!element.style.filter.includes('blur')) {
      element.style.filter = 'blur(8px)';
      element.style.transition = 'filter 0.3s ease-in-out';
    }
    element.addEventListener(
      'mouseenter',
      () => (element.style.filter = 'none')
    );
    element.addEventListener(
      'mouseleave',
      () => (element.style.filter = 'blur(8px)')
    );
  }

  /**
   * Blur chat items
   */
  function blurChatList() {
    const chatList = document.querySelector('[aria-label="Chat list"]');
    if (!chatList) return;

    const chatItems = chatList.querySelectorAll('[role="listitem"]');
    chatItems.forEach((chatItem) => applyBlurEffect(chatItem));
  }

  /**
   * Blur messages inside the active conversation
   */
  function blurMessages() {
    const messageContainer = document.querySelector('#main');
    if (!messageContainer) return;

    const messages = messageContainer.querySelectorAll(
      '.message-in, .message-out'
    );
    messages.forEach((message) => applyBlurEffect(message));
  }

  /**
   * Utility function to handle when the [aria-label="Chat list"] element is added to the DOM
   */
  function observeChatListCreation() {
    // Observe the document body for DOM changes
    const observer = new MutationObserver(() => {
      const chatList = document.querySelector('[aria-label="Chat list"]');
      if (chatList) {
        observer.disconnect(); // Stop observing once the element is found
        const chatItems = chatList.querySelectorAll('[role="listitem"]');
        chatItems.forEach((chatItem) => {
          chatItem.addEventListener('click', () => {
            blurMessages();
          });
        });
        blurChatList();
      }
    });
    // Start observing the DOM
    observer.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * Observe new messages in the conversation
   */
  function observeNewMessages() {
    // Target the parent node where the #main element will be added (usually the body or a specific container)
    const targetNode = document.body;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1 && node.getAttribute('role') === 'row') {
              // Apply blur to newly added messages
              const inMessages = node.querySelectorAll('.message-in');
              // inMessages.forEach(applyBlurEffect);
              inMessages.forEach((message) => {
                applyBlurEffect(message);
              });

              const outMessages = node.querySelectorAll('.message-out');
              // outMessages.forEach(applyBlurEffect);
              outMessages.forEach((message) => {
                applyBlurEffect(message);
              });
            }
          });
        }
      });
    });
    observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });
  }

  /**
   * Reapply blur effect on tab visibility change
   */
  function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
      blurMessages();
    }
  }

  function observing() {
    observeChatListCreation();
    observeNewMessages();
  }

  // Initialize the script
  window.addEventListener('load', () => {
    observing();
    document.addEventListener('visibilitychange', handleVisibilityChange);
  });
})();
