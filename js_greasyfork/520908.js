// ==UserScript==
// @name         humoruniv → dogdrip redirect
// @namespace    -
// @description  -
// @version      0
// @match        *://*.humoruniv.com/*
// @run-at       document-start
// @grant        none
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://www.dogdrip.net
// @downloadURL https://update.greasyfork.org/scripts/520908/humoruniv%20%E2%86%92%20dogdrip%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/520908/humoruniv%20%E2%86%92%20dogdrip%20redirect.meta.js
// ==/UserScript==

(function () {
  try { top.location.replace('https://www.dogdrip.net/'); }
  catch (_) { location.replace('https://www.dogdrip.net/'); }
})();