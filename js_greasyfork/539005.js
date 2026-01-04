// ==UserScript==
// @name         Fix Double-Encoded Characters in URLs
// @namespace    https://github.com/fixicelo/userscripts
// @version      1.0.0
// @description  Fixes a Microsoft Edge bug where URLs with Chinese characters (漢字/中文字) become double-encoded. Resolves Wikipedia errors like `請求的頁面標題包含無效的字元` that can occur after clicking links from Google search results.
// @author       fixicelo
// @license      MIT
// @match        *://*/*%25*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539005/Fix%20Double-Encoded%20Characters%20in%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/539005/Fix%20Double-Encoded%20Characters%20in%20URLs.meta.js
// ==/UserScript==

(function () {
  "use strict";
  /**
   * Repeatedly decodes a URL up to maxIterations or until no more %25 are found.
   * Prevents infinite loop on malformed or cyclic encodings.
   * @param {string} url - The URL string to decode.
   * @param {number} [maxIterations=5] - Maximum allowed decoding iterations.
   * @returns {string} - The fully decoded or best-effort decoded URL.
   */
  function fullyDecode(url, maxIterations = 5) {
    let prev = url;
    let curr = url;
    let i = 0;
    while (curr.includes("%25") && i < maxIterations) {
      try {
        curr = decodeURIComponent(curr);
      } catch (e) {
        // Malformed encoding - stop decoding
        break;
      }
      if (curr === prev) break; // No further decoding
      prev = curr;
      i++;
    }
    return curr;
  }

  /**
   * Fixes the current page's URL if it's double-encoded.
   */
  function fixCurrentPageURL() {
    const currentURL = window.location.href;
    if (!currentURL.includes("%25")) return;

    const decodedURL = fullyDecode(currentURL);
    if (decodedURL && decodedURL !== currentURL) {
      // Try to preserve hash and search if not part of the double-encoding
      // Replace only pathname and search, not protocol, host, or hash
      const urlObj = new URL(currentURL);
      const fixedObj = new URL(decodedURL);

      // Only replace if the host and protocol match (avoid redirect to unrelated site)
      if (urlObj.origin === fixedObj.origin) {
        if (
          urlObj.pathname !== fixedObj.pathname ||
          urlObj.search !== fixedObj.search
        ) {
          urlObj.pathname = fixedObj.pathname;
          urlObj.search = fixedObj.search;
          // Preserve hash from original URL if present
          window.location.replace(urlObj.toString());
        }
      } else {
        // Fallback: If origins do not match, use the fully decoded URL
        window.location.replace(decodedURL);
      }
    }
  }

  // Run as soon as possible
  fixCurrentPageURL();
})();
