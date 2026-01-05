// ==UserScript==
// @name        Hide international ebay listings
// @namespace   pauls
// @include     http://www.ebay.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @description Hides items listed under ebay "items found from eBay international sellers" and "More items related to"
// @version     4
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12410/Hide%20international%20ebay%20listings.user.js
// @updateURL https://update.greasyfork.org/scripts/12410/Hide%20international%20ebay%20listings.meta.js
// ==/UserScript==

setTimeout(function(){ 
  if($("#ListViewInner > li").index($("#ListViewInner > li").not($("[id^=item]")))>0){
    $("#ListViewInner > li").slice($("#ListViewInner > li").index($("#ListViewInner > li").not($("[id^=item]"))[0])+1).hide()
  }
}, 1000);
