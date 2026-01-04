// ==UserScript==
// @name         ULR ws-client patcher
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Avoid websocket timeouts
// @author       Me
// @match        https://www.playunlight.online/?*
// @match        https://www.playunlight-dmm.com/?*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547597/ULR%20ws-client%20patcher.user.js
// @updateURL https://update.greasyfork.org/scripts/547597/ULR%20ws-client%20patcher.meta.js
// ==/UserScript==

//////// Settings Start ////////
const MAX_RETRIES = 20; // MAX_RETRIES can be set to any positive integer or Infinity
//////// Settings End ////////

(function () {
  "use strict";

  async function patchWSclient(WSClient) {
    const originalFetch = WSClient.prototype.fetch;
    WSClient.prototype.fetch = async function (...args) {
      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
          return await originalFetch.apply(this, args);
        } catch (error) {
          const now = new Date().toISOString();
          console.debug(
            `[${now}] WebSocket fetch failed (attempt ${attempt + 1}),`,
            error
          );
          if (attempt + 1 >= MAX_RETRIES) {
            throw error;
          }
        }
      }
    };
  }

  async function checkWSClient() {
    return new Promise((resolve) => {
      const checkGameInterval = setInterval(() => {
        if (window?.game?.scene?.keys?.Unlight_Init?.socket?.constructor) {
          clearInterval(checkGameInterval);
          resolve(window?.game?.scene?.keys?.Unlight_Init?.socket?.constructor);
        }
      }, 500);
    });
  }

  checkWSClient().then(patchWSclient);
})();
