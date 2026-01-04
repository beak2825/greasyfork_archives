// ==UserScript==
// @name           Kbin Better Page Navigation Bar
// @namespace      http://thedarnedestthing.com
// @description    Highlight "current" page in navigation bar at bottom of posts (and mute other page numbers).
// @author         sdothum
// @version        0.2.2
// @grant          GM_addStyle
// @match          https://kbin.social/*
// @match          https://fedia.io/*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/469801/Kbin%20Better%20Page%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/469801/Kbin%20Better%20Page%20Navigation%20Bar.meta.js
// ==/UserScript==

(function() {

var css = `
.pagination .pagination__item--current-page {
  color: var(--kbin-section-link-hover-color);
  font-weight: 900;
}
.pagination__item:not(.pagination__item--current-page) {
  color: var(--kbin-text-muted-color);
  opacity: 0.70;
  font-weight: 300;
}
`;

if (typeof GM_addStyle != "undefined") {
  GM_addStyle(css);
} else if (typeof addStyle != "undefined") {
  addStyle(css);
} else {
  var node = document.createElement("style");
  node.type = "text/css";
  node.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(node);
}

})();

