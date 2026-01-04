// ==UserScript==
// @name        Remove automatic translations of Reddit posts
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @grant       none
// @version     1.0
// @author      Alexander Johansen (alejoh.eu)
// @license     WTFPL
// @description This userscript removes the "tl" query parameter from Reddit URLs, effectively preventing the auto-translation junk you see whenever you go on Reddit. 06/07/2025, 18:30:29
// @downloadURL https://update.greasyfork.org/scripts/541845/Remove%20automatic%20translations%20of%20Reddit%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/541845/Remove%20automatic%20translations%20of%20Reddit%20posts.meta.js
// ==/UserScript==

var currentUrl = new URL(window.location.href);

if (currentUrl.searchParams.has("tl")) {
  currentUrl.searchParams.delete("tl");
  window.location.href = currentUrl.href;
}