// ==UserScript==
// @name         🎁Free Unlimited Dogecoin Faucet 4.0🎁
// @namespace    Claim Unlimited Dogecoin
// @version      4.0
// @description  Claim Unlimited Dogecoin
// @author       lotocamion
// @match        https://iqfaucet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iqfaucet.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @run-at        document-start
// @match        *://*/recaptcha/*
// @connect      google.com
// @connect      engageub.pythonanywhere.com
// @connect      engageub1.pythonanywhere.com
// @downloadURL https://update.greasyfork.org/scripts/440813/%F0%9F%8E%81Free%20Unlimited%20Dogecoin%20Faucet%2040%F0%9F%8E%81.user.js
// @updateURL https://update.greasyfork.org/scripts/440813/%F0%9F%8E%81Free%20Unlimited%20Dogecoin%20Faucet%2040%F0%9F%8E%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clicked = false;
    var address = false;

    if($('.form-control')) {
    $('.form-control').val("DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1");////EDIT YOUR ADDRESS HERE/////
    address = true;
    }
    setTimeout(function() {
    if($('.btn.btn-primary') && (address == true)) {
    $('.btn.btn-primary').click();
    } }, 3000);
    setTimeout(function() {
    if($('.btn.btn-success.btn-lg')) {
    $('.btn.btn-success.btn-lg').click();
    } }, 1000);
    setInterval(function(){
    if(!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0){
    document.getElementsByClassName("btn btn-success")[0].click();
    } }, 3000);
    setTimeout(function() {
    if (document.getElementsByClassName("alert alert-success")[0]) {
    window.location.replace("https://iqfaucet.com?ref=403036");
    }}, 3000);
    setTimeout(function() {
    if(document.querySelector("body > div:nth-child(3) > div.col-md-6 > div > div.alert.alert-danger")){
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    } }, 5000);
    setInterval(function() {
    if(document.querySelector("#reset-button")){
    document.querySelector("#reset-button").click();
    } }, 3000);
    setInterval(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 40000);
    })();

