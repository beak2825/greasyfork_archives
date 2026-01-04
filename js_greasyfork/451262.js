// ==UserScript==
// @name         AliExpress Seller OldLinks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds links to the merchant panel that can be opened in a new tab
// @author       vladmrakov
// @match        https://seller.aliexpress.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451262/AliExpress%20Seller%20OldLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/451262/AliExpress%20Seller%20OldLinks.meta.js
// ==/UserScript==

(function() {
    'use strict';

var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
document.getElementsByTagName('head')[0].appendChild(script);

var time = 1;

var interval = setInterval(function() {
   if (time == 'jl') {

   }
   else {

$('[class*="custom-scrollbar_root"]').each(function(i, el){

        if ( i === 3) {
              $(this).css({
           overflow: 'visible',

       });
    }
});

$('[class*="custom-scrollbar_scroller"]').each(function(i, el){
    console.log(i);
        console.log(this);
        if ( i === 3) {
              $(this).css({
           overflow: 'visible',
       });
    }
});

    $('[class*="table_row_clickable"]').each(function(){

         var codee = $('[class*="link_root__"]', this)
         var gi = $('[class*="order-list_caption__"]', this).first();

        if ($('.dddt', this).length > 0) {

        } else { // не существует
         var contt= gi.html();// дата
                    var gp = '<div class="dddt">'+contt+'</div>'
                    gi.empty();
                    $(gi).append(gp);
         $(gi).append( '<a style="border: 1px solid gray;position: absolute;left: -23px;top: 30px;border-radius: 3px;" target="_blank" href="https://seller.aliexpress.ru/orders/orders/'+codee.html()+'?source=GlobalTrade"><svg class="cococ" style= "margin: 2px 0 0 2px;width: 20px;height: 20px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <g> <path d="M17.218,2.268L2.477,8.388C2.13,8.535,2.164,9.05,2.542,9.134L9.33,10.67l1.535,6.787c0.083,0.377,0.602,0.415,0.745,0.065l6.123-14.74C17.866,2.46,17.539,2.134,17.218,2.268 M3.92,8.641l11.772-4.89L9.535,9.909L3.92,8.641z M11.358,16.078l-1.268-5.613l6.157-6.157L11.358,16.078z"></path> </g> </svg></a>' )

        }

    });



     /*$("input[class*='table_row_clickable']").each(function (i, el) {
         //It'll be an array of elements
           console.log('77');
     });*/
   }// end else
}, 3500);
})();