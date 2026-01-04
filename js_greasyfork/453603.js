// ==UserScript==
// @name         eBay ID viewer for HobbyDB
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license      MIT
// @description  show eBay IDs in listing
// @author       Ryan
// @match        https://www.ebay.com/sch/*
// @icon         https://www.google.com/s2/favicons?domain=ebay.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        none
/* globals $ */
// @downloadURL https://update.greasyfork.org/scripts/453603/eBay%20ID%20viewer%20for%20HobbyDB.user.js
// @updateURL https://update.greasyfork.org/scripts/453603/eBay%20ID%20viewer%20for%20HobbyDB.meta.js
// ==/UserScript==
(function() {
    //ebay changed shit
    //var item = '<div class="container">'
      var item = '<div class="s-item__wrapper clearfix">'
      //ebay changed to the above 9/28
      //var item = '<div class="results">'
    //ebay changed shit
    $( ".s-item__link" ).each(function(i, obj) {
      //$( ".vip" ).each(function(i, obj) {
       const regexp = /ebay.com\/itm\/([0-9]{12})\?(hash|epid)/g;
       const url = $(this).attr("href");
       const array = [...url.matchAll(regexp)];
       var itemnum = array[0]?.[1];
       item += array[0]?.[1]
       item += "<br />"
       $(this).after(`<p style="color:orange;font-size:120%">${itemnum}</p>`)
    })
    $(document.body).append(item);
})
();