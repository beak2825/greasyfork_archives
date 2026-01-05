// ==UserScript==
// @name        Kongregate Ad Bypass
// @namespace   _GK_GM_KongAdBypass
// @author      GoldenKyBd
// @description Bypasses Kongregate Ads
// @include     http://www.kongregate.com/games/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12014/Kongregate%20Ad%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/12014/Kongregate%20Ad%20Bypass.meta.js
// ==/UserScript==

do {
  console.log("Trying to close Ad.");
  bumper.closeAd(true);
} while(!bumper._closed);