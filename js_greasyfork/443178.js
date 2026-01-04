// ==UserScript==
// @name        ÖSYM çıkan soruları ekrana sığdırma betiği - osym.gov.tr
// @namespace   Violentmonkey Scripts
// @match       https://ais.osym.gov.tr/*
// @grant       none
// @version     1.1
// @author      kdemir
// @license MIT
// @description 4/11/2022, 11:53:13 AM
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/443178/%C3%96SYM%20%C3%A7%C4%B1kan%20sorular%C4%B1%20ekrana%20s%C4%B1%C4%9Fd%C4%B1rma%20beti%C4%9Fi%20-%20osymgovtr.user.js
// @updateURL https://update.greasyfork.org/scripts/443178/%C3%96SYM%20%C3%A7%C4%B1kan%20sorular%C4%B1%20ekrana%20s%C4%B1%C4%9Fd%C4%B1rma%20beti%C4%9Fi%20-%20osymgovtr.meta.js
// ==/UserScript==
 
//shift+space kısayolu ile çalışır.
this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function()
{
    
 
  $("body").on("keydown", function(e){
  if(e.shiftKey && e.which == 32) {
    $("#button").click();
      $("#popupBlock").css({'width': 900});
    $("#popupBlock").css({'max-height': 2200});
    $("#popupBlock").css({'height': 1200});
    $("#popupBlock").css({'margin-top': 10});
    
    $(".cevap-soru-resim div").css({'max-height': 2200});
    
  }
});


 
  

  
});
