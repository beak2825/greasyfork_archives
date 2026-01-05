// ==UserScript==
// @name        Autoplius litų rodymas
// @namespace   autoplius-litu-rodymas
// @description Litų rodymas autoplius automobilių sąraše
// @include     http://auto.plius.lt/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10751/Autoplius%20lit%C5%B3%20rodymas.user.js
// @updateURL https://update.greasyfork.org/scripts/10751/Autoplius%20lit%C5%B3%20rodymas.meta.js
// ==/UserScript==

jQuery(document).ready(function() {
  jQuery.each(jQuery(".price-list .fl strong"),function(i,val) {
    var priceEur = jQuery(val).html().replace('€','');
    priceEur = Math.round(parseInt(priceEur.replace(' ','')) * 3.4528);
    jQuery(val).html($(val).html() + " (" + priceEur +" Lt)");
  });
});