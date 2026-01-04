// ==UserScript==
// @name        Hide TradingView Ads
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   HideTradingViewAds
// @description Hide all TradingView Ads
// @author      kboudy
// @include     https://tradingview.com/*
// @include     https://www.tradingview.com/*
// @version     2.5
// @downloadURL https://update.greasyfork.org/scripts/405080/Hide%20TradingView%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/405080/Hide%20TradingView%20Ads.meta.js
// ==/UserScript==

const hideAds = setInterval(() => {
  const adWrapper = document.querySelector("div[class^='toast-positioning-wrapper-']");
  if (adWrapper)
  {
      adWrapper.querySelector("button").click();
  }

  const adDialog = document.querySelector("div[data-dialog-name='gopro']");
  if (adDialog)
  {
      adDialog.querySelector("button").click();
  }
}, 10);


