// ==UserScript==
// @name         🎁Free Unlimited BITCOIN Faucet🎁
// @namespace    Claim Free BTC [Every 5 Min]
// @version      1.0
// @description  Claim Free BTC [Every 5 Min]
// @author       lotocamion
// @match        https://iqfaucet.com/btc/verify.php
// @match        https://iqfaucet.com/btc/index.php?c=1
// @match        https://iqfaucet.com/btc/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iqfaucet.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @run-at       document-end
// @match        *://*/recaptcha/*
// @connect      engageub.pythonanywhere.com
// @connect      engageub1.pythonanywhere.com
// @downloadURL https://update.greasyfork.org/scripts/440846/%F0%9F%8E%81Free%20Unlimited%20BITCOIN%20Faucet%F0%9F%8E%81.user.js
// @updateURL https://update.greasyfork.org/scripts/440846/%F0%9F%8E%81Free%20Unlimited%20BITCOIN%20Faucet%F0%9F%8E%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clicked = false;
    var address = false;
    if($('.form-control')) {
    $('.form-control').val("122ES9zQJm8FTqczfYM2P4ZRK5pQEcfCj4");////EDIT YOUR ADDRESS HERE/////
    address = true;
    }
    if($('.btn.btn-primary') && (address == true)) {
    $('.btn.btn-primary').click();
    }
    setTimeout(function() {
    if($('.btn.btn-success.btn-lg')) {
    $('.btn.btn-success.btn-lg').click();
    }}, 3000);
    setInterval(function(){
    if(!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0){
    document.getElementsByClassName("btn btn-success")[0].click();
    }}, 3000);
    setTimeout(function() {
    if(document.querySelector("body > div:nth-child(3) > div.col-md-6 > div > div:nth-child(7)")) {
    document.querySelector("body > nav > div > div.navbar-header > a").click();
    }}, 3000);
    setTimeout(function() {
    if(document.querySelector("body > div:nth-child(3) > div.col-md-6 > div > div.alert.alert-danger")){
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }}, 3000);
    setInterval(function() {
    if(document.querySelector("#reset-button")){
    document.querySelector("#reset-button").click();
    }}, 3000);
    setTimeout(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 150000);
})();