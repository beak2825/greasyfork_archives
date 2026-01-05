// ==UserScript==
// @name         Obrazki na mirkoczat.pl
// @namespace    https://mirkoczat.pl
// @version      0.1
// @description  Automatycznie otwiera obrazki na mirkoczat.pl
// @author       Mirkoczat
// @match        https://mirkoczat.pl/t/*
// @match        https://mirkoczat.pl/embed_t/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24907/Obrazki%20na%20mirkoczatpl.user.js
// @updateURL https://update.greasyfork.org/scripts/24907/Obrazki%20na%20mirkoczatpl.meta.js
// ==/UserScript==

$(function(){
   var r = /(http\:\/\/i.imgur.com\/[a-zA-Z0-9]*\.(jpg|png))/;
   setInterval(function(){
    $('.message a').each(function(i){
      if (i<15) {
        var item = $(this).html();
        if (item.indexOf('<') < 0 && item.match(r)) {
            item = item.replace(r, '<img src="$1" style="max-height: 200px; max-width: 150px; vertical-align: text-top" />');
            $(this).html(item);
        }
      }
    })
   },20)
})

