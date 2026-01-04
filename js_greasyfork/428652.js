// ==UserScript==
// @name         Image Replacer
// @author         Sargonnas
// @namespace      Sargonnas
// @description    Замена карты на карту без пунктира
// @version      1.0
// @description  Image Replacer
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @include     /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15)\/.+/
// @exclude     /^https{0,1}:\/\/(www\.heroeswm\.ru|178\.248\.235\.15)\/(login|war|cgame|frames|chat|chatonline|ch_box|chat_line|ticker|chatpost|chat2020|battlechat|campaign)\.php.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428652/Image%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/428652/Image%20Replacer.meta.js
// ==/UserScript==

$("#map_img").attr('src','https://herodikus.ru/frame/map_move.jpg');