// ==UserScript==
// @name        Keepa for Amazon Mobile
// @namespace   https://p1kachu.net
// @description Insert Keepa chart into Amazon mobile. Tested on Adguard for Android.
// @author      pikatenor
// @version     0.1.0
// @supportURL  https://github.com/pikatenor/keepa-mobile
// @include     https://www.amazon.tld/dp/*
// @include     https://www.amazon.tld/*/dp/*
// @include     https://www.amazon.tld/gp/product/*
// @include     https://www.amazon.tld/gp/aw/d/*
// @include     https://www.amazon.*/dp/*
// @include     https://www.amazon.*/*/dp/*
// @include     https://www.amazon.*/gp/product/*
// @include     https://www.amazon.*/gp/aw/d/*
// @grant       GM_info
// @downloadURL https://update.greasyfork.org/scripts/438967/Keepa%20for%20Amazon%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/438967/Keepa%20for%20Amazon%20Mobile.meta.js
// ==/UserScript==

(function(){

  const domainIdMap = {
    'com':   1,
    'uk':    2,
    'de':    3,
    'fr':    4,
    'co.jp': 5,
    'ca':    6,
    'in':    10,
  }

  const isMobile = document.documentElement.classList.contains('a-mobile');
  const asin = document.getElementById('a')?.value || document.getElementById('twister-plus-asin')?.value; // #a ってマジかよ
  const domainId = domainIdMap[document.location.hostname.match('.*\.amazon\.(.*)$')[1]];
  const targetElement = document.getElementById('olpLinkWidget_feature_div');

  if (isMobile && asin && domainId && targetElement) {
    targetElement.insertAdjacentHTML(
      'afterend',
      `<a href="https://keepa.com/#!product/${domainId}-${asin}"><img style="width:100%; height:100%; margin-bottom:0.5em;" src="https://graph.keepa.com/pricehistory.png?type=2&width=658&height=450&amazon=1&new=1&used=1&salesrank=1&range=365&fba=0&fbm=0&bb=0&ld=1&wd=1&asin=${asin}&domain=${domainId}" id="keepa"></a>`
    );
  }

})();
