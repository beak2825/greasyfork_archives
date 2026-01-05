// ==UserScript==
// @name        C4 hide trash rooms.
// @namespace   cam4.com
// @description Execute sluts rooms  
// @include     http://cam4.com/*
// @include     http://*.cam4.com/*
// @include     http://*.sex.co.uk/*
//@require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @version     1.3
// @run-at      document-start
// @grant       none
// ==/UserScript==

function hideslut()
   {
$('.profileBoxTitle').find('a').map(function(){
  if(this.text == 'evacam4luv' || this.text == 'Emannuely' || this.text == 'freeroomspace2'){
    $(this).parent().parent().parent().parent().hide();
  }
}).get();

}
   setInterval(hideslut, 0); // interval timer every 100 = 1 sec

