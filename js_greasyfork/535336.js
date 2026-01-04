// ==UserScript==
// @name         Youtube Remove Timestamp
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.4.0
// @description  Removes the timestamp from URL, so it doesn't invalidate your progress when you reload the page.
// @author       Alistair1231
// @match        https://www.youtube.com/*
// @icon         https://icons.duckduckgo.com/ip2/youtube.com.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535336/Youtube%20Remove%20Timestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/535336/Youtube%20Remove%20Timestamp.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/535336-youtube-remove-timestamp/
// https://github.com/Alistair1231/my-userscripts/blob/master/youtube-remove-timestamp.user.js

(function () {
  "use strict";

  function removeTimestamp() {
    if (!window.location.href.includes("https://www.youtube.com/watch")) return;

    // Parse query parameters
    const params = new URLSearchParams(window.location.search);
    if (!params.has("t")) return; // No timestamp, nothing to do

    console.log("Removing timestamp from URL");
    params.delete("t");
    const newSearch = params.toString() ? `?${params.toString()}` : "";
    const newUrl = `${window.location.origin}${window.location.pathname}${newSearch}${window.location.hash}`;
    // Only update if different
    if (window.location.href !== newUrl) {
      window.history.replaceState(null, "", newUrl);
    }
  }

  removeTimestamp();
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      removeTimestamp();
    }
  }, 200);
})();
