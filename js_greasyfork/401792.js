// ==UserScript==
// @name        Bandcamp Price Grabber
// @namespace   Violentmonkey Scripts
// @match       *://*.bandcamp.com/
// @grant       none
// @version     1.0
// @author      lempamo
// @description 4/23/2020, 1:25:40 AM
// @downloadURL https://update.greasyfork.org/scripts/401792/Bandcamp%20Price%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/401792/Bandcamp%20Price%20Grabber.meta.js
// ==/UserScript==

var p = /\d*\.\d*(?=},$)/gm;

$(".music-grid-item a").each(function(i){
  var price = 0;
  var c = "green";
  var e = this;
  
  $.get(document.URL + $(e).attr("href"), function(d){
    console.log(d);
    price = parseFloat(d.match(p)[0]);
    console.log(price);
    
    if (price > 0) c = "red";
  
    $(e).children("div").append(`<span style="color:white;background:${c};position:absolute;top:0;right:0;padding:2px">$${price.toFixed(2)}</span>`);
  });
});