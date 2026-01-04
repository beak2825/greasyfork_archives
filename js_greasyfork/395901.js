// ==UserScript==
// @name         MPD regular schema tags highlighter
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Create context menu
// @author       Sebastian Blajevici
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @match        https://partners.wayfair.com/v/product_catalog/manage_product_description/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395901/MPD%20regular%20schema%20tags%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/395901/MPD%20regular%20schema%20tags%20highlighter.meta.js
// ==/UserScript==
setTimeout(function(){
(function() {
    'use strict';

    var $ = window.jQuery;
    var jQuery = window.jQuery;

    function showHeader(){
        var mainHeader = document.querySelector('body > div.wrapper > div.body.wfe_content_wrap.js-wfe-content-wrap > div > div > div > main > div.ex-StickyHeader');
        mainHeader.style.removeProperty('display');
    }

    function highlights(){
       //alert('start');
        var EAVinputs = $("input[placeholder='Enter Answer Value']");
        var EAVinputsArr = jQuery.makeArray(EAVinputs);
        if(EAVinputsArr.length > 0){
         // alert(EAVinputsArr.length);
        }
        $.each(EAVinputsArr,function(key, value){
            //alert(key + value);
               var parent = $(this).closest('.product_column_input');
               var parent2 = $(this).closest('.product_column_input_2');
               var parent3 = $(this).closest('.product_column_input_3');

               if((parent.length > 0)){
                   //alert("testing");
                    var sibling = parent.siblings('.global_status_icon');
                    if(sibling.length > 0){
                       //alert('found sibling');
                    }

                    var fa = $('span.fa-stack');
                    var cousin = sibling.children(fa);
//alert($(this).length);
                    if($(this).length > 0 && $(this).html()=="" && $(this).val()==''){
                       //alert('found cousin');
                       $(this).css( "background-color", "#f4ffb0" );
                    }
                }else if((parent2.length > 0)){
                    sibling = parent2.siblings('.global_status_icon');
                    if(sibling.length > 0){
                       //alert('found sibling');
                    }

                    fa = $('span.fa-stack');
                    cousin = sibling.children(fa);

                    if($(this).length > 0 && $(this).html()=="" && $(this).val()==''){
                       //alert('found cousin');
                       $(this).css( "background-color", "#f4ffb0" );
                    }
                }else if((parent3.length > 0)){
                    sibling = parent3.siblings('.global_status_icon');
                    if(sibling.length > 0){
                       //alert('found sibling');
                    }

                    fa = $('span.fa-stack');
                    cousin = sibling.children(fa);

                    if($(this).length > 0 && $(this).html()=="" && $(this).val()==''){
                       //alert('found cousin');
                       $(this).css( "background-color", "#f4ffb0");
                    }
                }
           });

        var Sinputs = $('div.Select-placeholder');
        var SinputsArr = jQuery.makeArray(Sinputs);
        if(SinputsArr.length > 0){
          //alert(SinputsArr.length);
        }

        $.each(SinputsArr,function(key, value){
            //alert(key + value);

               if($(this).html() == "Select..."){

                  var parent = $(this).closest('.product_column_input');
                  var parent2 = $(this).closest('.product_column_input_2');
                  var parent3 = $(this).closest('.product_column_input_3');

                  if(parent.length > 0){
                    var sibling = parent.siblings('.global_status_icon');
                    if(sibling.length > 0){
                      //alert('found sibling' + sibling.text);
                    }

                    var fa = $('span.fa-stack');
                    var cousin = sibling.children(fa);

                    if($(this).length > 0 && $(this).html()!=""){
                       //alert('found cousin' + cousin.html);
                       $(this).css( "background-color", "#f4ffb0" );
                    }
                  } else if(parent2.length > 0){
                      sibling = parent2.siblings('.global_status_icon');
                      if(sibling.length > 0){
                         //alert('found sibling' + sibling.text);
                       }

                      fa = $('span.fa-stack');
                      cousin = sibling.children(fa);

                      if($(this).length > 0 && $(this).html()!=""){
                         //alert('found cousin' + cousin.html);
                         $(this).css( "background-color", "#f4ffb0" );
                      }
                  }else if(parent3.length > 0){
                      sibling = parent3.siblings('.global_status_icon');
                      if(sibling.length > 0){
                         //alert('found sibling' + sibling.text);
                       }

                      fa = $('span.fa-stack');
                      cousin = sibling.children(fa);

                      if($(this).length > 0 && $(this).html()!=""){
                         //alert('found cousin' + cousin.html);
                         $(this).css( "background-color", "#f4ffb0" );
                      }
                   }
               }
        });

    }

    function hideHeader(){
        var mainHeader = document.querySelector('body > div.wrapper > div.body.wfe_content_wrap.js-wfe-content-wrap > div > div > div > main > div.ex-StickyHeader');
        mainHeader.style.display='none';
    }

    

    function getSkus(){
        var skus = [];
        var productColumn = $('div.product_column');

         $('a[href*="?pr_sku"]', productColumn).each(function(){
            var sku = $(this).text();
            skus.push(sku);

        });

        prompt("Copy to clipboard: Ctrl+C", skus);

     }

     $(document).ready(function(){

       function createMenu(){
        var $input = $('<div id="mpdmenu" style="padding:1px 10px;z-index: 9999; position: fixed; top: 105px;"><input id="highlights" type="button" value="Highlight Empty Regular Tags" /></div>');
        $input.prependTo($("body"));
       }


       createMenu();


       $("#getSKU").click (getSkus);
       $("#show").click (showHeader);
       $("#hide").click (hideHeader);
       $("#highlights").click (highlights);
      
       //$("#searchBtn").click (search);

     });
})();},3500);