// ==UserScript==
// @name        Sorry, interest.co.nz
// @namespace   interest.co.nz
// @match       https://www.interest.co.nz/*
// @grant       GM_addStyle
// @version     1.0
// @description Hide adblock banner
// @downloadURL https://update.greasyfork.org/scripts/416072/Sorry%2C%20interestconz.user.js
// @updateURL https://update.greasyfork.org/scripts/416072/Sorry%2C%20interestconz.meta.js
// ==/UserScript==

GM_addStyle(
  `
  .black-overlay, #pp-ablock-banner-wrapper { display: none !important; }
  body { overflow: visible !important; }
  `
);
