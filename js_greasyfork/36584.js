// ==UserScript==
// @name deaktiviere Overscrolling auf sueddeutsche.de
// @description entfernt die Weiterleitung auf die Hauptseite beim Scrollen zum Artikelende
// @namespace  https://greasyfork.org/en/forum/profile/5767/LittlePluto
// @match http://www.sueddeutsche.de/*/*.*
// @match https://www.sueddeutsche.de/*/*.*
// @grant none
// @noframes
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/36584/deaktiviere%20Overscrolling%20auf%20sueddeutschede.user.js
// @updateURL https://update.greasyfork.org/scripts/36584/deaktiviere%20Overscrolling%20auf%20sueddeutschede.meta.js
// ==/UserScript==

var el = document.getElementById("article-overscrolling");
el.parentElement.removeChild(el);