// ==UserScript==
// @name          Earndoge  faucet
// @namespace    http://tampermonkey.net/
// @version        1.0
// @description    Claim Free Doge
// @author        Wagner
// @match        https://earndoge.xyz/*
// @connect      earndoge.xyz
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earndoge.xyz
// @run-at          document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456972/Earndoge%20%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/456972/Earndoge%20%20faucet.meta.js
// ==/UserScript==



(function() {
    'use strict';

   
    var clicked = false;
    var click = setInterval(function() {
    if (window.grecaptcha.getResponse().length > 0) {
    document.querySelector(".btn.btn-primary").click();
    clicked = true;
    clearInterval(click);
    }}, 5000);

    
    var click2 = setInterval(function() {
    if(document.querySelector("#claim")){
    document.querySelector("#claim").click();
     clicked = true;
    clearInterval(click2);
    }}, 8000);

       
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

     setInterval(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 65000);
})();