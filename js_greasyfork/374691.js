// ==UserScript==
// @name         UTUBE_PLAY_1st
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Gram Parsons
// @match        https://www.youtube.com/*
// @grant        none
// @require http://code.jquery.com/jquery-3.3.1.min.js


// @downloadURL https://update.greasyfork.org/scripts/374691/UTUBE_PLAY_1st.user.js
// @updateURL https://update.greasyfork.org/scripts/374691/UTUBE_PLAY_1st.meta.js
// ==/UserScript==

(function() {
    'use strict';

  //   $( document ).ready(function() {

         var curr_URL = window.location.href;
         if (curr_URL.includes('TAGPROTAMPERMONKEY')){
         var new_URL = curr_URL.replace('TAGPROTAMPERMONKEY','');
         window.location.href=new_URL;
         console.log("HI");
         

     }

var thumbnail = document.getElementsByTagName('ytd-thumbnail')[0];
         console.log(thumbnail);
         console.log("HI");
             var video = thumbnail.getElementsByTagName("a")[0];
         video.click();



//     });
})();