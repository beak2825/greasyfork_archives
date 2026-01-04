// ==UserScript==
// @name Crunchyroll + VRV - Hide Comments
// @namespace https://greasyfork.org/users/761164
// @version 2.0.0
// @description Hides the comments on Crunchyroll and VRV shows. Avoid the temptation to look and inevitably stress out!
// @author XerBlade
// @grant GM_addStyle
// @run-at document-start
// @match *://*.crunchyroll.com/*
// @match https://vrv.co/watch/*
// @downloadURL https://update.greasyfork.org/scripts/425169/Crunchyroll%20%2B%20VRV%20-%20Hide%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/425169/Crunchyroll%20%2B%20VRV%20-%20Hide%20Comments.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "crunchyroll.com" || location.hostname.endsWith(".crunchyroll.com"))) {
  css += `

  .series-reviews-section,
  .commenting-wrapper {
      display: none;
  }
  `;
}
if (location.href.startsWith("https://vrv.co/watch/")) {
  css += `
  .comments-container,
  a.tab-button[href='#comments'] {
      display: none;
  }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
