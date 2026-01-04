// ==UserScript==
// @name     Tradera overview
// @description Makes it easier to quickly see what happened to your auctions on the Overview and Notification pages at Tradera.
// @require  https://code.jquery.com/jquery-3.6.1.slim.min.js
// @include  https://www.tradera.com/my/overview
// @include  https://www.tradera.com/my/notifications
// @version  1
// @grant    none
// @namespace snooz
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453111/Tradera%20overview.user.js
// @updateURL https://update.greasyfork.org/scripts/453111/Tradera%20overview.meta.js
// ==/UserScript==
$(document).ready(function() {
  let $sold = $("a:contains('har sålts för')");
  $sold.closest('li').css('background-color','#ccffcc').css('border', '3px solid green');
  let $notsold = $("a:contains('utan vinnande')");
  $notsold.closest('li').css('background-color','#ffebe6').css('border', '3px solid #ffebe6');
  let $newbid = $("a:contains('Du har fått ett nytt bud')");
  $newbid.closest('li').css('background-color','#e6f3ff').css('border', '3px solid #e6f3ff');
});