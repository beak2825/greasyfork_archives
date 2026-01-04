// ==UserScript==
// @name        Fuck TradingView Ads off
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   FuckTradingViewAdsoff
// @description Fuck all TradingView Ads off instanly
// @author      Ondrej Dadok
// @include     https://tradingview.com/*
// @include     https://www.tradingview.com/*
// @license     MIT
// @version     1.5
// @downloadURL https://update.greasyfork.org/scripts/437109/Fuck%20TradingView%20Ads%20off.user.js
// @updateURL https://update.greasyfork.org/scripts/437109/Fuck%20TradingView%20Ads%20off.meta.js
// ==/UserScript==

  const checkAd = setInterval(() => {

    const adBox = document.getElementById('tv-toasts');
    if (adBox) {
      adBox.querySelector("button").click();
      adBox.remove();
      console.log('ad removed.');
    } else {
      console.log('no ad present.');
    }


    const adBox2 = document.querySelector('div[class^="toast-wrapper-"]');
    if (adBox2) {
      adBox2.querySelector("button").click();
      adBox2.remove();
      console.log('ad removed.');
    } else {
      console.log('no ad present.');
    }


      const adunit = document.getElementById('adunit');
    if (adunit) {

      adunit.querySelector("button").click();
      adunit.remove();
      console.log('ad removed.');
    } else {
      console.log('no ad present.');
    }

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


  }, 5000);
