// ==UserScript==
// @name        Welt Minus - welt.de
// @namespace   meyerk.com
// @match       https://www.welt.de/
// @grant       none
// @version     1.1
// @author      MeyerK
// @description Alle Welt+ Artikel auf der Startseite ausblenden
// @downloadURL https://update.greasyfork.org/scripts/402998/Welt%20Minus%20-%20weltde.user.js
// @updateURL https://update.greasyfork.org/scripts/402998/Welt%20Minus%20-%20weltde.meta.js
// ==/UserScript==

var articles = document.querySelectorAll('ul.c-grid li');
for (var i=0; i < articles.length; i++)
{
  var premium = articles[i].querySelector('span.c-premium-icon');
  if (premium !== null)
  {
    articles[i].style.display = 'none';
  }
}