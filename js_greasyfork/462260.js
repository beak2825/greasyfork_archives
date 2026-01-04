// ==UserScript==
// @name         topfaucet.click : Auto Faucet (NOT PAYING)
// @namespace    topfaucet.click.auto.faucet
// @version      1.2
// @description  https://ouo.io/NrKl5U
// @author       stealtosvra
// @match        https://topfaucet.click/*
// @icon         https://topfaucet.click/Images/Logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462260/topfaucetclick%20%3A%20Auto%20Faucet%20%28NOT%20PAYING%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462260/topfaucetclick%20%3A%20Auto%20Faucet%20%28NOT%20PAYING%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

    setInterval(function() {if (hCaptcha()) {
            document.querySelectorAll("button[type='button']")[1].click();}}, 5000);

})();