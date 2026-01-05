// ==UserScript==
// @name         highlight-external-links
// @namespace    https://github.com/ahuanguchi
// @version      1.0.2
// @description  Highlight all external links in lime green.
// @author       ahuanguchi
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/10962/highlight-external-links.user.js
// @updateURL https://update.greasyfork.org/scripts/10962/highlight-external-links.meta.js
// ==/UserScript==

window.addEventListener("load", function () {
  function splitHref(givenHref) {
    return givenHref.replace(/^https?:\/\//, "").split("/");
  }
  var i, currentA, currentHref, anchorParts, locationParts;
  var anchors = document.getElementsByTagName("a");
  var numAnchors = anchors.length;
  for (i = 0; i < numAnchors; i += 1) {
    currentA = anchors[i];
    currentHref = currentA.href;
    anchorParts = splitHref(currentHref);
    locationParts = splitHref(window.location.href);
    if (currentHref.slice(0, 4) === "http" && anchorParts[0] !== locationParts[0]) {
      currentA.style.backgroundColor = "#bfff00";
    }
  }
});