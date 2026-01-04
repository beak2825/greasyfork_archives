// ==UserScript==
// @name         Earndoge  faucet
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Claim Free Doge
// @author       Wagner 0011
// @match        https://earndoge.xyz/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/454788/Earndoge%20%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/454788/Earndoge%20%20faucet.meta.js
// ==/UserScript==



(function() {
    'use strict';

    //click on claim button
    setInterval(function() {
    if (window.grecaptcha.getResponse().length > 0) {
    document.querySelector(".btn.btn-primary").click();
    }}, 3000);
       //click on firewall
    setInterval(function() {
    if (window.grecaptcha.getResponse().length > 0) {
    document.querySelector("#claim").click();
    }}, 3000);
    //redirect to faucet
    setTimeout (() => {
    if ( document.URL =="https://earndoge.xyz/dashboard")
    { window.location.replace("https://earndoge.xyz/faucet");
    }},10000)
    //redirect to rollfaucet
    setInterval(function() {
     if (document.querySelector("#layout-wrapper > div.main-content > div > div.container-fluid > div.row.h-100 > div:nth-child(4) > div > div > div > div.flex-grow-1.ms-3 > h4").innerText == "0") {
     window.location.replace("https://earndoge.xyz/rollfaucet");
     }}, 3000);


})();