// ==UserScript==
// @name        hide lookIntoBitcoin subscribe dialog
// @namespace   lookintobitcoin_kboudy
// @description hides lookIntoBitcoin subscribe dialog
// @include     https://www.lookintobitcoin.com/*
// @include     https://www.lokintobitcoin.com
// @version     1.5
// @run-at      document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/402885/hide%20lookIntoBitcoin%20subscribe%20dialog.user.js
// @updateURL https://update.greasyfork.org/scripts/402885/hide%20lookIntoBitcoin%20subscribe%20dialog.meta.js
// ==/UserScript==

GM_addStyle(`#subscribe_box { display: none !important; }`);
GM_addStyle(`#support { display: none !important; }`);
