// ==UserScript==
// @name         DeepSeek Retry Clicker
// @description  Automatically clicks retry icon when server is busy on chat.deepseek.com
// @match        https://chat.deepseek.com/*
// @version 0.0.1.20250714125247
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/537606/DeepSeek%20Retry%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/537606/DeepSeek%20Retry%20Clicker.meta.js
// ==/UserScript==

(function () {
  'use strict';

function hasServerBusyMessage() {
    return Array.from(document.querySelectorAll('span')).some(span =>
      span.textContent.trim() === 'Server busy, please try again later.' ||
      span.textContent.trim() === 'Check network and retry.'
    );
  }

  function searchAndClickIconButton() {
    for (const div of document.querySelectorAll('div')) {
      const svgPath = div.querySelector('svg path[d^="M12 .5C18.351.5"]');
      if (svgPath) {
        const btn = div.closest('.ds-icon-button');
        if (btn) {
          btn.click();
          break;
        }
      }
    }
  }

  function init() {
    // Run once immediately
    if (hasServerBusyMessage()) {
      searchAndClickIconButton();
    }
    // Then observe all future changes
    new MutationObserver(() => {
      if (hasServerBusyMessage()) {
        searchAndClickIconButton();
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
