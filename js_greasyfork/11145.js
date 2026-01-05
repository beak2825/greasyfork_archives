// ==UserScript==
// @name        HS.fi Paywall Bypass
// @description Bypasses HS.fi news site's paywall 
// @include     http://www.hs.fi/*
// @grant       none
// @version     1.0
// @namespace Lol-z
// @downloadURL https://update.greasyfork.org/scripts/11145/HSfi%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/11145/HSfi%20Paywall%20Bypass.meta.js
// ==/UserScript==
(function () {
  // Prevents script to run more than once 
  if (window.top != window.self) {
    return;
  }
  
  window.addEventListener('load', function () {
   $(document.body).removeClass('paywall paywall-counter paywall-full');
  }, false);  
}) ();