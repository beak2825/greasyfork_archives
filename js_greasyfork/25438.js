// ==UserScript==
// @name        WWT Easy Updater
// @namespace   Keka_Umans
// @description Adds update button to "Your Torrents" page
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include     *worldwidetorrents.eu/account.php?action=mytorrents
// @include     *worldwidetorrents.eu/account.php?action=mytorrents&page=*
// @version     1.4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25438/WWT%20Easy%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/25438/WWT%20Easy%20Updater.meta.js
// ==/UserScript==


$(window).load(function(){
  $('table.w3-table tr').each(function(i){
    if (i===0) {
      $(this).append('<th class="w3-centered" width="120"><a href="#" class="updateAll">Update All</th>');
    }
    else {
      $(this).append('<td align="center" class="w3-jose"><a href="#" class="quickUpdate" data-href="'+($('a[href^="torrents-details.php?id="]', this).attr('href'))+'&scrape=1">Update</a></td>');
    }
  });
// Update All Torrents
// you can all thank PX for most of this bit
  var allTorrents = $('a.quickUpdate');
  $('.updateAll').click(function(e){
    e.preventDefault();
    alert('Scraping of torrents will take a few minutes');
    for(var i=0;i<allTorrents.length;i++){
      allTorrents[i].click();
    }
  });
// Update Single Torrent
  $('.quickUpdate').click(function(e){
    e.preventDefault();
    var link = $(this).data('href').replace('&hit=1','');
    $.get(link);
  });
});