// ==UserScript==
// @name         umsfaucet Bot
// @namespace    cryptol.online
// @version      20240619
// @description  auto claim faucet
// @author       Danik Odze
// @match        https://umsfaucet.online/*
// @icon         https://flashfaucet.xyz/BSassets/images/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511834/umsfaucet%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/511834/umsfaucet%20Bot.meta.js
// ==/UserScript==

var BOT = setInterval(function(){
    if(document.querySelector("#InputEmail")){
   document.querySelector("#InputEmail").value = "ВашаПочта";
   document.querySelector("form.user").submit();
       clearInterval(BOT);
   }
    if(document.body.outerHTML.includes("<h3>All Payout History</h3>")){
       window.location.href = "/faucet/currency/dgb";
        clearInterval(BOT);
    }
    if(document.querySelector("#verify")){
        window.stop();
        document.querySelector("#verify").submit();
        clearInterval(BOT);
    }
},500);



var redirect = setInterval(function() {
    var please = document.body.outerText.includes("Dont wait");
    var limite = document.body.outerText.includes("You have been rate-limited");
    var semfundos = document.body.outerHTML.includes("The faucet does not have");

    var faucet = document.location.pathname;
    if(faucet.includes("/firewall") === true){
         if(document.querySelector("#recaptchav2 > div")){
             console.log("recaptcha");
            var recaptcha = document.querySelector("#g-recaptcha-response").value;
               if((recaptcha) && recaptcha > ""){
                document.querySelector("div > form").submit();
                   clearInterval(redirect);
            }
            }
         if(document.querySelector(".cf-turnstile")){
             console.log("cloudflare");
            var cloudflare = document.querySelector(".cf-turnstile > input").value;
            if((cloudflare) && cloudflare > ""){
                document.querySelector("div > form").submit();
                clearInterval(redirect);
            }
            }
        setTimeout(function(){document.querySelector("div > form").submit();}, 10000);

    }
   if(please === true || limite === true || semfundos === true){
        window.stop();
        if(faucet.includes("/dgb")){
        window.location.href = "https://umsfaucet.online/faucet/currency/dgb";
         clearInterval(redirect);
      }
        if(faucet.includes("/dgb")){
         clearInterval(redirect);
            alert("Todas as moedas foram coletadas!");
      }



    }
},500);

setTimeout(function(){window.location.reload();}, 40000);






























