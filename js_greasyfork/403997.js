// ==UserScript==
// @name        facebook.com - Clean up Facebook UI
// @namespace   Yury Ershov
// @match       *://*.facebook.com/*
// @noframes
// @run-at      document-idle
// @grant       none
// @version     1.0
// @author      Yury Ershov
// @description Clean up Facebook UI
// @downloadURL https://update.greasyfork.org/scripts/403997/facebookcom%20-%20Clean%20up%20Facebook%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/403997/facebookcom%20-%20Clean%20up%20Facebook%20UI.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let e=0;
  for (i of ["rightCol", "pagelet_sidebar", "pagelet_dock", "video_chats"]) {
    try{
      document.getElementById(i).childNodes[0].remove();
    } catch(e) {}
  }
  for (i of document.getElementsByClassName("mts")) {
    i.remove();
  }
  for (i of document.getElementsByTagName("a")) {
    if (i.href.indexOf("/onthisday/") != -1) {
      p=i;
      for (j=0; j<8; j++,p=p.parentNode) {
        if (p.getAttribute("data-ft")) {
          p.remove();
          break;
  } } } }
  for (n of ["ego_feed_column", "uiLikePageButton", ]) {
    for (i of document.getElementsByClassName(n)) {
      i.parentNode.parentNode.parentNode.parentNode.remove();
  } }
  document.querySelectorAll("[aria-label='Message from Facebook']").forEach(e=>e.remove());
})();