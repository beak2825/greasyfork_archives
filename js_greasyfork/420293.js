// ==UserScript==
// @name         Freebitco.in Freeroll Auto claim + Force Refresh Page 2021
// @namespace    https://greasyfork.org/users/rnv21
// @version      0.1
// @description  try to take over the world!
// @author       rnv21
// @match        https://freebitco.in/*
// @match        https://freebitco.in/?op=home#
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420293/Freebitcoin%20Freeroll%20Auto%20claim%20%2B%20Force%20Refresh%20Page%202021.user.js
// @updateURL https://update.greasyfork.org/scripts/420293/Freebitcoin%20Freeroll%20Auto%20claim%20%2B%20Force%20Refresh%20Page%202021.meta.js
// ==/UserScript==

(function() {
    'use strict';
 var timeout = setTimeout("location.reload(true);",1815000);
      function resetTimeout() {
      clearTimeout(timeout);
      timeout = setTimeout("location.reload(true);",1815000);
  }
  var count_min = 1;
$(document).ready(function(){
    console.log("Status: Page loaded.");

    setTimeout(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked.");
    }, random(2000,4000));

    setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
    }, 60000);

    setTimeout(function(){
        $('.close-reveal-modal')[0].click();
        console.log("Status: Button CLOSE POPUP clicked.");
    }, random(12000,18000));

    setInterval(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked again.");
    }, random(3605000,3615000));
});

function random(min,max){
   return min + (max - min) * Math.random();
}
})();