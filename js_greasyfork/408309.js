// ==UserScript==
// @name         Washington Post Paywall Bypass
// @namespace    https://greasyfork.org/users/673609
// @version      0.9.9.2
// @description  Bypass Washington Post paywall.
// @match        https://www.washingtonpost.com/*
// @grant        none
// @run-at       document-start
// @license      magnet:?xt=urn:btih:1f739d935676111cfff4b4693e3816e664797050&dn=gpl-3.0.txt GPL-v3-or-Later
// @downloadURL https://update.greasyfork.org/scripts/408309/Washington%20Post%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/408309/Washington%20Post%20Paywall%20Bypass.meta.js
// ==/UserScript==



(function () {
  'use strict';
  
  window.addEventListener ('beforescriptexecute', function (e) {
    if (e.target.src.match (/pwapi-proxy.min.js/) || e.target.src.match (/wp-ad.min.js/)) {
      e.preventDefault ();
      e.stopPropagation ();
    }
  }, true);

  let s = document.createElement ("style");
  s.innerHTML = `
  [aria-label="Sections Navigation"] > div:nth-of-type(1),
  [aria-label="Sections Navigation"] > div:nth-of-type(2),
  .content_gate,
  [data-chain-name="subscription-promo-chain"],
  [data-qa="article-body-ad"],
  [data-qa="subscribe-promo"],
  [data-qa="subs-offer"],
  .ent-ad-container,
  .gift-offer,
  #leaderboard-wrapper,
  #nav-gift,
  #nav-subscribe,
  .paywall-overlay,
  #subscribe-left-nav,
  wp-ad {
    display: none !important;
  }`;
 
  document.addEventListener('DOMContentLoaded', (event)=> {
    document.body.appendChild (s);

    document.querySelectorAll ('img.unprocessed[data-hi-res-src]').forEach(el=> {
      el.src = el.attributes['data-hi-res-src'].value;
    });
  });

}) ();