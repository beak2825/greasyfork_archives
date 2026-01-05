// ==UserScript==
// @name        Cam4 - Males
// @namespace   cam4.com
// @description Cam4 hide male rooms /male tabs from featured  
// @include     http://cam4.com/*
// @include     http://*.cam4.com/*
//@require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @version     1
// @grant       none
// ==/UserScript==
function hidemale()
   {
$('#directorySavedSearches ul.desktop-tabs li:nth-child(3)').hide();
//if($('.sexnorientation img').attr('alt') == "Male Group"){
  
//}
//alert('1234');
//var atr = $('#directoryDiv').children('.profileBox').children('.profileDataBox').children('.profileDetailBox').children('.profileDetailArea').children('.sexnorientation img').attr('alt');alert(atr);
$('.sexnorientation').find('img').map(function(){
  //alert(this.alt);
  if(this.alt == 'male' || this.alt == 'Male Group' || this.alt == 'Male'){
    //this.find('.profileBox').hide();
    //alert('4321');
    $(this).parent().parent().parent().parent().parent().hide();
  }
}).get();

}
   setInterval(hidemale, 100); // interval timer every 1000 = 1 sec

