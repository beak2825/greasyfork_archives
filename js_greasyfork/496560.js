// ==UserScript==
// @name         Altcryp Bot
// @namespace    altcryp.com
// @version      2024-04-27
// @description  auto login and claim rotator!
// @author       Script Bot Dev
// @match        https://altcryp.com/*
// @icon         https://altcryp.com/assets/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496560/Altcryp%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/496560/Altcryp%20Bot.meta.js
// ==/UserScript==


if(document.querySelector("body > div:nth-child(9)")){
    document.querySelector("body > div:nth-child(9)").parentNode.removeChild(document.querySelector("body > div:nth-child(9)"));
}
var CAPTCHA = setInterval(function() {
if(document.querySelector(".next-button") && document.querySelector(".next-button").outerText.includes("Go Claim")){
    window.location.reload();
    clearInterval(CAPTCHA);
}else{
            if((document.querySelector(".cf-turnstile")) && document.querySelector(".cf-turnstile > input").value > ""){
                document.querySelector("#fauform").submit();
                clearInterval(CAPTCHA);
            }
}
 }, 500);
var LoginClick = 0;
var redirect = setInterval(function() {
    console.log(LoginClick);
    if(document.querySelector('a[data-target="#login"]')){
        if(LoginClick === 0){
   document.querySelector('a[data-target="#login"]').click();
            LoginClick = 1;
        }
   document.querySelector("#InputEmail").value = "YOURFAUCETPAYEMAILHERE@gmail.com";
        var recaptchaLogin = document.querySelector("#g-recaptcha-response").value;
               if((recaptchaLogin) && recaptchaLogin > ""){
                document.querySelector("form").submit();
                   clearInterval(redirect);
            }

   }
    if(document.querySelector("div.action-btns.mt-4") && document.body.outerText.includes("Instant Earn")){
       window.location.href = "https://altcryp.com/faucet/currency/btc";
        clearInterval(redirect);
    }


    var please = document.body.outerText.includes("Please wait");
    var limite = document.body.outerText.includes("Daily claim limit");
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
     if(faucet.includes("/btc")){
        window.location.href = "https://altcryp.com/faucet/currency/ltc";
         clearInterval(redirect);
      }
      if(faucet.includes("/ltc")){
        window.location.href = "https://altcryp.com/faucet/currency/usdt";
         clearInterval(redirect);
      }
        if(faucet.includes("/usdt")){
        window.location.href = "https://altcryp.com/faucet/currency/bnb";
         clearInterval(redirect);
      }
        if(faucet.includes("/bnb")){
        window.location.href = "https://altcryp.com/faucet/currency/bch";
         clearInterval(redirect);
      }
        if(faucet.includes("/bch")){
        window.location.href = "https://altcryp.com/faucet/currency/dash";
         clearInterval(redirect);
      }
        if(faucet.includes("/dash")){
        window.location.href = "https://altcryp.com/faucet/currency/doge";
         clearInterval(redirect);
      }
        if(faucet.includes("/doge")){
        window.location.href = "https://altcryp.com/faucet/currency/matic";
         clearInterval(redirect);
      }
        if(faucet.includes("/matic")){
        window.location.href = "https://altcryp.com/faucet/currency/sol";
         clearInterval(redirect);
      }
        if(faucet.includes("/sol")){
        window.location.href = "https://altcryp.com/faucet/currency/trx";
         clearInterval(redirect);
      }
        if(faucet.includes("/trx")){
        window.location.href = "https://altcryp.com/faucet/currency/xrp";
         clearInterval(redirect);
      }
        if(faucet.includes("/xrp")){
        window.location.href = "https://altcryp.com/faucet/currency/zec";
         clearInterval(redirect);
      }
        if(faucet.includes("/zec")){
        window.location.href = "https://altcryp.com/faucet/currency/pepe";
         clearInterval(redirect);
      }
        if(faucet.includes("/pepe")){
        window.location.href = "https://altcryp.com/faucet/currency/shib";
         clearInterval(redirect);
      }
        if(faucet.includes("/shib")){
        window.location.href = "https://altcryp.com/faucet/currency/btc";
         clearInterval(redirect);
      }
    }
},500);

setTimeout(function(){window.location.reload();},30000);

