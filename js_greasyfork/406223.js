    // ==UserScript==
    // @name         Freebitcoin Autoclaim + Page Refresh
    // @namespace    By bernd
    // @version      0.1
    // @description  Autoclaim Play Without Captcha Freebitco.in + Force Refresh Page
    // @author       bernd
    // @match        https://freebitco.in/*
    // @require      https://code.jquery.com/jquery-3.5.1.js
    // @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406223/Freebitcoin%20Autoclaim%20%2B%20Page%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/406223/Freebitcoin%20Autoclaim%20%2B%20Page%20Refresh.meta.js
    // ==/UserScript==

         $(document).ready(function(){
           setTimeout(function(){
             $("#free_play_form_button").click();
           }, 500+Math.random()*1500);
         });



function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


//60+ minutes sleeping function
async function main() {
  var a=Math.random();
  var b=Math.random();
  var c=Math.round(Math.random()*149826);
  var sleeptime=3630000+Math.round(a*b*c)+Math.floor(Math.random()*4000);
  await sleep(sleeptime);

  location.reload();
}

main();