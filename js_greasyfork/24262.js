// ==UserScript==
// @name        Wanikani Kana Review
// @namespace   Mempo
// @description Changes kanji->kana on 'meaning' reviews
// @version     1.1
// @include     http://www.wanikani.com/review/session
// @include     https://www.wanikani.com/review/session
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24262/Wanikani%20Kana%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/24262/Wanikani%20Kana%20Review.meta.js
// ==/UserScript==

console.log("/// START Wanikani Kana Review");

var KEYBIND_KEY = 225; //DEFAULT ALT GR BUTTON (225)

//APPRENTICE 1 & 2 & 3 & 4
//GURU 5 & 6
//MASTER 7
//ENLIGHTENED 8

var srs_level = 5; // >= srs_level (guru here)
var keybind_active = false;
$.jStorage.listenKeyChange('currentItem', function(){

  if( $.jStorage.get("currentItem").voc && $.jStorage.get("questionType") === "meaning" && $.jStorage.get("currentItem").srs >= srs_level){
    keybind_active = true;
    $("#character span")[0].innerHTML = $.jStorage.get('currentItem').kana[0];
   
  }else{
   keybind_active = false;   
  }
    
  
  
});

$(document).on('keydown.reviewScreen', function (event)
  {
    if ($('#reviews').is(':visible') && keybind_active)
    {
      //alert('keycode: ' + event.keyCode);
      switch (event.keyCode) {
        case KEYBIND_KEY: // ALT GR button (Chrome/Firefox azerty keyboard)
          event.stopPropagation();
          event.preventDefault();
          
          $("#character span")[0].innerHTML = $.jStorage.get('currentItem').voc;
          break;
      }
    }
  });

$(document).on('keyup.reviewScreen', function (event)
  {
    if ($('#reviews').is(':visible') && keybind_active)
    {
      //alert('keycode: ' + event.keyCode);
      switch (event.keyCode) {
        case KEYBIND_KEY: // ALT GR button (Chrome/Firefox azerty keyboard)
          event.stopPropagation();
          event.preventDefault();
          
          $("#character span")[0].innerHTML = $.jStorage.get('currentItem').kana[0];
          break;
      }
    }
  });

