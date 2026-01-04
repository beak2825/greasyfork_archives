// ==UserScript==
// @name         Justify Article Text
// @namespace    http://justify.articles/
// @version      1.1
// @description  Applies text-align: justify only to content inside <article> tags
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538608/Justify%20Article%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/538608/Justify%20Article%20Text.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement("style");
  style.textContent = `
    p, article, article * {
      text-align: justify !important;
    }
  `;
  document.head.appendChild(style);

  console.log("📰 Article text justified.");
})();
