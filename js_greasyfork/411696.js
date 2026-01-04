// ==UserScript==
// @name         Redeem Bitsler (GRAB FREE MONEY EVER 5 MINUTES)
// @description  Claims bonus at Bitsler .com every 5 minutes (Platinlevel required)
// @description  Open https://www.bitsler.com/en/vip-program/nitro in new tab and keep it running
// @description  Claim more free money in Crypto with my other scripts : )
// @description  https://greasyfork.org/de/scripts/410211-000-12-page-multi-faucet-roller/code
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @version      1.5
// @match        https://www.bitsler.com/*
// @match        https://example.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @match        https://www.google.com/recaptcha/api2*
// @match        https://www.google.com/recaptcha/api2/bframe*
// @include      /^https?://www\.google\.com/recaptcha/api2/anchor.*$/
// @require      http://code.jquery.com/jquery-latest.js
// @grant        unsafeWindow
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/411696/Redeem%20Bitsler%20%28GRAB%20FREE%20MONEY%20EVER%205%20MINUTES%29.user.js
// @updateURL https://update.greasyfork.org/scripts/411696/Redeem%20Bitsler%20%28GRAB%20FREE%20MONEY%20EVER%205%20MINUTES%29.meta.js
// ==/UserScript==
(function(){
(function freebitco(){
if (window.location.href == 'https://www.bitsler.com/'){
window.location.replace('https://www.bitsler.com/en/vip-program/nitro');
var elem = document.getElementById("chat");
elem.parentElement.removeChild(elem);}
document.head.appendChild(document.createElement("STYLE")).innerHTML = '*{transition:none!important}';
setTimeout(function(){console.log("step1");$("#rc-anchor-container").click();},45000);})();
var rollInterval = setInterval(function(){
var resp = unsafeWindow.grecaptcha.getResponse();
if(resp.length > 0){
setTimeout(function(){unsafeWindow.document.getElementsByClassName("btn btn-primary")[0].click();},rand(2000,3000));
clearInterval(rollInterval);
return;}},1000);
var loc = location.toString();})();
function rand(min, max){return Math.floor(Math.random() * (max - min + 1) + min);}

setInterval(function(){
window.location.replace('https://www.bitsler.com/en/vip-program/nitro');
}, 60000*5);