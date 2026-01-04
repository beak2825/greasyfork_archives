// ==UserScript==
// @name         BTC converter world Autologin Faucet
// @namespace    Claim Free BTC
// @version      2.0
// @description  Claim Free BTC
// @author       lotocamion
// @match        https://converter-btc.world/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=converter-btc.world
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467235/BTC%20converter%20world%20Autologin%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/467235/BTC%20converter%20world%20Autologin%20Faucet.meta.js
// ==/UserScript==


//REGISTER TO  https://converter-btc.world/ref/lotocamion
//INSTALL THE SCRIPT AND HCAPTCHA SOLVER AND EDIT LINE 21 AND 22 WITH YOUR USER NAME AND PASSWORD
//THEN  GOTO https://converter-btc.world/faucet AND LEAVE THE TAB OPEN

(function() {
    'use strict';
   var clicked = false;

   var username = "YOUR_USERNAME";// YOUR USER NAME
   var password = "YOUR_PASSWORD";// YOUR PASSWORD


   setTimeout(function() {
   if (window.location.href == "https://converter-btc.world/" || window.location.href == "https://converter-btc.world") {
   window.location.replace("https://converter-btc.world/ref/lotocamion")
   }}, 500);

   setTimeout(function() {
   if (window.location.href == "https://converter-btc.world/ref/lotocamion") {
   document.querySelector("p[align='center'] a:nth-child(2)").click();
   } }, 3000);



   setInterval(function() {
   if ((window.location.href.includes("login")) && grecaptcha && grecaptcha.getResponse().length > 0 || window.location.href.includes("account") || (document.querySelector('.cf-turnstile > input') && document.querySelector('.cf-turnstile > input').value.length > 0) || document.querySelector(".g-recaptcha").getAttribute("value").length > 0){
   document.querySelector("#password").value = password
   document.querySelector("#username").value = username
   document.querySelector("button[type='submit']").click()
   }},5000);

   setTimeout(function() {
   if (window.location.href == ("https://converter-btc.world/account")){
   window.location.replace("https://converter-btc.world/faucet")
   }}, 5000);

   setTimeout(function() {
   if (window.location.href == ("https://converter-btc.world/")){
   window.location.replace("https://converter-btc.world/login")
   }}, 5000);

   setTimeout(function(){
   if(document.querySelector(".text")){
   document.querySelector(".text").click();
   }}, 5000);

   let claim = setInterval(function() {
   if(document.querySelector(".btn.btn-primary.btn-lg")){
   document.querySelector(".btn.btn-primary.btn-lg").click()
   clearInterval(claim)
   }},5000);

   setInterval(function() {
   if(document.querySelector(".mx-auto.fs-3").innerText.includes("Claim again in") && document.querySelector("#clock").innerText.includes("00:00:00")){
   window.location.replace(window.location.pathname + window.location.search + window.location.hash);
   }}, 3000);

   setInterval(function() {
   if ((window.location.href.includes("faucet")) && grecaptcha && grecaptcha.getResponse().length > 0 || (document.querySelector('.cf-turnstile > input') && document.querySelector('.cf-turnstile > input').value.length > 0)|| document.querySelector(".g-recaptcha").getAttribute("value").length > 0){
   document.querySelector("button[type='submit']").click()
   }},5000);

   setInterval(function() {
   window.location.replace(window.location.pathname + window.location.search + window.location.hash);
   }, 120000);
})();