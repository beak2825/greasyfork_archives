// ==UserScript==
// @name         Blockzone : Auto Faucet
// @namespace    block.zone.auto.faucet
// @version      1.1
// @description  https://ouo.io/toX930
// @author       stealtosvra
// @match        https://blockzone.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=blockzone.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466087/Blockzone%20%3A%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/466087/Blockzone%20%3A%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const urls = ['https://ouo.io/VlhZfV'];

    const randomIndex = Math.floor(Math.random() * urls.length);
    const randomUrl = urls[randomIndex];

    function reloadPage() {window.location.href = randomUrl;}setTimeout(reloadPage, 300000);

    function hCaptcha() {return grecaptcha && grecaptcha.getResponse().length !== 0;}

    setInterval(function() {
        if (hCaptcha()){
            document.querySelector('button[type="submit"]').click();}
    }, 3000);

})();