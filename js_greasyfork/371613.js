// ==UserScript==
// @name        incels.me remove header icon
// @namespace   english
// @description incels.me remove header icon2
// @include     http*://*incels.me*
// @version     1.3
// @run-at document-end
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/371613/incelsme%20remove%20header%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/371613/incelsme%20remove%20header%20icon.meta.js
// ==/UserScript==

// Main - Collapse the Greasy Fork Header

var style = document.createElement('style');
style.type = 'text/css';

style.innerHTML = '       .p-header-logo {         display: none;}   img, body img, html img, body div img{width:15px !important;height:auto !important;} div{background-size: 22px !important;}  .sp_N1ER1bkS1OC{filter:sepia(100%);}       ';

document.getElementsByTagName('head')[0].appendChild(style);
