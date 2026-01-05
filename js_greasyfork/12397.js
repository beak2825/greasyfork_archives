// ==UserScript==
// @name        el-coso-ese
// @namespace   2015-el-colo-ese
// @description un coso
// @description:en un coso 
// @include     http://*-es.ogame.gameforge.com/game/index.php*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12397/el-coso-ese.user.js
// @updateURL https://update.greasyfork.org/scripts/12397/el-coso-ese.meta.js
// ==/UserScript==

$(document).ready(function() {

    // set timeout
    var tid = setTimeout(mycode, 2000);
    function mycode() {
      console.log('check');
      if($("#attack_alert").hasClass("soon")){
          clearTimeout(tid);
          var url ="http://listenonrepeat.com/watch/?v=PowGPSdAxTI#ALARM_-_DANGER__-_WARNING_Sound_Effect"; 
          
          $('<iframe />');  // Create an iframe element
          $('<iframe />', {
              name: 'frame1',
              id: 'frame1',
              src: url
          }).appendTo('body');
          
          $("#frame1").css({"width": "1px", "height": "1px"});
          
      } else {
        tid = setTimeout(mycode, 2000); // repeat myself
      }  
    }

});