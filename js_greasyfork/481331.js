// ==UserScript==
// @name         Auto Reinvest [earnfreebitco.com]
// @namespace    Terminator.Scripts
// @version      0.2/2
// @description  Automatic reinvestment old virtualmine.pro
// @author       TERMINATOR
// @license      MIT
// @match        https://earnfreebitco.com/account
// @match        https://earnfreeusdt.com/account
// @match        https://earnfreedoge.com/account
// @match        https://earnfreetrx.com/account
// @match        https://earnfreebnb.com/account
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earnfreebitco.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481331/Auto%20Reinvest%20%5Bearnfreebitcocom%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/481331/Auto%20Reinvest%20%5Bearnfreebitcocom%5D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const targetBalance = 0.01; // Current value $
    const check_interval = 5; // 5 minutes

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const performReinvest = async () => {
        const reinvestButton = document.querySelector('button[data-target="#reinvestModal"]');
        if (reinvestButton) {
            reinvestButton.click();
            await sleep(2000);
            const minLink = document.querySelector('a[href="#reinvestMax"]');
            if (minLink) {
                minLink.click();
                await sleep(5000);
                const reinvestNowButton = document.querySelector('button[type="submit"]');
                if (reinvestNowButton) {
                    reinvestNowButton.click();
                }
            }
        }
    };
    const watchBalanceAndReinvest = async () => {
        const miningBalanceElement = document.getElementById('fiatBalance');
        if (miningBalanceElement) {
            const currentBalance = parseFloat(miningBalanceElement.innerText);
            if (currentBalance >= targetBalance) {
                await performReinvest();
            }
        }
    };
    watchBalanceAndReinvest();
    setInterval(async () => {
        window.location.reload()
    }, 60000 * check_interval);
})();