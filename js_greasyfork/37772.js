// ==UserScript==
// @name       Ebay collection only filter
// @namespace  CollectionOnlyFilter
// @version    0.7
// @description  Hides all collection only listings.
// @match      https://www.ebay.co.uk/*
// @grant      none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/37772/Ebay%20collection%20only%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/37772/Ebay%20collection%20only%20filter.meta.js
// ==/UserScript==

$(document).ready(function() {
  $('div.srp-controls__default-refinements').append('<input type="button" value="Remove Collection Only" id="FCO">');
  //$("#FCO").css("position", "fixed").css("top", 2).css("left", 2);
  $('#FCO').click(function(){ 
    $(".s-item__localDelivery:contains('Free collection in person')").parent().parent().parent().parent().parent().hide();
  });
});