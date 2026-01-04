// ==UserScript==
// @name         IMDB ※ Clean Links (Enables History/Visited State)
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  Clean IMDB links so that any visited page is registered in your browser's history.
// @author       Oscar Kameoka — kitsuneDEV — www.kitsune.work
// @include      https://*.imdb.com/*
// @include      http://*.imdb.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/380749/IMDB%20%E2%80%BB%20Clean%20Links%20%28Enables%20HistoryVisited%20State%29.user.js
// @updateURL https://update.greasyfork.org/scripts/380749/IMDB%20%E2%80%BB%20Clean%20Links%20%28Enables%20HistoryVisited%20State%29.meta.js
// ==/UserScript==

(function() {
  'use strict';
  //
  // CLEAN EACH LINK
  //
  $(document).ready(function() {
    $('a').each(function() {
      if ($(this).attr('href')) {
        // IGNORE IF LINK IS TO EXTERNAL SITE
        var linkHREF  = $(this).attr('href');
        var linkURL   = linkHREF.split('?');
        var linkClean = linkURL[0];

        // IF LINK IS TO EXTERNAL SKIP IT
        if (linkURL.indexOf('imdb.com') !== -1) {
          $(this).attr('href', linkClean);
        } else {
          // APPEND IMDB DOMAIN TO LINK
          // IF) HREF BEGINS WITH A SLASH
          if (linkClean[0] === '/') {
            $(this).attr('href', 'https://www.imdb.com' + linkClean);
          } else {
            $(this).attr('href', 'https://www.imdb.com/' + linkClean);
          }
        }
        // FOR EXTERNAL WEBSITES (IF: full link AND not IMDB's)
        if (linkURL.indexOf('http')) {
          $(this).attr('href', linkClean);
        }
      }
    });
  });
})();