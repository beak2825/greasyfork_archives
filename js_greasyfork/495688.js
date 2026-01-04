// ==UserScript==
// @name         CryptoDrops Bot
// @namespace    cryptodrops.cloud
// @version      2024-05-21.1
// @description  auto claim faucet doge
// @author       Script Bot Dev
// @match        https://cryptodrops.cloud/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495688/CryptoDrops%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/495688/CryptoDrops%20Bot.meta.js
// ==/UserScript==

var Clicked = false;
var BOT = setInterval(function(){

if(document.body.outerText.includes("satoshi was sent to your") === true){
	window.location.reload();
	clearInterval(BOT);
}
if(document.body.outerText.includes("satoshi every minute") === true){
	document.querySelector("#address").value = "ENDEREÇODOGECOIN"; // MUDE SUA CARTEIRA NESTA LINHA
	if(Clicked === false){document.querySelector("body > div.container.flex-grow.my-4 > div.row.my-2 > div.col-12.col-md-8.col-lg-6.order-md-2.mb-4.text-center > form > div:nth-child(4) > button").click();Clicked = true;}
    if(document.querySelector(".g-recaptcha")){
            var recaptcha = document.querySelector("#g-recaptcha-response").value;
               if((recaptcha) && recaptcha > ""){
                document.querySelector("form").submit();
                   clearInterval(BOT);
            }
            }
}
if(document.body.outerText.includes("You have to wait 1 minute") === true){
	setTimeout(function(){window.location.reload();},2000);
	clearInterval(BOT);
}
},500);



