// ==UserScript==
// @name         Google Translate Keyboard Shortcut
// @namespace    https://github.com/Greenek
// @version      1.1
// @description  Press ctrl-s to swap active languages
// @author       Paweł Golonko
// @license      MIT; https://opensource.org/licenses/MIT
// @copyright    2017, Paweł Golonko (http://greenek.com)
// @homepageURL  https://github.com/Greenek/google-translate-keyboard-shortcut-userscript
// @supportURL   https://github.com/Greenek/google-translate-keyboard-shortcut-userscript/issues
// @icon         https://raw.githubusercontent.com/Greenek/google-translate-keyboard-shortcut-userscript/master/icon.png
// @grant        none
// @run-at       document-end
// @include      http://translate.google.tld/*
// @include      https://translate.google.tld/*
// @downloadURL https://update.greasyfork.org/scripts/21928/Google%20Translate%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/21928/Google%20Translate%20Keyboard%20Shortcut.meta.js
// ==/UserScript==
(() => {
  'use strict';
  
  // Get swap button element
  const swapBtn = document.getElementById('gt-swap');

  /**
   * Swap languages by emulating mouse click events on UI button.
   */
  function swapLanguages() {
    ['mouseover', 'mousedown', 'mouseup'].forEach(type =>
      swapBtn.dispatchEvent(new MouseEvent(type))
    );
  }

  /**
   * Set listeners for shortcut event.
   */
  window.addEventListener(
    'keypress',
    event => {
      if (event.key === 's' && event.ctrlKey) {
        swapLanguages();
      }
    },
    true
  );
})();