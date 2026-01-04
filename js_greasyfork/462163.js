// ==UserScript==
// @name         Manual Faucets : Auto Claim & Auto Login (NOT PAYING)
// @namespace    manual.faucets.auto.claim
// @version      1.3
// @description  Auto Claims Manual Faucets.
// @author       stealtosvra
// @include /^(https?:\/\/)(.+)?(cempakajaya|claimprocoin|djfaucet|euquerodinheiro|faucetake|manofadan|soltoshindo)(\.com(\/.*)/
// @match        https://btc25.org/*
// @match        https://feyorra.site/*
// @match        https://freecc.click/*
// @match        https://magic4ever.eu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=djfaucet.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462163/Manual%20Faucets%20%3A%20Auto%20Claim%20%20Auto%20Login%20%28NOT%20PAYING%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462163/Manual%20Faucets%20%3A%20Auto%20Claim%20%20Auto%20Login%20%28NOT%20PAYING%29.meta.js
// ==/UserScript==

(function() {

    'use strict';

    // INSERT YOUR CREDENTIALS
    const email = "email@gmail.com";
    const password = "123";

    const website = window.location.hostname;
    const domainParts = website.split(".");
    const tld = domainParts.pop();
    const domain = domainParts.pop();
    const key = `${domain}.${tld}`.replace(/^www\./, "");

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

    if(window.location.pathname === '/' && window.location.search === '') {window.location.replace(`https://${key}/login`);
    if(document.querySelector('input[type="email"]')) {document.querySelector('input[type="email"]').value = email;}
    if(document.querySelector('input[type="password"]')) {document.querySelector('input[type="password"]').value = password;}setInterval(function() { if (hCaptcha()) {document.querySelector('button.btn.btn-primary.btn-block.btn-md').click();}}, 3000);}
    if(window.location.href.includes(`https://${key}/dashboard`)) {window.location.replace(`https://${key}/claim`);}
    if(window.location.href.includes(`https://${key}/claim`) || window.location.href.includes(`https://${key}/firewall`)) {setInterval(function() {if (hCaptcha()) {if (document.querySelector("button[type='submit']")) { document.querySelector("button[type='submit']").click();}}}, 6000);}
    if(window.location.href === `https://soltoshindo.com/claim`) {setInterval(function() {if (document.querySelector("button[type='submit']")) {document.querySelector("button[type='submit']").click();}}, 10000)}

   if (window.location.href === "https://btc25.org/claim") {
  setTimeout(function() {
    var button = document.querySelector("button.btn.btn-primary"); // Replace "button" with the appropriate selector for the button you want to click
    if (button) {
      button.click();
    }
  }, 10000); // 10 seconds in milliseconds
}

})();