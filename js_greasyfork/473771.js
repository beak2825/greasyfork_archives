// ==UserScript==
// @name         ShrinkImageInQuote
// @namespace    torn
// @version      1.0
// @description  Make images in quotes smaller for forum.
// @author       bot_7420 [2937420]
// @license      GNU GPLv3
// @run-at       document-body
// @match        https://www.torn.com/forums.php
// @downloadURL https://update.greasyfork.org/scripts/473771/ShrinkImageInQuote.user.js
// @updateURL https://update.greasyfork.org/scripts/473771/ShrinkImageInQuote.meta.js
// ==/UserScript==

(function () {
    "use strict";
  
    checkForum();
  
    function checkForum() {
      if (location.hash.startsWith("#/p=threads") && $("ul.thread-list").length > 0) {
        const $imgs = $("ul.thread-list div.quote-post-content img").not(".script-shrunk");
        $imgs.addClass("script-shrunk");
        $imgs.attr("style", "width: 100px;");
      }
      setTimeout(checkForum, 200);
    }
  })();
  