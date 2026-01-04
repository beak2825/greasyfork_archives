// ==UserScript==
// @name Youtube hide FOR YOU suggestion when search
// @namespace hoothin
// @version 0.3
// @description Hide the suggestion of results when search on youtube.
// @author hoothin
// @homepageURL https://github.com/hoothin/
// @supportURL https://github.com/hoothin/
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/441189/Youtube%20hide%20FOR%20YOU%20suggestion%20when%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/441189/Youtube%20hide%20FOR%20YOU%20suggestion%20when%20search.meta.js
// ==/UserScript==

(function() {
let css = `
 #contents>ytd-shelf-renderer.style-scope.ytd-item-section-renderer[thumbnail-style]:not(*[prominent-thumb-style],*:first-child),#contents>ytd-horizontal-card-list-renderer{
  display:none;
 }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
