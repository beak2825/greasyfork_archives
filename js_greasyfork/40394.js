// ==UserScript==
// @name         Remove Youtube Ads
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @version      0.7
// @description  Removes all ads including video ads
// @author       f1238762001
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/17404
// @downloadURL https://update.greasyfork.org/scripts/40394/Remove%20Youtube%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/40394/Remove%20Youtube%20Ads.meta.js
// ==/UserScript==

(function () {
  $("#header").remove();
})();
(function () {
  $("#watch7-sidebar-ads").remove();
  $(".video-ads").remove();
  $("#pyv-watch-related-dest-url").remove();
  if ($(".ad-showing")[0]) {
    $(".video-stream").attr("src", "");
  }
  setTimeout(arguments.callee, 1000);
})(1000);
