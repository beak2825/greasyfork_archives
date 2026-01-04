// ==UserScript==
// @name         WaniKani Blur Context Sentence Translations
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Blurs English translations of context sentences.
// @author       LachlanCB
// @include      /^https://(www|preview).wanikani.com/(lesson|review)/session
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454381/WaniKani%20Blur%20Context%20Sentence%20Translations.user.js
// @updateURL https://update.greasyfork.org/scripts/454381/WaniKani%20Blur%20Context%20Sentence%20Translations.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const style = document.createElement("style");
    style.setAttribute("id", "bcst-style");
    style.innerHTML = `
      .context-sentence-group > p:last-child {
        color: transparent;
        text-shadow: 0 0 8px black;
        transition: 0.3s all;
      }
      .context-sentence-group > p:last-child:hover {
        color: inherit;
        text-shadow: none;
      }
    `;
    document.querySelector("head").append(style);
})();