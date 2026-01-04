// ==UserScript==
// @version      0.2
// @author       NoName90s
// @name         Auto Roll - Dogecoin, litecoin & Ethereum (H-CAPTCHA)
// @namespace    https://www.free-doge.io
// @namespace    https://free-litecoin.com/
// @namespace    https://www.free-ethereum.io/
// @note         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ *IMPORTANT* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// @note                   YOU MUST HAVE A hCaptcha solver INSTALLED to claim from the faucets
// @note                   I recommend this script: https://greasyfork.org/en/scripts/425854-hcaptcha-solver-automatically-solves-hcaptcha-in-browser
// @note         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// @description  Roll every hour with h-captcha solver. Please support join my referrel id given id
// @description  https://free-litecoin.com/login?referer=1958685
// @description  https://free-ethereum.io/?referer=243499
// @description  https://free-doge.io/?referer=73554
// @match        https://www.free-litecoin.com
// @match        https://www.free-ethereum.io/free/
// @match        https://www.free-doge.io/free/
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/432312/Auto%20Roll%20-%20Dogecoin%2C%20litecoin%20%20Ethereum%20%28H-CAPTCHA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/432312/Auto%20Roll%20-%20Dogecoin%2C%20litecoin%20%20Ethereum%20%28H-CAPTCHA%29.meta.js
// ==/UserScript==

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