// ==UserScript==
// @name         AdFreeway2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       You
// @match        *://adfreeway.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adfreeway.com
// @grant        none
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/469685/AdFreeway2.user.js
// @updateURL https://update.greasyfork.org/scripts/469685/AdFreeway2.meta.js
// ==/UserScript==

(async function() {
    'use strict';
window.NInteiro = 0;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function getRandomInt(max) {
return Math.floor(Math.random() * max);
}
window.BotRandom = function(int){
var EscolhaRand = getRandomInt(3);

if(EscolhaRand == 1){
try {document.getElementsByClassName("left-btn-form")[int].getElementsByTagName("input")[2].click()} catch(err){}
}
if(EscolhaRand == 2){
try {document.getElementsByClassName("right-btn-form")[int].getElementsByTagName("input")[2].click()} catch(err){}
}
}
window.BotStart= async function() {
if ( window.location.host == 'adfreeway.com' && window.location.pathname=='/myaccount/content'){
BotRandom(window.NInteiro);
await sleep(500);
window.NInteiro=window.NInteiro +1
BotRandom(window.NInteiro);
await sleep(500);
window.NInteiro=window.NInteiro +1
BotRandom(window.NInteiro);
await sleep(500);
window.NInteiro=window.NInteiro +1
BotRandom(window.NInteiro);
await sleep(500);
window.NInteiro=window.NInteiro +1
BotRandom(window.NInteiro);
await sleep(500);
window.NInteiro=window.NInteiro +1
window.scrollTo(0, document.body.scrollHeight);



}
}

window.StartBot=function(){
   document.title = "BOT"
try {document.getElementsByClassName("alert alert-success")[0].innerText= "Bot Ativado Com Sucesso\nAproveite :)\n"} catch(err){}
try {
 var img = document.querySelector(".nav-logo");
 img.setAttribute('src', 'https://habbofont.net/font/hc_compact/bot+ativado.gif');
} catch(err){}
try {
 var img2 = document.querySelector(".left-nav-logo");
 img2.setAttribute('src', 'https://habbofont.net/font/hc_compact/bot+ativado.gif');
} catch(err){}
try {
 var img3 = document.querySelector("body > div.container-fluid.member-font > div > div.col-sm-12.col-lg-10.offset-lg-2.right-content.align-self-center > div.my-container > div:nth-child(6) > div.social-logo > img");
 img3.setAttribute('src', 'https://habbofont.net/font/hc_compact/bot+ativado.gif');
} catch(err){}

setInterval(BotStart, 10000);

}

window.onload = function () {
StartBot();
}

object.addEventListener("load", StartBot);

})();