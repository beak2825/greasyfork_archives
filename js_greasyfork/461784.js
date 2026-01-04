// ==UserScript==
// @name         sato.host : Auto Faucet
// @namespace    sato.host.auto.faucet
// @version      1.1
// @description  https://ouo.io/gzmiqK
// @author       stealtosvra
// @match        https://sato.host/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sato.host
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461784/satohost%20%3A%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/461784/satohost%20%3A%20Auto%20Faucet.meta.js
// ==/UserScript==

(function() {

    'use strict';

    function clickClaimButton() {if (document.querySelector('input.btn')) {document.querySelector('input.btn').click();}}

    setTimeout(clickClaimButton, 60000);
    setTimeout(function() {location.reload();}, 70 * 1000);

})();