// ==UserScript==
// @name        Search Engine String Helper for Firefox Mobile
// @namespace   Violentmonkey Scripts
// @match       http*://*/*
// @license     GPL3
// @grant       GM_setClipboard
// @version     1.0
// @author      sonofevil
// @description 1/9/2024, 2:10:22 PM
// @downloadURL https://update.greasyfork.org/scripts/484361/Search%20Engine%20String%20Helper%20for%20Firefox%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/484361/Search%20Engine%20String%20Helper%20for%20Firefox%20Mobile.meta.js
// ==/UserScript==

  if (document.URL.includes("sqph")) {
    GM_setClipboard(document.URL.replace("sqph","%s"));
  }