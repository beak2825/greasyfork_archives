// ==UserScript==
// @name            GitHub Repo Size
// @namespace       https://gist.github.com/miraclx/aad03f43fe8ac85682b0243f4f242f0d
// @description     Calculate repo size and inject into GitHub page
// @icon            https://github.githubassets.com/favicons/favicon.png
// @version         0.2.0
// @author          miraclx
// @license         Apache-2.0
// @supportURL      https://gist.github.com/miraclx/aad03f43fe8ac85682b0243f4f242f0d
// @grant           GM_xmlhttpRequest
// @match           https://github.com/*
// @require         https://code.jquery.com/jquery-3.5.1.min.js
// @connect         tokei.rs
// @downloadURL https://update.greasyfork.org/scripts/421415/GitHub%20Repo%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/421415/GitHub%20Repo%20Size.meta.js
// ==/UserScript==
/* global $ */

(function() {
  'use strict';

  const DATA_URL = `https://tokei.rs/b1/github/${window.location.pathname.split('/').slice(1, 3).join('/')}`;
  const CLOC_ID = "tokei-cloc";
  const CLOC_ELM = document.getElementById(CLOC_ID);
  const REPO_SUMMARY = $("#repo-content-pjax-container div.Layout div.file-navigation div.flex-items-center");
  
  if (!CLOC_ELM) {
    function handleLoad(response, code) {
      if (response.response && typeof (code = response.response.code) === "number") {
        if (REPO_SUMMARY.length !== 0) {
          const bloq = $(`
            <a href="${DATA_URL}?category=code" title="Click to view badge in new tab" id="${CLOC_ID}" target="_blank" class="ml-3 Link--primary no-underline">
              <svg text="gray" class="octicon octicon-file-code" width="16" height="16" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                  <path fill-rule="evenodd" d="M8.5 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V4.5L8.5 1zM11 14H1V2h7l3 3v9zM5 6.98L3.5 8.5 5 10l-.5 1L2 8.5 4.5 6l.5.98zM7.5 6L10 8.5 7.5 11l-.5-.98L8.5 8.5 7 7l.5-1z">
                  </path>
              </svg>
              <strong>
                ${code.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1,")}
              </strong>
              <span class="text-gray-light">lines of code</span>
            </a>
          `);
          REPO_SUMMARY.append(bloq);
        }
      }
    }

    GM_xmlhttpRequest({
      method: "GET",
      url: DATA_URL,
      responseType: "json",
      headers: { "Accept": "application/json" },
      onload: handleLoad,
      onerror: console.error,
      onabort: console.error,
      ontimeout: console.error,
    });
  }
})();