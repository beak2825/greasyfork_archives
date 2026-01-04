// ==UserScript==
// @name        1337x torrent : read images from description and show in listview
// @name:hu     1337x torrent lista oldalon a képek megjelenítése
// @namespace   1337x
// @description It can read images from description and show in listview on the 1337x torrent site.
// @description:hu Ez a szkript a 1337x torrent oldalon, a lista nézeten megjeleníti a képeket, amiket az egyes torrentek leírásából olvas ki.
// @include     http*://*1337x*
// @version     2
// @grant       none
// @license MIT
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/473887/1337x%20torrent%20%3A%20read%20images%20from%20description%20and%20show%20in%20listview.user.js
// @updateURL https://update.greasyfork.org/scripts/473887/1337x%20torrent%20%3A%20read%20images%20from%20description%20and%20show%20in%20listview.meta.js
// ==/UserScript==

$('td.coll-1 > a:nth-child(2)').each(function(index, value) { 
  
  $( this ).append( $('<div>').load(value.href+' #description img', function(){
    
    $( 'div > img', value ).each(function() {
      
      $( this ).attr("src", $( this ).attr('data-original') );
      $( this ).css('max-height','300px');
      
    });

  }));
  
});