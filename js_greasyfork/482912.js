// ==UserScript==
// @name         Auto Faucet [earnviv.com]
// @namespace    Terminator.Scripts
// @version      0.2-firewall_fix
// @description  Automation of earnviv.com
// @author       TERMINATOR
// @license      MIT
// @match        https://earnviv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earnviv.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482912/Auto%20Faucet%20%5Bearnvivcom%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/482912/Auto%20Faucet%20%5Bearnvivcom%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickClaimButton() {
        var claimButton = document.querySelector('.claim-button');
        if (claimButton) {
            claimButton.click();
        }
    }
    function checkAndClick() {
        var url = window.location.href;
        if (url.includes('earnviv.com/faucet')) {
            clickClaimButton();
        } else if (url.includes('earnviv.com/dashboard')) {
            window.location.href = 'https://earnviv.com/faucet';
        } else if (url.includes('earnviv.com/firewall')) {
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.addedNodes.length > 0) {
                        clickUnlockButton();
                    }
                });
            });
            var buttonContainer = document.querySelector('.button-container');
            if (buttonContainer) {
                observer.observe(buttonContainer, { childList: true });
            } else {
                clickUnlockButton();
            }
        }
    }
    function clickUnlockButton() {
        var unlockButton = document.querySelector('.btn.btn-primary.btn-lg.w-md');
        if (unlockButton) {
            setTimeout(() => {
                unlockButton.click();
            }, 10000);
        }
    }
    checkAndClick();
    setInterval(checkAndClick, 20000);
})();
