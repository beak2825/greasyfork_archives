// ==UserScript==
// @name        Tinder-Auto-Swiper
// @namespace   Tinder
// @include     https://tinder.com/app/recs
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @version     1
// @run-at document-end
// @grant       none
// @description auto right swiper for tinder
// @downloadURL https://update.greasyfork.org/scripts/427967/Tinder-Auto-Swiper.user.js
// @updateURL https://update.greasyfork.org/scripts/427967/Tinder-Auto-Swiper.meta.js
// ==/UserScript==


alert("auto clicker is on");
var i = 0;


  setInterval( function a(){
    i = 0;
    
    $(".button").each( function a(){ 
      if( i == 3 ){
        $(this).click();
      }
      i++;
    });	
  }, 100)
  
  
