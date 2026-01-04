// ==UserScript==
// @name        ShakespearesWords remove free limitation
// @namespace   Violentmonkey Scripts
// @match       *://*.shakespeareswords.com/*
// @grant       none
// @version     1.1
// @author      CyrilSLi
// @description Remove the "20 free page views" limitation of the site
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/525274/ShakespearesWords%20remove%20free%20limitation.user.js
// @updateURL https://update.greasyfork.org/scripts/525274/ShakespearesWords%20remove%20free%20limitation.meta.js
// ==/UserScript==

document.cookie = "shakespeareswords.com=shwId==; path=/; expires=Thu, 01-Jan-1970 00:00:01 GMT;";
rInfo = document.getElementsByClassName("remainingInfo");
if (rInfo.length === 1) {
  rInfo[0].remove();
}