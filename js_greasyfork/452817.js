// ==UserScript==
// @name         pchome_search_title_filter
// @namespace    http://mesak.tw
// @version      1.1
// @description  pchome search title bar
// @author       Mesak
// @match        https://ecshweb.pchome.com.tw/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pchome.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452817/pchome_search_title_filter.user.js
// @updateURL https://update.greasyfork.org/scripts/452817/pchome_search_title_filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
     $('#layoutBread').css({justifyContent:'space-between'});
     $('#layoutBread').append(`<div style="width:40%">標題搜尋：<input type="text" id="fix_title_filter" value="" style="border:1px #000 solid"></div>`).on('keypress blur','#fix_title_filter',(e)=>{
       let word = e.currentTarget.value
       let words = word.split(' ')
       let $productList = $('#ItemContainer > dl')
        if( word == '')
        {
            $productList.show();
        }else{
         $productList.hide();
         $productList.each((key,node)=>{
             let title = $('.prod_name',node).text()
             let resutls  = []
             words.forEach( (value) => {
                 resutls.push( title.toLowerCase().search(value.toLowerCase()) !== -1)
             })
             if( !resutls.includes(false) ){
                 $(node).show();
             }


         })
        }
     })


    // Your code here...
})();