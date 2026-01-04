// ==UserScript==
// @name         Free BTC [BITCOIN] FAUCET WITH AUTOLOGIN
// @namespace    Claim free Bitcoin
// @version      4.0
// @description  Claim free Bitcoin
// @author       lotocamion
// @match        https://cryptowin.io/
// @match        https://cryptowin.io/*
// @icon         https://www.google.com/s2/favicons?domain=cryptowin.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438602/Free%20BTC%20%5BBITCOIN%5D%20FAUCET%20WITH%20AUTOLOGIN.user.js
// @updateURL https://update.greasyfork.org/scripts/438602/Free%20BTC%20%5BBITCOIN%5D%20FAUCET%20WITH%20AUTOLOGIN.meta.js
// ==/UserScript==


//REGISTER TO  https://cryptowin.io/ref/lotocamion
//INSTALL THE SCRIPT AND HCAPTCHA SOLVER AND EDIT LINE 22 AND 23 WITH YOUR USER NAME AND PASSWORD
//THEN  GOTO https://cryptowin.io/faucet AND LEAVE THE TAB OPEN

(function() {
    'use strict';
   var clicked = false;

   var username = "YOUR_USERNAME";////EDIT WITH YOUR USER NAME////
    var password = "YOUR_PASSWORD";////EDIT WITH YOUR PASSWORD////

   setTimeout(function() {
   if (window.location.href == "https://cryptowin.io/" || window.location.href == "https://cryptowin.io") {
   window.location.replace("https://cryptowin.io/ref/lotocamion")
   }}, 500);

   setTimeout(function() {
   if (window.location.href == "https://cryptowin.io/ref/lotocamion") {
  document.querySelector("li[class='login-button'] a").click();
   } }, 3000);



   setInterval(function() {
   if ((window.location.href.includes("login")) && grecaptcha && grecaptcha.getResponse().length > 0 || window.location.href.includes("account") || (document.querySelector('.cf-turnstile > input') && document.querySelector('.cf-turnstile > input').value.length > 0) || document.querySelector(".g-recaptcha").getAttribute("value").length > 0){
   document.querySelector("#password").value = password
   document.querySelector("#username").value = username
   document.querySelector("button[type='submit']").click()
   }},5000);

   setTimeout(function() {
   if (window.location.href == ("https://cryptowin.io/account")){
   window.location.replace("https://cryptowin.io/faucet")
   }}, 5000);

   setTimeout(function() {
   if (window.location.href == ("https://cryptowin.io/")){
   window.location.replace("https://cryptowin.io/login")
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