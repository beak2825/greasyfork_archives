// ==UserScript==
// @name       ViewStats Flag Fixer
// @namespace   Violentmonkey Scripts
// @match       https://*.viewstats.com/*
// @grant       none
// @version     1.0
// @author      Grizz1e
// @description Fixes the flag in ViewStats Channelytics
// @run-at      document-idle
// @license     GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/490748/ViewStats%20Flag%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/490748/ViewStats%20Flag%20Fixer.meta.js
// ==/UserScript==



/* Removes junk */
let styles = `
  img[alt="Channel Country Logo"] {
    object-fit: contain !important;
  }
`
let styleSheet = document.createElement("style")
styleSheet.innerHTML = styles
document.head.appendChild(styleSheet)