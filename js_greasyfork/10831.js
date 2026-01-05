// ==UserScript==
// @name         LA Times, Paywall Removal
// @namespace    http://null
// @version      1.3
// @description  Disables paywall and renables scrolling
// @author       Grant Bacon (@grantbacon)
// @match        *://*.latimes.com/*
// @match        *://www.chicagotribune.com/*
// @match        *://www.baltimoresun.com/*
// @match        *://www.capitalgazette.com/*
// @match        *://www.carrollcountytimes.com/*
// @match        *://www.dailypress.com/*
// @match        *://www.courant.com/*
// @match        *://www.mcall.com/*
// @match        *://www.orlandosentinel.com/*
// @match        *://www.sun-sentinel.com/*
// @match        *://www.dailypress.com/*
// @match        *://www.vagazette.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/10831/LA%20Times%2C%20Paywall%20Removal.user.js
// @updateURL https://update.greasyfork.org/scripts/10831/LA%20Times%2C%20Paywall%20Removal.meta.js
// ==/UserScript==


/* 
 * Conveniently enough, the paywall vendor left us a thaw method to unfreeze the page. It is called when the page finishes loading in full.
 *
 * The same can be done by typing "trb.registration.utils.page.thaw();" in your browser console.
 * Or by visiting "javascript:trb.registration.utils.page.thaw();" as a web address while viewing the page.
 *
 * Special thanks to "o" in the Feedback section for pointing out that this script works with other sites
 */

window.onload = (event) => {
    trb.registration.utils.page.thaw();
};