// ==UserScript==
// @name          TradingView: hide disconnected session popup (PC Version)
// @description   Hides "Session disconnected" popup. Reconnect is triggered by a mouse move
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @version       1.1.0
// @match         https://www.tradingview.com/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js#sha512-wkU3qYWjenbM+t2cmvw2ADRRh4opbOYBjkhrPGHV7M6dcE/TR0oKpoDkWXfUs3HrulI2JFuTQyqPLRih1V54EQ==
// @run-at        document-body
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/494702/TradingView%3A%20hide%20disconnected%20session%20popup%20%28PC%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/494702/TradingView%3A%20hide%20disconnected%20session%20popup%20%28PC%20Version%29.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
  'use strict';

  const IS_DEBUG_MODE = true; // true or false
  const MOUSEMOVE_AMOUNT_NEEDED = 100;
  const MOUSEMOVE_RESET_INTERVAL_MS = 4000;
  const USE_ADAPTIVE_FAVICON = false;

  const originalFavicon = document.querySelector("link[rel='icon']");
  const disconnectedFavicon = (() => {
    const link = document.createElement('link');

    link.rel = 'icon';
    link.type = 'image/png';
    link.sizes = '16x16';
    link.href = [
      'data:image/png;base64,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',
    ].join('');

    return link;
  })();

  let isConnected = true;
  let popupContainer = null;
  let reconnectBtn = null;

  document.addEventListener('mousemove', (() => {
    let lastResetTime = Date.now();
    let mouseMoveCount = 0;

    return () => {
      if (isConnected) return;

      if (IS_DEBUG_MODE) reconnectBtn.innerText = mouseMoveCount;

      const now = Date.now();

      if (now - lastResetTime >= MOUSEMOVE_RESET_INTERVAL_MS) {
        lastResetTime = now;
        mouseMoveCount = 0;

        if (IS_DEBUG_MODE) reconnectBtn.innerText = 0;

        return;
      }

      mouseMoveCount++;

      if (mouseMoveCount >= MOUSEMOVE_AMOUNT_NEEDED) {
        isConnected = true;
        popupContainer.style.display = '';

        if (USE_ADAPTIVE_FAVICON) {
          disconnectedFavicon.remove();
          document.head.appendChild(originalFavicon);
        }

        reconnectBtn.click();
      }
    };
  })());

  document.arrive(
    'div[data-dialog-name="gopro"]', {
      existing: true,
    },
    (popup) => {
      // skip a container with exact same selector.
      // the popup has two of them, no need to run twice for the same one
      if (popup.querySelector('div[data-dialog-name="gopro"]')) return;

      popupContainer = document.querySelector('div#overlap-manager-root');

      if (popupContainer.contains(popup) === false) return;

      for (const div of popup.querySelectorAll('div')) {
        if (
          div.childElementCount === 0 &&
          div.innerText === 'Session disconnected' &&
          /(center|title).+(center|title).+/.test(div.className) === true
        ) {
          isConnected = false;
          reconnectBtn = popup.querySelector(
            'button[data-overflow-tooltip-text*="Connect"]'
          );

          if (USE_ADAPTIVE_FAVICON) {
            originalFavicon.remove();
            document.head.appendChild(disconnectedFavicon);
          }

          if (!IS_DEBUG_MODE) popupContainer.style.display = 'none';

          break;
        }
      }
    }
  );
})();
