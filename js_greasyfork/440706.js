// ==UserScript==
// @name         🎁Tron Faucet🎁Zero Timer🎁
// @namespace    Claim Free Tron
// @version      2.0
// @description  Claim Free Tron
// @author       lotocamion
// @match        https://trx.haseebfaucet.xyz/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=haseebfaucet.xyz
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/440706/%F0%9F%8E%81Tron%20Faucet%F0%9F%8E%81Zero%20Timer%F0%9F%8E%81.user.js
// @updateURL https://update.greasyfork.org/scripts/440706/%F0%9F%8E%81Tron%20Faucet%F0%9F%8E%81Zero%20Timer%F0%9F%8E%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
     var clicked = false;
     var address = false;
    if($('.form-control')) {
    $(".form-control").val("DGNRvwyYSMYKjxFDm8BHTcD23kWesLg5i1");////EDIT YOUR ADDRESS HERE/////
    address = true;
    }
    setInterval(function() {
    if(!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0){
    $('.btn.btn-primary.btn-lg.claim-button').click();
    }
    }, 8000);
    setInterval(function() {
    if (document.querySelector("body > div.container-fluid > div:nth-child(2) > div.col-xs-12.col-md-6.col-md-push-3.bg-primary > div.alert.alert-success")) {
    window.location.replace("https://tinyurl.com/yb4rco9v");
    }
    }, 2000);
    setTimeout(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 65000);
    })();