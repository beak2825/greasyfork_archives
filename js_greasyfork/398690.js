// ==UserScript==
// @name        better-t66y
// @namespace   anybetter
// @match       *://www.t66y.com/*
// @grant       none
// @version     1.2
// @author      -
// @description 2020/3/25 下午5:47:29
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/398690/better-t66y.user.js
// @updateURL https://update.greasyfork.org/scripts/398690/better-t66y.meta.js
// ==/UserScript==

(function() {
    console.log(window.location.pathname);
    'use strict';
    jQuery.noConflict();
  
      var table = document.querySelectorAll('.sptable_do_not_remove');
        if (document.querySelectorAll('.sptable_do_not_remove span').length > 0) {
          var str = document.querySelectorAll('.sptable_do_not_remove span') [0].className;
          for (var j = 0; j < table.length; j++) {
            var td = table[j].querySelectorAll('td');
            for (var i = 0; i < td.length; i++) {
              td[i].innerHTML = '<span class=' + str + '></span>';
            }
          }
        } else {
          for (var k = 0; k < table.length; k++) {
            table[k].style.display = 'none';
          }
        }
        jQuery("div.tpc_content").css("font-size", "20px").css("max-width", "800px");
        
        jQuery("div.tpc_content>span").css("font-size", "20px");
        jQuery("span.f18").css("font-size", "20px");
        jQuery("span.f16").css("font-size", "20px");
})()