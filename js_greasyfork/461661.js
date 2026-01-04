// ==UserScript==
// @name        Sorry, marketscreener.com
// @namespace   Violentmonkey Scripts
// @match       https://www.marketscreener.com/*
// @grant       GM_addStyle
// @version     1.1
// @license     MIT 
// @description 12/03/2023, 12:55:38 pm
// @downloadURL https://update.greasyfork.org/scripts/461661/Sorry%2C%20marketscreenercom.user.js
// @updateURL https://update.greasyfork.org/scripts/461661/Sorry%2C%20marketscreenercom.meta.js
// ==/UserScript==
GM_addStyle(
  `
  #modal-portal, .modal_backdrop { display: none !important; }
  `
);
