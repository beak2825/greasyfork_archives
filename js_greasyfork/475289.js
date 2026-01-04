// ==UserScript==
// @name botHelpStatistics
// @description  add user to database and show rating on tik-tok, twitter
// @author ka-pex
// @license MIT
// @version 0.13
// @require  https://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @include https://www.tiktok.com/foryou
// @namespace ka-pex
// @downloadURL https://update.greasyfork.org/scripts/475289/botHelpStatistics.user.js
// @updateURL https://update.greasyfork.org/scripts/475289/botHelpStatistics.meta.js
// ==/UserScript==

var func = function () {
  //hide
  $('.tiktok-t4zcgw-DivHeaderLeftContainer').hide();
};

//блокує історію зверху
$('.tiktok-t4zcgw-DivHeaderLeftContainer').hide();

$(document).ready(function () {
  func();
  setInterval(func, 1000);
});
