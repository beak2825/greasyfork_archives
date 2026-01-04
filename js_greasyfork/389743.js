// ==UserScript==
// @name        Auto refresh CoinMarketCap every minutes
// @namespace   http://tampermonkey.net/
// @description Automatically refresh https://coinmarketcap.com/ every minutes
// @match       https://coinmarketcap.com/
// @author      Nobakab
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/389743/Auto%20refresh%20CoinMarketCap%20every%20minutes.user.js
// @updateURL https://update.greasyfork.org/scripts/389743/Auto%20refresh%20CoinMarketCap%20every%20minutes.meta.js
// ==/UserScript==

function changePage()
{
  //window.location = "https://coinmarketcap.com/";
  window.location.reload();
}

var numberOfMSToWait = 60000;
//setTimeout(changePage(), numberOfMSToWait);
setTimeout(function(){ location.reload(); }, numberOfMSToWait);