// ==UserScript==
// @name         Wikimapia add "view on map" button
// @namespace    http://tampermonkey.net/
// @version      0.5.3
// @description  try to take over the world!
// @author       You
// @match       *://wikimapia.org/*
// @match       *://*.wikimapia.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415694/Wikimapia%20add%20%22view%20on%20map%22%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/415694/Wikimapia%20add%20%22view%20on%20map%22%20button.meta.js
// ==/UserScript==

(function() {
  'use strict';
  if (window == window.top) {
    var link = $('form#search-form').attr('action');
    link = link.replace('&m=b', '');
    link = 'http://wikimapia.org' + link;

    $('#placeinfo').prepend('<a class="btn btn-primary-blue" href="' + link + '&lang=ru&m=w&show=' + window.location.pathname + '">Посмотреть на карте</a>');
  }
})();