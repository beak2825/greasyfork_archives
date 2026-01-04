// ==UserScript==
// @name         spygasm tools
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  bypass spygasm fullscreen restriction
// @author       Anon from 2ch
// @include     httpS://*ru.spygasm.com*
// @grant        none
 
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @require    https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/382437/spygasm%20tools.user.js
// @updateURL https://update.greasyfork.org/scripts/382437/spygasm%20tools.meta.js
// ==/UserScript==
 
var bypass_fullscreen = setInterval(function() {
    var fl_button = document.getElementsByClassName('video_button button_fullscreen').item(0);
    if (fl_button != null) {
        fl_button._listeners.click = function f(e) {
            document.getElementsByTagName('video').item(0).requestFullscreen();
        };
        clearInterval(bypass_fullscreen);
    }
});
 
var remove_watermarks = setInterval(function() {
['rec_overlay','time_display_overlay','watermark']
.forEach(function f(name) { document.getElementsByClassName(name).item(0).setAttribute('style','display:none');
});
});
 
var timerId = setTimeout(function tick() {
$('.fancybox-desktop').remove();
  $('.fancybox-overlay-fixed').remove();
  timerId = setTimeout(tick, 200);
  $.cookie('timer_guest_limit_expired',$.cookie("timer_reset_guest_limit_expired"));
}, 200);