// ==UserScript==
// @name         Tron Instantly Crypto Faucet
// @namespace    Earn Free Tron
// @version      3.0
// @description  Earn Free Tron
// @author       lotocamion
// @run-at       document-end
// @match        https://faucetcripto.xyz/*
// @icon         https://www.google.com/s2/favicons?domain=faucetcripto.xyz
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/439790/Tron%20Instantly%20Crypto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/439790/Tron%20Instantly%20Crypto%20Faucet.meta.js
// ==/UserScript==

    (function() {
    'use strict';
    var clicked = false;
    var address = false;
    setTimeout(function() {
    if(document.querySelector("#id_shortlink > a") ){
    document.querySelector("#id_shortlink > a").click();
    }}, 3000);
    if($('.form-control')) {
    $('.form-control').val("DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1");////EDIT YOUR ADDRESS HERE/////
    address = true;
    }
    setInterval(function() {
    for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
    if(! clicked && document.querySelectorAll("iframe")[hc] &&
    document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response") &&
    document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0) {
    $('.btn.btn-primary.btn-lg.claim-button').click();
    clicked = true;
    }
    }}, 3000);
    var site = "https://tinyurl.com/y8cd5yuh"
    setTimeout(function() {
    if (document.querySelector("body > div.container-fluid > div:nth-child(2) > div.col-xs-12.col-md-6.col-md-push-3 > div")) {
    window.location.href = site
    }}, 3000);
    setTimeout(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 2*150000);
    })();