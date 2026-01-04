// ==UserScript==
// @name         Amandas Insta Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @license      GNU AGPLv3
// @description  TBD
// @author       zitscher
// @match        *://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394905/Amandas%20Insta%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/394905/Amandas%20Insta%20Shortcuts.meta.js
// ==/UserScript==

(function(tags) {
  var SELECTOR = {
      POST: "article a",
      LIKE: "article section button",
      SEARCH: "nav input",
      COMMENT: "article textarea"
  };
  tags = ["INPUT", "SELECT", "TEXTAREA"];
  addEventListener("keyup", function(ev, ele) {
    if (ev.shiftKey || ev.ctrlKey || ev.altKey || tags.includes(ev.target.tagName)) return;

    switch (ev.key.toUpperCase()) {
      case "P": // pick first post on the page
        if (ele = document.querySelectorAll(SELECTOR.POST)[9]) ele.click();
        break;
      case "Q": // like/unlike post
        if (ele = document.querySelector(SELECTOR.LIKE)) ele.click();
        break;
      case "S": // Focus on search
        if (ele = document.querySelector(SELECTOR.SEARCH)) ele.focus();
        break;
      case "C": // Focus on comment box
        if (ele = document.querySelector(SELECTOR.COMMENT)) ele.focus();
        break;
    }
  });
})();