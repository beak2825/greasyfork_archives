// ==UserScript==
// @name         Glassdoor Paywall Zapper Fixed
// @namespace    Glassdoor Paywall Zapper Fixed
// @version      0.1
// @description  Remove paywall & restore scroll functionality on Glassdoor and repeat a few times.
// @author       asheroto
// @license      MIT
// @match        https://*.glassdoor.com/*
// @icon         https://www.glassdoor.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432317/Glassdoor%20Paywall%20Zapper%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/432317/Glassdoor%20Paywall%20Zapper%20Fixed.meta.js
// ==/UserScript==

// ==OpenUserScript==
// @author          asheroto
// ==/OpenUserScript==

/* jshint esversion: 6 */

function tryHide(qs) {
  try {
    document.querySelector(qs).style.display = 'none';
  }
  catch (e) {}
  return true;
}

function tryShow(qs) {
  try {
    document.querySelector(qs).setAttribute("style", "display:block!important");
  }
  catch (e) {

  }
}

function removePaywall() {
  tryHide("#ContentWallHardsell");
  tryHide(".hardsellOverlay");
  tryHide("#HardsellOverlay");
  tryShow("#SmarterBannerContainer");
  tryShow("#EmpLinksWrapper");
  document.body.style.overflow = 'auto';
}

window.addEventListener('scroll', e => e.stopPropagation(), true);

// Run every 0.5 seconds
let intv = 500;
let go = setInterval(removePaywall, intv);

// Clear after 5 seconds
let intvEnd = 5000;
setTimeout(function () {
  clearInterval(go);
}, intvEnd);
