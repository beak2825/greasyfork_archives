// ==UserScript==
// @name        Crowd Analytics
// @namespace   DCI
// @include     https://s3.amazonaws.com/mturk_bulk/hits/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1
// @grant       none
// @description x
// @downloadURL https://update.greasyfork.org/scripts/2603/Crowd%20Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/2603/Crowd%20Analytics.meta.js
// ==/UserScript==

document.addEventListener( "keydown", kas, false);

function kas(i) {
     if ( i.keyCode == 97 ) { // 1
     $('.form-control').eq(0).click();
     $('.text-center').click();
         }    
     if ( i.keyCode == 98 ) { // 2
   $('.form-control').eq(1).click();
   $('.text-center').click();          
     }
     if ( i.keyCode == 99 ) { // 3
   $('.form-control').eq(2).click();
   $('.text-center').click();
     }
     if ( i.keyCode == 100 ) { // 4
   $('.form-control').eq(3).click();
   $('.text-center').click();         
     }
}