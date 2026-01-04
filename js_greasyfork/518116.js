// ==UserScript==
// @name        Verbesserte Chateingabe zum Flüstern
// @namespace   leeSalami
// @version     1.0
// @author      leeSalami
// @license     MIT
// @description Färbt die Chateinabge ein, falls es sich um eine Flüsternachricht handelt oder man sich selbst eine Nachricht schreiben würde.
// @match       https://*.leitstellenspiel.de
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/518116/Verbesserte%20Chateingabe%20zum%20Fl%C3%BCstern.user.js
// @updateURL https://update.greasyfork.org/scripts/518116/Verbesserte%20Chateingabe%20zum%20Fl%C3%BCstern.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const chatInput = document.getElementById('alliance_chat_message');

  if (!chatInput) {
    return;
  }

  setCss();
  const inputGroupAddon = chatInput.parentElement.querySelector('.input-group-addon:first-child');
  chatInput.addEventListener('input', styleInput);
  chatInput.addEventListener('keydown', removeStyle);

  function styleInput(e) {
    const chatInput = e.currentTarget;
    const message = chatInput.value;
    inputGroupAddon.classList.remove('chat-whisper', 'chat-self');

    if (message.includes('@' + username + ' ') || message.includes('/w ' + username + ' ') || message.endsWith('@' + username) || message.endsWith('/w ' + username)) {
      inputGroupAddon.classList.add('chat-self');
    } else if (message.search(/^\/w .+? .+?/) !== -1) {
      inputGroupAddon.classList.add('chat-whisper');
    }
  }

  function removeStyle(e) {
    if (e.code === 'Enter') {
      inputGroupAddon.classList.remove('chat-whisper', 'chat-self');
    }
  }

  function setCss() {
    const style = document.createElement('style');
    style.innerHTML = `
      .chat-whisper {
        color: #000 !important;
        background-color: #f0ad4e !important;
      }

      .chat-self {
        color: #fff !important;
        background-color: #c9302c !important;
      }
    `;
    document.head.appendChild(style);
  }
})();
