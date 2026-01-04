// ==UserScript==
// @name		BitPorn torrent preview cover
// @name:hu BitPorn torrenten a borítóképek megjelenítése
// @author		Kepek
// @description 	The list page shows the cover images
// @description:hu A lista oldalon megmutatja a borítóképet
// @namespace		https://greasyfork.org/hu/users/1159232-kepek
// @license MIT
// @version		0.2
// @include		https://bitporn.eu/torrents.php*
// @compatible		Greasemonkey
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/476806/BitPorn%20torrent%20preview%20cover.user.js
// @updateURL https://update.greasyfork.org/scripts/476806/BitPorn%20torrent%20preview%20cover.meta.js
// ==/UserScript==

// Before use, set the categories on the settings page!
// Mielőtt használod, a beállításoknál állítsd be, hogy milyen kategóriák érdekelnek.


$('td.embedded').each(function(index, value) {

  $( 'img.imagePreview', value ).attr("src", $( 'img', value ).attr('data-src') );
  $( value ).css('max-width','300px');   
  $( value ).css('max-height','none');
  $( value ).css('width','auto');   
  $( value ).css('height','auto');
  
  $( 'img.imagePreview', value ).css('max-width','300px');   
  $( 'img.imagePreview', value ).css('max-height','none');
  $( 'img.imagePreview', value ).css('width','auto');   
  $( 'img.imagePreview', value ).css('height','auto');
     
});