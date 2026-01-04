// ==UserScript==
// @name         Show All Twitter Replies
// @namespace    https://tech.jacenboy.com/replies/
// @version      1.0
// @description  Fix Twitter only showing a partial list of replies
// @author       JacenBoy
// @match        http*://*twitter.com/*/status/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397603/Show%20All%20Twitter%20Replies.user.js
// @updateURL https://update.greasyfork.org/scripts/397603/Show%20All%20Twitter%20Replies.meta.js
// ==/UserScript==

(function() {
  'use strict';

  if (window.location.href.indexOf("?") != -1) {
    window.location.replace(window.location.href.split("?")[0]);
  }
})();