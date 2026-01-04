// ==UserScript==
// @name         ChatGPT Auto-Scroll While Generating
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically scrolls ChatGPT chat to bottom while message is streaming
// @author       you
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/537631/ChatGPT%20Auto-Scroll%20While%20Generating.user.js
// @updateURL https://update.greasyfork.org/scripts/537631/ChatGPT%20Auto-Scroll%20While%20Generating.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const scrollInterval = setInterval(() => {
    const stopBtn = document.querySelector('#composer-submit-button[data-testid="stop-button"]');
    const chatContainer = document.querySelector('div.flex.h-full.flex-col.overflow-y-auto');

    if (stopBtn && chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, 50);
})();