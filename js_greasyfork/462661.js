// ==UserScript==
// @name         Jays Chad Strat Rules
// @version      0.1
// @description  Never ever forget these rules!
// @namespace    haffel.li
// @author       Haffel
// @match        https://www.bybit.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462661/Jays%20Chad%20Strat%20Rules.user.js
// @updateURL https://update.greasyfork.org/scripts/462661/Jays%20Chad%20Strat%20Rules.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForElm('.oc-main__order-type').then((elm) => {
        let chooseMode = document.getElementsByClassName('oc-main__order-type')[0];
        let strategyRulesDiv = document.createElement('div');
        strategyRulesDiv.id = 'strategy-rules';
        strategyRulesDiv.innerHTML = '<br><p><strong><span style="color: rgb(41, 105, 176); font-size: 18px;">Strategy Rules:</span></strong></p><br><p><span style="color: rgb(251, 160, 38); font-size: 15px;">5/3 Minute timeframe, 10x Leverage</span></p><span style="font-size: 15px;"><br></span><p><span style="color: rgb(184, 49, 47); font-size: 15px;"><strong>Short:</strong></span></p><p><span style="font-size: 15px; color: rgb(251, 160, 38);">- </span><span style="color: rgb(251, 160, 38); font-size: 15px;">Price above VWAP</span></p><p><span style="color: rgb(251, 160, 38); font-size: 15px;">-&nbsp;MIF above 75</span></p><p><span style="color: rgb(251, 160, 38); font-size: 15px;">- Only at first red candle after green</span></p><p><span style="color: rgb(251, 160, 38); font-size: 15px;">- SL above last candle high</span></p><span style="font-size: 15px;"><br></span><p><span style="font-size: 15px;"><strong><span style="color: rgb(0, 168, 133);">Long:</span></strong></span></p><p><span style="font-size: 15px; color: rgb(251, 160, 38);">- </span><span style="color: rgb(251, 160, 38); font-size: 15px;">Price below VWAP</span></p><p><span style="color: rgb(251, 160, 38); font-size: 15px;">- MIF below 25</span></p><p><span style="color: rgb(251, 160, 38); font-size: 15px;">- Only at first green candle after red</span></p><p><span style="color: rgb(251, 160, 38); font-size: 15px;">- SL below last candle low</span></p><br>';
        chooseMode.after(strategyRulesDiv);
    });
})();


function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}