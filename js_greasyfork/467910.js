// ==UserScript==
// @name         BTC Cryptofaucetflow Faucet Autologin
// @namespace    Claim Free BTC
// @version      2.0
// @description  Claim Free BTC
// @author       lotocamion
// @match        https://cryptofaucetflow.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cryptofaucetflow.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467910/BTC%20Cryptofaucetflow%20Faucet%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/467910/BTC%20Cryptofaucetflow%20Faucet%20Autologin.meta.js
// ==/UserScript==


//REGISTER TO  https://cryptofaucetflow.com/ref/lotocamion
//INSTALL THE SCRIPT AND EDIT LINE 21 AND 22 WITH YOUR USER NAME AND PASSWORD
//THEN  GOTO https://cryptofaucetflow.com/ref/lotocamion AND LEAVE THE TAB OPEN

(function() {
    'use strict';


   var username = "YOUR_USERNAME";// EDIT WITH YOUR USER NAME
   var password = "YOUR_PASSWORD";// EDIT WITH YOUR PASSWORD


    setTimeout(function() {
   if (window.location.href == "https://cryptofaucetflow.com" || window.location.href == "https://cryptofaucetflow.com/") {
   window.location.replace("https://cryptofaucetflow.com/ref/lotocamion")
   }}, 500);

   setTimeout(function() {
   if (window.location.href == "https://cryptofaucetflow.com/ref/lotocamion") {
   document.querySelector("ul[class='navbar-nav ms-auto mb-2 mb-lg-0'] li:nth-child(2) a:nth-child(1)").click();
   } }, 3000);

   setTimeout(function() {
   if (window.location.href == ("https://cryptofaucetflow.com/account")){
   window.location.replace("https://cryptofaucetflow.com/faucet")
   }}, 5000);

   setInterval(function() {
   if(grecaptcha && grecaptcha.getResponse().length > 0 || document.querySelector(".g-recaptcha").getAttribute("value").length > 0){
   document.querySelector("#password").value = password
   document.querySelector("#username").value = username
   document.querySelector("button[type='submit']").click()
   }},5000);


   setTimeout(function() {
   if (window.location.href == ("https://cryptofaucetflow.com/")){
   document.querySelector("ul[class='navbar-nav ms-auto mb-2 mb-lg-0'] li:nth-child(2) a:nth-child(1)").click()
   }}, 10000);

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
   if(grecaptcha && grecaptcha.getResponse().length > 0 || document.querySelector(".g-recaptcha").getAttribute("value").length > 0){
   document.querySelector("button[type='submit']").click()
   }},5000);

   setInterval(function() {
   window.location.replace(window.location.pathname + window.location.search + window.location.hash);
   }, 120000);
})();