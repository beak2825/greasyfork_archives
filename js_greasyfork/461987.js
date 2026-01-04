// ==UserScript==
// @name        mathsisfun.com - Remove ads
// @description Hide ads on mathsisfun.com and mathopolis.com
// @namespace   griffi-gh
// @match       *://www.mathsisfun.com/*
// @match       *://www.mathopolis.com/*
// @match       *://mathsisfun.com/*
// @match       *://mathopolis.com/*
// @grant       GM_addStyle
// @version     1.0
// @license     MIT
// @author      griffi-gh
// @description 17.03.2023, 01:12:25
// @downloadURL https://update.greasyfork.org/scripts/461987/mathsisfuncom%20-%20Remove%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/461987/mathsisfuncom%20-%20Remove%20ads.meta.js
// ==/UserScript==

if (window.adsHide) adsHide();
if (window.hideads) hideads();
GM_addStyle(`
  #adsShow1, #showads1 {
    display:none !important;
  }
`);
