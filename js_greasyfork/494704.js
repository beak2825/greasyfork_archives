// ==UserScript==
// @name          TradingView: hide disconnected session popup for a mobile
// @description   Hides "Session disconnected" popup. Reconnect is triggered by a touch
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @version       1.0.0
// @match         https://www.tradingview.com/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js#sha512-wkU3qYWjenbM+t2cmvw2ADRRh4opbOYBjkhrPGHV7M6dcE/TR0oKpoDkWXfUs3HrulI2JFuTQyqPLRih1V54EQ==
// @run-at        document-body
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/494704/TradingView%3A%20hide%20disconnected%20session%20popup%20for%20a%20mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/494704/TradingView%3A%20hide%20disconnected%20session%20popup%20for%20a%20mobile.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
  'use strict';

  let isConnected = true;
  let popupContainer = null;
  let reconnectBtn = null;

  document.addEventListener('touchstart', () => {
    if (isConnected) return;

    isConnected = true;
    popupContainer.style.display = '';
    reconnectBtn.click();
  });

  document.arrive(
    'div[data-dialog-name="gopro-mobile"]', {
      existing: true,
    },
    (popup) => {
      // skip a container with exact same selector.
      // the popup has two of them, no need to run twice for the same one
      if (popup.querySelector('div[data-dialog-name="gopro-mobile"]')) return;

      popupContainer = document.querySelector('div#overlap-manager-root');

      if (popupContainer.contains(popup) === false) return;

      for (const p of popup.querySelectorAll('p')) {
        if (
          p.childElementCount === 0 &&
          p.innerText === 'Session disconnected' &&
          /title.+/.test(p.className) === true
        ) {
          isConnected = false;
          reconnectBtn = popup.querySelector(
            'button[data-overflow-tooltip-text*="Connect"]'
          );

          popupContainer.style.display = 'none';

          break;
        }
      }
    }
  );
}());
