// ==UserScript==
// @name        hydrogen key bypass
// @namespace   Violentmonkey Scripts
// @match       https://gateway.platoboost.com/a/2569*
// @match       *://linkvertise.com/*
// @grant       none
// @version     1.2
// @license MIT
// @author      dindin
// @description 2/16/2024, 11:20:26 AM
// @downloadURL https://update.greasyfork.org/scripts/487471/hydrogen%20key%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/487471/hydrogen%20key%20bypass.meta.js
// ==/UserScript==
//temp down
//(function() {
//  'use strict';
//  const currentURL = window.location.href;
//  if (currentURL.includes("linkvertise.")) {
//    const bypassServerUrl = 'https://bypass.pm/bypass2?url=' + encodeURIComponent(window.location.href);
//    async function bypassLinkvertise() {
//      const response = await fetch(bypassServerUrl);
//      const data = await response.json();
//      const link = data.destination;
//      window.location.href = link;
//    }
//
//    bypassLinkvertise();
//  }
//})();