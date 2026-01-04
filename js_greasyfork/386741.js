// ==UserScript==
// @version      1.1
// @author       Winon#2297
// @match        https://freebitco.in/*
// @name         Winon's Freebitco.in AUTO ROLL (without captcha)
// @namespace    https://greasyfork.org/users/311179
// @description  You need to create an account to work in: https://freebitco.in/?r=15804570
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/386741/Winon%27s%20Freebitcoin%20AUTO%20ROLL%20%28without%20captcha%29.user.js
// @updateURL https://update.greasyfork.org/scripts/386741/Winon%27s%20Freebitcoin%20AUTO%20ROLL%20%28without%20captcha%29.meta.js
// ==/UserScript==

  var timeout = setTimeout("location.reload(true);",3630000);
      function resetTimeout() {
      clearTimeout(timeout);
      timeout = setTimeout("location.reload(true);",3630000);
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