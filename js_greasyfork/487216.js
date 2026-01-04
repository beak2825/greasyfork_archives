// ==UserScript==
// @name         Auto Clicker for Bitcoin private keys / wallets on privatekeys.app
// @name:es      Auto Clicker para generar direcciones de Bitcoin / llaves privadas en privatekeys.app
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Simple script that clicks the random page button until it finds active wallets on the body of the site then stops.
// @description:es Script simple que hace clic automáticamente en generar billeteras aleatorias hasta encontrar billeteras activas.
// @author       donobon
// @match        https://privatekeys.app/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487216/Auto%20Clicker%20for%20Bitcoin%20private%20keys%20%20wallets%20on%20privatekeysapp.user.js
// @updateURL https://update.greasyfork.org/scripts/487216/Auto%20Clicker%20for%20Bitcoin%20private%20keys%20%20wallets%20on%20privatekeysapp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Auto Clicker script initiated');

    let lastClickTime = 0;

    function clickButton() {
        const now = Date.now();

        if (now - lastClickTime >= 2500) {
            const button = document.querySelector('[aria-label="Random page"]');
            if (button) {
                button.click();
                lastClickTime = now;
            }
        }
    }

    function checkForAPIResponseAndStopCondition(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const apiResponse = document.querySelector('span.text-green-500');
                if (apiResponse && apiResponse.innerText.includes('200 OK')) {
                    setTimeout(() => {
                        if (!document.body.innerText.includes("Active Wallets Found")) {
                            clickButton();
                        } else {
                            console.log('Active Wallets Found - Stopping clicks');

                            setTimeout(() => {
                                if (!document.body.innerText.includes("Active Wallets Found")) {
                                    clickButton();
                                } else {
                                    observer.disconnect();
                                }
                            }, 5000);
                        }
                    }, 1500);
                }
            }
        }
    }

    const observer = new MutationObserver(checkForAPIResponseAndStopCondition);
    observer.observe(document.body, { childList: true, subtree: true });
})();