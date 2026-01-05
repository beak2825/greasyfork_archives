// ==UserScript==
// @name     TED
// @description Hide readed article
// @include    https://www.ted.com/*
// @include    http://www.ted.com/* 
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.12.2/jquery.min.js
// @version 0.0.1.20161031142838
// @namespace https://greasyfork.org/users/38384
// @downloadURL https://update.greasyfork.org/scripts/18719/TED.user.js
// @updateURL https://update.greasyfork.org/scripts/18719/TED.meta.js
// ==/UserScript==

 $(function() {
   // var myArray = ['May 2017'];
    var tempArray = ['Enough with the fear of fat', 'How my son', 'Chinese zodiac', 'genome and build', 'Drawings that show', 'nurses and other rebel designers'];
    var time = $(".meta__item .meta__val").length;
    for (var j=0; j<time; j++) {
        /*for (var i=0; i<myArray.length; i++) {
            if ($('.meta__item .meta__val').eq(j).html().trim() == myArray[i]) {
              $('.meta__item .meta__val').eq(j).closest('.col').css("opacity", "0.1");
            }
        }*/
        for (var i=0; i<tempArray .length; i++) {
            if ($('.media__message h4 a').eq(j).html().trim().indexOf(tempArray[i]) != -1) {
              $('.meta__item .meta__val').eq(j).closest('.col').css("opacity", "0.1");
            }
        }
   }
  });