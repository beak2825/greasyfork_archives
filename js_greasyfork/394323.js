// ==UserScript==
// @name         Sorry, intelinvest.ru
// @description  Hide popup, remove blur from intelinvest.ru
// @namespace    intelinvest.ru
// @include      https://intelinvest.ru/app/*
// @grant        GM_addStyle
// @run-at       document-start
// @version      1.002
// @downloadURL https://update.greasyfork.org/scripts/394323/Sorry%2C%20intelinvestru.user.js
// @updateURL https://update.greasyfork.org/scripts/394323/Sorry%2C%20intelinvestru.meta.js
// ==/UserScript==

GM_addStyle(`
  .blur { filter: none !important; }
  .v-overlay.v-overlay--active.v-overlay--active { display: none }
  .v-dialog__content.v-dialog__content--active { display: none }
  .custom-v-menu { display: none !important }
`);