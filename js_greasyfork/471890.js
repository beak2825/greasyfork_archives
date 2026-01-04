// ==UserScript==
// @name         userscript-github-close-404
// @namespace    https://github.com/mefengl
// @version      0.0.2
// @description  Auto-closes GitHub repo pages that return a 404 error.
// @author       mefengl
// @match        https://github.com/*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471890/userscript-github-close-404.user.js
// @updateURL https://update.greasyfork.org/scripts/471890/userscript-github-close-404.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var errorImage = document.querySelector('img[alt="404 “This is not the web page you are looking for”"]');
  if (errorImage) {
    window.close();
  }
})();
