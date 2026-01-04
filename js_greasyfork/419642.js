// ==UserScript==
// @name         Binance - Add BTC to USD Conversion
// @namespace    https://zachhardesty.coms
// @author       Zach Hardesty <zachhardesty7@users.noreply.github.com> (https://github.com/zachhardesty7)
// @description  rough conversion to get USD val of coin on "balance" & "deposits/withdrawals" page
// @copyright    2019-2024, Zach Hardesty (https://zachhardesty.com/)
// @license      GPL-3.0-only; http://www.gnu.org/licenses/gpl-3.0.txt
// @version      1.3.4

// @homepageURL  https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/binance-btc-usd.user.js
// @homepage     https://github.com/zachhardesty7/tamper-monkey-scripts-collection/raw/master/binance-btc-usd.user.js
// @homepageURL  https://openuserjs.org/scripts/zachhardesty7/Binance_-_Add_BTC_to_USD_Conversion
// @homepage     https://openuserjs.org/scripts/zachhardesty7/Binance_-_Add_BTC_to_USD_Conversion
// @supportURL   https://github.com/zachhardesty7/tamper-monkey-scripts-collection/issues


// @match        https://www.binance.com/userCenter/balances/*
// @match        https://www.binance.com/userCenter/depositWithdraw/*
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @downloadURL https://update.greasyfork.org/scripts/419642/Binance%20-%20Add%20BTC%20to%20USD%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/419642/Binance%20-%20Add%20BTC%20to%20USD%20Conversion.meta.js
// ==/UserScript==

/* global onElementReady */

function convertBTCToUSD() {
  fetch("https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD")
    .then((resp) => resp.json())
    .then((data) => {
      // if el are loaded then add USD value below BTC val
      onElementReady(".td.ng-scope", { findOnce: false }, (e) =>
        addBTCConversionRate(e, data.BTC.USD),
      )

      return null
    })
    .catch((error) => {
      console.error(error)
    })
}

/**
 * runs on the addition of each ticker and adds rough dollar conversion using stored
 * global data below BTC value
 *
 * @param {HTMLElement} el - node of most recently added ticker
 * @param {number} BTCUSD - literal value
 */
function addBTCConversionRate(el, BTCUSD) {
  const BTCElement = el.firstElementChild.children[5]

  if (BTCElement.textContent !== "0") {
    // convert to pretty USD format
    const USDVal = (Number.parseFloat(BTCElement.textContent) * BTCUSD)
      .toFixed(2)
      .replaceAll(/(\d)(?=(\d{3})+\.)/g, "$1,")
    const USDValElem = document.createElement("p")

    USDValElem.textContent = `≈ ${USDVal} USD`
    USDValElem.setAttribute("style", "color: #a0a0a0")
    BTCElement.append(USDValElem)
  }
}

convertBTCToUSD()
