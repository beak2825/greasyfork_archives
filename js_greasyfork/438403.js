// ==UserScript==
// @name Youtube hide related suggestion which occlude the video
// @namespace hoothin
// @version 0.1
// @description Hide the picture of related suggestion which occlude the video at the end on youtube.
// @author hoothin
// @homepageURL https://github.com/hoothin/
// @supportURL https://github.com/hoothin/
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/438403/Youtube%20hide%20related%20suggestion%20which%20occlude%20the%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/438403/Youtube%20hide%20related%20suggestion%20which%20occlude%20the%20video.meta.js
// ==/UserScript==

(function() {
let css = `
 .ytp-ce-element{
  opacity: 0.1!important;
 }
 .ytp-ce-element:hover{
  opacity: 1!important;
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
