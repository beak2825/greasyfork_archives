// ==UserScript==
// @name         Amazon Delta Cart
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  "has {in,de}creased by $+-#.# +-#.#%", automatically calculated.
// @author       Steven Bytnar
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @include      *://*.amazon.tld/gp/*
// @include      *://*.amazon.tld/*/gp/*
// @include      *://*.amazon.tld/dp/*
// @include      *://*.amazon.tld/*/dp/*
// @include      *://*.amazon.tld/*/dp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39885/Amazon%20Delta%20Cart.user.js
// @updateURL https://update.greasyfork.org/scripts/39885/Amazon%20Delta%20Cart.meta.js
// ==/UserScript==
// match         http://*/*

// v1.1.0: switch from .com to .tld.
// x@include      https://*.amazon.tld/*


(function(){
  "use strict";

$(document).ready(function(){

    console.log("Delta Cart activated");
    var listitems = $("#cart-important-message-box .a-color-price");

    var count = 0;
    var price = 0.0;
    $.each(listitems, function(index, value) {
       var val = parseFloat($.text(value).split('$')[1]);
       if (count % 2 == 1) {
           var diff = val - price;
           var diffpct = ((val-price)/price)*100.0;
           var color;
           var plus = '';
           if (diff < 0.0) {
               color = 'RED';
           } else {
               color = 'green';
               plus = '+';
           }
           $(this).parent().parent().css('color', color);
           color = "";
           value.append(' ' + color + 'by $' + plus + (diff).toFixed(2) + ' or ' + plus + (diffpct).toFixed(2) + '%');
       }
        count++;
       price = val;
       //console.log(index + ': ' + $.text(value));
    });


});

})();