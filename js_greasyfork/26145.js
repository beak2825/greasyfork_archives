// ==UserScript==
// @name         TvShowTime.com - Torrent SearchLink
// @namespace    codedevotion
// @version      0.1
// @description  Adds icon for searching tpb for episode
// @author       Kwickell
// @match        http://www.tvshowtime.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26145/TvShowTimecom%20-%20Torrent%20SearchLink.user.js
// @updateURL https://update.greasyfork.org/scripts/26145/TvShowTimecom%20-%20Torrent%20SearchLink.meta.js
// ==/UserScript==

(function() {
  'use strict';

  $(document).ready(function(){
    // Shows
    var $shows = $('body').find('.posters-list > li');

    $shows.each(function(i,o){
      parseShow(o);
    });
  });

  function parseShow(show){
    var title = $(show).find('.episode-details > a').html();
    if(title){
      title = title.replace(/[^\w\s]/gi, '');
    }
    var episode = $(show).find('.episode-details > h2 > a').html();
    var epTitle = encodeURIComponent(title + ' ' + episode);
    // The url to point to
    var url = 'https://thepiratebay.org/search/'+epTitle + '/0/99/0';

    var button = '<a href="' + url + '" target="_blank" class="popover-link " title="" data-original-title="Search for trntz">'+
        '<i class="icon-tvst-putio_circle"></i>'+
        '</a>';

    $(show).find('.nav').prepend(button);
  }
})();