// ==UserScript==
// @name         Minimal Kimi K2 Prompt Injector
// @description  Listens for postMessage events, injects content into Kimi K2 chat input, and submits
// @match        https://www.kimi.com/*
// @run-at       document-idle
// @version 0.0.1.20250715091639
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/542616/Minimal%20Kimi%20K2%20Prompt%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/542616/Minimal%20Kimi%20K2%20Prompt%20Injector.meta.js
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('message', event => {
    if (event.data.type !== 'prompt' || !event.data.content.trim()) return;

    const editor = document.querySelector('.chat-input-editor');
    if (!editor) return;

    // Inject text into contenteditable div
    editor.textContent = event.data.content;
    editor.dispatchEvent(new InputEvent('input', { bubbles: true }));

    // Click the send button if enabled
    const sendButton = document.querySelector('.send-button-container:not(.disabled) .send-button');
    if (sendButton) sendButton.click();
  });
})();