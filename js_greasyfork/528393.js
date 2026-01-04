// ==UserScript==
// @name         Duck Google
// @namespace    garcialnk.com
// @license      MIT
// @version      1.0.1
// @description  Adds DuckDuckGo !bangs to Google search
// @author       GarciaLnk
// @match        *://www.google.com/search*
// @match        *://google.com/search*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @sandbox      DOM
// @tag          utilities
// @connect      duckduckgo.com
// @downloadURL https://update.greasyfork.org/scripts/528393/Duck%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/528393/Duck%20Google.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

(function () {
  "use strict";

  /**
   * DuckDuckGo bang object
   * @typedef {Object} Bang
   * @property {string} s - The search engine name
   * @property {string} t - The bang command
   * @property {string} u - The search URL with {{{s}}} as the search query
   */

  const CUSTOM_BANGS = [
    {
      s: "T3 Chat",
      t: "t3",
      u: "https://www.t3.chat/new?q={{{s}}}",
    },
  ];

  const BANG_CACHE_KEY = "bangs-cache";
  const BANG_CACHE_EXPIRY_KEY = "bangs-cache-expiry";
  const CACHE_EXPIRY_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

  /**
   * Fetches the DuckDuckGo bangs from the cache or the server
   * @returns {Promise<Bang[]>} The list of bangs
   */
  function getBangs() {
    return new Promise((resolve) => {
      const cachedBangs = GM_getValue(BANG_CACHE_KEY);
      const cacheExpiry = GM_getValue(BANG_CACHE_EXPIRY_KEY, 0);

      if (cachedBangs && Date.now() < cacheExpiry) {
        resolve([...CUSTOM_BANGS, ...cachedBangs]);
        return;
      }

      GM_xmlhttpRequest({
        method: "GET",
        url: "https://duckduckgo.com/bang.js",
        onload: function (response) {
          try {
            const bangs = JSON.parse(response.responseText);
            GM_setValue(BANG_CACHE_KEY, bangs);
            GM_setValue(BANG_CACHE_EXPIRY_KEY, Date.now() + CACHE_EXPIRY_MS);

            resolve([...CUSTOM_BANGS, ...bangs]);
          } catch (e) {
            console.error("Error parsing bangs:", e);
            resolve(CUSTOM_BANGS);
          }
        },
        onerror: function () {
          console.error("Failed to fetch bangs");
          resolve(CUSTOM_BANGS);
        },
      });
    });
  }

  /**
   * Parses the bang from the query
   * @param {string} query The search query
   * @returns {{bang: string, cleanQuery: string} | null} The bang and the clean query
   */
  function parseBang(query) {
    // regex to match !bang at start or end of query
    const match = query.match(/^!(\S+)\s+(.+)$|^(.+)\s+!(\S+)$/i);

    if (match) {
      if (match[1]) {
        // !bang query
        return {
          bang: match[1].toLowerCase(),
          cleanQuery: match[2].trim(),
        };
      } else {
        // query !bang
        return {
          bang: match[4].toLowerCase(),
          cleanQuery: match[3].trim(),
        };
      }
    }

    return null;
  }

  /**
   * Redirects to the search engine URL
   * @param {Bang[]} bangs The list of bangs
   * @returns {void}
   */
  function redirectToBang(bangs) {
    const url = new URL(window.location.href);
    const query = url.searchParams.get("q")?.trim() ?? "";

    if (!query) return;

    const bangData = parseBang(query);
    if (!bangData) return;

    const selectedBang = bangs.find((b) => b.t === bangData.bang);
    if (!selectedBang) return;

    // Format of the url is:
    // https://www.google.com/search?q={{{s}}}
    const searchUrl = selectedBang.u.replace(
      "{{{s}}}",
      // Replace %2F with / to fix formats like "!ghr+t3dotgg/unduck"
      encodeURIComponent(bangData.cleanQuery).replace(/%2F/g, "/"),
    );

    if (searchUrl) {
      window.location.replace(searchUrl);
    }
  }

  /**
   * Initializes the script
   * @returns {void}
   */
  async function init() {
    const bangs = await getBangs();
    redirectToBang(bangs);
  }

  init();
})();
