// ==UserScript==
// @name         Fix Serena Community Blog page carousel resizing
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Page has carousel at the top that rotates through different blogs.
//               Each is a different height which causes everything below to jump up and down every time the carousel changes.
//               This script finds the max height of all carousel items and sets the carousel container's height.
// @author       (@ gmail) mnemotronic
// @match        *://*.communities.serena.com/blogs*
// @match        *://*.serenacentral.com/blogs*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25021/Fix%20Serena%20Community%20Blog%20page%20carousel%20resizing.user.js
// @updateURL https://update.greasyfork.org/scripts/25021/Fix%20Serena%20Community%20Blog%20page%20carousel%20resizing.meta.js
// ==/UserScript==

(function() {
   'use strict';

   // Fix the Serena Community Blogs page that's constantly moving content up and down due to the carousel 
   //    items being different heights.
   // carousel containing carousel DIV elements
   var carousel_Div = jQuery('.carousel-inner') ;

   // Array of carousel DIV elements
   var carousel_inner_Divs = carousel_Div.children('div.item') ;
   var mx=0 ;

   if (carousel_inner_Divs.length>2) {
      carousel_inner_Divs.each( function(idx) {
         // height of the current loop element.
         var h = jQuery(this).outerHeight(true) ;
         // save max height
         if (h>mx) { mx=h ;}
         // console.log('idx=' + idx + '   element outerHeight=' + h + '   current max height=' + mx ) ;
      }) ;
      // console.log('max height=' + mx ) ;
      // set the carousel container
      carousel_Div.css('height',mx);
   }

})();
