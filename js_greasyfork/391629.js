// ==UserScript==
// @name        Remove YouTube home page
// @namespace   RemoveYouTubemomepage
// @description RemoveYouTubemomepage
// @version     1.0
// @author      Yousif
// @match       https://www.youtube.com/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/391629/Remove%20YouTube%20home%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/391629/Remove%20YouTube%20home%20page.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function(){
  document.querySelectorAll(".clearfix.home")[0].remove()
});
