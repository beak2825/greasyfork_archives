// ==UserScript==
// @name        Medium → Freedium Redirect
// @match       *://medium.com/*
// @run-at      document-start
// @namespace    https://youtube.com
// @version      0.1
// @description  Automatically redirect all Medium.com articles to Freedium.cfd
// @author       beka
// @icon         https://medium.com/favicon.ico
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/547086/Medium%20%E2%86%92%20Freedium%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/547086/Medium%20%E2%86%92%20Freedium%20Redirect.meta.js
// ==/UserScript==

(function() {
  let newUrl = window.location.href.replace("medium.com/", "freedium.cfd/");
  window.location.replace(newUrl);
})();
