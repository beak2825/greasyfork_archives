// ==UserScript==
// @name        KY @ Hide TradingView Ads
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @namespace   HideTradingViewAds
// @description Hide all TradingView Ads
// @author      kboudy - Edited by KY
// @include     https://tradingview.com/*
// @include     https://www.tradingview.com/*
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/480369/KY%20%40%20Hide%20TradingView%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/480369/KY%20%40%20Hide%20TradingView%20Ads.meta.js
// ==/UserScript==

const hideAds = setInterval(() => {
// 1st ad wrapper
  const adWrapper = $("div[class^='toast-positioning-wrapper-']")[0];
    if (adWrapper)
  {
      adWrapper.style.display = "none";
//cannot use remove as it will keep on poping out new ads//
//      adWrapper.remove();
//      console.log('1st Ad Removed.');
  }
//    else{console.log('No 1st Ad present.');}
// 1st ad wrapper
// 2nd ad wrapper
    const adWrapper1 = $("div[class^='toast-positioning-wrapper-']")[1];
    if (adWrapper)
  {
      adWrapper1.style.display = "none";
//cannot use remove as it will keep on poping out new ads//
//      adWrapper.remove();
//      console.log('2nd Ad Removed.');

  }

//# GOPRO Notification
    const adWrapper2 = $("div[data-dialog-name^='gopro']")[0];
        if (adWrapper2)
  {
//      adWrapper2.style.display = "none";

      $(function(){
          document.getElementsByClassName("close-icon-3unB1Yrw")[0].click();
      });

  }
//# END of GOPRO

//const hideAds2 = setInterval(() => {
//# GOPRO Notification
//    const adWrapper2 = $("div[id^='overlap-manager-root']")[0];
//        if (adWrapper2)
//  {
//      adWrapper2.style.display = "none";
//  }
}, 100);