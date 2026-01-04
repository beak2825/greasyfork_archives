// ==UserScript==
// @name         Google Search Subdomain Extractor
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Extracts unique subdomains from Google search result <cite> tags, logs beautifully, and sends to a local Python server. / 从 Google 搜索结果提取子域名，并发送到本地 Python 服务器。
// @author       特让他也让
// @match        https://*.google.com/search*
// @connect      127.0.0.1
// @icon         https://www.google.com/favicon.ico
// @connect      localhost
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @run-at       document-idle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/531972/Google%20Search%20Subdomain%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/531972/Google%20Search%20Subdomain%20Extractor.meta.js
// ==/UserScript==

/*
 * Google Search Subdomain Extractor
 * Copyright (C) 2025 特让他也让
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

(function () {
  "use strict";

  const DEBOUNCE_DELAY = 700;
  const PYTHON_SERVER_URL = "http://127.0.0.1:5123/save_subdomains";
  const SCRIPT_PREFIX = "[Subdomain Extractor]";
  const STYLE_TITLE = "color: #1a73e8; font-weight: bold; font-size: 1.1em;";
  const STYLE_COUNT = "color: #1e8e3e; font-weight: bold;";
  const STYLE_INFO = "color: #5f6368;";
  const STYLE_HOSTNAME = "color: #202124;";
  const STYLE_SERVER_OK = "color: #1e8e3e;";
  const STYLE_SERVER_ERR = "color: #d93025; font-weight: bold;";

  let extractionTimeoutId = null;
  let serverSendTimeoutId = null;
  let foundHostnames = new Set();

  function sendHostnamesToServer(hostnamesArray) {
    if (hostnamesArray.length === 0) return;

    GM_log(
      `%c${SCRIPT_PREFIX} Attempting to send ${hostnamesArray.length} hostnames to server...`,
      STYLE_INFO
    );

    GM_xmlhttpRequest({
      method: "POST",
      url: PYTHON_SERVER_URL,
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ hostnames: hostnamesArray }),
      timeout: 5000,
      onload: function (response) {
        try {
          const result = JSON.parse(response.responseText);
          if (response.status === 200 && result.status === "success") {
            console.log(
              `%c${SCRIPT_PREFIX} Server Response: OK - Received ${result.received}, Added ${result.newly_added} new, Total ${result.total_saved}`,
              STYLE_SERVER_OK
            );
          } else {
            console.error(
              `%c${SCRIPT_PREFIX} Server Error: ${
                result.message || response.statusText
              }`,
              STYLE_SERVER_ERR,
              response
            );
          }
        } catch (e) {
          console.error(
            `%c${SCRIPT_PREFIX} Failed to parse server response:`,
            STYLE_SERVER_ERR,
            response.responseText,
            e
          );
        }
      },
      onerror: function (response) {
        console.error(
          `%c${SCRIPT_PREFIX} Network Error: Could not connect to server at ${PYTHON_SERVER_URL}. Is it running?`,
          STYLE_SERVER_ERR,
          response
        );
      },
      ontimeout: function () {
        console.error(
          `%c${SCRIPT_PREFIX} Timeout: No response from server at ${PYTHON_SERVER_URL}.`,
          STYLE_SERVER_ERR
        );
      },
    });
  }

  function extractAndLogSubdomains() {
    console.log(`%c${SCRIPT_PREFIX} Running extraction...`, STYLE_INFO);
    const citeElements = document.querySelectorAll("cite");
    const initialSize = foundHostnames.size;

    citeElements.forEach((cite) => {
      const urlText = cite.textContent.trim();
      if (!urlText) return;

      let potentialUrl = urlText.split(" › ")[0].split(" ...")[0].trim();

      try {
        let urlObject;
        if (!potentialUrl.startsWith("http")) {
          if (potentialUrl.includes(".")) {
            potentialUrl = "https://" + potentialUrl;
          } else return;
        }
        urlObject = new URL(potentialUrl);
        const hostname = urlObject.hostname.toLowerCase();
        if (hostname) {
          foundHostnames.add(hostname);
        }
      } catch (e) {}
    });

    const newlyFoundCount = foundHostnames.size - initialSize;

    console.groupCollapsed(
      `%c${SCRIPT_PREFIX} Extraction Complete`,
      STYLE_TITLE
    );
    if (newlyFoundCount > 0)
      console.log(
        `%cFound ${newlyFoundCount} new unique hostnames this pass.`,
        STYLE_INFO
      );
    else if (foundHostnames.size > 0)
      console.log(`%cNo new unique hostnames found this pass.`, STYLE_INFO);

    if (foundHostnames.size > 0) {
      console.log(
        `%cTotal unique hostnames found (client-side): ${foundHostnames.size}`,
        STYLE_COUNT
      );
      console.log("--------------------");
      const sortedHostnames = Array.from(foundHostnames).sort();
      sortedHostnames.forEach((hostname) =>
        console.log(`%c  ${hostname}`, STYLE_HOSTNAME)
      );
      console.log("--------------------");

      clearTimeout(serverSendTimeoutId);
      serverSendTimeoutId = setTimeout(() => {
        sendHostnamesToServer(sortedHostnames);
      }, 200);
    } else {
      console.log(`%cNo hostnames found yet.`, STYLE_INFO);
    }
    console.groupEnd();
  }

  function debounceExtract() {
    clearTimeout(extractionTimeoutId);
    extractionTimeoutId = setTimeout(extractAndLogSubdomains, DEBOUNCE_DELAY);
  }

  const targetNode = document.body;
  if (targetNode) {
    const observer = new MutationObserver(debounceExtract);
    observer.observe(targetNode, { childList: true, subtree: true });
    console.log(
      `%c${SCRIPT_PREFIX} Initialized. Watching for page changes. Ready to send data to ${PYTHON_SERVER_URL}`,
      STYLE_INFO
    );
  } else {
    console.warn(
      `%c${SCRIPT_PREFIX} Could not find target node for MutationObserver. Dynamic updates might not trigger extraction.`,
      "color: orange;"
    );
  }

  setTimeout(extractAndLogSubdomains, 500);

  function GM_log(message, ...styles) {
    console.log(message, ...styles);
  }
})();
