// ==UserScript==
// @name         Feyorra Manual Faucet Bot
// @namespace    feyorra.site
// @version      20240609
// @description  auto claim manual faucet!
// @author       Script Bot Dev
// @match        https://feyorra.site/member/faucet
// @icon         https://www.google.com/s2/favicons?sz=64&domain=feyorra.site
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494269/Feyorra%20Manual%20Faucet%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/494269/Feyorra%20Manual%20Faucet%20Bot.meta.js
// ==/UserScript==

var Captcha = 0;
var BOT = setInterval(function(){
  if(document.querySelector("input[type=radio][value=turnstile]"))
  if(Captcha === 0){
  document.querySelector("input[type=radio][value=turnstile]").click();
  Captcha = 1;
  }
  if(document.querySelector(".cf-turnstile")){
            var cloudflare = document.querySelector(".cf-turnstile > input").value;
            if((cloudflare) && cloudflare > ""){
              var Claim = document.querySelector(".claim-button");
if(Claim.innerText === "Claim"){
document.querySelector(".claim-button").click();
clearInterval(BOT);
}

            }
            }
},500)
