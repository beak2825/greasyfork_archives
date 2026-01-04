// ==UserScript==
// @name        AutoExit(CAVEGAME.IO)
// @namespace   Violentmonkey Scripts
// @match       https://cavegame.io/*
// @grant       none
// @version     2.0
// @author      Drik
// @description Fixed exit confirmation bug. Press F4 to auto-exit and rejoin
// @license     MIT
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/523780/AutoExit%28CAVEGAMEIO%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523780/AutoExit%28CAVEGAMEIO%29.meta.js
// ==/UserScript==
(function() {
  'use strict';

  Object.defineProperty(window, 'onbeforeunload', {
    configurable: true,
    get: () => null,
    set: () => {}
  });

  const originalAdd = window.addEventListener;
  window.addEventListener = function(type, listener, options) {
    if (type === 'beforeunload') return;
    return originalAdd.call(this, type, listener, options);
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'F4') {
      const tryExit = () => {
        const btn = document.querySelector('.exit-button.exit-button-top.no-select');
        if (btn) {
          btn.click();
          setTimeout(() => {
            document.querySelector('#play-cavegame-io')?.click();
          }, 200);
        }
      };
      setTimeout(tryExit, 0);
    }
  });
})();
