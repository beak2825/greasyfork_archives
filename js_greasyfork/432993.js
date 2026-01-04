// ==UserScript==
// @name         Bloomberg paywall
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  remove paywall
// @author       You
// @match        https://www.bloomberg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432993/Bloomberg%20paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/432993/Bloomberg%20paywall.meta.js
// ==/UserScript==

(function() {
    'use strict';

    asyncCall();
})();


async function asyncCall() {
  await resolveEvery2Seconds();
}

function resolveEvery2Seconds() {
  return new Promise(() =>
    window.setInterval(() => removePaywall(), 2500));
}


function removePaywall() {
  const payElement = document.querySelectorAll("[class^=overlay__]");
  if (payElement.length > 0) {
    payElement.forEach(x => x.className = '');
    document.body.style.overflow = 'auto';
  }
  const pay2 = document.getElementById('fortress-paywall-container-root');
  if (!!pay2) { pay2.remove(); document.body.style.overflow = 'auto'; }

  // const overflowbody[data-paywall-overlay-status="show"] {
  //  overflow: hidden;

  // }
}
