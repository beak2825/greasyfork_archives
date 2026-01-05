// ==UserScript==
// @name         nullify-all-links
// @namespace    https://github.com/ahuanguchi
// @version      1.0.1
// @description  Prevent all links from working.
// @author       ahuanguchi
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/10960/nullify-all-links.user.js
// @updateURL https://update.greasyfork.org/scripts/10960/nullify-all-links.meta.js
// ==/UserScript==

window.addEventListener("load", function () {
  var i;
  var anchors = document.getElementsByTagName("a");
  var numAnchors = anchors.length;
  for (i = 0; i < numAnchors; i += 1) {
    anchors[i].removeAttribute("href");
  }
});
