// ==UserScript==
// @name        Discord Copy/Paste
// @namespace   discord-copy-paste
// @version     1.0
// @description bypass copy and paste restriction on the Discord website
// @author      icycoldveins
// @match       https://discord.com/*
// @grant       none
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/481547/Discord%20CopyPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/481547/Discord%20CopyPaste.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function copySelectedText() {
    const selection = window.getSelection();
    const messageElement = selection.anchorNode.closest('.message');
    if (!messageElement) return;
    navigator.clipboard.writeText(selection.toString());
  }

  function copyMessageContent() {
    const messageElement = document.activeElement.closest('.message');
    if (!messageElement) return;
    const messageContent = messageElement.querySelector('.message-content');
    navigator.clipboard.writeText(messageContent.textContent.trim());
  }

  function pasteClipboardContent() {
    navigator.clipboard.readText().then((text) => {
      document.activeElement.value += text;
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
      if (event.key === 'c') {
        copySelectedText();
      } else if (event.key === 'v') {
        pasteClipboardContent();
      }
    } else if (event.shiftKey) {
      if (event.key === 'c') {
        copyMessageContent();
      } 
    }
  });
})();
