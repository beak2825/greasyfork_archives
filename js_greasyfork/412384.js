// ==UserScript==
// @name HN AntiCommentary
// @namespace http://tampermonkey.net
// @version 0.4
// @description Removes the comments button on HN.
// @license MIT
// @author profan
// @match https://news.ycombinator.com/news*
// @match https://news.ycombinator.com
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/412384/HN%20AntiCommentary.user.js
// @updateURL https://update.greasyfork.org/scripts/412384/HN%20AntiCommentary.meta.js
// ==/UserScript==

(function() {
  'use strict'

  let subtexts = document.querySelectorAll("td.subtext");
  for (let i = 0; i < subtexts.length; ++i) {
    let matches = [...subtexts[i].querySelectorAll("a")]
      .filter(e => e.innerText.includes("comment") || e.innerText.includes("discuss"));
    if (matches.length == 1) {
      let link = matches[0];
      link.style.display = "none";
      // this is for that terrible vertical bar that otherwise remains as a terrible reminder
      link.previousSibling.nodeValue = null;
    }
  }

})();