// ==UserScript==
// @name         NOW 18 Free faucets all in one script!
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  CLaim Free Shib, BTC, Cardano, Steam, Tether, USDC, USDT, Nem, binance, Ethereum, XRP, Tron, Dash, Chain, Neo, LTC, pancake, matic, and Doge Faucets all in one script!
// @author       Elmer76
// @license      MIT
// @match        https://freepancake.com/*
// @match        https://freematic.com/*
// @match        https://freeshibainu.com/*
// @match        https://freebitcoin.io/*
// @match        https://freecardano.com/*
// @match        https://freesteam.io/*
// @match        https://freetether.com/*
// @match        https://freeusdcoin.com/*
// @match        https://coinfaucet.io/*
// @match        https://freenem.com/*
// @match        https://freebinancecoin.com/*
// @match        https://freeethereum.com/*
// @match        https://free-tron.com/*
// @match        https://freedash.io/*
// @match        https://freechainlink.io/*
// @match        https://freeneo.io/*
// @match        https://free-ltc.com/*
// @match        https://free-doge.com/*
// @icon         https://www.google.com/s2/favicons?domain=freeshibainu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441466/NOW%2018%20Free%20faucets%20all%20in%20one%20script%21.user.js
// @updateURL https://update.greasyfork.org/scripts/441466/NOW%2018%20Free%20faucets%20all%20in%20one%20script%21.meta.js
// ==/UserScript==
/*
==================================================================================================================================================                                                                                                                                              |
|         donate please  btc : 36v6NbQCeDp1LHDtpJgoBMq7u3J5zWipDW                                                                                |
|                                                                                                                                                |
|         Please use my referal link      https://freecardano.com/?ref=436322                                                                    |
|                                         https://freebitcoin.io/?ref=635397                                                                     |
|                                         https://freesteam.io/?ref=151488                                                                       |
|                                         https://freetether.com/?ref=254231                                                                     |
|                                         https://freeusdcoin.com/?ref=184874                                                                    |
|                                         https://freeshibainu.com/?ref=69021                                                                    |
|                                         https://coinfaucet.io/?ref=904491                                                                      |
|                                         https://freenem.com/?ref=333717                                                                        |
|                                         https://freebinancecoin.com/?ref=303024                                                                |
|                                         https://freeethereum.com/?ref=321852                                                                   |
|                                         https://free-tron.com/?ref=377368                                                                      |
|                                         https://freedash.io/?ref=189307                                                                        |
|                                         https://freechainlink.io/?ref=116426                                                                   |
|                                         https://freeneo.io/?ref=144629                                                                         |
|                                         https://free-ltc.com/?ref=198898                                                                       |
|                                         https://free-doge.com/?ref=234988                                                                      |
|                                         https://freepancake.com/?ref=19935                                                                     | 
|                                         https://freematic.com/?ref=21911                                                                       |
|                                                                       TY and enjoy                                                             |
==================================================================================================================================================
*/
// Install the Hcaptcha Solver to solve Recaptcha: https://greasyfork.org/es/scripts/425854-hcaptcha-solver-automatically-solves-hcaptcha-in-browser
setTimeout(function() {
    'use strict';

    console.log(document.querySelector("div[class='roll-wrapper']").style.display !== 'none');

    if (document.querySelector("div[class='roll-wrapper']").style.display !== "none") {
        //document.querySelector("body > main > div > div > div > div > div > div.roll-wrapper > button").click();
        document.querySelector("button[class='main-button-2 roll-button bg-2']").click()
    }

    setTimeout(function(){ location.reload(); }, 10*60*1000);

},2000);