// ==UserScript==
// @name        TradingView close ads laz
// @namespace   Violentmonkey Scripts
// @match       https://*.tradingview.com/chart/*
// @grant       none
// @version     1.0.2
// @author      tilr
// @description Auto close ads from tradingview as of 10/2024
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/513135/TradingView%20close%20ads%20laz.user.js
// @updateURL https://update.greasyfork.org/scripts/513135/TradingView%20close%20ads%20laz.meta.js
// ==/UserScript==
     
    setInterval(() => {
        const closeBtn = document.querySelector( 'button[class*="closeButton"]' );
        if (closeBtn) {
          closeBtn.click();
          console.log('ad removido');
        }
      }, 250);

