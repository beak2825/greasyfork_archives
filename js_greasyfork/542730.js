// ==UserScript==
// @name            Startpage.com Title with Query
// @namespace       github.com/HitsujiRere/startpagecom-title-with-query
// @version         1.0.0
// @description     Append search query to title at Startpage.com
// @description:ja  Startpage.comのタイトルに検索クエリを追加します
// @author          HitsujiRere
// @match           https://www.startpage.com/*
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/542730/Startpagecom%20Title%20with%20Query.user.js
// @updateURL https://update.greasyfork.org/scripts/542730/Startpagecom%20Title%20with%20Query.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const searchInput = document.getElementById("q");

  if (searchInput && searchInput.value) {
    document.title = searchInput.value + " - " + document.title;
  }
})();
