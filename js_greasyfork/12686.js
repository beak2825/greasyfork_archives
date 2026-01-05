// ==UserScript==
// @name GEFS-Online A321 (By Alta Aviation)
// @description This plugin adds the Airbus A321 to the game
// @namespace GEFS-Plugins
// @match http://www.gefs-online.com/gefs.php*
// @match http://gefs-online.com/gefs.php*
// @run-at document-end
// @version 1.0.0
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/12686/GEFS-Online%20A321%20%28By%20Alta%20Aviation%29.user.js
// @updateURL https://update.greasyfork.org/scripts/12686/GEFS-Online%20A321%20%28By%20Alta%20Aviation%29.meta.js
// ==/UserScript==
 
var menuitem =  $('<li><a href="#" onmouseup="ges.aircraft.change(\'214\')">A321 (By Alta Aviation - AAD)</a></li>').appendTo($('.dropdown-menu').eq(2).children('.dropdown-submenu').last().children('ul'));
