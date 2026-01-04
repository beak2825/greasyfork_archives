// ==UserScript==
// @name    PussyTorrents display images on list page 
// @name:hu     PussyTorrents torrenten, képek megjelenítése listaoldalon
// @author    Kepek
// @description The list page shows the images from the torrent data sheet.
// @description:hu A lista oldalon megmutatja a képeket, az adatlapról kiolvasva
// @namespace  https://openuserjs.org/users/Kepek
// @license     MIT
// @version    1
// @include    https://pussytorrents.org/torrents/browse*
// @compatible  Greasemonkey
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/477391/PussyTorrents%20display%20images%20on%20list%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/477391/PussyTorrents%20display%20images%20on%20list%20page.meta.js
// ==/UserScript==

//if the images do not appear, press F5


var site = "https://pussytorrents.org";

var delay_milliseconds = 100;

// press F5
if ( window.location.href.indexOf('#') > -1 ) {
	var new_url = window.location.href.replace(/\#/g, '?');
  window.location.href = new_url;
}

// images from description
$('tr.even, tr.odd').each(function (index, value) {

  setTimeout(function () {

    var item = $('<tr style="width: max-content; padding-top: 10px;">');
    
    $(value).after( item.load( '/torrent/' + value.id + ' #torrentImages', function (responseText, textStatus, req) {

      $('#torrentImages', $(this)).replaceWith('<td colspan="8">' + $('#torrentImages', $(this)).html() +'</td>');

      $('a', $(this)).each(function (index2) {
        
        if ( index2 < 3 ) {
        	var image_url = $(this).attr('href');

        	$('img', this).attr("src", image_url);  
        }
        
      });

    }));

  }, (delay_milliseconds * (index + 1)));

});