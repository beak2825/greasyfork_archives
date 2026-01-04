// ==UserScript==
// @name         BTC Agrofaucet WITH AUTOLOGIN 
// @namespace    Claim Free BTC
// @version      1.0
// @description  Claim Free BTC
// @author       lotocamion
// @match        https://agrofaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agrofaucet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467234/BTC%20Agrofaucet%20WITH%20AUTOLOGIN.user.js
// @updateURL https://update.greasyfork.org/scripts/467234/BTC%20Agrofaucet%20WITH%20AUTOLOGIN.meta.js
// ==/UserScript==


//REGISTER TO  https://agrofaucet.com/ref/lotocamion
//INSTALL THE SCRIPT AND HCAPTCHA SOLVER AND EDIT LINE 21 AND 22 WITH YOUR USER NAME AND PASSWORD
//THEN  GOTO https://converter-btc.world/faucet AND LEAVE THE TAB OPEN

(function() {
    'use strict';
   var clicked = false;

   var username = "YOUR_USER_NAME";// EDIT WITH YOUR USER NAME
   var password = "YOUR_PASSWORD";// EDIT WITH YOUR PASSWORD


   setTimeout(function() {
   if (window.location.href == "https://agrofaucet.com" || window.location.href == "https://agrofaucet.com/") {
   window.location.replace("https://agrofaucet.com/ref/lotocamion")
   }}, 500);

   setTimeout(function() {
   if (window.location.href == "https://agrofaucet.com/ref/lotocamion") {
   document.querySelector(".nav-link.btn.btn-warning").click();
   } }, 3000);



   setInterval(function() {
   if ((window.location.href.includes("login")) && grecaptcha && grecaptcha.getResponse().length > 0 || window.location.href.includes("account") || (document.querySelector('.cf-turnstile > input') && document.querySelector('.cf-turnstile > input').value.length > 0) || document.querySelector(".g-recaptcha").getAttribute("value").length > 0){
   document.querySelector("#password").value = password
   document.querySelector("#username").value = username
   document.querySelector("button[type='submit']").click()
   }},5000);

   setTimeout(function() {
   if (window.location.href == ("https://agrofaucet.com/account")){
   window.location.replace("https://agrofaucet.com/faucet")
   }}, 5000);

   setTimeout(function() {
   if (window.location.href == ("https://agrofaucet.com/")){
   window.location.replace("https://agrofaucet.com/login")
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
   //if(!clicked && grecaptcha && grecaptcha.getResponse().length > 0 || document.querySelector(".g-recaptcha").getAttribute("value").length > 0 && document.querySelector("button[name='claim']").innerText.includes("Claim reward")) { //&& document.querySelector("#view").innerText.includes("successfully")
   //document.querySelector("button[name='claim']").click()
    document.querySelector("button[type='submit']").click()
   }},5000);

   setInterval(function() {
   window.location.replace(window.location.pathname + window.location.search + window.location.hash);
   }, 120000);
})();