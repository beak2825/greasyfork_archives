// ==UserScript==
// @name         Lucky TRX Crypto Faucet
// @namespace    Claim Free Coin
// @version      1.0
// @description  Claim Free Coin
// @author       lotocamion
// @match        https://lucky-crypto.xyz/*
// @match        https://lucky-crypto.xyz/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lucky-crypto.xyz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467233/Lucky%20TRX%20Crypto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/467233/Lucky%20TRX%20Crypto%20Faucet.meta.js
// ==/UserScript==

// GOTO https://lucky-crypto.xyz/?ref=358 AND SIGNUP
// INSTALL THE SCRIPT AND EDIT LINE 27 AND 28 WITH YOUR USER NAME AND PASSWORD
// THEN GOTO https://lucky-crypto.xyz/ AND LEAVE THE TAB OPEN


(function() {
    'use strict';


   setTimeout(function() {
   if (window.location.href == "https://lucky-crypto.xyz/" || window.location.href == "https://lucky-crypto.xyz") {
   window.location.replace("https://lucky-crypto.xyz/?ref=358")
   }}, 500);

   var youremail = 'YOUR_EMAIL' // EDIT WITH YOUR_EMAIL
   var yourpassword = 'YOUR_PASSWORD' // EDIT WITH YOUR_PASSWORD



   setInterval(function() {
   if (window.location.href == "https://lucky-crypto.xyz/?ref=358"){
   document.querySelector("input[type='password']").value = yourpassword
   document.querySelector("input[type='text']").value = youremail
    document.querySelector("button[type='submit']").click()
   }},5000);

   setTimeout (() => {
   if (document.querySelector("button[class='btn btn-danger btn-md w-100 mt-2']").textContent.includes("Roll & Win")) {
   document.querySelector("button[class='btn btn-danger btn-md w-100 mt-2']").click();
   }}, 5000);

   setInterval(function() {
   if (document.querySelector("div[class='alert alert-success']").textContent.includes("Congratulations")) {
   window.location.replace(window.location.pathname + window.location.search + window.location.hash);
   }}, 5000);

   setInterval(function() {
   window.location.replace(window.location.pathname + window.location.search + window.location.hash);
   }, 120000);
})();