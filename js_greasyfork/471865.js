// ==UserScript==
// @name         Waterfall Money : Auto Faucet
// @namespace    waterfall.money.faucet
// @version      1.1
// @description  Made in Trinidad - https://ouo.io/i5xxMs9
// @author       stealtosvra
// @match        https://waterfall.money/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waterfall.money
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471865/Waterfall%20Money%20%3A%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/471865/Waterfall%20Money%20%3A%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}
    setInterval(() => {if (hCaptcha()) {if (document.querySelector("button[type='submit']")) {document.querySelector("button[type='submit']").click();}}}, 5000);
    function refreshPage() {window.location.reload();}setInterval(refreshPage, 630000);

})();