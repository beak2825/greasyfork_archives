// ==UserScript==
// @name         Free Faucet Biz
// @namespace    Claim Free BTC
// @version      1.2
// @description  Claim Free BTC
// @author       lotocamion
// @match        https://freefaucet.biz/*
// @match        https://freefaucet.biz/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freefaucet.biz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456963/Free%20Faucet%20Biz.user.js
// @updateURL https://update.greasyfork.org/scripts/456963/Free%20Faucet%20Biz.meta.js
// ==/UserScript==



//GOTO https://freefaucet.biz/?ref=101268 AND SIGNUP
//INSTALL RECAPTCHA SOLVER LINK => https://pastebin.com/n6sYgWzH
//THEN GOTO https://freefaucet.biz/ AND LEAVE THE TAB OPEN



(function() {
    'use strict';

    var click =setInterval(function() {
    if (window.grecaptcha.getResponse().length > 0) {
    document.querySelector("button[class='btn btn-danger btn-md w-100 mt-2']").click();
    clearInterval(click);
    }
    }, 5000);

    setInterval(function() {
    if(document.querySelector(".alert.alert-success")) {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }}, 5000);

    setInterval(function() {
    window.location.replace(window.location.pathname + window.location.search + window.location.hash);
    }, 90000);



})();