// ==UserScript==
// @name         ddgwidth
// @version      0.3
// @description  resizes duckduckgo for smaller window widths.
// @match        http://duckduckgo.com/*
// @match        https://duckduckgo.com/*
// @match        http://*.duckduckgo.com/*
// @match        https://*.duckduckgo.com/*
// @namespace    https://greasyfork.org/users/217495-eric-toombs
// @run-at       document-idle
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/418601/ddgwidth.user.js
// @updateURL https://update.greasyfork.org/scripts/418601/ddgwidth.meta.js
// ==/UserScript==

for (t of ["html", "body"]) {
  $(t).map(function(i, node) {
    node.style.minWidth = "0";
  });
}