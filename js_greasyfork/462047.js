// ==UserScript==
// @name         Google Search No Sponsors
// @namespace    https://stay.app/
// @version      0.1
// @description  Remove Sponsors Ads from Google Search results
// @author       Z3r0CooL
// @match        *://*google.com/search*
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/462047/Google%20Search%20No%20Sponsors.user.js
// @updateURL https://update.greasyfork.org/scripts/462047/Google%20Search%20No%20Sponsors.meta.js
// ==/UserScript==
(function () {
    'use strict';
  const container = document.getElementById('tads');
  if (container) container.remove();
})();