// ==UserScript==
// @name        TVShow Time - Extratorrent search button
// @description Provide a "Search in Extratorrent" button in the "To watch" page
// @namespace   https://greasyfork.org/scripts/11571-tvshow-time-t411-search-button
// @include     http*://www.tvshowtime.com/*
// @version     1.1
// @grant       none
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/29009/TVShow%20Time%20-%20Extratorrent%20search%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/29009/TVShow%20Time%20-%20Extratorrent%20search%20button.meta.js
// ==/UserScript==

var search_base_link = 'http://extratorrent.cc/search/?search=';


var search_prefix = '';
var search_suffix = '';

this.jQuery = jQuery.noConflict(true);

jQuery(document).ready(function() {
  jQuery("<style type='text/css'> .download-link{display:inline;width:8px;height:8px;margin:0 auto;margin-right:25px;background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAQAAAC1QeVaAAAAyElEQVQY02NggAA2+fi0/xCoEsmADuR8yJRklAuESSrHMjBCRVm47OcC4TyvfTBJn8N280Fi7EIMTJwaM2HCyFB7PosA0EBmGeWJ6FLqM1iUoIYzicm2JH6HSSR+V+xmkkJ2j6BkSfgzkFT4C5lqRlGYOCsDC5gWkswPvBf6RKYMKsUClNGr1shjEIRIS0TIJjJApATUMvWqGYB2fDWewiCK4msRg974j2n/GRQKgdJfPA977USCh0BSKpUMjDzSadj8KZ/PJAAAUPCAT2cQ2usAAAAASUVORK5CYII=') no-repeat 0 0} </style>").appendTo("head");

  jQuery('li[id*="episode-item-"]').each(function () {
    try {
      var newNode = jQuery(this).find("a.watched-btn:first").clone();
      var serie = jQuery(this).find("div.episode-details a.secondary-link").text();
      var episode = jQuery(this).find("div.episode-details h2 a").text();
      newNode.attr('href', search_base_link + search_prefix + serie + ' ' + episode + search_suffix);
      newNode.attr('target', '_blank');
      newNode.attr('data-original-title', 'Search on Extratorrent');
      newNode.removeClass().addClass('download-link');
      newNode.find('i').removeClass();
      jQuery(this).find("a.watched-btn:first").before(newNode);
    } catch(e) {
      console.error(e);
    }
  });
});