// ==UserScript==
// @name         Qwen Chat Auto-Paste
// @description  Paste received string message into the chat.qwen.ai textarea
// @match        https://chat.qwen.ai/*
// @version 0.0.1.20250516104227
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/536188/Qwen%20Chat%20Auto-Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/536188/Qwen%20Chat%20Auto-Paste.meta.js
// ==/UserScript==

(function () {
  window.addEventListener('message', event => {

    if (event.data && event.data.type === 'searchButtonClicked') {

      document.querySelector('i.icon-line-globe-01')?.closest('button')?.click();

      return;
    }

    if (event.data && event.data.type === 'reasonButtonClicked') {

      document.querySelector('i.icon-line-deepthink-01')?.closest('button')?.click();

      return;
    }

    if (event.data?.type === 'newChatButtonClicked') {
      document.querySelector('i.icon-line-message-alert-plus')?.closest('button')?.click();
      return;
    }

    if (event.data.type === 'prompt') {
      const textarea = document.getElementById('chat-input');
      if (textarea) {

const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set;
nativeInputValueSetter?.call(textarea, event.data.content);

        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        document.getElementById('send-message-button').click();
      }
    }
  });
})();