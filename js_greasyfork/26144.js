// ==UserScript==
// @name         Put.io - Full window toggler
// @namespace    codedevotion
// @version      0.1
// @description  Adds a button to toggle full window video
// @author       Kwickell
// @match        https://put.io/files/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26144/Putio%20-%20Full%20window%20toggler.user.js
// @updateURL https://update.greasyfork.org/scripts/26144/Putio%20-%20Full%20window%20toggler.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var added = false;

  $(document).ready(function(){
    $(document).bind("DOMSubtreeModified", function(evt) {
      if($('#vjs_video_3').length > 0 && !added)
      {
        added = true;

        createControls();
      }
    });
  });

  function createControls(){
    $('<button>Toggle Fill Window</button>')
      .css({
      "position":"fixed",
      "right":"100px",
      "bottom":"20px",
      "width":"100px",
      "height":"50px",
      "background-color":"black",
      "color":"white",
      "z-index":"1000001",
      "opacity": "0.01"
    })
      .hover(
      function() {
        $( this ).css({"opacity":"1"});
      }, function() {
        $( this ).css({"opacity":"0.01"});
      }
    )
      .on('click',function() {
      if($('#vjs_video_3').attr('style')){

        $('#vjs_video_3')
          .removeAttr('style');

        $('#intercom-container').show();
      }else{

        $('#vjs_video_3')
          .css({
          "position":"fixed",
          "top":"0px",
          "bottom":"0px",
          "right":"0px",
          "left":"0px",
          "width":"100%",
          "height":"100%",
          "z-index":"1000000"
        });


        $('#intercom-container').hide();

      }
    }).appendTo('body');
  }
})();