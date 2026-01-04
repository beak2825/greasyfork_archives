// ==UserScript==
// @name        Watch History - dropout.tv
// @namespace   Dropout
// @match       https://www.dropout.tv/*
// @grant       none
// @version     1.0
// @author      kalucky0
// @license     MIT
// @description Adds a badge to indicate that an episode has already been watched
// @downloadURL https://update.greasyfork.org/scripts/437007/Watch%20History%20-%20dropouttv.user.js
// @updateURL https://update.greasyfork.org/scripts/437007/Watch%20History%20-%20dropouttv.meta.js
// ==/UserScript==

(function() {
  if(localStorage.getItem("watchHistory") === null)
    localStorage.setItem("watchHistory", "[]");
  
  var watchHistory = JSON.parse(localStorage.getItem("watchHistory"));
  
  if(location.href.includes("videos")) {
    if(!watchHistory.includes(location.href)) {
      console.log("Started countdown");
      setTimeout(function() {
        console.log("Added to watch history!");
        watchHistory.push(location.href);
        localStorage.setItem("watchHistory", JSON.stringify(watchHistory));
      }, 30000);
    } else {
      console.log("Already in history");
    }
  }

  $(".episode-container").ready(function () {
    $(".browse-image-container").each(function(i, e) {
      if(watchHistory.includes($(e).parent().attr("href"))) {
        $('<button>', {
            class: 'icon medium icon-only icon-watchlist-add has-background',
            style: `left: 9px;background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24'%3E%3Cpath d='M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4c5 0 9 3 11 7a12 12 0 0 1-22 0c2-4 6-7 11-7m-9 7a10 10 0 0 0 18 0 10 10 0 0 0-18 0Z' fill='%23fff'/%3E%3C/svg%3E");`,
        }).appendTo(e);
      }
    })
  });
})();