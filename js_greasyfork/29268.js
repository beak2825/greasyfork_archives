// ==UserScript==
// @name            Foto Tags
// @namespace       dummbroesel.misc
// @version         0.1.1
// @description     get tags as ","separated string
// @author          Dummbroesel
// @include         *fotolia.com/id/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/29268/Foto%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/29268/Foto%20Tags.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function($) {
  'use strict';
  
  $(document).keydown(function (event) {
    switch(event.which) {
      case 192:
        var output = ''; 
        $('.tag-list .tag').each(function (){ output = output + this.text + ', ';});
        output = output.substring(0, output.length - 2);
        console.log(output);
        
        var wp = $('.content-preview .h-strong').text()+ ' | #' + window.tmParam.content_id + ' | © ' + $('.content-preview a[href*="/p/"]').text() + ' - <a target="_blank" href="https://fotolia.com/">Fotolia.com</a>';
        console.log(wp);
        break;
      default:

    } 
  });
})($);