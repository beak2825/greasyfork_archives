// ==UserScript==
// @name         WatchSeries Fav Hosts
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://watchseries.ag/episode/*.html
// @match        http://watchseries.vc/episode/*.html
// @match        http://watchseries.se/episode/*.html
// @match        http://watchseriesfree.to/episode/*.html
// @match        https://watchseriesfree.to/episode/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19204/WatchSeries%20Fav%20Hosts.user.js
// @updateURL https://update.greasyfork.org/scripts/19204/WatchSeries%20Fav%20Hosts.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var favHosts = ['vodlocker.com', 'flashx'];  // <--- SET FAV HOSTS HERE
    
   $('.linktable .myTable td:first-child > span').each(function(){
       var span = $(this);
       if(favHosts.indexOf(span.text()) < 0){
           var tr = span.closest('tr');
           tr.css('display', 'none');
       }
   });
})();