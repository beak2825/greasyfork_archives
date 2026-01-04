// ==UserScript==
// @name         ChatGPT Custom Shortcuts
// @namespace    http://tampermonkey.net/
// @version      2024-05-14
// @description  Add/replace some keyboard shortcuts for ChatGPT.
// @author       David
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/494884/ChatGPT%20Custom%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/494884/ChatGPT%20Custom%20Shortcuts.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.addEventListener('keydown', function(event) {
    // Focus on textarea when pressing Ctrl + /
    if (event.ctrlKey && event.key === '/') {
      // Prevent default action and stop propagation
      event.preventDefault();
      event.stopPropagation();

      document.getElementById('prompt-textarea').focus();
      return;
    }

    // Check if the focused element is the textarea
    if (document.activeElement.id === 'prompt-textarea') {
      const textarea = document.getElementById('prompt-textarea');

      // create newline (Sending Shift + Enter) when pressing Enter alone
      if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey) {
        // Prevent default action and stop propagation
        event.preventDefault();
        event.stopPropagation();

        const value = textarea.value;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        textarea.value = value.substring(0, start) + '\n' + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        return;
      }

      // Click the send button when pressing Ctrl + Enter or Shift + Enter
      if ((event.ctrlKey || event.shiftKey) && event.key === 'Enter') {
        // Prevent default action and stop propagation
        event.preventDefault();
        event.stopPropagation();

        // Copy all text in the textarea to clipboard
        textarea.select();
        document.execCommand('copy');

        // click send button
        // document.querySelector('[data-testid="send-button"]').click();
        const sendButton = document.querySelector('button.mb-1.mr-1.flex.h-8.w-8.items-center.justify-center.rounded-full.bg-black.text-white');
        sendButton.click();
      }
    }

    // Prevent the default action of Ctrl + R
    if (event.ctrlKey && event.key === 'r') {
      // Prevent default action and stop propagation
      event.preventDefault();
      event.stopPropagation();
    }

  }, true); // Using capturing phase

})();