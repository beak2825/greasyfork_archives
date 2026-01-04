// ==UserScript==
// @name        Zeit.de Komplettansicht
// @namespace   graphen
// @version     9.0.0
// @description Falls ein Artikel ueber mehrere Seiten geht, wird auf die Komplettansicht weitergeleitet. Falls der Artikel hinter einer paywall ist, wird diese entfernt.
// @author      Graphen, spulg
// @include     /^https?:\/\/www\.zeit\.de\/.*$/
// @icon        https://img.zeit.de/static/img/zo-icon-win8-144x144.png
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/439250/Zeitde%20Komplettansicht.user.js
// @updateURL https://update.greasyfork.org/scripts/439250/Zeitde%20Komplettansicht.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function () {
  'use strict';

  // Suche nach Klassen die auf vorhandene Komplettansicht hindeuten oder paywall
  var link = '';
  var currUrl = document.URL.replace(/\?.*/, "");
  // Referrer gesetzt? (Nicht weiterleiten bei "Zurück" in History)
  var refUrl = sessionStorage.getItem("gmCookieRef");

  if (document.getElementsByClassName("gate__title gate__title--paid").length > 0) {
      link = 'http://12ft.io/'+window.location.href+'/komplettansicht';
  }
    else if (document.querySelector(".article-pager")) {
      link = document.URL.concat("/komplettansicht");
  }

  if (link !== '' && currUrl !== refUrl) {
      // Referrer setzen bei neuer weiterzuleitenden Seite
      sessionStorage.setItem ("gmCookieRef", currUrl);
      window.open(link, "_self");
  }
}());
