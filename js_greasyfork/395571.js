// ==UserScript==
// @name         MPD Get SKUs + Show/Hide sticky header + Highlighter + Unblur
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Create context menu
// @author       Sebastian Blajevici
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @match        https://partners.wayfair.com/v/product_catalog/manage_product_description/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395571/MPD%20Get%20SKUs%20%2B%20ShowHide%20sticky%20header%20%2B%20Highlighter%20%2B%20Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/395571/MPD%20Get%20SKUs%20%2B%20ShowHide%20sticky%20header%20%2B%20Highlighter%20%2B%20Unblur.meta.js
// ==/UserScript==
setTimeout(function(){
(function() {
    'use strict';

    var $ = window.jQuery;
    var jQuery = window.jQuery;


    function showHeader(){
        var mainHeader = document.querySelector('body > div.wrapper > div.body.wfe_content_wrap.js-wfe-content-wrap > div > div > div > main > div > div > div.ex-StickyHeader > div.ex-StickyHeader-header.ex-StickyHeader-header--sticky.is-sticking > div');
        mainHeader.style.removeProperty('display');
    }

    function hideHeader(){
        var mainHeader = document.querySelector('body > div.wrapper > div.body.wfe_content_wrap.js-wfe-content-wrap > div > div > div > main > div > div > div.ex-StickyHeader > div.ex-StickyHeader-header.ex-StickyHeader-header--sticky.is-sticking > div');
        mainHeader.style.display='none';
    }

    function highlight(){
       //alert('start');
        var EAVinputs = $('input[placeholder="Enter Answer Value"]');
        var EAVinputsArr = jQuery.makeArray(EAVinputs);
        if(EAVinputsArr.length > 0){
          //alert(EAVinputsArr.length);
        }
        $.each(EAVinputsArr,function(key, value){
            //alert(key + value);
               var parent = $(this).closest('.product_column_input');
               var parent2 = $(this).closest('.product_column_input_2');
               var parent3 = $(this).closest('.product_column_input_3');

               if((parent.length > 0)){
                    var sibling = parent.siblings('.global_status_icon');
                    if(sibling.length > 0){
                       //alert('found sibling');
                    }

                    var fa = $('span.fa-stack');
                    var cousin = sibling.children(fa);

                    if(cousin.length > 0 && cousin.html()!="" && $(this).val()==''){
                       //alert('found cousin');
                       $(this).css( "background-color", "#ff000038" );
                    }
                }else if((parent2.length > 0)){
                    sibling = parent2.siblings('.global_status_icon');
                    if(sibling.length > 0){
                       //alert('found sibling');
                    }

                    fa = $('span.fa-stack');
                    cousin = sibling.children(fa);

                    if(cousin.length > 0 && cousin.html()!="" && $(this).val()==''){
                       //alert('found cousin');
                       $(this).css( "background-color", "#ff000038" );
                    }
                }else if((parent3.length > 0)){
                    sibling = parent3.siblings('.global_status_icon');
                    if(sibling.length > 0){
                       //alert('found sibling');
                    }

                    fa = $('span.fa-stack');
                    cousin = sibling.children(fa);

                    if(cousin.length > 0 && cousin.html()!="" && $(this).val()==''){
                       //alert('found cousin');
                       $(this).css( "background-color", "#ff000038" );
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

                    if(cousin.length > 0 && cousin.html()!=""){
                       //alert('found cousin' + cousin.html);
                       $(this).css( "background-color", "#ff000038" );
                    }
                  } else if(parent2.length > 0){
                      sibling = parent2.siblings('.global_status_icon');
                      if(sibling.length > 0){
                         //alert('found sibling' + sibling.text);
                       }

                      fa = $('span.fa-stack');
                      cousin = sibling.children(fa);

                      if(cousin.length > 0 && cousin.html()!=""){
                         //alert('found cousin' + cousin.html);
                         $(this).css( "background-color", "#ff000038" );
                      }
                  }else if(parent3.length > 0){
                      sibling = parent3.siblings('.global_status_icon');
                      if(sibling.length > 0){
                         //alert('found sibling' + sibling.text);
                       }

                      fa = $('span.fa-stack');
                      cousin = sibling.children(fa);

                      if(cousin.length > 0 && cousin.html()!=""){
                         //alert('found cousin' + cousin.html);
                         $(this).css( "background-color", "#ff000038" );
                      }
                   }
               }
        });

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

    function unblur(){
        var fieldGroup = $('.product_column_input, .product_column_input_3, .product_column_input_2');
        var schemaTagsLabels1 = $('label.Autocomplete.has-noStatus');
        $('span.ex-InputLabel.is-positioned',fieldGroup).text("");

        //var schemaTagsLabels2 = $('label.ex-TextInput-field');
        //$('span.ex-InputLabel.is-positioned',schemaTagsLabels2).text("");

        //var schemaTagsLabels3 = $('label.Autocomplete.is-disabled')
        //$('span.ex-InputLabel.is-positioned',schemaTagsLabels3).text("");
    }

     $(document).ready(function(){

       function createMenus(){
        var $input = $('<div id="mpdmen" style="padding:1px 10px;z-index: 9999; position: fixed; top: 55px;"><input id="getSKU" type="button" value="Get SKUs" style="" /></div><div id="header-buttons" style="padding:1px 10px;z-index: 9999; position: fixed; top: 55px; left:75px;"><input id="show" type="button" value="Show " style="" /><input id="hide" type="button" value="Hide" style="" /><!--<input id="unblur" type="button" value="Unblur" />--></div><div id="highl" style="padding:1px 10px;z-index: 9999; position: fixed; top: 80px;"><input id="highlight" type="button" value="Highlight Empty HPR Tags" /></div>');
        $input.prependTo($("body"));
        var $maincontent = document.querySelector(".main_content");
        $maincontent.style.width = "69%";
        $maincontent.style.marginLeft = 'auto';
        $maincontent.style.marginRight = 'auto';
        var $stickyHeader = document.querySelector(".ex-StickyHeader-header");
        $stickyHeader.style.width = '80%';
       }


       createMenus();

       $("#getSKU").click (getSkus);
       $("#show").click (showHeader);
       $("#hide").click (hideHeader);
       $("#highlight").click (highlight);
       $("#unblur").click (unblur);
       //$("#searchBtn").click (search);

     });
})();},3500);