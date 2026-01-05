// ==UserScript==
// @name         hide-iframes
// @namespace    https://github.com/ahuanguchi
// @version      1.0.1
// @description  Hide all iframes on the page.
// @author       ahuanguchi
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/10963/hide-iframes.user.js
// @updateURL https://update.greasyfork.org/scripts/10963/hide-iframes.meta.js
// ==/UserScript==

window.addEventListener("load", function () {
  var i;
  var iframes = document.getElementsByTagName("iframe");
  var numIframes = iframes.length;
  for (i = 0; i < numIframes; i += 1) {
    iframes[i].style.display = "none";
  }
});
