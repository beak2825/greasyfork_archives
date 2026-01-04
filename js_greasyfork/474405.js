// ==UserScript==
// @name		nCore torrent preview cover + 3 images from description
// @name:hu	    nCore torrent oldalon, borítókép megjelenítő és a 3 kép a leírásból
// @author		Kepek
// @description The list page shows the cover image and the 3 images in the description.
// @description:hu A lista oldalon megmutatja a borítóképet és a leírásban szereplő 3 képet.
// @namespace	https://greasyfork.org/hu/users/1159232-kepek
// @license     MIT
// @version		1
// @include		https://ncore.pro/torrents.php*
// @compatible	Greasemonkey
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/474405/nCore%20torrent%20preview%20cover%20%2B%203%20images%20from%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/474405/nCore%20torrent%20preview%20cover%20%2B%203%20images%20from%20description.meta.js
// ==/UserScript==

var delay_milliseconds = 100;
var item_per_page = $('.torrent_txt, .torrent_txt2').length;

// cover image
$('img.infobar_ico').each(function(index, value) {
  
	setTimeout( function(){
  
    var image_url = $( value ).attr("onmouseover");

    image_url = /http[^']*/i.exec(image_url)[0];

    $( value ).attr("src", image_url );
    $( value ).attr("onmouseover", null );
    $( value ).css('max-width','273px');
    $( value ).css('background','none');
    $( value ).css('width','auto');
    $( value ).css('height','auto');
    $( value ).css('margin-left','-25px');
    $( value ).css('margin-top','10px');
    $( value ).css('border','1px solid #00CC00');
    $( value ).css('min-width','25px');
    $( value ).css('min-height','25px');
  
  }, delay_milliseconds * (index + 1));
     
  
});


// 3 images from description
$('.torrent_txt > a, .torrent_txt2 > a').each(function(index, value) { 

  setTimeout( function() {
  
    $( value ).append( $('<div style="width: max-content; padding-top: 10px;">').load(value.href+' .fancy_groups', function(responseText, textStatus, req) {

       if (textStatus == "error") {
           $( this ).append( '<p style="color:red; background:white;">Nem sikerült az adatlapról az esetleg ott lévő képek betöltése!</p>' );
       }


       $( 'div > .fancy_groups', value ).each(function(index2) {

          var image_url = $( this ).attr('href');

          $( 'img', this ).attr( 'onerror', "this.src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=='");
          $( 'img', this ).attr("src", image_url );
          $( 'img', this ).css('max-width','273px');
          $( 'img', this ).css('border','1px solid #00CC00');
          $( 'img', this ).css('min-width','25px');
          $( 'img', this ).css('min-height','25px');

          if ( index2 === 0 ) {
            $( 'img', this ).css('margin-left','-25px');
            $( 'img', this ).css('margin-right','10px');
          } else if ( index2 === 1 ) {
            $( 'img', this ).css('margin-right','10px');
          }

        });


    }));
    
    
   }, ( delay_milliseconds * (index + 1) ) + ( delay_milliseconds * item_per_page ) );
  
  
});



$('.box_nagy').each(function(index, value) {
	$( this ).css('min-height','34px');
  $( this ).css('height','auto');
});

$('.box_nagy2').each(function(index, value) {
	$( this ).css('min-height','34px');
  $( this ).css('height','auto');
});

$('.torrent_txt > a').each(function(index, value) {
	$( this ).css('font-size','12px');	
  $( this ).css('margin-top','7px');
  $( this ).css('display','block');
});

$('.siterank').each(function(index, value) {
	$( this ).css('font-size','12px');
  $( this ).css('padding','10px');	
});