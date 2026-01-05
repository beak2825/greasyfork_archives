// ==UserScript==
// @name         Multireddit to link
// @namespace    https://nucular.github.io
// @version      0.2
// @description  Convert a new-style multireddit to an old-style link
// @author       nucular
// @match        https://www.reddit.com/*/m/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/21759/Multireddit%20to%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/21759/Multireddit%20to%20link.meta.js
// ==/UserScript==

(function() {
  'use strict';

  $("<a></a>")
  .attr("href",
    "https://www.reddit.com/r/" +
      $(".titlebox.multi-details .subreddits li").map(function(i, li) {
        return $(li).find("a").attr("href").match(/\/r\/(.+)/)[1];
      }).toArray().join("+")
  )
  .attr("target", "__new")
  .css("margin-right", "12px")
  .append(
    $("<button>multilink</button>")
  )
  .prependTo(
    $(".titlebox.multi-details .gray-buttons.settings .spacer")
   );
})();
