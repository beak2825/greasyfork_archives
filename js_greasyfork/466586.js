// ==UserScript==
// @name        Show search term in title - perplexity.ai
// @namespace   Violentmonkey Scripts
// @match       https://www.perplexity.ai/search/*
// @match       https://www.perplexity.ai/search
// @grant       none
// @version     1.0
// @author      Shou Ya
// @description 5/16/2023, 11:05:49 PM
// @run-at      document-idle
// @license     WTFPL
// @downloadURL https://update.greasyfork.org/scripts/466586/Show%20search%20term%20in%20title%20-%20perplexityai.user.js
// @updateURL https://update.greasyfork.org/scripts/466586/Show%20search%20term%20in%20title%20-%20perplexityai.meta.js
// ==/UserScript==

(function () {
  const setTitle = function () {
    "use strict";
    var search_term = document.querySelector("h1").innerText;
    if (!search_term) return;
    document.title = search_term + " - perplexity.ai";
  };

  setTimeout(setTitle, 1000);
})();
