// ==UserScript==
// @name         app.free roll script
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  CLaim Free Shib, BTC, Cardano, Steam, Tether, USDC, USDT, Nem, binance, Ethereum, XRP, Tron, Dash, Chain, Neo, LTC, pancake, matic, and Doge Faucets all in one script!
// @author       kkr
// @license      MITapperican
// @match        https://app.freepancake.com/*
// @match        https://app.freematic.com/*
// @match        https://app.freeshibainu.com/*
// @match        https://app.freebitcoin.io/*
// @match        https://app.freecardano.com/*
// @match        https://app.freesteam.io/*
// @match        https://app.freetether.com/*
// @match        https://app.freeusdcoin.com/*
// @match        https://app.coinfaucet.io/*
// @match        https://app.freenem.com/*
// @match        https://app.freebinancecoin.com/*
// @match        https://app.freeethereum.com/*
// @match        https://app.free-tron.com/*
// @match        https://app.freedash.io/*
// @match        https://app.freechainlink.io/*
// @match        https://app.freeneo.io/*
// @match        https://app.free-ltc.com/*
// @match        https://app.free-doge.com/*
// @icon         https://app.www.google.com/s2/favicons?domain=freeshibainu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482797/appfree%20roll%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/482797/appfree%20roll%20script.meta.js
// ==/UserScript==
/* wants donate buy me coffee btc : 1GnU6qdNLyveQ7pFCJkCjxCjj1BSgAFENA                                                                    |
https://freeethereum.com/?ref=403216
https://freebitcoin.io/?ref=542478
https://freecardano.com/?ref=482754
https://freedash.io/?ref=229255
https://free-doge.com/?ref=308339
https://freesteam.io/?ref=164760
https://freebitco.in/?r=50192538
*/
// Install the Hcaptcha Solver to solve Hcaptcha: hektcaptcha, hcaptcha extension with free github api 1 mb download
(function() {
    'use strict';
    window.alert = function() {};
    const claimInterval = 5000;
    /*console.log(document.querySelector("div[class='flex justify-center']").innerText === 'ROLL! (1)');*/

    function claimRewards() {
        if (document.querySelector("div[class='flex justify-center']").innerText == 'ROLL! (1)') {
        document.querySelector('[aria-label="ROLL! (1)"]').click();
        }
    }
    function startAutoRoll() {
        setInterval(2000);
        setInterval(claimRewards, claimInterval);
    }
    window.addEventListener('load', startAutoRoll);
})();