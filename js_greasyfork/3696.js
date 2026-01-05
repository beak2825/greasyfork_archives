// ==UserScript==
// @name BandesNoires
// @namespace InGame
// @author Odul
// @date 22/11/2013
// @version 1.01
// @license WTF Public License; http://en.wikipedia.org/wiki/WTF_Public_License
// @include http://www.dreadcast.net/Main
// @include     https://www.dreadcast.eu/Main
// @description remplace les bandes bleues par des noires
// @compat Firefox, Chrome
// @downloadURL https://update.greasyfork.org/scripts/3696/BandesNoires.user.js
// @updateURL https://update.greasyfork.org/scripts/3696/BandesNoires.meta.js
// ==/UserScript==

$('#zone_gauche').css('background-image','url("http://img4.hostingpics.net/pics/984857noir.png")').css('background-color','black').css('opacity','0.8');
$('#zone_droite').css('background-image','url("http://img4.hostingpics.net/pics/946485noir1.png")').css('background-color','black').css('opacity','0.8');
