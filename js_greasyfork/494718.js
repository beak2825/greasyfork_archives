// ==UserScript==
// @name          Tradingview: remove blue border for the charts
// @description   Remove blue border for the charts in Tradingview
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?domain=tradingview.com&sz=64
// @version       1.0.0
// @match         https://www.tradingview.com/
// @match         https://www.tradingview.com/*
// @run-at        document-body
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/494718/Tradingview%3A%20remove%20blue%20border%20for%20the%20charts.user.js
// @updateURL https://update.greasyfork.org/scripts/494718/Tradingview%3A%20remove%20blue%20border%20for%20the%20charts.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

(function() {
  'use strict';

  GM_addStyle([`
    div.chart-container:after {
      border: none !important;
    }
  `][0]);
})();
