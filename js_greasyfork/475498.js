// ==UserScript==
// @name        Disable Interstitial Ads JASMR.net
// @match       *://*.jasmr.net/*
// @grant       none
// @version     1.2
// @author      -
// @description Disables interstitial ads on JASMR.net
// @run-at      document-idle
// @namespace https://greasyfork.org/users/748416
// @downloadURL https://update.greasyfork.org/scripts/475498/Disable%20Interstitial%20Ads%20JASMRnet.user.js
// @updateURL https://update.greasyfork.org/scripts/475498/Disable%20Interstitial%20Ads%20JASMRnet.meta.js
// ==/UserScript==

setTimeout(() => {
  document.cookie = "interstitial=yes";
}, 2500);

setTimeout(() => {
  document.querySelector(".interstitial-skip-button").click()
}, 100);
