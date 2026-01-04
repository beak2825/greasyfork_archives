// ==UserScript==
// @name        Microsoft Learn in English
// @description Always navigate from localized Microsoft Learn pages to the main en-us documentation
// @namespace   https://www.pietz.me/
// @match       https://learn.microsoft.com/*
// @run-at      document-start
// @grant       none
// @version     1.0
// @author      Tim Pietz
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/461860/Microsoft%20Learn%20in%20English.user.js
// @updateURL https://update.greasyfork.org/scripts/461860/Microsoft%20Learn%20in%20English.meta.js
// ==/UserScript==


(function() {
  const enUsPathname = window.location.pathname.replace(/^\/[a-z]{2}-[a-z]{2}\//, '/en-us/');
  if (window.location.pathname !== enUsPathname) {
    window.location.pathname = enUsPathname;
  }
})()
