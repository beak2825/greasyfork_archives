// ==UserScript==
// @name Free multicrypto Auto Faucet. FREE CRYPTO EVERY HOUR!!!!
// @description Auto Faucet Script. Get free STEAM TETHER USD coin BINANCE coin NEO DASH BITCOIN NEM CARDANO ETHEREUM LITECOIN RIPPLE TRON CHAINLINK DOGE coin EVERY HOUR!!!!!
// @author Butterlvr6
// @version 4
// @namespace hi
// @match https://app.freesteam.io/free
// @match https://app.freetether.com/free
// @match https://app.freeusdcoin.com/free
// @match https://app.freebinancecoin.com/free
// @match https://app.freeneo.io/free
// @match https://app.freedash.io/free
// @match https://app.freebitcoin.io/free
// @match https://app.freenem.com/free
// @match https://app.freecardano.com/free
// @match https://app.freeethereum.com/free
// @match https://app.free-ltc.com/free
// @match https://app.coinfaucet.io/free
// @match https://app.free-tron.com/free
// @match https://app.freechainlink.io/free
// @match https://app.free-doge.com/free
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/421576/Free%20multicrypto%20Auto%20Faucet%20FREE%20CRYPTO%20EVERY%20HOUR%21%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/421576/Free%20multicrypto%20Auto%20Faucet%20FREE%20CRYPTO%20EVERY%20HOUR%21%21%21%21.meta.js
// ==/UserScript==


setTimeout(function() {
    'use strict';
    console.log(document.evaluate("/html/body/div[1]/div/div/main/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[2]/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.display !== 'none');

    if (document.evaluate("/html/body/div[1]/div/div/main/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[2]/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.display !== "none") {
        document.evaluate("/html/body/div[1]/div/div/main/div/div[1]/div[1]/div[2]/div/div/div/div/div/div[2]/button", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click()
    }
    //every 10 minutes the page will be refreshed to check if you can roll again
    setTimeout(function(){ location.reload(); }, 10*60*1000);

}, 2000);