// ==UserScript==
// @name        Zeit Minus - zeit.de
// @namespace   meyerk.com
// @match       https://www.zeit.de/index
// @grant       none
// @version     1.0
// @author      MeyerK
// @description Alle Zeit Plus Artikel von der Zeit Startseite entfernen
// @downloadURL https://update.greasyfork.org/scripts/403000/Zeit%20Minus%20-%20zeitde.user.js
// @updateURL https://update.greasyfork.org/scripts/403000/Zeit%20Minus%20-%20zeitde.meta.js
// ==/UserScript==

var articles = document.querySelectorAll('main article');
for (var i=0; i < articles.length; i++)
{
  var premium = articles[i].querySelector('svg.zplus-logo');
  if (premium !== null)
  {
    articles[i].style.display = 'none';
  }
}