// ==UserScript==
// @name         Buckaroocide
// @namespace    DrAg0r.forums.startrek-fr.net
// @version      1.0.0
// @description  Masque tous les post de Buckaroo, masque tous les liens vers les posts de Buckaroo dans les hotspots.
// @author       DrAg0r
// @include      http://forums.startrek-fr.net/*
// @exclude      http://forums.startrek-fr.net/forums.php
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26433/Buckaroocide.user.js
// @updateURL https://update.greasyfork.org/scripts/26433/Buckaroocide.meta.js
// ==/UserScript==
  exec();
  function exec() {
    filterAll();
  }
  
  function filter(index, elem) {
    if (!$(elem).attr) {
      return;
    }
    var title = $(elem).find('span').text();
    if (title.toLowerCase().indexOf('buckaroo') >= 0) {
      $(elem).hide();
    }     
  }

  function filterTab(index, elem) {
    if (!$(elem).attr) {
      return;
    }
    var title = $(elem).find('span').text();
    
    if (title.toLowerCase().indexOf('buckaroo') > 4) {
      $(elem).hide();
    }     
    
  }

  function filterAll() {
    $('.blockpost').map(filter);
    if ((document.location.href == 'http://forums.startrek-fr.net/') || (document.location.href == 'http://forums.startrek-fr.net/index.php')) {
      $('tr').map(filterTab);
    }
  }

