// ==UserScript==
// @name         AdFreeway
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       You
// @match        *://adfreeway.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=adfreeway.com
// @grant        none
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/469684/AdFreeway.user.js
// @updateURL https://update.greasyfork.org/scripts/469684/AdFreeway.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.focus();
window.BotStart= function() {
if ( window.location.host == 'adfreeway.com' && window.location.pathname=='/myaccount/content'){
try {document.getElementsByClassName("left-btn-form")[0].getElementsByTagName("input")[2].click()} catch(err){}
try {document.getElementsByClassName("right-btn-form")[1].getElementsByTagName("input")[2].click()} catch(err){}
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

setTimeout(BotStart, 10000);
function ReloadWeb() {
if ( window.location.host == 'adfreeway.com' && window.location.pathname=='/myaccount/content'){
window.location.reload()
}
}
setTimeout(ReloadWeb, 15000);
}

window.onload = function () {
StartBot();
}

object.addEventListener("load", StartBot);

})();

