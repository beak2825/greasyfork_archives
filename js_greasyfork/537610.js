// ==UserScript==
// @name         ChatGPT Submit Edit on Enter Key
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Trigger Send button on Enter keypress without modifiers
// @match        https://chat.openai.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/537610/ChatGPT%20Submit%20Edit%20on%20Enter%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/537610/ChatGPT%20Submit%20Edit%20on%20Enter%20Key.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      const btn = [...document.querySelectorAll('button.btn.relative.btn-primary')]
        .find(b => b.innerText.trim() === 'Send');
      if (btn && !btn.disabled) btn.click();
      else console.log('Button not found');
    }
  });
})();
