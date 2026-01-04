// ==UserScript==
// @name        ZhuiXinFan Magnet Link
// @namespace   localhost
// @include     http://www.zhuixinfan.com/main.php?mod=viewresource*
// @version     1
// @require     http://code.jquery.com/jquery-3.2.1.min.js
// @grant       none
// @description:en Convert ZhuiXinFan magnet link to clickable
// @description Convert ZhuiXinFan magnet link to clickable
// @downloadURL https://update.greasyfork.org/scripts/32831/ZhuiXinFan%20Magnet%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/32831/ZhuiXinFan%20Magnet%20Link.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
html = $("#torrent_url").html();
$("#torrent_url").replaceWith("<a href='"+html+"' class='a1'>"+html+"</a>");