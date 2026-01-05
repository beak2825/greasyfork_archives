// ==UserScript==
// @name        Hacker News - tweaks
// @namespace   valacar
// @description Various tweaks for Hacker News
// @include     https://news.ycombinator.com/item?id=*
// @version     0.3
// @noframes
// @license      MIT
// @compatible   firefox Firefox
// @compatible   chrome Chrome
// @downloadURL https://update.greasyfork.org/scripts/12486/Hacker%20News%20-%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/12486/Hacker%20News%20-%20tweaks.meta.js
// ==/UserScript==

// Create a userstyle with the following css selector:
// .firstParentComment > td
// example:
// .firstParentComment > td {
//    border-left: 1px solid rgba(119, 136, 136, 0.3);
//    background: linear-gradient(135deg, rgba(119, 136, 136, 0.3) 0%, rgba(119, 136, 136,0.0) 7%);
//  }

(function(){
  "use strict";

  // find zero width spacer images (0 width = no comment indent)
  const zeroSpacers =
      document.querySelectorAll('.comment-tree img[width="0"][src="s.gif"]');

  // add class to comment's table row (tr)
  for (let zeroSpacer of zeroSpacers) {
    const firstParentCommentRow = zeroSpacer.closest('.comtr');
    if (firstParentCommentRow) {
      firstParentCommentRow.classList.add("firstParentComment");
    }
  }

})();