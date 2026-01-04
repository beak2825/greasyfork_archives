// ==UserScript==
// @name         Koiniom auto faucet
// @namespace    Terminator.Scripts
// @version      0.1
// @description  Automatic faucet
// @author       TERMINATOR
// @license      MIT
// @match        https://koiniom.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=koiniom.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481700/Koiniom%20auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/481700/Koiniom%20auto%20faucet.meta.js
// ==/UserScript==


// It is necessary to have a shortlink solver with cuty.net support to work properly
// Script only works on faucet


(function() {
    'use strict';
    function clickClaimButton() {
        var claimForm = document.getElementById('form-claim');
        if (claimForm) {
            claimForm.submit();
        } else {
            console.log("Button not found")
        }
    }
    if (window.location.href === 'https://www.koiniom.com/faucet') {
        clickClaimButton();
        setInterval(function() {
            clickClaimButton();
        }, 30000);
    } else if (window.location.href === 'https://koiniom.com/faucet') {
        clickClaimButton();
        setInterval(function() {
            clickClaimButton();
        }, 30000);
    } else if (window.location.href === 'https://koiniom.com/faucet/*') {
        clickClaimButton();
        setInterval(function() {
            clickClaimButton();
        }, 30000);
    }
})();