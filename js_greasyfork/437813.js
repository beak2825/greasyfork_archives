// ==UserScript==
// @name         Ữnlimited Dogecoin FaucЄt
// @version      1.6
// @description  Free Unlimited Dogecoin
// @author       lotocamion
// @match        https://faucet.dogpay.ml/*
// @match        https://dogpay.ml/*
// @icon         https://www.google.com/s2/favicons?domain=dogpay.ml
// @grant        none
// @namespace Free Unlimited Dogecoin
// @downloadURL https://update.greasyfork.org/scripts/437813/%E1%BB%AEnlimited%20Dogecoin%20Fauc%D0%84t.user.js
// @updateURL https://update.greasyfork.org/scripts/437813/%E1%BB%AEnlimited%20Dogecoin%20Fauc%D0%84t.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clicked = false;
    setInterval(function() {
    if (!clicked && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
    } else if (window.grecaptcha.getResponse().length > 0) {
    document.getElementsByClassName("btn btn-primary btn-block")[0].click();
    clicked = true;
    }
    }, 12000);
    })();