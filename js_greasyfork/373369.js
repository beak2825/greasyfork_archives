// ==UserScript==
// @name        spygasm.com
// @namespace   *spygasm.com*
// @include     httpS://*ru.spygasm.com*
// @author       WayOnG
// @version     1.0
// @description  Убирием попапы и ограничение по времени просмотра.
// @grant       none

// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/373369/spygasmcom.user.js
// @updateURL https://update.greasyfork.org/scripts/373369/spygasmcom.meta.js
// ==/UserScript==



// fancybox-overlay-fixed


var timerId = setTimeout(function tick() {
$('.fancybox-desktop').remove();
  $('.fancybox-overlay-fixed').remove();
  timerId = setTimeout(tick, 200);
  $.cookie('timer_guest_limit_expired',$.cookie("timer_reset_guest_limit_expired"));
}, 200);



