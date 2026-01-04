// ==UserScript==
// @name         [PTP] Freeleech Clear View
// @namespace    https://tls.passthepopcorn.me
// @version      1
// @description  Makes it easier to visual identify freeleech torrents when browsing freelech = yes on PTP
// @author       jax913
// @match        https://tls.passthepopcorn.me/torrents.php?*
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/376668/%5BPTP%5D%20Freeleech%20Clear%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/376668/%5BPTP%5D%20Freeleech%20Clear%20View.meta.js
// ==/UserScript==

jQuery(document).ready(function(){
    if (jQuery.inArray('freetorrent=1',window.location.search.substring(1).split('&')) == true) {
        $('.basic-movie-list__torrent-row');var arr = jQuery('.basic-movie-list__torrent-row');
        jQuery.each( arr, function( i, val ) {
          var foundFree = jQuery(this).find('.torrent-info__download-modifier--free').length == 1;
    
          var foundSeeders = jQuery(this).find('.no-seeders').length != 1;
    
          if ( ! foundFree || ! foundSeeders) {
            jQuery(this).css('opacity', '0.5');
          }
        });
    }
});