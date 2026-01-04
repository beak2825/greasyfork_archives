// ==UserScript==
// @name         Steam Retry
// @author       https://github.com/Matt-RJ
// @namespace    https://github.com/Matt-RJ/tampermonkey-scripts/blob/master/steam-retry
// @version      1.0.0
// @description  Automatically refreshes the page when Steam fails to load your inventory history.
// @match        *://steamcommunity.com/id/*/tradehistory*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/474705/Steam%20Retry.user.js
// @updateURL https://update.greasyfork.org/scripts/474705/Steam%20Retry.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Max number of retries before the script stops. Set to 0 to retry indefinitely.
  const MAX_RETRIES = 5;
  // How long in ms to wait before refreshing the page when loading fails.
  const RETRY_DELAY = 500; // ! Beware of potential flashing lights and rate limits if lowering this

  class SteamRetry {
    constructor({ maxRetries, retryDelay }) {
      if (!Number.isInteger(maxRetries)) {
        throw new Error('SteamRetry | maxRetries must be an integer.');
      }
      if (!Number.isInteger(retryDelay)) {
        throw new Error('SteamRetry | retryDelay must be an integer.');
      }
      this.ERROR_EL_CLASS_NAME = '.profile_fatalerror_message';
      this.LOAD_ERROR_MESSAGE = 'There was a problem loading your inventory history.';
      this.RETRY_KEY = 'steam-retry-retries-count';
      this.maxRetries = maxRetries;
      this.retryDelay = retryDelay;
      this.retries = 0;
    }

    shouldRetry() {
      if (this.maxRetries <= 0) {
        return true;
      }
      return this.retries < this.maxRetries;
    }

    async start() {
      // Once you run out of retries, the page stops refreshing automatically.
      // This resets the retry count when you refresh the page afterwards manually, or navigate away to a new page. 
      window.addEventListener('beforeunload', async (e) => {
        e.preventDefault(); // Stop the event until the async function is done.
        // reset the retry count only if the maximum number of retries has been reached
        if (!this.shouldRetry()) {
          await GM_setValue(this.RETRY_KEY, 0);
        }
        return e;
      });

      window.addEventListener('load', async () => {
        this.retries = await GM_getValue(this.RETRY_KEY, 0);
        console.log('SteamRetry | Starting...');
        console.log(`SteamRetry | Retry ${this.retries}/${this.maxRetries <= 0 ? 'ထ' : this.maxRetries}`);
        const errorEl = document.querySelector(this.ERROR_EL_CLASS_NAME);
        if (errorEl && errorEl.innerText === this.LOAD_ERROR_MESSAGE) {
          console.log('SteamRetry | Failed to load.');
          if (!this.shouldRetry()) {
            console.log('SteamRetry | Max retries reached.');
            return;
          }
          await this.refresh();
        } else {
          console.log('SteamRetry | Could not find error message; stopping.');
          await this.reset();
        }
      });
    }

    async refresh() {
      console.log('SteamRetry | Refreshing...');
      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, this.retryDelay)),
        GM_setValue(this.RETRY_KEY, this.retries + 1)
      ]);
      document.location.reload();
    }

    async reset() {
      console.log('SteamRetry | Resetting retries to default...');
      await GM_setValue(this.RETRY_KEY, 0);
    }
  }

  const steamRetry = new SteamRetry({
    maxRetries: MAX_RETRIES,
    retryDelay: RETRY_DELAY,
  });
  steamRetry.start();
})();