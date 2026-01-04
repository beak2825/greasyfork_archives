// ==UserScript==
// @name        theCrag - swipearea
// @namespace   theCrag.com
// @author      NickyHochmuth
// @description adds swipe left and right on area pages to navigate to the next/prev node
// @icon        https://www.google.com/s2/favicons?domain=thecrag.com
// @include     https://www.thecrag.com/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/Tocca.js/2.0.9/Tocca.min.js
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @version     1
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/454404/theCrag%20-%20swipearea.user.js
// @updateURL https://update.greasyfork.org/scripts/454404/theCrag%20-%20swipearea.meta.js
// ==/UserScript==
 

jQuery(document).ready(function () {

  jQuery(".regions__content").on( "swipeleft", function( event ) { jQuery("a[rel='next']").first().find('span').trigger("click"); } );
  jQuery(".regions__content").on( "swiperight", function( event ) { jQuery("a[rel='prev']").first().find('span').trigger("click"); } );
  jQuery("#EmbedAreaMap").on( "swipeleft", function( event ) { return false; } );
  jQuery("#EmbedAreaMap").on( "swiperight", function( event ) { return false; } );
});