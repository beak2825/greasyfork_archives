// ==UserScript==
// @name       Remove "Translate This Page" in Google Search Results
// @namespace  https://mkpo.li/
// @description Sometimes especially in non-English google searchs, there will be Translate This Page which is annoying if you can read English.
// @license    CC0
// @version    0.1.0
// @author     mkpoli
// @icon       https://www.google.com/favicon.ico
// @match      https://www.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/509479/Remove%20%22Translate%20This%20Page%22%20in%20Google%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/509479/Remove%20%22Translate%20This%20Page%22%20in%20Google%20Search%20Results.meta.js
// ==/UserScript==

(function () {
  'use strict';

  for (const citeElement of [...document.querySelectorAll("cite + div")]) {
    citeElement.style.display = "none";
  }

})();