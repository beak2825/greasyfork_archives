// ==UserScript==
// @name            Auto Roll - Dogecoin & litecoin (H-CAPTCHA)
// @namespace       http://tampermonkey.net/
// @version         0.1
// @description     free autoroll faucet
// @author          elmer76
// @license         MIT
// @match           https://www.free-litecoin.com/*
// @match           https://www.free-doge.io/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/442432/Auto%20Roll%20-%20Dogecoin%20%20litecoin%20%28H-CAPTCHA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/442432/Auto%20Roll%20-%20Dogecoin%20%20litecoin%20%28H-CAPTCHA%29.meta.js
// ==/UserScript==
/*
==================================================================================================================================================                                                                                                                                              |
|         donate please  btc : 36v6NbQCeDp1LHDtpJgoBMq7u3J5zWipDW                     TY and enjoy                                               |
|         Please use my referal link      https://free-doge.io/?referer=306862                                                                   |
|                                         https://free-litecoin.com/login?referer=2835288                                                        |
==================================================================================================================================================
*/

$(document).ready(function(){
    console.log("Status: Page loaded.");
if($('#timerandnotification').is(':hidden')) {
let rollInterval = setInterval(function(){
  var hcaptchaVal = $('[name=h-captcha-response]').val();
 
  if(hcaptchaVal !== "") {
      clearInterval(rollInterval);
      setTimeout(function(){$(".btn.btn-success").trigger('click');},random(1000,2000));
      console.log("Status: Button ROLL clicked.");
  }
    else console.log("Status: checking for hcaptcha solved.");
}, 1000);
}
else {
    let reload_page = setInterval(function(){
    console.log("Status: timer will end soon");
    $('#cislo1').text() == "0" && $('#cislo2').text() == "0" && (clearInterval(reload_page), window.location.reload());
        }, 1000);
 
}
});
 
function random(min,max){
   return min + (max - min) * Math.random();
}