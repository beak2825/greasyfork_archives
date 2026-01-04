// ==UserScript==
// @name        TradingView close ads
// @namespace   Violentmonkey Scripts
// @match       https://www.tradingview.com/chart/*
// @grant       none
// @version     1.0
// @author      tilr
// @description Auto close ads from tradingview as of 10/2024
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/511891/TradingView%20close%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/511891/TradingView%20close%20ads.meta.js
// ==/UserScript==

setInterval(() => {
    const closeBtn = document.querySelector( 'button[class*="closeButton"]' )
    if (closeBtn) {
      closeBtn.click()
    }
  }, 250);