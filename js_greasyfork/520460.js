// ==UserScript==
// @name         Startpage - Remove Google Merchant Center Tracking Parameters
// @version      1.1.2
// @description  Remove Google Merchant Center query parameters from links and their corresponding text on Startpage.com results
// @namespace    August4067
// @author       August4067
// @match        https://www.startpage.com/*
// @license      MIT
// @grant        none
// @icon         https://www.startpage.com/favicon.ico
// @require      https://update.greasyfork.org/scripts/502635/1422102/waitForKeyElements-CoeJoder-fork.js
// @downloadURL https://update.greasyfork.org/scripts/520460/Startpage%20-%20Remove%20Google%20Merchant%20Center%20Tracking%20Parameters.user.js
// @updateURL https://update.greasyfork.org/scripts/520460/Startpage%20-%20Remove%20Google%20Merchant%20Center%20Tracking%20Parameters.meta.js
// ==/UserScript==

/**
 * Removes the 'srsltid' parameter from a URL if it exists.
 * @param {string} url - The original URL.
 * @returns {string} - The cleaned URL.
 */
function removeSrsltidParam(url) {
  const urlObj = new URL(url);

  if (urlObj.searchParams.has("srsltid")) {
    urlObj.searchParams.delete("srsltid");
    return urlObj.toString();
  }

  return url;
}

/**
 * Cleans up links on the page by removing 'srsltid' parameters from hrefs and link text.
 */
function cleanUpLinks() {
  console.debug("Cleaning up links");
  const wgl = document.querySelector("div[class~='w-gl']");

  if (wgl) {
    const links = wgl.querySelectorAll("a");

    links.forEach((link) => {
      const originalHref = link.href;
      const newHref = removeSrsltidParam(originalHref);

      if (newHref !== originalHref) {
        console.debug(`Removing srsltid: ${originalHref}`);
        link.href = newHref;
        link.ariaLabel = newHref;
        
        const linkTexts = link.querySelectorAll('span[class~="link-text"]');
        linkTexts.forEach(linkText => {
          if (linkText.innerText === originalHref) {
            linkText.innerText = newHref;
          }
        });
        
        console.debug(`Result: ${newHref}`);
      }
    });
  }
  console.debug("Cleaned up links");
}

(function () {
  "use strict";
  waitForKeyElements("section[id='main']", () => {
    cleanUpLinks();
  }, false);
})();
