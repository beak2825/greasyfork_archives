// ==UserScript==
// @name         eBay sponsored listings remover
// @namespace    B123
// @version      1.0
// @description  Remove sponsored listings on ebay.*
// @author       Bjorn Nilsson
// @match        https://www.ebay.*/*
// @run-at       document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/433005/eBay%20sponsored%20listings%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/433005/eBay%20sponsored%20listings%20remover.meta.js
// ==/UserScript==
"use strict";

var removeSponsored = true;
const getSponsoredListings = function(inScope){
  return inScope.filter(function( index ) {
    var li = $(this)
    var sp_span = li.find("span[role='text'] > span");
    //console.log(sp_span);
    var res = sp_span.filter(function( index ) { 
      return $(this).is(':visible') && !!this.innerText.match(/[sponsored]/i) 
    } ).clone()
    //console.log($(res).text())
    return $(res).text().toLowerCase().includes("sponsored")                                           
  })
}

// $("section.b-listing > ul").find("li:has(div:contains('SPONSORED'))").css("border", "1px solid #F00")
$("section.b-listing > ul").find("li:has(div:contains('SPONSORED'))").remove();
var f_res = getSponsoredListings($("ul > li.s-item"))

if(removeSponsored){
  f_res.remove();
} else {
  f_res.css("border", "1px solid #F00");
}
  